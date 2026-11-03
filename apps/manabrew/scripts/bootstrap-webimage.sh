#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
podman_bin="${PODMAN:-podman}"
image="ghcr.io/witchesofthehill/manabrew-web@sha256:5dcc8cbebeef5ac2df7f04990e5578932f4730c2a136eabf9e6bc7993db678bb"
tmp="$(mktemp -d)"
container=""
cleanup() {
  if [[ -n "$container" ]]; then "$podman_bin" rm "$container" >/dev/null; fi
  rm -rf -- "$tmp"
}
trap cleanup EXIT

"$podman_bin" pull "$image"
container="$("$podman_bin" create "$image")"
"$podman_bin" cp "$container:/srv/manabrew/assets/forgeharness-C1uILKAp.js" "$tmp/forgeharness.js"
"$podman_bin" cp "$container:/srv/manabrew/assets/forgeharness.js-BSlW-Qu4.wasm" "$tmp/forgeharness.js.wasm"
printf "%s  %s\n" "c26008e9739288925cde3e2f1b7a218d4b74b26e02be48bbb8def9cd867dd6be" "$tmp/forgeharness.js" | sha256sum --check --status
printf "%s  %s\n" "26bc784880a11d3982af007339f6b62be7190d1606d6ab3aa0f8cea1db0fb1cf" "$tmp/forgeharness.js.wasm" | sha256sum --check --status
install -m 0644 "$tmp/forgeharness.js" "$root/packages/forge-wasm/forgeharness.js"
install -m 0644 "$tmp/forgeharness.js.wasm" "$root/packages/forge-wasm/forgeharness.js.wasm"
echo "Forge WebImage staged from verified v3.69.0 image into ignored package artifacts"
