const CACHE_NAME = "seekhosaath-v2";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // If precache fails, continue anyway
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

  // Always bypass Supabase API requests
  if (url.origin === "https://mobqaakpvm.supabase.co") {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response("", { status: 503, statusText: "Service Unavailable" });
      })
    );
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For external assets like fonts, try network first
    if (request.destination === "font") {
      event.respondWith(
        fetch(request).catch(() => {
          return new Response("", { status: 408, statusText: "Offline" });
        })
      );
      return;
    }
    event.respondWith(
      fetch(request).catch(() => {
        return new Response("", { status: 503, statusText: "Service Unavailable" });
      })
    );
    return;
  }

  // API requests: network first
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

  // Static assets: cache first
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

  // HTML pages: network first, fallback to cache
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
