# Architecture / 基本設計

## Execution environments
- **Popup**: lightweight user interaction and safe diagnostics, communicated with `chrome.tabs.sendMessage`. Treat every popup lifetime as ephemeral.
- **Content script**: lives in the matching logged-in website tab; makes same-origin credentialed GET requests only when requested, validates identity and initiates the download. Prevents duplicate in-flight exports and re-checks location before saving.
- **Service adapter**: `src/services/touring-supporter.js`; identifies a supported detail URL; knows `biographyId → timeline touring.appliId → /touring/log`. The adapter never emits GPX.
- **Normalized track**: `src/core/track.js`; strips endpoint-specific details, validates data, preserves ordering/segments, handles filename.
- **Output module**: `src/formats/gpx.js`; serializes GPX 1.1 from the normalized track, without querying network.
- **Errors**: `src/core/errors.js` + popup diagnostics; whitelist only stable diagnostic fields. Never display raw exception contents or full HTTP bodies.

## Data flow
```text
Popup open
   → active tab → message:summary
     → content script → timeline summary endpoint
     → title + biographyDate only → popup
Popup export
   → message:export
     → current tab ID validation
     → /api/v1/touring/log?activityId=<validated>
     → normalize Track, validate complete data
     → check original page still displayed
     → GPX serialization → Blob / anchor download
     → popup acknowledgement (best effort; popup may be closed)
```

**Credentials:** request credentials are sent only to the original NAVITIME origin by the browser's standard same-origin session machinery. The extension never reads cookies.

## Data model (JavaScript objects)
- `Track`: `name: string`, `activityId: string`, `startTime: ISO UTC string`, `startTimeSource: offset-aware source string`, `segments: Point[][]`, `count: integer`.
- `Point`: `lat: number`, `lon: number`, `elevation: number | null`, `time: ISO UTC string`.
- API-specific `metadata.datum` is not used to transform coordinates: prior visual check showed that no horizontal transform was needed.

## Principles and limitations
- No general-purpose adapter loader or remote executable code. Additional services will have **locally bundled** adapters, enabled with explicitly scoped host permissions.
- Popup does not need to keep running for the content-script export promise to continue. Closing/navigating the tab cancels the operation.
- Firefox vs Chromium manifest variants are built separately; shared code targets standard callback-based browser extension APIs.
- Current website endpoint layouts are based on a small proof-of-concept, not a documented public integration contract. If endpoints change, abort without emitting damaged GPX.
- No background worker required in this initial version, avoiding MV3 service-worker lifecycle dependencies.
- A browser may block programmatic download or enforce settings; show “save requested”, not guaranteed disk persistence.

## Architecture decision records
- ADR-001: Service adapters + normalized track separate source interpretation from output. Chosen for future NAVITIME services.
- ADR-002: Same-origin content-script fetch, rather than popup cross-origin fetch, based on successful Firefox PoC and minimum permission model. Chrome/Edge live behavior still requires verification.
- ADR-003: Dedicated per-browser manifests, same source modules; no remote code.
- ADR-004: Strict rejection on invalid timestamps/coordinates or mismatched activity; missing elevation is represented by omitted `ele`.
- ADR-005: Popup-free export continuation within live tab; navigations are a cancellation boundary.

## Before store submission
- Validate Firefox, Chrome, Edge in actual logged-in accounts, including SPA navigation, long running export, popup close, and duplicate clicks.
- Confirm GPX XML against 1.1 XSD and load into at least one mapping application.
- Check service terms and store trademark/misrepresentation policies for “NAVITIME” naming.
