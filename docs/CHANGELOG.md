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
