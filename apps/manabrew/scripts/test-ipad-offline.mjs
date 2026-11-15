const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const context = await chromium.launchPersistentContext(
  process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-test-profile",
  {
    headless: true,
    ...(chrome ? { executablePath: chrome } : {}),
    ...(process.env.MANABREW_TEST_USER_AGENT
      ? { userAgent: process.env.MANABREW_TEST_USER_AGENT }
      : {}),
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

try {
  await page.goto(origin + "/offline-setup.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !document.getElementById("prepare")?.disabled, null, {
    timeout: 20000,
  });
  const initial = await page.locator("#state").innerText();
  console.log("INITIAL:", initial);
  const ready = initial.includes("vollständig offline gespeichert");
  if (!ready) {
    await page.locator("#prepare").click();
    await page.waitForFunction(
      () => {
        const text = document.getElementById("state")?.textContent ?? "";
        return (
          text.includes("Offline-Dateien vollständig gespeichert") ||
          text.includes("Offline-Download unvollständig")
        );
      },
      null,
      { timeout: 600000 },
    );
  }

  const finished = await page.locator("#state").innerText();
  if (
    !finished.includes("vollständig gespeichert") &&
    !finished.includes("vollständig offline gespeichert")
  ) {
    const detail = await page.locator("#detail").innerText();
    throw new Error("Offline-Vorbereitung gescheitert: " + finished + " / " + detail);
  }
  console.log("CACHE:", finished);
  const supports = await page.evaluate(() => ({
    isolated: crossOriginIsolated,
    sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
    atomicsWait: typeof Atomics.wait === "function",
    serviceWorker: Boolean(navigator.serviceWorker.controller),
  }));
  console.log("BROWSER:", JSON.stringify(supports));
  if (!supports.isolated || !supports.sharedArrayBuffer || !supports.serviceWorker) {
    throw new Error("Browser hat keine geeignete Offline-/WASM-Grundlage.");
  }

  await context.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(6000);
  const offline = await page.evaluate(() => ({
    title: document.title,
    isolated: crossOriginIsolated,
    online: navigator.onLine,
    root: (document.getElementById("root")?.innerText ?? "").slice(0, 1200),
    worker: Boolean(navigator.serviceWorker.controller),
  }));
  console.log("OFFLINE-COLD-START:", JSON.stringify(offline));
  if (offline.online || !offline.isolated || !offline.worker || !offline.root.trim()) {
    throw new Error("Offline-Kaltstart fehlgeschlagen.");
  }
  console.log("PAGE-ERRORS:", JSON.stringify(errors.slice(0, 10)));
} finally {
  await context.close();
}
