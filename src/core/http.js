(function (root) {
  "use strict";
  const E = root.NavitimeErrors || (typeof require === "function" ? require("./errors.js") : null);
  // Only same-origin, service-adapter-specified API paths. No credentials are copied or stored.
  async function getJson(path, phase) {
    if (typeof path !== "string" || !path.startsWith("/api/v1/") ||
        path.startsWith("//") || /[\\\r\n]/.test(path)) {
      throw new E.ExportError("UNSAFE_REQUEST", phase);
    }
    let response;
    try { response = await fetch(path, { method: "GET", credentials: "same-origin", cache: "no-store" }); }
    catch { throw new E.ExportError("NETWORK_ERROR", phase); }
    if (!response.ok) throw new E.ExportError(
      response.status === 401 || response.status === 403 ? "AUTH_REQUIRED" : "API_ERROR",
      phase, response.status);
    if (!(response.headers.get("content-type") || "").toLowerCase().includes("json"))
      throw new E.ExportError("UNEXPECTED_RESPONSE", phase);
    try { return await response.json(); }
    catch { throw new E.ExportError("INVALID_JSON", phase); }
  }
  const api = Object.freeze({ getJson });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.NavitimeHttp = api;
})(globalThis);
