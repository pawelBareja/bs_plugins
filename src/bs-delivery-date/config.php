<?php
/**
 * Konfiguracja kalendarza dostawy — edycja ręczna, bez ekranu w adminie.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return [
	'time_slots'              => [
		[ 'label' => '10:00 - 13:00', 'value' => '10-13' ],
		[ 'label' => '13:00 - 16:00', 'value' => '13-16' ],
		[ 'label' => '16:00 - 19:00', 'value' => '16-19' ],
	],
	'cutoff_time'              => '15:00',
	// Dla dnia dzisiejszego: ile godzin bufora przed startem slotu musi
	// zostać, żeby slot był jeszcze wybieralny (np. o 12:57 slot 10-13 jest
	// już praktycznie nie do zrealizowania).
	'slot_buffer_hours'        => 3,
	// date('w'): 0 = niedziela, 6 = sobota. Blokowane zawsze, w całym kalendarzu.
	'excluded_weekdays'        => [ 0, 6 ],
	'allowed_postal_prefixes'  => [ '01', '02', '03', '04' ],
	'blocked_dates'            => [
		// Format: 'YYYY-MM-DD'. Święta, urlopy, przeciążone dni.
	],
	// Ile dni do przodu pokazujemy w kalendarzu.
	'days_ahead'               => 30,
];
