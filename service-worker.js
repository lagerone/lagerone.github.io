const version = 1;
const cacheKey = `static-v${version}`;
const pathsToCache = ['/', 'script.js', 'style.css'];

self.addEventListener('install', event => {
  console.log(`Installing version ${version}…`);

  event.waitUntil(
    caches.open(cacheKey).then(cache => {
      cache.addAll(pathsToCache);
    })
  );
});

self.addEventListener('activate', _event => {
  console.log(`Version ${version} now ready to handle fetches!`);
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    event.respondWith(
      event.request.formData().then(async formData => {
        const link = formData.get('link') || '';
        console.log('link', link);
        const responseUrl = await saveBookmark(link);
        return Response.redirect(responseUrl, 303);
      })
    );
    return;
  }

  event.respondWith(
    caches.open(cacheKey).then(async cache => {
      const cacheMatch = await cache.match(event.request);
      if (cacheMatch) {
        console.log(`Serving "${cacheMatch.url}" from cache.`);
        return cacheMatch;
      }
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'POST') {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    (async () => {
      const formData = await event.request.formData();
      const link = formData.get('link') || '';
      const responseUrl = await saveBookmark(link);
      return Response.redirect(responseUrl, 303);
    })()
  );
});
