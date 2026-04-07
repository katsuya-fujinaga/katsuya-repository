const STORAGE_KEY = "katsuya-daily-v2";
const LEGACY_KEY = "katsuya-daily-v1";
const GDRIVE_CLIENT_ID_KEY = "katsuya-daily-gdrive-client-id";
const GDRIVE_FILE_ID_KEY = "katsuya-daily-gdrive-file-id";
const GDRIVE_SYNC_FILENAME = "katsuya-daily-sync.json";
const GDRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const WD = ["日", "月", "火", "水", "木", "金", "土"];

const MAX_PHOTOS_PER_DAY = 4;
const PHOTO_MAX_WIDTH = 960;
const JPEG_QUALITY = 0.82;

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(iso) {
  return new Date(iso + "T12:00:00");
}

function shiftDate(iso, diff) {
  const d = parseDate(iso);
  d.setDate(d.getDate() + diff);
  return fmtDate(d);
}

function dayLabel(iso) {
  const d = parseDate(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日（${WD[d.getDay()]}）`;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyEntry() {
  return {
    reflection: "",
    diary: "",
    images: [],
    todos: [],
    tomorrow: [],
    updatedAt: Date.now(),
  };
}

function migrateEntries(entries) {
  const out = { ...entries };
  for (const k of Object.keys(out)) {
    const e = out[k];
    if (!e) continue;
    if (e.diary === undefined) e.diary = "";
    if (!Array.isArray(e.images)) e.images = [];
    e.images = e.images
      .filter((img) => img && typeof img.dataUrl === "string")
      .map((img) => ({
        id: img.id || uid(),
        dataUrl: img.dataUrl,
      }));
  }
  return out;
}

function normalizeEvents(events) {
  if (!Array.isArray(events)) return [];
  return events
    .filter((ev) => ev && typeof ev === "object")
    .map((ev) => ({
      id: ev.id || uid(),
      date: typeof ev.date === "string" ? ev.date : "",
      time: typeof ev.time === "string" ? ev.time : "",
      title: (ev.title || "").trim(),
      createdAt: typeof ev.createdAt === "number" ? ev.createdAt : Date.now(),
    }))
    .filter((ev) => ev.date && /^\d{4}-\d{2}-\d{2}$/.test(ev.date) && ev.title);
}

function emptyState() {
  const today = fmtDate(new Date());
  return {
    ui: {
      selectedDate: today,
      calYear: new Date().getFullYear(),
      calMonth: new Date().getMonth(),
      themeTab: "auto",
    },
    entries: {
      [today]: emptyEntry(),
    },
    events: [],
  };
}

function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const legacy = JSON.parse(raw);
        if (legacy?.entries) {
          legacy.entries = migrateEntries(legacy.entries);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
          localStorage.removeItem(LEGACY_KEY);
        }
      }
    }
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return emptyState();
    if (!data.ui || !data.entries) return emptyState();
    if (!data.ui.themeTab || !["auto", "day", "night"].includes(data.ui.themeTab)) {
      data.ui.themeTab = "auto";
    }
    data.entries = migrateEntries(data.entries);
    data.events = normalizeEvents(data.events);
    return data;
  } catch {
    return emptyState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    if (e?.name === "QuotaExceededError" || e?.code === 22) {
      alert("保存容量の上限に近いです。写真を減らすか、書き出ししてから古い画像を削除してください。");
    }
    throw e;
  }
}

function applyImportedState(data) {
  if (!data || !data.entries || !data.ui) throw new Error("invalid");
  if (!data.ui.themeTab || !["auto", "day", "night"].includes(data.ui.themeTab)) {
    data.ui.themeTab = "auto";
  }
  data.entries = migrateEntries(data.entries);
  data.events = normalizeEvents(data.events);
  state = data;
  rolloverToToday();
  saveState();
  renderAll();
}

function ensureEntry(dateKey) {
  if (!state.entries[dateKey]) state.entries[dateKey] = emptyEntry();
  return state.entries[dateKey];
}

function normalizeTodos(entry) {
  entry.todos = (entry.todos || [])
    .map((t) => ({
      id: t.id || uid(),
      originId: t.originId || `manual-${t.id || uid()}`,
      text: (t.text || "").trim(),
      done: !!t.done,
    }))
    .filter((t) => t.text);
}

function normalizeTomorrow(entry) {
  entry.tomorrow = (entry.tomorrow || [])
    .map((t) => ({
      id: t.id || uid(),
      text: (t.text || "").trim(),
    }))
    .filter((t) => t.text);
}

function rolloverToToday() {
  const today = fmtDate(new Date());
  const yesterday = shiftDate(today, -1);
  const todayEntry = ensureEntry(today);
  normalizeTodos(todayEntry);
  normalizeTomorrow(todayEntry);

  const y = state.entries[yesterday];
  if (!y) return;
  normalizeTodos(y);
  normalizeTomorrow(y);

  const existing = new Set(todayEntry.todos.map((t) => t.originId));
  const addTodo = (originId, text) => {
    if (!text || existing.has(originId)) return;
    todayEntry.todos.push({
      id: uid(),
      originId,
      text,
      done: false,
    });
    existing.add(originId);
  };

  for (const it of y.tomorrow) {
    addTodo(`plan-${yesterday}-${it.id}`, it.text);
  }

  for (const t of y.todos) {
    if (!t.done) addTodo(t.originId, t.text);
  }

  todayEntry.updatedAt = Date.now();
  ensureEntry(state.ui.selectedDate);
}

function doneRate(entry) {
  const total = entry.todos.length;
  if (!total) return 0;
  const done = entry.todos.filter((t) => t.done).length;
  return Math.round((done / total) * 100);
}

/** その日が「ストリークに数える達成日」か */
function isStreakDay(iso) {
  const e = state.entries[iso];
  if (!e) return false;
  normalizeTodos(e);
  const hasText = !!(e.reflection || "").trim() || !!(e.diary || "").trim();
  const n = e.todos.length;
  if (n === 0) return hasText;
  return doneRate(e) === 100;
}

function computeStreak() {
  const today = fmtDate(new Date());
  let start = today;
  if (!isStreakDay(today)) {
    start = shiftDate(today, -1);
    if (!isStreakDay(start)) return 0;
  }
  let n = 0;
  let d = start;
  while (isStreakDay(d)) {
    n += 1;
    d = shiftDate(d, -1);
  }
  return n;
}

function dayScore(entry) {
  const rate = doneRate(entry);
  const refB = (entry.reflection || "").trim() ? 10 : 0;
  const diaryB = (entry.diary || "").trim() ? 10 : 0;
  const photoB = (entry.images || []).length ? 5 : 0;
  return Math.min(100, Math.round(rate * 0.75 + refB + diaryB + photoB));
}

function getTimeTheme() {
  const h = new Date().getHours();
  if (h >= 6 && h < 18) return "morning";
  return "night";
}

function resolveTheme() {
  const tab = state.ui.themeTab || "auto";
  if (tab === "day") return "morning";
  if (tab === "night") return "night";
  return getTimeTheme();
}

function applyTheme() {
  const t = resolveTheme();
  document.body.classList.toggle("theme-night", t === "night");

  const tab = state.ui.themeTab || "auto";
  const autoSel = tab === "auto";
  const daySel = tab === "day";
  const nightSel = tab === "night";

  if (el.themeTabAuto) {
    el.themeTabAuto.setAttribute("aria-selected", autoSel ? "true" : "false");
  }
  if (el.themeTabDay) {
    el.themeTabDay.setAttribute("aria-selected", daySel ? "true" : "false");
  }
  if (el.themeTabNight) {
    el.themeTabNight.setAttribute("aria-selected", nightSel ? "true" : "false");
  }
}

function setThemeTab(next) {
  state.ui.themeTab = next;
  try {
    saveState();
  } catch {
    /* ignore */
  }
  applyTheme();
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const r = new FileReader();
    r.onerror = () => reject(new Error("read"));
    r.onload = () => {
      img.onerror = () => reject(new Error("img"));
      img.onload = () => {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > PHOTO_MAX_WIDTH) {
          h = Math.round((h * PHOTO_MAX_WIDTH) / w);
          w = PHOTO_MAX_WIDTH;
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

const HEARTS_DAY = ["💗", "💕", "✨", "🌸", "⭐", "💫"];
const FX_COLORS_DAY = ["#f9a8d4", "#c4b5fd", "#fde047", "#7dd3fc", "#fda4af"];
const HEARTS_NIGHT = ["✨", "⭐", "💫", "✦", "✧"];
const FX_COLORS_NIGHT = ["#3794ff", "#4ec9b0", "#569cd6", "#89d185", "#75beff"];

function burstAt(clientX, clientY, big) {
  const layer = el.fxLayer;
  if (!layer) return;
  const night = document.body.classList.contains("theme-night");
  const fxColors = night ? FX_COLORS_NIGHT : FX_COLORS_DAY;
  const hearts = night ? HEARTS_NIGHT : HEARTS_DAY;
  const rect = layer.getBoundingClientRect();
  const x = clientX ?? rect.left + rect.width / 2;
  const y = clientY ?? rect.top + rect.height / 2;
  const nx = x - rect.left;
  const ny = y - rect.top;

  const count = big ? 18 : 10;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement("span");
    spark.className = "fx-spark";
    spark.style.left = `${nx}px`;
    spark.style.top = `${ny}px`;
    spark.style.background = fxColors[i % fxColors.length];
    const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = (big ? 90 : 55) + Math.random() * 40;
    spark.style.setProperty("--sx", `${Math.cos(ang) * dist}px`);
    spark.style.setProperty("--sy", `${Math.sin(ang) * dist}px`);
    layer.appendChild(spark);
    setTimeout(() => spark.remove(), 950);
  }

  const hCount = big ? 8 : 4;
  for (let i = 0; i < hCount; i++) {
    const h = document.createElement("span");
    h.className = "fx-particle";
    h.textContent = hearts[(i + Math.floor(Math.random() * 3)) % hearts.length];
    h.style.left = `${nx + (Math.random() - 0.5) * 40}px`;
    h.style.top = `${ny + (Math.random() - 0.5) * 40}px`;
    h.style.setProperty("--tx", `${(Math.random() - 0.5) * 120}px`);
    h.style.setProperty("--ty", `${-80 - Math.random() * 100}px`);
    layer.appendChild(h);
    setTimeout(() => h.remove(), 1150);
  }
}

const el = {
  fxLayer: document.getElementById("fx-layer"),
  themeTabAuto: document.getElementById("theme-tab-auto"),
  themeTabDay: document.getElementById("theme-tab-day"),
  themeTabNight: document.getElementById("theme-tab-night"),
  streakLine: document.getElementById("streak-line"),
  progressText: document.getElementById("progress-text"),
  progressChart: document.getElementById("progress-chart"),
  calLabel: document.getElementById("cal-label"),
  calPrev: document.getElementById("cal-prev"),
  calNext: document.getElementById("cal-next"),
  calendarGrid: document.getElementById("calendar-grid"),
  goToday: document.getElementById("go-today"),
  selectedDateLabel: document.getElementById("selected-date-label"),
  selectedDayMeta: document.getElementById("selected-day-meta"),
  todayTaskInput: document.getElementById("today-task-input"),
  addTodayTask: document.getElementById("add-today-task"),
  todayTaskList: document.getElementById("today-task-list"),
  reflectionInput: document.getElementById("reflection-input"),
  diaryInput: document.getElementById("diary-input"),
  photoInput: document.getElementById("photo-input"),
  photoGallery: document.getElementById("photo-gallery"),
  tomorrowTaskInput: document.getElementById("tomorrow-task-input"),
  addTomorrowTask: document.getElementById("add-tomorrow-task"),
  tomorrowTaskList: document.getElementById("tomorrow-task-list"),
  saveDay: document.getElementById("save-day"),
  btnExport: document.getElementById("btn-export"),
  btnImport: document.getElementById("btn-import"),
  importFile: document.getElementById("import-file"),
  gdriveClientId: document.getElementById("gdrive-client-id"),
  gdriveSaveClientId: document.getElementById("gdrive-save-client-id"),
  gdriveSyncUpload: document.getElementById("gdrive-sync-upload"),
  gdriveSyncDownload: document.getElementById("gdrive-sync-download"),
  gdriveStatus: document.getElementById("gdrive-status"),
  scheduleDayList: document.getElementById("schedule-day-list"),
  scheduleDayEmpty: document.getElementById("schedule-day-empty"),
  scheduleDate: document.getElementById("schedule-date"),
  scheduleTime: document.getElementById("schedule-time"),
  scheduleTitle: document.getElementById("schedule-title"),
  scheduleAdd: document.getElementById("schedule-add"),
};

let state = loadState();
rolloverToToday();
try {
  saveState();
} catch {
  /* quota handled in saveState */
}

function getSelectedEntry() {
  return ensureEntry(state.ui.selectedDate);
}

function renderStreak() {
  if (el.streakLine) {
    const n = computeStreak();
    el.streakLine.textContent =
      n > 0
        ? `連続達成 ${n}日 — その調子`
        : "連続達成 0日 — 今日の一歩から";
  }
}

function renderProgress() {
  const today = fmtDate(new Date());
  const entry = ensureEntry(today);
  el.progressText.textContent = `今日の達成率 ${doneRate(entry)}%`;

  el.progressChart.innerHTML = "";
  for (let i = 13; i >= 0; i--) {
    const d = shiftDate(today, -i);
    const e = ensureEntry(d);
    const score = dayScore(e);
    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max(8, score)}px`;
    bar.title = `${d}: ${score}点`;
    const lb = document.createElement("span");
    lb.className = "bar-label";
    lb.textContent = d === today ? "今日" : d.slice(5).replace("-", "/");
    wrap.appendChild(bar);
    wrap.appendChild(lb);
    el.progressChart.appendChild(wrap);
  }
}

