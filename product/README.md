# product/ フォルダ構成

案件ごとの制作物と、横断ナレッジを分けています。

| パス | 用途 |
|------|------|
| **`案件/`** | クライアント別（FFS・やさしく売れる占い師・育脳子育て・未来覚醒など）。LP・メール・MTG・ナレッジ・シナリオなど。 |
| **`講師横断/`** | 講師単位の共有素材（例：本田有紀華さんの全案件共通ハブ、メールフッター原稿）。 |
| **`講師横断/本田有紀華/`** | 本田有紀華さんの全案件共通ハブ（`README.md`・`00_全案件共通ルール.md`・`honda-yukika-mail-footer.md`）。 |
| **`講師横断/共通マインドセット/`** | 全案件共通の判断軸・温度定義（例：`5層セグメント_購買温度ピラミッド.md`）。 |

案件横断のセールス・教育設計の型は、リポジトリ直下の **`katsuya_project/`**（Obsidian からは **`obsidian/katsuya_project`**）。

**ひとびじ**は **Katsuya プロジェクト**の一部。ブランド原稿（`LAB/`・`ハウスメール/`・`X/`）の Git 正本は **`katsuya_project/ひとびじ/`** のみ（`product/` や `katsuya_project/セールスマインドセット/` には置かない）。Obsidian からは **`obsidian/ひとびじ` → `../katsuya_project/ひとびじ`** のシンボリックリンクで同じ内容にアクセスする。

## Obsidian ボルトから見た `product`・`katsuya_project`・`ひとびじ`

- **案件・講師横断の制作物**の Git 上の正本は **`product/`**（`obsidian/product` → `../product`）。
- **Katsuya プロジェクト**（セールス横断の型＋ひとびじブランド）は **`katsuya_project/`**（`obsidian/katsuya_project` → `../katsuya_project`）。うち **ひとびじ**は **`katsuya_project/ひとびじ/`**（ボルトでは `obsidian/ひとびじ` がリンク）。

macOS の大小文字非区別ボリュームでは `Obsidian/` と `obsidian/` が同一パスとして解決されることがあります。

## 案件フォルダのハブ README（YAML＋ウィキリンク索引）

新規案件で **`product/案件/<案件名>/README.md`** を「索引ノート」にするときは、ワークスペース共通のひな形 **`katsuya_project/テンプレート/案件ハブ_NOTE.md`** を複製して使う。**Cursor が自動で効かせる条件**は **`.cursor/rules/project-case-hub.mdc`** に定義されている（LP 本文・メール本文など別用途には同じ型を入れない）。

## リポジトリ直下の `product` について

GitHub Pages の公開 URL は **`.../product/案件/...`** のままです。ルートの **`product` は通常ディレクトリ**なので、GitHub・Windows・シンボリックリンク無効のクローンでも問題になりません。

## 公開 URL について

商品 LP を GitHub Pages の `product/...` で出している場合、パスは **`product/案件/<商品フォルダ>/lp/`** になります。詳細は `.cursor/rules/lp-deploy.mdc` を参照してください。
