import sys
sys.path.insert(0, "/Users/Katsuya-fujinaga/Documents/github/.pip_libs")

from fpdf import FPDF

FONT_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
FONT_W6_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"
OUTPUT_PATH = "/Users/Katsuya-fujinaga/Documents/github/やさしく売れる占い師/個別相談/やさしく売れる占い師養成講座_ご案内資料.pdf"


class SummaryPDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("gothic", size=8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f"{self.page_no()}", align="C")


def build_pdf():
    pdf = SummaryPDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=25)
    pdf.set_margins(left=20, top=20, right=20)
    pdf.add_font("gothic", style="", fname=FONT_PATH)
    pdf.add_font("gothic_b", style="", fname=FONT_W6_PATH)

    W = pdf.w - pdf.l_margin - pdf.r_margin

    pdf.add_page()

    # ===== タイトル =====
    set_bold(pdf, 20)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 16, "やさしく売れる占い師養成講座", align="C", new_x="LMARGIN", new_y="NEXT")
    set_bold(pdf, 14)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, "ご案内資料", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    set_regular(pdf, 10)
    pdf.set_text_color(100, 100, 100)
    centered(pdf, "先日は個別説明会にご参加いただきありがとうございました。")
    centered(pdf, "説明会でお伝えした内容をこちらにまとめました。")
    pdf.ln(6)

    separator(pdf)

    # ===== 占い師という働き方 =====
    section(pdf, "占い師という働き方")

    body(pdf, "この講座が目指すのは「やさしく売れる占い師」という働き方です。")
    pdf.ln(3)
    body(pdf, "SNS集客は必要ありません。")
    body(pdf, "初期コストもかかりません。")
    body(pdf, "自分のペースで、自宅から始められます。")
    pdf.ln(3)
    body(pdf, "電話占い・チャット占いの会社に所属し、")
    bold_line(pdf, "待機して、相談が入ったら鑑定する。")
    body(pdf, "これが基本の働き方です。")
    pdf.ln(6)

    separator(pdf)

    # ===== 収入の目安 =====
    section(pdf, "収入の目安")

    body(pdf, "占い師の収入は「才能」ではなく「稼働時間」で決まります。")
    pdf.ln(4)

    table_header(pdf, W, ["稼働ペース", "月収の目安"])
    table_row(pdf, W, ["週3回・1回3〜4時間の待機", "約10万円"], bold_col=1)
    pdf.ln(3)

    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "※ お客様の多い夜の時間帯を基準に、待機時間の約7割が", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "　 実際に鑑定の入る稼働時間としての目安です。空き時間は自由に過ごせます。", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    body(pdf, "副業からでもこの水準を目指せます。")
    body(pdf, "稼働日数を増やせば、それに比例して収入は上がります。")
    pdf.ln(2)
    bold_line(pdf, "成果が出るかどうかは、個人の才能ではなく稼働時間の問題です。")
    pdf.ln(1)
    body(pdf, "だからこそ再現性が高い。")
    body(pdf, "正しいやり方を学べば、誰でも同じ結果を出せる仕組みです。")
    pdf.ln(6)

    separator(pdf)

    # ===== この講座で手に入るもの =====
    section(pdf, "この講座で手に入るもの")

    check(pdf, "3つの占術（数秘術・タロット・手相）を使った鑑定力")
    check(pdf, "相談者の心を開くカウンセリング技術")
    check(pdf, "電話占い・チャット占いの採用審査に合格できるスキル")
    check(pdf, "SNS集客なし・初期コストなしで始められる働き方")
    check(pdf, "講座は6ヶ月。サポートは一生続きます")
    pdf.ln(3)
    body(pdf, "6ヶ月で学びが終わるのではなく、")
    body(pdf, "卒業後もずっとサポートが受けられる環境です。")
    body(pdf, "一人で不安を抱える必要はありません。")
    pdf.ln(6)

    separator(pdf)

    # ===== 講座の概要 =====
    section(pdf, "講座の概要")

    table_header(pdf, W, ["項目", "内容"])
    table_row(pdf, W, ["期間", "6ヶ月間"])
    table_row(pdf, W, ["形式", "オンライン（Zoom）"])
    table_row(pdf, W, ["開始日", "2026年4月18日"])
    table_row(pdf, W, ["卒業後", "サポート継続（期限なし）"])
    pdf.ln(6)

    separator(pdf)

    # ===== 学ぶ内容 =====
    section(pdf, "学ぶ内容（3ステップ）")

    # --- STEP1 ---
    step(pdf, "STEP1｜占いの技術を身につける")
    pdf.ln(2)
    col_w3 = [W * 0.2, W * 0.4, W * 0.4]
    table_header_3(pdf, col_w3, ["占術", "授業", "練習"])
    table_row_3(pdf, col_w3, ["数秘術", "3時間 × 1回", ""])
    table_row_3(pdf, col_w3, ["タロット", "3時間 × 6回", "タロットマラソン 25回"])
    table_row_3(pdf, col_w3, ["手相", "2時間 × 6回", ""])
    pdf.ln(2)

    substep(pdf, "● タロット練習会　2時間 × 10回")
    body_indent(pdf, "本田先生 6回 ＋ 認定講師 4回")
    pdf.ln(1)
    body(pdf, "知識を詰め込むのではなく、")
    bold_line(pdf, "アウトプット中心の練習で「使える技術」を身につけます。")
    pdf.ln(5)

    # --- STEP2 ---
    step(pdf, "STEP2｜占いの伝え方を身につける")
    pdf.ln(2)
    body(pdf, "占いの価値は「当たるかどうか」ではなく")
    bold_line(pdf, "「どう伝えるか」で決まります。")
    pdf.ln(3)

    substep(pdf, "● カウンセリング講座　3時間 × 4回")
    body_indent(pdf, "特別講師：かおる先生（心理カウンセラー・占い師）")
    body_indent(pdf, "占い師として実際に使えるカウンセリングのスキルを学べます。")
    pdf.ln(3)

    substep(pdf, "● タロット伝え方講座　2時間")
    body_indent(pdf, "認定講師：あつこ先生（現役占い師）")
    body_indent(pdf, "伝え方、よくある相談例、答え方など現場の様子を詳しく解説します。")
    pdf.ln(5)

    # --- STEP3 ---
    step(pdf, "STEP3｜プロとして活動する方法を学ぶ")
    pdf.ln(2)
    body(pdf, "電話・チャット占い会社の採用審査対策を行います。")
    body(pdf, "チャットと音声、それぞれ何度も練習します。")
    pdf.ln(3)

    substep(pdf, "● グループ練習会（10回）")
    substep(pdf, "● 講師との1対1練習会（3回）")
    pdf.ln(2)
    bullet(pdf, "プロフィール作成サポート")
    bullet(pdf, "書類添削")
    bullet(pdf, "AI鑑定サポートツール")
    pdf.ln(6)

    separator(pdf)

    # ===== 6ヶ月のスケジュール =====
    section(pdf, "6ヶ月のスケジュール")

    table_header(pdf, W, ["時期", "内容"])
    table_row(pdf, W, ["1〜2ヶ月", "基本の占術を学ぶ"])
    table_row(pdf, W, ["3〜4ヶ月", "占術を極める・カウンセリング技術を身につける"])
    table_row(pdf, W, ["5〜6ヶ月", "採用審査対策・働き始めながらさらに技術を深める"])
    pdf.ln(3)

    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "※ 6ヶ月で占い師としてデビューできていない方は、", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "　 講師の集中サポートを3ヶ月間無料で受けられます。", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    # ===== サポート体制 =====
    section(pdf, "本田先生のサポート")

    body(pdf, "デビューした後も、占い師としての活動を永続的にサポートします。")
    pdf.ln(1)
    bold_line(pdf, "講師としての繋がりは一生。講座が終了してもサポートは続きます。")
    pdf.ln(6)

    separator(pdf)

    # ===== 8大特典 =====
    section(pdf, "8大特典")

    benefits = [
        "グループチャット（質問し放題）",
        "占い師名の命名サービス",
        "スタートアップコンサル",
        "本田先生の鑑定割引",
        "タロットカード",
        "他講座の割引",
        "手相動画講座",
        "延長サポート",
    ]
    for i, b in enumerate(benefits, 1):
        set_regular(pdf, 10)
        pdf.set_text_color(60, 60, 60)
        pdf.cell(0, 7, f"  {i}.  {b}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    # ===== 講師 =====
    section(pdf, "講師")

    set_bold(pdf, 12)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 8, "本田 有紀華（ほんだ ゆきか）", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    bullet(pdf, "占い師歴30年")
    bullet(pdf, "十数種類の占術をマスター")
    bullet(pdf, "指導生徒 累計1,500名以上")
    bullet(pdf, "プロ占い師 150名以上輩出")
    bullet(pdf, "元公立学校教師")
    pdf.ln(6)

    separator(pdf)

    # ===== 講座料金 =====
    section(pdf, "講座料金")

    step(pdf, "プレミアムコース")
    pdf.ln(2)
    table_header(pdf, W, ["区分", "価格"])
    table_row(pdf, W, ["通常価格", "770,000円"])
    table_row(pdf, W, ["説明会参加特別価格", "660,000円"], bold_col=1)
    table_row(pdf, W, ["銀行振込一括", "600,000円"], bold_col=1)
    pdf.ln(5)

    step(pdf, "ベーシックコース")
    pdf.ln(2)
    table_header(pdf, W, ["区分", "価格"])
    table_row(pdf, W, ["通常価格", "660,000円"])
    table_row(pdf, W, ["説明会参加特別価格", "550,000円"], bold_col=1)
    table_row(pdf, W, ["銀行振込一括", "500,000円"], bold_col=1)
    pdf.ln(6)

    separator(pdf)

    # ===== プレミアムとベーシックの違い =====
    section(pdf, "プレミアムとベーシックの違い")

    col_diff = [W * 0.5, W * 0.25, W * 0.25]
    table_header_3(pdf, col_diff, ["", "プレミアム", "ベーシック"])
    table_row_3(pdf, col_diff, ["STEP1（占いの技術習得）", "○", "○"])
    table_row_3(pdf, col_diff, ["STEP2（占いの伝え方習得）", "○", "○"])
    table_row_3(pdf, col_diff, ["STEP3（採用審査対策・プロ活動サポート）", "○", "ー"])
    pdf.ln(3)
    body(pdf, "プレミアムコースには、電話・チャット占い会社への採用審査対策（STEP3）が含まれます。")
    body(pdf, "占い師としてプロデビューを目指す方はプレミアムコースがおすすめです。")
    pdf.ln(6)

    separator(pdf)

    # ===== お支払い方法 =====
    section(pdf, "お支払い方法")

    step(pdf, "銀行振込（一括）")
    pdf.ln(2)
    body(pdf, "消費税分を割引した特別価格でお申し込みいただけます。")
    bold_line(pdf, "もっともお得なお支払い方法です。")
    pdf.ln(5)

    step(pdf, "分割払い（入学金＋11回払い）")
    pdf.ln(3)

    col_w4 = [W * 0.22, W * 0.22, W * 0.28, W * 0.28]
    table_header_4(pdf, col_w4, ["コース", "総額", "入学金（初回）", "月々（11回）"])
    table_row_4(pdf, col_w4, ["プレミアム", "689,000円", "150,000円", "49,000円 × 11回"])
    table_row_4(pdf, col_w4, ["ベーシック", "580,000円", "140,000円", "44,000円 × 11回"])
    pdf.ln(6)

    separator(pdf)

    # ===== よくあるご質問 =====
    section(pdf, "よくあるご質問")

    qa(pdf,
       "Q. 占い未経験でも大丈夫ですか？",
       ["はい。受講生のほとんどが未経験スタートです。",
        "ゼロから学べるカリキュラムなのでご安心ください。"])

    qa(pdf,
       "Q. 仕事や家事と両立できますか？",
       ["オンライン受講で、録画も残ります。",
        "お子さんがいる方、フルタイム勤務の方も多く受講されています。"])

    qa(pdf,
       "Q. 本当に稼げるようになりますか？",
       ["収入は稼働時間に比例します。",
        "週3回・1回3〜4時間の待機で月10万円が目安です。",
        "才能ではなく「やるかどうか」で決まります。"])

    qa(pdf,
       "Q. 年齢は関係ありますか？",
       ["まったく関係ありません。",
        "50代・60代からプロになった方も多くいます。",
        "占い師は人生経験がそのまま武器になる仕事です。"])

    qa(pdf,
       "Q. 6ヶ月で本当に身につきますか？",
       ["6ヶ月のカリキュラムでプロデビューまで導きます。",
        "さらに卒業後もサポートは一生続くので、",
        "焦らずご自身のペースで成長できます。"])

    qa(pdf,
       "Q. 講座代は回収できますか？",
       ["月10万円の収入ペースであれば、",
        "ベーシックコースは約5〜6ヶ月で回収できる計算です。"])

    pdf.ln(2)
    separator(pdf)

    # ===== お申し込み・ご相談 =====
    section(pdf, "お申し込み・ご相談")

    body(pdf, "ご不明な点やお支払いのご相談は")
    body(pdf, "お気軽に事務局LINEまでご連絡ください。")
    pdf.ln(4)
    set_bold(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 7, "担当：事務局", new_x="LMARGIN", new_y="NEXT")

    pdf.output(OUTPUT_PATH)
    print(f"PDF generated: {OUTPUT_PATH}")


# ===== Helpers =====

def set_regular(pdf, size):
    pdf.set_font("gothic", size=size)

def set_bold(pdf, size):
    pdf.set_font("gothic_b", size=size)

def separator(pdf):
    pdf.set_draw_color(200, 200, 200)
    y = pdf.get_y()
    pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
    pdf.ln(6)

def section(pdf, text):
    set_bold(pdf, 15)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 12, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

def step(pdf, text):
    set_bold(pdf, 11)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 9, text, new_x="LMARGIN", new_y="NEXT")

