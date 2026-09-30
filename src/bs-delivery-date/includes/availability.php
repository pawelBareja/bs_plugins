<?php
/**
 * Czyste funkcje liczące dostępność kalendarza dostawy.
 *
 * Bez zależności od WordPress/WooCommerce poza samym wywołaniem — jedno
 * źródło prawdy używane zarówno przez REST endpoint (co pokazać w
 * kalendarzu), jak i przez walidację server-side przy składaniu zamówienia.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Zostawia same cyfry z kodu pocztowego (obsługuje „00-001" i „00001").
 */
function bs_delivery_date_normalize_postal_code( string $postal_code ): string {
	return preg_replace( '/\D/', '', $postal_code ) ?? '';
}

/**
 * Czy kod pocztowy mieści się w obsługiwanych prefiksach (Warszawa).
 */
function bs_delivery_date_is_postal_code_allowed( string $postal_code, array $config ): bool {
	$digits = bs_delivery_date_normalize_postal_code( $postal_code );

	if ( strlen( $digits ) < 2 ) {
		return false;
	}

	$prefix = substr( $digits, 0, 2 );

	return in_array( $prefix, $config['allowed_postal_prefixes'], true );
}

/**
 * Najwcześniejsza dostępna data z uwzględnieniem cutoffu — dziś, jeśli jesteśmy
 * przed godziną graniczną, w przeciwnym razie jutro. Nie uwzględnia jeszcze
 * wykluczonych dni tygodnia ani blocked_dates (patrz bs_delivery_date_get_available_dates).
 */
function bs_delivery_date_get_earliest_date( DateTimeImmutable $now, array $config ): DateTimeImmutable {
	[ $cutoff_hour, $cutoff_minute ] = array_map( 'intval', explode( ':', $config['cutoff_time'] ) );
	$today_cutoff = $now->setTime( $cutoff_hour, $cutoff_minute );

	$earliest = $now >= $today_cutoff
		? $now->modify( '+1 day' )
		: $now;

	return $earliest->setTime( 0, 0, 0 );
}

function bs_delivery_date_is_weekday_excluded( DateTimeImmutable $date, array $config ): bool {
	return in_array( (int) $date->format( 'w' ), $config['excluded_weekdays'], true );
}

function bs_delivery_date_is_date_blocked( DateTimeImmutable $date, array $config ): bool {
	return in_array( $date->format( 'Y-m-d' ), $config['blocked_dates'], true );
}

/**
 * Lista dostępnych dat ('Y-m-d') dla podanego kodu pocztowego i chwili obecnej.
 * Pusta tablica, jeśli kod pocztowy nieprawidłowy/spoza obsługiwanego obszaru.
 *
 * @return string[]
 */
function bs_delivery_date_get_available_dates( string $postal_code, DateTimeImmutable $now, array $config ): array {
	if ( ! bs_delivery_date_is_postal_code_allowed( $postal_code, $config ) ) {
		return [];
	}

	$dates      = [];
	$cursor     = bs_delivery_date_get_earliest_date( $now, $config );
	$days_ahead = max( 1, (int) $config['days_ahead'] );

	for ( $i = 0; $i < $days_ahead; $i++ ) {
		$candidate = $cursor->modify( "+{$i} day" );

		if ( bs_delivery_date_is_weekday_excluded( $candidate, $config ) ) {
			continue;
		}

		if ( bs_delivery_date_is_date_blocked( $candidate, $config ) ) {
			continue;
		}

		$dates[] = $candidate->format( 'Y-m-d' );
	}

	return $dates;
}

/**
 * Server-side sprawdzenie konkretnej daty — używane przy walidacji zamówienia,
 * żeby nie dało się przepuścić daty spoza dozwolonego zbioru (np. przez
 * bezpośrednie wywołanie Store API z pominięciem UI).
 */
function bs_delivery_date_is_date_available( string $date, string $postal_code, DateTimeImmutable $now, array $config ): bool {
	return in_array( $date, bs_delivery_date_get_available_dates( $postal_code, $now, $config ), true );
}

function bs_delivery_date_is_slot_valid( string $slot_value, array $config ): bool {
	foreach ( $config['time_slots'] as $slot ) {
		if ( $slot['value'] === $slot_value ) {
			return true;
		}
	}

	return false;
}

/**
 * Sloty czasowe dostępne dla konkretnej daty. Dla dzisiejszej daty
 * odfiltrowuje sloty zaczynające się za mniej niż `slot_buffer_hours` od
 * teraz (np. o 12:57 slot 10-13 nie jest już wybieralny). Dla pozostałych
 * dat zwraca wszystkie skonfigurowane sloty.
 *
 * @return string[]
 */
function bs_delivery_date_get_available_slots_for_date( string $date, DateTimeImmutable $now, array $config ): array {
	$all_slots = array_map(
		static function ( array $slot ): string {
			return $slot['value'];
		},
		$config['time_slots']
	);

	if ( $date !== $now->format( 'Y-m-d' ) ) {
		return $all_slots;
	}

	$buffer_hours = (int) ( $config['slot_buffer_hours'] ?? 0 );
	$prog         = $now->modify( "+{$buffer_hours} hours" );

	$dostepne = [];
	foreach ( $config['time_slots'] as $slot ) {
		$start_hour = (int) explode( '-', $slot['value'] )[0];
		$slot_start = $now->setTime( $start_hour, 0 );

		if ( $slot_start >= $prog ) {
			$dostepne[] = $slot['value'];
		}
	}

	return $dostepne;
}

function bs_delivery_date_is_slot_valid_for_date( string $slot_value, string $date, DateTimeImmutable $now, array $config ): bool {
	return in_array( $slot_value, bs_delivery_date_get_available_slots_for_date( $date, $now, $config ), true );
}
