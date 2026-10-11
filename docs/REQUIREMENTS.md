# Requirements baseline — 2026-10-11

**Status:** agreed in conversation; implementation status remains independent.

## Functional requirements
- FR-01 Name: NAVITIME GPX Exporter (MIT, unofficial, independent).
- FR-02 v1.0 target: NAVITIME Touring Supporter web app only. Extensible to other products through adapters, without speculative integrations.
- FR-03 A single ride currently visible on a detailed biography page; no batch export.
- FR-04 Toolbar action opens popup, not an injected website button.
- FR-05 Popup opening requests *summary only*: title and record date. No GPX-data download yet.
- FR-06 Clicking export retrieves live GPS track, validates activity ID and data, generates and downloads GPX 1.1.
- FR-07 Preserve original lon/lat, ordering, timestamps as equivalent UTC instants, all finite source elevations, and segment boundaries, without smoothing or datum transformation. Omit `ele` when source elevation missing.
- FR-08 GPX metadata/track names use original title (XML-escaped), GPX metadata time uses actual GPS start time.
- FR-09 Filename `YYYY-MM-DD_HHMMSS_タイトル.gpx` uses source's start time with its original offset, sanitized across OS; fallback ID when title unavailable.
- FR-10 Invalid/mismatched/empty responses abort before download.
- FR-11 Popup handles invalid page, session expiration, API/network issues, retry, safe diagnostics expand-and-copy, duplicate click avoidance.
- FR-12 Browser session is used; extension never collects credentials directly, sends coordinates to developer-hosted endpoints, or stores tracks persistently.
- FR-13 Support Firefox, Chrome, and Edge (actual acceptance on all required for public v1.0).
- FR-14 GitHub prerelease followed by quality-gated public release 0.1.0+ and store submissions when ready. Review delays not release blockers.

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

## Deferred
- Future service adapters and other export formats.
- Automatic store publication; approval requires external accounts and live manual tests.
- Supported OS/lowest browser versions pending acceptance runs.
