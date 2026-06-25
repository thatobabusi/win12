# Hybrid Media Player Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

Goal: Replace the bare Media Player file preview with a polished hybrid app that offers a demo library and local audio/video playback.

Architecture: apps.mediaplayer remains the desktop controller. A small browser-safe module holds testable queue and object-URL helpers; the controller renders the window, drives native media elements, and keeps the existing File Explorer open route.

Tech Stack: HTML, scoped CSS, JavaScript/jQuery, HTML media elements, File API, Vitest, Playwright.

---

## File structure

- Create: public/src/modules/mediaplayer-core.js — pure queue and object-URL helpers.
- Create: tests/unit/mediaplayer-core.test.js — helper tests.
- Modify: public/src/modules/apps.js — controller state, DOM rendering, controls, local picker, cleanup.
- Modify: public/desktop.html — Start entry, player markup, core script.
- Modify: public/apps/style/mediaplayer.css — player-only layout.
- Modify: public/lang/lang/lang_{en,en-US,zh_CN,zh_TW,tn}.properties — matching keys.
- Modify: tests/e2e/basic-workflow.spec.js — Start-menu smoke test.

### Task 1: Add testable Media Player state helpers

Files:

- Create: tests/unit/mediaplayer-core.test.js
- Create: public/src/modules/mediaplayer-core.js

- [ ] Step 1: Write the failing unit test

~~~js
import { describe, expect, it, vi } from 'vitest';
import { clampQueueIndex, createLocalItem, releaseOwnedUrl } from '../../public/src/modules/mediaplayer-core.js';

describe('Media Player core', () => {
  it('wraps queue positions', () => {
    expect(clampQueueIndex(-1, 3)).toBe(2);
    expect(clampQueueIndex(3, 3)).toBe(0);
    expect(clampQueueIndex(0, 0)).toBe(-1);
  });
  it('creates local media with its type', () => {
    expect(createLocalItem('blob:clip', 'clip.webm', 'video'))
      .toMatchObject({ id: 'local:blob:clip', title: 'clip.webm', type: 'video', ownedUrl: true });
  });
  it('releases only player-owned URLs', () => {
    const revoke = vi.fn();
    releaseOwnedUrl({ source: 'blob:owned', ownedUrl: true }, revoke);
    releaseOwnedUrl({ source: 'assets/media/startup.mp3', ownedUrl: false }, revoke);
    expect(revoke).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledWith('blob:owned');
  });
});
~~~

- [ ] Step 2: Run the test and confirm it fails

Run: npm test -- tests/unit/mediaplayer-core.test.js

Expected: FAIL because the module does not exist.

- [ ] Step 3: Add the minimal helper module

~~~js
function clampQueueIndex(index, length) {
  return length === 0 ? -1 : ((index % length) + length) % length;
}
function createLocalItem(source, title, type) {
  return { id: 'local:' + source, title, artist: 'Local file', source, type, ownedUrl: true, artwork: '' };
}
function releaseOwnedUrl(item, revoke = URL.revokeObjectURL) {
  if (item?.ownedUrl && item.source) revoke(item.source);
}
const MediaPlayerCore = { clampQueueIndex, createLocalItem, releaseOwnedUrl };
if (typeof window !== 'undefined') window.MediaPlayerCore = MediaPlayerCore;
export { clampQueueIndex, createLocalItem, releaseOwnedUrl };
~~~

- [ ] Step 4: Run the focused test

Run: npm test -- tests/unit/mediaplayer-core.test.js

Expected: PASS, 3 tests.

- [ ] Step 5: Commit

~~~bash
git add public/src/modules/mediaplayer-core.js tests/unit/mediaplayer-core.test.js
git commit -m "feat: add media player queue helpers"
~~~

### Task 2: Build the player shell, Start entry, and locale keys

Files:

- Modify: public/desktop.html (stylesheet area, Start menu, Media Player window, script block)
- Modify: public/apps/style/mediaplayer.css
- Modify: all five language property files
- Modify: tests/e2e/basic-workflow.spec.js

- [ ] Step 1: Add the failing E2E test

~~~js
test('opens Media Player with a demo library from Start', async ({ page }) => {
  await page.locator('#start-btn').click();
  await page.locator('[data-app="mediaplayer"]').click();
  await expect(page.locator('.window.mediaplayer')).toBeVisible();
  await expect(page.locator('#mediaplayer-library [data-track-id]')).toHaveCount(3);
  await expect(page.locator('#mediaplayer-open-file')).toBeVisible();
  await expect(page.locator('#mediaplayer-now-title')).toContainText('Windows Startup');
});
~~~

- [ ] Step 2: Confirm it fails

Run: npm run test:e2e -- --grep "Media Player with a demo library"

Expected: FAIL because the Start-menu app and player shell are absent.

