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
		if ( is_page( 'contact-us' ) ) {
			wp_enqueue_script(
				'kotonoha-myasp-validation',
				'https://kotonoha-edit.com/js/validation.js',
				array(),
				null,
				true
			);
		}
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
 * サイトの呼び方。ロゴ・サブ・説明はこの3つだけ。
 *
 * @return array{mark: string, sub: string, desc: string}
 */
function kotonoha_brand() {
	return array(
		'mark' => 'KOTONOHA',
		'sub'  => 'ことのは',
		'desc' => '個人起業家の言葉を仕組みに変える編集部',
	);
}

/**
 * Googleタグ。計測先はアカウント「ことのはマーケティング」のプロパティ KOTONOHA-marketing。
 * katsuyafujinaga.com と同じタグなので、レポートではホスト名で分ける。
 */
add_action(
	'wp_head',
	function () {
		if ( is_admin() ) {
			return;
		}
		$tag_id = 'GT-MJWCBV59';
		?>
<script async src="<?php echo esc_url( 'https://www.googletagmanager.com/gtag/js?id=' . rawurlencode( $tag_id ) ); ?>"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '<?php echo esc_js( $tag_id ); ?>');
</script>
		<?php
	},
	1
);

add_filter(
	'document_title_separator',
	function () {
		return '｜';
	}
);

add_filter(
	'document_title_parts',
	function ( $parts ) {
		$brand = kotonoha_brand();
		if ( is_front_page() ) {
			$parts['title'] = '個人起業家の言葉を仕組みに変える';
			$parts['site']  = $brand['mark'];
			unset( $parts['tagline'] );
			return $parts;
		}
		$parts['site'] = $brand['mark'];
		unset( $parts['tagline'] );
		return $parts;
	}
);

add_action( 'wp_head', 'kotonoha_seo_head', 2 );

/**
 * 検索と共有で使うタイトル補助、説明、OGP、構造化データ。
 */
function kotonoha_seo_head() {
	if ( is_admin() ) {
		return;
	}
	$brand = kotonoha_brand();
	$image = get_stylesheet_directory_uri() . '/assets/images/apple-touch-icon.png';
	if ( is_front_page() ) {
		$title = wp_get_document_title();
		$desc  = $brand['desc'];
		$url   = home_url( '/' );
		$type  = 'website';
	} elseif ( is_singular() ) {
		$post_id = get_queried_object_id();
		$title   = wp_get_document_title();
		$desc    = has_excerpt( $post_id ) ? get_the_excerpt( $post_id ) : wp_trim_words( wp_strip_all_tags( get_post_field( 'post_content', $post_id ) ), 48, '…' );
		$url     = get_permalink( $post_id );
		$type    = 'article';
		if ( has_post_thumbnail( $post_id ) ) {
			$thumb = get_the_post_thumbnail_url( $post_id, 'large' );
			if ( $thumb ) {
				$image = $thumb;
			}
		}
	} else {
		$title = wp_get_document_title();
		$desc  = $brand['desc'];
		$url   = home_url( '/' );
		$type  = 'website';
	}
	$desc = wp_strip_all_tags( (string) $desc );
	echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
	echo '<meta property="og:locale" content="ja_JP">' . "\n";
	echo '<meta property="og:site_name" content="' . esc_attr( $brand['mark'] ) . '">' . "\n";
	echo '<meta property="og:type" content="' . esc_attr( $type ) . '">' . "\n";
	echo '<meta property="og:title" content="' . esc_attr( $title ) . '">' . "\n";
	echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">' . "\n";
	echo '<meta property="og:url" content="' . esc_url( $url ) . '">' . "\n";
	echo '<meta property="og:image" content="' . esc_url( $image ) . '">' . "\n";
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";

	if ( is_singular( 'post' ) ) {
		$post_id = get_queried_object_id();
		$data    = array(
			'@context'         => 'https://schema.org',
			'@type'            => 'Article',
			'headline'         => get_the_title( $post_id ),
			'description'      => $desc,
			'datePublished'    => get_the_date( 'c', $post_id ),
			'dateModified'     => get_the_modified_date( 'c', $post_id ),
			'mainEntityOfPage' => get_permalink( $post_id ),
			'author'           => array(
				'@type' => 'Person',
				'name'  => '藤永勝也',
			),
			'publisher'        => array(
				'@type' => 'Organization',
				'name'  => $brand['mark'],
				'logo'  => array(
					'@type' => 'ImageObject',
					'url'   => get_stylesheet_directory_uri() . '/assets/images/apple-touch-icon.png',
				),
			),
		);
	} else {
		$data = array(
			'@context'    => 'https://schema.org',
			'@type'       => 'WebSite',
			'name'        => $brand['mark'],
			'alternateName' => $brand['sub'],
			'description' => $brand['desc'],
			'url'         => home_url( '/' ),
			'inLanguage'  => 'ja',
		);
	}
	echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}

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
 * 公開記事をカードにする。見本記事は、公開が1本もないときだけ使う。
 *
 * @param WP_Post $wp_post Post.
 * @return array<string, mixed>
 */
function kotonoha_card_from_post( $wp_post ) {
	$cats  = get_the_category( $wp_post->ID );
	$slug  = $cats ? $cats[0]->slug : 'story';
	$class = in_array( $slug, array( 'method', 'story', 'sales', 'works' ), true ) ? $slug : 'story';
	$files = array(
		'method' => 'dummy-02.jpg',
		'story'  => 'dummy-03.jpg',
		'sales'  => 'dummy-09.jpg',
		'works'  => 'dummy-12.jpg',
	);
	$image = get_stylesheet_directory_uri() . '/assets/images/' . $files[ $class ];
	if ( has_post_thumbnail( $wp_post ) ) {
		$thumb = get_the_post_thumbnail_url( $wp_post, 'large' );
		if ( $thumb ) {
			$image = $thumb;
		}
	}
	$raw = $wp_post->post_excerpt ? $wp_post->post_excerpt : $wp_post->post_content;
	return array(
		'title'   => get_the_title( $wp_post ),
		'excerpt' => wp_trim_words( wp_strip_all_tags( $raw ), 36, '…' ),
		'url'     => get_permalink( $wp_post ),
		'date'    => get_the_date( 'Y.m.d', $wp_post ),
		'kicker'  => $cats ? strtoupper( $cats[0]->name ) : 'JOURNAL',
		'class'   => $class,
		'image'   => $image,
	);
}

/**
 * @return array<int, array<string, mixed>>
 */
function kotonoha_posts() {
	$published = new WP_Query(
		array(
			'posts_per_page'      => 12,
			'post_status'         => 'publish',
			'ignore_sticky_posts' => true,
		)
	);
	$cards = array();
	foreach ( $published->posts as $wp_post ) {
		$cards[] = kotonoha_card_from_post( $wp_post );
	}
	wp_reset_postdata();
	if ( $cards ) {
		return $cards;
	}
	return kotonoha_dummy_posts();
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
