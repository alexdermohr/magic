/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
  beginOfflineResumeDiagnostics,
  noteOfflineResumeEvent,
  offlineResumeDiagnosticReport,
} from "./offlineResumeDiagnostics";

describe("offline iPad lifecycle log", () => {
  beforeEach(() => window.localStorage.clear());

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
