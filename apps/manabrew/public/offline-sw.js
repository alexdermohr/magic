const OFFLINE_PREFIX = "manabrew-ipad-offline-";
const SETUP_CACHE = "manabrew-ipad-setup-v1";
const READY_MARKER = "/offline-ready.json";
let readyCache = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "manabrew-cache-changed") readyCache = null;
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const setup = await caches.open(SETUP_CACHE);
      await setup.addAll(["/offline-setup.html", "/offline-sw.js"]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function preparedCache() {
  if (readyCache) return readyCache;
  const names = (await caches.keys()).filter((name) => name.startsWith(OFFLINE_PREFIX));
  for (const name of names.reverse()) {
    const cache = await caches.open(name);
    if (await cache.match(READY_MARKER)) {
      readyCache = cache;
      return cache;
    }
  }
  return null;
}

function isolatedNavigation(response) {
  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.searchParams.has("__offline_fetch")) return;
  if (/^\/(?:api|auth|hub-api|spellbook-api|cubecobra-download|scryfall-symbols)(?:\/|$)/.test(url.pathname)) return;

  event.respondWith(
    (async () => {
      const cache = await preparedCache();
      const navigating = request.mode === "navigate";
      const path = url.pathname === "/" ? "/index.html" : url.pathname;

      if (url.pathname === "/offline-assets.json") {
        try {
          const network = await fetch(request);
          if (network.ok) return network;
        } catch {
          // The last successfully prepared manifest remains available offline.
        }
        return (cache && (await cache.match("/offline-assets.json"))) || Response.error();
      }

      // Normal web builds also include offline-setup.html but have no prepared
      // assets. Do not hijack their root route with the offline installer.
      // Staged PWA builds redirect / in index.html until the cache is ready.
      if (navigating && (path === "/offline-setup.html" || (cache && url.pathname === "/"))) {
        try {
          const latest = await fetch("/offline-setup.html", { cache: "no-store" });
          if (latest.ok) return isolatedNavigation(latest);
        } catch {
          // The bundled installer still opens while disconnected.
        }
        const setup = (cache && (await cache.match("/offline-setup.html"))) ||
          (await (await caches.open(SETUP_CACHE)).match("/offline-setup.html"));
        if (setup) return isolatedNavigation(setup);
      }

      if (cache) {
        const hit = await cache.match(navigating ? "/index.html" : path, { ignoreSearch: true });
        if (hit) return navigating ? isolatedNavigation(hit) : hit;
      }

      try {
        return await fetch(request);
      } catch (error) {
        if (navigating) {
          const setup = await (await caches.open(SETUP_CACHE)).match("/offline-setup.html");
          if (setup) return isolatedNavigation(setup);
        }
        throw error;
      }
    })(),
  );
});