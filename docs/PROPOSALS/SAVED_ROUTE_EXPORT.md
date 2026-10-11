# 提案: 保存済みルートのGPX出力と能力ベースの対象判定

Status: **DISCUSSION / NOT APPROVED FOR IMPLEMENTATION** (2026-10-11)  
Scope: future Touring Supporter expansion; **do not change** the committed first-public-release scope without explicit requirements decision.  
Evidence source: user-provided Firefox HAR for a saved-route view, evaluated locally. **Never commit the HAR, account data, exact route IDs, cookies, authorization headers, raw JSON, or GPS coordinates**.

## 1. Verified observations, not speculation

A saved route appears at a page URL of the form:

```text
https://web.moto.touring.navitime.jp/routes/view/?id={routeId}
```

The inspected HAR contains a successful same-origin GET response at:

```text
GET /api/v1/riders/routes/{routeId}
```

Its JSON provides title, description, distance, time estimates, route settings and a structured geometry:

- `route.geojson.type = FeatureCollection`.
- 35 GeoJSON `LineString` features, in order, with 2,648 total source vertices.
- All 34 inter-feature transitions have identical previous-endpoint and next-startpoint coordinates. Collapsing **only** these repeated boundary vertices yields 2,614 ordered points and one contiguous line; do not perform arbitrary smoothing or thinning.
- Each vertex is a pair `[longitude,latitude]`, without per-vertex elevation or timestamp.
- `route.datum = wgs84`, `route.unit = degree`.
- `route.points` contains five named start/stop/via positions and `route.guide` contains navigation guide annotations. These must not be confused with the complete detailed route geometry.
- In-memory trial serialization of the merged geometry to a GPX 1.1 `trk/trkseg/trkpt` structure parsed successfully as XML. No file or real GPS track was written to disk.
- Simple haversine sum was approximately 82.83 km; service-estimated distance was 82.6 km. This is a plausibility check, not a correctness guarantee nor GPX XSD validation.

Separately, during the current formal v0.0.1 acceptance test, a saved-route view correctly produces `UNSUPPORTED_PAGE` (with disabled download and retry) because the initial target only includes recorded-ride detail URLs. The user requested future expansion.

## 2. Architecture proposal (not decided yet)

**Detect supported export opportunities; do not passively sniff every page's network JSON.**

Recommend a registry of data-source modules grouped by service and data kind:

```text
NAVITIME GPX Exporter popup
  → available-export discovery for current tab
    → Touring Supporter / ride-record adapter (already supported)
    → Touring Supporter / saved-route adapter (future; not implemented)
    → other-service adapters (future; not implemented)
  → common geometry model
  → GPX serializer (and optional other export formats later)
```

The popup asks a source adapter for a safe summary and list of export capabilities. The adapter validates the recognized page context and actual route identity, then fetches only the endpoint needed for the user-selected export. Do **not** require a global traffic-recording mode.

A future interface might conceptually expose `supports(context)`, `getSummary(context)`, and `getGeometry(context)`. This is a design placeholder and is **not** a stable code contract.

## 3. A planned route is not a GPS ride

| Field | Recorded ride | Saved planned route |
| --- | --- | --- |
| Geometry | GPS point history | Route calculation polyline |
| Latitude/longitude | Yes | Yes |
| Point timestamps | Yes | **No** |
| Point elevations | Source values | **No** |
| Feature segmentation | Meaningful original track segments | 35 contiguous *drawing/road sections*; merge into one continuous track |
| Route stops | Source-specific | Five source stops/waypoints |
| Date | Actual start time | Creation/update metadata, **not actual ride start** |

Consequences:
- The current normalized track model requires `metadata.startTime` and point timestamps; merely introducing a second adapter would cause errors. A common geometry model should allow absent point time and elevation, and model recorded/planned source types distinctly.
- For precise map-shape interoperability, proposed default output is a detailed GPX `<trk>` with zero `<time>` or `<ele>` children for planned-route points. In future, original planned stops could be exported as named `<wpt>`; turning instructions are a separate concern. GPX `<rte>` is another output choice needing interoperability tests; never assume receivers preserve the routing geometry.
- Metadata time and the filename must **not** invent a ride start. A route-specific filename convention needs explicit approval. Creation/update dates without clear zone cannot be silently treated as actual ride starts.
- Keep the original per-point timestamp/altitude guarantees for recorded rides unchanged.
- The geometry merge must verify line continuity and preserve disconnections as separate segments; only remove duplicate boundary points proven identical.
- Ensure the URL's route identifier, endpoint path and returned route ID match before exporting to prevent saving stale SPA content.

## 4. Why not observe all JSON traffic?

- An unrelated site response with coordinates is not necessarily user-exportable geometry. Generic response sniffing risks mistaking markers, guides, tiles, and simple waypoint lists for route tracks.
- Chrome extension content scripts are normally in an isolated world. They cannot automatically read the host page's `fetch`/XHR response bodies. `chrome.webRequest` exposes request lifecycle and metadata, not a general-purpose JSON response-body reader.
- Monkeypatching the webpage's `window.fetch` or XHR in the MAIN world would be intrusive, complicate browser compatibility and store privacy review, and can miss responses emitted before injection, cached data, or route changes that do not trigger requests.
- User-facing on-demand, domain-scoped API requests are easier to reason about and are consistent with the existing no-telemetry/minimal-permission requirements.

Use feature detection for supported *data types*, but restrict network access to known service-adapter endpoints and retain explicit user action before downloading.

## 5. Suggested phased approach

1. Keep v0.1.0 scope: recorded Touring Supporter rides, plus complete negative-case/GPX XSD/store-quality acceptance gates.
2. Add the saved-route adapter as the **first post-baseline feature** after approving a revised common route model, file naming and default GPX `trk` semantics.
3. Generalize recognition to additional pages *within Touring Supporter* as specific API contracts are verified and test fixtures become available (synthetic fixtures only in the public repository).
4. Add different NAVITIME services using distinct adapters and permissions after separate feasibility and policy review.

## 6. Validation requirements for future implementation

- Synthetic saved-route JSON fixture with several LineStrings, shared endpoints, disconnected edges, invalid geometry and no timestamps/elevations.
- Deterministic merge and accurate point count, preserved planned-route shape and correctly omitted optional GPX tags.
- End-to-end manual tests for three browsers on a route-detail page; read-only GETs only; error/retry diagnostics must not expose route IDs or geometry.
- Compare against a map-app rendering; complete XSD validation of planned/recorded variants.
- Reject unsupported or ambiguous data; do not use broad origin permissions or passive HAR-like traffic collection.

## External design references
- Chrome extensions content scripts / isolated worlds: https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts
- Chrome webRequest permission and event metadata: https://developer.chrome.com/docs/extensions/reference/api/webRequest
- GPX 1.1 canonical schema: https://www.topografix.com/gpx/1/1/

This is a **proposal and sanitized HAR finding**, not implemented functionality, no new browser permissions, and no change to the v0.1.0 release gate.
