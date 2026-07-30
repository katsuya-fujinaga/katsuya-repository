<?php
/**
 * Main fallback template
 *
 * @package Hitori_Biz
 */

get_header();
?>

<main class="page-simple">
	<div class="container container--narrow">
		<?php if ( have_posts() ) : ?>
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<article <?php post_class(); ?>>
					<h1><?php the_title(); ?></h1>
					<div class="entry-content">
						<?php the_content(); ?>
					</div>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<p style="text-align:center;">コンテンツがありません。</p>
		<?php endif; ?>
	</div>
</main>

<?php
get_footer();
