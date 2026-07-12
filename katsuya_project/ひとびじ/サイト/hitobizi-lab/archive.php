<?php
/**
 * Category / archive template
 *
 * @package Hitobizi_Lab
 */

get_header();

$title = '記事';
$desc  = '';

if ( is_category() ) {
	$title = single_cat_title( '', false );
	$desc  = category_description();
} elseif ( is_tag() ) {
	$title = single_tag_title( '', false );
} elseif ( is_archive() ) {
	$title = get_the_archive_title();
}
?>

<section class="page-hero">
	<div class="container">
		<h1><?php echo esc_html( wp_strip_all_tags( $title ) ); ?></h1>
		<?php if ( $desc ) : ?>
			<div><?php echo wp_kses_post( $desc ); ?></div>
		<?php else : ?>
			<p>このテーマの記事一覧です。</p>
		<?php endif; ?>
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
					<a class="post-row reveal" href="<?php the_permalink(); ?>">
						<span class="post-row__date"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></span>
						<span>
							<h2 class="post-row__title"><?php the_title(); ?></h2>
						</span>
					</a>
				<?php endwhile; ?>
			<?php else : ?>
				<p>このカテゴリにはまだ記事がありません。</p>
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
