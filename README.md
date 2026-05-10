# styio.io

Static website, documentation, and release-root publishing workflow for Styio.

This repository is intentionally small:

- `styio.io` serves the public website and install documentation.
- `tools/spio/install-spio.sh` is the stable installer entrypoint.
- GitHub Releases store release-root bundles that contain prebuilt binaries.
- GitHub Pages publishes the site and, when a release-root bundle is supplied,
  exposes the static paths expected by current `spio` clients.

The repository must not track large binary artifacts. Prebuilt CLI binaries
belong in GitHub Release assets or generated Pages deployment artifacts.

## Local Preview

```sh
scripts/build-site.sh
python3 -m http.server 8080 --directory _site
```

Then open `http://127.0.0.1:8080`.

## Install Command

Use this after the Pages site has been configured for `styio.io`:

```sh
curl -fsSL https://styio.io/tools/spio/install-spio.sh | sh -s -- --base-url https://styio.io && spio install styio@latest --prebuilt-only && styio --version
```

If `packages.styio.io` is later pointed at the same Pages deployment or a CDN
mirror, the base URL can be changed without changing the release-root layout.

The repository is configured for GitHub Pages workflow deployments. The custom
domain is stored in the GitHub Pages repository setting; the checked-in `CNAME`
file is only a visible domain marker for maintainers.

## Release-Root Bundle Flow

Current `spio` clients expect a static read root with paths such as:

```text
tools/spio/channel/latest/<platform>/version
tools/spio/releases/<version>/<platform>/spio
tools/styio-linux/channel/stable/<platform>/version
tools/styio-linux/releases/<version>/<platform>/styio
tools/styio-macos-cli/channel/stable/<platform>/version
tools/styio-macos-cli/releases/<version>/<platform>/styio
```

Use separate names for the three release layers:

- CLI package tags use `spio-v<semver>`.
- Compiler package tags use `styio-v<semver>`.
- Static deployment snapshots use `release-root-YYYY.MM.DD.N`.

Build the `tools/` tree with `styio-platform`'s release publisher, package it
with metadata, publish it as a GitHub Release asset, then deploy Pages from that
asset:

```sh
scripts/package-release-root.sh \
  --root /path/to/release-root \
  --id release-root-2026.05.09.1 \
  --output output/styio-release-root-2026.05.09.1.tar.gz
```

The `Release Root` workflow can then validate the tarball, create or update the
GitHub Release, and trigger the `Pages` workflow with the published asset. The
Pages workflow extracts the bundle into the deployment artifact, so binaries do
not enter Git history.

See [docs/release-hosting.html](docs/release-hosting.html) for the operator
flow and [docs/install.html](docs/install.html) for user-facing install notes.
