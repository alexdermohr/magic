import { describe, expect, it } from "vitest";
import { SEAT_READER_STALE_MS, seatReaderStalled } from "./seatReaderProtocol";
import {
  acknowledgeSeatMessage,
  createSeat,
  SAB_SIZE,
  SIGNAL_IDLE,
  SIGNAL_PROMPT_READY,
  SIGNAL_PROMPT_ACKNOWLEDGED,
} from "@forge-wasm/seat.js";

describe("Forge seat delivery across worker suspension", () => {
  it("keeps a frame pending until the main thread acknowledges its delivery", () => {
    const seat = createSeat(new SharedArrayBuffer(SAB_SIZE));
    Atomics.store(seat.signal, 0, SIGNAL_PROMPT_READY);
    expect(Atomics.load(seat.signal, 0)).toBe(SIGNAL_PROMPT_READY);
    expect(acknowledgeSeatMessage(seat)).toBe(true);
    expect(Atomics.load(seat.signal, 0)).toBe(SIGNAL_PROMPT_ACKNOWLEDGED);
    expect(acknowledgeSeatMessage(seat)).toBe(false);
  });
  it("cannot falsely acknowledge an idle seat", () => {
    const seat = createSeat(new SharedArrayBuffer(SAB_SIZE));
    expect(Atomics.load(seat.signal, 0)).toBe(SIGNAL_IDLE);
    expect(acknowledgeSeatMessage(seat)).toBe(false);
    expect(Atomics.load(seat.signal, 0)).toBe(SIGNAL_IDLE);
  });
  it("allows suspended workers to resume before declaring heartbeat loss", () => {
    expect(seatReaderStalled(100, 100 + SEAT_READER_STALE_MS)).toBe(false);
    expect(seatReaderStalled(100, 100 + SEAT_READER_STALE_MS + 1)).toBe(true);
    expect(seatReaderStalled(undefined, 100)).toBe(true);
  });
});