def body(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 6.5, text, new_x="LMARGIN", new_y="NEXT")

def bold_line(pdf, text):
    set_bold(pdf, 10)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 6.5, text, new_x="LMARGIN", new_y="NEXT")

def centered(pdf, text):
    pdf.cell(0, 6.5, text, align="C", new_x="LMARGIN", new_y="NEXT")

def check(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 7.5, f"  ✓  {text}", new_x="LMARGIN", new_y="NEXT")

def substep(pdf, text):
    set_bold(pdf, 10)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")

def body_indent(pdf, text):
    set_regular(pdf, 9.5)
    pdf.set_text_color(80, 80, 80)
    pdf.set_x(pdf.l_margin + 8)
    pdf.cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")

def bullet(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.set_x(pdf.l_margin + 4)
    pdf.cell(0, 7, f"・ {text}", new_x="LMARGIN", new_y="NEXT")

def table_header(pdf, w, cols):
    col_w = w / len(cols)
    set_bold(pdf, 9.5)
    pdf.set_fill_color(245, 245, 245)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for c in cols:
        pdf.cell(col_w, 8, f"  {c}", border=1, fill=True)
    pdf.ln()

def table_row(pdf, w, cols, bold_col=-1):
    col_w = w / len(cols)
    pdf.set_draw_color(200, 200, 200)
    for i, c in enumerate(cols):
        if i == bold_col:
            set_bold(pdf, 9.5)
            pdf.set_text_color(40, 40, 40)
        else:
            set_regular(pdf, 9.5)
            pdf.set_text_color(60, 60, 60)
        pdf.cell(col_w, 8, f"  {c}", border=1)
    pdf.ln()

def table_header_3(pdf, col_ws, cols):
    set_bold(pdf, 9.5)
    pdf.set_fill_color(245, 245, 245)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f"  {c}", border=1, fill=True)
    pdf.ln()

def table_row_3(pdf, col_ws, cols):
    set_regular(pdf, 9.5)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f"  {c}", border=1)
    pdf.ln()

def table_header_4(pdf, col_ws, cols):
    set_bold(pdf, 9)
    pdf.set_fill_color(245, 245, 245)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f" {c}", border=1, fill=True)
    pdf.ln()

def table_row_4(pdf, col_ws, cols):
    set_regular(pdf, 9)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f" {c}", border=1)
    pdf.ln()

def qa(pdf, question, answer_lines):
    set_bold(pdf, 10.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 8, question, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)
    set_regular(pdf, 9.5)
    pdf.set_text_color(90, 90, 90)
    for line in answer_lines:
        pdf.set_x(pdf.l_margin + 6)
        pdf.cell(0, 5.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)


if __name__ == "__main__":
    build_pdf()
