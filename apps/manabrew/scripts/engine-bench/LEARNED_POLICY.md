# Experimental learned ManaBot policy (Linux/Node only)

This is a **bench-only third policy**, not an installed iPad opponent or a
stronger-than-Forge claim. Forge still owns the rules and available actions.
ManaBot handles mana, combat, targets, priority, loop prevention and all other
decisions. The learned part only reranks **two or more visible cast actions**
when ManaBot also wanted to cast. Unknown cards, incompatible models, missing
candidates and non-cast decisions fall back to ManaBot.

The trainer is a small offline softmax linear model over 22 card and board
features; inference uses pure JavaScript. It needs neither a cloud service nor
an external ML library. Training uses **ManaBot**, not Forge AI, as teacher.

## Reproduce locally

Build the same local Forge and ManaBot WASM artifacts required for other
engine-bench runs. From apps/manabrew, these examples assume
packages/forge-wasm, src/wasm and dist/personal-decks.json are present.

Record separate games with different seeds. The traces deliberately go to
/tmp, not Git; each trace contains the seat-visible game state.

~~~sh
node scripts/engine-bench/manabot-game.mjs \
  --decks personal:anowon-rogues,personal:helga-skittish-seer \
  --seed 20511 --trace chooseAction \
  --trace-file /tmp/manabrew-20511.jsonl \
  --out /tmp/manabrew-20511.json

node scripts/engine-bench/manabot-game.mjs \
  --decks personal:helga-skittish-seer,personal:anowon-rogues \
  --seed 20512 --trace chooseAction \
  --trace-file /tmp/manabrew-20512.jsonl \
  --out /tmp/manabrew-20512.json

node scripts/engine-bench/train-learned-policy.mjs \
  --traces /tmp/manabrew-20511.jsonl,/tmp/manabrew-20512.jsonl \
  --out /tmp/manabrew-policy.json
~~~

The last whole game is held out for validation. With one trace, training
reports no validation rather than leaking turns from the same game.
Agreement with a teacher is not playing strength.

A **weights-only sample model** is included as
experimental-cast-v1.model.json. It was learned from exactly the two example
games and is deliberately labeled experimental: on the held-out game it
performed worse than choosing the first cast. It is included only to make a
first local smoke test possible without training. You can instead use your
own newly trained /tmp/manabrew-policy.json.

Play a match with the learned policy activated only on an explicitly selected
seat:

~~~sh
node scripts/engine-bench/manabot-game.mjs \
  --decks personal:anowon-rogues,personal:helga-skittish-seer \
  --seed 20513 --learned-model scripts/engine-bench/experimental-cast-v1.model.json \
  --learned-seats 0 --out /tmp/manabrew-learned-20513.json
~~~

Swap seats and deck order. Run the same seed without learning as a baseline.
The JSON summary includes eligible decisions, overrides and fallbacks.
Fixed seeds do not guarantee identical state after a divergent decision.

## Initial evidence (5 November 2026)

Unmodified local Forge and ManaBot WASM from PR #76; personal Anowon and
Helga Commander decks:

- Teacher games 20511 and 20512 completed. There were **26 training** and
  **16 held-out** cast-choice decisions. Training agreement **13/26 (50%)**,
  whole-game validation agreement **7/16 (43.75%)**. A trivial first-cast
  baseline achieved **8/16 (50%)** agreement on the held-out game.
  **No demonstrated advantage.**
- Two unseen games (20513 and 20514) completed with learned seats 0 and 1.
  The learned policy changed **2 and 7 cast choices**, respectively.
  There were **zero cancelled mana payments** in either game. Without
  learning, both games also ended normally with **the same winners**.
  This verifies functional integration, not superior game strategy.
- Tests: node --test scripts/engine-bench/learned-policy.test.mjs.
  They cover viewer-visible action filtering, schema rejection, deterministic
  training and whole-game validation.

## Boundaries and next experiments

This model has no card-specific representation, deck-specific synergy or
long-horizon planning, and the 2-game teacher dataset is insufficient.
Its agreement is currently worse than a trivial baseline. The wrapped
teacher also tracks its originally proposed action even when overridden;
this could affect anti-loop decisions on later prompts. Consequently the
learned flag must stay **off by default**. Do not merge it into the actual
iPad play flow without stronger evidence.

Next: larger diverse training games; acquire Forge's real teacher choices
or self-play rewards; measure win rate, timeouts, cancelled payments and
decision latency on unseen decks; port only a demonstrably useful scorer to
the WebAssembly bot. Do not put a general LLM into the decision loop.

**Privacy:** traces contain the current player's viewer-filtered game
state including their hand. Keep traces and personal deck exports local,
do not commit them or attach them to a pull request. A weights-only
model and aggregate measurements are sufficient to share.

## Continuation: population training and real A/B (5 November 2026)

