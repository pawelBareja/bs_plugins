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
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< HeaderAtributes > ) {
	const {
		tytul,
		podtytul,
		ikona,
		szerokoscIkony,
		paddingGora,
		paddingDol,
		paddingBoki,
		kolorTlaSekcji,
	} = attributes;
	const blockProps = useBlockProps( { className: 'blok-header' } );

	const sekcjaStyle: React.CSSProperties = {
		...( paddingGora && { paddingTop: paddingGora } ),
		...( paddingDol && { paddingBottom: paddingDol } ),
		...( paddingBoki && { paddingInline: paddingBoki } ),
		...( kolorTlaSekcji && { backgroundColor: kolorTlaSekcji } ),
	};

	const ikonaStyle: React.CSSProperties = {
		width: szerokoscIkony ? `${ szerokoscIkony }px` : undefined,
		height: 'auto',
		cursor: 'pointer',
	};

	const onSelectIkona = useCallback(
		( media: IkonaMedia ) =>
			setAttributes( {
				ikona: { id: media.id, url: media.url, alt: media.alt },
			} ),
		[ setAttributes ]
	);

	const onChangeSzerokosc = useCallback(
		( val: string ) =>
			setAttributes( {
				szerokoscIkony: val ? parseInt( val, 10 ) : undefined,
			} ),
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
				<SectionControls
					paddingGora={ paddingGora }
					paddingDol={ paddingDol }
					paddingBoki={ paddingBoki }
					kolorTlaSekcji={ kolorTlaSekcji }
					onChange={ setAttributes }
				/>
			</InspectorControls>

			<div { ...blockProps } style={ sekcjaStyle }>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) =>
							onSelectIkona( media as IkonaMedia )
						}
						allowedTypes={ [ 'image' ] }
						value={ ikona?.id }
						render={ ( { open } ) => (
							<div className="blok-header__ikona">
								{ ikona ? (
									// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
									<img
										src={ ikona.url }
										alt={ ikona.alt }
										onClick={ open }
										style={ ikonaStyle }
									/>
								) : (
									<Button
										onClick={ open }
										variant="secondary"
									>
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
					value={ tytul ?? '' }
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
