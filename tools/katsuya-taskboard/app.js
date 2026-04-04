/** LP用コピー：hitobiji 本体と localStorage を分離 */
const STORAGE_KEY = "katsuya-board-lp-clean-sight-v1";

const COL_ICON_WAIT = `<svg class="col-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 2v4M16 2v4M4 8h16M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="14" r="1.5" fill="currentColor"/></svg>`;
const COL_ICON_DOING = `<svg class="col-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const COL_ICON_DONE = `<svg class="col-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const COL_DEFS = [
  { id: "wait", title: "待機", dot: "var(--c-wait)", icon: COL_ICON_WAIT },
  { id: "doing", title: "進行中", dot: "var(--c-doing)", icon: COL_ICON_DOING },
  { id: "done", title: "完了", dot: "var(--c-done)", icon: COL_ICON_DONE },
];

const WD = ["日", "月", "火", "水", "木", "金", "土"];

/** プロモの日付は年を入力させず、内部ではこの年で保存 */
const PROMO_DATE_YEAR = 2026;

const PROMO_CASE_OPTIONS = [
  "育脳子育てカウンセラー",
  "やさしく売れる占い師",
  "星使いカウンセラー",
  "未来覚醒カウンセラー",
  "愛され手相カウンセラー",
  "じぶんコンテンツ",
];

function isBusinessTask(t) {
  return t && (!t.kind || t.kind === "business");
}

function isScheduleTask(t) {
  return t && t.kind === "schedule";
}

