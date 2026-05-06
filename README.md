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

Build that tree with `styio-platform`'s release publisher, archive it as a
release-root bundle, upload the bundle to a GitHub Release, then run the Pages
workflow with the bundle inputs. The workflow extracts the bundle into the
Pages deployment artifact, so binaries do not enter Git history.

See [docs/release-hosting.html](docs/release-hosting.html) for the operator
flow and [docs/install.html](docs/install.html) for user-facing install notes.
