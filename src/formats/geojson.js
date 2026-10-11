(function (root) {
  "use strict";
  const E = root.NavitimeErrors || (typeof require === "function" ? require("../core/errors.js") : null);
  function fail(code) { throw new E.ExportError(code, "validation"); }
  function point(pair) {
    if (!Array.isArray(pair) || pair.length !== 2 ||
        typeof pair[0] !== "number" || typeof pair[1] !== "number" ||
        !Number.isFinite(pair[0]) || !Number.isFinite(pair[1]) ||
        pair[0] < -180 || pair[0] > 180 || pair[1] < -90 || pair[1] > 90)
      fail("INVALID_COORDINATES");
    return { lon: pair[0], lat: pair[1], elevation: null, time: null };
  }
  function same(a, b) { return a.lon === b.lon && a.lat === b.lat; }
  // Planned navigation geometry: join only identical boundary vertices.
  // Disjoint parts become separate GPX trkseg elements; never fabricate connectors.
  function decodePlanned(collection) {
    if (collection?.type !== "FeatureCollection" || !Array.isArray(collection.features))
      fail("INVALID_GEOJSON");
    const segments = [];
    let current = [], count = 0;
    for (const feature of collection.features) {
      if (feature?.geometry?.type !== "LineString" ||
          !Array.isArray(feature.geometry.coordinates) ||
          feature.geometry.coordinates.length < 2) fail("INVALID_SEGMENT");
      const points = feature.geometry.coordinates.map(point);
      if (current.length && same(current[current.length - 1], points[0])) {
        for (let i = 1; i < points.length; i++) current.push(points[i]);
      } else {
        if (current.length) segments.push(current);
        current = points;
      }
    }
    if (current.length) segments.push(current);
    for (const segment of segments) count += segment.length;
    if (!count) fail("EMPTY_TRACK");
    return { segments, count };
  }
  const api = Object.freeze({ decodePlanned });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeGeoJson = api;
})(globalThis);
