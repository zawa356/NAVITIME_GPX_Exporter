"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.resolve(__dirname, "../src/popup/popup.css"), "utf8");
const html = fs.readFileSync(path.resolve(__dirname, "../src/popup/index.html"), "utf8");

test("popup body has a fixed pixel width, not viewport-relative max-width", () => {
  const body = css.match(/\bbody\s*\{([^}]*)\}/)?.[1];
  assert.ok(body, "body rule must exist");
  assert.match(body, /(?:^|;)\s*width\s*:\s*330px\s*;/);
  assert.match(body, /(?:^|;)\s*min-width\s*:\s*330px\s*;/);
  assert.doesNotMatch(body, /(?:min|max)-width\s*:\s*\d+(?:vw|vh|vmin|vmax)/);
});

test("hidden buttons are not made visible by generic button styling", () => {
  assert.match(css, /\[hidden\]\s*\{\s*display\s*:\s*none\s*!important\s*\}/);
  assert.match(html, /id="retry" hidden/);
  assert.match(html, /id="diagnostics" hidden/);
});
