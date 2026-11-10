/**
 * Real offline PWA game reload proof. Prerequisite: install this exact test
 * build through test-ipad-offline.mjs with the same persistent Chrome profile.
 * No page-store test hooks, fake engine states or manual restore shortcuts.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";

const origin = process.argv[2] ?? "http://127.0.0.1:8110";
const profile = process.env.MANABREW_TEST_PROFILE ?? join(tmpdir(), "manabrew-ipad-recovery-reload");
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
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const snapshot = () => page.evaluate(() => {
  const body = document.body.innerText;
  const decisions = window.__engineDecisions ?? [];
  return {
    board: body.includes("Game board controls"),
    prompt: decisions.at(-1)?.type ?? null,
    decisions: decisions.length,
    offline: !navigator.onLine,
    turn: (body.match(/current step ([^\n]+)/) ?? [])[1] ?? null,
    hand: Number((body.match(/Your hand, ([0-9]+) cards?/) ?? [])[1] ?? 0),
    life: [...body.matchAll(/Inspect (you|Forge AI), (-?\d+) life/g)].map((m) => [m[1], +m[2]]),
  };
});
const savedBoundary = () => page.evaluate(async () => {
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
        resolve(s ? {
          gameId: s.gameId,
          nextSequence: s.nextSequence,
          releaseId: s.releaseId,
        } : null);
      };
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
});
const takeAction = async (current) => {
  if (current.turn === "Cleanup" && current.hand > 7) {
    for (let n = 0; n < current.hand - 7; n++) {
      await page.touchscreen.tap([175, 465, 753, 1037][n % 4], n < 4 ? 235 : 525);
      await page.waitForTimeout(70);
    }
    await page.touchscreen.tap(495, 783);
  } else if (current.prompt === "revealCards" || current.prompt === "reorder") {
    await page.keyboard.press("Enter");
  } else {
    // The debug-only decision timing ring resets on full document reload,
    // even when the restored engine already has a valid live prompt.
    await page.touchscreen.tap(1032, 765);
  }
};
const awaitJournalAdvance = async (prior) => {
  assert(prior && prior.nextSequence >= 1);
  for (let attempt = 0; attempt < 22; attempt++) {
    const next = await savedBoundary();
    if (next?.nextSequence > prior.nextSequence) {
      assert.equal(next.gameId, prior.gameId);
      assert.equal(next.releaseId, prior.releaseId);
      return { ui: await snapshot(), save: next, actionsTried: attempt };
    }
    const now = await snapshot();
    assert(now.board && now.offline);
    await takeAction(now);
    await page.waitForTimeout(1300);
  }
  throw new Error("Forge did not commit another decision: " +
    JSON.stringify({ previous: prior, ui: await snapshot(), save: await savedBoundary() }));
};

try {
  // The service worker should already have installed all offline assets.
  await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await page.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await page.getByRole("button", { name: /^Fight!?$/ }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await page.getByRole("button", { name: /^KEEP$/ }).waitFor({ timeout: 180000 });
  await page.getByRole("button", { name: /^KEEP$/ }).click();
  await page.waitForFunction(
    () => (window.__engineDecisions ?? []).some((d) => d.type === "chooseAction"),
    null,
    { timeout: 120000 },
  );
  let firstSave = null;
  for (let i = 0; i < 40 && !firstSave; i++) {
    firstSave = await savedBoundary();
    if (!firstSave) await page.waitForTimeout(250);
  }
  assert(firstSave, "Forge never committed the initial recovery boundary");
  for (let i = 0; i < 2; i++) firstSave = (await awaitJournalAdvance(firstSave)).save;
  // Wait for the real engine's private journal write to commit.
  await page.waitForFunction(async () => {
    const db = await new Promise((resolve, reject) => {
      const q = indexedDB.open("manabrew-forge-autoresume-v1");
      q.onsuccess = () => resolve(q.result); q.onerror = () => reject(q.error);
    });
    try {
      const data = await new Promise((resolve) => {
        const tx = db.transaction("current", "readonly");
        const q = tx.objectStore("current").get("active");
        q.onsuccess = () => resolve(q.result);
      });
      return data?.nextSequence >= 3;
    } finally {
      db.close();
    }
  }, null, { timeout: 60000 });
  const before = { ui: await snapshot(), save: await savedBoundary() };
  assert(before.save?.nextSequence >= 3);
  assert(before.ui.board && before.ui.offline);
  // This kills and replaces the actual WebWorker as Safari does, while the
  // IndexedDB and service-worker installation stay on the same device.
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.body.innerText.includes("Game board controls"),
    null,
    { timeout: 180000 },
  );
  const resumed = { ui: await snapshot(), save: await savedBoundary() };
  assert(resumed.ui.board && resumed.ui.offline);
  assert.equal(resumed.save?.gameId, before.save.gameId, "reloaded game must be the SAME session");
  assert.equal(resumed.save?.releaseId, before.save.releaseId);
  assert(resumed.save?.nextSequence >= before.save.nextSequence);
  assert.deepEqual(resumed.ui.life, before.ui.life, "life total must not reset");
  // A painting of the old board is insufficient: a new legal decision
  // must be accepted by the reconstructed engine after replay verification.
  const continuedResult = await awaitJournalAdvance(resumed.save);
  const continued = continuedResult.ui;
  assert(continued.board && continued.offline);
  assert(continuedResult.save.nextSequence > resumed.save.nextSequence);
  assert.deepEqual(errors, [], "No JavaScript errors during the real reload game");
  console.log("REAL_OFFLINE_FORGE_AUTO_RESUME_PASS", JSON.stringify({
    before, resumed, continued,
    committedAfterReload: continuedResult.save,
    actionAfterReloadAccepted: true, errors,
  }));
} finally {
  await context.close();
}
