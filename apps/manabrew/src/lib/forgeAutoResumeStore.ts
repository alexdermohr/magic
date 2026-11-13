/**
 * Private device-only Forge journal. The complete new decision prefix and
 * its verified prompt/RNG boundary are committed atomically. A killed WebKit
 * process never observes a half-written game.
 */
import type { Deck } from "@/protocol/deck";
import type { EngineKind } from "@/types/server";

const DB_NAME = "manabrew-forge-autoresume-v1";
const META = "current";
const ENTRIES = "entries";
const KEY = "active";

export interface ForgeRecoveryLaunch {
  deck: Deck;
  opponentDecks: Deck[] | null;
  formatId: string;
  commanderName: string | null;
  engine: EngineKind;
  aiController: "forge";
}
export interface ForgeRecoveryEntry {
  sequence: number;
  playerIndex: number;
  prompt: { decidingPlayerId: string; [key: string]: unknown };
  action: Record<string, unknown>;
  verification: { state: string; rng: number | string };
}
export interface ForgeRecoveryDelta {
  version: 1;
  gameId: string;
  nextSequence: number;
  startRequest?: string;
  entries: ForgeRecoveryEntry[];
  prompt: ForgeRecoveryEntry["prompt"];
  verification: ForgeRecoveryEntry["verification"];
  unavailableReason?: string;
  replaceHistory?: boolean;
}
interface StoredMeta {
  version: 1;
  gameId: string;
  releaseId: string;
  launch: ForgeRecoveryLaunch;
  startRequest: string;
  nextSequence: number;
  prompt: ForgeRecoveryDelta["prompt"];
  verification: ForgeRecoveryDelta["verification"];
  updatedAt: number;
}
export interface ForgeRecoverySave {
  launch: ForgeRecoveryLaunch;
  gameId: string;
  updatedAt: number;
  replaySnapshot: {
    version: 1;
    nextSequence: number;
    journal: { version: 2; startRequest: string; entries: ForgeRecoveryEntry[] };
    prompt: ForgeRecoveryDelta["prompt"];
    verification: ForgeRecoveryDelta["verification"];
  };
}

function validWitness(value: unknown): value is ForgeRecoveryDelta["verification"] {
  if (!value || typeof value !== "object") return false;
  const obj = value as ForgeRecoveryDelta["verification"];
  return typeof obj.state === "string" && /^[a-f0-9]{64}$/.test(obj.state) &&
    typeof obj.rng === "string" && /^[0-9]+:[0-9a-f]{1,16}$/.test(obj.rng);
}

/** All supplied actions must be contiguous and bound to the original game. */
export function verifyForgeRecoveryDelta(raw: unknown, previousCount: number, initial = previousCount === 0): asserts raw is ForgeRecoveryDelta {
  if (!raw || typeof raw !== "object") throw Error("Invalid Forge recovery boundary");
  const item = raw as Partial<ForgeRecoveryDelta>;
  if (item.version !== 1 || !item.gameId ||
      !/^[A-Za-z0-9._-]{1,160}$/.test(item.gameId) ||
      !Number.isSafeInteger(item.nextSequence) ||
      !Array.isArray(item.entries) || item.entries.length > 50000 ||
      !item.prompt || typeof item.prompt.decidingPlayerId !== "string" ||
      !validWitness(item.verification) || item.unavailableReason ||
      item.nextSequence !== previousCount + item.entries.length + 1) {
    throw Error("Forge recovery boundary is invalid, stale or incomplete");
  }
  if (initial) {
    if (typeof item.startRequest !== "string" || item.startRequest.length > 1_000_000) {
      throw Error("Forge recovery start request missing");
    }
    let start: { gameId?: string; decisionJournal?: boolean; journalRewind?: boolean };
    try { start = JSON.parse(item.startRequest); } catch { throw Error("Invalid Forge recovery start JSON"); }
    if (start.gameId !== item.gameId || start.decisionJournal !== true || start.journalRewind !== true) {
      throw Error("Forge recovery game identity mismatched");
    }
  } else if (item.startRequest !== undefined) {
    throw Error("Forge recovery start changed midgame");
  }
  for (const [index, entry] of item.entries.entries()) {
    if (!entry || entry.sequence !== previousCount + index + 1 ||
        !Number.isSafeInteger(entry.playerIndex) || entry.playerIndex < 0 ||
        !entry.prompt || entry.prompt.decidingPlayerId !== "player-" + entry.playerIndex ||
        !entry.action || typeof entry.action !== "object" || !validWitness(entry.verification)) {
      throw Error("Forge recovery journal entry is malformed or reordered");
    }
  }
}

