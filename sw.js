const CACHE_NAME = 're-fix-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/logo.png',
  '/assets/logo-refix-full.svg',
  '/assets/favicon.svg',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;500&display=swap',
  'https://unpkg.com/lucide@latest'
];

// Установка — кэшируем всё необходимое
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Активация — удаляем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Запросы — сначала сеть, при ошибке кэш (Network First)
self.addEventListener('fetch', event => {
  // Не кэшируем POST, внешние API и wa.me
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('wa.me')) return;
  if (event.request.url.includes('onrender.com/api')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Кэшируем свежий ответ
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Нет сети — отдаём из кэша
        return caches.match(event.request).then(cached => {
          return cached || caches.match('/index.html');
        });
      })
  );
});
