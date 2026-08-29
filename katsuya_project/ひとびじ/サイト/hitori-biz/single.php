<?php
/**
 * Single post
 *
 * @package Hitori_Biz
 */

get_header();
?>

<main class="page-simple">
	<div class="container container--narrow">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class(); ?>>
				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="single-hero-image">
						<?php the_post_thumbnail( 'large' ); ?>
					</figure>
				<?php endif; ?>
				<p class="mag-kicker mag-kicker--concept">STORY</p>
				<h1><?php the_title(); ?></h1>
				<p class="entry-date"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></p>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
				<div class="single-cta">
					<p>届け方で止まっているなら、一度話を聞かせてください。</p>
					<a class="btn btn--primary" href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">相談する</a>
				</div>
			</article>
		<?php endwhile; ?>
	</div>
</main>

<?php
get_footer();