function isPromotionTask(t) {
  return t && t.kind === "promotion";
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toYMD(y, m0, d) {
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** 月日のみ（4/18, 04-18, 4／18 等）→ YYYY-MM-DD（PROMO_DATE_YEAR）。無効なら "" */
function parseMonthDayToYmd(raw) {
  if (!raw || typeof raw !== "string") return "";
  const s = raw
    .trim()
    .replace(/[．･]/g, ".")
    .replace(/[／]/g, "/")
    .replace(/[－ー−]/g, "-");
  const m = /^(\d{1,2})\s*[./-]\s*(\d{1,2})$/.exec(s);
  if (!m) return "";
  const mo = parseInt(m[1], 10);
  const day = parseInt(m[2], 10);
  if (mo < 1 || mo > 12 || day < 1 || day > 31) return "";
  const dt = new Date(PROMO_DATE_YEAR, mo - 1, day);
  if (dt.getFullYear() !== PROMO_DATE_YEAR || dt.getMonth() !== mo - 1 || dt.getDate() !== day) return "";
  return formatLocalDate(dt);
}

/** ISO日付 → 表示用 月/日（年なし） */
function ymdToMonthDayDisplay(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function normalizeDueRangePair(startIso, endIso) {
  let due = startIso || "";
  let dueEnd = endIso || "";
  if (!due && dueEnd) due = dueEnd;
  if (due && dueEnd && dueEnd < due) dueEnd = "";
  if (due && dueEnd && dueEnd <= due) dueEnd = "";
  return { due, dueEnd };
}

function clearExtraPromoCaseOptions(selectEl) {
  if (!selectEl) return;
  selectEl.querySelectorAll("option[data-promo-extra]").forEach((n) => n.remove());
}

function setPromoCaseSelectValue(selectEl, value) {
  if (!selectEl) return;
  clearExtraPromoCaseOptions(selectEl);
  const v = (value || "").trim();
  if (v && !PROMO_CASE_OPTIONS.includes(v)) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = `${v}（一覧外）`;
    o.dataset.promoExtra = "1";
    selectEl.appendChild(o);
  }
  selectEl.value = v || "";
}

function emptyState() {
  const now = new Date();
  return {
    ui: {
      calYear: now.getFullYear(),
      calMonth: now.getMonth(),
      selectedDate: formatLocalDate(now),
    },
    columns: {
      wait: [],
      doing: [],
      done: [],
    },
    tasks: {},
  };
}

function migrateState(data) {
  if (!data.tasks) data.tasks = {};
  for (const t of Object.values(data.tasks)) {
    if (t.startTime === undefined) t.startTime = "";
    if (t.endTime === undefined) t.endTime = "";
    if (t.kind === undefined) t.kind = "business";
    if (t.dueEnd === undefined) t.dueEnd = "";
  }
  for (const col of COL_DEFS) {
    data.columns[col.id] = (data.columns[col.id] || []).filter((id) => {
      const task = data.tasks[id];
      return task && isBusinessTask(task);
    });
  }
  const now = new Date();
  if (!data.ui) {
    data.ui = {
      calYear: now.getFullYear(),
      calMonth: now.getMonth(),
      selectedDate: formatLocalDate(now),
    };
  }
  if (!data.ui.selectedDate) data.ui.selectedDate = formatLocalDate(now);
  return data;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    if (!data.columns || !data.tasks) return emptyState();
    return migrateState(data);
  } catch {
    return emptyState();
  }
}

function saveState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

let state = loadState();
let editingId = null;
let draggedId = null;

const boardEl = document.getElementById("board");
const quickInput = document.getElementById("quick-input");
const quickAdd = document.getElementById("quick-add");
const statTotal = document.getElementById("stat-total");
const statFocus = document.getElementById("stat-focus");
const statDoing = document.getElementById("stat-doing");
const ringPct = document.getElementById("ring-pct");
const ringProgress = document.getElementById("ring-progress");
const modal = document.getElementById("modal");
const editTitle = document.getElementById("edit-title");
const editNote = document.getElementById("edit-note");
const editProject = document.getElementById("edit-project");
const editDue = document.getElementById("edit-due");
const editDueEnd = document.getElementById("edit-due-end");
const editStart = document.getElementById("edit-start");
const editEnd = document.getElementById("edit-end");
const editFocus = document.getElementById("edit-focus");
const editFocusWrap = document.getElementById("edit-focus-wrap");
const editKindBusiness = document.getElementById("edit-kind-business");
const editKindSchedule = document.getElementById("edit-kind-schedule");
const editKindPromotion = document.getElementById("edit-kind-promotion");
const quickPromoExtra = document.getElementById("quick-promo-extra");
const quickPromoCase = document.getElementById("quick-promo-case");
const quickPromoStartMd = document.getElementById("quick-promo-start-md");
const quickPromoEndMd = document.getElementById("quick-promo-end-md");
const editPromoOnly = document.getElementById("edit-promo-only");
const editPromoCase = document.getElementById("edit-promo-case");
const editPromoStartMd = document.getElementById("edit-promo-start-md");
const editPromoEndMd = document.getElementById("edit-promo-end-md");
const editStandardProjectDates = document.getElementById("edit-standard-project-dates");
const editDateHint = document.getElementById("edit-date-hint");
const promoListEl = document.getElementById("promo-list");
const promoEmptyEl = document.getElementById("promo-empty");
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");
const btnExport = document.getElementById("btn-export");
const btnImport = document.getElementById("btn-import");
const importFile = document.getElementById("import-file");

const calGrid = document.getElementById("cal-grid");
const calMonthLabel = document.getElementById("cal-month-label");
const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");
const dayLabelText = document.getElementById("day-label-text");
const daySub = document.getElementById("day-sub");
const dayHint = document.getElementById("day-hint");
const timelineEl = document.getElementById("timeline");
const btnToday = document.getElementById("btn-today");

const RING_LEN = 326.72;

function businessTaskList() {
  return Object.values(state.tasks).filter(isBusinessTask);
}

function taskCount() {
  return businessTaskList().length;
}

function focusCount() {
  return businessTaskList().filter((t) => t.focus).length;
}

function doingCount() {
  return state.columns.doing.length;
}

function completionRate() {
  const total = taskCount();
  if (total === 0) return 0;
  const done = state.columns.done.length;
  return Math.round((done / total) * 100);
}

function updateStats() {
  statTotal.textContent = String(taskCount());
  statFocus.textContent = String(focusCount());
  statDoing.textContent = String(doingCount());
  const pct = completionRate();
  ringPct.textContent = `${pct}%`;
  const offset = RING_LEN - (RING_LEN * pct) / 100;
  ringProgress.style.strokeDashoffset = String(offset);
}

function formatDue(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** 期間の終了日（単日なら開始日と同じ） */
function taskRangeEnd(task) {
  if (!task.due) return "";
  if (task.dueEnd && task.dueEnd > task.due) return task.dueEnd;
  return task.due;
}

function taskCoversDate(task, ymd) {
  if (!task.due) return false;
  const end = taskRangeEnd(task);
  return ymd >= task.due && ymd <= end;
}

function isMultiDayRange(task) {
  return !!(task.due && task.dueEnd && task.dueEnd > task.due);
}

function formatDueRange(task) {
  if (!task.due) return "";
  if (!isMultiDayRange(task)) return formatDue(task.due);
  return `${formatDue(task.due)}〜${formatDue(task.dueEnd)}`;
}

function timeToMinutes(t) {
  if (!t || typeof t !== "string") return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function formatTimeRange(task) {
  const s = task.startTime?.trim();
  const e = task.endTime?.trim();
  if (s && e) return `${s}–${e}`;
  if (s) return s;
  return "";
}

function columnOfTask(taskId) {
  for (const col of COL_DEFS) {
    if (state.columns[col.id].includes(taskId)) return col;
  }
  return null;
}

function buildCalendarCells(year, month) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const cells = [];
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  const prevDim = new Date(prevYear, prevMonth + 1, 0).getDate();
  for (let i = 0; i < startDow; i++) {
    const day = prevDim - startDow + i + 1;
    cells.push({ y: prevYear, m: prevMonth, d: day, muted: true });
  }
  for (let d = 1; d <= dim; d++) {
    cells.push({ y: year, m: month, d, muted: false });
  }
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }
  let nd = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ y: nextYear, m: nextMonth, d: nd++, muted: true });
  }
  return cells;
}

