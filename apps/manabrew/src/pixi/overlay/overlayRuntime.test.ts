/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from "vitest";
import { overlayResolution } from "./overlayRuntime";

vi.mock("@/lib/responsive", () => ({
  isCoarsePointer: () => false,
}));

function browser(userAgent: string, platform: string, maxTouchPoints: number, dpr = 2) {
  for (const [key, value] of Object.entries({ userAgent, platform, maxTouchPoints }))
    Object.defineProperty(navigator, key, { configurable: true, value });
  Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: dpr });
}

afterEach(() => vi.unstubAllGlobals());

describe("overlayResolution", () => {
  it("limits iPad WebKit backing surfaces to 1.5x even in desktop Safari mode", () => {
    browser("Mozilla/5.0 Safari/605.1.15", "MacIntel", 5);
    expect(overlayResolution(1180, 820)).toBe(1.5);
  });

  it("preserves desktop crispness and the global pixel cap", () => {
    browser("Mozilla/5.0 Chrome/156", "Linux x86_64", 0);
    expect(overlayResolution(1180, 820)).toBe(2);
    expect(overlayResolution(4000, 3000)).toBeCloseTo(Math.sqrt(8_388_608 / (4000 * 3000)));
  });

  it("never upscales a 1x display", () => {
    browser("Mozilla/5.0 (iPad; CPU OS 26_7 like Mac OS X)", "iPad", 5, 1);
    expect(overlayResolution(1180, 820)).toBe(1);
  });
});
