# Development log / 詳細作業履歴

## Scope and provenance
This repository was empty on first inspection on 2026-10-11. The user explicitly gave **Go** to create the initial version, asked for many small commits, complete continuity notes for other AI agents, first public release `0.1.0`, and internal milestones starting at `0.0.1`.

Research and PoC findings preceding repository initialization:
- Browser URL `https://web.moto.touring.navitime.jp/users/me/biography/touring/detail/?id=<biographyId>`.
- Timeline detail endpoint yields `touring.appliId`, which is used as `activityId` on `/api/v1/touring/log`.
- Track data uses `geoJson.features[].geometry.coordinates` with [lon,lat,elevation] and `properties.pass_time`.
- Firefox PoC 07 content script downloaded tracks successfully; no coordinate datum conversion. Sample rides with 2,779 points and 69 points were confirmed by user; sample tracks/HAR **must not be committed**.
- Altitude from a logged-in iPhone recording: sampled 78m vs GSI 79.6m, 450m vs 450.8m; other points near a dam differed. Requirement settled: faithfully preserve altitude without flattening or datum conversions.
- UI determined: toolbar popup, title + record date only at popup open; GPS fetched on save; start timestamp from `metadata.startTime`, not `biographyDate`.
- 3 official target browsers: Firefox, Chrome, Edge; initial service only Touring Supporter; multi-service adapter architecture future-proofing.
- Release decision: after acceptance on all 3 browsers, GitHub version 0.1.0 can release; stores submitted independently.

## Changes in sequence (one commit per step; commit subject includes internal milestone)
| Milestone | Change | Reason |
| --- | --- | --- |
| 0.0.1 | `docs/CHANGELOG.md` created on `main` | Repo bootstrap with auditable history |
| 0.0.2 | `.gitignore` excludes HAR/GPX/logs/generated packages | Prevent accidental private trip/credential disclosure |
| 0.0.3 | `LICENSE` MIT | OSS licensing choice |
| 0.0.4 | `package.json` Node 20+ built-in test runner, no dependency packages | Small, repeatable, offline-capable implementation |
| 0.0.5 | Chromium MV3 manifest | Chrome/Edge extension settings and scoped content script |
| 0.0.6 | Firefox MV3 manifest, Gecko ID & none collection declaration | Signed Firefox add-on planning |
| 0.0.7 | `src/core/errors.js` safe enumerated errors | Avoid exposing API response, identifiers, GPS, secrets |
| 0.0.8 | `src/core/track.js` validation/normalization and filename | Centralize service-independent record model |
| 0.0.9 | `src/formats/gpx.js` GPX 1.1 serialization | Separate output representation; XML escaping |
| 0.0.10 | `src/services/touring-supporter.js` adapter | Isolate undocumented service endpoints/format |
| 0.0.11 | `src/extension/content.js` | Same-origin fetch / export independent of popup lifetime |
| 0.0.12 | popup HTML | Toolbar workflow and accessible UI |
| 0.0.13 | popup stylesheet | Compact, native-feeling UI |
| 0.0.14 | popup JavaScript | Summary, export, retry and copyable safe diagnostics |
| 0.0.15 | `scripts/build.cjs` | Build browser-specific unpacked folders and install ZIPs |
| 0.0.16 | `tests/core.test.cjs` | Synthetic regression for fidelity and malformed data |
| 0.0.17 | CI workflow | Parallel Node 20/22 check, tests, artifact ZIPs |
| 0.0.18 | bilingual privacy policy | Store review readiness and location privacy commitments |
| 0.0.19 | README quick start | User-friendly OSS onboarding |
| 0.0.20 | requirements baseline | Traceability to all agreed requirements |
| 0.0.21 | architecture and ADRs | Handoff and rationale for next maintainer |
| 0.0.22 | release/QA checklist | Quality-gated 0.1.0 |
| 0.0.23 | SECURITY.md | Responsible issue/security handling |

The milestone sequence is a **commit naming convention**, not a claim that all Git tags exist. The current package/manifest version is intentionally `0.0.1` throughout development until a release decision. Bumping manifest for every micro-commit would disrupt traceability of released extension binaries.

## Work still to do / next agent
1. Verify GitHub Actions on the feature branch; correct any tests or syntax issues. Cross-check manifests, generated ZIPs and paths.
2. Review and merge PR into main only after CI, then download CI's ZIP artifacts for manual browser validation.
3. Manually test Firefox, Chrome, Edge with *your own* logged-in NAVITIME account. Run all checks in `docs/RELEASE_CHECKLIST.md`; do not upload the private data into CI or issues.
4. Evaluate a future GPX 1.1 XSD offline validator, extension localization, icons, and store submission assets.
5. Confirm minimum browser versions and store policy/trademark impact before release.
6. Update version and tag `0.1.0` only after manual acceptance. Do not state that any store has approved/published the add-on without independent confirmation.

