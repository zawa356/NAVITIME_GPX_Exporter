# Change history / 作業履歴

This document records implementation milestones and decisions so another AI agent can resume safely. Detailed activity logs live in `docs/DEVELOPMENT_LOG.md`.

## 0.0.1 — 2026-10-11
- Initialized the GitHub repository with an auditable change-history document.
- Agreed product scope: NAVITIME GPX Exporter; initial service: NAVITIME Touring Supporter web; future services through adapters.
- Policy: no raw HAR, credentials, private GPS histories, or API response dumps in the repository.
- Subsequent commits will add application code, regression tests, CI, privacy policy, and release documentation.

## Release plan
- Development milestones: `0.0.x` (0.0.1, 0.0.2, … 0.0.10; **not** semantic patch-range restrictions).
- First intended public release: `0.1.0`, only after Firefox, Chrome and Edge acceptance testing.
- A CHANGELOG entry is not proof that a Git tag or GitHub Release has been created.

## Development increments 0.0.2–0.0.26 — 2026-10-11
- 0.0.2–0.0.6: Added privacy-safe ignore patterns, MIT license, dependency-free toolchain and browser-specific MV3 manifests.
- 0.0.7–0.0.11: Safe error reporting, track normalization, GPX serializer, Touring Supporter adapter and tab-resident export workflow.
- 0.0.12–0.0.14: Popup interface, styling, summary retrieval, download action, retry and copyable sanitized diagnostics.
- 0.0.15–0.0.17: Build script, synthetic regression tests and GitHub Actions CI across Node 20/22.
- 0.0.18–0.0.24: Privacy and security documents, README quick start, requirements baseline, architecture/ADRs, release checklist and AI handoff log.
- 0.0.25–0.0.26: CI test assertion correction for trailing sanitized filename punctuation; first correction was inaccurate and the follow-up restores observed behavior.
- For individual commit subjects and pending tasks, see [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md).
- **These development increments are not claims that Git tags 0.0.2–0.0.26 were published.** Package and manifest version remain 0.0.1; the first public version is reserved for 0.1.0.

