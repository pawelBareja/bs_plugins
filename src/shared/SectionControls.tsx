import { PanelBody, RangeControl } from '@wordpress/components';
import { ColorPalette } from '@wordpress/block-editor';
import { BRAND_COLORS } from '../config';

interface Props {
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
	onChange: ( patch: {
		paddingGora?: number;
		paddingDol?: number;
		paddingBoki?: number;
		kolorTlaSekcji?: string;
	} ) => void;
}

export function SectionControls( {
	paddingGora,
	paddingDol,
	paddingBoki,
	kolorTlaSekcji,
	onChange,
}: Props ) {
	return (
		<>
			<PanelBody title="Padding sekcji" initialOpen={ false }>
				<RangeControl
					label="Góra"
					value={ paddingGora }
					onChange={ ( v ) => onChange( { paddingGora: v ?? 0 } ) }
					min={ 0 }
					max={ 200 }
					step={ 4 }
				/>
				<RangeControl
					label="Dół"
					value={ paddingDol }
					onChange={ ( v ) => onChange( { paddingDol: v ?? 0 } ) }
					min={ 0 }
					max={ 200 }
					step={ 4 }
				/>
				<RangeControl
					label="Boki"
					value={ paddingBoki }
					onChange={ ( v ) => onChange( { paddingBoki: v ?? 0 } ) }
					min={ 0 }
					max={ 200 }
					step={ 4 }
				/>
			</PanelBody>
			<PanelBody title="Tło sekcji" initialOpen={ false }>
				<ColorPalette
					colors={ BRAND_COLORS }
					value={ kolorTlaSekcji || undefined }
					onChange={ ( color ) =>
						onChange( { kolorTlaSekcji: color ?? '' } )
					}
					disableCustomColors
					clearable
				/>
			</PanelBody>
		</>
	);
}
