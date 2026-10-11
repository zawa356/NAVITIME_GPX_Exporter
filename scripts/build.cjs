"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const files = [
  "core/errors.js", "core/http.js", "core/track.js",
  "formats/geojson.js", "formats/gpx.js",
  "services/touring-supporter.js", "services/saved-route.js",
  "services/registry.js", "extension/content.js",
  "popup/index.html", "popup/popup.css", "popup/popup.js"
];
const iconSizes = [16, 32, 48, 96, 128];
const iconSource = path.join(root, "artwork", "icon-source.png");

function imageMagick() {
  for (const binary of ["magick", "convert"]) {
    try { execFileSync(binary, ["-version"], { stdio: "ignore" }); return binary; }
    catch { /* try next */ }
  }
  throw new Error("ImageMagick is required to generate icon PNGs (magick or convert)");
}
const binary = imageMagick();
const iconCache = path.join(dist, "icon-cache");
fs.mkdirSync(iconCache, { recursive: true });
function resize(source, target, size) {
  // Both ImageMagick 6 (convert) and 7 (magick) accept this invocation.
  execFileSync(binary, [
    source, "-filter", "Lanczos", "-resize", size + "x" + size + "!",
    "-strip", target
  ]);
}
for (const size of iconSizes) {
  resize(iconSource, path.join(iconCache, "icon-" + size + ".png"), size);
}
const listing = path.join(dist, "store-assets");
fs.mkdirSync(listing, { recursive: true });
resize(iconSource, path.join(listing, "icon-512.png"), 512);

function build(browser) {
  const target = path.join(dist, browser);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(
    path.join(root, "manifests", browser === "firefox" ? "firefox.json" : "chromium.json"),
    path.join(target, "manifest.json")
  );
  for (const file of files) {
    const from = path.join(root, "src", file), to = path.join(target, file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  fs.mkdirSync(path.join(target, "icons"), { recursive: true });
  for (const size of iconSizes) {
    fs.copyFileSync(path.join(iconCache, "icon-" + size + ".png"),
      path.join(target, "icons", "icon-" + size + ".png"));
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(target, "manifest.json"), "utf8"));
  if (manifest.version !== require("../package.json").version)
    throw Error("manifest/package version mismatch");
  const zip = path.join(dist, "navitime-gpx-exporter-" + browser + "-" + manifest.version + ".zip");
  fs.rmSync(zip, { force: true });
  execFileSync("zip", ["-q", "-r", zip, "."], { cwd: target });
  console.log(zip);
}
["firefox", "chrome", "edge"].forEach(build);
console.log("Store icon:", path.join(listing, "icon-512.png"));
