/**
 * Telling the relay this player is in a game it cannot see. A game against the
 * AI runs entirely on their machine, so the lobby shows them as available and
 * the in-game gauges miss them.
 *
 * Best-effort in the strongest sense: nothing here is awaited by a caller,
 * nothing here throws, and a game must start and finish exactly the same way
 * with no network at all.
 */
import { getPlatform } from "@/platform";
import { useServerStore } from "@/stores/useServerStore";
import { RELAY_FEATURE, type LocalGameKind } from "@/types/server";

let announced: LocalGameKind | null = null;

export function announceLocalGame(kind: LocalGameKind): void {
  announced = kind;
  void push();
}

export function clearLocalGame(): void {
  if (announced === null) return;
  announced = null;
  void push();
}

/** The relay holds this on the session, so a reconnect starts out idle. */
export function resendLocalGame(): void {
  if (announced !== null) void push();
}

async function push(): Promise<void> {
  try {
    const server = getPlatform().server;
    if (!server) return;
    // Presence is an optional notification, not permission to claim a seat.
    // On the next independently authenticated connection, resendLocalGame()
    // announces the game if it is still running.
    if (!useServerStore.getState().connected) return;
    if (!useServerStore.getState().hasRelayFeature(RELAY_FEATURE.LocalGame)) return;
    await server.setLocalGame(announced);
  } catch {
    // Presence is never worth failing, delaying or interrupting a game for.
  }
}
