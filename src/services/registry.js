(function (root) {
  "use strict";
  // Match the active page to a known, bundled data source. No passive traffic interception.
  const ride = root.NavitimeTouring ||
    (typeof require === "function" ? require("./touring-supporter.js") : null);
  const planned = root.NavitimeSavedRoute ||
    (typeof require === "function" ? require("./saved-route.js") : null);
  const entries = Object.freeze([
    Object.freeze({ kind: "recorded", adapter: ride }),
    Object.freeze({ kind: "planned", adapter: planned })
  ]);
  function find(url) {
    for (const source of entries) {
      const id = source.adapter.idFromUrl(url);
      if (id) return { ...source, id };
    }
    return null;
  }
  const api = Object.freeze({ find });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeSources = api;
})(globalThis);