function countTasksOnDate(ymd, filterKind) {
  let n = 0;
  for (const t of Object.values(state.tasks)) {
    if (!taskCoversDate(t, ymd)) continue;
    if (filterKind === "business" && !isBusinessTask(t)) continue;
    if (filterKind === "schedule" && !isScheduleTask(t)) continue;
    if (filterKind === "promotion" && !isPromotionTask(t)) continue;
    n++;
  }
  return n;
}

function renderCalendar() {
  const { calYear, calMonth } = state.ui;
  calMonthLabel.textContent = `${calYear}年 ${calMonth + 1}月`;
  calGrid.innerHTML = "";
  const cells = buildCalendarCells(calYear, calMonth);
  const todayStr = formatLocalDate(new Date());
  const selected = state.ui.selectedDate;

  for (const c of cells) {
    const ymd = toYMD(c.y, c.m, c.d);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-cell" + (c.muted ? " muted" : "");
    if (ymd === todayStr) btn.classList.add("today");
    if (ymd === selected) btn.classList.add("selected");
    const daySpan = document.createElement("span");
    daySpan.textContent = String(c.d);
    btn.appendChild(daySpan);
    const biz = countTasksOnDate(ymd, "business");
    const prm = countTasksOnDate(ymd, "promotion");
    const sch = countTasksOnDate(ymd, "schedule");
    if (biz > 0 || prm > 0 || sch > 0) {
      const wrap = document.createElement("span");
      wrap.className = "cal-cell-badges";
      if (biz > 0) {
        const b = document.createElement("span");
        b.className = "cal-badge cal-badge--biz";
        b.textContent = `B${biz}`;
        b.title = `ビジネス ${biz}件`;
        wrap.appendChild(b);
      }
      if (prm > 0) {
        const p = document.createElement("span");
        p.className = "cal-badge cal-badge--promo";
        p.textContent = `P${prm}`;
        p.title = `プロモ ${prm}件`;
        wrap.appendChild(p);
      }
      if (sch > 0) {
        const s = document.createElement("span");
        s.className = "cal-badge cal-badge--sch";
        s.textContent = `予${sch}`;
        s.title = `予定 ${sch}件`;
        wrap.appendChild(s);
      }
      btn.appendChild(wrap);
    }
    btn.addEventListener("click", () => {
      if (c.muted) {
        state.ui.calYear = c.y;
        state.ui.calMonth = c.m;
      }
      state.ui.selectedDate = ymd;
      saveState(state);
      renderAll();
    });
    calGrid.appendChild(btn);
  }
}

function formatDayTitle(ymd) {
  const [y, mo, d] = ymd.split("-").map(Number);
  const dt = new Date(y, mo - 1, d);
  if (Number.isNaN(dt.getTime())) return ymd;
  return `${mo}月${d}日（${WD[dt.getDay()]}）`;
}

