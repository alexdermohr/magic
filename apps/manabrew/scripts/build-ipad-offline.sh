#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Build the self-contained iPad/Home-Screen PWA from this Magic source checkout.
# Forge source and WebImage are pinned. No running service is modified.
./scripts/bootstrap-forge.sh
corepack_bin="${COREPACK:-corepack}"
"$corepack_bin" yarn install --frozen-lockfile --ignore-scripts --non-interactive
"$corepack_bin" yarn gen:types

if [[ -n "${MANABREW_FORGE_WEBIMAGE_DIR:-}" ]]; then
  for file in forgeharness.js forgeharness.js.wasm; do
    [[ -s "${MANABREW_FORGE_WEBIMAGE_DIR%/}/$file" ]] || {
      echo "Missing Forge WebImage file: $file" >&2; exit 1;
    }
  done
  for file in forgeharness.js forgeharness.js.wasm; do
    install -m 0644 "${MANABREW_FORGE_WEBIMAGE_DIR%/}/$file" "packages/forge-wasm/$file"
  done
else
  graalvm_home="${WEBIMAGE_GRAALVM_HOME:-${XDG_STATE_HOME:-$HOME/.local/state}/manabrew-webimage-toolchain/graalvm-25.3.4.1-dev+0.1}"
  if [[ ! -x "$graalvm_home/bin/native-image" ]]; then
    echo "Offline Forge replay needs a source-built WebImage; set WEBIMAGE_GRAALVM_HOME or MANABREW_FORGE_WEBIMAGE_DIR." >&2
    exit 1
  fi
  if command -v nix >/dev/null 2>&1; then
    nix shell "nixpkgs#maven" "nixpkgs#binaryen" "nixpkgs#gcc" "nixpkgs#openssl" "nixpkgs#pkg-config" --command \
      env WEBIMAGE_GRAALVM_HOME="$graalvm_home" ./scripts/build-forge-wasm.sh
  else
    WEBIMAGE_GRAALVM_HOME="$graalvm_home" ./scripts/build-forge-wasm.sh
  fi
fi
node scripts/verify-forge-browser-resume.mjs

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
# Artwork copied with cp -a may preserve read-only directory modes. Vite must
# be able to remove generated dist contents on the next build; never change
# permissions on the original artwork or any persistent user data.
if [[ -d dist ]]; then
  find dist -type d ! -perm -u+w -exec chmod u+w {} +
fi
VITE_SCRYFALL_ASSET_BASE=/ node node_modules/vite/bin/vite.js build
node scripts/prepare-ipad-dist.mjs dist
scryfall_cache="${MANABREW_SCRYFALL_CACHE:-$HOME/.cache/manabrew-ipad-scryfall-cards.json}"
python3 scripts/generate-ipad-personal-decks.py ../.. dist/personal-decks.json "$scryfall_cache"

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
# Card-art conversion needs Pillow only when new images are fetched.
# On NixOS, use the existing Nix Python environment without changing system packages.
if ! python3 -c 'from PIL import Image' >/dev/null 2>&1 && command -v nix-shell >/dev/null 2>&1; then
  printf -v art_command '%q ' python3 -B scripts/prepare-ipad-card-art.py dist "$scryfall_cache"
  nix-shell -p 'python3.withPackages (ps: [ ps.pillow ])' --run "$art_command"
else
  python3 scripts/prepare-ipad-card-art.py dist "$scryfall_cache"
fi
cp -a -n dist/a/. "$art_cache/"
python3 scripts/prepare-ipad-card-symbols.py dist
node scripts/generate-offline-assets.mjs dist
echo "Offline PWA ready in apps/manabrew/dist; launch behind a COOP/COEP HTTPS file server."