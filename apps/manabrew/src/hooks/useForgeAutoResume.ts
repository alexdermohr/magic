import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlatformType } from "@/platform";
import { peekActiveGameSession } from "@/lib/activeGameSession";
import { ROUTES } from "@/lib/constants";
import {
  forgeRecoveryReleaseId,
  forgeRecoveryStoredReleaseId,
  readForgeRecoverySave,
} from "@/lib/forgeAutoResumeStore";
import { useGameStore } from "@/stores/useGameStore";

export type ForgeResumePhase =
  | "checking"
  | "restoring"
  | "failed"
  | "different-release"
  | "idle";

/**
 * Safari may kill a Home Screen WebKit process without a pagehide callback.
 * Check local IndexedDB on each new document, immediately route a saved game
 * to its board, then wait until the Forge worker verifies the complete replay.
 *
 * Return an explicit status so the home screen cannot misleadingly look like
 * the final outcome while the engine is still being reconstructed.
 */
export function useForgeAutoResume(): {
  phase: ForgeResumePhase;
  retry: () => void;
  dismiss: () => void;
} {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<ForgeResumePhase>(() =>
    getPlatformType() === "web" && !peekActiveGameSession() ? "checking" : "idle",
  );

  useEffect(() => {
    if (getPlatformType() !== "web" || peekActiveGameSession()) {
      setPhase("idle");
      return;
    }
    let cancelled = false;
    void (async () => {
      // No committed Forge game: normal navigation must work immediately.
      // A nonmatching release is different from an absent game; do not
      // discard the checkpoint or silently show the home page.
      const savedRelease = await forgeRecoveryStoredReleaseId();
      if (cancelled) return;
      if (!savedRelease) {
        setPhase("idle");
        return;
      }
      const installedRelease = await forgeRecoveryReleaseId();
      if (cancelled) return;
      if (!installedRelease || installedRelease !== savedRelease) {
        setPhase("different-release");
        return;
      }
      const save = await readForgeRecoverySave(installedRelease);
      if (cancelled) return;
      if (!save || save.launch.engine !== "Forge" || save.launch.aiController !== "forge") {
        setPhase("failed");
        return;
      }
      if (useGameStore.getState().isGameActive) {
        setPhase("idle");
        return;
      }

      setPhase("restoring");
      const { launch } = save;
      const gauntletId = typeof launch.gauntletId === "string" && launch.gauntletId
        ? launch.gauntletId : undefined;
      navigate(gauntletId ? ROUTES.PLAY : ROUTES.PLAY_OFFLINE_CONSTRUCTED, {
        replace: true,
        ...(gauntletId ? { state: { exitTo: `/gauntlet/${gauntletId}` } } : {}),
      });
      const started = await useGameStore.getState().startGame(
        launch.deck,
        launch.formatId,
        launch.commanderName ?? undefined,
        launch.opponentDecks ?? undefined,
        "Forge",
        gauntletId,
        save,
      );
      if (!cancelled) setPhase(started ? "idle" : "failed");
    })().catch((error) => {
      if (cancelled) return;
      console.warn("Forge auto-restore unavailable:", error);
      setPhase("failed");
    });
    return () => { cancelled = true; };
  }, [attempt, navigate]);

  const retry = useCallback(() => {
    setPhase("checking");
    setAttempt((value) => value + 1);
  }, []);
  const dismiss = useCallback(() => setPhase("idle"), []);
  return { phase, retry, dismiss };
}