function tasksForSelectedDate() {
  const sel = state.ui.selectedDate;
  return Object.values(state.tasks).filter((t) => taskCoversDate(t, sel));
}

function splitTimeBuckets(list, sel) {
  const withTime = [];
  const noTime = [];
  const periodMid = [];
  for (const t of list) {
    const mins = timeToMinutes(t.startTime);
    const onFirstDay = t.due === sel;
    const mid = isMultiDayRange(t) && t.due !== sel && taskCoversDate(t, sel);
    if (mins != null && onFirstDay) withTime.push(t);
    else if (mid) periodMid.push(t);
    else noTime.push(t);
  }
  withTime.sort((a, b) => (timeToMinutes(a.startTime) ?? 0) - (timeToMinutes(b.startTime) ?? 0));
  return { withTime, noTime, periodMid };
}

function renderTimeline() {
  const sel = state.ui.selectedDate;
  const todayStr = formatLocalDate(new Date());
  if (dayLabelText) dayLabelText.textContent = formatDayTitle(sel);
  daySub.textContent =
    sel === todayStr ? "今日（ビジネス / プロモ / 予定）" : "この日（ビジネス / プロモ / 予定）";

  const list = tasksForSelectedDate();
  timelineEl.innerHTML = "";

  if (list.length === 0) {
    dayHint.hidden = false;
    return;
  }
  dayHint.hidden = true;

  const bizList = list.filter(isBusinessTask);
  const promoList = list.filter(isPromotionTask);
  const schList = list.filter(isScheduleTask);
  const bizBuckets = splitTimeBuckets(bizList, sel);
  const promoBuckets = splitTimeBuckets(promoList, sel);
  const schBuckets = splitTimeBuckets(schList, sel);

  function appendSection(title, extraClass) {
    const h = document.createElement("p");
    h.className = "tl-section-title" + (extraClass ? ` ${extraClass}` : "");
    h.textContent = title;
    timelineEl.appendChild(h);
  }

  if (bizList.length) {
    appendSection("ビジネスタスク");
    if (bizBuckets.withTime.length) {
      appendSection("時刻あり");
      for (const task of bizBuckets.withTime) {
        timelineEl.appendChild(renderTimelineRow(task, false, "biz"));
      }
    }
    if (bizBuckets.periodMid.length) {
      appendSection("長期予定・期間中");
      for (const task of bizBuckets.periodMid) {
        timelineEl.appendChild(renderTimelineRow(task, true, "biz"));
      }
    }
    if (bizBuckets.noTime.length) {
      appendSection("終日・時間なし");
      for (const task of bizBuckets.noTime) {
        timelineEl.appendChild(renderTimelineRow(task, true, "biz"));
      }
    }
  }

  if (promoList.length) {
    appendSection("プロモーション（並行OK）", "tl-section-promo");
    if (promoBuckets.withTime.length) {
      appendSection("時刻あり");
      for (const task of promoBuckets.withTime) {
        timelineEl.appendChild(renderTimelineRow(task, false, "promo"));
      }
    }
    if (promoBuckets.periodMid.length) {
      appendSection("長期・期間中");
      for (const task of promoBuckets.periodMid) {
        timelineEl.appendChild(renderTimelineRow(task, true, "promo"));
      }
    }
    if (promoBuckets.noTime.length) {
      appendSection("終日・時間なし");
      for (const task of promoBuckets.noTime) {
        timelineEl.appendChild(renderTimelineRow(task, true, "promo"));
      }
    }
  }

  if (schList.length) {
    appendSection("予定（仕事・外出）", "tl-section-schedule");
    if (schBuckets.withTime.length) {
      appendSection("時刻あり");
      for (const task of schBuckets.withTime) {
        timelineEl.appendChild(renderTimelineRow(task, false, "sch"));
      }
    }
    if (schBuckets.periodMid.length) {
      appendSection("長期予定・期間中");
      for (const task of schBuckets.periodMid) {
        timelineEl.appendChild(renderTimelineRow(task, true, "sch"));
      }
    }
    if (schBuckets.noTime.length) {
      appendSection("終日・時間なし");
      for (const task of schBuckets.noTime) {
        timelineEl.appendChild(renderTimelineRow(task, true, "sch"));
      }
    }
  }
}

