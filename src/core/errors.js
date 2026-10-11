(function (root) {
  "use strict";
  class ExportError extends Error {
    constructor(code, phase, status) {
      super(code); this.name = "ExportError";
      this.code = code; this.phase = phase; this.status = Number.isInteger(status) ? status : null;
    }
  }
  function normalizeError(err, fallback = "EXPORT_FAILED", phase = "export") {
    if (err instanceof ExportError) return err;
    return new ExportError(fallback, phase);
  }
  function diagnostic(err, version = "0.0.1") {
    const e = normalizeError(err);
    return JSON.stringify({
      application: "NAVITIME GPX Exporter", version,
      code: e.code, phase: e.phase, httpStatus: e.status,
      browser: typeof navigator === "undefined" ? "test" :
        (/Firefox/i.test(navigator.userAgent) ? "Firefox" :
          /Edg\//i.test(navigator.userAgent) ? "Edge" :
            /Chrome\//i.test(navigator.userAgent) ? "Chrome" : "Unknown")
    }, null, 2);
  }
  const api = Object.freeze({ ExportError, normalizeError, diagnostic });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeErrors = api;
})(globalThis);
