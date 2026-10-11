"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const files = [
  "core/errors.js", "core/http.js", "core/track.js",
  "formats/geojson.js", "formats/gpx.js",
  "services/touring-supporter.js", "services/saved-route.js",
  "services/registry.js", "extension/content.js"
];
function setup(href, fetcher) {
  let responder, savedFilename = null, clicks = 0;
  const document = { body: { appendChild() {} },
    createElement() { return { style:{}, click() { savedFilename = this.download; clicks++; }, remove() {} }; } };
  const context = vm.createContext({
    URL, Blob, document, location: { href }, fetch: fetcher, setTimeout() {},
    chrome: { runtime: { onMessage: { addListener(fn) { responder = fn; } } } }
  });
  for (const name of files) {
    const script = fs.readFileSync(path.resolve(__dirname, "../src", name), "utf8");
    vm.runInContext(script, context, { filename: name });
  }
  return {
    context,
    get filename() { return savedFilename; },
    get clicks() { return clicks; },
    message(action) {
      return new Promise(resolve => {
        assert.equal(responder({ namespace: "navitime-gpx-v1", action }, {}, resolve), true);
      });
    }
  };
}
function response(data, status = 200) {
  return { ok: status === 200, status, headers: { get: () => "application/json" }, json: async () => data };
}
test("end-to-end simulated current recorded ride exports the expected filename", async () => {
  const url="https://web.moto.touring.navitime.jp/users/me/biography/touring/detail/?id=12";
  const app=setup(url, async path => {
    if (path === "/api/v1/users/me/timelines/12")
      return response({ biographyId:12, dataType:"touring", touring:{appliId:222},
        titleName:"朝のツーリング", biographyDate:"2026-10-11T09:00:00+09:00" });
    if (path === "/api/v1/touring/log?activityId=222")
      return response({ metadata: { activityId:222, startTime:"2026-10-11T10:01:25+09:00" },
        geoJson:{type:"FeatureCollection",features:[{geometry:{
          type:"LineString",coordinates:[[137,35,100],[137.01,35.01,101]]
        },properties:{pass_time:["2026-10-11T10:01:25+09:00","2026-10-11T10:01:30+09:00"]}}]} });
    throw Error("unexpected API");
  });
  const summary = await app.message("summary");
  assert.equal(summary.ok,true);
  assert.equal(summary.data.kind,"recorded");
  assert.equal(summary.data.title,"朝のツーリング");
  assert.equal(summary.data.date,"2026-10-11");
  assert.equal(app.clicks,0);
  const out=await app.message("export");
  assert.equal(out.ok,true);
  assert.equal(out.data.points,2);
  assert.equal(app.filename,"2026-10-11_100125_朝のツーリング.gpx");
  assert.equal(app.clicks,1);
});
test("end-to-end simulated saved route exports no ride timestamps", async () => {
  const id="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const url="https://web.moto.touring.navitime.jp/routes/view/?id="+id;
  const calls=[];
  const app=setup(url,async path => {
    calls.push(path);
    if (path !== "/api/v1/riders/routes/"+id) throw Error("unexpected API");
    return response({public_route_id:id,title:"夜の散歩",register_time:"2026/10/11 12:00",
      route:{datum:"wgs84",unit:"degree",geojson:{type:"FeatureCollection",features:[
        {geometry:{type:"LineString",coordinates:[[137,35],[137.1,35.1]]}},
        {geometry:{type:"LineString",coordinates:[[137.1,35.1],[137.2,35.2]]}}
      ]}}});
  });
  const summary=await app.message("summary");
  assert.equal(summary.ok,true);
  assert.equal(summary.data.kind,"planned");
  assert.equal(summary.data.dateLabel,"登録日");
  assert.equal(summary.data.date,"2026-10-11");
  assert.equal(app.clicks,0);
  const exported=await app.message("export");
  assert.equal(exported.ok,true);
  assert.equal(exported.data.points,3);
  assert.equal(exported.data.segments,1);
  assert.equal(app.filename,"保存ルート_夜の散歩.gpx");
  assert.equal(calls.length,2);
});
test("unsupported page fails without querying APIs or creating downloads", async () => {
  let requests=0;
  const app=setup("https://web.moto.touring.navitime.jp/routes/list",async () => {requests++;throw Error();});
  const result=await app.message("summary");
  assert.equal(result.ok,false);
  assert.equal(result.error.code,"UNSUPPORTED_PAGE");
  assert.equal(requests,0);
  assert.equal(app.clicks,0);
});
test("navigation while downloading cancels rather than saving a different route", async () => {
  const id="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  let unlock;
  const app=setup("https://web.moto.touring.navitime.jp/routes/view/?id="+id,
    async () => new Promise(resolve => {unlock=resolve;}));
  const pending=app.message("export");
  app.context.location.href="https://web.moto.touring.navitime.jp/routes/list";
  unlock(response({public_route_id:id,title:"dummy",register_time:"2026/10/11 12:00",
    route:{datum:"wgs84",unit:"degree",geojson:{type:"FeatureCollection",features:[{
      geometry:{type:"LineString",coordinates:[[137,35],[137.01,35.01]]}
    }]}}}));
  const out=await pending;
  assert.equal(out.ok,false);
  assert.equal(out.error.code,"PAGE_CHANGED");
  assert.equal(app.clicks,0);
});
