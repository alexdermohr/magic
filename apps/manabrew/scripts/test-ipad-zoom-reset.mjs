import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.argv[2] ?? "http://127.0.0.1:8095";
const profile = process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-zoom-reset";
const browser = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  viewport: { width: 1180, height: 820 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  serviceWorkers: "allow",
});
const page = browser.pages()[0] ?? await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));

async function pinch(start, end) {
  return page.evaluate(({ start, end }) => {
    const canvases = [...document.querySelectorAll(".game-touch-surface canvas")]
      .filter(canvas => canvas.getBoundingClientRect().width > 200 &&
        canvas.getBoundingClientRect().height > 120)
      .sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight);
    const canvas = canvases[0];
    if (!canvas) throw new Error("Board canvas missing");
    const rect = canvas.getBoundingClientRect();
    const point = ([x, y]) => [rect.left + x * rect.width, rect.top + y * rect.height];
    const emit = (target, type, id, coordinates) => {
      const [clientX, clientY] = point(coordinates);
      target.dispatchEvent(new PointerEvent(type, {
        bubbles: true, pointerId: id, pointerType: "touch", isPrimary: id === 41,
        buttons: type === "pointerup" ? 0 : 1, clientX, clientY,
      }));
    };
    emit(canvas, "pointerdown", 41, start[0]);
    emit(canvas, "pointerdown", 42, start[1]);
    emit(window, "pointermove", 41, end[0]);
    emit(window, "pointermove", 42, end[1]);
    const resetVisibleBeforeRelease = !!document.querySelector('[aria-label="Reset board zoom"]');
    emit(window, "pointerup", 41, end[0]);
    emit(window, "pointerup", 42, end[1]);
    return {
      resetVisibleBeforeRelease,
      resetVisibleAfterRelease: !!document.querySelector('[aria-label="Reset board zoom"]'),
      touchAction: getComputedStyle(document.querySelector(".game-touch-surface")).touchAction,
      canvas: { width: rect.width, height: rect.height },
    };
  }, { start, end });
}

try {
  await browser.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.getByRole("button", { name: /^Anowon, the Ruin Thief/ }).first().click();
  await page.getByRole("button", { name: /^Gahiji, Honored One/ }).first().click();
  await page.getByRole("button", { name: /^Fight!?$/ }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await page.getByRole("button", { name: /^KEEP$/i }).waitFor({ timeout: 150000 });
  await page.getByRole("button", { name: /^KEEP$/i }).click();
  await page.getByText(/Game board controls/).first().waitFor({ timeout: 90000 });
  // The React board controls render before Pixi has finished installing pointer
  // handlers. An early synthetic pinch is ignored while the canvas initializes.
  await page.waitForFunction(() => {
    const canvas = [...document.querySelectorAll(".game-touch-surface canvas")]
      .find((c) => c.clientWidth > 200 && c.clientHeight > 120);
    return !!canvas && canvas.width > 500 && canvas.height > 500;
  }, null, { timeout: 30000 });
  let expanded;
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.waitForTimeout(450);
    expanded = await pinch([[0.40, 0.55], [0.60, 0.55]], [[0.22, 0.55], [0.78, 0.55]]);
    if (expanded.resetVisibleAfterRelease) break;
  }
  console.log("ZOOM_IN", JSON.stringify(expanded));
  assert.equal(expanded.touchAction, "none", "Native scroll/zoom must not capture board touches");
  assert.ok(expanded.resetVisibleAfterRelease, "Pinching in must expose reset zoom");
  const themed = await page.getByRole("button", { name: "Reset board zoom" }).evaluate(
    (button) => ["bg-card", "text-card-foreground", "border-border"]
      .every((token) => button.classList.contains(token)),
  );
  assert.ok(themed, "Zoom control must use the current app theme");
  // A no-op ResizeObserver callback after a React game-state update must not
  // reset the board and make the escape control disappear.
  await page.waitForTimeout(700);
  const bounds = await page.getByRole("button", { name: "Reset board zoom" }).boundingBox();
  assert.ok(bounds, "Zoom reset control must be on screen");
  // The click removes its own DOM node immediately. Dispatch a real pointer
  // click by coordinates so Playwright doesn't retry a successfully removed node.
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.waitForFunction(() => !document.querySelector('[aria-label="Reset board zoom"]'),
    null, { timeout: 5000 });
  const contracted = await pinch([[0.25, 0.55], [0.75, 0.55]], [[0.48, 0.55], [0.52, 0.55]]);
  console.log("ZOOM_OUT", JSON.stringify(contracted));
  assert.equal(contracted.resetVisibleAfterRelease, false,
    "Pinch back to normal scale must not leave zoom stuck");
  const cardBack = await page.evaluate(async () => {
    const response = await fetch("/backs/large/0/a/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg");
    return { status: response.status, bytes: (await response.blob()).size };
  });
  assert.equal(cardBack.status, 200);
  assert.ok(cardBack.bytes > 10000);
  assert.deepEqual(errors, []);
  console.log("ZOOM_RESET_E2E_PASS", JSON.stringify({ cardBack, errors, nativeScale: await page.evaluate(() => window.visualViewport?.scale) }));
} finally {
  await browser.close();
}
