import { describe, expect, it, beforeAll } from 'vitest';
import '../../src/js/core/registry.js';

// taskmgr.js evaluates structuredClone(taskmgrTasks) at object-creation time, so
// the global must exist before the module is imported. Seed it, then dynamic-import.
let taskmgr;
const seed = [
  { name: 'File Explorer', link: 'explorer', cpu: 1 },
  { name: 'System', link: null, cpu: 0 },
];

beforeAll(async () => {
  globalThis.taskmgrTasks = seed;
  await import('../../src/js/apps/taskmgr.js');
  taskmgr = window.win12.apps.get('taskmgr');
});

describe('apps/taskmgr (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('taskmgr')).toBe(true);
    expect(window.apps.taskmgr).toBe(taskmgr);
  });

  it('deep-clones taskmgrTasks into its own tasks list at creation', () => {
    expect(taskmgr.tasks).toEqual(seed);
    expect(taskmgr.tasks).not.toBe(seed);       // a separate array
    expect(taskmgr.tasks[0]).not.toBe(seed[0]); // deep clone, not shared refs
  });

  it('starts with the default sort settings', () => {
    expect(taskmgr.sortType).toBe('cpu');
    expect(taskmgr.sortOrder).toBe('up-down');
  });
});
