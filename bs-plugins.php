<?php
/**
 * Plugin Name: BS Plugins
 * Description: Bloki Gutenberg
 * Version: 1.0.0
 * Author: barejastudio.com
 * Text Domain: bs-plugins
 * Requires at least: 6.4
 * Requires PHP: 8.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function bs_block_sekcja_style( array $attributes ): string {
	$pt = (int) ( $attributes['paddingGora'] ?? 0 );
	$pb = (int) ( $attributes['paddingDol'] ?? 0 );
	$pi = (int) ( $attributes['paddingBoki'] ?? 0 );
	$bg = $attributes['kolorTlaSekcji'] ?? '';
	$parts = [];
	if ( $pt || $pb || $pi ) {
		$parts[] = "padding: {$pt}px {$pi}px {$pb}px {$pi}px";
	}
	if ( $bg ) {
		$parts[] = 'background-color: ' . esc_attr( $bg );
	}
	return implode( '; ', $parts );
}

function bs_plugins_register_blocks(): void {
	$blocks = [
		'header',
		'grid',
		'bs-button',
		'bs-hero',
		'bs-hero-home',
		'bs-features',
		'bs-icons-bar',
		'bs-faq',
		'bs-produkty-slider',
		'bs-topbar',
		'bs-icon',
		'bs-karty',
		'bs-usp',
	];

	foreach ( $blocks as $block ) {
		register_block_type( __DIR__ . '/build/' . $block );
	}
}
add_action( 'init', 'bs_plugins_register_blocks' );

// =============================================================================
// Belka bs-topbar nad nagłówkiem (motywy bez wiersza nagłówka, np. Kadence Free)
// =============================================================================

/**
 * Szuka bloku bs-plugins/bs-topbar w synchronizowanym wzorcu (Reusable Block)
 * o tytule „BS Topbar”. Wzorzec tworzy się raz w Edytorze stron
 * (Wzorce → Dodaj nowy → tytuł „BS Topbar” → wstaw blok BS Topbar i skonfiguruj kampanie).
 */
function bs_plugins_find_topbar_block(): ?array {
	$query = new WP_Query( [
		'post_type'      => 'wp_block',
		'title'          => 'BS Topbar',
		'posts_per_page' => 1,
		'post_status'    => 'publish',
	] );

	if ( ! $query->have_posts() ) {
		return null;
	}

	$blocks = parse_blocks( $query->posts[0]->post_content );

	foreach ( $blocks as $block ) {
		if ( 'bs-plugins/bs-topbar' === ( $block['blockName'] ?? '' ) ) {
			return $block;
		}
	}

	return null;
}

/**
 * Renderuje belkę bs-topbar na samym początku <body> — nad nagłówkiem motywu.
 * Jeśli motyw udostępnia szablon nagłówka (np. Twenty Twenty-Five w Edytorze
 * stron), blok można wstawić tam bezpośrednio i ten hook nie jest potrzebny.
 */
function bs_plugins_render_topbar(): void {
	$block = bs_plugins_find_topbar_block();

	if ( $block ) {
		echo render_block( $block );
	}
}
add_action( 'wp_body_open', 'bs_plugins_render_topbar' );

function bs_plugins_enqueue_assets(): void {
	if ( file_exists( __DIR__ . '/build/global.css' ) ) {
		wp_enqueue_style(
			'bs-plugins-global',
			plugins_url( 'build/global.css', __FILE__ ),
			[],
			filemtime( __DIR__ . '/build/global.css' )
		);
	}

	if ( file_exists( __DIR__ . '/build/global-view.js' ) ) {
		wp_enqueue_script(
			'bs-plugins-global-view',
			plugins_url( 'build/global-view.js', __FILE__ ),
			[],
			filemtime( __DIR__ . '/build/global-view.js' ),
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'bs_plugins_enqueue_assets' );
