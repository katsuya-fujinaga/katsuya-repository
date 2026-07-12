<?php
/**
 * Front page template — soft long-form LP
 *
 * @package Hitobizi_Lab
 */

get_header();

$articles_id  = (int) get_option( 'page_for_posts' );
$articles_url = $articles_id ? get_permalink( $articles_id ) : home_url( '/articles/' );
$profile      = get_page_by_path( 'profile' );
$results      = get_page_by_path( 'results' );
$profile_url  = $profile ? get_permalink( $profile ) : '';
$results_url  = $results ? get_permalink( $results ) : '';
?>

<a class="side-cta" href="<?php echo esc_url( $articles_url ); ?>">記事を読む</a>

<section class="hero hero--banner" id="top">
	<div class="hero-banner">
		<img
			class="hero-banner__img"
			src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/header-hero.png' ); ?>"
			alt="50代、人生と仕事を立て直し中。遠回りしながら、人生も仕事も、再設計しています。占い・子育て・スピ・健康系・心理学ビジネスの導線設計／LP／広告／セールス改善"
			width="1024"
			height="409"
			decoding="async"
			fetchpriority="high"
		>
	</div>
	<div class="hero-banner__cta">
		<div class="btn-group">
			<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">まずは記事を読む</a>
			<a class="btn btn-outline" href="#recommend">こんな人向け？</a>
		</div>
	</div>
</section>

<nav class="lp-toc reveal" aria-label="ページ内メニュー">
	<div class="container">
		<ul class="lp-toc__list">
			<li><a href="#about">このサイトは</a></li>
			<li><a href="#recommend">こんな人に</a></li>
			<li><a href="#reason">売れない理由</a></li>
			<li><a href="#method">届け方の話</a></li>
			<li><a href="#learn">学べること</a></li>
			<li><a href="#articles">記事</a></li>
			<li><a href="#profile-short">プロフィール</a></li>
		</ul>
	</div>
</nav>

<section class="section" id="about">
	<div class="container-narrow">
		<div class="soft-panel reveal">
			<div class="section-head">
				<span class="section-kicker">このサイトは</span>
				<h2 class="section-title"><span class="section-title--mark">裏方から見た、人生が動く仕組みの話</span></h2>
			</div>
			<p>このサイトは、いまよりもっと<br><strong>「やさしく売れる人になりたい」</strong><br>と思っている人のための場所です。</p>
			<p>商品や想いは、もう持っている。<br>でも、なぜか届かない。選ばれない。続かない。</p>
			<p>そんなときに必要なのは、もっと頑張ることではなく、<br><strong>届け方の仕組み</strong>を整えることです。</p>
			<div class="callout">
				好きなことは、もう持っている。足りないのは、届け方の仕組みだけ。
			</div>
			<p style="margin-bottom:0;">飲食店を長く経営したあと、50代で講座ビジネスのプロデュースへ。<br>いまは「好き」を仕事にしたい人の設計係として、現場の話を書いています。</p>
		</div>
		<div class="mid-cta reveal">
			<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">記事を読んでみる</a>
		</div>
	</div>
</section>

<section class="section section-alt" id="recommend">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">こんな人に読んでほしい</span>
			<h2 class="section-title">当てはまるもの、ありますか？</h2>
			<p class="section-desc">ひとつでもあれば、この先の話はきっと役に立ちます。</p>
		</div>
		<ul class="recommend-list" style="max-width:640px;margin:0 auto;">
			<li>好きなことはあるのに、うまく届かないと感じている</li>
			<li>商品や想いに自信はあるが、売り方がわからない</li>
			<li>煽らず、やさしく選ばれる仕組みを知りたい</li>
			<li>50代からの働き方・再起動のヒントがほしい</li>
			<li>講座・コンテンツ販売の裏側を知りたい</li>
			<li>「私にもできるかも」と思える実話がほしい</li>
		</ul>
		<div class="mid-cta">
			<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">うけとってみる（無料で読む）</a>
		</div>
	</div>
</section>

<section class="section" id="reason">
	<div class="container-narrow">
		<div class="soft-panel reveal">
			<div class="section-head">
				<span class="section-kicker">なぜ売れないのか</span>
				<h2 class="section-title"><span class="section-title--mark">努力不足じゃないことが多い</span></h2>
			</div>
			<p>「もっと勉強しなきゃ」<br>「もっと発信しなきゃ」<br>「私には才能がないのかも」</p>
			<p>ひとりでビジネスを始めると、こんな声が頭の中を回りやすいです。</p>
			<p>でも、現場を見ていると、売れない理由はだいたい違います。</p>
			<div class="callout">
				価値が低いのではなく、<strong>届く順番</strong>がまだ整っていない。
			</div>
			<p>たとえば料理でいうと、食材はいいのに、味付けの順番がバラバラな状態。<br>塩も砂糖も醤油もある。でも「真ん中の考え方」がないと、毎回ブレます。</p>
			<p>ビジネスも同じです。<br>商品、想い、実績、発信。材料はある。<br>足りないのは、それらをつなぐ<strong>枠組み</strong>です。</p>
			<p style="margin-bottom:0;">このサイトでは、その枠組みを「届け方」と呼んでいます。</p>
		</div>
		<div class="mid-cta reveal">
			<a class="btn btn-primary" href="#method">届け方の話を読む</a>
		</div>
	</div>
