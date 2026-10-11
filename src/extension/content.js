(function (root) {
  "use strict";
  const adapter = root.NavitimeTouring, E = root.NavitimeErrors;
  let exporting = false, last = null, lastUrl = null;
  function currentId() { return adapter.idFromUrl(location.href); }
  function checkId(id) {
    if (!id || currentId() !== id) throw new E.ExportError("PAGE_CHANGED", "navigation");
  }
  function save(xml, filename) {
    const blob = new Blob([xml], { type: "application/gpx+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    a.style.display = "none";
    (document.body || document.documentElement).appendChild(a);
    try { a.click(); } finally {
      a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  }
  async function summary() {
    const id = currentId();
    if (!id) throw new E.ExportError("UNSUPPORTED_PAGE", "summary");
    const entry = await adapter.getSummary(id);
    checkId(id);
    last = entry; lastUrl = location.href;
    return { title: entry.title, date: entry.date };
  }
  async function exportLog() {
    if (exporting) throw new E.ExportError("ALREADY_RUNNING", "export");
    const id = currentId();
    if (!id) throw new E.ExportError("UNSUPPORTED_PAGE", "export");
    exporting = true;
    try {
      // Never trust a cached summary after same-origin SPA navigation.
      const entry = last && last.id === id && lastUrl === location.href ?
        last : await adapter.getSummary(id);
      checkId(id);
      const track = await adapter.getTrack(entry);
      checkId(id);
      const xml = root.NavitimeGpx.convert(track);
      save(xml, root.NavitimeTrack.filename(track));
      return { points: track.count, segments: track.segments.length };
    } finally { exporting = false; }
  }
  // Use callback-compatible messaging across Firefox and Chromium.
  chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    if (msg?.namespace !== "navitime-gpx-v1") return false;
    if (msg.action !== "summary" && msg.action !== "export") {
      respond({ ok: false, error: { code: "INVALID_ACTION", phase: "message", status: null } });
      return false;
    }
    const op = msg.action === "summary" ? summary() : exportLog();
    op.then(data => respond({ ok: true, data }),
      err => {
        const normalized = E.normalizeError(err);
        // Never transmit raw exception strings, API payloads, IDs or URLs to the popup.
        respond({ ok: false, error: {
          code: normalized.code, phase: normalized.phase, status: normalized.status
        } });
      });
    return true;
  });
})(globalThis);
