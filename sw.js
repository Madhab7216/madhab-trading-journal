const CACHE_NAME = 'tj-cache-v2';

// এই লিংকগুলো Cache এ সেভ হয়ে যাবে অফলাইনের জন্য
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/prop-types@15.8.1/prop-types.min.js',
  'https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // ক্যাশে থাকলে ক্যাশ থেকে দেবে, না থাকলে নেটওয়ার্ক থেকে নেবে
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // বাইরের লাইব্রেরিগুলো ক্যাশে সেভ করে নেবে
          if (event.request.url.startsWith('https://unpkg.com') || event.request.url.startsWith('https://fonts.')) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    }).catch(() => {
        // যদি অফলাইনে থাকে এবং ক্যাশে না পায়
        return caches.match('./index.html');
    })
  );
});

// পুরনো ক্যাশ ডিলিট করার জন্য
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