- [ ] Step 3: Load the core before apps.js and add the Start entry

~~~html
<script type="module" src="./src/modules/mediaplayer-core.js"></script>
<a class="a sm-app enable mediaplayer" data-app="mediaplayer" onclick="openapp('mediaplayer');hide_startmenu();">
  <img src="assets/icons/files/music.png"><span data-i18n="mediaplayer.name">Media Player</span>
</a>
~~~

- [ ] Step 4: Replace the current simple media controls with this window body

~~~html
<div class="content" id="win-mediaplayer">
  <aside class="mediaplayer-sidebar"><p data-i18n="mediaplayer.library">Library</p><button id="mediaplayer-open-file" type="button" onclick="apps.mediaplayer.pickFile()" data-i18n="mediaplayer.open-file">Open file</button><input id="mediaplayer-file-input" type="file" accept="audio/*,video/*" hidden></aside>
  <section class="mediaplayer-main"><div id="mediaplayer-artwork"></div><video id="mediaplayer-video" playsinline hidden></video><audio id="mediaplayer-audio"></audio><p id="mediaplayer-now-title"></p><p id="mediaplayer-now-artist"></p><input id="mediaplayer-progress" type="range" min="0" max="0" value="0"><div class="mediaplayer-controls"><button type="button" onclick="apps.mediaplayer.previous()">⏮</button><button id="mediaplayer-play" type="button" onclick="apps.mediaplayer.toggle()">▶</button><button type="button" onclick="apps.mediaplayer.next()">⏭</button><input id="mediaplayer-volume" type="range" min="0" max="1" step="0.05" value="1"></div><p id="mediaplayer-error" role="status"></p></section>
  <aside id="mediaplayer-library" class="mediaplayer-library" aria-label="Media library"></aside>
</div>
~~~

- [ ] Step 5: Replace the existing stylesheet with this scoped baseline

