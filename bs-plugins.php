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

function bs_plugins_register_blocks(): void {
	$blocks = [
		'header',
		'grid',
		'bs-button',
		'bs-hero',
		'bs-features',
	];

	foreach ( $blocks as $block ) {
		register_block_type( __DIR__ . '/build/' . $block );
	}
}
add_action( 'init', 'bs_plugins_register_blocks' );

function bs_plugins_enqueue_assets(): void {
	if ( file_exists( __DIR__ . '/build/global.css' ) ) {
		wp_enqueue_style(
			'bs-plugins-global',
			plugins_url( 'build/global.css', __FILE__ ),
			[],
			filemtime( __DIR__ . '/build/global.css' )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'bs_plugins_enqueue_assets' );