</section>

<section class="section section-alt" id="method">
	<div class="container-narrow">
		<div class="soft-panel reveal">
			<div class="section-head">
				<span class="section-kicker">届け方とは</span>
				<h2 class="section-title"><span class="section-title--mark">売り込む技術ではなく、安心が積み上がる順番</span></h2>
			</div>
			<p>届け方というと、「セールストーク」や「煽る文章」を想像する人もいます。<br>でも、ここで言う届け方は違います。</p>
			<p>お客さまが自然に</p>
			<ul class="plain-list">
				<li>「私のことだ」と感じ</li>
				<li>「だからうまくいかなかったのか」と腑に落ち</li>
				<li>「この人なら任せられそう」と安心し</li>
				<li>「お願いしたい」と自分で決める</li>
			</ul>
			<p>その順番をつくることです。</p>
			<div class="story-steps">
				<div class="story-step">
					<span class="story-step__num">1</span>
					<div>
						<strong>共感</strong>
						<p>いままでの自分の話として、悩みを受け止める</p>
					</div>
				</div>
				<div class="story-step">
					<span class="story-step__num">2</span>
					<div>
						<strong>ズラし</strong>
						<p>努力不足ではなく、見方がズレていたと示す</p>
					</div>
				</div>
				<div class="story-step">
					<span class="story-step__num">3</span>
					<div>
						<strong>再定義</strong>
						<p>本当に必要なのは「届け方の仕組み」だと伝える</p>
					</div>
				</div>
				<div class="story-step">
					<span class="story-step__num">4</span>
					<div>
						<strong>希望</strong>
						<p>正しく整えれば、やさしく選ばれる未来が見える</p>
					</div>
				</div>
				<div class="story-step">
					<span class="story-step__num">5</span>
					<div>
						<strong>手段</strong>
						<p>そこで初めて、商品やサービスが自然につながる</p>
					</div>
				</div>
			</div>
			<p style="margin-bottom:0;">押し売りではなく、<strong>納得のうえでの選択</strong>。<br>その設計を、記事の中で少しずつ公開していきます。</p>
		</div>
		<div class="mid-cta reveal">
			<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">仕組みの話を読む</a>
		</div>
	</div>
</section>

<section class="section" id="learn">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">ここで学べること</span>
			<h2 class="section-title">読み進めると、見えてくること</h2>
			<p class="section-desc">ノウハウの羅列ではなく、「なるほど、そういう構造だったのか」と思える話を大切にしています。</p>
		</div>

		<div class="learn-grid">
			<div class="learn-card">
				<strong>コンセプトの言葉</strong>
				<p>好きを一言で伝える。比較されない立ち位置の作り方。</p>
			</div>
			<div class="learn-card">
				<strong>導線の設計</strong>
				<p>出会ってから「お願いしたい」までの道筋の整え方。</p>
			</div>
			<div class="learn-card">
				<strong>やさしいセールス</strong>
				<p>煽らず、安心と期待を育てて選ばれる流れ。</p>
			</div>
			<div class="learn-card">
				<strong>再起と働き方</strong>
				<p>50代からの再起動。二足の草鞋のリアル。</p>
			</div>
			<div class="learn-card">
				<strong>現場の実話</strong>
				<p>講座ビジネスの裏側で、何が効いて何が効かないか。</p>
			</div>
			<div class="learn-card">
				<strong>仕事の進め方</strong>
				<p>続きが書けない日、不安が強い日の整え方。</p>
			</div>
		</div>

		<div class="pillar-list" style="margin-top:1.6rem;">
			<div class="pillar">
				<span class="pillar__num">1</span>
				<h3>仕組みの話</h3>
				<p>コンセプト、導線、セールス設計。感覚ではなく、再現できる構造で伝えます。</p>
			</div>
			<div class="pillar">
				<span class="pillar__num">2</span>
				<h3>実話の話</h3>
				<p>現場で見てきた講師さんや、自分自身の再起動の話。きれいごとだけで終わらせません。</p>
			</div>
			<div class="pillar">
				<span class="pillar__num">3</span>
				<h3>背中を押す話</h3>
				<p>好きなことは、もう持っている。足りないのは届け方の仕組みだけ、という視点で書きます。</p>
			</div>
		</div>

		<div class="mid-cta">
			<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">記事一覧を見る</a>
		</div>
	</div>
</section>

