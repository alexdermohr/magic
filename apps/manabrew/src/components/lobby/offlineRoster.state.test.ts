import { describe, expect, it } from "vitest";
import {
  createOfflineRoster,
  FIRST_BOT_SEAT_ID,
  offlineRosterReducer,
  PLAYER_SEAT_ID,
} from "./offlineRoster.state";
import type { SelectedDeck } from "./deckSelection.types";

function deck(name: string, formatId: string): SelectedDeck {
  return {
    id: "local:" + name,
    sourceId: name,
    name,
    source: "local",
    formatId,
    sourceDeck: { name, format: formatId, cards: [], sideboard: [] } as SelectedDeck["sourceDeck"],
  };
}

describe("offlineRosterReducer", () => {
  it("replaces an untouched auto-suggested opponent when a late player deck changes format", () => {
    const suggested = offlineRosterReducer(createOfflineRoster(null), {
      type: "suggest",
      deck: deck("Standard preset", "standard"),
    });
    expect(suggested.seats[1].touched).toBe(false);

    const updated = offlineRosterReducer(suggested, {
      type: "assign",
      seatId: PLAYER_SEAT_ID,
      deck: deck("Anowon", "commander"),
    });
    expect(updated.seats[0].deck?.name).toBe("Anowon");
    expect(updated.seats[1].deck).toBeNull();
    expect(updated.seats[1].touched).toBe(false);

    const refreshed = offlineRosterReducer(updated, {
      type: "suggest",
      deck: deck("Gahiji", "commander"),
    });
    expect(refreshed.seats[1].deck?.name).toBe("Gahiji");
  });

  it("retains an untouched suggestion when both decks use the same format", () => {
    const first = offlineRosterReducer(createOfflineRoster(null), {
      type: "suggest",
      deck: deck("Gahiji", "commander"),
    });
    const after = offlineRosterReducer(first, {
      type: "assign",
      seatId: PLAYER_SEAT_ID,
      deck: deck("Anowon", "commander"),
    });
    expect(after.seats[1].deck?.name).toBe("Gahiji");
  });

  it("does not change a manually selected bot deck when a player deck changes format", () => {
    const manuallySet = offlineRosterReducer(createOfflineRoster(null), {
      type: "assign",
      seatId: FIRST_BOT_SEAT_ID,
      deck: deck("Chosen by player", "standard"),
    });
    const after = offlineRosterReducer(manuallySet, {
      type: "assign",
      seatId: PLAYER_SEAT_ID,
      deck: deck("Anowon", "commander"),
    });
    expect(after.seats[1].deck?.name).toBe("Chosen by player");
    expect(after.seats[1].touched).toBe(true);
  });
});
