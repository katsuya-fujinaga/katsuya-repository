<?php
/**
 * Footer template
 *
 * @package Hitobizi_Lab
 */
?>
	</main>

	<footer class="site-footer">
		<div class="container">
			<div class="footer-grid">
				<div>
					<div class="footer-brand">ひとびじLAB</div>
					<p class="footer-tagline">藤永勝也｜50代からのひとりビジネスのはじめ方</p>
					<p>「変わりたい」を、仕組みで現実にする。<br>裏方から見た、人生が動く仕組みの話。</p>
					<p>
						<a href="https://www.instagram.com/katsuyafujinaga/" target="_blank" rel="noopener noreferrer">Instagram</a>
						　
						<a href="https://x.com/fujikatsu1970" target="_blank" rel="noopener noreferrer">X</a>
					</p>
				</div>

				<div class="footer-nav">
					<h3>メニュー</h3>
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'footer',
							'container'      => false,
							'fallback_cb'    => 'hitobizi_fallback_menu',
							'depth'          => 1,
						)
					);
					?>
				</div>

				<div class="footer-cats">
					<h3>記事カテゴリ</h3>
					<ul>
						<?php foreach ( hitobizi_category_cards() as $card ) : ?>
							<li>
								<a href="<?php echo esc_url( $card['url'] ); ?>">
									<?php echo esc_html( $card['name'] ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				</div>
			</div>

			<div class="footer-bottom">
				<span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'description' ) ?: '藤永勝也｜ひとびじLAB' ); ?></span>
				<span>mail@katsuyafujinaga.com</span>
			</div>
		</div>
	</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
