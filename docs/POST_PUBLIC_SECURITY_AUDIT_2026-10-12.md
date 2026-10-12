# Post-Public confidentiality review — 2026-10-12

Repository: `zawa356/NAVITIME_GPX_Exporter`  
Status at inspection: **Public** (confirmed by the GitHub repository API).  
Audited `main` commit: `aed47fae4b8405964ba3466d30847169a7cf43bd` (merge of pre-public security audit PR #17).  
Outcome: **No exposed authentication material, personally identifiable ride traces, or other high-severity sensitive content was detected in the checked surfaces.** This is a bounded inspection, not a guarantee that unknown secret patterns or external service logs do not exist.

## Verified scope

| Surface | Scope | Outcome |
| --- | --- | --- |
| Repository visibility | GitHub repo metadata | `public` |
| Main HEAD tree | 70 tree entries, **53 tracked blobs**: 52 inspected text files and 1 approved icon PNG | No unexpected private data filenames; no live secret matches in inspected text |
| Full historical main commits | Previous pre-public audit covered all **163 commits** and per-commit changed-file paths and added diff text | No raw HAR/GPX/FIT/TCX, signing keys or recognizable token literals |
| Other branch refs | Previous audit covered **17 branches total**, all 16 side branches behind main with **0 ahead commits** | No extra unmerged branch content exposed; they are all ancestors of current main |
| PR descriptions, issue/review comments | Previous audit: 16 PRs, no issue/review comments; current publicly visible PR #17 is the sanitized audit report | No secret-bearing descriptions detected |
| v0.1.0 prerelease | One GitHub Release, `v0.1.0`, five named assets: Firefox, Chrome, Edge, source ZIP, 512px icon | Expected distribution asset list only; still marked prerelease |
| Recent GitHub Actions logs | Full text from successful release job `114632629270`, main push jobs `114635272104`, `114635272338`, tag job `114635393296` | No matched secret/private-key/JWT/auth header/cookie literal or precise route coordinates; GitHub masking markers present |

### Sensitive-pattern checks
All **52 current text files** were inspected using pattern checks for:
- GitHub PAT/app-token prefixes, AWS access key patterns, common third-party API keys and structurally JWT-like values.
- PEM private key headers and literal Bearer/Basic Authorization or Set-Cookie/Cookie header values.
- Assignments of passwords, API/client secrets, and access/refresh tokens that would contain string literals.
- High-precision latitude/longitude examples characteristic of a raw personal GPS track.
- Private route identifiers embedded in URL query parameters.
- Private data/archive file extensions `.har`, `.gpx`, `.fit`, `.tcx`, `.env`, `.pem`, etc. The extension strings found in README/docs/code were ordinary **examples, file naming rules, output names or `.gitignore` exclusions**, not committed HAR/GPX exports.

### Information that is intentionally public
- The project's maintainer GitHub handle and commit author metadata. Historical commit metadata includes a contact address using a custom `mail.zawazawa.net` email domain and one non-Kanji single-word author display name; these are part of the public Git history. This is personal metadata but not a credential.
- The Firefox Gecko extension ID `navitime-gpx-exporter@zawa356.github.io`, an **identifier** (not an API secret).
- General NAVITIME API endpoint paths, anonymized structural HAR observations and aggregate test results. The verified full route geometry and authenticated HAR files were **not** committed to source control.
- Build metadata, GitHub Actions workflow commands, and references to the **names** of AMO GitHub Actions Secrets.

### Boundary and residual risk
- Secret vault values were **not** retrievable through the GitHub connector; no claim is made about whether secrets have been configured.
- Actions run artifacts and the binary bytes of `v0.1.0` ZIPs were not exhaustively re-extracted in this post-Public pass. The release tag and asset listing were verified; the tagged code and release's build scripts were previously reviewed. Four representative recent public CI logs were inspected for sensitive values, but not every historical GitHub Actions run.
- Static patterns are necessarily incomplete for unknown/obfuscated secrets or semantic personal information. User messages/HAR attachments from chats are not made public merely by making the GitHub repo Public.
- Public repo Git history, including old source docs, is searchable. If a secret is discovered later, **revoke/rotate first**, then remove it from present files and Git history, and evaluate cached copies or forks; simply deleting the latest file is insufficient.
- The Mozilla AMO listing review status and externally browsable privacy-policy link are separate operational checks, not established by this source-code audit.

## Recommendation
**No audit finding requires reverting the repository to Private or rewriting its Git history at this time.** Keep GitHub secret scanning / push protection enabled if available. Avoid committing authenticated HAR, actual recorded/saved-route GPX, response-body snapshots, or any AMO API credential. Check future PRs and release assets routinely.

Related report: [pre-public confidentiality review](PRE_PUBLIC_SECURITY_AUDIT_2026-10-12.md). This report records verification results only; it does not change application code, repository visibility or AMO publishing status.
