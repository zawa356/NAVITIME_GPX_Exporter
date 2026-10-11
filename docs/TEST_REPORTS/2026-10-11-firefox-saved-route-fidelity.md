# Firefox saved planned-route GPX: complete source-data fidelity — 2026-10-11

## Scope and privacy
- Browser: Firefox; extension development package `0.0.2`; user-confirmed download of the saved planned-route GPX.
- Input GPX and corresponding authenticated Touring Supporter HAR were supplied privately in the conversation. **Do not commit the source GPX, HAR, private coordinates or site-session data to this repository.**
- Inspected only read-only data and reported aggregate results here.

## Original saved-route JSON compared against GPX
| Test | Result | Status |
| --- | --- | --- |
| XML can be parsed | Yes | PASS |
| GPX namespace / version | GPX 1.1 | PASS |
| Number of tracks | 1 | PASS |
| Number of GPX track segments | 1 | PASS |
| HAR GeoJSON `LineString` features | 35 | Source fact |
| Source vertices including repeated joins | 2,648 | Source fact |
| Duplicate adjacent feature endpoints | 34 of 34 joins | Source fact |
| Expected normalized vertices | 2,614 | PASS |
| Actual GPX `trkpt` vertices | 2,614 | PASS |
| Ordered longitude and latitude | **2,614 of 2,614 values exactly identical** | PASS |
| Coordinate mismatches / transformations | **0** | PASS |
| Per-point `<ele>` | None, matching the source | PASS |
| Per-point `<time>` and metadata time | None, matching unavailable ride times | PASS |
| Track / metadata name | Present | PASS |
| GPX coordinate-derived length (haversine sum) | ~82.833 km | Plausible |
| NAVITIME original route length | 82.6 km | Source |
| Maximum distance between consecutive GPX points | ~288.4 m | No multi-km teleport detected |
| First and final GPX points | ~5.37 m apart | Source-defined circuit |
| Independent GPX 1.1 XSD schema validation | Not performed | PENDING |
| Independent OpenStreetMap / GSI cartographic road alignment | Not established in current runtime | PENDING |

## Map-alignment distinction
**Source-to-export geometry: PASS with exact equality.** All 2,614 exported ordered positions are byte-equivalent as coordinate numbers to the user's own NAVITIME route API JSON after removing only the 34 duplicated endpoints at feature boundaries. Hence this extension has introduced **no coordinate shift, datum conversion, reordering, route simplification or dropped coordinate** in the source-to-GPX transformation.

This does **not** independently prove that the NAVITIME source polyline perfectly coincides with roads on OpenStreetMap, GSI Maps or satellite imagery. The runtime could not retrieve third-party map tiles for a visual independent basemap check. An **unpublished private HTML map viewer** was produced for the user, embedding the GPX track and allowing toggling between the GSI raster map and OSM standard roads. It is shared only in the conversation, not the repository. When opened online by the user, third-party tile providers may receive bounding-box/tile requests, but the GPX coordinates are not uploaded to a track processor.

Do not extrapolate full GPX fidelity to other routes or different services without testing.

## Remaining acceptance gates
- [x] Firefox saved planned-route GPX download
- [x] Firefox saved-route 2,614-point complete data fidelity vs its original HAR
- [x] No fabricated point time or elevation, correct contiguous 35-section merge
- [ ] GPX viewer aligned with a map in user's browser
- [ ] GPX 1.1 XSD validation
- [ ] Recorded ride regression in `0.0.2`
- [ ] Chrome and Edge saved-route end-to-end tests
- [ ] Other manual negative-case security and lifecycle checks

This file contains only aggregate tests; no full route coordinates or user-authentication details.
