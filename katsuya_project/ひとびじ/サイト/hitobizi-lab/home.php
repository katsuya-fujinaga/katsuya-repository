<?php
/**
 * Blog posts index (記事一覧)
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<section class="page-hero">
	<div class="container">
		<h1><?php echo esc_html( get_the_title( get_option( 'page_for_posts' ) ) ?: '記事' ); ?></h1>
		<p>再起、プロデュース、マーケティング、仕事術。現場で使っている考え方を、読み物として残しています。</p>
	</div>
</section>

<section class="section" style="padding-top:2.5rem;">
	<div class="container">
		<div class="category-grid reveal" style="margin-bottom:2.5rem;">
			<?php foreach ( hitobizi_category_cards() as $card ) : ?>
				<a class="category-link" href="<?php echo esc_url( $card['url'] ); ?>">
					<strong><?php echo esc_html( $card['name'] ); ?></strong>
					<span><?php echo esc_html( $card['description'] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>

		<div class="post-list">
			<?php if ( have_posts() ) : ?>
				<?php
				while ( have_posts() ) :
					the_post();
					$cats = get_the_category();
					$cat_name = $cats ? $cats[0]->name : '';
					?>
					<a class="post-row reveal" href="<?php the_permalink(); ?>">
						<span class="post-row__date"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></span>
						<span>
							<h2 class="post-row__title"><?php the_title(); ?></h2>
							<?php if ( $cat_name ) : ?>
								<span class="post-row__meta"><?php echo esc_html( $cat_name ); ?></span>
							<?php endif; ?>
						</span>
					</a>
				<?php endwhile; ?>
			<?php else : ?>
				<p>記事がまだありません。</p>
			<?php endif; ?>
		</div>

		<?php
		the_posts_pagination(
			array(
				'mid_size'  => 1,
				'prev_text' => '前へ',
				'next_text' => '次へ',
				'class'     => 'pagination',
			)
		);
		?>
	</div>
</section>

<?php
get_footer();
