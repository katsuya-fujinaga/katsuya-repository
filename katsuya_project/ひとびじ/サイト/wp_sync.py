#!/usr/bin/env python3
"""Cursor の Markdown と WordPress 投稿／固定ページを同期する。

このホストは REST のログイン（Authorization）が通らないため、XML-RPC を使う。
認証はアプリケーションパスワード。.env / ワードプレス接続.txt は Git に含めない。
"""

from __future__ import annotations

import argparse
import html
import re
import sys
import xmlrpc.client
from datetime import datetime
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
ENV_PATH = HERE / ".env"
CRED_PATH = HERE / "ワードプレス接続.txt"
PULL_DIR = HERE / "wp_local"


# ---------------------------------------------------------------------------
# env
# ---------------------------------------------------------------------------

def _parse_env_text(text: str) -> dict[str, str]:
    env: dict[str, str] = {}
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def load_env(path: Path = ENV_PATH) -> dict[str, str]:
    env: dict[str, str] = {}
    if path.exists():
        env.update(_parse_env_text(path.read_text(encoding="utf-8")))
    if CRED_PATH.exists():
        env.update(_parse_env_text(CRED_PATH.read_text(encoding="utf-8")))
    return env


def save_env(values: dict[str, str], path: Path = CRED_PATH) -> None:
    lines = [
        "# このファイルは Git に上がりません。チャットにも貼らないでください。",
        "WP_URL=" + values.get("WP_URL", "").rstrip("/"),
        "WP_USER=" + values.get("WP_USER", ""),
        "WP_APP_PASSWORD=" + values.get("WP_APP_PASSWORD", ""),
        "WP_REST_STYLE=" + values.get("WP_REST_STYLE", "query"),
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")
    ENV_PATH.write_text("\n".join(lines[1:]), encoding="utf-8")


def require_config() -> dict[str, str]:
    env = load_env()
    missing = [k for k in ("WP_URL", "WP_USER", "WP_APP_PASSWORD") if not env.get(k)]
    if missing:
        sys.exit(
            "設定が不足しています: "
            + ", ".join(missing)
            + f"\n{CRED_PATH.name} の WP_USER と WP_APP_PASSWORD を埋めて保存してください。"
        )
    env["WP_URL"] = env["WP_URL"].rstrip("/")
    env["WP_APP_PASSWORD"] = env["WP_APP_PASSWORD"].replace(" ", "")
    env.setdefault("WP_REST_STYLE", "query")
    return env


# ---------------------------------------------------------------------------
# XML-RPC
# ---------------------------------------------------------------------------

def xmlrpc_proxy(cfg: dict[str, str]) -> xmlrpc.client.ServerProxy:
    return xmlrpc.client.ServerProxy(f"{cfg['WP_URL']}/xmlrpc.php", allow_none=True)


def wp_fault(exc: Exception) -> None:
    if isinstance(exc, xmlrpc.client.Fault):
        raise SystemExit(f"WordPress XML-RPC エラー {exc.faultCode}: {exc.faultString}") from exc
    if isinstance(exc, xmlrpc.client.ProtocolError):
        raise SystemExit(f"接続エラー {exc.errcode}: {exc.errmsg}") from exc
    raise SystemExit(f"接続できませんでした: {exc}") from exc


def wp_blogs(cfg: dict[str, str]) -> list[dict[str, Any]]:
    try:
        return xmlrpc_proxy(cfg).wp.getUsersBlogs(cfg["WP_USER"], cfg["WP_APP_PASSWORD"])
    except Exception as exc:
        wp_fault(exc)
        return []


def blog_id(cfg: dict[str, str]) -> int:
    blogs = wp_blogs(cfg)
    if not blogs:
        raise SystemExit("このユーザーで操作できるブログが見つかりません。")
    return int(blogs[0].get("blogid") or 1)


def wp_call(cfg: dict[str, str], method: str, *args: Any) -> Any:
    proxy = xmlrpc_proxy(cfg)
    fn = getattr(proxy.wp, method)
    try:
        return fn(blog_id(cfg), cfg["WP_USER"], cfg["WP_APP_PASSWORD"], *args)
    except Exception as exc:
        wp_fault(exc)
        return None


def fetch_posts(cfg: dict[str, str], post_type: str, status: str = "any") -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    offset = 0
    number = 100
    while True:
        filt: dict[str, Any] = {
            "post_type": post_type,
            "number": number,
            "offset": offset,
            "post_status": status or "any",
        }
        batch = wp_call(cfg, "getPosts", filt) or []
        items.extend(batch)
        if len(batch) < number:
            break
        offset += number
    return items


def xml_date(value: Any) -> str:
    if hasattr(value, "strftime"):
        return value.strftime("%Y-%m-%d")
    text = getattr(value, "value", None) or str(value or "")
    digits = re.sub(r"\D", "", text)
    if len(digits) >= 8:
        return f"{digits[0:4]}-{digits[4:6]}-{digits[6:8]}"
    return datetime.now().strftime("%Y-%m-%d")


# ---------------------------------------------------------------------------
# Markdown / HTML
# ---------------------------------------------------------------------------

FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.S)
WP_COMMENT_RE = re.compile(r"<!--\s+/?wp:.*?-->", re.S)


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    meta: dict[str, Any] = {}
    key = None
    list_key = None
    for line in match.group(1).splitlines():
        if re.match(r"^-\s+", line) and list_key:
            meta.setdefault(list_key, [])
            meta[list_key].append(line.split("-", 1)[1].strip())
            continue
        list_key = None
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value == "":
            list_key = key
            meta[key] = []
        else:
            meta[key] = value.strip('"').strip("'")
    body = text[match.end() :]
    return meta, body


