"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../src/core/errors.js");
const T = require("../src/core/track.js");
const G = require("../src/formats/gpx.js");
function fixture() {
  return { metadata: { activityId: 123, startTime: "2026-10-10T12:27:26+09:00" },
    geoJson: { type: "FeatureCollection", features: [
      { geometry: { type: "LineString", coordinates: [[137.0, 35.0, 78], [137.01, 35.01, 0]] },
        properties: { pass_time: ["2026-10-10T12:27:26+09:00", "2026-10-10T12:27:27+09:00"] } },
      { geometry: { type: "LineString", coordinates: [[137.02, 35.02, null]] },
        properties: { pass_time: ["2026-10-10T12:30:00+09:00"] } }
    ] } };
}
test("preserves coordinates, zero elevation, order, multiple segments and UTC time", () => {
  const raw = fixture(), track = T.normalize(raw, 123, '山道 & <test>');
  track.startTimeSource = raw.metadata.startTime;
  const xml = G.convert(track);
  assert.equal(track.count, 3);
  assert.equal(track.segments.length, 2);
  assert.match(xml, /<metadata><name>山道 &amp; &lt;test&gt;<\/name><time>2026-10-10T03:27:26.000Z<\/time><\/metadata>/);
  assert.match(xml, /<trkpt lat="35" lon="137"><ele>78<\/ele><time>2026-10-10T03:27:26.000Z<\/time>/);
  assert.match(xml, /<trkpt lat="35.01" lon="137.01"><ele>0<\/ele>/);
  assert.match(xml, /<trkpt lat="35.02" lon="137.02"><time>/);
  assert.equal((xml.match(/<trkseg>/g) || []).length, 2);
  assert.equal(T.filename(track), "2026-10-10_122726_山道 & <test>.gpx".replace(/[<>]/g, "_"));
});
test("rejects mismatched activity IDs", () => assert.throws(() => T.normalize(fixture(), 999, "x"), /ACTIVITY_MISMATCH/));
test("rejects timestamp count mismatch", () => {
  const raw = fixture(); raw.geoJson.features[0].properties.pass_time.pop();
  assert.throws(() => T.normalize(raw, 123, "x"), /INVALID_SEGMENT/);
});
test("rejects invalid coordinates, elevation and time", () => {
  for (const [point, code] of [
    [[181, 35, 78], "INVALID_COORDINATES"], [[137, 91, 78], "INVALID_COORDINATES"],
    [[137, 35, "100"], "INVALID_ELEVATION"]
  ]) {
    const raw = fixture(); raw.geoJson.features[0].geometry.coordinates[0] = point;
    assert.throws(() => T.normalize(raw, 123, "x"), new RegExp(code));
  }
  const raw = fixture(); raw.geoJson.features[0].properties.pass_time[0] = "2026-10-10T12:27:26";
  assert.throws(() => T.normalize(raw, 123, "x"), /INVALID_TIMESTAMP/);
});
test("rejects empty track and invalid feature type", () => {
  const raw = fixture(); raw.geoJson.features = [];
  assert.throws(() => T.normalize(raw, 123, "x"), /EMPTY_TRACK/);
  const raw2 = fixture(); raw2.geoJson.features[0].geometry.type = "Point";
  assert.throws(() => T.normalize(raw2, 123, "x"), /INVALID_SEGMENT/);
});
test("XML filtering and filename sanitation", () => {
  assert.equal(G.xml('a&<"\u0001'), 'a&amp;&lt;&quot;');
  const tr = T.normalize(fixture(), 123, "test:bad?|. ");
  tr.startTimeSource = fixture().metadata.startTime;
  assert.equal(T.filename(tr), "2026-10-10_122726_test_bad__.gpx");
});
test("diagnostics never include data from raw errors", () => {
  const err = new Error("GPS 35.123,137.123 token=super-secret");
  const info = E.diagnostic(err);
  assert.doesNotMatch(info, /GPS|super-secret|137\.123/);
});
