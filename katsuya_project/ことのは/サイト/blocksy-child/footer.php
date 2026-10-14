<?php
/**
 * Footer
 *
 * @package Kotonoha
 */
?>
<?php $brand = kotonoha_brand(); ?>
<footer class="site-footer">
	<div class="container">
		<p class="footer-brand"><?php echo esc_html( $brand['mark'] ); ?></p>
		<p class="footer-sub"><?php echo esc_html( $brand['sub'] ); ?></p>
		<p class="footer-tag"><?php echo esc_html( $brand['desc'] ); ?></p>
		<ul class="footer-links">
			<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Journal</a></li>
			<li><a href="<?php echo esc_url( home_url( '/会社概要/' ) ); ?>">会社概要</a></li>
			<li><a href="<?php echo esc_url( home_url( '/contact-us/' ) ); ?>">お問い合わせ</a></li>
			<li><a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">プライバシーポリシー</a></li>
			<li><a href="<?php echo esc_url( home_url( '/law/' ) ); ?>">特定商取引法に基づく表記</a></li>
		</ul>
		<p class="footer-copy">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( $brand['mark'] ); ?></p>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
