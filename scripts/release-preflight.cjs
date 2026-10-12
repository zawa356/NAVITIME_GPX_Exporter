"use strict";
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const expected = process.argv[2] || "0.1.0";
if (!/^\d+\.\d+\.\d+$/.test(expected)) throw Error("Invalid release version input");
const pkg = require("../package.json");
const firefox = require("../manifests/firefox.json");
const chromium = require("../manifests/chromium.json");
const metadata = require("../amo/metadata.json");

if (pkg.version !== expected || firefox.version !== expected || chromium.version !== expected) {
  throw Error("Release version mismatch between requested version, package and manifests");
}
const geckoId = "navitime-gpx-exporter@zawa356.github.io";
if (firefox.browser_specific_settings?.gecko?.id !== geckoId)
  throw Error("Firefox Gecko ID differs from the established extension identity");
if (firefox.browser_specific_settings?.gecko?.data_collection_permissions?.required?.join(",") !== "none")
  throw Error("Firefox collection declaration must match the privacy policy");
if (metadata.version?.license !== "MIT" || pkg.license !== "MIT")
  throw Error("MIT license metadata mismatch");
if (!metadata.summary?.["ja"] || !metadata.summary?.["en-US"] ||
    !metadata.version?.release_notes?.["ja"])
  throw Error("AMO metadata required fields missing");
for (const browser of ["firefox","chrome","edge"]) {
  const dir = path.join(root, "dist", browser);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  if (manifest.version !== expected) throw Error("Unexpected dist version: " + browser);
  const files = Object.values(manifest.icons || {})
    .concat(Object.values(manifest.action?.default_icon || {}));
  if (!files.length) throw Error("Missing manifest icon fields: " + browser);
  for (const file of files) {
    if (!/^icons\/icon-\d+\.png$/.test(file) || !fs.existsSync(path.join(dir, file)))
      throw Error("Missing packaged icon: " + browser + ":" + file);
  }
  const archive = path.join(root, "dist",
    "navitime-gpx-exporter-" + browser + "-" + expected + ".zip");
  if (!fs.existsSync(archive)) throw Error("Missing " + browser + " release ZIP");
}
console.log("Release preflight passed for v" + expected + " / Gecko ID " + geckoId);
