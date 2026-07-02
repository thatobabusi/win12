import { describe, expect, it, beforeEach, vi } from 'vitest';
import '../../public/src/core/window-manager.js';

const windows = window.win12.windows;

describe('core/window-manager', () => {
  beforeEach(() => {
    window.openapp = vi.fn();
    window.hidewin = vi.fn();
    window.focwin = vi.fn();
    window.minwin = vi.fn();
    window.maxwin = vi.fn();
  });

  it('delegates each operation to the matching global at call time', () => {
    windows.open('calc');
    windows.hide('calc');
    windows.focus('calc');
    windows.minimize('calc');
    windows.maximize('calc');

    expect(window.openapp).toHaveBeenCalledWith('calc');
    expect(window.hidewin).toHaveBeenCalledWith('calc');
    expect(window.focwin).toHaveBeenCalledWith('calc');
    expect(window.minwin).toHaveBeenCalledWith('calc');
    expect(window.maxwin).toHaveBeenCalledWith('calc');
  });

  it('resolves the global lazily (rebinding takes effect)', () => {
    const first = vi.fn();
    const second = vi.fn();
    window.openapp = first;
    windows.open('a');
    window.openapp = second;
    windows.open('b');
    expect(first).toHaveBeenCalledWith('a');
    expect(second).toHaveBeenCalledWith('b');
  });

  it('throws a clear error when the underlying global is missing', () => {
    delete window.openapp;
    expect(() => windows.open('x')).toThrow(/openapp/);
  });
});
