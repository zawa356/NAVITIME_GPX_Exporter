(function (root) {
  "use strict";
  const E = root.NavitimeErrors;
  const T = root.NavitimeTrack;
  const DETAIL = /^\/users\/me\/biography\/touring\/detail\/?$/;
  function idFromUrl(input) {
    const u = new URL(input);
    if (u.origin !== "https://web.moto.touring.navitime.jp" || !DETAIL.test(u.pathname)) return null;
    const id = u.searchParams.get("id");
    return /^\d+$/.test(id || "") ? id : null;
  }
  async function getJson(path, phase) {
    let result;
    try { result = await fetch(path, { method: "GET", credentials: "same-origin", cache: "no-store" }); }
    catch { throw new E.ExportError("NETWORK_ERROR", phase); }
    if (!result.ok) {
      throw new E.ExportError(result.status === 401 || result.status === 403 ?
        "AUTH_REQUIRED" : "API_ERROR", phase, result.status);
    }
    if (!(result.headers.get("content-type") || "").toLowerCase().includes("json")) {
      throw new E.ExportError("UNEXPECTED_RESPONSE", phase);
    }
    try { return await result.json(); }
    catch { throw new E.ExportError("INVALID_JSON", phase); }
  }
  async function getSummary(id) {
    const detail = await getJson("/api/v1/users/me/timelines/" + id, "summary");
    if (String(detail?.biographyId) !== id || detail?.dataType !== "touring" ||
        !/^\d+$/.test(String(detail?.touring?.appliId ?? ""))) {
      throw new E.ExportError("INVALID_SUMMARY", "summary");
    }
    return { id, activityId: String(detail.touring.appliId),
      title: typeof detail.titleName === "string" ? detail.titleName : "",
      date: typeof detail.biographyDate === "string" ? detail.biographyDate.slice(0, 10) : "" };
  }
  async function getTrack(summary) {
    const raw = await getJson("/api/v1/touring/log?activityId=" +
      encodeURIComponent(summary.activityId), "track");
    const track = T.normalize(raw, summary.activityId, summary.title);
    track.startTimeSource = raw.metadata.startTime;
    return track;
  }
  const api = Object.freeze({ idFromUrl, getSummary, getTrack });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeTouring = api;
})(globalThis);
