"use strict";
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const pngSignature = Buffer.from([137,80,78,71,13,10,26,10]);
const sizes = [16,32,48,96,128];

function assertPng(file, size) {
  const bytes = fs.readFileSync(file);
  assert.ok(bytes.length > 100, `Empty/corrupt icon: ${file}`);
  assert.ok(bytes.subarray(0,8).equals(pngSignature), `Not PNG: ${file}`);
  assert.equal(bytes.toString("ascii",12,16), "IHDR", `Missing IHDR: ${file}`);
  assert.equal(bytes.readUInt32BE(16), size, `Wrong width: ${file}`);
  assert.equal(bytes.readUInt32BE(20), size, `Wrong height: ${file}`);
}
assertPng(path.join(root, "artwork", "icon-source.png"), 128);
for (const browser of ["firefox","chrome","edge"]) {
  const base = path.join(root, "dist", browser);
  const manifest = JSON.parse(fs.readFileSync(path.join(base, "manifest.json"), "utf8"));
  assert.equal(manifest.version, require("../package.json").version);
  for (const size of sizes) {
    const file = `icons/icon-${size}.png`;
    assert.equal(manifest.icons[String(size)], file);
    assertPng(path.join(base,file), size);
  }
  for (const size of [16,32,48]) {
    assert.equal(manifest.action.default_icon[String(size)], `icons/icon-${size}.png`);
  }
  console.log(`Verified ${browser} icons from manifest and generated PNG dimensions`);
}
assertPng(path.join(root, "dist", "store-assets", "icon-512.png"), 512);
console.log("Store artwork (512x512) verified");
