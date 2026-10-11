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

## Follow-up: obsolete in-page UI cleared

The user performed **Ctrl+F5 (hard reload)** and confirmed the old in-page GPX exporter panel disappeared. The current toolbar popup remains fully functional. A new screenshot shows the popup's completion message for **539 points / 1 segment** and Firefox's download history showing successful GPX downloads.

**Disposition:** Treat the extraneous in-page panel as stale page content from a former PoC, **not as an identified code defect in the current popup-only implementation**. Removal of a still-installed old temporary PoC extension is no longer confirmed as necessary; a hard reload resolved the symptom in this instance.

The earlier 1,436-point notice is attributed provisionally to stale PoC output, not a discrepancy in the current 539-point export. Full comparison of this second ride with its original source JSON remains unverified. No browser screenshot or user GPX has been committed.
