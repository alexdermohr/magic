package forge.harness.common;

import forge.util.AITimeoutTracker;

public final class ReplayAiBudgetProbe {
    private ReplayAiBudgetProbe() {}

    public static void main(final String[] args) throws InterruptedException {
        final int fast = exhaustedAfter(0);
        final int slow = exhaustedAfter(4);
        if (fast != slow || fast < 2 || fast > 100) {
            throw new AssertionError("AI budget depends on real time: " + fast + " vs " + slow);
        }
        final Object expired = AITimeoutTracker.arm(System.nanoTime() - 1_000_000L, false);
        try {
            AITimeoutTracker.check();
            throw new AssertionError("normal game lost its wall-clock timeout");
        } catch (AITimeoutTracker.Expired expected) {
        } finally {
            AITimeoutTracker.disarm(expired);
        }
        System.out.println("REPLAY_AI_BUDGET_PASS checks=" + fast + " wallClockOutsideReplay=true");
    }

    private static int exhaustedAfter(final long delayMillis) throws InterruptedException {
        ReplayAiClock.begin();
        final long key = AITimeoutTracker.key(1, 1);
        final long budget = 25_000_000L;
        AITimeoutTracker.begin(key, budget);
        final Object token = AITimeoutTracker.arm(AITimeoutTracker.deadlineNanos(key, budget), false);
        try {
            for (int checks = 0; checks < 100; checks++) {
                if (delayMillis > 0) {
                    Thread.sleep(delayMillis);
                }
                try {
                    AITimeoutTracker.check();
                } catch (AITimeoutTracker.Expired expected) {
                    return checks;
                }
            }
            throw new AssertionError("AI work budget never expires");
        } finally {
            AITimeoutTracker.disarm(token);
            AITimeoutTracker.end(key);
            ReplayAiClock.end();
        }
    }
}
