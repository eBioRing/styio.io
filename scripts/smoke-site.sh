#!/usr/bin/env sh
set -eu

fail() {
  echo "smoke-site: $*" >&2
  exit 1
}

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="$(CDPATH= cd -- "$script_dir/.." && pwd)"
tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT INT TERM

"$script_dir/build-site.sh" "$tmp_dir/site"

for path in \
  index.html \
  docs/index.html \
  docs/install.html \
  docs/release-hosting.html \
  docs/release-root-contract.html \
  docs/dns-and-pages.html \
  tools/spio/install-spio.sh
do
  [ -f "$tmp_dir/site/$path" ] || fail "missing built site file: $path"
done

if find "$repo_root/tools" -path "*/releases/*" -type f | grep . >/dev/null 2>&1; then
  fail "binary release files must not be tracked under tools/*/releases/"
fi

if LC_ALL=C grep -R -n "[^ -~]" "$repo_root" \
  --exclude-dir=.git \
  --exclude-dir=_site \
  --exclude-dir=.release-bundle \
  --exclude-dir=output \
  --exclude="*.png" >/dev/null 2>&1; then
  fail "non-ASCII text found in source"
fi

printf 'site smoke passed: %s\n' "$tmp_dir/site"
