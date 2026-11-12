import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPlatformType } from "@/platform";
import { peekActiveGameSession } from "@/lib/activeGameSession";
import { ROUTES } from "@/lib/constants";
import {
  forgeRecoveryReleaseId,
  readForgeRecoverySave,
} from "@/lib/forgeAutoResumeStore";
import { useGameStore } from "@/stores/useGameStore";

/**
 * Safari can terminate a background Home Screen WebKit process without pagehide.
 * Resume from the last committed, version-matched private journal on next boot.
 * Do not launch any replacement game before the Forge worker verifies the
 * original prompt, all recorded decisions, hidden state and RNG stream.
 */
export function useForgeAutoResume(): void {
  const navigate = useNavigate();
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current || getPlatformType() !== "web" || peekActiveGameSession()) return;
    tried.current = true;
    let cancelled = false;
    void (async () => {
      const releaseId = await forgeRecoveryReleaseId();
      if (!releaseId || cancelled) return;
      const save = await readForgeRecoverySave(releaseId);
      if (!save || cancelled || useGameStore.getState().isGameActive) return;
      const { launch } = save;
      // This path exclusively restores a real Forge solo game, not a relay
      // session, multiplayer host, Rust bot game or previous software version.
      if (launch.engine !== "Forge" || launch.aiController !== "forge") return;
      const started = await useGameStore.getState().startGame(
        launch.deck,
        launch.formatId,
        launch.commanderName ?? undefined,
        launch.opponentDecks ?? undefined,
        "Forge",
        undefined,
        save,
      );
      if (!cancelled && started) {
        navigate(ROUTES.PLAY_OFFLINE_CONSTRUCTED, { replace: true });
      } else if (!cancelled) {
        toast.error("The saved game could not be restored. Your checkpoint was kept.", {
          duration: 10000,
        });
      }
    })().catch((error) => {
      if (!cancelled) console.warn("Forge auto-restore unavailable:", error);
    });
    return () => { cancelled = true; };
  }, [navigate]);
}