import { describe, expect, it, beforeEach } from 'vitest';
import '../../public/src/core/registry.js';
import '../../public/src/apps/edge.js';

const edge = window.win12.apps.get('edge');

beforeEach(() => { edge.history = []; edge.historypt = []; });

describe('apps/edge (extracted onto the kernel)', () => {
  it('registers itself and is the same object legacy code sees', () => {
    expect(window.win12.apps.has('edge')).toBe(true);
    expect(window.apps.edge).toBe(edge);
  });

  it('tracks per-tab navigation history (push/top/pop/inc, empty/full)', () => {
    edge.initHistory('t');
    expect(edge.historyIsEmpty('t')).toBe(true);
    edge.pushHistory('t', 'a');
    edge.pushHistory('t', 'b');
    expect(edge.topHistory('t')).toBe('b');
    expect(edge.historyIsFull('t')).toBe(true);
    expect(edge.historyIsEmpty('t')).toBe(false);
    expect(edge.popHistory('t')).toBe('a');
    expect(edge.historyIsEmpty('t')).toBe(true);
    expect(edge.incHistory('t')).toBe('b');
    expect(edge.historyIsFull('t')).toBe(true);
  });

  it('delHistory truncates forward entries after the current position', () => {
    edge.initHistory('t');
    edge.pushHistory('t', 'a');
    edge.pushHistory('t', 'b');
    edge.pushHistory('t', 'c');
    edge.popHistory('t');   // back to 'b'
    edge.delHistory('t');   // drop the forward 'c'
    expect(edge.history['t']).toEqual(['a', 'b']);
  });
});