## Decisions and risks worth revisiting
- Popup closure: tab-resident content-script export continues, but a tab closing/navigation aborts. Avoid moving export to ephemeral popup.
- Current approach uses native anchor download from content script after an async operation. Cross-browser acceptance essential; if blocked, consider a low-privilege download bridge and carefully audit blob URL access across execution origins.
- `activeTab` is used for popup tab messages, and only target site content scripts are injected. Permission warning differences among Firefox/Chromium need actual browser checks.
- `metadata.datum="tokyo"` is not interpreted as requiring Japanese historical coordinate datum conversion. Tested sample aligned WGS84 maps without conversion.
- A source field may be missing: altitude optional; point time required; ID matching mandatory.
- `biographyDate` is record date, not real ride start; never use for filename time.

## Privacy invariant
Never commit or echo tokens, raw HAR, raw GPS tracks, private user details or API response bodies in docs, source, fixtures, Actions or Issues. All committed test data should be artificial.

## Post-merge quality hardening (2026-10-11)
- PR #1 merged to `main` as `e4696f30f59e34e93d5f6bdf82d37300ef08236e` after the Node 20/22 Actions checks passed at development commit `2ef4195d90a5514bb741f85c65a7176c36d1db73`. The first CI run exposed a synthetic filename test expectation error, which was corrected in focused commits (0.0.25 and 0.0.26).
- 0.0.28: Added fake, synthetic same-origin API integration tests for Touring Supporter endpoint order, response validation and authentication failure modes; no real GPS history or API access.
- 0.0.29: Added browser-store publication preparations with non-affiliation language and specific prerequisites.
- Note: Git tag creation is not available through the current GitHub connector actions; do not confuse commit-label milestones with signed/tagged distribution artifacts.

## Git milestone tag automation (0.0.31)
- Added `.github/workflows/ci.yml` job `tag-development-milestones`, gated behind a successful full Node 20/22 CI run on a push to `main` only.
- Scans reachable Git commit subjects ending with `(0.0.N)`, creates lightweight tags for those commits, refuses to overwrite tags pointing to different commits, and pushes the tags. This honors the requested sequential internal milestone refs without publishing a 0.1.0 release.
- It requires Actions `contents: write` and repository settings that permit GitHub Actions tag pushes; check the post-merge job result before assuming tags exist.
- 0.0.32 records the tag-job decision and what remains to verify. Do not call these tags releases.

## Verification completed after PR #2 — 2026-10-11
- PR #2 merged to `main` at `719b9488dc7067e84a1ea846007f0b0f98156aa5`.
- GitHub Actions run: https://github.com/zawa356/NAVITIME_GPX_Exporter/actions/runs/38126368065
- Node 20 test-and-package: **success**; Node 22 test-and-package: **success**.
- Development tag job: **success**. Confirmed 32 immutable lightweight tags `0.0.1`–`0.0.32` through GitHub Git references API.
- CI artifact `extension-builds` (ID `11697401987`) contains three built extension ZIPs; download from the Actions run while the artifact remains retained.
- The repository is currently **private**. Repository visibility is not automatically changed by creating builds or tags.
- **Not verified**: live NAVITIME session in Firefox/Chrome/Edge, store approvals, signed Firefox installation, trademark/service-terms compliance. Remain pre-release gates for public `0.1.0`.
- 0.0.33: Recorded completion evidence and the explicit distinction between development artifacts and public release.

## Firefox first live test: popup collapses to a line (2026-10-11)

### Evidence
- User successfully loaded the 0.0.1 temporary Firefox extension and observed an initial loading message.
- Opening the toolbar action produced an almost one-pixel vertical strip over the Touring Supporter map, preventing access to the GPX save button. A screenshot was provided **in chat only**, not added to the repository because the underlying map and history are private.

### Analysis (suspected root cause, awaiting real-browser confirmation)
- Initial `src/popup/popup.css` specified `body{width:330px;max-width:100vw}`.
- Firefox WebExtensions popups **derive their viewport width from the popup body layout**, so using the viewport width `100vw` as a maximum of that same body can be circular. The reported symptom is consistent with a collapsed computed popup width. This is a hypothesis until user retest, not a proven Firefox rendering defect.
- Independently, `button{display:block}` can override user-agent `[hidden]` handling, potentially showing retry buttons before they are needed.