The population runner can now assign **learned A** versus either a baseline
ManaBot build (two comma-separated --wasms paths) or Forge's built-in AI
(one --wasms path). A rotates through both seats. It writes a
population-plan.json manifest with the exact configuration and model
contents: resuming from a changed model, seed plan or engine path fails rather
than mixing results. --summarise restores the saved seed/seat plan.

Collect more independent ManaBot teacher games and train with complete-game
holdouts. Keep raw traces outside the repository. Using a persistent path
under $HOME also works with isolated long-running systemd jobs, whose /tmp
is not necessarily visible to other processes:

~~~sh
DATA="$HOME/.local/state/manabrew-learning"
node scripts/engine-bench/manabot-pop.mjs \
  --engine packages/forge-wasm --wasms src/wasm,src/wasm \
  --personal-decks dist/personal-decks.json \
  --decks personal:anowon-rogues,personal:helga-skittish-seer \
  --seats 2 --seed-base 22011 --games 8 --jobs 2 --timeout 65 \
  --trace chooseAction --out "$DATA/teacher-a"

node scripts/engine-bench/train-learned-policy.mjs \
  --trace-dir "$DATA/teacher-a" --out "$DATA/model-v2.json"

node scripts/engine-bench/manabot-pop.mjs \
  --engine packages/forge-wasm --wasms src/wasm,src/wasm \
  --personal-decks dist/personal-decks.json \
  --decks personal:anowon-rogues,personal:helga-skittish-seer \
  --learned-model "$DATA/model-v2.json" \
  --seats 2 --seed-base 23011 --games 12 --jobs 2 --timeout 70 \
  --out "$DATA/model-v2-vs-manabot"
~~~

In --trace-dir mode, the trainer requires a matching completed game-<seed>.json
with outcome.reason == "game:over". Timed-out/crashed games are excluded,
and the last 20% of completed games are held out (or choose
--holdout-games N). Do not treat individual prompts from one game as
independent holdout samples.

Actual local evidence for the Anowon/Helga matchup, unchanged PR #76
Forge/ManaBot WASM:
- 8 teacher games at seeds 22011..22018; **7 completed, 1 timed out**.
- 5 whole training games supplied **162 cast-choice examples**; 2 held-out
  games supplied **68**. Agreement with the ManaBot teacher was
  **65.43% training / 60.29% holdout**, versus **33.95% / 38.24%**
  for the first-cast baseline.
- 12 never-trained A/B matches at seeds 23011..23022, policy A versus the
  **unchanged same-build ManaBot B**, rotating seats: **6:6 wins**,
  **12/12 finished**, **89 changed cast decisions out of 221 eligible**.
  This is **no demonstrated game-strength improvement**. No model is
  promoted to the normal client on these results.

The example model committed as experimental-cast-v1.model.json remains the
small two-game *smoke-test* policy; the larger v2 training model is kept
local until a meaningful improvement in playing strength is established.
Training to imitate the existing bot has a clear ceiling. Better reward
signals, stronger teachers, realistic game-state features and testing on
unseen deck archetypes are still needed before an iPad integration.

A Forge-AI comparator is also available. Omit the second WASM directory
so the B seats use the **real internal Forge AI** rather than another
ManaBot build:

~~~sh
node scripts/engine-bench/manabot-pop.mjs \
  --engine packages/forge-wasm --wasms src/wasm \
  --personal-decks dist/personal-decks.json \
  --decks personal:anowon-rogues,personal:helga-skittish-seer \
  --learned-model "$DATA/model-v2.json" \
  --seats 2 --seed-base 24011 --games 2 --jobs 2 --timeout 75 \
  --out "$DATA/model-v2-vs-forge"
~~~

Smoke run, seeds 24011 and 24012: **2/2 complete, Forge AI won both**,
with learned A rotating seats and **13 changed cast choices out of 30
eligible**. Only two matches: a functional comparison, not a strength
estimate. Forge's internal seat actions do not go through the external
ManaBot adapter; the population summary's cast/ability counters for Forge
slots are therefore zero even though Forge plays cards. Only wins and
game outcomes are comparable in that mode.

The population manifest checks configured paths and model contents, not
the bytes of a recompiled engine/WASM at the same path. Keep build
artifacts pinned and use a fresh output directory after any rebuild.

## Experimental Forge AI teacher capture (5 November 2026)

The third opponent now has its **first direct Forge teaching source**.
This is a deliberately narrow, opt-in observer of Forge's own
`PlayerControllerAi.chooseSpellAbilityToPlay()`; it does not replace
Forge's choice or change the rules. It records only when the AI selected a
single spell/land from two or more distinct, uniquely identifiable cast
options also offered by the harness ActionSpace for that seat.

