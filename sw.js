// ==========================================
// Service Worker – O‘ZFOOD 2025 (offline + cache)
// ==========================================
const CACHE = 'uzfood-v1';
const FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/main.js',
  '/cart.js',
  '/profile.js',
  '/search.js',
  '/wishlist.js',
  '/orders.js',
  '/manifest.json'
];

// Install – fayllarni keshlaymiz
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

// Activate – eski keshlarni tozalaymiz
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
});

// Fetch – agar onlayn bo‘lsa internetdan, aks holda keshdan
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;
      return fetch(e.request);
    })
  );
});
