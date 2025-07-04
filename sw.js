self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("res-cache-v2").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/app.js",
        "/manifest.json",
        "/assets/icon.png",
        "/assets/nasi-goreng.jpg",
        "/assets/sate-ayam.jpg",
        "/assets/pancake.jpg",
        "/assets/rendang.jpg",
        "/assets/gado-gado.jpg",
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open("res-cache-v2").then(cache => {
          cache.put(e.request, responseToCache);
        });
        return response;
      }).catch(error => {
        console.error("Fetch failed:", error);
      });
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== 'res-cache-v2')
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});
