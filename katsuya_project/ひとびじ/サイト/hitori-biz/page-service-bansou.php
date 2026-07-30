<?php
/**
 * Template Name: SERVICE｜伴走・改善
 * Template Post Type: page
 *
 * @package Hitori_Biz
 */

get_header();

get_template_part(
	'template-parts/service-detail',
	null,
	array(
		'number'   => '04',
		'title'    => '伴走・改善',
		'lead'     => "作って終わりにしない。\n数字と反応を見ながら、続く形へ整えていきます。",
		'image'    => 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
		'sections' => array(
			array(
				'heading' => 'こんな状態に向いています',
				'body'    => "・一度つくった導線が、そのまま放置になっている\n・数字は見ているが、次に何を直すか決められない\n・講座運営・広告・セールスを一人で抱えすぎている",
			),
			array(
				'heading' => 'ここでやること',
				'body'    => "反応・申込み・相談・成約などの数字を眺め、どこが詰まっているかを一緒に特定します。\nLPの直し方、配信の順番、説明会の改善、運用の進め方まで伴走します。",
			),
			array(
				'heading' => '得られること',
				'body'    => "「感覚で頑張る」から「見て整える」へ移れる。\n一人で抱えず、改善が回り続ける状態をつくります。",
			),
		),
	)
);

get_footer();
