const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const player = process.argv[3] ?? "Anowon, the Ruin Thief";
const opponent = process.argv[4] ?? "Gahiji, Honored One";
const limitMs = Number(process.env.MANABREW_FULLGAME_LIMIT_MS ?? 720000);
if (!Number.isFinite(limitMs) || limitMs <= 0) throw new Error("Invalid full-game time limit");
const context = await chromium.launchPersistentContext(
  process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-fullgame-ui",
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
    const life = [...body.matchAll(/Inspect (you|Forge bot|Brewy bot), (-?\d+) life/g)].map((m) => ({
      name: m[1] === "you" ? "You" : m[1],
      amount: Number(m[2]),
    }));
    // Commander damage or poison may eliminate a player above zero life.
    for (const eliminated of body.matchAll(/\b(You|Forge bot|Brewy bot): (-?\d+) life \(eliminated\)/g)) {
      const name = eliminated[1];
      const existing = life.find((seat) => seat.name === name);
      if (existing) existing.eliminated = true;
      else life.push({ name, amount: Number(eliminated[2]), eliminated: true });
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
let reorders = 0;
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
  await page
    .getByRole("button", { name: /^Fight!?$/ })
    .first()
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Fight!?$/ })
    .click();
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
  idleSince = Date.now();
  while (Date.now() - start <= limitMs) {
    const current = await state();
    if (!current.offline) throw new Error("Browser connected during offline game");
    const defeated = current.life.find((seat) => seat.amount <= 0 || seat.eliminated);
    if (defeated && !terminal) {
      terminal = { seat: defeated.name, actions, snapshot: current };
      const result = page.getByRole("button", { name: /^Game over: (Victory|Defeat)\./ });
      await result.waitFor({ state: "visible", timeout: 30000 });
      await page.waitForTimeout(5100);
      const finalScene = await state();
      if (!(await result.isVisible()) || !finalScene.playing || !finalScene.offline) {
        throw new Error("The offline result closed before the player could read it");
      }
      if (process.env.MANABREW_FULLGAME_SCREENSHOT) {
        await page.screenshot({ path: process.env.MANABREW_FULLGAME_SCREENSHOT });
      }
      // The Pixi game-over modal changes height with the number of players.
      // Enter invokes its visible RETURN TO MENU action for both 1v1 and pods.
      await page.keyboard.press("Enter");
      await page.waitForFunction(
        () => location.pathname === "/play" &&
          !document.body.innerText.includes("Game board controls") && !navigator.onLine,
        null,
        { timeout: 12000 },
      );
      console.log(
        "FULL_GAME_COMPLETE",
        JSON.stringify({
          player,
          opponent,
          loser: terminal.seat,
          actions,
          passes,
          discards,
          reveals,
          reorders,
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
    } else if (current.type === "revealCards") {
      // The CONTINUE button moves with the reveal dialog width; the fixed
      // center-screen tap can miss it. Enter confirms this Pixi prompt via
      // the same user-input handler as the visible button.
      await page.keyboard.press("Enter");
      reveals++;
    } else if (current.type === "reorder") {
      // The Pixi reorder dialog starts with the original order selected.
      // Enter invokes its CONFIRM ORDER action without using engine shortcuts.
      await page.keyboard.press("Enter");
      reorders++;
    } else if (["chooseAction", "chooseBlockers", "chooseAttackers"].includes(current.type)) {
      await touch(1032, 765);
      passes++;
    } else {
      throw new Error("Unhandled Pixi action " + current.type + ": " + current.tail);
    }
    actions++;
    await page.waitForTimeout(190);
    const updated = await state();
    const advanced =
      updated.count !== current.count ||
      updated.step !== current.step ||
      updated.life.map((seat) => `${seat.name}:${seat.amount}:${seat.eliminated}`).join() !==
        current.life.map((seat) => `${seat.name}:${seat.amount}:${seat.eliminated}`).join();
    if (advanced) idleSince = Date.now();
    if (Date.now() - idleSince >= 45_000) {
      throw new Error("No game state progress for 45s: " + JSON.stringify(updated));
    }
  }
  if (!terminal) throw new Error("Full-game time limit without a natural Commander conclusion");
} finally {
  await context.close();
}
