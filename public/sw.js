// Win12 service worker.
//
// Strategy: NETWORK-FIRST for same-origin requests, with the cache used only as
// an offline fallback. This means code/asset edits ALWAYS reflect on the next
// load — no more stale files lingering across browsers. (The old worker was
// cache-first with no versioning, so once a file was cached it was served
// forever, which is why edits did not show up.)
//
// CACHE_VERSION is stamped into the cache name. Bumping it makes every client
// drop all previous caches on activate. skipWaiting() + clients.claim() make a
// new worker take over immediately instead of waiting for all tabs to close.
const CACHE_VERSION = 'win12-2026-07-02-1';

// External hosts that must always hit the network and never be cached.
const passthrough = [
  'api.github.com',
  'tjy-gitnub.github.io/win12-theme',
  'win12server.freehk.svipss.top',
  'assets.msn.cn'
];

self.addEventListener('install', () => {
  // Don't wait for old tabs to close — activate this worker right away.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Delete every cache that isn't the current version.
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    // Take control of pages that are already open.
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only same-protocol http(s) requests.
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (!/^https?:$/.test(url.protocol)) return;

  // Let the browser handle non-GET and external dynamic hosts normally.
  if (req.method !== 'GET') return;
  if (passthrough.some(d => req.url.indexOf(d) > 0)) return;

  // Network-first: try the live file, fall back to cache only when offline.
  // cache:'no-cache' still revalidates with the server on every request (so an
  // edited file always shows on the next load — no stale-file trap), but an
  // UNCHANGED file returns a tiny 304 and is served from cache instead of being
  // fully re-downloaded. That is the difference between "revalidate" and the old
  // cache:'reload' (which re-downloaded every byte every load and made loads
  // drag). Use ?develop=1 to bypass this worker entirely during active editing.
  event.respondWith((async () => {
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      // Cache fresh, cacheable, same-origin responses for offline use.
      if (res && res.status >= 200 && res.status < 300 && res.status !== 206 &&
          url.origin === self.location.origin) {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(req, clone)).catch(() => {});
      }
      return res;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});

// Let the page request a full cache wipe: navigator.serviceWorker.controller.postMessage({head:'update'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.head === 'update') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
});
