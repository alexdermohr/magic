import { describe, expect, it } from "vitest";
import {
  cardMemoryBudget,
  cardRenderPixelDensity,
  cardWorkerCount,
  isAppleMobileDevice,
} from "./cardWorkerBudget";
import { selectCardRenderTier } from "./cardRenderTypes";

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

describe("cardMemoryBudget", () => {
  it("caps finished rasters at 64 MiB and canvas DPR at 1.5 on native and desktop-style iPads", () => {
    for (const mobile of [
      { ...device, userAgent: "Mozilla/5.0 (iPad; CPU OS 26_7 like Mac OS X)" },
      { ...device, platform: "MacIntel", maxTouchPoints: 5 },
    ]) {
      expect(cardMemoryBudget(mobile)).toEqual({
        finishedCards: 256,
        finishedBytes: 64 * 1024 * 1024,
        rendererResolutionCap: 1.5,
      });
    }
  });

  it("retains the 256 MiB raster budget and full DPI on non-Apple desktops", () => {
    const normal = {
      finishedCards: 1024,
      finishedBytes: 256 * 1024 * 1024,
      rendererResolutionCap: 2,
    };
    expect(cardMemoryBudget(device)).toEqual(normal);
    expect(cardMemoryBudget(undefined)).toEqual(normal);
  });
});

describe("cardRenderPixelDensity", () => {
  it("uses the same 1.5x iPad density for individual cards as the game board", () => {
    const devices = [
      { ...device, userAgent: "Mozilla/5.0 (iPad; CPU OS 26_7 like Mac OS X)" },
      { ...device, platform: "MacIntel", maxTouchPoints: 5 },
    ];
    for (const mobile of devices) {
      const density = cardRenderPixelDensity(mobile, 2);
      expect(density).toBe(1.5);
      // At this rendered card size, a 2x texture needlessly picks the
      // native 488px face; 1.5x fits into the 244px table face.
      expect(selectCardRenderTier(150, 210, density)).toBe("table");
    }
  });

  it("keeps high-DPI desktop card faces and never upscales low-DPI displays", () => {
    expect(cardRenderPixelDensity(device, 2)).toBe(2);
    expect(selectCardRenderTier(150, 210, cardRenderPixelDensity(device, 2))).toBe("native");
    expect(cardRenderPixelDensity(device, 3)).toBe(2);
    expect(cardRenderPixelDensity({ ...device, platform: "MacIntel", maxTouchPoints: 5 }, 1)).toBe(
      1,
    );
    expect(cardRenderPixelDensity(undefined, 2)).toBe(2);
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
