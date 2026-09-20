<?php
/**
 * Page
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
			?>
			<p class="mag-kicker article__kicker">KOTONOHA</p>
			<h1 class="article__title"><?php the_title(); ?></h1>
			<div class="article__body">
				<?php the_content(); ?>
			</div>
		<?php endwhile; ?>
	<?php endif; ?>
</main>
<?php
get_footer();
