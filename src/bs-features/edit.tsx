import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsFeaturesAttributes, FeatureItem } from './types';
import './editor.scss';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsFeaturesAttributes > ) {
	const { liczbaElementow, elementy } = attributes;
	const blockProps = useBlockProps();

	const widoczne = elementy.slice( 0, liczbaElementow );

	const updateElement = useCallback(
		( index: number, patch: Partial< FeatureItem > ) => {
			const updated = elementy.map( ( el, i ) =>
				i === index ? { ...el, ...patch } : el
			);
			setAttributes( { elementy: updated } );
		},
		[ elementy, setAttributes ]
	);

	const onChangeLiczba = useCallback(
		( val: number | undefined ) => setAttributes( { liczbaElementow: val ?? 3 } ),
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Układ">
					<RangeControl
						label="Liczba elementów"
						value={ liczbaElementow }
						onChange={ onChangeLiczba }
						min={ 1 }
						max={ 5 }
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...blockProps }
				className="blok-features"
				style={ { '--bs-features-cols': liczbaElementow } as React.CSSProperties }
			>
				{ widoczne.map( ( el, i ) => (
					<div key={ i } className="blok-features__element">
						<RichText
							tagName="p"
							className="blok-features__numer"
							value={ el.numer }
							onChange={ ( val ) => updateElement( i, { numer: val } ) }
							placeholder={ `0${ i + 1 }.` }
							allowedFormats={ [] }
						/>
						<RichText
							tagName="h3"
							className="blok-features__tytul"
							value={ el.tytul }
							onChange={ ( val ) => updateElement( i, { tytul: val } ) }
							placeholder="Tytuł (opcjonalny)..."
							allowedFormats={ [] }
						/>
						<RichText
							tagName="p"
							className="blok-features__tresc"
							value={ el.tresc }
							onChange={ ( val ) => updateElement( i, { tresc: val } ) }
							placeholder="Opis (opcjonalny)..."
						/>
					</div>
				) ) }
			</div>
		</>
	);
}
