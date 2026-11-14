/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
  beginOfflineResumeDiagnostics,
  noteOfflineResumeEvent,
  offlineResumeDiagnosticReport,
} from "./offlineResumeDiagnostics";

describe("offline iPad lifecycle log", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("records when a new document replaces an in-progress game", () => {
    noteOfflineResumeEvent("offline_game_started", true);
    const stop = beginOfflineResumeDiagnostics();
    try {
      const data = JSON.parse(offlineResumeDiagnosticReport());
      expect(data.activeOfflineGame).toBe(false);
      expect(data.events.map((e: { event: string }) => e.event)).toEqual([
        "offline_game_started",
        "document_restarted_with_active_game",
      ]);
    } finally {
      stop();
    }
  });

  it("does not confuse another tab's active game with a document restart", () => {
    window.localStorage.setItem(
      "manabrew.offlineResumeDiagnostics.v1",
      JSON.stringify({ version: 1, activeOfflineGame: true, events: [] }),
    );
    const stop = beginOfflineResumeDiagnostics();
    try {
      const data = JSON.parse(offlineResumeDiagnosticReport());
      expect(data.activeOfflineGame).toBe(false);
      expect(data.events.at(-1).event).toBe("document_start");
    } finally {
      stop();
    }
  });

  it("keeps this tab's active game after another tab overwrites the shared log", () => {
    noteOfflineResumeEvent("offline_game_started", true);
    window.localStorage.setItem(
      "manabrew.offlineResumeDiagnostics.v1",
      JSON.stringify({ version: 1, activeOfflineGame: false, events: [] }),
    );
    expect(JSON.parse(offlineResumeDiagnosticReport()).activeOfflineGame).toBe(true);
    const stop = beginOfflineResumeDiagnostics();
    try {
      const data = JSON.parse(offlineResumeDiagnosticReport());
      expect(data.activeOfflineGame).toBe(false);
      expect(data.events.at(-1).event).toBe("document_restarted_with_active_game");
    } finally {
      stop();
    }
  });

  it("separates BFCache from navigation and redacts untrusted errors", () => {
    const stop = beginOfflineResumeDiagnostics();
    try {
      window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
      noteOfflineResumeEvent("engine_worker_error", undefined, "private user name");
      const data = JSON.parse(offlineResumeDiagnosticReport());
      expect(data.events.find((e: { event: string }) => e.event === "pagehide").reason).toBe(
        "bfcache",
      );
      expect(JSON.stringify(data)).not.toContain("private user name");
    } finally {
      stop();
    }
  });

  it("retains at most the latest 32 lifecycle events", () => {
    for (let i = 0; i < 40; i++) noteOfflineResumeEvent("app_visible");
    expect(JSON.parse(offlineResumeDiagnosticReport()).events).toHaveLength(32);
  });
});
