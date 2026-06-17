import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsProduktySliderAttributes, ZrodloProduktow } from './types';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const PLACEHOLDER_PRODUKTY = [
	{ nazwa: 'Różowa Eustoma', cena: '230,00 zł' },
	{ nazwa: 'Różowy Tulipan', cena: '135,00 zł' },
	{ nazwa: 'Biała Róża', cena: '220,00 zł' },
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsProduktySliderAttributes > ) {
	const {
		zrodloProduktow,
		kategoriaSlug,
		tagSlug,
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
					<RangeControl
						label="Liczba produktów"
						value={ liczbaProduktow }
						onChange={ ( val ) =>
							setAttributes( { liczbaProduktow: val ?? 5 } )
						}
						min={ 2 }
						max={ 12 }
					/>
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
					.
				</p>
				<div className="blok-produkty-slider__track">
					{ PLACEHOLDER_PRODUKTY.map( ( p, i ) => (
						<div key={ i } className="blok-produkty-slider__slide">
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
				<div className="blok-produkty-slider__dots">
					{ PLACEHOLDER_PRODUKTY.map( ( _p, i ) => (
						<span
							key={ i }
							className={
								i === 0
									? 'blok-produkty-slider__dot is-active'
									: 'blok-produkty-slider__dot'
							}
						/>
					) ) }
				</div>
			</div>
		</>
	);
}
