package forge.harness.common;

public final class ReplayAiClock {
    private static final long WORK_TICK_NANOS = 1_000_000L;
    private static final ThreadLocal<long[]> ACTIVE = new ThreadLocal<>();

    private ReplayAiClock() {}

    public static void begin() {
        if (ACTIVE.get() != null) {
            throw new IllegalStateException("nested replay AI clock");
        }
        ACTIVE.set(new long[1]);
    }

    public static void end() {
        ACTIVE.remove();
    }

    // Virtual time is a bounded work budget, not elapsed wall time.
    public static long nanoTime() {
        final long[] ticks = ACTIVE.get();
        if (ticks == null) {
            return System.nanoTime();
        }
        return ticks[0] += WORK_TICK_NANOS;
    }

    public static long currentTimeMillis() {
        return ACTIVE.get() == null ? System.currentTimeMillis() : nanoTime() / 1_000_000L;
    }
}
