# NAVITIME GPX Exporter v0.1.0 — initial release

This is an **unofficial**, community-developed browser extension for exporting your own NAVITIME Touring Supporter data as GPX 1.1. It is not affiliated with NAVITIME JAPAN.

## Included
- Export a recorded ride from its detail page. GPX retains the source point order, coordinates, timestamps (same UTC instant), altitude and segment boundaries.
- Export a saved planned route from its detail page. Preserves full route polyline geometry, omitting point timestamps and altitude not supplied by the source.
- Toolbar popup with item title/date, one-item download, retry and privacy-safe diagnostic details.
- Original map/route/download extension icon, provided automatically in all Firefox/Chrome/Edge packages.
- Local-only GPX generation, minimal active-tab permission and service-scoped API access. No tracking or remote application server.
- README, Japanese/English privacy policy, source code, MIT license and documented test records.

## Compatibility and limits
- Supported: NAVITIME Touring Supporter **web** pages for recorded rides and saved planned routes, in Firefox, Chrome and Edge. No mobile-app integration, generic arbitrary-route extraction, batch export or other NAVITIME services yet.
- Firefox AMO `listed` submission is independent of this GitHub release and requires Mozilla's review. The **unsigned Firefox ZIP here is a development/source package**; normal Firefox users should install the signed build from AMO after approval.
- Chrome and Edge ZIPs are currently developer-mode builds, **not** Chrome Web Store or Edge Add-ons approved releases.
- Real-browser recorded-ride positive path was verified on Firefox, Chrome and Edge before this version, with identical GPX output of 2,779 points. Saved-route fidelity was checked against original data on Firefox (2,614 points, 0 differences). Other browser negative-case / saved-route checks and full GPX XSD validation remain **not completed**, as shown in `docs/RELEASE_CHECKLIST.md`. No unsupported test results are claimed.
- Independent external basemap alignment remains user-visible/manual; source-to-GPX route coordinate equality is verified for the tested data.
- GitHub Actions previously produced a Safe Browsing warning for its outer ZIP; static source-provenance checks were successful but its cause was not definitively established. For public distribution prefer official reviewed store packages.

## Release workflow
- GitHub Actions `release.yml` builds and packages this version on explicit manual invocation.
- `github` mode creates or reuses a **GitHub prerelease** tagged `v0.1.0` and attaches release assets; AMO is not contacted.
- `github-and-amo` mode submits Firefox 0.1.0 to the AMO `listed` channel via Mozilla's API v5, using encrypted GitHub secrets, then creates or reuses the GitHub prerelease.
- A successful API submission means **submitted for review**, not published/approved. Unlisted signing and public release approvals are separate.

See [publishing runbook](AMO_PUBLISHING.md) and [release checklist](RELEASE_CHECKLIST.md).
