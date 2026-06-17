function initFaq( faq: HTMLElement ): void {
	const taby = faq.querySelectorAll< HTMLElement >( '.blok-faq__tab' );
	const panele = faq.querySelectorAll< HTMLElement >( '.blok-faq__panel' );

	taby.forEach( ( tab, index ) => {
		tab.addEventListener( 'click', () => {
			taby.forEach( ( t ) => {
				t.classList.remove( 'is-active' );
				t.setAttribute( 'aria-selected', 'false' );
			} );
			panele.forEach( ( panel ) => {
				panel.classList.remove( 'is-active' );
				panel.hidden = true;
			} );

			tab.classList.add( 'is-active' );
			tab.setAttribute( 'aria-selected', 'true' );

			const panel = panele[ index ];
			if ( panel ) {
				panel.classList.add( 'is-active' );
				panel.hidden = false;
			}
		} );
	} );

	faq.querySelectorAll< HTMLElement >( '.blok-faq__pytanie' ).forEach(
		( przycisk ) => {
			przycisk.addEventListener( 'click', () => {
				const odpowiedz =
					przycisk.nextElementSibling as HTMLElement | null;
				const ikona =
					przycisk.querySelector< HTMLElement >( '.blok-faq__ikona' );
				const otwarte =
					przycisk.getAttribute( 'aria-expanded' ) === 'true';

				przycisk.setAttribute(
					'aria-expanded',
					otwarte ? 'false' : 'true'
				);
				ikona?.classList.toggle( 'is-open', ! otwarte );

				if ( odpowiedz ) {
					odpowiedz.hidden = otwarte;
				}
			} );
		}
	);
}

document.querySelectorAll< HTMLElement >( '.blok-faq' ).forEach( initFaq );
