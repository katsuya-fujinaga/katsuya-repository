<?php
/**
 * Header
 *
 * @package Hitori_Biz
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header" data-header>
	<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">HITORI-BIZ</a>
	<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
		<span class="nav-toggle__bar"></span>
		<span class="nav-toggle__bar"></span>
		<span class="nav-toggle__bar"></span>
		<span class="visually-hidden">メニュー</span>
	</button>
	<nav id="site-nav" class="site-nav" data-nav aria-label="メインメニュー">
		<ul>
			<li><a href="<?php echo esc_url( home_url( '/#concept' ) ); ?>">CONCEPT</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#service' ) ); ?>">SERVICE</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#works' ) ); ?>">WORKS</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#profile' ) ); ?>">PROFILE</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#contents' ) ); ?>">CONTENTS</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#journal' ) ); ?>">JOURNAL</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">CONTACT</a></li>
		</ul>
	</nav>
</header>
