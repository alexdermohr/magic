import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";

// Exercise the actual connection methods with deterministic deferred identity,
// claim and socket events; no real relay, browser profile or game save is touched.
function section(source: string, start: string, end: string) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Missing connection implementation: ${start}`);
  return source.slice(a, b);
}
function evaluate(source: string, globals: Record<string, unknown>) {
  const context = createContext({ ...globals, Error, console, Date, JSON, Promise });
  runInContext(
    ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText,
    context,
  );
  return context;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function storeHarness(claimTabSession: (username: string) => Promise<unknown>) {
  const source = readFileSync(new URL("../stores/useServerStore.ts", import.meta.url), "utf8");
  const connect = section(source, "      async connect(host,", "\n      // Decided");
  const platformConnect = vi.fn().mockResolvedValue(undefined);
  const holdTabSession = vi.fn();
  const set = vi.fn();
  const state = { adoptLanTarget: vi.fn(), disconnect: vi.fn() };
  const context = evaluate(
    `let connectGeneration = 0, tabSession = null, duplicateRejectionSince = null;
     const store = { ${connect} };`,
    {
      getPlatform: () => ({ server: { connect: platformConnect } }),
      get: () => state,
      set,
      claimTabSession,
      holdTabSession,
      releaseTabSession: vi.fn(),
      toast: { info: vi.fn() },
    },
  );
  return {
    connect: runInContext("store.connect", context) as (...args: string[]) => Promise<void>,
    platformConnect,
    holdTabSession,
    set,
  };
}

class MockSocket {
  static CLOSED = 3;
  static sockets: MockSocket[] = [];
  readyState = 0;
  onopen?: () => void;
  onclose?: (event: { code: number }) => void;
  onerror?: () => void;
  onmessage?: (event: { data: string }) => void;
  listeners = new Map<string, Set<() => void>>();
  constructor(_url: string) {
    MockSocket.sockets.push(this);
  }
  addEventListener(event: string, handler: () => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }
  removeEventListener(event: string, handler: () => void) {
    this.listeners.get(event)?.delete(handler);
  }
  close() {
    this.readyState = 2;
  }
  finishClose() {
    this.readyState = MockSocket.CLOSED;
    this.onclose?.({ code: 1000 });
    for (const handler of this.listeners.get("close") ?? []) handler();
  }
  open() {
    this.readyState = 1;
    this.onopen?.();
  }
}

function socketHarness(resolveRelayIdentity: (...args: unknown[]) => Promise<unknown>) {
  MockSocket.sockets = [];
  const source = readFileSync(new URL("../platform/web.ts", import.meta.url), "utf8");
  const methods = [
    section(
      source,
      "  async connect(params: ServerConnectParams)",
      "\n  private handleSocketClose",
    ),
    section(source, "  private async tryReconnect()", "\n  private clearReconnectTimer"),
    section(source, "  async disconnect(): Promise<void>", "\n  async listRooms"),
  ];
  const fields = section(source, "  private ws: WebSocket | null = null;", "\n  private eventBus:");
  const emit = vi.fn();
  const send = vi.fn();
  const context = evaluate(
    `class Harness {
       ${fields}
       manualDisconnect = false; connectParams = null; sessionIdentity = null;
       sessionTokenRejected = false; cardCosmeticsVersion = 0; reconnectAttempt = 0;
       eventBus = { emit }; send = send; clearReconnectTimer() {}
       stopKeepalive() {} stopAllBots() {} startKeepalive() {} handleSocketClose() {}
       scheduleReconnect() {} nextBackoffMs() { return 10; }
       ${methods.join("\n")}
     } const api = new Harness();`,
    {
      WebSocket: MockSocket,
      resolveRelayIdentity,
      buildServerUrl: () => "ws://test",
      getClientPlatform: () => "web",
      APP_VERSION: "test",
      forgeWasmGate: () => false,
      getAcquisitionSource: () => null,
      emit,
      send,
    },
  );
  return {
    api: runInContext("api", context) as {
      connect: (params: { username: string }) => Promise<void>;
      disconnect: () => Promise<void>;
    },
    send,
    emit,
  };
}
const identity = (username: string) => ({ username, proof: null });
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};

describe("relay connection ownership", () => {
  it("ignores late old store disconnect completion after a new connect generation", async () => {
    const source = readFileSync(new URL("../stores/useServerStore.ts", import.meta.url), "utf8");
    const method = section(source, "      async disconnect() {", "      async listRooms()");
    const old = deferred<void>();
    const set = vi.fn();
    const adoptLanTarget = vi.fn();
    const setRelayCacheBase = vi.fn();
    const context = evaluate(
      `let connectGeneration = 0, duplicateRejectionSince = null;
       const store = { ${method} }; const nextConnect = () => ++connectGeneration;`,
      {
        getPlatform: () => ({ server: { disconnect: () => old.promise } }),
        releaseTabSession: vi.fn(), teardownDraftHost: vi.fn(),
        clearLimitedSession: vi.fn(), clearSealedStart: vi.fn(),
        get: () => ({ adoptLanTarget }), setRelayCacheBase, set,
        DEFAULT_STARTING_LIFE: 20,
      },
    );
    const disconnect = runInContext("store.disconnect", context) as () => Promise<void>;
    const pending = disconnect();
    runInContext("nextConnect()", context);
    old.resolve(undefined);
    await pending;
    expect(set).not.toHaveBeenCalled();
    expect(adoptLanTarget).not.toHaveBeenCalled();
    expect(setRelayCacheBase).not.toHaveBeenCalled();
  });

  it("never opens a connection when the other tab refuses the claim", async () => {
    const h = storeHarness(async () => ({ outcome: "refused" }));
    await h.connect("relay", "443", "player");
    expect(h.platformConnect).not.toHaveBeenCalled();
    expect(h.holdTabSession).not.toHaveBeenCalled();
  });

  it("ignores a superseded asynchronous tab claim", async () => {
    const old = deferred<unknown>();
    const h = storeHarness((username) =>
      username === "old" ? old.promise : Promise.resolve({ outcome: "claimed" }),
    );
    const pending = h.connect("relay", "443", "old");
    await h.connect("relay", "443", "new");
    old.resolve({ outcome: "claimed" });
    await pending;
    expect(h.platformConnect).toHaveBeenCalledTimes(1);
    expect(h.platformConnect.mock.calls[0][0].username).toBe("new");
    expect(h.holdTabSession).toHaveBeenCalledTimes(1);
  });

  it("ignores an old identity resolution after a newer connection has opened", async () => {
    const old = deferred<unknown>();
    const h = socketHarness((_previous, username) =>
      username === "old" ? old.promise : Promise.resolve(identity(String(username))),
    );
    const first = h.api.connect({ username: "old" });
    await flush();
    const next = h.api.connect({ username: "new" });
    await flush();
    expect(MockSocket.sockets).toHaveLength(1);
    MockSocket.sockets[0].open();
    await next;
    old.resolve(identity("old"));
    await first;
    expect(MockSocket.sockets).toHaveLength(1);
    expect(h.send).toHaveBeenCalledTimes(1);
    expect(h.send.mock.calls[0][0].username).toBe("new");
  });

  it("waits for the actual old socket close even across competing connects", async () => {
    const h = socketHarness(async (_previous, username) => identity(String(username)));
    const first = h.api.connect({ username: "first" });
    await flush();
    const oldSocket = MockSocket.sockets[0];
    oldSocket.open();
    await first;
    const second = h.api.connect({ username: "second" });
    const third = h.api.connect({ username: "third" });
    await flush();
    expect(MockSocket.sockets).toHaveLength(1);
    oldSocket.finishClose();
    await flush();
    // Reset the displaced room/seat before the winner can authenticate.
    expect(h.emit).toHaveBeenCalledExactlyOnceWith("server:disconnected", { terminal: true });
    expect(h.send).toHaveBeenCalledTimes(1);
    expect(MockSocket.sockets).toHaveLength(2);
    MockSocket.sockets[1].open();
    await Promise.all([second, third]);
    expect(h.send.mock.calls.map((call) => call[0].username)).toEqual(["first", "third"]);
  });

  it("resets old room state once for a single replacement, before authentication", async () => {
    const h = socketHarness(async (_previous, username) => identity(String(username)));
    const first = h.api.connect({ username: "first" });
    await flush();
    MockSocket.sockets[0].open();
    await first;
    const next = h.api.connect({ username: "next" });
    await flush();
    expect(h.emit).not.toHaveBeenCalled();
    MockSocket.sockets[0].finishClose();
    await flush();
    expect(h.emit).toHaveBeenCalledExactlyOnceWith("server:disconnected", { terminal: true });
    expect(h.send).toHaveBeenCalledTimes(1);
    MockSocket.sockets[1].open();
    await next;
    expect(h.emit).toHaveBeenCalledTimes(1);
  });

  it("settles a connection whose socket closes before it can open", async () => {
    const h = socketHarness(async (_previous, username) => identity(String(username)));
    const pending = h.api.connect({ username: "player" });
    const rejected = expect(pending).rejects.toThrow("closed before opening");
    await flush();
    MockSocket.sockets[0].finishClose();
    await rejected;
  });
});
