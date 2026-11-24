#!/usr/bin/env bash
# Build the wasm Forge engine and stage it at packages/forge-wasm/, next to the
# worker; the client and the npm package import all three through the bundler,
# which hashes their names. Used locally (yarn build:forge-wasm)
# and by the web legs of staging-deploy.yml and docker-images.yml. The harness jar is built with the
# same GraalVM that native-image runs from, so no second JDK version has to be
# reconciled with the one Web Image supports.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

: "${WEBIMAGE_GRAALVM_HOME:?point at an Oracle GraalVM with Web Image (--tool:svm-wasm)}"
export JAVA_HOME="$WEBIMAGE_GRAALVM_HOME"
export PATH="$JAVA_HOME/bin:$PATH"

cd "$REPO_ROOT"

# Keep the pinned Forge checkout clean. Compile the WebImage overlays into a
# disposable copy of the harness jar.
patch_kinds=(replay-clock)
if [[ -n "${MANABREW_FORGE_AI_PATCH:-}" ]]; then
  case "$MANABREW_FORGE_AI_PATCH" in
    commander-pressure) patch_kinds+=(commander-pressure) ;;
    commander-block) patch_kinds+=(commander-block) ;;
    commander-pressure,commander-block) patch_kinds+=(commander-pressure commander-block) ;;
    *) echo "Unknown MANABREW_FORGE_AI_PATCH: $MANABREW_FORGE_AI_PATCH" >&2; exit 1 ;;
  esac
fi

forge="$REPO_ROOT/forge"
pin="$(scripts/bootstrap-forge.sh --print-pin)"
[[ "$(git -C "$forge" rev-parse HEAD)" == "$pin" ]] || {
  echo "Unexpected Forge checkout revision; expected $pin" >&2; exit 1;
}
[[ -z "$(git -C "$forge" status --porcelain)" ]] || {
  echo "Forge reference checkout must be clean" >&2; exit 1;
}

node scripts/harness.mjs build

scratch="$(mktemp -d "${TMPDIR:-/tmp}/manabrew-forge-webimage-XXXXXX")"
trap 'rm -rf -- "$scratch"' EXIT
mkdir -p "$scratch/classes"
git -C "$scratch" init -q
original_jar="$REPO_ROOT/forge-harness/target/forge-harness-jar-with-dependencies.jar"
[[ -f "$original_jar" ]] || { echo "Missing clean Forge harness jar" >&2; exit 1; }

patched_sources=()
for kind in "${patch_kinds[@]}"; do
  case "$kind" in
    replay-clock)
      source_paths=(
        forge-core/src/main/java/forge/util/AITimeoutTracker.java
        forge-ai/src/main/java/forge/ai/AiController.java
        forge-ai/src/main/java/forge/ai/AvailableActions.java
        forge-ai/src/main/java/forge/ai/simulation/FlatMonteCarloPicker.java
        forge-ai/src/main/java/forge/ai/simulation/StormSolver.java
      )
      patch="$REPO_ROOT/patches/forge-ai-replay-clock.patch"
      ;;
    commander-pressure)
      source_paths=(forge-ai/src/main/java/forge/ai/AiAttackController.java)
      patch="$REPO_ROOT/patches/forge-ai-commander-pressure.patch"
      ;;
    commander-block)
      source_paths=(forge-ai/src/main/java/forge/ai/ComputerUtilCombat.java)
      patch="$REPO_ROOT/patches/forge-ai-commander-block-threat.patch"
      ;;
  esac
  for source_path in "${source_paths[@]}"; do
    mkdir -p "$scratch/$(dirname "$source_path")"
    cp "$forge/$source_path" "$scratch/$source_path"
    patched_sources+=("$scratch/$source_path")
  done
  git -C "$scratch" apply --check "$patch"
  git -C "$scratch" apply "$patch"
done
"$JAVA_HOME/bin/javac" -cp "$original_jar" -d "$scratch/classes" "${patched_sources[@]}"
cp "$original_jar" "$scratch/forge-harness-patched.jar"
"$JAVA_HOME/bin/jar" uf "$scratch/forge-harness-patched.jar" -C "$scratch/classes" forge
export HARNESS_JAR="$scratch/forge-harness-patched.jar"
mkdir -p "$scratch/probe"
"$JAVA_HOME/bin/javac" -cp "$HARNESS_JAR" -d "$scratch/probe" \
  forge-harness/src/test/java/forge/harness/common/ReplayAiBudgetProbe.java
"$JAVA_HOME/bin/java" -cp "$scratch/probe:$HARNESS_JAR" forge.harness.common.ReplayAiBudgetProbe
echo "Forge AI patches isolated for WebImage: ${patch_kinds[*]} ($pin)"

RES=forge/forge-gui/res
BUNDLE="$REPO_ROOT/target/forge-assets-framed.txt"
cargo run --release -p forge-cardset-archive --features build --bin build-cardset-archive -- \
  "$RES/cardsfolder" "$RES/tokenscripts" "$RES/editions" "$RES/blockdata" \
  "$RES/lists/TypeLists.txt" "$REPO_ROOT/target/forge-cardset.rkyv"
cargo run --release -p forge-cardset-archive --bin emit-forge-assets -- \
  "$REPO_ROOT/target/forge-cardset.rkyv" "$BUNDLE"
FORGE_ASSETS="$BUNDLE" forge-harness/build-wasm.sh "$@"

cp forge-harness/native/wasm/forgeharness.js \
  forge-harness/native/wasm/forgeharness.js.wasm packages/forge-wasm/
echo "staged packages/forge-wasm/forgeharness.js{,.wasm}"