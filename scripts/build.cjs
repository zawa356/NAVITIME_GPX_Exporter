"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const files = [
  "core/errors.js", "core/http.js", "core/track.js",
  "formats/geojson.js", "formats/gpx.js",
  "services/touring-supporter.js", "services/saved-route.js",
  "services/registry.js", "extension/content.js",
  "popup/index.html", "popup/popup.css", "popup/popup.js"
];
function build(browser) {
  const target = path.join(root, "dist", browser);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(path.join(root, "manifests", browser === "firefox" ? "firefox.json" : "chromium.json"),
    path.join(target, "manifest.json"));
  for (const file of files) {
    const from = path.join(root, "src", file), to = path.join(target, file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(target, "manifest.json"), "utf8"));
  if (manifest.version !== require("../package.json").version) throw Error("manifest/package version mismatch");
  const zip = path.join(root, "dist", "navitime-gpx-exporter-" + browser + "-" + manifest.version + ".zip");
  fs.rmSync(zip, { force: true });
  // GNU/Info-ZIP available on GitHub's ubuntu-latest runners.
  execFileSync("zip", ["-q", "-r", zip, "."], { cwd: target });
  console.log(zip);
}
["firefox", "chrome", "edge"].forEach(build);
