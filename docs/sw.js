// Service Worker - Cache Buster v2
const CACHE_NAME = 'algopt-v2-' + Date.now();

// Install: Clear all old caches
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Activate: Take control immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
        ])
    );
});

// Fetch: Always get from network (no caching)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
