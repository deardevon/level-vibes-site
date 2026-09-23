// Offline support for the home-screen web app.
// Serves the cached copy straight away and refreshes it in the background,
// so a new version shows up on the next launch.
const CACHE = 'level-vibes-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const network = caches.open(CACHE).then((cache) =>
    fetch(req)
      .then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      })
      .catch(() => cache.match(req))
  );
  event.waitUntil(network.catch(() => {}));
  event.respondWith(caches.match(req).then((cached) => cached || network));
});
