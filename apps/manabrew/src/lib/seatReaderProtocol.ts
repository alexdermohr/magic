/** Out-of-band messages from the SAB seat reader, never game protocol JSON. */
export const SEAT_READER_HEARTBEAT = "__manabrew_seat_reader_alive__";
export const SEAT_READER_STALE_MS = 7_000;

export function seatReaderStalled(lastSignalAt: number | undefined, now: number): boolean {
  return lastSignalAt === undefined || now - lastSignalAt > SEAT_READER_STALE_MS;
}
