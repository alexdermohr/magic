import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const regularManifest = JSON.parse(
  await readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
);
assert.equal(regularManifest.start_url, "/",
  "Standard web home-screen installs must start the application");
assert.ok(!html.includes('navigator.serviceWorker.register("/offline-sw.js"'),
  "Ordinary Manabrew web entrypoint must not register the offline-only worker");

const handlers = new Map();
const visits = [];
const caches = {
  async keys() { return []; },
  async open(name) {
    assert.equal(name, "manabrew-ipad-setup-v1");
    return {
      async match(path) {
        return path === "/offline-setup.html" ? new Response("INSTALLER") : null;
      },
    };
  },
};
const worker = {
  location: { origin: "https://regular-web.local" },
  addEventListener(type, callback) { handlers.set(type, callback); },
};
runInNewContext(await readFile(new URL("../public/offline-sw.js", import.meta.url), "utf8"), {
  self: worker, caches, URL, Headers, Response,
  fetch: async (request) => {
    const path = typeof request === "string" ? request : new URL(request.url).pathname;
    visits.push(path);
    return new Response(path === "/offline-setup.html" ? "INSTALLER" : "REGULAR_APP");
  },
});
async function navigate(path) {
  let resolved;
  handlers.get("fetch")({
    request: { method: "GET", url: "https://regular-web.local" + path, mode: "navigate" },
    respondWith(response) { resolved = response; },
  });
  return await resolved;
}
assert.equal(await (await navigate("/")).text(), "REGULAR_APP",
  "A standard web build must open the application, not the offline installer");
assert.deepEqual(visits, ["/"]);
const installer = await navigate("/offline-setup.html");
assert.equal(await installer.text(), "INSTALLER");
assert.equal(installer.headers.get("Cross-Origin-Embedder-Policy"), "require-corp");
console.log("STANDARD_WEB_NAVIGATION_PASS", JSON.stringify({ root: "REGULAR_APP", offlineSetup: "INSTALLER" }));
