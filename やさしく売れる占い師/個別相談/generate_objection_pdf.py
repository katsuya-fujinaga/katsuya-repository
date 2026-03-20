import sys
sys.path.insert(0, "/Users/Katsuya-fujinaga/Documents/github/.pip_libs")

from fpdf import FPDF

FONT_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
FONT_W6_PATH = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"
OUTPUT_PATH = "/Users/Katsuya-fujinaga/Documents/github/やさしく売れる占い師/個別相談/反論処理表.pdf"


class ObjectionPDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("gothic", size=8)
        self.set_text_color(160, 160, 160)
        self.cell(0, 10, f"{self.page_no()}", align="C")


def build_pdf():
    pdf = ObjectionPDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=25)
    pdf.set_margins(left=20, top=20, right=20)
    pdf.add_font("gothic", style="", fname=FONT_PATH)
    pdf.add_font("gothic_b", style="", fname=FONT_W6_PATH)

    W = pdf.w - pdf.l_margin - pdf.r_margin

    pdf.add_page()

    # ===== タイトル =====
    set_bold(pdf, 22)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 20, "個別相談 反論処理表", align="C", new_x="LMARGIN", new_y="NEXT")

    set_bold(pdf, 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, "やさしく売れる占い師", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    set_regular(pdf, 10)
    pdf.set_text_color(100, 100, 100)
    centered(pdf, "個別相談のクロージング時に出る反論を7カテゴリに分類。")
    centered(pdf, "各反論に対して「共感 → 切り返し → 着地」の3ステップで対応する。")
    pdf.ln(4)

    set_bold(pdf, 10)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 7, "原則：否定しない。まず受け止めてから、視点を変える。", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    separator(pdf)

    # ===== 対応の3原則 =====
    section(pdf, "対応の3原則")

    principle(pdf, "1. まず共感する")
    body(pdf, "反論に対して最初にやることは「否定しない」こと。")
    body(pdf, "「そうですよね」「わかります」で受け止める。")
    pdf.ln(4)

    principle(pdf, "2. 本質を見極める")
    body(pdf, "表面的な言葉の裏にある本当の不安を探る。")
    body(pdf, "「高い」の裏には「自分にできるかわからないから投資が怖い」がある。")
    pdf.ln(4)

    principle(pdf, "3. 自分の言葉で未来を語らせる")
    body(pdf, "最後は「○○さんは、どうなりたいですか？」で終わる。")
    body(pdf, "人は他人に説得されるより、自分で納得したときに動く。")
    pdf.ln(6)

    separator(pdf)

    # ===== クイックリファレンス =====
    section(pdf, "クイックリファレンス")

    col_w4 = [W * 0.15, W * 0.22, W * 0.30, W * 0.33]
    table_header_4(pdf, col_w4, ["反論", "キーワード", "本質", "対処の方向性"])
    table_row_4(pdf, col_w4, ["高い", "金額・お金がない", "価値が伝わっていない", "投資回収の計算を見せる"])
    table_row_4(pdf, col_w4, ["旦那に相談", "家族・理解がない", "伝え方がわからない", "旦那への話し方をレクチャー"])
    table_row_4(pdf, col_w4, ["自信がない", "できるか不安", "過去の失敗体験", "未経験者の成功事例を出す"])
    table_row_4(pdf, col_w4, ["年齢", "遅い・若くない", "年齢＝ハンデの思い込み", "年齢が武器になる根拠を示す"])
    table_row_4(pdf, col_w4, ["時間がない", "仕事・育児", "優先順位の問題", "両立の具体例と仕組みを提示"])
    table_row_4(pdf, col_w4, ["考えたい", "保留・迷い", "引っかかりが不明確", "具体的な懸念を特定する"])
    table_row_4(pdf, col_w4, ["稼げるか", "不信・疑い", "再現性への疑問", "稼働時間と収入の関係を説明"])
    pdf.ln(6)

    separator(pdf)

    # ===== ① お金 =====
    category(pdf, "① お金（金額が高い・払えない）")

    # --- 高いです ---
    objection(pdf, "「高いです」「そんなお金ないです」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「そうですよね。決して安い金額ではないですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「ただ、○○さんが今抱えている“将来の不安”は、")
    quote(pdf, "　このまま何もしなければずっと続きます。")
    quote(pdf, "　この講座は6ヶ月で占い師としてデビューできるカリキュラムで、")
    quote(pdf, "　週3回・1回3〜4時間の待機で月10万円が目安です。")
    quote(pdf, "　つまり、ベーシックコースなら約5〜6ヶ月で講座代は回収できる計算です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「金額以上に“この先どうなりたいか”で考えてみてください。")
    quote(pdf, "　一生使えるスキルへの投資として見たとき、どう感じますか？」")
    pdf.ln(5)

    # --- 分割でも厳しい ---
    objection(pdf, "「分割でも厳しい」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「家計のこと、大事ですよね。無理をしてほしいわけではないです」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「分割は入学金＋月々49,000円（プレミアム）/ 44,000円（ベーシック）です。")
    quote(pdf, "　占い師としてデビューすれば、受講中に月数万円の収入が入り始める方もいます。")
    quote(pdf, "　つまり“払いながら回収する”イメージです」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「お支払い方法で解決できる部分もあるので、")
    quote(pdf, "　具体的にシミュレーションしてみましょうか？」")
    pdf.ln(5)

    # --- 出費が重なる ---
    objection(pdf, "「今ちょうど出費が重なっていて…」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「タイミングってありますよね。お気持ちわかります」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「ただ、次の募集がいつになるかはわかりません。")
    quote(pdf, "　今回の6期は4月18日スタートで、少人数制です。")
    quote(pdf, "　“出費が落ち着いたら”と思っていると、")
    quote(pdf, "　結局始められないまま1年経つ方が多いんです」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「もし“やりたい気持ち”があるなら、")
    quote(pdf, "　お支払いの時期を少し調整する方法もご相談できますよ」")
    pdf.ln(6)

    separator(pdf)

    # ===== ② 家族 =====
    category(pdf, "② 家族（旦那・家族に相談しないと）")

    # --- 旦那に相談 ---
    objection(pdf, "「旦那に相談しないと決められません」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「ご家族に相談されるのは大事なことですよね。素敵だと思います」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「ちなみに、旦那様はどんなタイプの方ですか？")
    quote(pdf, "　占いに対してどういう印象をお持ちだと思いますか？」")
    pdf.ln(2)
    body(pdf, "（相手の反応を聞いてから）")
    pdf.ln(2)
    quote(pdf, "「旦那様に伝えるときのポイントなんですが、")
    quote(pdf, "　“占い師になりたい”という言い方だと伝わりにくいんです。")
    quote(pdf, "")
    quote(pdf, "　おすすめは、今の状況と将来への不安をセットで話すこと。")
    quote(pdf, "")
    quote(pdf, "　例えば：")
    quote(pdf, "　“今の仕事をこの先ずっと続けるのは不安。")
    quote(pdf, "　 自宅でできて、年齢関係なく続けられる仕事を見つけた。")
    quote(pdf, "　 6ヶ月で資格のように身につけられる講座がある。")
    quote(pdf, "　 自分への投資として挑戦したい“")
    quote(pdf, "")
    quote(pdf, "　こういう伝え方だと、旦那様も“占い”ではなく")
    quote(pdf, "　“働き方の選択”として聞いてくれます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「もし旦那様が強く反対された場合、本田先生との三者面談も可能です。")
    quote(pdf, "　回答の期限を決めておいてもいいですか？」")
    pdf.ln(5)

    # --- 占いに理解がない ---
    objection(pdf, "「旦那が占いに理解がないんです」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「男性は特に、占いって聞くと“怪しい”と感じる方が多いですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「実は受講生の旦那様にも、最初は反対だった方がたくさんいます。")
    quote(pdf, "　でも“電話占い・チャット占いの会社に就職する”という説明にすると、")
    quote(pdf, "　仕事として理解してもらえることがほとんどです。")
    quote(pdf, "")
    quote(pdf, "　ポイントは“占い師になる”ではなく")
    quote(pdf, "　“在宅で人の相談に乗る仕事を始める”という伝え方です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「旦那様向けの説明資料もお渡しできますので、活用してみてください」")
    pdf.ln(6)

    separator(pdf)

    # ===== ③ 自信がない =====
    category(pdf, "③ 自信がない（自分にできるか不安）")

    # --- 私なんかに ---
    objection(pdf, "「私なんかにできるか不安です」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「そう思いますよね。新しいことを始めるときって、誰でも不安です」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「でも○○さん、最初に言ってくださいましたよね。")
    quote(pdf, "　“人から相談されることが多い”って。")
    quote(pdf, "　それ、占い師としてものすごい才能なんです。")
    quote(pdf, "")
    quote(pdf, "　本田先生は1500名以上に教えてきましたが、")
    quote(pdf, "　才能でデビューした人は1人もいません。")
    quote(pdf, "　全員ゼロからのスタートです。")
    quote(pdf, "")
    quote(pdf, "　そして、受講生の7〜8割が採用審査に合格しています。")
    quote(pdf, "　一般の合格率が2〜3割なのに、です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「“できるかどうか”ではなく“やりたいかどうか”で考えてみてください。")
    quote(pdf, "　やりたい気持ちがあれば、技術は後からついてきます」")
    pdf.ln(5)

    # --- 覚えが遅い ---
    objection(pdf, "「覚えが遅いので周りについていけるか心配です」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「そのお気持ち、よくわかります」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「実はこの講座、同じ内容を木曜と土曜の週2回開催しています。")
    quote(pdf, "　どちらにも参加できますし、全授業の録画も残ります。")
    quote(pdf, "　何度でも見返せるので、自分のペースで進められます。")
    quote(pdf, "")
    quote(pdf, "　さらに、6ヶ月でデビューできなかった場合は")
    quote(pdf, "　3ヶ月の延長サポートが無料でつきます。")
    quote(pdf, "　グループチャットでいつでも質問もできます。")
    quote(pdf, "")
    quote(pdf, "　ペースが遅いことは問題になりません。")
    quote(pdf, "　むしろ、じっくり丁寧に学ぶ方が占い師として深みが出ます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「本田先生はもと学校の先生なので、教え方がとてもわかりやすいですよ」")
    pdf.ln(5)

    # --- 年齢 ---
    objection(pdf, "「年齢的に遅いんじゃないでしょうか」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「年齢のこと、気になりますよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「実は占い師って、年齢が上がるほど有利な仕事なんです。")
    quote(pdf, "　人生経験が深いほど、相談者の気持ちに寄り添える。")
    quote(pdf, "")
    quote(pdf, "　本田先生の生徒さんには50代・60代の方がたくさんいて、")
    quote(pdf, "　横浜中華街の占い館で働いている方もいます。")
    quote(pdf, "　70歳でデビューした看護師さんもいらっしゃいます。")
    quote(pdf, "")
    quote(pdf, "　若い占い師には出せない“安心感”が、")
    quote(pdf, "　年齢を重ねた方の最大の武器です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「○○さんのこれまでの人生経験は、")
    quote(pdf, "　そのまま占い師としての信頼材料になりますよ」")
    pdf.ln(6)

    separator(pdf)

    # ===== ④ 時間がない =====
    category(pdf, "④ 時間がない（仕事・家事・育児との両立）")

    # --- 仕事しながら ---
    objection(pdf, "「仕事しながらだと時間が取れるか不安です」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「お仕事しながらですもんね。時間の確保は大事なポイントですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「受講生の多くが、お仕事やお子さんがいる中で受講されています。")
    quote(pdf, "")
    quote(pdf, "　授業は木曜20時 or 土曜9時の週2回で同じ内容です。")
    quote(pdf, "　都合のいい方に参加すればOKです。")
    quote(pdf, "　もし両方出られなくても録画で見返せます。")
    quote(pdf, "")
    quote(pdf, "　自宅学習は、タロットの練習が中心です。")
    quote(pdf, "　通勤中や家事の合間にカードの意味を覚えるなど、")
    quote(pdf, "　スキマ時間で進められます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「“時間があるから始める”のではなく、“始めるから時間を作る”。")
    quote(pdf, "　受講生の方は皆さん、そうやって乗り越えてこられましたよ」")
    pdf.ln(5)

    # --- 子どもが小さい ---
    objection(pdf, "「子どもが小さくて…」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「小さいお子さんがいると、本当に大変ですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「だからこそ、電話・チャット占いは最適なんです。")
    quote(pdf, "　自宅でできて、好きな時間に働ける。")
    quote(pdf, "　お子さんが寝た後の夜の時間帯は、")
    quote(pdf, "　実は占いの需要が一番高い時間帯です。")
    quote(pdf, "")
    quote(pdf, "　子育てしながらチャット占いで月10万円稼いでいる受講生もいます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「むしろ、お子さんが小さい今だからこそ、")
    quote(pdf, "　在宅で稼げるスキルを身につけておく価値があると思いませんか？」")
    pdf.ln(6)

    separator(pdf)

    # ===== ⑤ 占い未経験 =====
    category(pdf, "⑤ 占い未経験・スキルへの不安")

    # --- 未経験 ---
    objection(pdf, "「占い経験がまったくないんですが大丈夫ですか？」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「未経験だと不安ですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「受講生のほとんどが未経験スタートです。")
    quote(pdf, "　カリキュラムは完全にゼロから設計されています。")
    quote(pdf, "")
    quote(pdf, "　数秘術は生年月日の計算だけなので、道具も不要。")
    quote(pdf, "　タロットは25回のタロットマラソンと10回の練習会で、")
    quote(pdf, "　体に染み込むまで繰り返します。")
    quote(pdf, "")
    quote(pdf, "　半年間で100回以上の鑑定練習をするので、")
    quote(pdf, "　卒業時にはプロレベルに到達できます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「未経験の方が“変なクセ”がなくてむしろ上達が早いと、")
    quote(pdf, "　本田先生はよくおっしゃっていますよ」")
    pdf.ln(5)

    # --- パソコン ---
    objection(pdf, "「パソコンが苦手です / パソコン持ってません」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「パソコンのこと、気になりますよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「電話占いは文字を打つ必要がないので、パソコンなしでもできます。")
    quote(pdf, "　チャット占いをする場合はパソコンがあった方がいいですが、")
    quote(pdf, "　2〜3万円の安いもので十分です。")
    quote(pdf, "")
    quote(pdf, "　タイピングも最初からスラスラ打てなくて大丈夫です。")
    quote(pdf, "　講座の中で慣れていけます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「パソコンについては別途ご案内しますので、")
    quote(pdf, "　今は“やるかどうか”だけ考えていただければ大丈夫です」")
    pdf.ln(5)

    # --- 電話が苦手 ---
    objection(pdf, "「電話で話すのが苦手です」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「電話って緊張しますよね。わかります」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「電話占いの場合、相手からかけてくるので、")
    quote(pdf, "　飛び込み営業のようなストレスはありません。")
    quote(pdf, "")
    quote(pdf, "　しかも、最初に学ぶのは“共感と承認”。")
    quote(pdf, "　つまり“聞く力”が中心です。")
    quote(pdf, "　上手に話す必要はなく、“寄り添って聞く”ことができれば十分です。")
    quote(pdf, "")
    quote(pdf, "　もし電話が本当に苦手であれば、チャット占いから始めることもできます。")
    quote(pdf, "　チャットなら文字だけなので、考えてから返信できます」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「講座の中で何度も練習するので、卒業時には自然に話せるようになりますよ」")
    pdf.ln(6)

    separator(pdf)

    # ===== ⑥ 考えたい・保留 =====
    category(pdf, "⑥ 考えたい・保留")

    # --- 考えさせて ---
    objection(pdf, "「少し考えさせてください」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「もちろん。大切な決断ですから、しっかり考えていただきたいです」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「ちなみに、○○さんの中で“引っかかっている部分”は")
    quote(pdf, "　具体的にどこですか？")
    quote(pdf, "")
    quote(pdf, "　・金額のことですか？")
    quote(pdf, "　・ご家族のことですか？")
    quote(pdf, "　・自分にできるかどうかですか？")
    quote(pdf, "　・それとも他に何か？")
    quote(pdf, "")
    quote(pdf, "　教えていただければ、解決のお手伝いができるかもしれません」")
    pdf.ln(2)
    body(pdf, "（引っかかりを特定したら、該当カテゴリの切り返しを使う）")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「○○さん、“やりたい気持ち”は何パーセントくらいありますか？」")
    pdf.ln(3)

    body(pdf, "（80%以上の場合）")
    quote(pdf, "「あとの20%は、始めてみないとわからない部分ですよね。")
    quote(pdf, "　その20%のために100%のチャンスを逃すのはもったいなくないですか？」")
    pdf.ln(3)

    body(pdf, "（50〜70%の場合）")
    quote(pdf, "「迷っている時間が一番もったいないんです。")
    quote(pdf, "　回答の期限を○日に設定させてもらっていいですか？")
    quote(pdf, "　それまでに追加の質問があればいつでもLINEしてください」")
    pdf.ln(5)

    # --- 今じゃない ---
    objection(pdf, "「興味はあるけど、今じゃないかも」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「タイミングって大事ですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「ちなみに、“今じゃない”と感じる理由は何ですか？")
    quote(pdf, "")
    quote(pdf, "　もし“準備ができてから”という理由なら、")
    quote(pdf, "　一つお伝えしたいことがあります。")
    quote(pdf, "　準備が整ってから始めた人は、私の知る限りいません。")
    quote(pdf, "")
    quote(pdf, "　皆さん、不安なまま飛び込んで、やりながら整えていった。")
    quote(pdf, "　それが受講生の共通点です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「今回の6期は4月18日スタートの少人数制で、次の募集は未定です。")
    quote(pdf, "　“やりたい”と思った時が一番いいタイミングだと私は思います」")
    pdf.ln(5)

    # --- 他と比較 ---
    objection(pdf, "「他の講座と比較したい」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「比較検討されるのは賢い判断ですね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「比較するときのポイントをお伝えしますね。")
    quote(pdf, "")
    quote(pdf, "　多くの占い講座は“占い技術”しか教えません。")
    quote(pdf, "　この講座が決定的に違うのは、3つあります。")
    quote(pdf, "")
    quote(pdf, "　① 占術だけでなく“伝え方（カウンセリング）”を教えること")
    quote(pdf, "　② 占い会社の採用審査対策まで含まれていること")
    quote(pdf, "　③ 卒業後のサポートが一生続くこと")
    quote(pdf, "")
    quote(pdf, "　つまり“占いを学ぶ”だけでなく“占いを仕事にする”ところまで")
    quote(pdf, "　面倒を見る。ここが最大の違いです」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「もちろん比較していただいて構いませんが、")
    quote(pdf, "　この3つを全部カバーしている講座は他にないはずです」")
    pdf.ln(6)

    separator(pdf)

    # ===== ⑦ その他の不安 =====
    category(pdf, "⑦ その他の不安")

    # --- 稼げるか ---
    objection(pdf, "「本当に稼げるんですか？」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「一番気になるところですよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「正直に言うと、“全員が必ず稼げる”とは言いません。")
    quote(pdf, "　稼げるかどうかは“稼働時間”で決まります。")
    quote(pdf, "")
    quote(pdf, "　週3回・1回3〜4時間の待機で月10万円が目安です。")
    quote(pdf, "　やった分だけ収入になる。才能ではなく“やるかどうか”です。")
    quote(pdf, "")
    quote(pdf, "　逆に言えば、稼働しなければ稼げません。")
    quote(pdf, "　ただ、正しい技術とコツを身につけて、コツコツ待機すれば")
    quote(pdf, "　再現性の高い仕組みです」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「“稼げるか”ではなく“稼働できるか”が本当の問いです。")
    quote(pdf, "　○○さんは、週3回・1回3〜4時間の時間は作れそうですか？」")
    pdf.ln(5)

    # --- 怪しくないか ---
    objection(pdf, "「占い師って怪しくないですか？」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「世間的にはそう見られることもありますよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「この講座が目指す占い師は“未来を予言する人”ではなく、")
    quote(pdf, "　“人の心に寄り添う相談のプロ”です。")
    quote(pdf, "")
    quote(pdf, "　占いは当てるためのものではなく、")
    quote(pdf, "　相談者が自分の気持ちを整理するためのツール。")
    quote(pdf, "")
    quote(pdf, "　本田先生は元学校教師で、30年間の実績があります。")
    quote(pdf, "　電話・チャット占いの会社もちゃんとした企業です。")
    quote(pdf, "　個人事業主として会社に所属する形なので、“まっとうな仕事”です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「ご家族にも“カウンセリングの仕事”として説明すると伝わりやすいですよ」")
    pdf.ln(5)

    # --- 6ヶ月で身につくか ---
    objection(pdf, "「6ヶ月で本当に身につきますか？」")
    pdf.ln(2)

    label_empathy(pdf)
    quote(pdf, "「半年って短い気もしますよね」")
    pdf.ln(3)

    label_counter(pdf)
    quote(pdf, "「カリキュラムは6ヶ月で完結するように設計されています。")
    quote(pdf, "")
    quote(pdf, "　数秘術 → タロット → 手相 → カウンセリング → 採用対策")
    quote(pdf, "　この流れで、100回以上の実践練習を積みます。")
    quote(pdf, "")
    quote(pdf, "　さらに、万が一6ヶ月で準備が整わなかった場合は")
    quote(pdf, "　3ヶ月間の延長サポートが無料でつきます。")
    quote(pdf, "　卒業後もグループチャットやサポートは一生続きます。")
    quote(pdf, "")
    quote(pdf, "　“6ヶ月で終わり”ではなく")
    quote(pdf, "　“6ヶ月で基盤を作り、その後も支え続ける”講座です」")
    pdf.ln(3)

    label_landing(pdf)
    quote(pdf, "「6ヶ月後、“あの時始めてよかった”と思える未来を一緒に作りましょう」")
    pdf.ln(6)

    separator(pdf)

    # ===== 使える数字・ファクト =====
    section(pdf, "使える数字・ファクト")

    col_w2 = [W * 0.50, W * 0.50]
    table_header_2(pdf, col_w2, ["項目", "数値"])
    table_row_2(pdf, col_w2, ["本田先生の占い歴", "30年"])
    table_row_2(pdf, col_w2, ["指導生徒数", "1,500名以上"])
    table_row_2(pdf, col_w2, ["プロ占い師輩出数", "150名以上"])
    table_row_2(pdf, col_w2, ["一般の採用合格率", "2〜3割"])
    table_row_2(pdf, col_w2, ["受講生の合格率", "7〜8割"])
    table_row_2(pdf, col_w2, ["月収目安（週3×3〜4h）", "約10万円"])
    table_row_2(pdf, col_w2, ["講座代回収期間（ベーシック）", "約5〜6ヶ月"])
    table_row_2(pdf, col_w2, ["講座期間", "6ヶ月"])
    table_row_2(pdf, col_w2, ["延長サポート", "3ヶ月無料"])
    table_row_2(pdf, col_w2, ["卒業後サポート", "一生"])
    pdf.ln(6)

    separator(pdf)

    # ===== 保留者へのフォロー手順 =====
    section(pdf, "保留者へのフォロー手順")

    step_label(pdf, "即日（相談後）")
    point(pdf, "LINEで「今日はありがとうございました」を送る")
    point(pdf, "引っかかっていたポイントに対する追加情報を1つ送る")
    point(pdf, "回答期限を設定する（最長1週間）")
    pdf.ln(4)

    step_label(pdf, "2〜3日後")
    point(pdf, "「その後いかがですか？」と軽く連絡")
    point(pdf, "必要に応じて追加資料を送付")
    point(pdf, "質問があればいつでも連絡OKであることを伝える")
    pdf.ln(4)

    step_label(pdf, "期限日")
    point(pdf, "「本日が回答期限ですが、いかがでしょうか？」")
    point(pdf, "反応がなければ翌日にもう一度連絡")
    point(pdf, "断りの場合も「またいつでもご連絡ください」で終わる")

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

def centered(pdf, text):
    pdf.cell(0, 6.5, text, align="C", new_x="LMARGIN", new_y="NEXT")

def section(pdf, text):
    set_bold(pdf, 15)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 12, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

def category(pdf, text):
    set_bold(pdf, 14)
    pdf.set_text_color(70, 100, 160)
    pdf.cell(0, 12, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

def objection(pdf, text):
    set_bold(pdf, 11)
    pdf.set_text_color(180, 60, 60)
    pdf.cell(0, 9, text, new_x="LMARGIN", new_y="NEXT")

def label_empathy(pdf):
    set_bold(pdf, 9.5)
    pdf.set_text_color(80, 160, 120)
    pdf.cell(0, 7, "【共感】", new_x="LMARGIN", new_y="NEXT")

def label_counter(pdf):
    set_bold(pdf, 9.5)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 7, "【切り返し】", new_x="LMARGIN", new_y="NEXT")

def label_landing(pdf):
    set_bold(pdf, 9.5)
    pdf.set_text_color(180, 130, 60)
    pdf.cell(0, 7, "【着地】", new_x="LMARGIN", new_y="NEXT")

def principle(pdf, text):
    set_bold(pdf, 11)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 9, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

def step_label(pdf, text):
    set_bold(pdf, 11)
    pdf.set_text_color(70, 130, 180)
    pdf.cell(0, 9, text, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

def body(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 6.5, text, new_x="LMARGIN", new_y="NEXT")

def bold_line(pdf, text):
    set_bold(pdf, 10)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 6.5, text, new_x="LMARGIN", new_y="NEXT")

def quote(pdf, text):
    set_regular(pdf, 9.5)
    pdf.set_text_color(90, 90, 90)
    pdf.set_x(pdf.l_margin + 10)
    pdf.cell(0, 5.5, text, new_x="LMARGIN", new_y="NEXT")

def point(pdf, text):
    set_regular(pdf, 10)
    pdf.set_text_color(60, 60, 60)
    pdf.set_x(pdf.l_margin + 6)
    pdf.cell(0, 7, f"● {text}", new_x="LMARGIN", new_y="NEXT")

def table_header_2(pdf, col_ws, cols):
    set_bold(pdf, 9.5)
    pdf.set_fill_color(245, 245, 245)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f"  {c}", border=1, fill=True)
    pdf.ln()

def table_row_2(pdf, col_ws, cols):
    set_regular(pdf, 9.5)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f"  {c}", border=1)
    pdf.ln()

def table_header_4(pdf, col_ws, cols):
    set_bold(pdf, 8.5)
    pdf.set_fill_color(245, 245, 245)
    pdf.set_text_color(60, 60, 60)
    pdf.set_draw_color(200, 200, 200)
    for cw, c in zip(col_ws, cols):
        pdf.cell(cw, 8, f" {c}", border=1, fill=True)
    pdf.ln()

def table_row_4(pdf, col_ws, cols):
    set_regular(pdf, 8.5)
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
        pdf.set_x(pdf.l_margin + 8)
        pdf.cell(0, 5.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)


if __name__ == "__main__":
    build_pdf()
