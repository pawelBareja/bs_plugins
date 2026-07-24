import { useCallback, createElement } from 'react';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsButtonAttributes } from './types';
import { ICON_LIBRARY } from '../icons';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const IKONA_OPCJE = [
	{ label: '— brak —', value: '' },
	...Object.entries( ICON_LIBRARY ).map( ( [ key, def ] ) => ( {
		label: def.label,
		value: key,
	} ) ),
];

const POZYCJA_OPCJE = [
	{ label: 'Na początku', value: 'start' },
	{ label: 'Na końcu', value: 'end' },
];

const WARIANTY = [
	{ label: 'Biały (czarny tekst)', value: 'bialy' },
	{ label: 'Czerwony (biały tekst)', value: 'czerwony' },
];

const ROZMIARY = [
	{ label: 'Bardzo mały (xs)', value: 'xs' },
	{ label: 'Mały (sm)', value: 'sm' },
	{ label: 'Średni (md)', value: 'md' },
	{ label: 'Duży (lg)', value: 'lg' },
	{ label: 'Pełna szerokość', value: 'full' },
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsButtonAttributes > ) {
	const {
		etykieta,
		url,
		wariant,
		rozmiar,
		nowyTab,
		scrollOffset,
		ikonaId,
		ikonaSvg,
		ikonaPozycja,
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

	const isAnchor = url.startsWith( '#' );
	const btnClass = [
		'blok-przycisk',
		`blok-przycisk--${ wariant }`,
		`blok-przycisk--${ rozmiar }`,
	].join( ' ' );

	const onChangeWariant = useCallback(
		( val: string ) =>
			setAttributes( {
				wariant: val as BsButtonAttributes[ 'wariant' ],
			} ),
		[ setAttributes ]
	);

	const onChangeRozmiar = useCallback(
		( val: string ) =>
			setAttributes( {
				rozmiar: val as BsButtonAttributes[ 'rozmiar' ],
			} ),
		[ setAttributes ]
	);

	const onChangeUrl = useCallback(
		( val: string ) => setAttributes( { url: val } ),
		[ setAttributes ]
	);

	const onChangeOffset = useCallback(
		( val: string ) =>
			setAttributes( { scrollOffset: parseInt( val, 10 ) || 0 } ),
		[ setAttributes ]
	);

	const onChangeNowyTab = useCallback(
		( val: boolean ) => setAttributes( { nowyTab: val } ),
		[ setAttributes ]
	);

	const onChangeEtykieta = useCallback(
		( val: string ) => setAttributes( { etykieta: val } ),
		[ setAttributes ]
	);

	const onChangeIkona = useCallback(
		( val: string ) => {
			const def = ICON_LIBRARY[ val ];
			setAttributes( { ikonaId: val, ikonaSvg: def?.svg ?? '' } );
		},
		[ setAttributes ]
	);

	const onChangeIkonaPozycja = useCallback(
		( val: string ) =>
			setAttributes( {
				ikonaPozycja: val as BsButtonAttributes[ 'ikonaPozycja' ],
			} ),
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Wygląd">
					<SelectControl
						label="Wariant"
						value={ wariant }
						options={ WARIANTY }
						onChange={ onChangeWariant }
					/>
					<SelectControl
						label="Rozmiar"
						value={ rozmiar }
						options={ ROZMIARY }
						onChange={ onChangeRozmiar }
					/>
				</PanelBody>
				<PanelBody title="Ikona" initialOpen={ true }>
					<SelectControl
						label="Ikona"
						value={ ikonaId }
						options={ IKONA_OPCJE }
						onChange={ onChangeIkona }
					/>
					{ ikonaId && (
						<SelectControl
							label="Pozycja"
							value={ ikonaPozycja }
							options={ POZYCJA_OPCJE }
							onChange={ onChangeIkonaPozycja }
						/>
					) }
				</PanelBody>
				<PanelBody title="Link">
					<TextControl
						label="URL"
						value={ url }
						onChange={ onChangeUrl }
						placeholder="https://... lub #id-sekcji"
					/>
					{ isAnchor && (
						<TextControl
							label="Offset przewijania (px)"
							value={ String( scrollOffset ) }
							type="number"
							onChange={ onChangeOffset }
						/>
					) }
					{ ! isAnchor && (
						<ToggleControl
							label="Otwórz w nowym oknie"
							checked={ nowyTab }
							onChange={ onChangeNowyTab }
						/>
					) }
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
				style={ { display: 'inline-block', ...sekcjaStyle } }
			>
				<span className={ btnClass }>
					{ ikonaId &&
						ICON_LIBRARY[ ikonaId ] &&
						ikonaPozycja === 'start' && (
							<span className="blok-przycisk__ikona">
								{ createElement(
									ICON_LIBRARY[ ikonaId ].Component,
									{
										color: 'currentColor',
										weight: 'thin',
										'aria-hidden': true,
									}
								) }
							</span>
						) }
					<RichText
						tagName="span"
						value={ etykieta }
						onChange={ onChangeEtykieta }
						placeholder="Tekst przycisku..."
						allowedFormats={ [] }
					/>
					{ ikonaId &&
						ICON_LIBRARY[ ikonaId ] &&
						ikonaPozycja === 'end' && (
							<span className="blok-przycisk__ikona">
								{ createElement(
									ICON_LIBRARY[ ikonaId ].Component,
									{
										color: 'currentColor',
										weight: 'thin',
										'aria-hidden': true,
									}
								) }
							</span>
						) }
				</span>
			</div>
		</>
	);
}
