<?php
/**
 * Header
 *
 * @package Kotonoha
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
<header class="site-header">
	<div class="header-bar">
		<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="visually-hidden">メニュー</span>
		</button>
		<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<span class="logo__mark">KOTONOHA</span>
			<span class="logo__sub">ことのは</span>
		</a>
		<a class="header-link" href="<?php echo esc_url( home_url( '/contact-us/' ) ); ?>">CONTACT</a>
	</div>
	<nav id="site-nav" class="site-nav" data-nav aria-label="メインメニュー">
		<ul>
			<li><a href="<?php echo esc_url( home_url( '/#top-stories' ) ); ?>">TOP STORIES</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#method' ) ); ?>">METHOD</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#story' ) ); ?>">STORY</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#sales' ) ); ?>">SALES</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#works' ) ); ?>">WORKS</a></li>
			<li><a href="<?php echo esc_url( home_url( '/#profile' ) ); ?>">PROFILE</a></li>
			<li><a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/' ) ); ?>">JOURNAL</a></li>
		</ul>
	</nav>
</header>
