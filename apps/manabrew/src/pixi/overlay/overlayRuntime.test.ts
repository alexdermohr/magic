/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from "vitest";
import type { Application } from "pixi.js";
import { OverlayRenderScheduler, overlayResolution } from "./overlayRuntime";

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

function schedulerHarness() {
  const canvas = document.createElement("canvas");
  const render = vi.fn();
  const update = vi.fn(() => false);
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  let hidden = false;
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = ++frameId;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frames.delete(id);
  });
  const app = { canvas, render } as unknown as Application;
  const scheduler = new OverlayRenderScheduler(app, update);
  return {
    canvas,
    scheduler,
    render,
    update,
    pending: () => frames.size,
    flush(timestamp = 16) {
      const callbacks = [...frames.values()];
      frames.clear();
      for (const callback of callbacks) callback(timestamp);
    },
    setHidden(value: boolean) {
      hidden = value;
      document.dispatchEvent(new Event("visibilitychange"));
    },
  };
}

describe("OverlayRenderScheduler after Safari WebGL context loss", () => {
  afterEach(() => {
    Reflect.deleteProperty(document, "hidden");
  });

  it("defers rendering during context loss and redraws a static prompt after restoration", () => {
    const h = schedulerHarness();
    h.scheduler.request();
    expect(h.pending()).toBe(1);

    const lost = new Event("webglcontextlost", { cancelable: true });
    h.canvas.dispatchEvent(lost);
    expect(lost.defaultPrevented).toBe(true);
    expect(h.pending()).toBe(0);

    h.scheduler.request();
    expect(h.pending()).toBe(0);
    expect(h.render).not.toHaveBeenCalled();

    h.canvas.dispatchEvent(new Event("webglcontextrestored"));
    expect(h.pending()).toBe(1);
    h.flush();
    expect(h.update).toHaveBeenCalledOnce();
    expect(h.render).toHaveBeenCalledOnce();

    h.scheduler.dispose();
  });

  it("redraws on foreground return when WebGL was restored while hidden", () => {
    const h = schedulerHarness();
    h.setHidden(true);
    h.canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    h.canvas.dispatchEvent(new Event("webglcontextrestored"));
    expect(h.pending()).toBe(0);
    h.setHidden(false);
    expect(h.pending()).toBe(1);
    h.flush();
    expect(h.render).toHaveBeenCalledOnce();
    h.scheduler.dispose();
  });

  it("removes context listeners on teardown, so a closed game cannot redraw", () => {
    const h = schedulerHarness();
    h.scheduler.dispose();
    h.canvas.dispatchEvent(new Event("webglcontextrestored"));
    h.setHidden(false);
    expect(h.pending()).toBe(0);
    expect(h.render).not.toHaveBeenCalled();
  });
});
