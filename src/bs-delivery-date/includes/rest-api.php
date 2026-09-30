<?php
/**
 * Publiczny endpoint dostępności dat — zasila kalendarz w checkout.
 * Tylko odczyt, bez zapisu, więc bez wymogu uprawnień.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function bs_delivery_date_register_rest_routes(): void {
	register_rest_route(
		'bs-delivery-date/v1',
		'/availability',
		[
			'methods'             => 'GET',
			'callback'            => 'bs_delivery_date_rest_get_availability',
			'permission_callback' => '__return_true',
			'args'                => [
				'postal_code' => [
					'type'              => 'string',
					'default'           => '',
					'sanitize_callback' => 'sanitize_text_field',
				],
			],
		]
	);
}
add_action( 'rest_api_init', 'bs_delivery_date_register_rest_routes' );

function bs_delivery_date_rest_get_availability( WP_REST_Request $request ): WP_REST_Response {
	$config      = require __DIR__ . '/../config.php';
	$postal_code = (string) $request->get_param( 'postal_code' );
	$now         = new DateTimeImmutable( 'now', wp_timezone() );

	$allowed = bs_delivery_date_is_postal_code_allowed( $postal_code, $config );

	return new WP_REST_Response(
		[
			'postal_code_allowed'   => $allowed,
			'available_dates'       => $allowed
				? bs_delivery_date_get_available_dates( $postal_code, $now, $config )
				: [],
			'today'                 => $now->format( 'Y-m-d' ),
			'available_slots_today' => bs_delivery_date_get_available_slots_for_date(
				$now->format( 'Y-m-d' ),
				$now,
				$config
			),
		]
	);
}
