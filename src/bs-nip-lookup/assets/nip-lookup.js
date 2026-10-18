/**
 * Autouzupełnianie danych firmy po NIP na checkout. Pola pochodzą z
 * wtyczki Checkout Field Editor (nie z bs-delivery-date) i mają stałe,
 * znane ID — nie trzeba ich szukać po treści etykiety.
 */
/* eslint-env browser */
( function () {
	'use strict';

	const restUrl =
		( window.bsNipLookupConfig && window.bsNipLookupConfig.restUrl ) || '';

	const WAGI_NIP = [ 6, 5, 7, 2, 3, 4, 5, 6, 7 ];

	function normalizujNip( nip ) {
		return nip.replace( /\D/g, '' );
	}

	function czyPoprawnyNip( nip ) {
		const cyfry = normalizujNip( nip );
		if ( cyfry.length !== 10 ) {
			return false;
		}
		let suma = 0;
		for ( let i = 0; i < 9; i++ ) {
			suma += Number( cyfry[ i ] ) * WAGI_NIP[ i ];
		}
		const sumaKontrolna = suma % 11;
		if ( sumaKontrolna === 10 ) {
			return false;
		}
		return sumaKontrolna === Number( cyfry[ 9 ] );
	}

	// Natywny setter + dispatch eventów — te pola też są kontrolowane przez
	// React (Checkout Field Editor renderuje je w bloku Checkout), zwykłe
	// pole.value = x nie zostałoby zauważone.
	function ustawWartosc( pole, wartosc ) {
		const setter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		).set;
		setter.call( pole, wartosc );
		pole.dispatchEvent( new Event( 'input', { bubbles: true } ) );
		pole.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		pole.dispatchEvent( new Event( 'blur', { bubbles: true } ) );
	}

	function pokazKomunikat( poleNip, tekst, rodzaj ) {
		let komunikat = document.getElementById( 'bs-nip-lookup-komunikat' );
		if ( ! komunikat ) {
			komunikat = document.createElement( 'div' );
			komunikat.id = 'bs-nip-lookup-komunikat';
			const wrapper = poleNip.closest( 'div' ) || poleNip.parentNode;
			wrapper.parentNode.insertBefore( komunikat, wrapper.nextSibling );
		}
		komunikat.className =
			'bs-nip-lookup__komunikat bs-nip-lookup__komunikat--' +
			( rodzaj || 'info' );
		komunikat.textContent = tekst;
		komunikat.style.display = tekst ? 'block' : 'none';
	}

	function uzupelnijPola( dane ) {
		const mapa = {
			'section_one-company_name': dane.name,
			'section_one-company_ulica': dane.street,
			'section_one-company_lokal': dane.building_number,
			'section_one-company_postal': dane.postal_code,
			'section_one-company_city': dane.city,
		};
		Object.keys( mapa ).forEach( function ( id ) {
			const pole = document.getElementById( id );
			if ( pole && mapa[ id ] ) {
				ustawWartosc( pole, mapa[ id ] );
			}
		} );
	}

	function wyszukajNip( poleNip ) {
		const nip = normalizujNip( poleNip.value );

		if ( ! czyPoprawnyNip( nip ) ) {
			pokazKomunikat(
				poleNip,
				'Nieprawidłowy numer NIP — sprawdź czy nie ma literówki.',
				'blad'
			);
			return;
		}

		if ( ! restUrl ) {
			return;
		}

		pokazKomunikat( poleNip, 'Szukam danych firmy…', 'info' );

		fetch( restUrl + '?nip=' + encodeURIComponent( nip ) )
			.then( function ( r ) {
				return r.json();
			} )
			.then( function ( data ) {
				if ( data.found ) {
					uzupelnijPola( data );
					pokazKomunikat(
						poleNip,
						'Uzupełniono dane firmy.',
						'sukces'
					);
					setTimeout( function () {
						pokazKomunikat( poleNip, '' );
					}, 3000 );
				} else {
					pokazKomunikat(
						poleNip,
						'Nie znaleziono danych dla tego NIP — uzupełnij ręcznie.',
						'blad'
					);
				}
			} )
			.catch( function () {
				pokazKomunikat(
					poleNip,
					'Nie udało się pobrać danych firmy — uzupełnij ręcznie.',
					'blad'
				);
			} );
	}

	let ostatnioSprawdzonyNip = '';

	function obsluzZmianeNip( e ) {
		if ( ! e.target || e.target.id !== 'section_one-nip_number' ) {
			return;
		}
		const nip = normalizujNip( e.target.value );
		if ( nip.length !== 10 || nip === ostatnioSprawdzonyNip ) {
			return;
		}
		ostatnioSprawdzonyNip = nip;
		wyszukajNip( e.target );
	}

	document.addEventListener( 'input', obsluzZmianeNip );
	document.addEventListener( 'blur', obsluzZmianeNip, true );
} )();
