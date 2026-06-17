import {
	useBlockProps,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsIconAttributes } from './types';
import { ICON_ENTRIES } from '../icons';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const MIN_ROZMIAR = 16;
const MAX_ROZMIAR = 120;

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsIconAttributes > ) {
	const {
		ikona,
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
								aria-pressed={ ikona === def.svg }
								className={
									ikona === def.svg
										? 'bs-icon-picker__btn is-active'
										: 'bs-icon-picker__btn'
								}
								onClick={ () =>
									setAttributes( { ikona: def.svg } )
								}
								dangerouslySetInnerHTML={ { __html: def.svg } }
							/>
						) ) }
					</div>
				</PanelBody>
				<PanelBody title="Wygląd">
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
