export {};

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_BEFORE_TYPE = 400;
const SCALE_MAX = 0.12;

function initTyping( rotator: HTMLElement ): void {
	const items = Array.from(
		rotator.querySelectorAll< HTMLElement >(
			'.blok-hero-home__rotator-item'
		)
	);
	if ( items.length === 0 ) {
		return;
	}

	const words = items.map( ( el ) => el.textContent?.trim() ?? '' );
	const display = items[ 0 ];

	// Hide all except the display element
	items.forEach( ( el, i ) => {
		if ( i > 0 ) {
			el.style.display = 'none';
		}
	} );

	display.classList.add( 'is-active' );
	display.textContent = '';

	let wordIndex = 0;
	let charIndex = 0;
	let deleting = false;

	const tick = () => {
		const word = words[ wordIndex ];

		if ( ! deleting ) {
			charIndex++;
			display.textContent = word.slice( 0, charIndex );
			if ( charIndex === word.length ) {
				setTimeout( () => {
					deleting = true;
					tick();
				}, PAUSE_AFTER_TYPE );
				return;
			}
		} else {
			charIndex--;
			display.textContent = word.slice( 0, charIndex );
			if ( charIndex === 0 ) {
				deleting = false;
				wordIndex = ( wordIndex + 1 ) % words.length;
				setTimeout( tick, PAUSE_BEFORE_TYPE );
				return;
			}
		}

		setTimeout( tick, deleting ? DELETING_SPEED : TYPING_SPEED );
	};

	setTimeout( tick, 600 );
}

function initSimpleRotator( rotator: HTMLElement ): void {
	const items = rotator.querySelectorAll< HTMLElement >(
		'.blok-hero-home__rotator-item'
	);
	if ( items.length < 2 ) {
		return;
	}
	let index = 0;
	setInterval( () => {
		items[ index ].classList.remove( 'is-active' );
		index = ( index + 1 ) % items.length;
		items[ index ].classList.add( 'is-active' );
	}, 2600 );
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
			if ( reducedMotion ) {
				initSimpleRotator( rotator );
			} else {
				initTyping( rotator );
			}
		}
		if ( ! reducedMotion ) {
			initParallax( hero );
		}
	} );