~~~css
#win-mediaplayer { display:grid; grid-template-columns:180px minmax(260px,1fr) 220px; height:100%; color:#f8fbff; background:linear-gradient(135deg,#101827,#202f4a); }
#win-mediaplayer button { border:0; border-radius:8px; cursor:pointer; }
#win-mediaplayer .mediaplayer-sidebar, #win-mediaplayer .mediaplayer-library { padding:20px; background:#08101dcc; }
#win-mediaplayer .mediaplayer-main { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:28px; }
#mediaplayer-artwork { width:min(260px,48vw); aspect-ratio:1; border-radius:16px; background:linear-gradient(145deg,#8ac2ee,#6557a8); }
#mediaplayer-video { max-width:100%; max-height:48vh; border-radius:12px; }
#mediaplayer-progress, #mediaplayer-volume { width:min(420px,100%); }
#mediaplayer-library button { display:block; width:100%; padding:10px; margin-bottom:6px; text-align:left; background:transparent; color:inherit; }
#mediaplayer-library button[aria-current="true"] { background:#ffffff24; }
#mediaplayer-error { min-height:1.2em; color:#ffb4ab; }
@media (max-width:720px) { #win-mediaplayer { grid-template-columns:1fr; overflow:auto; } }
~~~

- [ ] Step 6: Add the same keys to every language file

~~~properties
mediaplayer.library=Library
mediaplayer.open-file=Open file
mediaplayer.local-file=Local file
mediaplayer.unsupported=This file cannot be played.
~~~

Use proper Chinese, Traditional Chinese, and Setswana values. Every locale must carry the identical key set because lang-files.test.js checks exact parity.

- [ ] Step 7: Verify translation parity

Run: npm test -- tests/unit/lang-files.test.js

Expected: PASS. The new E2E test remains red until Task 3 renders the library.

- [ ] Step 8: Commit

~~~bash
git add public/desktop.html public/apps/style/mediaplayer.css public/lang/lang tests/e2e/basic-workflow.spec.js
git commit -m "feat: add media player interface"
~~~

### Task 3: Implement playback, queue rendering, file picking, and cleanup

Files:

- Modify: public/src/modules/apps.js (Explorer media branches and existing mediaplayer object)

- [ ] Step 1: Replace the existing mediaplayer object with the following state contract

~~~js
mediaplayer: {
  queue: [], currentIndex: -1, activeItem: null,
  demoQueue: [
    { id:'startup', title:'Windows Startup', artist:'Win12', source:'assets/media/startup.mp3', type:'audio', ownedUrl:false, artwork:'startup' },
    { id:'ambient', title:'Ambient Loop', artist:'Demo collection', source:'', type:'audio', ownedUrl:false, artwork:'ambient' },
    { id:'night-drive', title:'Night Drive', artist:'Demo collection', source:'', type:'audio', ownedUrl:false, artwork:'night' }
  ],
  init() { this.queue = this.demoQueue.map(item => ({ ...item })); this.bindEvents(); this.select(0, false); },
  media() { return this.activeItem?.type === 'video' ? $('#mediaplayer-video')[0] : $('#mediaplayer-audio')[0]; },
  previous() { this.select(this.currentIndex - 1); },
  next() { this.select(this.currentIndex + 1); },
  toggle() { const media = this.media(); if (media?.src) media.paused ? media.play() : media.pause(); },
  pickFile() { $('#mediaplayer-file-input').val('').trigger('click'); },
  handleFile(file) {
    if (!file) return;
    const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : '';
    if (!type) return $('#mediaplayer-error').text(lang('This file cannot be played.', 'mediaplayer.unsupported'));
    this.open(URL.createObjectURL(file), file.name, type, true);
  },
  open(url, name, type, ownedUrl = false) {
    const item = ownedUrl ? window.MediaPlayerCore.createLocalItem(url, name, type) : { id:'file:' + url, title:name, artist:lang('Local file', 'mediaplayer.local-file'), source:url, type, ownedUrl:false, artwork:'' };
    this.queue = [item]; this.currentIndex = 0; openapp('mediaplayer'); this.select(0);
  },
  close() { this.stop(); window.MediaPlayerCore.releaseOwnedUrl(this.activeItem); this.activeItem = null; hidewin('mediaplayer'); }
}
~~~

- [ ] Step 2: Add these DOM methods to the controller

~~~js
select(index, autoplay = true) {
  const next = window.MediaPlayerCore.clampQueueIndex(index, this.queue.length);
  if (next < 0) return;
  this.stop(); this.currentIndex = next; this.activeItem = this.queue[next]; this.render();
  if (!this.activeItem.source) return $('#mediaplayer-error').text(lang('This file cannot be played.', 'mediaplayer.unsupported'));
  const media = this.media(); media.src = this.activeItem.source; media.load();
  if (autoplay) media.play().catch(() => {});
},
render() {
  const item = this.activeItem;
  $('#mediaplayer-now-title').text(item.title); $('#mediaplayer-now-artist').text(item.artist);
  $('#mediaplayer-video').prop('hidden', item.type !== 'video'); $('#mediaplayer-artwork').toggle(item.type !== 'video');
  $('#mediaplayer-library').empty();
  this.queue.forEach((track, index) => $('#mediaplayer-library').append($('<button>', { type:'button', 'data-track-id':track.id, text:track.title, 'aria-current': index === this.currentIndex }).on('click', () => this.select(index))));
},
stop() {
  $('#mediaplayer-video, #mediaplayer-audio').each((_, element) => { element.pause(); element.removeAttribute('src'); element.load(); });
  $('#mediaplayer-progress').val(0); $('#mediaplayer-error').text('');
}
~~~

Implement bindEvents() once with namespaced jQuery handlers for file input, seek, volume, loadedmetadata, timeupdate, play, pause, ended, and error. It must update the range, play label, next-track behavior, and localized error state.

- [ ] Step 3: Preserve File Explorer object-URL ownership

Change its existing calls to:

~~~js
apps.mediaplayer.open(url, fileName, 'video', false);
apps.mediaplayer.open(url, fileName, 'audio', false);
~~~

The player revokes only file-picker URLs, never Explorer-owned URLs.

- [ ] Step 4: Verify behavior

Run: npm test && npm run test:e2e -- --grep "Media Player with a demo library"

Expected: unit suite PASS; E2E PASS with a visible player, three rows, and Open file.

- [ ] Step 5: Commit

~~~bash
git add public/src/modules/apps.js tests/unit/mediaplayer-core.test.js
git commit -m "feat: add media player playback controls"
~~~

### Task 4: Validate cross-app integration

Files:

- Modify only the files above if verification exposes a narrow regression.

- [ ] Step 1: Run the complete automated gate

Run: npm run test:all && npm run lint

Expected: all Vitest/Playwright tests pass and ESLint exits 0.

- [ ] Step 2: Manually verify media lifecycle

Run: npx playwright test --config config/playwright.config.js --headed --grep "Media Player with a demo library"

Expected: Start launches player; Windows Startup plays; previous/next changes selection; local audio/video can be selected; closing pauses media; Explorer opens the correct audio/video surface.

- [ ] Step 3: Inspect final changes

Run: git diff HEAD~3..HEAD --check && git status --short

Expected: no whitespace errors and only intended Media Player/documentation changes.

## Self-review

- Spec coverage: Tasks 1 and 3 cover queue navigation, source type, and owned URL cleanup. Task 2 covers launcher, demo library, Now Playing, picker shell, responsive UI, and locale parity. Task 3 preserves File Explorer launch behavior. Task 4 validates media/window lifecycle.
- Placeholder scan: no unassigned implementation markers remain.
- Type consistency: queue items always use id, title, artist, source, type, ownedUrl, and artwork; type is audio or video.

