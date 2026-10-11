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
