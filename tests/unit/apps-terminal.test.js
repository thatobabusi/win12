import { describe, expect, it, beforeEach } from 'vitest';
import '../../public/src/core/registry.js';
import '../../public/src/apps/terminal.js';

const term = window.win12.apps.get('terminal');
let inputVal;

beforeEach(() => {
  inputVal = '';
  // Stub jQuery so input.val() reads/writes our local value.
  window.$ = () => ({ val: (v) => (v === undefined ? inputVal : (inputVal = v)) });
  term.historyList = ['one', 'two', 'three'];
  term.historypt = 3;
  term.isViewingHistory = false;
  term.historyTemp = '';
});

describe('apps/terminal (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('terminal')).toBe(true);
    expect(window.apps.terminal).toBe(term);
  });

  it('up-arrow walks back through command history and saves the in-progress input', () => {
    inputVal = 'partial';
    term.history('up');
    expect(inputVal).toBe('three');
    expect(term.historyTemp).toBe('partial');
    term.history('up');
    expect(inputVal).toBe('two');
  });

  it('down-arrow restores the saved input at the end of history', () => {
    inputVal = 'partial';
    term.history('up');   // 'three'
    term.history('up');   // 'two'
    term.history('down'); // 'three'
    expect(inputVal).toBe('three');
    term.history('down'); // past the end -> restore in-progress input
    expect(inputVal).toBe('partial');
    expect(term.isViewingHistory).toBe(false);
  });
});
