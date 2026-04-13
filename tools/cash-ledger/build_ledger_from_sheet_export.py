#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Googleスプレッドシートの pipe 表（edit-0.md）から、住信SBI（a2）・現金（a3）を抽出する。

- 月内は表の上から順に、カレンダー日は 1 日・2 日…と詰める（元表の「日」列は使わない）。
- 「住信SBI銀行」「住信SBIより」「住信SBIへ」は SMBC 付近（8〜11 列）から補足。
- SBI 列（12〜15）・現金列（16〜19）を読む。予算・税の混入っぽいブロックは捨てる。
- SBI 列が空でも SMBC 列（8〜11）に数字があれば、それを住信SBI（a2）に入れる（列ずれ対策）。
- 行数が月の日数を超えるときは最終日に複数 lines を積む。
"""
import json
import re
import sys
from pathlib import Path

YEAR = 2026
MAX_SINGLE = 2_000_000


def parse_money(s):
    if s is None:
        return None
    t = str(s).strip().replace("\\", "").replace(",", "").replace("\u2212", "-")
    if not t or t == "-":
        return None
    if not re.match(r"^-?\d+$", t):
        return None
    return int(t)


def empty_cell():
    return {"w": 0, "d": 0, "note": ""}


def merge_cell(a, b):
    return {
        "w": a["w"] + b["w"],
        "d": a["d"] + b["d"],
        "note": " / ".join(x for x in (a["note"], b["note"]) if x),
    }


def note_from_block(c2, c3):
    for t in (c3, c2):
        u = str(t or "").strip()
        if not u:
            continue
        if parse_money(u) is not None:
            continue
        if re.search(r"\d+月", u) or u in ("前半", "後半"):
            continue
        return u
    return ""


def parse_block_cols(c0, c1, c2, c3):
    w = parse_money(c0) or 0
    d = parse_money(c1) or 0
    note = note_from_block(c2, c3)
    return {"w": w, "d": d, "note": note}


def is_bleed_sbi(c0, c2, c3):
    u0 = (c0 or "").strip()
    if re.match(r"^\d+月$", u0) or u0 in ("前半", "後半"):
        return True
    if re.search(r"\d+月", u0):
        return True
    for t in (c2, c3):
        u = str(t or "").strip()
        if u in ("前半", "後半"):
            return True
        if re.search(r"\d+月", u):
            return True
    return False


def is_bleed_cash(c0):
    u = (c0 or "").strip()
    if re.match(r"^\d+月$", u) or u in ("前半", "後半"):
        return True
    return False


def suspicious_same_wd(b):
    if b["w"] == b["d"] and b["w"] > 50_000:
        return True
    if max(b["w"], b["d"]) > MAX_SINGLE:
        return True
    return False


def shinsei_from_smbc(parts):
    """8〜11 列付近の住信SBIパターン → a2, a3"""
    a2 = empty_cell()
    a3 = empty_cell()
    p = parts

    if "住信SBI銀行" in (p[8] or ""):
        n = parse_money(p[9])
        if n and n <= MAX_SINGLE:
            a2 = {"w": n, "d": 0, "note": "住信SBI銀行"}
            a3 = {"w": 0, "d": n, "note": "住信SBI銀行"}

    for idx in range(8, 12):
        cell = p[idx] or ""
        if "住信SBIより" not in cell:
            continue
        n2 = parse_money(p[idx - 2]) if idx >= 2 else None
        n1 = parse_money(p[idx - 1]) if idx >= 1 else None
        transfer = None
        for cand in (n2, n1):
            if cand and cand <= MAX_SINGLE:
                transfer = cand
                break
        if transfer:
            a2 = merge_cell(a2, {"w": transfer, "d": 0, "note": "住信SBIより"})
            a3 = merge_cell(a3, {"w": 0, "d": transfer, "note": "住信SBIより"})
        break

    for idx in range(8, 14):
        cell = p[idx] or ""
        if "住信SBIへ" not in cell:
            continue
        n2 = parse_money(p[idx - 2]) if idx >= 2 else None
        n1 = parse_money(p[idx - 1]) if idx >= 1 else None
        transfer = None
        for cand in (n2, n1):
            if cand and cand <= MAX_SINGLE:
                transfer = cand
                break
        if transfer:
            a2 = merge_cell(a2, {"w": 0, "d": transfer, "note": "住信SBIへ"})
            a3 = merge_cell(a3, {"w": transfer, "d": 0, "note": "住信SBIへ"})
        break

    return a2, a3


def from_fixed_columns(parts):
    base = 4
    a2 = empty_cell()
    a3 = empty_cell()
    c12 = parts[base + 12]
    c13 = parts[base + 13]
    c14 = parts[base + 14]
    c15 = parts[base + 15]
    if not is_bleed_sbi(c12, c14, c15):
        sb = parse_block_cols(c12, c13, c14, c15)
        if sb["w"] or sb["d"] or sb["note"]:
            if not suspicious_same_wd(sb):
                a2 = sb

    d16 = parts[base + 16]
    if not is_bleed_cash(d16):
        gc = parse_block_cols(
            parts[base + 16],
            parts[base + 17],
            parts[base + 18],
            parts[base + 19],
        )
        if gc["w"] or gc["d"] or gc["note"]:
            if not suspicious_same_wd(gc):
                a3 = gc

    return a2, a3


def smbc_fallback_a2(parts):
    """SBI列が空のとき、SMBC列（8〜11）を住信SBI（a2）に流し込む（表の列ずれ対策）。"""
    c0, c1, c2, c3 = parts[8:12]
    if is_bleed_sbi(c0, c2, c3):
        return empty_cell()
    b = parse_block_cols(c0, c1, c2, c3)
    if not (b["w"] or b["d"] or b["note"]):
        return empty_cell()
    if suspicious_same_wd(b):
        return empty_cell()
    return b


def row_to_line(parts):
    """1 行分 → 1 本の lines 要素（a1 空、a2/a3 合成）"""
    kw2, kw3 = shinsei_from_smbc(parts)
    fx2, fx3 = from_fixed_columns(parts)
    a2 = merge_cell(fx2, kw2)
    if not (a2["w"] or a2["d"] or a2["note"]):
        a2 = smbc_fallback_a2(parts)
    a3 = merge_cell(fx3, kw3)
    if not (a2["w"] or a2["d"] or a2["note"] or a3["w"] or a3["d"] or a3["note"]):
        return None
    return {
        "a1": empty_cell(),
        "a2": a2,
        "a3": a3,
    }


def month_num_from_marker(s):
    m = re.match(r"^(\d+)月$", str(s or "").strip())
    return int(m.group(1)) if m else None


def days_in_month(y, m):
    import calendar

    return calendar.monthrange(y, m)[1]


def parse_export(text):
    sheet_month = None
    # month -> ordered list of line dicts (each is one row's a1/a2/a3)
    order_lists = {}

    for line in text.splitlines():
        mm = re.match(r"^\|\s*\d+\s*\|\s*(\d+)月\s*\|", line)
        if mm:
            sheet_month = month_num_from_marker(mm.group(1) + "月")
            continue

        dm = re.match(r"^\|\s*\d+\s*\|\s*(\d{1,2})\s*\|\s*[日月火水木金土]\s*\|", line)
        if not dm or sheet_month is None:
            continue

        day_sheet = int(dm.group(1))
        if day_sheet < 1 or day_sheet > 31:
            continue

        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 20:
            continue

        one = row_to_line(parts)
        if not one:
            continue

        if sheet_month not in order_lists:
            order_lists[sheet_month] = []
        order_lists[sheet_month].append(one)

    return order_lists


def assign_sequential_days(order_lists):
    """上から順に day 1,2,… に割り当て。超過分は最終日に lines を追加。"""
    by_month_days = {}
    for m, lines in order_lists.items():
        dim = days_in_month(YEAR, m)
        days = {}
        for i, line0 in enumerate(lines):
            day_num = min(i + 1, dim)
            dkey = str(day_num)
            if dkey not in days:
                days[dkey] = {"lines": []}
            days[dkey]["lines"].append(line0)
        by_month_days[m] = days
    return by_month_days


def build_state(by_month_days):
    accounts = [
        {"id": "a1", "name": "SMBC信託銀行"},
        {"id": "a2", "name": "住信SBIネット銀行"},
        {"id": "a3", "name": "現金"},
    ]
    months = {}
    for m in range(1, 13):
        key = f"{YEAR}-{m:02d}"
        mp = by_month_days.get(m, {})
        months[key] = {
            "openings": {"a1": 0, "a2": 0, "a3": 0},
            "days": mp,
        }
    return {
        "version": 2,
        "accounts": accounts,
        "months": months,
        "ui": {"themeTab": "auto"},
    }


def main():
    here = Path(__file__).resolve().parent
    in_path = Path(
        sys.argv[1]
        if len(sys.argv) > 1
        else Path.home()
        / ".cursor/projects/Users-Katsuya-fujinaga-Documents-hitobiji/uploads/edit-0.md"
    )
    out_path = Path(
        sys.argv[2] if len(sys.argv) > 2 else here / "import-output.json"
    )
    text = in_path.read_text(encoding="utf-8")
    order_lists = parse_export(text)
    by_month_days = assign_sequential_days(order_lists)
    state = build_state(by_month_days)
    out_path.write_text(
        json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    keys = ",".join(str(x) for x in sorted(order_lists.keys()))
    counts = {m: len(order_lists[m]) for m in sorted(order_lists.keys())}
    print(f"Wrote {out_path}", file=sys.stderr)
    print(f"months with rows: {keys}", file=sys.stderr)
    print(f"row counts per month: {counts}", file=sys.stderr)


if __name__ == "__main__":
    main()
