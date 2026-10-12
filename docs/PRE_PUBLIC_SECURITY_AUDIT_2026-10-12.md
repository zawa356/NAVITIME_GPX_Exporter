# Pre-public confidentiality review — 2026-10-12

**Repository:** `zawa356/NAVITIME_GPX_Exporter`  
**Audited main revision:** `d22a5140c1f23f2ad3f518e0694534d87ff50c4a` (`v0.1.0` prerelease tag target).  
**Result:** No committed credentials, sensitive private activity traces, HAR, or secret files **detected** in the reviewed content and Git history. This is a scoped static audit, not an unconditional security guarantee.  
**Repository visibility at time of audit:** `private`; changing visibility to Public requires a repository administration operation **not offered by the available connected GitHub tool actions**. No visibility change performed as part of this report.

## Coverage and results

| Surface | Inspected | Result |
| --- | --- | --- |
| Current default branch tree | 69 Git objects; 52 blobs, including 51 UTF-8 files plus one approved PNG icon | No unexpected sensitive filename or content detected |
| Full main-line history | All 163 commits (two paginated GitHub API pages), including each commit's added/removed file names and added diff lines | No HAR, GPX, FIT, TCX, .env, private-key file additions or removals; no recognized embedded token/private-key patterns |
| Branches | All 17 branch heads including `main` | No extra tracked file paths absent from `main` in the 16 other branches |
| PR and issue-comment surfaces | 16 PR descriptions, 0 issue comments, 0 review comments | No secret-like text or private data file attachments detected in those text surfaces |
| GitHub Release | One existing `v0.1.0` **prerelease**, referencing the audited main commit | 3 browser ZIPs, source ZIP, PNG icon; no unexpected asset filenames |
| Repository CI and AMO release workflows | Both workflow YAML files and source build scripts | AMO credentials referenced by **GitHub Actions Secrets names only**; no literal issuer or JWT secret in code |

## Patterns and data checked
- Private key PEM blocks; GitHub personal/app access token patterns; AWS access key patterns; basic/bearer header literals with values; common API-key/password/client-secret/token literal assignments.
- Route identifiers embedded in query strings and highly precise WGS84 coordinates from actual ride traces.
- File types that must never be committed: `.har`, `.gpx`, `.fit`, `.tcx`, `.env`, signing key files.
- Documentation, source code, synthetic test fixtures, both browser manifests, GitHub Actions YAML, AMO metadata and release notes.
- No actual user-uploaded HAR, JSON track response, original recorded route file or signed secret has been committed. Only non-identifying aggregate test results and synthetic coordinates are in the test reports.

## Expected disclosures when changing to Public
1. **Git history and author metadata become public**: the recorded commit author email is associated with a custom `mail.zawazawa.net` domain. This was the sole author-email domain in the 163 main-branch commits. Ensure this is acceptable; public repository visibility makes commit author metadata visible.
2. The listed Firefox extension Gecko ID, `navitime-gpx-exporter@zawa356.github.io`, is intentionally part of the public manifest and **is not an API key or private credential**.
3. Repository and PR discussions describe NAVITIME API path structures and aggregate, user-approved PoC outcomes; no private track coordinates or route IDs were detected in the reviewed content.
4. Public GitHub Releases expose the v0.1.0 source/browser ZIPs; the audited release tag matches the main revision above.
5. The private GitHub Actions Secrets vault is not included in a Git repository export or exposed by changing repository visibility. **Secret values cannot be inspected through this GitHub connection**, so the audit validates code references, not the existence/value/configuration of vault entries.
6. GitHub Actions logs and historical artifact bytes were not exhaustively downloaded or malware-scanned; no claim is made about all temporary CI outputs or future code.
7. The existing repo's AMO privacy-policy documentation becomes publicly accessible after visibility change (subject to GitHub raw/Pages path selection), allowing the maintainer to use an appropriately stable URL for AMO.

## Recommendation and post-change verification
Based on the static results, **no confidential-data finding presently blocks switching the audited repository to Public**. The maintainer should explicitly accept that commit author metadata will become visible.

The GitHub connector has read/write contents, PR and release tools but does **not** expose GitHub's repository administration endpoint for changing `visibility`, so public conversion must be performed using GitHub's **Settings → General → Danger Zone → Change repository visibility → Make public** from the maintainer's account (or a separately authorized browser/administration tool).

After conversion, confirm the actual repository `visibility` reads `public`; verify private source/route files remain absent; ensure the AMO privacy policy link is reachable without GitHub login. This report should **not** be read as evidence that visibility was changed.
