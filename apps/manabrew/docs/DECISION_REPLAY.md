# Decision journal and rewind

PvP and external Manabot games use `decisionJournal` and `journalRewind`.
The Journal tab shows redacted consumed decisions from `gameView.checkpoints`;
Forge AI games retain legacy snapshots by default. Internal Forge AI
journal/replay is normally rejected. The explicit, experimental
`experimentalInternalAiReplay: true` start parameter now permits a
**seeded, journaled proof run only**. It is not enabled by the PWA,
and does not establish a general crash-safe savegame: the browser still
lacks durable journal delivery, an atomic local save boundary and a
verified reload/restore UI. The JVM roundtrip regression
yarn test:forge-ai-replay runs a seeded AI game, records a verified
journal boundary and the expected future decisions, atomically writes
the private checkpoint to a 0600 file with fsync, then kills the
source JVM before starting an independent process to restore the
saved checkpoint. It compares subsequent prompts and human-visible
views with the original run. The --personal-decks option adds a real
Anowon/Gahiji Commander matchup; --seed-count 2 repeats both fixtures
with independent seeds. It rejects corrupted checkpoints, and
deletes the sensitive private snapshot file. Replays can still diverge on untested
cards/AI paths and must fail closed rather than fabricate a recovered game.

## Reconstruction and promotion

An approved restore vote freezes the authoritative engine. A fresh worker/process
replays the selected prefix from the original start request and seed, checking
every prompt, deciding seat, state witness and RNG position. The candidate becomes
authoritative only after terminal verification and publication of its final views.
Then the source is terminated. Failure disposes of the candidate and resumes the
source. There is no idle spare or shadow engine.

- Browser/WebView: `forge-engine.worker.js` supervises the engine and buffers
  candidate SABs until `forge:replay_ready`. Directive lanes and queued directives
  survive promotion; prompt IDs advance so stale responses cannot be accepted.
- JVM/native: `journal_engine.rs` owns subprocess reconstruction and promotion.
  Replay has a 120-second total deadline; subprocess RPCs have 60-second deadlines
  and poll cancellation every 20 ms. Failed transports are killed and reaped,
  because their uncorrelated late replies cannot safely be reused.
- Ending the game or losing the authoritative worker cancels reconstruction.
  A queued non-restore directive prevents native promotion.

Forge global IDs and caches require one journal game per worker/process. Never
reconstruct inside the authoritative engine. Rewind temporarily holds two engines
and their card databases; container memory must allow for concurrent candidates.

## History and verification

`DecisionHistory` retains at most 64 MiB or 50,000 consumed inputs. Reaching the cap
stops recording but preserves rewind within the retained prefix. Successful rewind
discards the abandoned suffix. Votes and rewind requests are orchestration, not
recorded gameplay inputs. Full journals and witnesses contain hidden information
and must remain private to the engine host.

Verification covers canonical prompts, every seat's view, spectator state, ordered
card identities in all zones (including libraries), and the primitive RNG stream.
It is not a serialization of every Forge field: delayed triggers and stack locals
are reconstructed by execution. Tests must compare continued play, not only the
restored board. Cross-runtime, cross-artifact and cross-version replay are unsupported.

Threaded RPCs read immutable views published by the game thread before prompts,
revisions and game over; they must never traverse live Forge zones. During replay,
UI views and checkpoint rows are deferred until the destination. Per-input
verification and remembered-hand updates still run.

## Delivery API

`DecisionJournal` records inputs before dispatch. Version 2 batches contain the
exact `startRequest`, then ordered entries with `sequence`, `playerIndex`,
`prompt`, `action` and `verification`. Consumers choose either drained delivery or
`readDecisionJournal` plus cumulative `acknowledgeDecisionJournal`; never mix modes.
Acknowledgement cannot exceed the prefix already read. Retries and duplicate
acknowledgements are supported.

