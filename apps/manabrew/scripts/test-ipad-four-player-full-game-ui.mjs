const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const player = process.argv[3] ?? "Arahbo, Roar of the World";
const opponent = process.argv[4] ?? "Rin and Seri, Inseparable";
const context = await chromium.launchPersistentContext(
  process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-four-player-ui",
  {
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    ...(process.env.MANABREW_TEST_USER_AGENT
      ? { userAgent: process.env.MANABREW_TEST_USER_AGENT }
      : {}),
    viewport: { width: 1180, height: 820 },
    hasTouch: true,
    isMobile: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      ...(process.env.MANABREW_TEST_HOST_RESOLVER_RULES
        ? ["--host-resolver-rules=" + process.env.MANABREW_TEST_HOST_RESOLVER_RULES]
        : []),
    ],
    serviceWorkers: "allow",
  },
);
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const state = () =>
  page.evaluate(() => {
    const body = document.body.innerText;
    const decisions = window.__engineDecisions ?? [];
    const life = [...body.matchAll(/Inspect (you|Forge AI|Forge bot(?: \d+)?|Brewy bot(?: \d+)?), (-?\d+) life/g)].map((m) => ({
      name: m[1] === "you" ? "You" : m[1],
      amount: Number(m[2]),
      eliminated: false,
    }));
    // A player can lose to commander damage or poison despite positive life.
    for (const row of body.matchAll(/\b(You|Forge AI|Forge bot(?: \d+)?|Brewy bot(?: \d+)?): (-?\d+) life \(eliminated\)/g)) {
      const existing = life.find((seat) => seat.name === row[1]);
      if (existing) existing.eliminated = true;
      else life.push({ name: row[1], amount: Number(row[2]), eliminated: true });
    }
    return {
      playing: body.includes("Game board controls"),
      offline: !navigator.onLine,
      path: location.pathname,
      type: decisions.at(-1)?.type ?? null,
      count: decisions.length,
      hand: Number((body.match(/Your hand, (\d+) cards?/) ?? [])[1] ?? 0),
      step: (body.match(/current step ([^\n]+)/) ?? [])[1] ?? null,
      life,
      tail: body.slice(-450),
    };
  });

const touch = (x, y) => page.touchscreen.tap(x, y);
const start = Date.now();
let actions = 0;
let discards = 0;
let passes = 0;
let reveals = 0;
let modalConfirms = 0;
let terminal = null;
let idleSince = Date.now();