/** @param {"biz"|"sch"|"promo"} tlKind */
function renderTimelineRow(task, noTime, tlKind) {
  const sel = state.ui.selectedDate;
  const periodMid = isMultiDayRange(task) && task.due !== sel && taskCoversDate(task, sel);

  const row = document.createElement("div");
  row.className = "tl-row";
  const timeEl = document.createElement("div");
  timeEl.className = "tl-time" + (noTime || periodMid ? " muted-time" : "");
  if (periodMid) {
    timeEl.textContent = "期間";
  } else if (noTime) {
    timeEl.textContent = "—";
  } else {
    const tr = formatTimeRange(task);
    timeEl.textContent = tr || "—";
  }

  const block = document.createElement("div");
  let blockExtra = "";
  if (tlKind === "sch") blockExtra = " tl-block--schedule";
  if (tlKind === "promo") blockExtra = " tl-block--promo";
  block.className = "tl-block" + blockExtra;
  block.innerHTML = `<p class="tl-block-title"></p><div class="tl-block-meta"></div>`;
  block.querySelector(".tl-block-title").textContent = task.title || "（無題）";
  const meta = block.querySelector(".tl-block-meta");
  if (isMultiDayRange(task)) {
    const p = document.createElement("span");
    p.className = "pill pill-range";
    p.textContent = formatDueRange(task);
    meta.appendChild(p);
  }
  if (tlKind === "sch") {
    const p = document.createElement("span");
    p.className = "pill pill-schedule";
    p.textContent = "予定";
    meta.appendChild(p);
  } else if (tlKind === "promo") {
    const p = document.createElement("span");
    p.className = "pill pill-promo";
    p.textContent = "プロモ";
    meta.appendChild(p);
  } else {
    const col = columnOfTask(task.id);
    if (col) {
      const p = document.createElement("span");
      p.className = "pill";
      p.textContent = col.title;
      meta.appendChild(p);
    }
  }
  if (task.project) {
    const p = document.createElement("span");
    p.className = "pill";
    p.textContent = task.project;
    meta.appendChild(p);
  }
  if (tlKind === "biz" && task.focus) {
    const p = document.createElement("span");
    p.className = "pill focus";
    p.textContent = "焦点";
    meta.appendChild(p);
  }
  block.addEventListener("click", () => openEdit(task.id));

  row.appendChild(timeEl);
  row.appendChild(block);
  return row;
}

function renderCard(task) {
  const el = document.createElement("article");
  el.className = "task-card task-card--business" + (task.focus ? " focus" : "");
  el.draggable = true;
  el.dataset.taskId = task.id;
  el.innerHTML = `
    <h3 class="task-title"></h3>
    <div class="task-meta"></div>
  `;
  el.querySelector(".task-title").textContent = task.title || "（無題）";
  const meta = el.querySelector(".task-meta");
  const tr = formatTimeRange(task);
  if (tr && task.due) {
    const tm = document.createElement("span");
    tm.className = "pill time-pill";
    tm.textContent = tr;
    meta.appendChild(tm);
  }
  if (task.project) {
    const p = document.createElement("span");
    p.className = "pill";
    p.textContent = task.project;
    meta.appendChild(p);
  }
  if (task.due) {
    const d = document.createElement("span");
    d.className = "pill due" + (isMultiDayRange(task) ? " due-range" : "");
    d.textContent = formatDueRange(task);
    meta.appendChild(d);
  }
  if (task.focus) {
    const f = document.createElement("span");
    f.className = "pill focus";
    f.textContent = "焦点";
    meta.appendChild(f);
  }
  el.addEventListener("dragstart", (e) => {
    draggedId = task.id;
    el.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    draggedId = null;
    document.querySelectorAll(".column-body.drag-over").forEach((n) => n.classList.remove("drag-over"));
  });
  el.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    openEdit(task.id);
  });
  return el;
}

function removeTaskFromColumns(taskId) {
  for (const col of COL_DEFS) {
    state.columns[col.id] = state.columns[col.id].filter((id) => id !== taskId);
  }
}

