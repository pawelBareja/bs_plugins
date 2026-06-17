function initScrollFade( hero: HTMLElement ): void {
	const zawartosc = hero.querySelector< HTMLElement >(
		'.blok-hero__zawartosc'
	);
	if ( ! zawartosc ) {
		return;
	}

	let ticking = false;

	const update = () => {
		const rect = hero.getBoundingClientRect();
		// progress: 0 = hero widoczny na górze, 1 = przewinięty o 50% wysokości bohatera
		const progress = Math.min(
			Math.max( -rect.top / ( hero.offsetHeight * 0.5 ), 0 ),
			1
		);
		zawartosc.style.setProperty(
			'--bs-hero-zawartosc-opacity',
			String( 1 - progress * 0.88 )
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
		.querySelectorAll< HTMLElement >( '.blok-hero' )
		.forEach( initScrollFade );
}
