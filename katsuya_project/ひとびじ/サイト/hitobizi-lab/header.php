<?php
/**
 * Header template
 *
 * @package Hitobizi_Lab
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
<div class="site-wrap">
	<header class="site-header">
		<div class="header-inner">
			<a class="site-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<span class="site-brand__name"><?php echo esc_html( get_bloginfo( 'name' ) ?: '50代からのひとりビジネスのはじめ方' ); ?></span>
				<span class="site-brand__sub"><?php echo esc_html( get_bloginfo( 'description' ) ?: '藤永勝也｜ひとびじLAB' ); ?></span>
			</a>

			<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle>
				メニュー
			</button>

			<nav id="primary-nav" class="primary-nav" aria-label="メインメニュー" data-primary-nav>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'fallback_cb'    => 'hitobizi_fallback_menu',
						'depth'          => 2,
					)
				);
				?>
			</nav>
		</div>
	</header>
	<main class="site-main">