### Changes
- 0.0.34: Drop viewport-relative `max-width:100vw`; explicitly size the `body` at 330px including `min-width`. Add author-level `[hidden]{display:none!important}` so hidden controls remain hidden.
- 0.0.35: Add automated static regression coverage of popup dimensions and `hidden` visibility.
- 0.0.36: Record the live-test failure and corrective hypothesis for the next AI agent.

### Immediate acceptance plan
1. After CI passes, download a **new** `extension-builds` artifact, not the one from the previous CI run.
2. Remove the old temporary extension in Firefox `about:debugging`; unpack the new Firefox ZIP; load its `manifest.json`.
3. Open the ride detail URL and click the toolbar button. Confirm popup has visible approximately 330px width and correct title + date.
4. Only then click GPX save and verify the returned ZIP/GPX.
5. If it still collapses, inspect extension popup using `about:debugging → Inspect`, computed `document.body.getBoundingClientRect().width`, and console. Do not request/share cookies, HTTP response bodies, HAR, or tracks for UI-only debugging.

### Reference
- MDN WebExtensions popup sizing: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups (Firefox popup size is derived from `body` in standards mode).

## Firefox live verification after popup width fix (2026-10-11)

- The user installed the rebuilt Firefox extension and supplied a screenshot in which the popup renders at normal width with visible title, record date and save button. This confirms the **regression is resolved in the user's tested environment**; it does not independently establish the CSS root-cause mechanism.
- User provided a GPX successfully saved via the new popup workflow.
- Compared the file offline against the separately supplied original NAVITIME JSON: XML parse PASS, 1/1 segments, 2,779/2,779 points, **0 mismatches in per-point longitude, latitude, altitude and absolute timestamp**, in source order. GPX metadata name and UTC start time present; filename start time uses original local offset.
- The generated GPX itself and source JSON remain private; no real user trace, screenshot, HAR or raw response has been committed.
- 0.0.37: Added [Firefox private-evidence test summary](TEST_REPORTS/2026-10-11-firefox.md).
- 0.0.38: Marked Firefox popup and basic logged-in GPX export as PASS in the release checklist.
- 0.0.39: Updated this comprehensive development log. Next: rendering check in map application, second ride, Chrome/Edge and negative-case acceptance tests. Official GPX XSD validation still outstanding.

## Second Firefox GPX & legacy injected-page UI (2026-10-11)
- The user uploaded an additional GPX file and reported successful export.
- Offline GPX inspection: well-formed XML, GPX 1.1, 1 track, 1 segment, **539 points**, all 539 elevations and timestamps present, timestamps strictly increasing and metadata start equals first-point time. No raw track data committed.
- Separate screenshot reports old in-page PoC banner `GPXエクスポート（テスト版）` with **1,436 points**, unlike the uploaded 539-point GPX. The two cannot be treated as identical exports without further evidence.
- Current production `content.js` contains no page-visible UI injection; most likely the temporary Firefox PoC from previous experiments remains installed. User should unload legacy PoC and reload page.
- Project UI requirement remains **popup only**; page injection strictly prohibited. Source-vs-track fidelity for this second ride remains **unverified**, not conflated with the complete first-ride comparison.
- 0.0.41: [Second-ride test report](TEST_REPORTS/2026-10-11-firefox-second-log.md).
- 0.0.42: Detailed development log records this issue, evidence and next action.

## Firefox follow-up: hard reload removed old PoC UI (2026-10-11)
- User confirmed a **Ctrl+F5** hard refresh removed the unexpected legacy `GPXエクスポート（テスト版）` page display. Current popup remained functional.
- New screenshot shows toolbar popup reporting saved **539 points / 1 segment** and Firefox download list with finished GPX downloads.
- This supports **stale injected page content** as explanation; we have **not proven** whether the prior temporary PoC was still enabled. The current source never intentionally injects UI.
- 0.0.45: Updated the private-evidence second-ride report with resolution and separated 1,436-point stale notice from 539-point current export.
- 0.0.46: Recorded the resolution and next required manual target: Chrome (followed by Edge). GPX comparison against original second-ride JSON and complete Firefox negative-case matrix remain open.