function datesWithScheduleEvents() {
  const set = new Set();
  for (const ev of state.events || []) {
    if (ev?.date) set.add(ev.date);
  }
  return set;
}

function sortEventsForDisplay(list) {
  return [...list].sort((a, b) => {
    const ta = a.time && a.time.trim() ? a.time : "\uffff";
    const tb = b.time && b.time.trim() ? b.time : "\uffff";
    if (ta !== tb) return ta.localeCompare(tb);
    return (a.title || "").localeCompare(b.title || "");
  });
}

function eventsForDate(dateKey) {
  const list = (state.events || []).filter((ev) => ev.date === dateKey);
  return sortEventsForDisplay(list);
}

function calendarCells(year, month) {
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const cells = [];

  const prevLast = new Date(year, month, 0).getDate();
  for (let i = 0; i < start; i++) {
    const day = prevLast - start + i + 1;
    const d = new Date(year, month - 1, day);
    cells.push({ date: fmtDate(d), muted: true, day });
  }
  for (let day = 1; day <= dim; day++) {
    const d = new Date(year, month, day);
    cells.push({ date: fmtDate(d), muted: false, day });
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length % 7 + 1;
    const d = new Date(year, month + 1, day);
    cells.push({ date: fmtDate(d), muted: true, day: d.getDate() });
  }
  return cells;
}

