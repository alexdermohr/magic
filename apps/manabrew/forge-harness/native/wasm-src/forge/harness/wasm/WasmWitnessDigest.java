package forge.harness.wasm;

import org.bouncycastle.crypto.digests.SHA256Digest;

public final class WasmWitnessDigest {
    private WasmWitnessDigest() {}

    public static byte[] sha256(final byte[] input) {
        final SHA256Digest digest = new SHA256Digest();
        digest.update(input, 0, input.length);
        final byte[] result = new byte[32];
        digest.doFinal(result, 0);
        return result;
    }
}
