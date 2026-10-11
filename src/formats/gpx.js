(function (root) {
  "use strict";
  function xml(v) {
    return String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  function convert(track) {
    const out = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="NAVITIME GPX Exporter">',
      '<metadata><name>' + xml(track.name) + '</name>' +
        (track.startTime ? '<time>' + track.startTime + '</time>' : '') + '</metadata>',
      '<trk><name>' + xml(track.name) + '</name>'
    ];
    for (const segment of track.segments) {
      out.push("<trkseg>");
      for (const point of segment) {
        const ele = point.elevation === null ? "" : "<ele>" + point.elevation + "</ele>";
        out.push('<trkpt lat="' + point.lat + '" lon="' + point.lon + '">' + ele +
          (point.time ? "<time>" + point.time + "</time>" : "") + "</trkpt>");
      }
      out.push("</trkseg>");
    }
    out.push("</trk>", "</gpx>");
    return out.join("\n");
  }
  const api = Object.freeze({ convert, xml });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeGpx = api;
})(globalThis);
