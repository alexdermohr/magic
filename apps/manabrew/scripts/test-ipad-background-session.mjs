import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const profile = process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-background-session";
const context = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  ...(process.env.MANABREW_TEST_USER_AGENT
    ? { userAgent: process.env.MANABREW_TEST_USER_AGENT }
    : {}),
  viewport: { width: 1180, height: 820 },
  isMobile: true,
  hasTouch: true,
  ...(process.env.MANABREW_TEST_DEVICE_SCALE_FACTOR
    ? { deviceScaleFactor: Number(process.env.MANABREW_TEST_DEVICE_SCALE_FACTOR) }
    : {}),
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    ...(process.env.MANABREW_TEST_HOST_RESOLVER_RULES
      ? ["--host-resolver-rules=" + process.env.MANABREW_TEST_HOST_RESOLVER_RULES]
      : []),
  ],
  serviceWorkers: "allow",
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const status = () =>
  page.evaluate(() => ({
    playing: document.body.innerText.includes("Game board controls"),
    decisions: (window.__engineDecisions ?? []).length,
    lastType: (window.__engineDecisions ?? []).at(-1)?.type ?? null,
    hidden: document.hidden,
  }));

try {
  await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded" });
  await page
    .getByRole("button", { name: /^Anowon,/ })
    .first()
    .click();
  await page
    .getByRole("button", { name: /^Gahiji,/ })
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
  await page.getByRole("button", { name: /^KEEP$/ }).waitFor({ timeout: 150_000 });
  await page.getByRole("button", { name: /^KEEP$/ }).click();
  await page.waitForFunction(
    () =>
      document.body.innerText.includes("Game board controls") &&
      (window.__engineDecisions ?? []).some((decision) => decision.type === "chooseAction"),
    null,
    { timeout: 110_000 },
  );
  const before = await status();
  assert.ok(before.playing, "The offline Forge game must be active before switching tabs");
  if (process.env.MANABREW_EXPECT_PIXI_DPR_CAP) {
    const limit = Number(process.env.MANABREW_EXPECT_PIXI_DPR_CAP);
    const canvases = await page.evaluate(() =>
      [...document.querySelectorAll("canvas")]
        .map((canvas) => {
          const { width, height } = canvas.getBoundingClientRect();
          return {
            clientWidth: width,
            clientHeight: height,
            backingWidth: canvas.width,
            backingHeight: canvas.height,
            ratio: width > 0 ? canvas.width / width : 0,
          };
        })
        .filter(({ clientWidth, clientHeight }) => clientWidth >= 500 && clientHeight >= 250),
    );
    assert.ok(canvases.length >= 2, "Both the Pixi board and overlay must have backing surfaces");
    for (const canvas of canvases) {
      assert.ok(
        canvas.ratio <= limit + 0.02,
        "Large game canvas exceeds the iPad GPU resolution cap: " + JSON.stringify(canvas),
      );
    }
    console.log("IPAD_PIXI_RESOLUTION_BUDGET", JSON.stringify({ limit, canvases }));
  }

  if (process.env.MANABREW_TEST_WEBGL_CONTEXT_RESTORE) {
    const restored = await page.evaluate(async () => {
      const largeCanvases = [...document.querySelectorAll("canvas")].filter((canvas) => {
        const rect = canvas.getBoundingClientRect();
        return rect.width >= 500 && rect.height >= 250;
      });
      if (largeCanvases.length < 2)
        throw new Error("Expected both game board and overlay canvases");
      const restoredSurfaces = [];
      for (const canvas of largeCanvases) {
        const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        const extension = gl?.getExtension("WEBGL_lose_context");
        if (!extension) throw new Error("Browser cannot simulate a WebGL context loss");

        const waitFor = (type) =>
          new Promise((resolve, reject) => {
            const timeout = setTimeout(
              () => reject(new Error(type + " event did not arrive")),
              10000,
            );
            canvas.addEventListener(
              type,
              (event) => {
                clearTimeout(timeout);
                resolve(event);
              },
              { once: true },
            );
          });
        const lost = waitFor("webglcontextlost");
        extension.loseContext();
        const lostEvent = await lost;
        if (!lostEvent.defaultPrevented || !gl.isContextLost()) {
          throw new Error("Pixi did not acknowledge WebGL context loss");
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
        const ready = waitFor("webglcontextrestored");
        extension.restoreContext();
        await ready;
        if (gl.isContextLost()) throw new Error("WebGL context remained lost after restoration");
        restoredSurfaces.push({ width: canvas.width, height: canvas.height });
      }
      return restoredSurfaces;
    });
    await page.waitForTimeout(350);
    const recovered = await status();
    assert.ok(recovered.playing, "The same Forge game must survive GPU context restoration");
    console.log("WEBGL_CONTEXTS_RESTORED", JSON.stringify({ restored, recovered }));
  }

  const other = await context.newPage();
  await other.goto("about:blank");
  await other.bringToFront();
  let hidden = await page.evaluate(() => document.hidden);
  let visibilityMode = "native";
  if (!hidden) {
    // Headless Chromium may keep both tabs visible: reproduce WebKit events explicitly.
    visibilityMode = "emulated";
    hidden = await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      document.dispatchEvent(new Event("visibilitychange"));
      return document.hidden;
    });
  }
  assert.ok(hidden, "The game must enter the hidden lifecycle state");
  // A BFCache-style pagehide must not terminate the live Forge game.
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })),
  );
  await page.waitForTimeout(3_500);
  await page.bringToFront();
  if (visibilityMode === "emulated") {
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
      document.dispatchEvent(new Event("visibilitychange"));
    });
  }
  await page.waitForTimeout(1_500);
  const after = await status();
  assert.equal(after.hidden, false, "The game page must have returned to the foreground");
  assert.ok(after.playing, "Tab switch must not close the active Forge game");
  assert.equal(after.lastType, "chooseAction", "Forge must be awaiting a fresh player action");

  // Count only a new engine decision after the resumed player input, not a
  // decision that might have arrived while the tab was still hidden.
  await page.touchscreen.tap(1032, 765);
  await page.waitForFunction((n) => (window.__engineDecisions ?? []).length > n, after.decisions, {
    timeout: 40_000,
  });
  const resumed = await status();
  assert.ok(resumed.playing, "The game board must remain active after playing another action");
  assert.deepEqual(errors, [], "No uncaught JavaScript page errors");
  console.log(
    "TAB_SWITCH_GAME_RESUMED",
    JSON.stringify({ before, visibilityMode, hiddenDuringSwitch: hidden, after, resumed, errors }),
  );
} finally {
  await context.close();
}
