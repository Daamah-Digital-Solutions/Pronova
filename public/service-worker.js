/* Pronova PWA service worker
 *
 * Minimal, safe service worker that enables installability and provides a
 * cache-fallback for offline navigation. Uses a network-first strategy so the
 * app always prefers fresh content and only falls back to cache when offline.
 */
const CACHE_NAME = 'pronova-cache-v1';
const OFFLINE_URLS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests; let the browser handle everything else.
  if (request.method !== 'GET') return;

  // Network-first, falling back to cache (then to cached index for navigations).
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/index.html'))
      )
  );
});
