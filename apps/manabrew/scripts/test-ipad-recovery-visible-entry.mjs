/**
 * Verify what the player actually SEES after an iPad Home Screen / Safari boot.
 * Prerequisite: a real Forge game in the same persistent Chrome profile.
 * This is Chromium, not physical Safari.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";

const origin = process.argv[2] ?? "http://127.0.0.1:8130";
const profile = process.env.MANABREW_TEST_PROFILE ??
  join(tmpdir(), "manabrew-ipad-visible-recovery");
const context = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  viewport: { width: 1180, height: 820 },
  isMobile: true,
  hasTouch: true,
  serviceWorkers: "allow",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
await context.addInitScript(() => {
  Object.defineProperty(navigator, "standalone", { configurable: true, value: true });
});
const page = context.pages()[0] ?? await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

async function withMeta(callback) {
  return page.evaluate(async (fn) => {
    const request = indexedDB.open("manabrew-forge-autoresume-v1");
    const db = await new Promise((ok, no) => {
      request.onsuccess = () => ok(request.result);
      request.onerror = () => no(request.error);
    });
    try {
      const meta = await new Promise((ok, no) => {
        const tx = db.transaction("current", "readonly");
        const r = tx.objectStore("current").get("active");
        r.onsuccess = () => ok(r.result);
        r.onerror = () => no(r.error);
      });
      if (fn === "get") return meta ?? null;
      throw Error("Unsupported metadata read");
    } finally {
      db.close();
    }
  }, callback);
}
const readMeta = () => withMeta("get");
const replaceMeta = async (meta) => page.evaluate(async (saved) => {
  const request = indexedDB.open("manabrew-forge-autoresume-v1");
  const db = await new Promise((ok, no) => {
    request.onsuccess = () => ok(request.result);
    request.onerror = () => no(request.error);
  });
  try {
    await new Promise((ok, no) => {
      const tx = db.transaction("current", "readwrite", { durability: "strict" });
      tx.objectStore("current").put(saved, "active");
      tx.oncomplete = ok;
      tx.onerror = () => no(tx.error);
      tx.onabort = () => no(tx.error);
    });
  } finally {
    db.close();
  }
}, meta);
const visibleState = () => page.evaluate(() => {
  const body = document.body.innerText;
  const overlay = [...document.querySelectorAll("h1")]
    .find((x) => /Checking for your saved game|Restoring your saved game|saved game needs its original offline version|saved game could not be restored/.test(x.textContent ?? ""));
  const status = overlay?.textContent?.trim() ?? "";
  return {
    path: location.pathname,
    board: body.includes("Game board controls"),
    restoring: status === "Restoring your saved game…",
    checking: status === "Checking for your saved game…",
    warning: status.includes("saved game needs its original offline version") ||
      status.includes("saved game could not be restored"),
    startup: body.includes("Welcome to"),
    menu: body.includes("Ready to play?") || body.includes("Choose your deck"),
    visibleStatus: status,
    overlayCount: [...document.querySelectorAll('[role="status"], [role="alert"]')]
      .filter((e) => e.querySelector("h1") && /saved game/i.test(e.textContent ?? "")).length,
    offline: !navigator.onLine,
  };
});
const prior = async () => {
  const meta = await readMeta();
  assert(meta?.gameId && meta?.releaseId && meta.nextSequence > 1,
    "A genuine unfinished Forge game must be in IndexedDB");
  return meta;
};

try {
  await context.setOffline(true);
  // A new Chrome process begins on about:blank, where IndexedDB access is
  // forbidden. Establish the PWA origin without auto-launching a game.
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await prior();
  // The iPad may reopen a Home Screen icon, Safari tab URL or root bookmark.
  // All must show recovery progress before revealing the game board.
  for (const route of ["/", "/play", "/offline-setup.html"]) {
    const original = await prior();
    await page.goto(origin + route, { waitUntil: "domcontentloaded" });
    let sawRecovery = false;
    let sawUncoveredMenu = false;
    let reachedBoard = false;
    const start = Date.now();
    for (let i = 0; i < 500 && Date.now() - start < 180000; i++) {
      let state;
      try {
        state = await visibleState();
      } catch (error) {
        // The installer deliberately calls location.replace() as the Home
        // Screen app enters the game route. Its old JS context disappears.
        if (!/Execution context was destroyed|navigation/i.test(String(error))) throw error;
        await page.waitForTimeout(240);
        continue;
      }
      if (state.checking || state.restoring) sawRecovery = true;
      // AppInitGate can briefly own the screen; once it releases, the
      // saved-game gate must cover the normal home/deck-selection menu.
      if (i >= 7 && state.menu && !state.checking && !state.restoring &&
          !state.board && !state.startup && !state.warning) {
        sawUncoveredMenu = true;
      }
      if (state.board && !state.restoring && !state.checking && !state.warning) {
        reachedBoard = true;
        break;
      }
      await page.waitForTimeout(240);
    }
    const ended = await visibleState();
    const recovered = await prior();
    assert(reachedBoard && ended.board && ended.offline, "The resumed board was not displayed");
    assert.equal(ended.path, "/play/offline/constructed", "Must route to the game, not the home page");
    assert.equal(recovered.gameId, original.gameId, "Must display the previous game session");
    assert.equal(recovered.releaseId, original.releaseId, "Must reuse the original engine");
    assert(!sawUncoveredMenu, "The menu was shown while a saved game was being restored");
    assert(sawRecovery, "No visible recovery state was presented to the player");
    console.log("SAVED_GAME_VISIBLE_ON_BOOT_PASS", JSON.stringify({
      entry: route, path: ended.path, gameIdPreserved: true,
      visibleRecovery: sawRecovery, uncoveredMenu: sawUncoveredMenu,
      visibleBoard: reachedBoard, offline: ended.offline,
    }));
  }

  const original = await prior();
  try {
    // A lost or different installed offline engine must not silently route
    // to the home page or erase a valid checkpoint. This deliberately
    // changes only the TEST profile's private metadata.
    await replaceMeta({ ...original, releaseId: "a".repeat(20) });
    await page.goto(origin + "/play", { waitUntil: "domcontentloaded" });
    await page.getByRole("alert").getByText(
      "Your saved game needs its original offline version",
    ).waitFor({ timeout: 25000 });
    const mismatched = await readMeta();
    assert.equal(mismatched.gameId, original.gameId);
    assert.equal(mismatched.releaseId, "a".repeat(20));
    console.log("SAVED_GAME_MISMATCH_VISIBLE_NOT_DELETED_PASS");
  } finally {
    await replaceMeta(original);
  }
  assert.deepEqual(errors, []);
  console.log("VISIBLE_AUTO_RECOVERY_ENTRYPOINT_E2E_PASS", JSON.stringify({
    tested: ["/", "/play", "/offline-setup.html"],
    noUncoveredMenu: true, sameSavedGame: true, versionMismatchExplained: true, errors,
  }));
} finally {
  await context.close();
}