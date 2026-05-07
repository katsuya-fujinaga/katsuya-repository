(function () {
  "use strict";

  var STORAGE_KEY = "hitobiji-cash-ledger-v1";
  var LS_GOOGLE_CLIENT_ID = "cash-ledger-google-oauth-client-id";
  var LS_DRIVE_FILE_ID = "cash-ledger-google-drive-file-id";
  var LS_DRIVE_AUTO_PUSH = "cash-ledger-drive-auto-push";
  var LS_DRIVE_AUTO_PULL = "cash-ledger-drive-auto-pull-startup";
  var DRIVE_SYNC_FILENAME = "cash-ledger-sync.json";
  var MAX_ACCOUNTS = 8;
  var CHART_AXIS_MIN = -20 * 10000; // -20万円
  var CHART_AXIS_MAX = 300 * 10000; // 300万円
  var CHART_AXIS_STEP = 50 * 10000; // 50万円刻み
  var DEFAULT_LIABILITIES = [
    { name: "国税", keyword: "国税", opening: 0 },
    { name: "市県民税", keyword: "市県民税", opening: 0 },
    { name: "国民健康保険", keyword: "国民健康保険", opening: 0 },
    { name: "弁護士", keyword: "弁護士", opening: 0 },
  ];

  var defaultAccountNames = ["SMBC信託銀行", "住信SBIネット銀行", "現金"];

  var WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function monthKey(y, m) {
    return y + "-" + pad2(m);
  }

  function parseMonthKey(key) {
    var p = key.split("-");
    return { y: parseInt(p[0], 10), m: parseInt(p[1], 10) };
  }

  function monthSerialFromKey(key) {
    var mk = parseMonthKey(key);
    return mk.y * 12 + (mk.m - 1);
  }

  function normalizeMonthInput(v) {
    return /^\d{4}-\d{2}$/.test(String(v || "")) ? String(v) : "";
  }

  function daysInMonth(y, m) {
    return new Date(y, m, 0).getDate();
  }

  function emptyCell() {
    return { w: 0, d: 0, note: "" };
  }

  /** v2: days[dayStr] = { lines: [ { [accountId]: {w,d,note} }, ... ] } */
  function isV2Day(dayVal) {
    return dayVal && Array.isArray(dayVal.lines);
  }

  function migrateV1ToV2(s) {
    if (s.version >= 2) return;
    Object.keys(s.months).forEach(function (key) {
      var m = s.months[key];
      var newDays = {};
      Object.keys(m.days || {}).forEach(function (d) {
        var old = m.days[d];
        var line0 = {};
        s.accounts.forEach(function (a) {
          var o = old[a.id];
          if (o && typeof o === "object" && !Array.isArray(o) && o.lines == null) {
            line0[a.id] = { w: o.w || 0, d: o.d || 0, note: o.note || "" };
          } else {
            line0[a.id] = emptyCell();
          }
        });
        newDays[d] = { lines: [line0] };
      });
      m.days = newDays;
    });
    s.version = 2;
  }

  function ensureUi(s) {
    if (!s.ui || typeof s.ui !== "object") s.ui = {};
    var ok = ["auto", "day", "night"];
    if (ok.indexOf(s.ui.themeTab) < 0) s.ui.themeTab = "auto";
    return s;
  }

  /** このブラウザへ保存したときの時刻（入力・取込・自動繰越の保存など） */
  function touchLedgerLocalUpdatedAt(st) {
    ensureUi(st);
    st.ui.lastLedgerUpdateAt = Date.now();
  }

  function formatLedgerLocalUpdatedAt(st) {
    var t = st && st.ui && st.ui.lastLedgerUpdateAt;
    if (t == null || !Number.isFinite(Number(t))) return "";
    var d = new Date(Number(t));
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function ensureLiabilities(s) {
    if (!Array.isArray(s.liabilities) || s.liabilities.length === 0) {
      s.liabilities = DEFAULT_LIABILITIES.map(function (x, i) {
        return {
          id: "l" + (i + 1),
          name: x.name,
          keyword: x.keyword,
          opening: x.opening,
          startMonth: normalizeMonthInput(x.startMonth),
        };
      });
      return true;
    }
    var changed = false;
    s.liabilities = s.liabilities
      .map(function (x, i) {
        if (!x || typeof x !== "object") {
          changed = true;
          return null;
        }
        var name = String(x.name || "").trim();
        var keyword = String(x.keyword || name).trim();
        if (!name || name === "ザリード" || keyword === "ザリード") {
          changed = true;
          return null;
        }
        return {
          id: x.id || "l_" + Date.now() + "_" + i,
          name: name,
          keyword: keyword,
          opening: parseNum(x.opening),
          startMonth: normalizeMonthInput(x.startMonth),
        };
      })
      .filter(Boolean);
    if (s.liabilities.length === 0) {
      changed = true;
      s.liabilities = DEFAULT_LIABILITIES.map(function (x, i) {
        return {
          id: "l" + (i + 1),
          name: x.name,
          keyword: x.keyword,
          opening: x.opening,
          startMonth: normalizeMonthInput(x.startMonth),
        };
      });
    }
    DEFAULT_LIABILITIES.forEach(function (x, i) {
      var exists = s.liabilities.some(function (li) {
        return li && li.name === x.name;
      });
      if (exists) return;
      changed = true;
      s.liabilities.push({
        id: "l_default_" + i + "_" + Date.now(),
        name: x.name,
        keyword: x.keyword,
        opening: x.opening,
        startMonth: normalizeMonthInput(x.startMonth),
      });
    });
    return changed;
  }

  /** Drive／ファイルインポート共通の読み込み本体（パース済みオブジェクト） */
  function ingestWholeLedgerPayload(o) {
    if (!o || !Array.isArray(o.accounts)) throw new Error("形式が違います");
    if (o.version == null) o.version = 1;
    migrateV1ToV2(o);
    if (o.version < 2) throw new Error("データを認識できません");
    state = ensureUi(o);
    ensureLiabilities(state);
    saveState(state);
    applyTheme();
    render();
  }

  function saveState(stateArg, skipDriveSchedule) {
    touchLedgerLocalUpdatedAt(stateArg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateArg));
    if (!skipDriveSchedule) scheduleDrivePushIfEnabled();
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && Array.isArray(o.accounts)) {
          if (o.version == null) o.version = 1;
          migrateV1ToV2(o);
          if (o.version === 2) {
            var missingUi = !o.ui || typeof o.ui !== "object";
            var missingLiabilities = !Array.isArray(o.liabilities);
            ensureUi(o);
            ensureLiabilities(o);
            if (missingUi || missingLiabilities) saveState(o);
            return o;
          }
        }
      }
    } catch (e) {}
    return ensureUi({
      version: 2,
      accounts: defaultAccountNames.map(function (name, i) {
        return { id: "a" + (i + 1), name: name };
      }),
      liabilities: DEFAULT_LIABILITIES.map(function (x, i) {
        return {
          id: "l" + (i + 1),
          name: x.name,
          keyword: x.keyword,
          opening: x.opening,
          startMonth: normalizeMonthInput(x.startMonth),
        };
      }),
      months: {},
      ui: { themeTab: "auto" },
    });
  }

  function ensureMonth(state, key) {
    if (!state.months[key]) {
      state.months[key] = {
        openings: {},
        days: {},
      };
      state.accounts.forEach(function (a) {
        state.months[key].openings[a.id] = 0;
      });
    }
    return state.months[key];
  }

  function ensureDayStruct(mdata, day) {
    var d = String(day);
    var val = mdata.days[d];
    if (!val || !isV2Day(val)) {
      var line0 = {};
      state.accounts.forEach(function (a) {
        line0[a.id] = emptyCell();
      });
      mdata.days[d] = { lines: [line0] };
      return mdata.days[d];
    }
    val.lines.forEach(function (line) {
      state.accounts.forEach(function (a) {
        if (!line[a.id]) line[a.id] = emptyCell();
      });
    });
    if (val.lines.length === 0) {
      var L = {};
      state.accounts.forEach(function (a) {
        L[a.id] = emptyCell();
      });
      val.lines = [L];
    }
    return val;
  }

  function readLineCell(dayStruct, lineIndex, accountId) {
    var line = dayStruct.lines[lineIndex];
    if (!line || !line[accountId]) return emptyCell();
    var x = line[accountId];
    return { w: x.w || 0, d: x.d || 0, note: x.note || "" };
  }

  function getLineCell(mdata, day, lineIndex, accountId) {
    var ds = ensureDayStruct(mdata, day);
    if (!ds.lines[lineIndex]) {
      var nl = {};
      state.accounts.forEach(function (a) {
        nl[a.id] = emptyCell();
      });
      ds.lines[lineIndex] = nl;
    }
    var line = ds.lines[lineIndex];
    if (!line[accountId]) line[accountId] = emptyCell();
    return line[accountId];
  }

  var state = loadState();
  var currentKey = monthKey(new Date().getFullYear(), new Date().getMonth() + 1);

  var elMonth = document.getElementById("month-input");
  var elHead = document.getElementById("ledger-head");
  var elBody = document.getElementById("ledger-body");
  var elOpeningsBar = document.getElementById("openings-bar");
  var elLedgerScroll = document.getElementById("ledger-scroll");
  var elSummary = document.getElementById("summary-grid");
  var elMonthlyChart = document.getElementById("monthly-chart");
  var elLiabilitiesGrid = document.getElementById("liabilities-grid");
  var dlg = document.getElementById("dlg-accounts");
  var elAccountEdit = document.getElementById("account-edit-list");
  var dlgLiabilities = document.getElementById("dlg-liabilities");
  var elLiabilityEditList = document.getElementById("liability-edit-list");
  var dlgFixedBatch = document.getElementById("dlg-fixed-batch");
  var elFixedAccount = document.getElementById("fixed-account");
  var elFixedKind = document.getElementById("fixed-kind");
  var elFixedAmount = document.getElementById("fixed-amount");
  var elFixedDay = document.getElementById("fixed-day");
  var elFixedStartMonth = document.getElementById("fixed-start-month");
  var elFixedEndMonth = document.getElementById("fixed-end-month");
  var elFixedNote = document.getElementById("fixed-note");
  var elThemeAuto = document.getElementById("theme-tab-auto");
  var elThemeDay = document.getElementById("theme-tab-day");
  var elThemeNight = document.getElementById("theme-tab-night");

  /* ----- Google Drive 同期（ブラウザのみ・OAuth PKCE / drive.file スコープ） ----- */
  var driveOAuthWaiters = [];
  var driveAccessPending = false;
  var driveTokenClient = null;
  var driveTokenClientCid = "";
  var drivePushTimer = null;

  function syncTs(st) {
    return st && st._cashLedgerSync && typeof st._cashLedgerSync.updatedAt === "number"
      ? st._cashLedgerSync.updatedAt
      : 0;
  }

  function ledgerMonthKeyCount(st) {
    if (!st || !st.months || typeof st.months !== "object") return 0;
    return Object.keys(st.months).length;
  }

  /**
   * 起動時自動読込用：JSON 内の updatedAt だけだとメタ欠落時に常にスキップされるため、
   * Drive の modifiedTime と「月データの量」で補助判定する。
   */
  function startupRemoteLooksNewerThanLocal(remoteObj, driveModifiedMs) {
    var rTs = syncTs(remoteObj);
    var lTs = syncTs(state);
    if (rTs > lTs) return true;
    var dm =
      driveModifiedMs != null && Number.isFinite(Number(driveModifiedMs))
        ? Number(driveModifiedMs)
        : null;
    var rk = ledgerMonthKeyCount(remoteObj);
    var lk = ledgerMonthKeyCount(state);
    if (rTs === 0 && lTs === 0) {
      if (rk > lk) return true;
      if (rk > 0 && lk === 0) return true;
      return false;
    }
    if (lTs > 0 && dm != null && dm > lTs) return true;
    if (rTs === 0 && lTs > 0 && rk > lk) return true;
    return false;
  }

  function stampLedgerSyncMeta(st) {
    if (!st || typeof st !== "object") return;
    st._cashLedgerSync = st._cashLedgerSync || {};
    st._cashLedgerSync.updatedAt = Date.now();
  }

  function getDriveClientId() {
    try {
      var fromLs = localStorage.getItem(LS_GOOGLE_CLIENT_ID);
      if (fromLs && String(fromLs).trim()) return String(fromLs).trim();
      var meta = document.querySelector('meta[name="cash-ledger-google-client-id"]');
      if (meta && meta.getAttribute("content")) return meta.getAttribute("content").trim();
    } catch (e) {}
    return "";
  }

  function ensureGsiLoaded(cb) {
    if (window.google && google.accounts && google.accounts.oauth2) {
      cb(null);
      return;
    }
    var n = 0;
    var t = setInterval(function () {
      if (window.google && google.accounts && google.accounts.oauth2) {
        clearInterval(t);
        cb(null);
      } else if (++n > 160) {
        clearInterval(t);
        cb(new Error("Googleのサインイン用スクリプトが読み込めませんでした（広告ブロックやネットワークを確認してください）"));
      }
    }, 50);
  }

  function ensureDriveTokenClient(cid) {
    if (driveTokenClient && driveTokenClientCid === cid) return driveTokenClient;
    driveTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: cid,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: function (resp) {
        driveAccessPending = false;
        var waiters = driveOAuthWaiters.slice();
        driveOAuthWaiters = [];
        if (resp.error) {
          waiters.forEach(function (w) {
            w(new Error(resp.error));
          });
          return;
        }
        waiters.forEach(function (w) {
          w(null, resp.access_token);
        });
      },
    });
    driveTokenClientCid = cid;
    return driveTokenClient;
  }

  function requestDriveAccess(cb) {
    driveOAuthWaiters.push(cb);
    if (driveAccessPending) return;
    driveAccessPending = true;
    ensureGsiLoaded(function (gsiErr) {
      if (gsiErr) {
        driveAccessPending = false;
        var w = driveOAuthWaiters.slice();
        driveOAuthWaiters = [];
        w.forEach(function (x) {
          x(gsiErr);
        });
        return;
      }
      var cid = getDriveClientId();
      if (!cid) {
        driveAccessPending = false;
        var w2 = driveOAuthWaiters.slice();
        driveOAuthWaiters = [];
        w2.forEach(function (x) {
          x(new Error("OAuth Client ID が未設定です。「Drive設定」から入力してください。"));
        });
        return;
      }
      ensureDriveTokenClient(cid).requestAccessToken({ prompt: "" });
    });
  }

  function updateDriveStatusLabel(msg) {
    var el = document.getElementById("drive-sync-status");
    if (!el) return;
    el.textContent = msg || "";
  }

  function scheduleDrivePushIfEnabled() {
    try {
      if (localStorage.getItem(LS_DRIVE_AUTO_PUSH) !== "1") return;
      if (!getDriveClientId()) return;
      clearTimeout(drivePushTimer);
      drivePushTimer = setTimeout(function () {
        drivePushTimer = null;
        performDrivePush(function (err) {
          if (err) updateDriveStatusLabel("Drive自動保存: " + err.message);
        });
      }, 2800);
    } catch (e) {}
  }

  /** PC と別端末ではファイル ID が共有されないため、Drive 上の同名ファイルを検索して紐づける */
  function findLedgerSyncFilesOnDrive(token, cb) {
    var q =
      "name='" +
      DRIVE_SYNC_FILENAME.replace(/\\/g, "\\\\").replace(/'/g, "\\'") +
      "' and mimeType='application/json' and trashed=false";
    var url =
      "https://www.googleapis.com/drive/v3/files?q=" +
      encodeURIComponent(q) +
      "&fields=files(id,modifiedTime)&pageSize=20";
    fetch(url, { headers: { Authorization: "Bearer " + token } })
      .then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) throw new Error(j.error ? JSON.stringify(j.error) : String(r.status));
          return j.files || [];
        });
      })
      .then(function (files) {
        if (!files.length) {
          cb(null, null);
          return;
        }
        files.sort(function (a, b) {
          return String(b.modifiedTime || "").localeCompare(String(a.modifiedTime || ""));
        });
        cb(null, files[0].id);
      })
      .catch(cb);
  }

  function driveStoredFileStillExists(token, id, cb) {
    fetch("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(id) + "?fields=id", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(function (r) {
        cb(null, r.ok);
      })
      .catch(function () {
        cb(null, false);
      });
  }

  /** localStorage の ID を検証し、無ければ／無効なら同名検索で補完する */
  function ensureDriveFileId(token, cb) {
    var fid = localStorage.getItem(LS_DRIVE_FILE_ID);
    if (fid) {
      driveStoredFileStillExists(token, fid, function (_err, ok) {
        if (ok) {
          cb(null, fid);
          return;
        }
        try {
          localStorage.removeItem(LS_DRIVE_FILE_ID);
        } catch (e) {}
        findLedgerSyncFilesOnDrive(token, function (e2, found) {
          if (e2) {
            cb(e2);
            return;
          }
          if (found) {
            try {
              localStorage.setItem(LS_DRIVE_FILE_ID, found);
            } catch (e3) {}
          }
          cb(null, found);
        });
      });
      return;
    }
    findLedgerSyncFilesOnDrive(token, function (e2, found) {
      if (e2) {
        cb(e2);
        return;
      }
      if (found) {
        try {
          localStorage.setItem(LS_DRIVE_FILE_ID, found);
        } catch (e3) {}
      }
      cb(null, found);
    });
  }

  function uploadLedgerToDrive(token, jsonStr, cb) {
    function patch(id, tok) {
      fetch(
        "https://www.googleapis.com/upload/drive/v3/files/" + encodeURIComponent(id) + "?uploadType=media",
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + tok,
            "Content-Type": "application/json",
          },
          body: jsonStr,
        }
      )
        .then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error(t || String(r.status)); });
          updateDriveStatusLabel("Driveへ保存 " + new Date().toLocaleTimeString());
          cb(null);
        })
        .catch(cb);
    }
    function createEmptyThenPatch(tok) {
      fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + tok,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: DRIVE_SYNC_FILENAME,
          mimeType: "application/json",
        }),
      })
        .then(function (r) {
          return r.json().then(function (j) {
            if (!r.ok) throw new Error(j.error ? JSON.stringify(j.error) : String(r.status));
            return j;
          });
        })
        .then(function (j) {
          if (!j.id) throw new Error("ファイルIDを取得できませんでした");
          localStorage.setItem(LS_DRIVE_FILE_ID, j.id);
          patch(j.id, tok);
        })
        .catch(cb);
    }
    ensureDriveFileId(token, function (err, fid) {
      if (err) {
        cb(err);
        return;
      }
      if (fid) {
        patch(fid, token);
        return;
      }
      createEmptyThenPatch(token);
    });
  }

  function performDrivePush(cb) {
    cb = cb || function () {};
    stampLedgerSyncMeta(state);
    saveState(state, true);
    var jsonStr = JSON.stringify(state, null, 2);
    requestDriveAccess(function (err, token) {
      if (err) {
        cb(err);
        return;
      }
      uploadLedgerToDrive(token, jsonStr, cb);
    });
  }

  function performDrivePull(opts, cb) {
    opts = opts || {};
    cb = cb || function () {};
    requestDriveAccess(function (err, token) {
      if (err) {
        cb(err);
        return;
      }
      ensureDriveFileId(token, function (errId, fid) {
        if (errId) {
          cb(errId);
          return;
        }
        if (!fid) {
          cb(
            new Error(
              "Driveに " +
                DRIVE_SYNC_FILENAME +
                " がありません。PC で一度「Driveへ保存」してから、スマホで「Driveから読込」を試してください。"
            )
          );
          return;
        }
        var metaUrl =
          "https://www.googleapis.com/drive/v3/files/" +
          encodeURIComponent(fid) +
          "?fields=modifiedTime";
        fetch(metaUrl, { headers: { Authorization: "Bearer " + token } })
          .then(function (r) {
            if (!r.ok) return r.text().then(function (t) { throw new Error(t || String(r.status)); });
            return r.json();
          })
          .then(function (meta) {
            var driveModifiedMs =
              meta && meta.modifiedTime ? Date.parse(meta.modifiedTime) : NaN;
            if (Number.isNaN(driveModifiedMs)) driveModifiedMs = null;
            return fetch(
              "https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(fid) + "?alt=media",
              { headers: { Authorization: "Bearer " + token } }
            ).then(function (r2) {
              if (!r2.ok) return r2.text().then(function (t) { throw new Error(t || String(r2.status)); });
              return r2.text().then(function (text) {
                return { text: text, driveModifiedMs: driveModifiedMs };
              });
            });
          })
          .then(function (bundle) {
            var remoteObj = JSON.parse(bundle.text);
            var driveModifiedMs = bundle.driveModifiedMs;
            if (opts.startup) {
              if (!startupRemoteLooksNewerThanLocal(remoteObj, driveModifiedMs)) {
                updateDriveStatusLabel(
                  "Driveはローカルと同じか古いため、そのままにしました（手動の「Driveから読込」なら確認後に取り込めます）"
                );
                cb(null);
                return;
              }
              if (
                !confirm(
                  "Googleドライブのデータのほうが新しいです。\n読み込むと、このブラウザのデータは置き換わります。\nよろしいですか？"
                )
              ) {
                cb(null);
                return;
              }
            } else if (!opts.forceReplace) {
              if (
                !confirm(
                  "Driveの内容で、このブラウザのデータをすべて置き換えます。\nよろしいですか？"
                )
              ) {
                cb(null);
                return;
              }
            }
            ingestWholeLedgerPayload(remoteObj);
            updateDriveStatusLabel("Driveから読み込みました");
            cb(null);
          })
          .catch(function (e) {
            cb(e instanceof Error ? e : new Error(String(e)));
          });
      });
    });
  }

  function maybeDriveStartupPull() {
    try {
      if (localStorage.getItem(LS_DRIVE_AUTO_PULL) !== "1") return;
      if (!getDriveClientId()) return;
      setTimeout(function () {
        performDrivePull({ startup: true }, function (err) {
          if (err) updateDriveStatusLabel("Drive確認: " + err.message);
        });
      }, 700);
    } catch (e) {}
  }

  function openDriveSettingsDialog() {
    var dlgDrive = document.getElementById("dlg-drive");
    var inp = document.getElementById("drive-client-id-input");
    var chkPush = document.getElementById("drive-auto-push");
    var chkPull = document.getElementById("drive-auto-pull");
    if (inp) inp.value = getDriveClientId();
    if (chkPush) chkPush.checked = localStorage.getItem(LS_DRIVE_AUTO_PUSH) === "1";
    if (chkPull) chkPull.checked = localStorage.getItem(LS_DRIVE_AUTO_PULL) === "1";
    openDialogSafe(dlgDrive);
  }

  function saveDriveSettingsFromDialog() {
    var dlgDrive = document.getElementById("dlg-drive");
    var inp = document.getElementById("drive-client-id-input");
    var chkPush = document.getElementById("drive-auto-push");
    var chkPull = document.getElementById("drive-auto-pull");
    var cid = inp ? String(inp.value || "").trim() : "";
    try {
      if (cid) localStorage.setItem(LS_GOOGLE_CLIENT_ID, cid);
      else localStorage.removeItem(LS_GOOGLE_CLIENT_ID);
      localStorage.setItem(LS_DRIVE_AUTO_PUSH, chkPush && chkPush.checked ? "1" : "0");
      localStorage.setItem(LS_DRIVE_AUTO_PULL, chkPull && chkPull.checked ? "1" : "0");
    } catch (e) {}
    driveTokenClient = null;
    driveTokenClientCid = "";
    updateDriveStatusLabel(cid ? "Drive設定を保存しました" : "Client ID を消しました（連携は無効）");
    closeDialogSafe(dlgDrive);
  }

  function getTimeTheme() {
    var h = new Date().getHours();
    if (h >= 6 && h < 18) return "day";
    return "night";
  }

  function resolveTheme() {
    var tab = (state.ui && state.ui.themeTab) || "auto";
    if (tab === "day") return "day";
    if (tab === "night") return "night";
    return getTimeTheme();
  }

  function syncThemeColorMeta() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute(
      "content",
      document.body.classList.contains("theme-night") ? "#0f1419" : "#f6f7fb"
    );
  }

  function applyTheme() {
    ensureUi(state);
    var t = resolveTheme();
    document.body.classList.toggle("theme-night", t === "night");
    syncThemeColorMeta();

    var tab = state.ui.themeTab || "auto";
    if (elThemeAuto) elThemeAuto.setAttribute("aria-selected", tab === "auto" ? "true" : "false");
    if (elThemeDay) elThemeDay.setAttribute("aria-selected", tab === "day" ? "true" : "false");
    if (elThemeNight) elThemeNight.setAttribute("aria-selected", tab === "night" ? "true" : "false");

    requestAnimationFrame(function () {
      syncLedgerTheadRow1Height();
    });
  }

  function setThemeTab(next) {
    ensureUi(state);
    state.ui.themeTab = next;
    saveState(state);
    applyTheme();
  }

  function setMonthInputFromKey(key) {
    elMonth.value = key;
  }

  function safeBind(id, eventName, handler) {
    var el = document.getElementById(id);
    if (!el) return false;
    el.addEventListener(eventName, handler);
    return true;
  }

  function openDialogSafe(dialogEl) {
    if (!dialogEl) return false;
    if (typeof dialogEl.showModal === "function") {
      if (!dialogEl.open) dialogEl.showModal();
      return true;
    }
    dialogEl.setAttribute("open", "open");
    return true;
  }

  function closeDialogSafe(dialogEl) {
    if (!dialogEl) return false;
    if (typeof dialogEl.close === "function") {
      if (dialogEl.open) dialogEl.close();
      return true;
    }
    dialogEl.removeAttribute("open");
    return true;
  }

  function parseNum(v) {
    if (v === "" || v == null) return 0;
    var n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function fmtNum(n) {
    if (!Number.isFinite(n)) return "";
    return Math.round(n).toLocaleString("ja-JP");
  }

  function monthLabel(key) {
    var mk = parseMonthKey(key);
    return String(mk.y).slice(2) + "/" + pad2(mk.m);
  }

  function fmtMan(n) {
    if (!Number.isFinite(n)) return "";
    return (n / 10000).toLocaleString("ja-JP", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function renderHead() {
    var html = "";
    html += '<tr class="account-names">';
    html += '<th class="sticky-col thead-corner" scope="col">日</th>';
    html += '<th class="sticky-col-2 thead-corner" scope="col">曜</th>';
    state.accounts.forEach(function (a) {
      html += '<th scope="colgroup" colspan="4">' + escapeHtml(a.name) + "</th>";
    });
    html += '<th scope="col" class="col-total" rowspan="2">合計<br /><span class="th-sub">（全口座残高）</span></th>';
    html += "</tr><tr class=\"subheads\">";
    html += '<th class="sticky-col thead-corner thead-sub"></th><th class="sticky-col-2 thead-corner thead-sub"></th>';
    state.accounts.forEach(function () {
      html += "<th class=\"thead-sub\">引落</th><th class=\"thead-sub\">入金</th><th class=\"thead-sub\">残高</th><th class=\"thead-sub\">項目</th>";
    });
    html += "</tr>";
    elHead.innerHTML = html;
  }

  /** 見出し2段目の sticky top を、1段目 tr の実測高さに合わせる（ずれると1日目が欠ける） */
  function syncLedgerTheadRow1Height() {
    if (!elLedgerScroll) return;
    var tr = document.querySelector("#ledger-table thead tr.account-names");
    if (!tr) return;
    var h = tr.getBoundingClientRect().height;
    if (h > 0) {
      elLedgerScroll.style.setProperty("--ledger-thead-row1", Math.ceil(h) + "px");
    }
  }

  var ledgerTheadResizeObs = null;
  function ensureLedgerTheadResizeObserver() {
    if (ledgerTheadResizeObs || !window.ResizeObserver || !elLedgerScroll) return;
    ledgerTheadResizeObs = new ResizeObserver(function () {
      syncLedgerTheadRow1Height();
    });
    ledgerTheadResizeObs.observe(elLedgerScroll);
  }

  function renderOpeningsBar(mk, mdata) {
    if (!elOpeningsBar) return;
    var now = new Date();
    var cy = now.getFullYear();
    var cm = now.getMonth() + 1;
    var cd = now.getDate();
    var dim = daysInMonth(mk.y, mk.m);
    var lastDay;
    var title;
    if (mk.y === cy && mk.m === cm) {
      lastDay = Math.min(cd, dim);
      title = "今日の残高（" + mk.m + "月" + lastDay + "日現在）";
    } else if (mk.y < cy || (mk.y === cy && mk.m < cm)) {
      lastDay = dim;
      title = "この月の残高";
    } else {
      lastDay = 0;
      title = "この月の残高（月初）";
    }
    var balMap = balancesThroughDay(mdata, mk.y, mk.m, lastDay);
    var parts = [];
    var updatedStr = formatLedgerLocalUpdatedAt(state);
    var kickerInner =
      '<span class="openings-bar-title">' +
      escapeHtml(title) +
      "</span>" +
      (updatedStr
        ? '<span class="openings-bar-updated" title="このブラウザに保存したデータの最終更新時刻">' +
          "更新 " +
          escapeHtml(updatedStr) +
          "</span>"
        : "");
    parts.push(
      '<p class="openings-bar-kicker openings-bar-kicker--with-meta">' +
        kickerInner +
        "</p>"
    );
    parts.push('<div class="openings-bar-grid">');
    state.accounts.forEach(function (a) {
      var v = balMap[a.id] != null ? balMap[a.id] : 0;
      parts.push(
        '<div class="openings-bar-item">' +
          "<span class=\"openings-bar-label\">" +
          escapeHtml(a.name) +
          "</span>" +
          '<span class="openings-bar-value">' +
          fmtNum(v) +
          "</span>" +
          "</div>"
      );
    });
    var osum = 0;
    state.accounts.forEach(function (a) {
      osum += balMap[a.id] || 0;
    });
    parts.push(
      '<div class="openings-bar-item openings-bar-total">' +
        "<span>合計</span>" +
        '<strong class="' +
        (osum < 0 ? "neg" : "") +
        '">' +
        fmtNum(osum) +
        "</strong>" +
        "</div>"
    );
    parts.push("</div>");
    elOpeningsBar.innerHTML = parts.join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function csvEscapeField(val) {
    var t = String(val == null ? "" : val);
    if (/[",\r\n]/.test(t)) {
      return '"' + t.replace(/"/g, '""') + '"';
    }
    return t;
  }

  /** エクスポート用に月データをクローン（state を変更しない） */
  function cloneMonthDataForExport(key) {
    var m = state.months[key];
    var copy = m ? JSON.parse(JSON.stringify(m)) : { openings: {}, days: {} };
    state.accounts.forEach(function (a) {
      if (copy.openings[a.id] == null) copy.openings[a.id] = 0;
    });
    return copy;
  }

  /**
   * 開始月〜終了月の明細CSV（BOM付きUTF-8）
   * 銀行（口座）ごとに列ブロック: 〇〇_引落 / 〇〇_入金 / 〇〇_項目 / 〇〇_残高。1行＝その日のその「行」。
   */
  function buildCsvExport(startKey, endKey) {
    var serA = monthSerialFromKey(startKey);
    var serB = monthSerialFromKey(endKey);
    var lo = Math.min(serA, serB);
    var hi = Math.max(serA, serB);
    var MAX_SPAN = 120;
    if (hi - lo > MAX_SPAN) {
      throw new Error("出力できるのは最大 " + (MAX_SPAN + 1) + " ヶ月分までです。期間を狭めてください。");
    }

    var header = ["年月日", "曜日", "行番号"];
    state.accounts.forEach(function (a) {
      var base = String(a.name || "").trim() || "口座";
      header.push(base + "_引落", base + "_入金", base + "_項目", base + "_残高");
    });
    header.push("全口座合計残高");
    var linesOut = [header.map(csvEscapeField).join(",")];

    for (var serial = lo; serial <= hi; serial++) {
      var y = Math.floor(serial / 12);
      var m = (serial % 12) + 1;
      var key = monthKey(y, m);
      var mk = { y: y, m: m };
      var mdata = cloneMonthDataForExport(key);
      syncOpeningsFromPreviousMonth(mk, mdata);
      var dim = daysInMonth(y, m);
      var running = {};
      state.accounts.forEach(function (a) {
        running[a.id] = parseNum(mdata.openings[a.id]);
      });

      for (var day = 1; day <= dim; day++) {
        var ds = ensureDayStruct(mdata, day);
        var nLines = ds.lines.length;
        var dt = new Date(y, m - 1, day);
        var dow = WEEKDAYS[dt.getDay()];
        var isoDate = y + "-" + pad2(m) + "-" + pad2(day);

        for (var li = 0; li < nLines; li++) {
          var ents = state.accounts.map(function (a) {
            return readLineCell(ds, li, a.id);
          });
          var hasAny = ents.some(function (ent) {
            return (
              parseNum(ent.w) !== 0 ||
              parseNum(ent.d) !== 0 ||
              String(ent.note || "").trim() !== ""
            );
          });
          if (!hasAny) continue;

          var cells = [isoDate, dow, String(li + 1)];
          for (var ai = 0; ai < state.accounts.length; ai++) {
            var acc = state.accounts[ai];
            var ent = ents[ai];
            var w = parseNum(ent.w);
            var dAmt = parseNum(ent.d);
            var note = String(ent.note || "");
            running[acc.id] = running[acc.id] + dAmt - w;
            cells.push(
              String(Math.round(w)),
              String(Math.round(dAmt)),
              note,
              String(Math.round(running[acc.id]))
            );
          }
          var totalBal = 0;
          state.accounts.forEach(function (a) {
            totalBal += running[a.id];
          });
          cells.push(String(Math.round(totalBal)));
          linesOut.push(cells.map(csvEscapeField).join(","));
        }
      }
    }

    return "\uFEFF" + linesOut.join("\r\n");
  }

  function openCsvExportDialog() {
    var dlgCsv = document.getElementById("dlg-csv-export");
    var inpS = document.getElementById("csv-start-month");
    var inpE = document.getElementById("csv-end-month");
    if (inpS) inpS.value = currentKey;
    if (inpE) inpE.value = currentKey;
    openDialogSafe(dlgCsv);
  }

  function downloadCsvExportFile() {
    var inpS = document.getElementById("csv-start-month");
    var inpE = document.getElementById("csv-end-month");
    var startKey = normalizeMonthInput(inpS ? inpS.value : "");
    var endKey = normalizeMonthInput(inpE ? inpE.value : "");
    if (!startKey || !endKey) {
      alert("開始月と終了月を選んでください。");
      return;
    }
    var csv;
    try {
      csv = buildCsvExport(startKey, endKey);
    } catch (e) {
      alert(e.message || String(e));
      return;
    }
    var serS = monthSerialFromKey(startKey);
    var serE = monthSerialFromKey(endKey);
    var loSer = Math.min(serS, serE);
    var hiSer = Math.max(serS, serE);
    var loKey = monthKey(Math.floor(loSer / 12), (loSer % 12) + 1);
    var hiKey = monthKey(Math.floor(hiSer / 12), (hiSer % 12) + 1);
    var fname =
      "cash-ledger_" +
      loKey.replace("-", "") +
      "_" +
      hiKey.replace("-", "") +
      ".csv";

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    a.click();
    URL.revokeObjectURL(a.href);
    closeDialogSafe(document.getElementById("dlg-csv-export"));
  }

  function sumOpenings(mdata) {
    var t = 0;
    state.accounts.forEach(function (a) {
      t += parseNum(mdata.openings[a.id]);
    });
    return t;
  }

  /** 月初＋1日〜lastDay 日までの入出金を反映した各口座残高。lastDay が 0 なら月初のみ */
  function balancesThroughDay(mdata, y, m, lastDay) {
    var dim = daysInMonth(y, m);
    var upto = Math.min(Math.max(0, lastDay), dim);
    var result = {};
    state.accounts.forEach(function (a) {
      result[a.id] = parseNum(mdata.openings[a.id]);
    });
    for (var day = 1; day <= upto; day++) {
      var d = String(day);
      var val = mdata.days && mdata.days[d];
      if (!val || !Array.isArray(val.lines)) continue;
      for (var li = 0; li < val.lines.length; li++) {
        var line = val.lines[li];
        state.accounts.forEach(function (a) {
          var c = line[a.id];
          if (c) result[a.id] += parseNum(c.d) - parseNum(c.w);
        });
      }
    }
    return result;
  }

  /** その月の各口座の月末残高 */
  function closingBalancesFromMonthData(mdata, y, m) {
    return balancesThroughDay(mdata, y, m, daysInMonth(y, m));
  }

  /** 前月がある → 前月末残高を月初に。前月がない → 月初は 0。変更があれば true */
  function syncOpeningsFromPreviousMonth(mk, mdata) {
    var prev = new Date(mk.y, mk.m - 2, 1);
    var pkey = monthKey(prev.getFullYear(), prev.getMonth() + 1);
    var pdat = state.months[pkey];
    var changed = false;
    if (!pdat) {
      state.accounts.forEach(function (a) {
        if (parseNum(mdata.openings[a.id]) !== 0) changed = true;
        mdata.openings[a.id] = 0;
      });
      return changed;
    }
    var closings = closingBalancesFromMonthData(pdat, prev.getFullYear(), prev.getMonth() + 1);
    state.accounts.forEach(function (a) {
      var v = closings[a.id];
      if (parseNum(mdata.openings[a.id]) !== v) changed = true;
      mdata.openings[a.id] = v;
    });
    return changed;
  }

  function render() {
    var mk = parseMonthKey(currentKey);
    var dim = daysInMonth(mk.y, mk.m);
    var mdata = ensureMonth(state, currentKey);
    if (syncOpeningsFromPreviousMonth(mk, mdata)) {
      saveState(state);
    }

    renderOpeningsBar(mk, mdata);
    renderHead();

    var body = "";
    var running = {};
    state.accounts.forEach(function (a) {
      running[a.id] = parseNum(mdata.openings[a.id]);
    });

    var rowIndex = 0;
    var todayRef = new Date();
    var ty = todayRef.getFullYear();
    var tm = todayRef.getMonth() + 1;
    var td = todayRef.getDate();
    for (var day = 1; day <= dim; day++) {
      var ds = ensureDayStruct(mdata, day);
      var nLines = ds.lines.length;
      var dt = new Date(mk.y, mk.m - 1, day);
      var dow = WEEKDAYS[dt.getDay()];
      var isCalendarToday = mk.y === ty && mk.m === tm && day === td;

      for (var li = 0; li < nLines; li++) {
        var rowClass = "day-row";
        if (rowIndex % 2 === 0) rowClass += " day-row--alt";
        if (isCalendarToday) rowClass += " day-row--today";
        body += '<tr class="' + rowClass + '" data-day="' + day + '">';
        if (li === 0) {
          body +=
            '<td class="sticky-col day-cell" rowspan="' +
            nLines +
            '">' +
            day +
            '<div class="day-actions">' +
            '<button type="button" class="btn btn-day-add js-add-line" data-day="' +
            day +
            '" title="この日に取引行を追加">＋行</button>' +
            (nLines > 1
              ? '<button type="button" class="btn btn-day-del js-del-line" data-day="' +
                day +
                '" title="この日の最後の取引行を削除">−行</button>'
              : "") +
            "</div></td>";
          body += '<td class="sticky-col-2 day-cell" rowspan="' + nLines + '">' + dow + "</td>";
        }

        state.accounts.forEach(function (a) {
          var ent = readLineCell(ds, li, a.id);
          var w = ent.w;
          var d = ent.d;
          running[a.id] = running[a.id] + d - w;
          var bal = running[a.id];
          body +=
            '<td><input type="number" inputmode="numeric" class="js-w" data-day="' +
            day +
            '" data-line="' +
            li +
            '" data-aid="' +
            a.id +
            '" value="' +
            (w === 0 ? "" : w) +
            '" step="1" aria-label="' +
            day +
            "日 " +
            (li + 1) +
            "行目 " +
            a.name +
            ' 引落" /></td>';
          body +=
            '<td><input type="number" inputmode="numeric" class="js-d" data-day="' +
            day +
            '" data-line="' +
            li +
            '" data-aid="' +
            a.id +
            '" value="' +
            (d === 0 ? "" : d) +
            '" step="1" aria-label="' +
            day +
            "日 " +
            (li + 1) +
            "行目 " +
            a.name +
            ' 入金" /></td>';
          body +=
            '<td class="bal' +
            (bal < 0 ? " neg" : "") +
            '">' +
            fmtNum(bal) +
            "</td>";
          body +=
            '<td><input type="text" class="js-note" data-day="' +
            day +
            '" data-line="' +
            li +
            '" data-aid="' +
            a.id +
            '" value="' +
            escapeHtml(ent.note) +
            '" aria-label="' +
            day +
            "日 " +
            (li + 1) +
            "行目 " +
            a.name +
            ' 項目" /></td>';
        });

        var totalBal = 0;
        state.accounts.forEach(function (a) {
          totalBal += running[a.id];
        });
        body +=
          '<td class="bal col-total' +
          (totalBal < 0 ? " neg" : "") +
          '">' +
          fmtNum(totalBal) +
          "</td>";

        body += "</tr>";
        rowIndex++;
      }
    }

    elBody.innerHTML = body;
    wireBodyEvents(mdata);
    renderSummary(mk, dim, mdata);
    renderMonthlyChart(currentKey);
    renderLiabilitiesSummary(mk);

    ensureLedgerTheadResizeObserver();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        syncLedgerTheadRow1Height();
      });
    });
  }

  function wireBodyEvents(mdata) {
    elBody.querySelectorAll(".js-w, .js-d").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var day = parseInt(inp.getAttribute("data-day"), 10);
        var line = parseInt(inp.getAttribute("data-line"), 10);
        var id = inp.getAttribute("data-aid");
        var cell = getLineCell(mdata, day, line, id);
        if (inp.classList.contains("js-w")) cell.w = parseNum(inp.value);
        else cell.d = parseNum(inp.value);
        saveState(state);
        render();
      });
    });

    elBody.querySelectorAll(".js-note").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var day = parseInt(inp.getAttribute("data-day"), 10);
        var line = parseInt(inp.getAttribute("data-line"), 10);
        var id = inp.getAttribute("data-aid");
        getLineCell(mdata, day, line, id).note = inp.value;
        saveState(state);
      });
    });

    elBody.querySelectorAll(".js-add-line").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var day = parseInt(btn.getAttribute("data-day"), 10);
        var ds = ensureDayStruct(mdata, day);
        var nl = {};
        state.accounts.forEach(function (a) {
          nl[a.id] = emptyCell();
        });
        ds.lines.push(nl);
        saveState(state);
        render();
      });
    });

    elBody.querySelectorAll(".js-del-line").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var day = parseInt(btn.getAttribute("data-day"), 10);
        var ds = ensureDayStruct(mdata, day);
        if (ds.lines.length <= 1) return;
        ds.lines.pop();
        saveState(state);
        render();
      });
    });
  }

  function dayTotals(mdata, day) {
    var ds = ensureDayStruct(mdata, day);
    var perA = {};
    state.accounts.forEach(function (a) {
      var tw = 0;
      var td = 0;
      for (var i = 0; i < ds.lines.length; i++) {
        var c = readLineCell(ds, i, a.id);
        tw += c.w;
        td += c.d;
      }
      perA[a.id] = { tw: tw, td: td };
    });
    return perA;
  }

  function monthInOutTotals(mdata, y, m) {
    var dim = daysInMonth(y, m);
    var w = 0;
    var d = 0;
    for (var day = 1; day <= dim; day++) {
      var val = mdata && mdata.days ? mdata.days[String(day)] : null;
      if (!val || !Array.isArray(val.lines)) continue;
      for (var li = 0; li < val.lines.length; li++) {
        var line = val.lines[li] || {};
        state.accounts.forEach(function (a) {
          var c = line[a.id];
          if (!c) return;
          w += parseNum(c.w);
          d += parseNum(c.d);
        });
      }
    }
    return { w: w, d: d, net: d - w };
  }

  function totalWithdrawByKeywordThroughSerial(keyword, maxSerial, minSerial) {
    var kw = String(keyword || "").trim();
    if (!kw) return 0;
    var total = 0;
    Object.keys(state.months || {}).forEach(function (key) {
      var serial = monthSerialFromKey(key);
      if (minSerial != null && serial < minSerial) return;
      if (serial > maxSerial) return;
      var mk = parseMonthKey(key);
      var dim = daysInMonth(mk.y, mk.m);
      var mdata = state.months[key];
      for (var day = 1; day <= dim; day++) {
        var val = mdata.days && mdata.days[String(day)];
        if (!val || !Array.isArray(val.lines)) continue;
        for (var li = 0; li < val.lines.length; li++) {
          var line = val.lines[li];
          state.accounts.forEach(function (a) {
            var c = line[a.id];
            if (!c) return;
            var note = String(c.note || "");
            if (note.indexOf(kw) >= 0) total += parseNum(c.w);
          });
        }
      }
    });
    return total;
  }

  function totalLiabilityRemainingThroughSerial(maxSerial) {
    ensureLiabilities(state);
    var remain = 0;
    state.liabilities.forEach(function (item) {
      var startMonth = normalizeMonthInput(item.startMonth);
      var startSerial = startMonth ? monthSerialFromKey(startMonth) : null;
      if (startSerial != null && maxSerial < startSerial) return;
      var paid = totalWithdrawByKeywordThroughSerial(item.keyword, maxSerial, startSerial);
      remain += parseNum(item.opening) - paid;
    });
    return remain;
  }

  function buildMonthlySeries(centerKey, halfSpan) {
    ensureLiabilities(state);
    var center = monthSerialFromKey(centerKey);
    var minSerial = center - halfSpan;
    var maxSerial = center + halfSpan;
    var existingKeys = Object.keys(state.months || {});
    var earliestSerial = null;
    existingKeys.forEach(function (k) {
      var s = monthSerialFromKey(k);
      if (earliestSerial == null || s < earliestSerial) earliestSerial = s;
    });

    var cumulativeBySerial = {};
    if (earliestSerial != null && earliestSerial <= maxSerial) {
      var running = 0;
      for (var s = earliestSerial; s <= maxSerial; s++) {
        var y0 = Math.floor(s / 12);
        var m0 = (s % 12) + 1;
        var k0 = monthKey(y0, m0);
        var mt = monthInOutTotals(state.months[k0], y0, m0);
        running += mt.net;
        cumulativeBySerial[s] = running;
      }
    }

    var list = [];
    for (var serial = minSerial; serial <= maxSerial; serial++) {
      var y = Math.floor(serial / 12);
      var m = (serial % 12) + 1;
      var key = monthKey(y, m);
      var mdata = state.months[key];
      var t = monthInOutTotals(mdata, y, m);
      var cumulative = 0;
      if (earliestSerial != null && serial >= earliestSerial) {
        cumulative = cumulativeBySerial[serial] || 0;
      }
      var liabilitiesRemain = totalLiabilityRemainingThroughSerial(serial);
      list.push({
        key: key,
        label: monthLabel(key),
        income: t.d,
        expense: t.w,
        total: cumulative,
        netAsset: cumulative - liabilitiesRemain,
      });
    }
    return list;
  }

  function pathFromSeries(series, plotX, plotY, plotW, plotH, minY, maxY, pickValue) {
    var stepX = series.length > 1 ? plotW / (series.length - 1) : 0;
    var d = "";
    for (var i = 0; i < series.length; i++) {
      var val = pickValue(series[i]);
      var x = plotX + stepX * i;
      var y = plotY + ((maxY - val) / (maxY - minY || 1)) * plotH;
      d += (i === 0 ? "M" : " L") + x.toFixed(2) + " " + y.toFixed(2);
    }
    return d;
  }

  function dotsFromSeries(series, className, plotX, plotY, plotW, plotH, minY, maxY, pickValue) {
    var stepX = series.length > 1 ? plotW / (series.length - 1) : 0;
    return series
      .map(function (it, i) {
        var val = pickValue(it);
        var x = plotX + stepX * i;
        var y = plotY + ((maxY - val) / (maxY - minY || 1)) * plotH;
        return '<circle class="' + className + '" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="2.7"></circle>';
      })
      .join("");
  }

  function renderMonthlyChart(centerKey) {
    if (!elMonthlyChart) return;
    var series = buildMonthlySeries(centerKey, 6);
    if (series.length === 0) {
      elMonthlyChart.innerHTML = "<p>表示できるデータがありません。</p>";
      return;
    }

    var vals = [];
    series.forEach(function (it) {
      vals.push(it.income, it.expense, it.total, it.netAsset);
    });
    var minV = Math.min.apply(null, vals.concat([0, CHART_AXIS_MIN]));
    var maxV = Math.max.apply(null, vals.concat([0, CHART_AXIS_MAX]));
    var minY = Math.floor(minV / CHART_AXIS_STEP) * CHART_AXIS_STEP;
    var maxY = Math.ceil(maxV / CHART_AXIS_STEP) * CHART_AXIS_STEP;
    if (minY === maxY) {
      maxY += CHART_AXIS_STEP;
      minY -= CHART_AXIS_STEP;
    }

    var w = 960;
    var h = 300;
    var left = 56;
    var right = 20;
    var top = 12;
    var bottom = 52;
    var plotX = left;
    var plotY = top;
    var plotW = w - left - right;
    var plotH = h - top - bottom;
    var stepX = series.length > 1 ? plotW / (series.length - 1) : 0;

    var grid = "";
    for (var v = maxY; v >= minY; v -= CHART_AXIS_STEP) {
      var y = plotY + ((maxY - v) / (maxY - minY || 1)) * plotH;
      grid += '<line class="grid" x1="' + plotX + '" y1="' + y.toFixed(2) + '" x2="' + (plotX + plotW) + '" y2="' + y.toFixed(2) + '"></line>';
      grid +=
        '<text class="axis-label" x="' +
        (plotX - 8) +
        '" y="' +
        (y + 4).toFixed(2) +
        '" text-anchor="end">' +
        escapeHtml(fmtMan(v) + "万") +
        "</text>";
    }

    var monthLabels = "";
    for (var mi = 0; mi < series.length; mi++) {
      if (mi % 2 !== 0 && mi !== series.length - 1) continue;
      var lx = plotX + stepX * mi;
      monthLabels +=
        '<text class="month-label" x="' +
        lx.toFixed(2) +
        '" y="' +
        (plotY + plotH + 18) +
        '" text-anchor="middle">' +
        escapeHtml(series[mi].label) +
        "</text>";
    }

    var incomePath = pathFromSeries(series, plotX, plotY, plotW, plotH, minY, maxY, function (it) {
      return it.income;
    });
    var expensePath = pathFromSeries(series, plotX, plotY, plotW, plotH, minY, maxY, function (it) {
      return it.expense;
    });
    var totalPath = pathFromSeries(series, plotX, plotY, plotW, plotH, minY, maxY, function (it) {
      return it.total;
    });
    var netAssetPath = pathFromSeries(series, plotX, plotY, plotW, plotH, minY, maxY, function (it) {
      return it.netAsset;
    });

    var zeroY = plotY + ((maxY - 0) / (maxY - minY || 1)) * plotH;
    var zeroLine = "";
    if (zeroY >= plotY && zeroY <= plotY + plotH) {
      zeroLine =
        '<line x1="' +
        plotX +
        '" y1="' +
        zeroY.toFixed(2) +
        '" x2="' +
        (plotX + plotW) +
        '" y2="' +
        zeroY.toFixed(2) +
        '" stroke="' +
        "var(--muted)" +
        '" stroke-dasharray="4 3" stroke-width="1"></line>';
    }

    elMonthlyChart.innerHTML =
      '<svg viewBox="0 0 ' +
      w +
      " " +
      h +
      '" aria-hidden="true">' +
      grid +
      zeroLine +
      '<path class="line-expense" d="' +
      expensePath +
      '"></path>' +
      '<path class="line-income" d="' +
      incomePath +
      '"></path>' +
      '<path class="line-net" d="' +
      totalPath +
      '"></path>' +
      '<path class="line-net-asset" d="' +
      netAssetPath +
      '"></path>' +
      dotsFromSeries(series, "dot-expense", plotX, plotY, plotW, plotH, minY, maxY, function (it) {
        return it.expense;
      }) +
      dotsFromSeries(series, "dot-income", plotX, plotY, plotW, plotH, minY, maxY, function (it) {
        return it.income;
      }) +
      dotsFromSeries(series, "dot-net", plotX, plotY, plotW, plotH, minY, maxY, function (it) {
        return it.total;
      }) +
      dotsFromSeries(series, "dot-net-asset", plotX, plotY, plotW, plotH, minY, maxY, function (it) {
        return it.netAsset;
      }) +
      monthLabels +
      "</svg>" +
      '<div class="monthly-chart-legend">' +
      '<span class="legend-expense"><i></i>支出合計（引落）</span>' +
      '<span class="legend-income"><i></i>収入合計（入金）</span>' +
      '<span class="legend-net"><i></i>合計金額（累積残高）</span>' +
      '<span class="legend-net-asset"><i></i>純資産（累積残高 - 借入残高）</span>' +
      "</div>";
  }

  function renderSummary(mk, dim, mdata) {
    var totals = state.accounts.map(function (a) {
      var tw = 0;
      var td = 0;
      var end = parseNum(mdata.openings[a.id]);
      for (var day = 1; day <= dim; day++) {
        var pt = dayTotals(mdata, day);
        tw += pt[a.id].tw;
        td += pt[a.id].td;
        end += pt[a.id].td - pt[a.id].tw;
      }
      return { account: a, tw: tw, td: td, end: end };
    });

    var grandEnd = 0;
    totals.forEach(function (t) {
      grandEnd += t.end;
    });

    elSummary.innerHTML =
      totals
        .map(function (t) {
          return (
            '<div class="summary-card">' +
            "<h3>" +
            escapeHtml(t.account.name) +
            "</h3>" +
            '<p>引落合計 <span class="num">' +
            fmtNum(t.tw) +
            "</span></p>" +
            '<p>入金合計 <span class="num">' +
            fmtNum(t.td) +
            "</span></p>" +
            '<p>月末残高 <span class="num">' +
            fmtNum(t.end) +
            "</span></p>" +
            "</div>"
          );
        })
        .join("") +
      '<div class="summary-card summary-card--grand">' +
      "<h3>全口座合計（月末）</h3>" +
      '<p class="grand-num">' +
      fmtNum(grandEnd) +
      "</p>" +
      "</div>";
  }

  function totalWithdrawByKeyword(keyword) {
    var kw = String(keyword || "").trim();
    if (!kw) return 0;
    var total = 0;
    Object.keys(state.months || {}).forEach(function (key) {
      var mk = parseMonthKey(key);
      var dim = daysInMonth(mk.y, mk.m);
      var mdata = state.months[key];
      for (var day = 1; day <= dim; day++) {
        var val = mdata.days && mdata.days[String(day)];
        if (!val || !Array.isArray(val.lines)) continue;
        for (var li = 0; li < val.lines.length; li++) {
          var line = val.lines[li];
          state.accounts.forEach(function (a) {
            var c = line[a.id];
            if (!c) return;
            var note = String(c.note || "");
            if (note.indexOf(kw) >= 0) total += parseNum(c.w);
          });
        }
      }
    });
    return total;
  }

  function resolveDisplayLastDayInMonth(mk) {
    var now = new Date();
    var cy = now.getFullYear();
    var cm = now.getMonth() + 1;
    var cd = now.getDate();
    var dim = daysInMonth(mk.y, mk.m);
    if (mk.y === cy && mk.m === cm) return Math.min(cd, dim);
    if (mk.y < cy || (mk.y === cy && mk.m < cm)) return dim;
    return 0;
  }

  function totalWithdrawByKeywordUntil(keyword, maxSerial, maxDayInMaxMonth, minSerial) {
    var kw = String(keyword || "").trim();
    if (!kw) return 0;
    var total = 0;
    Object.keys(state.months || {}).forEach(function (key) {
      var serial = monthSerialFromKey(key);
      if (minSerial != null && serial < minSerial) return;
      if (serial > maxSerial) return;
      var mk = parseMonthKey(key);
      var dim = daysInMonth(mk.y, mk.m);
      var limitDay = serial === maxSerial ? Math.min(Math.max(0, maxDayInMaxMonth), dim) : dim;
      var mdata = state.months[key];
      for (var day = 1; day <= limitDay; day++) {
        var val = mdata.days && mdata.days[String(day)];
        if (!val || !Array.isArray(val.lines)) continue;
        for (var li = 0; li < val.lines.length; li++) {
          var line = val.lines[li];
          state.accounts.forEach(function (a) {
            var c = line[a.id];
            if (!c) return;
            var note = String(c.note || "");
            if (note.indexOf(kw) >= 0) total += parseNum(c.w);
          });
        }
      }
    });
    return total;
  }

  function renderLiabilitiesSummary(mk) {
    if (!elLiabilitiesGrid) return;
    if (ensureLiabilities(state)) {
      saveState(state);
    }
    var targetSerial = mk ? monthSerialFromKey(monthKey(mk.y, mk.m)) : null;
    var targetLastDay = mk ? resolveDisplayLastDayInMonth(mk) : 0;
    var sumOpening = 0;
    var sumPaid = 0;
    var sumRemain = 0;
    var html = state.liabilities
      .map(function (item) {
        var startMonth = normalizeMonthInput(item.startMonth);
        var startSerial = startMonth ? monthSerialFromKey(startMonth) : null;
        var isActive = targetSerial == null || startSerial == null || targetSerial >= startSerial;
        var paid =
          !isActive || targetSerial == null
            ? 0
            : totalWithdrawByKeywordUntil(item.keyword, targetSerial, targetLastDay, startSerial);
        var opening = isActive ? parseNum(item.opening) : 0;
        var remain = opening - paid;
        sumOpening += opening;
        sumPaid += paid;
        sumRemain += remain;
        return (
          '<div class="summary-card">' +
          "<h3>" +
          escapeHtml(item.name) +
          "</h3>" +
          '<p>初期残高 <span class="num">' +
          fmtNum(opening) +
          "</span></p>" +
          '<p>支払済み（引落累計） <span class="num">' +
          fmtNum(paid) +
          "</span></p>" +
          '<p>残高 <span class="num ' +
          (remain < 0 ? "num-neg" : "") +
          '">' +
          fmtNum(remain) +
          "</span></p>" +
          '<p>開始月 <span class="num">' +
          escapeHtml(startMonth || "未設定（全期間）") +
          "</span></p>" +
          '<p>キーワード <span class="num">' +
          escapeHtml(item.keyword || "-") +
          "</span></p>" +
          "</div>"
        );
      })
      .join("");
    html +=
      '<div class="summary-card summary-card--grand">' +
      "<h3>借入合計</h3>" +
      '<p>初期残高合計 <span class="num">' +
      fmtNum(sumOpening) +
      "</span></p>" +
      '<p>支払済み合計 <span class="num">' +
      fmtNum(sumPaid) +
      "</span></p>" +
      '<p>残高合計 <span class="num ' +
      (sumRemain < 0 ? "num-neg" : "") +
      '">' +
      fmtNum(sumRemain) +
      "</span></p>" +
      "</div>";
    elLiabilitiesGrid.innerHTML = html;
  }

  function openAccountDialog() {
    elAccountEdit.innerHTML = "";
    for (var i = 0; i < MAX_ACCOUNTS; i++) {
      var a = state.accounts[i];
      var li = document.createElement("li");
      var inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = i < 3 ? "口座名（例：SMBC信託銀行）" : "口座名（空行は保存時に無視）";
      inp.value = a ? a.name : "";
      li.appendChild(inp);
      elAccountEdit.appendChild(li);
    }
    openDialogSafe(dlg);
  }

  function populateFixedAccountOptions() {
    if (!elFixedAccount) return;
    var prev = elFixedAccount.value;
    elFixedAccount.innerHTML = state.accounts
      .map(function (a) {
        return '<option value="' + escapeHtml(a.id) + '">' + escapeHtml(a.name) + "</option>";
      })
      .join("");
    var hasPrev = state.accounts.some(function (a) {
      return a.id === prev;
    });
    if (hasPrev) elFixedAccount.value = prev;
  }

  function openFixedBatchDialog() {
    if (!dlgFixedBatch) {
      alert("固定費入力画面の読み込みに失敗しました。ページを再読み込みしてください。");
      return;
    }
    populateFixedAccountOptions();
    if (!elFixedStartMonth.value) elFixedStartMonth.value = currentKey;
    if (!elFixedEndMonth.value) elFixedEndMonth.value = currentKey;
    if (!elFixedDay.value) elFixedDay.value = "1";
    if (!elFixedKind.value) elFixedKind.value = "w";
    openDialogSafe(dlgFixedBatch);
  }

  function buildFixedBatchKey(payload) {
    return [
      payload.accountId,
      payload.kind,
      payload.amount,
      payload.day,
      payload.startKey,
      payload.endKey,
      payload.note || "",
    ].join("|");
  }

  function applyFixedBatchFromDialog() {
    var accountId = elFixedAccount.value;
    var kind = elFixedKind.value;
    var amount = parseNum(elFixedAmount.value);
    var day = parseInt(elFixedDay.value, 10);
    var startKey = normalizeMonthInput(elFixedStartMonth.value);
    var endKey = normalizeMonthInput(elFixedEndMonth.value);
    var note = (elFixedNote.value || "").trim();

    if (!accountId) {
      alert("銀行名を選んでください。");
      return;
    }
    if (kind !== "w" && kind !== "d") {
      alert("種別は「引落」か「入金」を選んでください。");
      return;
    }
    if (!(amount > 0)) {
      alert("金額は1以上で入力してください。");
      return;
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      alert("日にちは1〜31で入力してください。");
      return;
    }
    if (!startKey || !endKey) {
      alert("開始月と終了月を選んでください。");
      return;
    }

    var s = monthSerialFromKey(startKey);
    var e = monthSerialFromKey(endKey);
    if (s > e) {
      alert("「いつから」は「いつまで」より前の月にしてください。");
      return;
    }

    var fixedKey = buildFixedBatchKey({
      accountId: accountId,
      kind: kind,
      amount: amount,
      day: day,
      startKey: startKey,
      endKey: endKey,
      note: note,
    });
    var added = 0;
    var skipped = 0;

    for (var serial = s; serial <= e; serial++) {
      var y = Math.floor(serial / 12);
      var m = (serial % 12) + 1;
      var key = monthKey(y, m);
      var mdata = ensureMonth(state, key);
      var targetDay = Math.min(day, daysInMonth(y, m));
      var ds = ensureDayStruct(mdata, targetDay);
      var exists = ds.lines.some(function (line) {
        return line && line.__fixedBatchKey === fixedKey;
      });
      if (exists) {
        skipped++;
        continue;
      }

      var nl = {};
      state.accounts.forEach(function (a) {
        nl[a.id] = emptyCell();
      });
      nl[accountId] = {
        w: kind === "w" ? amount : 0,
        d: kind === "d" ? amount : 0,
        note: note,
      };
      nl.__fixedBatchKey = fixedKey;
      ds.lines.push(nl);
      added++;
    }

    if (added > 0) {
      saveState(state);
      render();
    }
    closeDialogSafe(dlgFixedBatch);
    alert(
      "固定費を一括入力しました。\n追加: " +
        added +
        "件\n重複スキップ: " +
        skipped +
        "件\n※ 31日指定で日数が足りない月は月末日に入力しています。"
    );
  }

  function saveAccountsFromDialog() {
    var inputs = elAccountEdit.querySelectorAll("input[type=text]");
    var names = [];
    inputs.forEach(function (inp) {
      var name = inp.value.trim();
      if (name) names.push(name);
    });
    if (names.length === 0) {
      alert("口座は1つ以上必要です。");
      return;
    }
    var oldAcc = state.accounts.slice();
    var next = names.map(function (name, j) {
      var reuse = oldAcc[j];
      return {
        id: reuse ? reuse.id : "a_" + Date.now() + "_" + j + "_" + Math.random().toString(36).slice(2, 8),
        name: name,
      };
    });

    Object.keys(state.months).forEach(function (key) {
      var m = state.months[key];
      var newOpen = {};
      var newDays = {};
      next.forEach(function (a, j) {
        var oid = oldAcc[j] ? oldAcc[j].id : null;
        newOpen[a.id] = oid != null && m.openings[oid] != null ? m.openings[oid] : 0;
      });
      Object.keys(m.days).forEach(function (d) {
        var oldDay = m.days[d];
        var lines = [];
        if (isV2Day(oldDay)) {
          lines = oldDay.lines.map(function (line) {
            var nl = {};
            next.forEach(function (a, j) {
              var oid = oldAcc[j] ? oldAcc[j].id : null;
              if (oid && line[oid]) {
                nl[a.id] = {
                  w: line[oid].w || 0,
                  d: line[oid].d || 0,
                  note: line[oid].note || "",
                };
              } else {
                nl[a.id] = emptyCell();
              }
            });
            Object.keys(line).forEach(function (k) {
              if (k.indexOf("__") === 0) nl[k] = line[k];
            });
            return nl;
          });
        } else {
          var line0 = {};
          next.forEach(function (a, j) {
            var oid = oldAcc[j] ? oldAcc[j].id : null;
            var o = oid && oldDay[oid] ? oldDay[oid] : null;
            line0[a.id] =
              o && typeof o === "object"
                ? { w: o.w || 0, d: o.d || 0, note: o.note || "" }
                : emptyCell();
          });
          lines = [line0];
        }
        if (lines.length === 0) {
          var L = {};
          next.forEach(function (a) {
            L[a.id] = emptyCell();
          });
          lines = [L];
        }
        newDays[d] = { lines: lines };
      });
      m.openings = newOpen;
      m.days = newDays;
    });

    state.accounts = next;
    populateFixedAccountOptions();
    closeDialogSafe(dlg);
    saveState(state);
    render();
  }

  function openLiabilitiesDialog() {
    if (!dlgLiabilities || !elLiabilityEditList) return;
    ensureLiabilities(state);
    elLiabilityEditList.innerHTML = "";
    state.liabilities.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "liability-edit-row";
      row.innerHTML =
        '<label>項目名<input type="text" class="js-li-name" value="' +
        escapeHtml(item.name) +
        '" /></label>' +
        '<label>項目キーワード<input type="text" class="js-li-keyword" value="' +
        escapeHtml(item.keyword || item.name) +
        '" /></label>' +
        '<label>初期残高<input type="number" inputmode="numeric" step="1" class="js-li-opening" value="' +
        escapeHtml(String(parseNum(item.opening))) +
        '" /></label>' +
        '<label>開始月<input type="month" class="js-li-start-month" value="' +
        escapeHtml(normalizeMonthInput(item.startMonth)) +
        '" /></label>';
      elLiabilityEditList.appendChild(row);
    });
    openDialogSafe(dlgLiabilities);
  }

  function saveLiabilitiesFromDialog() {
    if (!elLiabilityEditList) return;
    var rows = elLiabilityEditList.querySelectorAll(".liability-edit-row");
    var next = [];
    rows.forEach(function (row, i) {
      var name = (row.querySelector(".js-li-name") || {}).value || "";
      var keyword = (row.querySelector(".js-li-keyword") || {}).value || "";
      var opening = (row.querySelector(".js-li-opening") || {}).value || "0";
      var startMonth = normalizeMonthInput((row.querySelector(".js-li-start-month") || {}).value || "");
      name = name.trim();
      keyword = keyword.trim();
      if (!name) return;
      next.push({
        id: state.liabilities[i] ? state.liabilities[i].id : "l_" + Date.now() + "_" + i,
        name: name,
        keyword: keyword || name,
        opening: parseNum(opening),
        startMonth: startMonth,
      });
    });
    if (next.length === 0) {
      alert("1件以上の項目名を入力してください。");
      return;
    }
    state.liabilities = next;
    saveState(state);
    closeDialogSafe(dlgLiabilities);
    var mk = parseMonthKey(currentKey);
    renderLiabilitiesSummary(mk);
  }

  elMonth.addEventListener("change", function () {
    currentKey = elMonth.value;
    if (!currentKey) return;
    render();
  });

  document.getElementById("btn-prev").addEventListener("click", function () {
    var mk = parseMonthKey(currentKey);
    var d = new Date(mk.y, mk.m - 2, 1);
    currentKey = monthKey(d.getFullYear(), d.getMonth() + 1);
    setMonthInputFromKey(currentKey);
    render();
  });

  document.getElementById("btn-next").addEventListener("click", function () {
    var mk = parseMonthKey(currentKey);
    var d = new Date(mk.y, mk.m, 1);
    currentKey = monthKey(d.getFullYear(), d.getMonth() + 1);
    setMonthInputFromKey(currentKey);
    render();
  });

  document.getElementById("btn-today").addEventListener("click", function () {
    var n = new Date();
    currentKey = monthKey(n.getFullYear(), n.getMonth() + 1);
    setMonthInputFromKey(currentKey);
    render();
  });

  safeBind("btn-accounts", "click", openAccountDialog);
  safeBind("btn-fixed-batch", "click", openFixedBatchDialog);
  safeBind("btn-liabilities", "click", openLiabilitiesDialog);
  safeBind("dlg-cancel", "click", function () {
    closeDialogSafe(dlg);
  });
  safeBind("dlg-save", "click", saveAccountsFromDialog);
  safeBind("fixed-cancel", "click", function () {
    closeDialogSafe(dlgFixedBatch);
  });
  safeBind("fixed-apply", "click", applyFixedBatchFromDialog);
  safeBind("liability-cancel", "click", function () {
    closeDialogSafe(dlgLiabilities);
  });
  safeBind("liability-save", "click", saveLiabilitiesFromDialog);

  safeBind("btn-drive-push", "click", function () {
    performDrivePush(function (err) {
      if (err) alert("Driveへ保存できませんでした。\n" + err.message);
    });
  });
  safeBind("btn-drive-pull", "click", function () {
    performDrivePull({}, function (err) {
      if (err) alert("Driveから読み込めませんでした。\n" + err.message);
    });
  });
  safeBind("btn-drive-settings", "click", openDriveSettingsDialog);
  safeBind("dlg-drive-close", "click", function () {
    closeDialogSafe(document.getElementById("dlg-drive"));
  });
  safeBind("dlg-drive-save-settings", "click", saveDriveSettingsFromDialog);
  safeBind("drive-reset-file-id", "click", function () {
    if (
      !confirm(
        "Drive側で作成済みのファイルIDをこのブラウザから忘れます。\n次に保存すると新しいファイルが増える可能性があります。\n（Drive上で古い重複を手で削除できます）\n続けますか？"
      )
    ) {
      return;
    }
    localStorage.removeItem(LS_DRIVE_FILE_ID);
    updateDriveStatusLabel("DriveファイルIDをリセットしました");
  });

  document.getElementById("btn-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cash-ledger-" + currentKey + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  safeBind("btn-csv-export", "click", openCsvExportDialog);
  safeBind("csv-cancel", "click", function () {
    closeDialogSafe(document.getElementById("dlg-csv-export"));
  });
  safeBind("csv-download", "click", downloadCsvExportFile);

  document.getElementById("btn-import").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", function (ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        ingestWholeLedgerPayload(JSON.parse(reader.result));
      } catch (e) {
        alert("読み込みに失敗しました: " + e.message);
      }
      ev.target.value = "";
    };
    reader.readAsText(f, "UTF-8");
  });

  if (elThemeAuto) elThemeAuto.addEventListener("click", function () { setThemeTab("auto"); });
  if (elThemeDay) elThemeDay.addEventListener("click", function () { setThemeTab("day"); });
  if (elThemeNight) elThemeNight.addEventListener("click", function () { setThemeTab("night"); });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") applyTheme();
  });
  setInterval(function () {
    if ((state.ui || {}).themeTab === "auto") applyTheme();
  }, 60 * 1000);

  setMonthInputFromKey(currentKey);
  populateFixedAccountOptions();
  applyTheme();
  render();
  maybeDriveStartupPull();
})();
