import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { ForgeEngine } from "../../packages/forge-wasm/node.js";
import { scriptedAnswer } from "./journal-fixture.mjs";

const { values } = parseArgs({
  options: {
    "personal-decks": { type: "string" },
    "webimage-dir": {
      type: "string",
      default: fileURLToPath(new URL("../../packages/forge-wasm/", import.meta.url)),
    },
    decisions: { type: "string", default: "310" },
    continuation: { type: "string", default: "35" },
    restart: { type: "string", default: "10" },
    seed: { type: "string", default: "424242" },
    "replay-heap-mib": { type: "string", default: "" },
    mode: { type: "string", default: "run" },
    "snapshot-in": { type: "string" },
    "snapshot-out": { type: "string" },
  },
});
function positive(value, max) {
  const n = Number(value);
  assert(Number.isSafeInteger(n) && n > 0 && n <= max, "Invalid numeric test option");
  return n;
}
const count = positive(values.decisions, 10000);
const seed = positive(values.seed, 2147483646);
assert(values["personal-decks"], "Pass --personal-decks <generated personal-decks.json>");
const decksFile = resolve(values["personal-decks"]);
const engineDir = resolve(values["webimage-dir"]);
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
function normalized(view) {
  const { checkpoints, decisionHistory, restoreVote, snapshotRecording, ...game } = view;
  return game;
}
function runMatrix() {
  const directory = mkdtempSync(join(tmpdir(), "manabrew-webimage-replay-"));
  const script = fileURLToPath(import.meta.url);
  const original = join(directory, "original.json");
  const continued = join(directory, "continued.json");
  const restarted = join(directory, "restarted.json");
  const heapFlags = values["replay-heap-mib"]
    ? ["--max-old-space-size=" + positive(values["replay-heap-mib"], 32768)]
    : [];
  const child = (flags, mode, decisions, output, input) => {
    const args = [
      ...flags,
      script,
      "--mode",
      mode,
      "--personal-decks",
      decksFile,
      "--webimage-dir",
      engineDir,
      "--decisions",
      String(decisions),
      "--seed",
      String(seed),
      "--snapshot-out",
      output,
      ...(input ? ["--snapshot-in", input] : []),
    ];
    const result = spawnSync(process.execPath, args, { stdio: "inherit", timeout: 540000 });
    if (result.error) throw result.error;
    assert.equal(
      result.status,
      0,
      "WebImage replay subprocess failed: " + (result.signal ?? result.status),
    );
  };
  try {
    const more = positive(values.continuation, 10000);
    const final = positive(values.restart, 10000);
    child(["--liftoff-only"], "record", count, original);
    child(heapFlags, "restore", more, continued, original);
    child(["--liftoff-only", ...heapFlags], "restore", final, restarted, continued);
    const a = JSON.parse(readFileSync(original, "utf8"));
    const b = JSON.parse(readFileSync(continued, "utf8"));
    const c = JSON.parse(readFileSync(restarted, "utf8"));
    assert.equal(a.nextSequence, count + 1);
    assert.equal(b.nextSequence, count + more + 1);
    assert.equal(c.nextSequence, count + more + final + 1);
    assert.equal(digest(b.journal.entries.slice(0, count)), digest(a.journal.entries));
    assert.equal(digest(c.journal.entries.slice(0, count + more)), digest(b.journal.entries));
    console.log(
      "WEBIMAGE_LONG_REPLAY_PASS",
      JSON.stringify({
        seed,
        original: count,
        continued: count + more,
        restarted: count + more + final,
        compilerModes: ["liftoff", "normal", "liftoff"],
        replayHeapMiB: values["replay-heap-mib"] || null,
      }),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

async function playProcess() {
  assert(["record", "restore"].includes(values.mode) && values["snapshot-out"]);
  const names = ["Arahbo", "Rin and Seri", "Gahiji", "Anowon"];
  const list = JSON.parse(readFileSync(decksFile, "utf8")).decks;
  const decks = names.map((name) => list.find((entry) => entry.deck?.name.startsWith(name))?.deck);
  assert(
    decks.every((deck) => deck?.format === "commander" && deck.commanders?.length),
    "Fixture requires the four named Commander decks",
  );
  const snapshot =
    values.mode === "restore" ? JSON.parse(readFileSync(values["snapshot-in"], "utf8")) : null;
  let entries = snapshot?.journal.entries.slice() ?? [];
  let start = snapshot?.journal.startRequest ?? null;
  let boundary, view, prompt, engine;
  let answered = 0,
    lastPromptId = null,
    done = false,
    restored = false;
  const times = [],
    t0 = performance.now();
  let resolveDone, rejectDone;
  const result = new Promise((r, j) => {
    resolveDone = r;
    rejectDone = j;
  });
  void result.catch(() => {});
  const timer = setTimeout(() => finish(new Error("Engine deadline exceeded")), 480000);
  function finish(error) {
    if (done) return;
    done = true;
    clearTimeout(timer);
    engine?.dispose();
    if (error) rejectDone(error);
    else resolveDone();
  }
  function stats() {
    const sorted = times.slice().sort((a, b) => a - b);
    const pct = (q) => Math.round(sorted[Math.max(0, Math.ceil(q * sorted.length) - 1)] ?? 0);
    return { samples: sorted.length, medianMs: pct(0.5), p95Ms: pct(0.95), maxMs: pct(1) };
  }
  function consume(packet) {
    if (done) return;
    try {
      assert(!packet.replaceHistory, "Unexpected rewind");
      if (packet.startRequest) {
        assert(!start || start === packet.startRequest, "Start request changed");
        start = packet.startRequest;
      }
      for (const entry of packet.entries ?? []) {
        assert.equal(entry.sequence, entries.length + 1, "Journal sequence gap");
        entries.push(entry);
      }
      assert.equal(packet.nextSequence, entries.length + 1);
      boundary = packet;
      advance();
    } catch (error) {
      finish(error);
    }
  }
  function advance() {
    if (
      done ||
      !prompt ||
      !view ||
      !boundary ||
      boundary.prompt?.promptId !== prompt.promptId ||
      lastPromptId === prompt.promptId
    )
      return;
    try {
      assert(start && boundary.verification?.state && boundary.verification?.rng);
      if (snapshot && !restored) {
        assert.equal(boundary.nextSequence, snapshot.nextSequence);
        assert.equal(digest(boundary.prompt), digest(snapshot.prompt), "Terminal prompt differs");
        assert.equal(
          digest(boundary.verification),
          digest(snapshot.verification),
          "Terminal witness differs",
        );
        assert.equal(digest(entries), digest(snapshot.journal.entries), "Original journal differs");
        assert.equal(
          digest(normalized(view)),
          snapshot.testViewHash,
          "Actual restored view differs",
        );
        restored = true;
        console.log(
          "WEBIMAGE_RESTORED_EXACT",
          JSON.stringify({
            entries: entries.length,
            cursor: boundary.nextSequence,
            turn: view.turn,
            step: view.step,
            elapsedMs: Math.round(performance.now() - t0),
          }),
        );
      }
      if (answered >= count) {
        assert.equal(view.players.length, 4);
        const out = {
          version: 1,
          nextSequence: boundary.nextSequence,
          journal: { version: 2, startRequest: start, entries },
          prompt: boundary.prompt,
          verification: boundary.verification,
          testViewHash: digest(normalized(view)),
        };
        writeFileSync(values["snapshot-out"], JSON.stringify(out), { mode: 0o600, flag: "wx" });
        console.log(
          "WEBIMAGE_REPLAY_PROCESS_PASS",
          JSON.stringify({
            mode: values.mode,
            answered,
            entries: entries.length,
            cursor: boundary.nextSequence,
            turn: view.turn,
            players: view.players.length,
            elapsedMs: Math.round(performance.now() - t0),
            timings: stats(),
            rssBytes: process.memoryUsage().rss,
            restored,
            seed,
          }),
        );
        finish();
        return;
      }
      const action =
        prompt.input.type === "chooseAction"
          ? { type: "chooseAction", output: { type: "pass" } }
          : scriptedAnswer({ prompt });
      lastPromptId = prompt.promptId;
      answered++;
      if (answered % 25 === 0)
        console.log(
          "WEBIMAGE_REPLAY_PROGRESS",
          JSON.stringify({
            mode: values.mode,
            answered,
            entries: entries.length,
            turn: view.turn,
            timings: stats(),
            rssBytes: process.memoryUsage().rss,
          }),
        );
      engine.respond(prompt.promptId, action);
    } catch (error) {
      finish(error);
    }
  }
  engine = new ForgeEngine({
    launcherUrl: join(engineDir, "forgeharness.js"),
    wasmUrl: join(engineDir, "forgeharness.js.wasm"),
    onState(state) {
      view = state.gameView;
    },
    onPrompt(value) {
      prompt = value;
      advance();
    },
    onError(error) {
      finish(new Error(String(error)));
    },
    onEvent(event, payload) {
      if (event === "forge:recovery_checkpoint") consume(payload);
      else if (event === "forge:decision" && Number.isFinite(payload?.ms)) times.push(payload.ms);
      else if (event === "game:forced_end")
        finish(new Error(String(payload?.message ?? "Forced end")));
      else if (event === "game:over") finish(new Error("Game ended before target: " + answered));
    },
  });
  try {
    await engine.startGame({
      deck: decks[0],
      opponentDecks: decks.slice(1),
      forgeAi: true,
      decisionJournal: true,
      journalRewind: true,
      durableBrowserResume: true,
      experimentalInternalAiReplay: true,
      snapshotRecording: true,
      gameId: "webimage-long-replay-" + seed,
      seed,
      ...(snapshot ? { replaySnapshot: snapshot } : {}),
    });
    await result;
  } catch (error) {
    finish(error);
    throw error;
  }
}

if (values.mode === "run") runMatrix();
else await playProcess();
