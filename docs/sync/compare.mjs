#!/usr/bin/env node
/*
 * compare.mjs — Map & compare the REFERENCE win12 project against this WIP project.
 *
 * Why this exists:
 *   This WIP repo has diverged from the upstream/reference project and uses a
 *   different folder layout (public/ + src/styles/assets vs. the reference's flat
 *   layout). When upstream pushes new content you need to know exactly which files
 *   are identical, which you have customised (and must merge by hand), and which
 *   upstream files you have not incorporated yet. A raw `diff -r` is useless across
 *   two different layouts, so this tool uses path-map.json to align them first.
 *
 * Usage:
 *   node docs/sync/compare.mjs                 # uses default reference path
 *   node docs/sync/compare.mjs --ref="D:/path/to/win12-git"
 *   WIN12_REF="D:/path/to/win12-git" node docs/sync/compare.mjs
 *   node docs/sync/compare.mjs --report=docs/sync/REPORT.md   # change output path
 *   node docs/sync/compare.mjs --full         # also list IDENTICAL files in report
 *
 * Output:
 *   - A summary printed to the console.
 *   - A full Markdown report written to docs/sync/REPORT.md (override with --report).
 *
 * Exit code is always 0 (this is a reporting tool, not a gate).
 */

import { readFileSync, existsSync, statSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const WIP_ROOT = resolve(here, '..', '..');            // docs/sync -> project root
const DEFAULT_REF = 'D:/My Software Dev/Tools/win12-git';

// ---- args -----------------------------------------------------------------
const args = {};
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  if (m) args[m[1]] = m[2] === undefined ? true : m[2];
}
const REF_ROOT = resolve(String(args.ref || process.env.WIN12_REF || DEFAULT_REF));
const REPORT_PATH = resolve(WIP_ROOT, String(args.report || 'docs/sync/REPORT.md'));
const LIST_IDENTICAL = Boolean(args.full);

// ---- config ---------------------------------------------------------------
const cfg = JSON.parse(readFileSync(join(here, 'path-map.json'), 'utf8'));
const rules = cfg.rules;
const ignore = new Set(cfg.ignore || []);

if (!existsSync(REF_ROOT)) {
  console.error(`\n[!] Reference project not found at:\n    ${REF_ROOT}\n` +
    `    Pass --ref="D:/path/to/win12-git" or set WIN12_REF.\n`);
  process.exit(0);
}

// ---- helpers --------------------------------------------------------------
const isDirRule = (r) => r.ref.endsWith('/');
const hashFile = (p) => { try { return createHash('sha1').update(readFileSync(p)).digest('hex'); } catch { return null; } };

function listFiles(root) {
  const out = [];
  (function walk(dir, rel) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (ignore.has(e.name)) continue;
      const abs = join(dir, e.name);
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(abs, r);
      else if (e.isFile()) out.push(r);
    }
  })(root, '');
  return out;
}

const CJK = /[㐀-䶿一-鿿豈-﫿]/g;
function countCJK(absPath) {
  try {
    const txt = readFileSync(absPath, 'utf8');
    const m = txt.match(CJK);
    return m ? m.length : 0;
  } catch { return 0; }
}

// ---- compare --------------------------------------------------------------
const results = []; // { cat, refRel, wipRel }
const add = (cat, refRel, wipRel) => results.push({ cat, refRel, wipRel });

// Files handled by explicit (non-dir) rules must not be re-counted by dir rules
// that happen to cover the same target folder (e.g. bg.svg has its own rule but
// also lives under the img/ -> assets/images/ dir rule).
const explicitRef = new Set(rules.filter(r => !isDirRule(r)).map(r => r.ref));
const explicitWip = new Set(rules.filter(r => !isDirRule(r)).map(r => r.wip));