let opened: Promise<IDBDatabase> | null = null;
function openDb(): Promise<IDBDatabase> {
  if (opened) return opened;
  opened = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(Error("IndexedDB unavailable"));
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(META)) r.result.createObjectStore(META);
      if (!r.result.objectStoreNames.contains(ENTRIES)) r.result.createObjectStore(ENTRIES);
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error ?? Error("Cannot open Forge save database"));
    r.onblocked = () => reject(Error("Other tab blocks Forge recovery storage"));
  }).catch((error) => { opened = null; throw error; });
  return opened;
}
function transact<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  fn: (tx: IDBTransaction, assign: (value: T) => void, fail: (error: unknown) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([META, ENTRIES], mode, {
      durability: mode === "readwrite" ? "strict" : "default",
    });
    let value!: T;
    let validationError: unknown = null;
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(validationError ?? tx.error ?? Error("Forge save transaction failed"));
    tx.onabort = () => reject(validationError ?? tx.error ?? Error("Forge save was not committed"));
    const fail = (error: unknown) => {
      validationError = error;
      tx.abort();
    };
    try { fn(tx, (next) => { value = next; }, fail); }
    catch (error) { fail(error); }
  });
}

/** Serialize all writes; no later prompt may be overwritten by an old one. */
let writes: Promise<unknown> = Promise.resolve();
export function commitForgeRecoveryDelta(packet: ForgeRecoveryDelta, releaseId: string, launch: ForgeRecoveryLaunch): Promise<void> {
  const job = writes.catch(() => {}).then(async () => {
    if (!/^[a-f0-9]{20,64}$/.test(releaseId) || launch.engine !== "Forge" || launch.aiController !== "forge") {
      throw Error("Forge recovery requires a pinned local engine");
    }
    if (JSON.stringify(packet).length > (packet.replaceHistory ? 64_000_000 : 3_000_000)) {
      throw Error("Forge recovery delta too large");
    }
    const db = await openDb();
    return transact<void>(db, "readwrite", (tx, done, fail) => {
      const meta = tx.objectStore(META);
      const journal = tx.objectStore(ENTRIES);
      const r = meta.get(KEY);
      r.onsuccess = () => {
        try {
          const previous = r.result as StoredMeta | undefined;
          const continuing = previous?.gameId === packet.gameId && previous.releaseId === releaseId;
          const replacing = packet.replaceHistory === true;
          if (replacing && !continuing) throw Error("Cannot rewind another Forge game");
          const count = replacing ? 0 : continuing ? previous.nextSequence - 1 : 0;
          // A committed game can still have zero consumed decisions: its
          // first action must not be mistaken for a second initial manifest.
          verifyForgeRecoveryDelta(packet, count, !continuing || replacing);
          if (replacing && (
              previous.startRequest !== packet.startRequest ||
              packet.nextSequence > previous.nextSequence)) {
            throw Error("Forge rewind does not match the stored game history");
          }
          if (!continuing || replacing) journal.clear();
          for (const entry of packet.entries) journal.put(entry, entry.sequence);
          meta.put({
            version: 1, gameId: packet.gameId, releaseId,
            launch: continuing ? previous.launch : launch,
            startRequest: continuing ? previous.startRequest : packet.startRequest!,
            nextSequence: packet.nextSequence, prompt: packet.prompt,
            verification: packet.verification, updatedAt: Date.now(),
          } satisfies StoredMeta, KEY);
          done(undefined);
        } catch (error) {
          // The transaction must remain atomic. Preserve the exact validation
          // failure for test diagnosis, without logging private card content.
          fail(error);
        }
      };
    });
  });
  writes = job;
  return job as Promise<void>;
}

/**
 * Retry uncommitted boundaries with their missing prefix. The Forge JVM
 * advances its send cursor before IndexedDB has acknowledged durability:
 * sending the next boundary alone would permanently strand the saved game.
 * Only remove a prefix after a successful, atomic storage transaction.
 */
export function createForgeRecoveryCommitQueue(
  persist: (delta: ForgeRecoveryDelta) => Promise<void>,
  onError: (error: unknown) => void,
) {
  let pending: ForgeRecoveryDelta[] = [];
  let epoch = 0;
  let active: Promise<void> | null = null;
  let disposed = false;

  const flush = (): Promise<void> => {
    if (disposed) return Promise.resolve();
    if (active) return active;
    active = (async () => {
      while (!disposed && pending.length) {
        const batch = pending.slice();
        const batchEpoch = epoch;
        const newest = batch[batch.length - 1]!;
        const merged: ForgeRecoveryDelta = {
          ...newest,
          entries: batch.flatMap((item) => item.entries),
          ...(batch[0]!.startRequest === undefined ? {} : { startRequest: batch[0]!.startRequest }),
          ...(batch[0]!.replaceHistory ? { replaceHistory: true } : {}),
        };
        try {
          await persist(merged);
          if (epoch === batchEpoch) pending.splice(0, batch.length);
        } catch (error) {
          onError(error);
          // A newer boundary may have arrived while the failed transaction
          // was in flight. Retry that accumulated prefix once now; otherwise
          // wait for the next actual player decision, avoiding a busy loop.
          if (epoch === batchEpoch && pending.length === batch.length) break;
        }
      }
    })().finally(() => { active = null; });
    return active;
  };

  return {
    enqueue(delta: ForgeRecoveryDelta) {
      if (disposed) return;
      if (delta.replaceHistory) {
        pending = [delta];
        epoch++;
      } else {
        pending.push(delta);
      }
      void flush();
    },
    flush,
    dispose() {
      disposed = true;
      pending = [];
    },
  };
}

