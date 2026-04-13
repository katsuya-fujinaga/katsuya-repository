(function () {
  "use strict";

  var STORAGE_KEY = "hitobiji-cash-ledger-v1";
  var MAX_ACCOUNTS = 8;

  var defaultAccountNames = ["SMBC信託銀行", "SBI銀行", "現金"];

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

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
            ensureUi(o);
            if (missingUi) saveState(o);
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
  var elSummary = document.getElementById("summary-grid");
  var dlg = document.getElementById("dlg-accounts");
  var elAccountEdit = document.getElementById("account-edit-list");
  var elThemeAuto = document.getElementById("theme-tab-auto");
  var elThemeDay = document.getElementById("theme-tab-day");
  var elThemeNight = document.getElementById("theme-tab-night");

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

  function applyTheme() {
    ensureUi(state);
    var t = resolveTheme();
    document.body.classList.toggle("theme-night", t === "night");

    var tab = state.ui.themeTab || "auto";
    if (elThemeAuto) elThemeAuto.setAttribute("aria-selected", tab === "auto" ? "true" : "false");
    if (elThemeDay) elThemeDay.setAttribute("aria-selected", tab === "day" ? "true" : "false");
    if (elThemeNight) elThemeNight.setAttribute("aria-selected", tab === "night" ? "true" : "false");
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

  function parseNum(v) {
    if (v === "" || v == null) return 0;
    var n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function fmtNum(n) {
    if (!Number.isFinite(n)) return "";
    return Math.round(n).toLocaleString("ja-JP");
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

  function renderOpeningsBar(mk, mdata) {
    if (!elOpeningsBar) return;
    var now = new Date();
    var cy = now.getFullYear();
    var cm = now.getMonth() + 1;
    var cd = now.getDate();
    var dim = daysInMonth(mk.y, mk.m);
    var prev = new Date(mk.y, mk.m - 2, 1);
    var pkey = monthKey(prev.getFullYear(), prev.getMonth() + 1);
    var hasPrev = !!state.months[pkey];
    var lastDay;
    var title;
    var note;
    if (mk.y === cy && mk.m === cm) {
      lastDay = Math.min(cd, dim);
      title = "今日の残高（" + mk.m + "月" + lastDay + "日現在）";
      note =
        (hasPrev
          ? "「" +
            prev.getFullYear() +
            "年" +
            (prev.getMonth() + 1) +
            "月」末日までの金額を月初に自動でつないだうえ、"
          : "前の月のデータがないため月初は0からで、") +
        "今月1日〜" +
        lastDay +
        "日までに入力した引落・入金を足し引きした数字です。";
    } else if (mk.y < cy || (mk.y === cy && mk.m < cm)) {
      lastDay = dim;
      title = "この月の残高";
      note =
        "（" +
        mk.m +
        "月末時点）前月からの自動繰越と、この月の全日の取引を反映しています。";
    } else {
      lastDay = 0;
      title = "この月の残高（月初）";
      note = hasPrev
        ? "まだこの月は来ていません。前月末日までが自動でつながった「はじめの残高」だけを表示しています（日付の取引は含みません）。"
        : "前の月のデータがないため月初は0です（当月前のため取引日はまだありません）。";
    }
    var balMap = balancesThroughDay(mdata, mk.y, mk.m, lastDay);
    var parts = [];
    parts.push(
      "<p class=\"openings-bar-kicker\">" + escapeHtml(title) + "</p>" + '<p class="openings-bar-note">' + note + "</p>"
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
    for (var day = 1; day <= dim; day++) {
      var ds = ensureDayStruct(mdata, day);
      var nLines = ds.lines.length;
      var dt = new Date(mk.y, mk.m - 1, day);
      var dow = WEEKDAYS[dt.getDay()];

      for (var li = 0; li < nLines; li++) {
        body += '<tr class="day-row' + (rowIndex % 2 === 0 ? " day-row--alt" : "") + '" data-day="' + day + '">';
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
    if (!dlg.open) dlg.showModal();
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
    dlg.close();
    saveState(state);
    render();
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

  document.getElementById("btn-accounts").addEventListener("click", openAccountDialog);
  document.getElementById("dlg-cancel").addEventListener("click", function () {
    dlg.close();
  });
  document.getElementById("dlg-save").addEventListener("click", saveAccountsFromDialog);

  document.getElementById("btn-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cash-ledger-" + currentKey + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("btn-import").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", function (ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var o = JSON.parse(reader.result);
        if (!o || !Array.isArray(o.accounts)) throw new Error("形式が違います");
        if (o.version == null) o.version = 1;
        migrateV1ToV2(o);
        if (o.version < 2) throw new Error("データを認識できません");
        state = ensureUi(o);
        saveState(state);
        applyTheme();
        render();
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
  applyTheme();
  render();
})();
