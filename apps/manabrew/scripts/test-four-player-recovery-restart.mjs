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
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
};
const startFlags = process.env.MANABREW_TEST_V8_FLAGS ?? "";
const restartFlags = process.env.MANABREW_TEST_RESTART_V8_FLAGS ?? startFlags;
const decisions = Number(process.env.MANABREW_TEST_REPLAY_DECISIONS ?? 4);
assert(Number.isSafeInteger(decisions) && decisions >= 4 && decisions <= 300);
const errors = [];
async function launch(flags) {
  const context = await chromium.launchPersistentContext(profile, {
    ...options,
    args: [...options.args, ...(flags ? ["--js-flags=" + flags] : [])],
  });
  await context.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.__forgePromptMeta = null;
    window.__forgeSeatView = null;
    window.Worker = class extends NativeWorker {
      constructor(url, options) {
        super(url, options);
        if (!String(url).includes("seat-reader")) return;
        this.addEventListener("message", (event) => {
          if (typeof event.data !== "string" || !event.data.startsWith("{")) return;
          try {
            const message = JSON.parse(event.data);
            if (message.kind === "state" && message.state?.gameView) {
              window.__forgeSeatView = message.state.gameView;
            } else if (message.kind === "prompt") {
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
async function witness(page, atCursor = null) {
  return page.evaluate(async (atCursor) => {
    const read = (request) => new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const db = await read(indexedDB.open("manabrew-forge-autoresume-v1"));
    try {
      const tx = db.transaction(["current", "entries"], "readonly");
      const [meta, entries] = await Promise.all([
        read(tx.objectStore("current").get("active")),
        read(tx.objectStore("entries").getAll()),
      ]);
      if (!meta || entries.length !== meta.nextSequence - 1) {
        throw Error("Incomplete committed journal");
      }
      const cursor = atCursor ?? meta.nextSequence;
      if (cursor < 1 || cursor > meta.nextSequence) {
        throw Error("Restored journal does not reach the original checkpoint");
      }
      const terminal = cursor === meta.nextSequence
        ? meta : entries.find((entry) => entry.sequence === cursor);
      if (!terminal?.verification || !terminal.prompt) {
        throw Error("Restored journal is missing the original terminal witness");
      }
      const prefix = entries.slice(0, cursor - 1);
      const bytes = new TextEncoder().encode(JSON.stringify({
        gameId: meta.gameId,
        releaseId: meta.releaseId,
        nextSequence: cursor,
        verification: terminal.verification,
        prompt: terminal.prompt,
        entries: prefix,
      }));
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return {
        cursor,
        promptId: terminal.prompt.promptId,
        promptType: terminal.prompt.input?.type,
        entries: prefix.length,
        digest: Array.from(new Uint8Array(digest), (x) => x.toString(16).padStart(2, "0")).join(""),
      };
    } finally {
      db.close();
    }
  }, atCursor);
}
async function state(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const prompt = window.__forgePromptMeta;
    const view = window.__forgeSeatView;
    const steps = {
      untap: "Untap", upkeep: "Upkeep", draw: "Draw", main1: "Main 1",
      combatBegin: "Begin Combat", combatDeclareAttackers: "Attackers",
      combatDeclareBlockers: "Blockers", combatFirstStrikeDamage: "1st Strike",
      combatDamage: "Damage", combatEnd: "End Combat",
      main2: "Main 2", endOfTurn: "End", cleanup: "Cleanup",
    };
    return {
      board: body.includes("Game board controls"),
      playing: body.includes("Turn stops"),
      offline: !navigator.onLine,
      path: location.pathname,
      prompt: prompt?.type ?? null,
      promptId: prompt?.promptId ?? null,
      engine: view ? {
        step: steps[view.step] ?? view.step,
        rawStep: view.step,
        turn: view.turn,
        hand: view.zones?.find((z) => z.zone === "hand" && z.ownerId === "player-0")?.count,
        life: view.players?.map((p) => p.life),
      } : null,
      step: (body.match(/current step ([^\n]+)/) ?? [])[1] ?? null,
      hand: Number((body.match(/Your hand, ([0-9]+) cards?/) ?? [])[1] ?? 0),
      life: [...body.matchAll(/Inspect (you|Forge AI|Brewy bot(?: \d+)?), (-?\d+) life/g)]
        .map((m) => [m[1], Number(m[2])]),
    };
  });
}
async function settledBoundary(page, atCursor = null) {
  const until = Date.now() + 30000;
  let stableSince = 0;
  let key = "";
  let last;
  const observed = [];
  while (Date.now() < until) {
    const journal = await witness(page);
    const ui = await state(page);
    last = { journal, ui };
    const sample = JSON.stringify({
      cursor: journal.cursor, promptId: ui.promptId, step: ui.step, hand: ui.hand,
      engine: ui.engine, aligned: journal.promptId === ui.promptId,
    });
    if (sample !== key) {
      if (observed.length < 15) observed.push(JSON.parse(sample));
      key = sample;
      stableSince = Date.now();
    }
    // The board may still be presenting the previous turn while the journal and
    // engine have reached the next prompt. Compare the same settled boundary.
    const aligned = ui.board && ui.offline && ui.engine &&
      journal.promptId === ui.promptId && journal.promptType === ui.prompt &&
      ui.engine.step === ui.step && ui.engine.hand === ui.hand &&
      (!atCursor || journal.cursor === atCursor);
    if (aligned && Date.now() - stableSince >= 3500) {
      console.log("FOUR_PLAYER_SETTLED_BOUNDARY", JSON.stringify({
        cursor: journal.cursor, observations: observed,
        prompt: ui.prompt, step: ui.step, hand: ui.hand,
      }));
      return { witness: journal, ui };
    }
    await page.waitForTimeout(250);
  }
  throw Error("UI never settled at the committed engine boundary: " + JSON.stringify({ atCursor, last, observed }));
}
async function act(page, current) {
  if (current.prompt === "chooseBlockers") {
    await page.keyboard.press("Enter");
  } else if (current.prompt === "chooseCards" && current.step === "Cleanup" && current.hand > 7) {
    const excess = current.hand - 7;
    assert(excess <= 6, "Cleanup needs more selections than visible cards");
    for (let i = 0; i < excess; i++) {
      await page.touchscreen.tap([330, 590, 850][i % 3], i < 3 ? 270 : 610);
      await page.waitForTimeout(200);
    }
    await page.keyboard.press("Enter");
  } else if (current.prompt === "chooseCards") {
    const skip = page.getByRole("button", { name: /^SKIP$/ });
    if (await skip.count()) await page.keyboard.press("Enter");
    else {
      const card = page.locator('button[aria-label="Activate to select this card"]');
      if (await card.count()) {
        await card.first().click();
        await page.evaluate(() => {
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        });
      }
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
  session = await launch(startFlags);
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
  for (let i = 0; i < decisions; i++) {
    baseline = (await advance(page, baseline)).saved;
    if (decisions > 10 && (i + 1) % 10 === 0) {
      console.log("FOUR_PLAYER_REPLAY_PROGRESS", JSON.stringify({
        decisions: i + 1, cursor: baseline.nextSequence,
      }));
    }
  }
  const settledBefore = await settledBoundary(page);
  const before = {
    saved: { ...baseline, nextSequence: settledBefore.witness.cursor },
    ...settledBefore,
  };
  assert(before.saved.nextSequence > 4, "A real 4-seat game must have committed decisions");
  assert(before.ui.life.length === 4, "Must actually have four seats");
  console.log("FOUR_PLAYER_BEFORE_BROWSER_EXIT", JSON.stringify(before));
  // Full Chrome process exit, not an in-tab page reload; no game-end action.
  await session.context.close();
  session = null;

  session = await launch(restartFlags);
  page = session.page;
  await page.goto(origin + "/", {waitUntil: "domcontentloaded"});
  await page.waitForFunction(() => document.body.innerText.includes("Game board controls") &&
    location.pathname === "/play/offline/constructed", null, {timeout: 240000});
  const settledAfter = await settledBoundary(page, before.witness.cursor);
  const resumed = {saved: await save(page), ...settledAfter};
  assert(resumed.ui.board && resumed.ui.offline);
  assert.equal(resumed.saved?.gameId, before.saved.gameId);
  assert.equal(resumed.saved?.releaseId, before.saved.releaseId);
  assert.deepEqual(resumed.witness, before.witness, "Restart must preserve the exact journal and terminal witness");
  assert(resumed.saved?.nextSequence >= resumed.witness.cursor);
  assert.equal(resumed.ui.life.length, 4, "All 4 seats must be restored");
  if (resumed.saved.nextSequence === before.saved.nextSequence) {
    assert.deepEqual(resumed.ui.life, before.ui.life, "Unchanged journal must restore same life totals");
    assert.deepEqual(resumed.ui.engine, before.ui.engine, "Same journal must restore the same engine view");
    assert.equal(resumed.ui.step, before.ui.step, "Restored UI phase must agree");
    assert.equal(resumed.ui.hand, before.ui.hand, "Restored UI hand must agree");
  }
  console.log("FOUR_PLAYER_AFTER_BROWSER_RESTART", JSON.stringify(resumed));
  const continued = await advance(page, resumed.saved);
  assert(continued.saved.nextSequence > resumed.saved.nextSequence);
  assert.deepEqual(errors, [], "No JavaScript page errors");
  console.log("FOUR_PLAYER_FULL_BROWSER_RESTART_RECOVERY_PASS", JSON.stringify({
    before, resumed, after: continued.saved, startFlags, restartFlags, newActionAccepted: true, errors,
  }));
} finally {
  if (session) await session.context.close();
}
