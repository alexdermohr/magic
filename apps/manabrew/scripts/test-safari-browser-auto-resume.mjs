/**
 * Browser (not Home Screen) reboot regression. Forge decisions must be saved
 * even when the user plays at the HTTPS URL before installing the full cache.
 * A second Chromium browser process must reopen / and DISPLAY that same game.
 * This tests Safari-like browsing behavior in Chromium, not physical WebKit.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";

const origin = process.argv[2] ?? "http://127.0.0.1:8131";
const profile = process.env.MANABREW_TEST_PROFILE ??
  join(tmpdir(), "manabrew-safari-browser-recovery");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const chrome = async () => chromium.launchPersistentContext(profile, {
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  viewport: { width: 1180, height: 820 },
  isMobile: true,
  hasTouch: true,
  serviceWorkers: "allow",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const readMeta = (page) => page.evaluate(async () => {
  const r = indexedDB.open("manabrew-forge-autoresume-v1");
  const db = await new Promise((ok, no) => {
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
  try {
    return await new Promise((ok, no) => {
      const tx = db.transaction("current", "readonly");
      const req = tx.objectStore("current").get("active");
      req.onsuccess = () => {
        const m = req.result;
        ok(m ? {
          gameId: m.gameId, releaseId: m.releaseId, cursor: m.nextSequence,
        } : null);
      };
      req.onerror = () => no(req.error);
    });
  } finally {
    db.close();
  }
});
const readUI = (page) => page.evaluate(() => {
  const body = document.body.innerText;
  return {
    path: location.pathname,
    board: body.includes("Game board controls"),
    restoring: body.includes("Restoring your saved game…"),
    checking: body.includes("Checking for your saved game…"),
    hand: +(body.match(/Your hand, (\d+) cards?/)?.[1] ?? 0),
    step: body.match(/current step ([^\n]+)/)?.[1] ?? "",
    lastPrompt: (window.__engineDecisions ?? []).at(-1)?.type ?? null,
    fullOfflineCache: false,
  };
});
async function assertNoFullOfflineInstall(page) {
  const names = await page.evaluate(() =>
    caches.keys().then((xs) => xs.filter((x) => x.startsWith("manabrew-ipad-offline-"))));
  const ready = await page.evaluate(async () => {
    for (const key of await caches.keys()) {
      if (!key.startsWith("manabrew-ipad-offline-")) continue;
      if (await (await caches.open(key)).match("/offline-ready.json")) return true;
    }
    return false;
  });
  assert(!ready, "This regression must start with no FULL PWA install");
}
let first = await chrome();
const errors = [];
let page = first.pages()[0] ?? await first.newPage();
page.on("pageerror", (error) => errors.push(error.message));

try {
  // A normal browser user already has decks in local site storage. Seed only
  // the published deck list in this fresh test profile; the real Forge engine
  // must create the game and its private journal without any test hooks.
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  const deckCount = await page.evaluate(async () => {
    const response = await fetch("/personal-decks.json");
    if (!response.ok) throw Error("Published personal decks are unavailable");
    const personal = await response.json();
    const entries = personal.decks.map(({ sourceHash, slug, ...entry }) => entry);
    localStorage.setItem("manabrew-deck-storage", JSON.stringify({
      state: { savedDecks: entries }, version: 8,
    }));
    return entries.length;
  });
  assert.equal(deckCount, 39);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await assertNoFullOfflineInstall(page);
  await page.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await page.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await page.getByRole("button", { name: /^Fight!?$/ }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await page.getByRole("button", { name: /^KEEP$/ }).waitFor({ timeout: 180000 });
  await page.getByRole("button", { name: /^KEEP$/ }).click();
  await page.waitForFunction(
    () => (window.__engineDecisions ?? []).some((d) => d.type === "chooseAction"),
    null, { timeout: 120000 },
  );

  let before;
  for (let i = 0; i < 50; i++) {
    before = await readMeta(page);
    if (before) break;
    await page.waitForTimeout(160);
  }
  assert(before?.gameId && before?.releaseId && before.cursor >= 1,
    "Ordinary browser Forge decisions must have a committed IndexedDB checkpoint");
  assert((await readUI(page)).board);
  await assertNoFullOfflineInstall(page);
  console.log("SAFARI_TAB_JOURNAL_WITHOUT_FULL_CACHE_PASS", JSON.stringify(before));
  await first.close();
  first = null;

  // A new process with the same site storage should enter from / as Safari
  // normally does. The PWA installer must recognize an online-only game and
  // route to the verified old board, not stop at the setup or home screen.
  const second = await chrome();
  try {
    page = second.pages()[0] ?? await second.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin + "/", { waitUntil: "domcontentloaded" });
    let sawRecovery = false;
    let reachedBoard = false;
    const start = Date.now();
    for (let i = 0; i < 600 && Date.now() - start < 180000; i++) {
      let ui;
      try {
        ui = await readUI(page);
      } catch (error) {
        if (/Execution context was destroyed|navigation/i.test(String(error))) {
          await page.waitForTimeout(210);
          continue;
        }
        throw error;
      }
      if (ui.restoring || ui.checking) sawRecovery = true;
      if (ui.board && !ui.restoring && !ui.checking) {
        reachedBoard = true;
        break;
      }
      await page.waitForTimeout(210);
    }
    const displayed = await readUI(page);
    const recovered = await readMeta(page);
    assert(reachedBoard && displayed.board, "Restart must display the actual game board");
    assert(sawRecovery, "Restart must visibly indicate that the old game is loading");
    assert.equal(displayed.path, "/play/offline/constructed");
    assert.equal(recovered?.gameId, before.gameId);
    assert.equal(recovered?.releaseId, before.releaseId);
    assert(recovered.cursor >= before.cursor);
    await assertNoFullOfflineInstall(page);
    console.log("SAFARI_TAB_RELAUNCH_AUTO_NAVIGATION_PASS", JSON.stringify({
      path: displayed.path, restoredSameGame: true,
      recoveryVisible: sawRecovery, noFullOfflineCache: true,
    }));

    // The replayed WebImage must accept one more real player move, not just
    // repaint the board. Only the test profile's IndexedDB is inspected.
    let advanced = false;
    for (let i = 0; i < 36; i++) {
      const ui = await readUI(page);
      assert(ui.board, "The saved game board disappeared during resumed play");
      if (ui.step === "Cleanup" && ui.hand > 7) {
        for (let n = 0; n < ui.hand - 7; n++) {
          await page.touchscreen.tap([175, 465, 753, 1037][n % 4], n < 4 ? 235 : 525);
          await page.waitForTimeout(70);
        }
        await page.touchscreen.tap(495, 783);
      } else if (ui.lastPrompt === "revealCards" || ui.lastPrompt === "reorder") {
        await page.keyboard.press("Enter");
      } else {
        await page.touchscreen.tap(1032, 765);
      }
      await page.waitForTimeout(1300);
      const now = await readMeta(page);
      if (now?.cursor > recovered.cursor) {
        assert.equal(now.gameId, recovered.gameId);
        advanced = true;
        console.log("SAFARI_TAB_RESUMED_ACTION_COMMITTED_PASS", JSON.stringify({
          cursorBefore: recovered.cursor, cursorAfter: now.cursor,
        }));
        break;
      }
    }
    assert(advanced, "The restored browser game must accept another real action");
    assert.deepEqual(errors, [], "No JS errors across the two complete browser processes");
    console.log("SAFARI_TAB_FULL_BROWSER_REBOOT_E2E_PASS", JSON.stringify({
      savedGameVisible: true, autoRedirected: true, actionCommitted: true,
    }));
  } finally {
    await second.close();
  }
} finally {
  if (first) await first.close();
}