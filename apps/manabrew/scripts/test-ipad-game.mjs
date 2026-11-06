const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const context = await chromium.launchPersistentContext(
  process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-test-profile",
  {
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    serviceWorkers: "allow",
  },
);
const page = context.pages()[0] ?? await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
    errors.push(message.text().slice(0, 300));
  }
});
const snapshot = async (step) => {
  console.log(step, JSON.stringify({
    url: page.url(),
    body: (await page.locator("body").innerText()).slice(-1900),
    errors: errors.slice(-8),
  }));
};

try {
  if (process.argv[3] !== "online") await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.getByRole("button", { name: /^Kaalia of the Vast/ }).waitFor({ timeout: 45000 });
  await snapshot("DECK-PICKER:");
  await page.getByRole("button", { name: /^Kaalia of the Vast/ }).first().click();
  await page.getByRole("button", { name: /^Hearthhull, the Worldseed/ }).first().click();
  await snapshot("MATCHUP:");
  const fight = page.getByRole("button", { name: /^Fight!?$/ }).first();
  if (!(await fight.isEnabled())) throw new Error("Fight after player/opponent selection not enabled.");
  await fight.click();
  await snapshot("TABLE:");
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await snapshot("PLAYER-COUNT:");
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  let playable = false;
  for (let check = 1; check <= (Number(process.argv[4]) || 9); check++) {
    await page.waitForTimeout(15000);
    const probe = await page.evaluate(() => ({
      hand: (document.body.innerText.match(/Your hand, ([0-9]+) cards?/) || [])[1] ?? null,
      hasMulligan: /mulligan|keep hand|keep 7/i.test(document.body.innerText),
      hasPriority: /pass priority|end turn|play land/i.test(document.body.innerText),
      view: document.body.innerText.slice(-800),
      forgeLog: ((window).__forgeLog ?? []).slice(-9),
      engineDecisions: ((window).__engineDecisions ?? []).slice(-3),
      frames: ((window).__forgeFrames ?? []).slice(-15),
      prompt: ((window).__activePrompt ?? null),
    }));
    console.log("FORGE-POLL-" + check + ":", JSON.stringify(probe).slice(0, 3200));
    if (probe.hasMulligan || (probe.hand !== null && Number(probe.hand) >= 1)) {
      playable = true;
      break;
    }
  }
  await snapshot("GAME-FINAL:");
  console.log("GAME-STATE-REACHED:", JSON.stringify({ playable, errors: errors.slice(-10) }));
  if (!playable) throw new Error("Forge-Spiel hat nach 135 Sekunden weder Mulligan noch spielbare Hand.");
} catch (error) {
  await snapshot("FAILED-STATE:");
  throw error;
} finally {
  await context.close();
}