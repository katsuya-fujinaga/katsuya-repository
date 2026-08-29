<?php
/**
 * HITORI-BIZ theme functions
 *
 * @package Hitori_Biz
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'HITORI_BIZ_VERSION', '1.3.0' );
define( 'HITORI_BIZ_DEFAULT_DESCRIPTION', '個人起業家の経験と想いを、選ばれ売れ続ける仕組みに。コンセプト・導線・LP・広告・セールスまで、HITORI-BIZプロデューサー藤永勝也が伴走します。' );

/**
 * Document title per page type.
 *
 * @param string $title Title.
 * @return string
 */
function hitori_biz_document_title( $title ) {
	if ( is_front_page() ) {
		return 'HITORI-BIZ｜藤永勝也｜個人起業家のコンテンツプロデュース';
	}

	if ( is_singular() ) {
		$post_title = get_the_title();
		if ( $post_title ) {
			return $post_title . '｜HITORI-BIZ｜藤永勝也';
		}
	}

	if ( is_home() ) {
		return 'COLUMN｜HITORI-BIZ｜藤永勝也';
	}

	return $title ? $title . '｜HITORI-BIZ' : 'HITORI-BIZ｜藤永勝也';
}
add_filter( 'pre_get_document_title', 'hitori_biz_document_title' );

/**
 * Meta description / OGP / Twitter / canonical.
 */
function hitori_biz_seo_head() {
	$site_name = 'HITORI-BIZ｜藤永勝也';
	$default_image = get_template_directory_uri() . '/assets/images/hero.png';
	$description = HITORI_BIZ_DEFAULT_DESCRIPTION;
	$url = home_url( '/' );
	$title = 'HITORI-BIZ｜藤永勝也｜個人起業家のコンテンツプロデュース';
	$image = $default_image;
	$type = 'website';

	if ( is_singular() ) {
		$post_id = get_queried_object_id();
		$url = get_permalink( $post_id );
		$title = get_the_title( $post_id ) . '｜HITORI-BIZ｜藤永勝也';
		$type = 'article';

		$excerpt = get_the_excerpt( $post_id );
		if ( $excerpt ) {
			$description = wp_strip_all_tags( $excerpt );
		} else {
			$content = get_post_field( 'post_content', $post_id );
			$description = wp_trim_words( wp_strip_all_tags( $content ), 60, '…' );
			if ( ! $description ) {
				$description = HITORI_BIZ_DEFAULT_DESCRIPTION;
			}
		}

		if ( has_post_thumbnail( $post_id ) ) {
			$thumb = get_the_post_thumbnail_url( $post_id, 'large' );
			if ( $thumb ) {
				$image = $thumb;
			}
		}
	} elseif ( is_home() ) {
		$url = get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/' );
		$title = 'COLUMN｜HITORI-BIZ｜藤永勝也';
		$description = '届け方・仕組み・伴走についての読みもの。HITORI-BIZ｜藤永勝也。';
	}

	$description = mb_substr( $description, 0, 120 );

	echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";
	echo '<link rel="canonical" href="' . esc_url( $url ) . '">' . "\n";

	echo '<meta property="og:locale" content="ja_JP">' . "\n";
	echo '<meta property="og:type" content="' . esc_attr( $type ) . '">' . "\n";
	echo '<meta property="og:site_name" content="' . esc_attr( $site_name ) . '">' . "\n";
	echo '<meta property="og:title" content="' . esc_attr( $title ) . '">' . "\n";
	echo '<meta property="og:description" content="' . esc_attr( $description ) . '">' . "\n";
	echo '<meta property="og:url" content="' . esc_url( $url ) . '">' . "\n";
	echo '<meta property="og:image" content="' . esc_url( $image ) . '">' . "\n";

	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
	echo '<meta name="twitter:title" content="' . esc_attr( $title ) . '">' . "\n";
	echo '<meta name="twitter:description" content="' . esc_attr( $description ) . '">' . "\n";
	echo '<meta name="twitter:image" content="' . esc_url( $image ) . '">' . "\n";
}
add_action( 'wp_head', 'hitori_biz_seo_head', 1 );

/**
 * Favicon / site icons.
 */
function hitori_biz_favicon() {
	$base = get_template_directory_uri() . '/assets/images';
	echo '<link rel="icon" href="' . esc_url( $base . '/favicon-32.png' ) . '" sizes="32x32" type="image/png">' . "\n";
	echo '<link rel="icon" href="' . esc_url( $base . '/favicon.png' ) . '" type="image/png">' . "\n";
	echo '<link rel="apple-touch-icon" href="' . esc_url( $base . '/apple-touch-icon.png' ) . '" sizes="180x180">' . "\n";
}
add_action( 'wp_head', 'hitori_biz_favicon', 2 );

function hitori_biz_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);

	register_nav_menus(
		array(
			'primary' => 'メインメニュー',
		)
	);
}
add_action( 'after_setup_theme', 'hitori_biz_setup' );

/**
 * Theme image URL.
 *
 * @param string $filename Filename in assets/images.
 * @return string
 */
function hitori_biz_image( $filename ) {
	return get_template_directory_uri() . '/assets/images/' . ltrim( $filename, '/' );
}

/**
 * Card image: featured image or fallback.
 *
 * @param int    $post_id  Post ID.
 * @param string $fallback Fallback filename.
 * @return string
 */
