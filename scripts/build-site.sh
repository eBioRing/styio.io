#!/usr/bin/env sh
set -eu

fail() {
  echo "build-site: $*" >&2
  exit 1
}

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="$(CDPATH= cd -- "$script_dir/.." && pwd)"
site_dir="${1:-$repo_root/_site}"
bundle="${2:-${RELEASE_ROOT_BUNDLE:-}}"

case "$site_dir" in
  /*) ;;
  *) site_dir="$repo_root/$site_dir" ;;
esac

rm -rf "$site_dir"
mkdir -p "$site_dir"

copy_path() {
  source_path="$repo_root/$1"
  [ -e "$source_path" ] || fail "missing site path: $1"
  cp -R "$source_path" "$site_dir/"
}

copy_path ".nojekyll"
copy_path "404.html"
copy_path "CNAME"
copy_path "assets"
copy_path "docs"
copy_path "index.html"
copy_path "robots.txt"
copy_path "styles.css"
copy_path "tools"

if [ -n "$bundle" ]; then
  case "$bundle" in
    /*) ;;
    *) bundle="$repo_root/$bundle" ;;
  esac
  [ -f "$bundle" ] || fail "release-root bundle does not exist: $bundle"

  tmp_dir="$(mktemp -d)"
  cleanup() {
    rm -rf "$tmp_dir"
  }
  trap cleanup EXIT INT TERM

  tar -xzf "$bundle" -C "$tmp_dir"
  [ -d "$tmp_dir/tools" ] || fail "release-root bundle must contain top-level tools/"
  rm -rf "$site_dir/tools"
  cp -R "$tmp_dir/tools" "$site_dir/tools"
fi

"$script_dir/validate-release-root.sh" "$site_dir"
