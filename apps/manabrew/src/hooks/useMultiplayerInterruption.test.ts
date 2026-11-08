/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  endGame: vi.fn(),
  sendDirective: vi.fn(),
  game: {
    isMultiplayer: true,
    isGameActive: true,
    isHost: false,
    gameView: { gameOver: false, players: [] },
    currentPrompt: null,
  },
  server: {
    reconnect: { phase: "reconnecting" },
    currentRoom: null,
    username: "player",
  },
}));

vi.mock("@/stores/useGameStore", () => ({
  useGameStore: Object.assign(
    (selector: (state: typeof mocks.game) => unknown) => selector(mocks.game),
    { getState: () => ({ ...mocks.game, endGame: mocks.endGame }) },
  ),
}));
vi.mock("@/stores/useServerStore", () => ({
  useServerStore: Object.assign(
    (selector: (state: typeof mocks.server) => unknown) => selector(mocks.server),
    { getState: () => mocks.server },
  ),
}));
vi.mock("@/platform", () => ({
  getPlatform: () => ({ game: { sendDirective: mocks.sendDirective } }),
}));
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), info: vi.fn() },
}));

import { useMultiplayerInterruption } from "./useMultiplayerInterruption";
import type { MultiplayerInterruption } from "./useMultiplayerInterruption";

let latest: MultiplayerInterruption | null = null;
function Harness() {
  latest = useMultiplayerInterruption();
  return null;
}

describe("useMultiplayerInterruption with suspended tabs", () => {
  let container: HTMLDivElement;
  let root: Root;
  let hidden: boolean;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-08T07:00:00Z"));
    hidden = false;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => hidden,
    });
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    latest = null;
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.useRealTimers();
    mocks.endGame.mockClear();
  });

  it("keeps the game when iPadOS suspends a disconnected tab longer than the deadline", async () => {
    await act(async () => root.render(createElement(Harness)));
    expect(latest?.secondsLeft).toBe(120);

    await act(async () => {
      hidden = true;
      document.dispatchEvent(new Event("visibilitychange"));
      await vi.advanceTimersByTimeAsync(5 * 60_000);
    });
    expect(mocks.endGame).not.toHaveBeenCalled();

    await act(async () => {
      hidden = false;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(latest?.secondsLeft).toBe(120);
    expect(mocks.endGame).not.toHaveBeenCalled();

    await act(async () => vi.advanceTimersByTimeAsync(119_000));
    expect(mocks.endGame).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(2_000));
    expect(mocks.endGame).toHaveBeenCalledOnce();
  });

  it("still ends an unrecoverable connection that times out in the foreground", async () => {
    await act(async () => root.render(createElement(Harness)));
    await act(async () => vi.advanceTimersByTimeAsync(120_000));
    expect(mocks.endGame).toHaveBeenCalledOnce();
  });
});
