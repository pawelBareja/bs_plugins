/**
 * Wzbogacenie natywnych pól checkoutu (zarejestrowanych przez Additional
 * Checkout Fields API) o kalendarz dostawy widoczny cały czas inline
 * (jQuery UI Datepicker w trybie inline, nie popup po kliknięciu).
 *
 * UWAGA: pola „Data dostawy" / „Przedział czasowy" znajdywane są po TREŚCI
 * ETYKIETY (label), nie po ID — dokładny format ID nadawany przez WooCommerce
 * Blocks polom z Additional Checkout Fields API nie był możliwy do
 * zweryfikowania bez żywej instalacji. Jeśli po wdrożeniu kalendarz się nie
 * pojawia, to pierwsze miejsce do sprawdzenia: czy etykiety pól faktycznie
 * brzmią dokładnie „Data dostawy" / „Przedział czasowy" (patrz stałe
 * LABEL_DATA / LABEL_GODZINA poniżej).
 *
 * Selektory #shipping-method i #shipping-postcode są przejęte z kodu
 * działającego wcześniej na tym samym checkout (wtyczka Order Delivery
 * Date) — duże prawdopodobieństwo, że są poprawne, ale też do potwierdzenia
 * przy pierwszym teście.
 */
/* eslint-env browser */
( function () {
	'use strict';

	const LABEL_DATA = 'Data dostawy';
	const LABEL_GODZINA = 'Przedział czasowy';
	const LOCALSTORAGE_KLUCZ = 'bs_delivery_date_kod_pocztowy';

	const KOMUNIKAT_POZA_ZASIEGIEM =
		'Dostawa w wybranym terminie jest obecnie dostępna tylko na terenie Warszawy. Skontaktuj się z nami, aby ustalić termin dostawy.';
	const KOMUNIKAT_BRAK_KODU =
		'Wpisz kod pocztowy dostawy, aby wybrać datę dostawy.';
	const KOMUNIKAT_WYMAGANA_DATA =
		'Proszę wybrać datę dostawy, aby kontynuować.';

	const restUrl =
		( window.bsDeliveryDateConfig &&
			window.bsDeliveryDateConfig.restUrl ) ||
		'';
	const CUTOFF_TIME =
		( window.bsDeliveryDateConfig &&
			window.bsDeliveryDateConfig.cutoffTime ) ||
		'15:00';

	let $kalendarz = null;
	let kalendarzZainicjowany = false;
	let ostatniSprawdzonyKod = '';
	let dostepneDaty = [];
	let dzisiaj = '';
	let dostepneSlotyDzis = [];
	let pelnaListaOpcjiGodzin = null;

	// Dopasowanie częściowe (startsWith), nie dokładne — WooCommerce dopisuje
	// do etykiety pól nieobowiązkowych sufiks „ (opcjonalnie)", więc exact
	// match nigdy by nie trafił (to był realny błąd na produkcji).
	function znajdzPolePoLabelu( tekstLabelu ) {
		const etykiety = document.querySelectorAll( 'label' );
		for ( let i = 0; i < etykiety.length; i++ ) {
			// Pomijamy własne, syntetyczne etykiety wstawione w panelu — inaczej
			// np. etykieta „Data dostawy" utworzona przez nas pasowałaby do
			// własnego wyszukiwania i podmieniała wynik na zły element.
			if ( etykiety[ i ].closest( '#bs-delivery-date-panel' ) ) {
				continue;
			}
			if (
				! etykiety[ i ].textContent.trim().startsWith( tekstLabelu )
			) {
				continue;
			}
			const forId = etykiety[ i ].getAttribute( 'for' );
			if ( forId ) {
				const poleZId = document.getElementById( forId );
				if ( poleZId ) {
					return poleZId;
				}
			}
			const wrapper = etykiety[ i ].closest( 'div' );
			if ( wrapper ) {
				const poleZWrappera = wrapper.querySelector( 'input, select' );
				if ( poleZWrappera ) {
					return poleZWrappera;
				}
			}
		}
		return null;
	}

	function znajdzPoleDatyDostawy() {
		return znajdzPolePoLabelu( LABEL_DATA );
	}

	function znajdzPoleGodziny() {
		return znajdzPolePoLabelu( LABEL_GODZINA );
	}

	// Ustawienie wartości w polu kontrolowanym przez React — natywny setter +
	// dispatch eventów, żeby React zauważył zmianę (zwykłe pole.value = x nie
	// wystarczy dla pól renderowanych przez WooCommerce Blocks).
	function ustawWartosc( pole, wartosc ) {
		const prototyp =
			pole.tagName === 'SELECT'
				? window.HTMLSelectElement.prototype
				: window.HTMLInputElement.prototype;
		const setter = Object.getOwnPropertyDescriptor( prototyp, 'value' ).set;
		setter.call( pole, wartosc );
		pole.dispatchEvent( new Event( 'input', { bubbles: true } ) );
		pole.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		pole.dispatchEvent( new Event( 'blur', { bubbles: true } ) );
	}

	function czyWybranoOdbiorOsobisty() {
		const kontener = document.getElementById( 'shipping-method' );
		if ( ! kontener ) {
			return false;
		}
		const zaznaczona = kontener.querySelector(
			'[role="radio"][aria-checked="true"]'
		);
		if ( ! zaznaczona ) {
			return false;
		}
		const tekst = zaznaczona.textContent.toLowerCase();
		return (
			tekst.indexOf( 'odbiór osobisty' ) !== -1 ||
			tekst.indexOf( 'odbior osobisty' ) !== -1
		);
	}

	function formatujDateISO( date ) {
		const rok = date.getFullYear();
		const miesiac = String( date.getMonth() + 1 ).padStart( 2, '0' );
		const dzien = String( date.getDate() ).padStart( 2, '0' );
		return rok + '-' + miesiac + '-' + dzien;
	}

	// Reguła dostępności dla „Data odbioru" (odbiór osobisty) — inna niż dla
	// dostawy: bez bramki kodu pocztowego i bez blokady weekendów, ale
	// dzisiejszy dzień przestaje być wybieralny po godzinie cutoff.
	function czyDostepnaDlaOdbioru( iso ) {
		const dzisiajStr = formatujDateISO( new Date() );

		if ( iso < dzisiajStr ) {
			return false;
		}

		if ( iso === dzisiajStr ) {
			const czesciCutoff = CUTOFF_TIME.split( ':' ).map( Number );
			const cutoff = new Date();
			cutoff.setHours( czesciCutoff[ 0 ], czesciCutoff[ 1 ] || 0, 0, 0 );
			if ( new Date() >= cutoff ) {
				return false;
			}
		}

		return true;
	}

	function pobierzDostepnosc( postalCode, callback ) {
		if ( ! restUrl ) {
			return;
		}
		fetch( restUrl + '?postal_code=' + encodeURIComponent( postalCode ) )
			.then( function ( r ) {
				return r.json();
			} )
			.then( callback )
			.catch( function () {
				callback( { postal_code_allowed: false, available_dates: [] } );
			} );
	}

	function pokazKomunikat( tekst ) {
		const komunikat = document.getElementById(
			'bs-delivery-date-komunikat'
		);
		if ( ! komunikat ) {
			return;
		}
		if ( tekst ) {
			komunikat.textContent = tekst;
			komunikat.style.display = 'block';
		} else {
			komunikat.style.display = 'none';
		}
	}

	function zablokujKalendarz( komunikatTekst ) {
		if ( $kalendarz ) {
			$kalendarz.datepicker( 'option', 'disabled', true );
			$kalendarz.addClass( 'bs-delivery-date__kalendarz--zablokowany' );
		}
		pokazKomunikat( komunikatTekst );
	}

	function odblokujKalendarz() {
		if ( $kalendarz ) {
			$kalendarz.datepicker( 'option', 'disabled', false );
			$kalendarz.removeClass(
				'bs-delivery-date__kalendarz--zablokowany'
			);
			// Wymusza ponowną ocenę beforeShowDay — potrzebne np. zaraz po
			// przełączeniu na „Odbiór osobisty", gdzie reguła dostępności
			// dni jest inna niż dla dostawy.
			$kalendarz.datepicker( 'refresh' );
		}
		pokazKomunikat( null );
	}

	function wyczyscWybranaDate() {
		const poleData = znajdzPoleDatyDostawy();
		if ( poleData && poleData.value ) {
			ustawWartosc( poleData, '' );
		}
		if ( $kalendarz ) {
			$kalendarz.datepicker( 'setDate', null );
		}
	}

	function wyczyscWybranaDateJesliNiedostepna() {
		const poleData = znajdzPoleDatyDostawy();
		if ( ! poleData || ! poleData.value ) {
			return;
		}
		if ( dostepneDaty.indexOf( poleData.value ) === -1 ) {
			wyczyscWybranaDate();
		}
	}

	function odswiezStanKalendarza() {
		if ( ! kalendarzZainicjowany ) {
			return;
		}

		if ( czyWybranoOdbiorOsobisty() ) {
			odblokujKalendarz();
			return;
		}

		const poleWidget = document.getElementById(
			'bs-delivery-date-kod-pocztowy'
		);
		const postalCode = poleWidget ? poleWidget.value : '';
		const cyfry = postalCode.replace( /\D/g, '' );

		if ( cyfry.length < 5 ) {
			zablokujKalendarz( postalCode ? null : KOMUNIKAT_BRAK_KODU );
			wyczyscWybranaDate();
			return;
		}

		if ( postalCode === ostatniSprawdzonyKod ) {
			if ( dostepneDaty.length === 0 ) {
				zablokujKalendarz( KOMUNIKAT_POZA_ZASIEGIEM );
			} else {
				odblokujKalendarz();
				$kalendarz.datepicker( 'refresh' );
			}
			return;
		}

		ostatniSprawdzonyKod = postalCode;
		pobierzDostepnosc( postalCode, function ( data ) {
			dostepneDaty = data.available_dates || [];
			dzisiaj = data.today || '';
			dostepneSlotyDzis = data.available_slots_today || [];
			if ( ! data.postal_code_allowed || dostepneDaty.length === 0 ) {
				zablokujKalendarz( KOMUNIKAT_POZA_ZASIEGIEM );
			} else {
				odblokujKalendarz();
				$kalendarz.datepicker( 'refresh' );
			}
			wyczyscWybranaDateJesliNiedostepna();
			odswiezOpcjeGodzin( pobierzAktualnaWybranaDate() );
		} );
	}

	// Panel wstawiany od razu po wyborze metody wysyłki („Wysyłka"/„Odbiór
	// osobisty"), zamiast zostawiać kalendarz tam gdzie WooCommerce domyślnie
	// renderuje pola z Additional Checkout Fields API (na dole, w sekcji
	// „Dodatkowe informacje").
	function wstawPanelDostawy() {
		const istniejacy = document.getElementById( 'bs-delivery-date-panel' );
		if ( istniejacy ) {
			return istniejacy;
		}
		const kontenerMetody = document.getElementById( 'shipping-method' );
		if ( ! kontenerMetody ) {
			return null;
		}
		const panel = document.createElement( 'div' );
		panel.id = 'bs-delivery-date-panel';
		kontenerMetody.parentNode.insertBefore(
			panel,
			kontenerMetody.nextSibling
		);
		return panel;
	}

	function inicjalizujKalendarz() {
		if ( kalendarzZainicjowany ) {
			return;
		}
		if (
			typeof window.jQuery === 'undefined' ||
			! window.jQuery.fn.datepicker
		) {
			return;
		}

		const poleData = znajdzPoleDatyDostawy();
		const panel = wstawPanelDostawy();
		if ( ! poleData || ! panel ) {
			return;
		}

		// Chowamy cały oryginalny wrapper (etykieta + input WooCommerce), nie
		// tylko sam input — inaczej etykieta „Data dostawy" zostaje widoczna
		// w oryginalnym miejscu (na dole, w Dodatkowych informacjach).
		const wrapperOryginalny =
			poleData.closest( 'div' ) || poleData.parentNode;
		wrapperOryginalny.style.display = 'none';

		// Komunikat o braku/błędnym kodzie pocztowym ma się pojawiać pod
		// polem kodu pocztowego, nie pod kalendarzem — stąd wstawiamy go
		// zaraz po widgecie kodu, a dopiero potem etykietę i sam kalendarz.
		const komunikat = document.createElement( 'div' );
		komunikat.id = 'bs-delivery-date-komunikat';
		komunikat.className = 'bs-delivery-date__komunikat';
		komunikat.style.display = 'none';

		const kodPocztowyWrapper = document.getElementById(
			'bs-delivery-date-kod-pocztowy-wrapper'
		);
		if ( kodPocztowyWrapper ) {
			kodPocztowyWrapper.parentNode.insertBefore(
				komunikat,
				kodPocztowyWrapper.nextSibling
			);
		} else {
			panel.appendChild( komunikat );
		}

		const etykieta = document.createElement( 'label' );
		etykieta.id = 'bs-delivery-date-etykieta-kalendarza';
		etykieta.className = 'bs-delivery-date__etykieta-kalendarza';
		etykieta.textContent = 'Data dostawy';
		panel.appendChild( etykieta );

		const kontener = document.createElement( 'div' );
		kontener.id = 'bs-delivery-date-kalendarz';
		panel.appendChild( kontener );

		$kalendarz = window.jQuery( kontener );
		$kalendarz.datepicker( {
			dateFormat: 'yy-mm-dd',
			// Krótkie strzałki zamiast pełnych słów „Poprzedni"/„Następny"
			// (auto-tłumaczonych przez regionalne ustawienia jQuery UI na tej
			// stronie) — na wąskich ekranach długie słowa nachodziły na
			// nazwę miesiąca.
			prevText: '‹',
			nextText: '›',
			beforeShowDay( date ) {
				const iso = formatujDateISO( date );
				const dostepna = czyWybranoOdbiorOsobisty()
					? czyDostepnaDlaOdbioru( iso )
					: dostepneDaty.indexOf( iso ) !== -1;
				return [
					dostepna,
					dostepna ? '' : 'bs-delivery-date-niedostepny',
					'',
				];
			},
			onSelect( dateText ) {
				ustawWartosc( poleData, dateText );
				ukryjKomunikatWymaganejDaty();
				odswiezOpcjeGodzin( dateText );
			},
		} );

		kalendarzZainicjowany = true;
		odswiezStanKalendarza();
	}

	// Puste pole nie pokazuje błędu (osobno wymagane przy próbie złożenia
	// zamówienia) — walidujemy tylko format, gdy coś już jest wpisane.
	function walidujFormatKoduPocztowego( wartosc ) {
		if ( wartosc.trim() === '' ) {
			return true;
		}
		return /^\d{2}-?\d{3}$/.test( wartosc.trim() );
	}

	function pokazBladFormatuKodu( pole, pokaz ) {
		let blad = document.getElementById( 'bs-delivery-date-blad-formatu' );
		if ( pokaz ) {
			pole.classList.add( 'bs-delivery-date__pole--blad' );
			if ( ! blad ) {
				blad = document.createElement( 'div' );
				blad.id = 'bs-delivery-date-blad-formatu';
				blad.className = 'bs-delivery-date__blad-formatu';
				blad.textContent = 'Podaj kod pocztowy w formacie 00-000.';
				pole.parentNode.appendChild( blad );
			}
		} else {
			pole.classList.remove( 'bs-delivery-date__pole--blad' );
			if ( blad ) {
				blad.remove();
			}
		}
	}

	function wstawWidgetKoduPocztowego() {
		if ( document.getElementById( 'bs-delivery-date-kod-pocztowy' ) ) {
			return;
		}
		const panel = wstawPanelDostawy();
		if ( ! panel ) {
			return;
		}

		const widget = document.createElement( 'div' );
		widget.id = 'bs-delivery-date-kod-pocztowy-wrapper';
		widget.className = 'bs-delivery-date__kod-pocztowy';
		widget.innerHTML =
			'<label for="bs-delivery-date-kod-pocztowy">Kod pocztowy dostawy</label>' +
			'<input type="text" id="bs-delivery-date-kod-pocztowy" placeholder="00-000" autocomplete="off" />';

		panel.appendChild( widget );

		const pole = document.getElementById( 'bs-delivery-date-kod-pocztowy' );

		// Priorytet: aktualna wartość prawdziwego pola adresu dostawy (jeśli
		// klient już je wypełnił), dopiero potem localStorage z poprzedniej wizyty.
		const poleAdresu = document.getElementById( 'shipping-postcode' );
		const wartoscPoczatkowa =
			( poleAdresu && poleAdresu.value ) ||
			localStorage.getItem( LOCALSTORAGE_KLUCZ ) ||
			'';
		if ( wartoscPoczatkowa ) {
			pole.value = wartoscPoczatkowa;
		}

		pole.addEventListener( 'input', function () {
			localStorage.setItem( LOCALSTORAGE_KLUCZ, this.value );
			pokazBladFormatuKodu( this, false );

			// Dwukierunkowa synchronizacja: nasz widget nadpisuje też prawdziwe
			// pole adresu dostawy — inaczej kod użyty do odblokowania
			// kalendarza mógłby się rozjechać z tym, co faktycznie trafia do
			// zamówienia (np. gdy w polu adresu zostanie stara, zapamiętana
			// przez przeglądarkę wartość).
			const poleAdresuDoNadpisania =
				document.getElementById( 'shipping-postcode' );
			if (
				poleAdresuDoNadpisania &&
				poleAdresuDoNadpisania.value !== this.value
			) {
				ustawWartosc( poleAdresuDoNadpisania, this.value );
			}

			odswiezStanKalendarza();
		} );

		pole.addEventListener( 'blur', function () {
			pokazBladFormatuKodu(
				this,
				! walidujFormatKoduPocztowego( this.value )
			);
		} );
	}

	// Zmiana natywnego pola adresu dostawy nadpisuje nasz widget kodu
	// pocztowego i przelicza dostępność (patrz plan: dwukierunkowa synchronizacja).
	document.addEventListener( 'input', function ( e ) {
		if ( e.target && e.target.id === 'shipping-postcode' ) {
			const poleWidget = document.getElementById(
				'bs-delivery-date-kod-pocztowy'
			);
			if ( poleWidget ) {
				poleWidget.value = e.target.value;
				localStorage.setItem( LOCALSTORAGE_KLUCZ, e.target.value );
				odswiezStanKalendarza();
			}
		}
	} );

	// Prawdziwe pole „Przedział czasowy" zostaje w oryginalnym miejscu (ukryte
	// na stałe), a w panelu obok kalendarza pokazujemy jego kopię (proxy) —
	// opcje kopiowane z prawdziwego selecta, więc zawsze zgodne z tym, co
	// faktycznie zarejestrowano w config.php, bez duplikowania listy slotów.
	function wstawProxyGodziny() {
		if ( document.getElementById( 'bs-delivery-date-godzina' ) ) {
			return;
		}
		const poleGodziny = znajdzPoleGodziny();
		const panel = wstawPanelDostawy();
		if ( ! poleGodziny || ! panel ) {
			return;
		}

		const wrapperOryginalny =
			poleGodziny.closest( 'div' ) || poleGodziny.parentNode;
		wrapperOryginalny.style.display = 'none';

		const proxyWrapper = document.createElement( 'div' );
		proxyWrapper.id = 'bs-delivery-date-godzina-wrapper';
		proxyWrapper.className = 'bs-delivery-date__godzina';

		const etykieta = document.createElement( 'label' );
		etykieta.setAttribute( 'for', 'bs-delivery-date-godzina' );
		etykieta.textContent = 'Godzina dostawy';
		proxyWrapper.appendChild( etykieta );

		const proxySelect = document.createElement( 'select' );
		proxySelect.id = 'bs-delivery-date-godzina';

		if ( poleGodziny.tagName === 'SELECT' ) {
			pelnaListaOpcjiGodzin = Array.prototype.map.call(
				poleGodziny.options,
				function ( opcja ) {
					return { value: opcja.value, text: opcja.textContent };
				}
			);
			pelnaListaOpcjiGodzin.forEach( function ( opcja ) {
				const nowaOpcja = document.createElement( 'option' );
				nowaOpcja.value = opcja.value;
				nowaOpcja.textContent = opcja.text;
				proxySelect.appendChild( nowaOpcja );
			} );
			proxySelect.value = poleGodziny.value;
		}

		proxyWrapper.appendChild( proxySelect );
		panel.appendChild( proxyWrapper );

		proxySelect.addEventListener( 'change', function () {
			ustawWartosc( poleGodziny, this.value );
		} );
	}

	function pobierzAktualnaWybranaDate() {
		const poleData = znajdzPoleDatyDostawy();
		return poleData ? poleData.value : '';
	}

	// Gdy wybrana data to dzisiaj, zawężamy listę godzin w proxy-selекcie do
	// tych, które mieszczą się w buforze `slot_buffer_hours` (patrz
	// config.php) — inaczej dałoby się wybrać slot, który już praktycznie
	// minął. Dla innych dat pokazujemy pełną listę.
	function odswiezOpcjeGodzin( wybranaData ) {
		const proxySelect = document.getElementById(
			'bs-delivery-date-godzina'
		);
		if ( ! proxySelect || ! pelnaListaOpcjiGodzin ) {
			return;
		}

		const ograniczDzisiaj = wybranaData && wybranaData === dzisiaj;
		const wartoscPrzed = proxySelect.value;

		proxySelect.innerHTML = '';
		pelnaListaOpcjiGodzin.forEach( function ( opcja ) {
			const dostepna =
				opcja.value === '' ||
				! ograniczDzisiaj ||
				dostepneSlotyDzis.indexOf( opcja.value ) !== -1;
			if ( ! dostepna ) {
				return;
			}
			const nowaOpcja = document.createElement( 'option' );
			nowaOpcja.value = opcja.value;
			nowaOpcja.textContent = opcja.text;
			proxySelect.appendChild( nowaOpcja );
		} );

		const nadalDostepna = Array.prototype.some.call(
			proxySelect.options,
			function ( opcja ) {
				return opcja.value === wartoscPrzed;
			}
		);

		if ( nadalDostepna ) {
			proxySelect.value = wartoscPrzed;
		} else {
			proxySelect.value = '';
			const poleGodziny = znajdzPoleGodziny();
			if ( poleGodziny ) {
				ustawWartosc( poleGodziny, '' );
			}
		}
	}

	// Aktualizuje widoczność/etykiety zależne od wybranej metody wysyłki:
	// przy „Odbiór osobisty" pole godziny i kod pocztowy są zbędne (chowamy
	// je), a kalendarz zmienia etykietę na „Data odbioru".
	function aktualizujStanWgMetodyWysylki() {
		const odbiorOsobisty = czyWybranoOdbiorOsobisty();

		const godzinaWrapper = document.getElementById(
			'bs-delivery-date-godzina-wrapper'
		);
		if ( godzinaWrapper ) {
			godzinaWrapper.style.display = odbiorOsobisty ? 'none' : '';
		}

		const kodPocztowyWrapper = document.getElementById(
			'bs-delivery-date-kod-pocztowy-wrapper'
		);
		if ( kodPocztowyWrapper ) {
			kodPocztowyWrapper.style.display = odbiorOsobisty ? 'none' : '';
		}

		const etykietaKalendarza = document.getElementById(
			'bs-delivery-date-etykieta-kalendarza'
		);
		if ( etykietaKalendarza ) {
			etykietaKalendarza.textContent = odbiorOsobisty
				? 'Data odbioru'
				: 'Data dostawy';
		}
	}

	function pokazKomunikatWymaganejDaty() {
		let komunikat = document.getElementById(
			'bs-delivery-date-komunikat-wymagane'
		);
		if ( ! komunikat ) {
			const kontener = document.getElementById(
				'bs-delivery-date-kalendarz'
			);
			const poleData = znajdzPoleDatyDostawy();
			const miejsceWstawienia = kontener || poleData;
			if ( ! miejsceWstawienia ) {
				return;
			}
			komunikat = document.createElement( 'div' );
			komunikat.id = 'bs-delivery-date-komunikat-wymagane';
			komunikat.className =
				'bs-delivery-date__komunikat bs-delivery-date__komunikat--blad';
			komunikat.textContent = KOMUNIKAT_WYMAGANA_DATA;
			miejsceWstawienia.parentNode.insertBefore(
				komunikat,
				miejsceWstawienia.nextSibling
			);
		}
		komunikat.style.display = 'block';
	}

	function ukryjKomunikatWymaganejDaty() {
		const komunikat = document.getElementById(
			'bs-delivery-date-komunikat-wymagane'
		);
		if ( komunikat ) {
			komunikat.style.display = 'none';
		}
	}

	document.addEventListener(
		'click',
		function ( e ) {
			const przycisk =
				e.target.closest &&
				e.target.closest(
					'button.wc-block-components-checkout-place-order-button'
				);
			if ( ! przycisk ) {
				return;
			}
			if ( czyWybranoOdbiorOsobisty() ) {
				return;
			}

			const poleData = znajdzPoleDatyDostawy();
			const brakDaty = ! poleData || ! poleData.value;

			if ( brakDaty ) {
				e.preventDefault();
				e.stopImmediatePropagation();
				pokazKomunikatWymaganejDaty();
				const kontener = document.getElementById(
					'bs-delivery-date-kalendarz'
				);
				if ( kontener ) {
					kontener.scrollIntoView( {
						behavior: 'smooth',
						block: 'center',
					} );
				}
				return false;
			}
			ukryjKomunikatWymaganejDaty();
		},
		true
	);

	document.addEventListener( 'click', function ( e ) {
		if ( e.target.closest && e.target.closest( '#shipping-method' ) ) {
			setTimeout( function () {
				aktualizujStanWgMetodyWysylki();
				odswiezStanKalendarza();
			}, 150 );
		}
	} );

	// Pola renderują się asynchronicznie (React) — odpytujemy do skutku,
	// z limitem prób, żeby nie kręcić się w nieskończoność gdy etykiety
	// się nie zgadzają.
	let probyInicjalizacji = 0;
	const interwal = setInterval( function () {
		probyInicjalizacji++;
		if ( znajdzPoleDatyDostawy() && znajdzPoleGodziny() ) {
			wstawWidgetKoduPocztowego();
			inicjalizujKalendarz();
			wstawProxyGodziny();
			aktualizujStanWgMetodyWysylki();
			clearInterval( interwal );
		} else if ( probyInicjalizacji > 40 ) {
			clearInterval( interwal );
		}
	}, 500 );

	// WooCommerce potrafi przywrócić wcześniej wybraną datę z zapisanego
	// „szkicu" zamówienia asynchronicznie, już po tym jak zdążyliśmy raz
	// zbudować listę godzin — bez tego obserwatora filtr slotów by tego nie
	// złapał. Sprawdzamy więc stale, niezależnie od przyczyny zmiany.
	let ostatniaSprawdzonaData = null;
	setInterval( function () {
		const aktualnaData = pobierzAktualnaWybranaDate();
		if ( aktualnaData !== ostatniaSprawdzonaData ) {
			ostatniaSprawdzonaData = aktualnaData;
			odswiezOpcjeGodzin( aktualnaData );
		}
	}, 1000 );
} )();
