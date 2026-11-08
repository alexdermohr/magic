import { describe, expect, it } from "vitest";
import { cardWorkerCount, isAppleMobileDevice } from "./cardWorkerBudget";

const device = {
  hardwareConcurrency: 8,
  userAgent: "Mozilla/5.0",
  platform: "Linux",
  maxTouchPoints: 0,
};

describe("Apple mobile memory budget", () => {
  it("covers iPadOS with native and desktop Safari user agents", () => {
    expect(isAppleMobileDevice({ ...device, userAgent: "Mozilla/5.0 (iPad; CPU OS 26_7)" })).toBe(
      true,
    );
    expect(isAppleMobileDevice({ ...device, platform: "MacIntel", maxTouchPoints: 5 })).toBe(true);
    expect(isAppleMobileDevice(device)).toBe(false);
    expect(isAppleMobileDevice(undefined)).toBe(false);
  });
});

describe("cardWorkerCount", () => {
  it("limits native iPad Safari to one card renderer", () => {
    expect(
      cardWorkerCount({ ...device, userAgent: "Mozilla/5.0 (iPad; CPU OS 26_7 like Mac OS X)" }),
    ).toBe(1);
  });

  it("detects desktop-class user agents on touch-capable iPads", () => {
    expect(cardWorkerCount({ ...device, platform: "MacIntel", maxTouchPoints: 5 })).toBe(1);
  });

  it("retains normal desktop concurrency without taking game-engine workers away", () => {
    expect(cardWorkerCount(device)).toBe(3);
    expect(cardWorkerCount({ ...device, hardwareConcurrency: 2 })).toBe(1);
  });
});
