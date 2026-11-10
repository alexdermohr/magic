import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const html = await readFile(new URL("../public/offline-setup.html", import.meta.url), "utf8");
const oldBytes = Buffer.from("OLD-AAAA");
const newBytes = Buffer.from("NEW-CCCC");
const wrongBytes = Buffer.from("BAD-BBBB");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(oldBytes.length, newBytes.length);
assert.equal(newBytes.length, wrongBytes.length);

// Serve the actual installer with a tiny, real HTTP + Cache API + service-worker
// fixture. A changing release must never mark a same-length wrong asset ready.
let version = "fixture-old";
let assetBytes = oldBytes;
const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Cache-Control", "no-store");
  if (pathname === "/offline-setup.html") {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(html);
  } else if (pathname === "/offline-sw.js") {
    response.setHeader("Content-Type", "application/javascript");
    response.end("self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));" +
      "self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));");
  } else if (pathname === "/offline-assets.json") {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({
      version, totalBytes: newBytes.length,
      files: [{ url: "/probe.bin", bytes: newBytes.length,
        sha256: version === "fixture-old" ? hash(oldBytes) : hash(newBytes) }],
    }));
  } else if (pathname === "/probe.bin") {
    response.setHeader("Content-Type", "application/octet-stream");
    response.end(assetBytes);
  } else {
    response.statusCode = 404;
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = "http://127.0.0.1:" + server.address().port;
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({ serviceWorkers: "allow" });
  const openInstaller = async () => {
    await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() =>
      document.querySelector("#state")?.textContent?.includes("Download erforderlich"),
      null, { timeout: 30000 });
  };
  const runPreparation = async (expected) => {
    await page.locator("#prepare").click();
    await page.waitForFunction((text) =>
      document.querySelector("#state")?.textContent?.includes(text),
      expected, { timeout: 30000 });
  };
  await openInstaller();
  await runPreparation("Offline-Dateien vollständig gespeichert");
  const oldReady = await page.evaluate(async () => {
    const cache = await caches.open("manabrew-ipad-offline-fixture-old");
    return (await (await cache.match("/offline-ready.json")).text());
  });
  assert.equal(oldReady, "fixture-old");

  // A new manifest arrives, but the server changes the matching-length asset
  // during download. The previous usable version must not be deleted.
  version = "fixture-new";
  assetBytes = wrongBytes;
  await openInstaller();
  await runPreparation("Offline-Download unvollständig");
  const failure = await page.locator("#detail").innerText();
  assert.match(failure, /SHA-256 oder Dateigröße ungültig/);
  const failedState = await page.evaluate(async () => {
    const names = await caches.keys();
    const oldCache = await caches.open("manabrew-ipad-offline-fixture-old");
    const newCache = await caches.open("manabrew-ipad-offline-fixture-new");
    return {
      oldRetained: names.includes("manabrew-ipad-offline-fixture-old"),
      oldReady: (await (await oldCache.match("/offline-ready.json")).text()) === "fixture-old",
      newReady: !!(await newCache.match("/offline-ready.json")),
    };
  });
  assert.deepEqual(failedState, { oldRetained: true, oldReady: true, newReady: false });

  // Resume the same partially populated cache with the now-correct asset.
  // The installer must revalidate the cached wrong bytes instead of reusing
  // them merely because their lengths match.
  assetBytes = newBytes;
  await runPreparation("Offline-Dateien vollständig gespeichert");
  const repaired = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open("manabrew-ipad-offline-fixture-new");
    return {
      oldDeleted: !names.includes("manabrew-ipad-offline-fixture-old"),
      ready: (await (await cache.match("/offline-ready.json")).text()) === "fixture-new",
      bytes: await (await cache.match("/probe.bin")).text(),
    };
  });
  assert.equal(repaired.oldDeleted, true);
  assert.equal(repaired.ready, true);
  assert.equal(repaired.bytes, newBytes.toString());
  console.log("IPAD_OFFLINE_SHA256_RELEASE_RACE_PASS", JSON.stringify({ failure, repaired }));

  // In iPad in-app WKWebViews without the required browser entitlement,
  // navigator.serviceWorker may be absent even though WebKit itself works.
  // The installer must direct the user to Safari/Home Screen, not fail opaquely.
  const unsupportedPage = await browser.newPage();
  await unsupportedPage.addInitScript(() => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: undefined,
    });
  });
  await unsupportedPage.goto(origin + "/offline-setup.html?setup=1", {
    waitUntil: "domcontentloaded",
  });
  await unsupportedPage.waitForFunction(
    () => document.querySelector("#state")?.textContent?.includes("Offline-Vorbereitung nicht verfügbar"),
    null, { timeout: 15000 },
  );
  const unsupported = await unsupportedPage.locator("#detail").innerText();
  assert.match(unsupported, /Service Worker\/Cache API/);
  assert.match(unsupported, /Safari/);
  assert.match(unsupported, /Home-Bildschirm/);
  assert.equal(await unsupportedPage.locator("#prepare").isDisabled(), true);
  console.log("IPAD_UNSUPPORTED_IN_APP_WEBVIEW_GUIDANCE_PASS", unsupported);
  await unsupportedPage.close();
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
