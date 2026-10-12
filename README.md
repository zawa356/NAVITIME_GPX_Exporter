# NAVITIME GPX Exporter

![NAVITIME GPX Exporter application icon](artwork/icon-source.png)

**Export recorded rides and saved planned routes from NAVITIME Touring Supporter to GPX 1.1 — directly in your browser.**

[![CI](https://github.com/zawa356/NAVITIME_GPX_Exporter/actions/workflows/ci.yml/badge.svg)](https://github.com/zawa356/NAVITIME_GPX_Exporter/actions/workflows/ci.yml)
![Version](https://img.shields.io/badge/version-0.1.0--prerelease-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Browser](https://img.shields.io/badge/browsers-Firefox%20%7C%20Chrome%20%7C%20Edge-informational)

> [!IMPORTANT]
> **Unofficial community tool, not affiliated with NAVITIME JAPAN.**
> Initial **v0.1.0 prerelease**; Firefox AMO listing requires Mozilla review before public installation. Only use with your own logged-in account.

## Features / 主な機能

- 🌐 Browser toolbar popup: preview the active recorded ride or saved planned route and save **one item at a time**.
- 🗺️ Recorded rides: GPX 1.1 retaining point order, coordinates, timestamp, altitude and original track segments.\n- 🧭 Saved routes: GPX 1.1 retaining detailed route geometry, omitting missing altitude/timestamps, and merging only identical segment-boundary vertices.
- 🔐 No developer-hosted backend, analytics, tracking or credential collection.
- 🧩 Service adapter structure enables future NAVITIME product support without rewriting the GPX serializer.
- 🛠️ Error diagnostics are opt-in to copy and omit private ride details.
- 🦊 Firefox, Chrome and Edge build artifacts from the same source.

## Quick Start / クイックスタート

**Requirements:** Node.js 20+, `npm`, `zip` and ImageMagick (`magick` or `convert`) to generate icons. The GitHub Actions builder provides the ready-to-install packages. A logged-in NAVITIME Touring Supporter account.

```bash
git clone https://github.com/zawa356/NAVITIME_GPX_Exporter.git
cd NAVITIME_GPX_Exporter
npm run ci
```

Load your chosen **unpacked** extension folder from `dist/`:

| Browser | Development installation |
| --- | --- |
| Firefox | `about:debugging` → This Firefox → Load Temporary Add-on → `dist/firefox/manifest.json` |
| Chrome | `chrome://extensions` → Developer mode → Load unpacked → `dist/chrome` |
| Edge | `edge://extensions` → Developer mode → Load unpacked → `dist/edge` |

Then:

1. Sign in to `https://web.moto.touring.navitime.jp/`.
2. Navigate to your Biography → **ride log detail** (URL includes `/users/me/biography/touring/detail/?id=...`).
3. Click the extension toolbar icon. Confirm the title and **record date**.
4. Click **GPXを保存**. For ride logs, the filename uses actual ride start date/time; for saved routes, it uses the route title without inventing a start time.
5. Import the downloaded GPX into a compatible map app.

**Note:** the record date shown before download is not necessarily the exact ride start time. The GPX metadata and filename use the actual start timestamp obtained on export.

### Supported Touring Supporter pages

| Content | Page URL structure | Output |
| --- | --- | --- |
| Recorded GPS ride | `/users/me/biography/touring/detail/?id=...` | GPX track with source timestamps and altitudes |
| Saved planned route | `/routes/view/?id=...` | Detailed GPX track with no per-point time or elevation |

**Saved planned routes:** the Firefox 0.0.2 export was checked against a private HAR (2,614 of 2,614 ordered points); Chrome and Edge tests of planned-route export remain incomplete. Only the known, currently displayed route is queried. No background network sniffing.

### Example filenames

- Recorded ride: `2026-10-10_122726_10月10日のツーリング.gpx`
- Saved planned route: `保存ルート_週末ツーリング.gpx` The filename uses the source's local offset-aware ride start time **only for actual rides**. Recorded GPX timestamps are converted to UTC without changing the instant. Coordinates and elevation are not geodetically transformed.

## Supported and unsupported

**v0.1.0 scope:** Touring Supporter web *recorded-ride details* and *saved planned-route details* (experimental pending three-browser live acceptance), one item per click. No batch export, arbitrary map extraction, generic navigation, or direct mobile-app access.

**Future candidates, not promised:** Car NAVITIME, Drive Supporter, Truck Car NAVITIME, Bicycle NAVITIME, Speed Meter and others. Each requires independent feasibility and policy assessment; no permissions are requested for them yet.

**Known limitations:** undocumented service endpoints can change; planned saved routes do not contain timestamps or elevation; navigation or tab closure during export cancels output; the source altitude is preserved without validation against terrain height; browser popup may close while export proceeds. Some additional browser acceptance and GPX XSD tests are still pending; see docs/RELEASE_CHECKLIST.md. Mozilla AMO submission/review is separate and not yet confirmed.

## Architecture

```text
popup UI → content-script controller → touring-supporter adapter
                                        ↓
                                 normalized Track
                                        ↓
                                 GPX 1.1 serializer
                                        ↓
                                  browser download
```

See [saved-route design and evidence](docs/PROPOSALS/SAVED_ROUTE_EXPORT.md), [architecture](docs/ARCHITECTURE.md), [requirements](docs/REQUIREMENTS.md), [development log](docs/DEVELOPMENT_LOG.md), [changelog](docs/CHANGELOG.md), and [release checklist](docs/RELEASE_CHECKLIST.md).

## Release v0.1.0 / AMO publication

A manually triggered [Release / AMO](.github/workflows/release.yml) GitHub Actions workflow builds and checks all three browser packages, runs Mozilla's official `web-ext` linter, prepares a human-readable source archive, and can submit to AMO API v5 in the **listed** channel.

- `github`: create or reuse a GitHub **prerelease** with developer ZIPs and source.
- `github-and-amo`: submit to AMO for Mozilla review and create/reuse the same GitHub prerelease.

The AMO API credentials are **GitHub Actions Secrets**, never files committed to the repository. Set `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` once in **Settings → Secrets and variables → Actions**, then use **Actions → Release / AMO → Run workflow** on the `main` branch. This is not run automatically on normal pushes. Confirm the registered AMO add-on GUID matches the Firefox manifest ID before submitting.

See [AMO publishing runbook](docs/AMO_PUBLISHING.md) and [0.1.0 release notes](docs/RELEASE_NOTES_0.1.0.md). Submitting to AMO does **not** mean Mozilla has approved public distribution.

## Development

First release candidate package version: **0.1.0**. Each GitHub Actions run provides Firefox, Chrome and Edge ZIPs. Do not reuse previous builds when checking changes. Development Git tags `0.0.x` label individual commit milestones, not independently published extension releases.


```bash
npm run check  # JavaScript syntax
npm test       # regression tests using synthetic routes
npm run build  # dist/{firefox,chrome,edge}, plus ZIP packages
npm run ci     # all three
```

CI runs on pushes and pull requests and archives ZIPs plus the 512px store listing icon as build artifacts. The logo is included in the repository under `artwork/icon-source.png`; the build automatically renders PNGs in `dist/<browser>/icons/`, referenced by `manifest.json` `icons` and `action.default_icon`. The store listing icon is generated at `dist/store-assets/icon-512.png`. No manual icon registration is needed when installing the unpacked extension. It never fetches user accounts, logs, or private track data. **Do not commit or open GitHub Issues with HAR files, authentication tokens, private tracks or exported GPX.**

## Privacy, support, license

- [Privacy policy](docs/PRIVACY_POLICY.md)
- [Security and responsible reporting](docs/SECURITY.md)
- [MIT License](LICENSE)
- [Issues](https://github.com/zawa356/NAVITIME_GPX_Exporter/issues)

Contributions and bug reports are welcome, but no ongoing functionality or compatibility guarantee is provided. Maintainer and project are not affiliated with NAVITIME JAPAN.
