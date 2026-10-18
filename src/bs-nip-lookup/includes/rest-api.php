<?php
/**
 * Wyszukiwanie danych firmy po NIP — endpoint proxy do publicznego API
 * „Biała lista podatników VAT" (Ministerstwo Finansów, wl-api.mf.gov.pl).
 * Darmowe, bez klucza API. Wywołanie po stronie serwera, żeby uniknąć CORS
 * i nie ujawniać szczegółów wywołania w przeglądarce.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Walidacja sumy kontrolnej NIP (wagi 6,5,7,2,3,4,5,6,7, suma mod 11 = 10. cyfra).
 */
function bs_nip_lookup_is_valid_nip( string $nip ): bool {
	$digits = preg_replace( '/\D/', '', $nip ) ?? '';

	if ( 10 !== strlen( $digits ) ) {
		return false;
	}

	$weights = [ 6, 5, 7, 2, 3, 4, 5, 6, 7 ];
	$sum     = 0;

	for ( $i = 0; $i < 9; $i++ ) {
		$sum += (int) $digits[ $i ] * $weights[ $i ];
	}

	$checksum = $sum % 11;

	if ( 10 === $checksum ) {
		return false;
	}

	return $checksum === (int) $digits[9];
}

/**
 * Adres zwracany przez API to jeden ciąg, np. „UL. PRZYKŁADOWA 12/3, 00-001
 * WARSZAWA" — rozbijamy „na wyczucie" na ulicę, numer, kod pocztowy i
 * miasto. Nie zadziała idealnie dla wszystkich nietypowych formatów, ale
 * pokrywa zdecydowaną większość przypadków.
 *
 * @return array{street: string, building_number: string, postal_code: string, city: string}
 */
function bs_nip_lookup_parse_address( string $address ): array {
	$result = [
		'street'          => '',
		'building_number' => '',
		'postal_code'     => '',
		'city'            => '',
	];

	if ( '' === trim( $address ) ) {
		return $result;
	}

	$parts       = array_map( 'trim', explode( ',', $address ) );
	$street_part = $parts[0] ?? '';
	$city_part   = $parts[1] ?? '';

	if ( preg_match( '/(\d{2}-\d{3})\s+(.+)/u', $city_part, $matches ) ) {
		$result['postal_code'] = $matches[1];
		$result['city']        = trim( $matches[2] );
	}

	$street_part = preg_replace( '/^UL\.\s*/iu', '', $street_part ) ?? $street_part;

	if ( preg_match( '/^(.*\D)\s+([\d\/]+[A-Za-z]?)$/u', trim( $street_part ), $matches ) ) {
		$result['street']          = trim( $matches[1] );
		$result['building_number'] = trim( $matches[2] );
	} else {
		$result['street'] = trim( $street_part );
	}

	return $result;
}

/**
 * @return array{name: string, street: string, building_number: string, postal_code: string, city: string}|null
 */
function bs_nip_lookup_fetch_from_biala_lista( string $nip ): ?array {
	$date = ( new DateTimeImmutable( 'now', wp_timezone() ) )->format( 'Y-m-d' );
	$url  = 'https://wl-api.mf.gov.pl/api/search/nip/' . rawurlencode( $nip ) . '?date=' . $date;

	$response = wp_remote_get( $url, [ 'timeout' => 8 ] );

	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		return null;
	}

	$body    = json_decode( wp_remote_retrieve_body( $response ), true );
	$subject = $body['result']['subject'] ?? null;

	if ( ! is_array( $subject ) ) {
		return null;
	}

	$address = (string) ( $subject['workingAddress'] ?? $subject['residenceAddress'] ?? '' );
	$parsed  = bs_nip_lookup_parse_address( $address );

	return array_merge(
		[ 'name' => (string) ( $subject['name'] ?? '' ) ],
		$parsed
	);
}

function bs_nip_lookup_register_rest_routes(): void {
	register_rest_route(
		'bs-nip-lookup/v1',
		'/search',
		[
			'methods'             => 'GET',
			'callback'            => 'bs_nip_lookup_rest_search',
			'permission_callback' => '__return_true',
			'args'                => [
				'nip' => [
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				],
			],
		]
	);
}
add_action( 'rest_api_init', 'bs_nip_lookup_register_rest_routes' );

function bs_nip_lookup_rest_search( WP_REST_Request $request ): WP_REST_Response {
	$nip = (string) $request->get_param( 'nip' );

	if ( ! bs_nip_lookup_is_valid_nip( $nip ) ) {
		return new WP_REST_Response( [ 'found' => false, 'reason' => 'invalid_nip' ] );
	}

	$digits = preg_replace( '/\D/', '', $nip ) ?? '';
	$data   = bs_nip_lookup_fetch_from_biala_lista( $digits );

	if ( ! $data ) {
		return new WP_REST_Response( [ 'found' => false, 'reason' => 'not_found' ] );
	}

	return new WP_REST_Response( array_merge( [ 'found' => true ], $data ) );
}
