import { describe, expect, it } from "vitest";
import { resumeReconnectDeadline } from "./reconnectDeadline";

describe("resumeReconnectDeadline", () => {
  it("excludes the time iPadOS suspended the page from an active reconnect window", () => {
    expect(resumeReconnectDeadline(120_000, 20_000, 620_000)).toBe(720_000);
  });

  it("does not restart the timer when there is no active deadline", () => {
    expect(resumeReconnectDeadline(null, 20_000, 620_000)).toBeNull();
  });

  it("never shortens the deadline when the wall clock moves backwards", () => {
    expect(resumeReconnectDeadline(120_000, 50_000, 40_000)).toBe(120_000);
  });
});
