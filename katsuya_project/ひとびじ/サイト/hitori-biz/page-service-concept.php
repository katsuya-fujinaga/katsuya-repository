<?php
/**
 * Template Name: SERVICE｜コンセプト設計
 * Template Post Type: page
 *
 * @package Hitori_Biz
 */

get_header();

get_template_part(
	'template-parts/service-detail',
	null,
	array(
		'number'   => '01',
		'title'    => 'コンセプト設計',
		'lead'     => "好きなことはある。でも「何を売ればいいか」が言葉にならない。\nそのズレを、一言で伝わる立ち位置に整えます。",
		'image'    => 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		'sections' => array(
			array(
				'heading' => 'こんな状態に向いています',
				'body'    => "・やりたいことはあるのに、誰向けかが広がってしまう\n・発信しても「いいですね」で止まり、相談につながらない\n・他の人と同じに見えて、価格や選ばれる理由が弱い",
			),
			array(
				'heading' => 'ここでやること',
				'body'    => "経験・想い・商品を棚卸しし、「誰の、どんな悩みを、どう変えるか」を一文に落とします。\n比較されない言葉、選ばれる理由、講座やサービスの核を一緒に設計します。",
			),
			array(
				'heading' => '得られること',
				'body'    => "自分の立ち位置がはっきりし、LP・発信・セールスの土台が揃います。\n「何を伝えればいいか」で迷う時間が減り、届け方の判断が早くなります。",
			),
		),
	)
);

get_footer();
