// Win12 build: assemble the served web root (public/) from source (src/).
//
// This is a pure static site — no bundling/transpiling is needed. The "build"
// simply mirrors src/ into public/ so that:
//   - Herd serves public/ (its docroot by Valet convention) with fresh source,
//   - the GitHub Pages workflow uploads public/ as the site,
//   - the e2e suite serves public/.
// public/ is generated output (git-ignored); src/ is the source of truth.
//
// src/lang is the win12-locales git submodule; its working-tree files are copied
// but its .git gitlink metadata is skipped.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = resolve(root, 'src');
const OUT = resolve(root, 'public');

if (!existsSync(SRC)) {
  console.error('build: src/ not found at ' + SRC);
  process.exit(1);
}

// Clean the output dir so deletions in src/ propagate.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Copy everything except git metadata (submodule .git files/dirs, stray .git).
cpSync(SRC, OUT, {
  recursive: true,
  filter: (srcPath) => {
    const parts = srcPath.split(sep);
    return !parts.includes('.git') && !parts.includes('node_modules');
  },
});

console.log('build: src/ -> public/ done');
