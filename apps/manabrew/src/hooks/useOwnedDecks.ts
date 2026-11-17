import { useMemo } from "react";
import { getDeckFingerprint } from "@/lib/decks";
import { useAccountDecks } from "@/hooks/useAccountDecks";
import { useDeckStore } from "@/stores/useDeckStore";
import type { SavedDeck } from "@/stores/useDeckStore";

/**
 * Identical local and account copies have different storage IDs but represent
 * the same playable deck. Keep only one entry in selectors and shelves; never
 * remove a saved deck or merge distinct printings/locally edited variants.
 * The local copy wins while it is present, so offline personal decks remain
 * playable even when the account endpoint is unavailable.
 */
export function uniqueOwnedDecks(decks: SavedDeck[]): SavedDeck[] {
  const seen = new Set<string>();
  return decks.filter((saved) => {
    const identity = getDeckFingerprint(saved.deck);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

export function useOwnedDecks(): SavedDeck[] {
  const savedDecks = useDeckStore((state) => state.savedDecks);
  const { details } = useAccountDecks();

  return useMemo(() => {
    const accountSavedDecks: SavedDeck[] = Object.values(details).map((detail) => ({
      id: `account:${detail.id}`,
      deck: detail.deck as SavedDeck["deck"],
      savedAt: new Date(detail.updatedAt).getTime(),
      accountDeckId: detail.id,
      accountVersionNo: detail.currentVersionNo,
    }));
    return [
      ...savedDecks.filter(
        (savedDeck) => !savedDeck.accountDeckId || details[savedDeck.accountDeckId] === undefined,
      ),
      ...accountSavedDecks,
    ];
  }, [details, savedDecks]);
}
