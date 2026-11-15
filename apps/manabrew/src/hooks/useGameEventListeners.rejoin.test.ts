import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(new URL("./useGameEventListeners.ts", import.meta.url), "utf8");
const start = source.indexOf("async function rejoinAfterRelayRestart()");
const end = source.indexOf("\nfunction toastOpponentPublicAction", start);
if (start < 0 || end <= start) throw Error("Missing real room rejoin implementation");
const code = ts.transpileModule(
  `let rejoinInFlight = false;\n${source.slice(start, end)}\n`,
  { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
).outputText;

function harness(joinRoom: (...args: unknown[]) => Promise<void>, active = true) {
  const phases: string[] = [];
  const resync = vi.fn();
  const abort = vi.fn();
  const listeners = new Map<string, () => void>();
  const doc = {
    hidden: true,
    addEventListener: (event: string, callback: () => void) => listeners.set(event, callback),
    removeEventListener: (event: string) => listeners.delete(event),
  };
  const ctx = createContext({
    Date, Error, document: doc, REJOIN_RETRY_DELAY_MS: 2,
    SELF_RECONNECT_WINDOW_S: 120,
    useServerStore: { getState: () => ({ currentRoom: { room_id: "room-1" }, roomPassword: null, joinRoom }) },
    getState: () => ({ isGameActive: active }),
    peekActiveGameSession: () => null,
    setReconnectPhase: (phase: string) => phases.push(phase),
    resumeReconnectDeadline: (deadline: number) => deadline,
    setTimeout: (callback: () => void) => callback(),
    getPlatform: () => ({ server: { requestResync: resync } }),
    useGameStore: { getState: () => ({ endGame: abort }) },
    SERVER_ERROR_CODE: { GameAlreadyStarted: "game_already_started" },
    toast: { error: vi.fn() },
  });
  runInContext(code, ctx);
  const run = runInContext("rejoinAfterRelayRestart", ctx) as () => Promise<void>;
  return { run, phases, resync, abort, listeners };
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
    expect(h.phases).toEqual(["reconnecting", "idle"]);
  });
});
