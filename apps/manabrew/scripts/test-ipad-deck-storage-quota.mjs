// node --experimental-strip-types scripts/test-ipad-deck-storage-quota.mjs [personal-decks.json]
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readDeckStorage, writeDeckStorage } from "../src/lib/deckStorageCodec.ts";

const path = process.argv[2] ?? "dist/personal-decks.json";
const personal = JSON.parse(readFileSync(path, "utf8"));
assert.equal(personal.decks.length, 44, "Exercise the published full collection");
const decks = personal.decks.map(({ sourceHash, slug, ...entry }) => entry);
const serial = JSON.stringify({ state: { savedDecks: decks }, version: 8 });
assert(serial.length * 2 > 5 * 1024 * 1024, "Fixture must exceed Safari-like quota");

const limit = 5 * 1024 * 1024;
const memory = new Map([["other-user-settings", "x".repeat(32000)]]);
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  removeItem: (key) => memory.delete(key),
  setItem: (key, value) => {
    const other = [...memory.entries()]
      .filter(([name]) => name !== key)
      .reduce((bytes, [name, raw]) => bytes + (name.length + raw.length) * 2, 0);
    if (other + (key.length + value.length) * 2 > limit) {
      throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    }
    memory.set(key, value);
  },
};

assert.throws(() => localStorage.setItem("manabrew-deck-storage", serial), {
  name: "QuotaExceededError",
});
const old = JSON.stringify({ state: { savedDecks: [decks[0]] }, version: 8 });
localStorage.setItem("manabrew-deck-storage", old);
assert.equal(
  readDeckStorage("manabrew-deck-storage"),
  old,
  "Uncompressed legacy snapshots stay readable",
);

writeDeckStorage("manabrew-deck-storage", serial);
const compact = localStorage.getItem("manabrew-deck-storage");
assert(compact.startsWith("~manabrew-decks:lzw24:v1~"));
assert(compact.length * 2 < limit / 2, "Enough headroom remains for settings and future edits");
assert.equal(
  readDeckStorage("manabrew-deck-storage"),
  serial,
  "All cards, printings, cosmetics survive exactly",
);

const customized = JSON.stringify({
  state: {
    savedDecks: [
      ...decks,
      { id: "local:never-drop", deck: { name: "Änderung & 猫 🐈", cards: [] } },
    ],
  },
  version: 8,
});
writeDeckStorage("manabrew-deck-storage", customized);
assert.equal(
  readDeckStorage("manabrew-deck-storage"),
  customized,
  "Future editor saves remain lossless",
);
const previous = localStorage.getItem("manabrew-deck-storage");
memory.set("another", "y".repeat(Math.floor(limit / 2)));
assert.throws(() => writeDeckStorage("manabrew-deck-storage", customized));
assert.equal(
  localStorage.getItem("manabrew-deck-storage"),
  previous,
  "Failed writes do not destroy stored decks",
);
memory.delete("another");

memory.set("manabrew-deck-storage", "~manabrew-decks:lzw24:v1~broken");
assert.throws(() => readDeckStorage("manabrew-deck-storage"), /envelope|code/i);
assert.equal(
  localStorage.getItem("manabrew-deck-storage"),
  "~manabrew-decks:lzw24:v1~broken",
  "A corrupt snapshot is never silently overwritten",
);

console.log(
  "IPAD_DECK_QUOTA_PASS",
  JSON.stringify({
    publishedDecks: decks.length,
    rawUtf16Bytes: serial.length * 2,
    compactUtf16Bytes: compact.length * 2,
    legacyReadable: true,
    localEditsPreserved: true,
    failedWriteAtomic: true,
    corruptReadProtected: true,
  }),
);
