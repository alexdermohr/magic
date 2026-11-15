import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const handlers = new Map();
let namesRead = 0;
let markerRead = 0;
const offline = new Response("local art", { status: 200 });
const cache = {
  async match(path) {
    if (path === "/offline-ready.json") {
      markerRead += 1;
      return new Response("v1", { status: 200 });
    }
    if (path === "/a/card.webp") return offline.clone();
    return null;
  },
};
const caches = {
  async keys() {
    namesRead += 1;
    return ["manabrew-ipad-offline-v1"];
  },
  async open(name) {
    assert.equal(name, "manabrew-ipad-offline-v1");
    return cache;
  },
};
const worker = {
  location: { origin: "https://manabrew.local" },
  addEventListener(name, callback) {
    handlers.set(name, callback);
  },
};
runInNewContext(await readFile(new URL("../public/offline-sw.js", import.meta.url), "utf8"), {
  self: worker,
  caches,
  URL,
  Headers,
  Response,
  fetch: async () => { throw Error("unexpected network request"); },
});

async function get(path) {
  let result;
  handlers.get("fetch")({
    request: { method: "GET", url: "https://manabrew.local" + path, mode: "cors" },
    respondWith(promise) { result = promise; },
  });
  return result ? (await result).text() : null;
}
for (let n = 0; n < 20; n++) assert.equal(await get("/a/card.webp"), "local art");
assert.equal(namesRead, 1, "offline cache discovery should not repeat for each card image");
assert.equal(markerRead, 1, "offline-ready marker should not be re-read for each asset");
handlers.get("message")({ data: { type: "manabrew-cache-changed" } });
assert.equal(await get("/a/card.webp"), "local art");
assert.equal(namesRead, 2, "new offline cache should be discoverable after installer update");
assert.equal(markerRead, 2);
console.log("SERVICE_WORKER_CACHE_PASS", JSON.stringify({ requests: 21, scans: namesRead, markers: markerRead }));
