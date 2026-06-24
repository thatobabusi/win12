import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Validates the ACTUAL translation files under public/lang/lang (unlike i18n.test.js,
// which exercises lang() logic against fixtures). This is the guard that keeps every
// language — especially Setswana (tn) — at full key parity with English.

const LANG_DIR = resolve(process.cwd(), 'public/lang/lang');
const LANGS = ['en', 'en-US', 'zh_CN', 'zh_TW', 'tn'];
// Languages whose values must NOT contain Chinese characters.
const NON_CJK_LANGS = ['en', 'en-US', 'tn'];
const CJK = /[㐀-䶿一-鿿豈-﫿]/;
const PLACEHOLDER = /%[a-z]+/g;

function parseProperties(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) continue;
    const i = line.indexOf('=');
    if (i <= 0) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1);
  }
  return out;
}

const data = {};
for (const code of LANGS) {
  const path = resolve(LANG_DIR, `lang_${code}.properties`);
  if (existsSync(path)) data[code] = parseProperties(readFileSync(path, 'utf8'));
}

describe('Translation files (public/lang/lang)', () => {
  describe('Presence', () => {
    it.each(LANGS)('lang_%s.properties exists and is non-trivial', (code) => {
      expect(data[code], `lang_${code}.properties missing`).toBeDefined();
      expect(Object.keys(data[code]).length).toBeGreaterThan(500);
    });
  });

  describe('Key parity (English is the reference)', () => {
    const enKeys = () => Object.keys(data.en).sort();

    it.each(LANGS.filter(l => l !== 'en'))('%s has exactly the same keys as en', (code) => {
      const ref = new Set(Object.keys(data.en));
      const other = new Set(Object.keys(data[code]));
      const missing = [...ref].filter(k => !other.has(k));
      const extra = [...other].filter(k => !ref.has(k));
      expect(missing, `${code} is MISSING keys`).toEqual([]);
      expect(extra, `${code} has EXTRA keys not in en`).toEqual([]);
    });

    it('Setswana (tn) is never behind English', () => {
      const missingInTn = enKeys().filter(k => !(k in data.tn));
      expect(missingInTn, 'Setswana missing these keys').toEqual([]);
      expect(Object.keys(data.tn).length).toBe(enKeys().length);
    });
  });

  describe('No empty values', () => {
    it.each(LANGS)('%s has no empty translation values', (code) => {
      const empty = Object.entries(data[code]).filter(([, v]) => v.trim() === '').map(([k]) => k);
      expect(empty, `${code} has empty values`).toEqual([]);
    });
  });

  describe('Placeholder integrity', () => {
    it.each(LANGS.filter(l => l !== 'en'))('%s preserves %-placeholders from en', (code) => {
      const mismatches = [];
      for (const [k, enVal] of Object.entries(data.en)) {
        if (!(k in data[code])) continue;
        const a = (enVal.match(PLACEHOLDER) || []).sort().join(',');
        const b = (data[code][k].match(PLACEHOLDER) || []).sort().join(',');
        if (a !== b) mismatches.push(`${k} (en:[${a}] vs ${code}:[${b}])`);
      }
      expect(mismatches, `${code} placeholder mismatches`).toEqual([]);
    });
  });

  describe('No Chinese leaking into English/Setswana', () => {
    it.each(NON_CJK_LANGS)('%s values contain no CJK characters', (code) => {
      const withCjk = Object.entries(data[code])
        .filter(([, v]) => CJK.test(v))
        .map(([k]) => k);
      expect(withCjk, `${code} has Chinese characters in these values`).toEqual([]);
    });
  });
});
