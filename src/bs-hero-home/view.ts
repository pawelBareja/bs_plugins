export {};

const SCALE_MAX = 0.12;
const BOCZNY_SHIFT_MAX = 50;
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

type NominatimAdres = {
	city?: string;
	town?: string;
	village?: string;
	municipality?: string;
	postcode?: string;
};

type NominatimOdpowiedz = {
	address?: NominatimAdres;
};

const DNI_TYGODNIA = [
	'Niedziela',
	'Poniedziałek',
	'Wtorek',
	'Środa',
	'Czwartek',
	'Piątek',
	'Sobota',
];
const MIESIACE = [
	'stycznia',
	'lutego',
	'marca',
	'kwietnia',
	'maja',
	'czerwca',
	'lipca',
	'sierpnia',
	'września',
	'października',
	'listopada',
	'grudnia',
];

function formatujDatePL( data: Date ): string {
	return `${ DNI_TYGODNIA[ data.getDay() ] }, ${ data.getDate() } ${
		MIESIACE[ data.getMonth() ]
	} ${ data.getFullYear() }`;
}

// Ten sam algorytm co w firmowym skrypcie liczącym termin dostawy na
// stronie produktu (prefiks kodu pocztowego 00-05 = Warszawa, dostawa
// tego samego dnia do godz. 15; poza Warszawą — kolejny dzień roboczy,
// a po godz. 8 rano dwa dni robocze), tylko że kod pocztowy pochodzi
// z odwrotnego geokodowania współrzędnych zamiast ręcznego wpisania.
function obliczTerminDostawy( kodPocztowy: string ): {
	data: Date;
	dzisiaj: boolean;
} {
	const godzina = new Date().getHours();
	const prefiks = parseInt(
		kodPocztowy.replace( '-', '' ).substring( 0, 2 ),
		10
	);
	const czyWarszawa = prefiks >= 0 && prefiks <= 5;
	let minDni: number;
	if ( czyWarszawa ) {
		minDni = godzina < 15 ? 0 : 1;
	} else {
		minDni = godzina < 8 ? 1 : 2;
	}

	const data = new Date();

	if ( minDni === 0 ) {
		const dzienTygodnia = data.getDay();
		if ( dzienTygodnia === 0 || dzienTygodnia === 6 ) {
			data.setDate( data.getDate() + ( dzienTygodnia === 6 ? 2 : 1 ) );
			return { data, dzisiaj: false };
		}
		return { data, dzisiaj: true };
	}

	let dodane = 0;
	while ( dodane < minDni ) {
		data.setDate( data.getDate() + 1 );
		const dzienTygodnia = data.getDay();
		if ( dzienTygodnia !== 0 && dzienTygodnia !== 6 ) {
			dodane++;
		}
	}
	return { data, dzisiaj: false };
}

// Odkłada zadanie do momentu, gdy przeglądarka jest bezczynna (albo do
// zdarzenia `load` w przeglądarkach bez requestIdleCallback, np. Safari) —
// żeby geolokalizacja i zapytanie sieciowe nie wpływały na czas ładowania strony.
function runWhenIdle( callback: () => void ): void {
	const ric = ( window as Partial< Window > ).requestIdleCallback;
	if ( ric ) {
		ric( callback, { timeout: 4000 } );
		return;
	}
	window.addEventListener( 'load', callback, { once: true } );
}

function initBlurRotator( rotator: HTMLElement ): void {
	const items = Array.from(
		rotator.querySelectorAll< HTMLElement >(
			'.blok-hero-home__rotator-item'
		)
	);
	if ( items.length < 2 ) {
		return;
	}

	let current = 0;

	setInterval( () => {
		items[ current ].classList.remove( 'is-active' );
		current = ( current + 1 ) % items.length;
		items[ current ].classList.add( 'is-active' );
	}, 3000 );
}

function initBlurIn( hero: HTMLElement ): void {
	hero.classList.add( 'js-blur-in' );

	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					hero.classList.add( 'is-in-view' );
					observer.disconnect();
				}
			} );
		},
		{ threshold: 0.1 }
	);

	observer.observe( hero );
}