function insertTaskAtColumn(taskId, columnId, index) {
  removeTaskFromColumns(taskId);
  const list = state.columns[columnId];
  const i = Math.max(0, Math.min(index, list.length));
  list.splice(i, 0, taskId);
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (const col of COL_DEFS) {
    const colEl = document.createElement("section");
    colEl.className = "column";
    colEl.dataset.columnId = col.id;
    const ids = state.columns[col.id];
    const visibleCount = ids.filter((id) => state.tasks[id] && isBusinessTask(state.tasks[id])).length;
    colEl.innerHTML = `
      <header class="column-head">
        <h2 class="column-title">
          ${col.icon}
          <span class="column-dot" style="background:${col.dot}"></span>
          ${col.title}
        </h2>
        <span class="column-count">${visibleCount}</span>
      </header>
      <div class="column-body" data-drop-column="${col.id}"></div>
    `;
    const body = colEl.querySelector(".column-body");
    ids.forEach((taskId) => {
      const task = state.tasks[taskId];
      if (task && isBusinessTask(task)) body.appendChild(renderCard(task));
    });
    body.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      body.classList.add("drag-over");
    });
    body.addEventListener("dragleave", () => body.classList.remove("drag-over"));
    body.addEventListener("drop", (e) => {
      e.preventDefault();
      body.classList.remove("drag-over");
      const id = e.dataTransfer.getData("text/plain") || draggedId;
      if (!id || !state.tasks[id] || !isBusinessTask(state.tasks[id])) return;
      const children = [...body.querySelectorAll(".task-card")].filter((el) => el.dataset.taskId !== id);
      let insertIndex = children.length;
      const y = e.clientY;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (y < mid) {
          insertIndex = i;
          break;
        }
      }
      insertTaskAtColumn(id, col.id, insertIndex);
      saveState(state);
      renderAll();
    });
    boardEl.appendChild(colEl);
  }
  updateStats();
}

function promoTasksSorted() {
  return Object.values(state.tasks)
    .filter(isPromotionTask)
    .sort((a, b) => {
      if (!a.due && !b.due) return (a.title || "").localeCompare(b.title || "", "ja");
      if (!a.due) return 1;
      if (!b.due) return -1;
      const c = a.due.localeCompare(b.due);
      if (c !== 0) return c;
      return (a.title || "").localeCompare(b.title || "", "ja");
    });
}

function renderPromoHub() {
  if (!promoListEl) return;
  const list = promoTasksSorted();
  if (promoEmptyEl) promoEmptyEl.hidden = list.length > 0;
  promoListEl.innerHTML = "";
  for (const t of list) {
    const card = document.createElement("article");
    card.className = "promo-card";
    card.innerHTML = `<h3 class="promo-card-title"></h3><div class="promo-card-meta"></div>`;
    card.querySelector(".promo-card-title").textContent = t.title || "（無題）";
    const meta = card.querySelector(".promo-card-meta");
    if (t.due) {
      const span = document.createElement("span");
      span.className = "promo-card-dates";
      span.textContent = formatDueRange(t);
      meta.appendChild(span);
    } else {
      const span = document.createElement("span");
      span.className = "promo-card-dates promo-card-dates--muted";
      span.textContent = "日付未設定";
      meta.appendChild(span);
    }
    if (t.project) {
      const p = document.createElement("span");
      p.className = "promo-card-proj";
      p.textContent = t.project;
      meta.appendChild(p);
    }
    card.addEventListener("click", () => openEdit(t.id));
    promoListEl.appendChild(card);
  }
}

function renderAll() {
  renderCalendar();
  renderTimeline();
  renderPromoHub();
  renderBoard();
}

