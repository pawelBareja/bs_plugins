<?php
/**
 * Walidacja server-side przy składaniu zamówienia — jedyne miejsce, które
 * faktycznie blokuje finalizację niezależnie od tego, czy JS w przeglądarce
 * zadziałał. WooCommerce sam sprawdza, czy pole „Data dostawy" jest
 * niepuste (required: true przy rejestracji) — tu dodatkowo sprawdzamy,
 * czy wybrana wartość to faktycznie dostępna data (nie dowolny tekst).
 *
 * Wartości czytamy z $request (payload wysłany przez przeglądarkę), NIE z
 * $order — sprawdzone na żywo, że w momencie odpalenia tego hooka $order
 * jeszcze nie ma zapisanych wartości pól z Additional Checkout Fields API
 * ani adresu wysyłki, co powodowało fałszywe blokady mimo poprawnie
 * wybranej daty.
 *
 * Ten sam hook odpala się też przy częściowych aktualizacjach (np.
 * automatyczne przeliczenie sum po zmianie pola, request z
 * ?__experimental_calc_totals=true) — nie tylko przy faktycznym złożeniu
 * zamówienia. Rozpoznajemy prawdziwą próbę złożenia po obecności
 * payment_method, którego częściowe aktualizacje nie wysyłają.
 *
 * UWAGA: RouteException to udokumentowany, stabilny sposób blokowania
 * checkoutu w WooCommerce Blocks Store API — nie mieliśmy możliwości
 * zweryfikować dokładnej nazwy klasy na żywej instalacji. Jeśli po
 * wdrożeniu próba złożenia zamówienia z niepoprawną datą kończy się
 * fatalnym błędem 500 zamiast czytelnego komunikatu — to pierwsze miejsce
 * do sprawdzenia.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function bs_delivery_date_block_checkout( string $message ): void {
	if ( class_exists( '\Automattic\WooCommerce\StoreApi\Exceptions\RouteException' ) ) {
		throw new \Automattic\WooCommerce\StoreApi\Exceptions\RouteException(
			'bs_delivery_date_validation',
			$message,
			400
		);
	}

	error_log( 'bs-delivery-date: RouteException class not found, walidacja pominięta: ' . $message );
}

function bs_delivery_date_validate_and_save( \WC_Order $order, \WP_REST_Request $request ): void {
	if ( empty( $request->get_param( 'payment_method' ) ) ) {
		return;
	}

	if ( bs_delivery_date_order_is_pickup( $order ) ) {
		return;
	}

	$config = require __DIR__ . '/../config.php';
	$now    = new DateTimeImmutable( 'now', wp_timezone() );

	$additional_fields = (array) $request->get_param( 'additional_fields' );
	$shipping_address   = (array) $request->get_param( 'shipping_address' );

	$date = (string) ( $additional_fields['bs-delivery-date/data-dostawy'] ?? '' );
	$slot = (string) ( $additional_fields['bs-delivery-date/przedzial-czasowy'] ?? '' );

	// Nazwa klucza kodu pocztowego w shipping_address nie została
	// zweryfikowana na żywo — sprawdzamy kilka prawdopodobnych wariantów.
	$postal_code = (string) (
		$shipping_address['postcode']
		?? $shipping_address['postal_code']
		?? ''
	);

	if ( '' === $date || ! bs_delivery_date_is_date_available( $date, $postal_code, $now, $config ) ) {
		error_log(
			'bs-delivery-date: blokada — date=' . $date .
			' postal_code=' . $postal_code .
			' shipping_address_keys=' . implode( ',', array_keys( $shipping_address ) ) .
			' additional_fields=' . wp_json_encode( $additional_fields )
		);
		bs_delivery_date_block_checkout( 'Wybierz dostępną datę dostawy.' );
		return;
	}

	if ( '' !== $slot && ! bs_delivery_date_is_slot_valid_for_date( $slot, $date, $now, $config ) ) {
		bs_delivery_date_block_checkout( 'Wybrana godzina doręczenia jest już niedostępna — wybierz inny przedział.' );
		return;
	}

	// Zapisujemy pod własnymi kluczami meta — niezależnie od tego, czy i kiedy
	// WooCommerce sam zapisze wartości zarejestrowanych pól na zamówieniu
	// (niepewne, patrz komentarz wyżej), mamy pewność że dane tu trafią i
	// emails.php będzie miał skąd je odczytać.
	$order->update_meta_data( '_bs_delivery_date', $date );
	$order->update_meta_data( '_bs_delivery_time_slot', $slot );
}
add_action( 'woocommerce_store_api_checkout_update_order_from_request', 'bs_delivery_date_validate_and_save', 10, 2 );
