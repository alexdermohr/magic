import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(new URL("./useGameEventListeners.ts", import.meta.url), "utf8");
const start = source.indexOf("async function rejoinAfterRelayRestart()");
const end = source.indexOf("\nfunction toastOpponentPublicAction", start);
if (start < 0 || end <= start) throw Error("Missing real room rejoin implementation");
const code = ts.transpileModule(
  `let rejoinInFlight = null;\n${source.slice(start, end)}\n`,
  { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
).outputText;

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function harness(joinRoom: (...args: unknown[]) => Promise<void>, active = true) {
  const phases: string[] = [];
  const resync = vi.fn();
  const abort = vi.fn();
  const notice = vi.fn();
  const listeners = new Set<() => void>();
  const doc = {
    hidden: true,
    addEventListener: (_event: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_event: string, callback: () => void) => listeners.delete(callback),
  };
  let game = { isGameActive: active, isMultiplayer: true, isHost: false };
  let session: { roomId: string; gameId: string } | null = { roomId: "room-1", gameId: "game-1" };
  let room: { room_id: string } | null = { room_id: "room-1" };
  let gameId = "game-1";
  let reconnect = { phase: "idle" };
  const ctx = createContext({
    Date, Error, document: doc, REJOIN_RETRY_DELAY_MS: 2,
    SELF_RECONNECT_WINDOW_S: 120,
    useServerStore: { getState: () => ({ currentRoom: room, gameId, reconnect, roomPassword: null, joinRoom }) },
    getState: () => game,
    peekActiveGameSession: () => session,
    setReconnectPhase: (phase: string) => {
      phases.push(phase);
      reconnect = { phase };
    },
    resumeReconnectDeadline: (deadline: number) => deadline,
    setTimeout: (callback: () => void) => callback(),
    getPlatform: () => ({ server: { requestResync: resync } }),
    useGameStore: { getState: () => ({ endGame: abort }) },
    SERVER_ERROR_CODE: { GameAlreadyStarted: "game_already_started" },
    toast: { error: notice },
  });
  runInContext(code, ctx);
  const run = runInContext("rejoinAfterRelayRestart", ctx) as () => Promise<void>;
  const replace = (nextGameId: string | null) => {
    game = { isGameActive: true, isMultiplayer: nextGameId !== null, isHost: false };
    session = nextGameId ? { roomId: "room-1", gameId: nextGameId } : null;
    room = nextGameId ? { room_id: "room-1" } : null;
    gameId = nextGameId ?? "";
  };
  return { run, phases, resync, abort, listeners, notice, replace, phase: () => reconnect.phase };
}

describe("hidden guest room rejoin", () => {
  it("attempts room rejoin even while the document is hidden", async () => {
    const joinRoom = vi.fn().mockResolvedValue(undefined);
    const h = harness(joinRoom);
    await h.run();
    expect(joinRoom).toHaveBeenCalledExactlyOnceWith("room-1", undefined);
    expect(h.resync).toHaveBeenCalledOnce();
    expect(h.phases).toEqual(["reconnecting", "idle"]);
    expect(h.listeners.size).toBe(0);
  });

  it("retries a temporary relay failure while still hidden", async () => {
    const joinRoom = vi.fn()
      .mockRejectedValueOnce(new Error("relay temporarily unreachable"))
      .mockResolvedValueOnce(undefined);
    const h = harness(joinRoom);
    await h.run();
    expect(joinRoom).toHaveBeenCalledTimes(2);
    expect(h.resync).toHaveBeenCalledOnce();
    expect(h.abort).not.toHaveBeenCalled();
  });

  it("does not rejoin an already abandoned room", async () => {
    const joinRoom = vi.fn().mockResolvedValue(undefined);
    const h = harness(joinRoom, false);
    await h.run();
    expect(joinRoom).not.toHaveBeenCalled();
    expect(h.phases).toEqual([]);
  });

  it("still aborts the same guest game when its seat was forfeited", async () => {
    const h = harness(vi.fn().mockRejectedValue(new Error("game_already_started")));
    await h.run();
    expect(h.abort).toHaveBeenCalledOnce();
    expect(h.notice).toHaveBeenCalledOnce();
    expect(h.phase()).toBe("idle");
  });

  it("cannot end a replacement offline game after the old seat is rejected", async () => {
    const pending = deferred();
    const h = harness(vi.fn().mockReturnValue(pending.promise));
    const old = h.run();
    h.replace(null);
    pending.reject(new Error("game_already_started"));
    await old;
    expect(h.abort).not.toHaveBeenCalled();
    expect(h.notice).not.toHaveBeenCalled();
    expect(h.resync).not.toHaveBeenCalled();
    expect(h.phase()).toBe("idle");
    expect(h.listeners.size).toBe(0);
  });

  it("does not retry or resync after a replacement game starts", async () => {
    for (const success of [true, false]) {
      const pending = deferred();
      const joinRoom = vi.fn().mockReturnValue(pending.promise);
      const h = harness(joinRoom);
      const old = h.run();
      h.replace("game-2");
      if (success) pending.resolve();
      else pending.reject(new Error("temporarily unavailable"));
      await old;
      expect(joinRoom).toHaveBeenCalledOnce();
      expect(h.resync).not.toHaveBeenCalled();
      expect(h.abort).not.toHaveBeenCalled();
    }
  });

  it("allows a different game to rejoin without old completion clearing its phase", async () => {
    const first = deferred();
    const second = deferred();
    const joinRoom = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const h = harness(joinRoom);
    const old = h.run();
    h.replace("game-2");
    const replacement = h.run();
    const callsBeforeSettlement = joinRoom.mock.calls.length;
    first.reject(new Error("game_already_started"));
    await old;
    expect(callsBeforeSettlement).toBe(1);
    expect(joinRoom).toHaveBeenCalledTimes(2);
    expect(h.phase()).toBe("reconnecting");
    expect(h.abort).not.toHaveBeenCalled();
    expect(h.listeners.size).toBe(1);
    second.resolve();
    await replacement;
    expect(h.resync).toHaveBeenCalledOnce();
    expect(h.phase()).toBe("idle");
    expect(h.listeners.size).toBe(0);
  });

  it("discards a queued rejoin if its replacement game is abandoned", async () => {
    const first = deferred();
    const joinRoom = vi.fn().mockReturnValueOnce(first.promise);
    const h = harness(joinRoom);
    const old = h.run();
    h.replace("game-2");
    const replacement = h.run();
    h.replace(null);
    first.reject(new Error("game_already_started"));
    await Promise.all([old, replacement]);
    expect(joinRoom).toHaveBeenCalledOnce();
    expect(h.abort).not.toHaveBeenCalled();
    expect(h.resync).not.toHaveBeenCalled();
    expect(h.phase()).toBe("idle");
    expect(h.listeners.size).toBe(0);
  });
});
