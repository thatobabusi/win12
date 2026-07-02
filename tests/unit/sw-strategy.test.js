import { describe, expect, it, vi } from 'vitest';
import '../../public/sw.js';

const { bypass, networkFirst, staleWhileRevalidate } = self.__sw;

function makeCache(initial) {
  const store = new Map(Object.entries(initial || {}));
  return {
    match: vi.fn((req) => Promise.resolve(store.get(req))),
    put: vi.fn((req, res) => { store.set(req, res); return Promise.resolve(); }),
    _store: store,
  };
}
const res = (tag, status = 200) => ({ tag, status, ok: status >= 200 && status < 300, clone() { return this; } });

describe('service worker request routing', () => {
  it('bypasses non-GET, passthrough hosts, and non-http', () => {
    expect(bypass({ method: 'POST', url: 'http://x/a' }, new URL('http://x/a'))).toBe(true);
    expect(bypass({ method: 'GET', url: 'https://api.github.com/y' }, new URL('https://api.github.com/y'))).toBe(true);
    expect(bypass({ method: 'GET', url: 'chrome-extension://z' }, new URL('chrome-extension://z'))).toBe(true);
    // normal same-origin asset is NOT bypassed
    expect(bypass({ method: 'GET', url: 'http://localhost/app.js' }, new URL('http://localhost/app.js'))).toBe(false);
  });
});

describe('service worker: stale-while-revalidate (static assets)', () => {
  it('serves from cache INSTANTLY on a warm load, without waiting on the network', async () => {
    const cached = res('cached');
    const cache = makeCache({ 'app.js': cached });
    const cachesImpl = { open: vi.fn().mockResolvedValue(cache) };

    // A network fetch that never resolves — if the strategy awaited it, this
    // test would hang. It returns cache immediately instead.
    const fetchImpl = vi.fn(() => new Promise(() => {}));
    const waited = [];

    const out = await staleWhileRevalidate('app.js', {
      fetchImpl, cachesImpl, sameOrigin: true, waitUntil: (p) => waited.push(p),
    });

    expect(out).toBe(cached);              // returned the cached copy
    expect(fetchImpl).toHaveBeenCalledOnce(); // background revalidation kicked off
    expect(waited).toHaveLength(1);           // and registered to finish in the background
  });

  it('fetches and caches on a cold miss', async () => {
    const cache = makeCache({});
    const cachesImpl = { open: vi.fn().mockResolvedValue(cache) };
    const fresh = res('fresh');
    const fetchImpl = vi.fn().mockResolvedValue(fresh);

    const out = await staleWhileRevalidate('new.js', { fetchImpl, cachesImpl, sameOrigin: true, waitUntil: () => {} });

    expect(out).toBe(fresh);
    expect(cache.put).toHaveBeenCalledWith('new.js', fresh);
  });
});

describe('service worker: network-first (navigations)', () => {
  it('returns the network response and caches it', async () => {
    const cache = makeCache({});
    const cachesImpl = { open: vi.fn().mockResolvedValue(cache), match: vi.fn() };
    const fresh = res('doc');
    const fetchImpl = vi.fn().mockResolvedValue(fresh);

    const out = await networkFirst('/', { fetchImpl, cachesImpl, sameOrigin: true });
    expect(out).toBe(fresh);
  });

  it('falls back to cache when the network fails', async () => {
    const cachedDoc = res('cached-doc');
    const cachesImpl = { open: vi.fn(), match: vi.fn().mockResolvedValue(cachedDoc) };
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));

    const out = await networkFirst('/', { fetchImpl, cachesImpl, sameOrigin: true });
    expect(out).toBe(cachedDoc);
  });
});
