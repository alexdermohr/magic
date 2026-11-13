import { describe, expect, it } from "vitest";
import { createForgeRecoveryCommitQueue, verifyForgeRecoveryDelta, type ForgeRecoveryDelta } from "./forgeAutoResumeStore";

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

describe("Forge recovery version in an ordinary Safari tab", () => {
  it("pins a browser game to the network manifest when no full offline cache was installed", async () => {
    const { resolveForgeRecoveryReleaseId } = await import("./forgeAutoResumeStore");
    const oldCaches = globalThis.caches;
    const oldFetch = globalThis.fetch;
    const version = "c".repeat(20);
    Object.defineProperty(globalThis, "caches", {
      configurable: true, value: { keys: async () => [] },
    });
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: async () => ({
        ok: true, json: async () => ({ version, files: [{ url: "/index.html" }] }),
      }),
    });
    try {
      expect(await resolveForgeRecoveryReleaseId()).toBe(version);
    } finally {
      if (oldCaches === undefined) delete (globalThis as { caches?: CacheStorage }).caches;
      else Object.defineProperty(globalThis, "caches", { configurable: true, value: oldCaches });
      Object.defineProperty(globalThis, "fetch", { configurable: true, value: oldFetch });
    }
  });

  it("does not replace a fully installed old WebImage with the newer server version", async () => {
    const { resolveForgeRecoveryReleaseId } = await import("./forgeAutoResumeStore");
    const previous = globalThis.caches;
    const oldFetch = globalThis.fetch;
    const version = "d".repeat(20);
    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      value: {
        keys: async () => ["manabrew-ipad-offline-" + version],
        open: async () => ({
          match: async (key: string) =>
            key === "/offline-ready.json" ? { text: async () => version } :
              key === "/index.html" ? { ok: true } :
                key === "/offline-assets.json" ? {
                  json: async () => ({ version, files: [{ url: "/index.html" }] }),
                } : undefined,
        }),
      },
    });
    Object.defineProperty(globalThis, "fetch", {
      configurable: true, value: () => { throw Error("The installed version must win"); },
    });
    try {
      expect(await resolveForgeRecoveryReleaseId()).toBe(version);
    } finally {
      if (previous === undefined) delete (globalThis as { caches?: CacheStorage }).caches;
      else Object.defineProperty(globalThis, "caches", { configurable: true, value: previous });
      Object.defineProperty(globalThis, "fetch", { configurable: true, value: oldFetch });
    }
  });
});


describe("Forge recovery durable checkpoint cursor", () => {
  it("retransmits the start manifest and missed decision after a failed initial commit", async () => {
    let first = true;
    let committed = false;
    let count = 0;
    const received: ForgeRecoveryDelta[] = [];
    const errors: unknown[] = [];
    const queue = createForgeRecoveryCommitQueue(async (packet) => {
      received.push(packet);
      verifyForgeRecoveryDelta(packet, count, !committed);
      if (first) { first = false; throw Error("transient IndexedDB abort"); }
      committed = true;
      count = packet.nextSequence - 1;
    }, (error) => { errors.push(error); });

    queue.enqueue(boundary());
    await queue.flush();
    expect(errors).toHaveLength(1);
    expect(committed).toBe(false);
    queue.enqueue({ ...boundary(), startRequest: undefined, nextSequence: 2, entries: [action(1)] });
    await queue.flush();
    expect(received).toHaveLength(2);
    expect(received[1]!.startRequest).toBe(startRequest);
    expect(received[1]!.entries.map((item) => item.sequence)).toEqual([1]);
    expect(count).toBe(1);
    queue.dispose();
  });

  it("replaces an abandoned rewind timeline before saving new decisions", async () => {
    const persisted: ForgeRecoveryDelta[] = [];
    const queue = createForgeRecoveryCommitQueue(async (packet) => {
      const previous = persisted.at(-1);
      verifyForgeRecoveryDelta(packet, packet.replaceHistory ? 0 : (previous?.nextSequence ?? 1) - 1,
        packet.replaceHistory === true || !previous);
      persisted.push(packet);
    }, () => {});

    queue.enqueue(boundary());
    await queue.flush();
    queue.enqueue({ ...boundary(), nextSequence: 4, startRequest: undefined,
      entries: [action(1), action(2), action(3)] });
    await queue.flush();
    queue.enqueue({ ...boundary(), nextSequence: 2, replaceHistory: true, entries: [action(1)] });
    queue.enqueue({ ...boundary(), nextSequence: 3, startRequest: undefined,
      entries: [action(2)] });
    await queue.flush();
    const replacementIndex = persisted.findIndex((packet) => packet.replaceHistory);
    expect(replacementIndex).toBeGreaterThanOrEqual(0);
    expect(persisted.slice(replacementIndex).flatMap((packet) =>
      packet.entries.map((entry) => entry.sequence))).toEqual([1, 2]);
    expect(persisted.at(-1)?.nextSequence).toBe(3);
    queue.dispose();
  });

  it("does not lose a replacement queued while an older save is still in flight", async () => {
    let resolveFirst: (() => void) | undefined;
    const first = new Promise<void>((resolve) => { resolveFirst = resolve; });
    const persisted: ForgeRecoveryDelta[] = [];
    const queue = createForgeRecoveryCommitQueue(async (packet) => {
      if (persisted.length === 0) await first;
      persisted.push(packet);
    }, () => {});
    queue.enqueue(boundary());
    const replacement = { ...boundary(), nextSequence: 2, replaceHistory: true,
      entries: [action(1)] };
    queue.enqueue(replacement);
    resolveFirst!();
    await queue.flush();
    expect(persisted).toHaveLength(2);
    expect(persisted[1]?.replaceHistory).toBe(true);
    expect(persisted[1]?.entries.map((entry) => entry.sequence)).toEqual([1]);
    queue.dispose();
  });

  it("retransmits a failed middle journal entry with the next decision, without rewriting a committed prefix", async () => {
    let committed = false;
    let count = 0;
    let failMiddle = true;
    const received: ForgeRecoveryDelta[] = [];
    const queue = createForgeRecoveryCommitQueue(async (packet) => {
      received.push(packet);
      verifyForgeRecoveryDelta(packet, count, !committed);
      if (committed && failMiddle) { failMiddle = false; throw Error("IndexedDB transaction aborted"); }
      committed = true;
      count = packet.nextSequence - 1;
    }, () => {});

    queue.enqueue(boundary());
    await queue.flush();
    queue.enqueue({ ...boundary(), startRequest: undefined, nextSequence: 2, entries: [action(1)] });
    await queue.flush();
    expect(count).toBe(0);
    queue.enqueue({ ...boundary(), startRequest: undefined, nextSequence: 3, entries: [action(2)] });
    await queue.flush();
    expect(count).toBe(2);
    expect(received.at(-1)?.startRequest).toBeUndefined();
    expect(received.at(-1)?.entries.map((item) => item.sequence)).toEqual([1, 2]);
    queue.dispose();
  });
});