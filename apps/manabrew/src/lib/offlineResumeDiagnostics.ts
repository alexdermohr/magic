/**
 * Small, local-only event history for Safari/PWA lifecycle failures.
 * No deck names, card identities, prompts, secrets or server requests.
 * The persistent active flag distinguishes a frozen document from a page reload.
 */
const KEY = "manabrew.offlineResumeDiagnostics.v1";
const CAPACITY = 32;
const instanceId =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());

export type OfflineResumeEvent =
  | "document_start"
  | "document_restarted_with_active_game"
  | "offline_game_started"
  | "offline_game_ended"
  | "app_hidden"
  | "app_visible"
  | "pagehide"
  | "pageshow"
  | "engine_worker_error"
  | "engine_forced_end"
  | "seat_reader_restarted";

interface LifecycleEntry {
  at: string;
  event: OfflineResumeEvent;
  instanceId: string;
  reason?: string;
}

interface LifecycleLog {
  version: 1;
  activeOfflineGame: boolean;
  events: LifecycleEntry[];
}

const SAFE_REASONS = new Set([
  "worker_error",
  "message_error",
  "no_heartbeat_after_foreground",
  "bfcache",
  "navigation",
  "unknown",
]);

function read(): LifecycleLog | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const candidate = value as Partial<LifecycleLog>;
    if (
      candidate.version !== 1 ||
      typeof candidate.activeOfflineGame !== "boolean" ||
      !Array.isArray(candidate.events)
    )
      return null;
    return {
      version: 1,
      activeOfflineGame: candidate.activeOfflineGame,
      events: candidate.events.slice(-CAPACITY),
    };
  } catch {
    return null;
  }
}

export function noteOfflineResumeEvent(
  event: OfflineResumeEvent,
  active?: boolean,
  reason?: string,
): void {
  if (typeof localStorage === "undefined") return;
  try {
    const previous = read();
    const entry: LifecycleEntry = {
      at: new Date().toISOString(),
      event,
      instanceId,
      ...(reason && SAFE_REASONS.has(reason) ? { reason } : {}),
    };
    const log: LifecycleLog = {
      version: 1,
      activeOfflineGame: active ?? previous?.activeOfflineGame ?? false,
      events: [...(previous?.events ?? []), entry].slice(-CAPACITY),
    };
    localStorage.setItem(KEY, JSON.stringify(log));
  } catch {
    // Diagnostics must never affect the running game, even with storage blocked.
  }
}

export function beginOfflineResumeDiagnostics(): () => void {
  const interrupted = read()?.activeOfflineGame ?? false;
  noteOfflineResumeEvent(
    interrupted ? "document_restarted_with_active_game" : "document_start",
    false,
  );

  const visibility = () => noteOfflineResumeEvent(document.hidden ? "app_hidden" : "app_visible");
  const pagehide = (event: PageTransitionEvent) =>
    noteOfflineResumeEvent("pagehide", undefined, event.persisted ? "bfcache" : "navigation");
  const pageshow = (event: PageTransitionEvent) =>
    noteOfflineResumeEvent("pageshow", undefined, event.persisted ? "bfcache" : "navigation");
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pagehide", pagehide);
  window.addEventListener("pageshow", pageshow);
  return () => {
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pagehide", pagehide);
    window.removeEventListener("pageshow", pageshow);
  };
}

export function offlineResumeDiagnosticReport(): string {
  return JSON.stringify(
    {
      ...(read() ?? { version: 1, activeOfflineGame: false, events: [] }),
      generatedAt: new Date().toISOString(),
      scope: "local-lifecycle-only",
    },
    null,
    2,
  );
}