def dump_frontmatter(meta: dict[str, Any]) -> str:
    order = [
        "title",
        "project",
        "type",
        "status",
        "tags",
        "制作日",
        "wp_id",
        "wp_type",
        "wp_status",
        "wp_slug",
        "wp_excerpt",
        "wp_categories",
        "wp_link",
    ]
    keys = [k for k in order if k in meta] + [k for k in meta if k not in order]
    lines = ["---"]
    for key in keys:
        value = meta[key]
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"  - {item}")
        else:
            text = str(value)
            if any(ch in text for ch in ":#{}[]&*?!") or text == "":
                escaped = text.replace("'", "''")
                lines.append(f"{key}: '{escaped}'")
            else:
                lines.append(f"{key}: {text}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def extract_wp_body(body: str, meta: dict[str, Any]) -> tuple[str, str, str]:
    """タイトル・抜粋・本文を原稿から取り出す。"""
    title = str(meta.get("title") or "").strip()
    excerpt = str(meta.get("wp_excerpt") or "").strip()

    lead = re.search(r"\|\s*一言リード\s*\|\s*(.*?)\s*\|", body)
    if not excerpt and lead:
        excerpt = lead.group(1).strip()

    title_block = re.search(
        r"\*\*投稿タイトル（そのまま）\*\*\s*```\s*(.*?)\s*```", body, re.S
    )
    if title_block:
        title = title_block.group(1).strip() or title

    start = re.search(r"^## WordPress投稿用\s*$", body, re.M)
    end = re.search(r"^## WordPressへの貼り付け手順\s*$", body, re.M)
    if start:
        chunk = body[start.end() : end.start() if end else None]
        chunk = re.sub(
            r"\*\*投稿タイトル（そのまま）\*\*.*?```.*?```", "", chunk, count=1, flags=re.S
        )
        chunk = re.sub(r"\*\*本文（下から貼り付け）\*\*\s*", "", chunk, count=1)
        chunk = chunk.strip().strip("-").strip()
        return title, excerpt, chunk

    cleaned = re.sub(r"^## 一覧用メタ.*?(?=^## |\Z)", "", body, flags=re.S | re.M)
    cleaned = re.sub(r"^# .+\n+", "", cleaned, count=1)
    return title, excerpt, cleaned.strip()


def md_inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<a href="\2">\1</a>',
        text,
    )
    return text


