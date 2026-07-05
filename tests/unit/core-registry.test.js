import { describe, expect, it, beforeEach } from 'vitest';
import '../../public/js/core/registry.js';

const registry = window.win12.apps;

describe('core/registry', () => {
  beforeEach(() => {
    // Reset the bridged legacy store between tests.
    window.apps = {};
  });

  it('registers a controller and bridges it onto window.apps', () => {
    const controller = { open: () => {} };
    const returned = registry.register('demo', controller);
    expect(returned).toBe(controller);
    expect(registry.get('demo')).toBe(controller);
    // Bridge: legacy code reading window.apps sees the same object.
    expect(window.apps.demo).toBe(controller);
  });

  it('reflects apps added directly to the legacy global (live view)', () => {
    window.apps.legacy = { open: () => {} };
    expect(registry.has('legacy')).toBe(true);
    expect(registry.get('legacy')).toBe(window.apps.legacy);
    expect(registry.names()).toContain('legacy');
  });

  it('has() and names() report the current store', () => {
    expect(registry.has('nope')).toBe(false);
    registry.register('a', {});
    registry.register('b', {});
    expect(registry.has('a')).toBe(true);
    expect(registry.names().sort()).toEqual(['a', 'b']);
  });

  it('rejects invalid names and controllers', () => {
    expect(() => registry.register('', {})).toThrow();
    expect(() => registry.register(null, {})).toThrow();
    expect(() => registry.register('x', null)).toThrow();
    expect(() => registry.register('x', 'not-an-object')).toThrow();
  });
});
