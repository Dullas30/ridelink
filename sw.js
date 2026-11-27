/* RideLink service worker
   - Saves the app on the phone so it opens fast and works offline.
   - Pages and app files: try the network first (so updates show up), fall back to the saved copy.
   - Logos, icons and the map library: use the saved copy first.
   - Maps, routes and place search come from other websites and are never cached here. */
const VERSION = 'rl-v5';
const SHELL = ['./', './index.html', './offline.html', './manifest.webmanifest', './config.js',
  './assets/logo.png', './assets/logo-mark.png', './assets/logo-white.png',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/apple-touch-icon.png',
  './assets/vendor/leaflet.js', './assets/vendor/leaflet.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // Google Fonts: keep a copy so text looks right offline
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return; // maps, routes, search: always live
  const cacheFirst = /\/assets\//.test(url.pathname);
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    if (cacheFirst) {
      const hit = await c.match(req);
      if (hit) return hit;
    }
    try {
      const r = await withTimeout(fetch(req), req.mode === 'navigate' ? 4000 : 6000);
      if (r.ok) c.put(req, r.clone());
      return r;
    } catch (err) {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return (await c.match('./index.html')) || c.match('./offline.html');
      return Response.error();
    }
  })());
});
