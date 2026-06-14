import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { HeaderAtributes, IkonaMedia } from './types';
import './editor.scss';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< HeaderAtributes > ) {
	const { tytul, podtytul, ikona, szerokoscIkony } = attributes;
	const blockProps = useBlockProps();

	const ikonaStyle: React.CSSProperties = {
		width: szerokoscIkony ? `${ szerokoscIkony }px` : undefined,
		height: 'auto',
		cursor: 'pointer',
	};

	const onSelectIkona = useCallback(
		( media: IkonaMedia ) =>
			setAttributes( { ikona: { id: media.id, url: media.url, alt: media.alt } } ),
		[ setAttributes ]
	);

	const onChangeSzerokosc = useCallback(
		( val: string ) =>
			setAttributes( { szerokoscIkony: val ? parseInt( val, 10 ) : undefined } ),
		[ setAttributes ]
	);

	const onChangeTytul = useCallback(
		( val: string ) => setAttributes( { tytul: val } ),
		[ setAttributes ]
	);

	const onChangePodtytul = useCallback(
		( val: string ) => setAttributes( { podtytul: val } ),
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia ikony">
					<TextControl
						label="Szerokość ikony (px)"
						type="number"
						value={ szerokoscIkony ? String( szerokoscIkony ) : '' }
						onChange={ onChangeSzerokosc }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } className="blok-header">
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => onSelectIkona( media as IkonaMedia ) }
						allowedTypes={ [ 'image' ] }
						value={ ikona?.id }
						render={ ( { open } ) => (
							<div className="blok-header__ikona">
								{ ikona ? (
									<img
										src={ ikona.url }
										alt={ ikona.alt }
										onClick={ open }
										style={ ikonaStyle }
									/>
								) : (
									<Button onClick={ open } variant="secondary">
										Dodaj ikonę (opcjonalne)
									</Button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>

				<RichText
					tagName="h3"
					className="blok-header__tytul"
					value={ tytul }
					onChange={ onChangeTytul }
					placeholder="Wpisz tytuł..."
				/>

				<RichText
					tagName="p"
					className="blok-header__podtytul"
					value={ podtytul }
					onChange={ onChangePodtytul }
					placeholder="Podtytuł (opcjonalne)..."
				/>
			</div>
		</>
	);
}
