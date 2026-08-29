<?php
/**
 * MyASP contact form
 *
 * @package Hitori_Biz
 */
?>
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
