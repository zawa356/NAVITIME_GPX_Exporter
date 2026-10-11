(function (root) {
  "use strict";
  const sources = root.NavitimeSources, E = root.NavitimeErrors;
  let exporting = false, last = null, lastUrl = null;
  function active() { return sources.find(location.href); }
  function requireUnchanged(source, url) {
    const now = active();
    if (!now || now.id !== source.id || now.kind !== source.kind || location.href !== url)
      throw new E.ExportError("PAGE_CHANGED", "navigation");
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
    const source = active(), url = location.href;
    if (!source) throw new E.ExportError("UNSUPPORTED_PAGE", "summary");
    const details = await source.adapter.getSummary(source.id);
    requireUnchanged(source, url);
    last = { ...details, kind: source.kind }; lastUrl = url;
    return { kind: source.kind, title: details.title, date: details.date,
      dateLabel: details.dateLabel || (source.kind === "planned" ? "登録日" : "記録日") };
  }
  async function exportLog() {
    if (exporting) throw new E.ExportError("ALREADY_RUNNING", "export");
    const source = active(), url = location.href;
    if (!source) throw new E.ExportError("UNSUPPORTED_PAGE", "export");
    exporting = true;
    try {
      const details = last && lastUrl === url && last.id === source.id &&
        last.kind === source.kind ? last : await source.adapter.getSummary(source.id);
      requireUnchanged(source, url);
      const track = await source.adapter.getTrack(details);
      requireUnchanged(source, url);
      const xml = root.NavitimeGpx.convert(track);
      save(xml, root.NavitimeTrack.filename(track));
      return { points: track.count, segments: track.segments.length, kind: source.kind };
    } finally { exporting = false; }
  }
  chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    if (msg?.namespace !== "navitime-gpx-v1") return false;
    if (msg.action !== "summary" && msg.action !== "export") {
      respond({ ok: false, error: { code: "INVALID_ACTION", phase: "message", status: null } });
      return false;
    }
    const operation = msg.action === "summary" ? summary() : exportLog();
    operation.then(data => respond({ ok: true, data }),
      err => {
        const normalized = E.normalizeError(err);
        respond({ ok: false, error: {
          code: normalized.code, phase: normalized.phase, status: normalized.status
        } });
      });
    return true;
  });
})(globalThis);
