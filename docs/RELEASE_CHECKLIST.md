# Release and acceptance checklist

**Target:** First public release `0.1.0` (NOT accomplished by merging the `0.0.1` development branch).

## Automated gates
- [ ] `npm run check` validates all JavaScript source.
- [ ] `npm test` passes against synthetic tracks.
- [ ] `npm run build` produces a Firefox ZIP and Chromium ZIPs for Chrome and Edge.
- [ ] CI passes for Node 20 and 22 on the intended commit.
- [ ] Verify GPX XML against GPX 1.1 XSD; tests should eventually automate this with a suitable offline XSD validator.
- [ ] Review code for secrets, personal GPS histories, HARs, and unnecessary dependencies.

## Manual browser matrix (must be performed before public release)
| Test | Firefox | Chrome | Edge |
| --- | --- | --- | --- |
| Popup shows title + date | ☐ | ☐ | ☐ |
| Logged-in single-ride export | ☐ | ☐ | ☐ |
| GPX displayed correctly in map app | ☐ | ☐ | ☐ |
| Different ride after SPA navigation | ☐ | ☐ | ☐ |
| Invalid/unsupported page | ☐ | ☐ | ☐ |
| Logged-out/expired session | ☐ | ☐ | ☐ |
| Network / API / empty / corrupted response | ☐ | ☐ | ☐ |
| Retry and safe diagnostic copy | ☐ | ☐ | ☐ |
| Close popup during export | ☐ | ☐ | ☐ |
| Navigation away during export | ☐ | ☐ | ☐ |
| Duplicate export clicks | ☐ | ☐ | ☐ |

## Store & documentation
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
