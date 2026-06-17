import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { BsIconAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< BsIconAttributes > ) {
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

	const blockProps = useBlockProps.save( {
		className: 'blok-icon',
		style,
	} );

	return (
		<span { ...blockProps } dangerouslySetInnerHTML={ { __html: ikona } } />
	);
}
