<?php
/**
 * Dopisuje datę i godzinę dostawy do wszystkich maili WooCommerce (klient +
 * administrator), bez ingerencji w szablony maili.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function bs_delivery_date_output_email_meta( \WC_Order $order, bool $sent_to_admin, bool $plain_text, $email ): void {
	if ( bs_delivery_date_order_is_pickup( $order ) ) {
		return;
	}

	$date = (string) $order->get_meta( '_bs_delivery_date' );

	if ( '' === $date ) {
		return;
	}

	$slot = (string) $order->get_meta( '_bs_delivery_time_slot' );

	$lines   = [];
	$lines[] = 'Data dostawy: ' . $date;
	if ( '' !== $slot ) {
		$config = require __DIR__ . '/../config.php';
		foreach ( $config['time_slots'] as $time_slot ) {
			if ( $time_slot['value'] === $slot ) {
				$lines[] = 'Przedział czasowy: ' . $time_slot['label'];
				break;
			}
		}
	}

	if ( $plain_text ) {
		echo esc_html( implode( "\n", $lines ) ) . "\n\n";
		return;
	}

	echo '<h2>' . esc_html__( 'Termin dostawy', 'bs-plugins' ) . '</h2>';
	echo '<p>' . wp_kses_post( implode( '<br>', array_map( 'esc_html', $lines ) ) ) . '</p>';
}
add_action( 'woocommerce_email_order_meta', 'bs_delivery_date_output_email_meta', 10, 4 );
