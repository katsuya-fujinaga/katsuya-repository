#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2つのお金のきろく v2 プリセット JSON を、月・日単位で合成する。

想定:
  - base（第1引数）: 全年プリセット（例: preset-2026-固定費-住信SBI.json）
  - overlay（第2引数）: 上書き用（例: 4月15日以降だけの preset-2026-固定費-住信SBI-4月14日以降.json）

ルール:
  - version / accounts / ui は base をそのまま使う
  - 各月: 両方にある日は overlay の days[日] を採用。overlay にない日は base を採用
  - openings は常に base の月を採用（base に月がなければ overlay）

使い方:
  python3 combine_cash_ledger_presets.py base.json overlay.json 出力.json
"""
import json
import sys
from copy import deepcopy


def merge_month(base_m, overlay_m):
    bo = deepcopy(base_m.get("openings") or {})
    bd = base_m.get("days") or {}
    od = overlay_m.get("days") or {}
    all_days = sorted(set(bd.keys()) | set(od.keys()), key=lambda x: int(x))
    days = {}
    for d in all_days:
        if d in od:
            days[d] = deepcopy(od[d])
        elif d in bd:
            days[d] = deepcopy(bd[d])
    return {"openings": bo, "days": days}


def main():
    if len(sys.argv) < 4:
        print(
            "使い方: python3 combine_cash_ledger_presets.py base.json overlay.json 出力.json",
            file=sys.stderr,
        )
        sys.exit(1)
    base_path, overlay_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]

    with open(base_path, encoding="utf-8") as f:
        base = json.load(f)
    with open(overlay_path, encoding="utf-8") as f:
        overlay = json.load(f)

    out = {
        "version": base.get("version", 2),
        "accounts": deepcopy(base.get("accounts") or []),
        "months": {},
        "ui": deepcopy(base.get("ui") or {"themeTab": "auto"}),
    }

    b_months = base.get("months") or {}
    o_months = overlay.get("months") or {}
    all_mk = sorted(set(b_months.keys()) | set(o_months.keys()))

    for mk in all_mk:
        b_m = b_months.get(mk)
        o_m = o_months.get(mk)
        if b_m and o_m:
            out["months"][mk] = merge_month(b_m, o_m)
        elif b_m:
            out["months"][mk] = deepcopy(b_m)
        else:
            out["months"][mk] = deepcopy(o_m)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"Wrote {out_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
