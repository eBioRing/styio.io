#!/usr/bin/env sh
set -eu

fail() {
  echo "package-release-root: $*" >&2
  exit 1
}

usage() {
  cat >&2 <<'EOF'
usage: package-release-root.sh --root <release-root> --id <release-root-id> --output <tar.gz>

The input root must contain top-level tools/. The output bundle contains
tools/ plus release-root.json metadata and is intended to be uploaded as a
GitHub Release asset.
EOF
}

safe_segment() {
  case "$1" in
    ""|"."|".."|*[!A-Za-z0-9._-]*)
      return 1
      ;;
    *)
      return 0
      ;;
  esac
}

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="$(CDPATH= cd -- "$script_dir/.." && pwd)"
release_root=""
release_root_id=""
output=""

while [ "$#" -gt 0 ]; do
  case "$1" in
    --root)
      [ "$#" -ge 2 ] || fail "--root requires a value"
      release_root="$2"
      shift 2
      ;;
    --id)
      [ "$#" -ge 2 ] || fail "--id requires a value"
      release_root_id="$2"
      shift 2
      ;;
    --output)
      [ "$#" -ge 2 ] || fail "--output requires a value"
      output="$2"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      fail "unexpected argument: $1"
      ;;
  esac
done

[ -n "$release_root" ] || fail "--root is required"
[ -n "$release_root_id" ] || fail "--id is required"
[ -n "$output" ] || fail "--output is required"
safe_segment "$release_root_id" || fail "unsafe release-root id: $release_root_id"

case "$release_root" in
  /*) ;;
  *) release_root="$repo_root/$release_root" ;;
esac
case "$output" in
  /*) ;;
  *) output="$repo_root/$output" ;;
esac

[ -d "$release_root/tools" ] || fail "input root must contain tools/: $release_root"

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT INT TERM

bundle_root="$tmp_dir/release-root"
mkdir -p "$bundle_root"
cp -R "$release_root/tools" "$bundle_root/tools"
find "$bundle_root" -name "._*" -type f -delete

created_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
{
  printf '{\n'
  printf '  "schema_version": 1,\n'
  printf '  "kind": "release-root",\n'
  printf '  "release_root_id": "%s",\n' "$release_root_id"
  printf '  "created_utc": "%s",\n' "$created_utc"
  printf '  "tools": [\n'
  first=1
  for tool_dir in $(find "$bundle_root/tools" -mindepth 1 -maxdepth 1 -type d | sort); do
    tool_name="$(basename "$tool_dir")"
    if [ "$first" -eq 0 ]; then
      printf ',\n'
    fi
    first=0
    printf '    {"name": "%s", "latest_json": "tools/%s/latest.json"}' "$tool_name" "$tool_name"
  done
  printf '\n  ]\n'
  printf '}\n'
} > "$bundle_root/release-root.json"

REQUIRE_RELEASE_BINARIES=1 REQUIRE_RELEASE_METADATA=1 "$script_dir/validate-release-root.sh" "$bundle_root" >/dev/null
mkdir -p "$(dirname "$output")"
tar -C "$bundle_root" -czf "$output" tools release-root.json
printf 'packaged release root: %s\n' "$output"
