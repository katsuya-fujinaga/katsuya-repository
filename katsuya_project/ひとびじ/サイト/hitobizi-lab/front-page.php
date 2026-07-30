<?php
/**
 * Front page template — official site layout + blog entry
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

/*
 * 無料オファー（FREE PROGRAM 相当）のURL。
 * メルマガ登録URLが決まったら、下の $free_url を差し替える。
 */
$free_url   = $articles_url;
$free_label = 'まずは無料で読む';

$news_query = new WP_Query(
	array(
		'posts_per_page' => 3,
		'post_status'    => 'publish',
		'category_name'  => 'news',
	)
);
?>

<a class="side-cta" href="<?php echo esc_url( $articles_url ); ?>">記事を読む</a>

<section class="hero hero--official" id="top">
	<div class="hero-official">
		<div class="hero-official__copy reveal">
			<p class="hero-eyebrow">裏方から見た、人生が動く仕組みの話</p>
			<h1 class="hero-official__title">
				好きなことは、もう持っている。<br>
				足りないのは、届け方の仕組みだけ。
			</h1>
			<p class="hero-official__lead">
				50代、人生と仕事を立て直し中。<br>
				占い・子育て・スピ・健康系の講座ビジネスを、<br class="hide-sp">
				届く順番で設計するプロデューサーの公式サイトです。
			</p>
			<div class="btn-group">
				<a class="btn btn-primary" href="<?php echo esc_url( $articles_url ); ?>">まずは記事を読む</a>
				<a class="btn btn-outline" href="#recommend">こんな人向け？</a>
			</div>
		</div>
		<div class="hero-official__visual">
			<img
				class="hero-official__img"
				src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/header-hero.png' ); ?>"
				alt="藤永勝也｜ひとびじLAB"
				width="1024"
				height="409"
				decoding="async"
				fetchpriority="high"
			>
		</div>
	</div>
</section>

<section class="proof-strip" aria-label="実績の要点">
	<div class="container">
		<ul class="proof-strip__list reveal">
			<li>
				<span class="proof-strip__value">13年</span>
				<span class="proof-strip__label">飲食店経営の現場感</span>
			</li>
			<li>
				<span class="proof-strip__value">講座伴走</span>
				<span class="proof-strip__label">コンセプト〜セールスまで設計</span>
			</li>
			<li>
				<span class="proof-strip__value">50代</span>
				<span class="proof-strip__label">人生と仕事の再起動中</span>
			</li>
		</ul>
		<?php if ( $results_url ) : ?>
			<p class="proof-strip__more">
				<a href="<?php echo esc_url( $results_url ); ?>">プロジェクト実績を見る →</a>
			</p>
		<?php endif; ?>
	</div>
</section>

<nav class="lp-toc reveal" aria-label="ページ内メニュー">
	<div class="container">
		<ul class="lp-toc__list">
			<li><a href="#story">STORY</a></li>
			<li><a href="#method">METHOD</a></li>
			<li><a href="#entries">入り口</a></li>
			<li><a href="#articles">記事</a></li>
			<li><a href="#free">無料で読む</a></li>
			<li><a href="#profile-short">プロフィール</a></li>
		</ul>
	</div>
</nav>

<section class="section section-alt" id="recommend">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">For You</span>
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
	</div>
</section>

<section class="section" id="story">
	<div class="container-narrow">
		<div class="soft-panel reveal">
			<div class="section-head">
				<span class="section-kicker">STORY</span>
				<h2 class="section-title"><span class="section-title--mark">藤永勝也って、どんな人？</span></h2>
			</div>
			<p>飲食店を長く経営したあと、50代で講座ビジネスのプロデュースへ。<br>いまは「好き」を仕事にしたい人の設計係として、現場の話を書いています。</p>
			<p>いいものを持っている人ほど、「売り方」で止まりやすい。<br>現場で何度も見てきたのは、<strong>才能不足ではなく、設計不足</strong>でした。</p>
			<div class="callout">
				「変わりたい」を、仕組みで現実にする。<br>
				裏方から見た、人生が動く仕組みの話。
			</div>
			<p style="margin-bottom:0;">このサイトは、いまよりもっと<strong>「やさしく売れる人になりたい」</strong>と思っている人のための場所です。<br>読むだけで完結していい。もっと知りたいときは、プロフィールや実績、記事の奥までどうぞ。</p>
		</div>
		<div class="btn-group mid-cta reveal">
			<?php if ( $profile_url ) : ?>
				<a class="btn btn-outline" href="<?php echo esc_url( $profile_url ); ?>">プロフィールを詳しく</a>
			<?php endif; ?>
			<a class="btn btn-primary" href="#method">届け方の話へ</a>
		</div>
	</div>