function renderCalendar() {
  const { calYear, calMonth, selectedDate } = state.ui;
  el.calLabel.textContent = `${calYear}年${calMonth + 1}月`;
  el.calendarGrid.innerHTML = "";

  const eventDates = datesWithScheduleEvents();
  const cells = calendarCells(calYear, calMonth);
  for (const c of cells) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-cell";
    if (c.muted) btn.classList.add("muted");
    if (c.date === selectedDate) btn.classList.add("selected");

    const entry = ensureEntry(c.date);
    const done = doneRate(entry);
    const hasReflection = !!(entry.reflection || "").trim();
    const hasDiary = !!(entry.diary || "").trim();
    const hasPhotos = (entry.images || []).length > 0;
    const hasTodo = entry.todos.length > 0;
    const hasSchedule = eventDates.has(c.date);

    btn.innerHTML = `<span class="cal-day">${c.day}</span><span class="cal-dot-row"></span>`;
    const dotRow = btn.querySelector(".cal-dot-row");
    if (hasReflection) {
      const d = document.createElement("span");
      d.className = "dot reflect";
      dotRow.appendChild(d);
    }
    if (hasDiary) {
      const d = document.createElement("span");
      d.className = "dot diary";
      dotRow.appendChild(d);
    }
    if (hasPhotos) {
      const d = document.createElement("span");
      d.className = "dot photo";
      dotRow.appendChild(d);
    }
    if (hasTodo) {
      const d = document.createElement("span");
      d.className = "dot todo";
      dotRow.appendChild(d);
    }
    if (hasSchedule) {
      const d = document.createElement("span");
      d.className = "dot schedule";
      dotRow.appendChild(d);
    }
    if (done === 100 && hasTodo) {
      const d = document.createElement("span");
      d.className = "dot done";
      dotRow.appendChild(d);
    }

    btn.addEventListener("click", () => {
      state.ui.selectedDate = c.date;
      const d = parseDate(c.date);
      state.ui.calYear = d.getFullYear();
      state.ui.calMonth = d.getMonth();
      saveState();
      renderAll();
    });
    el.calendarGrid.appendChild(btn);
  }
}

