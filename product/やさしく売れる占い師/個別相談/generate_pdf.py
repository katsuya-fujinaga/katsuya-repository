import sys
sys.path.insert(0, "/Users/Katsuya-fujinaga/Documents/github/.pip_libs")

from fpdf import FPDF

FONT_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
FONT_W6_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"
OUTPUT_PATH = "/Users/Katsuya-fujinaga/Documents/github/やさしく売れる占い師/個別相談/旦那攻略テンプレート.pdf"


class TemplatePDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("gothic", size=8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f"{self.page_no()}", align="C")


def build_pdf():
    pdf = TemplatePDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=25)
    pdf.set_margins(left=20, top=20, right=20)
    pdf.add_font("gothic", style="", fname=FONT_PATH)
    pdf.add_font("gothic_b", style="", fname=FONT_W6_PATH)

    pdf.add_page()

    # ===== Title =====
    set_bold(pdf, 22)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 20, "旦那さんへの伝え方テンプレート", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    set_regular(pdf, 10)
    pdf.set_text_color(100, 100, 100)
    lines = [
        "このテンプレートは「やりたい気持ちはあるけど、",
        "旦那さんにどう話せばいいか分からない」という方のためのものです。",
        "そのまま使っても、自分なりにアレンジしてもOKです。",
    ]
    for l in lines:
        pdf.cell(0, 6, l, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    # ===== まず知っておいてほしいこと =====
    section(pdf, "まず知っておいてほしいこと")

    body(pdf, "旦那さんに伝えるとき、一番やってはいけないのは")
    bold_line(pdf, "「○○万円の講座に入りたいんだけど…」と金額から話すこと です。")
    pdf.ln(2)
    body(pdf, "金額だけ聞いた旦那さんは「高い」「怪しい」「また何か買うの？」としか思えません。")
    pdf.ln(2)
    body(pdf, "大事なのは「なぜやりたいのか」→「何が得られるのか」→「いくらかかるのか」")
    bold_line(pdf, "の順番で話すことです。")
    pdf.ln(6)

    separator(pdf)

    # ===== 伝え方の3ステップ =====
    section(pdf, "伝え方の3ステップ")

    # STEP 1
    step(pdf, "STEP 1：今の気持ちを正直に話す")
    body(pdf, "まず、あなたの「今の状況」と「気持ち」を伝えてください。")
    pdf.ln(3)
    quote(pdf, "「ちょっと話したいことがあるんだけど、いい？」")
    pdf.ln(1)
    quote(pdf, "「最近ずっと考えてたことがあって。")
    quote(pdf, "　私、このままパート（今の仕事）をずっと続けていくのが正直不安なんだよね。")
    quote(pdf, "　年齢のこともあるし、体力的にもいつまでできるか分からないし。」")
    pdf.ln(1)
    quote(pdf, "「それで、前から興味があった占いを仕事にできないかなって思ってて。」")
    pdf.ln(3)
    point(pdf, "「占い師になりたい」ではなく「将来の不安」から話す")
    point(pdf, "旦那さんが共感できる話題（体力・年齢・将来）から入る")
    point(pdf, "感情的にならず、落ち着いて話す")
    pdf.ln(5)

    # STEP 2
    step(pdf, "STEP 2：どんな講座なのかを説明する")
    body(pdf, "次に、講座の内容を旦那さんが理解できる言葉で伝えます。")
    pdf.ln(3)
    quote(pdf, "「それで、占い師になるための講座を見つけたの。")
    quote(pdf, "　半年間で占いの技術と、お客さんとの話し方を学べるんだけど、")
    quote(pdf, "　ちゃんと仕事として占い館に就職できるところまでサポートしてくれるの。」")
    pdf.ln(1)
    quote(pdf, "「実際にこの講座から横浜中華街の占い館で働いてる人が何人もいて、")
    quote(pdf, "　50代60代から始めた人もいるんだよ。」")
    pdf.ln(1)
    quote(pdf, "「占いって怪しいイメージあるかもしれないけど、やってることは")
    quote(pdf, "　人の話を聞いて、気持ちを整理してあげるカウンセリングみたいな仕事なの。」")
    pdf.ln(3)
    point(pdf, "「占い」ではなく「カウンセリング」「人の相談に乗る仕事」と説明する")
    point(pdf, "実績（中華街で4人就職）など具体的な数字を出す")
    point(pdf, "怪しくないことを先に伝える（旦那さんの不安を先回り）")
    pdf.ln(5)

    # STEP 3
    step(pdf, "STEP 3：金額と投資としての意味を伝える")
    body(pdf, "最後に金額を伝えますが、「費用」ではなく「投資」として話します。")
    pdf.ln(3)
    quote(pdf, "「それで、講座の費用なんだけど、○○万円なの。")
    quote(pdf, "　正直安くはないんだけど、これで一生使えるスキルが身につくなら、")
    quote(pdf, "　私は自分への投資だと思ってる。」")
    pdf.ln(1)
    quote(pdf, "「今のパート代だと月○万円だけど、占い師として軌道に乗れば、")
    quote(pdf, "　好きなことをしながら同じくらい稼げるようになるの。")
    quote(pdf, "　しかも年齢関係なく続けられるから、長い目で見たらプラスだと思う。」")
    pdf.ln(1)
    quote(pdf, "「分割もできるから、家計に一気に負担がかかるわけじゃないの。」")
    pdf.ln(3)
    point(pdf, "金額は最後に伝える")
    point(pdf, "「消費」ではなく「投資」として説明する")
    point(pdf, "分割払いができることを伝えて負担感を減らす")
    point(pdf, "長期的なリターン（一生使えるスキル・年齢不問）を伝える")
    pdf.ln(6)

    separator(pdf)

    # ===== よくある反応と返し方 =====
    section(pdf, "旦那さんからよくある反応と返し方")

    qa(pdf,
       "「占いなんて仕事になるの？」",
       [
           "「私も最初はそう思ったんだけど、実際に占い師って需要があって、",
           "　電話占いとかチャット占いは今すごく伸びてるの。",
           "　講座の先生の生徒さんも、ちゃんと占い館に就職して",
           "　お金もらって働いてるよ。」",
       ])

    qa(pdf,
       "「高すぎない？」",
       [
           "「うん、安くはないよね。でも考えてみて。",
           "　美容院に毎月1万円行くのを5年続けたら60万円でしょ？",
           "　この講座は半年で一生使えるスキルが身につくんだよ。",
           "　しかも、それで収入が得られるようになるんだから、",
           "　お金を使うんじゃなくて、お金を生む力をつけるってことなの。」",
       ])

    qa(pdf,
       "「また何か始めるの？（続かないんじゃないの？）」",
       [
           "「それは自分でも考えた。でも今回は本気なの。",
           "　４日間のプログラムにも参加して、先生の話も聞いて、",
           "　『これなら私にもできる』って初めて思えたの。",
           "　ちゃんとサポートもあるし、半年間やり切る覚悟はあるよ。」",
       ])

    qa(pdf,
       "「今じゃなくてもいいんじゃない？」",
       [
           "「この講座、次の募集がいつあるか分からないの。",
           "　それに私、今やらなかったらきっとまた先延ばしにして、",
           "　何も変わらないまま時間だけ過ぎていくと思う。",
           "　始めるなら今が一番若い日だから、今がいいと思ってるの。」",
       ])

    qa(pdf,
       "「俺は反対だ」（強く反対された場合）",
       [
           "「分かった。いきなり賛成してとは言わないよ。",
           "　もしよかったら、講座の先生と一緒に話す場を作ってもらえるんだけど、",
           "　一回だけ話を聞いてみてくれない？",
           "　それで納得できなかったら諦めるから。」",
       ])

    set_regular(pdf, 9)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, "→ 三者面談（講師）の提案につなげましょう", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    # ===== タイミング =====
    section(pdf, "話すタイミングのコツ")
    point(pdf, "食事中や寝る前など、リラックスしているときがベスト")
    point(pdf, "旦那さんが疲れているとき・機嫌が悪いときは避ける")
    point(pdf, "LINEやメールではなく対面で話す（表情や熱意が伝わる）")
    point(pdf, "一度で決めようとしない。「考えておいて」でもOK")
    pdf.ln(6)

    separator(pdf)

    # ===== NG =====
    section(pdf, "絶対にやってはいけないこと")
    ng(pdf, "金額から話し始める")
    ng(pdf, "「みんなやってるから」と他人を理由にする")
    ng(pdf, "感情的になって泣いたり怒ったりする")
    ng(pdf, "「あなたは分かってくれない」と責める")
    ng(pdf, "黙って申し込んで後からバレる")
    pdf.ln(6)

    separator(pdf)

    # ===== 最後に =====
    section(pdf, "最後に")
    body(pdf, "旦那さんに相談すること自体が、とても大事なことです。")
    body(pdf, "家族のことを考えているからこそ、一人で決められないんですよね。")
    pdf.ln(3)
    body(pdf, "でも覚えておいてください。")
    pdf.ln(4)

    set_bold(pdf, 13)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 10, "あなたの人生を変えられるのは、あなただけです。", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    body(pdf, "旦那さんは「反対」しているのではなく、")
    body(pdf, "「よく分からないから不安」なだけかもしれません。")
    pdf.ln(2)
    body(pdf, "ちゃんと伝えれば、きっと分かってくれます。")
    pdf.ln(4)
    body(pdf, "もし話してみて不安なことがあれば、")
    body(pdf, "いつでもLINEで相談してください。一緒に作戦を考えましょう。")

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
    set_bold(pdf, 12)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 10, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

def body(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")

def bold_line(pdf, text):
    set_bold(pdf, 10)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")

def quote(pdf, text):
    set_regular(pdf, 9.5)
    pdf.set_text_color(90, 90, 90)
    pdf.set_x(pdf.l_margin + 8)
    pdf.cell(0, 5.5, text, new_x="LMARGIN", new_y="NEXT")

def point(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.set_x(pdf.l_margin + 4)
    pdf.cell(0, 6.5, f"● {text}", new_x="LMARGIN", new_y="NEXT")

def ng(pdf, text):
    set_bold(pdf, 10)
    pdf.set_text_color(190, 60, 60)
    pdf.set_x(pdf.l_margin + 4)
    pdf.cell(5, 6.5, "X ")
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 6.5, text, new_x="LMARGIN", new_y="NEXT")

def qa(pdf, question, answer_lines):
    set_bold(pdf, 10.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 8, question, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)
    set_regular(pdf, 9.5)
    pdf.set_text_color(90, 90, 90)
    for line in answer_lines:
        pdf.set_x(pdf.l_margin + 8)
        pdf.cell(0, 5.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)


if __name__ == "__main__":
    build_pdf()