</section>

<section class="section section-alt" id="method">
	<div class="container-narrow">
		<div class="soft-panel reveal">
			<div class="section-head">
				<span class="section-kicker">METHOD</span>
				<h2 class="section-title"><span class="section-title--mark">売り込む技術ではなく、安心が積み上がる順番</span></h2>
			</div>
			<p>売れない理由は、努力不足ではないことが多い。<br>価値が低いのではなく、<strong>届く順番</strong>がまだ整っていないだけです。</p>
			<p>お客さまが自然に「私のことだ」と感じ、「お願いしたい」と自分で決める。<br>その順番をつくることが、ここで言う届け方です。</p>
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

<section class="section" id="entries">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">SERVICE</span>
			<h2 class="section-title">まずは、どこから入りますか？</h2>
			<p class="section-desc">ステージに合わせて、3つの入り口があります。</p>
		</div>
		<div class="entry-grid">
			<a class="entry-card" href="<?php echo esc_url( $articles_url ); ?>">
				<span class="entry-card__label">はじめての方へ</span>
				<strong class="entry-card__title">記事で学ぶ</strong>
				<p class="entry-card__desc">仕組み・実話・背中を押す話。無料で読めます。</p>
				<span class="entry-card__link">詳細はこちら →</span>
			</a>
			<?php if ( $profile_url ) : ?>
				<a class="entry-card" href="<?php echo esc_url( $profile_url ); ?>">
					<span class="entry-card__label">人を知る</span>
					<strong class="entry-card__title">プロフィール</strong>
					<p class="entry-card__desc">飲食店13年から、講座プロデュースまでの物語。</p>
					<span class="entry-card__link">詳細はこちら →</span>
				</a>
			<?php endif; ?>
			<?php if ( $results_url ) : ?>
				<a class="entry-card" href="<?php echo esc_url( $results_url ); ?>">
					<span class="entry-card__label">信頼の材料</span>
					<strong class="entry-card__title">実績</strong>
					<p class="entry-card__desc">伴走してきたプロジェクトと、やっていること。</p>
					<span class="entry-card__link">詳細はこちら →</span>
				</a>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php if ( $news_query->have_posts() ) : ?>
<section class="section section-alt" id="activity">
	<div class="container reveal">
		<div class="section-head">
			<span class="section-kicker">ACTIVITY</span>
			<h2 class="section-title">お知らせ・活動</h2>
			<p class="section-desc">更新情報や、いま動いていることのメモです。</p>
		</div>
		<div class="post-list">
			<?php
			while ( $news_query->have_posts() ) :
				$news_query->the_post();
				?>
				<a class="post-row" href="<?php the_permalink(); ?>">
					<span class="post-row__date"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></span>
					<span>
						<h3 class="post-row__title"><?php the_title(); ?></h3>
						<span class="post-row__meta">お知らせ</span>
					</span>
				</a>
				<?php
			endwhile;
			wp_reset_postdata();
			?>
		</div>
	</div>
</section>
<?php endif; ?>

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

<section class="section section-alt" id="latest">
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

<section class="section" id="free">
	<div class="container-narrow">
		<div class="cta-band free-band reveal">
			<span class="section-kicker" style="color:inherit;opacity:0.85;">FREE</span>
			<h2><?php echo esc_html( $free_label ); ?></h2>
			<p>お金をかけずに、届け方の考え方に触れられます。<br>まずは記事から、その枠組みに触れてみてください。</p>
			<div class="btn-group">
				<a class="btn btn-primary" href="<?php echo esc_url( $free_url ); ?>">記事を読む</a>
				<a class="btn btn-ghost" href="mailto:mail@katsuyafujinaga.com">お問い合わせ</a>
			</div>
		</div>
	</div>
</section>

<section class="section" id="profile-short" style="padding-top:0;">
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

<?php
get_footer();
