# Touring Supporter multi-page acceptance test plan — development 0.0.2

**Status:** Saved-route Firefox download smoke-tested in 0.0.2; file integrity and most three-browser manual cases remain pending.  
**Scope:** Tour log details + saved planned route details in Firefox, Chrome and Edge.  
**Privacy:** Never upload HAR, login cookies, API payloads or full GPX to the repository. Private user-provided GPX files may be compared offline if explicitly provided.

## Prerequisite
1. Download the `extension-builds` artifact from the successful GitHub Actions run for the **current main or feature-branch commit**. Do not use old 0.0.1 ZIPs.
2. Extract `navitime-gpx-exporter-<browser>-0.0.2.zip` and install as temporary/unpacked extension in Firefox (`about:debugging`), Chrome (`chrome://extensions`) or Edge (`edge://extensions`).
3. Ensure only one NAVITIME GPX Exporter instance is enabled; reload all Touring Supporter tabs, ideally Ctrl+F5 after changing extension builds.
4. Stay signed in with an account permitted to access the tested data.

## Case TS-RIDE-01: actual ride
1. Navigate to a recorded ride detail under `/users/me/biography/touring/detail/?id=...`.
2. Open popup. Expect type **実走行ログ**, title and **記録日**, enabled GPX button.
3. Click Save. Expect a `YYYY-MM-DD_HHMMSS_タイトル.gpx` download, whose GPX `trkpt`s retain original coords, UTC time and source elevation.
4. Compare a known saved ride in each browser. The previous 2,779-point reference ride passed on all 3 browsers in version 0.0.1; **0.0.2 must be retested for compatibility**.

## Case TS-ROUTE-01: saved planned route
1. Navigate to a saved route detail under `/routes/view/?id=...`.
2. Open popup. Expect type **保存済みルート（予定経路）**, correct title and **登録日**, enabled GPX button.
3. Click Save. Expect `保存ルート_タイトル.gpx` download, with a complete route `<trk>`.
4. Inspect GPX: no fabricated `<time>` or `<ele>`; latitude/longitude correspond to source geometry; adjacent route feature boundaries removed only when exactly repeated; gaps, if any, appear as separate `<trkseg>`.
5. For the **single privately inspected HAR reference route**, expected **2,614** GPX points from 2,648 raw vertices across 35 contiguous LineString features; this count applies only to that reference route.
6. Import GPX into a map app and visually check the detailed route matches NAVITIME’s route display. Routing instructions and stop-name waypoints are not exported yet.

## Case TS-NO-01: unsupported page
1. Open a Touring Supporter URL outside those two known detail pages.
2. Popup must show a clear instruction and keep GPX Save disabled.
3. A safe folded diagnostics section and Retry must appear. Copy diagnostics; ensure no track coords, cookie or route ID.

## Navigation & failure tests
- Open a source, then navigate to another detail before starting export; popup must use only the current page’s data.
- Navigate away during export; must not download a file belonging to the previous page.
- Close popup after starting a download; tab-side operation should normally continue.
- Logged-out/expired API session and invalid JSON must abort without a GPX download. Do not share actual auth material.
- Repeated Save clicks should not cause simultaneous duplicate downloads.
- All errors should display generic codes and safe status, not raw API JSON.

## Manual acceptance tracking
| Case | Firefox | Chrome | Edge |
| --- | --- | --- | --- |
| Recorded ride preview & export | Pending 0.0.2 regression | Pending | Pending |
| Saved route preview & export | Download confirmed; full content/preview verification pending | Pending | Pending |
| Saved route visual map comparison | Pending | Pending | Pending |
| Unsupported page | Previously passed Firefox 0.0.1, retest 0.0.2 | Pending | Pending |
| Error/Retry/diagnostic safety | Pending | Pending | Pending |

**Gate:** no production 0.1.0 release until the current two-source implementation passes 3-browser acceptance and the remaining release checklist. No store submission is automated.
