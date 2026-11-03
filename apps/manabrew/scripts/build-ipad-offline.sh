#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Build the self-contained iPad/Home-Screen PWA from this Magic source checkout.
# Forge source and WebImage are pinned. No running service is modified.
./scripts/bootstrap-forge.sh
./scripts/bootstrap-webimage.sh

corepack_bin="${COREPACK:-corepack}"
"$corepack_bin" yarn install --frozen-lockfile --ignore-scripts --non-interactive
"$corepack_bin" yarn gen:types

if command -v wasm-pack >/dev/null 2>&1; then
  node scripts/build-wasm.mjs
elif command -v nix >/dev/null 2>&1; then
  nix shell "nixpkgs#wasm-pack" "nixpkgs#binaryen" "nixpkgs#lld" --command node scripts/build-wasm.mjs
else
  echo "wasm-pack missing; install it or use Nix." >&2
  exit 1
fi

node node_modules/typescript/bin/tsc -b --pretty false

# Vite clears dist/ on every rebuild. Keep downloaded personal artwork outside
# that directory so a harmless UI edit never causes thousands of CDN requests.
art_cache="${MANABREW_ART_CACHE:-${XDG_CACHE_HOME:-$HOME/.cache}/manabrew-ipad-art}"
mkdir -p "$art_cache"
if [[ -d dist/a ]]; then
  cp -a -n dist/a/. "$art_cache/"
fi
VITE_SCRYFALL_ASSET_BASE=/ node node_modules/vite/bin/vite.js build
node scripts/prepare-ipad-dist.mjs dist
python3 scripts/generate-ipad-personal-decks.py

# Reuse previously downloaded artwork when available; new deck cards are
# resolved against the Scryfall cache and fetched only when necessary.
if [[ -n "${MANABREW_ART_SOURCE:-}" ]]; then
  for directory in a card-symbols backs; do
    if [[ -d "${MANABREW_ART_SOURCE%/}/$directory" ]]; then
      cp -a -- "${MANABREW_ART_SOURCE%/}/$directory" "dist/$directory"
    fi
  done
fi

mkdir -p dist/a
cp -a -n "$art_cache/." dist/a/
python3 scripts/prepare-ipad-card-art.py dist "${MANABREW_SCRYFALL_CACHE:-$HOME/.cache/manabrew-ipad-scryfall-cards.json}"
cp -a -n dist/a/. "$art_cache/"
python3 scripts/prepare-ipad-card-symbols.py dist
node scripts/generate-offline-assets.mjs dist
echo "Offline PWA ready in apps/manabrew/dist; launch behind a COOP/COEP HTTPS file server."
