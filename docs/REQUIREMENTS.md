# Requirements baseline — 2026-10-11 (revised for two Touring Supporter export sources)

**Status:** agreed in conversation; implementation status remains independent.

## Functional requirements
- FR-01 Name: NAVITIME GPX Exporter (MIT, unofficial, independent).
- FR-02 v0.1.0 public target: NAVITIME Touring Supporter web app, both **recorded rides** and **saved planned routes**. Other NAVITIME products remain future Experimental candidates via dedicated adapters.
- FR-03 One currently displayed item (ride-log detail or saved-route detail); no batch export.
- FR-04 Toolbar action opens popup, not an injected website button.
- FR-05 Popup opening displays summary: item kind, title, record/register date. Actual ride log uses summary-only API; saved-route API includes full geometry in its response. Nothing is persistently retained.
- FR-06 Clicking export retrieves/validates the current data; matches activity ID or saved-route ID; generates GPX 1.1 and requests a browser download.
- FR-07 Recorded rides preserve original lon/lat, ordering, timestamps as equivalent UTC instants, finite elevation values and original segment boundaries, with no smoothing or datum transformation. Saved routes retain detailed lon/lat and omit time/altitude; merge only identical adjacent segment endpoints and preserve real disconnections.
- FR-08 GPX metadata/track names use source title (XML-escaped). Metadata time uses actual ride start if present; saved-route metadata time must be omitted.
- FR-09 Recorded filename `YYYY-MM-DD_HHMMSS_タイトル.gpx` uses source start offset; saved route filename `保存ルート_タイトル.gpx` with sanitization and ID fallback, without a fictional start date.
- FR-10 Invalid/mismatched/empty responses abort before download; planned route supports only WGS84 degrees and checks route identity.
- FR-11 Popup handles invalid page, session expiration, API/network issues, retry, safe diagnostics expand-and-copy, duplicate click avoidance.
- FR-12 Browser session is used; extension never collects credentials directly, sends coordinates to developer-hosted endpoints, or stores tracks persistently.
- FR-13 Support Firefox, Chrome, and Edge (actual acceptance on all required for public v1.0).
- FR-14 GitHub prerelease followed by quality-gated public release 0.1.0+ and store submissions when ready. **Both Touring Supporter page types** must pass Firefox, Chrome and Edge manual acceptance before public release. Review delays not release blockers.

## Nonfunctional requirements
- NFR-01 Service-specific endpoint/response parsing must be isolated from track model and serialization.
- NFR-02 Minimize permissions; no permissions for future NAVITIME products prematurely.
- NFR-03 Synthetic fixture tests in CI; real private logs/HAR never committed.
- NFR-04 Maintain detailed docs/change logs for continuity between maintainers and AI agents.
- NFR-05 Every substantial milestone in its own commit; developmental 0.0.x milestone sequence, first **public** release planned 0.1.0.
- NFR-06 Non-official disclaimer, privacy policy, store-friendly docs.

## Approved implementation interpretation
- Popup may disappear after export click. Already-started work remains in content-script context where practical; if the tab or page navigates away, operation may be canceled and must never download a different ride.
- If an API returns a successful non-JSON login page, classify as unexpected response without embedding HTML in diagnostics.
- Distinguish `biographyDate` (record date) from `metadata.startTime` (actual ride start).

## Experimental / partially inferred integration policy
- Separate the verified service API adapter from reusable format decoders (GeoJSON today; other formats when evidence exists).
- Unsubscribed NAVITIME services may receive **offline-tested Experimental adapters** only where meaningful public/authorized evidence supports an API contract. No guessed network endpoint should be queried without a verified allowed origin and explicit user trigger.
- Runtime detection must distinguish actual ride and planned-route semantics, never infer missing temporal/elevation data, and fail closed on identity/shape mismatch.
- Source discovery is on-demand from recognized current pages, **not** passive interception of all network traffic.
- Track-level and planned-route-level automated tests must use synthetic data.
- First public version 0.1.0 will be released only after planned-route tests on the three supported browsers; stored implementation remains development until then.

## Deferred
- Other NAVITIME service adapters, additional page patterns without API evidence, and export formats beyond GPX 1.1.
- Automatic store publication; approval requires external accounts and live manual tests.
- Supported OS/lowest browser versions pending acceptance runs.
