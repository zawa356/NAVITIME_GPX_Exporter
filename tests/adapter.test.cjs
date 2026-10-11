"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
require("../src/core/errors.js");
require("../src/core/track.js");
const adapter = require("../src/services/touring-supporter.js");

const base = "https://web.moto.touring.navitime.jp/users/me/biography/touring/detail/?id=1234";
function response(status, body, ct = "application/json") {
  return { ok: status >= 200 && status < 300, status,
    headers: { get: () => ct }, json: async () => body };
}
function log() {
  return { metadata: { activityId: 7777, startTime: "2026-10-10T12:27:26+09:00" },
    geoJson: { type: "FeatureCollection", features: [{
      geometry: { type: "LineString", coordinates: [[137.1, 35.1, 300]] },
      properties: { pass_time: ["2026-10-10T12:27:26+09:00"] }
    }] } };
}
async function mockFetch(fn, callback) {
  const prior = global.fetch;
  global.fetch = fn;
  try { return await callback(); } finally { global.fetch = prior; }
}
test("matches only Touring Supporter detail with numeric ID", () => {
  assert.equal(adapter.idFromUrl(base), "1234");
  assert.equal(adapter.idFromUrl(base.replace("id=1234", "id=abc")), null);
  assert.equal(adapter.idFromUrl(base.replace("touring/detail/", "touring/list/")), null);
  assert.equal(adapter.idFromUrl(base.replace("web.moto", "other")), null);
});
test("summary and track: only same-origin GET and exact activity ID", async () => {
  const calls = [];
  await mockFetch(async (path, init) => {
    calls.push([path, init.method, init.credentials]);
    if (path.includes("timelines")) return response(200, {
      biographyId: 1234, dataType: "touring", titleName: "山道 & 海",
      biographyDate: "2026-10-10T09:00:00+09:00", touring: { appliId: 7777 }
    });
    if (path.includes("touring/log")) return response(200, log());
    throw new Error("Unexpected endpoint");
  }, async () => {
    const summary = await adapter.getSummary("1234");
    assert.deepEqual(summary, { id: "1234", activityId: "7777",
      title: "山道 & 海", date: "2026-10-10" });
    const track = await adapter.getTrack(summary);
    assert.equal(track.count, 1);
    assert.equal(track.startTimeSource, "2026-10-10T12:27:26+09:00");
    assert.equal(track.segments[0][0].elevation, 300);
  });
  assert.deepEqual(calls, [
    ["/api/v1/users/me/timelines/1234", "GET", "same-origin"],
    ["/api/v1/touring/log?activityId=7777", "GET", "same-origin"]
  ]);
});
test("rejects invalid summary and expired session", async () => {
  await mockFetch(async () => response(200, {
    biographyId: 9999, dataType: "touring", touring: { appliId: 7777 }
  }), async () => assert.rejects(adapter.getSummary("1234"), /INVALID_SUMMARY/));
  await mockFetch(async () => response(401, {}), async () =>
    assert.rejects(adapter.getSummary("1234"), /AUTH_REQUIRED/));
});
test("rejects HTML login fallback and non-JSON response", async () => {
  await mockFetch(async () => response(200, "<html>Login</html>", "text/html"), async () =>
    assert.rejects(adapter.getSummary("1234"), /UNEXPECTED_RESPONSE/));
});
test("rejects wrong activity ID from GPS endpoint", async () => {
  await mockFetch(async () => response(200, { ...log(), metadata: {
    activityId: 1111, startTime: "2026-10-10T12:27:26+09:00"
  } }), async () => assert.rejects(adapter.getTrack({
    id: "1234", activityId: "7777", title: "test"
  }), /ACTIVITY_MISMATCH/));
});
