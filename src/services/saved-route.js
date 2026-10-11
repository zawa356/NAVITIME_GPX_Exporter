(function (root) {
  "use strict";
  const E = root.NavitimeErrors || (typeof require === "function" ? require("../core/errors.js") : null);
  const H = root.NavitimeHttp || (typeof require === "function" ? require("../core/http.js") : null);
  const G = root.NavitimeGeoJson || (typeof require === "function" ? require("../formats/geojson.js") : null);
  const ORIGIN = "https://web.moto.touring.navitime.jp";
  const VIEW = /^\/routes\/view\/?$/;
  function idFromUrl(input) {
    let url;
    try { url = new URL(input); } catch { return null; }
    if (url.origin !== ORIGIN || !VIEW.test(url.pathname)) return null;
    const id = url.searchParams.get("id");
    return /^[a-f0-9]{32}$/i.test(id || "") ? id.toLowerCase() : null;
  }
  async function loadRoute(id) {
    if (!/^[a-f0-9]{32}$/i.test(id || "")) throw new E.ExportError("INVALID_ROUTE_ID", "summary");
    const raw = await H.getJson("/api/v1/riders/routes/" + id, "route");
    if (typeof raw?.public_route_id !== "string" ||
        raw.public_route_id.toLowerCase() !== id.toLowerCase() ||
        raw?.route?.datum?.toLowerCase() !== "wgs84" ||
        raw?.route?.unit !== "degree") {
      throw new E.ExportError("INVALID_ROUTE", "route");
    }
    return raw;
  }
  function describe(raw, id) {
    const date = typeof raw.register_time === "string" ?
      raw.register_time.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/) : null;
    return { kind: "planned", id,
      title: typeof raw.title === "string" ? raw.title : "",
      date: date ? date[1] + "-" + date[2] + "-" + date[3] : "",
      dateLabel: "登録日" };
  }
  async function getSummary(id) { return describe(await loadRoute(id), id); }
  async function getTrack(summary) {
    const raw = await loadRoute(summary.id);
    const geometry = G.decodePlanned(raw.route.geojson);
    return { kind: "planned", name: (typeof raw.title === "string" && raw.title.trim()) ?
      raw.title : "保存済みルート", routeId: summary.id,
      startTime: null, segments: geometry.segments, count: geometry.count };
  }
  const api = Object.freeze({ idFromUrl, getSummary, getTrack });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeSavedRoute = api;
})(globalThis);
