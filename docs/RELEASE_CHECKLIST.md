# Release and acceptance checklist

**Target:** First public release `0.1.0` after two Touring Supporter page types (recorded rides AND saved planned routes) pass acceptance in all three browsers. Merging development code does NOT publish version 0.1.0.

## Automated gates
- [ ] `npm run check` validates all JavaScript source.
- [ ] `npm test` passes against synthetic tracks.
- [ ] `npm run build` produces a Firefox ZIP and Chromium ZIPs for Chrome and Edge.
- [ ] CI passes for Node 20 and 22 on the intended commit.
- [ ] Verify GPX XML against GPX 1.1 XSD; tests should eventually automate this with a suitable offline XSD validator.
- [ ] Review code for secrets, personal GPS histories, HARs, and unnecessary dependencies.

## Manual browser matrix (must be performed before public release)

**Testing prerequisite:** Remove temporary PoC extensions from Firefox and reload the NAVITIME tab before every formal acceptance test. A previously observed on-page PoC banner reported 1,436 points while a separately supplied GPX contained 539 points; the two are **not verified** as the same export. See [second-log report](TEST_REPORTS/2026-10-11-firefox-second-log.md). Current extension UI must remain popup-only.

| Test | Firefox | Chrome | Edge |
| --- | --- | --- | --- |
| Popup shows title + date | ✅ | ✅ | ✅ |
| Logged-in recorded-ride export | ✅ | ✅ | ✅ |
| Saved-route page popup + title/date | ☐ | ☐ | ☐ |
| Saved-route GPX download (smoke test) | ✅ | ☐ | ☐ |
| Saved-route GPX export (no synthetic time/elevation) | ✅ | ☐ | ☐ |
| Saved-route continuity / 35 LineStrings | ✅ | ☐ | ☐ |
| GPX displayed correctly in map app | ☐ | ☐ | ☐ |
| Different ride after SPA navigation | ☐ | ☐ | ☐ |
| Invalid/unsupported page | ✅ | ☐ | ☐ |
| Logged-out/expired session | ☐ | ☐ | ☐ |
| Network / API / empty / corrupted response | ☐ | ☐ | ☐ |
| Retry and safe diagnostic copy | ☐ | ☐ | ☐ |
| Close popup during export | ☐ | ☐ | ☐ |
| Navigation away during export | ☐ | ☐ | ☐ |
| Duplicate export clicks | ☐ | ☐ | ☐ |

**Firefox proof:** [2026-10-11 test report](TEST_REPORTS/2026-10-11-firefox.md) documents a successful 2,779-point source-to-GPX comparison with zero coordinate, altitude or time mismatches. Full GPX 1.1 XSD validation and map-application rendering remain pending.\n\n**Chrome proof:** [2026-10-11 Chrome live-test report](TEST_REPORTS/2026-10-11-chrome.md) shows one successfully downloaded, byte-for-byte identical GPX to Firefox, with 2,779/2,779 point-coordinate/elevation/timestamp matches against private source JSON. This checks basic export only; Chrome negative cases remain pending.\n\n**Edge proof:** [2026-10-11 Edge acceptance report](TEST_REPORTS/2026-10-11-edge.md). Positive-path GPX export is now evidenced on **all three browsers**, with byte-for-byte identical output and 2,779 points matching the private original source JSON. Negative cases, GPX 1.1 XSD validation and map-app import remain pending.\n\n**Firefox unsupported-page proof:** A saved-route view (which v0.0.1 does not yet support) showed the expected red guidance, disabled `GPXを保存`, visible retry and a collapsed diagnostics section. No GPS data was exported. The user separately requested support for saved planned routes as a future feature; see [design proposal](PROPOSALS/SAVED_ROUTE_EXPORT.md).\n\n**Firefox v0.0.2 planned-route smoke test:** User confirms a downloaded file from a saved-route view. See [report](TEST_REPORTS/2026-10-11-firefox-saved-route-smoke.md). Actual GPX geometry, point count, missing times/elevations and map rendering remain **unverified**; the full route-content acceptance row therefore stays open.

**Firefox saved-route fidelity:** [complete 2,614-point comparison](TEST_REPORTS/2026-10-11-firefox-saved-route-fidelity.md) shows exact match to original HAR geometry (35 LineStrings → 2,614 vertices, 0 coordinate differences, no times/elevation). An interactive private map viewer was generated for GSI/OSM inspection, but independent cartographic road alignment and formal GPX XSD validation remain pending.\n\n### Gate for the new feature

The saved-route adapter was developed from **one real HAR** plus synthetic tests. It is not eligible for public release until each browser performs one live route-detail export and the exported route is checked for approximately 2,614 distinct route vertices and correct segmentation. The 2,614 figure applies only to the private reference route in the HAR; different routes can legitimately differ. Check no <time> or <ele> data was fabricated, record the result in `docs/TEST_REPORTS/`, and never commit the route file.

Recorded-ride compatibility remains an independent regression gate. Verify **both** page types before increasing the release version to 0.1.0. Unsupported routes/other NAVITIME services remain out-of-scope until separately validated.

## Store & documentation
- [ ] Built extension for Firefox, Chrome, Edge contains registered `icons` and `action.default_icon`, and asset dimensions are verified by `npm run verify:icons`.
- [ ] Review `dist/store-assets/icon-512.png` at full size for crispness and store policy; keep official NAVITIME trademarks out of project icon.
- [ ] Validate current store policies and NAVITIME service terms.
- [ ] Confirm use of NAVITIME in display name does not imply endorsement.
- [ ] Confirm Firefox manifest privacy declaration and add-on ID; obtain Mozilla signing.
- [ ] Create store icons/screenshots/descriptions from permitted non-user data; do not reuse official product marks.
- [ ] Publish privacy policy URL, explain minimum permissions, and fill data collection declarations accurately.
- [ ] Manually inspect candidate source and signed binaries against source ZIP.
- [ ] Zero release-blocking bugs, document minor known issues.
- [ ] Update version from 0.0.1 to 0.1.0 only when approved.
- [ ] Create official Git tag and GitHub Release when supported, link release assets.
- [ ] Submit stores independently (their review schedule does not block the GitHub release).

## Risks remaining after initial implementation
- Browser execution/permissions and real NAVITIME API response compatibility not yet tested on the production version.
- Some websites and browsers may limit programmatic downloads after asynchronous steps.
- Open-source licensing does not license NAVITIME service data or trademarks.
