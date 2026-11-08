const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const player = process.argv[3] ?? "Anowon, the Ruin Thief";
const opponent = process.argv[4] ?? "Gahiji, Honored One";
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
    const life = [...body.matchAll(/Inspect (you|Forge AI), (-?\d+) life/g)].map((m) => ({
      name: m[1],
      amount: Number(m[2]),
    }));
    // Commander damage or poison may eliminate a player above zero life.
    for (const eliminated of body.matchAll(/\b(You|Forge bot): (-?\d+) life \(eliminated\)/g)) {
      const name = eliminated[1] === "You" ? "you" : "Forge AI";
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
let terminal = null;
let idle = 0;

try {
  await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await page
    .getByRole("button", { name: new RegExp("^" + player.split(",")[0]) })
    .first()
    .click();
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
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await page.getByRole("button", { name: /^KEEP$/ }).waitFor({ timeout: 150000 });
  await page.getByRole("button", { name: /^KEEP$/ }).click();
  await page.waitForFunction(
    () => (window.__engineDecisions ?? []).some((decision) => decision.type === "chooseAction"),
    null,
    { timeout: 110000 },
  );
  for (let index = 0; index < 380; index++) {
    const current = await state();
    if (!current.offline) throw new Error("Browser connected during offline game");
    const defeated = current.life.find((seat) => seat.amount <= 0 || seat.eliminated);
    if (defeated && !terminal) {
      terminal = { seat: defeated.name, actions, snapshot: current };
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
        "FULL_GAME_COMPLETE",
        JSON.stringify({
          player,
          opponent,
          loser: terminal.seat,
          actions,
          passes,
          discards,
          reveals,
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
      const excess = current.hand - 7;
      for (let selected = 0; selected < excess; selected++) {
        await touch([175, 465, 753, 1037][selected % 4], selected < 4 ? 235 : 525);
        await page.waitForTimeout(70);
      }
      await touch(495, 783);
      discards++;
    } else if (current.type === "revealCards") {
      // The CONTINUE button moves with the reveal dialog width; the fixed
      // center-screen tap can miss it. Enter confirms this Pixi prompt via
      // the same user-input handler as the visible button.
      await page.keyboard.press("Enter");
      reveals++;
    } else if (["chooseAction", "chooseBlockers", "chooseAttackers"].includes(current.type)) {
      await touch(1032, 765);
      passes++;
    } else {
      throw new Error("Unhandled Pixi action " + current.type + ": " + current.tail);
    }
    actions++;
    await page.waitForTimeout(190);
    const updated = await state();
    idle =
      updated.count === current.count &&
      updated.step === current.step &&
      updated.life.map((seat) => seat.amount).join() ===
        current.life.map((seat) => seat.amount).join()
        ? idle + 1
        : 0;
    if (idle >= 18 && !terminal) {
      throw new Error("Pixi input stalled: " + JSON.stringify(updated));
    }
    if (Date.now() - start > 360000) throw new Error("Six-minute full-game limit");
    if (index === 379) throw new Error("Full-game action limit reached");
  }
  if (!terminal) throw new Error("No natural Commander game conclusion");
} finally {
  await context.close();
}
