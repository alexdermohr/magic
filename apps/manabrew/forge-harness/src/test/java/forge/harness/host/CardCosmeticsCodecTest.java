package forge.harness.host;

import com.google.gson.JsonParser;
import forge.harness.protocol.CardCosmetics;
import forge.harness.protocol.CardPrintingCalibration;

/** Regression for cosmetics saved by the 3.81 editor and restored by Forge. */
public final class CardCosmeticsCodecTest {
    private CardCosmeticsCodecTest() {}

    private static CardCosmetics parse(final String json) {
        return CardCosmeticsCodec.parse(JsonParser.parseString(json));
    }

    private static void check(final boolean condition, final String message) {
        if (!condition) throw new AssertionError(message);
    }

    public static void main(final String[] args) {
        final CardCosmetics calibrated = parse("{\"printing\":{\"version\":1,"
                + "\"preset\":\"match\",\"overrides\":{\"calibration\":\"auto\"},"
                + "\"faces\":[{\"overrides\":{\"calibration\":\"m21-modern\"}}]}}");
        check(calibrated != null && calibrated.printing != null, "calibrated printing was dropped");
        check(calibrated.printing.overrides.calibration == CardPrintingCalibration.AUTO,
                "explicit auto calibration was rejected or lost");
        check(calibrated.printing.faces.size() == 1
                && calibrated.printing.faces.get(0).overrides.calibration
                        == CardPrintingCalibration.M21_MODERN,
                "face-specific calibration did not survive the Forge codec");

        final CardCosmetics source = parse("{\"printing\":{\"version\":1,"
                + "\"preset\":\"match\",\"overrides\":{\"calibration\":\"source\"},"
                + "\"faces\":[{\"overrides\":{\"calibration\":\"8ed-eighth\"}}]}}");
        check(source.printing.overrides.calibration == CardPrintingCalibration.SOURCE,
                "source calibration did not survive");
        check(source.printing.faces.get(0).overrides.calibration
                        == CardPrintingCalibration._8ED_EIGHTH,
                "8ed-eighth calibration did not survive");

        final CardCosmetics explicitLegacyDots = parse("{\"printDots\":"
                + "{\"amount\":0.4,\"period\":5,\"inset\":0}}");
        check(explicitLegacyDots != null && explicitLegacyDots.printDots != null,
                "print-dot settings were removed");
        check(explicitLegacyDots.printDots.period != null
                        && explicitLegacyDots.printDots.period == 5.0,
                "explicit legacy period 5 was replaced by the new default 2");
        check(explicitLegacyDots.printDots.inset != null
                        && explicitLegacyDots.printDots.inset == 0.0,
                "explicit zero inset was replaced by the new default 0.035");

        final CardCosmetics newDefaults = parse("{\"printDots\":"
                + "{\"amount\":0.4,\"period\":2,\"inset\":0.035}}");
        check(newDefaults != null && newDefaults.printDots != null,
                "nonzero print-dot amount was removed");
        check(newDefaults.printDots.period == null && newDefaults.printDots.inset == null,
                "new Rust default values must normalize identically in Java");

        boolean invalid = false;
        try {
            parse("{\"printing\":{\"version\":1,\"preset\":\"match\","
                    + "\"overrides\":{\"calibration\":\"invalid\"}}}");
        } catch (IllegalArgumentException expected) {
            invalid = true;
        }
        check(invalid, "invalid calibration must still be rejected by the strict codec");
        System.out.println("CARD_COSMETICS_CODEC_JVM PASS");
    }
}
