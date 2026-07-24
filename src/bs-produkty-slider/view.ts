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

	const prevBtn = slider.querySelector< HTMLElement >(
		'.blok-produkty-slider__nav--prev'
	);
	const nextBtn = slider.querySelector< HTMLElement >(
		'.blok-produkty-slider__nav--next'
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

		prevBtn?.classList.toggle( 'is-hidden', index <= 0 );
		nextBtn?.classList.toggle( 'is-hidden', index >= max );
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

	prevBtn?.addEventListener( 'click', () => {
		goTo( index - 1 );
		start();
	} );
	nextBtn?.addEventListener( 'click', () => {
		goTo( index + 1 );
		start();
	} );

	const SWIPE_THRESHOLD = 40;
	let touchStartX = 0;
	let touchStartY = 0;
	let isSwiping = false;

	const viewport = slider.querySelector< HTMLElement >(
		'.blok-produkty-slider__viewport'
	);

	viewport?.addEventListener(
		'touchstart',
		( e: TouchEvent ) => {
			touchStartX = e.touches[ 0 ].clientX;
			touchStartY = e.touches[ 0 ].clientY;
			isSwiping = true;
			stop();
		},
		{ passive: true }
	);

	viewport?.addEventListener(
		'touchmove',
		( e: TouchEvent ) => {
			if ( ! isSwiping ) {
				return;
			}
			const deltaX = e.touches[ 0 ].clientX - touchStartX;
			const deltaY = e.touches[ 0 ].clientY - touchStartY;
			if ( Math.abs( deltaX ) > Math.abs( deltaY ) ) {
				e.preventDefault();
			}
		},
		{ passive: false }
	);

	viewport?.addEventListener( 'touchend', ( e: TouchEvent ) => {
		if ( ! isSwiping ) {
			return;
		}
		isSwiping = false;
		const deltaX = e.changedTouches[ 0 ].clientX - touchStartX;
		if ( deltaX <= -SWIPE_THRESHOLD ) {
			goTo( index + 1 );
		} else if ( deltaX >= SWIPE_THRESHOLD ) {
			goTo( index - 1 );
		}
		start();
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
