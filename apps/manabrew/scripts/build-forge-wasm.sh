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

# Optional strategic Forge AI experiment. Keep the pinned checkout clean again
# even when the WebImage compiler fails, so ordinary builds stay reproducible.
if [[ -n "${MANABREW_FORGE_AI_PATCH:-}" ]]; then
  if [[ "$MANABREW_FORGE_AI_PATCH" != "commander-pressure" ]]; then
    echo "Unknown MANABREW_FORGE_AI_PATCH: $MANABREW_FORGE_AI_PATCH" >&2
    exit 1
  fi
  forge="$REPO_ROOT/forge"
  patch="$REPO_ROOT/patches/forge-ai-commander-pressure.patch"
  pin="$(scripts/bootstrap-forge.sh --print-pin)"
  [[ "$(git -C "$forge" rev-parse HEAD)" == "$pin" ]] || {
    echo "Refusing to patch Forge checkout at an unexpected revision" >&2; exit 1;
  }
  [[ -z "$(git -C "$forge" status --porcelain)" ]] || {
    echo "Refusing to patch an already modified Forge checkout" >&2; exit 1;
  }
  git -C "$forge" apply --check "$patch"
  git -C "$forge" apply "$patch"
  trap 'git -C "$forge" apply --reverse "$patch"' EXIT
  echo "Forge AI patch active: commander-pressure ($pin)"
fi

node scripts/harness.mjs build

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