try {
  await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await page
    .getByRole("button", { name: new RegExp("^" + player.split(",")[0]) })
    .first()
    .click();
  await page.getByRole("button", { name: /^Choose deck for Bot 1$/ }).click();
  await page
    .getByRole("button", { name: new RegExp("^" + opponent.split(",")[0]) })
    .first()
    .click();
  // Since 3.80, a Commander pod is configured in the roster, not after Fight.
  await page.getByRole("button", { name: /^Add bot$/ }).click();
  await page.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await page.getByRole("button", { name: /^Add bot$/ }).click();
  await page.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await page
    .getByRole("button", { name: /^Fight!?$/ })
    .first()
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Fight!?$/ })
    .click();
  // 3.81's Keep/Mulligan buttons are native Pixi controls, not old DOM
  // uppercase KEEP. Space is the real configured confirm keyboard action.
  await page.waitForFunction(
    () => document.body.innerText.includes("Game board controls") &&
      (window.__engineDecisions ?? []).some((entry) => entry.type === "mulligan"),
    null,
    { timeout: 180000 },
  );
  await page.keyboard.press("Space");
  await page.waitForFunction(
    () => (window.__engineDecisions ?? []).some((decision) => decision.type === "chooseAction"),
    null,
    { timeout: 110000 },
  );
  for (let index = 0; index < 1200; index++) {
    const current = await state();
    if (!current.offline) throw new Error("Browser connected during offline game");
    const eliminated = current.life.filter((seat) => seat.amount <= 0 || seat.eliminated);
    if (eliminated.length >= 3 && !terminal) {
      const alive = current.life.filter((seat) => seat.amount > 0 && !seat.eliminated);
      terminal = {
        winner: alive.length === 1 ? alive[0].name : null,
        eliminated: eliminated.map((seat) => seat.name),
        actions,
        snapshot: current,
      };
      await page.waitForTimeout(5100);
      const finalScene = await state();
      if (!finalScene.playing || !finalScene.offline) {
        throw new Error("The offline result closed before the player could read it");
      }
      if (process.env.MANABREW_FULLGAME_SCREENSHOT) {
        await page.screenshot({ path: process.env.MANABREW_FULLGAME_SCREENSHOT });
      }
      // The Pixi game-over modal changes height with the number of players.
      // Enter invokes its visible RETURN TO MENU action for both 1v1 and pods.
      await page.keyboard.press("Enter");
      await page.waitForFunction(
        () => !document.body.innerText.includes("Game board controls"),
        null,
        { timeout: 12000 },
      );
      console.log(
        "FOUR_PLAYER_FULL_GAME_COMPLETE",
        JSON.stringify({
          player,
          opponent,
          winner: terminal.winner,
          eliminated: terminal.eliminated,
          actions,
          passes,
          discards,
          reveals,
          modalConfirms,
          elapsedSeconds: Math.round((Date.now() - start) / 1000),
          terminal: terminal.snapshot,
          resultPersistedForSeconds: 5,
          returnedToMenu: true,
          errors,
        }),
      );
      if (errors.length) process.exitCode = 1;
      break;
    }
    if (!current.playing) {
      throw new Error("Returned to game menu without a terminal life total");
    } else if (current.type === "chooseCards" && current.step === "Cleanup" && current.hand > 7) {
      // The current 3.81 Pixi card modal displays three columns at this
      // 1180x820 viewport; its first tile is centred at (330, 270).
      // A real touch followed by the user-facing Enter confirmation was
      // verified to advance the offline Forge decision journal.
      await page.waitForFunction(
        () => [...document.querySelectorAll("canvas")].some(
          (canvas) => canvas.width === 1180 && canvas.height === 820,
        ),
        null,
        { timeout: 15000 },
      );
      await page.waitForTimeout(450);
      const excess = current.hand - 7;
      if (excess > 6) throw new Error("Cleanup needs more selections than visible cards");
      for (let selected = 0; selected < excess; selected++) {
        await touch([330, 590, 850][selected % 3], selected < 3 ? 270 : 610);
        await page.waitForTimeout(200);
      }
      await page.keyboard.press("Enter");
      discards++;
    } else if (current.type === "chooseCards") {
      // A game effect can ask the human to choose cards outside the cleanup
      // discard phase. Pixi exposes each selectable card as an accessibility
      // button whose label is "Activate to select this card". Keep using the
      // real UI; never synthesize an engine response or inspect hidden cards.
      const skip = page.getByRole("button", { name: /^SKIP$/ });
      if (await skip.count()) {
        await page.keyboard.press("Enter");
      } else {
        const available = page.locator('button[aria-label="Activate to select this card"]');
        if (await available.count()) {
          await available.first().click();
          // The keyboard shortcut must confirm the selection, not activate
          // the now-focused card a second time.
          await page.evaluate(() => {
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          });
        }
        await page.keyboard.press("Enter");
      }
      modalConfirms++;
    } else if ([
      "revealCards", "reorder", "chooseBoolean", "chooseFromSelection", "scry",
      "chooseColor", "chooseDamageAssignmentOrder", "chooseCombatDamageAssignment",
      "diceRolled",
    ].includes(current.type)) {
      // These prompts have an Enter confirmation in PromptLayer; choices that
      // need more input remain blocked and trigger the idle guard below.
      await page.keyboard.press("Enter");
      if (current.type === "revealCards") reveals++;
      modalConfirms++;
    } else if (["chooseAction", "chooseBlockers", "chooseAttackers"].includes(current.type)) {
      await touch(1032, 765);
      passes++;
    } else {
      throw new Error("Unhandled Pixi action " + current.type + ": " + current.tail);
    }
    actions++;
    await page.waitForTimeout(190);
    const updated = await state();
    if (actions % 50 === 0) {
      console.log(
        "FOUR_PLAYER_PROGRESS",
        JSON.stringify({
          actions,
          elapsedSeconds: Math.round((Date.now() - start) / 1000),
          decisionCount: updated.count,
          step: updated.step,
          life: updated.life,
        }),
      );
    }
    const advanced =
      updated.count !== current.count ||
      updated.step !== current.step ||
      updated.life.map((seat) => seat.amount).join() !==
        current.life.map((seat) => seat.amount).join();
    if (advanced) idleSince = Date.now();
    // The last human prompt remains in __engineDecisions while Forge AI
    // computes three other seats. A 3-10s pause is not a frozen Pixi input.
    if (Date.now() - idleSince >= 45_000 && !terminal) {
      throw new Error("No game state progress for 45s: " + JSON.stringify(updated));
    }
    if (Date.now() - start > Number(process.env.MANABREW_FULLGAME_LIMIT_MS ?? 720000))
      throw new Error("Four-player full-game time limit: " + JSON.stringify(current));
    if (index === 1199)
      throw new Error("Four-player action limit reached: " + JSON.stringify(current));
  }
  if (!terminal) throw new Error("No natural four-player Commander conclusion");
} finally {
  await context.close();
}