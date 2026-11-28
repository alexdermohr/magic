import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { stripTypeScriptTypes } from "node:module";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const html = await readFile(new URL("../public/offline-setup.html", import.meta.url), "utf8");
const deckCodec = stripTypeScriptTypes(
  await readFile(new URL("../src/lib/deckStorageCodec.ts", import.meta.url), "utf8"),
);
const oldVersion = "11111111111111111111";
const newVersion = "22222222222222222222";
const laterVersion = "33333333333333333333";
const directVersion = "44444444444444444444";
const failedVersion = "55555555555555555555";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const shared = {
  "/index.html": "<!doctype html><title>offline app</title>",
  "/offline-setup.html": html,
  "/deck-storage-codec.js": deckCodec,
  "/offline-sw.js": await readFile(new URL("../public/offline-sw.js", import.meta.url), "utf8"),
  "/personal-decks.json": JSON.stringify({
    decks: [
      {
        id: "github:alexdermohr/magic:fixture",
        slug: "fixture",
        sourceHash: "fixture-revision",
        deck: { name: "Fixture", format: "commander", cards: [], commanders: [] },
      },
    ],
  }),
  "/wasm/cardset.manifest.json": "{}",
};
let version = oldVersion;
let holdNewAsset = false;
let stallManifest = false;
let stalledManifests = 0;
let assetFailure = null;
let failedAssets = 0;
const blocked = [];
const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Cache-Control", "no-store");
  const asset = version === oldVersion ? "previous release" :
    version === failedVersion ? "another release" : "updated release";
  const files = { ...shared, "/probe.bin": asset };
  if (pathname === "/offline-assets.json") {
    if (stallManifest) {
      stalledManifests++;
      return;
    }
    response.setHeader("Content-Type", "application/json");
    const entries = Object.entries(files).map(([url, body]) => ({
      url,
      bytes: Buffer.byteLength(body),
      sha256: hash(body),
    }));
    response.end(
      JSON.stringify({
        version,
        totalBytes: entries.reduce((sum, file) => sum + file.bytes, 0),
        files: entries,
      }),
    );
  } else if (pathname === "/probe.bin" && version === failedVersion && assetFailure) {
    failedAssets++;
    if (assetFailure === "404") response.writeHead(404).end();
    else response.end("X" + asset.slice(1));
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
    Object.defineProperty(navigator, "standalone", {
      configurable: true, value: sessionStorage.getItem("test-ordinary-browser") !== "1",
    });
  });
  const page = await context.newPage();
  const origin = "http://127.0.0.1:" + server.address().port;
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Download erforderlich"),
  );
  await page.locator("#prepare").click();
  await page.waitForFunction(() =>
    document
      .querySelector("#state")
      ?.textContent?.includes("Offline-Dateien vollständig gespeichert"),
  );
  const hasReady = async (release) =>
    page.evaluate(async (release) => {
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
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
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
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/offline-setup.html?update=1&entry=play");
  await page.waitForFunction(
    () =>
      document.querySelector("#play") &&
      !document.querySelector("#play").classList.contains("disabled"),
  );
  await page.waitForFunction(() => document.querySelector("#prepare")?.disabled);
  for (let i = 0; i < 100 && blocked.length === 0; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(blocked.length, 1, "automatic upgrade must request the changed asset");
  assert.equal(await page.locator("#play").getAttribute("class"), "action");
  assert.equal(await hasReady(oldVersion), true);
  assert.equal(await hasReady(newVersion), false);

  const gameTab = await context.newPage();
  await gameTab.goto(origin + "/play/offline/constructed");
  await gameTab.evaluate(() => {
    const held = new Promise((resolve) => {
      window.__finishGame = resolve;
    });
    void navigator.locks.request("manabrew:forge-autoresume:v1:owner", async (lock) => {
      window.__gameLockOwned = !!lock;
      await held;
    });
  });
  await gameTab.waitForFunction(() => window.__gameLockOwned === true);
  holdNewAsset = false;
  for (const release of blocked.splice(0)) release();
  await page.waitForFunction(() =>
    document
      .querySelector("#state")
      ?.textContent?.includes("Update vorgeladen; gespeicherte Partie geschützt"),
  );
  assert.equal(await hasReady(oldVersion), true);
  assert.equal(await hasReady(newVersion), false);
  await page.locator("#play").click();
  await page.waitForURL((url) => url.pathname === "/play", { timeout: 5000 });
  assert.equal(await hasReady(oldVersion), true);
  assert.equal(await hasReady(newVersion), false);
  console.log("DIRECT_UPDATE_FALLBACK_PLAY_PASS", oldVersion);
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Update vorgeladen; gespeicherte Partie geschützt"),
  );
  await gameTab.evaluate(() => window.__finishGame());
  await gameTab.close();

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
  await page.locator("#prepare").click();
  await page.waitForFunction(() => document.querySelector("#prepare")?.disabled === false);
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
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  assert.equal(await hasReady(newVersion), true);
  assert.equal(
    await page.evaluate(
      async (release) => (await caches.keys()).includes("manabrew-ipad-offline-" + release),
      oldVersion,
    ),
    false,
  );

  version = laterVersion;
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  assert.equal(await hasReady(laterVersion), true);
  assert.equal(
    await page.evaluate(
      async (release) => (await caches.keys()).includes("manabrew-ipad-offline-" + release),
      newVersion,
    ),
    false,
  );
  await page.evaluate(() => sessionStorage.setItem("test-ordinary-browser", "1"));
  version = directVersion;
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play", { timeout: 30000 });
  assert.equal(await page.evaluate(() => navigator.standalone), false);
  assert.equal(await hasReady(directVersion), true);
  console.log("DIRECT_PLAY_ENTRY_AUTO_UPGRADE_PASS", directVersion);
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
  assert.equal(page.url(), origin + "/play");
  await context.setOffline(true);
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
  assert.equal(page.url(), origin + "/play");
  assert.equal(await hasReady(directVersion), true);
  await context.setOffline(false);

  version = failedVersion;
  stallManifest = true;
  const start = performance.now();
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded", timeout: 5000 });
  const elapsed = performance.now() - start;
  stallManifest = false;
  assert.equal(stalledManifests, 1, "the real worker must attempt a network version check");
  assert(elapsed < 1800, "stalled version check delayed cached navigation: " + elapsed + " ms");
  assert.equal(await page.title(), "offline app");
  assert.equal(await hasReady(directVersion), true);
  assert.equal(await hasReady(failedVersion), false);
  console.log("STALLED_MANIFEST_CACHED_PLAY_PASS", Math.round(elapsed));

  for (const [failure, detail] of [["404", "HTTP 404"], ["hash", "SHA-256 oder Dateigröße ungültig"]]) {
    assetFailure = failure;
    const previousFailures = failedAssets;
    await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/offline-setup.html?update=1&entry=play");
    await page.waitForFunction(() =>
      document.querySelector("#state")?.textContent?.includes("Offline-Download unvollständig"),
    );
    assert.match(await page.locator("#detail").innerText(), new RegExp(detail));
    assert(failedAssets > previousFailures);
    assert.equal(await hasReady(directVersion), true);
    assert.equal(await hasReady(failedVersion), false);
    assert.equal(await page.locator("#play").getAttribute("class"), "action");
    await page.locator("#play").click();
    await page.waitForURL("**/play?use-installed=1");
    assert.equal(await page.title(), "offline app");
    const attempts = failedAssets;
    await page.waitForTimeout(1000);
    assert.equal(page.url(), origin + "/play?use-installed=1");
    assert.equal(failedAssets, attempts, "manual fallback must not restart the failed download");
    assert.equal(await hasReady(directVersion), true);
    assert.equal(await hasReady(failedVersion), false);
    console.log("FAILED_ASSET_FALLBACK_PLAY_PASS", failure);
  }
  assetFailure = null;
  await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play", { timeout: 30000 });
  await page.waitForFunction(async (release) => {
    const cache = await caches.open("manabrew-ipad-offline-" + release);
    return (await (await cache.match("/offline-ready.json"))?.text()) === release;
  }, failedVersion);
  assert.equal(await hasReady(directVersion), false);
  assert.equal(await hasReady(failedVersion), true);
  console.log("FAILED_ASSET_RECOVERY_PASS", failedVersion);

  console.log(
    "IPAD_AUTO_UPGRADE_PASS",
    JSON.stringify({
      previous: oldVersion,
      current: failedVersion,
      savedGameProtected: true,
      previousVersionPlayable: true,
      manualUpgradeRoutedToGame: true,
      unattendedUpgradeRoutedToGame: true,
    }),
  );
  await context.close();
} finally {
  for (const release of blocked.splice(0)) release();
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
