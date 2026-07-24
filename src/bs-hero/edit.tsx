import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { HeroAttributes, ObrazekMedia } from './types';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'bs-plugins/bs-button' ];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< HeroAttributes > ) {
	const {
		obrazek,
		tytul,
		marginesGorny,
		marginesGornyMobile,
		wysokoscVh,
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

	const wrapperStyle: React.CSSProperties = {
		'--blok-hero-vh': wysokoscVh,
		...( obrazek ? { backgroundImage: `url(${ obrazek.url })` } : {} ),
		...( marginesGorny > 0
			? {
					marginTop: `-${ marginesGorny }px`,
					paddingTop: `${ marginesGorny }px`,
			  }
			: {} ),
	} as React.CSSProperties;

	const labelZdjecia = obrazek ? 'Zmień zdjęcie' : 'Dodaj zdjęcie';

	const onSelectObrazek = useCallback(
		( media: ObrazekMedia ) =>
			setAttributes( {
				obrazek: { id: media.id, url: media.url, alt: media.alt },
			} ),
		[ setAttributes ]
	);

	const onUsunObrazek = useCallback(
		() => setAttributes( { obrazek: null } ),
		[ setAttributes ]
	);

	const onChangeTytul = useCallback(
		( val: string ) => setAttributes( { tytul: val } ),
		[ setAttributes ]
	);

	const onChangeWysokosc = useCallback(
		( val: string ) =>
			setAttributes( { wysokoscVh: parseInt( val, 10 ) || 100 } ),
		[ setAttributes ]
	);

	const onChangeMargines = useCallback(
		( val: string ) =>
			setAttributes( { marginesGorny: parseInt( val, 10 ) || 0 } ),
		[ setAttributes ]
	);

	const onChangeMarginesMobile = useCallback(
		( val: string ) =>
			setAttributes( { marginesGornyMobile: parseInt( val, 10 ) || 0 } ),
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Zdjęcie tła">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								onSelectObrazek( media as ObrazekMedia )
							}
							allowedTypes={ [ 'image' ] }
							value={ obrazek?.id }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ labelZdjecia }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ obrazek && (
						<Button
							onClick={ onUsunObrazek }
							variant="link"
							className="blok-hero__usun-zdjecie"
						>
							Usuń zdjęcie
						</Button>
					) }
				</PanelBody>
				<PanelBody title="Układ">
					<TextControl
						label="Wysokość (dvh)"
						value={ String( wysokoscVh ) }
						type="number"
						onChange={ onChangeWysokosc }
					/>
					<TextControl
						label="Offset menu desktop (px)"
						value={ String( marginesGorny ) }
						type="number"
						onChange={ onChangeMargines }
					/>
					<TextControl
						label="Offset menu mobile (px)"
						value={ String( marginesGornyMobile ) }
						type="number"
						onChange={ onChangeMarginesMobile }
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

			<div
				{ ...blockProps }
				className="blok-hero"
				style={ { ...wrapperStyle, ...sekcjaStyle } }
			>
				<div className="blok-hero__zawartosc">
					<RichText
						tagName="h1"
						className="blok-hero__tytul"
						value={ tytul ?? '' }
						onChange={ onChangeTytul }
						placeholder="Tytuł (opcjonalny)..."
					/>
					<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
				</div>
			</div>
		</>
	);
}
