(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const state = { tabId: null, busy: false, ready: false, lastDiagnostic: "" };
  const safe = (code, phase, status) => JSON.stringify({
    application: "NAVITIME GPX Exporter", version: "0.0.1",
    code, phase, httpStatus: Number.isInteger(status) ? status : null,
    browser: /Firefox/i.test(navigator.userAgent) ? "Firefox" :
      /Edg\//i.test(navigator.userAgent) ? "Edge" :
        /Chrome\//i.test(navigator.userAgent) ? "Chrome" : "Unknown"
  }, null, 2);
  const LABELS = {
    UNSUPPORTED_PAGE: "ツーリングサポーターの走行ログ詳細画面を開いてください。",
    AUTH_REQUIRED: "ログイン状態を確認してください。",
    NETWORK_ERROR: "ネットワーク接続を確認して再試行してください。",
    PAGE_CHANGED: "画面が変わりました。もう一度実行してください。",
    ALREADY_RUNNING: "すでに保存処理が進行中です。",
    EMPTY_TRACK: "GPSデータが空のため保存できません。",
    INVALID_GEOJSON: "走行ログの形式が変わった可能性があります。",
    INVALID_SUMMARY: "走行ログの概要を確認できませんでした。",
    INVALID_SEGMENT: "GPSデータの構造が不正です。",
    INVALID_TIMESTAMP: "GPSの時刻が不正です。",
    ACTIVITY_MISMATCH: "異なる走行記録のデータを検出しました。",
    API_ERROR: "NAVITIMEのAPIからエラーが返りました。",
    UNEXPECTED_RESPONSE: "ログイン状態またはAPI応答を確認してください。"
  };
  function status(text, error = false) {
    $("status").textContent = text;
    $("status").dataset.error = String(error);
  }
  function failure(data) {
    const e = data?.error || {};
    status(LABELS[e.code] || "処理に失敗しました。再試行してください。", true);
    state.lastDiagnostic = safe(e.code || "MESSAGE_ERROR", e.phase || "popup", e.status);
    $("diagnosticText").textContent = state.lastDiagnostic;
    $("diagnostics").hidden = false;
    $("retry").hidden = false;
    $("export").disabled = true;
  }
  function message(action) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(state.tabId, { namespace: "navitime-gpx-v1", action }, response => {
        const err = chrome.runtime.lastError;
        if (err || !response) reject(new Error("MESSAGE_ERROR"));
        else resolve(response);
      });
    });
  }
  function activeTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (chrome.runtime.lastError || !tabs?.[0]?.id) reject(new Error("TAB_UNAVAILABLE"));
        else resolve(tabs[0].id);
      });
    });
  }
  async function load() {
    if (state.busy) return;
    state.busy = true; state.ready = false;
    $("export").disabled = true; $("retry").hidden = true; $("diagnostics").hidden = true;
    $("rideTitle").hidden = true; $("rideDate").hidden = true;
    status("走行ログを確認しています…");
    try {
      state.tabId = await activeTab();
      const result = await message("summary");
      if (!result.ok) { failure(result); return; }
      $("rideTitle").textContent = result.data.title || "タイトルなし";
      $("rideDate").textContent = result.data.date ? "記録日: " + result.data.date : "記録日: 不明";
      $("rideTitle").hidden = false; $("rideDate").hidden = false;
      status("この走行ログをGPX形式で保存できます。");
      state.ready = true; $("export").disabled = false;
    } catch { failure({ error: { code: "TAB_UNAVAILABLE", phase: "popup" } }); }
    finally { state.busy = false; }
  }
  $("export").addEventListener("click", async () => {
    if (!state.ready || state.busy) return;
    state.busy = true; $("export").disabled = true; $("retry").hidden = true;
    status("GPSデータを取得してGPXを生成しています…");
    try {
      const result = await message("export");
      if (!result.ok) { failure(result); return; }
      status("保存要求を送信しました（" + result.data.points + "地点／" +
        result.data.segments + "区間）。ブラウザのダウンロード欄を確認してください。");
      $("retry").hidden = false;
    } catch { failure({ error: { code: "MESSAGE_ERROR", phase: "popup" } }); }
    finally { state.busy = false; }
  });
  $("retry").addEventListener("click", load);
  $("copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(state.lastDiagnostic); }
    catch { status("診断情報をコピーできませんでした。", true); }
  });
  load();
})();
