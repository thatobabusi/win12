import { describe, expect, it } from 'vitest';
import '../../public/js/core/registry.js';
import '../../public/js/apps/mediaplayer.js';

// Deep playback behaviour is covered by mediaplayer-core.test.js (pure helpers)
// and the e2e suite (open/play/library). Here we just assert the extraction
// wired the controller onto the kernel with its full surface intact.
describe('apps/mediaplayer (extracted onto the kernel)', () => {
  const mp = window.win12.apps.get('mediaplayer');

  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('mediaplayer')).toBe(true);
    expect(window.apps.mediaplayer).toBe(mp);
  });

  it('exposes the full controller surface', () => {
    ['init', 'showEmptyState', 'media', 'previous', 'next', 'toggle', 'pickFile',
      'handleFile', 'open', 'select', 'render', 'stop', 'bindEvents', 'close']
      .forEach((m) => expect(typeof mp[m]).toBe('function'));
    expect(mp.queue).toEqual([]);
    expect(mp.currentIndex).toBe(-1);
  });
});
