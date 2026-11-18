/**
 * Real 4-seat Forge auto-resume across a FULL Chrome process restart.
 * Prerequisite: the exact PWA build was installed offline in the test profile.
 * Uses real Pixi controls and private IndexedDB metadata only.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:8099";
const profile = process.env.MANABREW_TEST_PROFILE;
if (!profile || !profile.startsWith("/tmp/manabrew-")) {
  throw Error("Set MANABREW_TEST_PROFILE to a dedicated /tmp/manabrew-* test profile");
}
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const options = {
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  viewport: { width: 1180, height: 820 },
  hasTouch: true,
  isMobile: true,
  serviceWorkers: "allow",
  args: ["--no-sandbox", "--disable-dev-shm-usage",
    ...(process.env.MANABREW_TEST_V8_FLAGS
      ? ["--js-flags=" + process.env.MANABREW_TEST_V8_FLAGS]
      : [])],
};
const errors = [];
async function launch() {
  const context = await chromium.launchPersistentContext(profile, options);
  await context.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.__forgePromptMeta = null;
    window.Worker = class extends NativeWorker {
      constructor(url, options) {
        super(url, options);
        if (!String(url).includes("seat-reader")) return;
        this.addEventListener("message", (event) => {
          if (typeof event.data !== "string" || !event.data.startsWith("{")) return;
          try {
            const message = JSON.parse(event.data);
            if (message.kind === "prompt") {
              window.__forgePromptMeta = {
                promptId: message.prompt?.promptId ?? null,
                type: message.prompt?.input?.type ?? null,
              };
            }
          } catch {}
        });
      }
    };
  });
  const page = context.pages()[0] ?? await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await context.setOffline(true);
  return { context, page };
}
async function save(page) {
  return page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const open = indexedDB.open("manabrew-forge-autoresume-v1");
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    try {
      const tx = db.transaction("current", "readonly");
      const result = await new Promise((resolve, reject) => {
        const q = tx.objectStore("current").get("active");
        q.onsuccess = () => resolve(q.result);
        q.onerror = () => reject(q.error);
      });
      return result ? {
        gameId: result.gameId, releaseId: result.releaseId,
        nextSequence: result.nextSequence, updatedAt: result.updatedAt,
      } : null;
    } finally {
      db.close();
    }
  });
}
async function state(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const prompt = window.__forgePromptMeta;
    return {
      board: body.includes("Game board controls"),
      playing: body.includes("Turn stops"),
      offline: !navigator.onLine,
      path: location.pathname,
      prompt: prompt?.type ?? null,
      promptId: prompt?.promptId ?? null,
      step: (body.match(/current step ([^\n]+)/) ?? [])[1] ?? null,
      life: [...body.matchAll(/Inspect (you|Forge AI|Brewy bot(?: \d+)?), (-?\d+) life/g)]
        .map((m) => [m[1], Number(m[2])]),
    };
  });
}
async function act(page, current) {
  if (current.prompt === "chooseBlockers") {
    await page.keyboard.press("Enter");
  } else if (current.prompt === "chooseCards") {
    const skip = page.getByRole("button", { name: /^SKIP$/ });
    if (await skip.count()) await page.keyboard.press("Enter");
    else {
      const card = page.locator('button[aria-label="Activate to select this card"]');
      if (await card.count()) await card.first().click();
      await page.keyboard.press("Enter");
    }
  } else if (["revealCards", "reorder", "chooseBoolean", "chooseFromSelection",
    "scry", "chooseColor", "chooseDamageAssignmentOrder", "chooseCombatDamageAssignment",
    "diceRolled"].includes(current.prompt)) {
    await page.keyboard.press("Enter");
  } else if (current.prompt === "chooseAction" ||
             current.prompt === "chooseAttackers" || current.prompt === null) {
    await page.touchscreen.tap(1032, 765);
  } else {
    await page.keyboard.press("Enter");
  }
}
async function advance(page, prior, tries = 50) {
  for (let i = 0; i < tries; i++) {
    const current = await state(page);
    assert(current.board && current.offline, "Must stay on real offline game board");
    const saved = await save(page);
    if (saved?.gameId === prior.gameId && saved.nextSequence > prior.nextSequence) {
      assert.equal(saved.releaseId, prior.releaseId);
      return { saved, current, attempts: i };
    }
    await act(page, current);
    await page.waitForTimeout(950);
  }
  throw Error("Real Forge journal did not advance after UI actions: " +
    JSON.stringify({ prior, current: await state(page), saved: await save(page) }));
}
let session;
try {
  session = await launch();
  let page = session.page;
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => ![...document.querySelectorAll("div.fixed.inset-0.z-50")]
    .some((node) => node.textContent?.toLowerCase().includes("welcome to")), null, {timeout: 180000});
  await page.getByRole("button", { name: /^Arahbo, Roar of the World/ }).first().click();
  await page.getByRole("button", { name: /^Choose deck for Bot 1$/ }).click();
  await page.getByRole("button", { name: /^Rin and Seri, Inseparable/ }).first().click();
  await page.getByRole("button", { name: /^Add bot$/ }).click();
  await page.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await page.getByRole("button", { name: /^Add bot$/ }).click();
  await page.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await page.getByRole("button", { name: /^Fight!?$/ }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await page.waitForFunction(() => document.body.innerText.includes("Game board controls") &&
    (window.__forgePromptMeta?.type === "mulligan"), null, {timeout: 180000});
  await page.keyboard.press("Space");

  let baseline = null;
  for (let i = 0; i < 120 && !baseline; i++) {
    baseline = await save(page);
    if (!baseline) await page.waitForTimeout(500);
  }
  assert(baseline?.gameId && baseline.releaseId && baseline.nextSequence >= 1);
  console.log("FOUR_PLAYER_RECOVERY_INITIAL", JSON.stringify({baseline, ui: await state(page)}));
  for (let i = 0; i < 4; i++) {
    baseline = (await advance(page, baseline)).saved;
  }
  const before = {saved: baseline, ui: await state(page)};
  assert(before.saved.nextSequence > 4, "A real 4-seat game must have committed decisions");
  assert(before.ui.life.length === 4, "Must actually have four seats");
  console.log("FOUR_PLAYER_BEFORE_BROWSER_EXIT", JSON.stringify(before));
  // Full Chrome process exit, not an in-tab page reload; no game-end action.
  await session.context.close();
  session = null;

  session = await launch();
  page = session.page;
  await page.goto(origin + "/", {waitUntil: "domcontentloaded"});
  await page.waitForFunction(() => document.body.innerText.includes("Game board controls") &&
    location.pathname === "/play/offline/constructed", null, {timeout: 240000});
  const resumed = {saved: await save(page), ui: await state(page)};
  assert(resumed.ui.board && resumed.ui.offline);
  assert.equal(resumed.saved?.gameId, before.saved.gameId);
  assert.equal(resumed.saved?.releaseId, before.saved.releaseId);
  assert(resumed.saved?.nextSequence >= before.saved.nextSequence);
  assert.equal(resumed.ui.life.length, 4, "All 4 seats must be restored");
  if (resumed.saved.nextSequence === before.saved.nextSequence) {
    assert.deepEqual(resumed.ui.life, before.ui.life, "Unchanged journal must restore same life totals");
  }
  console.log("FOUR_PLAYER_AFTER_BROWSER_RESTART", JSON.stringify(resumed));
  const continued = await advance(page, resumed.saved);
  assert(continued.saved.nextSequence > resumed.saved.nextSequence);
  assert.deepEqual(errors, [], "No JavaScript page errors");
  console.log("FOUR_PLAYER_FULL_BROWSER_RESTART_RECOVERY_PASS", JSON.stringify({
    before, resumed, after: continued.saved, newActionAccepted: true, errors,
  }));
} finally {
  if (session) await session.context.close();
}
