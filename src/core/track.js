(function (root) {
  "use strict";
  const E = root.NavitimeErrors || (typeof require === "function" ? require("./errors.js") : null);
  function fail(code) { throw new E.ExportError(code, "validation"); }
  function iso(raw) {
    if (typeof raw !== "string" || !/(?:Z|[+-]\d{2}:\d{2})$/i.test(raw)) fail("INVALID_TIMESTAMP");
    const d = new Date(raw);
    if (!Number.isFinite(d.valueOf())) fail("INVALID_TIMESTAMP");
    return d.toISOString();
  }
  function normalize(raw, activityId, title) {
    if (String(raw?.metadata?.activityId) !== String(activityId)) fail("ACTIVITY_MISMATCH");
    if (raw?.geoJson?.type !== "FeatureCollection" || !Array.isArray(raw.geoJson.features)) fail("INVALID_GEOJSON");
    const startTime = iso(raw.metadata.startTime);
    let count = 0;
    const segments = raw.geoJson.features.map(feature => {
      const c = feature?.geometry?.coordinates, ts = feature?.properties?.pass_time;
      if (feature?.geometry?.type !== "LineString" || !Array.isArray(c) ||
          !Array.isArray(ts) || c.length !== ts.length) fail("INVALID_SEGMENT");
      const points = c.map((p, i) => {
        if (!Array.isArray(p) || p.length < 2) fail("INVALID_COORDINATES");
        const [lon, lat, elevation] = p;
        if (typeof lon !== "number" || !Number.isFinite(lon) || lon < -180 || lon > 180 ||
            typeof lat !== "number" || !Number.isFinite(lat) || lat < -90 || lat > 90) fail("INVALID_COORDINATES");
        if (p.length > 2 && elevation !== null && elevation !== undefined &&
            (typeof elevation !== "number" || !Number.isFinite(elevation))) fail("INVALID_ELEVATION");
        count++;
        return { lon, lat, elevation: elevation ?? null, time: iso(ts[i]) };
      });
      return points;
    }).filter(s => s.length > 0);
    if (!count) fail("EMPTY_TRACK");
    return { name: typeof title === "string" && title.trim() ? title : "Touring " + activityId,
      startTime, activityId: String(activityId), segments, count };
  }
  function filename(track) {
    const d = track.startTime;
    const date = d.slice(0, 10);
    const time = d.slice(11, 19).replace(/:/g, "");
    // ISO canonical UTC is not necessarily local time. The adapter can provide
    // an explicit startTimeOffset from the original service response.
    let prefix = date + "_" + time;
    if (typeof track.startTimeSource === "string") {
      const m = track.startTimeSource.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[+-]\d{2}:\d{2})$/);
      if (m) prefix = m[1] + "_" + m[2] + m[3] + m[4];
    }
    const label = String(track.name).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .replace(/[. ]+$/g, "").trim().slice(0, 90).replace(/[. ]+$/g, "");
    const fallback = track.activityId.replace(/\D/g, "") || "ride";
    return prefix + "_" + (label || fallback) + ".gpx";
  }
  const api = Object.freeze({ normalize, iso, filename });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeTrack = api;
})(globalThis);
