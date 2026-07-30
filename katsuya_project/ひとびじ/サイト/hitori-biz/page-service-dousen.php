<?php
/**
 * Template Name: SERVICE｜導線・LP・広告
 * Template Post Type: page
 *
 * @package Hitori_Biz
 */

get_header();

get_template_part(
	'template-parts/service-detail',
	null,
	array(
		'number'   => '02',
		'title'    => '導線・LP・広告',
		'lead'     => "出会ってから「お願いしたい」までの道筋を、\n文章と画面と広告でつなぎます。",
		'image'    => 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		'sections' => array(
			array(
				'heading' => 'こんな状態に向いています',
				'body'    => "・LPや広告は出しているのに、申込みや相談まで届かない\n・ページごとに言っていることがちぐはぐ\n・集客はあるのに、次に何を見せるかが決まっていない",
			),
			array(
				'heading' => 'ここでやること',
				'body'    => "入口から個別相談・申込みまでの流れを設計し、LP・登録ページ・メール・広告の役割を分けてつなぎます。\n見た目だけでなく、「読んで安心し、次に進みたくなる」文章と構成まで整えます。",
			),
			array(
				'heading' => '得られること',
				'body'    => "お客さまが迷わず進める道ができる。\n広告費をかけても、反応の理由が見える状態になります。",
			),
		),
	)
);

get_footer();
