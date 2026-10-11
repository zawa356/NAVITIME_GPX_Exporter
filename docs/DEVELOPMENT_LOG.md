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
