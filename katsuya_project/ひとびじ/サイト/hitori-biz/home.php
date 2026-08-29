<?php
/**
 * Posts index — magazine archive
 *
 * @package Hitori_Biz
 */

get_header();
$posts = hitori_biz_dummy_posts();
?>

<main class="mag-archive">
	<div class="container">
		<div class="mag-section-head">
			<h2>STORIES</h2>
		</div>
		<div class="mag-trend-grid">
			<?php if ( have_posts() ) : ?>
				<?php
				while ( have_posts() ) :
					the_post();
					$image    = hitori_biz_card_image( get_the_ID(), 'dummy-01.jpg' );
					?>
					<a class="mag-card" href="<?php the_permalink(); ?>">
						<div class="mag-card__photo">
							<img src="<?php echo esc_url( $image ); ?>" alt="<?php the_title_attribute(); ?>" width="800" height="500" loading="lazy">
						</div>
						<div class="mag-card__body">
							<p class="mag-kicker mag-kicker--concept"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></p>
							<h3 class="mag-card__title"><?php the_title(); ?></h3>
							<p class="mag-card__excerpt"><?php echo esc_html( wp_trim_words( wp_strip_all_tags( get_the_excerpt() ), 28, '…' ) ); ?></p>
						</div>
					</a>
				<?php endwhile; ?>
			<?php else : ?>
				<?php foreach ( $posts as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, array_merge( $item, array( 'show_excerpt' => true ) ) ); ?>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php
get_footer();
