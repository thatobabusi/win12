import { describe, expect, it } from 'vitest';
import '../../public/js/core/registry.js';
import '../../public/js/apps/run.js';

const run = window.win12.apps.get('run');

describe('apps/run (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('run')).toBe(true);
    expect(window.apps.run).toBe(run);
  });

  it('exposes init and run', () => {
    expect(typeof run.init).toBe('function');
    expect(typeof run.run).toBe('function');
  });
});
