import { describe, expect, it, vi } from 'vitest';
import '../../src/js/core/lifecycle.js';

// Use the factory so each test gets a clean, un-auto-marked instance.
const { createLifecycle } = window.win12;

describe('core/lifecycle', () => {
  it('queues onReady callbacks and fires them on markReady', () => {
    const lc = createLifecycle();
    const a = vi.fn();
    const b = vi.fn();
    lc.onReady(a);
    lc.onReady(b);
    expect(a).not.toHaveBeenCalled();
    expect(lc.isReady()).toBe(false);

    lc.markReady();
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
    expect(lc.isReady()).toBe(true);
  });

  it('runs onReady immediately once already ready', () => {
    const lc = createLifecycle();
    lc.markReady();
    const cb = vi.fn();
    lc.onReady(cb);
    expect(cb).toHaveBeenCalledOnce();
  });

  it('markReady is idempotent', () => {
    const lc = createLifecycle();
    const cb = vi.fn();
    lc.onReady(cb);
    lc.markReady();
    lc.markReady();
    expect(cb).toHaveBeenCalledOnce();
  });

  it('isolates a throwing hook from the rest', () => {
    const lc = createLifecycle();
    const bad = vi.fn(() => { throw new Error('boom'); });
    const good = vi.fn();
    lc.onReady(bad);
    lc.onReady(good);
    expect(() => lc.markReady()).not.toThrow();
    expect(good).toHaveBeenCalledOnce();
  });

  it('exposes a default singleton', () => {
    expect(window.win12.lifecycle).toBeTruthy();
    expect(typeof window.win12.lifecycle.onReady).toBe('function');
  });
});
