import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const context = await chromium.launchPersistentContext(
  process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-background-game",
  {
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    viewport: { width: 1180, height: 820 },
    isMobile: true,
    hasTouch: true,
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

const snapshot = () =>
  page.evaluate(() => ({
    visible: document.visibilityState,
    active: document.body.innerText.includes("Game board controls"),
    online: navigator.onLine,
    decisions: (window.__engineDecisions ?? []).length,
    prompt: (window.__engineDecisions ?? []).at(-1)?.type ?? null,
  }));

try {
  await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await page.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await page.getByRole("button", { name: /^Fight!?$/ }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await page.getByRole("button", { name: /^KEEP$/ }).waitFor({ timeout: 150000 });
  await page.getByRole("button", { name: /^KEEP$/ }).click();
  await page.waitForFunction(
    () => (window.__engineDecisions ?? []).some((entry) => entry.type === "chooseAction"),
    null,
    { timeout: 110000 },
  );
  const before = await snapshot();
  assert.equal(before.active, true);
  assert.equal(before.online, false);

  const lifecycle = await context.newCDPSession(page);
  await lifecycle.send("Page.enable");
  await lifecycle.send("Page.setWebLifecycleState", { state: "frozen" });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await lifecycle.send("Page.setWebLifecycleState", { state: "active" });
  await page.waitForTimeout(1500);
  const resumed = await snapshot();
  assert.equal(resumed.active, true, "The offline game must stay mounted after tab change");
  assert.equal(resumed.online, false, "The game must never require a network connection");
  assert.ok(resumed.decisions >= before.decisions, "The game must not restart its decision stream");

  if (resumed.prompt === "revealCards") await page.keyboard.press("Enter");
  else if (["chooseAction", "chooseAttackers", "chooseBlockers"].includes(resumed.prompt)) {
    await page.touchscreen.tap(1032, 765);
  } else {
    throw new Error("Unexpected prompt after tab return: " + JSON.stringify(resumed));
  }
  await page.waitForFunction(
    (oldCount) => (window.__engineDecisions ?? []).length > oldCount,
    resumed.decisions,
    { timeout: 75000 },
  );
  const continued = await snapshot();
  assert.equal(continued.active, true);
  assert.deepEqual(errors, []);
  console.log(
    "OFFLINE_CDP_FREEZE_RESUME_OK",
    JSON.stringify({ before, resumed, continued, errors }),
  );
} finally {
  await context.close();
}