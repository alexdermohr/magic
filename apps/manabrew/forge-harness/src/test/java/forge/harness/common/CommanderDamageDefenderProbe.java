package forge.harness.common;

import forge.ai.AiAttackController;
import forge.ai.LobbyPlayerAi;
import forge.deck.Deck;
import forge.game.Game;
import forge.game.GameRules;
import forge.game.GameStage;
import forge.game.GameType;
import forge.game.Match;
import forge.game.card.Card;
import forge.game.phase.PhaseType;
import forge.game.player.Player;
import forge.game.player.RegisteredPlayer;
import forge.game.zone.ZoneType;
import forge.gui.GuiBase;
import forge.item.IPaperCard;
import forge.localinstance.properties.ForgePreferences.FPref;
import forge.model.FModel;
import forge.StaticData;

import java.util.ArrayList;
import java.util.List;

public final class CommanderDamageDefenderProbe {
    public static void main(String[] args) {
        GuiBase.setInterface(new HeadlessGuiBase("forge/forge-gui/"));
        FModel.initialize(null, prefs -> {
            prefs.setPref(FPref.LOAD_CARD_SCRIPTS_LAZILY, true);
            prefs.setPref(FPref.UI_LANGUAGE, "en-US");
            return null;
        });
        List<RegisteredPlayer> players = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            players.add(new RegisteredPlayer(new Deck()).setPlayer(
                new LobbyPlayerAi("player-" + i, null)));
        }
        GameRules rules = new GameRules(GameType.Commander);
        Game game = new Game(players, rules, new Match(rules, players, "CommanderDamageDefenderProbe"));
        game.setAge(GameStage.Play);
        game.getPhaseHandler().devModeSet(PhaseType.COMBAT_DECLARE_ATTACKERS, game.getPlayers().get(0));
        game.getPhaseHandler().onStackResolved();
        for (Player player : game.getPlayers()) {
            player.setStartingLife(40);
        }
        if (rules.getCommanderDamageToLose() != 21) {
            throw new AssertionError("Commander damage threshold must be 21");
        }
        Player ai = game.getPlayers().get(0);
        Player wounded = game.getPlayers().get(1);
        Player intact = game.getPlayers().get(2);

        IPaperCard paper = FModel.getMagicDb().getCommonCards().getCard("Isamaru, Hound of Konda");
        if (paper == null) {
            StaticData.instance().attemptToLoadCard("Isamaru, Hound of Konda");
            paper = FModel.getMagicDb().getCommonCards().getCard("Isamaru, Hound of Konda");
        }
        if (paper == null) throw new AssertionError("Commander paper card missing");
        Card commander = Card.fromPaperCard(paper, ai);
        commander.setGameTimestamp(game.getNextTimestamp());
        ai.addCommander(commander);
        ai.getZone(ZoneType.Battlefield).add(commander);
        wounded.addCommanderDamage(commander, 20);
        int woundedSelections=0;
        int intactSelections=0;
        for (int i = 0; i < 30; i++) {
            Player selected=AiAttackController.choosePreferredDefenderPlayer(ai,true);
            if (selected == wounded) woundedSelections++;
            else if (selected == intact) intactSelections++;
            else throw new AssertionError("Unexpected defender");
        }
        System.out.println("COMMANDER_TARGETING wounded="+woundedSelections+" intact="+intactSelections);
        if (woundedSelections != 30) throw new AssertionError("Commander lethal target was not always preferred");
        System.exit(0);
    }
}