function hitori_biz_card_image( $post_id, $fallback ) {
	if ( $post_id && has_post_thumbnail( $post_id ) ) {
		$url = get_the_post_thumbnail_url( $post_id, 'large' );
		if ( $url ) {
			return $url;
		}
	}
	return hitori_biz_image( $fallback );
}

/**
 * Dummy magazine posts (local preview / fallback until WP posts exist).
 *
 * @return array<int, array<string, mixed>>
 */
function hitori_biz_dummy_posts() {
	$path = get_template_directory() . '/dummy-posts.json';
	if ( ! file_exists( $path ) ) {
		return array();
	}
	$data = json_decode( (string) file_get_contents( $path ), true );
	if ( ! is_array( $data ) ) {
		return array();
	}

	$posts = array();
	foreach ( $data as $item ) {
		$posts[] = array(
			'id'      => isset( $item['id'] ) ? (string) $item['id'] : '',
			'date'    => isset( $item['date'] ) ? (string) $item['date'] : '',
			'kicker'  => isset( $item['kicker'] ) ? (string) $item['kicker'] : '',
			'class'   => isset( $item['class'] ) ? (string) $item['class'] : 'concept',
			'title'   => isset( $item['title'] ) ? (string) $item['title'] : '',
			'excerpt' => isset( $item['excerpt'] ) ? (string) $item['excerpt'] : '',
			'image'   => hitori_biz_image( isset( $item['image'] ) ? $item['image'] : 'dummy-01.jpg' ),
			'url'     => get_theme_file_uri( 'preview-post-' . ( isset( $item['id'] ) ? $item['id'] : '01' ) . '.html' ),
			'body'    => isset( $item['body'] ) && is_array( $item['body'] ) ? $item['body'] : array(),
		);
	}
	return $posts;
}

/**
 * Dummy posts filtered by class (concept / funnel / sales / contents).
 *
 * @param string $class Class slug.
 * @return array<int, array<string, mixed>>
 */
function hitori_biz_dummy_posts_by_class( $class ) {
	$filtered = array();
	foreach ( hitori_biz_dummy_posts() as $post ) {
		if ( $post['class'] === $class ) {
			$filtered[] = $post;
		}
	}
	return $filtered;
}

/**
 * Create the 4 SERVICE detail pages if missing.
 */
function hitori_biz_ensure_service_pages() {
	if ( get_option( 'hitori_biz_service_pages_v1' ) ) {
		return;
	}

	$pages = array(
		array(
			'title'    => 'コンセプト設計',
			'slug'     => 'service-concept',
			'template' => 'page-service-concept.php',
		),
		array(
			'title'    => '導線・LP・広告',
			'slug'     => 'service-dousen',
			'template' => 'page-service-dousen.php',
		),
		array(
			'title'    => 'やさしいセールス設計',
			'slug'     => 'service-sales',
			'template' => 'page-service-sales.php',
		),
		array(
			'title'    => '伴走・改善',
			'slug'     => 'service-bansou',
			'template' => 'page-service-bansou.php',
		),
	);

	foreach ( $pages as $page ) {
		$existing = get_page_by_path( $page['slug'] );
		if ( $existing ) {
			update_post_meta( $existing->ID, '_wp_page_template', $page['template'] );
			continue;
		}

		$page_id = wp_insert_post(
			array(
				'post_title'   => $page['title'],
				'post_name'    => $page['slug'],
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_content' => '',
			)
		);

		if ( ! is_wp_error( $page_id ) && $page_id ) {
			update_post_meta( $page_id, '_wp_page_template', $page['template'] );
		}
	}

	update_option( 'hitori_biz_service_pages_v1', 1 );
}
add_action( 'init', 'hitori_biz_ensure_service_pages' );

function hitori_biz_assets() {
	wp_enqueue_style(
		'hitori-biz-fonts',
		'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@500;600;700&family=Oswald:wght@500;600&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'hitori-biz-style',
		get_stylesheet_uri(),
		array( 'hitori-biz-fonts' ),
		HITORI_BIZ_VERSION
	);

	if ( is_front_page() ) {
		wp_enqueue_style(
			'hitori-biz-myasp-format',
			'https://my183p.com/p/format_css?item_id=u3psK50n&format=div&form_align=&label_align=&radio_float=&checkbox_float=&label_width=0&input_width=0&theme_name=3_7&ver=3&fv=3e641327b75c',
			array( 'hitori-biz-style' ),
			null
		);
		wp_enqueue_style(
			'hitori-biz-myasp-mobile',
			'https://my183p.com/p/mobile_css?item_id=u3psK50n&format=div&form_align=&label_align=&radio_float=&checkbox_float=&label_width=0&input_width=0&theme_name=3_7&ver=3&fv=3e641327b75c',
			array( 'hitori-biz-myasp-format' ),
			null
		);
		wp_enqueue_style(
			'hitori-biz-myasp-ui',
			'https://my183p.com/css/form/myasp-ui-form.css?d=20260616141747',
			array( 'hitori-biz-myasp-mobile' ),
			null
		);
		wp_enqueue_script(
			'hitori-biz-myasp-validation',
			'https://my183p.com/js/validation.js?av=20260616141747',
			array(),
			null,
			true
		);
	}

	wp_enqueue_script(
		'hitori-biz-main',
		get_template_directory_uri() . '/assets/main.js',
		array(),
		HITORI_BIZ_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'hitori_biz_assets' );
