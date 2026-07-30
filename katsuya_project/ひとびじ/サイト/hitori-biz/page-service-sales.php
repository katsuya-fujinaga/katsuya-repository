<?php
/**
 * Template Name: SERVICE｜やさしいセールス設計
 * Template Post Type: page
 *
 * @package Hitori_Biz
 */

get_header();

get_template_part(
	'template-parts/service-detail',
	null,
	array(
		'number'   => '03',
		'title'    => 'やさしいセールス設計',
		'lead'     => "煽らず、押し売りせず。\n安心と期待を育てて、選ばれる流れを仕組み化します。",
		'image'    => 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		'sections' => array(
			array(
				'heading' => 'こんな状態に向いています',
				'body'    => "・売ろうとすると気後れする\n・説明会や個別相談で、伝える順番が毎回ブレる\n・いい反応はあるのに、成約や次の一歩につながらない",
			),
			array(
				'heading' => 'ここでやること',
				'body'    => "セミナー／LIVE／個別相談の流れ、ヒアリング項目、よくある不安への答え方を型にします。\n「お願いする」のではなく、「納得して進める」会話の設計を一緒につくります。",
			),
			array(
				'heading' => '得られること',
				'body'    => "自分らしさを残したまま、再現できるセールスの型ができる。\n担当が変わっても、安心感のある案内が続けられます。",
			),
		),
	)
);

get_footer();
