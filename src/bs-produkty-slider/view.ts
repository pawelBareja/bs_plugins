const BREAKPOINT_TABLET = 900;
const BREAKPOINT_MOBILE = 600;

function getVisibleCount(): number {
	const width = window.innerWidth;
	if ( width <= BREAKPOINT_MOBILE ) {
		return 1;
	}
	if ( width <= BREAKPOINT_TABLET ) {
		return 2;
	}
	return 3;
}

function initSlider( slider: HTMLElement ): void {
	const track = slider.querySelector< HTMLElement >(
		'.blok-produkty-slider__track'
	);
	if ( ! track ) {
		return;
	}

	const dots = slider.querySelectorAll< HTMLElement >(
		'.blok-produkty-slider__dot'
	);
	const total = track.children.length;
	const predkosc = Number( slider.dataset.predkosc ) || 4;
	const reduceMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	let index = 0;
	let timer: ReturnType< typeof setInterval > | null = null;

	const goTo = ( i: number ) => {
		const max = Math.max( 0, total - getVisibleCount() );
		index = Math.min( Math.max( i, 0 ), max );
		track.style.setProperty( '--bs-slider-index', String( index ) );

		dots.forEach( ( dot, di ) => {
			dot.classList.toggle( 'is-active', di === index );
		} );
	};

	const next = () => {
		const max = Math.max( 0, total - getVisibleCount() );
		goTo( index >= max ? 0 : index + 1 );
	};

	const stop = () => {
		if ( timer ) {
			clearInterval( timer );
			timer = null;
		}
	};

	const start = () => {
		if ( reduceMotion || total <= getVisibleCount() ) {
			return;
		}
		stop();
		timer = setInterval( next, predkosc * 1000 );
	};

	dots.forEach( ( dot, i ) => {
		dot.addEventListener( 'click', () => {
			goTo( i );
			start();
		} );
	} );

	slider.addEventListener( 'mouseenter', stop );
	slider.addEventListener( 'mouseleave', start );
	slider.addEventListener( 'focusin', stop );
	slider.addEventListener( 'focusout', start );

	window.addEventListener( 'resize', () => goTo( index ) );

	goTo( 0 );
	start();
}

document
	.querySelectorAll< HTMLElement >( '.blok-produkty-slider' )
	.forEach( initSlider );
