import { describe, expect, it } from "vitest";
import { RenderGroup } from "pixi.js";
import { patchRenderGroupOnRender } from "./pixiPatches";

describe("Pixi RenderGroup onRender patch", () => {
  it("deduplicates callbacks and preserves live entries when removing an unknown callback", () => {
    patchRenderGroupOnRender();
    const group = new RenderGroup();
    const calls: string[] = [];
    const first = { _onRender: () => calls.push("first") };
    const second = { _onRender: () => calls.push("second") };
    const entry = (value: object) => value as Parameters<RenderGroup["addOnRender"]>[0];
    const entries = () =>
      (group as unknown as { _onRenderContainers: unknown[] })._onRenderContainers;

    group.addOnRender(entry(first));
    group.addOnRender(entry(first));
    group.addOnRender(entry(second));
    expect(entries()).toEqual([first, second]);
    group.removeOnRender(entry({ _onRender() {} }));
    expect(entries()).toEqual([first, second]);

    group.runOnRender(undefined as unknown as Parameters<RenderGroup["runOnRender"]>[0]);
    expect(calls).toEqual(["first", "second"]);
  });

  it("does not throw on cleared callback and removes stale entries without losing live ones", () => {
    patchRenderGroupOnRender();
    const group = new RenderGroup();
    let calledWith: unknown;
    const first: { _onRender: ((renderer: unknown) => void) | null } = {
      _onRender: () => {},
    };
    const second = {
      _onRender: function (this: unknown, _renderer: unknown) {
        calledWith = this;
      },
    };
    const entry = (value: object) => value as Parameters<RenderGroup["addOnRender"]>[0];
    const entries = () =>
      (group as unknown as { _onRenderContainers: unknown[] })._onRenderContainers;

    group.addOnRender(entry(first));
    group.addOnRender(entry(second));
    first._onRender = null;
    expect(() =>
      group.runOnRender(undefined as unknown as Parameters<RenderGroup["runOnRender"]>[0]),
    ).not.toThrow();
    expect(entries()).toEqual([second]);
    expect(calledWith).toBe(second);

    group.removeOnRender(entry(first));
    expect(entries()).toEqual([second]);
    group.removeOnRender(entry(second));
    expect(entries()).toEqual([]);
  });
});
