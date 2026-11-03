import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const profile = process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-art-upgrade";
const legacy = "manabrew-ipad-offline-fixture-retained-art-v1";
const imagePath = "/a/retained-custom-old-deck.webp";
const browser = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  serviceWorkers: "allow",
});
const page = browser.pages()[0] ?? await browser.newPage();
try {
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const state = document.querySelector("#state")?.textContent ?? "";
    return state.includes("vollständig offline gespeichert") || state.includes("Download erforderlich");
  }, null, { timeout: 90000 });
  if ((await page.locator("#state").innerText()).includes("Download erforderlich")) {
    await page.locator("#prepare").click();
    await page.waitForFunction(() => {
      const state = document.querySelector("#state")?.textContent ?? "";
      return state.includes("Offline-Dateien vollständig gespeichert") ||
        state.includes("Offline-Download unvollständig");
    }, null, { timeout: 600000 });
    const initialState = await page.locator("#state").innerText();
    if (!initialState.includes("vollständig gespeichert")) {
      throw new Error("Initial cache preparation failed: " +
        initialState + " / " + await page.locator("#detail").innerText());
    }
  }
  const fixture = await page.evaluate(async ({ legacy, imagePath }) => {
    const response = await fetch("/offline-assets.json");
    const currentManifest = await response.json();
    const cache = await caches.open("manabrew-ipad-offline-" + currentManifest.version);
    const raw = localStorage.getItem("manabrew-deck-storage");
    const stored = JSON.parse(raw);
    const saved = stored.state.savedDecks;
    const photoUrl = saved[0]?.deck?.cards?.[0]?.uris?.normal;
    const photo = await (await fetch(photoUrl)).blob();
    if (photo.size < 1500 || !photo.type.startsWith("image/")) {
      throw new Error("No valid local art fixture");
    }
    const oldCache = await caches.open(legacy);
    await oldCache.put(imagePath, new Response(photo, {
      headers: { "Content-Type": photo.type },
    }));
    await oldCache.put("/offline-ready.json", new Response("fixture-retained-art-v1"));
    await oldCache.put("/offline-assets.json", new Response(JSON.stringify({
      version: "fixture-retained-art-v1",
      files: [{ url: imagePath, bytes: photo.size, sha256: "fixture" }],
    })));
    saved.push({
      id: "local:fixture-retained-art",
      savedAt: Date.now(),
      deck: { name: "Modified local image fixture", format: "commander",
        cards: [{ identity: { name: "Offline Image Test" },
          uris: { normal: imagePath, art_crop: imagePath } }],
        commanders: [] },
    });
    localStorage.setItem("manabrew-deck-storage", JSON.stringify(stored));
    await cache.delete("/offline-ready.json");
    navigator.serviceWorker.controller?.postMessage({ type: "manabrew-cache-changed" });
    return { version: currentManifest.version, bytes: photo.size, savedDecks: saved.length };
  }, { legacy, imagePath });
  console.log("UPGRADE_ART_FIXTURE", JSON.stringify(fixture));

  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.querySelector("#state")?.textContent?.includes("Download erforderlich"),
    null, { timeout: 90000 });
  await page.locator("#prepare").click();
  await page.waitForFunction(() => {
    const state = document.querySelector("#state")?.textContent ?? "";
    return state.includes("Offline-Dateien vollständig gespeichert") ||
      state.includes("Offline-Download unvollständig");
  }, null, { timeout: 600000 });
  const after = await page.evaluate(async ({ legacy, imagePath }) => {
    const names = await caches.keys();
    const manifest = await (await fetch("/offline-assets.json")).json();
    const cache = await caches.open("manabrew-ipad-offline-" + manifest.version);
    const image = await cache.match(imagePath);
    const marker = await cache.match("/offline-ready.json");
    const saved = JSON.parse(localStorage.getItem("manabrew-deck-storage")).state.savedDecks;
    return {
      status: document.querySelector("#state")?.textContent,
      detail: document.querySelector("#detail")?.textContent,
      cacheNames: names.filter(name => name.startsWith("manabrew-ipad-offline-")),
      description: document.querySelector("#decks")?.textContent,
      ready: !!marker && (await marker.text()) === manifest.version,
      oldCacheDeleted: !names.includes(legacy),
      imageBytes: image ? (await image.blob()).size : 0,
      savedLocalDeck: saved.some(entry => entry.id === "local:fixture-retained-art"),
    };
  }, { legacy, imagePath });
  console.log("UPGRADE_ART_VERIFIED", JSON.stringify(after));
  assert.ok(after.status?.includes("vollständig gespeichert"));
  assert.ok(after.ready && after.oldCacheDeleted && after.savedLocalDeck);
  assert.equal(after.imageBytes, fixture.bytes, "Retained local deck art must survive cache deletion");

  await browser.setOffline(true);
  const offlineImage = await page.evaluate(async (imagePath) => {
    const response = await fetch(imagePath);
    return { status: response.status, bytes: (await response.blob()).size };
  }, imagePath);
  assert.equal(offlineImage.status, 200);
  assert.equal(offlineImage.bytes, fixture.bytes);
  console.log("UPGRADE_RETAINED_ART_OFFLINE_PASS", JSON.stringify(offlineImage));
} finally {
  await browser.close();
}