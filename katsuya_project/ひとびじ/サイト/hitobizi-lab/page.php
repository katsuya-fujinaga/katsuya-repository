<?php
/**
 * Default page template
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<?php
while ( have_posts() ) :
	the_post();
	?>
	<section class="page-hero">
		<div class="container">
			<h1><?php the_title(); ?></h1>
		</div>
	</section>

	<section class="section" style="padding-top:2.5rem;">
		<div class="container-narrow prose entry-content">
			<?php the_content(); ?>
		</div>
	</section>
	<?php
endwhile;
?>

<?php
get_footer();
