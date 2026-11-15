import assert from "node:assert/strict";
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";

const origin = process.argv[2] ?? "http://127.0.0.1:8185";
const profile = process.env.MANABREW_TEST_PROFILE ??
  join(tmpdir(), "manabrew-recovery-cross-tab");
const context = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  viewport: { width: 1180, height: 820 },
  isMobile: true,
  hasTouch: true,
  serviceWorkers: "allow",
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    ...(process.env.MANABREW_TEST_HOST_RESOLVER_RULES
      ? ["--host-resolver-rules=" + process.env.MANABREW_TEST_HOST_RESOLVER_RULES]
      : []),
  ],
});
const original = context.pages()[0] ?? (await context.newPage());
const errors = [];
original.on("pageerror", (e) => errors.push(e.message));

const savedBoundary = async (page) => page.evaluate(async () => {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open("manabrew-forge-autoresume-v1");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("current", "readonly");
      const request = tx.objectStore("current").get("active");
      request.onsuccess = () => {
        const s = request.result;
        resolve(s ? { gameId: s.gameId, nextSequence: s.nextSequence,
          releaseId: s.releaseId } : null);
      };
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
});
const takeAction = async (page) => {
  const state = await page.evaluate(() => ({
    prompt: (window.__engineDecisions ?? []).at(-1)?.type ?? null,
    step: (document.body.innerText.match(/current step ([^\n]+)/) ?? [])[1],
    hand: Number((document.body.innerText.match(/Your hand, ([0-9]+) cards?/) ?? [])[1] ?? 0),
  }));
  if (state.step === "Cleanup" && state.hand > 7) {
    for (let n = 0; n < state.hand - 7; n++) {
      await page.touchscreen.tap([175, 465, 753, 1037][n % 4], n < 4 ? 235 : 525);
      await page.waitForTimeout(70);
    }
    await page.touchscreen.tap(495, 783);
  } else if (state.prompt === "revealCards" || state.prompt === "reorder") {
    await page.keyboard.press("Enter");
  } else {
    await page.touchscreen.tap(1032, 765);
  }
};
const continueGame = async (page, previous) => {
  for (let i = 0; i < 25; i++) {
    await takeAction(page);
    await page.waitForTimeout(1200);
    const current = await savedBoundary(page);
    if (current?.nextSequence > previous.nextSequence) {
      assert.equal(current.gameId, previous.gameId);
      return current;
    }
  }
  throw new Error("Original/rehydrated game did not commit another decision");
};

try {
  await original.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  const deckCount = await original.evaluate(async () => {
    const response = await fetch("/personal-decks.json");
    if (!response.ok) throw Error("Personal Commander decks are unavailable");
    const personal = await response.json();
    const entries = personal.decks.map(({ sourceHash, slug, ...entry }) => entry);
    localStorage.setItem("manabrew-deck-storage", JSON.stringify({
      state: { savedDecks: entries }, version: 8,
    }));
    return entries.length;
  });
  assert(deckCount >= 2, "Test needs at least two Commander decks");
  await original.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await original.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await original.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await original.getByRole("button", { name: /^Fight!?$/ }).first().click();
  await original.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await original.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await original.getByRole("button", { name: /^KEEP$/ }).waitFor({ timeout: 180000 });
  await original.getByRole("button", { name: /^KEEP$/ }).click();
  await original.waitForFunction(
    () => (window.__engineDecisions ?? []).some((x) => x.type === "chooseAction"),
    null, { timeout: 120000 },
  );
  let first = null;
  for (let i = 0; i < 60 && !first; i++) {
    first = await savedBoundary(original);
    if (!first) await original.waitForTimeout(350);
  }
  assert(first, "Original tab has not written a checkpoint");
  const owned = await original.evaluate(async () => {
    const { held } = await navigator.locks.query();
    return held.some((lock) => lock.name === "manabrew:forge-autoresume:v1:owner");
  });
  assert(owned, "Live Forge tab must hold cross-tab writer ownership");
  console.log("CROSS_TAB_ORIGINAL_GAME_OWNS_LOCK_PASS", JSON.stringify(first));

  const second = await context.newPage();
  second.on("pageerror", (e) => errors.push(e.message));
  await second.goto(origin + "/", { waitUntil: "domcontentloaded" });
  await second.waitForTimeout(8500);
  assert(!(await second.locator("body").innerText()).includes("Game board controls"),
    "Second tab must not reconstruct an independently writable board");
  const lockAfter = await second.evaluate(async () => {
    const { held } = await navigator.locks.query();
    return held.filter((lock) => lock.name === "manabrew:forge-autoresume:v1:owner").length;
  });
  assert.equal(lockAfter, 1, "Exactly one tab must own the Forge writer lock");
  const sameSaved = await savedBoundary(second);
  assert.equal(sameSaved?.gameId, first.gameId);
  console.log("CROSS_TAB_SECOND_TAB_RESTORE_REFUSED_PASS", JSON.stringify(sameSaved));

  await original.bringToFront();
  first = await continueGame(original, first);
  assert.equal((await savedBoundary(second))?.nextSequence, first.nextSequence,
    "Rejected second tab must not corrupt or delete the original journal");
  console.log("CROSS_TAB_ORIGINAL_STILL_COMMITS_PASS", JSON.stringify(first));

  await original.close();
  await second.bringToFront();
  await second.reload({ waitUntil: "domcontentloaded" });
  await second.waitForFunction(
    () => document.body.innerText.includes("Game board controls"),
    null, { timeout: 180000 },
  );
  const restored = await savedBoundary(second);
  assert(restored && restored.gameId === first.gameId);
  assert(restored.nextSequence >= first.nextSequence);
  const continued = await continueGame(second, restored);
  assert(continued.nextSequence > restored.nextSequence);
  assert.deepEqual(errors, [], "No JavaScript page errors across two tabs");
  console.log("CROSS_TAB_OWNER_CLOSE_TRANSFERS_RECOVERY_PASS", JSON.stringify({
    original: first, restored, continued, pageErrors: errors,
  }));
} finally {
  await context.close();
}
