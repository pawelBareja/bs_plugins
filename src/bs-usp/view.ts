export {};

const KSZTALT_RANGE = 24;
const OBRAZEK_RANGE = 50;
const TRESC_RANGE = 16;

function initParallax( blok: HTMLElement ): void {
	const ksztalt = blok.querySelector< HTMLElement >( '.blok-usp__ksztalt' );
	const obrazek = blok.querySelector< HTMLElement >(
		'.blok-usp__obrazek-wrapper'
	);
	const tresc = blok.querySelector< HTMLElement >( '.blok-usp__tresc' );

	if ( ! ksztalt && ! obrazek && ! tresc ) {
		return;
	}

	let ticking = false;

	const update = () => {
		const rect = blok.getBoundingClientRect();
		// 0 = blok poniżej viewportu, 0.5 = wycentrowany, 1 = powyżej viewportu
		const progress = Math.min(
			Math.max(
				( window.innerHeight - rect.top ) /
					( window.innerHeight + rect.height ),
				0
			),
			1
		);
		const offset = progress - 0.5;

		ksztalt?.style.setProperty(
			'--bs-usp-ksztalt-shift',
			`${ offset * KSZTALT_RANGE }px`
		);
		obrazek?.style.setProperty(
			'--bs-usp-obrazek-shift',
			`${ offset * OBRAZEK_RANGE }px`
		);
		tresc?.style.setProperty(
			'--bs-usp-tresc-shift',
			`${ -offset * TRESC_RANGE }px`
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

if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	document
		.querySelectorAll< HTMLElement >( '.blok-usp' )
		.forEach( initParallax );
}
