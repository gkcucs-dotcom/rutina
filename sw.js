const CACHE = 'rutina-v3';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './fondo.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Primero intenta internet (así ves siempre la versión más nueva);
// si no hay conexión, usa lo guardado.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(respuesta => {
        const copia = respuesta.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(e.request))
  );
});
