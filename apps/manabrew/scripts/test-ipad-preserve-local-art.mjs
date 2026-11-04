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
  args: [
    "--no-sandbox", "--disable-dev-shm-usage",
    ...(process.env.MANABREW_TEST_HOST_RESOLVER_RULES
      ? ["--host-resolver-rules=" + process.env.MANABREW_TEST_HOST_RESOLVER_RULES]
      : []),
  ],
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
    // Simulate two pre-existing GitHub decks from before separate art crops:
    // one unmodified, one with an intentional local change. The source decklist
    // stays byte-identical while the generated metadata must be refreshed.
    const baselineKey = "manabrew-github-deck-baselines-v2";
    const baselines = JSON.parse(localStorage.getItem(baselineKey) ?? "{}");
    const deckHash = async (deck) => {
      const stable = { ...deck };
      delete stable.version;
      for (const field of ["attractions", "contraptions", "schemes", "planes"]) {
        if (Array.isArray(stable[field]) && stable[field].length === 0) delete stable[field];
      }
      const editor = stable.editor;
      if (editor && Object.keys(editor).length === 3 && editor.version === 1 &&
          Array.isArray(editor.tags) && editor.tags.length === 0 &&
          Array.isArray(editor.layouts) && editor.layouts.length === 0) {
        delete stable.editor;
      }
      const bytes = new TextEncoder().encode(JSON.stringify(stable));
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    };
    const [cleanDeck, editedDeck] = saved.slice(0, 2);
    if (!cleanDeck?.id?.startsWith("github:") || !editedDeck?.id?.startsWith("github:") ||
        !baselines[cleanDeck.id] || !baselines[editedDeck.id]) {
      throw new Error("GitHub deck baselines missing");
    }
    for (const entry of [cleanDeck, editedDeck]) {
      const card = entry.deck.cards[0];
      if (!card?.uris?.art_crop || card.uris.art_crop === card.uris.normal) {
        throw new Error("Distinct generated artwork crop fixture missing");
      }
      card.uris.art_crop = card.uris.normal;
      baselines[entry.id].deckHash = await deckHash(entry.deck);
    }
    const localDescription = editedDeck.deck.description + " · manually edited";
    editedDeck.deck.description = localDescription;

    // Old PWA installations have no GitHub deck baselines. Their only
    // difference may be the historic full-card art_crop URLs. In contrast,
    // a real local edit without a baseline must remain protected.
    const [legacyDeck, editedLegacyDeck] = saved.slice(2, 4);
    if (!legacyDeck?.id?.startsWith("github:") ||
        !editedLegacyDeck?.id?.startsWith("github:")) {
      throw new Error("Legacy GitHub fixture decks missing");
    }
    const downgradeLegacyCrops = (entry) => {
      let changed = 0;
      for (const group of ["cards", "commanders", "sideboard", "maybeboard",
                           "companions", "attractions", "contraptions", "schemes", "planes"]) {
        for (const card of entry.deck[group] ?? []) {
          for (const face of [card, card.backFace]) {
            if (face?.uris?.art_crop && face.uris.normal &&
                face.uris.art_crop !== face.uris.normal) {
              face.uris.art_crop = face.uris.normal;
              changed++;
            }
          }
        }
      }
      return changed;
    };
    const legacyDowngraded = downgradeLegacyCrops(legacyDeck);
    const legacyEditedDowngraded = downgradeLegacyCrops(editedLegacyDeck);
    if (!legacyDowngraded || !legacyEditedDowngraded) {
      throw new Error("Legacy full-scan crop fixture missing");
    }
    const legacyEditedDescription = editedLegacyDeck.deck.description + " · local legacy edit";
    editedLegacyDeck.deck.description = legacyEditedDescription;
    delete baselines[legacyDeck.id];
    delete baselines[editedLegacyDeck.id];
    localStorage.setItem(baselineKey, JSON.stringify(baselines));
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
    return { version: currentManifest.version, bytes: photo.size, savedDecks: saved.length,
      cleanDeckId: cleanDeck.id, editedDeckId: editedDeck.id, localDescription,
      legacyDeckId: legacyDeck.id, editedLegacyDeckId: editedLegacyDeck.id,
      legacyEditedDescription, legacyDowngraded };
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
  const after = await page.evaluate(async ({ legacy, imagePath, cleanDeckId, editedDeckId,
                                       localDescription, legacyDeckId, editedLegacyDeckId,
                                       legacyEditedDescription }) => {
    const names = await caches.keys();
    const manifest = await (await fetch("/offline-assets.json")).json();
    const cache = await caches.open("manabrew-ipad-offline-" + manifest.version);
    const image = await cache.match(imagePath);
    const marker = await cache.match("/offline-ready.json");
    const saved = JSON.parse(localStorage.getItem("manabrew-deck-storage")).state.savedDecks;
    const generated = (await (await fetch("/personal-decks.json")).json()).decks;
    const cleanSaved = saved.find(entry => entry.id === cleanDeckId);
    const cleanGenerated = generated.find(entry => entry.id === cleanDeckId);
    const editedSaved = saved.find(entry => entry.id === editedDeckId);
    const editedGenerated = generated.find(entry => entry.id === editedDeckId);
    const legacySaved = saved.find(entry => entry.id === legacyDeckId);
    const legacyGenerated = generated.find(entry => entry.id === legacyDeckId);
    const legacyEditedSaved = saved.find(entry => entry.id === editedLegacyDeckId);
    const legacyBaselines = JSON.parse(localStorage.getItem("manabrew-github-deck-baselines-v2") ?? "{}");
    const cropsUpdated = (oldDeck, freshDeck) => !!oldDeck && !!freshDeck &&
      ["cards", "commanders"].every(group => oldDeck.deck[group].length === freshDeck.deck[group].length &&
        oldDeck.deck[group].every((card, index) => card.uris?.art_crop ===
          freshDeck.deck[group][index].uris?.art_crop));
    return {
      status: document.querySelector("#state")?.textContent,
      detail: document.querySelector("#detail")?.textContent,
      cacheNames: names.filter(name => name.startsWith("manabrew-ipad-offline-")),
      description: document.querySelector("#decks")?.textContent,
      ready: !!marker && (await marker.text()) === manifest.version,
      oldCacheDeleted: !names.includes(legacy),
      imageBytes: image ? (await image.blob()).size : 0,
      savedLocalDeck: saved.some(entry => entry.id === "local:fixture-retained-art"),
      cleanMetadataUpdated: !!cleanSaved && !!cleanGenerated &&
        cleanSaved.deck.cards[0].uris.art_crop === cleanGenerated.deck.cards[0].uris.art_crop &&
        cleanSaved.deck.cards[0].uris.art_crop !== cleanSaved.deck.cards[0].uris.normal,
      localEditsPreserved: !!editedSaved && !!editedGenerated &&
        editedSaved.deck.description === localDescription &&
        editedSaved.deck.cards[0].uris.art_crop === editedSaved.deck.cards[0].uris.normal &&
        editedSaved.deck.cards[0].uris.art_crop !== editedGenerated.deck.cards[0].uris.art_crop,
      legacyMetadataUpdated: cropsUpdated(legacySaved, legacyGenerated) &&
        !!legacyBaselines[legacyDeckId],
      legacyEditPreserved: !!legacyEditedSaved &&
        legacyEditedSaved.deck.description === legacyEditedDescription &&
        legacyEditedSaved.deck.cards[0].uris.art_crop ===
          legacyEditedSaved.deck.cards[0].uris.normal &&
        !legacyBaselines[editedLegacyDeckId],
    };
  }, { legacy, imagePath, cleanDeckId: fixture.cleanDeckId,
    editedDeckId: fixture.editedDeckId, localDescription: fixture.localDescription,
    legacyDeckId: fixture.legacyDeckId, editedLegacyDeckId: fixture.editedLegacyDeckId,
    legacyEditedDescription: fixture.legacyEditedDescription });
  console.log("UPGRADE_ART_VERIFIED", JSON.stringify(after));
  assert.ok(after.status?.includes("vollständig gespeichert"));
  assert.ok(after.ready && after.oldCacheDeleted && after.savedLocalDeck);
  assert.ok(after.cleanMetadataUpdated, "Unmodified GitHub deck must receive new artwork metadata");
  assert.ok(after.localEditsPreserved, "Locally edited GitHub deck must not be overwritten");
  assert.ok(after.legacyMetadataUpdated, "Unmodified deck without baseline must receive corrected legacy artwork");
  assert.ok(after.legacyEditPreserved, "Locally edited legacy deck without baseline must remain untouched");
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