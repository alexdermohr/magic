import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { prefetchCards } from "@/stores/useScryfallStore";
import { asDeckCard, asGameDeckCard, getDeckCardPool } from "@/lib/decks";
import type { ClientGameView } from "@/stores/gameStore.types";
import type { Deck, DeckCard } from "@/protocol/deck";
import { renderCard } from "@/lib/cardRenderer";
import { releaseCardRaster } from "@/lib/cardRenderTypes";
import {
  cancelDeckFaceWarmup,
  indexDeckFaces,
  libraryTopRendered,
  manabrewRenderVariants,
  warmDeckFaces,
} from "@/lib/cardFaceWarmup";
import { isAppleMobileDevice } from "@/lib/cardWorkerBudget";
import { isForgeWasmActive } from "@/lib/forgeWasm";
import { usePreferencesStore } from "@/stores/usePreferencesStore";
import { gameCardFaceIndex } from "@/lib/gameCard";

export type GamePrefetchMode = "visible" | "full";

const GAME_LOADING_CAP_MS = 10_000;
const LIBRARY_TOP_ARRIVAL_MS = 3_000;

function cardsToPrefetchImmediately(
  view: ClientGameView,
  gameDecks: Record<string, Deck>,
): DeckCard[] {
  const cards: DeckCard[] = [];
  const visible = view.players
    .flatMap((p) => [...p.hand, ...p.commandZone])
    .filter((card) => !card.isFaceDown && card.identity.name !== "Hidden Card");
  for (const gc of visible) {
    const deck = gameDecks[gc.ownerId];
    if (deck) cards.push(asDeckCard(deck, gc));
  }
  for (const deck of Object.values(gameDecks)) {
    cards.push(...deck.cards.slice(0, 5));
  }
  return cards;
}
function cardsToPrefetchNext(view: ClientGameView, gameDecks: Record<string, Deck>): DeckCard[] {
  const cards: DeckCard[] = [];
  const visible = [
    ...view.battlefield,
    ...view.players.flatMap((player) => [
      ...player.graveyard.slice(-4),
      ...player.exile.slice(-4),
      ...player.library.slice(0, 2),
    ]),
  ].filter((card) => !card.isFaceDown && card.identity.name !== "Hidden Card");
  for (const card of visible) {
    const deck = gameDecks[card.ownerId];
    if (deck) cards.push(asDeckCard(deck, card));
  }
  return cards;
}

function scheduleIdle(work: () => void): () => void {
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
    const id = idleWindow.requestIdleCallback(work, { timeout: 3000 });
    return () => idleWindow.cancelIdleCallback?.(id);
  }
  const id = globalThis.setTimeout(work, 800);
  return () => globalThis.clearTimeout(id);
}

async function prefetchAllCards(visibleCards: DeckCard[], deckCards: DeckCard[]): Promise<void> {
  const printedCards = [...visibleCards, ...deckCards];
  const total = printedCards.length + deckCards.length;
  let loaded = 0;
  useGameStore.setState({ cardPrefetchProgress: { loaded, total } });
  const onSettled = () => {
    loaded += 1;
    useGameStore.setState({ cardPrefetchProgress: { loaded, total } });
  };
  await prefetchCards(printedCards, "full", onSettled);
  await prefetchCards(deckCards, "art", onSettled);
}

async function renderOpeningCards(): Promise<void> {
  const { gameView, gameDecks } = useGameStore.getState();
  const faces = (gameView?.players ?? [])
    .flatMap((player) => [...player.hand, ...player.commandZone])
    .filter(
      (card) => !card.isFaceDown && card.identity.name && card.identity.name !== "Hidden Card",
    )
    .flatMap((card) => {
      const deckCard = asGameDeckCard(gameDecks, card);
      const faceIndex = gameCardFaceIndex(card);
      const indices: (0 | 1)[] = deckCard.backFace
        ? [faceIndex, faceIndex === 0 ? 1 : 0]
        : [faceIndex];
      return indices.map((face) => ({ card, deckCard, faceIndex: face }));
    });
  const variants = manabrewRenderVariants();
  if (variants.length * faces.length === 0) return;
  useGameStore.setState({ isRenderingCards: true });
  await Promise.allSettled(
    variants.flatMap((options) =>
      faces.map((request) => renderCard(request, undefined, options).then(releaseCardRaster)),
    ),
  );
}

