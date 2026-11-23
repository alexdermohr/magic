import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { stripTypeScriptTypes } from "node:module";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const html = await readFile(new URL("../public/offline-setup.html", import.meta.url), "utf8");
const worker = await readFile(new URL("../public/offline-sw.js", import.meta.url), "utf8");
const codec = stripTypeScriptTypes(
  await readFile(new URL("../src/lib/deckStorageCodec.ts", import.meta.url), "utf8"),
);
const recoverySource = await readFile(
  new URL("../src/lib/forgeAutoResumeStore.ts", import.meta.url), "utf8",
);
const runtimeImport = 'import { FORGE_LAUNCHER_URL, FORGE_WASM_URL } from "@/lib/forgeWasm";';
assert.ok(recoverySource.includes(runtimeImport));
const recoveryRuntime = stripTypeScriptTypes(recoverySource.replace(
  runtimeImport,
  'const FORGE_LAUNCHER_URL = "/assets/test-forge-launcher"; const FORGE_WASM_URL = "/assets/test-forge.wasm";',
));
const oldVersion = "11111111111111111111";
const newVersion = "22222222222222222222";
const hash = (text) => createHash("sha256").update(text).digest("hex");

let version = oldVersion;
const filesFor = (release) => ({
  "/index.html": "<!doctype html><body>" +
    (release === oldVersion ? "OLD_UNRECOVERABLE_GAME" : "NEW_PLAYABLE_GAME") + "</body>",
  "/offline-setup.html": release === oldVersion
    ? html.replace("</main>", '<p id="legacy-installer-marker">Old installer</p></main>')
    : html,
  "/offline-sw.js": worker,
  "/deck-storage-codec.js": codec,
  "/forge-recovery-runtime.js": recoveryRuntime,
  "/personal-decks.json": JSON.stringify({
    decks: [{
      id: "github:alexdermohr/magic:fixture",
      slug: "fixture",
      sourceHash: "fixture-revision",
      deck: { name: "Fixture", format: "commander", cards: [], commanders: [] },
    }],
  }),
  "/wasm/cardset.manifest.json": "{}",
});
const server = createServer((request, response) => {
  const { pathname } = new URL(request.url, "http://127.0.0.1");
  for (const [header, value] of [
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["Cross-Origin-Embedder-Policy", "require-corp"],
    ["Cross-Origin-Resource-Policy", "same-origin"],
    ["Cache-Control", "no-store"],
  ]) response.setHeader(header, value);
  const files = filesFor(version);
  if (pathname === "/offline-assets.json") {
    const entries = Object.entries(files).map(([url, body]) => ({
      url, bytes: Buffer.byteLength(body), sha256: hash(body),
    }));
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({
      version,
      totalBytes: entries.reduce((total, file) => total + file.bytes, 0),
      files: entries,
    }));
  } else if (pathname in files) {
    response.setHeader("Content-Type", pathname.endsWith(".html") ? "text/html" :
      pathname.endsWith(".js") ? "application/javascript" : "application/json");
    response.end(files[pathname]);
  } else if (pathname === "/play" || pathname === "/play/offline/constructed") {
    response.setHeader("Content-Type", "text/html");
    response.end(files["/index.html"]);
  } else {
    response.statusCode = 404;
    response.end("Not found");
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
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const origin = "http://127.0.0.1:" + server.address().port;
  const launcher = origin + "/offline-setup.html?desktop=1&entry=play";

  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#state")?.textContent?.includes("Download erforderlich"));
  await page.locator("#prepare").click();
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Offline-Dateien vollständig gespeichert"),
  );
  const isReady = (release) => page.evaluate(async (release) => {
    const cache = await caches.open("manabrew-ipad-offline-" + release);
    return (await (await cache.match("/offline-ready.json"))?.text()) === release;
  }, release);
  assert.equal(await isReady(oldVersion), true);

  const original = {
    version: 1, gameId: "historical-commander",
    releaseId: oldVersion, nextSequence: 3, updatedAt: 1760000000000,
    launch: { engine: "Forge", aiController: "forge", formatId: "commander" },
    startRequest: '{"decisionJournal":true}', prompt: { decidingPlayerId: "player-0" },
    verification: { state: "a".repeat(64), rng: "22:abc" },
  };
  const journal = [1, 2].map((sequence) => ({
    sequence, playerIndex: 0,
    prompt: { decidingPlayerId: "player-0" }, action: { choice: sequence },
    verification: { state: "b".repeat(64), rng: sequence + ":f" },
  }));

  await page.evaluate(async ({ original, journal }) => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("manabrew-forge-autoresume-v1", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("current");
        req.result.createObjectStore("entries");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction(["current", "entries"], "readwrite");
      tx.objectStore("current").put(original, "active");
      for (const entry of journal) tx.objectStore("entries").put(entry, entry.sequence);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, { original, journal });
  version = newVersion;

  await page.goto(launcher, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  await assert.match(await page.locator("body").innerText(), /OLD_UNRECOVERABLE_GAME/);
  assert.equal(await isReady(oldVersion), true);
  assert.equal(await isReady(newVersion), false);

  await page.goto(launcher, { waitUntil: "domcontentloaded" });
  await page.locator("#recovery-options").waitFor({ state: "visible", timeout: 25000 });
  assert.equal(await isReady(oldVersion), true);

  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.locator("#recovery-options").waitFor({ state: "visible" });

  const playingTab = await context.newPage();
  await playingTab.goto(origin + "/play/offline/constructed");
  await playingTab.evaluate(() => {
    window.__releaseOwnerLock = null;
    const promise = new Promise((resolve) => { window.__releaseOwnerLock = resolve; });
    void navigator.locks.request("manabrew:forge-autoresume:v1:owner",
      async () => { window.__ownerLockHeld = true; await promise; });
  });
  await playingTab.waitForFunction(() => window.__ownerLockHeld === true);
  await page.locator("#recover-new").click();
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Partie konnte nicht sicher abgelegt werden"),
  );
  assert.equal(await page.locator("#recover-new").isEnabled(), true);
  assert.equal(await isReady(oldVersion), true);
  assert.equal(await isReady(newVersion), false);
  await playingTab.evaluate(() => window.__releaseOwnerLock());
  await playingTab.close();

  await page.locator("#recover-new").click();
  await page.waitForURL("**/play/offline/constructed", { timeout: 60000 });
  await assert.match(await page.locator("body").innerText(), /NEW_PLAYABLE_GAME/);
  assert.equal(await isReady(newVersion), true);
  assert.equal(await isReady(oldVersion), false, "Only the active release may carry a READY marker");
  const retainedOldVersion = await page.evaluate(async (version) =>
    (await (await (await caches.open("manabrew-ipad-offline-" + version))
      .match("/offline-retained.json"))?.text()) === version, oldVersion);
  assert.equal(retainedOldVersion, true, "Old offline engine must remain available");

  const archived = await page.evaluate(async () => {
    const req = indexedDB.open("manabrew-forge-recovery-archives-v1", 1);
    const db = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const all = await new Promise((resolve, reject) => {
      const tx = db.transaction("saves", "readonly");
      const get = tx.objectStore("saves").getAll();
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject(get.error);
    });
    db.close();
    const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
    const source = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const active = await new Promise((resolve, reject) => {
      const tx = source.transaction("current", "readonly");
      const get = tx.objectStore("current").get("active");
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject(get.error);
    });
    source.close();
    return { all, active };
  });
  assert.equal(archived.active, undefined);
  assert.equal(archived.all.length, 1);
  assert.deepEqual(archived.all[0].meta, original);
  assert.deepEqual(archived.all[0].entries, journal);

  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.locator("#archived-list button").first().click();
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  await assert.match(await page.locator("body").innerText(), /OLD_UNRECOVERABLE_GAME/);
  const actualRecoveryRelease = await page.evaluate(async () =>
    (await import("/forge-recovery-runtime.js")).installedForgeRecoveryReleaseId(),
  );
  assert.equal(actualRecoveryRelease, oldVersion,
    "The actual Forge client must select the archived engine, not the newer ready cache");
  const actualReplay = await page.evaluate(async () => {
    const store = await import("/forge-recovery-runtime.js");
    const release = await store.forgeRecoveryReleaseId();
    const save = await store.readForgeRecoverySave(release);
    return {
      release,
      gameId: save?.gameId,
      nextSequence: save?.replaySnapshot.nextSequence,
      entries: save?.replaySnapshot.journal.entries.length,
    };
  });
  assert.deepEqual(actualReplay, {
    release: oldVersion, gameId: original.gameId,
    nextSequence: original.nextSequence, entries: journal.length,
  });
  const legacyRelease = await page.evaluate(async () => {
    const prefix = "manabrew-ipad-offline-";
    const names = (await caches.keys()).filter((name) => name.startsWith(prefix)).reverse();
    for (const name of names) {
      const version = name.slice(prefix.length);
      if (!/^[a-f0-9]{20,64}$/.test(version)) continue;
      const cache = await caches.open(name);
      const [marker, index, manifestResponse] = await Promise.all([
        cache.match("/offline-ready.json"),
        cache.match("/index.html"),
        cache.match("/offline-assets.json"),
      ]);
      if (!marker || !index || !manifestResponse || await marker.text() !== version) continue;
      const manifest = await manifestResponse.json();
      if (manifest?.version === version && Array.isArray(manifest.files)) return version;
    }
    return null;
  });
  assert.equal(legacyRelease, oldVersion,
    "Already cached clients without selected-release support must also see the active archived release");
  await context.setOffline(true);
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.locator("#recovery-options").waitFor({ state: "visible" });
  assert.equal(await page.locator("#legacy-installer-marker").count(), 0,
    "The newest cached installer must remain available while an older engine is selected");
  await context.setOffline(false);
  const restored = await page.evaluate(async () => {
    const req = indexedDB.open("manabrew-forge-autoresume-v1", 1);
    const db = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const result = await new Promise((resolve, reject) => {
      const tx = db.transaction(["current", "entries"], "readonly");
      const a = tx.objectStore("current").get("active");
      const b = tx.objectStore("entries").getAll();
      tx.oncomplete = () => resolve({ meta: a.result, entries: b.result });
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return result;
  });
  assert.deepEqual(restored.meta, original);
  assert.deepEqual(restored.entries, journal);

  version = oldVersion;
  await page.goto(launcher, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  await page.goto(launcher, { waitUntil: "domcontentloaded" });
  await page.locator("#recovery-options").waitFor({ state: "visible" });
  await page.locator("#recover-new").click();
  await page.waitForURL("**/play", { timeout: 30000 });
  await assert.match(await page.locator("body").innerText(), /OLD_UNRECOVERABLE_GAME/);
  assert.equal(await isReady(oldVersion), true);

  version = newVersion;
  await page.goto(launcher, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/play", { timeout: 30000 });
  await assert.match(await page.locator("body").innerText(), /NEW_PLAYABLE_GAME/);
  const currentRelease = await page.evaluate(async () => {
    const selected = await (await caches.open("manabrew-ipad-selected-release-v1"))
      .match("/selected-release");
    const client = await import("/forge-recovery-runtime.js");
    return {
      selected: await selected?.text(),
      appRelease: await client.installedForgeRecoveryReleaseId(),
    };
  });
  assert.deepEqual(currentRelease, {
    selected: newVersion,
    appRelease: newVersion,
  });

  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.locator("#archived-list button").first().click();
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  const rewoundMeta = { ...original, updatedAt: original.updatedAt + 1000 };
  const rewoundJournal = journal.map((entry) => entry.sequence === 2 ?
    { ...entry, action: { choice: 42 } } : entry);
  await page.evaluate(async ({ rewoundMeta, rewoundJournal }) => {
    const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
    const db = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction(["current", "entries"], "readwrite");
      tx.objectStore("current").put(rewoundMeta, "active");
      for (const entry of rewoundJournal) tx.objectStore("entries").put(entry, entry.sequence);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, { rewoundMeta, rewoundJournal });
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.locator("#recovery-options").waitFor({ state: "visible" });
  await page.locator("#recover-new").click();
  await page.waitForURL("**/play/offline/constructed", { timeout: 12000 });
  assert.match(await page.locator("body").innerText(), /NEW_PLAYABLE_GAME/);
  const divergentArchives = await page.evaluate(async () => {
    const request = indexedDB.open("manabrew-forge-recovery-archives-v1", 1);
    const db = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const saves = await new Promise((resolve, reject) => {
      const request = db.transaction("saves", "readonly").objectStore("saves").getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return saves;
  });
  assert.equal(divergentArchives.length, 2,
    "A rewind checkpoint at the same decision count must be a separate archive");
  assert.ok(divergentArchives.some((saved) =>
    JSON.stringify(saved.meta) === JSON.stringify(original) &&
    JSON.stringify(saved.entries) === JSON.stringify(journal)));
  assert.ok(divergentArchives.some((saved) =>
    JSON.stringify(saved.meta) === JSON.stringify(rewoundMeta) &&
    JSON.stringify(saved.entries) === JSON.stringify(rewoundJournal)));


  const rewoundArchiveIndex = divergentArchives.findIndex((saved) =>
    JSON.stringify(saved.meta) === JSON.stringify(rewoundMeta));
  assert.ok(rewoundArchiveIndex >= 0);
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.locator("#archived-list button").nth(rewoundArchiveIndex).click();
  await page.waitForURL("**/play/offline/constructed", { timeout: 30000 });
  const rewoundRestored = await page.evaluate(async () => {
    const request = indexedDB.open("manabrew-forge-autoresume-v1", 1);
    const db = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const saved = await new Promise((resolve, reject) => {
      const tx = db.transaction(["current", "entries"], "readonly");
      const meta = tx.objectStore("current").get("active");
      const entries = tx.objectStore("entries").getAll();
      tx.oncomplete = () => resolve({ meta: meta.result, entries: entries.result });
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return saved;
  });
  assert.deepEqual(rewoundRestored, { meta: rewoundMeta, entries: rewoundJournal });

  assert.deepEqual(errors, []);
  console.log("SINGLEPLAYER_RECOVERY_ESCAPE_PASS", JSON.stringify({
    firstResumeProtected: true,
    subsequentFailureHasExit: true,
    oldCheckpointArchived: true,
    newOfflineVersionPlayed: true,
    oldEngineRetained: true,
    archivedGameRestored: true,
    sameReleaseEscapeWithoutRedownload: true,
    latestReleaseReactivatedAfterArchivedGame: true,
    legacyClientArchiveSelection: true,
    divergentCheckpointsRetained: true,
  }));
  await context.close();
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
