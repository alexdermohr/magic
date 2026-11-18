/**
 * Diagnose the real published Forge WebImage with every personal Commander deck.
 * Starts one isolated Forge worker at a time; does not alter user saves or caches.
 * Success requires a genuine human mulligan over the production SAB protocol.
 */
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:8088";
const limit = Number(process.argv[3] ?? 44);
const offset = Number(process.argv[4] ?? 0);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    ...(process.env.MANABREW_TEST_V8_FLAGS
      ? ["--js-flags=" + process.env.MANABREW_TEST_V8_FLAGS]
      : []),
  ],
});
const page = await browser.newPage({ serviceWorkers: "allow" });
const pageErrors = [];
let lastProgressAt = Date.now();
let lastStep = null;
let progressTimedOut = false;
let watchdog;
const progressTimeoutMs = Number(process.env.MANABREW_MATRIX_PROGRESS_TIMEOUT_MS ?? 75_000);
let rejectOnCrash;
const pageCrashed = new Promise((_, reject) => {
  rejectOnCrash = reject;
});
page.on("crash", () => {
  console.error("DECK_START_RENDERER_CRASH " + JSON.stringify({ lastStep }));
  rejectOnCrash(new Error("Browser renderer crashed during Forge matrix"));
});
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  const text = message.text();
  if (/^DECK_START_(BEGIN|STAGE|PROGRESS) /.test(text)) {
    lastProgressAt = Date.now();
    lastStep = JSON.parse(text.slice(text.indexOf(" ") + 1));
    console.log(text);
  }
});

function boundedProbe(promise, ms = 3000) {
  return Promise.race([
    promise.then(
      () => "responsive",
      (error) => "error:" + String(error).slice(0, 120),
    ),
    new Promise((resolve) => setTimeout(() => resolve("timeout"), ms)),
  ]);
}

