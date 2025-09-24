const CACHE = 'uzfood-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    'index.html', 'style.css', 'app.js', 'main.js', 'cart.js', 'search.js', 'profile.js'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
