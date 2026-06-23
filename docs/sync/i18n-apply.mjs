#!/usr/bin/env node
/*
 * i18n-apply.mjs — wire hardcoded strings to data-i18n keys, safely.
 *
 * Reads a curated batch file (docs/sync/i18n-batch.<name>.json): an array of
 *   { match, tag, key, en, tn, skip? }
 * where `match` is the EXACT (whitespace-normalised) text currently in the markup
 * (it may be mangled Chinese/English), `key` is the new translation key, and
 * `en`/`tn` are the clean English / Setswana values.
 *
 * For each non-skip entry it:
 *   1. Injects ` data-i18n="key"` into the matching leaf element in public/desktop.html
 *      (only if that element does not already have data-i18n).
 *   2. Adds `key=en`  to public/lang/lang/lang_en.properties and lang_en-US.properties
 *      and `key=tn` to lang_tn.properties — only if the key is not already present.
 *
 * Chinese files are left untouched: a missing key is a no-op at runtime
 * (applyTranslations only replaces when a value exists), so zh behaviour is unchanged.
 *
 * Idempotent. Run: node docs/sync/i18n-apply.mjs <batchName>
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const WIP = resolve(here, '..', '..');
const name = process.argv[2];
if (!name) { console.error('Usage: node docs/sync/i18n-apply.mjs <batchName>'); process.exit(1); }

const batchFile = JSON.parse(readFileSync(join(here, `i18n-batch.${name}.json`), 'utf8'));
// batch file may be a bare array, or { window, entries }
const batch = Array.isArray(batchFile) ? batchFile : batchFile.entries;
const scopeWindow = Array.isArray(batchFile) ? null : batchFile.window;
const HTML = join(WIP, 'public', 'desktop.html');
const LANG = join(WIP, 'public', 'lang', 'lang');
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// entity-tolerant text pattern
function textPattern(t) {
  return reEsc(t)
    .replace(/&/g, '(?:&|&amp;)')
    .replace(/'/g, "(?:'|&#39;|&apos;)")
    .replace(/"/g, '(?:"|&quot;)');
}

let html = readFileSync(HTML, 'utf8');
const result = { injected: 0, alreadyKeyed: 0, notFound: [], skipped: 0 };

// Restrict edits to the target window's markup slice (generic words like "Apps"
// appear elsewhere, so we must not touch the whole document).
let lo = 0, hi = html.length;
if (scopeWindow) {
  const startRe = new RegExp('class="window\\s+' + reEsc(scopeWindow) + '\\b');
  const sm = startRe.exec(html);
  if (!sm) { console.error(`Could not find window block: .window.${scopeWindow}`); process.exit(1); }
  lo = sm.index;
  const nextRe = /class="window\s+[a-zA-Z]/g;
  nextRe.lastIndex = lo + 1;
  const nm = nextRe.exec(html);
  hi = nm ? nm.index : html.length;
}
let head = html.slice(0, lo), mid = html.slice(lo, hi), tail = html.slice(hi);

for (const e of batch) {
  if (e.skip) { result.skipped++; continue; }
  const tag = e.tag || '[a-zA-Z][a-zA-Z0-9]*';
  const re = new RegExp(
    '(<(' + tag + ')\\b(?![^>]*data-i18n)[^>]*?)(>\\s*)(' + textPattern(e.match) + ')(\\s*</\\2>)',
    'g'
  );
  let hit = 0;
  mid = mid.replace(re, (m, open, t, gt, text, close) => {
    hit++;
    return `${open} data-i18n="${e.key}"${gt}${text}${close}`;
  });
  if (hit === 0) {
    if (new RegExp('data-i18n="' + reEsc(e.key) + '"').test(mid)) result.alreadyKeyed++;
    else result.notFound.push(e.match.slice(0, 30));
  } else {
    result.injected += hit;
  }
}
html = head + mid + tail;
writeFileSync(HTML, html, 'utf8');

// ---- properties ----
function addKeys(file, pairs) {
  const path = join(LANG, file);
  if (!existsSync(path)) { console.warn('missing', file); return 0; }
  let txt = readFileSync(path, 'utf8');
  const existing = new Set([...txt.matchAll(/^([^#=\s][^=]*)=/gm)].map(m => m[1].trim()));
  const add = [];
  for (const [k, v] of pairs) { if (!existing.has(k) && v != null && v !== '') add.push(`${k}=${v}`); }
  if (add.length) {
    txt = txt.replace(/\s*$/, '\n') + `\n# ---- batch: ${name} ----\n` + add.join('\n') + '\n';
    writeFileSync(path, txt, 'utf8');
  }
  return add.length;
}
const enPairs = batch.filter(e => !e.skip && e.en).map(e => [e.key, e.en]);
const tnPairs = batch.filter(e => !e.skip && e.tn).map(e => [e.key, e.tn]);
const cEn = addKeys('lang_en.properties', enPairs);
const cEnUS = addKeys('lang_en-US.properties', enPairs);
const cTn = addKeys('lang_tn.properties', tnPairs);

console.log(`batch '${name}':`);
console.log(`  markup injected: ${result.injected}, already-keyed: ${result.alreadyKeyed}, skipped: ${result.skipped}, NOT FOUND: ${result.notFound.length}`);
if (result.notFound.length) console.log('  not found:', JSON.stringify(result.notFound, null, 0));
console.log(`  keys added -> en:${cEn} en-US:${cEnUS} tn:${cTn}`);
