import assert from "node:assert/strict";
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "backup-default": { type: "string" },
    origin: { type: "string", default: "http://127.0.0.1:8088" },
    "next-sequence": { type: "string", default: "254" },
    expect: { type: "string", default: "match" },
    "chrome-executable": { type: "string" },
    "v8-flags": { type: "string", default: "" },
    "supervisor-source": { type: "string", default: "" },
    "wasm-source": { type: "string", default: "" },
    "playwright-module": { type: "string", default: "" },
  },
});

const originalDefault = values["backup-default"];
const nextSequence = Number(values["next-sequence"]);
assert(originalDefault && isAbsolute(originalDefault), "Supply an absolute --backup-default path");
assert(
  originalDefault.includes("/manabrew-recovery-backups/"),
  "The input must be an archived, not a live, Chrome profile",
);
assert(existsSync(originalDefault), "Archived Chrome Default profile is missing");
assert(Number.isInteger(nextSequence) && nextSequence >= 2 && nextSequence <= 296);
assert(
  ["match", "divergence"].includes(values.expect),
  "Expected outcome must be match or divergence",
);
assert(
  /^http:\/\/127\.0\.0\.1:\d+$/.test(values.origin),
  "Only the local loopback origin is supported",
);
const { chromium } = await import(
  values["playwright-module"]
    ? pathToFileURL(resolve(values["playwright-module"])).href
    : "playwright"
);
const wasmSource = values["wasm-source"] ? resolve(values["wasm-source"]) : null;
if (wasmSource)
  assert(existsSync(wasmSource) && statSync(wasmSource).isFile(), "The candidate WASM must exist");
const supervisorSource = values["supervisor-source"]
  ? readFileSync(resolve(values["supervisor-source"]), "utf8")
  : null;
const root = mkdtempSync(join(tmpdir(), "manabrew-historical-replay-"));
const errors = [];
const signals = [];
const config = {
  headless: true,
  serviceWorkers: "allow",
  executablePath: values["chrome-executable"] || undefined,
  viewport: { width: 1180, height: 820 },
  hasTouch: true,
  isMobile: false,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--disable-background-networking",
    ...(values["v8-flags"] ? ["--js-flags=" + values["v8-flags"]] : []),
  ],
};
let context;
let wasmServer;
let wasmUrl;
let expected;
let savedOriginalVersion;

function inspectMessages() {
  const W = window.Worker;
  window.__manabrewReplaySignals = [];
  window.__manabrewPromptType = null;
  window.Worker = class extends W {
    constructor(url, options) {
      super(url, options);
      if (String(url).includes("forge-engine")) {
        this.addEventListener("message", (event) => {
          const msg = event.data;
          if (msg?.type === "response" && msg.error) {
            window.__manabrewReplaySignals.push(String(msg.error).slice(0, 500));
          }
          if (
            msg?.type === "event" &&
            ["forge:engine_crash", "game:forced_end"].includes(msg.event)
          ) {
            window.__manabrewReplaySignals.push(
              String(msg.payload?.message ?? msg.payload?.text ?? "").slice(0, 500),
            );
          }
        });
      }
      if (String(url).includes("seat-reader")) {
        this.addEventListener("message", (event) => {
          if (typeof event.data !== "string") return;
          try {
            const msg = JSON.parse(event.data);
            if (msg.kind === "prompt")
              window.__manabrewPromptType = msg.prompt?.input?.type ?? null;
          } catch {
            /* Ignore unrelated bridge events. */
          }
        });
      }
    }
  };
}

async function open(activeWorkers) {
  context = await chromium.launchPersistentContext(root, {
    ...config,
    serviceWorkers: activeWorkers ? "allow" : "block",
  });
  if (activeWorkers) await context.addInitScript(inspectMessages);
  const page = context.pages()[0] ?? (await context.newPage());
  page.on("pageerror", (err) => errors.push(err.message.slice(0, 200)));
  return page;
}

async function close() {
  if (context) {
    await context.close();
    context = null;
  }
}

async function database(page) {
  return page.evaluate(async () => {
    const take = (req) =>
      new Promise((yes, no) => {
        req.onsuccess = () => yes(req.result);
        req.onerror = () => no(req.error);
      });
    const db = await take(indexedDB.open("manabrew-forge-autoresume-v1"));
    try {
      const tx = db.transaction(["current", "entries"], "readonly");
      const current = await take(tx.objectStore("current").get("active"));
      const entries = await take(tx.objectStore("entries").getAll());
      return { current, entries };
    } finally {
      db.close();
    }
  });
}

