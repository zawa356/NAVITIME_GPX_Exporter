"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const icon = fs.readFileSync(path.join(root,"artwork","icon-source.png"));

test("approved artwork is a real 128px PNG committed with the project", () => {
  assert.ok(icon.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
  assert.equal(icon.toString("ascii",12,16), "IHDR");
  assert.equal(icon.readUInt32BE(16), 128);
  assert.equal(icon.readUInt32BE(20), 128);
});
test("both browser manifests automatically register extension and toolbar icons", () => {
  for (const filename of ["firefox.json","chromium.json"]) {
    const manifest = JSON.parse(fs.readFileSync(path.join(root,"manifests",filename),"utf8"));
    assert.equal(manifest.version,require("../package.json").version);
    for(const size of [16,32,48,96,128]) {
      assert.equal(manifest.icons[String(size)], `icons/icon-${size}.png`);
    }
    for(const size of [16,32,48]) {
      assert.equal(manifest.action.default_icon[String(size)], `icons/icon-${size}.png`);
    }
  }
});
