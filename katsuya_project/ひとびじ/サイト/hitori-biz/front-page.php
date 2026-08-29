<?php
/**
 * Front page — magazine layout
 *
 * @package Hitori_Biz
 */

get_header();

$img   = get_template_directory_uri() . '/assets/images';
$posts = hitori_biz_dummy_posts();

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
	if ( has_post_thumbnail( $wp_post ) ) {
		$thumb = get_the_post_thumbnail_url( $wp_post, 'large' );
		if ( $thumb ) {
			$posts[ $i ]['image'] = $thumb;
		}
	}
}
wp_reset_postdata();

$by_class = function ( $class ) use ( $posts ) {
	return array_values(
		array_filter(
			$posts,
			function ( $post ) use ( $class ) {
				return $post['class'] === $class;
			}
		)
	);
};

$feature  = $posts[0];
$side_a   = $posts[4];
$side_b   = $posts[8];
$trending = array( $posts[1], $posts[7], $posts[11] );
$concept  = $by_class( 'concept' );
$funnel   = $by_class( 'funnel' );
$sales    = $by_class( 'sales' );
$contents = $by_class( 'contents' );
?>

<main id="top" class="mag-main">
	<section class="mag-top" id="stories">
		<div class="container">
			<div class="mag-top-grid">
				<article class="mag-feature">
					<?php
					get_template_part(
						'template-parts/mag-card',
						null,
						array_merge( $feature, array( 'heading' => 'h1', 'show_excerpt' => true ) )
					);
					?>
				</article>
				<div class="mag-side">
					<article>
						<?php get_template_part( 'template-parts/mag-card', null, array_merge( $side_a, array( 'heading' => 'h2', 'show_excerpt' => true ) ) ); ?>
					</article>
					<article>
						<?php get_template_part( 'template-parts/mag-card', null, array_merge( $side_b, array( 'heading' => 'h2', 'show_excerpt' => true ) ) ); ?>
					</article>
				</div>
			</div>
		</div>
	</section>

	<section class="mag-section mag-section--paper" id="trending">
		<div class="container">
			<div class="mag-section-head">
				<h2>TRENDING</h2>
				<a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: $posts[0]['url'] ); ?>">SEE ALL</a>
			</div>
			<div class="mag-trend-grid">
				<?php foreach ( $trending as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="mag-banner" id="feature">
		<div class="mag-banner__photo">
			<img src="<?php echo esc_url( $posts[11]['image'] ); ?>" alt="" width="1600" height="900">
		</div>
		<div class="mag-banner__copy">
			<p class="mag-kicker mag-kicker--concept">FEATURE</p>
			<h2>届け方を、資産にする。</h2>
			<p>コンセプト、導線、セールス。分断された施策をつなぎ、残る仕組みに変える。HITORI-BIZの読みものと伴走は、同じ芯から生まれています。</p>
			<a class="btn btn--primary" href="#contact">まずは相談する</a>
		</div>
	</section>

	<section class="mag-section" id="concept">
		<div class="container">
			<div class="mag-section-head">
				<h2>CONCEPT</h2>
				<a href="<?php echo esc_url( home_url( '/service-concept/' ) ); ?>">詳しく見る</a>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( $concept as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="mag-section mag-section--paper" id="funnel">
		<div class="container">
			<div class="mag-section-head">
				<h2>FUNNEL</h2>
				<a href="<?php echo esc_url( home_url( '/service-dousen/' ) ); ?>">詳しく見る</a>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( $funnel as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="mag-section" id="sales">
		<div class="container">
			<div class="mag-section-head">
				<h2>SALES</h2>
				<a href="<?php echo esc_url( home_url( '/service-sales/' ) ); ?>">詳しく見る</a>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( $sales as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="mag-section mag-section--blush" id="works">
		<div class="container">
			<div class="mag-section-head">
				<h2>WORKS</h2>
			</div>
			<div class="mag-works-grid">
				<a class="mag-work" href="https://sub.uranai-ambitious.com/p/yasashiku1" target="_blank" rel="noopener noreferrer">
					<div class="mag-work__photo">
						<img src="<?php echo esc_url( $img . '/works-honda.png' ); ?>" alt="本田有紀華先生" width="800" height="550" loading="lazy">
					</div>
					<div class="mag-work__body">
						<p class="mag-kicker mag-kicker--works">CASE 01｜進行中</p>
						<h3>やさしく売れる占い師</h3>
						<p>本田有紀華先生　コンセプト／導線・LP／広告／セミナー／クロージング／運営</p>
					</div>
				</a>
				<a class="mag-work" href="https://ikunou.net/lp02/" target="_blank" rel="noopener noreferrer">
					<div class="mag-work__photo">
						<img src="<?php echo esc_url( $img . '/works-nagase.png' ); ?>" alt="永瀬まみ先生" width="800" height="550" loading="lazy">
					</div>
					<div class="mag-work__body">
						<p class="mag-kicker mag-kicker--works">CASE 02｜進行中</p>
						<h3>おうち育脳のはじめ方</h3>
						<p>永瀬まみ先生　コンセプト／導線・LP／広告／セミナー／クロージング／運営</p>
					</div>
				</a>
			</div>
			<p class="section-note">年間プロデュース実績の目安：2023年 約6,000万円／2024年 約8,000万円</p>
		</div>
	</section>

	<section class="mag-section" id="service">
		<div class="container">
			<div class="mag-section-head">
				<h2>SERVICE</h2>
			</div>
			<p class="section-intro">届くまでに必要な4つの領域を、分断せずにつなぎます。</p>
			<div class="mag-service-grid">
				<a class="mag-card" href="<?php echo esc_url( home_url( '/service-concept/' ) ); ?>">
					<div class="mag-card__photo"><img src="<?php echo esc_url( $concept[0]['image'] ); ?>" alt="" width="640" height="480" loading="lazy"></div>
					<h3 class="mag-card__title">コンセプト設計</h3>
					<p class="mag-card__excerpt">好きを一言で伝える言葉をつくり、比較されない立ち位置を設計します。</p>
				</a>
				<a class="mag-card" href="<?php echo esc_url( home_url( '/service-dousen/' ) ); ?>">
					<div class="mag-card__photo"><img src="<?php echo esc_url( $funnel[0]['image'] ); ?>" alt="" width="640" height="480" loading="lazy"></div>
					<h3 class="mag-card__title">導線・LP・広告</h3>
					<p class="mag-card__excerpt">出会ってから「お願いしたい」までの道筋を、文章と画面と広告でつなぎます。</p>
				</a>
				<a class="mag-card" href="<?php echo esc_url( home_url( '/service-sales/' ) ); ?>">
					<div class="mag-card__photo"><img src="<?php echo esc_url( $sales[0]['image'] ); ?>" alt="" width="640" height="480" loading="lazy"></div>
					<h3 class="mag-card__title">やさしいセールス設計</h3>
					<p class="mag-card__excerpt">煽らず、安心と期待を育てて選ばれる流れを仕組み化します。</p>
				</a>
			</div>
		</div>
	</section>

	<section class="mag-section mag-section--paper" id="contents">
		<div class="container">
			<div class="mag-section-head">
				<h2>CONTENTS</h2>
			</div>
			<?php if ( ! empty( $contents[0] ) ) : ?>
			<article class="contents-card">
				<span class="contents-card__badge">近日リリース</span>
				<img class="contents-card__image" src="<?php echo esc_url( $contents[0]['image'] ); ?>" alt="<?php echo esc_attr( $contents[0]['title'] ); ?>" width="1200" height="675" loading="lazy">
				<div class="contents-card__body">
					<h3><?php echo esc_html( $contents[0]['title'] ); ?></h3>
					<p><?php echo esc_html( $contents[0]['excerpt'] ); ?></p>
					<p class="contents-card__note">公開まで少々お待ちください。</p>
				</div>
			</article>
			<?php endif; ?>
		</div>
	</section>

	<section class="mag-section" id="profile">
		<div class="container">
			<div class="mag-section-head">
				<h2>PROFILE</h2>
			</div>
			<div class="mag-profile">
				<figure class="mag-profile__photo">
					<img src="<?php echo esc_url( $img . '/profile.png' ); ?>" alt="藤永勝也" width="560" height="700" loading="lazy">
				</figure>
				<div>
					<p class="mag-profile__name">藤永勝也</p>
					<p class="mag-profile__role">HITORI-BIZ プロデューサー</p>
					<p>飲食店を約14年経営。現場で「選ばれる理由」を肌で学び、コロナ禍などを経て廃業後、マーケティング・コンテンツプロデュースへ転身しました。</p>
					<p>いまは、個人起業家・講師の「経験と想い」を、届いて売れる仕組みに変える伴走をしています。</p>
					<h3>得意な市場</h3>
					<ul>
						<li>講座ビジネス（占い・スピリチュアル・カウンセリング・教育）</li>
						<li>女性向けを中心に、人生が動くコンテンツの設計</li>
						<li>LP・広告・セールスまでを分断しない一気通貫の設計</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="section faq" id="faq">
		<div class="container container--narrow">
			<h2 class="section-title">FAQ</h2>
			<details class="faq-item">
				<summary>まだ商品が固まっていなくても相談できますか？</summary>
				<p>はい。むしろ「何を売るか」が曖昧な段階から、言葉と立ち位置を整えるところを得意としています。</p>
			</details>
			<details class="faq-item">
				<summary>広告運用だけお願いすることはできますか？</summary>
				<p>可能ですが、成果を出すにはコンセプトや導線との接続が重要です。必要に応じて範囲をご提案します。</p>
			</details>
			<details class="faq-item">
				<summary>地方在住・副業中でも大丈夫ですか？</summary>
				<p>問題ありません。オンラインでの伴走を基本としています。</p>
			</details>
			<details class="faq-item">
				<summary>押し売りや煽りはしませんか？</summary>
				<p>しません。安心と期待を育てて選ばれる設計を大切にしています。</p>
			</details>
		</div>
	</section>

	<section class="section contact" id="contact">
		<div class="container container--narrow">
			<h2 class="section-title">CONTACT</h2>
			<p class="contact__lead">
				お問い合わせはこちらのフォームよりご連絡ください。<br>
				通常2日以内に返信させていただいておりますが、稼働状況によりお時間をいただくこともございます。
			</p>
			<?php get_template_part( 'template-parts/contact-form' ); ?>
		</div>
	</section>
</main>

<?php
get_footer();
