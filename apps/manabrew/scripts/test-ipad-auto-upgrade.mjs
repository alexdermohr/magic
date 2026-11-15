import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const html = await readFile(new URL("../public/offline-setup.html", import.meta.url), "utf8");
const oldVersion = "11111111111111111111";
const newVersion = "22222222222222222222";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const shared = {
  "/index.html": "<!doctype html><title>offline app</title>",
  "/offline-setup.html": html,
  "/offline-sw.js": "self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));",
  "/personal-decks.json": JSON.stringify({ decks: [] }),
  "/wasm/cardset.manifest.json": "{}",
};
let version = oldVersion;
let holdNewAsset = false;
const blocked = [];
const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Cache-Control", "no-store");
  const asset = version === oldVersion ? "previous release" : "updated release";
  const files = { ...shared, "/probe.bin": asset };
  if (pathname === "/offline-assets.json") {
    response.setHeader("Content-Type", "application/json");
    const entries = Object.entries(files).map(([url, body]) => ({
      url, bytes: Buffer.byteLength(body), sha256: hash(body),
    }));
    response.end(JSON.stringify({
      version,
      totalBytes: entries.reduce((sum, file) => sum + file.bytes, 0),
      files: entries,
    }));
  } else if (pathname === "/probe.bin" && version === newVersion && holdNewAsset) {
    blocked.push(() => response.end(asset));
  } else if (pathname in files) {
    if (pathname.endsWith(".html")) response.setHeader("Content-Type", "text/html; charset=utf-8");
    if (pathname.endsWith(".js")) response.setHeader("Content-Type", "application/javascript");
    if (pathname.endsWith(".json")) response.setHeader("Content-Type", "application/json");
    response.end(files[pathname]);
  } else if (pathname === "/play/offline/constructed") {
    response.end("<!doctype html><title>Game</title>Old game still available");
  } else {
    response.statusCode = 404;
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({ serviceWorkers: "allow" });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "standalone", { configurable: true, value: true });
  });
  const page = await context.newPage();
  const origin = "http://127.0.0.1:" + server.address().port;
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#state")?.textContent?.includes("Download erforderlich"));
  await page.locator("#prepare").click();
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Offline-Dateien vollständig gespeichert"));
  const hasReady = async (release) => page.evaluate(async (release) => {
    const cache = await caches.open("manabrew-ipad-offline-" + release);
    return (await (await cache.match("/offline-ready.json"))?.text()) === release;
  }, release);
  assert.equal(await hasReady(oldVersion), true);

  await page.evaluate(async (release) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("current");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction("current", "readwrite");
      tx.objectStore("current").put({ releaseId: release, gameId: "saved-game" }, "active");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, oldVersion);
  version = newVersion;
  holdNewAsset = true;
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play/offline/constructed");
  assert.equal(await hasReady(oldVersion), true);
  assert.equal(blocked.length, 0);

  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction("current", "readwrite");
      tx.objectStore("current").delete("active");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.querySelector("#play") && !document.querySelector("#play").classList.contains("disabled"));
  await page.waitForFunction(() => document.querySelector("#prepare")?.disabled);
  for (let i = 0; i < 100 && blocked.length === 0; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(blocked.length, 1, "automatic upgrade must request the changed asset");
  assert.equal(await page.locator("#play").getAttribute("class"), "action");
  assert.equal(await hasReady(oldVersion), true);
  assert.equal(await hasReady(newVersion), false);

  await page.evaluate(async (release) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction("current", "readwrite");
      tx.objectStore("current").put({ releaseId: release, gameId: "racing-game" }, "active");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, oldVersion);
  holdNewAsset = false;
  for (const release of blocked.splice(0)) release();
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Update vorgeladen; gespeicherte Partie geschützt"));
  assert.equal(await hasReady(oldVersion), true);
  assert.equal(await hasReady(newVersion), false);
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction("current", "readwrite");
      tx.objectStore("current").delete("active");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.locator("#prepare").click();
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Offline-Dateien vollständig gespeichert"));
  assert.equal(await hasReady(newVersion), true);
  assert.equal(await page.evaluate(async (release) =>
    (await caches.keys()).includes("manabrew-ipad-offline-" + release), oldVersion), false);
  console.log("IPAD_AUTO_UPGRADE_PASS", JSON.stringify({
    previous: oldVersion, current: newVersion, savedGameProtected: true, previousVersionPlayable: true,
  }));
  await context.close();
} finally {
  for (const release of blocked.splice(0)) release();
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}