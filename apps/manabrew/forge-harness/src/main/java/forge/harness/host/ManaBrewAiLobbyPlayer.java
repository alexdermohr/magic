package forge.harness.host;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import forge.ai.LobbyPlayerAi;
import forge.ai.PlayerControllerAi;
import forge.game.Game;
import forge.game.card.Card;
import forge.game.player.Player;
import forge.game.player.PlayerController;
import forge.game.spellability.SpellAbility;
import forge.harness.common.ActionSpace;
import forge.harness.common.SnapshotExtractor;
import forge.harness.protocol.AvailableAction;
import forge.harness.protocol.AvailableAction_cast;
import forge.harness.protocol.ChooseActionInput;
import forge.harness.protocol.PlayCardMode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class ManaBrewAiLobbyPlayer extends LobbyPlayerAi {
    private final ManaBrewInteractiveSession session;

    public ManaBrewAiLobbyPlayer(final String name, final ManaBrewInteractiveSession session) {
        super(name, null);
        this.session = session;
    }

    @Override
    public PlayerController createMindSlaveController(final Player master, final Player slave) {
        return new Controller(slave, this, session);
    }

    @Override
    public Player createIngamePlayer(final Game game, final int id) {
        final Player player = new Player(getName(), game, id);
        player.setFirstController(new Controller(player, this, session));
        return player;
    }

    private static final class Controller extends PlayerControllerAi {
        private static final Gson GSON = new Gson();
        private final ManaBrewInteractiveSession session;

        private Controller(final Player player, final ManaBrewAiLobbyPlayer lobbyPlayer,
                final ManaBrewInteractiveSession session) {
            super(player.getGame(), player, lobbyPlayer);
            this.session = session;
        }

        @Override
        public List<SpellAbility> chooseSpellAbilityToPlay() {
            if (session.actionRepeat().passesDuringReplay(getPlayer())) {
                return null;
            }
            if (!session.forgeTeacherTraceEnabled()) {
                return super.chooseSpellAbilityToPlay();
            }
            // Instrumentation is strictly opt-in and cannot replace Forge's
            // decision. Capture *before* choosing, using only this seat's view.
            JsonObject observation = null;
            try {
                observation = teacherObservation();
            } catch (RuntimeException ignored) {
                // No telemetry failure may change the normal AI's return.
            }
            final List<SpellAbility> chosen = super.chooseSpellAbilityToPlay();
            if (observation != null) {
                try {
                    emitTeacherDecision(observation, chosen);
                } catch (RuntimeException ignored) {
                    // Never interrupt a game for optional benchmark evidence.
                }
            }
            return chosen;
        }

        private JsonObject teacherObservation() {
            final Player player = getPlayer();
            final int seat = SnapshotExtractor.playerIndex(player.getGame(), player);
            final JsonObject view = JsonParser.parseString(session.snapshotJson(seat)).getAsJsonObject();
            // Build the visible-id allowlist from the same seat-redacted state.
            // Do not export the AI's opponent hands, library, or private targets.
            final Set<String> visible = new HashSet<>();
            for (final JsonElement zoneValue : view.getAsJsonArray("zones")) {
                for (final JsonElement cardValue : zoneValue.getAsJsonObject().getAsJsonArray("cards")) {
                    final JsonObject card = cardValue.getAsJsonObject();
                    if (card.has("id") && card.has("identity") && card.get("identity").isJsonObject()) {
                        final JsonObject identity = card.getAsJsonObject("identity");
                        if (identity.has("name") && !identity.get("name").isJsonNull()
                                && !identity.get("name").getAsString().isBlank()) {
                            visible.add(card.get("id").getAsString());
                        }
                    }
                }
            }
            final List<AvailableAction> actions = new ArrayList<>();
            final List<SpellAbility> possible = ActionSpace.getPossibleActions(player, false);
            final Map<String, Integer> counts = new HashMap<>();
            for (final SpellAbility sa : possible) {
                if (!sa.isSpell() && !sa.isLandAbility()) {
                    continue;
                }
                final Card host = sa.getHostCard();
                if (host == null) {
                    continue;
                }
                final String cardId = SnapshotExtractor.javaCardId(host);
                if (visible.contains(cardId)) {
                    counts.merge(cardId, 1, Integer::sum);
                }
            }
            // Multiple modes/alternative costs on one card cannot be identified
            // reliably by a simple cast ranker. Discard those ambiguous labels.
            for (final SpellAbility sa : possible) {
                if (!sa.isSpell() && !sa.isLandAbility()) {
                    continue;
                }
                final Card host = sa.getHostCard();
                if (host == null) {
                    continue;
                }
                final String cardId = SnapshotExtractor.javaCardId(host);
                if (counts.getOrDefault(cardId, 0) != 1) {
                    continue;
                }
                final PlayCardMode mode = ManaBrewInteractiveSession.playCardMode(sa);
                actions.add(new AvailableAction_cast(
                        "forge-cast:" + cardId, cardId, mode,
                        (sa.isLandAbility() ? "Play " : "Cast ") + host.getName(),
                        ManaBrewInteractiveSession.actionFaceIndex(sa, mode)));
            }
            if (actions.size() < 2 || actions.size() > 200) {
                return null;
            }
            final JsonObject prompt = new JsonObject();
            prompt.addProperty("decidingPlayerId", "player-" + seat);
            prompt.add("input", GSON.toJsonTree(new ChooseActionInput(actions)));

            final JsonObject observation = new JsonObject();
            observation.addProperty("teacher", "forge-ai");
            observation.addProperty("seat", seat);
            observation.add("view", view);
            observation.add("prompt", prompt);
            return observation;
        }

        private void emitTeacherDecision(final JsonObject observation, final List<SpellAbility> chosen) {
            if (chosen == null || chosen.size() != 1 || chosen.get(0).getHostCard() == null
                    || (!chosen.get(0).isSpell() && !chosen.get(0).isLandAbility())) {
                return;
            }
            final String id = "forge-cast:" + SnapshotExtractor.javaCardId(chosen.get(0).getHostCard());
            final JsonArray actions = observation.getAsJsonObject("prompt")
                    .getAsJsonObject("input").getAsJsonArray("actions");
            boolean offered = false;
            for (final JsonElement action : actions) {
                if (id.equals(action.getAsJsonObject().get("id").getAsString())) {
                    offered = true;
                    break;
                }
            }
            if (!offered) {
                return;
            }
            final JsonObject decision = new JsonObject();
            decision.addProperty("type", "act");
            decision.addProperty("actionId", id);
            observation.add("decision", decision);
            System.err.println("[forge-teacher] " + observation);
        }
    }
}