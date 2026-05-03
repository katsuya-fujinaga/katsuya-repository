# katsuya_project/

**Katsuya プロジェクト**（藤永さん個人のナレッジ・ブランドまわり）のうち、**リポジトリ直下のこのフォルダ**に主に次を置いています。

| パス | 内容 |
|------|------|
| **`セールスマインドセット/`** | 案件横断のセールス・個別相談・教育設計の**型**ドキュメント。 |
| **`メールライティング/`** | メール運用の**インデックス**（Cursor ルール・ボルト・`product/` の対応関係）。詳細は `メールライティング/README.md`。 |
| **`ひとびじ/`** | **ひとびじブランド**の正本（**`LAB/`**・**`ハウスメール/`**・**`X/`**）。ひとびじLAB の実ファイルはすべてここ。 |
| **`テンプレート/`** | ワークスペース共通の複製用ひな形。**`案件ハブ_NOTE.md`** は `product/案件/<案件>/README.md` 等の YAML＋ウィキリンク索引の正本。Cursor ルールは **`.cursor/rules/project-case-hub.mdc`**（常時適用・「ハブ」のみで発動）。 |

Obsidian ボルトを **`obsidian`** で開いているとき、**`obsidian/ひとびじ` → `../katsuya_project/ひとびじ`** のシンボリックリンクで同じツリーを触れます（wikilink 用のパスは従来どおり **`ひとびじ/...`**）。

Obsidian の保管庫からは **`obsidian/katsuya_project` → `../katsuya_project`** でこの README と同じ階層にアクセスできます。運用の詳細は `.cursor/rules/lp-deploy.mdc` と `product/README.md` を参照してください。
