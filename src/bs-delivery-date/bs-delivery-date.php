<?php
/**
 * Bootstrap: Kalendarz dostawy w checkout WooCommerce (blokowy checkout).
 *
 * Zamiennik wtyczki Order Delivery Date — pola rejestrowane przez natywne
 * Additional Checkout Fields API, wzbogacone o zawsze widoczny inline
 * kalendarz (jQuery UI Datepicker) przez checkout-enhance.js.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BS_DELIVERY_DATE_DIR', __DIR__ );
define( 'BS_DELIVERY_DATE_URL', plugins_url( 'build/bs-delivery-date', dirname( __DIR__, 2 ) . '/bs-plugins.php' ) );

function bs_delivery_date_init(): void {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}

	require_once BS_DELIVERY_DATE_DIR . '/includes/availability.php';
	require_once BS_DELIVERY_DATE_DIR . '/includes/checkout-fields.php';
	require_once BS_DELIVERY_DATE_DIR . '/includes/rest-api.php';
	require_once BS_DELIVERY_DATE_DIR . '/includes/validation.php';
	require_once BS_DELIVERY_DATE_DIR . '/includes/emails.php';
}
add_action( 'plugins_loaded', 'bs_delivery_date_init' );

function bs_delivery_date_enqueue_checkout_assets(): void {
	if ( ! function_exists( 'is_checkout' ) || ! is_checkout() ) {
		return;
	}

	wp_enqueue_script( 'jquery-ui-datepicker' );

	wp_enqueue_script(
		'bs-delivery-date-checkout-enhance',
		BS_DELIVERY_DATE_URL . '/assets/checkout-enhance.js',
		[ 'jquery', 'jquery-ui-datepicker' ],
		filemtime( BS_DELIVERY_DATE_DIR . '/assets/checkout-enhance.js' ),
		true
	);

	wp_enqueue_style(
		'bs-delivery-date-checkout-enhance',
		BS_DELIVERY_DATE_URL . '/assets/checkout-enhance.css',
		[],
		filemtime( BS_DELIVERY_DATE_DIR . '/assets/checkout-enhance.css' )
	);

	$config = require BS_DELIVERY_DATE_DIR . '/config.php';

	wp_localize_script(
		'bs-delivery-date-checkout-enhance',
		'bsDeliveryDateConfig',
		[
			'restUrl'    => esc_url_raw( rest_url( 'bs-delivery-date/v1/availability' ) ),
			'cutoffTime' => $config['cutoff_time'],
		]
	);
}
add_action( 'wp_enqueue_scripts', 'bs_delivery_date_enqueue_checkout_assets' );
