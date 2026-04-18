#!/usr/bin/env python3
"""セミナーシナリオ .md → HTML。

- 既定: 本文フラグメントを標準出力
- --write-html: 次を上書き保存
    - セミナーシナリオ_完成版テキスト.html（product）
    - ../../tools/ffs-seminar/index.html（Web用・katsuya-repository の tools/ 配下）
"""
import re
import sys
from pathlib import Path


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def bold(s: str) -> str:
    parts = re.split(r"(\*\*.+?\*\*)", s)
    out = []
    for p in parts:
        if p.startswith("**") and p.endswith("**") and len(p) >= 4:
            out.append("<strong>" + esc(p[2:-2]) + "</strong>")
        else:
            out.append(esc(p))
    return "".join(out)


def line_html(line: str) -> str:
    line = line.rstrip()
    if not line.strip():
        return ""
    if line.strip() == "---":
        return "<hr>"
    return "<p>" + bold(line) + "</p>"


def parse_table(lines: list[str], i: int) -> tuple[str, int]:
    rows = []
    j = i
    while j < len(lines) and lines[j].strip().startswith("|"):
        row = lines[j].strip()
        if re.match(r"^\|[\s\-:|]+\|$", row.replace(" ", "")):
            j += 1
            continue
        cells = [c.strip() for c in row.split("|")[1:-1]]
        rows.append(cells)
        j += 1
    if not rows:
        return "", i
    html = ["<table>"]
    html.append("<tr>" + "".join(f"<th>{bold(c)}</th>" for c in rows[0]) + "</tr>")
    for r in rows[1:]:
        html.append("<tr>" + "".join(f"<td>{bold(c)}</td>" for c in r) + "</tr>")
    html.append("</table>")
    return "\n".join(html), j


def md_to_html(md: str) -> str:
    lines = md.split("\n")
    # タイトル・メタ（# 〜 最初の --- まで）はテンプレ側で出すのでスキップ
    start = 0
    for idx, line in enumerate(lines):
        if line.strip() == "## このシナリオの読み方":
            start = idx
            break
    lines = lines[start:]
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()

        if s.startswith("## "):
            out.append(f"<h2>{bold(s[3:])}</h2>")
            i += 1
            continue
        if s.startswith("### "):
            out.append(f"<h3>{bold(s[4:])}</h3>")
            i += 1
            continue
        if s.startswith("|") and "|" in s[1:]:
            block, ni = parse_table(lines, i)
            if block:
                out.append(block)
                i = ni
                continue
        if s.startswith("- "):
            items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                items.append("<li>" + bold(lines[i].strip()[2:]) + "</li>")
                i += 1
            out.append("<ul>\n" + "\n".join(items) + "\n</ul>")
            continue
        if re.match(r"^\d+\.\s", s):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s", lines[i].strip()):
                rest = re.sub(r"^\d+\.\s", "", lines[i].strip())
                items.append("<li>" + bold(rest) + "</li>")
                i += 1
            out.append("<ol>\n" + "\n".join(items) + "\n</ol>")
            continue
        if s == "---":
            out.append("<hr>")
            i += 1
            continue
        h = line_html(line)
        if h:
            out.append(h)
        i += 1
    return "\n".join(out)


BASE_CSS = """
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    body { font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Yu Gothic", Meiryo, "Noto Sans JP", sans-serif; line-height: 1.7; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 1.5em; border-bottom: 2px solid #2c3e9a; padding-bottom: 8px; margin-top: 0; }
    h2 { font-size: 1.2em; color: #2c3e9a; margin-top: 1.8em; }
    h3 { font-size: 1.05em; margin-top: 1.2em; color: #334155; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.9em; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; }
    hr { border: none; border-top: 1px solid #ddd; margin: 2em 0; }
    ul, ol { margin: 0.5em 0; padding-left: 1.5em; }
    li { margin: 0.3em 0; }
    strong { color: #1e3a8a; }
    .meta { color: #666; font-size: 0.95em; margin: 1em 0; }
    p { margin: 0.8em 0; }
"""

NAV_CSS = """
    .doc-nav { margin: -40px -40px 24px -40px; padding: 14px 40px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; }
    .doc-nav a { color: #2c3e9a; font-weight: 600; text-decoration: none; }
    .doc-nav a:hover { text-decoration: underline; }
    .doc-nav span { color: #64748b; font-size: 0.9em; }
    @media (max-width: 600px) {
      body { padding: 24px 16px; }
      .doc-nav { margin: -24px -16px 20px -16px; padding: 12px 16px; }
    }
"""

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#2c3e9a">
  <title>セミナーシナリオ｜迷いを戦略に変えるマネジメント構造セミナー</title>
  <style>{css}
  </style>
</head>
<body>
{nav}
  <h1>セミナーシナリオ｜迷いを戦略に変えるマネジメント構造セミナー</h1>
  <p class="meta"><strong>講師</strong>：岩田望美　<strong>想定時間</strong>：90分（本編60分＋オファー30分）　<strong>対象</strong>：小さなチームを持つ静かなリーダー層（女性ホルダー中心）</p>
  <hr>
{frag}
  <script>
    console.log('Cmd+P / Ctrl+P でPDF保存可');
  </script>
</body>
</html>
"""


def write_html_pair(frag: str, product_html: Path, tools_html: Path) -> None:
    product_html.write_text(
        PAGE_TEMPLATE.format(
            desc="FFSコーチング「迷いを戦略に変えるマネジメント構造セミナー」台本（岩田望美・90分）。md版と同期。",
            css=BASE_CSS,
            nav="",
            frag=frag,
        ),
        encoding="utf-8",
    )
    tools_nav = """  <nav class="doc-nav" aria-label="サイト内ナビ">
    <a href="../index.html">← ツール一覧</a>
    <a href="../katsuya-taskboard/index.html">Katsuya Board</a>
    <span>FFS · セミナー台本</span>
  </nav>
"""
    tools_html.write_text(
        PAGE_TEMPLATE.format(
            desc="FFSコーチング「迷いを戦略に変えるマネジメント構造セミナー」台本（岩田望美・90分）。tools/ffs-seminar/ で公開。",
            css=BASE_CSS + NAV_CSS,
            nav=tools_nav,
            frag=frag,
        ),
        encoding="utf-8",
    )


def main() -> None:
    p = Path(__file__).with_name("セミナーシナリオ_完成版テキスト.md")
    md = p.read_text(encoding="utf-8")
    frag = md_to_html(md)
    if "--write-html" in sys.argv:
        here = Path(__file__).resolve().parent
        repo = here
        while not (repo / ".git").exists():
            parent = repo.parent
            if parent == repo:
                raise SystemExit(f"Could not find repository root (.git) from {here}")
            repo = parent
        ffs_dir = repo / "tools/ffs-seminar"
        ffs_dir.mkdir(parents=True, exist_ok=True)
        write_html_pair(
            frag,
            here / "セミナーシナリオ_完成版テキスト.html",
            ffs_dir / "index.html",
        )
        print("Wrote セミナーシナリオ_完成版テキスト.html, tools/ffs-seminar/index.html")
        return
    print(frag)


if __name__ == "__main__":
    main()