## Google Chrome first real-world GPX acceptance (2026-10-11)
- User loaded the Chrome extension and demonstrated a readable popup with the correct ride title, record date and enabled export button.
- A user-uploaded Chrome GPX file was parsed offline, and separately compared with the previously tested Firefox file **for the same original ride**. Files were byte-identical (277,018 bytes, identical SHA-256), with 1 segment and 2,779 points.
- Using the user's private original NAVITIME JSON, all 2,779 ordered longitude/latitude values, elevation values and timestamps were individually compared against the Chrome GPX: **0 mismatches**.
- No private user GPS trace, HAR, screenshot or JSON was added to GitHub. The `(1)` in Chrome's local filename comes from the browser's duplicate download naming.
- 0.0.48: New [Chrome live acceptance report](TEST_REPORTS/2026-10-11-chrome.md).
- 0.0.49: Release checklist updated to PASS for the Chrome popup and initial export.
- 0.0.50: Development log updated, with next manual acceptance target Microsoft Edge. Further browser negative tests, signed store builds and GPX XSD validation remain unperformed. No source code change was necessary.

## Edge manual test and cross-browser parity (2026-10-11)
- User loaded the development MV3 extension in **Microsoft Edge**, confirmed normal-width popup with correct ride title, date and export button, and uploaded the downloaded GPX file.
- Offline verification (no track uploaded to GitHub): valid XML, GPX 1.1 namespace/version; 1 track, 1 segment, **2,779 points**, each with timestamp and elevation. All 2,779 points match the user's private original NAVITIME JSON when comparing ordered coordinates, altitude and absolute times.
- Verified the three files produced independently by Firefox, Chrome and Edge are **byte-for-byte identical**, 277,018 bytes apiece, with identical SHA-256 digests. Browser-applied local `(1)`/`(2)` filename suffixes do not affect file content.
- 0.0.52: [Edge acceptance report](TEST_REPORTS/2026-10-11-edge.md), retaining only non-sensitive aggregate verification facts.
- 0.0.53: Updated release acceptance matrix: the title/date popup and signed-in single-ride export pass on all three browser families.
- 0.0.54: Recorded cross-browser verification and remaining release gates in this development log.
- Outstanding: GPX 1.1 XSD check, independent map viewer, unsupported-page/expired-session/network/API errors, retry and privacy-safe copy, popup-close/navigation behavior, full manual regression, Mozilla signing and Chrome/Edge store procedures.
- First public release remains **0.1.0** after full acceptance; existing build version is still **0.0.1**. Do not treat the development tags as formal releases.

## Saved-route discovery during Firefox negative test (2026-10-11)

- User manually tested the current extension on a **saved planned route** view. The popup displayed the expected unsupported-page guidance, the export button was disabled, and retry/diagnostics were available. This is a PASS for the current 0.0.1 negative-path requirement.
- The user proposed a long-term UX goal: automatically make GPX export available wherever a supported NAVITIME page contains usable route information, not solely by checking one hardcoded URL.
- A private user-provided HAR was inspected **locally** without copying it into GitHub: `GET /api/v1/riders/routes/{routeId}` returned a route object with `route.geojson`, 35 contiguous LineStrings and 2,648 source vertices (34 repeated joins → 2,614 merged points). Coordinates are WGS84 lon/lat without per-point altitude or time. Also contains five planned stops and navigation guides. An in-memory-only GPX XML transformation parsed without error.
- The source is a **planned route**, not a recorded ride. The existing strict recorded-track model **cannot** represent absent per-point timestamps; the common geometry model and GPX serializer would need an explicit future design change.
- Network-wide JSON sniffing was rejected as the default architecture recommendation in favor of source-adapter capability detection and authenticated, targeted read-only fetches. Wide tracking would increase privacy risk and could not generically read response bodies from an isolated MV3 content script.
- 0.0.56: [Saved route discovery/proposed design](PROPOSALS/SAVED_ROUTE_EXPORT.md), explicitly flagged **NOT IMPLEMENTED** and **PENDING REQUIREMENTS DECISION**.
- 0.0.57: Confirmed Firefox unsupported-page error response in release matrix.
- 0.0.58: This development-log note and handoff.
- No raw HAR, JSON, GPX, authentication token, route ID, screenshot or route coordinates committed. The first public version 0.1.0 scope is not changed by this investigation.

## Development 0.0.2: dual Touring Supporter page types (2026-10-11)

**Decision and scope**: User approved a two-level adapter design (NAVITIME service acquisition and generic format decoders), permits *offline/synthetic speculative implementations* for unsubscribed NAVITIME services while requiring the distinction between Experimental and verified. Before public 0.1.0, requested a functioning extension on **multiple page types within Touring Supporter**, specifically recorded rides and saved planned routes. No store publication or user data sharing authorized yet.

**HAR evidence** (source kept private):
- Confirmed `GET /api/v1/riders/routes/{routeId}`, 32-hex `public_route_id` equal to request ID, `route.datum=wgs84`, `route.unit=degree`.
- `route.geojson` with 35 consecutive `LineString`s and 2,648 raw vertices including 34 identical segment-boundary duplicates → 2,614 distinct ordered vertices. No per-vertex time/elevation.
- `title` and `register_time` available; creation/registration time is *not* an actual GPS start time.
- Original real ride adapter's API and GPX serialization tested previously in all three browsers; do not regress it.

