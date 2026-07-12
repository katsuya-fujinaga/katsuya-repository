<?php
/**
 * Single post template
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<?php
while ( have_posts() ) :
	the_post();
	?>
	<article <?php post_class( 'section' ); ?>>
		<div class="container-narrow">
			<header style="margin-bottom:2rem;">
				<div class="entry-meta">
					<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date( 'Y年n月j日' ) ); ?></time>
					<?php
					$cats = get_the_category();
					if ( $cats ) :
						foreach ( $cats as $cat ) :
							?>
							<a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"><?php echo esc_html( $cat->name ); ?></a>
							<?php
						endforeach;
					endif;
					?>
				</div>
				<h1><?php the_title(); ?></h1>
			</header>

			<div class="entry-content prose">
				<?php the_content(); ?>
			</div>

			<?php
			$tags = get_the_tags();
			if ( $tags ) :
				?>
				<div class="tag-list">
					<?php foreach ( $tags as $tag ) : ?>
						<a href="<?php echo esc_url( get_tag_link( $tag->term_id ) ); ?>"><?php echo esc_html( $tag->name ); ?></a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<nav style="margin-top:3rem; padding-top:1.5rem; border-top:1px solid var(--line);">
				<a class="btn btn-outline" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/articles/' ) ); ?>">記事一覧へ戻る</a>
			</nav>
		</div>
	</article>
	<?php
endwhile;
?>

<?php
get_footer();