def md_to_gutenberg(md: str) -> str:
    blocks: list[str] = []
    lines = md.replace("\r\n", "\n").split("\n")
    i = 0
    para: list[str] = []

    def flush_para() -> None:
        nonlocal para
        text = "\n".join(para).strip()
        para = []
        if not text:
            return
        inner = "<br>".join(md_inline(p) for p in text.split("\n"))
        blocks.append(
            "<!-- wp:paragraph -->\n"
            f"<p>{inner}</p>\n"
            "<!-- /wp:paragraph -->"
        )

    while i < len(lines):
        line = lines[i]
        if line.strip() == "":
            flush_para()
            i += 1
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            flush_para()
            level = len(heading.group(1))
            text = md_inline(heading.group(2).strip())
            blocks.append(
                f'<!-- wp:heading {{"level":{level}}} -->\n'
                f"<h{level}>{text}</h{level}>\n"
                "<!-- /wp:heading -->"
            )
            i += 1
            continue
        if re.match(r"^---+$", line.strip()):
            flush_para()
            blocks.append("<!-- wp:separator -->\n<hr class=\"wp-block-separator\"/>\n<!-- /wp:separator -->")
            i += 1
            continue
        if re.match(r"^[-*]\s+", line):
            flush_para()
            items: list[str] = []
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i]):
                items.append(
                    "<li>" + md_inline(re.sub(r"^[-*]\s+", "", lines[i])) + "</li>"
                )
                i += 1
            lis = "\n".join(items)
            blocks.append(
                "<!-- wp:list -->\n"
                f"<ul>{lis}</ul>\n"
                "<!-- /wp:list -->"
            )
            continue
        para.append(line)
        i += 1
    flush_para()
    return "\n\n".join(blocks) + ("\n" if blocks else "")


