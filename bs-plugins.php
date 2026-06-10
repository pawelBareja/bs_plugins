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
	];

	foreach ( $blocks as $block ) {
		register_block_type( __DIR__ . '/build/' . $block );
	}
}
add_action( 'init', 'bs_plugins_register_blocks' );