**Implementation milestones and reasoning**:
- 0.0.60: Shared authenticated, same-origin read-only JSON API helper. Request path is constrained to known API subtree; response errors contain no raw payload.
- 0.0.61: Generic planned-route GeoJSON format decoder; validates degrees/finite coordinates, joins only identical adjacent feature boundaries, splits disconnected sections.
- 0.0.62: Dedicated Touring Supporter planned saved-route adapter with strict URL, id, datum and unit checks; summary title/date/label and normalized geometry.
- 0.0.63: Minimal bundled source registry dispatches either recorded-ride or saved-route adapter. No global network sniffer or remote code loader.
- 0.0.64: Existing recorded-ride adapter delegates to the shared transport without changing its API contract.
- 0.0.65: GPX serializer omits metadata/point times and elevations when absent; preserves previous ride XML formatting.
- 0.0.66: Planned-route filename `保存ルート_タイトル.gpx`, sanitized and no invented ride start; recorded filename unchanged.
- 0.0.67: Content script dispatches by active-page source and validates source identity plus exact page URL before saving.
- 0.0.68–0.0.70: Popup labels data as recorded/planned and displays 登録日 or 記録日 accordingly; original Firefox width fix retained.
- 0.0.71–0.0.74: Both MV3 manifests, build source list and Node syntax check updated. No additional host or cookie permissions.
- 0.0.75: Synthetic saved-route contract/geometry/GPX tests for endpoint order, identifiers, missing elevation/time, disconnected routes, invalid data and auth errors.
- 0.0.76: Release matrix expanded to require two page types in Firefox, Chrome and Edge.
- 0.0.77–0.0.81: README, privacy policy, requirements baseline, architecture and former proposal updated.
- 0.0.82: Synthetic end-to-end Chrome-compatible extension messaging tests: recorded/saved export, unsupported page, navigation cancellation.
- 0.0.83–0.0.87: Bumped development package to **0.0.2** to prevent accidentally testing old artifacts; version in diagnostics reads manifest; CI ZIP check accepts version changes.
- 0.0.88–0.0.90: Updated quick start, staged three-browser test plan and draft store listing.

**Design limits**:
- Planned saved routes are emitted as GPX `<trk>` with no `<time>`/`<ele>`. Consecutive identical feature joins are de-duplicated, while disconnected features remain separate track segments. Planned `<wpt>` and `<rte>` outputs are deferred.
- Popup saved-route summary fetches a complete route JSON response (because summary+geometry are provided together), and export re-fetches for freshness. This is in-browser processing only; nothing persists in extension storage.
- Extra NAVITIME services are not enabled, because no verified authenticated endpoint was supplied. Future Experimental adapters can be developed offline from authorized evidence and promoted only after user live testing.
- No HAR, account identifier, token, private coordinate, or original route metadata/JSON has been committed.

**Current acceptance state**:
- Pre-existing recorded-ride positive-path tests (0.0.1) passed in Firefox/Chrome/Edge, with identical 2,779-point output. Run regression on new 0.0.2 build.
- New saved-route code: synthetic tests pass in CI as of the implementation branch; **real-browser tests outstanding**. See `docs/TEST_PLANS/TOURING_MULTI_PAGE.md`.
- Do not merge release readiness with CI passing. Public 0.1.0, manifest signing, and store publication remain blocked until user-provided multi-browser acceptance and security/privacy review.

## Post-implementation review and guardrails (2026-10-11)
- 0.0.93: Detected and fixed excessive escape characters in the planned-route filename sanitizer, reusing the previously validated recorded-ride regex; ordinary Latin letters and digits must remain unchanged.
- 0.0.94–0.0.95: Added and corrected regression tests for ordinary ASCII filename characters versus Windows-forbidden punctuation; initial new test expectation was inaccurate, then corrected. All current synthetic tests are passing.
- 0.0.96: Replaced array-spread append for line joins with an indexed loop to avoid JavaScript argument-count limits on long polyline sections.
- The user's private route HAR remains solely an inspection input; no route coordinates, exact route ID, session tokens, or raw response bodies were added to the repository. No unsupported remote services are probed.
- Next human step: use CI's new `0.0.2` artifact, first in Firefox on the user's saved-route page, then regression-test recorded rides, then repeat on Chrome and Edge. Compare the saved-route output's expected approximate 2,614 vertices against the original reference HAR **locally**.
