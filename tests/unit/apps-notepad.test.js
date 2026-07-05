import { describe, expect, it, beforeEach } from 'vitest';
import '../../src/js/core/registry.js';
import '../../src/js/apps/notepad.js';

const np = window.win12.apps.get('notepad');

// Chainable no-op jQuery stub so DOM-touching helpers run headless.
beforeEach(() => {
  window.$ = () => ({
    hide() { return this; }, show() { return this; }, html() { return this; },
    removeClass() { return this; }, addClass() { return this; },
    text() { return ''; }, val() { return this; }, css() { return this; }, on() { return this; },
  });
});

describe('apps/notepad (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('notepad')).toBe(true);
    expect(window.apps.notepad).toBe(np);
  });

  it('_resetPreview clears markdown/preview state', () => {
    np._isMd = true;
    np._previewing = true;
    np._resetPreview();
    expect(np._isMd).toBe(false);
    expect(np._previewing).toBe(false);
  });

  it('setMdMode(true) enables markdown mode after resetting preview', () => {
    np.setMdMode(true);
    expect(np._isMd).toBe(true);
    expect(np._previewing).toBe(false);
  });

  it('_forceClose clears the dirty flag and mounted handle', () => {
    np._dirty = true;
    np._mountedFileHandle = { fake: true };
    window.hidewin = () => {}; // referenced by _forceClose
    np._forceClose();
    expect(np._dirty).toBe(false);
    expect(np._mountedFileHandle).toBe(null);
  });
});
