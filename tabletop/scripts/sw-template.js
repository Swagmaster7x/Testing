// Service worker for the installable web app. Generated into dist/sw.js at build time:
// the build replaces the two placeholders with this build's version and file list.
// It precaches every file of the build, so after the first visit the app runs with no network.

const VERSION = '__VERSION__';
const ASSETS = __ASSETS__;
const CACHE = `tabletop-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' })))),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('tabletop-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    // Hash routing means every page is index.html.
    event.respondWith(
      caches
        .match('./index.html', { cacheName: CACHE, ignoreVary: true })
        .then((hit) => hit || caches.match('./', { cacheName: CACHE, ignoreVary: true }))
        .then((hit) => hit || fetch(request)),
    );
    return;
  }
  event.respondWith(caches.match(request, { cacheName: CACHE, ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(request)));
});