function initParallax( hero: HTMLElement ): void {
	const obrazek = hero.querySelector< HTMLElement >(
		'.blok-hero-home__obrazek'
	);
	const tekstBoczny = hero.querySelector< HTMLElement >(
		'.blok-hero-home__tekst-boczny'
	);
	if ( ! obrazek && ! tekstBoczny ) {
		return;
	}

	let ticking = false;

	const update = () => {
		const rect = hero.getBoundingClientRect();
		const progress = Math.min(
			Math.max(
				( window.innerHeight - rect.top ) /
					( window.innerHeight + rect.height ),
				0
			),
			1
		);
		obrazek?.style.setProperty(
			'--bs-hero-home-scale',
			String( 1 + progress * SCALE_MAX )
		);
		// Tekst boczny "wznosi się" w górę w miarę przewijania sekcji.
		tekstBoczny?.style.setProperty(
			'--bs-hero-home-boczny-shift',
			`${ -progress * BOCZNY_SHIFT_MAX }px`
		);
		ticking = false;
	};

	const onScroll = () => {
		if ( ticking ) {
			return;
		}
		ticking = true;
		requestAnimationFrame( update );
	};

	update();
	window.addEventListener( 'scroll', onScroll, { passive: true } );
}

function initDostawaLokalizacja( hero: HTMLElement ): void {
	const kontener = hero.querySelector< HTMLElement >(
		'.blok-hero-home__dostawa'
	);
	const linia1 = hero.querySelector< HTMLElement >(
		'.blok-hero-home__dostawa-linia1'
	);
	const linia2 = hero.querySelector< HTMLElement >(
		'.blok-hero-home__dostawa-linia2'
	);
	const szablon = linia1?.dataset.dostawaSzablon;
	if (
		! kontener ||
		! linia1 ||
		! linia2 ||
		! szablon ||
		! navigator.geolocation
	) {
		return;
	}

	runWhenIdle( () => {
		navigator.geolocation.getCurrentPosition(
			( pozycja ) => {
				const url = new URL( NOMINATIM_ENDPOINT );
				url.searchParams.set( 'format', 'jsonv2' );
				url.searchParams.set(
					'lat',
					String( pozycja.coords.latitude )
				);
				url.searchParams.set(
					'lon',
					String( pozycja.coords.longitude )
				);
				// zoom 18 (poziom budynku) — niższe wartości (np. "poziom
				// miasta") często nie zwracają kodu pocztowego w ogóle.
				url.searchParams.set( 'zoom', '18' );
				url.searchParams.set( 'addressdetails', '1' );

				fetch( url.toString() )
					.then( ( res ) =>
						res.ok
							? ( res.json() as Promise< NominatimOdpowiedz > )
							: null
					)
					.then( ( dane ) => {
						const adres = dane?.address;
						const miasto =
							adres?.city ??
							adres?.town ??
							adres?.village ??
							adres?.municipality;
						if ( ! miasto || ! adres?.postcode ) {
							return;
						}
						const termin = obliczTerminDostawy( adres.postcode );
						const tekstDaty = termin.dzisiaj
							? 'Dzisiaj, dla zamówień złożonych do godziny 15'
							: formatujDatePL( termin.data );
						linia1.textContent = szablon.replace( '%s', miasto );
						linia2.textContent = tekstDaty;
						kontener.hidden = false;
					} )
					.catch( () => {} );
			},
			() => {},
			{ timeout: 8000, maximumAge: 600000 }
		);
	} );
}

const reducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;

document
	.querySelectorAll< HTMLElement >( '.blok-hero-home' )
	.forEach( ( hero ) => {
		const rotator = hero.querySelector< HTMLElement >(
			'.blok-hero-home__rotator'
		);
		if ( rotator ) {
			initBlurRotator( rotator );
		}
		if ( ! reducedMotion ) {
			initBlurIn( hero );
			initParallax( hero );
		}
		initDostawaLokalizacja( hero );
	} );
