# NAVITIME GPX Exporter

**Export recorded rides and saved planned routes from NAVITIME Touring Supporter to GPX 1.1 — directly in your browser.**

[![CI](https://github.com/zawa356/NAVITIME_GPX_Exporter/actions/workflows/ci.yml/badge.svg)](https://github.com/zawa356/NAVITIME_GPX_Exporter/actions/workflows/ci.yml)
![Version](https://img.shields.io/badge/version-0.0.1--dev-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Browser](https://img.shields.io/badge/browsers-Firefox%20%7C%20Chrome%20%7C%20Edge-informational)

> [!IMPORTANT]
> **Unofficial community tool, not affiliated with NAVITIME JAPAN.**
> Experimental development version, not yet verified for store release. Use only with your own logged-in account.

## Features / 主な機能

- 🌐 Browser toolbar popup: preview the active recorded ride or saved planned route and save **one item at a time**.
- 🗺️ Recorded rides: GPX 1.1 retaining point order, coordinates, timestamp, altitude and original track segments.\n- 🧭 Saved routes: GPX 1.1 retaining detailed route geometry, omitting missing altitude/timestamps, and merging only identical segment-boundary vertices.
- 🔐 No developer-hosted backend, analytics, tracking or credential collection.
- 🧩 Service adapter structure enables future NAVITIME product support without rewriting the GPX serializer.
- 🛠️ Error diagnostics are opt-in to copy and omit private ride details.
- 🦊 Firefox, Chrome and Edge build artifacts from the same source.

## Quick Start / クイックスタート

**Requirements:** Node.js 20+, `npm`, `zip` (for packaged builds). A logged-in NAVITIME Touring Supporter account.

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

**Saved planned routes are still experimental.** The route API's GeoJSON data has been confirmed in one private HAR; the new implementation's real-browser behavior has not yet been approved. Only the known, currently displayed route is queried. No background network sniffing.

### Example filename

`2026-10-10_122726_10月10日のツーリング.gpx`

Recorded ride: `2026-10-10_122726_10月10日のツーリング.gpx`. Planned route: `保存ルート_週末ツーリング.gpx`. The filename uses the source's local offset-aware ride start time **only for actual rides**. Recorded GPX timestamps are converted to UTC without changing the instant. Coordinates and elevation are not geodetically transformed.

## Supported and unsupported

**v0.0.x implementation:** Touring Supporter web *recorded-ride details* and *saved planned-route details* (experimental pending three-browser live acceptance), one item per click. No batch export, arbitrary map extraction, generic navigation, or direct mobile-app access.

**Future candidates, not promised:** Car NAVITIME, Drive Supporter, Truck Car NAVITIME, Bicycle NAVITIME, Speed Meter and others. Each requires independent feasibility and policy assessment; no permissions are requested for them yet.

**Known limitations:** undocumented service endpoints can change; planned saved routes do not contain timestamps or elevation; navigation or tab closure during export cancels output; the source altitude is preserved without validation against terrain height; browser popup may close while export proceeds. Initial builds require live browser acceptance testing. Store review has not been completed.

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

## Development

```bash
npm run check  # JavaScript syntax
npm test       # regression tests using synthetic routes
npm run build  # dist/{firefox,chrome,edge}, plus ZIP packages
npm run ci     # all three
```

CI runs on pushes and pull requests and archives ZIPs as build artifacts. It never fetches user accounts, logs, or private track data. **Do not commit or open GitHub Issues with HAR files, authentication tokens, private tracks or exported GPX.**

## Privacy, support, license

- [Privacy policy](docs/PRIVACY_POLICY.md)
- [Security and responsible reporting](docs/SECURITY.md)
- [MIT License](LICENSE)
- [Issues](https://github.com/zawa356/NAVITIME_GPX_Exporter/issues)

Contributions and bug reports are welcome, but no ongoing functionality or compatibility guarantee is provided. Maintainer and project are not affiliated with NAVITIME JAPAN.
