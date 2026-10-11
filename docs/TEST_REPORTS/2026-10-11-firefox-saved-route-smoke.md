# Firefox saved-route smoke test — development 0.0.2

Date: 2026-10-11  
Status: **User-reported download success; geometry/data acceptance remains pending.**

## Evidence from the user
- The user identified Firefox's blocked download as the **outer GitHub Actions artifact `extension-builds.zip`**. The exact nested Firefox extension ZIP was not identified as blocked.
- The user checked the downloaded file with Microsoft Defender and reported no detection. The user prefers to **defer further download-warning investigation for the development stage**, suspecting reputation-based blocking.
- The user subsequently **successfully downloaded GPX from a saved planned-route page in Firefox** with the development 0.0.2 implementation.
- No exported saved-route GPX, its complete geometry, or any new screenshot was provided with this confirmation. Do not represent the original 2,614-point prediction as verified output.

## Assessment
| Check | Result |
| --- | --- |
| Firefox can export a saved planned route (user-report) | PASS, smoke-test level |
| Browser-specific saved-route popup date/title verification | Not independently confirmed in this turn |
| GPX XML parsing / GPX 1.1 XSD | NOT TESTED on saved-route output |
| Point count, segments and detailed coordinate parity vs private HAR | NOT TESTED |
| Absence of invented time/elevation | NOT TESTED on actual exported file |
| Map-app route rendering | NOT TESTED |
| Recorded-ride regression in **0.0.2** | NOT YET RECONFIRMED |
| Chrome and Edge planned route | NOT TESTED |

## Firefox ZIP warning disposition
- The detection screenshot was from Firefox's download manager; user clarified **outer artifact only**, `extension-builds.zip`.
- Previously, the actual CI artifact (36,224 bytes) was inspected; all nested extension source files matched Git Blob hashes in the repository. No native executables or unexpected paths were observed.
- **Defender's no-detection observation plus provenance does not prove the Firefox verdict is wrong.** There is no evidence yet showing the URL reputation was specifically responsible.
- User requested to leave this warning investigation **deferred**, not to disable browser protection or declare the binary harmless.
- Before distributing v0.1.0 publicly, reassess signed store packaging/download reputation. Do not auto-publish the blocked artifact as a trusted public release.

## Next acceptance step
Obtain (only if the user elects to provide it privately in chat) the **GPX generated from the saved-route screen** to check well-formed GPX, expected geometry point/segment counts (2,614/1 only if the same HAR route), no `time`/`ele` fabrication, and map alignment. Do **not** commit actual GPS geometries, raw HAR contents or account details.

Then run Firefox 0.0.2 recorded-ride regression, followed by saved-route checks in Chrome and Edge. The 0.1.0 release gate remains unchanged.
