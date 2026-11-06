import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const ownedProfile = !process.env.MANABREW_TEST_PROFILE;
const profile = process.env.MANABREW_TEST_PROFILE ??
  mkdtempSync(join(tmpdir(), "manabrew-linux-first-run-"));
const chromeOptions = {
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
};
const context = await chromium.launchPersistentContext(profile, {
  ...chromeOptions,
  serviceWorkers: "allow",
});
const page = context.pages()[0] ?? await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  // A completely new Linux desktop profile must install automatically.
  // The ordinary iPad/Safari installer still requires a deliberate click.
  await page.goto(origin + "/offline-setup.html?desktop=1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForURL(/\/play\/offline\/constructed$/, { timeout: 600000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Anowon, the Ruin Thief"),
    null, { timeout: 90000 },
  );
  const online = await page.evaluate(async () => {
    const data = JSON.parse(localStorage.getItem("manabrew-deck-storage") ?? "{}");
    const saved = data.state?.savedDecks ?? [];
    const baselines = JSON.parse(localStorage.getItem("manabrew-github-deck-baselines-v2") ?? "{}");
    const manifest = await (await fetch("/offline-assets.json")).json();
    const personal = await (await fetch("/personal-decks.json")).json();
    const cache = await caches.open("manabrew-ipad-offline-" + manifest.version);
    return {
      path: location.pathname,
      decks: saved.filter(entry => entry.id?.startsWith("github:alexdermohr/magic:")).length,
      expectedDecks: personal.decks.length,
      baselines: Object.keys(baselines).length,
      version: manifest.version,
      files: manifest.files.length,
      ready: (await (await cache.match("/offline-ready.json"))?.text()) === manifest.version,
      isolated: crossOriginIsolated,
      engineWorker: typeof Worker !== "undefined",
    };
  });
  console.log("LINUX_AUTO_FIRST_RUN", JSON.stringify(online));
  assert.equal(online.path, "/play/offline/constructed");
  assert.ok(online.decks > 0);
  assert.equal(online.decks, online.expectedDecks);
  assert.ok(online.baselines >= online.decks);
  assert.ok(online.files >= 1000);
  assert.equal(online.ready, true);
  assert.equal(online.isolated, true);
  assert.equal(online.engineWorker, true);

  // No network (neither an external API nor the local PWA service).
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.body.innerText.includes("Anowon, the Ruin Thief"),
    null, { timeout: 90000 },
  );
  const offline = await page.evaluate(() => ({
    offline: navigator.onLine === false,
    isolated: crossOriginIsolated,
    deck: document.body.innerText.includes("Ardenn, Intrepid Archaeologist"),
  }));
  console.log("LINUX_OFFLINE_COLD_START", JSON.stringify(offline));
  assert.deepEqual(offline, { offline: true, isolated: true, deck: true });

  // Linux-specific copy is shown when explicitly revisiting the installer.
  await page.goto(origin + "/offline-setup.html?setup=1", {
    waitUntil: "domcontentloaded",
  });
  await page.locator("#state").waitFor();
  const copy = await page.evaluate(() => ({
    linuxVisible: !!document.querySelector("#linux-install")?.getClientRects().length,
    ipadHidden: !document.querySelector("#ipad-install")?.getClientRects().length,
    diagnosticLabel: document.querySelector("#engine-probe")?.textContent,
  }));
  console.log("LINUX_INSTALLER_COPY", JSON.stringify(copy));
  assert.ok(copy.linuxVisible && copy.ipadHidden);
  assert.match(copy.diagnosticLabel, /diesem Rechner/);

  // A subsequent launch with the completed cache goes directly to the deck
  // picker, including when the network has been disabled.
  await page.goto(origin + "/offline-setup.html?desktop=1", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForURL(/\/play\/offline\/constructed$/, { timeout: 90000 });
  console.log("LINUX_FAST_OFFLINE_REOPEN", JSON.stringify({
    path: new URL(page.url()).pathname,
    errors,
  }));
  assert.deepEqual(errors, []);
} finally {
  await context.close();
  if (ownedProfile) rmSync(profile, { recursive: true, force: true });
}