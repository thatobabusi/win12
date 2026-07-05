// Win12 service worker.
//
// Strategy:
//   - NAVIGATIONS (the HTML shell)  -> network-first, so the entry point is
//     always fresh (no stale-shell trap); falls back to cache when offline.
//   - STATIC ASSETS (js/css/img/...) -> stale-while-revalidate: serve the cached
//     copy INSTANTLY (no network wait — this is what kills the per-request
//     queueing that made loads drag with the old network-first-everything
//     worker), then refresh the cache in the background for next time.
//
// During active development use ?develop=1 to bypass this worker entirely
// (always fresh, no caching). CACHE_VERSION is stamped into the cache name;
// bumping it makes every client drop old caches on activate.
//
// The strategy functions are pulled out and attached to `self.__sw` so they can
// be unit-tested with injected fetch/caches (this file was previously untestable,
// which is a big part of why the boot/SW flow kept breaking).
(function (scope) {
  const CACHE_VERSION = 'win12-2026-07-04-swr-2';

  // External hosts that must always hit the network and never be cached.
  const passthrough = [
    'api.github.com',
    'tjy-gitnub.github.io/win12-theme',
    'win12server.freehk.svipss.top',
    'assets.msn.cn'
  ];

  function bypass(req, url) {
    if (!/^https?:$/.test(url.protocol)) return true;
    if (req.method !== 'GET') return true;
    if (passthrough.some(d => req.url.indexOf(d) > 0)) return true;
    return false;
  }

  function cacheable(res, sameOrigin) {
    return !!(sameOrigin && res && res.status >= 200 && res.status < 300 && res.status !== 206);
  }

  // HTML shell: prefer the network, fall back to cache offline.
  async function networkFirst(req, ctx) {
    try {
      const res = await ctx.fetchImpl(req, { cache: 'no-cache' });
      if (cacheable(res, ctx.sameOrigin)) {
        const clone = res.clone();
        ctx.cachesImpl.open(CACHE_VERSION).then(c => c.put(req, clone)).catch(() => {});
      }
      return res;
    } catch (err) {
      const cached = await ctx.cachesImpl.match(req);
      if (cached) return cached;
      throw err;
    }
  }

  // Static assets: return cache immediately if present; revalidate in the
  // background. Only awaits the network on a cold cache miss.
  async function staleWhileRevalidate(req, ctx) {
    const cache = await ctx.cachesImpl.open(CACHE_VERSION);
    const cached = await cache.match(req);
    const network = ctx.fetchImpl(req).then((res) => {
      if (cacheable(res, ctx.sameOrigin)) cache.put(req, res.clone()).catch(() => {});
      return res;
    });
    if (cached) {
      if (ctx.waitUntil) ctx.waitUntil(network.catch(() => {}));
      return cached;
    }
    return network;
  }

  // Returns a Promise<Response> to answer with, or null to let the browser
  // handle the request normally (bypass).
  function route(event, overrides) {
    overrides = overrides || {};
    const req = event.request;
    let url;
    try { url = new URL(req.url); } catch (e) { return null; }
    if (bypass(req, url)) return null;

    const ctx = {
      fetchImpl: overrides.fetchImpl || ((r, o) => scope.fetch(r, o)),
      cachesImpl: overrides.cachesImpl || scope.caches,
      sameOrigin: url.origin === (overrides.origin || scope.location.origin),
      waitUntil: overrides.waitUntil || (event.waitUntil ? event.waitUntil.bind(event) : null),
    };
    return req.mode === 'navigate' ? networkFirst(req, ctx) : staleWhileRevalidate(req, ctx);
  }

  // Expose for unit tests.
  scope.__sw = { CACHE_VERSION, bypass, cacheable, networkFirst, staleWhileRevalidate, route };

  // Register real listeners only in an actual ServiceWorker scope.
  if (typeof scope.skipWaiting === 'function' && typeof scope.addEventListener === 'function') {
    scope.addEventListener('install', () => scope.skipWaiting());

    scope.addEventListener('activate', (event) => {
      event.waitUntil((async () => {
        const keys = await scope.caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => scope.caches.delete(k)));
        await scope.clients.claim();
      })());
    });

    scope.addEventListener('fetch', (event) => {
      const answer = route(event);
      if (answer) event.respondWith(answer);
    });

    // Page can request a full cache wipe:
    // navigator.serviceWorker.controller.postMessage({head:'update'})
    scope.addEventListener('message', (event) => {
      if (event.data && event.data.head === 'update') {
        scope.caches.keys().then(keys => keys.forEach(k => scope.caches.delete(k)));
      }
    });
  }
})(typeof self !== 'undefined' ? self : globalThis);
