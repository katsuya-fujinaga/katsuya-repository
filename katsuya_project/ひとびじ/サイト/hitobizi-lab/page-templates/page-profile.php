<?php
/**
 * Template Name: プロフィール
 *
 * @package Hitobizi_Lab
 */

get_header();
?>

<section class="page-hero">
	<div class="container">
		<h1>プロフィール</h1>
		<p>50代からのひとりビジネスのはじめ方。藤永勝也｜ひとびじLAB。届け方の設計を、裏方から整える仕事をしています。</p>
	</div>
</section>

<section class="section" style="padding-top:1.5rem;">
	<div class="container">
		<div class="profile-grid">
			<div class="soft-panel prose reveal">
				<h2>こんな人でした</h2>
				<p>わたしは、バブルの末期あたりに社会に出た世代です。若いころは、酒も遊びも好きで、勢いだけは負けないタイプでした。</p>
				<p>名古屋のホテルで飲食の道に入り、フレンチの現場でマネージャーをしながら、本業はソムリエでした。グラス越しに見える「その人の今晚の機嫌」みたいなものに、ずいぶん鍛えられた気がします。</p>
				<p>あとから振り返ると、文章の仕事もずっと続けていました。チームの一員として、億を超える規模のプロモーションに携わったり、学び系やスピリチュアル系の、いわゆる「届け方が命」の案件に触れたり。「現場の体温」と「文章の冷たさ」のあいだを行き来する感覚は、そのころから身についてきたのかもしれません。</p>

				<h2>店を持った日々</h2>
				<p>愛知の犬山で、小さなビストロを長くやっていました。飲食のコンサルと二足の草鞋も、かなりの期間続きました。好きだった仕事です。でも、コロナと、二足の限界が重なって、心と体が先に正直になる年が来ました。</p>
				<p>2022年の秋、店を畳みました。「負けた」とは思っていません。長くやり切ったあとで、次の形を選び直した、という感覚に近いです。</p>

				<h2>いまの仕事</h2>
				<p>いまは、講座ビジネスを中心にプロデュースしています。占い、子育て、健康、コーチング。ジャンルはバラバラに見えても、やっていることはだいたい同じで、<strong>届け方の設計</strong>です。</p>
				<p>LP、動画の台本、Web広告、個別相談の流れ。「売れる一言」より先に、<strong>信頼が積み上がる順番</strong>を一緒に決めることが多いです。</p>
				<p>朝は、社員食堂で調理の仕事もしています。火を見る時間と、パソコンの前の時間。どちらも「人の胃袋と心のあたり」を考える仕事で、不思議と根っこは同じだな、と思うことがあります。</p>

				<blockquote>
					好きなことは、もう持っている。<br>
					足りないのは、届け方の仕組みだけ。
				</blockquote>

				<?php
				while ( have_posts() ) :
					the_post();
					$content = trim( get_the_content() );
					if ( $content ) :
						?>
						<div class="entry-content" style="margin-top:2.5rem;">
							<?php the_content(); ?>
						</div>
						<?php
					endif;
				endwhile;
				?>
			</div>

			<aside class="profile-aside reveal">
				<h3>基本情報</h3>
				<dl>
					<dt>名前</dt>
					<dd>藤永勝也</dd>
					<dt>サイト</dt>
					<dd>50代からのひとりビジネスのはじめ方</dd>
					<dt>ブランド</dt>
					<dd>藤永勝也｜ひとびじLAB</dd>
					<dt>拠点</dt>
					<dd>岐阜県各務原市</dd>
					<dt>連絡先</dt>
					<dd><a href="mailto:mail@katsuyafujinaga.com">mail@katsuyafujinaga.com</a></dd>
				</dl>

				<h3 style="margin-top:2rem;">これまでの流れ</h3>
				<ul class="timeline">
					<li>
						<strong>ホテル・フレンチ・ソムリエ</strong>
						<span>現場と人の機嫌を見る仕事から始まる</span>
					</li>
					<li>
						<strong>飲食店経営（犬山）</strong>
						<span>ビストロを長く運営。コンサルも並行</span>
					</li>
					<li>
						<strong>ライター時代</strong>
						<span>大型プロモーションの文章づくりに参加</span>
					</li>
					<li>
						<strong>2022年〜 プロデュースへ</strong>
						<span>講座ビジネスの届け方を設計する仕事へ転換</span>
					</li>
					<li>
						<strong>いま</strong>
						<span>社食の調理と、プロデューサー業の二足</span>
					</li>
				</ul>

				<div class="btn-group" style="margin-top:1.8rem;">
					<?php
					$results = get_page_by_path( 'results' );
					if ( $results ) :
						?>
						<a class="btn btn-outline" href="<?php echo esc_url( get_permalink( $results ) ); ?>">実績を見る</a>
					<?php endif; ?>
				</div>
			</aside>
		</div>
	</div>
</section>

<?php
get_footer();
