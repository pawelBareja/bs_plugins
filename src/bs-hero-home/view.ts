export {};

const SCALE_MAX = 0.12;

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
	if ( ! obrazek ) {
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
		obrazek.style.setProperty(
			'--bs-hero-home-scale',
			String( 1 + progress * SCALE_MAX )
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
	} );
