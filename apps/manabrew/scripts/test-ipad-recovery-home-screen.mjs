/**
 * iPad Home Screen relaunch regression. Run after a genuine Forge game has
 * been saved by test-ipad-recovery-reload.mjs with the SAME Chrome profile.
 * Simulate a newer server manifest while the old WebImage remains fully
 * installed, then repeat the icon start offline. This is Chromium, not Safari.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";

const origin = process.argv[2] ?? "http://127.0.0.1:8118";
const profile = process.env.MANABREW_TEST_PROFILE ?? join(tmpdir(), "manabrew-ipad-home-screen-replay");
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
  // Chromium has no Apple-specific property, but Safari Home Screen does.
  Object.defineProperty(navigator, "standalone", { configurable: true, value: true });
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const saved = () => page.evaluate(async () => {
  const request = indexedDB.open("manabrew-forge-autoresume-v1");
  const db = await new Promise((ok, no) => {
    request.onsuccess = () => ok(request.result);
    request.onerror = () => no(request.error);
  });
  try {
    return await new Promise((ok, no) => {
      const tx = db.transaction("current", "readonly");
      const request = tx.objectStore("current").get("active");
      request.onsuccess = () => {
        const meta = request.result;
        ok(meta ? {
          gameId: meta.gameId,
          releaseId: meta.releaseId,
          nextSequence: meta.nextSequence,
          verification: meta.verification,
        } : null);
      };
      request.onerror = () => no(request.error);
    });
  } finally {
    db.close();
  }
});
const state = () => page.evaluate(() => {
  const body = document.body.innerText;
  return {
    board: body.includes("Game board controls"),
    offline: !navigator.onLine,
    hand: Number((body.match(/Your hand, ([0-9]+) cards?/) ?? [])[1] ?? 0),
    turn: (body.match(/current step ([^\n]+)/) ?? [])[1] ?? null,
    prompt: (window.__engineDecisions ?? []).at(-1)?.type ?? null,
  };
});
const waitBoard = async () => {
  await page.waitForURL(/\/play\/offline\/constructed/, { timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Game board controls"),
    null,
    { timeout: 180000 },
  );
  assert((await state()).board);
};
const advance = async (prior) => {
  for (let i = 0; i < 45; i++) {
    const current = await state();
    assert(current.board && current.offline);
    // A transient success notification must not steal touches intended
    // for the right-hand Pixi PASS control.
    await page.waitForFunction(
      () => !document.querySelector("[data-sonner-toast]"),
      null, { timeout: 15000 },
    );
    if (current.turn === "Cleanup" && current.hand > 7) {
      for (let n = 0; n < current.hand - 7; n++) {
        await page.touchscreen.tap([175, 465, 753, 1037][n % 4], n < 4 ? 235 : 525);
        await page.waitForTimeout(70);
      }
      await page.touchscreen.tap(495, 783);
    } else if (current.prompt === "revealCards" || current.prompt === "reorder") {
      await page.keyboard.press("Enter");
    } else {
      await page.touchscreen.tap(1032, 765);
    }
    await page.waitForTimeout(1450);
    const next = await saved();
    if (next?.nextSequence > prior.nextSequence) return next;
  }
  throw Error("Recovered Home Screen game did not accept another decision: " +
    JSON.stringify({ previous: prior, current: await saved(), view: await state() }));
};

try {
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  const before = await saved();
  assert(before?.gameId && before?.releaseId && before.nextSequence > 1,
    "Prerequisite: genuine game with committed journal from previous E2E");
  const newerVersion = before.releaseId === "b".repeat(20) ? "c".repeat(20) : "b".repeat(20);
  await page.route((url) => url.pathname === "/offline-assets.json" &&
    url.searchParams.has("__offline_fetch"), async (route) => {
    const network = await route.fetch();
    const newer = await network.json();
    newer.version = newerVersion;
    await route.fulfill({ json: newer });
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.getElementById("state")?.textContent?.includes("Download erforderlich"),
    null,
    { timeout: 60000 },
  );
  // Explicit setup really sees a newer server version. It does not update
  // or discard the currently installed cache or the unfinished game.
  assert.equal((await saved())?.gameId, before.gameId);

  // iPadOS restarts the Home Screen PWA from the manifest's installer URL.
  // The installer must open the existing game, not gate on the new manifest.
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await waitBoard();
  const onlineRelaunch = await saved();
  assert.equal(onlineRelaunch?.gameId, before.gameId);
  assert.equal(onlineRelaunch?.releaseId, before.releaseId);
  assert(onlineRelaunch.nextSequence >= before.nextSequence);

  // Repeat the exact same PWA entry path without *any* server connection.
  await context.setOffline(true);
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await waitBoard();
  const offlineRelaunch = await saved();
  assert.equal(offlineRelaunch?.gameId, before.gameId);
  assert.equal(offlineRelaunch?.releaseId, before.releaseId);
  assert(offlineRelaunch.nextSequence >= onlineRelaunch.nextSequence);
  assert((await state()).offline);

  const committed = await advance(offlineRelaunch);
  assert.equal(committed.gameId, before.gameId);
  assert.equal(committed.releaseId, before.releaseId);
  assert(committed.nextSequence > offlineRelaunch.nextSequence);
  assert.deepEqual(errors, []);
  console.log("OFFLINE_HOME_SCREEN_AUTO_RESUME_PASS", JSON.stringify({
    sameGame: committed.gameId === before.gameId,
    installedRelease: committed.releaseId,
    newerServerManifestIgnored: true,
    relaunchedViaInstaller: true,
    reloadedOffline: true,
    journalBefore: before.nextSequence,
    journalAfter: committed.nextSequence,
    resumedActionCommitted: true,
    errors,
  }));
} finally {
  await context.close();
}