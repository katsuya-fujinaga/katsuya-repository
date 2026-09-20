<?php
/**
 * Single post
 *
 * @package Kotonoha
 */

get_header();
?>
<main class="article">
	<?php if ( have_posts() ) : ?>
		<?php
		while ( have_posts() ) :
			the_post();
			$cats   = get_the_category();
			$kicker = $cats ? strtoupper( $cats[0]->name ) : 'JOURNAL';
			?>
			<p class="mag-kicker article__kicker"><?php echo esc_html( $kicker ); ?></p>
			<h1 class="article__title"><?php the_title(); ?></h1>
			<p class="article__meta"><?php echo esc_html( get_the_date( 'Y年n月j日' ) ); ?></p>
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="article__hero"><?php the_post_thumbnail( 'full' ); ?></div>
			<?php endif; ?>
			<div class="article__body">
				<?php the_content(); ?>
			</div>
		<?php endwhile; ?>
	<?php endif; ?>
</main>
<?php
get_footer();
