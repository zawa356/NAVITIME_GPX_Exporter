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
