#!/usr/bin/env node
/*
 * i18n-extract.mjs — find hardcoded UI strings in public/desktop.html that lack a
 * data-i18n key, grouped by app window, and write a scaffold to i18n-todo.json.
 *
 * Read-only on desktop.html (parses with jsdom; never serialises it back).
 * Run: node docs/sync/i18n-extract.mjs [windowName]
 *   e.g. node docs/sync/i18n-extract.mjs setting
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const here = dirname(fileURLToPath(import.meta.url));
const WIP = resolve(here, '..', '..');
const onlyWin = process.argv[2] || null;

const html = readFileSync(join(WIP, 'public', 'desktop.html'), 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;
const NodeFilter = dom.window.NodeFilter;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT']);
// Strings we never translate: user data, proper nouns, sample/demo content, code.
const SKIP_RE = [
  /@/,                              // emails
  /\.(pptx|xlsx|docx|jpg|png|svg|txt|js|md)$/i, // filenames
  /^[\d\s%.,:;/+\-()|<>#]+$/,       // numbers/symbols
  /^[A-Z]{2,}$/,                    // ALLCAPS codes
];

function nearestWindow(el) {
  const w = el.closest('.window');
  if (w) { const m = (w.getAttribute('class') || '').match(/window\s+([a-zA-Z0-9_-]+)/); return m ? m[1] : '?'; }
  if (el.closest('#start')) return 'start';
  if (el.closest('#loginback')) return 'login';
  if (el.closest('#taskbar')) return 'taskbar';
  if (el.closest('#desktop')) return 'desktop';
  return 'other';
}
function slug(t) {
  return t.toLowerCase().replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-').slice(0, 40);
}

const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
const seen = new Map(); // text -> entry
let node;
while ((node = walker.nextNode())) {
  const raw = node.nodeValue.replace(/\s+/g, ' ').trim();
  if (raw.length < 2) continue;
  if (SKIP_RE.some(re => re.test(raw))) continue;
  let el = node.parentElement, skip = false, keyed = false;
  while (el && el !== doc.body) {
    if (SKIP_TAGS.has(el.tagName)) { skip = true; break; }
    if (el.hasAttribute('data-i18n')) { keyed = true; break; }
    el = el.parentElement;
  }
  if (skip || keyed) continue;
  const p = node.parentElement;
  const win = nearestWindow(p);
  if (onlyWin && win !== onlyWin) continue;
  if (!seen.has(raw)) {
    seen.set(raw, { win, tag: p.tagName.toLowerCase(), key: win + '.' + slug(raw), en: raw, tn: '', zh_CN: '', zh_TW: '' });
  }
}

const out = [...seen.values()];
const byWin = {};
for (const e of out) byWin[e.win] = (byWin[e.win] || 0) + 1;
const target = join(here, onlyWin ? `i18n-todo.${onlyWin}.json` : 'i18n-todo.json');
writeFileSync(target, JSON.stringify(out, null, 2), 'utf8');
console.log(`Extracted ${out.length} strings ${onlyWin ? `for window '${onlyWin}'` : '(all windows)'}`);
console.log('By window:', JSON.stringify(byWin));
console.log('Written to', target);
