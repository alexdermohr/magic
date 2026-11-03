#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
forge="$root/forge"
pin="be9e0c8a5b561ae3e909c2f9a8bdac0a7fa2b097"
url="https://github.com/witchesofthehill/forge.git"

if [[ "${1:-}" == "--print-pin" ]]; then
  printf "%s\n" "$pin"
  exit 0
fi
if [[ -e "$forge" && ! -d "$forge/.git" ]]; then
  if [[ -n "$(ls -A "$forge")" ]]; then
    echo "Refusing to overwrite a non-empty Forge directory without Git metadata" >&2
    exit 1
  fi
fi
mkdir -p "$forge"
if [[ ! -d "$forge/.git" ]]; then
  git -C "$forge" init -q
  git -C "$forge" remote add origin "$url"
fi
remote="$(git -C "$forge" remote get-url origin)"
if [[ "$remote" != "$url" ]]; then
  echo "Unexpected Forge origin: $remote" >&2
  exit 1
fi
current="$(git -C "$forge" rev-parse --verify HEAD 2>/dev/null || true)"
if [[ -n "$current" ]]; then
  if [[ "$current" != "$pin" ]]; then
    echo "Existing Forge checkout is on $current, not pinned $pin; preserving it" >&2
    exit 1
  fi
  if [[ -n "$(git -C "$forge" status --porcelain)" ]]; then
    echo "Existing pinned Forge checkout contains modifications; preserving it" >&2
    exit 1
  fi
  echo "Forge pinned checkout already ready: $pin"
  exit 0
fi
git -C "$forge" fetch --depth=1 --filter=blob:none origin "$pin"
git -C "$forge" checkout --detach "$pin"
actual="$(git -C "$forge" rev-parse HEAD)"
[[ "$actual" == "$pin" ]] || { echo "Forge pin mismatch: $actual" >&2; exit 1; }
echo "Forge pinned checkout ready: $actual"
