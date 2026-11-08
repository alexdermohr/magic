/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prefetch: vi.fn(async (_cards: unknown[], _mode?: string, _settled?: () => void) => undefined),
  warm: vi.fn(async () => undefined),
  index: vi.fn(),
  cancel: vi.fn(),
  state: {
    gameView: { players: [], battlefield: [] },
    gameDecks: { "player-0": { cards: [], commanders: [] } },
    myPlayerSlot: "player-0",
    isPrefetchingCards: true,
  },
}));

vi.mock("@/stores/useGameStore", () => ({
  useGameStore: Object.assign(
    (selector: (state: typeof mocks.state) => unknown) => selector(mocks.state),
    {
      getState: () => mocks.state,
      setState: (patch: Record<string, unknown>) => Object.assign(mocks.state, patch),
    },
  ),
}));
vi.mock("@/stores/useScryfallStore", () => ({ prefetchCards: mocks.prefetch }));
vi.mock("@/lib/cardFaceWarmup", () => ({
  warmDeckFaces: mocks.warm,
  indexDeckFaces: mocks.index,
  cancelDeckFaceWarmup: mocks.cancel,
  libraryTopRendered: vi.fn(async () => undefined),
  manabrewRenderVariants: () => [],
}));
vi.mock("@/lib/decks", () => ({
  getDeckCardPool: () => [],
  asDeckCard: vi.fn(),
  asGameDeckCard: vi.fn(),
}));
vi.mock("@/lib/cardRenderer", () => ({ renderCard: vi.fn() }));
vi.mock("@/lib/cardRenderTypes", () => ({ releaseCardRaster: vi.fn() }));
vi.mock("@/lib/forgeWasm", () => ({ isForgeWasmActive: () => false }));
vi.mock("@/lib/gameCard", () => ({ gameCardFaceIndex: () => 0 }));
vi.mock("@/stores/usePreferencesStore", () => ({
  usePreferencesStore: { getState: () => ({ battlefieldCardStyle: "normal" }) },
}));

import { useGamePrefetch } from "./useGamePrefetch";

function Harness() {
  useGamePrefetch("full");
  return null;
}

describe("useGamePrefetch under iPad memory pressure", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.isPrefetchingCards = true;
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  function device(platform: string, maxTouchPoints: number, userAgent: string) {
    for (const [key, value] of Object.entries({ platform, maxTouchPoints, userAgent }))
      Object.defineProperty(navigator, key, { configurable: true, value });
  }

  it("does not bulk-load card images or render every card face on iPad Safari", async () => {
    device("MacIntel", 5, "Mozilla/5.0 Safari/605.1.15");
    await act(async () => root.render(createElement(Harness)));
    await act(async () => Promise.resolve());

    expect(mocks.index).toHaveBeenCalledOnce();
    expect(mocks.warm).not.toHaveBeenCalled();
    expect(mocks.prefetch.mock.calls.every((call) => call[1] !== "full" && call[1] !== "art")).toBe(
      true,
    );
    expect(mocks.state.isPrefetchingCards).toBe(false);
  });

  it("preserves the complete deck warm-up for unconstrained desktop browsers", async () => {
    device("Linux x86_64", 0, "Mozilla/5.0 Chrome/156");
    await act(async () => root.render(createElement(Harness)));
    await act(async () => Promise.resolve());

    expect(mocks.index).toHaveBeenCalledOnce();
    expect(mocks.warm).toHaveBeenCalledOnce();
    expect(mocks.prefetch.mock.calls.map((call) => call[1])).toContain("full");
    expect(mocks.prefetch.mock.calls.map((call) => call[1])).toContain("art");
  });

  it("cancels a pending full-deck render when the game UI unmounts", async () => {
    device("Linux x86_64", 0, "Mozilla/5.0 Chrome/156");
    await act(async () => root.render(createElement(Harness)));
    await act(async () => root.unmount());
    expect(mocks.cancel).toHaveBeenCalledOnce();
  });
});
