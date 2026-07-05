import { describe, expect, it, beforeEach } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/explorer.js';

// Legacy inline handlers reach the app as `apps.explorer`; the kernel bridges
// window.win12.apps -> window.apps, so both must point at the same object.
const explorer = window.win12.apps.get('explorer');

describe('apps/explorer (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('explorer')).toBe(true);
    expect(window.apps.explorer).toBe(explorer);
  });

  it('exposes the public surface run.js and file-open flows depend on', () => {
    for (const m of ['init', 'goto', 'getPath', 'newtab', 'add', 'del',
                     'rename', 'reset', 'back', 'front', 'traverseDirectory']) {
      expect(typeof explorer[m], m).toBe('function');
    }
  });

  it('ships the seed in-memory filesystem with C: and D: drives', () => {
    expect(explorer.path.folder['C:']).toBeTruthy();
    expect(explorer.path.folder['D:']).toBeTruthy();
    // C:\Program Files\about.exe is one of the seeded launchers.
    const pf = explorer.path.folder['C:'].folder['Program Files'].file;
    expect(pf.some(f => f.name === 'about.exe')).toBe(true);
  });

  describe('traverseDirectory (duplicate-name detection)', () => {
    const dir = { folder: { docs: {} }, file: [{ name: 'a.txt' }, { name: 'b.png' }] };
    it('finds an existing file by name', () => {
      expect(explorer.traverseDirectory(dir, 'a.txt')).toBe(true);
    });
    it('finds an existing folder by name', () => {
      expect(explorer.traverseDirectory(dir, 'docs')).toBe(true);
    });
    it('returns false for a name that is absent', () => {
      expect(explorer.traverseDirectory(dir, 'nope')).toBe(false);
    });
    it('returns false when the dir is malformed (missing file/folder)', () => {
      expect(explorer.traverseDirectory({}, 'x')).toBe(false);
    });
  });

  describe('per-tab navigation history stack', () => {
    const tab = 7; // isolated slot; the module keeps history per tab index
    beforeEach(() => explorer.initHistory(tab));

    it('starts empty (pointer before the first entry)', () => {
      expect(explorer.historyIsEmpty(tab)).toBe(true);
    });

    it('push/top/pop/inc move through the stack', () => {
      explorer.pushHistory(tab, 'This PC');
      explorer.pushHistory(tab, 'C:');
      expect(explorer.topHistory(tab)).toBe('C:');
      expect(explorer.historyIsFull(tab)).toBe(true);
      expect(explorer.popHistory(tab)).toBe('This PC');
      expect(explorer.historyIsEmpty(tab)).toBe(true);
      expect(explorer.incHistory(tab)).toBe('C:');
      expect(explorer.historyIsFull(tab)).toBe(true);
    });

    it('delHistory truncates the forward entries after the pointer', () => {
      explorer.pushHistory(tab, 'This PC');
      explorer.pushHistory(tab, 'C:');
      explorer.popHistory(tab); // pointer back to 'This PC'
      explorer.delHistory(tab); // drop everything ahead of the pointer
      expect(explorer.historyIsFull(tab)).toBe(true);
      expect(explorer.topHistory(tab)).toBe('This PC');
    });
  });
});
