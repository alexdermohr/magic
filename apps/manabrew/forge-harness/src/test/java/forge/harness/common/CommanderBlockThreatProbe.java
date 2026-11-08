package forge.harness.common;

import forge.StaticData;
import forge.ai.ComputerUtilCombat;
import forge.ai.LobbyPlayerAi;
import forge.deck.Deck;
import forge.game.Game;
import forge.game.GameRules;
import forge.game.GameStage;
import forge.game.GameType;
import forge.game.Match;
import forge.game.card.Card;
import forge.game.combat.Combat;
import forge.game.phase.PhaseType;
import forge.game.player.Player;
import forge.game.player.RegisteredPlayer;
import forge.game.zone.ZoneType;
import forge.gui.GuiBase;
import forge.item.IPaperCard;
import forge.localinstance.properties.ForgePreferences.FPref;
import forge.model.FModel;

import java.util.ArrayList;
import java.util.List;

public final class CommanderBlockThreatProbe {
    private static Card loadCard(String name, Player owner, Game game) {
        IPaperCard paper = FModel.getMagicDb().getCommonCards().getCard(name);
        if (paper == null) {
            StaticData.instance().attemptToLoadCard(name);
            paper = FModel.getMagicDb().getCommonCards().getCard(name);
        }
        if (paper == null) throw new AssertionError("Missing card: " + name);
        Card card = Card.fromPaperCard(paper, owner);
        card.setGameTimestamp(game.getNextTimestamp());
        owner.getZone(ZoneType.Battlefield).add(card);
        return card;
    }

    public static void main(String[] args) {
        GuiBase.setInterface(new HeadlessGuiBase(args.length > 0 ? args[0] : "forge/forge-gui/"));
        FModel.initialize(null, prefs -> {
            prefs.setPref(FPref.LOAD_CARD_SCRIPTS_LAZILY, true);
            prefs.setPref(FPref.UI_LANGUAGE, "en-US");
            return null;
        });
        List<RegisteredPlayer> players = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            players.add(new RegisteredPlayer(new Deck()).setPlayer(
                new LobbyPlayerAi("player-" + i, null)));
        }
        GameRules rules = new GameRules(GameType.Commander);
        Game game = new Game(players, rules, new Match(rules, players, "CommanderBlockThreatProbe"));
        game.setAge(GameStage.Play);
        Player attacker = game.getPlayers().get(0);
        Player defender = game.getPlayers().get(1);
        game.getPhaseHandler().devModeSet(PhaseType.COMBAT_DECLARE_BLOCKERS, attacker);
        game.getPhaseHandler().onStackResolved();
        attacker.setStartingLife(40);
        defender.setStartingLife(40);

        Card commander = loadCard("Isamaru, Hound of Konda", attacker, game);
        attacker.addCommander(commander);
        Card blocker = loadCard("Memnite", defender, game);
        defender.addCommanderDamage(commander, 20);
        if (rules.getCommanderDamageToLose() != 21) {
            throw new AssertionError("Unexpected commander damage threshold");
        }
        Combat combat = new Combat(attacker);
        combat.addAttacker(commander, defender);
        if (!combat.getAttackers().contains(commander)) {
            throw new AssertionError("Commander was not added as an attacker");
        }
        int unblocked = ComputerUtilCombat.getLifeThreateningCommanders(defender, combat).size();
        combat.addBlocker(commander, blocker);
        if (combat.getBlockers(commander).isEmpty()) {
            throw new AssertionError("Block assignment missing");
        }
        int assigned = ComputerUtilCombat.getLifeThreateningCommanders(defender, combat).size();
        combat.setBlocked(commander, true);
        int blocked = ComputerUtilCombat.getLifeThreateningCommanders(defender, combat).size();
        int danger = ComputerUtilCombat.lifeInDanger(defender, combat) ? 1 : 0;
        int serious = ComputerUtilCombat.lifeInSeriousDanger(defender, combat) ? 1 : 0;
        commander.addIntrinsicKeyword("Trample");
        int trample = ComputerUtilCombat.getLifeThreateningCommanders(defender, combat).size();
        Card secondBlocker = loadCard("Memnite", defender, game);
        combat.addBlocker(commander, secondBlocker);
        int shielded = ComputerUtilCombat.getLifeThreateningCommanders(defender, combat).size();
        System.out.println("COMMANDER_BLOCK_THREAT unblocked=" + unblocked
            + " assigned=" + assigned + " blocked=" + blocked
            + " danger=" + danger + " serious=" + serious + " trample=" + trample
            + " shielded=" + shielded);
        System.exit(0);
    }
}