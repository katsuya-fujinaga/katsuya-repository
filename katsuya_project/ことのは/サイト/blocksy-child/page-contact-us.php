<?php
/**
 * Contact page
 *
 * @package Kotonoha
 */

get_header();
$brand = kotonoha_brand();
?>
<main class="article contact-page">
	<p class="mag-kicker article__kicker">CONTACT</p>
	<h1 class="article__title"><?php echo esc_html( $brand['desc'] ); ?></h1>
	<div class="article__body">
		<p class="contact-lead">好きや経験はある。足りないのは、届ける順番だけだった。</p>

		<div class="myasp-form-wrap">
			<div class="content_title">
				<h2>お問い合わせ</h2>
			</div>
			<div class="content_form">
				<form action="https://kotonoha-edit.com/p/r/nyqCVfBi" enctype="multipart/form-data" id="UserItemForm" class="myForm" method="post" accept-charset="utf-8">
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
							<input name="data[User][mail]" id="Usermail" value="" class="form_input_input required" type="text">
						</div>
					</div>

					<div class="input text input_unit required" data-form-key="Userfree2">
						<div class="my_column my_left">
							<div class="label_frame">
								<label for="Userfree2" class="form_input_label required">お問い合わせ内容</label>
							</div>
						</div>
						<div class="my_column my_right">
							<div class="textarea_frame">
								<textarea name="data[User][free2]" id="Userfree2" class="form_input_input required" cols="30" rows="5"></textarea>
							</div>
						</div>
					</div>

					<p class="privacy-link">
						<a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">プライバシーポリシーを確認する</a>
					</p>

					<div class="input checkbox input_unit required" data-form-key="Userfree4">
						<div class="my_column my_left">
							<div class="label_frame">
								<label for="Userfree4" class="form_input_label required"></label>
							</div>
						</div>
						<div class="my_column my_right">
							<div class="checkbox_frame">
								<div class="checkbox_input">
									<input name="data[User][free4][]" type="checkbox" id="Userfree4_0" class="required" value="プライバシーポリシーに同意する">
								</div>
								<div class="checkbox_label">
									<label for="Userfree4_0" class="required">プライバシーポリシーに同意する</label>
								</div>
							</div>
						</div>
					</div>

					<div class="submit form_input_submit">
						<input type="submit" value="確認する">
					</div>

					<input type="hidden" id="server_url" value="https://kotonoha-edit.com/">
					<input type="hidden" name="data[User][referer_form_url]" value="" class="UserRefererFormUrl">
					<input type="hidden" name="data[User][referer_url]" value="" class="UserRefererUrl">
				</form>
			</div>
		</div>
	</div>
</main>
<script>
if (document.referrer.length != 0) {
	document.querySelectorAll(".UserRefererUrl").forEach(function (el) { el.value = document.referrer; });
}
document.querySelectorAll(".UserRefererFormUrl").forEach(function (el) { el.value = location.href; });
</script>
<?php
get_footer();
