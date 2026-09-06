const CACHE='winter-arc-v5';
const ASSETS=['/winterarc/','/winterarc/index.html','/winterarc/manifest.webmanifest','/winterarc/sw.js','/winterarc/icons/icon-192.png','/winterarc/icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin || !url.pathname.startsWith('/winterarc/')) return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{
      const c=x.clone();
      caches.open(CACHE).then(cache=>cache.put(e.request,c));
      return x;
    }).catch(()=>caches.match('/winterarc/index.html')))
  );
});
