import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const profile = process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-fast-relaunch";

const browser = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  serviceWorkers: "allow",
});
const page = browser.pages()[0] ?? await browser.newPage();

await page.addInitScript(() => {
  const originalMatch = Cache.prototype.match;
  window.__offlineCacheLookups = 0;
  Cache.prototype.match = function (...args) {
    window.__offlineCacheLookups += 1;
    return originalMatch.apply(this, args);
  };
});

try {
  const manifest = await (await page.request.get(origin + "/offline-assets.json")).json();
  assert.ok(manifest.files.length > 20, "Must test a real offline package");
  for (let repeat = 0; repeat < 3; repeat++) {
    await page.goto(origin + "/offline-setup.html?setup=1", {
      waitUntil: "domcontentloaded", timeout: 30000,
    });
    await page.waitForFunction(() => {
      const text = document.getElementById("state")?.textContent ?? "";
      return (text.includes("vollständig offline gespeichert") &&
          !document.getElementById("play")?.classList.contains("disabled")) ||
        text.includes("Download erforderlich") || text.includes("nicht verfügbar");
    }, null, { timeout: 60000 });

    const state = await page.evaluate(() => ({
      status: document.getElementById("state")?.textContent ?? "",
      lookups: window.__offlineCacheLookups,
      playEnabled: !document.getElementById("play")?.classList.contains("disabled"),
    }));
    assert.match(state.status, /vollständig offline gespeichert/, "Prepared cache must remain ready");
    assert.ok(state.playEnabled, "Ready PWA must let the user play");
    assert.ok(state.lookups < 25,
      "Ready launch performed " + state.lookups + " cache lookups (expected fewer than 25)");
    console.log("FAST_RELAUNCH", repeat, JSON.stringify(state));
  }

  const before = await page.evaluate(() => window.__offlineCacheLookups);
  await page.locator("#prepare").click();
  await page.waitForFunction(() => !document.getElementById("prepare")?.disabled,
    null, { timeout: 90000 });
  const after = await page.evaluate(() => ({
    lookups: window.__offlineCacheLookups,
    status: document.getElementById("state")?.textContent,
  }));
  assert.ok(after.lookups - before >= manifest.files.length,
    "The explicit verification must still inspect every cached asset");
  assert.match(after.status, /vollständig offline gespeichert/);
  console.log("FULL_VERIFICATION", JSON.stringify({
    assets: manifest.files.length,
    inspected: after.lookups - before,
    status: after.status,
  }));
} finally {
  await browser.close();
}
