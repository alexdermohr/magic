import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import { createDirectiveLane, writeDirectiveLane, createSeat, writeSeatMessage } from "./seat.js";

const source = readFileSync(
  new URL("./forge-engine.worker.js", import.meta.url),
  "utf8",
);
function fixture(started = true, args = {}, workerHref = "worker.js") {
  const workers = [],
    output = [],
    timers = new Map(),
    timerDurations = new Map();
  let timerId = 0;
  class Worker {
    sent = [];
    terminated = false;
    constructor(url) {
      this.url = url;
      workers.push(this);
    }
    postMessage(data) {
      this.sent.push(data);
    }
    terminate() {
      this.terminated = true;
    }
    event(event, payload) {
      this.onmessage({ data: { type: "event", event, payload } });
    }
    response(requestId, payload) {
      this.onmessage({ data: { type: "response", requestId, payload } });
    }
    error(message) {
      const event = new Event("error", { cancelable: true });
      Object.assign(event, { message });
      this.onerror(event);
      return event;
    }
  }
  const self = { location: { href: workerHref }, postMessage: (data) => output.push(data) };
  const context = vm.createContext({
    self,
    Worker,
    URL,
    SharedArrayBuffer,
    Int32Array,
    Atomics,
    console: {},
    setTimeout: (fn, delay) => {
      timers.set(++timerId, fn);
      timerDurations.set(timerId, delay);
      return timerId;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  vm.runInContext(source, context);
  vm.runInContext(
    "supervise(" + JSON.stringify({ type: "command", command: "start_game", requestId: "start", args }) + ")",
    context,
  );
  const active = workers[0];
  active.event("worker:init", { stage: "ready" });
  if (started) active.response("start", "game-started");
  const lanes = {
    buffers: [new SharedArrayBuffer(4096)],
    hostBuffer: new SharedArrayBuffer(4096),
    localSeat: 0,
  };
  active.event("game:directive_lanes", lanes);
  const rewind = (worker = active) => {
    worker.event("forge:rewind", { lastPromptId: 50, prompt: { promptId: 10 } });
    const candidate = workers.at(-1);
    candidate.event("worker:init", { stage: "ready" });
    assert.equal(candidate.sent[0].args.rewindDirectiveLanes, lanes);
    candidate.event("game:sab", { buffer: new SharedArrayBuffer(256 * 1024) });
    candidate.event("game:directive_lanes", lanes);
    return candidate;
  };
  const command = (name, id = name) =>
    self.onmessage({ data: { type: "command", command: name, requestId: id } });
  const responses = (id) =>
    output.filter((data) => data.type === "response" && data.requestId === id);
  return { workers, output, timers, timerDurations, active, lanes, rewind, command, responses };
}

test("offline download response URL never bypasses the cache for Forge leaves", () => {
  const url = "https://test.invalid/assets/forge-engine.worker.js?revision=3&__offline_fetch=release&keep=yes";
  const expected = "https://test.invalid/assets/forge-engine.worker.js?revision=3&keep=yes";
  const f = fixture(true, {}, url);
  assert.equal(f.active.url, expected);
  const candidate = f.rewind();
  assert.equal(candidate.url, expected);
  candidate.event("forge:replay_ready");
  f.command("end_game");
  assert(f.workers.every((worker) => worker.terminated));
  for (const normal of [
    "worker.js",
    "/tmp/forge-engine.worker.js",
    "https://test.invalid/worker.js?revision=3",
  ]) {
    const plain = fixture(true, {}, normal);
    assert.equal(plain.active.url, normal);
    plain.command("end_game");
  }
});

test("an empty child worker load error retains the real startup failure", () => {
  const f = fixture(false);
  f.active.error("");
  assert.equal(f.responses("start").length, 1);
  assert.equal(f.responses("start")[0].error, "Forge child worker could not be loaded.");
  assert(f.active.terminated);
});

test("commands resolve before, during and after consecutive promotions", () => {
  const f = fixture();
  let active = f.active;
  for (let n = 0; n < 3; n++) {
    f.command("get_prompt", `before${n}`);
    const candidate = f.rewind(active);
    f.command("get_game_view", `during${n}`);
    f.command("respond", `ready${n}`);
    candidate.event("forge:replay_ready");
    f.command("get_prompt", `after${n}`);
    for (const id of [`before${n}`, `during${n}`, `ready${n}`, `after${n}`]) {
      assert.equal(f.responses(id).length, 1);
      assert.equal(f.responses(id)[0].payload, null);
    }
    assert(active.terminated);
    assert.equal(candidate.sent.length, 1, "no commands sent into blocked leaf event loop");
    assert.equal(Atomics.load(new Int32Array(candidate.sent[0].args.rewindControl), 0), 2);
    active = candidate;
  }
  f.command("end_game");
  assert(f.workers.every((worker) => worker.terminated));
  assert.equal(f.timers.size, 0);
});

test("failed candidate and timeout resume original and answer commands", () => {
  for (const failure of ["error", "exit", "timeout"]) {
    const f = fixture();
    const candidate = f.rewind();
    f.command("get_prompt", "pending");
    if (failure === "error") assert(candidate.error("crash").defaultPrevented);
    if (failure === "exit") candidate.event("game:over", {});
    if (failure === "timeout") [...f.timers.values()][0]();
    assert(candidate.terminated);
    assert(!f.active.terminated);
    assert.equal(Atomics.load(new Int32Array(f.active.sent[0].args.rewindControl), 0), 1);
    f.command("respond", "continued");
    assert.equal(f.responses("pending").length, 1);
    assert.equal(f.responses("continued").length, 1);
    const next = f.rewind();
    next.event("forge:replay_ready");
    assert(f.active.terminated);
    f.command("end_game");
  }
});

test("termination or original failure cancels candidate and ignores late promotion", () => {
  for (const failure of ["end", "error", "forced_end", "over"]) {
    const f = fixture();
    const candidate = f.rewind();
    if (failure === "end") f.command("end_game");
    if (failure === "error") assert(f.active.error("source crash").defaultPrevented);
    if (["forced_end", "over"].includes(failure)) f.active.event(`game:${failure}`, {});
    const events = f.output.length;
    candidate.event("forge:replay_ready");
    f.active.event("forge:rewind", {});
    assert.equal(f.output.length, events);
    assert(f.workers.every((worker) => worker.terminated));
    assert.equal(f.timers.size, 0);
    f.command("get_prompt", "late");
    assert(f.responses("late")[0].error);
  }
});

test("end during startup settles the original pending request once", () => {
  const f = fixture(false);
  f.command("end_game");
  f.active.response("start", "game-started");
  assert.equal(f.responses("start").length, 1);
  assert(f.responses("start")[0].error);
});

test("full directive lane and UI queue survive promotion, cancellation stops flushing", async () => {
  const f = fixture();
  const lane = createDirectiveLane(f.lanes.buffers[0]);
  writeDirectiveLane(lane, { type: "concede" });
  writeDirectiveLane(lane, { type: "requestRestore", checkpointId: 1 });
  const candidate = f.rewind();
  candidate.event("forge:replay_ready");
  assert.equal(f.output.filter((data) => data.event === "game:directive_lanes").length, 1);
  assert.equal(Atomics.load(lane.signal, 0), 1);
  assert.equal(
    JSON.parse(new TextDecoder().decode(lane.data.slice(0, lane.signal[1]))).type,
    "concede",
  );
  Atomics.store(lane.signal, 0, 0);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(lane.queue.length, 0);
  assert.equal(
    JSON.parse(new TextDecoder().decode(lane.data.slice(0, lane.signal[1]))).type,
    "requestRestore",
  );
  writeDirectiveLane(lane, { type: "concede" });
  lane.cancelled = true;
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(lane.flushScheduled, false);
  assert.equal(lane.queue.length, 0);
  f.command("end_game");
});

test("UI termination rejects game requests, preserves query requests, cancels directive queues", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
  const start = web.indexOf("class WorkerBridge {");
  const end = web.indexOf("// Web Game API", start);
  const js = transpileModule(
    web
      .slice(start, end)
      .replaceAll("import.meta.url", JSON.stringify("https://test.invalid/web.ts")),
    { compilerOptions: { target: ScriptTarget.ES2022 } },
  ).outputText;
  const events = new Map();
  const eventBus = { on: (name, handler) => events.set(name, handler) };
  const context = vm.createContext({
    setForgeWasmActive() {},
    eventBus,
    writeSeatMessage,
    DEBUG_TRANSPORT: false,
    document: { addEventListener() {} },
    window: { addEventListener() {} },
  });
  vm.runInContext(
    js.replaceAll("import.meta.url", JSON.stringify("https://test.invalid/web.ts")) +
      "\nglobalThis.bridge = new WorkerBridge(eventBus);",
    context,
  );
  const bridge = context.bridge;
  const remote = createSeat(new SharedArrayBuffer(256 * 1024));
  bridge.remoteSeats.set("player-1", remote);
  bridge.remotePlayerSlots.set("bob", "player-1");
  const remoteReply = (promptId) =>
    events.get("server:state_update")({
      from_player: "bob",
      state: {
        kind: "response",
        fromPlayer: "player-1",
        promptId,
        action: { type: "chooseAction", output: { type: "pass" } },
      },
    });
  remoteReply(0);
  assert.equal(Atomics.load(remote.signal, 0), 0, "uncorrelated remote answer reached the engine");
  remoteReply(7);
  assert.equal(Atomics.load(remote.signal, 0), 2);
  const gameWorker = { terminate() {} },
    queryWorker = {};
  bridge.worker = gameWorker;
  bridge.fallbackWorker = queryWorker;
  let rejected = 0;
  bridge.pendingRequests.set("game", { worker: gameWorker, reject: () => rejected++ });
  bridge.pendingRequests.set("query", {
    worker: queryWorker,
    reject: () => assert.fail("query cancelled"),
  });
  const lane = createDirectiveLane(new SharedArrayBuffer(4096));
  writeDirectiveLane(lane, { type: "concede" });
  writeDirectiveLane(lane, { type: "concede" });
  bridge.directiveLanes = {
    lanes: [lane],
    host: createDirectiveLane(new SharedArrayBuffer(4096)),
    localSeat: 0,
  };
  bridge.terminate();
  assert.equal(rejected, 1);
  assert.equal(bridge.pendingRequests.size, 1);
  assert(bridge.pendingRequests.has("query"));
  assert(lane.cancelled);
  assert.equal(bridge.directiveLanes, null);
});

test("normal game end delivers a late final SAB prompt before stopping its reader", async () => {
  const { ForgeEngine } = await import("../../packages/forge-wasm/engine.js");
  let receive;
  const prompts = [];
  const engine = new ForgeEngine(
    {
      locations: () => ({}),
      unsupported: () => false,
      spawnWorker: () => ({
        onMessage: (callback) => {
          receive = callback;
        },
        onError() {},
        terminate() {},
      }),
    },
    { onPrompt: (prompt) => prompts.push(prompt) },
  );
  const initialized = engine.init();
  receive({ type: "event", event: "worker:init", payload: { stage: "ready" } });
  await initialized;
  receive({
    type: "event",
    event: "game:sab",
    payload: { buffer: new SharedArrayBuffer(256 * 1024) },
  });
  const seat = engine.seats.get("local");
  receive({ type: "event", event: "game:over", payload: {} });
  assert(!seat.cancelled);
  const bytes = new TextEncoder().encode(
    JSON.stringify({ kind: "prompt", prompt: { promptId: 1000001, input: { type: "gameOver" } } }),
  );
  seat.data.set(bytes);
  Atomics.store(seat.signal, 1, bytes.length);
  Atomics.store(seat.signal, 0, 1);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(prompts.length, 1);
  assert(seat.cancelled);
  engine.dispose();
});

test("cold replay preserves the original leaf error rather than hiding it", () => {
  const snapshot = {
    version: 1, nextSequence: 256,
    journal: { version: 2, startRequest: '{"gameId":"recover-test"}', entries: [{}] },
    prompt: { promptId: 900 }, verification: { state: "a".repeat(64), rng: "9916:ff" },
  };
  const f = fixture(false, { replaySnapshot: snapshot, journalRewind: true });
  const failure = "java.lang.IllegalStateException: state/RNG divergence at decision 255 (state=equal, rng=different)";
  f.active.onmessage({ data: { type: "response", requestId: "start", error: failure } });
  assert.equal(f.responses("start").length, 1);
  assert.equal(f.responses("start")[0].error, failure);
  assert.equal(f.timers.size, 0);
  assert(f.active.terminated);
});

test("cold restore conceals a dead worker until verified state and RNG", () => {
  const snapshot = {
    version: 1, nextSequence: 3,
    journal: { version: 2, startRequest: '{"gameId":"recover-test"}', entries: [{}, {}] },
    prompt: { promptId: 22 }, verification: { state: "a".repeat(64), rng: 98 },
  };
  const f = fixture(false, { replaySnapshot: snapshot, journalRewind: true });
  const worker = f.active;
  assert.deepEqual(JSON.parse(JSON.stringify(worker.sent[0].args.replaySnapshot)), snapshot);
  assert.equal(worker.sent[0].args.promptOffset, 0, "dead worker has no prior prompt offset");
  worker.event("game:sab", { buffer: new SharedArrayBuffer(256 * 1024) });
  worker.response("start", "game-started");
  assert.equal(f.responses("start").length, 0);
  assert.equal(f.output.some((entry) => entry.event === "game:sab"), false);
  worker.event("forge:recovery_checkpoint", { secret: "unverified" });
  assert.equal(f.output.some((entry) => entry.event === "forge:recovery_checkpoint"), false);
  assert.equal(f.output.filter((entry) => entry.event === "game:directive_lanes").length, 0);
  worker.event("forge:replay_ready", {});
  assert.equal(f.responses("start").length, 1);
  assert.equal(f.responses("start")[0].payload, "game-started");
  assert.equal(f.output.filter((entry) => entry.event === "game:sab").length, 1);
  assert.equal(f.output.filter((entry) => entry.event === "game:directive_lanes").length, 1,
    "cold restore must publish freshly created directive lanes after replay verifies");
  assert.equal(Atomics.load(new Int32Array(worker.sent[0].args.rewindControl), 0), 2);
  f.command("end_game");
  assert(worker.terminated);
});

test("cold replay releases recording status only after verifying and installing directive lanes", () => {
  const snapshot = {
    version: 1, nextSequence: 2,
    journal: { version: 2, startRequest: '{"gameId":"recover-test"}', entries: [{}] },
    prompt: { promptId: 22 }, verification: { state: "a".repeat(64), rng: "1:2" },
  };
  const f = fixture(false, { replaySnapshot: snapshot, journalRewind: true });
  const recording = { seat: 0, directive: { type: "recordingStatus", status: "completed" } };
  f.active.event("game:seat_directive", recording);
  assert(!f.output.some((event) => event.event === "game:seat_directive"));
  f.active.response("start", "game-started");
  f.active.event("forge:replay_ready");
  const lanesIndex = f.output.findIndex((event) => event.event === "game:directive_lanes");
  const statusIndex = f.output.findIndex((event) => event.event === "game:seat_directive");
  assert(lanesIndex >= 0 && statusIndex > lanesIndex, "status requires verified directive lanes");
  assert.deepEqual(f.output[statusIndex].payload, recording);
  f.command("end_game");

  const aborted = fixture(false, { replaySnapshot: snapshot, journalRewind: true });
  aborted.active.event("game:seat_directive", recording);
  aborted.active.event("game:forced_end", { reason: "replay divergence" });
  assert(!aborted.output.some((event) => event.event === "game:seat_directive"));
});

test("hot rewind preserves recording-status directives until candidate promotion", () => {
  const f = fixture();
  const candidate = f.rewind();
  const recording = { seat: 0, directive: { type: "recordingStatus", status: "active" } };
  candidate.event("game:seat_directive", recording);
  assert(!f.output.some((event) => event.event === "game:seat_directive"));
  candidate.event("forge:replay_ready");
  const events = f.output.filter((event) => event.event === "game:seat_directive");
  assert.equal(events.length, 1);
  assert.deepEqual(events[0].payload, recording);
  f.command("end_game");
});

test("cold restore retains verified directive lanes across a subsequent rewind", () => {
  const snapshot = {
    version: 1,
    nextSequence: 2,
    journal: { version: 2, startRequest: '{"gameId":"recover-test"}', entries: [{}] },
    prompt: { promptId: 22 },
    verification: { state: "a".repeat(64), rng: "1:2" },
  };
  const f = fixture(false, { replaySnapshot: snapshot, journalRewind: true });
  f.active.response("start", "game-started");
  f.active.event("forge:replay_ready");
  assert.equal(f.output.filter((entry) => entry.event === "game:directive_lanes").length, 1);

  f.active.event("forge:rewind", { lastPromptId: 40, prompt: { promptId: 22 } });
  const candidate = f.workers.at(-1);
  candidate.event("worker:init", { stage: "ready" });
  assert.strictEqual(candidate.sent[0].args.rewindDirectiveLanes, f.lanes);
  candidate.event("game:directive_lanes", f.lanes);
  candidate.event("forge:replay_ready");
  assert.equal(f.output.filter((entry) => entry.event === "game:directive_lanes").length, 1);
  f.command("end_game");
});

test("verified durable rewind publishes replacement history before resuming the candidate", () => {
  const f = fixture(true, { durableBrowserResume: true });
  const startRequest = JSON.stringify({ gameId: "forge-rewind-1",
    decisionJournal: true, journalRewind: true });
  const rewind = {
    version: 1,
    nextSequence: 2,
    journal: { version: 2, startRequest, entries: [{
      sequence: 1, playerIndex: 0,
      prompt: { decidingPlayerId: "player-0" },
      action: { type: "chooseAction" },
      verification: { state: "a".repeat(64), rng: "0:aa" },
    }] },
    prompt: { decidingPlayerId: "player-0", promptId: 12 },
    verification: { state: "b".repeat(64), rng: "0:bb" },
    lastPromptId: 40,
  };
  f.active.event("forge:rewind", rewind);
  const candidate = f.workers.at(-1);
  candidate.event("worker:init", { stage: "ready" });
  assert(!f.output.some((event) => event.event === "forge:recovery_checkpoint"));
  candidate.event("forge:replay_ready");
  const published = f.output.filter((event) => event.event === "forge:recovery_checkpoint");
  assert.equal(published.length, 1);
  assert.equal(published[0].payload.gameId, "forge-rewind-1");
  assert.equal(published[0].payload.replaceHistory, true);
  assert.equal(published[0].payload.nextSequence, 2);
  assert.deepEqual(published[0].payload.entries, rewind.journal.entries);
  assert.equal(Atomics.load(new Int32Array(candidate.sent[0].args.rewindControl), 0), 2);
  f.command("end_game");
});

test("failed fresh Forge replay start resets its worker and releases tab ownership", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
  const cls = web.indexOf("class WebGameApi implements IGameApi");
  const start = web.indexOf("  async startGame(params: StartGameParams)", cls);
  const end = web.indexOf("\n  async startMultiplayerGame(", start);
  assert(cls >= 0 && start > cls && end > start);
  const source = `class TestRecoveryApi {
    currentRecovery = null;
    releaseRecoveryOwnership = null;
    isMultiplayer = false;
    constructor(bridge) { this.bridge = bridge; }
    ${web.slice(start, end)}
  }
  globalThis.TestRecoveryApi = TestRecoveryApi;`;
  const code = transpileModule(source, {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  let terminated = 0;
  let disposed = 0;
  let released = 0;
  let invoked = 0;
  const ctx = vm.createContext({
    navigator: { locks: {} },
    forgeRecoveryReleaseId: async () => "a".repeat(20),
    acquireForgeRecoveryOwnership: async () => async () => { released++; },
    createForgeRecoveryCommitQueue: () => ({
      enqueue() {}, flush: async () => {},
      dispose() { disposed++; },
    }),
    forgeRecoveryStoredReleaseId: async () => null,
  });
  vm.runInContext(code, ctx);
  const bridge = {
    setLocalBotSlots() {},
    terminate() { terminated++; },
    async invoke() {
      if (++invoked === 1) throw Error("Forge WebImage startup failed");
      return "game-started";
    },
  };
  const api = new ctx.TestRecoveryApi(bridge);
  const params = {
    deck: { format: "commander" }, engine: "Forge", aiController: "forge",
    opponentDecks: [], startingLife: 40, commanderName: null, formatId: "commander",
  };
  await assert.rejects(api.startGame(params), /Forge WebImage startup failed/);
  assert.equal(terminated, 1, "failed first durable start must kill the ended supervisor");
  assert.equal(disposed, 1);
  assert.equal(released, 1, "exclusive tab ownership must be freed on startup failure");
  assert.equal(api.currentRecovery, null);
  assert.equal(api.releaseRecoveryOwnership, null);
  api.retainedRecoveryAfterCrash = true;
  api.retainedRecoveryGameId = "old-crashed-game";
  assert.equal(await api.startGame(params), "game-started");
  assert.equal(api.retainedRecoveryAfterCrash, false);
  assert.equal(api.retainedRecoveryGameId, null);
  assert.equal(invoked, 2);
  assert(api.currentRecovery);
  api.currentRecovery.queue.dispose();
  await api.releaseRecoveryOwnership();
});

test("cold recovery reads the current checkpoint only after acquiring the tab lock", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
  const cls = web.indexOf("class WebGameApi implements IGameApi");
  const start = web.indexOf("  async startGame(params: StartGameParams)", cls);
  const end = web.indexOf("\n  async startMultiplayerGame(", start);
  assert(cls >= 0 && start > cls && end > start);
  const source = `class TestRecoveryApi {
    currentRecovery = null;
    releaseRecoveryOwnership = null;
    isMultiplayer = false;
    constructor(bridge) { this.bridge = bridge; }
    ${web.slice(start, end)}
  }
  globalThis.TestRecoveryApi = TestRecoveryApi;`;
  const code = transpileModule(source, {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  const ordering = [];
  let released = 0;
  let saved = {
    gameId: "recover-game-1",
    launch: { gauntletId: null },
    replaySnapshot: { nextSequence: 8 },
  };
  const ctx = vm.createContext({
    navigator: { locks: {} },
    forgeRecoveryReleaseId: async () => "a".repeat(20),
    acquireForgeRecoveryOwnership: async () => {
      ordering.push("lock");
      return async () => { released++; };
    },
    readForgeRecoverySave: async () => {
      ordering.push("read");
      return saved;
    },
    createForgeRecoveryCommitQueue: () => ({
      enqueue() {}, flush: async () => {}, dispose() {},
    }),
    forgeRecoveryStoredReleaseId: async () => null,
  });
  vm.runInContext(code, ctx);
  const commands = [];
  const bridge = {
    setLocalBotSlots() {}, terminate() {},
    async invoke(command, args) {
      commands.push({ command, args });
      return "game-started";
    },
  };
  const stale = {
    gameId: "recover-game-1",
    replaySnapshot: { nextSequence: 3 },
    launch: { gauntletId: null },
  };
  const params = {
    deck: { format: "commander" }, engine: "Forge", aiController: "forge",
    opponentDecks: [], startingLife: 40, commanderName: null, formatId: "commander",
    recovery: stale,
  };
  const api = new ctx.TestRecoveryApi(bridge);
  assert.equal(await api.startGame(params), "game-started");
  assert.deepEqual(ordering, ["lock", "read"]);
  assert.equal(commands[0].args.replaySnapshot.nextSequence, 8);
  await api.releaseRecoveryOwnership();
  saved = null;
  const afterExit = new ctx.TestRecoveryApi(bridge);
  await assert.rejects(afterExit.startGame(params), /changed or ended/);
  assert.equal(commands.length, 1);
  assert.equal(released, 2);
  assert.equal(afterExit.releaseRecoveryOwnership, null);
});

test("an engine crash keeps a recovery checkpoint while a normal finish clears it", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
  const classStart = web.indexOf("class WebGameApi implements IGameApi");
  const retainStart = web.indexOf("  private retainRecoveryAfterUnexpectedEnd()", classStart);
  const constructorStart = web.indexOf("  constructor(bridge: WorkerBridge, events: IEventBus)", classStart);
  const constructorEnd = web.indexOf("\n  setServerApi(", constructorStart);
  const endGameStart = web.indexOf("  async endGame(): Promise<void>", classStart);
  const endGameEnd = web.indexOf("\n  async getPrompt()", endGameStart);
  assert(classStart >= 0 && retainStart > classStart && constructorStart > retainStart && constructorEnd > constructorStart);
  assert(endGameStart > constructorEnd && endGameEnd > endGameStart);
  const source = `class RecoveryApi {
    currentRecovery = null;
    retainedRecoveryAfterCrash = false;
    retainedRecoveryGameId = null;
    ${web.slice(retainStart, constructorStart)}
    ${web.slice(constructorStart, constructorEnd)}
    ${web.slice(endGameStart, endGameEnd)}
  }
  globalThis.RecoveryApi = RecoveryApi;`;
  const code = transpileModule(source, {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  let cleared = 0;
  let canAcquire = true;
  let savedGameId = "recover-test";
  const ctx = vm.createContext({
    setTimeout, clearTimeout,
    clearForgeRecoverySave: async () => { cleared++; },
    acquireForgeRecoveryOwnership: async () => canAcquire ? async () => {} : null,
    forgeRecoveryStoredReleaseId: async () => "a".repeat(20),
    readForgeRecoverySave: async () => ({ gameId: savedGameId }),
    console: { warn() {} },
  });
  vm.runInContext(code, ctx);
  const handlers = new Map();
  const events = { on: (name, handler) => handlers.set(name, handler) };
  const makeApi = () => {
    let terminated = 0;
    const bridge = {
      gameBuffer: null, invoke: async () => null,
      terminate() { terminated++; },
    };
    const api = new ctx.RecoveryApi(bridge, events);
    let disposed = 0;
    api.currentRecovery = { gameId: "recover-test", queue: { flush: async () => {}, dispose() { disposed++; } } };
    return { api, disposed: () => disposed, terminated: () => terminated };
  };
  const crash = makeApi();
  let crashReleased = 0;
  crash.api.releaseRecoveryOwnership = async () => { crashReleased++; };
  handlers.get("forge:engine_crash")({});
  await crash.api.recoveryDrain;
  assert.equal(crashReleased, 1, "a fatal engine error must release the tab lock");
  assert.equal(crash.api.releaseRecoveryOwnership, null);
  assert.equal(crash.terminated(), 0, "game-over delivery remains available");
  handlers.get("game:over")({});
  assert.equal(crash.terminated(), 1, "the ended worker must allow the next game to start");
  assert.equal(crash.disposed(), 1);
  assert.equal(cleared, 0);
  await crash.api.endGame();
  assert.equal(cleared, 1);
  await crash.api.endGame();
  assert.equal(cleared, 1);

  const forcedEnd = makeApi();
  let released = 0;
  forcedEnd.api.releaseRecoveryOwnership = async () => { released++; };
  handlers.get("game:forced_end")({});
  await forcedEnd.api.recoveryDrain;
  assert.equal(forcedEnd.disposed(), 1);
  assert.equal(forcedEnd.terminated(), 1);
  assert.equal(released, 1);
  assert.equal(forcedEnd.api.releaseRecoveryOwnership, null);
  assert.equal(cleared, 1);
  await forcedEnd.api.endGame();
  assert.equal(cleared, 2);

  const normal = makeApi();
  handlers.get("game:over")({});
  assert.equal(normal.disposed(), 1);
  assert.equal(cleared, 3);
  await normal.api.endGame();
  assert.equal(cleared, 3);

  const competingTab = makeApi();
  competingTab.api.releaseRecoveryOwnership = async () => {};
  handlers.get("game:forced_end")({});
  canAcquire = false;
  await competingTab.api.endGame();
  assert.equal(cleared, 3, "a different tab's lock must prevent deletion");
  canAcquire = true;

  const changedSave = makeApi();
  changedSave.api.releaseRecoveryOwnership = async () => {};
  handlers.get("game:forced_end")({});
  savedGameId = "another-tab-game";
  await changedSave.api.endGame();
  assert.equal(cleared, 3, "a changed game ID must prevent deletion");
  savedGameId = "recover-test";

  const draining = makeApi();
  let finishDrain;
  let drainReleased = 0;
  draining.api.currentRecovery.queue.flush = () => new Promise((resolve) => { finishDrain = resolve; });
  draining.api.releaseRecoveryOwnership = async () => { drainReleased++; };
  handlers.get("forge:engine_crash")({});
  const oldDrain = draining.api.recoveryDrain;
  assert.equal(draining.api.currentRecovery, null, "crash drain owns a detached queue");
  await draining.api.endGame();
  assert.equal(draining.terminated(), 1);
  assert.equal(draining.disposed(), 0, "ending a crashed game must not dispose its in-flight drain queue");
  assert.equal(drainReleased, 0);
  finishDrain();
  await oldDrain;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(draining.disposed(), 1);
  assert.equal(drainReleased, 1);
  assert.equal(cleared, 4);

  const java = readFileSync(new URL("../../forge-harness/native/wasm-src/forge/harness/wasm/SabTransport.java", import.meta.url), "utf8");
  assert.match(java.slice(java.indexOf("public void publishGameOver")), /post\("forge:engine_crash", "\{\}"\)/);

  const f = fixture();
  f.active.event("forge:engine_crash", {});
  f.active.event("game:over", {});
  const terminal = f.output.filter((event) =>
    event.event === "forge:engine_crash" || event.event === "game:over");
  assert.deepEqual(terminal.map((event) => event.event), ["forge:engine_crash", "game:over"]);
});

test("failed cold restore never publishes game board or double-settles", () => {
  const snapshot = {
    journal: { startRequest: '{"gameId":"recover-test"}' },
    prompt: { promptId: 1 }, lastPromptId: 1,
  };
  for (const failure of ["engine-error", "game-over", "timeout"]) {
    const f = fixture(false, { replaySnapshot: snapshot, journalRewind: true });
    f.active.event("game:sab", { buffer: new SharedArrayBuffer(256 * 1024) });
    if (failure === "engine-error") f.active.onerror({ message: "witness divergence", preventDefault() {} });
    if (failure === "game-over") f.active.event("game:over", {});
    if (failure === "timeout") [...f.timers.values()][0]();
    assert(f.active.terminated);
    assert.equal(f.responses("start").length, 1);
    assert(f.responses("start")[0].error);
    assert.equal(f.output.filter((entry) => entry.event === "game:sab").length, 0);
    f.active.event("forge:replay_ready", {});
    assert.equal(f.responses("start").length, 1);
    assert.equal(f.timers.size, 0);
  }
});

async function browserBridgeFixture() {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
  const start = web.indexOf("class WorkerBridge {");
  const end = web.indexOf("\n// Web Game API (WASM-based)", start);
  assert(start >= 0 && end > start, "WorkerBridge must be tested from production source");
  const js = transpileModule(
    web.slice(start, end).replaceAll("import.meta.url", JSON.stringify(import.meta.url)) +
      "\nglobalThis.BrowserBridge = WorkerBridge;",
    { compilerOptions: { target: ScriptTarget.ES2022 } },
  ).outputText;
  const workers = [];
  const events = [];
  const reports = [];
  const subscribers = new Map();
  const bus = {
    on(name, fn) {
      if (!subscribers.has(name)) subscribers.set(name, new Set());
      subscribers.get(name).add(fn);
      return () => subscribers.get(name).delete(fn);
    },
    emit(name, payload) {
      events.push({ name, payload });
      for (const handler of [...(subscribers.get(name) ?? [])]) handler(payload);
    },
    listenerCount(name) { return subscribers.get(name)?.size ?? 0; },
  };
  class BrowserWorker {
    terminated = false;
    constructor() { workers.push(this); }
    postMessage(message) { this.lastMessage = message; }
    terminate() { this.terminated = true; }
    event(name, payload) {
      this.onmessage({ data: { type: "event", event: name, payload } });
    }
    error(message) {
      let prevented = false;
      this.onerror({ message, preventDefault() { prevented = true; } });
      return prevented;
    }
  }
  const ctx = vm.createContext({
    Worker: BrowserWorker,
    console: { log() {}, warn() {}, error() {} },
    window: { addEventListener() {} },
    document: { addEventListener() {}, hidden: false },
    setForgeWasmActive() {},
    isForgeWasmHostingEnabled: () => true,
    forgeWorkerUrl: "forge-worker-url",
    DEBUG_TRANSPORT: false,
    seatReaderLastSignalAt: new WeakMap(),
    noteOfflineResumeEvent() {},
    noteCheckpointTimings() {},
    noteEngineThinkTime() {},
    reportClientError: (error, source) => reports.push({ message: error.message, source }),
    workerError: (event) => new Error(event.message ?? "worker crashed"),
    ringPush(ring, value) { ring.push(value); },
  });
  vm.runInContext(js, ctx);
  return { bridge: new ctx.BrowserBridge(bus), bus, events, workers, reports, ctx };
}

test("concurrent Forge bridge initialization waits for the real worker ready event", async () => {
  const { bridge, workers } = await browserBridgeFixture();
  const first = bridge.init(true);
  const concurrent = bridge.init(true);
  let resolved = false;
  void concurrent.then(() => { resolved = true; });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(workers.length, 1);
  assert.equal(resolved, false, "second start cannot bypass pending worker initialization");
  workers[0].event("worker:init", { stage: "ready" });
  await Promise.all([first, concurrent]);
  assert.equal(resolved, true);
  bridge.terminate();
});

test("failed Forge bridge init releases its worker and allows a fresh retry", async () => {
  const { bridge, workers } = await browserBridgeFixture();
  const failed = bridge.init(true);
  workers[0].event("worker:init", { stage: "error", message: "WASM bootstrap failed" });
  await assert.rejects(failed, /WASM bootstrap failed/);
  assert.equal(workers[0].terminated, true);
  assert.equal(bridge.worker, null);
  assert.equal(bridge.initPromise, null);
  const retry = bridge.init(true);
  assert.equal(workers.length, 2);
  workers[1].event("worker:init", { stage: "ready" });
  await retry;
  bridge.terminate();
});

test("outer Forge worker failure preserves crash-before-end event order and rejects only its requests", async () => {
  const { bridge, bus, events, workers } = await browserBridgeFixture();
  const ready = bridge.init(true);
  workers[0].event("worker:init", { stage: "ready" });
  await ready;
  const worker = workers[0];
  const unrelated = new workers[0].constructor();
  bridge.fallbackWorker = unrelated;
  let rejected = 0;
  let unrelatedRejected = 0;
  bridge.pendingRequests.set("start", {
    worker, command: "start_game", resolve() {},
    reject(error) { assert.match(error.message, /outer worker died/); rejected++; },
  });
  bridge.pendingRequests.set("query", {
    worker: unrelated, command: "card_roles", resolve() {},
    reject() { unrelatedRejected++; },
  });
  assert.equal(worker.error("outer worker died"), true);
  assert.deepEqual(events.filter((entry) =>
    ["forge:engine_crash", "game:error", "game:forced_end"].includes(entry.name)).map((entry) => entry.name),
  ["forge:engine_crash", "game:error", "game:forced_end"]);
  const protocolCrash = events.find((entry) => entry.name === "game:error")?.payload;
  assert.equal(protocolCrash?.code, "engineCrash");
  assert.equal(protocolCrash?.message, "outer worker died");
  assert.equal(rejected, 1);
  assert.equal(unrelatedRejected, 0);
  assert.equal(bridge.pendingRequests.has("query"), true);
  assert.equal(bridge.pendingRequests.has("start"), false);
  assert.equal(worker.terminated, true);
  assert.equal(bridge.worker, null);
  worker.error("old worker reported another failure");
  assert.equal(rejected, 1);
  bridge.pendingRequests.clear();
});

test("Forge bridge clears per-worker telemetry subscribers after termination and retry", async () => {
  const { bridge, bus, workers } = await browserBridgeFixture();
  const names = ["forge:decision", "forge:checkpoints", "forge:log"];
  const baseline = new Map(names.map((name) => [name, bus.listenerCount(name)]));
  const first = bridge.init(true);
  workers[0].event("worker:init", { stage: "ready" });
  await first;
  for (const name of names) {
    assert.equal(bus.listenerCount(name), baseline.get(name) + 1, name + " needs one per-game listener");
  }
  bridge.terminate();
  for (const name of names) {
    assert.equal(bus.listenerCount(name), baseline.get(name), name + " must restore its original listeners");
  }
  const second = bridge.init(true);
  workers[1].event("worker:init", { stage: "ready" });
  await second;
  for (const name of names) {
    assert.equal(bus.listenerCount(name), baseline.get(name) + 1, name + " must not accumulate across matches");
  }
  bridge.terminate();
});

test("outer Forge bootstrap failure releases the worker without false game-over events", async () => {
  const { bridge, workers, events } = await browserBridgeFixture();
  const startup = bridge.init(true);
  assert.equal(workers[0].error("worker failed before ready"), true);
  await assert.rejects(startup, /worker failed before ready/);
  assert.equal(bridge.worker, null);
  assert.equal(workers[0].terminated, true);
  assert.deepEqual(events.filter((event) =>
    ["forge:engine_crash", "game:error", "game:forced_end"].includes(event.name)), []);
  const retry = bridge.init(true);
  workers[0].event("worker:init", { stage: "ready" });
  assert.equal(workers.length, 2);
  workers[1].event("worker:init", { stage: "ready" });
  await retry;
  bridge.terminate();
});

test("unreadable outer worker message follows the same crash-before-forced-end recovery path", async () => {
  const { bridge, workers, events } = await browserBridgeFixture();
  const first = bridge.init(true);
  workers[0].event("worker:init", { stage: "ready" });
  await first;
  bridge.localSeat = { cancelled: false };
  workers[0].onmessageerror();
  assert.deepEqual(events.filter((event) =>
    ["forge:engine_crash", "game:error", "game:forced_end"].includes(event.name)).map((event) => event.name),
  ["forge:engine_crash", "game:error", "game:forced_end"]);
  assert.equal(bridge.worker, null);
  assert.equal(workers[0].terminated, true);
});

test("idle initialized Forge worker failure does not invent a game end", async () => {
  const { bridge, events, workers } = await browserBridgeFixture();
  const initialized = bridge.init(true);
  workers[0].event("worker:init", { stage: "ready" });
  await initialized;
  assert.equal(workers[0].error("worker died while idle"), true);
  assert.equal(bridge.worker, null);
  assert.equal(workers[0].terminated, true);
  assert.deepEqual(
    events.filter(({ name }) => ["forge:engine_crash", "game:error", "game:forced_end"].includes(name)),
    [],
    "a worker without a running game must not force-close the UI or recovery",
  );
  const retry = bridge.init(true);
  workers[1].event("worker:init", { stage: "ready" });
  await retry;
  bridge.terminate();
});

test("one outer worker crash produces exactly one client report while preserving crash UI state", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const hook = readFileSync(new URL("../../src/hooks/useGameEventListeners.ts", import.meta.url), "utf8");
  const start = hook.indexOf("      const handleProtocolError = (");
  const end = hook.indexOf("      unsubscribers.push(", start);
  assert(start > 0 && end > start);
  const code = transpileModule(
    hook.slice(start, end) + "\nglobalThis.handleProtocolError = handleProtocolError;",
    { compilerOptions: { target: ScriptTarget.ES2022 } },
  ).outputText;
  const { bridge, bus, workers, reports, ctx } = await browserBridgeFixture();
  ctx.ENGINE_CRASH_CODE = "engineCrash";
  ctx.setState = (state) => { ctx.crashState = state.engineCrash; };
  vm.runInContext(code, ctx);
  bus.on("game:error", (payload) => ctx.handleProtocolError(payload, "Event"));
  const initialized = bridge.init(true);
  workers[0].event("worker:init", { stage: "ready" });
  await initialized;
  bridge.localSeat = { cancelled: false };
  assert.equal(workers[0].error("outer worker died"), true);
  assert.equal(ctx.crashState, "outer worker died");
  assert.deepEqual(reports.map((record) => record.message), ["outer worker died"]);
  bus.emit("game:error", { code: "engineCrash", message: "different engine failure" });
  assert.deepEqual(reports.map((record) => record.message), [
    "outer worker died",
    "different engine failure",
  ], "ordinary engine failures still reach the existing reporter");
});
test("terminating a pending Forge initialization rejects waiters and releases its ready listener", async () => {
  const { bridge, bus, workers, events } = await browserBridgeFixture();
  const first = bridge.init(true);
  let firstOutcome = "pending";
  void first.then(
    () => { firstOutcome = "resolved"; },
    (error) => { firstOutcome = "rejected:" + error.message; },
  );
  assert.equal(bus.listenerCount("worker:init"), 1);
  bridge.terminate();
  assert.equal(workers[0].terminated, true);
  const next = bridge.init(true);
  assert.equal(workers.length, 2);
  workers[1].event("worker:init", { stage: "ready" });
  await next;
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(firstOutcome, /^rejected:Worker initialization cancelled$/);
  assert.equal(bus.listenerCount("worker:init"), 0);
  assert.deepEqual(events.filter((event) =>
    ["forge:engine_crash", "game:error", "game:forced_end"].includes(event.name)), []);
  bridge.terminate();
});

test("cold Forge replay budget scales for a durable 295-decision journal", () => {
  const replaySnapshot = { journal: { entries: Array.from({ length: 295 }, () => ({})) } };
  const f = fixture(false, { replaySnapshot, journalRewind: true });
  assert.equal(f.timerDurations.size, 1, "a cold replay must have a bounded deadline");
  const budget = [...f.timerDurations.values()][0];
  assert(budget >= 3 * 60_000 && budget <= 15 * 60_000,
    "a 295-decision game needs more than the former 120s hard stop");
  f.command("end_game");
  assert.equal(f.timers.size, 0, "teardown must cancel the recovery timeout");
});

test("cold Forge replay exposes the actual deterministic divergence instead of a generic game-ended error", () => {
  const replaySnapshot = { journal: { entries: [{}] } };
  const f = fixture(false, { replaySnapshot, journalRewind: true });
  f.active.event("game:forced_end", {
    reason: "worker_error",
    message: "state/RNG divergence at decision 196 (state=different, rng=different)",
  });
  assert.equal(f.responses("start").length, 1);
  assert.match(f.responses("start")[0].error,
    /state\/RNG divergence at decision 196/);
  assert.equal(f.timers.size, 0);
  assert(f.active.terminated);
});

test("WebImage's non-JSON-safe Java exception preserves the actual replay error", () => {
  const start = source.indexOf("function runGame(");
  const end = source.indexOf("\nfunction boot()", start);
  assert(start >= 0 && end > start);
  const ctx = vm.createContext({
    self: {
      __forgeStartGame: () => [
        '{"error":"java.lang.IllegalStateException: state/RNG divergence at decision 196',
        '\tat forge.harness.host.DecisionHistory.replayAction"}',
      ].join("\n"),
    },
  });
  vm.runInContext(source.slice(start, end) + "\nglobalThis.runGame = runGame;", ctx);
  assert.throws(() => ctx.runGame({}, {}), /state\/RNG divergence at decision 196/);
  ctx.self.__forgeStartGame = () => '{"error":"A normal engine error"}';
  assert.throws(() => ctx.runGame({}, {}), /A normal engine error/);
  ctx.self.__forgeStartGame = () => "{}";
  assert.doesNotThrow(() => ctx.runGame({}, {}));
  ctx.self.__forgeStartGame = () => "<broken response>";
  assert.throws(() => ctx.runGame({}, {}), /SyntaxError|JSON|Unexpected token/);
});

test("fresh Forge startup preserves the child's terminal error and settles once", () => {
  const f = fixture(false);
  f.active.event("game:forced_end", {
    reason: "worker_error",
    message: "Forge initialization failed while loading card data",
  });
  assert.equal(f.responses("start").length, 1);
  assert.match(f.responses("start")[0].error, /Forge initialization failed while loading card data/);
  assert(f.active.terminated);
  f.command("end_game");
  assert.equal(f.responses("start").length, 1);
});

test("a natural early game over is distinct from explicit startup cancellation", () => {
  const f = fixture(false);
  f.active.event("game:over", {});
  assert.match(f.responses("start")[0].error, /Forge game finished before its startup was acknowledged/);
  assert.notEqual(f.responses("start")[0].errorName, "AbortError");
  const cancelled = fixture(false);
  cancelled.command("end_game");
  assert.equal(cancelled.responses("start")[0].errorName, "AbortError");
});

for (const entry of ["local", "multiplayer", "manual-tabletop", "manual-room"]) {
  for (const mode of ["normal", "cancel", "timeout", "stalled-auxiliary"]) {
    test(`replacement ${entry} launch during teardown: ${mode}`, async () => {
      const { transpileModule, ScriptTarget } = await import("typescript");
      const store = readFileSync(new URL("../../src/stores/useGameStore.ts", import.meta.url), "utf8");
      const section = (startMarker, endMarker) => {
        const start = store.indexOf(startMarker);
        const end = store.indexOf(endMarker, start + startMarker.length);
        assert(start >= 0 && end > start, `missing source section: ${startMarker}`);
        return store.slice(start, end);
      };
      const guard = section("let gameLaunchGeneration", "function isManualTabletopApi").replace("export function", "function");
      const launch = section("      startGame: async", "      startMultiplayerGame: async");
      const multiplayerLaunch = section("      startMultiplayerGame: async", "      respond: async");
      const end = section("      endGame: async", "      setMultiplayerState:");
      assert(guard.includes("gameLaunchInFlight") && launch.includes("initializeGame") && end.includes("runtime.api.endGame"));
      const code = transpileModule(guard + "\n globalThis.createActions = (set, get) => ({" + launch + multiplayerLaunch + end + "});", {
        compilerOptions: { target: ScriptTarget.ES2022 },
      }).outputText;
      const events = [];
      let release;
      const closing = new Promise((resolve) => { release = resolve; });
      const runtime = { api: { async endGame() {
        events.push("close-start");
        await closing;
        events.push("close-complete");
      }, async startMultiplayerGame() { events.push("new-start"); } } };
      const noop = () => {};
      const closingDeadlines = [];
      const notices = [];
      const ctx = vm.createContext({
        peekActiveGameSession: () => mode === "stalled-auxiliary" ? { relayHost: "127.0.0.1" } : null,
        clearActiveGameSession: noop,
        getSelectedGameRuntime: () => runtime, currentOfflineGameId: () => null,
        peekGauntletMatch: () => mode === "stalled-auxiliary" ? {} : null,
        clearGauntletMatch: () => new Promise(() => {}),
        stopLocalHostedAiRelay: () => new Promise(() => {}),
        reportEngineStats: noop, engineReportGameId: noop,
        useGameStore: { getState: () => actions },
        useServerStore: { getState: () => ({}) },
        offlineSeats: () => [], reportOfflineGame: noop, clearLocalGame: noop,
        setErrorReportingEngine: noop, stopActiveManualRoomSync: noop,
        resetSelectedGameRuntime: () => runtime, console,
        selectGameRuntime: () => { events.push("select-manual"); return runtime; },
        isManualTabletopApi: () => entry === "manual-room",
        BroadcastRoomHost: class {},
        startManualRoomSync: () => events.push("new-start"),
        setTimeout: (callback, delay) => { closingDeadlines.push(delay); return setTimeout(callback, mode === "timeout" ? 5 : delay); }, clearTimeout,
        useMultiplayerLimitedStore: { getState: () => ({}) },
        getPlatform: () => ({ type: "web" }), roomEngineLabel: () => "Forge", beginGame: noop,
        toast: { info: (message) => notices.push(message), error: (message) => notices.push(message) },
        initializeGame: async ({ set }) => { events.push("new-start"); set({ isGameActive: true }); },
      });
      vm.runInContext(code, ctx);
      let state = { isGameActive: true, isMultiplayer: false, gameDecks: {}, gameView: null };
      const actions = ctx.createActions((patch) => { state = { ...state, ...patch }; }, () => ({ ...state, ...actions }));
      const old = actions.endGame();
      try {
        await new Promise((resolve) => setImmediate(resolve));
        assert.deepEqual(events, ["close-start"]);
        assert.equal(state.isGameActive, false);
        const duplicateEnd = actions.endGame();
        if (entry === "manual-room" && mode === "normal") {
          await actions.startManualRoomHost("player-0");
          assert.match(notices.shift(), /previous game has closed/);
          assert.deepEqual(events, ["close-start"], "host must not start during teardown");
        }
        const deck = { format: "commander" };
        const manual = entry.startsWith("manual-");
        const fresh = entry === "multiplayer"
          ? actions.startMultiplayerGame(["A", "B"], [deck, deck], [], 0, true, 40, "Forge")
          : entry === "manual-tabletop"
            ? actions.startManualTabletopGame(deck)
            : entry === "manual-room"
              ? actions.startManualRoomClient("player-0")
              : actions.startGame(deck, "commander", undefined, [], "Forge");
        await new Promise((resolve) => setImmediate(resolve));
        assert.deepEqual(events, ["close-start"], "new game must not use a worker the old close can still stop");
        assert.deepEqual(closingDeadlines, [12000], "only the user's wait, not the teardown itself, is bounded");
        if (mode === "cancel") {
          ctx.cancelPendingGameLaunch();
        } else if (mode === "timeout") {
          assert.equal(await fresh, manual ? undefined : false);
          assert.equal(notices.length, 1);
          assert.deepEqual(events, ["close-start"], "a timeout must not release the runtime barrier");
        }
        release();
        await Promise.all([old, duplicateEnd]);
        assert.equal(await fresh, manual ? undefined : (mode === "normal" || mode === "stalled-auxiliary"));
        assert.deepEqual(events, (mode === "normal" || mode === "stalled-auxiliary")
          ? ["close-start", "close-complete", ...(manual ? ["select-manual"] : []), "new-start"]
          : ["close-start", "close-complete"]);
      } finally {
        release();
        await old;
      }
    });
  }
}

for (const forge of [false, true]) {
  test(`ending a ${forge ? "Forge" : "Rust"} worker before its first seat never waits for a reply`, async () => {
    const { transpileModule, ScriptTarget } = await import("typescript");
    const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
    const start = web.indexOf("  async endGame(): Promise<void> {");
    const end = web.indexOf("  async getPrompt()", start);
    assert(start >= 0 && end > start);
    const code = transpileModule("globalThis.close = async function " + web.slice(start, end).replace("async endGame()", "endGame()"), {
      compilerOptions: { target: ScriptTarget.ES2022 },
    }).outputText;
    const context = vm.createContext({ console, setTimeout, clearTimeout });
    vm.runInContext(code, context);
    let terminated = 0;
    const runtime = {
      currentRecovery: null,
      retainedRecoveryAfterCrash: false,
      releaseRecoveryOwnership: null,
      bridge: {
        workerIsForgeWasm: forge,
        gameBuffer: null,
        invoke() { throw new Error("end must not depend on a worker response"); },
        terminate() { terminated++; },
      },
    };
    await context.close.call(runtime);
    assert.equal(terminated, 1);
    assert.equal(runtime.isMultiplayer, false);
    assert.equal(runtime.isHost, false);
    assert.equal(runtime.myPlayerSlot, null);
  });
}

test("stalled Forge save cleanup releases the runtime but retains old save ownership", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const web = readFileSync(new URL("../../src/platform/web.ts", import.meta.url), "utf8");
  const start = web.indexOf("  async endGame(): Promise<void> {");
  const end = web.indexOf("  async getPrompt()", start);
  assert(start >= 0 && end > start);
  const code = transpileModule("globalThis.close = async function " + web.slice(start, end).replace("async endGame()", "endGame()"), {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  let finishClear;
  let released = 0;
  let disposed = 0;
  let terminated = 0;
  const clear = new Promise((resolve) => { finishClear = resolve; });
  const context = vm.createContext({
    console: { warn() {} },
    clearForgeRecoverySave: () => clear,
    setTimeout: (callback, delay) => { assert.equal(delay, 2000); return setTimeout(callback, 5); },
    clearTimeout,
  });
  vm.runInContext(code, context);
  const runtime = {
    currentRecovery: { queue: { dispose() { disposed++; } } },
    retainedRecoveryAfterCrash: false,
    releaseRecoveryOwnership: async () => { released++; },
    bridge: { terminate() { terminated++; } },
  };
  await context.close.call(runtime);
  assert.equal(terminated, 1, "old engine must be gone even while storage never replies");
  assert.equal(disposed, 1);
  assert.equal(released, 0, "old storage lock must not be released prematurely");
  const replacement = { queue: { dispose() { throw new Error("new recovery was touched"); } } };
  const replacementRelease = async () => { throw new Error("new ownership was released"); };
  runtime.currentRecovery = replacement;
  runtime.releaseRecoveryOwnership = replacementRelease;
  runtime.isMultiplayer = true;
  finishClear();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(released, 1);
  assert.equal(terminated, 1, "late old cleanup must not stop the replacement worker");
  assert.equal(runtime.currentRecovery, replacement);
  assert.equal(runtime.releaseRecoveryOwnership, replacementRelease);
  assert.equal(runtime.isMultiplayer, true);
});

test("native relay replacement is fenced until the actual old stop settles", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const source = readFileSync(new URL("../../src/platform/tauri.ts", import.meta.url), "utf8");
  const start = source.indexOf("  async invoke<T>(");
  const end = source.indexOf("  isSupported(", start);
  assert(start >= 0 && end > start);
  const code = transpileModule("globalThis.Platform = class { localRelayStop = null; " + source.slice(start, end) + "};", {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  let finishStop;
  const stopping = new Promise((resolve) => { finishStop = resolve; });
  const commands = [];
  const ctx = vm.createContext({
    invoke: (command) => {
      commands.push(command);
      return command === "stop_local_relay" ? stopping : Promise.resolve("started");
    },
    setTimeout: (callback, delay) => { assert.equal(delay, 2000); return setTimeout(callback, 5); },
    clearTimeout,
  });
  vm.runInContext(code, ctx);
  const platform = new ctx.Platform();
  const old = platform.invoke("stop_local_relay");
  const duplicate = platform.invoke("stop_local_relay");
  await assert.rejects(platform.invoke("start_local_relay"), /still stopping/);
  assert.deepEqual(commands, ["stop_local_relay"]);
  finishStop();
  await Promise.all([old, duplicate]);
  assert.equal(await platform.invoke("start_local_relay"), "started");
  assert.deepEqual(commands, ["stop_local_relay", "start_local_relay"]);
});

test("hosted relay stop is submitted even if the old socket never closes", async () => {
  const { transpileModule, ScriptTarget } = await import("typescript");
  const source = readFileSync(new URL("../../src/game/hostedAiPlay.ts", import.meta.url), "utf8");
  const start = source.indexOf("export async function stopLocalHostedAiRelay");
  const end = source.indexOf("async function joinHostedRoomAndPlay", start);
  assert(start >= 0 && end > start);
  const code = transpileModule(source.slice(start, end).replace("export async function", "globalThis.close = async function"), {
    compilerOptions: { target: ScriptTarget.ES2022 },
  }).outputText;
  const calls = [];
  const ctx = vm.createContext({
    console: { warn() {} },
    useServerStore: { getState: () => ({ disconnect: () => { calls.push("disconnect"); return new Promise(() => {}); } }) },
    getPlatform: () => ({ invoke: (command) => { calls.push(command); return Promise.resolve(); } }),
    setTimeout: (callback, delay) => { assert.equal(delay, 2000); return setTimeout(callback, 5); },
    clearTimeout,
  });
  vm.runInContext(code, ctx);
  await ctx.close();
  assert.deepEqual(calls, ["disconnect", "stop_local_relay"]);
});
