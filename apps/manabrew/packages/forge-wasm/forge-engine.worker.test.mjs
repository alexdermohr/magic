import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import {
  createDirectiveLane,
  writeDirectiveLane,
  createSeat,
  writeSeatMessage,
} from "./seat.js";

const source = readFileSync(
  new URL("./forge-engine.worker.js", import.meta.url),
  "utf8",
);
function fixture(started = true, args = {}) {
  const workers = [],
    output = [],
    timers = new Map();
  let timerId = 0;
  class Worker {
    sent = [];
    terminated = false;
    constructor() {
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
  }
  const self = { location: { href: "worker.js" }, postMessage: (data) => output.push(data) };
  const context = vm.createContext({
    self,
    Worker,
    SharedArrayBuffer,
    Int32Array,
    Atomics,
    console: {},
    setTimeout: (fn) => {
      timers.set(++timerId, fn);
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
  return { workers, output, timers, active, lanes, rewind, command, responses };
}

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
    if (failure === "error") candidate.onerror({ message: "crash" });
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
    if (failure === "error") f.active.onerror({ message: "source crash" });
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
  const constructorStart = web.indexOf("  constructor(bridge: WorkerBridge, events: IEventBus)", classStart);
  const constructorEnd = web.indexOf("\n  setServerApi(", constructorStart);
  const endGameStart = web.indexOf("  async endGame(): Promise<void>", classStart);
  const endGameEnd = web.indexOf("\n  async getPrompt()", endGameStart);
  assert(classStart >= 0 && constructorStart > classStart && constructorEnd > constructorStart);
  assert(endGameStart > constructorEnd && endGameEnd > endGameStart);
  const source = `class RecoveryApi {
    currentRecovery = null;
    retainedRecoveryAfterCrash = false;
    retainedRecoveryGameId = null;
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
    api.currentRecovery = { gameId: "recover-test", queue: { dispose() { disposed++; } } };
    return { api, disposed: () => disposed, terminated: () => terminated };
  };
  const crash = makeApi();
  let crashReleased = 0;
  crash.api.releaseRecoveryOwnership = async () => { crashReleased++; };
  handlers.get("forge:engine_crash")({});
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
    if (failure === "engine-error") f.active.onerror({ message: "witness divergence" });
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
