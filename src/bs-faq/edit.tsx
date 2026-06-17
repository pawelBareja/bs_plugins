import { useCallback, useState } from 'react';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsFaqAttributes, FaqKategoria, FaqPytanie } from './types';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const nowaKategoria = (): FaqKategoria => ( {
	nazwa: 'Nowa kategoria',
	pytania: [ { pytanie: '', odpowiedz: '' } ],
} );

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsFaqAttributes > ) {
	const { kategorie, paddingGora, paddingDol, paddingBoki, kolorTlaSekcji } =
		attributes;
	const blockProps = useBlockProps();

	const sekcjaStyle: React.CSSProperties = {
		...( paddingGora && { paddingTop: paddingGora } ),
		...( paddingDol && { paddingBottom: paddingDol } ),
		...( paddingBoki && { paddingInline: paddingBoki } ),
		...( kolorTlaSekcji && { backgroundColor: kolorTlaSekcji } ),
	};

	const [ aktywnaKategoria, setAktywnaKategoria ] = useState( 0 );
	const [ otwartePytanie, setOtwartePytanie ] = useState< number | null >(
		null
	);
	const aktywnyIndex = Math.min( aktywnaKategoria, kategorie.length - 1 );
	const aktywna = kategorie[ aktywnyIndex ];

	const wybierzKategorie = useCallback( ( index: number ) => {
		setAktywnaKategoria( index );
		setOtwartePytanie( null );
	}, [] );

	const togglePytanie = useCallback( ( index: number ) => {
		setOtwartePytanie( ( prev ) => ( prev === index ? null : index ) );
	}, [] );

	const updateKategoriaNazwa = useCallback(
		( index: number, nazwa: string ) => {
			setAttributes( {
				kategorie: kategorie.map( ( k, i ) =>
					i === index ? { ...k, nazwa } : k
				),
			} );
		},
		[ kategorie, setAttributes ]
	);

	const addKategoria = useCallback( () => {
		setAttributes( { kategorie: [ ...kategorie, nowaKategoria() ] } );
		setAktywnaKategoria( kategorie.length );
	}, [ kategorie, setAttributes ] );

	const removeKategoria = useCallback(
		( index: number ) => {
			const updated = kategorie.filter( ( _, i ) => i !== index );
			setAttributes( { kategorie: updated } );
			setAktywnaKategoria( ( prev ) =>
				Math.min( prev, updated.length - 1 )
			);
		},
		[ kategorie, setAttributes ]
	);

	const updatePytanie = useCallback(
		(
			katIndex: number,
			pytIndex: number,
			patch: Partial< FaqPytanie >
		) => {
			setAttributes( {
				kategorie: kategorie.map( ( k, i ) =>
					i === katIndex
						? {
								...k,
								pytania: k.pytania.map( ( p, j ) =>
									j === pytIndex ? { ...p, ...patch } : p
								),
						  }
						: k
				),
			} );
		},
		[ kategorie, setAttributes ]
	);

	const addPytanie = useCallback(
		( katIndex: number ) => {
			setAttributes( {
				kategorie: kategorie.map( ( k, i ) =>
					i === katIndex
						? {
								...k,
								pytania: [
									...k.pytania,
									{ pytanie: '', odpowiedz: '' },
								],
						  }
						: k
				),
			} );
		},
		[ kategorie, setAttributes ]
	);

	const removePytanie = useCallback(
		( katIndex: number, pytIndex: number ) => {
			setAttributes( {
				kategorie: kategorie.map( ( k, i ) =>
					i === katIndex
						? {
								...k,
								pytania: k.pytania.filter(
									( _, j ) => j !== pytIndex
								),
						  }
						: k
				),
			} );
		},
		[ kategorie, setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Kategorie" initialOpen={ true }>
					{ kategorie.map( ( kat, i ) => (
						<div key={ i } className="bs-faq-row">
							<Button
								variant={
									i === aktywnyIndex ? 'primary' : 'secondary'
								}
								onClick={ () => wybierzKategorie( i ) }
							>
								{ kat.nazwa || `Kategoria ${ i + 1 }` }
							</Button>
							<Button
								variant="link"
								className="bs-faq-row__usun"
								disabled={ kategorie.length <= 1 }
								onClick={ () => removeKategoria( i ) }
							>
								Usuń
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addKategoria }>
						+ Dodaj kategorię
					</Button>
				</PanelBody>
				<PanelBody
					title={ `Pytania — ${ aktywna?.nazwa || '' }` }
					initialOpen={ false }
				>
					{ aktywna?.pytania.map( ( p, j ) => (
						<div key={ j } className="bs-faq-row">
							<span className="bs-faq-row__label">
								{ p.pytanie || `Pytanie ${ j + 1 }` }
							</span>
							<Button
								variant="link"
								className="bs-faq-row__usun"
								disabled={ aktywna.pytania.length <= 1 }
								onClick={ () =>
									removePytanie( aktywnyIndex, j )
								}
							>
								Usuń
							</Button>
						</div>
					) ) }
					<Button
						variant="secondary"
						onClick={ () => addPytanie( aktywnyIndex ) }
					>
						+ Dodaj pytanie
					</Button>
				</PanelBody>
				<SectionControls
					paddingGora={ paddingGora }
					paddingDol={ paddingDol }
					paddingBoki={ paddingBoki }
					kolorTlaSekcji={ kolorTlaSekcji }
					onChange={ setAttributes }
				/>
			</InspectorControls>

			<div { ...blockProps } className="blok-faq" style={ sekcjaStyle }>
				<div className="blok-faq__sidebar">
					<h2 className="blok-faq__marka">FAQ</h2>
					<ul className="blok-faq__taby">
						{ kategorie.map( ( kat, i ) => (
							<li key={ i }>
								<div
									role="button"
									tabIndex={ 0 }
									onClick={ () => wybierzKategorie( i ) }
									onKeyDown={ ( e ) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											wybierzKategorie( i );
										}
									} }
								>
									<RichText
										tagName="span"
										className={
											i === aktywnyIndex
												? 'blok-faq__tab is-active'
												: 'blok-faq__tab'
										}
										value={ kat.nazwa }
										onChange={ ( val ) =>
											updateKategoriaNazwa( i, val )
										}
										allowedFormats={ [] }
										placeholder="Nazwa kategorii..."
									/>
								</div>
							</li>
						) ) }
					</ul>
				</div>

				<div className="blok-faq__content">
					<h3 className="blok-faq__panel-tytul">
						{ aktywna?.nazwa }
					</h3>
					<div className="blok-faq__lista">
						{ aktywna?.pytania.map( ( p, j ) => {
							const otwarte = otwartePytanie === j;

							return (
								<div key={ j } className="blok-faq__pozycja">
									<div
										className={
											otwarte
												? 'blok-faq__pytanie-wiersz is-open'
												: 'blok-faq__pytanie-wiersz'
										}
										role="button"
										tabIndex={ 0 }
										onClick={ () => togglePytanie( j ) }
										onKeyDown={ ( e ) => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												togglePytanie( j );
											}
										} }
									>
										<RichText
											tagName="span"
											className="blok-faq__pytanie-tekst"
											value={ p.pytanie }
											onChange={ ( val ) =>
												updatePytanie(
													aktywnyIndex,
													j,
													{
														pytanie: val,
													}
												)
											}
											allowedFormats={ [] }
											placeholder="Pytanie..."
										/>
										<span
											className={
												otwarte
													? 'blok-faq__ikona is-open'
													: 'blok-faq__ikona'
											}
											aria-hidden="true"
										/>
									</div>
									{ otwarte && (
										<RichText
											tagName="div"
											className="blok-faq__odpowiedz"
											value={ p.odpowiedz }
											onChange={ ( val ) =>
												updatePytanie(
													aktywnyIndex,
													j,
													{
														odpowiedz: val,
													}
												)
											}
											placeholder="Odpowiedź (opcjonalnie)..."
										/>
									) }
								</div>
							);
						} ) }
					</div>
				</div>
			</div>
		</>
	);
}
