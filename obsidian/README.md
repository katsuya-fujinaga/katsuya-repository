# hitobiji Obsidian ボルト

この **`obsidian/`** ディレクトリが Obsidian の保管庫（`.obsidian` 設定あり）です。Obsidian の「保管庫としてフォルダを開く」で、リポジトリ内の **`obsidian`** フォルダ（＝本ファイルがある階層）を指定してください。**`obsidian/product`** は **`../product`**、**`obsidian/katsuya_project`** は **`../katsuya_project`**、**`obsidian/ひとびじ`** は **`../katsuya_project/ひとびじ`** へのシンボリックリンクなので、ボルト内からリポジトリ直下と同じツリーに届きます。**プラグイン設定を使うなら `obsidian` 単体を開くのがおすすめ**です。

## フォルダの役割

| パス | 内容 |
|------|------|
| **`product/`** | 案件・講師横断の制作物ナレッジ（実体はリポジトリ直下 `../product/` へのリンク）。 |
| **`katsuya_project/`** | **Katsuya プロジェクト**のうち、案件横断のセールス・教育設計ナレッジ（実体は `../katsuya_project/` へのリンク）。 |
| **`ひとびじ/`** | **Katsuya プロジェクト**のうち、藤永個人ブランドの**正本**（**`LAB/`**・**`ハウスメール/`**・**`X/`**）。実体は **`../katsuya_project/ひとびじ/`** へのリンク（`katsuya_project/` 直下の **`セールスマインドセット/`** は「型」置き場と分担）。 |
| **`本田有紀華コンテンツ/`** | 本田先生まわりの LP・レター等（wikilink 用 frontmatter あり）。 |
| **`メール原稿/`** | メール推敲・配信前ワーク用。**`たたき台/`**（横断メモ）・**`案件メモ/`**（案件サブフォルダ用）を含む。 |
| **`ツール/`** | Cursor 等のメモ。 |
| **`パーソナル/`** | 個人メモ。 |

## ローカル一時フォルダ（リポジトリに含めない）

| パス | 説明 |
|------|------|
| **`.tmp_py/`** | PyMuPDF などを `--target` で置いた残骸。削除してよい。再び PDF 変換が必要なら `python3 -m venv .venv` → `pip install pymupdf` などでよい。 |
| **`.tmp_pdf_images/`** | 一時書き出し用。スライド画像の**正本**は `product/案件/育脳子育てカウンセラー/スワイプ_PDF書き出しPNG/`。 |

## `product`・`katsuya_project`・GitHub Pages

公開 URL は従来どおり **`product/案件/.../lp/`** です。リポジトリ直下の **`product/`**（案件・講師横断）と **`katsuya_project/`**（Katsuya プロジェクト・型＋ひとびじブランド本文）が Git 上の正本で、ボルト側は **`obsidian/product` → `../product`**、**`obsidian/katsuya_project` → `../katsuya_project`**、**`obsidian/ひとびじ` → `../katsuya_project/ひとびじ`**。**ひとびじ**の実ファイルは **`katsuya_project/ひとびじ/`** にのみ置きます（ボルトからはリンク経由で同じツリー）。詳細は `product/README.md`・`katsuya_project/README.md`・`katsuya_project/ひとびじ/README.md` と `.cursor/rules/lp-deploy.mdc` を参照してください。

## 本田先生まわりの整理

- **LP・レター・精算メモ**：`本田有紀華コンテンツ/`（Obsidian 用のリンク付き原稿）。
- **ステップメール・個別相談・案件 README**：`product/案件/愛され手相カウンセラー/`。
- **メールフッター（MyASP 用・3ブランド）**：`product/講師横断/本田有紀華/honda-yukika-mail-footer.md`（Cursor ルール `.cursor/rules/honda-yukika-mail-footer.mdc` は要約＋共通ブロック）。
