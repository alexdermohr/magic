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

# The reference Forge checkout must stay read-only even while WebImage builds.
# Compile the one patched controller from a disposable source copy, and embed
# it in a disposable copy of the clean harness jar. Never patch forge/ itself.
if [[ -n "${MANABREW_FORGE_AI_PATCH:-}" ]]; then
  if [[ "$MANABREW_FORGE_AI_PATCH" != "commander-pressure" ]]; then
    echo "Unknown MANABREW_FORGE_AI_PATCH: $MANABREW_FORGE_AI_PATCH" >&2
    exit 1
  fi
  forge="$REPO_ROOT/forge"
  patch="$REPO_ROOT/patches/forge-ai-commander-pressure.patch"
  pin="$(scripts/bootstrap-forge.sh --print-pin)"
  [[ "$(git -C "$forge" rev-parse HEAD)" == "$pin" ]] || {
    echo "Unexpected Forge checkout revision; expected $pin" >&2; exit 1;
  }
  [[ -z "$(git -C "$forge" status --porcelain)" ]] || {
    echo "Forge reference checkout must be clean" >&2; exit 1;
  }
fi

node scripts/harness.mjs build

if [[ -n "${MANABREW_FORGE_AI_PATCH:-}" ]]; then
  scratch="$(mktemp -d "${TMPDIR:-/tmp}/manabrew-forge-webimage-XXXXXX")"
  trap 'rm -rf -- "$scratch"' EXIT
  source_path="forge-ai/src/main/java/forge/ai/AiAttackController.java"
  mkdir -p "$scratch/$(dirname "$source_path")" "$scratch/classes"
  cp "$forge/$source_path" "$scratch/$source_path"
  git -C "$scratch" init -q
  git -C "$scratch" apply --check "$patch"
  git -C "$scratch" apply "$patch"

  original_jar="$REPO_ROOT/forge-harness/target/forge-harness-jar-with-dependencies.jar"
  [[ -f "$original_jar" ]] || { echo "Missing clean Forge harness jar" >&2; exit 1; }
  "$JAVA_HOME/bin/javac" -cp "$original_jar" -d "$scratch/classes" "$scratch/$source_path"
  cp "$original_jar" "$scratch/forge-harness-patched.jar"
  "$JAVA_HOME/bin/jar" uf "$scratch/forge-harness-patched.jar" \
    -C "$scratch/classes" forge/ai/AiAttackController.class
  export HARNESS_JAR="$scratch/forge-harness-patched.jar"
  echo "Forge AI patch isolated for WebImage: commander-pressure ($pin)"
fi

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