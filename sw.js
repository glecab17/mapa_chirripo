
const CACHE = 'chirripo-app-v2';

const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './logo_bienvenida_fiebre.png',
  './icon-192.png',
  './icon-512.png',

  // Estilos
  './css/leaflet.css',
  './css/L.Control.Layers.Tree.css',
  './css/L.Control.Locate.min.css',
  './css/qgis2web.css',
  './css/fontawesome-all.min.css',
  './css/leaflet.photon.css',
  './css/leaflet-measure.css',

  // Bibliotecas y funciones del mapa
  './js/qgis2web_expressions.js',
  './js/leaflet.js',
  './js/L.Control.Layers.Tree.min.js',
  './js/L.Control.Locate.min.js',
  './js/leaflet.rotatedMarker.js',
  './js/leaflet.pattern.js',
  './js/leaflet-hash.js',
  './js/Autolinker.min.js',
  './js/rbush.min.js',
  './js/labelgun.min.js',
  './js/labels.js',
  './js/leaflet.photon.js',
  './js/leaflet-measure.js',

  // Datos cartográficos
  './data/Chirripo_Cartografiasenderos_osm_0.js',
  './data/pn_chirripo_sinac_1.js',
  './data/senderos_oficiales_2.js'
];

// Instalación: guardar archivos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      for (const archivo of ARCHIVOS) {
        try {
          await cache.add(archivo);
        } catch (error) {
          console.warn('No se pudo guardar:', archivo, error);
        }
      }
    })
  );
});

// Activación: eliminar versiones anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(async nombres => {
      await Promise.all(
        nombres
          .filter(nombre =>
            nombre.startsWith('chirripo-app-') &&
            nombre !== CACHE
          )
          .map(nombre => caches.delete(nombre))
      );

      await self.clients.claim();
    })
  );
});

// Usar primero los archivos guardados
self.addEventListener('fetch', event => {
  const solicitud = event.request;

  if (solicitud.method !== 'GET') return;

  const url = new URL(solicitud.url);

  // No guardar automáticamente recursos externos
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(solicitud).then(guardado => {
      if (guardado) return guardado;

      return fetch(solicitud).then(respuesta => {
        if (respuesta.ok) {
          const copia = respuesta.clone();

          caches.open(CACHE).then(cache => {
            cache.put(solicitud, copia);
          });
        }

        return respuesta;
      });
    })
  );
});

