import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsKartyAttributes, KartaItem, ObrazekMedia } from './types';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const WARIANTY = [
	{ label: 'Czerwony (biały tekst)', value: 'czerwony' },
	{ label: 'Biały (czarny tekst)', value: 'bialy' },
	{ label: 'Tylko tekst', value: 'tekst' },
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsKartyAttributes > ) {
	const {
		liczbaElementow,
		elementy,
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

	const widoczne = elementy.slice( 0, liczbaElementow );

	const updateElement = useCallback(
		( index: number, patch: Partial< KartaItem > ) => {
			const updated = elementy.map( ( el, i ) =>
				i === index ? { ...el, ...patch } : el
			);
			setAttributes( { elementy: updated } );
		},
		[ elementy, setAttributes ]
	);

	const onChangeLiczba = useCallback(
		( val: number | undefined ) =>
			setAttributes( { liczbaElementow: val ?? 3 } ),
		[ setAttributes ]
	);

	const onSelectObrazek = useCallback(
		( index: number, media: ObrazekMedia ) =>
			updateElement( index, {
				obrazek: { id: media.id, url: media.url, alt: media.alt },
			} ),
		[ updateElement ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Układ">
					<RangeControl
						label="Liczba kart"
						value={ liczbaElementow }
						onChange={ onChangeLiczba }
						min={ 1 }
						max={ 5 }
					/>
				</PanelBody>
				{ widoczne.map( ( el, i ) => (
					<PanelBody
						key={ i }
						title={ `Karta ${ i + 1 }` }
						initialOpen={ i === 0 }
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) =>
									onSelectObrazek( i, media as ObrazekMedia )
								}
								allowedTypes={ [ 'image' ] }
								value={ el.obrazek?.id }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="secondary"
									>
										{ el.obrazek
											? 'Zmień obrazek'
											: 'Dodaj obrazek' }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						{ el.obrazek && (
							<Button
								onClick={ () =>
									updateElement( i, { obrazek: null } )
								}
								variant="link"
								isDestructive
							>
								Usuń obrazek
							</Button>
						) }
						<ToggleControl
							label="Kształt arki"
							checked={ el.arkaObrazka }
							onChange={ ( val ) =>
								updateElement( i, { arkaObrazka: val } )
							}
						/>
						<p>Kolor tła karty</p>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ el.kolorTla }
							onChange={ ( color ) =>
								updateElement( i, { kolorTla: color ?? '' } )
							}
							disableCustomColors
						/>
						<p>Kolor tekstu</p>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ el.kolorTekstu }
							onChange={ ( color ) =>
								updateElement( i, { kolorTekstu: color ?? '' } )
							}
							disableCustomColors
						/>
						<TextControl
							label="Link przycisku"
							value={ el.przyciskUrl }
							onChange={ ( val ) =>
								updateElement( i, { przyciskUrl: val } )
							}
							placeholder="https://..."
						/>
						<SelectControl
							label="Wariant przycisku"
							value={ el.przyciskWariant }
							options={ WARIANTY }
							onChange={ ( val ) =>
								updateElement( i, {
									przyciskWariant:
										val as KartaItem[ 'przyciskWariant' ],
								} )
							}
						/>
						<p>Linia ozdobna (kolor)</p>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ el.ozdobaLiniaKolor }
							onChange={ ( color ) =>
								updateElement( i, {
									ozdobaLiniaKolor: color ?? '',
								} )
							}
							disableCustomColors
						/>
					</PanelBody>
				) ) }
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
				className="blok-karty"
				style={
					{
						'--bs-karty-cols': liczbaElementow,
						...sekcjaStyle,
					} as React.CSSProperties
				}
			>
				{ widoczne.map( ( el, i ) => {
					const kartaStyle: React.CSSProperties = {
						...( el.kolorTla
							? { backgroundColor: el.kolorTla }
							: {} ),
						...( el.kolorTekstu ? { color: el.kolorTekstu } : {} ),
					};
					const obrazekClassName = el.arkaObrazka
						? 'blok-karty__obrazek blok-karty__obrazek--arka'
						: 'blok-karty__obrazek';
					const btnClassName =
						el.przyciskWariant === 'tekst'
							? 'blok-karty__przycisk blok-karty__przycisk--tekst'
							: [
									'blok-przycisk',
									`blok-przycisk--${ el.przyciskWariant }`,
									'blok-przycisk--md',
									'blok-karty__przycisk',
							  ].join( ' ' );

					return (
						<div
							key={ i }
							className="blok-karty__karta"
							style={
								Object.keys( kartaStyle ).length
									? kartaStyle
									: undefined
							}
						>
							<div className={ obrazekClassName }>
								{ el.ozdobaLiniaKolor && (
									<div
										className="blok-karty__ozdoba-linia"
										style={ {
											backgroundColor:
												el.ozdobaLiniaKolor,
										} }
									/>
								) }
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) =>
											onSelectObrazek(
												i,
												media as ObrazekMedia
											)
										}
										allowedTypes={ [ 'image' ] }
										value={ el.obrazek?.id }
										render={ ( { open } ) =>
											el.obrazek ? (
												// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
												<img
													src={ el.obrazek.url }
													alt={ el.obrazek.alt }
													onClick={ open }
													style={ {
														cursor: 'pointer',
														width: '100%',
														display: 'block',
													} }
												/>
											) : (
												<Button
													onClick={ open }
													variant="secondary"
												>
													Dodaj obrazek
												</Button>
											)
										}
									/>
								</MediaUploadCheck>
							</div>
							<div className="blok-karty__tresc">
								<RichText
									tagName="h3"
									className="blok-karty__tytul"
									value={ el.tytul }
									onChange={ ( val ) =>
										updateElement( i, { tytul: val } )
									}
									placeholder="Tytuł..."
									allowedFormats={ [] }
								/>
								<RichText
									tagName="p"
									className="blok-karty__opis"
									value={ el.tresc }
									onChange={ ( val ) =>
										updateElement( i, { tresc: val } )
									}
									placeholder="Treść..."
								/>
								<RichText
									tagName="span"
									className={ btnClassName }
									value={ el.przyciskEtykieta }
									onChange={ ( val ) =>
										updateElement( i, {
											przyciskEtykieta: val,
										} )
									}
									placeholder="Tekst przycisku..."
									allowedFormats={ [] }
								/>
							</div>
						</div>
					);
				} ) }
			</div>
		</>
	);
}