The snapshot is taken **before** Forge decides and is serialized through
the existing viewer-filtered GameView for that exact AI seat. Options not
visible to that viewer or with multiple ambiguous modes are omitted.
An observed choice must still match one of the recorded options. There
is no full Forge-AI action policy export: combat, targeting, mulligans,
passing, or alternative-mode choices are **not** trained here.

The capture flag is false by default. It operates only on
`forgeTeacherTrace: true` start requests from the test runners.
The Java harness writes one compact `[forge-teacher]` JSON record per
qualified choice to **stderr**, leaving its stdout RPC protocol intact.
A WebImage rebuilt from this Java source forwards those stderr messages
through its existing `forge:log` channel. The Node runner filters and
validates them before recording local training examples; it reports
`teacher_trace_empty` rather than falsely reporting success when an old
WebImage ignores the flag.

### Reproduce with the JVM harness

Build the modified Forge harness with the Java toolchain, without deploying
it. From `apps/manabrew`:

~~~sh
node scripts/harness.mjs build
python3 scripts/engine-bench/forge-jvm-game.py \
  --seats 2 \
  --decks kaalia_regression_commander,starter_deck_animar \
  --seed 34011 --policy greedy --forge-teacher-trace \
  --out target/forge-teacher-34011.jsonl

node scripts/engine-bench/train-learned-policy.mjs \
  --traces target/forge-teacher-34011.teacher.jsonl \
  --out target/forge-teacher-demo.model.json
~~~

For a valid *holdout*, repeat with different seeds/Commander decks and
provide comma-separated independent `.teacher.jsonl` files, leaving
the final game out of training. Do not mix ManaBot-labelled traces and
Forge-labelled traces: the trainer explicitly rejects mixed sources.
`agreementWithTeacher` is an imitation metric, not a win-rate metric.

### Verified JVM experiment

The rebuilt Java Forge harness passed Maven compilation, Checkstyle and
its existing regression tests. Three independent Commander JVM runs
(seeds 34011, 34012, 34013) produced **4, 7 and 12** matching visible
Forge cast-choice samples, respectively (**23 total**). A source-level
and runtime inspection of the first four examples found **zero opponent
hand identities** and confirmed that each chosen card was included in
the recorded action menu.

The offline softmax trainer processed the three real files:
**11 training decisions** across two games, **12 held-out decisions**
from the third; **58.33%** held-out Forge-choice agreement versus
**16.67%** for the first-cast baseline. These sample counts are far
too small to establish generalisation or strategic strength. Neither
raw traces nor this tiny generated model is committed.

### WebImage/Node benchmark use

Once the **Java WebImage engine is rebuilt** from this branch, the
existing Forge/ManaBot headless runner can capture the same data:

~~~sh
node scripts/engine-bench/manabot-game.mjs \
  --engine packages/forge-wasm --wasm src/wasm \
  --decks personal:anowon-rogues,personal:helga-skittish-seer \
  --forge-ai-seats 1 --seed 34021 --timeout 90 \
  --forge-teacher-trace-file /tmp/forge-teacher-34021.jsonl \
  --out /tmp/forge-teacher-34021.json
~~~

A Forge-teacher population uses
`manabot-pop.mjs --forge-teacher-trace true` and a **single**
`--wasms` path (B seats are Forge AI). Samples live beside results as
`game-<seed>.trace.jsonl`; `train-learned-policy.mjs --trace-dir`
only considers those with a matching completed game result.

**Limits:** the harness's legal-action enumeration is not necessarily
identical to the internal Forge AI's own search candidates. Its extra
payability/static checks can affect latency or game timing, even
though the observer is disabled for ordinary players. A raw Forge
viewer-filtered snapshot still includes the observing AI's own hand;
keep traces outside Git. Do not promote this limited policy to iPad
or claim a better opponent until much larger unseen-deck benchmarks
and a WebImage-level capture test succeed.

### First unseen-deck Forge opponent smoke test

The 3-game Forge-teacher model was tested without any new teacher tracing
in the existing headless Forge WebImage. Against Forge's built-in AI using
the personal **Anowon** and **Helga** Commander decks, unseen seeds
35011..35014 ended normally in **4/4 cases**, with **2 wins for the learned
ManaBot wrapper and 2 for Forge AI**. The new model reranked **26 of 59**
eligible cast decisions. In this tiny series the Anowon seat won all four
games, regardless of which policy controlled it; a 2:2 aggregate is therefore
especially uninformative about strategy. **No performance improvement
is claimed.** This only tests that the trained weight file is usable
against real Forge AI in the already working headless game loop, not
that the Java teacher-trace feature works in WebImage. The latter
still requires a separate WebImage rebuild and end-to-end test.
### Personal Commander / partner import

The JVM driver accepts the same `dist/personal-decks.json` export as the
WASM benchmark. It expands the 99, adds the separate commander entries
to the Forge start deck (the JVM harness moves them to the command zone),
and retains **both** partner commanders. Missing slugs or a non-Commander
format cause an explicit error.