## 0.0.34–0.0.39 — Firefox popup regression and live acceptance (2026-10-11)
- 0.0.34–0.0.36: Firefox popup CSS width/hidden fixes, regression tests, and defect analysis (merged in PR #3).
- 0.0.37: Real Firefox test report. User-confirmed popup and GPX file. Original 2,779-point source and exported GPX were compared locally: zero coordinate, altitude, time or order mismatches.
- 0.0.38: Updated manual release checklist: Firefox popup rendering and single-ride GPX export PASS; all other browsers and cases pending.
- 0.0.39: Development log updated with private-evidence testing and next steps.
- These are **development commit/tag milestones**. They do not change the extension Manifest/package version, which remains 0.0.1 until release preparation.

## 0.0.41–0.0.44 — second Firefox GPX and legacy PoC display (2026-10-11)
- 0.0.41: Added privacy-safe second-file test report; GPX 1.1 file contained one segment with 539 points, all with timestamps and elevations.
- 0.0.42: Documented a likely old temporary Firefox PoC injection causing a page-visible `GPXエクスポート（テスト版）` panel; current extension remains popup-only.
- 0.0.43: Added removal of obsolete PoC add-ons to formal manual acceptance prerequisites.
- 0.0.44: Recorded this milestone summary. Do not equate the screenshot's 1,436-point message with the uploaded 539-point GPX without confirmation; comparison to second ride's original source is pending.

## 0.0.45–0.0.47 — Legacy Firefox PoC display resolved
- 0.0.45: Hard refresh (Ctrl+F5) cleared leftover web-page GPX PoC panel; current popup completed a 539-point, 1-segment export.
- 0.0.46: Documented this real-user result and remaining source comparison / other-browser acceptance gates.
- 0.0.47: Changelog updated. No functional source change was necessary; hypothesis remains stale page content, not verified continued installation of the old PoC.

## 0.0.48–0.0.51 — Chrome real-world export verified (2026-10-11)
- 0.0.48: Documented the first Chrome acceptance report. Chrome popup and export worked; GPX 1.1 track of 2,779 points matched the private source JSON with no coordinate, elevation or timestamp mismatches.
- 0.0.49: Marked Chrome popup and single-ride export PASS in the release checklist.
- 0.0.50: Added cross-browser byte-for-byte comparison results (Chrome identical to Firefox export of the same ride) and outstanding verification tasks to the development log.
- 0.0.51: Changelog synchronized. Functional extension code and package version remain unchanged at development version 0.0.1.

## 0.0.52–0.0.55 — Edge and three-browser positive-path acceptance (2026-10-11)
- 0.0.52: Documented Microsoft Edge popup and user-owned GPX export; 2,779 points, one segment, zero mismatches vs source JSON.
- 0.0.53: Firefox, Chrome and Edge positive-path acceptance matrix all PASS; byte-for-byte GPX equality across three browsers recorded.
- 0.0.54: Expanded detailed agent handoff log with Edge outcome and unresolved error-path, XSD and store-publication gates.
- 0.0.55: Changelog synchronized. Development-only commit milestone; manifest/package version remains 0.0.1.

## 0.0.56–0.0.59 — saved-route discovery and future adapter proposal (2026-10-11)
- 0.0.56: Inspected user-provided HAR locally; found a saved-route JSON API with 35 contiguous LineStrings. Published only anonymized structural findings and proposed capability-based discovery in `docs/PROPOSALS/SAVED_ROUTE_EXPORT.md`.
- 0.0.57: Firefox correctly rejects the currently unsupported saved-route view; marked negative-path check passed.
- 0.0.58: Documented differentiation of planned routes vs actual GPS logs, and proposed non-invasive on-demand API access over global traffic sniffing.
- 0.0.59: Updated changelog; **proposal only**. No implementation of planned-route support or new permissions, and no scope expansion of the first public 0.1.0.

## 0.0.60–0.0.92 — Touring Supporter saved-route implementation (2026-10-11)
- **0.0.60–0.0.64** — Shared safe same-origin API GET helper, planned GeoJSON decoder, saved-route API adapter, source registry, compatibility-preserving recorded ride adapter refactor.
- **0.0.65–0.0.70** — Optional GPX point time/elevation for planned routes, distinct route filename without fake start time, tab-side source dispatch and context checks, popup kind/date labels.
- **0.0.71–0.0.75** — New modules added to Firefox/Chromium manifests, build and CI syntax checks; synthetic planned-route regression tests.
- **0.0.76–0.0.82** — Two-source quality gate, README, privacy, architecture, requirements and proposal revisions; synthetic end-to-end extension messaging tests.
- **0.0.83–0.0.87** — Development extension package advanced from 0.0.1 to **0.0.2** (distinct test artifact); diagnostics use manifest version; CI dynamically checks archive versions.
- **0.0.88–0.0.91** — Quick start/test plan, store listing and detailed agent handoff documentation.
- **0.0.92** — Changelog synchronized. New saved-route implementation is **experimental pending Firefox/Chrome/Edge manual test**. Prior recorded-ride implementation also needs 0.0.2 regression verification.
- The tag names identify incremental development commits. There is **no public 0.1.0 release**, and only supported on-demand NAVITIME Touring Supporter API paths are enabled.

## 0.0.93–0.0.97 — QA hardening and handoff
- 0.0.93: Corrected saved-route filename sanitization regex after review.
- 0.0.94–0.0.95: Added and corrected ASCII punctuation/digit filename regression coverage.
- 0.0.96: Avoided spread-induced stack/argument-limit failures when merging long geometry lines.
- 0.0.97: Recorded these fixes and the open browser-acceptance gate. No change to first-public-release status.

## 0.0.99–0.0.101 — Firefox ZIP reputation warning investigation
- 0.0.99: Recorded Firefox malware-warning screenshot report, actual Actions artifact contents and source-hash provenance in `docs/TEST_REPORTS/2026-10-11-firefox-zip-warning.md`.
- 0.0.100: Added root-cause uncertainty and safe next steps to the comprehensive handoff log.
- 0.0.101: Updated changelog. **No antivirus false-positive claim has been established.** This documentation change is not a new released binary.

## 0.0.102–0.0.107 — Firefox 0.0.2 saved-route smoke acceptance
- 0.0.102: User-confirmed successful saved planned-route GPX download in Firefox 0.0.2; source/GPX content fidelity not yet verified.
- 0.0.103: Clarified Firefox warning concerned the outer GitHub Actions `extension-builds.zip`; user reports clean Defender scan and elected to defer warning triage until before public release. No false-positive determination.
- 0.0.104–0.0.105: Quality gate and multi-page test plan updated to distinguish download from coordinate/format validation.
- 0.0.106: Added detailed continuity/handoff log with remaining browser QA.
- 0.0.107: Changelog updated. No executable changes or public `0.1.0` release.

## 0.0.108–0.0.111 — Firefox 0.0.2 planned-route full-data verification
- 0.0.108: Full private HAR vs downloaded GPX comparison: 35 features, 2,648 raw points, 34 duplicates, **2,614 exported points all exactly matching in original order**, one segment; no invented timestamps or altitude.
- 0.0.109: Saved-route Firefox data fidelity/continuity accepted, but independent road-map match and formal XSD validation remain unverified.
- 0.0.110: Extended detailed handoff log, with geographic matching limitations and follow-on browser regression tests.
- 0.0.111: Changelog synchronized; no executable code changed, no 0.1.0 public release.
