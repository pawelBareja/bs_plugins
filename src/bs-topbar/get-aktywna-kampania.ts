import type { BsTopbarKampania } from './types';

/**
 * Wybiera kampanię aktywną dla danego dnia (format 'MM-DD').
 * Kampanie z ustawionym zakresem dat mają priorytet i są sprawdzane
 * w kolejności na liście — pierwsza dopasowana wygrywa (obsługuje też
 * zakresy przechodzące przez Nowy Rok, np. 12-20 → 01-06).
 * Kampania bez dat (pierwsza taka na liście) jest kampanią domyślną,
 * widoczną gdy żadna inna nie jest aktywna.
 *
 * @param kampanie Lista kampanii bloku bs-topbar.
 * @param dzisiaj  Dzisiejsza data w formacie 'MM-DD'.
 */
export function getAktywnaKampania(
	kampanie: BsTopbarKampania[],
	dzisiaj: string
): BsTopbarKampania | null {
	let domyslna: BsTopbarKampania | null = null;

	for ( const kampania of kampanie ) {
		const od = kampania.dataOd.trim();
		const dataDo = kampania.dataDo.trim();

		if ( ! od || ! dataDo ) {
			if ( ! domyslna ) {
				domyslna = kampania;
			}
			continue;
		}

		const wZakresie =
			od <= dataDo
				? dzisiaj >= od && dzisiaj <= dataDo
				: dzisiaj >= od || dzisiaj <= dataDo;

		if ( wZakresie ) {
			return kampania;
		}
	}

	return domyslna;
}

/**
 * Dzisiejsza data w formacie 'MM-DD' (lokalny czas przeglądarki).
 */
export function dzisiajMmDd(): string {
	const teraz = new Date();
	const miesiac = String( teraz.getMonth() + 1 ).padStart( 2, '0' );
	const dzien = String( teraz.getDate() ).padStart( 2, '0' );
	return `${ miesiac }-${ dzien }`;
}
