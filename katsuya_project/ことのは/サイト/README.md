---
title: ことのは｜公式サイト
project: ことのは
type: knowledge
status: draft
tags:
  - project
  - wordpress
  - website
制作日: 2026-09-20
---

# ことのは｜公式サイト

[kotonoha.co](https://kotonoha.co/) 向けのサイト資産置き場です。

本番はエックスサーバー（`sv2012.xserver.jp`）の WordPress。親テーマは **Blocksy**。見た目は子テーマ `blocksy-child` の編集部型（VOGUE 型の Journal）で上書きします。

ローカル確認: `katsuya_project/ことのは/サイト/preview.html`

## 📌 いまの正本

- **子テーマ**: `katsuya_project/ことのは/サイト/blocksy-child/`
- **公開URL**: https://kotonoha.co/
- **管理画面**: https://kotonoha.co/wp-admin/
- **ログイン名**: `katsuyafujinaga`

## Cursor からテーマを上げる

1. `blocksy-child/` の中のファイルを右クリック → **Upload**
2. 行き先は **kotonoha.co テーマ（blocksy-child）**
3. パスワードは Cyberduck と同じもの

保存した瞬間には上がりません。右クリックしたときだけです。

サーバーの中を見るときは **Command + Shift + P** → `SFTP: List All` → **kotonoha.co WordPress**。

初回だけ、管理画面の **外観 → テーマ** で **Blocksy Child** を有効化してください。Customizer の見た目が親のまま残るか確認し、崩れていたら有効化を戻して知らせてください。

## WordPress連携（記事・固定ページ）

Markdown と本番を XML-RPC で読み書きします。認証は **kotonoha.co 用のアプリケーションパスワード**（ひとびじサイトのものは別です）。

### 初回だけ

1. [管理画面](https://kotonoha.co/wp-admin/) → **ユーザー → プロフィール → アプリケーションパスワード** を発行（名前は `Cursor` でよい）
2. `ワードプレス接続.txt` を開き、`WP_APP_PASSWORD` を入れる
3. 接続確認

```bash
cd katsuya_project/ことのは/サイト
python3 wp_sync.py test
```

### 日常のコマンド

```bash
cd katsuya_project/ことのは/サイト

python3 wp_sync.py list                  # 投稿・固定ページ一覧
python3 wp_sync.py pull                  # WordPress → ローカル Markdown（wp_local/）
python3 wp_sync.py push 原稿.md          # ローカル → WordPress（既定は下書き）
python3 wp_sync.py push 原稿.md --status publish
```

- **pull** したファイルは `wp_local/posts/` と `wp_local/pages/` に保存される
- **push** すると原稿の frontmatter に `wp_id` が書き戻る
