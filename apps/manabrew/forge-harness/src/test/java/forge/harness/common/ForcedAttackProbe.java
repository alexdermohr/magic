package forge.harness.common;

import forge.StaticData;
import forge.ai.AiAttackController;
import forge.ai.LobbyPlayerAi;
import forge.deck.Deck;
import forge.game.Game;
import forge.game.GameRules;
import forge.game.GameStage;
import forge.game.GameType;
import forge.game.Match;
import forge.game.card.Card;
import forge.game.combat.Combat;
import forge.game.combat.CombatUtil;
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

public final class ForcedAttackProbe {
    private static Card load(String name, Player owner, Game game) {
        IPaperCard paper = FModel.getMagicDb().getCommonCards().getCard(name);
        if (paper == null) {
            StaticData.instance().attemptToLoadCard(name);
            paper = FModel.getMagicDb().getCommonCards().getCard(name);
        }
        if (paper == null) throw new AssertionError(name);
        Card card = Card.fromPaperCard(paper, owner);
        card.setGameTimestamp(game.getNextTimestamp());
        owner.getZone(ZoneType.Battlefield).add(card);
        card.setSickness(false);
        return card;
    }

    private static void run(String label, int seats, boolean regular, boolean goad,
                            boolean secondGoad, boolean tapped, boolean limited,
                            boolean expectedOrdinary, boolean expectedBird) {
        List<RegisteredPlayer> players = new ArrayList<>();
        for (int i = 0; i < seats; i++) {
            players.add(new RegisteredPlayer(new Deck()).setPlayer(new LobbyPlayerAi("player-" + i, null)));
        }
        GameRules rules = new GameRules(GameType.Commander);
        Game game = new Game(players, rules, new Match(rules, players, "ForcedAttackProbe"));
        game.setAge(GameStage.Play);
        Player attacker = game.getPlayers().get(0);
        Player preferred = game.getPlayers().get(1);
        for (Player player : game.getPlayers()) player.setStartingLife(40);
        preferred.setLife(1, null);
        game.getPhaseHandler().devModeSet(PhaseType.COMBAT_DECLARE_ATTACKERS, attacker);
        game.getPhaseHandler().onStackResolved();
        Card ordinary = regular ? load("Isamaru, Hound of Konda", attacker, game) : null;
        Card bird = load("Storm Crow", attacker, game);
        if (goad) bird.addGoad(game.getNextTimestamp(), preferred);
        if (secondGoad) bird.addGoad(game.getNextTimestamp(), game.getPlayers().get(2));
        if (tapped) bird.setTapped(true);
        if (limited) load("Silent Arbiter", preferred, game);

        if (label.equals("defender-zero")) {
            Card restriction = load("Crawlspace", preferred, game);
            restriction.addStaticAbility("Mode$ AttackRestrict | MaxAttackers$ 0 | ValidDefender$ You");
            ordinary.setSVar("MustAttack", "True");
        }
        Combat combat = new Combat(attacker);
        game.getPhaseHandler().setCombat(combat);
        if (label.equals("defender-zero")) {
            var restrictions = combat.getAttackConstraints().getGlobalRestrictions();
            if (!Integer.valueOf(0).equals(restrictions.getDefenderMax().get(preferred))
                    || restrictions.getMax() != null
                    || AiAttackController.choosePreferredDefenderPlayer(attacker) != preferred) {
                throw new AssertionError("Defender-zero fixture invalid");
            }
        }
        new AiAttackController(attacker).declareAttackers(combat);
        boolean valid = CombatUtil.validateAttackers(combat);
        boolean ordinaryAttacks = ordinary != null && combat.isAttacking(ordinary);
        boolean birdAttacks = combat.isAttacking(bird);
        System.out.println("FORCED_ATTACK " + label + " valid=" + valid
                + " ordinary=" + ordinaryAttacks + " bird=" + birdAttacks
                + " defender=" + combat.getDefenderByAttacker(bird));
        if (!valid || ordinaryAttacks != expectedOrdinary || birdAttacks != expectedBird) {
            throw new AssertionError("Unexpected attack declaration: " + label);
        }
        if (goad && seats > 2 && birdAttacks && combat.getDefenderByAttacker(bird) == preferred) {
            throw new AssertionError("Attacked goading player despite another available defender");
        }
        if (label.equals("split")) {
            Combat mock = new Combat(attacker);
            new AiAttackController(attacker, ordinary).declareAttackers(mock);
            if (!mock.isAttacking(ordinary) || mock.isAttacking(bird)) {
                throw new AssertionError("Single-card prediction changed");
            }
        }
    }

    public static void main(String[] args) {
        GuiBase.setInterface(new HeadlessGuiBase(args[0]));
        FModel.initialize(null, prefs -> {
            prefs.setPref(FPref.LOAD_CARD_SCRIPTS_LAZILY, true);
            prefs.setPref(FPref.UI_LANGUAGE, "en-US");
            return null;
        });
        run("defender-zero", 4, true, true, false, false, false, false, true);
        run("split", 4, true, true, false, false, false, true, true);
        run("ordinary", 4, true, false, false, false, false, true, true);
        run("tapped", 4, true, true, false, true, false, true, false);
        run("duel", 2, true, true, false, false, false, true, true);
        run("limited", 4, true, true, false, false, true, false, true);
        for (int i = 0; i < 8; i++) {
            run("only-" + i, 4, false, true, true, false, false, false, true);
        }
        System.out.println("FORCED_ATTACK_PROBE 14/14");
        System.exit(0);
    }
}