function renderTodayTasks(entry) {
  el.todayTaskList.innerHTML = "";
  for (const t of entry.todos) {
    const li = document.createElement("li");
    li.className = "todo-item";

    const main = document.createElement("div");
    main.className = "todo-main";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.addEventListener("change", () => {
      const was = t.done;
      t.done = cb.checked;
      entry.updatedAt = Date.now();
      try {
        saveState();
      } catch {
        t.done = was;
        cb.checked = was;
        return;
      }

      if (t.done && !was) {
        const r = cb.getBoundingClientRect();
        burstAt(r.left + r.width / 2, r.top + r.height / 2, false);
        const allDone = entry.todos.length > 0 && entry.todos.every((x) => x.done);
        if (allDone) {
          setTimeout(() => burstAt(undefined, undefined, true), 200);
        }
      }

      renderAll();
    });

    const label = document.createElement("label");
    label.textContent = t.text;
    if (t.done) label.classList.add("is-done");

    main.appendChild(cb);
    main.appendChild(label);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "削除";
    del.addEventListener("click", () => {
      entry.todos = entry.todos.filter((x) => x.id !== t.id);
      entry.updatedAt = Date.now();
      try {
        saveState();
      } catch {
        return;
      }
      renderAll();
    });

    li.appendChild(main);
    li.appendChild(del);
    el.todayTaskList.appendChild(li);
  }
}

