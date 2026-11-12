import { describe, expect, it } from "vitest";
import { verifyForgeRecoveryDelta, type ForgeRecoveryDelta } from "./forgeAutoResumeStore";

const witness = { state: "a".repeat(64), rng: "123:abcdef0123456789" };
const prompt = { decidingPlayerId: "player-0", input: { type: "chooseAction" } };
const startRequest = JSON.stringify({
  gameId: "autoresume-1",
  decisionJournal: true,
  journalRewind: true,
  experimentalInternalAiReplay: true,
  players: [{ ai: false }, { ai: true }],
});
const boundary = (): ForgeRecoveryDelta => ({
  version: 1,
  gameId: "autoresume-1",
  nextSequence: 1,
  startRequest,
  entries: [],
  prompt,
  verification: witness,
});
const action = (sequence: number) => ({
  sequence,
  playerIndex: 0,
  prompt,
  action: { type: "chooseAction", output: { type: "pass" } },
  verification: witness,
});

describe("Forge offline recovery journal integrity", () => {
  it("accepts the first seeded Forge decision boundary", () => {
    expect(() => verifyForgeRecoveryDelta(boundary(), 0)).not.toThrow();
  });
  it("accepts the first consumed action after an empty committed start", () => {
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 2,
      entries: [action(1)],
    }, 0, false)).not.toThrow();
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 2,
      entries: [action(1)],
    }, 0, true)).toThrow(/start request/);
  });
  it("accepts a contiguous delta after a previously committed boundary", () => {
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 3,
      entries: [action(1), action(2)],
    }, 0)).toThrow(/start request/);
    // A delta for already committed decision 1 carries only decision 2.
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 3,
      entries: [action(2)],
    }, 1)).not.toThrow();
  });
  it("rejects missing entries and future-sequence holes", () => {
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 4,
      entries: [action(2)],
    }, 1)).toThrow(/incomplete/);
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 3,
      entries: [action(3)],
    }, 1)).toThrow(/reordered/);
  });
  it("rejects another game and unsafely unjournaled starts", () => {
    expect(() => verifyForgeRecoveryDelta({ ...boundary(), gameId: "other" }, 0)).toThrow(/identity/);
    const wrongStart = JSON.stringify({ ...JSON.parse(startRequest), journalRewind: false });
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: wrongStart,
    }, 0)).toThrow(/identity/);
  });
  it("rejects tampered state witnesses, illegal RNG traces and player-seat mismatch", () => {
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), verification: { ...witness, rng: "unseeded" },
    }, 0)).toThrow(/invalid/);
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), verification: { ...witness, state: "corrupt" },
    }, 0)).toThrow(/invalid/);
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), startRequest: undefined, nextSequence: 2,
      entries: [{ ...action(1), prompt: { decidingPlayerId: "player-2" } }],
    }, 0)).toThrow();
  });
  it("never accepts invalidated journal delivery", () => {
    expect(() => verifyForgeRecoveryDelta({
      ...boundary(), unavailableReason: "journal delivery overflow",
    }, 0)).toThrow(/unavailable|invalid/);
  });
});

describe("installed Forge recovery release pin", () => {
  it("keeps the locally ready engine version when the server has a newer release", async () => {
    const { installedForgeRecoveryReleaseId } = await import("./forgeAutoResumeStore");
    const version = "a".repeat(20);
    const incomplete = "b".repeat(20);
    const cache = {
      match: async (key: string) => {
        if (key === "/offline-ready.json") return { text: async () => version };
        if (key === "/index.html") return { ok: true };
        if (key === "/offline-assets.json") return {
          json: async () => ({ version, files: [{ url: "/engine.wasm" }] }),
        };
        return undefined;
      },
    };
    const previous = globalThis.caches;
    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      value: {
        keys: async () => ["manabrew-ipad-offline-" + version, "manabrew-ipad-offline-" + incomplete],
        open: async (name: string) => name.endsWith(version) ? cache : { match: async () => undefined },
      },
    });
    try {
      expect(await installedForgeRecoveryReleaseId()).toBe(version);
    } finally {
      if (previous === undefined) delete (globalThis as { caches?: CacheStorage }).caches;
      else Object.defineProperty(globalThis, "caches", { configurable: true, value: previous });
    }
  });

  it("refuses an incomplete or mismatched offline cache", async () => {
    const { installedForgeRecoveryReleaseId } = await import("./forgeAutoResumeStore");
    const previous = globalThis.caches;
    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      value: {
        keys: async () => ["manabrew-ipad-offline-" + "a".repeat(20)],
        open: async () => ({
          match: async (key: string) => key === "/offline-ready.json"
            ? { text: async () => "b".repeat(20) }
            : { json: async () => ({ version: "a".repeat(20), files: [] }) },
        }),
      },
    });
    try {
      expect(await installedForgeRecoveryReleaseId()).toBeNull();
    } finally {
      if (previous === undefined) delete (globalThis as { caches?: CacheStorage }).caches;
      else Object.defineProperty(globalThis, "caches", { configurable: true, value: previous });
    }
  });
});
