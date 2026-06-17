document
	.querySelectorAll< HTMLAnchorElement >(
		'.blok-przycisk-wrapper a[data-scroll-offset]'
	)
	.forEach( ( link ) => {
		link.addEventListener( 'click', ( e ) => {
			const href = link.getAttribute( 'href' );
			if ( ! href || ! href.startsWith( '#' ) ) {
				return;
			}

			const target = document.querySelector< HTMLElement >( href );
			if ( ! target ) {
				return;
			}

			e.preventDefault();

			const offset = parseInt( link.dataset.scrollOffset ?? '0', 10 );
			const top =
				target.getBoundingClientRect().top + window.scrollY - offset;

			window.scrollTo( { top, behavior: 'smooth' } );
		} );
	} );
