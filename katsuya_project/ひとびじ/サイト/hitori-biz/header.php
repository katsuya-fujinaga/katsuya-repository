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
	<div class="header-bar">
		<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">HITORI-BIZ</a>
		<a class="header-cta" href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">相談する</a>
		<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="visually-hidden">メニュー</span>
		</button>
	</div>
	<nav id="site-nav" class="site-nav" data-nav aria-label="メインメニュー">
		<ul>
			<li><a href="<?php echo esc_url( home_url( '/#stories' ) ); ?>">STORIES</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#concept' ) ); ?>">CONCEPT</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#funnel' ) ); ?>">FUNNEL</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#sales' ) ); ?>">SALES</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#works' ) ); ?>">WORKS</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#profile' ) ); ?>">PROFILE</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">CONTACT</a></li>
		</ul>
	</nav>
</header>
