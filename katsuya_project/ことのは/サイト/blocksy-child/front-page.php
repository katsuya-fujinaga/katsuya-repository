<?php
/**
 * Front page — Vogue-like journal
 *
 * @package Kotonoha
 */

get_header();

$img      = get_stylesheet_directory_uri() . '/assets/images';
$posts    = kotonoha_posts();
$feature  = $posts[0] ?? null;
$side     = array_slice( $posts, 1, 3 );
$method   = kotonoha_by_class( $posts, 'method' );
$story    = kotonoha_by_class( $posts, 'story' );
$sales    = kotonoha_by_class( $posts, 'sales' );
$trending = array_slice( $posts, 4, 3 );
?>

<main id="top" class="mag-main">
	<section class="mag-top" id="top-stories">
		<div class="container">
			<div class="mag-section-head">
				<h2>TOP STORIES</h2>
			</div>
			<div class="mag-top-grid">
				<?php if ( $feature ) : ?>
				<article class="mag-feature">
					<?php
					get_template_part(
						'template-parts/mag-card',
						null,
						array_merge( $feature, array( 'heading' => 'h1', 'show_excerpt' => true ) )
					);
					?>
				</article>
				<?php endif; ?>
				<?php if ( $side ) : ?>
				<div class="mag-side">
					<?php foreach ( $side as $item ) : ?>
						<article>
							<?php get_template_part( 'template-parts/mag-card', null, array_merge( $item, array( 'heading' => 'h2' ) ) ); ?>
						</article>
					<?php endforeach; ?>
				</div>
				<?php endif; ?>
			</div>
		</div>
	</section>

	<?php if ( $trending ) : ?>
	<section class="mag-section mag-section--paper" id="trending">
		<div class="container">
			<div class="mag-section-head">
				<h2>TRENDING</h2>
				<a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/' ) ); ?>">SEE ALL</a>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( $trending as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<section class="mag-banner" id="feature">
		<div class="mag-banner__photo">
			<img src="<?php echo esc_url( $img . '/dummy-12.jpg' ); ?>" alt="" width="1600" height="900">
		</div>
		<div class="mag-banner__copy">
			<?php $brand = kotonoha_brand(); ?>
			<p class="mag-kicker"><?php echo esc_html( $brand['sub'] ); ?></p>
			<h2><?php echo esc_html( $brand['desc'] ); ?></h2>
			<p>好きや経験はある。足りないのは、届ける順番だけだった。</p>
			<a class="btn" href="<?php echo esc_url( home_url( '/contact-us/' ) ); ?>">CONTACT</a>
		</div>
	</section>

	<?php if ( $method ) : ?>
	<section class="mag-section" id="method">
		<div class="container">
			<div class="mag-section-head">
				<h2>METHOD</h2>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( array_slice( $method, 0, 3 ) as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php if ( $story ) : ?>
	<section class="mag-section mag-section--paper" id="story">
		<div class="container">
			<div class="mag-section-head">
				<h2>STORY</h2>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( $story as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php if ( $sales ) : ?>
	<section class="mag-section" id="sales">
		<div class="container">
			<div class="mag-section-head">
				<h2>SALES</h2>
			</div>
			<div class="mag-story-grid">
				<?php foreach ( array_slice( $sales, 0, 3 ) as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<section class="mag-section mag-section--paper" id="works">
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
						<p class="mag-kicker">CASE 01</p>
						<h3>やさしく売れる占い師</h3>
						<p>本田有紀華先生　コンセプト／導線・LP／広告／セミナー／クロージング</p>
					</div>
				</a>
				<a class="mag-work" href="https://ikunou.net/lp02/" target="_blank" rel="noopener noreferrer">
					<div class="mag-work__photo">
						<img src="<?php echo esc_url( $img . '/works-nagase.png' ); ?>" alt="永瀬まみ先生" width="800" height="550" loading="lazy">
					</div>
					<div class="mag-work__body">
						<p class="mag-kicker">CASE 02</p>
						<h3>おうち育脳のはじめ方</h3>
						<p>永瀬まみ先生　コンセプト／導線・LP／広告／セミナー／クロージング</p>
					</div>
				</a>
			</div>
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
					<p class="mag-profile__role"><?php echo esc_html( kotonoha_brand()['sub'] ); ?>編集部</p>
					<p>飲食店を約14年経営。現場で「選ばれる理由」を学びました。</p>
					<p>この編集部で、個人起業家の経験と想いを、届く仕組みに変えています。</p>
				</div>
			</div>
		</div>
	</section>
</main>

<?php
get_footer();
