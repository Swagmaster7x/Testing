// Service worker for the installable web app. Generated into dist/sw.js at build time:
// the build replaces the two placeholders with this build's version and file list.
// It precaches every file of the build, so after the first visit the app runs with no network.
//
// It also adds the cross-origin isolation headers (COOP and COEP, plus CORP) to every file it
// serves, the "coi-serviceworker" technique (M15). A host that cannot send headers still gets an
// isolated page from the second visit on, which the threaded Fairy-Stockfish build needs
// (SharedArrayBuffer). Every file is same-origin, so COEP blocks nothing the app uses.

const VERSION = '__VERSION__';
const ASSETS = __ASSETS__;
const CACHE = `tabletop-${VERSION}`;

const ISOLATION = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/** The same response with the isolation headers added. Opaque and error responses pass as they are. */
function isolated(response) {
  if (!response || response.status === 0 || response.type === 'opaque' || response.type === 'opaqueredirect') return response;
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(ISOLATION)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

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
        .then((hit) => hit || fetch(request))
        .then(isolated),
    );
    return;
  }
  event.respondWith(caches.match(request, { cacheName: CACHE, ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(request)).then(isolated));
});
