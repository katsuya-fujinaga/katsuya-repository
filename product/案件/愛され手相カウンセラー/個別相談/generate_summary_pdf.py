import sys
sys.path.insert(0, "/Users/Katsuya-fujinaga/Documents/github/.pip_libs")

from fpdf import FPDF

FONT_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
FONT_W6_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"
OUTPUT_PATH = "/Users/Katsuya-fujinaga/Documents/hitobiji/product/案件/愛され手相カウンセラー/お客様配布資料/愛され手相カウンセラー養成講座_ご案内資料.pdf"


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

    set_bold(pdf, 20)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 16, "愛され手相カウンセラー養成講座", align="C", new_x="LMARGIN", new_y="NEXT")
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

    section(pdf, "愛され手相カウンセラーという働き方")

    body(pdf, "この講座が目指すのは「愛され手相カウンセラー」という働き方です。")
    pdf.ln(3)
    body(pdf, "派手なSNS集客は必要ありません。")
    body(pdf, "高額な初期投資もかかりません。")
    bold_line(pdf, "自分のペースで、自宅から始められます。")
    pdf.ln(3)
    body(pdf, "手相は占いのなかでも、特に")
    bold_line(pdf, "「人と直接会って喜ばれる」入り口として最適な占術です。")
    pdf.ln(2)
    body(pdf, "「相談者の手を取って読み解く」というシンプルさが、")
    body(pdf, "お客様との距離をぐっと近づけてくれます。")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "5つの働き方が選べます")

    body(pdf, "ご自身の暮らしに合わせて、")
    body(pdf, "1つでも、複数組み合わせてもOKです。")
    pdf.ln(4)

    col_5w = [W * 0.30, W * 0.40, W * 0.30]
    table_header_3(pdf, col_5w, ["働き方", "場所・媒体", "収入の目安"])
    table_row_3(pdf, col_5w, ["① 鑑定書を販売", "ココナラ・メルカリ", "1件 5,000円〜"])
    table_row_3(pdf, col_5w, ["② オンライン鑑定", "ココナラなど", "1回 5,000〜10,000円"])
    table_row_3(pdf, col_5w, ["③ 対面鑑定", "マルシェ・自宅サロン", "1回 5,000〜10,000円"])
    table_row_3(pdf, col_5w, ["④ 教える先生（オンライン）", "ストアカなど", "1回 数千円〜2万円前後（内容による）"])
    table_row_3(pdf, col_5w, ["⑤ 教える先生（対面）", "カルチャーセンター・地域", "1回 5,000〜15,000円前後（実績により2万円前後も）"])
    pdf.ln(4)
    set_regular(pdf, 9)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 5, "ストアカ・カルチャーセンターの料金は、短い体験なら千円台、本格的な1回なら5,000円〜15,000円前後が多いです。", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "まとめて何回か学ぶ講座だと、2万円前後になることもあります。", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.cell(0, 5, "※ あくまで一般的な目安です。内容・時間・地域で変わります。", new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(60, 60, 60)
    pdf.ln(6)

    separator(pdf)

    section(pdf, "収入の目安")

    body(pdf, "手相鑑定は、占術のなかでもリピートされやすいのが特徴です。")
    body(pdf, "「友人に紹介したい」と言われやすく、口コミで広がっていきます。")
    pdf.ln(4)

    col_inc = [W * 0.65, W * 0.35]
    table_header_3(pdf, col_inc, ["活動ペース", "月収の目安"])
    table_row_3_b(pdf, col_inc, ["副業｜鑑定書 月10件＋週末マルシェ月2回", "約 5〜10万円"], bold_col=1)
    table_row_3_b(pdf, col_inc, ["副業｜オンライン鑑定 週3〜4日", "約 10〜15万円"], bold_col=1)
    table_row_3_b(pdf, col_inc, ["本業｜対面鑑定 週4日（横浜中華街などの実例）", "約 20万円〜"], bold_col=1)
    table_row_3_b(pdf, col_inc, ["本業｜先生として月2回開催", "20〜30万円"], bold_col=1)
    pdf.ln(3)

    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "※ 受講生 寺澤祐義さん（69歳）：横浜中華街で週4日鑑定／月収 約20万円", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "※ 受講生 あすみさん（35歳）：派遣OL × 副業／鑑定書 月10件で 約5万円", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    body(pdf, "成果は「才能」ではなく")
    bold_line(pdf, "「学んだ後にどれだけ動くか」で決まります。")
    pdf.ln(2)
    body(pdf, "正しい型と練習量があれば、誰でも同じ道を歩けるよう")
    body(pdf, "再現性のあるカリキュラムを組んでいます。")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "この講座で手に入るもの")

    check(pdf, "初対面の方の手相を、自信を持って読める鑑定スキル")
    check(pdf, "5,000〜10,000円の鑑定料を、堂々と受け取れる「型」")
    check(pdf, "「先生」と呼ばれて教えられる立場（手相の先生コースの場合）")
    check(pdf, "育成したプロ占い師150名以上の実例から組まれた再現性の高いメソッド")
    check(pdf, "講座終了後も本田先生のサポートは一生続きます")
    pdf.ln(3)
    body(pdf, "3ヶ月（または2ヶ月）で学びが終わるのではなく、")
    body(pdf, "卒業後もずっとサポートが受けられる環境です。")
    body(pdf, "一人で不安を抱える必要はありません。")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "講座の概要")

    table_header(pdf, W, ["項目", "内容"])
    table_row(pdf, W, ["期間", "2〜3ヶ月（コースにより）"])
    table_row(pdf, W, ["形式", "オンライン（Zoom）／アーカイブ視聴可"])
    table_row(pdf, W, ["開始日", "2026年5月19日"])
    table_row(pdf, W, ["卒業後", "サポート継続（期限なし）"])
    pdf.ln(6)

    separator(pdf)

    section(pdf, "学ぶ内容（2ステップ）")

    step(pdf, "STEP1｜手相を読めるようになる（2ヶ月）")
    pdf.ln(2)

    substep(pdf, "● 手相講座　2時間 × 5回")
    body_indent(pdf, "累計1,000人以上に教えてきた、再現性の高い内容です。")
    pdf.ln(2)

    table_header(pdf, W, ["回", "テーマ"])
    table_row(pdf, W, ["1回目", "手の形"])
    table_row(pdf, W, ["2回目", "生命線・知能線"])
    table_row(pdf, W, ["3回目", "感情線・運命線"])
    table_row(pdf, W, ["4回目", "太陽線・財運線・結婚線"])
    table_row(pdf, W, ["5回目", "その他の線"])
    pdf.ln(3)

    substep(pdf, "● 手相練習会　1.5時間 × 3回（グループ）")
    pdf.ln(2)
    table_header(pdf, W, ["練習", "内容"])
    table_row(pdf, W, ["練習①", "3分鑑定の方法（型を身につける）"])
    table_row(pdf, W, ["練習②", "鑑定書の作り方（価値を上げる）"])
    table_row(pdf, W, ["練習③", "10分鑑定の方法（お金をいただけるレベル）"])
    pdf.ln(3)

    body(pdf, "知識を詰め込むだけでなく、")
    bold_line(pdf, "アウトプット中心の練習で「使える技術」を身につけます。")
    pdf.ln(5)

    step(pdf, "STEP2｜手相の「先生」になる（プラス1ヶ月）")
    pdf.ln(2)
    body(pdf, "アンビシャス占いの学校認定の「手相先生」になるステップです。")
    body(pdf, "ストアカやカルチャーセンターで活動できるようになります。")
    pdf.ln(3)

    col_s2 = [W * 0.10, W * 0.20, W * 0.70]
    table_header_3(pdf, col_s2, ["回", "時間", "内容"])
    table_row_3(pdf, col_s2, ["❶", "2時間", "教え方の型・教える練習・台本に沿った実践"])
    table_row_3(pdf, col_s2, ["❷", "2時間", "ミニ講座実習・本田先生からのフィードバック"])
    table_row_3(pdf, col_s2, ["❸", "3時間", "ストアカ登録方法・選ばれる投稿のコツ・決済"])
    pdf.ln(3)

    body(pdf, "教材は配布のテキストをそのまま使ってOK。")
    bold_line(pdf, "台本／教え方の動画／指導書がすべて揃っているので、")
    body(pdf, "教えるのが初めての方でも安心です。")
    pdf.ln(2)
    body(pdf, "本田先生のストアカでの実績は累計1,614人。講座賞も受賞済みです。")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "講座のスケジュール")

    table_header(pdf, W, ["時期", "内容"])
    table_row(pdf, W, ["1ヶ月目", "手相講座（基礎）＋練習会開始"])
    table_row(pdf, W, ["2ヶ月目", "手相講座（応用）＋練習会で実践力UP"])
    table_row(pdf, W, ["3ヶ月目", "「手相の先生コース」のみ：教え方・サイト登録・実習"])
    pdf.ln(3)

    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "※ 各講座はアーカイブ動画視聴だけでも十分学べる構成です。", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "※ お子さん・お仕事・介護のご都合で都度参加できなくても大丈夫です。", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "本田先生のサポート")

    body(pdf, "デビューした後も、愛され手相カウンセラーとしての活動を")
    bold_line(pdf, "永続的にサポートします。")
    pdf.ln(2)
    bold_line(pdf, "講座が終了してもサポートは続きます。")
    body(pdf, "質問・相談はいつでもお気軽にどうぞ。")
    pdf.ln(3)
    body(pdf, "加えて、同期生・先輩受講生のコミュニティにもご招待。")
    body(pdf, "東京・大阪で開催する「占い祭り」など、")
    bold_line(pdf, "仲間と学び合えるリアルなイベントも多数あります。")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "5大特典")

    benefits = [
        "養成講座メンバー専用グループチャット（質問し放題）",
        "AI鑑定サポートツール（本田先生開発・無償提供）",
        "本田先生の鑑定 3,000円（通常 15,000円相当）が利用し放題",
        "他講座 受講料 10% OFF（期間制限なし）",
        "「愛され手相カウンセラー」動画講座（59,800円）を無料プレゼント",
    ]
    for i, b in enumerate(benefits, 1):
        set_regular(pdf, 10)
        pdf.set_text_color(60, 60, 60)
        pdf.cell(0, 7, f"  {i}.  {b}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "※ 動画視聴コースは①グループチャットのみ対象（②〜⑤は対象外）。", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    separator(pdf)

    section(pdf, "3日以内お申込み特典")

    body(pdf, "個別説明会より3日以内にお申込みいただき、")
    body(pdf, "銀行振込 または クレジット一括 でお支払いいただいた方限定。")
    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "（動画視聴コースは対象外）", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 7, "  1.  お絵かき手相鑑定 講座 参加権利（1時間Zoom／6月末開催）", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "  2.  本田先生のガチ鑑定（あなたが選ぶ占術で）", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "  3.  ペンデュラム本体 ＆ 動画講座（浄化と開運エネルギー込み）", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "講師")

    set_bold(pdf, 12)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 8, "本田 有紀華（ほんだ ゆきか）", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    bullet(pdf, "占い師歴30年以上")
    bullet(pdf, "十数種類の占術をマスター")
    bullet(pdf, "指導生徒 累計1,500名以上")
    bullet(pdf, "プロ占い師 150名以上輩出")
    bullet(pdf, "元公立学校教師（教える技術が体系的）")
    bullet(pdf, "ストアカ累計受講者 1,614名・講座賞受賞")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "講座料金（3つのコース）")

    step(pdf, "① 手相の先生コース（3ヶ月）")
    pdf.ln(2)
    body(pdf, "STEP1 ＋ STEP2 のフルパッケージ。")
    bold_line(pdf, "「手相を教える先生」を目指すコース。")
    pdf.ln(2)
    table_header(pdf, W, ["区分", "価格"])
    table_row(pdf, W, ["通常価格（クレジット・分割）", "330,000円"])
    table_row(pdf, W, ["銀行振込一括", "300,000円"], bold_col=1)
    pdf.ln(5)

    step(pdf, "② 愛され手相カウンセラーコース（2ヶ月）")
    pdf.ln(2)
    body(pdf, "STEP1 のみ。")
    bold_line(pdf, "「鑑定をするカウンセラー」を目指すコース。")
    pdf.ln(2)
    table_header(pdf, W, ["区分", "価格"])
    table_row(pdf, W, ["通常価格（クレジット・分割）", "220,000円"])
    table_row(pdf, W, ["銀行振込一括", "200,000円"], bold_col=1)
    pdf.ln(5)

    step(pdf, "③ 動画視聴コース（視聴期限なし）")
    pdf.ln(2)
    body(pdf, "ご自身のペースで動画を視聴して学ぶコース。")
    bold_line(pdf, "「まずは独学で始めてみたい方」向け。")
    pdf.ln(2)
    table_header(pdf, W, ["区分", "価格"])
    table_row(pdf, W, ["銀行振込一括 または クレジット", "59,800円"], bold_col=1)
    pdf.ln(3)
    body(pdf, "特典①｜グループチャットでの質問のみご利用いただけます（②〜⑤は対象外）。")
    body(pdf, "なお、Zoomの講座や練習会への参加はできません。")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "コースの違い")

    col_diff = [W * 0.40, W * 0.20, W * 0.20, W * 0.20]
    table_header_4(pdf, col_diff, ["", "手相の先生", "愛され手相カウンセラー", "動画視聴"])
    table_row_4(pdf, col_diff, ["STEP1（手相鑑定スキル）", "○", "○", "○（動画のみ）"])
    table_row_4(pdf, col_diff, ["STEP2（教える技術）", "○", "×", "×"])
    table_row_4(pdf, col_diff, ["練習会・実習（Zoom）", "○", "○", "×"])
    table_row_4(pdf, col_diff, ["グループチャット", "○", "○", "○"])
    table_row_4(pdf, col_diff, ["5大特典（①〜⑤）", "○", "○", "①のみ"])
    pdf.ln(3)

    set_regular(pdf, 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 5, "※ 動画視聴コースはグループチャットで質問はできますが、", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "　 Zoomの講座や練習会に参加することはできません。", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    body(pdf, "「教える側」まで目指すなら → 手相の先生コース")
    body(pdf, "「鑑定でしっかり活動したい」なら → 愛され手相カウンセラーコース")
    body(pdf, "「まずは自分のペースで始めたい」なら → 動画視聴コース")
    pdf.ln(6)

    separator(pdf)

    section(pdf, "お支払い方法（全パターン）")

    step(pdf, "① 手相の先生コース")
    pdf.ln(2)
    col_pay = [W * 0.30, W * 0.22, W * 0.48]
    table_header_3(pdf, col_pay, ["お支払い方法", "合計（税込）", "内訳"])
    table_row_3_b(pdf, col_pay, ["銀行一括振込", "300,000円", "一括"], bold_col=1)
    table_row_3(pdf, col_pay, ["クレジットカード払い", "330,000円", "一括"])
    table_row_3(pdf, col_pay, ["PayPal 10回分割払い", "343,000円", "① 入学金 100,000 ／ ②〜⑩ 27,000"])
    pdf.ln(5)

    step(pdf, "② 愛され手相カウンセラーコース")
    pdf.ln(2)
    table_header_3(pdf, col_pay, ["お支払い方法", "合計（税込）", "内訳"])
    table_row_3_b(pdf, col_pay, ["銀行一括振込", "200,000円", "一括"], bold_col=1)
    table_row_3(pdf, col_pay, ["クレジットカード払い", "220,000円", "一括"])
    table_row_3(pdf, col_pay, ["PayPal 10回分割払い", "240,000円", "① 入学金 78,000 ／ ②〜⑩ 18,000"])
    pdf.ln(5)

    bold_line(pdf, "①②コースは、銀行一括振込がもっともお得なお支払い方法です。")
    pdf.ln(5)

    step(pdf, "③ 動画視聴コース")
    pdf.ln(2)
    table_header(pdf, W, ["お支払い方法", "合計（税込）"])
    table_row(pdf, W, ["銀行振込一括 または クレジット", "59,800円"], bold_col=1)
    pdf.ln(6)

    separator(pdf)

    section(pdf, "よくあるご質問")

    qa(pdf,
       "Q. 手相は未経験ですが、私にもできますか？",
       ["はい。受講生の 98% が未経験スタートです。",
        "手相は「センス」ではなく「型」。順を追って学べばどなたでも",
        "読めるようになります。"])

    qa(pdf,
       "Q. どれくらいで読めるようになりますか？",
       ["早い方で1ヶ月程度で簡単な鑑定はできるようになります。",
        "お仕事として安定するのは10〜30人鑑定したあたりから。",
        "そこまでしっかりサポートします。"])

    qa(pdf,
       "Q. 仕事や家事と両立できますか？",
       ["すべてオンライン受講・録画も残ります。",
        "お子さんがいる方、フルタイム勤務の方も多く受講されています。",
        "アーカイブ視聴で十分に学べる構成です。"])

    qa(pdf,
       "Q. 年齢は関係ありますか？",
       ["まったく関係ありません。",
        "60代・70代からプロになった方も多くいます（例：寺澤祐義さん 69歳）。",
        "手相は「人生経験がそのまま武器になる仕事」です。"])

    qa(pdf,
       "Q. 家族に応援してもらえなくて…",
       ["ご家族向けの説明資料もご用意しています。",
        "お一人で抱え込まず、わたしたちと一緒に解決策を考えましょう。"])

    pdf.ln(2)
    separator(pdf)

    section(pdf, "お申し込み・ご相談")

    body(pdf, "ご不明な点やお支払いのご相談は")
    body(pdf, "お気軽に事務局までご連絡ください。")
    pdf.ln(4)
    set_bold(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 7, "担当：事務局", new_x="LMARGIN", new_y="NEXT")
    set_regular(pdf, 9.5)
    pdf.set_text_color(90, 90, 90)
    pdf.cell(0, 6, "運営：合同会社アンビシャス", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "所在地：〒104-0061 東京都中央区銀座1丁目12番4号 N&E BLD. 6F", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "メール：info@yasashiku.lfl4927.com", new_x="LMARGIN", new_y="NEXT")

    pdf.output(OUTPUT_PATH)
    print(f"PDF generated: {OUTPUT_PATH}")


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

def table_row_3_b(pdf, col_ws, cols, bold_col=-1):
    pdf.set_draw_color(200, 200, 200)
    for i, (cw, c) in enumerate(zip(col_ws, cols)):
        if i == bold_col:
            set_bold(pdf, 9.5)
            pdf.set_text_color(40, 40, 40)
        else:
            set_regular(pdf, 9.5)
            pdf.set_text_color(60, 60, 60)
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