async function prepare(page) {
  const result = await page.evaluate(async (target) => {
    const take = (req) =>
      new Promise((yes, no) => {
        req.onsuccess = () => yes(req.result);
        req.onerror = () => no(req.error);
      });
    const db = await take(indexedDB.open("manabrew-forge-autoresume-v1"));
    try {
      const rd = db.transaction(["current", "entries"], "readonly");
      const active = await take(rd.objectStore("current").get("active"));
      const entries = await take(rd.objectStore("entries").getAll());
      if (
        active?.releaseId !== "7bdec1d0d5ebb95070a8" ||
        active.nextSequence !== entries.length + 1 ||
        entries.length !== 295
      ) {
        throw Error("Source must contain the full 295-entry original journal");
      }
      const originals = entries
        .filter((e) => e.sequence >= target && e.sequence < target + 3)
        .map((e) => ({
          sequence: e.sequence,
          action: e.action,
          prompt: e.prompt,
          verification: e.verification,
        }));
      if (target < active.nextSequence) {
        const boundary = entries.find((e) => e.sequence === target);
        if (!boundary?.verification?.rng || !boundary.prompt)
          throw Error("Missing original boundary witness");
        const tx = db.transaction(["current", "entries"], "readwrite", { durability: "strict" });
        tx.objectStore("entries").delete(IDBKeyRange.lowerBound(target));
        tx.objectStore("current").put(
          {
            ...active,
            nextSequence: target,
            prompt: boundary.prompt,
            verification: boundary.verification,
          },
          "active",
        );
        await new Promise((yes, no) => {
          tx.oncomplete = yes;
          tx.onabort = () => no(tx.error);
          tx.onerror = () => no(tx.error);
        });
      }
      const check = db.transaction(["current", "entries"], "readonly");
      const current = await take(check.objectStore("current").get("active"));
      const retained = await take(check.objectStore("entries").getAll());
      if (current.nextSequence !== target || retained.length !== target - 1) {
        throw Error("Disposable profile truncation was not atomic");
      }
      return {
        version: current.releaseId,
        cursor: current.nextSequence,
        retained: retained.length,
        original: active.nextSequence,
        originals,
      };
    } finally {
      db.close();
    }
  }, nextSequence);
  const { originals, ...publicResult } = result;
  expected = new Map(originals.map((e) => [e.sequence, e]));
  savedOriginalVersion = result.version;
  console.log("HISTORICAL_REPLAY_CLONE_PREPARED", JSON.stringify(publicResult));
}

async function startWasmServer() {
  if (!wasmSource) return;
  wasmServer = createServer((req, res) => {
    if (req.url !== "/candidate.wasm") {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": "application/wasm",
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Cache-Control": "no-store",
    });
    createReadStream(wasmSource).pipe(res);
  });
  await new Promise((done) => wasmServer.listen(0, "127.0.0.1", done));
  wasmUrl = "http://127.0.0.1:" + wasmServer.address().port + "/candidate.wasm";
}

async function patchOfflineAssets(page) {
  if (!supervisorSource && !wasmSource) return;
  const outcome = await page.evaluate(
    async ({ version, text, candidateWasmUrl }) => {
      const cache = await caches.open("manabrew-ipad-offline-" + version);
      const out = {};
      if (text) {
        const assetPath = "/assets/forge-engine.worker-C88Cadw4.js";
        const cached = await cache.match(assetPath);
        if (!cached) throw Error("The historical worker asset is absent from old CacheStorage");
        const before = await cached.text();
        if (!before.includes("if (initial && coldReplay && !coldVerified) {")) {
          throw Error("Historical worker guard changed unexpectedly");
        }
        const headers = new Headers(cached.headers);
        headers.delete("content-length");
        headers.delete("etag");
        await cache.put(
          assetPath,
          new Response(text, {
            status: cached.status,
            statusText: cached.statusText,
            headers,
          }),
        );
        const actual = await cache.match(assetPath);
        if ((await actual.text()) !== text) throw Error("Test-only worker overlay failed");
        out.worker = assetPath;
        out.originalBytes = before.length;
        out.overlayBytes = text.length;
        out.coep = actual.headers.get("cross-origin-embedder-policy");
      }
      if (candidateWasmUrl) {
        const assetPath = "/assets/forgeharness.js-CydL1_2v.wasm";
        const cached = await cache.match(assetPath);
        if (!cached) throw Error("The historical WASM is absent from old CacheStorage");
        const response = await fetch(candidateWasmUrl, { mode: "cors", cache: "no-store" });
        if (!response.ok) throw Error("Cannot fetch the private candidate WASM");
        const bytes = await response.arrayBuffer();
        const headers = new Headers(cached.headers);
        headers.delete("content-length");
        headers.delete("etag");
        await cache.put(
          assetPath,
          new Response(bytes, {
            status: cached.status,
            statusText: cached.statusText,
            headers,
          }),
        );
        const actual = await cache.match(assetPath);
        if ((await actual.arrayBuffer()).byteLength !== bytes.byteLength) {
          throw Error("Test-only WASM overlay was not staged");
        }
        out.wasmOverlayBytes = bytes.byteLength;
      }
      for (const key of await caches.keys()) {
        if (key.startsWith("manabrew-ipad-offline-") && key !== "manabrew-ipad-offline-" + version)
          await caches.delete(key);
      }
      return out;
    },
    { version: savedOriginalVersion, text: supervisorSource, candidateWasmUrl: wasmUrl },
  );
  if (supervisorSource)
    assert(
      outcome.coep === "require-corp",
      "Test-only supervisor must retain original COEP headers",
    );
  if (wasmSource)
    assert(
      outcome.wasmOverlayBytes === statSync(wasmSource).size,
      "Test-only WASM overlay must retain exact candidate byte length",
    );
  console.log("HISTORICAL_REPLAY_TEST_ASSETS", JSON.stringify(outcome));
}

