(function attachMediaPlayerCore(global) {
  function clampQueueIndex(index, length) {
    if (length <= 0) {
      return -1;
    }

    return ((index % length) + length) % length;
  }

  function createLocalItem(source, title, type) {
    return {
      id: `local:${source}`,
      title,
      artist: 'Local file',
      source,
      type,
      ownedUrl: true,
      artwork: '',
    };
  }

  function releaseOwnedUrl(item, revoke = URL.revokeObjectURL) {
    if (item?.ownedUrl && item.source) {
      revoke(item.source);
    }
  }

  global.MediaPlayerCore = {
    clampQueueIndex,
    createLocalItem,
    releaseOwnedUrl,
  };
})(typeof window !== 'undefined' ? window : globalThis);
