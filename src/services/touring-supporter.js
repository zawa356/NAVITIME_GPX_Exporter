(function (root) {
  "use strict";
  const E = root.NavitimeErrors;
  const T = root.NavitimeTrack;
  const H = root.NavitimeHttp || (typeof require === "function" ? require("../core/http.js") : null);
  const DETAIL = /^\/users\/me\/biography\/touring\/detail\/?$/;
  function idFromUrl(input) {
    const u = new URL(input);
    if (u.origin !== "https://web.moto.touring.navitime.jp" || !DETAIL.test(u.pathname)) return null;
    const id = u.searchParams.get("id");
    return /^\d+$/.test(id || "") ? id : null;
  }
  async function getSummary(id) {
    const detail = await H.getJson("/api/v1/users/me/timelines/" + id, "summary");
    if (String(detail?.biographyId) !== id || detail?.dataType !== "touring" ||
        !/^\d+$/.test(String(detail?.touring?.appliId ?? ""))) {
      throw new E.ExportError("INVALID_SUMMARY", "summary");
    }
    return { id, activityId: String(detail.touring.appliId),
      title: typeof detail.titleName === "string" ? detail.titleName : "",
      date: typeof detail.biographyDate === "string" ? detail.biographyDate.slice(0, 10) : "" };
  }
  async function getTrack(summary) {
    const raw = await H.getJson("/api/v1/touring/log?activityId=" +
      encodeURIComponent(summary.activityId), "track");
    const track = T.normalize(raw, summary.activityId, summary.title);
    track.startTimeSource = raw.metadata.startTime;
    return track;
  }
  const api = Object.freeze({ idFromUrl, getSummary, getTrack });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeTouring = api;
})(globalThis);