for (const rule of rules) {
  if (isDirRule(rule)) {
    const refFiles = new Set(listFiles(join(REF_ROOT, rule.ref)).filter(f => !explicitRef.has(rule.ref + f)));
    const wipFiles = new Set(listFiles(join(WIP_ROOT, rule.wip)).filter(f => !explicitWip.has(rule.wip + f)));
    for (const f of new Set([...refFiles, ...wipFiles])) {
      const refRel = rule.ref + f, wipRel = rule.wip + f;
      const inRef = refFiles.has(f), inWip = wipFiles.has(f);
      if (inRef && inWip) {
        add(hashFile(join(REF_ROOT, refRel)) === hashFile(join(WIP_ROOT, wipRel)) ? 'IDENTICAL' : 'MODIFIED', refRel, wipRel);
      } else if (inRef) add('MISSING_IN_WIP', refRel, wipRel);
      else add('WIP_ONLY', refRel, wipRel);
    }
  } else {
    const refAbs = join(REF_ROOT, rule.ref), wipAbs = join(WIP_ROOT, rule.wip);
    const inRef = existsSync(refAbs) && statSync(refAbs).isFile();
    const inWip = existsSync(wipAbs) && statSync(wipAbs).isFile();
    if (inRef && inWip) add(hashFile(refAbs) === hashFile(wipAbs) ? 'IDENTICAL' : 'MODIFIED', rule.ref, rule.wip);
    else if (inRef) add('MISSING_IN_WIP', rule.ref, rule.wip);
    else if (inWip) add('WIP_ONLY', rule.ref, rule.wip);
  }
}

// ---- coverage: reference top-level entries not covered by any rule ---------
let refTop = [];
try {
  refTop = readdirSync(REF_ROOT, { withFileTypes: true })
    .filter(e => !ignore.has(e.name))
    .map(e => e.isDirectory() ? e.name + '/' : e.name);
} catch { /* ignore */ }
const uncovered = refTop.filter(n => !rules.some(r => r.ref === n));

// ---- i18n / multilingual scan (hardcoded CJK in shared source files) -------
const i18n = [];
for (const r of results) {
  if (!/\.(js|html)$/i.test(r.refRel)) continue;
  if (r.cat !== 'MODIFIED' && r.cat !== 'IDENTICAL') continue;
  const refN = countCJK(join(REF_ROOT, r.refRel));
  const wipN = countCJK(join(WIP_ROOT, r.wipRel));
  if (refN > 0 || wipN > 0) i18n.push({ refRel: r.refRel, wipRel: r.wipRel, refN, wipN });
}
i18n.sort((a, b) => b.refN - a.refN);
const i18nRefTotal = i18n.reduce((s, x) => s + x.refN, 0);
const i18nWipTotal = i18n.reduce((s, x) => s + x.wipN, 0);

// ---- counts ---------------------------------------------------------------
const counts = results.reduce((m, r) => (m[r.cat] = (m[r.cat] || 0) + 1, m), {});
const by = (cat) => results.filter(r => r.cat === cat).sort((a, b) => a.refRel.localeCompare(b.refRel));

// ---- console summary ------------------------------------------------------
const ts = new Date().toISOString();
console.log(`\nwin12 reference vs WIP comparison  (${ts})`);
console.log(`  reference : ${REF_ROOT}`);
console.log(`  wip       : ${WIP_ROOT}\n`);
console.log(`  IDENTICAL       : ${counts.IDENTICAL || 0}`);
console.log(`  MODIFIED        : ${counts.MODIFIED || 0}   (you customised — merge by hand on upstream pull)`);
console.log(`  MISSING_IN_WIP  : ${counts.MISSING_IN_WIP || 0}   (upstream has it, you don't — candidates to incorporate)`);
console.log(`  WIP_ONLY        : ${counts.WIP_ONLY || 0}   (your additions)`);
console.log(`  UNMAPPED (ref)  : ${uncovered.length}   (top-level ref entries with no rule — extend path-map.json)`);
console.log(`  i18n CJK chars  : reference ${i18nRefTotal}  vs  wip ${i18nWipTotal}  (across shared .js/.html)\n`);
console.log(`  full report -> ${REPORT_PATH}\n`);

