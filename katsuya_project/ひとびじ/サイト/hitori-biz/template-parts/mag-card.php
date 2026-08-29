<?php
/**
 * Magazine card.
 *
 * @package Hitori_Biz
 *
 * @var array $args Card data.
 */

$url          = isset( $args['url'] ) ? $args['url'] : '#';
$image        = isset( $args['image'] ) ? $args['image'] : '';
$kicker       = isset( $args['kicker'] ) ? $args['kicker'] : '';
$class        = isset( $args['class'] ) ? $args['class'] : 'concept';
$title        = isset( $args['title'] ) ? $args['title'] : '';
$excerpt      = isset( $args['excerpt'] ) ? $args['excerpt'] : '';
$heading      = isset( $args['heading'] ) ? $args['heading'] : 'h3';
$show_excerpt = ! empty( $args['show_excerpt'] );
$h            = in_array( $heading, array( 'h1', 'h2', 'h3' ), true ) ? $heading : 'h3';
?>
<a class="mag-card" href="<?php echo esc_url( $url ); ?>">
	<div class="mag-card__photo">
		<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( $title ); ?>" width="800" height="500" loading="lazy">
	</div>
	<div class="mag-card__body">
		<p class="mag-kicker mag-kicker--<?php echo esc_attr( $class ); ?>"><?php echo esc_html( $kicker ); ?></p>
		<?php echo '<' . $h . ' class="mag-card__title">' . esc_html( $title ) . '</' . $h . '>'; ?>
		<?php if ( $show_excerpt && $excerpt ) : ?>
			<p class="mag-card__excerpt"><?php echo esc_html( $excerpt ); ?></p>
		<?php endif; ?>
	</div>
</a>
