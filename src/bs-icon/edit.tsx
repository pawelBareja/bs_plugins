import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	useBlockProps,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsIconAttributes } from './types';
import { ICON_ENTRIES, ICON_LIBRARY, WEIGHT_OPTIONS } from '../icons';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const MIN_ROZMIAR = 16;
const MAX_ROZMIAR = 120;

function buildSvg( nazwaKlucz: string, waga: string ): string {
	const def = ICON_LIBRARY[ nazwaKlucz ];
	if ( ! def ) return '';
	return renderToStaticMarkup(
		createElement( def.Component, {
			color: 'currentColor',
			weight: waga,
			'aria-hidden': true,
		} )
	);
}

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsIconAttributes > ) {
	const {
		ikona,
		ikonaNazwa,
		ikonaWaga,
		rozmiar,
		kolor,
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

	const style = {
		'--bs-icon-size': `${ rozmiar }px`,
		'--bs-icon-color': kolor,
		...sekcjaStyle,
	} as React.CSSProperties;

	const blockProps = useBlockProps( { className: 'blok-icon', style } );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ikona">
					<div className="bs-icon-picker">
						{ ICON_ENTRIES.map( ( [ key, def ] ) => (
							<button
								key={ key }
								type="button"
								title={ def.label }
								aria-label={ def.label }
								aria-pressed={ ikonaNazwa === key }
								className={
									ikonaNazwa === key
										? 'bs-icon-picker__btn is-active'
										: 'bs-icon-picker__btn'
								}
								onClick={ () =>
									setAttributes( {
										ikonaNazwa: key,
										ikona: buildSvg( key, ikonaWaga || 'thin' ),
									} )
								}
								dangerouslySetInnerHTML={ { __html: def.svg } }
							/>
						) ) }
					</div>
				</PanelBody>
				<PanelBody title="Wygląd">
					<SelectControl
						label="Grubość kreski"
						value={ ikonaWaga || 'thin' }
						options={ WEIGHT_OPTIONS }
						onChange={ ( val ) => {
							const newSvg = ikonaNazwa
								? buildSvg( ikonaNazwa, val )
								: ikona;
							setAttributes( { ikonaWaga: val, ikona: newSvg } );
						} }
					/>
					<RangeControl
						label="Rozmiar (px)"
						value={ rozmiar }
						onChange={ ( val ) =>
							setAttributes( { rozmiar: val ?? 48 } )
						}
						min={ MIN_ROZMIAR }
						max={ MAX_ROZMIAR }
					/>
					<p>Kolor</p>
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolor }
						onChange={ ( val ) =>
							setAttributes( { kolor: val ?? '#fff' } )
						}
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

			<span
				{ ...blockProps }
				dangerouslySetInnerHTML={ { __html: ikona } }
			/>
		</>
	);
}
