/**
 * Synchronous, reversible encoding for the large Zustand deck snapshot.
 * All old JSON values remain readable. The compact envelope is used only
 * when a write exceeds Web Storage quota or the value was already compact.
 * This intentionally does not touch saved Forge journals (IndexedDB).
 */
const PREFIX = "~manabrew-decks:lzw24:v1~";
const MAX_CODE = 0xffffff;

function encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const dictionary = new Map<number, number>();
  const codes: number[] = [];
  let current = -1;
  let next = 256;
  for (const byte of bytes) {
    if (current < 0) {
      current = byte;
      continue;
    }
    const pair = current * 256 + byte;
    const found = dictionary.get(pair);
    if (found !== undefined) {
      current = found;
    } else {
      codes.push(current);
      if (next > MAX_CODE) throw new Error("Deck snapshot too large for LZW storage");
      dictionary.set(pair, next++);
      current = byte;
    }
  }
  if (current >= 0) codes.push(current);

  const packed = new Uint8Array(codes.length * 3);
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const offset = i * 3;
    packed[offset] = code >>> 16;
    packed[offset + 1] = (code >>> 8) & 255;
    packed[offset + 2] = code & 255;
  }
  const chunks: string[] = [];
  for (let i = 0; i < packed.length; i += 16384) {
    chunks.push(String.fromCharCode(...packed.subarray(i, i + 16384)));
  }
  return PREFIX + btoa(chunks.join(""));
}

function decode(value: string): string {
  let packed: string;
  try {
    packed = atob(value.slice(PREFIX.length));
  } catch {
    throw new Error("Deck snapshot has an invalid compressed envelope");
  }
  if (packed.length % 3 !== 0) throw new Error("Deck snapshot has a truncated compressed envelope");
  const count = packed.length / 3;
  if (!count) return "";
  const parent = new Uint32Array(count + 256);
  const lastByte = new Uint8Array(count + 256);
  const readCode = (i: number) => {
    const offset = i * 3;
    return (
      (packed.charCodeAt(offset) << 16) |
      (packed.charCodeAt(offset + 1) << 8) |
      packed.charCodeAt(offset + 2)
    );
  };
  let previous = readCode(0);
  if (previous > 255) throw new Error("Deck snapshot has an invalid initial code");
  const output: number[] = [previous];
  const stack: number[] = [];
  let next = 256;
  for (let i = 1; i < count; i++) {
    const code = readCode(i);
    if (code > next) throw new Error("Deck snapshot has an invalid LZW code");
    const special = code === next;
    let cursor = special ? previous : code;
    stack.length = 0;
    while (cursor >= 256) {
      if (cursor >= next || stack.length > count) {
        throw new Error("Deck snapshot has a corrupt LZW dictionary");
      }
      stack.push(lastByte[cursor]);
      cursor = parent[cursor];
    }
    stack.push(cursor);
    const first = stack[stack.length - 1];
    for (let j = stack.length - 1; j >= 0; j--) output.push(stack[j]);
    if (special) output.push(first);
    parent[next] = previous;
    lastByte[next] = first;
    next++;
    previous = code;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(output));
}

function isQuotaExceeded(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === "QuotaExceededError" || error.code === 22 || error.code === 1014
    : Boolean(
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "QuotaExceededError",
      );
}

export function readDeckStorage(name: string): string | null {
  const raw = localStorage.getItem(name);
  return raw?.startsWith(PREFIX) ? decode(raw) : raw;
}

/**
 * Web Storage setItem replaces atomically: on quota failure the original value
 * remains intact until a smaller, fully encoded replacement is accepted.
 */
export function writeDeckStorage(name: string, json: string): void {
  const alreadyCompact = localStorage.getItem(name)?.startsWith(PREFIX) ?? false;
  if (!alreadyCompact) {
    try {
      localStorage.setItem(name, json);
      return;
    } catch (error) {
      if (!isQuotaExceeded(error)) throw error;
    }
  }
  const compact = encode(json);
  if (compact.length >= json.length) {
    throw new Error("Deck storage cannot be compacted enough for available space");
  }
  localStorage.setItem(name, compact);
}
