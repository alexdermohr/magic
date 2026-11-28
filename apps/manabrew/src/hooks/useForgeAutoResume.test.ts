/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ForgeRecoverySave } from "@/lib/forgeAutoResumeStore";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  startGame: vi.fn(),
  release: vi.fn(),
  storedRelease: vi.fn(),
  readSave: vi.fn(),
  on: vi.fn(),
}));

vi.mock("react-router-dom", () => ({ useNavigate: () => mocks.navigate }));
vi.mock("@/platform", () => ({ getPlatformType: () => "web", getEventBus: () => ({ on: mocks.on }) }));
vi.mock("@/lib/activeGameSession", () => ({ peekActiveGameSession: () => null }));
vi.mock("@/lib/constants", () => ({
  ROUTES: { PLAY: "/play", PLAY_OFFLINE_CONSTRUCTED: "/play/offline/constructed" },
}));
vi.mock("@/lib/forgeAutoResumeStore", () => ({
  forgeRecoveryReleaseId: mocks.release,
  forgeRecoveryStoredReleaseId: mocks.storedRelease,
  readForgeRecoverySave: mocks.readSave,
}));
vi.mock("@/stores/useGameStore", () => ({
  useGameStore: { getState: () => ({ isGameActive: false, startGame: mocks.startGame }) },
}));

import { useForgeAutoResume } from "./useForgeAutoResume";

let phase = "";
let progress: ReturnType<typeof useForgeAutoResume>["progress"];
let retry: () => void;
function Harness() {
  ({ phase, progress, retry } = useForgeAutoResume());
  return null;
}

const deck = { name: "Recovered deck", format: "draft", cards: [], commanders: [] };
const opponent = { name: "Opponent", format: "draft", cards: [], commanders: [] };
const save = (gauntletId: string | null) => ({
  gameId: "recovered-game",
  updatedAt: Date.now(),
  launch: {
    deck, opponentDecks: [opponent], formatId: "draft", commanderName: null,
    gauntletId, engine: "Forge", aiController: "forge",
  },
  replaySnapshot: {
    version: 1, nextSequence: 1,
    journal: { version: 2, startRequest: "{}", entries: [] },
    prompt: { decidingPlayerId: "player-0" },
    verification: { state: "a".repeat(64), rng: "1:1" },
  },
}) as unknown as ForgeRecoverySave;

describe("automatic Forge resume navigation", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.navigate.mockReset();
    mocks.startGame.mockReset().mockResolvedValue(true);
    mocks.release.mockReset().mockResolvedValue("a".repeat(20));
    mocks.storedRelease.mockReset().mockResolvedValue("a".repeat(20));
    mocks.readSave.mockReset();
    mocks.on.mockReset().mockReturnValue(() => {});
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it("restores the Gauntlet identity and its return route", async () => {
    const saved = save("gauntlet-resume-proof");
    mocks.readSave.mockResolvedValue(saved);
    await act(async () => { root.render(createElement(Harness)); });
    expect(mocks.navigate).toHaveBeenCalledWith("/play", {
      replace: true, state: { exitTo: "/gauntlet/gauntlet-resume-proof" },
    });
    expect(mocks.startGame).toHaveBeenCalledWith(
      saved.launch.deck, "draft", undefined, saved.launch.opponentDecks,
      "Forge", "gauntlet-resume-proof", saved,
    );
    expect(phase).toBe("idle");
  });

  it("shows only verified monotonic progress for the active attempt and clears the listener", async () => {
    const saved = save(null);
    const entries = Array.from({ length: 3 }, () => ({}));
    saved.replaySnapshot.journal.entries = entries as typeof saved.replaySnapshot.journal.entries;
    mocks.readSave.mockResolvedValue(saved);
    let resolve!: (ok: boolean) => void;
    mocks.startGame.mockReturnValue(new Promise<boolean>(done => { resolve = done; }));
    const unsubscribe = vi.fn();
    mocks.on.mockReturnValue(unsubscribe);
    await act(async () => { root.render(createElement(Harness)); });
    expect(phase).toBe("restoring");
    expect(progress).toEqual({ total: 3, verified: null });
    expect(mocks.on).toHaveBeenCalledWith("forge:replay_progress", expect.any(Function));
    const emit = mocks.on.mock.calls[0][1] as (event: unknown) => void;
    await act(async () => {
      emit({ gameId: "other-game", verified: 3, total: 3 });
      emit({ gameId: saved.gameId, verified: 4, total: 3 });
      emit({ gameId: saved.gameId, verified: 0.5, total: 3 });
    });
    expect(progress).toEqual({ total: 3, verified: null });
    await act(async () => {
      emit({ gameId: saved.gameId, verified: 0, total: 4 });
      emit({ gameId: saved.gameId, verified: 2, total: 4 });
      emit({ gameId: saved.gameId, verified: 1, total: 4 });
      emit({ gameId: saved.gameId, verified: 3, total: 5 });
    });
    expect(progress).toEqual({ total: 4, verified: 2 });
    await act(async () => {
      emit({ gameId: saved.gameId, verified: 4, total: 4 });
    });
    expect(progress).toEqual({ total: 4, verified: 4 });
    expect(phase).toBe("restoring");
    await act(async () => resolve(false));
    expect(phase).toBe("failed");
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    mocks.startGame.mockResolvedValue(true);
    await act(async () => retry());
    expect(phase).toBe("idle");
    expect(progress).toEqual({ total: 3, verified: null });
  });

  it("keeps ordinary games on the offline board without a Gauntlet", async () => {
    const saved = save(null);
    mocks.readSave.mockResolvedValue(saved);
    await act(async () => { root.render(createElement(Harness)); });
    expect(mocks.navigate).toHaveBeenCalledWith("/play/offline/constructed", { replace: true });
    expect(mocks.startGame).toHaveBeenCalledWith(
      saved.launch.deck, "draft", undefined, saved.launch.opponentDecks,
      "Forge", undefined, saved,
    );
    expect(phase).toBe("idle");
  });
});
