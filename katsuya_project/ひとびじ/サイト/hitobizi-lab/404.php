<?php
/**
 * 404 template
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<section class="page-hero">
	<div class="container">
		<h1>ページが見つかりません</h1>
		<p>リンクが古い、または移動した可能性があります。ホームか記事一覧から探してみてください。</p>
	</div>
</section>

<section class="section" style="padding-top:2rem;">
	<div class="container">
		<div class="btn-group">
			<a class="btn btn-outline" href="<?php echo esc_url( home_url( '/' ) ); ?>">ホームへ</a>
			<a class="btn btn-outline" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/articles/' ) ); ?>">記事一覧へ</a>
		</div>
	</div>
</section>

<?php
get_footer();
