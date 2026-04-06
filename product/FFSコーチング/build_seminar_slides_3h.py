#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""セミナーシナリオ_3時間版.md の構成（S001〜S200）に沿って HTML を生成する。

出力: seminar-slides-3h.html
元の seminar-slides.html と同一 CSS（先頭 <style> を読み込み）・同一ナビ・同一 JS（簡易版）。
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "seminar-slides.html"
OUT = ROOT / "seminar-slides-3h.html"


def extract_css(src: Path) -> str:
    text = src.read_text(encoding="utf-8")
    m = re.search(r"<style>(.*?)</style>", text, re.DOTALL)
    if not m:
        raise SystemExit("Could not find <style> in seminar-slides.html")
    return m.group(1).strip()


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def slide(
    idx: int,
    section: str,
    note: str,
    body: str,
    extra_class: str = "",
    active: bool = False,
) -> str:
    classes = ["slide"]
    if extra_class:
        classes.append(extra_class)
    if active:
        classes.append("active")
    ac = " ".join(classes)
    return f"""<!-- ═══ SLIDE {idx:03d} ═══ -->
<div class="{ac}" data-section="{esc(section)}" data-note="{esc(note)}">
  <div class="slide-inner">
{body}
  </div>
</div>
"""


def fu(*parts: str) -> str:
    """fade-up で包む（複数行）"""
    blocks = []
    for p in parts:
        if not p.strip():
            continue
        blocks.append(f'    <div class="fade-up">\n{p}\n    </div>')
    return "\n".join(blocks)


def simple_h2(title: str, sub: str | None = None) -> str:
    inner = f"      <h2>{title}</h2>"
    if sub:
        inner += f"\n      <p class=\"lead\">{sub}</p>"
    return fu(inner)


