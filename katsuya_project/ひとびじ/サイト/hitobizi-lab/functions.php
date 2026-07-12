<?php
/**
 * ひとびじLAB theme functions
 *
 * @package Hitobizi_Lab
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'HITOBIZI_THEME_VERSION', '1.2.2' );

/** Canonical site naming */
define( 'HITOBIZI_SITE_TITLE', '50代からのひとりビジネスのはじめ方' );
define( 'HITOBIZI_SITE_TAGLINE', '藤永勝也｜ひとびじLAB' );

/**
 * Theme setup.
 */
function hitobizi_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support( 'automatic-feed-links' );

	register_nav_menus(
		array(
			'primary' => 'メインメニュー',
			'footer'  => 'フッターメニュー',
		)
	);
}
add_action( 'after_setup_theme', 'hitobizi_setup' );

/**
 * Suggest canonical site title / tagline once after theme switch.
 * Does not overwrite if the user already customized them.
 */
function hitobizi_suggest_site_identity() {
	$name = get_option( 'blogname' );
	$desc = get_option( 'blogdescription' );

	$defaultish_names = array( '', 'katsuyafujinaga.official', 'My Site', 'WordPress', 'サイト名を入力' );
	$defaultish_descs = array( '', 'Just another WordPress site', 'キャッチフレーズを入力' );

	if ( in_array( $name, $defaultish_names, true ) || false !== stripos( (string) $name, 'wordpress' ) ) {
		update_option( 'blogname', HITOBIZI_SITE_TITLE );
	}

	if ( in_array( $desc, $defaultish_descs, true ) || false !== stripos( (string) $desc, 'wordpress' ) ) {
		update_option( 'blogdescription', HITOBIZI_SITE_TAGLINE );
	}
}
add_action( 'after_switch_theme', 'hitobizi_suggest_site_identity' );

/**
 * Enqueue styles and scripts.
 */
function hitobizi_assets() {
	wp_enqueue_style(
		'hitobizi-fonts',
		'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'hitobizi-style',
		get_stylesheet_uri(),
		array( 'hitobizi-fonts' ),
		HITOBIZI_THEME_VERSION
	);

	wp_enqueue_script(
		'hitobizi-main',
		get_template_directory_uri() . '/assets/main.js',
		array(),
		HITOBIZI_THEME_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'hitobizi_assets' );

/**
 * Default article categories for this site.
 *
 * @return array<string, string> slug => label
 */
function hitobizi_default_categories() {
	return array(
		'saiki-hatarakikata'  => '再起と働き方',
		'produce'             => 'プロデュース論',
		'marketing'           => 'マーケティング',
		'content-sales'       => 'コンテンツ販売',
		'workstyle-thinking'  => '仕事術・思考法',
		'news'                => 'お知らせ',
	);
}

/**
 * Create default categories once after theme switch.
 */
function hitobizi_create_default_categories() {
	foreach ( hitobizi_default_categories() as $slug => $name ) {
		if ( ! term_exists( $slug, 'category' ) ) {
			wp_insert_term(
				$name,
				'category',
				array( 'slug' => $slug )
			);
		}
	}
}
add_action( 'after_switch_theme', 'hitobizi_create_default_categories' );

/**
 * Fallback primary menu when no menu is assigned.
 */
function hitobizi_fallback_menu() {
	$articles = get_option( 'page_for_posts' );
	$articles_url = $articles ? get_permalink( $articles ) : home_url( '/articles/' );

	$profile = get_page_by_path( 'profile' );
	$results = get_page_by_path( 'results' );

	echo '<ul>';
	echo '<li class="menu-item"><a href="' . esc_url( home_url( '/' ) ) . '">ホーム</a></li>';

	if ( $profile ) {
		echo '<li class="menu-item"><a href="' . esc_url( get_permalink( $profile ) ) . '">プロフィール</a></li>';
	}

	if ( $results ) {
		echo '<li class="menu-item"><a href="' . esc_url( get_permalink( $results ) ) . '">実績</a></li>';
	}

	echo '<li class="menu-item menu-item-has-children">';
	echo '<a href="' . esc_url( $articles_url ) . '">記事</a>';
	echo '<ul class="sub-menu">';

	foreach ( hitobizi_default_categories() as $slug => $name ) {
		$term = get_term_by( 'slug', $slug, 'category' );
		if ( $term && ! is_wp_error( $term ) ) {
			echo '<li class="menu-item"><a href="' . esc_url( get_term_link( $term ) ) . '">' . esc_html( $name ) . '</a></li>';
		} else {
			echo '<li class="menu-item"><span>' . esc_html( $name ) . '</span></li>';
		}
	}

	echo '</ul></li>';
	echo '</ul>';
}

/**
 * Get category archive cards for home / articles.
 *
 * @return array<int, array{name:string,url:string,count:int,description:string}>
 */
function hitobizi_category_cards() {
	$cards = array();
	$descriptions = array(
		'saiki-hatarakikata' => '50代からの再起動、働き方の話',
		'produce'            => '裏方から見たプロデュースの考え方',
		'marketing'          => '届ける仕組みと設計の話',
		'content-sales'      => '講座・コンテンツの売り方',
		'workstyle-thinking' => '仕事の進め方と思考の整え方',
		'news'               => 'お知らせ・更新情報',
	);

	foreach ( hitobizi_default_categories() as $slug => $name ) {
		$term = get_term_by( 'slug', $slug, 'category' );
		if ( ! $term || is_wp_error( $term ) ) {
			continue;
		}

		$cards[] = array(
			'name'        => $term->name,
			'url'         => get_term_link( $term ),
			'count'       => (int) $term->count,
			'description' => isset( $descriptions[ $slug ] ) ? $descriptions[ $slug ] : '',
		);
	}

	return $cards;
}

/**
 * Excerpt length.
 *
 * @param int $length Default length.
 * @return int
 */
function hitobizi_excerpt_length( $length ) {
	return 80;
}
add_filter( 'excerpt_length', 'hitobizi_excerpt_length' );

/**
 * Excerpt more string.
 *
 * @return string
 */
function hitobizi_excerpt_more() {
	return '…';
}
add_filter( 'excerpt_more', 'hitobizi_excerpt_more' );
