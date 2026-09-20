<?php
/**
 * kotonoha.co Blocksy 子テーマ（Journal）
 */

add_action(
	'wp_enqueue_scripts',
	function () {
		$theme = wp_get_theme();
		wp_dequeue_style( 'ct-main-styles' );
		wp_enqueue_style(
			'blocksy-child-style',
			get_stylesheet_uri(),
			array(),
			$theme->get( 'Version' )
		);
		wp_enqueue_script(
			'kotonoha-main',
			get_stylesheet_directory_uri() . '/assets/main.js',
			array(),
			$theme->get( 'Version' ),
			true
		);
	},
	20
);

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
	}
);

add_filter( 'blocksy:header:enabled', '__return_false' );
add_filter( 'blocksy:footer:enabled', '__return_false' );

/**
 * @return array<int, array<string, mixed>>
 */
function kotonoha_dummy_posts() {
	$path = get_stylesheet_directory() . '/dummy-posts.json';
	$raw  = is_readable( $path ) ? file_get_contents( $path ) : '[]';
	$data = json_decode( $raw, true );
	if ( ! is_array( $data ) ) {
		return array();
	}
	$base = get_stylesheet_directory_uri() . '/assets/images/';
	foreach ( $data as &$item ) {
		$item['image'] = $base . $item['image'];
		$item['url']   = home_url( '/journal/' . $item['id'] . '/' );
	}
	unset( $item );
	return $data;
}

/**
 * Dummy を土台に、公開済み投稿があれば上から上書きする。
 *
 * @return array<int, array<string, mixed>>
 */
function kotonoha_posts() {
	$posts     = kotonoha_dummy_posts();
	$published = new WP_Query(
		array(
			'posts_per_page'      => 12,
			'post_status'         => 'publish',
			'ignore_sticky_posts' => true,
		)
	);
	foreach ( $published->posts as $i => $wp_post ) {
		if ( ! isset( $posts[ $i ] ) ) {
			break;
		}
		$posts[ $i ]['title']   = get_the_title( $wp_post );
		$posts[ $i ]['excerpt'] = wp_trim_words( wp_strip_all_tags( $wp_post->post_excerpt ? $wp_post->post_excerpt : $wp_post->post_content ), 28, '…' );
		$posts[ $i ]['url']     = get_permalink( $wp_post );
		$posts[ $i ]['date']    = get_the_date( 'Y.m.d', $wp_post );
		$cats                   = get_the_category( $wp_post->ID );
		if ( $cats ) {
			$posts[ $i ]['kicker'] = strtoupper( $cats[0]->slug );
		}
		if ( has_post_thumbnail( $wp_post ) ) {
			$thumb = get_the_post_thumbnail_url( $wp_post, 'large' );
			if ( $thumb ) {
				$posts[ $i ]['image'] = $thumb;
			}
		}
	}
	wp_reset_postdata();
	return $posts;
}

/**
 * @param array<string, mixed> $posts Posts.
 * @param string               $class Class key.
 * @return array<int, array<string, mixed>>
 */
function kotonoha_by_class( $posts, $class ) {
	return array_values(
		array_filter(
			$posts,
			function ( $post ) use ( $class ) {
				return isset( $post['class'] ) && $post['class'] === $class;
			}
		)
	);
}
