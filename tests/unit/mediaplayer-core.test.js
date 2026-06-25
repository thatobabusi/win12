import { describe, expect, it, vi } from 'vitest';
import '../../public/src/modules/mediaplayer-core.js';

const {
  clampQueueIndex,
  createLocalItem,
  releaseOwnedUrl,
} = window.MediaPlayerCore;

describe('media player core helpers', () => {
  it('wraps queue indices and returns -1 for an empty queue', () => {
    expect(clampQueueIndex(3, 3)).toBe(0);
    expect(clampQueueIndex(-1, 3)).toBe(2);
    expect(clampQueueIndex(7, 3)).toBe(1);
    expect(clampQueueIndex(0, 0)).toBe(-1);
    expect(clampQueueIndex(0, -1)).toBe(-1);
  });

  it('creates a local-file queue item with the expected metadata', () => {
    expect(createLocalItem('blob:track-1', 'Track One', 'audio')).toEqual({
      id: 'local:blob:track-1',
      title: 'Track One',
      artist: 'Local file',
      source: 'blob:track-1',
      type: 'audio',
      ownedUrl: true,
      artwork: '',
    });
  });

  it('releases owned object URLs only when an item has a source', () => {
    const revoke = vi.fn();

    releaseOwnedUrl({ ownedUrl: true, source: 'blob:track-1' }, revoke);
    releaseOwnedUrl({ ownedUrl: false, source: 'blob:track-2' }, revoke);
    releaseOwnedUrl({ ownedUrl: true, source: '' }, revoke);

    expect(revoke).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith('blob:track-1');
  });

  it('defaults to URL.revokeObjectURL when no revoke function is provided', () => {
    const originalRevokeObjectURL = URL.revokeObjectURL;
    const revoke = vi.fn();
    URL.revokeObjectURL = revoke;

    try {
      releaseOwnedUrl({ ownedUrl: true, source: 'blob:track-1' });
    } finally {
      URL.revokeObjectURL = originalRevokeObjectURL;
    }

    expect(revoke).toHaveBeenCalledWith('blob:track-1');
  });

  it('exposes the helpers on window for browser consumers', () => {
    expect(window.MediaPlayerCore).toMatchObject({
      clampQueueIndex,
      createLocalItem,
      releaseOwnedUrl,
    });
  });
});
