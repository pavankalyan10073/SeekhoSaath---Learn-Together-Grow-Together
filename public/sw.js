const CACHE_NAME = "seekhosaath-v3";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === "https://mobqaakpvm.supabase.co") {
    event.respondWith(
      fetch(request).catch((err) => {
        console.error("[sw] supabase fetch failed", err);
        return new Response(JSON.stringify({ error: "Supabase fetch failed" }), {
          headers: { "Content-Type": "application/json" },
          status: 503,
          statusText: "Service Unavailable",
        });
      })
    );
    return;
  }

  if (url.origin !== location.origin) {
    if (request.destination === "font") {
      event.respondWith(
        fetch(request).catch(() => {
          return new Response("", { status: 408, statusText: "Offline" });
        })
      );
      return;
    }
    event.respondWith(
      fetch(request).catch((err) => {
        console.error("[sw] cross-origin fetch failed", err);
        return new Response("", { status: 503, statusText: "Service Unavailable" });
      })
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return new Response(JSON.stringify({ error: "Offline" }), {
              headers: { "Content-Type": "application/json" },
              status: 503,
              statusText: "Service Unavailable",
            });
          });
        })
    );
    return;
  }

  if (request.destination === "image" || request.destination === "font" || request.destination === "style" || request.destination === "script") {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          return caches.match("/");
        });
      })
  );
});
