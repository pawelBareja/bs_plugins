<?php
/**
 * Bootstrap: autouzupełnianie danych firmy po NIP w checkout WooCommerce.
 * Wzbogaca pola z wtyczki Checkout Field Editor (section_one-*), nie jest
 * z nimi powiązane kodowo poza znajomością ich ID.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BS_NIP_LOOKUP_DIR', __DIR__ );
define( 'BS_NIP_LOOKUP_URL', plugins_url( 'build/bs-nip-lookup', dirname( __DIR__, 2 ) . '/bs-plugins.php' ) );

function bs_nip_lookup_init(): void {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}

	require_once BS_NIP_LOOKUP_DIR . '/includes/rest-api.php';
}
add_action( 'plugins_loaded', 'bs_nip_lookup_init' );

function bs_nip_lookup_enqueue_checkout_assets(): void {
	if ( ! function_exists( 'is_checkout' ) || ! is_checkout() ) {
		return;
	}

	wp_enqueue_script(
		'bs-nip-lookup',
		BS_NIP_LOOKUP_URL . '/assets/nip-lookup.js',
		[],
		filemtime( BS_NIP_LOOKUP_DIR . '/assets/nip-lookup.js' ),
		true
	);

	wp_enqueue_style(
		'bs-nip-lookup',
		BS_NIP_LOOKUP_URL . '/assets/nip-lookup.css',
		[],
		filemtime( BS_NIP_LOOKUP_DIR . '/assets/nip-lookup.css' )
	);

	wp_localize_script(
		'bs-nip-lookup',
		'bsNipLookupConfig',
		[
			'restUrl' => esc_url_raw( rest_url( 'bs-nip-lookup/v1/search' ) ),
		]
	);
}
add_action( 'wp_enqueue_scripts', 'bs_nip_lookup_enqueue_checkout_assets' );
