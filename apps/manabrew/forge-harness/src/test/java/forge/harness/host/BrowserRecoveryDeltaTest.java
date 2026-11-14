package forge.harness.host;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/** Plain JVM source-contract test; no Forge UI or browser dependencies. */
public final class BrowserRecoveryDeltaTest {
    private static JsonObject parse(final String value) {
        return JsonParser.parseString(value).getAsJsonObject();
    }
    private static void check(final boolean value, final String message) {
        if (!value) throw new AssertionError(message);
    }
    public static void main(final String[] args) {
        final String start = "{\"gameId\":\"recovery-java-1\",\"decisionJournal\":true,"
                + "\"journalRewind\":true,\"experimentalInternalAiReplay\":true}";
        final String prompt = "{\"decidingPlayerId\":\"player-0\",\"input\":{\"type\":\"chooseAction\"}}";
        final JsonObject witness = parse("{\"state\":\"" + "a".repeat(64)
                + "\",\"rng\":\"0:cbf29ce484222325\"}");
        final DecisionHistory journal = new DecisionHistory(start, null);

        final JsonObject first = parse(journal.browserRecoveryDelta(0, true,
                "recovery-java-1", prompt, witness));
        check(first.has("startRequest"), "first checkpoint must include start request");
        check(first.get("nextSequence").getAsInt() == 1, "initial cursor incorrect");
        check(first.getAsJsonArray("entries").size() == 0, "initial journal must be empty");

        final JsonObject answer = parse("{\"type\":\"chooseAction\",\"output\":{\"type\":\"pass\"}}");
        journal.record(0, prompt, answer, witness);
        final JsonObject second = parse(journal.browserRecoveryDelta(0, false,
                "recovery-java-1", prompt, witness));
        check(!second.has("startRequest"),
                "first consumed action must not duplicate the initial start request");
        check(second.get("nextSequence").getAsInt() == 2, "first action cursor incorrect");
        check(second.getAsJsonArray("entries").size() == 1, "missing first action");
        check(second.getAsJsonArray("entries").get(0).getAsJsonObject()
                .get("sequence").getAsInt() == 1, "wrong first action sequence");

        journal.record(0, prompt, answer, witness);
        final JsonObject third = parse(journal.browserRecoveryDelta(1, false,
                "recovery-java-1", prompt, witness));
        check(third.get("nextSequence").getAsInt() == 3, "second action cursor incorrect");
        check(third.getAsJsonArray("entries").size() == 1, "delta must exclude saved prefix");
        check(third.getAsJsonArray("entries").get(0).getAsJsonObject()
                .get("sequence").getAsInt() == 2, "wrong second action sequence");

        boolean invalidCursor = false;
        try {
            journal.browserRecoveryDelta(3, false, "recovery-java-1", prompt, witness);
        } catch (IllegalArgumentException expected) {
            invalidCursor = true;
        }
        check(invalidCursor, "cursor beyond retained journal must fail closed");
        System.out.println("BROWSER_RECOVERY_DELTA_JVM PASS");
    }
}
