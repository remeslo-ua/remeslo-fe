// Service Worker for PWA
const CACHE_NAME = 'remeslo-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  // Add other static assets
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  try {
    const reqUrl = new URL(event.request.url);

    // Don't intercept cross-origin requests or analytics/third-party endpoints
    if (reqUrl.origin !== self.location.origin || reqUrl.hostname.includes('amplitude.com')) {
      return; // Let the browser handle these requests normally
    }

    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .catch(() => {
            // If network fails, serve fallback page or a 503 response
            return caches.match('/') || new Response('Offline', { status: 503, statusText: 'Offline' });
          });
      })
    );
  } catch (err) {
    // Defensive: if anything goes wrong in the SW, let the browser handle the request
    return;
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});