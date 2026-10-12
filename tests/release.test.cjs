"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root,p), "utf8");
const workflow = read(".github/workflows/release.yml");
const ci = read(".github/workflows/ci.yml");
const metadata = JSON.parse(read("amo/metadata.json"));
const pkg = require("../package.json");
const firefox = require("../manifests/firefox.json");
const chromium = require("../manifests/chromium.json");

test("0.1.0 release has consistent versions and stable add-on identity", () => {
  assert.equal(pkg.version,"0.1.0");
  assert.equal(firefox.version,pkg.version);
  assert.equal(chromium.version,pkg.version);
  assert.equal(firefox.browser_specific_settings.gecko.id,"navitime-gpx-exporter@zawa356.github.io");
  assert.deepEqual(firefox.browser_specific_settings.gecko.data_collection_permissions.required,["none"]);
});
test("AMO listed metadata includes both languages, license and reviewer notes", () => {
  assert.equal(metadata.version.license,"MIT");
  assert.ok(metadata.summary["ja"]);
  assert.ok(metadata.summary["en-US"]);
  assert.ok(metadata.version.release_notes["ja"]);
  assert.ok(metadata.version.approval_notes);
});
test("AMO uploading requires manual invocation and GitHub encrypted secrets", () => {
  assert.match(workflow,/workflow_dispatch:/);
  assert.doesNotMatch(workflow,/^\s+push:\s*$/m);
  assert.match(workflow,/inputs\.destination == 'github-and-amo'/);
  assert.match(workflow,/secrets\.AMO_JWT_ISSUER/);
  assert.match(workflow,/secrets\.AMO_JWT_SECRET/);
  assert.match(workflow,/--channel listed/);
  assert.match(workflow,/--amo-metadata amo\/metadata\.json/);
  assert.match(workflow,/--upload-source-code/);
  assert.match(workflow,/--approval-timeout 0/);
  assert.match(workflow,/--prerelease/);
  assert.doesNotMatch(workflow,/\bgithub\.event_name == 'push'/);
});
test("release job lints Mozilla submission before uploading", () => {
  const build = workflow.indexOf("Run tests and build 3 browser packages");
  const lint = workflow.indexOf("Validate Firefox package with Mozilla web-ext");
  const submit = workflow.indexOf("Submit to AMO API v5");
  assert.ok(build > 0 && lint > build && submit > lint);
  assert.match(ci,/Mozilla AMO lint/);
  assert.match(ci,/node scripts\/release-preflight\.cjs 0\.1\.0/);
});
