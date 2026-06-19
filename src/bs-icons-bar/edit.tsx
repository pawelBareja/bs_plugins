import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Fragment, useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsIconsBarAttributes, IconBarItem } from './types';
import { ICON_ENTRIES, ICON_LIBRARY, WAVE_SVG, WEIGHT_OPTIONS } from '../icons';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const MIN_ELEMENTOW = 2;
const MAX_ELEMENTOW = 5;

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
}: BlockEditProps< BsIconsBarAttributes > ) {
	const {
		liczbaElementow,
		elementy,
		ikonaWaga,
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
		( index: number, patch: Partial< IconBarItem > ) => {
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

	const onChangeWaga = useCallback(
		( val: string ) => {
			const updated = elementy.map( ( el ) => ( {
				...el,
				ikona: el.ikonaNazwa
					? buildSvg( el.ikonaNazwa, val )
					: el.ikona,
			} ) );
			setAttributes( { ikonaWaga: val, elementy: updated } );
		},
		[ elementy, setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Układ">
					<RangeControl
						label="Liczba elementów"
						value={ liczbaElementow }
						onChange={ onChangeLiczba }
						min={ MIN_ELEMENTOW }
						max={ MAX_ELEMENTOW }
					/>
					<SelectControl
						label="Grubość ikon"
						value={ ikonaWaga || 'thin' }
						options={ WEIGHT_OPTIONS }
						onChange={ onChangeWaga }
					/>
				</PanelBody>
				{ widoczne.map( ( el, i ) => (
					<PanelBody
						key={ i }
						title={ `Ikona ${ i + 1 }` }
						initialOpen={ i === 0 }
					>
						<div className="bs-icons-bar-picker">
							{ ICON_ENTRIES.map( ( [ key, def ] ) => (
								<button
									key={ key }
									type="button"
									title={ def.label }
									aria-label={ def.label }
									aria-pressed={ el.ikonaNazwa === key }
									className={
										el.ikonaNazwa === key
											? 'bs-icons-bar-picker__btn is-active'
											: 'bs-icons-bar-picker__btn'
									}
									onClick={ () =>
										updateElement( i, {
											ikonaNazwa: key,
											ikona: buildSvg(
												key,
												ikonaWaga || 'thin'
											),
										} )
									}
									dangerouslySetInnerHTML={ {
										__html: def.svg,
									} }
								/>
							) ) }
						</div>
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
				className="blok-icons-bar"
				style={ sekcjaStyle }
			>
				{ widoczne.map( ( el, i ) => (
					<Fragment key={ i }>
						{ i > 0 && (
							<span
								className="blok-icons-bar__divider"
								dangerouslySetInnerHTML={ { __html: WAVE_SVG } }
							/>
						) }
						<div className="blok-icons-bar__item">
							<span
								className="blok-icons-bar__icon"
								dangerouslySetInnerHTML={ { __html: el.ikona } }
							/>
							<RichText
								tagName="span"
								className="blok-icons-bar__tekst"
								value={ el.tekst }
								onChange={ ( val ) =>
									updateElement( i, { tekst: val } )
								}
								placeholder="Tekst (opcjonalny)..."
								allowedFormats={ [] }
							/>
						</div>
					</Fragment>
				) ) }
			</div>
		</>
	);
}
