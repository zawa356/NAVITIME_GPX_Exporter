"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
require("../src/core/errors.js");
require("../src/core/track.js");
require("../src/core/http.js");
const GeoJSON = require("../src/formats/geojson.js");
const Gpx = require("../src/formats/gpx.js");
const Track = require("../src/core/track.js");
const adapter = require("../src/services/saved-route.js");
const sources = require("../src/services/registry.js");

const rid = "1234567890abcdef1234567890abcdef";
const detail = "https://web.moto.touring.navitime.jp/routes/view/?id=" + rid;
function fixture() {
  return { public_route_id: rid, title: "テスト/ルート", register_time: "2026/09/23 18:06",
    route: { datum: "wgs84", unit: "degree",
      geojson: { type: "FeatureCollection", features: [
        { geometry: { type: "LineString", coordinates: [[137,35],[137.01,35.01],[137.02,35.02]] } },
        { geometry: { type: "LineString", coordinates: [[137.02,35.02],[137.03,35.03]] } },
        { geometry: { type: "LineString", coordinates: [[137.03,35.03],[137.04,35.04]] } }
      ] } } };
}
function response(status, data, contentType="application/json") {
  return { ok: status >= 200 && status < 300, status,
    headers: { get: () => contentType }, json: async () => data };
}
async function withFetch(fn, cb) {
  const old = global.fetch; global.fetch = fn;
  try { return await cb(); } finally { global.fetch = old; }
}

test("registry finds only verified ride and saved route views", () => {
  assert.equal(sources.find(detail)?.kind, "planned");
  assert.equal(sources.find(detail)?.id, rid);
  assert.equal(sources.find("https://web.moto.touring.navitime.jp/users/me/biography/touring/detail/?id=1234")?.kind, "recorded");
  assert.equal(sources.find("https://web.moto.touring.navitime.jp/routes/view/?id=invalid"), null);
  assert.equal(sources.find(detail.replace("web.moto", "bad.moto")), null);
  assert.equal(sources.find("https://web.moto.touring.navitime.jp/routes/create"), null);
});
test("adjacent planned LineStrings merge only repeated endpoints", () => {
  const decoded = GeoJSON.decodePlanned(fixture().route.geojson);
  assert.equal(decoded.count, 5);
  assert.equal(decoded.segments.length, 1);
  assert.deepEqual(decoded.segments[0].map(x => [x.lon,x.lat]), [
    [137,35],[137.01,35.01],[137.02,35.02],[137.03,35.03],[137.04,35.04]
  ]);
  assert.ok(decoded.segments[0].every(p => p.time === null && p.elevation === null));
});
test("disconnected planned segments are kept separate, never bridged", () => {
  const data=fixture();
  data.route.geojson.features.push({geometry:{type:"LineString",coordinates:[[138,36],[138.01,36.01]]}});
  const out=GeoJSON.decodePlanned(data.route.geojson);
  assert.equal(out.count, 7);
  assert.equal(out.segments.length, 2);
});
test("bad and empty planned geometry fails closed", () => {
  for (const geometry of [
    { type:"LineString", coordinates:[[137,35],[181,35]] },
    { type:"LineString", coordinates:[[137,35],["137",35]] },
    { type:"LineString", coordinates:[[137,35],[137,91]] },
    { type:"LineString", coordinates:[[137,35],[137,35,350]] }
  ]) assert.throws(() => GeoJSON.decodePlanned({type:"FeatureCollection",features:[{geometry}]}), /INVALID_COORDINATES/);
  assert.throws(() => GeoJSON.decodePlanned({type:"FeatureCollection",features:[]}), /EMPTY_TRACK/);
  assert.throws(() => GeoJSON.decodePlanned({type:"FeatureCollection",features:[{geometry:{type:"Point",coordinates:[137,35]}}]}), /INVALID_SEGMENT/);
});
test("planned API summary, expected same-origin GET, and GPX without fake timestamps", async () => {
  const calls = [];
  await withFetch(async (path, init) => {
    calls.push({path,method:init.method,credentials:init.credentials});
    return response(200, fixture());
  }, async () => {
    const summary=await adapter.getSummary(rid);
    assert.deepEqual(summary, { kind:"planned", id:rid, title:"テスト/ルート",date:"2026-09-23",dateLabel:"登録日" });
    const route=await adapter.getTrack(summary);
    assert.equal(route.count,5);
    assert.equal(route.kind,"planned");
    const xml=Gpx.convert(route);
    assert.match(xml,/xmlns="http:\/\/www.topografix.com\/GPX\/1\/1"/);
    assert.match(xml,/<metadata><name>テスト\/ルート<\/name><\/metadata>/);
    assert.doesNotMatch(xml,/<time>|<ele>/);
    assert.equal((xml.match(/<trkpt /g)||[]).length,5);
    assert.equal(Track.filename(route),"保存ルート_テスト_ルート.gpx");
  });
  assert.equal(calls.length,2);
  assert.ok(calls.every(c => c.path === "/api/v1/riders/routes/"+rid && c.method==="GET" && c.credentials==="same-origin"));
});
test("route ID and datum mismatches fail closed", async () => {
  for (const mutate of [
    raw => {raw.public_route_id = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";},
    raw => {raw.route.datum = "tokyo";},
    raw => {raw.route.unit = "meter";}
  ]) {
    await withFetch(async () => {const raw=fixture();mutate(raw);return response(200,raw);},
      async () => assert.rejects(adapter.getSummary(rid),/INVALID_ROUTE/));
  }
});
test("planned filenames retain ordinary latin letters/numbers but remove OS-forbidden characters", () => {
  assert.equal(Track.filename({kind:"planned",name:"Route x01:West/7",routeId:rid}),
    "保存ルート_Route x01_West_7.gpx");
  assert.equal(Track.filename({kind:"planned",name:"...?* ",routeId:rid}), "保存ルート____.gpx");
});
test("route API authentication failures map to safe errors", async () => {
  await withFetch(async () => response(403,{}),
    async () => assert.rejects(adapter.getSummary(rid),/AUTH_REQUIRED/));
  await withFetch(async () => response(200,"login page","text/html"),
    async () => assert.rejects(adapter.getSummary(rid),/UNEXPECTED_RESPONSE/));
});
