#!/usr/bin/env python3
import sys
import re

# .pip_libs または システムの fpdf2 を使用
for path in ["/Users/Katsuya-fujinaga/Documents/github/.pip_libs", "/Users/Katsuya-fujinaga/Documents/github/pip_libs"]:
    if __import__("pathlib").Path(path).exists():
        sys.path.insert(0, path)
        break

from fpdf import FPDF

FONT_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
FONT_W6_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"
INPUT_PATH = "/Users/Katsuya-fujinaga/Documents/github/FFSコーチング/セミナーシナリオ_完成版テキスト.md"
OUTPUT_PATH = "/Users/Katsuya-fujinaga/Documents/github/FFSコーチング/セミナーシナリオ_完成版テキスト.pdf"


class ScenarioPDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("gothic", size=8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f"{self.page_no()}", align="C")


def set_regular(pdf, size):
    pdf.set_font("gothic", size=size)


def set_bold(pdf, size):
    pdf.set_font("gothic_b", size=size)


def write_line(pdf, text, size=10, bold=False, indent=0):
    """1行を描画（改行あり）"""
    if bold:
        set_bold(pdf, size)
    else:
        set_regular(pdf, size)
    pdf.set_x(pdf.l_margin + indent)
    pdf.multi_cell(0, size * 0.5, text)


def write_bullet(pdf, text, size=10):
    """箇条書きを描画"""
    set_regular(pdf, size)
    pdf.set_x(pdf.l_margin + 8)
    pdf.multi_cell(0, size * 0.5, f"・ {text}")


def parse_bold(text):
    """**bold** を (text, bold) のタプルリストに分解"""
    result = []
    pattern = r'\*\*(.+?)\*\*'
    last_end = 0
    for m in re.finditer(pattern, text):
        if m.start() > last_end:
            result.append((text[last_end:m.start()], False))
        result.append((m.group(1), True))
        last_end = m.end()
    if last_end < len(text):
        result.append((text[last_end:], False))
    return result if result else [(text, False)]


def write_mixed(pdf, text, size=10, indent=0):
    """**bold** を混在させて描画（シンプル版：太字は維持してmulti_cellで折り返し）"""
    parts = parse_bold(text)
    if not parts:
        return
    pdf.set_x(pdf.l_margin + indent)
    for s, is_bold in parts:
        if is_bold:
            set_bold(pdf, size)
        else:
            set_regular(pdf, size)
        pdf.multi_cell(0, size * 0.5, s)
    pdf.set_x(pdf.l_margin)


def parse_table(lines):
    """Markdownテーブルをパース"""
    rows = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("|---"):
            continue
        cells = [c.strip() for c in line.split("|") if c.strip()]
        if cells:
            rows.append(cells)
    return rows


def build_pdf():
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    pdf = ScenarioPDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=25)
    pdf.set_margins(left=20, top=20, right=20)
    pdf.add_font("gothic", style="", fname=FONT_PATH)
    pdf.add_font("gothic_b", style="", fname=FONT_W6_PATH)

    W = pdf.w - pdf.l_margin - pdf.r_margin
    lines = content.split("\n")
    i = 0
    table_buffer = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # 表の開始
        if stripped.startswith("|"):
            table_buffer = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_buffer.append(lines[i])
                i += 1
            rows = parse_table(table_buffer)
            if rows:
                pdf.ln(3)
                for row_idx, row in enumerate(rows):
                    if row_idx == 0:
                        set_bold(pdf, 8)
                    else:
                        set_regular(pdf, 7)
                    row_text = " | ".join(cell[:35] for cell in row)
                    pdf.multi_cell(0, 5, row_text)
                pdf.ln(3)
            continue

        # 見出し1
        if stripped.startswith("# "):
            set_bold(pdf, 18)
            pdf.set_text_color(40, 40, 40)
            write_line(pdf, stripped[2:].strip(), size=18, bold=True)
            pdf.ln(4)
            i += 1
            continue

        # 見出し2
        if stripped.startswith("## "):
            pdf.ln(4)
            set_bold(pdf, 14)
            pdf.set_text_color(50, 50, 50)
            write_line(pdf, stripped[3:].strip(), size=14, bold=True)
            pdf.ln(2)
            i += 1
            continue

        # 見出し3
        if stripped.startswith("### "):
            pdf.ln(2)
            set_bold(pdf, 12)
            pdf.set_text_color(70, 70, 70)
            write_line(pdf, stripped[4:].strip(), size=12, bold=True)
            pdf.ln(1)
            i += 1
            continue

        # 水平線
        if stripped == "---" or stripped.startswith("---"):
            pdf.ln(2)
            pdf.set_draw_color(200, 200, 200)
            y = pdf.get_y()
            pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
            pdf.ln(4)
            i += 1
            continue

        # 箇条書き
        if stripped.startswith("- ") and not stripped.startswith("- **"):
            write_bullet(pdf, stripped[2:].strip())
            i += 1
            continue

        # 箇条書き（太字含む）
        if re.match(r'^- \*\*', stripped):
            write_line(pdf, stripped[2:].strip(), bold=True)
            i += 1
            continue

        # 空行
        if not stripped:
            pdf.ln(2)
            i += 1
            continue

        # 通常テキスト（**含む）
        pdf.set_text_color(50, 50, 50)
        write_mixed(pdf, stripped)
        i += 1

    pdf.output(OUTPUT_PATH)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