try {
  await page.goto(origin + "/offline-setup.html?setup=1", {
    waitUntil: "domcontentloaded",
  });
  const timedOut = new Promise((_, reject) => {
    watchdog = setInterval(() => {
      if (progressTimedOut || Date.now() - lastProgressAt < progressTimeoutMs) return;
      progressTimedOut = true;
      void (async () => {
        const renderer = await boundedProbe(page.evaluate(() => Date.now()));
        const browserState = await boundedProbe(
          browser.newBrowserCDPSession().then(async (session) => {
            try {
              return await session.send("Browser.getVersion");
            } finally {
              await session.detach();
            }
          }),
        );
        const diagnostic = {
          lastStep,
          idleMs: Date.now() - lastProgressAt,
          renderer,
          browser: browserState,
        };
        console.error("DECK_START_STALLED " + JSON.stringify(diagnostic));
        reject(new Error("Forge matrix stopped making progress: " + JSON.stringify(diagnostic)));
      })();
    }, 1000);
  });
  const evaluation = page.evaluate(
    async ({ limit, offset }) => {
      const manifest = await (await fetch("/offline-assets.json")).json();
      const collection = await (await fetch("/personal-decks.json")).json();
      const workerUrl = manifest.files.find((f) =>
        /^\/assets\/forge-engine\.worker-[A-Za-z0-9_-]+\.js$/.test(f.url),
      )?.url;
      const launcher = manifest.files.find((f) =>
        /^\/assets\/forgeharness-[A-Za-z0-9_-]+\.js$/.test(f.url),
      )?.url;
      const wasm = manifest.files.find((f) =>
        /^\/assets\/forgeharness\.js-[A-Za-z0-9_-]+\.wasm$/.test(f.url),
      )?.url;
      if (!workerUrl || !launcher || !wasm) {
        throw Error("Published Forge WebImage files unavailable");
      }

      const opponent =
        collection.decks.find((entry) => entry.deck.name === "Gahiji, Honored One")?.deck ??
        collection.decks[0].deck;

      async function run(deck, index) {
        const startedAt = Date.now();
        const stage = (value) =>
          console.log("DECK_START_STAGE " + JSON.stringify({ index, stage: value }));
        return new Promise((resolve) => {
          const worker = new Worker(workerUrl);
          let timer;
          let reader;
          let complete = false;
          let ending = false;
          let endTimer;
          const endRequestId = "matrix-end-" + index;
          const logs = [];
          const done = (error) => {
            if (complete) return;
            complete = true;
            clearInterval(reader);
            clearTimeout(timer);
            clearTimeout(endTimer);
            worker.terminate();
            resolve({
              status: error ? "FAIL" : "PASS",
              error: error ? String(error).slice(0, 500) : null,
              logs: error ? logs.slice(-5) : [],
              elapsedMs: Date.now() - startedAt,
            });
          };
          worker.onerror = (event) => done(event.message || "Forge Worker crashed before mulligan");
          worker.onmessage = ({ data }) => {
            if (data?.type === "response" && data.requestId === endRequestId) {
              stage("end-acknowledged");
              done(data.error ?? null);
              return;
            }
            if (data?.event === "forge:log") {
              if (data.payload?.level === "error") logs.push(data.payload.text);
              return;
            }
            if (data?.type === "event" && data.event === "worker:init") {
              if (data.payload?.stage === "error") {
                done(data.payload?.message ?? "Forge Worker could not initialize");
              } else if (data.payload?.stage === "ready") {
                stage("worker-ready");
                worker.postMessage({
                  type: "command",
                  command: "start_game",
                  requestId: "real-deck-matrix",
                  args: {
                    deck,
                    opponentDecks: [opponent],
                    startingLife: 40,
                    engine: "Forge",
                    forgeAi: true,
                    decisionJournal: true,
                    journalRewind: true,
                    durableBrowserResume: true,
                    experimentalInternalAiReplay: true,
                    forgeLauncherUrl: launcher,
                    forgeWasmUrl: wasm,
                  },
                });
              }
            } else if (data?.type === "event" && data.event === "game:sab") {
              stage("seat-ready");
              const signal = new Int32Array(data.payload.buffer, 0, 2);
              const body = new Uint8Array(data.payload.buffer, 8);
              const decoder = new TextDecoder();
              const encoder = new TextEncoder();
              reader = setInterval(() => {
                if (Atomics.load(signal, 0) !== 1) return;
                const length = Atomics.load(signal, 1);
                if (length < 1 || length > body.length) {
                  done("Invalid Forge game state length");
                  return;
                }
                try {
                  const message = JSON.parse(decoder.decode(body.slice(0, length)));
                  const prompt = message.kind === "prompt" ? message.prompt : null;
                  const input = prompt?.input;
                  if (input?.type === "mulligan") {
                    if (!ending) {
                      ending = true;
                      stage("mulligan");
                      worker.postMessage({
                        type: "command",
                        command: "end_game",
                        requestId: endRequestId,
                      });
                      endTimer = setTimeout(
                        () => done("Forge end_game was not acknowledged"),
                        10_000,
                      );
                    }
                    return;
                  }
                  // These are informational reveal/roll dialogs. They need a
                  // normal acknowledgement to proceed to the actual mulligan.
                  const output =
                    input?.type === "revealCards"
                      ? { type: "revealCardsAcknowledged" }
                      : input?.type === "diceRolled"
                        ? { type: "diceRolledAcknowledged" }
                        : null;
                  if (output) {
                    const response = encoder.encode(
                      JSON.stringify({
                        kind: "response",
                        promptId: prompt.promptId,
                        action: { type: input.type, output },
                      }),
                    );
                    if (response.length > body.length) {
                      done("Forge response too large");
                      return;
                    }
                    body.set(response);
                    Atomics.store(signal, 1, response.length);
                    Atomics.store(signal, 0, 2);
                    Atomics.notify(signal, 0);
                  } else if (prompt) {
                    done("Unexpected Forge prompt: " + input?.type);
                  } else {
                    Atomics.store(signal, 0, 3);
                    Atomics.notify(signal, 0);
                  }
                } catch (error) {
                  done(error);
                }
              }, 40);
            } else if (data?.type === "response" && data.error) {
              done(data.error);
            } else if (data?.type === "event" && data.event === "game:forced_end") {
              done(data.payload?.message || "Forced game end");
            } else if (data?.type === "event" && data.event === "game:over") {
              done("Game ended before mulligan");
            }
          };
          timer = setTimeout(() => done("No mulligan within 45 seconds"), 45000);
        });
      }
      const results = [];
      for (const entry of collection.decks.slice(offset, offset + limit)) {
        const index = offset + results.length + 1;
        console.log("DECK_START_BEGIN " + JSON.stringify({ index, id: entry.id }));
        const result = await run(entry.deck, index);
        results.push({ id: entry.id, name: entry.deck.name, ...result });
        console.log(
          "DECK_START_PROGRESS " +
            JSON.stringify({ index: offset + results.length, id: entry.id, ...result }),
        );
      }
      return {
        manifest: manifest.version,
        tested: results.length,
        passed: results.filter((r) => r.status === "PASS").length,
        failed: results.filter((r) => r.status === "FAIL"),
        results,
      };
    },
    { limit, offset },
  );
  const results = await Promise.race([timedOut, pageCrashed, evaluation]);
  console.log(
    "FORGE_PERSONAL_START_MATRIX",
    JSON.stringify({
      manifest: results.manifest,
      tested: results.tested,
      passed: results.passed,
      failed: results.failed,
      sample: results.results.slice(0, 3),
      pageErrors,
    }),
  );
  if (results.failed.length || pageErrors.length) process.exitCode = 1;
} finally {
  clearInterval(watchdog);
  await browser.close();
}
