import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsButtonAttributes } from './types';
import './editor.scss';

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
	const { etykieta, url, wariant, rozmiar, nowyTab, scrollOffset } = attributes;
	const blockProps = useBlockProps();

	const isAnchor = url.startsWith( '#' );
	const btnClass = [ 'blok-przycisk', `blok-przycisk--${ wariant }`, `blok-przycisk--${ rozmiar }` ].join( ' ' );

	const onChangeWariant = useCallback(
		( val: string ) => setAttributes( { wariant: val as BsButtonAttributes[ 'wariant' ] } ),
		[ setAttributes ]
	);

	const onChangeRozmiar = useCallback(
		( val: string ) => setAttributes( { rozmiar: val as BsButtonAttributes[ 'rozmiar' ] } ),
		[ setAttributes ]
	);

	const onChangeUrl = useCallback(
		( val: string ) => setAttributes( { url: val } ),
		[ setAttributes ]
	);

	const onChangeOffset = useCallback(
		( val: string ) => setAttributes( { scrollOffset: parseInt( val, 10 ) || 0 } ),
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
			</InspectorControls>

			<div { ...blockProps } style={ { display: 'inline-block' } }>
				<RichText
					tagName="span"
					className={ btnClass }
					value={ etykieta }
					onChange={ onChangeEtykieta }
					placeholder="Tekst przycisku..."
					allowedFormats={ [] }
				/>
			</div>
		</>
	);
}