/** A tiny read-only bootstrap probe; never exposes or mutates private game data. */
export async function forgeRecoveryStoredReleaseId(): Promise<string | null> {
  await writes.catch(() => {});
  const db = await openDb();
  return transact<string | null>(db, "readonly", (tx, done) => {
    const request = tx.objectStore(META).get(KEY);
    request.onsuccess = () => {
      const saved = request.result as StoredMeta | undefined;
      done(saved?.version === 1 &&
        typeof saved.gameId === "string" &&
        typeof saved.releaseId === "string" &&
        /^[a-f0-9]{20,64}$/.test(saved.releaseId)
          ? saved.releaseId
          : null);
    };
  });
}

export async function readForgeRecoverySave(releaseId: string): Promise<ForgeRecoverySave | null> {
  await writes.catch(() => {});
  const db = await openDb();
  return transact<ForgeRecoverySave | null>(db, "readonly", (tx, done) => {
    const r = tx.objectStore(META).get(KEY);
    r.onsuccess = () => {
      const saved = r.result as StoredMeta | undefined;
      if (!saved || saved.version !== 1 || saved.releaseId !== releaseId || !validWitness(saved.verification)) {
        done(null);
        return;
      }
      const all = tx.objectStore(ENTRIES).getAll();
      all.onsuccess = () => {
        const entries = all.result as ForgeRecoveryEntry[];
        if (entries.length !== saved.nextSequence - 1 ||
            entries.some((e, i) => e.sequence !== i + 1 || !validWitness(e.verification))) {
          done(null);
          return;
        }
        done({ launch: saved.launch, gameId: saved.gameId, updatedAt: saved.updatedAt,
          replaySnapshot: {
            version: 1, nextSequence: saved.nextSequence,
            journal: { version: 2, startRequest: saved.startRequest, entries },
            prompt: saved.prompt, verification: saved.verification,
          },
        });
      };
    };
  });
}

export async function clearForgeRecoverySave(): Promise<void> {
  const job = writes.catch(() => {}).then(async () =>
    transact<void>(await openDb(), "readwrite", (tx, done) => {
      tx.objectStore(META).delete(KEY);
      tx.objectStore(ENTRIES).clear();
      done(undefined);
    }));
  writes = job;
  return job as Promise<void>;
}

/**
 * Pin replay to the WebImage actually installed in the offline cache.
 * The server may publish a newer manifest while the iPad still runs an
 * older fully cached engine; network-first version selection lost saves.
 */
export async function installedForgeRecoveryReleaseId(): Promise<string | null> {
  if (typeof caches === "undefined") return null;
  const prefix = "manabrew-ipad-offline-";
  try {
    const names = (await caches.keys()).filter((name) => name.startsWith(prefix)).reverse();
    for (const name of names) {
      const version = name.slice(prefix.length);
      if (!/^[a-f0-9]{20,64}$/.test(version)) continue;
      const cache = await caches.open(name);
      const [marker, index, manifestResponse] = await Promise.all([
        cache.match("/offline-ready.json"),
        cache.match("/index.html"),
        cache.match("/offline-assets.json"),
      ]);
      if (!marker || !index || !manifestResponse || (await marker.text()) !== version) continue;
      const manifest: unknown = await manifestResponse.json();
      if (manifest && typeof manifest === "object") {
        const pinned = manifest as { version?: unknown; files?: unknown };
        if (pinned.version === version && Array.isArray(pinned.files)) return version;
      }
    }
  } catch {
    // No verified local WebImage assets: do not guess a version from the network.
  }
  return null;
}

/**
 * A regular Safari tab may run Forge without a fully prepared Home Screen
 * cache. Pin its decisions to the published manifest instead of silently
 * disabling recovery. A ready offline installation always takes precedence.
 */
export async function resolveForgeRecoveryReleaseId(): Promise<string | null> {
  const installed = await installedForgeRecoveryReleaseId();
  if (installed) return installed;
  try {
    const response = await fetch("/offline-assets.json", { cache: "no-store" });
    if (!response.ok) return null;
    const manifest: unknown = await response.json();
    if (!manifest || typeof manifest !== "object") return null;
    const { version, files } = manifest as { version?: unknown; files?: unknown };
    return typeof version === "string" &&
      /^[a-f0-9]{20,64}$/.test(version) &&
      Array.isArray(files) &&
      files.some((file) => file && typeof file === "object" &&
        (file as { url?: unknown }).url === "/index.html")
        ? version
        : null;
  } catch {
    return null;
  }
}

let releasePromise: Promise<string | null> | null = null;
export function forgeRecoveryReleaseId(): Promise<string | null> {
  return releasePromise ??= resolveForgeRecoveryReleaseId();
}