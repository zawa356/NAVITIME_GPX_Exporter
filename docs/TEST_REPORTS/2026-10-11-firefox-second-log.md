# Firefox second-file acceptance / legacy PoC UI — 2026-10-11

## Evidence (provided by user privately)
- User reported successfully downloading an additional GPX file while testing the extension on Firefox.
- The user also reported that the web page showed a banner with text `GPXエクスポート（テスト版）` and a notification with `1,436地点・1区間`, and requested that this not appear in the final extension.
- **The current `src/extension/content.js` does not inject a panel, banner, or status text into the page.** All current user-facing controls reside under `src/popup/`. The displayed UI is consistent with a previously loaded Firefox PoC extension that injected an on-page panel. This is a *probable cause, not yet confirmed*.
- This report does not commit user screenshots, actual route geometry or private GPX data.

## Offline inspection of the user-uploaded second GPX
| Test | Observed | Status |
| --- | --- | --- |
| XML well formed | Yes | PASS |
| GPX namespace/version | GPX 1.1 | PASS |
| Track count | 1 | PASS |
| Segment count | 1 | PASS |
| Track points | 539 | PASS (file itself) |
| Point timestamp populated | 539 / 539 | PASS |
| Point elevation populated | 539 / 539 | PASS |
| Point timestamps monotonic | 0 reversals, 0 duplicates | PASS |
| GPX metadata time equals first point | Yes | PASS |
| Filename derived from timestamp + title | Yes | PASS |
| Full point-for-point comparison to source JSON | Not available for this ride | NOT VERIFIED |
| GPX 1.1 XSD validation | Not performed | NOT VERIFIED |

**Important discrepancy:** the screenshot says **1,436 points**, whereas the attached GPX contains **539 points**. The screenshot may correspond to an older PoC export or a different ride. Do not treat these as the same exact export operation until the user confirms. The GPX cannot be certified as a faithful 1,436-point export; recording this discrepancy is more important than treating a successful download as exhaustive data validation.

## UI decision
The final v1.0 design must **not** inject any GPX toolbar or status panel into NAVITIME webpages. The popup is the exclusive user-facing UI; `content.js` is a message listener and GPX download controller.

## Follow-up steps
1. In Firefox `about:debugging`, remove any previously installed temporary PoC extension(s) that inject the old GPX banner; keep the current `NAVITIME GPX Exporter` only.
2. Reload the NAVITIME ride detail page; confirm the old page banner disappears.
3. Open toolbar popup and export again, noting the point-count confirmation in the *popup* rather than from the old page. Optionally re-upload the resulting file without sharing API responses.
4. Continue testing second ride, map rendering, Firefox negative cases, then Chrome and Edge.