~~~sh
python3 scripts/engine-bench/forge-jvm-game.py \
  --seats 2 --personal-decks dist/personal-decks.json \
  --decks personal:magar-of-the-magic-strings,personal:malcolm-breeches-pirates \
  --seed 34025 --policy greedy --forge-teacher-trace \
  --out target/forge-teacher-personal-34025.jsonl
~~~

Live JVM evidence on the corrected loader and rebuilt harness:
- Anowon versus Helga, seed 34024: **16** Forge-teacher samples.
- Magar versus Malcolm/Breeches, seed 34025: **8** samples.
- Reversed Helga/Anowon, seed 34026: **10** samples.
- Reversed Malcolm/Breeches/Magar, seed 34027: **12** samples.

All four JVM jobs exited successfully, with Forge's real AI occupying
the second seat. All four distinct personal deck leaders were tested as
teacher opponents, including the Malcolm/Breeches partner deck.

One larger *exploratory* split across eight Forge teacher runs (four
preset and four personal) used **61 training decisions** from six runs
and **20 held-out decisions** from the two Magar/Pirates runs. Agreement
with Forge was **72.13% training / 50.00% holdout**, compared with
**37.70% / 30.00%** for first-cast. The 20-example holdout remains
too small for a game-strength claim. Generated weights and raw traces
remain under ignored `target/` rather than entering Git.
### Unseen Magar/Pirates A/B smoke

The 8-run model was also tested in **four new full Forge WebImage games**
(seeds 36011..36014) on the held-out Magar and Malcolm/Breeches
archetypes. Learned wrapper versus the unchanged internal Forge AI:
**2:2 wins; all four games completed; 31 changed cast selections out of
49 eligible**. Malcolm/Breeches (seat 1) won each game, independently
of which policy controlled that seat. This remains a functional smoke
test and provides **no evidence of a stronger strategy**.

All **81** real Forge-teacher examples from the eight capture runs were
also checked for selected IDs present in the offered action menu,
viewer-visible card references, and opponent-hand identity leakage:
**0 invalid actions and 0 opponent-hand identities**. This verifies
these recorded examples; it is not a guarantee about every future card
mechanic or WebImage build.
### Review follow-up: stable cast identities and trace provenance

The learned retry guard now records the card ID, not Forge's positional
`prompt-action-N` ID. Reordered actions do not suppress unattempted cards.
Traces captured with both `--learned-model` and `--trace chooseAction`
record the **original ManaBot choice** under `decision`, its source as
`teacher: "manabot"`, and the action actually submitted to Forge under
`executedDecision`. The trainer only learns from `decision`.
A `--summarise` run restores `forgeTeacherTrace` from the saved population
plan rather than silently dropping its metrics.

Smoke check: seed 36121 with personal Anowon/Helga decks ended in
`game:over`, one learned override; all 248 trace rows carried the ManaBot
teacher label, one row differed between teacher and executed decision,
and no labelled action was absent from its prompt. Nine Node tests passed.
### Correcting ManaBot's attempt memory after a learned override

The optional learned-cast wrapper now requires a **recompiled** ManaBot
WASM exposing `reconcile_cast_attempt()`. When ManaBot proposes cast A,
the baseline SimpleAi immediately marks A as attempted. If the learned
policy replaces A with cast B, the wrapper must atomically remove A and
record B in SimpleAi's own per-turn attempted-action set. Otherwise A can
disappear from further proposals for the rest of that turn even though
it was never played. The override only happens if the reconciler finds
both cast actions in the current Forge prompt and confirms the change;
otherwise ManaBot's original decision is executed unchanged. Ordinary
ManaBot behavior and all other prompt kinds remain unchanged.

Verification with the newly compiled `src/wasm/wasm_bg.wasm`:
- `cargo test -p manabot --lib`: **23/23 passed**, including the new
  regression demonstrating that the original spell stays eligible,
  the executed one is marked, and duplicate/unknown reconciliation
  is rejected.
- `rustfmt --check`, **9/9 Node tests**, and the WASM release compilation
  succeeded; the compiled JS exports the new method.
- Four previously unseen, seat-rotated Anowon/Helga Commander games
  (seeds 37221–37224) played the experimental policy against the
  *same new* unmodified ManaBot build: **4/4 normally completed**,
  **3:1 wins**, **30 changes among 73 eligible casts**. This is a
  behavioral smoke test, **not** evidence of better play from only
  four games.

Use a build with the new interface for both sides of these experiments;
using the old ManaBot WASM with `--learned-model` now fails visibly
before the game rather than silently using incorrect anti-loop state.
This WASM build and these models are local test artifacts only.
No running iPad/Linux service was modified.
