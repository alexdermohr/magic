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
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ serviceWorkers: "allow" });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => {
  if (message.text().startsWith("DECK_START_PROGRESS ")) console.log(message.text());
});

try {
  await page.goto(origin + "/offline-setup.html?setup=1", {
    waitUntil: "domcontentloaded",
  });
  const results = await page.evaluate(
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

      async function run(deck) {
        const startedAt = Date.now();
        return new Promise((resolve) => {
          const worker = new Worker(workerUrl);
          let timer;
          let reader;
          let complete = false;
          const logs = [];
          const done = (error) => {
            if (complete) return;
            complete = true;
            clearInterval(reader);
            clearTimeout(timer);
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
            if (data?.event === "forge:log") {
              if (data.payload?.level === "error") logs.push(data.payload.text);
              return;
            }
            if (data?.type === "event" && data.event === "worker:init") {
              if (data.payload?.stage === "error") {
                done(data.payload?.message ?? "Forge Worker could not initialize");
              } else if (data.payload?.stage === "ready") {
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
                    done(null);
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
        const result = await run(entry.deck);
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
  await browser.close();
}
