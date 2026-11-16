import { describe, expect, it } from "vitest";
import { isBotSeat } from "./game.utils";

describe("isBotSeat", () => {
  it("keeps multiplayer human opponents distinct from bots even when isHuman marks only the viewer", () => {
    const players = [
      { username: "Alice", is_bot: false },
      { username: "Brewy bot", is_bot: true },
    ];
    expect(isBotSeat({ name: "Alice", isHuman: false }, players)).toBe(false);
    expect(isBotSeat({ name: "Brewy bot", isHuman: false }, players)).toBe(true);
  });

  it("falls back to AI without a relay roster, but never misclassifies the local human", () => {
    expect(isBotSeat({ name: "Forge bot", isHuman: false }, undefined)).toBe(true);
    expect(isBotSeat({ name: "You", isHuman: true }, undefined)).toBe(false);
  });
});