The delivery queue is limited to 4096 entries or 8 MiB. Overflow or legacy snapshot
restoration invalidates delivery explicitly. This queue is separate from retained
interactive history. `decisionJournalCommitBarrier` holds startup until sequence 0
is acknowledged and holds each decision until its own acknowledgement; acknowledge
only after durable receipt. Interactive rewind owns delivery and rejects this flag.

`exportReplaySnapshot` packages a pending boundary and prefix;
`restoreReplaySnapshot` reconstructs and verifies it in an isolated JVM. Export is
queued on the game thread, so acknowledge pending commit barriers first. Snapshots
pin the harness artifact, assets and effective preferences; these must remain
immutable during a session. Durable storage and host takeover are separate work.

## Regression check

`JournalRewindTest` (run by `yarn build:harness`) plays a seeded two-seat game with
dungeon venture and +1/+1 counters through turn 12 in one harness process,
rewinds to the first decision of turn 10, and reconstructs it in a second process.
Every later prompt and every seat's and the spectator's view must match the original
through the end of turn 12. A fixture that no longer adds counters or dungeon progress
after the target fails rather than passing with weaker coverage.
`ReplayOrderingTest` keeps Room choice order independent of JVM identity hashes.

`yarn test:forge-rewind [--native <node binary>]` (`scripts/forge-tests/rewind.mjs`)
rewinds the JVM, native or container engine, checks continued play, and checks that a
failed or corrupted rewind resumes the original game unchanged and that a pending
concede cancels promotion.

`journal_engine` unit tests cover node promotion, hung or crashed candidates and process
cleanup. `yarn test:forge-supervisor` covers browser worker promotion and teardown.


**Proof receipt (9 November 2026, JVM only):** Two independent seeds
per fixture passed: Constructed after 35 decisions and 8 further
actions, Commander Anowon vs Gahiji after 55 decisions and 20 further
actions. The original game process was killed before replay and
corrupt terminal witnesses were rejected. The proof JAR was made by
compiling the changed Java classes against a pinned existing JVM
harness, without touching the production PWA.

**Reliability boundary:** A later real replay of the persisted Constructed
fixture at seed 424244 failed at decision 26 with **state=different,
rng=equal**; the verification is computed on the engine game thread,
so this was not merely a discrepancy between two cached UI views.
A subsequent independent replay of that same seed passed. This proves
an intermittent nondeterministic state path that is **not captured by
the ReplayRandom stream**, although its concrete source is still open.
The debug-only JVM property manabrew.replay.debugWitness adds separate
view/zone digests to classify a future divergence without revealing
private card data. The --seed-start argument reruns one specific seed.

**Plausible root mechanism, confirmed in Forge source:** In JVM mode,
AiController evaluates card choices in a separate Game AI Eval thread.
MyRandom is a ThreadLocal that defaults to SecureRandom unless explicitly
seeded on the specific thread. AiController also branches on wall-clock
eval/combat deadlines. Those two mechanisms are not fully represented
by the ReplayRandom witness. WasmMain, by contrast, already sets
forge.synchronous=true *before* Forge classes initialize, making the
AI evaluation use the seeded game thread. Two isolated A/B proofs with
three seeds per fixture (six runs each) passed: explicitly passing the
game RNG into the AI eval thread and running synchronously via
forge.synchronous=true. A third proof using an isolated AI class with
both synchronous eval and no wall-clock cutoff also passed three seeds.
This supports the mechanism but does not independently prove which
path caused the specific intermittent divergence.

**Enforced boundary:** experimentalInternalAiReplay now rejects a
non-synchronous JVM before starting the match. The regression explicitly
verifies this negative path; the three-seed synchronous replay matrix
passed with this guard. The proof still is not product-ready until
browser-Journal delivery, atomic IndexedDB persistence, real WebImage
build and physical Safari restore are verified. Matching seeds are
not a substitute for whole-engine checksums or continuation tests.

Any replay mismatch must abort restoration. Browser crash recovery
still requires durably committed journals, worker restart and real
Safari validation.