async function state(page) {
  return page.evaluate(() => ({
    board: (document.body?.innerText ?? "").includes("Game board controls"),
    restoring: /restoring/i.test(document.body?.innerText ?? ""),
    path: location.pathname,
    seats: [
      ...(document.body?.innerText ?? "").matchAll(
        /Inspect (you|Forge AI|Brewy bot(?: \d+)?), (-?\d+) life/g,
      ),
    ].length,
    prompt: window.__manabrewPromptType,
    signals: window.__manabrewReplaySignals ?? [],
  }));
}

async function waitForBoard(page, label) {
  await page.waitForFunction(
    () => (document.body?.innerText ?? "").includes("Game board controls"),
    null,
    { timeout: 330000 },
  );
  const current = await state(page);
  assert.equal(current.seats, 4, "Historical game must have all four Commander seats");
  assert.equal(current.path, "/play/offline/constructed", "Historical board must be visible");
  console.log(
    "HISTORICAL_REPLAY_BOARD",
    JSON.stringify({
      stage: label,
      seats: current.seats,
      path: current.path,
    }),
  );
}

async function getJournal(page) {
  const { current, entries } = await database(page);
  return {
    cursor: current?.nextSequence,
    releaseMatches: current?.releaseId === savedOriginalVersion,
    items: entries.filter((e) => e.sequence >= nextSequence && e.sequence <= nextSequence + 2),
  };
}