// ---- markdown report ------------------------------------------------------
const tbl = (rows) => rows.length
  ? ['| reference | wip |', '|---|---|', ...rows.map(r => `| \`${r.refRel}\` | \`${r.wipRel}\` |`)].join('\n')
  : '_none_';

let md = '';
md += `# Reference ↔ WIP comparison report\n\n`;
md += `_Generated ${ts} by \`docs/sync/compare.mjs\`. Do not edit by hand — re-run the script._\n\n`;
md += `- **Reference:** \`${REF_ROOT}\`\n`;
md += `- **WIP:** \`${WIP_ROOT}\`\n\n`;
md += `## Summary\n\n`;
md += `| Category | Count | Meaning |\n|---|---:|---|\n`;
md += `| IDENTICAL | ${counts.IDENTICAL || 0} | byte-for-byte equal |\n`;
md += `| MODIFIED | ${counts.MODIFIED || 0} | exists in both but diverged — **merge by hand when upstream changes these** |\n`;
md += `| MISSING_IN_WIP | ${counts.MISSING_IN_WIP || 0} | upstream has it, WIP does not — **candidates to incorporate** |\n`;
md += `| WIP_ONLY | ${counts.WIP_ONLY || 0} | your additions, not in upstream |\n`;
md += `| UNMAPPED (ref top-level) | ${uncovered.length} | reference entries with no mapping rule — extend \`path-map.json\` |\n\n`;

md += `## MODIFIED — diverged files (review on every upstream pull)\n\n${tbl(by('MODIFIED'))}\n\n`;
md += `## MISSING_IN_WIP — upstream content not yet incorporated\n\n${tbl(by('MISSING_IN_WIP'))}\n\n`;
md += `## WIP_ONLY — your additions\n\n${tbl(by('WIP_ONLY'))}\n\n`;

md += `## UNMAPPED reference top-level entries\n\n`;
md += uncovered.length ? uncovered.map(n => `- \`${n}\``).join('\n') + '\n\n' : '_none — full coverage_\n\n';

md += `## i18n / multilingual signal\n\n`;
md += `Hardcoded CJK (Chinese) character counts in **shared** \`.js\`/\`.html\` files. `;
md += `Upstream keeps strings hardcoded in Chinese; this table quantifies how many remain and lets you point at specific files when proposing the multilingual (lang-key) approach.\n\n`;
md += `**Totals across shared source: reference ${i18nRefTotal} vs WIP ${i18nWipTotal} CJK chars.**\n\n`;
md += i18n.length
  ? ['| file (ref → wip) | ref CJK | wip CJK |', '|---|---:|---:|',
     ...i18n.map(x => `| \`${x.refRel}\` → \`${x.wipRel}\` | ${x.refN} | ${x.wipN} |`)].join('\n') + '\n\n'
  : '_no CJK found in shared source_\n\n';

if (LIST_IDENTICAL) {
  md += `## IDENTICAL files\n\n${tbl(by('IDENTICAL'))}\n\n`;
} else {
  md += `## IDENTICAL files\n\n_${counts.IDENTICAL || 0} files — run with \`--full\` to list them._\n\n`;
}

md += `---\n\n`;
md += `### How to use this report\n\n`;
md += `1. **On an upstream pull:** clone/pull the reference, re-run \`node docs/sync/compare.mjs\`.\n`;
md += `2. Look at **MISSING_IN_WIP** first — these are new upstream files; copy them into the mapped WIP path.\n`;
md += `3. Then look at **MODIFIED** — upstream changed a file you also customised; merge the upstream change into your version by hand.\n`;
md += `4. **WIP_ONLY** is informational (your work). **UNMAPPED** means upstream added a new top-level path — add a rule to \`path-map.json\`.\n`;

mkdirSync(dirname(REPORT_PATH), { recursive: true });
writeFileSync(REPORT_PATH, md, 'utf8');
