---
title: ひとびじ｜公式サイト
project: ひとびじ
type: hub
status: draft
tags:
  - project
  - hub
  - website
制作日: 2026-07-09
---

# ひとびじ｜公式サイト

[katsuyafujinaga.com](https://katsuyafujinaga.com/) 向けのサイト資産置き場です。

## 📌 いまの正本

- **WordPressテーマ（水色LP）**: [[hitobizi-lab/README]]（Version 1.3.0）
- パス: `katsuya_project/ひとびじ/サイト/hitobizi-lab/`
- **WordPressテーマ（HITORI-BIZ・モノクロ）**: [[hitori-biz/README]]（Version 1.0.0）
- パス: `katsuya_project/ひとびじ/サイト/hitori-biz/`
- ZIP: `katsuya_project/ひとびじ/サイト/hitori-biz.zip`

## 表記ルール（統一）

| 項目 | 文言 |
|------|------|
| サイトのタイトル | 50代からのひとりビジネスのはじめ方 |
| キャッチフレーズ | 藤永勝也｜ひとびじLAB |
| 画面上のブランド | ひとびじLAB |

## 📂 構成方針

- ホーム＝公式サイト型（STORY／METHOD／入り口／FREE）＋ブログ入口
- プロフィール／実績＝固定ページ
- 記事＝WordPress投稿
- 記事カテゴリ＝再起と働き方／プロデュース論／マーケティング／コンテンツ販売／仕事術・思考法／お知らせ
- プロジェクト実績は記事カテゴリではなく固定ページ「実績」

## WordPress連携（Cursor ↔ 本番）

Cursor の Markdown と [katsuyafujinaga.com](https://katsuyafujinaga.com/) を、REST API で読み書きします。

このサーバーは `/wp-json/` のログインが通らないため、スクリプトは **XML-RPC** で読み書きします。認証は **アプリケーションパスワード**（`ワードプレス接続.txt`。Git には入れない）。

### 初回だけ

1. WordPress 管理画面 → **ユーザー → プロフィール → アプリケーションパスワード** を発行
2. `ワードプレス接続.txt` を開き、`WP_USER` と `WP_APP_PASSWORD` を入れる（Command+P でファイル名検索）
3. 接続確認

```bash
cd katsuya_project/ひとびじ/サイト
python3 wp_sync.py test
```

### 日常のコマンド

```bash
cd katsuya_project/ひとびじ/サイト

python3 wp_sync.py list                  # 投稿・固定ページ一覧
python3 wp_sync.py pull                  # WordPress → ローカル Markdown（wp_local/）
python3 wp_sync.py push 原稿.md          # ローカル → WordPress（既定は下書き）
python3 wp_sync.py push 原稿.md --status publish --category marketing
```

- **pull** したファイルは `wp_local/posts/` と `wp_local/pages/` に保存される
- **push** すると原稿の frontmatter に `wp_id` が書き戻る。次回以降は同じIDを更新する
- `COLUMN_01_….md` のように「WordPress投稿用」セクションがある原稿は、その本文だけを送る

## 次の作業

1. `ワードプレス接続.txt` にユーザー名とアプリパスワードを入れて `python3 wp_sync.py test`
2. `python3 wp_sync.py pull` で本番の記事を取り込む
3. テスト記事を1本 `push`（下書き）して管理画面で確認