function renderOpeningHand(since: number): Promise<unknown> | undefined {
  const { gameView, myPlayerSlot, isMultiplayer, isHost } = useGameStore.getState();
  const me = gameView?.players.find((player) => player.id === myPlayerSlot);
  if (!isForgeWasmActive() || (isMultiplayer && !isHost) || !me || me.hand.length > 0) return;
  return libraryTopRendered(since, LIBRARY_TOP_ARRIVAL_MS);
}

function renderDeckPools(): void {
  const { gameDecks, myPlayerSlot } = useGameStore.getState();
  const decks = Object.entries(gameDecks);
  void warmDeckFaces(
    decks.filter(([slot]) => slot === myPlayerSlot).map(([, deck]) => deck),
    decks.filter(([slot]) => slot !== myPlayerSlot).map(([, deck]) => deck),
  );
}

export function useGamePrefetch(mode: GamePrefetchMode): void {
  const hasGameView = useGameStore((s) => s.gameView !== null);
  const isPrefetchingCards = useGameStore((s) => s.isPrefetchingCards);
  const startedRef = useRef(false);
  const loadingSinceRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelDeckFaceWarmup();
    };
  }, []);

  useEffect(() => {
    if (!isPrefetchingCards) {
      startedRef.current = false;
      loadingSinceRef.current = 0;
      return;
    }
    loadingSinceRef.current ||= performance.now();
    if (!hasGameView || startedRef.current) return;
    const gameView = useGameStore.getState().gameView;
    if (!gameView) return;
    startedRef.current = true;

    const decks = useGameStore.getState().gameDecks;
    const ownDecks = Object.entries(decks)
      .filter(([slot]) => slot === useGameStore.getState().myPlayerSlot)
      .map(([, deck]) => deck);
    const otherDecks = Object.entries(decks)
      .filter(([slot]) => slot !== useGameStore.getState().myPlayerSlot)
      .map(([, deck]) => deck);
    // Library-top events can precede the first completed preload.
    indexDeckFaces(ownDecks, otherDecks);
    const appleMobile = isAppleMobileDevice(navigator);
    const likelyCards = cardsToPrefetchNext(gameView, decks);
    let cancelled = false;
    let cancelIdle = () => {};
    const deckCards = Object.values(decks).flatMap(getDeckCardPool);
    const visibleCards = cardsToPrefetchImmediately(gameView, decks);
    const waitForDeck =
      !appleMobile &&
      navigator.onLine &&
      mode === "full" &&
      usePreferencesStore.getState().battlefieldCardStyle !== "frame";
    const ready = Promise.all([
      prefetchCards(visibleCards).then(renderOpeningCards),
      waitForDeck ? prefetchAllCards(visibleCards, deckCards) : undefined,
      renderOpeningHand(loadingSinceRef.current),
    ]);
    const cap = new Promise<void>((resolve) => setTimeout(resolve, GAME_LOADING_CAP_MS));
    void Promise.race([ready, cap]).finally(() => {
      if (!mountedRef.current) return;
      useGameStore.setState({ isPrefetchingCards: false });
      // Full-deck image + generated-face warm-up can evict Forge's WASM on iPad.
      // On iOS only visible cards and the local library top are rendered on demand.
      if (!appleMobile) renderDeckPools();
    });
    if (waitForDeck) return;
    void prefetchCards(likelyCards).then(() => {
      if (cancelled || appleMobile) return;
      cancelIdle = scheduleIdle(() => {
        void prefetchCards(deckCards).then(() => {
          if (cancelled) return;
          cancelIdle = scheduleIdle(() => void prefetchCards(deckCards, "art"));
        });
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [hasGameView, isPrefetchingCards, mode]);
}
