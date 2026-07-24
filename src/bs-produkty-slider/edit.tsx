import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
	FormTokenField,
} from '@wordpress/components';
import { useDebouncedInput } from '@wordpress/compose';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsProduktySliderAttributes, ZrodloProduktow } from './types';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const PLACEHOLDER_PRODUKTY = [
	{ nazwa: 'Różowa Eustoma', cena: '230,00 zł' },
	{ nazwa: 'Różowy Tulipan', cena: '135,00 zł' },
	{ nazwa: 'Biała Róża', cena: '220,00 zł' },
];

type ProduktZeSklepu = { id: number; name: string };

const pobierzProdukty = (
	query: Record< string, string | number | number[] >
) =>
	apiFetch< ProduktZeSklepu[] >( {
		path: addQueryArgs( '/wc/store/v1/products', {
			_fields: [ 'id', 'name' ],
			...query,
		} ),
	} );

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsProduktySliderAttributes > ) {
	const {
		zrodloProduktow,
		kategoriaSlug,
		tagSlug,
		wybraneProdukty,
		liczbaProduktow,
		predkosc,
		tekstPrzycisku,
		paddingGora,
		paddingDol,
		paddingBoki,
		kolorTlaSekcji,
	} = attributes;
	const blockProps = useBlockProps();

	const sekcjaStyle: React.CSSProperties = {
		...( paddingGora && { paddingTop: paddingGora } ),
		...( paddingDol && { paddingBottom: paddingDol } ),
		...( paddingBoki && { paddingInline: paddingBoki } ),
		...( kolorTlaSekcji && { backgroundColor: kolorTlaSekcji } ),
	};

	// Wyszukiwarka produktów do ręcznego wyboru (tryb "wybrane").
	const [ , setFraza, frazaDebounced ] = useDebouncedInput( '' );
	const [ sugestie, setSugestie ] = useState< ProduktZeSklepu[] >( [] );
	const [ etykiety, setEtykiety ] = useState< Record< number, string > >(
		{}
	);
	// Mapa etykieta -> id, żeby po onChange z FormTokenField (który operuje
	// na samych stringach) odtworzyć, jakie ID zostały wybrane/odznaczone.
	const etykietaDoId = useRef( new Map< string, number >() );

	useEffect( () => {
		if ( zrodloProduktow !== 'wybrane' || ! frazaDebounced ) {
			setSugestie( [] );
			return;
		}
		let unieważniony = false;
		pobierzProdukty( { search: frazaDebounced, per_page: 20 } )
			.then( ( wyniki ) => {
				if ( unieważniony ) {
					return;
				}
				wyniki.forEach( ( p ) =>
					etykietaDoId.current.set( p.name, p.id )
				);
				setSugestie( wyniki );
			} )
			.catch( () => setSugestie( [] ) );
		return () => {
			unieważniony = true;
		};
	}, [ frazaDebounced, zrodloProduktow ] );

	// Dociągnij nazwy już zapisanych ID (np. po wczytaniu istniejącego bloku).
	useEffect( () => {
		const brakujace = wybraneProdukty.filter(
			( id ) => ! ( id in etykiety )
		);
		if ( zrodloProduktow !== 'wybrane' || ! brakujace.length ) {
			return;
		}
		let unieważniony = false;
		pobierzProdukty( { include: brakujace, per_page: brakujace.length } )
			.then( ( wyniki ) => {
				if ( unieważniony ) {
					return;
				}
				setEtykiety( ( prev ) => {
					const nowe = { ...prev };
					wyniki.forEach( ( p ) => {
						nowe[ p.id ] = p.name;
						etykietaDoId.current.set( p.name, p.id );
					} );
					return nowe;
				} );
			} )
			.catch( () => {} );
		return () => {
			unieważniony = true;
		};
		// etykiety celowo pominięte w zależnościach — inaczej setEtykiety
		// wyżej wywoływałoby ten sam efekt w kółko.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ wybraneProdukty, zrodloProduktow ] );

	const tokenyProduktow = wybraneProdukty.map( ( id ) => {
		const etykieta = etykiety[ id ] ?? `#${ id }`;
		etykietaDoId.current.set( etykieta, id );
		return etykieta;
	} );

	const onChangeWybraneProdukty = useCallback(
		( noweTokeny: ( string | { value: string } )[] ) => {
			const noweId = noweTokeny
				.map( ( token ) =>
					typeof token === 'string' ? token : token.value
				)
				.map( ( etykieta ) => etykietaDoId.current.get( etykieta ) )
				.filter( ( id ): id is number => typeof id === 'number' );
			setAttributes( { wybraneProdukty: noweId } );
		},
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Źródło produktów" initialOpen={ true }>
					<SelectControl
						label="Pokaż produkty"
						value={ zrodloProduktow }
						options={ [
							{ label: 'Najnowsze', value: 'najnowsze' },
							{ label: 'Z kategorii', value: 'kategoria' },
							{ label: 'Z tagu', value: 'tag' },
							{ label: 'Wybrane produkty', value: 'wybrane' },
						] }
						onChange={ ( val ) =>
							setAttributes( {
								zrodloProduktow: val as ZrodloProduktow,
							} )
						}
					/>
					{ zrodloProduktow === 'kategoria' && (
						<TextControl
							label="Slug kategorii produktu"
							value={ kategoriaSlug }
							placeholder="np. bukiety"
							onChange={ ( val ) =>
								setAttributes( { kategoriaSlug: val } )
							}
						/>
					) }
					{ zrodloProduktow === 'tag' && (
						<TextControl
							label="Slug tagu produktu"
							value={ tagSlug }
							placeholder="np. promocja"
							onChange={ ( val ) =>
								setAttributes( { tagSlug: val } )
							}
						/>
					) }
					{ zrodloProduktow === 'wybrane' && (
						<FormTokenField
							label="Wybierz produkty"
							value={ tokenyProduktow }
							suggestions={ sugestie.map( ( p ) => p.name ) }
							onInputChange={ setFraza }
							onChange={ onChangeWybraneProdukty }
							placeholder="Szukaj produktu po nazwie..."
							__experimentalExpandOnFocus
							__next40pxDefaultSize
						/>
					) }
					{ zrodloProduktow !== 'wybrane' && (
						<RangeControl
							label="Liczba produktów"
							value={ liczbaProduktow }
							onChange={ ( val ) =>
								setAttributes( { liczbaProduktow: val ?? 5 } )
							}
							min={ 2 }
							max={ 12 }
						/>
					) }
				</PanelBody>
				<PanelBody title="Slider" initialOpen={ false }>
					<RangeControl
						label="Szybkość przewijania (s)"
						value={ predkosc }
						onChange={ ( val ) =>
							setAttributes( { predkosc: val ?? 4 } )
						}
						min={ 2 }
						max={ 10 }
					/>
					<TextControl
						label="Tekst przycisku"
						value={ tekstPrzycisku }
						onChange={ ( val ) =>
							setAttributes( { tekstPrzycisku: val } )
						}
					/>
				</PanelBody>
				<SectionControls
					paddingGora={ paddingGora }
					paddingDol={ paddingDol }
					paddingBoki={ paddingBoki }
					kolorTlaSekcji={ kolorTlaSekcji }
					onChange={ setAttributes }
				/>
			</InspectorControls>

			<div
				{ ...blockProps }
				className="blok-produkty-slider blok-produkty-slider--podglad"
				style={ sekcjaStyle }
			>
				<p className="blok-produkty-slider__info">
					Podgląd przykładowy — na stronie wyświetlą się produkty z
					WooCommerce
					{ zrodloProduktow === 'kategoria' &&
						( kategoriaSlug
							? ` z kategorii „${ kategoriaSlug }”`
							: ' — wybierz kategorię' ) }
					{ zrodloProduktow === 'tag' &&
						( tagSlug
							? ` z tagiem „${ tagSlug }”`
							: ' — wybierz tag' ) }
					{ zrodloProduktow === 'najnowsze' &&
						` (najnowsze ${ liczbaProduktow })` }
					{ zrodloProduktow === 'wybrane' &&
						( wybraneProdukty.length
							? ` — wybranych produktów: ${ wybraneProdukty.length }`
							: ' — wybierz produkty w panelu bocznym' ) }
					.
				</p>
				<button
					type="button"
					className="blok-produkty-slider__nav blok-produkty-slider__nav--prev is-hidden"
					aria-label="Poprzedni produkt"
					tabIndex={ -1 }
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={ 2 }
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>
				<div className="blok-produkty-slider__viewport">
					<div className="blok-produkty-slider__track">
						{ PLACEHOLDER_PRODUKTY.map( ( p, i ) => (
							<div
								key={ i }
								className="blok-produkty-slider__slide"
							>
								<div
									className="blok-produkty-slider__obrazek blok-produkty-slider__obrazek--placeholder"
									aria-hidden="true"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 48 48"
										fill="currentColor"
									>
										<circle
											cx="24"
											cy="15"
											r="8"
											opacity="0.5"
										/>
										<circle
											cx="33"
											cy="24"
											r="8"
											opacity="0.5"
										/>
										<circle
											cx="24"
											cy="33"
											r="8"
											opacity="0.5"
										/>
										<circle
											cx="15"
											cy="24"
											r="8"
											opacity="0.5"
										/>
										<circle cx="24" cy="24" r="6" />
									</svg>
								</div>
								<h3 className="blok-produkty-slider__nazwa">
									{ p.nazwa }
								</h3>
								<div className="blok-produkty-slider__cena">
									{ p.cena }
								</div>
								<span className="blok-produkty-slider__przycisk">
									{ tekstPrzycisku }
								</span>
							</div>
						) ) }
					</div>
				</div>
				<button
					type="button"
					className="blok-produkty-slider__nav blok-produkty-slider__nav--next"
					aria-label="Następny produkt"
					tabIndex={ -1 }
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={ 2 }
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>
		</>
	);
}
