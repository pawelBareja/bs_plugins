<?php
/**
 * Rejestracja pól „Data dostawy" i „Przedział czasowy" przez natywne
 * Additional Checkout Fields API — trafiają do bloku „Additional information"
 * w checkout, automatycznie do zamówienia i (przez emails.php) do maili.
 *
 * UWAGA: próbowaliśmy zastąpić to klasycznymi hookami WooCommerce
 * (woocommerce_after_order_notes), wzorując się na kodzie wtyczki Order
 * Delivery Date — okazało się, że pola w ogóle przestają się renderować
 * na blokowym checkout tego sklepu (hipoteza o warstwie kompatybilności
 * była błędna). Wracamy do tego mechanizmu, bo jest jedynym potwierdzonym
 * na żywo jako renderujący się poprawnie.
 *
 * Wartość pola „Data dostawy" wypełniana jest programowo przez kalendarz
 * w checkout-enhance.js, nie wpisywana ręcznie — dlatego zwykły typ 'text'.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wykrywanie ścieżki „Odbiór osobisty" po metodzie wysyłki zapisanej na
 * zamówieniu — sprawdzone dwa możliwe method_id rdzenia WooCommerce.
 */
function bs_delivery_date_order_is_pickup( \WC_Order $order ): bool {
	foreach ( $order->get_items( 'shipping' ) as $item ) {
		if ( ! $item instanceof \WC_Order_Item_Shipping ) {
			continue;
		}
		if ( in_array( $item->get_method_id(), [ 'local_pickup', 'pickup_location' ], true ) ) {
			return true;
		}
	}
	return false;
}

function bs_delivery_date_register_checkout_fields(): void {
	if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
		return;
	}

	$config = require __DIR__ . '/../config.php';

	// required: false celowo — pole jest wymagane tylko dla „Dostawy", nie dla
	// „Odbioru osobistego", a WooCommerce nie pozwala uzależnić required od
	// wybranej metody wysyłki na etapie rejestracji. Wymagalność egzekwujemy
	// warunkowo sami w validation.php (pomija sprawdzanie dla odbioru osobistego).
	woocommerce_register_additional_checkout_field(
		[
			'id'       => 'bs-delivery-date/data-dostawy',
			'label'    => 'Data dostawy',
			'location' => 'additional',
			'type'     => 'text',
			'required' => false,
		]
	);

	woocommerce_register_additional_checkout_field(
		[
			'id'       => 'bs-delivery-date/przedzial-czasowy',
			'label'    => 'Przedział czasowy',
			'location' => 'additional',
			'type'     => 'select',
			'required' => false,
			'options'  => array_map(
				static function ( array $slot ): array {
					return [ 'value' => $slot['value'], 'label' => $slot['label'] ];
				},
				$config['time_slots']
			),
		]
	);
}
add_action( 'woocommerce_init', 'bs_delivery_date_register_checkout_fields' );
