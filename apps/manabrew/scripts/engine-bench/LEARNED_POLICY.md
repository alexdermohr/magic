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