function renderTomorrowTasks(entry) {
  el.tomorrowTaskList.innerHTML = "";
  for (const t of entry.tomorrow) {
    const li = document.createElement("li");
    li.className = "bullet-item";
    const text = document.createElement("span");
    text.textContent = `・${t.text}`;
    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "削除";
    del.addEventListener("click", () => {
      entry.tomorrow = entry.tomorrow.filter((x) => x.id !== t.id);
      entry.updatedAt = Date.now();
      try {
        saveState();
      } catch {
        return;
      }
      renderAll();
    });
    li.appendChild(text);
    li.appendChild(del);
    el.tomorrowTaskList.appendChild(li);
  }
}

function formatScheduleTimeLabel(timeStr) {
  const t = (timeStr || "").trim();
  if (!t) return "時刻なし";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function renderSchedulePanel() {
  if (!el.scheduleDayList || !el.scheduleDayEmpty) return;

  const dateKey = state.ui.selectedDate;
  const list = eventsForDate(dateKey);

  el.scheduleDayList.innerHTML = "";
  if (el.scheduleDate) el.scheduleDate.value = dateKey;

  if (list.length === 0) {
    el.scheduleDayEmpty.classList.remove("is-hidden");
  } else {
    el.scheduleDayEmpty.classList.add("is-hidden");
    for (const ev of list) {
      const li = document.createElement("li");
      li.className = "schedule-item";
      const main = document.createElement("div");
      main.className = "schedule-item-main";
      const timeEl = document.createElement("span");
      timeEl.className = "schedule-item-time";
      timeEl.textContent = formatScheduleTimeLabel(ev.time);
      const titleEl = document.createElement("p");
      titleEl.className = "schedule-item-title";
      titleEl.textContent = ev.title;
      main.appendChild(timeEl);
      main.appendChild(titleEl);
      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete-btn";
      del.textContent = "削除";
      del.addEventListener("click", () => {
        state.events = (state.events || []).filter((x) => x.id !== ev.id);
        try {
          saveState();
        } catch {
          return;
        }
        renderAll();
      });
      li.appendChild(main);
      li.appendChild(del);
      el.scheduleDayList.appendChild(li);
    }
  }
}

function addScheduleEvent() {
  if (!el.scheduleDate || !el.scheduleTitle) return;
  const dateKey = el.scheduleDate.value;
  const title = el.scheduleTitle.value.trim();
  const timeVal = el.scheduleTime?.value?.trim() || "";
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    alert("日付を選んでください。");
    return;
  }
  if (!title) {
    alert("内容を入力してください。");
    return;
  }
  if (!state.events) state.events = [];
  state.events.push({
    id: uid(),
    date: dateKey,
    time: timeVal,
    title,
    createdAt: Date.now(),
  });
  el.scheduleTitle.value = "";
  if (el.scheduleTime) el.scheduleTime.value = "";
  try {
    saveState();
  } catch {
    state.events.pop();
    return;
  }
  state.ui.selectedDate = dateKey;
  const d = parseDate(dateKey);
  state.ui.calYear = d.getFullYear();
  state.ui.calMonth = d.getMonth();
  renderAll();
}

