
const CACHE = 'chirripo-app-v1';

const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './logo_bienvenida_fiebre.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin ||
      event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(
      respuesta => respuesta || fetch(event.request)
    )
  );
});