async function advance(page, goal) {
  for (let i = 0; i < 50; i++) {
    const snapshot = await getJournal(page);
    if (snapshot.cursor >= goal) return snapshot;
    const visible = await state(page);
    assert(visible.board, "Game board disappeared before expected continuation");
    if (visible.prompt === "chooseCards") {
      const card = page.locator('button[aria-label="Activate to select this card"]');
      if (await card.count()) await card.first().click();
      await page.keyboard.press("Enter");
    } else if (
      visible.prompt === "chooseAction" ||
      visible.prompt === "chooseAttackers" ||
      !visible.prompt
    ) {
      await page.touchscreen.tap(1032, 765);
    } else {
      await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(1000);
  }
  throw Error("No further durable history after 50 real Pixi actions");
}

function compare(snapshot) {
  const checks = snapshot.items.map((item) => {
    const historical = expected.get(item.sequence);
    return {
      sequence: item.sequence,
      sameAction: JSON.stringify(item.action) === JSON.stringify(historical?.action),
      samePrompt: JSON.stringify(item.prompt) === JSON.stringify(historical?.prompt),
      sameState: item.verification?.state === historical?.verification?.state,
      sameRng: item.verification?.rng === historical?.verification?.rng,
      actualCalls: Number(String(item.verification?.rng ?? "").split(":")[0]),
      originalCalls: Number(String(historical?.verification?.rng ?? "").split(":")[0]),
    };
  });
  console.log(
    "HISTORICAL_REPLAY_CONTINUATION",
    JSON.stringify({
      cursor: snapshot.cursor,
      checks,
      privateValuesOmitted: true,
    }),
  );
  return checks;
}

async function observeResume(page) {
  let board = false;
  let sawReplayAttempt = false;
  let after;
  const deadline = Date.now() + 240000;
  while (Date.now() < deadline) {
    after = await state(page);
    if (after.board) {
      assert.equal(after.seats, 4);
      board = true;
      break;
    }
    if (after.restoring) sawReplayAttempt = true;
    if (after.signals.some((entry) => /state\/RNG divergence/i.test(entry))) break;
    if (sawReplayAttempt && after.path === "/play" && !after.restoring) break;
    await page.waitForTimeout(1000);
  }
  after = after ?? (await state(page));
  const saved = await getJournal(page);
  return {
    board,
    saved,
    pageErrors: errors.length,
    errorCategory: after.signals.some((msg) => /state\/RNG divergence/i.test(msg))
      ? "state-rng-divergence"
      : after.signals.length
        ? "other-worker-error"
        : "none",
  };
}

try {
  await startWasmServer();
  cpSync(originalDefault, join(root, "Default"), {
    recursive: true,
    preserveTimestamps: true,
  });
  let page = await open(false);
  await context.route("**/*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><meta charset=utf-8><title>Offline fixture</title>",
    }),
  );
  await page.goto(values.origin + "/historical-fixture", { waitUntil: "domcontentloaded" });
  await prepare(page);
  await close();

  page = await open(true);
  await page.goto(values.origin + "/offline-setup.html?setup=1", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await patchOfflineAssets(page);
  await close();

  page = await open(true);
  await page.goto(values.origin + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  if (nextSequence === 296 && values.expect === "divergence") {
    const outcome = await observeResume(page);
    console.log(
      "HISTORICAL_REPLAY_FULL_ATTEMPT",
      JSON.stringify({
        board: outcome.board,
        cursor: outcome.saved.cursor,
        errorCategory: outcome.errorCategory,
        pageErrors: outcome.pageErrors,
      }),
    );
    assert(!outcome.board, "Original 295-entry cold replay unexpectedly succeeded");
    assert.equal(outcome.saved.cursor, 296, "Full original history must remain intact");
    assert.equal(
      outcome.errorCategory,
      "state-rng-divergence",
      "The original historical replay must fail on the actual RNG witness",
    );
    console.log("HISTORICAL_FORGE_FULL_REPLAY_DIVERGENCE_REPRODUCED");
  } else {
    await waitForBoard(page, "first-load");
    assert.equal((await getJournal(page)).cursor, nextSequence);
    if (nextSequence < 296) {
      const availableHistoricalChecks = Math.min(2, 296 - nextSequence);
      const first = await advance(page, nextSequence + availableHistoricalChecks);
      assert(first.releaseMatches);
      const checks = compare(first);
      assert(checks.length >= availableHistoricalChecks);
      assert(
        checks.every((e) => e.sameAction && e.sameState && e.samePrompt),
        "Historical continuation must preserve actions, prompts and canonical state",
      );
      assert(checks[0].sameRng, "First restored decision witness must remain exact");
      if (values.expect === "match") {
        assert(
          checks.every((e) => e.sameRng),
          "Historical RNG diverged",
        );
      } else {
        assert(
          checks.some((e) => !e.sameRng),
          "Expected historical RNG divergence did not reproduce",
        );
      }
    } else {
      const continued = await advance(page, 297);
      assert(continued.releaseMatches);
      assert(continued.cursor >= 297, "Full original replay must accept a new durable action");
      console.log(
        "HISTORICAL_REPLAY_FULL_CONTINUED",
        JSON.stringify({
          cursor: continued.cursor,
          newHumanActionPersisted: true,
        }),
      );
    }
    await close();

    page = await open(true);
    await page.goto(values.origin + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
    const outcome = await observeResume(page);
    console.log(
      "HISTORICAL_REPLAY_RESTART",
      JSON.stringify({
        fullRestartBoard: outcome.board,
        restoredCursor: outcome.saved.cursor,
        errorCategory: outcome.errorCategory,
        errors: outcome.pageErrors,
      }),
    );
    if (values.expect === "match") {
      assert(
        outcome.board && outcome.saved.releaseMatches && outcome.pageErrors === 0,
        "Full Chrome restart must restore a playable board without errors",
      );
      assert(
        outcome.saved.cursor >= nextSequence + 1,
        "An original-game continuation must survive the full Chrome restart",
      );
      console.log("HISTORICAL_FORGE_REPLAY_VERIFIED");
    } else {
      assert(!outcome.board, "Expected cold-replay failure but the board was restored");
      assert.equal(
        outcome.errorCategory,
        "state-rng-divergence",
        "Expected the specific historical state/RNG verification failure",
      );
      console.log("HISTORICAL_FORGE_REPLAY_DIVERGENCE_REPRODUCED");
    }
  }
} finally {
  await close();
  if (wasmServer) await new Promise((done) => wasmServer.close(done));
  rmSync(root, { recursive: true, force: true });
  console.log("HISTORICAL_REPLAY_DISPOSABLE_PROFILE_REMOVED");
}
