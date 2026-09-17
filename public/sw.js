const CACHE_NAME = 'winter-habitat-v1';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/icon.svg', '/favicon.svg', '/pwa-192x192.png', '/pwa-512x512.png', '/pwa-maskable-512x512.png', '/apple-touch-icon.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts.gstatic.com') && !url.hostname.includes('fonts.googleapis.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        fetch(e.request).then(res => { if (res && res.status === 200) caches.open(CACHE_NAME).then(c => c.put(e.request, res)); }).catch(() => {});
        return cached;
      }
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => { if (e.request.mode === 'navigate') return caches.match('/index.html') || caches.match('/'); });
    })
  );
});