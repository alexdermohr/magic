package forge.harness.host;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Random;
import java.util.function.Function;

/** Compare the exact witness bytes, including boundary padding and repeated independent calls. */
public final class WitnessDigestTest {
    private WitnessDigestTest() {}

    public static void main(final String[] args) throws Exception {
        check(GameCheckpoint::sha256);
        new ManaBrewEngineAdapter();
        new ManaBrewEngineAdapter(GameCheckpoint::sha256);
        try {
            new ManaBrewEngineAdapter(bytes -> new byte[32]);
            throw new AssertionError("incorrect SHA-256 provider accepted");
        } catch (IllegalStateException expected) {
            if (!expected.getMessage().contains("invalid SHA-256")) throw expected;
        }
        // The JVM harness does not depend on Bouncy Castle. The WebImage build
        // runs the same test with its separately pinned platform-only class.
        if (args.length == 1 && "--wasm".equals(args[0])) {
            final var method = Class.forName("forge.harness.wasm.WasmWitnessDigest")
                    .getMethod("sha256", byte[].class);
            check(bytes -> {
                try {
                    return (byte[]) method.invoke(null, (Object) bytes);
                } catch (ReflectiveOperationException error) {
                    throw new IllegalStateException(error);
                }
            });
        }
        for (final byte[] invalid : new byte[][] {null, new byte[31], new byte[33]}) {
            try {
                GameCheckpoint.digest(new byte[0], bytes -> invalid);
                throw new AssertionError("invalid digest length accepted");
            } catch (IllegalStateException expected) {
                if (!expected.getMessage().contains("invalid SHA-256")) throw expected;
            }
        }
        System.out.println("WITNESS_DIGEST_PASS");
    }

    private static void check(final Function<byte[], byte[]> hasher) throws Exception {
        final byte[] abc = "abc".getBytes(StandardCharsets.UTF_8);
        if (!"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
                .equals(GameCheckpoint.digest(abc, hasher))) {
            throw new AssertionError("SHA-256 known-answer mismatch");
        }
        final Random rng = new Random(27004);
        int cases = 0;
        for (final int size : new int[] {0, 1, 7, 31, 32, 55, 56, 57, 63, 64, 65,
                127, 128, 129, 255, 256, 257, 1024, 4096, 32768, 131072, 524288}) {
            for (int i = 0; i < 8; i++) {
                final byte[] input = new byte[size];
                rng.nextBytes(input);
                final byte[] copy = input.clone();
                final byte[] expected = MessageDigest.getInstance("SHA-256").digest(input);
                if (!Arrays.equals(expected, hasher.apply(input)) || !Arrays.equals(copy, input)
                        || !Arrays.equals(expected, hasher.apply(input))) {
                    throw new AssertionError("SHA-256 mismatch or input mutation at " + size);
                }
                cases++;
            }
        }
        System.out.println("WITNESS_DIGEST_CASES=" + cases);
    }
}
