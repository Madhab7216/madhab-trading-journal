const CACHE_NAME = 'tj-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // যদি ক্যাশে থাকে তবে সেটি রিটার্ন করবে, না থাকলে নেটওয়ার্ক রিকোয়েস্ট করবে
      return response || fetch(event.request);
    })
  );
});

