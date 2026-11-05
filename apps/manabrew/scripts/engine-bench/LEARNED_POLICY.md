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
