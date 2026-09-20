<?php
/**
 * Blog index / Journal
 *
 * @package Kotonoha
 */

get_header();
$posts = kotonoha_posts();
?>
<main class="mag-main">
	<section class="mag-section">
		<div class="container">
			<div class="mag-section-head">
				<h2>JOURNAL</h2>
			</div>
			<div class="mag-archive">
				<?php foreach ( $posts as $item ) : ?>
					<?php get_template_part( 'template-parts/mag-card', null, $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
</main>
<?php
get_footer();
