import { describe, expect, it } from "vitest";
import { uniqueOwnedDecks } from "@/hooks/useOwnedDecks";
import type { SavedDeck } from "@/stores/useDeckStore";

function saved(id: string, name: string, mainCard: string): SavedDeck {
  return {
    id,
    savedAt: 0,
    deck: {
      name,
      format: "commander",
      cards: [{ identity: { id: id + ":1", name: mainCard, setCode: "test", cardNumber: "1" } }],
      commanders: [
        {
          identity: {
            id: id + ":cmd",
            name: name.includes("Sisay") ? "Sisay, Weatherlight Captain" : name,
          },
        },
      ],
      sideboard: [],
    },
  } as unknown as SavedDeck;
}

describe("uniqueOwnedDecks", () => {
  it("shows 44 personal decks only once when all 44 also exist in the account", () => {
    const locals = Array.from({ length: 44 }, (_, index) =>
      saved(
        `github:alexdermohr/magic:deck-${index}`,
        index > 41 ? "Sisay, Weatherlight Captain" : `Commander ${index}`,
        `Different card ${index}`,
      ),
    );
    const accounts = locals.map((local, index) => ({
      ...local,
      id: `account:${index}`,
      accountDeckId: String(index),
      deck: {
        ...local.deck,
        cards: local.deck.cards.map((card) => ({
          ...card,
          identity: { ...card.identity, id: `account-${index}-card` },
        })),
      },
    }));
    const originalIds = [...locals, ...accounts].map((entry) => entry.id);
    const visible = uniqueOwnedDecks([...locals, ...accounts]);
    expect(visible).toHaveLength(44);
    expect(visible.map((entry) => entry.id)).toEqual(locals.map((entry) => entry.id));
    expect([...locals, ...accounts].map((entry) => entry.id)).toEqual(originalIds);
    // The two different Sisay lists have the same commander name, not the same deck.
    expect(
      visible.filter((entry) => entry.deck.name === "Sisay, Weatherlight Captain"),
    ).toHaveLength(2);
  });

  it("retains an intentionally changed printing or card list as a separate variant", () => {
    const local = saved("github:magic:anowon", "Anowon, the Ruin Thief", "Counterspell");
    const account = saved("account:anowon", "Anowon, the Ruin Thief", "Counterspell");
    expect(uniqueOwnedDecks([local, account])).toHaveLength(1);
    const printing = structuredClone(account);
    printing.deck.cards[0].identity.setCode = "special";
    expect(uniqueOwnedDecks([local, printing])).toHaveLength(2);
    const changedCard = structuredClone(account);
    changedCard.deck.cards[0].identity.name = "Negate";
    expect(uniqueOwnedDecks([local, changedCard])).toHaveLength(2);
  });

  it("never persists or deletes data when reducing duplicate display entries", () => {
    const entries = [
      saved("local:a", "Gahiji, Honored One", "Forest"),
      saved("account:a", "Gahiji, Honored One", "Forest"),
    ];
    const visible = uniqueOwnedDecks(entries);
    expect(entries).toHaveLength(2);
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("local:a");
  });
});