function renderPhotoGallery(entry) {
  el.photoGallery.innerHTML = "";
  const list = entry.images || [];
  for (const img of list) {
    const card = document.createElement("div");
    card.className = "photo-card";
    const image = document.createElement("img");
    image.src = img.dataUrl;
    image.alt = "日記用写真";
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "photo-remove";
    rm.textContent = "削除";
    rm.addEventListener("click", () => {
      entry.images = entry.images.filter((x) => x.id !== img.id);
      entry.updatedAt = Date.now();
      try {
        saveState();
      } catch {
        return;
      }
      renderAll();
    });
    card.appendChild(image);
    card.appendChild(rm);
    el.photoGallery.appendChild(card);
  }
}

function renderDayPanel() {
  const dateKey = state.ui.selectedDate;
  const entry = ensureEntry(dateKey);
  normalizeTodos(entry);
  normalizeTomorrow(entry);

  el.selectedDateLabel.textContent = dayLabel(dateKey);
  el.selectedDayMeta.textContent = `達成率 ${doneRate(entry)}% / TODO ${entry.todos.length}件`;
  el.reflectionInput.value = entry.reflection || "";
  el.diaryInput.value = entry.diary || "";

  renderTodayTasks(entry);
  renderTomorrowTasks(entry);
  renderPhotoGallery(entry);
}

function addTodayTask() {
  const txt = el.todayTaskInput.value.trim();
  if (!txt) return;
  const entry = getSelectedEntry();
  entry.todos.push({
    id: uid(),
    originId: `manual-${uid()}`,
    text: txt,
    done: false,
  });
  entry.updatedAt = Date.now();
  el.todayTaskInput.value = "";
  try {
    saveState();
  } catch {
    entry.todos.pop();
    return;
  }
  renderAll();
}

function addTomorrowTask() {
  const txt = el.tomorrowTaskInput.value.trim();
  if (!txt) return;
  const entry = getSelectedEntry();
  entry.tomorrow.push({
    id: uid(),
    text: txt,
  });
  entry.updatedAt = Date.now();
  el.tomorrowTaskInput.value = "";
  try {
    saveState();
  } catch {
    entry.tomorrow.pop();
    return;
  }
  renderAll();
}

function saveCurrentDay() {
  const entry = getSelectedEntry();
  entry.reflection = el.reflectionInput.value.trim();
  entry.diary = el.diaryInput.value.trim();
  entry.updatedAt = Date.now();
  try {
    saveState();
  } catch {
    return;
  }
  renderAll();
}

function renderAll() {
  applyTheme();
  renderStreak();
  renderProgress();
  renderCalendar();
  renderSchedulePanel();
  renderDayPanel();
}

function setGdriveStatus(message, isError) {
  if (!el.gdriveStatus) return;
  el.gdriveStatus.textContent = message || "";
  el.gdriveStatus.classList.toggle("is-error", !!isError);
}

function loadGsiScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gsi"));
    document.head.appendChild(s);
  });
}

