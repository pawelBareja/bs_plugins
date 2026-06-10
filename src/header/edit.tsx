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

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia ikony">
					<TextControl
						label="Szerokość ikony (px)"
						type="number"
						value={ szerokoscIkony ? String( szerokoscIkony ) : '' }
						onChange={ ( val: string ) =>
							setAttributes( {
								szerokoscIkony: val ? parseInt( val, 10 ) : undefined,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } className="blok-header">
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) =>
							setAttributes( {
								ikona: {
									id: ( media as IkonaMedia ).id,
									url: ( media as IkonaMedia ).url,
									alt: ( media as IkonaMedia ).alt,
								},
							} )
						}
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
					onChange={ ( val: string ) => setAttributes( { tytul: val } ) }
					placeholder="Wpisz tytuł..."
				/>

				<RichText
					tagName="p"
					className="blok-header__podtytul"
					value={ podtytul }
					onChange={ ( val: string ) =>
						setAttributes( { podtytul: val } )
					}
					placeholder="Podtytuł (opcjonalne)..."
				/>
			</div>
		</>
	);
}
