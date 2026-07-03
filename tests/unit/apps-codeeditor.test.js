import { describe, expect, it, beforeEach } from 'vitest';
import '../../public/src/core/registry.js';
import '../../public/src/apps/codeEditor.js';

const ed = window.win12.apps.get('codeEditor');

beforeEach(() => {
  window.$ = () => ({ toggleClass() { return this; }, text() { return ''; }, css() { return this; } });
  ed.editor = null;
  ed._fontSize = 15;
  ed._wrap = false;
});

describe('apps/codeEditor (extracted onto the kernel)', () => {
  it('registers under the codeEditor key and bridges to legacy', () => {
    expect(window.win12.apps.has('codeEditor')).toBe(true);
    expect(window.apps.codeEditor).toBe(ed);
  });

  it('maps file extensions to ACE modes', () => {
    expect(ed._modeMap.js).toBe('javascript');
    expect(ed._modeMap.py).toBe('python');
    expect(ed._modeMap.tsx).toBe('tsx');
    expect(ed._modeMap.cpp).toBe('c_cpp');
  });

  it('changeFontSize clamps between 10 and 30', () => {
    ed.changeFontSize(3);
    expect(ed._fontSize).toBe(18);
    ed.changeFontSize(100);
    expect(ed._fontSize).toBe(30);
    ed.changeFontSize(-100);
    expect(ed._fontSize).toBe(10);
  });

  it('toggleWrap flips the wrap flag', () => {
    ed.toggleWrap();
    expect(ed._wrap).toBe(true);
    ed.toggleWrap();
    expect(ed._wrap).toBe(false);
  });
});
