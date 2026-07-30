<?php
/**
 * Front page — HITORI-BIZ
 *
 * @package Hitori_Biz
 */

get_header();

$img = get_template_directory_uri() . '/assets/images';
?>

<main id="top">
	<section class="hero">
		<div
			class="hero__bg"
			style="background-image:url('<?php echo esc_url( $img . '/hero.png' ); ?>')"
			role="img"
			aria-label="オフィスで働く人々"
		></div>
		<div class="hero__copy">
			<p class="hero__brand">HITORI-BIZ</p>
			<h1 class="hero__title">
				ひとりで始める。<br>
				チームで走る。
			</h1>
			<p class="hero__lead">
				個人起業家の経験と想いを、<br>
				選ばれ、売れ続ける仕組みに。
			</p>
			<p class="hero__support">
				コンセプト、導線、LP、広告、セールスまで、<br>
				一人では届かない部分をチームで伴走します。
			</p>
			<div class="hero__actions">
				<a class="btn btn--ghost" href="#service">サービスを見る</a>
				<a class="btn btn--primary" href="#contact">まずは相談する</a>
			</div>
		</div>
	</section>

	<section class="section worries" id="worries">
		<div class="container">
			<h2 class="section-title">こんな悩みはありませんか</h2>
			<ul class="worry-list">
				<li>好きなことはあるのに、「何を売ればいいか」が言葉にならない</li>
				<li>LPや広告を出しても、相談や申込みまでつながらない</li>
				<li>売ろうとすると気後れする。煽りたくないし、押し売りもしたくない</li>
				<li>ひとりで全部やろうとして、届け方で止まってしまう</li>
			</ul>
			<p class="section-note">
				その多くは、才能不足ではなく「届け方」と「仕組み」のズレです。
			</p>
		</div>
	</section>

	<section class="section concept" id="concept">
		<div class="container">
			<h2 class="section-title">HITORI-BIZができること</h2>
			<p class="section-lead">
				経験・想い・商品を、<br>
				ちゃんと届いて、ちゃんと売れる形に。
			</p>
			<p class="concept__body">
				個人起業家のための<br>
				コンテンツプロデュースチーム。
			</p>
			<p class="concept__body concept__body--follow">
				ひとりでは届きにくいところを、仕組みと伴走で整えます。<br>
				コンセプト、導線、LP、広告、セールス設計まで。<br>
				「好き」を、ちゃんと届くビジネスに変えていくのが、わたしたちの仕事です。
			</p>
			<p class="concept__credit">HITORI-BIZ プロデューサー　藤永勝也</p>
		</div>
	</section>

	<section class="section service" id="service">
		<div class="container">
			<h2 class="section-title">SERVICE</h2>
			<p class="section-intro">届くまでに必要な4つの領域を、分断せずにつなぎます。</p>
			<div class="service-list">
				<article class="service-item">
					<a class="service-item__link" href="<?php echo esc_url( home_url( '/service-concept/' ) ); ?>">
						<div
							class="service-item__image"
							style="background-image:url('https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')"
						></div>
						<h3>コンセプト設計</h3>
						<p>好きを一言で伝える言葉をつくり、比較されない立ち位置を設計します。</p>
						<span class="service-item__more">詳しく見る</span>
					</a>
				</article>
				<article class="service-item">
					<a class="service-item__link" href="<?php echo esc_url( home_url( '/service-dousen/' ) ); ?>">
						<div
							class="service-item__image"
							style="background-image:url('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')"
						></div>
						<h3>導線・LP・広告</h3>
						<p>出会ってから「お願いしたい」までの道筋を、文章と画面と広告でつなぎます。</p>
						<span class="service-item__more">詳しく見る</span>
					</a>
				</article>
				<article class="service-item">
					<a class="service-item__link" href="<?php echo esc_url( home_url( '/service-sales/' ) ); ?>">
						<div
							class="service-item__image"
							style="background-image:url('https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')"
						></div>
						<h3>やさしいセールス設計</h3>
						<p>煽らず、安心と期待を育てて選ばれる流れを仕組み化します。</p>
						<span class="service-item__more">詳しく見る</span>
					</a>
				</article>
				<article class="service-item">
					<a class="service-item__link" href="<?php echo esc_url( home_url( '/service-bansou/' ) ); ?>">
						<div
							class="service-item__image"
							style="background-image:url('https://images.unsplash.com/photo-1542744173-05336fcc7ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')"
						></div>
						<h3>伴走・改善</h3>
						<p>現場の数字と反応をもとに、継続的な改善と伴走を行います。</p>
						<span class="service-item__more">詳しく見る</span>
					</a>
				</article>
			</div>
		</div>
	</section>

	<section class="section works" id="works">
		<div class="container">
			<h2 class="section-title">WORKS</h2>
			<p class="section-intro">2026年8月現在、進行中の伴走案件です。</p>
			<div class="works-list">
				<article class="work-card">
					<div class="work-card__head">
						<img
							class="work-card__photo"
							src="<?php echo esc_url( $img . '/works-honda.png' ); ?>"
							alt="本田有紀華先生"
							width="160"
							height="160"
							loading="lazy"
							decoding="async"
						>
						<div>
							<p class="work-card__label">CASE 01｜進行中</p>
							<h3>やさしく売れる占い師</h3>
							<p class="work-card__teacher">本田有紀華先生</p>
						</div>
					</div>
					<dl class="work-card__meta">
						<div>
							<dt>サポート内容</dt>
							<dd>コンセプトメイク／導線設計・LP作成／広告運用／セミナー／クロージング／運営</dd>
						</div>
					</dl>
					<p class="work-card__link">
						<a href="https://sub.uranai-ambitious.com/p/yasashiku1" target="_blank" rel="noopener noreferrer">公開中のLPを見る</a>
					</p>
				</article>

				<article class="work-card">
					<div class="work-card__head">
						<img
							class="work-card__photo"
							src="<?php echo esc_url( $img . '/works-nagase.png' ); ?>"
							alt="永瀬まみ先生"
							width="160"
							height="160"
							loading="lazy"
							decoding="async"
						>
						<div>
							<p class="work-card__label">CASE 02｜進行中</p>
							<h3>おうち育脳のはじめ方</h3>
							<p class="work-card__teacher">永瀬まみ先生</p>
						</div>
					</div>
					<dl class="work-card__meta">
						<div>
							<dt>サポート内容</dt>
							<dd>コンセプトメイク／導線設計・LP作成／広告運用／セミナー／クロージング／運営</dd>
						</div>
					</dl>
					<p class="work-card__link">
						<a href="https://ikunou.net/lp02/" target="_blank" rel="noopener noreferrer">公開中のLPを見る</a>
					</p>
				</article>
			</div>
			<p class="section-note">
				年間プロデュース実績の目安：2023年 約6,000万円／2024年 約8,000万円
			</p>
		</div>
	</section>

	<section class="section profile" id="profile">
		<div class="container">
			<h2 class="section-title">PROFILE</h2>
			<div class="profile__grid">
				<figure class="profile__photo">
					<img
						src="<?php echo esc_url( $img . '/profile.png' ); ?>"
						alt="藤永勝也"
						width="320"
						height="360"
						loading="lazy"
						decoding="async"
					>
				</figure>
				<div class="profile__body">
					<p class="profile__name">藤永勝也</p>
					<p class="profile__role">HITORI-BIZ プロデューサー</p>
					<p>
						飲食店を約14年経営。現場で「選ばれる理由」を肌で学び、コロナ禍などを経て廃業後、マーケティング・コンテンツプロデュースへ転身しました。
					</p>
					<p>
						いまは、個人起業家・講師の「経験と想い」を、届いて売れる仕組みに変える伴走をしています。
					</p>
					<h3>得意な市場</h3>
					<ul>
						<li>講座ビジネス（占い・スピリチュアル・カウンセリング・教育）</li>
						<li>女性向けを中心に、人生が動くコンテンツの設計</li>
						<li>LP・広告・セールスまでを分断しない一気通貫の設計</li>
					</ul>
					<h3>仕事で大切にしていること</h3>
					<ul>
						<li>煽らず、安心と期待を育てて選ばれること</li>
						<li>感覚だけで終わらせず、仕組みと数字で再現すること</li>
						<li>講師の人生も、お客さまの人生も動く設計をすること</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="section reasons" id="reasons">
		<div class="container">
			<h2 class="section-title">プロデュースで大事にしていること</h2>
			<div class="reason-list">
				<article>
					<h3>01｜現場出身の視点</h3>
					<p>飲食店約14年の現場感があるから、きれいな理論だけで終わらせません。</p>
				</article>
				<article>
					<h3>02｜仕組みで再現する</h3>
					<p>「すごい人だから売れる」ではなく、言葉・導線・セールスを型にします。</p>
				</article>
				<article>
					<h3>03｜やさしく、でも成果まで</h3>
					<p>押し売りを避けつつ、相談・成約につながる設計を両立します。</p>
				</article>
				<article>
					<h3>04｜一人で抱えさせない</h3>
					<p>作って終わりではなく、数字を見ながらの改善と伴走まで入ります。</p>
				</article>
			</div>
		</div>
	</section>

	<section class="section flow" id="flow">
		<div class="container container--narrow">
			<h2 class="section-title">ご相談から伴走まで</h2>
			<ol class="flow-list">
				<li>
					<strong>01｜相談する</strong>
					<span>いまの状態と、目指したい未来を伺います。</span>
				</li>
				<li>
					<strong>02｜ヒアリング</strong>
					<span>商品・お客さま・導線のズレを一緒に整理します。</span>
				</li>
				<li>
					<strong>03｜設計提案</strong>
					<span>コンセプト〜導線〜セールスまでの打ち手を具体化します。</span>
				</li>
				<li>
					<strong>04｜伴走・改善</strong>
					<span>反応と数字を見ながら、続く形へ整えていきます。</span>
				</li>
			</ol>
			<div class="section-cta">
				<a class="btn btn--primary" href="#contact">まずは相談する</a>
			</div>
		</div>
	</section>

	<section class="section faq" id="faq">
		<div class="container container--narrow">
			<h2 class="section-title">FAQ</h2>
			<details class="faq-item">
				<summary>まだ商品が固まっていなくても相談できますか？</summary>
				<p>はい。むしろ「何を売るか」が曖昧な段階から、言葉と立ち位置を整えるところを得意としています。</p>
			</details>
			<details class="faq-item">
				<summary>広告運用だけお願いすることはできますか？</summary>
				<p>可能ですが、成果を出すにはコンセプトや導線との接続が重要です。必要に応じて範囲をご提案します。</p>
			</details>
			<details class="faq-item">
				<summary>地方在住・副業中でも大丈夫ですか？</summary>
				<p>問題ありません。オンラインでの伴走を基本としています。</p>
			</details>
			<details class="faq-item">
				<summary>押し売りや煽りはしませんか？</summary>
				<p>しません。安心と期待を育てて選ばれる設計を大切にしています。</p>
			</details>
		</div>
	</section>

	<section class="section contents" id="contents">
		<div class="container">
			<h2 class="section-title">CONTENTS</h2>
			<p class="section-intro">講座を届けたい人のための、無料コンテンツを準備中です。</p>
			<article class="contents-card">
				<span class="contents-card__badge">近日リリース</span>
				<img
					class="contents-card__image"
					src="<?php echo esc_url( $img . '/contents-kauriyuu.png' ); ?>"
					alt="思わず欲しくなる「買う理由」のみつけ方"
					width="1200"
					height="675"
					loading="lazy"
					decoding="async"
				>
				<div class="contents-card__body">
					<h3>思わず欲しくなる「買う理由」のみつけ方</h3>
					<p>すでに講座をやっているのに売れないと悩む方向けに、お客さまの心の動きから自然と選ばれる「買う理由」を見つける方法をお伝えします。</p>
					<p class="contents-card__note">公開まで少々お待ちください。</p>
				</div>
			</article>
		</div>
	</section>

	<section class="section journal" id="journal">
		<div class="container container--narrow">
			<h2 class="section-title">JOURNAL</h2>
			<ul class="journal-list">
				<?php
				$journal = new WP_Query(
					array(
						'posts_per_page' => 3,
						'post_status'    => 'publish',
					)
				);

				if ( $journal->have_posts() ) :
					while ( $journal->have_posts() ) :
						$journal->the_post();
						?>
						<li>
							<a href="<?php the_permalink(); ?>">
								<time datetime="<?php echo esc_attr( get_the_date( 'Y-m-d' ) ); ?>"><?php echo esc_html( get_the_date( 'Y.m.d' ) ); ?></time>
								<span><?php the_title(); ?></span>
							</a>
						</li>
						<?php
					endwhile;
					wp_reset_postdata();
				else :
					?>
					<li>
						<a href="#contact">
							<time datetime="2026-07-15">2026.07.15</time>
							<span>公式サイトをリニューアルしました</span>
						</a>
					</li>
					<li>
						<a href="#contact">
							<time datetime="2026-07-01">2026.07.01</time>
							<span>HITORI-BIZ｜届け方の記事を公開開始</span>
						</a>
					</li>
					<li>
						<a href="#contact">
							<time datetime="2026-06-20">2026.06.20</time>
							<span>講座ビジネスの伴走相談を再開しています</span>
						</a>
					</li>
				<?php endif; ?>
			</ul>
		</div>
	</section>

	<section class="section contact" id="contact">
		<div class="container container--narrow">
			<h2 class="section-title">CONTACT</h2>
			<p class="contact__lead">
				お問い合わせはこちらのフォームよりご連絡ください。<br>
				通常2日以内に返信させていただいておりますが、稼働状況によりお時間をいただくこともございます。
			</p>

			<div class="myasp-form-wrap">
				<div class="content_title">
					<h2>お問い合わせフォーム</h2>
				</div>

				<div class="content_form">
					<form action="https://my183p.com/p/r/u3psK50n" enctype="multipart/form-data" id="UserItemForm" class="myForm" method="post" accept-charset="utf-8">
						<input type="hidden" name="_method" value="POST">

						<div class="input text input_unit required" data-form-key="Username1">
							<div class="my_column my_left">
								<div class="label_frame">
									<label for="Username1" class="form_input_label required">お名前</label>
								</div>
							</div>
							<div class="my_column my_right">
								<input name="data[User][name1]" id="Username1" value="" class="form_input_input required" type="text">
							</div>
						</div>

						<div class="input text input_unit required" data-form-key="Usermail">
							<div class="my_column my_left">
								<div class="label_frame">
									<label for="Usermail" class="form_input_label required">メールアドレス</label>
								</div>
							</div>
							<div class="my_column my_right">
								<input name="data[User][mail]" id="Usermail" value="" class="required" type="text">
							</div>
						</div>

						<div class="input text input_unit required" data-form-key="Userfree1">
							<div class="my_column my_left">
								<div class="label_frame">
									<label for="Userfree1" class="form_input_label required">お問い合わせ内容</label>
								</div>
							</div>
							<div class="my_column my_right">
								<div class="textarea_frame">
									<textarea name="data[User][free1]" id="Userfree1" class="form_input_input required" cols="30" rows="5"></textarea>
								</div>
							</div>
						</div>

						<p class="privacy-link">
							<a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>" target="_blank" rel="noopener noreferrer">プライバシーポリシーを確認する</a>
						</p>

						<div class="input checkbox input_unit required" data-form-key="Userfree2">
							<div class="my_column my_left">
								<div class="label_frame">
									<label for="Userfree2" class="form_input_label required"></label>
								</div>
							</div>
							<div class="my_column my_right">
								<div class="checkbox_frame">
									<div class="checkbox_input">
										<input name="data[User][free2][]" type="checkbox" id="Userfree2_0" class="required" value="プライバシーポリシーに同意する">
									</div>
									<div class="checkbox_label">
										<label for="Userfree2_0" class="required">プライバシーポリシーに同意する</label>
									</div>
								</div>
							</div>
						</div>

						<div class="submit form_input_submit">
							<input type="submit" value="確認する">
						</div>

						<input type="hidden" id="server_url" value="https://my183p.com/">
						<input type="hidden" name="data[User][referer_form_url]" value="" class="UserRefererFormUrl">
						<input type="hidden" name="data[User][referer_url]" value="" class="UserRefererUrl">

						<script type="text/javascript">
						//<!--
							if (document.referrer.length != 0) {
								if (document.getElementsByClassName("UserRefererUrl")) {
									var user_referer_url = document.getElementsByClassName("UserRefererUrl");
									for (var i = 0; i < user_referer_url.length; i++) {
										user_referer_url[i].value = document.referrer;
									}
								} else if (document.getElementById("UserRefererUrl")) {
									document.getElementById("UserRefererUrl").value = document.referrer;
								}
							}

							if (document.getElementsByClassName("UserRefererFormUrl")) {
								var user_referer_form_url = document.getElementsByClassName("UserRefererFormUrl");
								for (var i = 0; i < user_referer_form_url.length; i++) {
									user_referer_form_url[i].value = location.href;
								}
							} else if (document.getElementById("UserRefererFormUrl")) {
								document.getElementById("UserRefererFormUrl").value = location.href;
							}
						//-->
						</script>
					</form>
				</div>
			</div>
		</div>
	</section>
</main>

<?php
get_footer();
