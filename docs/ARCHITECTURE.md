# Architecture / 基本設計

## Execution environments
- **Popup**: lightweight user interaction and safe diagnostics, communicated with `chrome.tabs.sendMessage`. Treat every popup lifetime as ephemeral.
- **Content script**: lives in the matching logged-in website tab; makes same-origin credentialed GET requests only when requested, validates identity and initiates the download. Prevents duplicate in-flight exports and re-checks location before saving.
- **Service adapters**: `src/services/touring-supporter.js` (recorded ride) and `src/services/saved-route.js` (planned route) identify supported URLs and perform service-specific identity checks. The registry (`src/services/registry.js`) selects an adapter by active tab context; neither emits GPX.
- **Shared API transport**: `src/core/http.js` permits only same-origin service-adapter-requested `/api/v1/` JSON GETs. No background response interception.\n- **Format adapter**: `src/formats/geojson.js` interprets saved-route GeoJSON line features and merges only identical adjacent boundaries, preserving disconnections. Additional formats are experimental candidates only.\n- **Normalized track**: `src/core/track.js` remains strict for recorded rides (timestamps required) and now supports a separate planned-route geometry model with nullable time/elevation; filename rules vary by semantic kind.
- **Output module**: `src/formats/gpx.js`; serializes GPX 1.1 from the normalized track, without querying network.
- **Errors**: `src/core/errors.js` + popup diagnostics; whitelist only stable diagnostic fields. Never display raw exception contents or full HTTP bodies.

## Data flow
```text
Popup open
   → active tab → message:summary
     → content script → source registry → endpoint summary
     → title + biographyDate only → popup
Popup export
   → message:export
     → current tab ID validation
     → recorded ride: /api/v1/touring/log?activityId=<validated>\n       OR saved route: /api/v1/riders/routes/<validated route ID>
     → normalize Track, validate complete data
     → check original page still displayed
     → GPX serialization → Blob / anchor download
     → popup acknowledgement (best effort; popup may be closed)
```

**Credentials:** request credentials are sent only to the original NAVITIME origin by the browser's standard same-origin session machinery. The extension never reads cookies.

## Data model (JavaScript objects)
- Recorded `Track`: `name: string`, `activityId: string`, `startTime: ISO UTC string`, `startTimeSource: offset-aware source string`, `segments: Point[][]`, `count: integer`.\n- Planned `Track`: `kind: "planned"`, `name: string`, `routeId: string`, `startTime: null`, `segments: Point[][]`, `count: integer`.
- `Point`: `lat: number`, `lon: number`, `elevation: number | null`, `time: ISO UTC string | null` (null only allowed for verified planned-route model).
- API-specific `metadata.datum` is not used to transform coordinates: prior visual check showed that no horizontal transform was needed.

## Principles and limitations
- No general-purpose remote adapter loader or remote executable code. Additional services will have **locally bundled** adapters, enabled with explicitly scoped host permissions. Unknown APIs remain disabled rather than guessed online.
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
- ADR-005: Popup-free export continuation within live tab; navigations are a cancellation boundary.\n- ADR-006: Recognized source registry, rather than network-wide JSON sniffing. Current sources: recorded rides and saved planned routes. New service adapters may be synthetic-tested offline as Experimental, without promising online availability.\n- ADR-007: Planned route lines become a GPX track without manufactured timestamps/elevations. Save as `保存ルート_タイトル.gpx`; skip only identical consecutive feature-boundary vertices, not original source interiors. Do not invent a start time or transform geographic datum.

## Before store submission
- Validate Firefox, Chrome, Edge in actual logged-in accounts, including SPA navigation, long running export, popup close, and duplicate clicks.
- Confirm GPX XML against 1.1 XSD and load into at least one mapping application.
- Check service terms and store trademark/misrepresentation policies for “NAVITIME” naming.

## Current browser test status / acceptance

Recorded-ride exports are verified on Firefox, Chrome and Edge and produce byte-identical GPX for the same 2,779-point ride. The **saved-route adapter is a new implementation under test**. It is grounded by a single user's HAR (35 contiguous LineStrings; 2,614 merged vertices) and synthetic API tests, but must be validated in each actual browser and cross-checked with an actual map app before v0.1.0 release. See `docs/RELEASE_CHECKLIST.md`. No additional NAVITIME service is claimed as supported.

### Known source-specific data-access behavior

The recorded-ride timeline API returns only title/record date; GPS data remains deferred until the export click. The saved-route API returns complete route geometry and metadata together, so opening the popup necessarily retrieves the route's GeoJSON to display its title/register date. No persistent extension storage is used, and export explicitly re-fetches the current route to detect changed or mismatched identity.

### Explicitly not implemented

- Arbitrary site JSON interception, response-body sniffing, remote adapters or broad wildcard host permission.
- Predictive network API calls for unsubscribed NAVITIME products.
- Navigation instructions/turn-by-turn semantics, waypoint output, elevation repair, invented timestamps, GPX `<rte>` output, batch export.
