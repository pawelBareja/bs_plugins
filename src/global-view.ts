const ENTRY_SHIFT = 60;

function initGaleria( galeria: HTMLElement ): void {
	const obrazki = galeria.querySelectorAll< HTMLElement >(
		'.wp-block-image img'
	);
	if ( ! obrazki.length ) {
		return;
	}

	let ticking = false;

	const update = () => {
		obrazki.forEach( ( img ) => {
			const rect = img.getBoundingClientRect();
			// 0 = zdjęcie jeszcze poza ekranem (poniżej), 1 = doszło do górnej krawędzi viewportu
			const progress =
				1 - Math.min( Math.max( rect.top / window.innerHeight, 0 ), 1 );
			img.style.setProperty(
				'--bs-galeria-shift',
				`${ ( 1 - progress ) * ENTRY_SHIFT }px`
			);
		} );
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

document
	.querySelectorAll< HTMLElement >( '.wp-block-gallery.bs-galeria' )
	.forEach( initGaleria );