def html_to_md(raw: str) -> str:
    text = WP_COMMENT_RE.sub("", raw)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p>\s*<p[^>]*>", "\n\n", text, flags=re.I)
    text = re.sub(r"<h1[^>]*>(.*?)</h1>", r"# \1\n\n", text, flags=re.I | re.S)
    text = re.sub(r"<h2[^>]*>(.*?)</h2>", r"## \1\n\n", text, flags=re.I | re.S)
    text = re.sub(r"<h3[^>]*>(.*?)</h3>", r"### \1\n\n", text, flags=re.I | re.S)
    text = re.sub(r"<h4[^>]*>(.*?)</h4>", r"#### \1\n\n", text, flags=re.I | re.S)
    text = re.sub(r"<blockquote[^>]*>(.*?)</blockquote>", r"> \1\n\n", text, flags=re.I | re.S)
    text = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1\n", text, flags=re.I | re.S)
    text = re.sub(r"</?(ul|ol|p|div|span|figure|figcaption)[^>]*>", "", text, flags=re.I)
    text = re.sub(r"<a[^>]*href=['\"]([^'\"]+)['\"][^>]*>(.*?)</a>", r"[\2](\1)", text, flags=re.I | re.S)
    text = re.sub(r"</?(strong|b)>", "**", text, flags=re.I)
    text = re.sub(r"</?(em|i)>", "*", text, flags=re.I)
    text = re.sub(r"<hr[^>]*>", "\n\n---\n\n", text, flags=re.I)
    text = re.sub(r"<img[^>]*alt=['\"]([^'\"]*)['\"][^>]*src=['\"]([^'\"]+)['\"][^>]*/?>", r"![\1](\2)", text, flags=re.I)
    text = re.sub(r"<img[^>]*src=['\"]([^'\"]+)['\"][^>]*/?>", r"![](\1)", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def write_frontmatter_back(path: Path, updates: dict[str, Any]) -> None:
    original = path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(original)
    meta.update(updates)
    path.write_text(dump_frontmatter(meta) + body.lstrip("\n"), encoding="utf-8")


# ---------------------------------------------------------------------------
# categories
# ---------------------------------------------------------------------------

def category_map(cfg: dict[str, str]) -> dict[str, int]:
    items = wp_call(cfg, "getTerms", "category") or []
    mapping: dict[str, int] = {}
    for item in items:
        term_id = int(item.get("term_id"))
        mapping[str(term_id)] = term_id
        mapping[item.get("slug") or ""] = term_id
        mapping[item.get("name") or ""] = term_id
    return mapping


def category_slugs(item: dict[str, Any]) -> list[str]:
    slugs: list[str] = []
    for term in item.get("terms") or []:
        if term.get("taxonomy") == "category":
            slugs.append(term.get("slug") or term.get("name") or str(term.get("term_id")))
    return slugs


def resolve_categories(cfg: dict[str, str], values: list[str]) -> list[int]:
    mapping = category_map(cfg)
    ids: list[int] = []
    unknown: list[str] = []
    for value in values:
        value = str(value).strip()
        if not value:
            continue
        if value in mapping:
            ids.append(int(mapping[value]))
        else:
            unknown.append(value)
    if unknown:
        names = ", ".join(sorted({k for k in mapping if k and not str(k).isdigit()}))
        raise SystemExit(f"カテゴリが見つかりません: {', '.join(unknown)}\n候補: {names}")
    return ids


# ---------------------------------------------------------------------------
# commands
# ---------------------------------------------------------------------------

def cmd_setup(_args: argparse.Namespace) -> None:
    current = load_env()
    print("WordPress 接続設定を保存します（パスワードはチャットに貼らないでください）。")
    url = input(f"サイトURL [{current.get('WP_URL', 'https://katsuyafujinaga.com')}]: ").strip()
    user = input(f"ユーザー名 [{current.get('WP_USER', '')}]: ").strip()
    password = input("アプリケーションパスワード: ").strip().replace(" ", "")
    url = url or current.get("WP_URL") or "https://katsuyafujinaga.com"
    user = user or current.get("WP_USER", "")
    password = password or current.get("WP_APP_PASSWORD", "")
    if not user or not password:
        sys.exit("ユーザー名とアプリケーションパスワードは必須です。")
    cfg = {
        "WP_URL": url.rstrip("/"),
        "WP_USER": user,
        "WP_APP_PASSWORD": password,
        "WP_REST_STYLE": "query",
    }
    save_env(cfg)
    print(f"保存しました: {CRED_PATH}")
    cmd_test(argparse.Namespace())


def cmd_test(_args: argparse.Namespace) -> None:
    cfg = require_config()
    blogs = wp_blogs(cfg)
    blog = blogs[0]
    print(f"接続OK: {blog.get('blogName')}  ({cfg['WP_URL']})")
    print(f"ログイン: {cfg['WP_USER']}  (管理者={blog.get('isAdmin')})")
    posts = fetch_posts(cfg, "post")
    pages = fetch_posts(cfg, "page")
    print(f"投稿 {len(posts)}件 / 固定ページ {len(pages)}件 を読み取れました。")


def cmd_list(args: argparse.Namespace) -> None:
    cfg = require_config()
    types = ["post", "page"] if args.type == "all" else ["post" if args.type == "posts" else "page"]
    for wp_type in types:
        items = fetch_posts(cfg, wp_type, args.status)
        print(f"\n== {wp_type} ({len(items)}件) ==")
        for item in items:
            title = item.get("post_title") or "(無題)"
            print(
                f"{str(item.get('post_id')):>6}  {str(item.get('post_status')):<10}  "
                f"{item.get('post_name')}  {title}"
            )


def item_to_markdown(item: dict[str, Any]) -> str:
    title = str(item.get("post_title") or "").strip()
    excerpt = html_to_md(str(item.get("post_excerpt") or "")).strip()
    body = html_to_md(str(item.get("post_content") or ""))
    wp_type = item.get("post_type") or "post"
    status = item.get("post_status") or "draft"
    cats = category_slugs(item)
    meta = {
        "title": title,
        "project": "ひとびじ",
        "type": "writing" if wp_type == "post" else "page",
        "status": "final" if status == "publish" else "draft",
        "tags": ["project", "wordpress"],
        "制作日": xml_date(item.get("post_date")),
        "wp_id": item.get("post_id"),
        "wp_type": wp_type,
        "wp_status": status,
        "wp_slug": item.get("post_name") or "",
        "wp_excerpt": excerpt,
        "wp_categories": cats,
        "wp_link": item.get("link") or "",
    }
    if not excerpt:
        meta.pop("wp_excerpt")
    if not cats:
        meta.pop("wp_categories")
    return dump_frontmatter(meta) + f"# {title}\n\n{body}".rstrip() + "\n"


def safe_filename(wp_id: Any, slug: str, title: str) -> str:
    base = slug or title or str(wp_id)
    base = re.sub(r"[\\/:*?\"<>|]+", "_", base).strip(" ._")
    if len(base) > 60:
        base = base[:60].rstrip(" ._")
    return f"{wp_id}_{base}.md"


def cmd_pull(args: argparse.Namespace) -> None:
    cfg = require_config()
    types = ["post", "page"] if args.type == "all" else ["post" if args.type == "posts" else "page"]
    written = 0
    for wp_type in types:
        out_dir = PULL_DIR / ("posts" if wp_type == "post" else "pages")
        out_dir.mkdir(parents=True, exist_ok=True)
        if args.id:
            items = [wp_call(cfg, "getPost", args.id)]
        else:
            items = fetch_posts(cfg, wp_type, args.status)
        for item in items:
            if not item:
                continue
            path = out_dir / safe_filename(
                item.get("post_id"),
                item.get("post_name") or "",
                item.get("post_title") or "",
            )
            path.write_text(item_to_markdown(item), encoding="utf-8")
            print(f"取得: {path.relative_to(HERE)}")
            written += 1
        if args.id:
            break
    print(f"\n{written}件を {PULL_DIR.relative_to(HERE)} に保存しました。")


def cmd_push(args: argparse.Namespace) -> None:
    cfg = require_config()
    path = Path(args.file).expanduser()
    if not path.is_absolute():
        path = (Path.cwd() / path).resolve()
    if not path.exists():
        sys.exit(f"ファイルがありません: {path}")
    text = path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)
    title, excerpt, md_body = extract_wp_body(body, meta)
    if not title:
        sys.exit("タイトルがありません。frontmatter の title を入れてください。")

    wp_type = args.wp_type or meta.get("wp_type") or "post"
    if wp_type in ("pages", "page"):
        wp_type = "page"
    else:
        wp_type = "post"
    status = args.status or meta.get("wp_status") or "draft"
    slug = args.slug or meta.get("wp_slug") or ""
    cat_values = args.category or meta.get("wp_categories") or []
    if isinstance(cat_values, str):
        cat_values = [x.strip() for x in cat_values.split(",") if x.strip()]

    payload: dict[str, Any] = {
        "post_type": wp_type,
        "post_status": status,
        "post_title": title,
        "post_content": md_to_gutenberg(md_body),
    }
    if excerpt:
        payload["post_excerpt"] = excerpt
    if slug:
        payload["post_name"] = slug
    if wp_type == "post" and cat_values:
        payload["terms"] = {"category": resolve_categories(cfg, list(cat_values))}

    wp_id = args.id or meta.get("wp_id")
    if wp_id:
        wp_call(cfg, "editPost", int(wp_id), payload)
        item = wp_call(cfg, "getPost", int(wp_id))
        action = "更新"
    else:
        new_id = wp_call(cfg, "newPost", payload)
        item = wp_call(cfg, "getPost", int(new_id))
        action = "新規投稿"

    write_frontmatter_back(
        path,
        {
            "wp_id": item.get("post_id"),
            "wp_type": item.get("post_type") or wp_type,
            "wp_status": item.get("post_status"),
            "wp_slug": item.get("post_name") or "",
            "wp_excerpt": excerpt,
            "wp_link": item.get("link") or "",
        },
    )
    print(f"{action}しました: id={item.get('post_id')}  status={item.get('post_status')}")
    print(item.get("link") or "")
    print(f"原稿に wp_id を書き戻しました: {path.name}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="WordPress と Markdown を同期する")
    sub = parser.add_subparsers(dest="command", required=True)

    p_setup = sub.add_parser("setup", help=".env を作って接続確認する")
    p_setup.set_defaults(func=cmd_setup)

    p_test = sub.add_parser("test", help="接続テスト")
    p_test.set_defaults(func=cmd_test)

    p_list = sub.add_parser("list", help="投稿・固定ページ一覧")
    p_list.add_argument("--type", choices=["posts", "pages", "all"], default="all")
    p_list.add_argument("--status", default="any", help="publish / draft / any")
    p_list.set_defaults(func=cmd_list)

    p_pull = sub.add_parser("pull", help="WordPress から Markdown を取得")
    p_pull.add_argument("--type", choices=["posts", "pages", "all"], default="all")
    p_pull.add_argument("--status", default="any")
    p_pull.add_argument("--id", type=int)
    p_pull.set_defaults(func=cmd_pull)

    p_push = sub.add_parser("push", help="Markdown を WordPress へ投稿／更新")
    p_push.add_argument("file")
    p_push.add_argument("--type", dest="wp_type", choices=["post", "page"])
    p_push.add_argument("--status", choices=["draft", "publish", "private"])
    p_push.add_argument("--id", type=int, help="更新する投稿ID（未指定なら frontmatter の wp_id）")
    p_push.add_argument("--slug")
    p_push.add_argument("--category", action="append", help="カテゴリslug。複数回指定可")
    p_push.set_defaults(func=cmd_push)
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
