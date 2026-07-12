<?php
/**
 * Default index fallback
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<section class="page-hero">
	<div class="container">
		<h1>
			<?php
			if ( is_search() ) {
				printf( '「%s」の検索結果', esc_html( get_search_query() ) );
			} else {
				echo '記事';
			}
			?>
		</h1>
	</div>
</section>

<section class="section" style="padding-top:2.5rem;">
	<div class="container">
		<div class="post-list">
			<?php if ( have_posts() ) : ?>
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<a class="post-row" href="<?php the_permalink(); ?>">
						<span class="post-row__date"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></span>
						<span>
							<h2 class="post-row__title"><?php the_title(); ?></h2>
						</span>
					</a>
				<?php endwhile; ?>
			<?php else : ?>
				<p>該当する記事がありません。</p>
			<?php endif; ?>
		</div>

		<?php
		the_posts_pagination(
			array(
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
