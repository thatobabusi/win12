// Win12 dev watcher: rebuild public/ whenever src/ changes.
//
// Uses Node's built-in recursive fs.watch (no extra dependency). Debounced so a
// burst of editor saves triggers a single rebuild. Run `npm run watch` during
// local development so Herd (which serves public/) always sees fresh source.
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const SRC = resolve(root, 'src');

function build() {
  const r = spawnSync(process.execPath, [resolve(here, 'build.mjs')], {
    stdio: 'inherit',
  });
  return r.status === 0;
}

console.log('watch: initial build...');
build();

let timer = null;
watch(SRC, { recursive: true }, (_event, filename) => {
  if (filename && (filename.includes('.git') || filename.includes('node_modules'))) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const t = new Date().toLocaleTimeString();
    console.log(`watch: change (${filename}) -> rebuilding at ${t}`);
    build();
  }, 150);
});

console.log('watch: watching src/ for changes (Ctrl+C to stop)');
