import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Deck } from "@/protocol";

vi.hoisted(() => vi.stubGlobal("__APP_VERSION__", "test"));

const upload = vi.fn<(game: unknown) => Promise<void>>();

vi.mock("@/api/hub", () => ({
  recordOfflineGame: (game: unknown) => upload(game),
  HubRequestError: class HubRequestError extends Error {
    status = 500;
  },
}));
vi.mock("@/platform", () => ({ getPlatform: () => ({ type: "web" }) }));
vi.mock("@/lib/deckFingerprint", () => ({
  getDeckEvidenceFingerprint: () => Promise.resolve("fingerprint"),
}));

function storage(map: Map<string, string>) {
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  };
}

const shared = new Map<string, string>();
const tabA = new Map<string, string>();
const tabB = new Map<string, string>();
const deck = { name: "Test", cards: [], commanders: [], sideboard: [] } as unknown as Deck;
const seats = [
  { seatId: "p1", username: "human", isBot: false, conceded: false },
  { seatId: "p2", username: "bot", isBot: true, conceded: false },
];

async function loadTab(session: Map<string, string>) {
  vi.stubGlobal("window", {
    localStorage: storage(shared),
    sessionStorage: storage(session),
  });
  vi.resetModules();
  return import("./offlinePlayRecord");
}

async function stage(tab: Map<string, string>) {
  const mod = await loadTab(tab);
  await mod.beginOfflineGame({
    engine: "forge-wasm", format: "commander", startingLife: 40,
    decks: { p1: deck, p2: deck },
  });
  const id = mod.currentOfflineGameId()!;
  mod.stageOfflineGameOnPagehide(seats);
  return { mod, id };
}

describe("offline pagehide records from concurrent tabs", () => {
  beforeEach(() => {
    shared.clear();
    tabA.clear();
    tabB.clear();
    upload.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => vi.unstubAllGlobals());

  it("keeps both games until each original tab reloads and reports its own result", async () => {
    const first = await stage(tabA);
    const second = await stage(tabB);
    expect(first.id).not.toBe(second.id);
    expect([...shared.keys()].filter((key) => key.includes(":pagehide:"))).toHaveLength(2);

    const reopenedA = await loadTab(tabA);
    await reopenedA.flushOfflinePlayRecords();
    expect(upload.mock.calls.map(([game]) => (game as { reportId: string }).reportId))
      .toEqual([first.id]);

    const reopenedB = await loadTab(tabB);
    await reopenedB.flushOfflinePlayRecords();
    expect(upload.mock.calls.map(([game]) => (game as { reportId: string }).reportId))
      .toEqual([first.id, second.id]);
    expect([...shared.keys()].filter((key) => key.includes(":pagehide:"))).toHaveLength(0);
  });

  it("clearing one tab cannot remove the other tab's staged game", async () => {
    const first = await stage(tabA);
    const second = await stage(tabB);
    vi.stubGlobal("window", { localStorage: storage(shared), sessionStorage: storage(tabA) });
    first.mod.cancelOfflinePagehide();
    expect([...shared.keys()].filter((key) => key.includes(":pagehide:"))).toHaveLength(1);

    const reopenedB = await loadTab(tabB);
    await reopenedB.flushOfflinePlayRecords();
    expect(upload.mock.calls.map(([game]) => (game as { reportId: string }).reportId))
      .toEqual([second.id]);
  });

  it("reads and removes a prior-release single-key record belonging to this tab", async () => {
    const first = await stage(tabA);
    const stagedKey = [...shared.keys()].find((key) => key.includes(":pagehide:"))!;
    const previousKey = stagedKey.slice(0, stagedKey.lastIndexOf(":"));
    shared.set(previousKey, shared.get(stagedKey)!);
    shared.delete(stagedKey);
    const reopened = await loadTab(tabA);
    await reopened.flushOfflinePlayRecords();
    expect(upload.mock.calls.map(([game]) => (game as { reportId: string }).reportId))
      .toEqual([first.id]);
    expect(shared.has(previousKey)).toBe(false);
  });
});
