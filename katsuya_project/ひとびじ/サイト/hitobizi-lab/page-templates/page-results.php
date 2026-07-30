<?php
/**
 * Template Name: 実績
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<section class="page-hero">
	<div class="container">
		<h1>プロジェクト実績</h1>
		<p>講座ビジネスを中心に、コンセプト・LP・広告・セールス設計まで伴走してきた実績です。数字は信頼の材料として、読み物としても残しています。</p>
	</div>
</section>

<section class="section" style="padding-top:1.5rem;">
	<div class="container">
		<div class="results-list reveal">
			<div class="result-item">
				<div class="result-item__year">2023</div>
				<h3>年間プロデュース売上 約6,000万円</h3>
				<p>ひとりアパレル、ダイエット、ボディメイク、サロン、アダルトチルドレン、叡智伝道、ヘルストレーナー、前世覚醒、ソウルパートナーなど、複数ジャンルを並行。</p>
			</div>

			<div class="result-item">
				<div class="result-item__year">2024</div>
				<h3>年間プロデュース売上 約8,000万円</h3>
				<p>ヘルストレーナー起業、日本の叡智伝道師、前世からの覚醒術、魔法の40秒デトックス呼吸など。特に前世からの覚醒術はシーズンで2,200万円規模。</p>
			</div>

			<div class="result-item">
				<div class="result-item__year">2025</div>
				<h3>やさしく売れる占い師 ほか</h3>
				<p>本田有紀華さん案件で「やさしく売れる占い師」約1,000万円。星の引き寄せ、最高の若返り術など複数プロジェクトを並行運用。</p>
			</div>

			<div class="result-item">
				<div class="result-item__year">2026</div>
				<h3>進行中プロジェクト</h3>
				<p>星使いカウンセラー（850万円）、やさしく売れる占い師の継続運用。愛され手相カウンセラー、育脳子育て、FFSコーチングなども設計・改善中。</p>
			</div>
		</div>

		<div class="section" style="padding-bottom:0;">
			<div class="section-head reveal">
				<span class="section-kicker">What I do</span>
				<h2 class="section-title">やっていること</h2>
				<p class="section-desc">ジャンルは違っても、やっていることは同じです。信頼が積み上がる順番を設計し、届く仕組みに落とすこと。</p>
			</div>

			<div class="pillar-list reveal">
				<div class="pillar">
					<h3>コンセプト設計</h3>
					<p>「何を売るか」より先に、「誰のどんな物語を動かすか」を言葉にします。</p>
				</div>
				<div class="pillar">
					<h3>導線・LP・広告</h3>
					<p>入口から個別相談までの道筋を、文章と画面と広告でつなぎます。</p>
				</div>
				<div class="pillar">
					<h3>セールス仕組み化</h3>
					<p>属人的なクロージングを、型と安心に分解して再現できる状態にします。</p>
				</div>
			</div>
		</div>

		<?php
		while ( have_posts() ) :
			the_post();
			$content = trim( get_the_content() );
			if ( $content ) :
				?>
				<div class="container-narrow prose entry-content reveal" style="margin-top:2rem;">
					<?php the_content(); ?>
				</div>
				<?php
			endif;
		endwhile;
		?>
	</div>
</section>

<section class="cta-band">
	<div class="container reveal">
		<h2>実績は、結果の話です。</h2>
		<p>でも本当に大事なのは、その裏にある「届け方の設計」です。記事では、その考え方を少しずつ公開しています。</p>
		<div class="btn-group" style="margin-top:1.5rem;">
			<a class="btn btn-primary" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/articles/' ) ); ?>">記事を読む</a>
			<a class="btn btn-ghost" href="mailto:mail@katsuyafujinaga.com">相談する</a>
		</div>
	</div>
</section>

<?php
get_footer();