function addTask(title) {
  const v = document.querySelector('input[name="quick-kind"]:checked')?.value || "business";
  const kind = v === "schedule" ? "schedule" : v === "promotion" ? "promotion" : "business";
  const t = title.trim();

  if (kind === "promotion") {
    const caseName = quickPromoCase?.value?.trim() || "";
    if (!caseName) {
      alert("プロモでは案件名を選んでください。");
      return;
    }
    const startRaw = quickPromoStartMd?.value || "";
    const endRaw = quickPromoEndMd?.value || "";
    let due = parseMonthDayToYmd(startRaw);
    let dueEnd = parseMonthDayToYmd(endRaw);
    const norm = normalizeDueRangePair(due, dueEnd);
    due = norm.due;
    dueEnd = norm.dueEnd;
    if ((startRaw.trim() && !due) || (endRaw.trim() && !dueEnd)) {
      alert(`日付は月/日で入力してください（例: 4/18）。年は不要で、${PROMO_DATE_YEAR}年として保存されます。`);
      return;
    }
    const id = uid();
    state.tasks[id] = {
      id,
      kind,
      title: t || caseName,
      note: "",
      project: caseName,
      due,
      dueEnd,
      startTime: "",
      endTime: "",
      focus: false,
    };
    saveState(state);
    renderAll();
    quickInput.value = "";
    if (quickPromoStartMd) quickPromoStartMd.value = "";
    if (quickPromoEndMd) quickPromoEndMd.value = "";
    return;
  }

  if (!t) return;
  const id = uid();
  state.tasks[id] = {
    id,
    kind,
    title: t,
    note: "",
    project: "",
    due: "",
    dueEnd: "",
    startTime: "",
    endTime: "",
    focus: false,
  };
  if (kind === "business") {
    state.columns.wait.push(id);
  }
  saveState(state);
  renderAll();
  quickInput.value = "";
}

function syncModalKindUI() {
  const promo = !!editKindPromotion?.checked;
  const nonBiz = editKindSchedule?.checked || promo;
  if (editFocusWrap) {
    if (nonBiz) {
      editFocusWrap.classList.add("is-disabled");
      editFocus.checked = false;
    } else {
      editFocusWrap.classList.remove("is-disabled");
    }
  }
  if (editPromoOnly) editPromoOnly.hidden = !promo;
  if (editStandardProjectDates) editStandardProjectDates.hidden = promo;
  if (editDateHint) {
    editDateHint.textContent = promo
      ? `💡 プロモの日付は${PROMO_DATE_YEAR}年固定。月/日だけ入力（4/18 や 4-18）。カレンダー・並び順はこの日付を使います。`
      : "💡 開始日だけならその1日だけ。終了日も入れると、その期間中ずっとカレンダー・タイムラインに出ます。時刻は「開始日」にだけ効きます。";
  }
}

function openEdit(taskId) {
  const task = state.tasks[taskId];
  if (!task) return;
  editingId = taskId;
  editTitle.value = task.title;
  editNote.value = task.note || "";
  editProject.value = task.project || "";
  editDue.value = task.due || "";
  editDueEnd.value = task.dueEnd || "";
  editStart.value = task.startTime || "";
  editEnd.value = task.endTime || "";
  if (isPromotionTask(task)) {
    editKindPromotion.checked = true;
    editKindBusiness.checked = false;
    editKindSchedule.checked = false;
    editFocus.checked = false;
    setPromoCaseSelectValue(editPromoCase, task.project || "");
    if (editPromoStartMd) editPromoStartMd.value = ymdToMonthDayDisplay(task.due || "");
    if (editPromoEndMd) editPromoEndMd.value = ymdToMonthDayDisplay(task.dueEnd || "");
  } else {
    clearExtraPromoCaseOptions(editPromoCase);
    if (editPromoCase) editPromoCase.value = "";
    if (editPromoStartMd) editPromoStartMd.value = "";
    if (editPromoEndMd) editPromoEndMd.value = "";
  }

  if (isScheduleTask(task)) {
    editKindSchedule.checked = true;
    editKindBusiness.checked = false;
    editKindPromotion.checked = false;
    editFocus.checked = false;
  } else if (isBusinessTask(task)) {
    editKindBusiness.checked = true;
    editKindSchedule.checked = false;
    editKindPromotion.checked = false;
    editFocus.checked = !!task.focus;
  }
  syncModalKindUI();
  modal.hidden = false;
  editTitle.focus();
}

function closeModal() {
  modal.hidden = true;
  editingId = null;
}

