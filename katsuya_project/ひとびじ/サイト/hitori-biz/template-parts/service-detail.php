<?php
/**
 * Shared markup for SERVICE detail pages.
 *
 * Expected $args:
 * - number (string)
 * - title (string)
 * - lead (string)
 * - sections (array of [ 'heading' => '', 'body' => '' ])
 * - image (string URL, optional)
 *
 * @package Hitori_Biz
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$number   = isset( $args['number'] ) ? $args['number'] : '';
$title    = isset( $args['title'] ) ? $args['title'] : '';
$lead     = isset( $args['lead'] ) ? $args['lead'] : '';
$sections = isset( $args['sections'] ) && is_array( $args['sections'] ) ? $args['sections'] : array();
$image    = isset( $args['image'] ) ? $args['image'] : '';
?>

<main class="service-detail">
	<section class="service-detail__hero">
		<div class="container container--narrow">
			<p class="service-detail__eyebrow">SERVICE <?php echo esc_html( $number ); ?></p>
			<h1 class="service-detail__title"><?php echo esc_html( $title ); ?></h1>
			<p class="service-detail__lead"><?php echo nl2br( esc_html( $lead ) ); ?></p>
		</div>
	</section>

	<?php if ( $image ) : ?>
		<div class="service-detail__visual" aria-hidden="true">
			<div class="container">
				<div class="service-detail__image" style="background-image:url('<?php echo esc_url( $image ); ?>')"></div>
			</div>
		</div>
	<?php endif; ?>

	<section class="section service-detail__body">
		<div class="container container--narrow">
			<?php foreach ( $sections as $section ) : ?>
				<article class="service-detail__block">
					<h2><?php echo esc_html( $section['heading'] ); ?></h2>
					<p><?php echo nl2br( esc_html( $section['body'] ) ); ?></p>
				</article>
			<?php endforeach; ?>

			<div class="service-detail__cta">
				<a class="btn btn--primary" href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">まずは相談する</a>
				<a class="btn btn--text" href="<?php echo esc_url( home_url( '/#service' ) ); ?>">SERVICE一覧へ戻る</a>
			</div>
		</div>
	</section>
</main>
