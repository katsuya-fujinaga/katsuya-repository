<?php
/**
 * Footer
 *
 * @package Kotonoha
 */
?>
<footer class="site-footer">
	<div class="container">
		<p class="footer-brand">KOTONOHA</p>
		<p class="footer-tag">伝えたい想いを「伝わる形」に</p>
		<ul class="footer-links">
			<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Journal</a></li>
			<li><a href="<?php echo esc_url( home_url( '/会社概要/' ) ); ?>">会社概要</a></li>
			<li><a href="<?php echo esc_url( home_url( '/contact-us/' ) ); ?>">お問い合わせ</a></li>
			<li><a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">プライバシーポリシー</a></li>
			<li><a href="<?php echo esc_url( home_url( '/law/' ) ); ?>">特定商取引法に基づく表記</a></li>
		</ul>
		<p class="footer-copy">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> KOTONOHA</p>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