def main() -> None:
    css = extract_css(SOURCE)
    slides_html: list[str] = []

    # ── Block A: S001–S018 ─────────────────────────────
    slides_html.append(
        slide(
            1,
            "表紙",
            "3時間版オープニング。笑顔で挨拶。今日は休憩2回入ることを伝える。",
            fu(
                '<span class="emoji-big">🌿</span>',
                '<p style="font-size:16px; color:var(--tiffany-dark); letter-spacing:3px; font-weight:700;">無料オンラインセミナー（3時間版）</p>',
                """<h1 style="font-size:42px; margin-top:20px;">
        迷いを戦略に変える<br>
        <span class="highlight">マネジメント構造</span>セミナー
      </h1>""",
                '<div class="divider"></div>',
                '<p style="font-size:20px; color:var(--text-light);">静かなリーダーのための設計</p>',
                '<p style="font-size:17px; color:var(--text-light); margin-top:28px;">講師：岩田 望美</p>',
            ),
            "slide-cover",
            active=True,
        )
    )

    a_blocks = [
        (
            2,
            "オープニング",
            "正解・責めない・気づきの場、と約束する。",
            simple_h2("今日の約束", "正解を押しつけない／人を責めない／気づきの場"),
        ),
        (
            3,
            "オープニング",
            "チャット・うなずき・匿名でOK。",
            fu(
                '<span class="section-tag">参加のお願い</span>',
                """<h2>一緒に進めてください</h2>
      <p class="lead">うなずきやチャットで反応をください。<br>個人名・会社名がわかる書き込みは不要です。</p>""",
            ),
        ),
        (
            4,
            "オープニング",
            "知る→気づく→次の一歩、の3段階。",
            fu(
                '<span class="section-tag">今日のゴール</span>',
                """<h2>3つのゴール</h2>
      <p class="lead"><strong>①</strong> 伝わらない正体を「構造」で説明できる<br>
      <strong>②</strong> 自分ごととしてズレに気づく<br>
      <strong>③</strong> 次に何をするかが見える</p>""",
            ),
        ),
        (
            5,
            "オープニング",
            "アジェンダは成果で語る①。",
            fu(
                '<span class="section-tag">アジェンダ</span>',
                """<h2>成果で見る①</h2>
      <p class="lead">「もっと説明すれば伝わるはず」が<br>うまくいかない理由がわかる</p>""",
            ),
        ),
        (
            6,
            "オープニング",
            "②。",
            fu(
                '<span class="section-tag">アジェンダ</span>',
                """<h2>成果で見る②</h2>
      <p class="lead">「当たり前の違い」を<br>言葉にしやすくなる</p>""",
            ),
        ),
        (
            7,
            "オープニング",
            "③FFS。",
            fu(
                '<span class="section-tag">アジェンダ</span>',
                """<h2>成果で見る③</h2>
      <p class="lead">FFSで「整え方」の視点に触れる<br>（診断の宣伝ではなく、設計の話）</p>""",
            ),
        ),
        (
            8,
            "オープニング",
            "一本道の地図。",
            fu(
                '<span class="section-tag">今日の地図</span>',
                """<h2>流れはシンプル</h2>
      <p class="lead">共感 → ズレの構造 → FFS → 場面別 → 希望 → 次の一歩</p>""",
            ),
        ),
        (
            9,
            "導入",
            "肩書きと経歴。",
            fu(
                '<span class="emoji-big">👩‍💼</span>',
                """<h2>岩田 望美（いわた のぞみ）</h2>
      <p>元エンジニア → 管理職。現場とマネジメントの両方を経験。<br>FFSをマネジメントと対話に活用しています。</p>""",
            ),
            "bg-tiffany",
        ),
        (
            10,
            "導入",
            "スタンス：診断を渡すだけではない。",
            fu(
                """<h2>私のスタンス</h2>
      <p class="lead">診断結果を渡して終わり、ではなく、<br><span class="highlight">悩みと結果を紐づける対話</span>を大切にしています。</p>""",
            ),
            "bg-tiffany",
        ),
        (
            11,
            "導入",
            "おすすめの方。",
            fu(
                '<span class="section-tag">こんな方へ</span>',
                """<h2>今日の話が刺さりやすい方</h2>
      <ul class="pain-list">
        <li data-icon="💬">伝えているのに伝わらない</li>
        <li data-icon="🪜">リーダーになってから迷いが増えた</li>
        <li data-icon="🌫️">空気を読むだけで疲れる</li>
        <li data-icon="🤫">静かにチームを整えたい</li>
      </ul>""",
            ),
        ),
        (
            12,
            "導入",
            "チャットワーク①。",
            fu(
                '<span class="section-tag">ミニ参加</span>',
                """<h2>チャットで1つだけ</h2>
      <p class="lead">いまいちばん引っかかっている場面を、一言で書いてください。<br>（例：指示が伝わらない、1on1が空転…）</p>""",
            ),
            "bg-pink",
        ),
        (
            13,
            "導入",
            "反応へのお礼。",
            fu(
                """<h2>ありがとうございます</h2>
      <p class="lead">後半の「場面」のパートで、自分の言葉に置き換えて聞いてください。</p>""",
            ),
        ),
        (
            14,
            "導入",
            "テーマ一言。",
            fu(
                """<div class="big-msg" style="font-size:clamp(28px,4vmin,44px);">静かなリーダーのための<br>マネジメント設計</div>
      <p style="margin-top:24px;">迷いを戦略に変えて、関係の構造を整える。</p>""",
            ),
        ),
        (
            15,
            "導入",
            "キーワード。",
            fu(
                """<h2>今日のキーワード</h2>
      <p class="lead">解読／取扱説明書／見えない設計図</p>
      <p style="color:var(--text-light);">ラベルで切らず、構造で見るための比喩です。</p>""",
            ),
        ),
        (
            16,
            "問題提起",
            "全体像①問題。",
            fu(
                '<span class="section-tag">90秒で全体像</span>',
                """<h2>① 問題</h2>
      <p class="lead">「伝えてるのに伝わらない」「なんで噛み合わない」</p>""",
            ),
        ),
        (
            17,
            "問題提起",
            "全体像②誤解。",
            fu(
                """<h2>② よくある誤解</h2>
      <p class="lead">相手が悪い／自分が足りない／もっと説明・努力</p>""",
            ),
        ),
        (
            18,
            "問題提起",
            "全体像③転換〜次の一歩。",
            fu(
                """<h2>③ 転換 → ④ 本当の原因 → ⑤ 嬉しさ → ⑥ 次の一歩</h2>
      <p class="lead">当たり前が違う → 思考の型（FFS）→ 整える → 個別面談で紐づけ</p>""",
            ),
        ),
    ]

    for item in a_blocks:
        if len(item) == 5:
            idx, section, note, body, extra = item
            slides_html.append(slide(idx, section, note, body, extra))
        else:
            idx, section, note, body = item
            slides_html.append(slide(idx, section, note, body))

    n = 19

    # ── Block B: S019–S060 (42枚) ───────────────────────
    b_intro = [
        ("PART 1", "まず共感から", "ここから問題の多層化。"),
        ("悩み①", "プレイヤー時代はうまくいったのに…", "😣"),
        ("悩み②", "何度言っても伝わらない気がする", "🤔"),
        ("悩み③", "空気を読むだけで疲れる", "😓"),
        ("悩み④", "判断がいつも不安", "💦"),
        ("悩み⑤", "自分でやった方が早い", "🥺"),
        ("反応", "チャットで「はい」", "ありがとうございます。多くの方が同じです。"),
        ("世間の常識", "部下の問題／もっと説明／もっと頑張る", "列挙してからひっくり返す。"),
        ("問い", "同じ壁にぶつかっていませんか？", "なぜ、だろう？"),
        ("アハ①", "伝えているつもりほど届いていない", "逆説の提示。"),
        ("アハ①", "上司の頭には意図がある", "意図のスライド。"),
        ("アハ①", "言語化は一部だけ", "出てくる言葉は一部。"),
        ("アハ①", "相手は補完して受け取る", "過去・文脈・忙しさ。"),
        ("アハ①", "ズレの構造", "意図→言語化→受け取り→解釈"),
        ("アハ①", "共通の敵", "思考の型のズレが見えていないこと"),
        ("アハ①", "整える", "無理に変えなくていい"),
        ("急ぎで", "「急ぎでお願いね！」", "セリフ提示。"),
        ("急ぎで", "上司の頭：今日中・最優先", "イメージ。"),
        ("急ぎで", "部下の頭：今週中・できれば早め", "イメージ。"),
        ("急ぎで", "翌日「なんでまだ？」", "能力だけの問題ではない。"),
        ("別パターン", "現場：在庫確認してから／すぐ動く", "業種別の一例。"),
        ("別パターン", "オフィス：「今日中」の定義", "締め前／定時前／翌朝まで"),
        ("言葉の解釈", "急ぎ・ちゃんと・わかった・後で", "人によって中身が違う"),
        ("前提のズレ", "品質／スピード／リスクの優先", "レイヤーを一段深く"),
        ("役割期待", "リーダーは前に／メンバーは守る", "良い悪いではなく優先が違う"),
        ("良い仕事の定義", "正解は一つではない", "評価や指示がすれ違う"),
        ("アハ③", "仲良いのに仕事が噛み合わない", "逆説。"),
        ("アハ③", "見えない設計図", "比喩。"),
        ("FFS", "FFS理論の名前", "Five Factors & Stress"),
        ("5因子", "凝縮・受容・弁別・拡散・保全", "名前だけ。詳細はこれから。"),
        ("ブリッジ", "後半は因子ごとに深掘り", "メモ推奨。"),
        ("ワーク", "直近1週間のすれ違いを1つメモ", "30秒。共有不要。"),
        ("ワーク", "自分用のメモでOK", "安心。"),
        ("希望の前置き", "型が見えると整える", "休憩前に一言。"),
        ("希望の前置き", "整えるリーダーでいい", "強いリーダーじゃなくていい。"),
        ("希望の前置き", "取扱説明書が見える感覚", "ワクワクに寄せる。"),
        ("区切り", "ここまで一旦区切り", "後半はFFSの深掘り。"),
        ("区切り", "休憩に入る前に", "飲み物を用意してください。"),
        ("区切り", "後半の予告", "5因子×マネジ視点。"),
        ("バッファ", "（質問・補足）", "講師が伸ばす用スライド。"),
        ("バッファ", "（質問・補足）", "講師が伸ばす用スライド。"),
        ("バッファ", "（質問・補足）", "講師が伸ばす用スライド。"),
    ]
    for i, (tag, title, note) in enumerate(b_intro):
        body = fu(
            f'<span class="section-tag">{esc(tag)}</span>' if not tag.startswith("（") else "",
            f"<h2>{esc(title)}</h2>" if title else "<h2>補足</h2>",
            f'<p class="lead">{esc(note)}</p>',
        )
        slides_html.append(slide(n, "問題の多層化", note, body, "bg-pink" if i % 7 == 3 else ""))
        n += 1

    assert n == 61, n

    # ── Block C: S061–S062 ─────────────────────────────
    slides_html.append(
        slide(
            61,
            "休憩",
            "10分休憩。再開時刻を表示。",
            fu(
                '<span class="emoji-big">☕</span>',
                """<h2>休憩（10分）</h2>
      <p class="lead">戻ったら、FFSの深掘りに入ります。</p>""",
            ),
            "bg-yellow",
        )
    )
    slides_html.append(
        slide(
            62,
            "休憩",
            "再開予告。",
            fu(
                """<h2>後半の予告</h2>
      <p class="lead">5因子を、マネジメントの現場に落とし込みます。</p>""",
            ),
        )
    )
    n = 63

    # ── Block D: FFS 72枚 (5因子×12 + 3ステップ12) ─────
    FACTORS = [
        ("A", "凝縮性", "信念を軸に集める力", "🔥"),
        ("B", "受容性", "受け止め、寄り添う力", "🤗"),
        ("C", "弁別性", "比較・判断して選ぶ力", "⚖️"),
        ("D", "拡散性", "広がり、動き出す力", "🚀"),
        ("E", "保全性", "守り、改善する力", "🛡️"),
    ]

    def factor_slide(kind: str, title: str, text: str, bg: str = "") -> str:
        return fu(
            f'<span class="section-tag">FACTOR {kind}</span>',
            f"<h2>{esc(title)}</h2>",
            f'<p class="lead">{esc(text)}</p>',
        )

    factor_templates = [
        ("タイトル", lambda fi, fn, fl, ic: factor_slide(fi[0], f"{ic} {fn}", "この因子のレンズ")),
        ("ひとこと定義", lambda fi, fn, fl, ic: factor_slide(fi[0], "ひとことで", fl)),
        ("強みが出る場面", lambda fi, fn, fl, ic: factor_slide(fi[0], "強みが出る場面", "仕事の具体例でイメージ")),
        ("ストレス", lambda fi, fn, fl, ic: factor_slide(fi[0], "ストレスが出やすい場面", "あなたの疲れのパターン")),
        ("誤解", lambda fi, fn, fl, ic: factor_slide(fi[0], "誤解されやすいラベル", "中身は設計図の違い")),
        ("ミス①", lambda fi, fn, fl, ic: factor_slide(fi[0], "マネジで起きやすいミス①", "自分のクセに気づく")),
        ("ミス②", lambda fi, fn, fl, ic: factor_slide(fi[0], "マネジで起きやすいミス②", "相手との関係に出やすい")),
        ("すれ違い", lambda fi, fn, fl, ic: factor_slide(fi[0], "相手因子が違うとき", "ペース感・守りたいものが違う")),
        ("ミニ事例", lambda fi, fn, fl, ic: factor_slide(fi[0], "ミニ事例（会話）", "正しさではなく、守っているものを聞く")),
        ("整え方", lambda fi, fn, fl, ic: factor_slide(fi[0], "整え方のヒント", "行動を1つだけ決める")),
        ("フレーズ", lambda fi, fn, fl, ic: factor_slide(fi[0], "言い換えフレーズ例", "その場で使える一文")),
        ("まとめ", lambda fi, fn, fl, ic: factor_slide(fi[0], f"{fn}のまとめ", "次の因子へ")),
    ]

    for fi in FACTORS:
        for j, (label, fn_lambda) in enumerate(factor_templates):
            body = fn_lambda(fi, fi[1], fi[2], fi[3])
            note = f"{fi[1]}：{label}。台本はセミナーシナリオ_3時間版.md を参照。"
            extra = "bg-tiffany" if j == 0 else ""
            slides_html.append(slide(n, "FFSコア", note, body, extra))
            n += 1

    # S123–S134 3ステップ＋バッファ
    tail_d = [
        ("3ステップ", "自分を知る", "診断で思考特性を把握"),
        ("3ステップ", "相手を知る", "メンバーのパターンを理解"),
        ("3ステップ", "関係を設計する", "場当たりから設計へ"),
        ("FAQ", "よくある質問①", "因子に良い悪いはない、と説明"),
        ("FAQ", "よくある質問②", "ストレスの出方は個人差"),
        ("FAQ", "よくある質問③", "診断は入口、対話が本番"),
        ("図解", "迷いを卒業する流れ", "ここから場面別パートへ"),
        ("バッファ", "（深掘り・補足）", "講師用"),
        ("バッファ", "（深掘り・補足）", "講師用"),
        ("バッファ", "（深掘り・補足）", "講師用"),
        ("バッファ", "（深掘り・補足）", "講師用"),
        ("バッファ", "（深掘り・補足）", "講師用"),
    ]
    for title, h2, sub in tail_d:
        slides_html.append(
            slide(
                n,
                "FFSコア",
                sub,
                fu(f"<h2>{esc(h2)}</h2>", f'<p class="lead">{esc(sub)}</p>'),
                "bg-lavender" if "3ステップ" in title else "",
            )
        )
        n += 1

    assert n == 135, n

    # ── Block E: S135–S172 (38) ─────────────────────────
    e_items = [
        ("PART 4", "組み合わせと場面", "因子の知識を現場に落とす。"),
        ("典型①", "拡散×保全", "スピードとリスク感のズレ"),
        ("典型①", "起きること", "前に進みたいのに足がすくむ"),
        ("典型①", "整え方", "試す範囲と止める条件、守るラインの合意"),
        ("典型②", "凝縮×受容", "軸と空気のズレ"),
        ("典型②", "起きること", "方針は早いのに現場が追いつかない"),
        ("典型②", "整え方", "前提確認と犠牲にするものの明示"),
        ("典型③", "弁別×受容", "正論と感情のズレ"),
        ("典型③", "起きること", "会話がすれ違う"),
        ("典型③", "整え方", "共感一行→論点→結論"),
        ("場面", "指示", "NG：期限だけ／整え：期限・優先・完了定義"),
        ("場面", "指示", "言い換え例を複数用意"),
        ("場面", "1on1", "NG：質問が早すぎる／整え：目的・沈黙・次の一歩"),
        ("場面", "1on1", "答え面談か、吐く面談か"),
        ("場面", "フィードバック", "NG：結果だけ／整え：事実・影響・次の行動"),
        ("場面", "フィードバック", "評価か改善か、目的を先に"),
        ("場面", "優先順位", "NG：全部最優先"),
        ("場面", "優先順位", "整え：上位目的の一枚化・トレードオフの明示"),
        ("ワーク", "冒頭のメモを見返す", "どの場面に近いか心の中で結びつける"),
        ("まとめ", "型＋前提＋順番", "場面で詰まったら三点を疑う"),
        ("まとめ", "講義から実務へ", "橋をかける"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
        ("バッファ", "（事例・補足）", "講師用"),
    ]
    for tag, h2, sub in e_items:
        sec = "組み合わせ・場面"
        body = fu(
            f'<span class="section-tag">{esc(tag)}</span>' if not tag.startswith("（") else "",
            f"<h2>{esc(h2)}</h2>",
            f'<p class="lead">{esc(sub)}</p>',
        )
        slides_html.append(slide(n, sec, sub, body, "bg-pink" if "典型" in tag else ""))
        n += 1

    assert n == 173, n

    # ── Block F: S173–S174 ──────────────────────────────
    slides_html.append(
        slide(
            173,
            "休憩",
            "10分休憩。",
            fu('<span class="emoji-big">☕</span>', "<h2>休憩（10分）</h2>", "<p class=\"lead\">最後に希望・ご案内・質疑です。</p>"),
            "bg-yellow",
        )
    )
    slides_html.append(
        slide(
            174,
            "休憩",
            "再開。",
            fu("<h2>再開します</h2>", "<p class=\"lead\">希望・事例・次の一歩に進みます。</p>"),
        )
    )
    n = 175

    # ── Block G: S175–S188 (14) ───────────────────────────
    g_items = [
        ("希望", "型が見えると", "努力で性格を変えなくていい、に近づく"),
        ("希望", "整えるリーダー", "強いリーダーじゃなくていい"),
        ("証明", "事例①エンジニア", "本音が出た・関係が動いた"),
        ("証明", "事例②別職種", "任せられるようになった"),
        ("証明", "事例③1年目", "判断の軸ができた"),
        ("順番", "見え方の変化", "自分が楽になる→関わり方→周りが動く"),
        ("リスク", "知らないままだと", "本音が出なくなりすれ違いが積む"),
        ("対比", "一年後：このまま", "すれ違い・抱え込み・迷いの蓄積"),
        ("対比", "いま動く", "型が見える・整え方が見える"),
        ("ベネフィットA", "仕事の場面", "動き・伝わる・まとまる"),
        ("ベネフィットB", "心・生活・長期", "楽になる・持ち込みにくい"),
        ("バッファ", "（引用・図）", "講師用"),
        ("バッファ", "（引用・図）", "講師用"),
        ("バッファ", "（引用・図）", "講師用"),
    ]
    for title, h2, sub in g_items:
        slides_html.append(
            slide(
                n,
                "希望・証拠",
                sub,
                fu(f"<h2>{esc(h2)}</h2>", f'<p class="lead">{esc(sub)}</p>'),
                "bg-tiffany" if n % 2 == 0 else "",
            )
        )
        n += 1

    assert n == 189, n

    # ── Block H: S189–S198 (10) ───────────────────────────
    h_items = [
        ("次の一歩", "まず自分の型を知る", "そこから"),
        ("ご案内", "迷いを戦略に変える面談", "個別"),
        ("ご案内", "流れ（4ステップ）", "診断→ヒアリング→紐づけ→必要ならプログラム"),
        ("ご案内", "60〜90分・マンツーマン", "形式"),
        ("ご案内", "特典価格", "セミナー参加者限定 1万円（例：通常3万）"),
        ("ご案内", "2ヶ月プログラム概要", "月2回×2ヶ月・チャット等"),
        ("ご案内", "一人では難しい理由", "紐づけは第三者がいると進む"),
        ("メッセージ", "マネジは才能より構造", "岩田から"),
        ("CTA", "お申し込み", "URL・QRを差し替え"),
        ("礼", "ありがとうございました", "締め"),
    ]
    for title, h2, sub in h_items:
        extra = "bg-pink" if "ご案内" in title or "CTA" in title else ""
        slides_html.append(slide(n, "ご案内" if "ご案内" in title or "CTA" in title else "メッセージ", sub, fu(f"<h2>{esc(h2)}</h2>", f'<p class="lead">{esc(sub)}</p>'), extra))
        n += 1

    assert n == 199, n

    # ── Block I: S199–S200 ──────────────────────────────
    slides_html.append(
        slide(
            199,
            "Q&A",
            "FAQ（診断・守秘・合わない場合など）。",
            fu(
                "<h2>よくある質問</h2>",
                "<p class=\"lead\">運用に合わせて文言を差し替えてください。</p>",
            ),
        )
    )
    slides_html.append(
        slide(
            200,
            "Q&A",
            "自由質疑。",
            fu(
                "<h2>質疑応答</h2>",
                "<p class=\"lead\">チャットから拾って回答します。</p>",
            ),
            "slide-cover",
        )
    )

    # navTotal は JS で自動計算するのでプレースホルダでよい

    script = """
<script>
const slides = document.querySelectorAll('.slide');
let current = 0;
const total = slides.length;
let noteVisible = false;

document.getElementById('navTotal').textContent = total;

function showSlide(i) {
  slides.forEach((s, idx) => {
    s.classList.remove('active');
    s.style.opacity = '0';
    s.style.transform = idx < i ? 'translateY(-16px)' : 'translateY(16px)';
    s.style.pointerEvents = 'none';
  });
  slides[i].classList.add('active');
  slides[i].style.opacity = '1';
  slides[i].style.transform = 'translateY(0)';
  slides[i].style.pointerEvents = 'auto';
  current = i;
  document.getElementById('navCurrent').textContent = i + 1;
  document.getElementById('navSectionLabel').textContent = slides[i].dataset.section || '';
  document.getElementById('progressBar').style.width = ((i + 1) / total * 100) + '%';
  document.getElementById('speakerNoteText').textContent = slides[i].dataset.note || '';
}

function nextSlide() { if (current < total - 1) showSlide(current + 1); }
function prevSlide() { if (current > 0) showSlide(current - 1); }

function toggleNote() {
  noteVisible = !noteVisible;
  document.getElementById('speakerNote').classList.toggle('show', noteVisible);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
  if (e.key === 'n' || e.key === 'N') toggleNote();
});

showSlide(0);
</script>
"""

    html_out = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>迷いを戦略に変えるマネジメント構造セミナー（3時間版）</title>
<style>
{css}
</style>
</head>
<body>

<div class="progress-bar" id="progressBar"></div>
<div class="slide-container" id="slideContainer">

{chr(10).join(slides_html)}

</div><!-- /slide-container -->

<nav class="nav-bar">
  <div class="nav-section-label" id="navSectionLabel">表紙</div>
  <div class="nav-controls">
    <span class="nav-counter"><span id="navCurrent">1</span> / <span id="navTotal">200</span></span>
    <button class="nav-btn" type="button" id="btnPrev" onclick="prevSlide()">←</button>
    <button class="nav-btn" type="button" id="btnNext" onclick="nextSlide()">→</button>
    <button class="nav-btn" type="button" id="btnNote" onclick="toggleNote()" title="スピーカーノート">📝</button>
  </div>
</nav>

<div class="speaker-note" id="speakerNote">
  <div class="speaker-note-label">SPEAKER NOTE</div>
  <div id="speakerNoteText"></div>
</div>

{script}
</body>
</html>
"""

    OUT.write_text(html_out, encoding="utf-8")
    print(f"Wrote {OUT} with {len(slides_html)} slides.")


if __name__ == "__main__":
    main()