function requestDriveAccessToken(clientId) {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error("gsi"));
      return;
    }
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GDRIVE_SCOPE,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error || "no_token"));
          return;
        }
        resolve(resp.access_token);
      },
    });
    client.requestAccessToken({ prompt: "" });
  });
}

async function createDriveFile(token, payload) {
  const boundary = `kdaily_${uid().replace(/[^a-z0-9]/gi, "")}`;
  const meta = { name: GDRIVE_SYNC_FILENAME, mimeType: "application/json" };
  const body =
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(meta) +
    `\r\n--${boundary}\r\n` +
    "Content-Type: application/json\r\n\r\n" +
    payload +
    `\r\n--${boundary}--`;
  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  const json = await res.json();
  if (json.id) localStorage.setItem(GDRIVE_FILE_ID_KEY, json.id);
}

/** 保存済みID、または Drive 上の同名ファイル（このアプリが作ったもの）を解決 */
async function resolveDriveFileId(token) {
  const cached = localStorage.getItem(GDRIVE_FILE_ID_KEY)?.trim();
  if (cached) return cached;
  const query = `name='${GDRIVE_SYNC_FILENAME}' and trashed=false`;
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("q", query);
  url.searchParams.set("fields", "files(id,name,modifiedTime)");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("pageSize", "5");
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const files = json.files || [];
  if (files.length === 0) return null;
  const id = files[0].id;
  localStorage.setItem(GDRIVE_FILE_ID_KEY, id);
  return id;
}