function saveEdit() {
  if (!editingId || !state.tasks[editingId]) return;
  const t = state.tasks[editingId];
  const prevKind = t.kind || "business";
  let nextKind = "business";
  if (editKindPromotion?.checked) nextKind = "promotion";
  else if (editKindSchedule?.checked) nextKind = "schedule";

  t.title = editTitle.value.trim() || "（無題）";
  t.note = editNote.value.trim();

  if (nextKind === "promotion") {
    t.project = editPromoCase?.value?.trim() || "";
    if (!t.project) {
      alert("プロモでは案件名を選んでください。");
      return;
    }
    const sRaw = editPromoStartMd?.value || "";
    const eRaw = editPromoEndMd?.value || "";
    let due = parseMonthDayToYmd(sRaw);
    let dueEnd = parseMonthDayToYmd(eRaw);
    if ((sRaw.trim() && !due) || (eRaw.trim() && !dueEnd)) {
      alert(`日付は月/日で入力してください（例: 4/18）。年は不要で、${PROMO_DATE_YEAR}年として保存されます。`);
      return;
    }
    const norm = normalizeDueRangePair(due, dueEnd);
    t.due = norm.due;
    t.dueEnd = norm.dueEnd;
  } else {
    t.project = editProject.value.trim();
    t.due = editDue.value || "";
    let dueEnd = editDueEnd?.value?.trim() || "";
    if (t.due && dueEnd && dueEnd < t.due) dueEnd = "";
    t.dueEnd = t.due && dueEnd && dueEnd > t.due ? dueEnd : "";
  }
  t.startTime = editStart.value || "";
  t.endTime = editEnd.value || "";
  t.kind = nextKind;

  if (nextKind === "business") {
    t.focus = !!editFocus.checked;
    if (prevKind !== "business" || !columnOfTask(editingId)) {
      removeTaskFromColumns(editingId);
      state.columns.wait.push(editingId);
    }
  } else {
    t.focus = false;
    removeTaskFromColumns(editingId);
  }

  saveState(state);
  renderAll();
  closeModal();
}

function deleteEdit() {
  if (!editingId || !state.tasks[editingId]) return;
  const id = editingId;
  removeTaskFromColumns(id);
  delete state.tasks[id];
  saveState(state);
  renderAll();
  closeModal();
}

calPrev.addEventListener("click", () => {
  let y = state.ui.calYear;
  let m = state.ui.calMonth - 1;
  if (m < 0) {
    m = 11;
    y--;
  }
  state.ui.calYear = y;
  state.ui.calMonth = m;
  saveState(state);
  renderAll();
});

calNext.addEventListener("click", () => {
  let y = state.ui.calYear;
  let m = state.ui.calMonth + 1;
  if (m > 11) {
    m = 0;
    y++;
  }
  state.ui.calYear = y;
  state.ui.calMonth = m;
  saveState(state);
  renderAll();
});

btnToday.addEventListener("click", () => {
  const now = new Date();
  state.ui.calYear = now.getFullYear();
  state.ui.calMonth = now.getMonth();
  state.ui.selectedDate = formatLocalDate(now);
  saveState(state);
  renderAll();
});

quickAdd.addEventListener("click", () => addTask(quickInput.value));
quickInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask(quickInput.value);
  }
});

btnSave.addEventListener("click", saveEdit);
btnDelete.addEventListener("click", deleteEdit);

editKindBusiness?.addEventListener("change", syncModalKindUI);
editKindSchedule?.addEventListener("change", syncModalKindUI);
editKindPromotion?.addEventListener("change", syncModalKindUI);

function syncQuickKindUI() {
  const v = document.querySelector('input[name="quick-kind"]:checked')?.value || "business";
  const promo = v === "promotion";
  if (quickPromoExtra) quickPromoExtra.hidden = !promo;
  if (quickInput) {
    quickInput.placeholder = promo
      ? "プロモのタイトル（空なら案件名をタイトルにします）"
      : "追加…（ビジネスはカンバン「待機」へ／予定はカレンダーで日付を設定）";
  }
}

document.querySelectorAll('input[name="quick-kind"]').forEach((el) => {
  el.addEventListener("change", syncQuickKindUI);
});

modal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

modal.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

btnExport.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `katsuya-board-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

btnImport.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", () => {
  const file = importFile.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (!data.columns || !data.tasks) throw new Error("形式が違います");
      state = migrateState(data);
      saveState(state);
      renderAll();
    } catch {
      alert("読み込めませんでした。JSONの形式を確認してください。");
    }
    importFile.value = "";
  };
  reader.readAsText(file);
});

syncQuickKindUI();
renderAll();
