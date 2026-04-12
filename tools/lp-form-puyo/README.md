# LP オプトインフォーム＋ぷよぷよボタン（再利用キット）

`tools/lp3` で使っている **メール入力の枠デザイン** と、送信ボタン画像の **ぷよぷよ（拡縮＋skew）アニメーション** を、他の商品LPでもそのまま流用できるようにまとめたナレッジです。

## ぷよぷよはスクリプト不要

動きは **CSS の `@keyframes` のみ** です。JavaScript は不要です（lp3 も同様）。

## Cursor で「呼び出す」とき

チャットで例えば次のように言うと、`.cursor/rules/tools-lp-form-puyo.mdc` 経由でこの README と `lp-form-puyo.css` を前提に実装できます。

- 「`tools/lp-form-puyo` のキットでフォーム作って」
- 「ぷよぷよフォームをこの LP に入れて」

## ファイル一覧

| ファイル | 用途 |
|----------|------|
| `lp-form-puyo.css` | 見た目＋アニメーション（**必須**） |
| `snippet.html` | HTML のコピー用たたき台 |
| `index.html` | ブラウザでの見た目確認用（ローカル or Pages） |

## 取り込み手順（新規 LP）

1. **`lp-form-puyo.css` を LP フォルダにコピー**  
   例: `product/◯◯/lp/css/lp-form-puyo.css`

2. **HTML の `<head>` で読み込む**（パスは環境に合わせる）

   ```html
   <link rel="stylesheet" href="./css/lp-form-puyo.css" />
   ```

3. **マークアップは必ず `.lp-form-puyo-kit` でラップする**  
   内側のクラス名は `snippet.html` と同じ `lpfp-*` を使う（他スタイルとの衝突を防ぐため）。

4. **送信ボタンは `<span class="lpfp-btn-shell">` で `input[type="image"]` を包む**  
   画像送信ボタンはブラウザによっては `transform` が効かないため、ぷよぷよは **shell 側** に `animation` を掛けています（`snippet.html` 参照）。

5. **差し替えるもの**
   - `<form action="...">` … 登録先 URL
   - `input[name="..."]` … UTAGE / MyASP 等の仕様に合わせる
   - 見出し画像・`button.png` のパス
   - 登録ツールが `type="email"` を嫌う場合は `snippet.html` のメール欄を `type="text"` に変更する

## lp3 とのクラス対応（レガシー移植時）

| lp3（旧） | このキット（新） |
|-----------|------------------|
| `section.form` | `.lpfp-section`（親は `.lp-form-puyo-kit`） |
| `form.submit` | `form.lpfp-inner` |
| `input.deco`（メール） | `input.lpfp-input` |
| `span.btn-shell` + `input.btn` | `span.lpfp-btn-shell` + `input.lpfp-btn`（アニメは shell 側） |
| `div.optin` | `div.lpfp-optin` |

## リファラ hidden を自動で埋める場合

`tools/lp3/js/referer.js` と同じロジックを、LP の `</body>` 直前で読み込めば、`.UserRefererFormUrl` / `.UserRefererUrl` に現在URL・リファラが入ります。

## 公開 URL（GitHub Pages）

`katsuya-repository` に push 後の想定パス:

`https://katsuya-fujinaga.github.io/katsuya-repository/tools/lp-form-puyo/`

- プレビュー: 上記 `index.html`
- CSS 直リンク（参考）: `.../tools/lp-form-puyo/lp-form-puyo.css`

※ 商品LPに使うときは **リポジトリ内にコピーして相対パス** が確実です。CDN 的に Pages の CSS だけ参照するより、同梱を推奨します。

## 元ネタ

- 実装サンプル: `tools/lp3/index.html` + `tools/lp3/css/style.css`（`.form` / `.btn` / `@keyframes btn-animation-f`）