async function syncUploadToDrive() {
  setGdriveStatus("Drive に接続しています…");
  try {
    await loadGsiScript();
  } catch {
    setGdriveStatus("Google のスクリプトを読み込めませんでした。", true);
    return;
  }
  const clientId = localStorage.getItem(GDRIVE_CLIENT_ID_KEY)?.trim();
  if (!clientId) {
    alert("先に OAuth クライアントID を入力して「クライアントIDを保存」してください。");
    setGdriveStatus("");
    return;
  }
  let token;
  try {
    token = await requestDriveAccessToken(clientId);
  } catch {
    setGdriveStatus("Google へのログインが完了しませんでした（キャンセルした可能性があります）。", true);
    return;
  }
  const payload = JSON.stringify(state);
  try {
    let fileId = await resolveDriveFileId(token);
    if (fileId) {
      const res = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=media`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );
      if (res.status === 404) {
        localStorage.removeItem(GDRIVE_FILE_ID_KEY);
        fileId = null;
      } else if (!res.ok) {
        throw new Error((await res.text()) || res.statusText);
      }
    }
    if (!fileId) {
      await createDriveFile(token, payload);
    }
    try {
      saveState();
    } catch {
      /* local only */
    }
    setGdriveStatus(`Drive に同期しました（${new Date().toLocaleString("ja-JP")}）`);
  } catch (e) {
    console.error(e);
    setGdriveStatus("アップロードに失敗しました。Drive API が有効か、容量を確認してください。", true);
  }
}

async function syncDownloadFromDrive() {
  if (!confirm("このブラウザに保存中のデータを、Drive 上の内容で置き換えます。よろしいですか？")) {
    return;
  }
  setGdriveStatus("Drive から取得しています…");
  try {
    await loadGsiScript();
  } catch {
    setGdriveStatus("Google のスクリプトを読み込めませんでした。", true);
    return;
  }
  const clientId = localStorage.getItem(GDRIVE_CLIENT_ID_KEY)?.trim();
  if (!clientId) {
    alert("先に OAuth クライアントID を入力して保存してください。");
    setGdriveStatus("");
    return;
  }
  let token;
  try {
    token = await requestDriveAccessToken(clientId);
  } catch {
    setGdriveStatus("Google へのログインが完了しませんでした。", true);
    return;
  }
  let fileId;
  try {
    fileId = await resolveDriveFileId(token);
  } catch {
    fileId = null;
  }
  if (!fileId) {
    alert("Drive 上に同期ファイルが見つかりません。先にどちらかの端末で「Driveに同期」を実行してください。");
    setGdriveStatus("");
    return;
  }
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error((await res.text()) || res.statusText);
    const text = await res.text();
    applyImportedState(JSON.parse(text));
    setGdriveStatus(`Drive から取り込みました（${new Date().toLocaleString("ja-JP")}）`);
  } catch (e) {
    console.error(e);
    setGdriveStatus("取り込みに失敗しました。JSON が壊れていないか確認してください。", true);
  }
}

function initGdrivePanel() {
  const saved = localStorage.getItem(GDRIVE_CLIENT_ID_KEY);
  if (el.gdriveClientId && saved) el.gdriveClientId.value = saved;
}

el.calPrev.addEventListener("click", () => {
  let y = state.ui.calYear;
  let m = state.ui.calMonth - 1;
  if (m < 0) {
    m = 11;
    y -= 1;
  }
  state.ui.calYear = y;
  state.ui.calMonth = m;
  saveState();
  renderCalendar();
});

el.calNext.addEventListener("click", () => {
  let y = state.ui.calYear;
  let m = state.ui.calMonth + 1;
  if (m > 11) {
    m = 0;
    y += 1;
  }
  state.ui.calYear = y;
  state.ui.calMonth = m;
  saveState();
  renderCalendar();
});

el.goToday.addEventListener("click", () => {
  const today = fmtDate(new Date());
  const d = parseDate(today);
  state.ui.selectedDate = today;
  state.ui.calYear = d.getFullYear();
  state.ui.calMonth = d.getMonth();
  saveState();
  renderAll();
});

el.addTodayTask.addEventListener("click", addTodayTask);
el.addTomorrowTask.addEventListener("click", addTomorrowTask);
el.todayTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTodayTask();
  }
});
el.tomorrowTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTomorrowTask();
  }
});

el.saveDay.addEventListener("click", saveCurrentDay);
el.reflectionInput.addEventListener("blur", saveCurrentDay);
el.diaryInput.addEventListener("blur", saveCurrentDay);

el.photoInput.addEventListener("change", async () => {
  const file = el.photoInput.files?.[0];
  el.photoInput.value = "";
  if (!file || !file.type.startsWith("image/")) return;

  const entry = getSelectedEntry();
  if (!entry.images) entry.images = [];
  if (entry.images.length >= MAX_PHOTOS_PER_DAY) {
    alert(`写真は1日あたり${MAX_PHOTOS_PER_DAY}枚までです。`);
    return;
  }

  try {
    const dataUrl = await compressImageFile(file);
    entry.images.push({ id: uid(), dataUrl });
    entry.updatedAt = Date.now();
    saveState();
    burstAt(undefined, undefined, false);
    renderAll();
  } catch {
    alert("画像の読み込みに失敗しました。別の画像を試してください。");
  }
});

el.btnExport.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `katsuya-daily-${fmtDate(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

el.btnImport.addEventListener("click", () => el.importFile.click());
el.importFile.addEventListener("change", () => {
  const file = el.importFile.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      applyImportedState(JSON.parse(String(reader.result)));
    } catch {
      alert("読み込みできませんでした。JSON形式を確認してください。");
    } finally {
      el.importFile.value = "";
    }
  };
  reader.readAsText(file);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") applyTheme();
});
setInterval(() => {
  if ((state.ui.themeTab || "auto") === "auto") applyTheme();
}, 60 * 1000);

el.themeTabAuto?.addEventListener("click", () => setThemeTab("auto"));
el.themeTabDay?.addEventListener("click", () => setThemeTab("day"));
el.themeTabNight?.addEventListener("click", () => setThemeTab("night"));

el.scheduleAdd?.addEventListener("click", addScheduleEvent);
el.scheduleTitle?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addScheduleEvent();
  }
});

el.gdriveSaveClientId?.addEventListener("click", () => {
  const v = el.gdriveClientId?.value.trim() || "";
  if (!v) {
    localStorage.removeItem(GDRIVE_CLIENT_ID_KEY);
    setGdriveStatus("クライアントIDを消去しました。");
    return;
  }
  localStorage.setItem(GDRIVE_CLIENT_ID_KEY, v);
  setGdriveStatus("クライアントIDを保存しました。");
});

el.gdriveSyncUpload?.addEventListener("click", () => {
  syncUploadToDrive();
});

el.gdriveSyncDownload?.addEventListener("click", () => {
  syncDownloadFromDrive();
});

initGdrivePanel();
renderAll();
