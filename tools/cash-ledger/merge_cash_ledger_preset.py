#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
既存のお金のきろく JSON（エクスポート）に、差分プリセットの月・日を上書きマージする。

使い方:
  python3 merge_cash_ledger_preset.py いまのデータ.json preset-差分.json 出力.json

- base の version / accounts / ui はそのまま維持
- delta にある各月について、delta.days に含まれる「日」だけを base に反映（その日の lines を置き換え）
- delta にない月は base を変更しない
"""
import json
import sys
from copy import deepcopy


def main():
    if len(sys.argv) < 4:
        print(
            "使い方: python3 merge_cash_ledger_preset.py ベース.json 差分プリセット.json 出力.json",
            file=sys.stderr,
        )
        sys.exit(1)
    base_path, delta_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]

    with open(base_path, encoding="utf-8") as f:
        base = json.load(f)
    with open(delta_path, encoding="utf-8") as f:
        delta = json.load(f)

    if not isinstance(base.get("months"), dict):
        base["months"] = {}
    account_ids = [a["id"] for a in base.get("accounts") or []]

    for mk, mdat in (delta.get("months") or {}).items():
        if not isinstance(mdat, dict):
            continue
        if mk not in base["months"]:
            openings = {aid: 0 for aid in account_ids}
            for aid, v in (mdat.get("openings") or {}).items():
                if aid in openings:
                    openings[aid] = v
            base["months"][mk] = {"openings": openings, "days": {}}
        b = base["months"][mk]
        if "openings" not in b:
            b["openings"] = {aid: 0 for aid in account_ids}
        if "days" not in b:
            b["days"] = {}
        # 既に入っている月初残高は触らない（delta の openings で上書きしない）
        d_days = mdat.get("days") or {}
        for day_key, day_val in d_days.items():
            b["days"][day_key] = deepcopy(day_val)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(base, f, ensure_ascii=False, indent=2)
    print(f"Wrote {out_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
