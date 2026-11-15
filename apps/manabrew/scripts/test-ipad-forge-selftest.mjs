import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const profile = process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-forge-selftest";
const browser = await chromium.launchPersistentContext(profile, {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  args: [
    "--no-sandbox", "--disable-dev-shm-usage",
    ...(process.env.MANABREW_TEST_HOST_RESOLVER_RULES
      ? ["--host-resolver-rules=" + process.env.MANABREW_TEST_HOST_RESOLVER_RULES]
      : []),
  ],
  serviceWorkers: "allow",
});
const page = browser.pages()[0] ?? await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(origin + "/offline-setup.html?setup=1", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const state = document.querySelector("#state")?.textContent ?? "";
    return state.includes("vollständig offline gespeichert") || state.includes("Download erforderlich");
  }, null, { timeout: 90000 });

  if ((await page.locator("#state").innerText()).includes("Download erforderlich")) {
    await page.locator("#prepare").click();
    await page.waitForFunction(() => {
      const state = document.querySelector("#state")?.textContent ?? "";
      return state.includes("Offline-Dateien vollständig gespeichert") ||
        state.includes("Offline-Download unvollständig");
    }, null, { timeout: 600000 });
  }

  const state = await page.locator("#state").innerText();
  assert.match(state, /vollständig (?:offline )?gespeichert/, "Offline package must be ready");

  await browser.setOffline(true);
  await page.locator("#engine-probe").click();
  await page.waitForFunction(() => {
    const result = document.querySelector("#engine-result")?.textContent ?? "";
    return result.includes("Erfolgreich: Forge") || result.includes("Forge-Test fehlgeschlagen");
  }, null, { timeout: 175000 });
  const result = await page.evaluate(() => ({
    offline: !navigator.onLine,
    isolated: crossOriginIsolated,
    sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
    diagnostic: document.querySelector("#engine-result")?.textContent,
    version: localStorage.getItem("manabrew-ipad-imported-version"),
  }));
  console.log("FORGE_SELFTEST", JSON.stringify({ ...result, errors }));
  assert.equal(result.offline, true, "Forge selftest must run without network");
  assert.equal(result.isolated, true, "Forge selftest needs cross-origin isolation");
  assert.equal(result.sharedArrayBuffer, true);
  assert.match(result.diagnostic, /^Erfolgreich: Forge/, "Forge must reach a real Mulligan");
  assert.deepEqual(errors, [], "Forge selftest must not cause page errors");
} finally {
  await browser.close();
}
