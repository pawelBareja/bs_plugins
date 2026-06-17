import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	ColorPalette,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { GridAttributes, ObrazekMedia } from './types';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/separator',
	'core/columns',
	'core/list',
	'bs-plugins/bs-icon',
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< GridAttributes > ) {
	const {
		obrazek,
		tytul,
		tresc,
		obrazekPoLewej,
		kolorTla,
		kolorTekstu,
		arkaObrazka,
		kolorArki,
		ozdobaTekst,
		ozdobaTekstKolor,
		ozdobaLiniaKolor,
		paddingGora,
		paddingDol,
		paddingBoki,
		kolorTlaSekcji,
	} = attributes;

	const sekcjaStyle: React.CSSProperties = {
		...( paddingGora && { paddingTop: paddingGora } ),
		...( paddingDol && { paddingBottom: paddingDol } ),
		...( paddingBoki && { paddingInline: paddingBoki } ),
		...( kolorTlaSekcji && { backgroundColor: kolorTlaSekcji } ),
	};

	const gridClassName = obrazekPoLewej
		? 'blok-grid'
		: 'blok-grid blok-grid--obrazek-prawy';
	const blockProps = useBlockProps( { className: gridClassName } );

	const tekstStyle: React.CSSProperties = {
		...( kolorTla ? { backgroundColor: kolorTla } : {} ),
		...( kolorTekstu ? { color: kolorTekstu } : {} ),
	};
	const hasTekstStyle = Object.keys( tekstStyle ).length > 0;
	const obrazekClassName = arkaObrazka
		? 'blok-grid__obrazek blok-grid__obrazek--arka'
		: 'blok-grid__obrazek';
	const arkaStyle: React.CSSProperties =
		arkaObrazka && kolorArki ? { backgroundColor: kolorArki } : {};

	const onSelectObrazek = useCallback(
		( media: ObrazekMedia ) =>
			setAttributes( {
				obrazek: { id: media.id, url: media.url, alt: media.alt },
			} ),
		[ setAttributes ]
	);
	const onToggleStrona = useCallback(
		( val: boolean ) => setAttributes( { obrazekPoLewej: val } ),
		[ setAttributes ]
	);
	const onChangeKolorTla = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorTla: color ?? undefined } ),
		[ setAttributes ]
	);
	const onChangeKolorTekstu = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorTekstu: color ?? undefined } ),
		[ setAttributes ]
	);
	const onToggleArka = useCallback(
		( val: boolean ) => setAttributes( { arkaObrazka: val } ),
		[ setAttributes ]
	);
	const onChangeKolorArki = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorArki: color ?? undefined } ),
		[ setAttributes ]
	);
	const onChangeTytul = useCallback(
		( val: string ) => setAttributes( { tytul: val } ),
		[ setAttributes ]
	);
	const onChangeTresc = useCallback(
		( val: string ) => setAttributes( { tresc: val } ),
		[ setAttributes ]
	);
	const onChangeOzdobaTekst = useCallback(
		( val: string ) => setAttributes( { ozdobaTekst: val } ),
		[ setAttributes ]
	);
	const onChangeOzdobaTekstKolor = useCallback(
		( color: string | undefined ) =>
			setAttributes( { ozdobaTekstKolor: color ?? undefined } ),
		[ setAttributes ]
	);
	const onChangeOzdobaLiniaKolor = useCallback(
		( color: string | undefined ) =>
			setAttributes( { ozdobaLiniaKolor: color ?? undefined } ),
		[ setAttributes ]
	);

	const kolumnaObrazek = (
		<div
			className={ obrazekClassName }
			style={ Object.keys( arkaStyle ).length ? arkaStyle : undefined }
		>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ ( media ) =>
						onSelectObrazek( media as ObrazekMedia )
					}
					allowedTypes={ [ 'image' ] }
					value={ obrazek?.id }
					render={ ( { open } ) =>
						obrazek ? (
							// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
							<img
								src={ obrazek.url }
								alt={ obrazek.alt }
								onClick={ open }
								style={ {
									cursor: 'pointer',
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									display: 'block',
								} }
							/>
						) : (
							<Button onClick={ open } variant="secondary">
								Dodaj obrazek
							</Button>
						)
					}
				/>
			</MediaUploadCheck>
			{ ozdobaLiniaKolor && (
				<div
					className="blok-grid__ozdoba-linia"
					style={ { backgroundColor: ozdobaLiniaKolor } }
				/>
			) }
			{ ozdobaTekstKolor && (
				<div
					className="blok-grid__ozdoba-tekst"
					style={ { color: ozdobaTekstKolor } }
				>
					{ ozdobaTekst || 'Tekst dekoracyjny' }
				</div>
			) }
		</div>
	);

	const kolumnaTekst = (
		<div
			className="blok-grid__tekst"
			style={ hasTekstStyle ? tekstStyle : undefined }
		>
			<RichText
				tagName="h3"
				className="blok-grid__tytul"
				value={ tytul ?? '' }
				onChange={ onChangeTytul }
				placeholder="Tytuł (opcjonalny)..."
			/>
			<RichText
				tagName="p"
				className="blok-grid__tresc"
				value={ tresc ?? '' }
				onChange={ onChangeTresc }
				placeholder="Treść (opcjonalna)..."
			/>
			<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
		</div>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Układ">
					<ToggleControl
						label="Obrazek po lewej"
						checked={ obrazekPoLewej }
						onChange={ onToggleStrona }
					/>
					<ToggleControl
						label="Kształt arki"
						checked={ arkaObrazka ?? false }
						onChange={ onToggleArka }
					/>
				</PanelBody>
				{ arkaObrazka && (
					<PanelBody title="Kolor tła arki">
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ kolorArki }
							onChange={ onChangeKolorArki }
							disableCustomColors
						/>
					</PanelBody>
				) }
				{ arkaObrazka && (
					<PanelBody title="Dekoracje arki">
						<p
							style={ {
								fontSize: '11px',
								color: '#757575',
								marginTop: 0,
							} }
						>
							Linia (prawa strona)
						</p>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ ozdobaLiniaKolor }
							onChange={ onChangeOzdobaLiniaKolor }
							disableCustomColors
						/>
						<p style={ { fontSize: '11px', color: '#757575' } }>
							Tekst pionowy (lewa strona)
						</p>
						<TextControl
							label="Treść tekstu"
							value={ ozdobaTekst ?? '' }
							onChange={ onChangeOzdobaTekst }
						/>
						<ColorPalette
							colors={ BRAND_COLORS }
							value={ ozdobaTekstKolor }
							onChange={ onChangeOzdobaTekstKolor }
							disableCustomColors
						/>
					</PanelBody>
				) }
				<PanelBody title="Kolor tła sekcji tekstu">
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorTla }
						onChange={ onChangeKolorTla }
						disableCustomColors
					/>
				</PanelBody>
				<PanelBody title="Kolor tekstu">
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorTekstu }
						onChange={ onChangeKolorTekstu }
						disableCustomColors
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

			<div { ...blockProps } style={ sekcjaStyle }>
				{ obrazekPoLewej ? kolumnaObrazek : kolumnaTekst }
				{ obrazekPoLewej ? kolumnaTekst : kolumnaObrazek }
			</div>
		</>
	);
}