<section class="section section-alt" id="why">
	<div class="container-narrow">
		<div class="soft-panel reveal">
			<div class="section-head">
				<span class="section-kicker">なぜ書いているのか</span>
				<h2 class="section-title"><span class="section-title--mark">届け方で止まる人を、減らしたい</span></h2>
			</div>
			<p>いいものを持っている人ほど、「売り方」で止まりやすいです。</p>
			<p>わたし自身、飲食店を長くやり、文章の仕事も続け、いまは講座ビジネスの裏方をしています。<br>そこで何度も見てきたのは、<strong>才能不足ではなく、設計不足</strong>で止まっている人の姿でした。</p>
			<div class="callout">
				「変わりたい」を、仕組みで現実にする。
			</div>
			<p>だからこのサイトでは、きれいな理論だけで終わらせません。<br>現場で使っている考え方を、やさしい言葉で残していきます。</p>
			<p style="margin-bottom:0;">読むだけで完結していい。<br>でも、もし「もっと知りたい」と思ったら、プロフィールや実績、記事の奥まで進んでみてください。</p>
		</div>
		<div class="btn-group mid-cta reveal">
			<?php if ( $profile_url ) : ?>
				<a class="btn btn-outline" href="<?php echo esc_url( $profile_url ); ?>">プロフィール</a>
			<?php endif; ?>
			<?php if ( $results_url ) : ?>
				<a class="btn btn-outline" href="<?php echo esc_url( $results_url ); ?>">実績</a>
			<?php endif; ?>
			<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">記事へ</a>
		</div>
	</div>
</section>

<section class="section" id="articles">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">Articles</span>
			<h2 class="section-title">読みたいテーマから入る</h2>
			<p class="section-desc">投稿は WordPress のカテゴリで管理します。気になるところからどうぞ。</p>
		</div>

		<div class="category-grid">
			<?php foreach ( hitobizi_category_cards() as $card ) : ?>
				<a class="category-link" href="<?php echo esc_url( $card['url'] ); ?>">
					<strong><?php echo esc_html( $card['name'] ); ?></strong>
					<span><?php echo esc_html( $card['description'] ); ?><?php echo $card['count'] ? '（' . (int) $card['count'] . '）' : ''; ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="section section-alt">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">Latest</span>
			<h2 class="section-title">最新の記事</h2>
			<p class="section-desc">日々の気づきと、現場で使っている考え方を短くまとめています。</p>
		</div>

		<div class="post-list">
			<?php
			$latest = new WP_Query(
				array(
					'posts_per_page' => 6,
					'post_status'    => 'publish',
				)
			);

			if ( $latest->have_posts() ) :
				while ( $latest->have_posts() ) :
					$latest->the_post();
					$cats     = get_the_category();
					$cat_name = $cats ? $cats[0]->name : '';
					?>
					<a class="post-row" href="<?php the_permalink(); ?>">
						<span class="post-row__date"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></span>
						<span>
							<h3 class="post-row__title"><?php the_title(); ?></h3>
							<?php if ( $cat_name ) : ?>
								<span class="post-row__meta"><?php echo esc_html( $cat_name ); ?></span>
							<?php endif; ?>
						</span>
					</a>
					<?php
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<div class="soft-panel text-center">
					<p style="margin:0;">まだ記事がありません。管理画面の「投稿」から最初の1本を書いてください。</p>
				</div>
			<?php endif; ?>
		</div>

		<div class="mid-cta">
			<a class="btn btn-outline" href="<?php echo esc_url( $articles_url ); ?>">記事一覧へ</a>
		</div>
	</div>
</section>

<section class="section" id="profile-short">
	<div class="container-narrow">
		<div class="soft-panel reveal text-center">
			<div class="section-head">
				<span class="section-kicker">Profile</span>
				<h2 class="section-title"><span class="section-title--mark">藤永勝也｜ひとびじLAB</span></h2>
			</div>
			<p>50代からのひとりビジネスのはじめ方。<br>ホテル・フレンチ・ソムリエを経て飲食店を長く経営し、のち講座ビジネスのプロデュースへ。</p>
			<p>LP・広告・個別相談まで設計。いまは社食の調理とプロデュースの二足。</p>
			<div class="btn-group" style="margin-top:1.2rem;">
				<?php if ( $profile_url ) : ?>
					<a class="btn btn-outline" href="<?php echo esc_url( $profile_url ); ?>">プロフィールを詳しく</a>
				<?php endif; ?>
				<?php if ( $results_url ) : ?>
					<a class="btn btn-outline" href="<?php echo esc_url( $results_url ); ?>">実績を見る</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>

<section class="section" style="padding-top:0;" id="start">
	<div class="container-narrow">
		<div class="cta-band reveal">
			<h2>好きなことは、もう持っている。</h2>
			<p>足りないのは、届け方の仕組みだけ。<br>まずは記事から、その考え方に触れてみてください。</p>
			<div class="btn-group">
				<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">記事を読む</a>
				<a class="btn btn-ghost" href="mailto:mail@katsuyafujinaga.com">お問い合わせ</a>
			</div>
		</div>
	</div>
</section>

<?php
get_footer();
