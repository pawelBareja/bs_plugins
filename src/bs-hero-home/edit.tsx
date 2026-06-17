import { useCallback, useEffect, useState } from 'react';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	ColorPalette,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsHeroHomeAttributes, ObrazekMedia } from './types';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'bs-plugins/bs-button' ];
const ROTATOR_INTERVAL = 2600;

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsHeroHomeAttributes > ) {
	const {
		tytul,
		teksty,
		obrazek,
		kolorTla,
		paddingGora,
		paddingDol,
		paddingBoki,
		kolorTlaSekcji,
	} = attributes;
	const blockProps = useBlockProps();

	const tekstyWidoczne = teksty.filter(
		( tekst ) => tekst.trim().length > 0
	);
	const [ activeIndex, setActiveIndex ] = useState( 0 );

	useEffect( () => {
		if ( tekstyWidoczne.length < 2 ) {
			setActiveIndex( 0 );
			return;
		}

		const interval = setInterval( () => {
			setActiveIndex( ( i ) => ( i + 1 ) % tekstyWidoczne.length );
		}, ROTATOR_INTERVAL );

		return () => clearInterval( interval );
	}, [ tekstyWidoczne.length ] );

	const sekcjaStyle: React.CSSProperties = {
		...( paddingGora && { paddingTop: paddingGora } ),
		...( paddingDol && { paddingBottom: paddingDol } ),
		...( paddingBoki && { paddingInline: paddingBoki } ),
		...( kolorTlaSekcji && { backgroundColor: kolorTlaSekcji } ),
	};

	const wrapperStyle = {
		'--bs-hero-home-bg': kolorTla,
	} as React.CSSProperties;

	const labelZdjecia = obrazek ? 'Zmień zdjęcie' : 'Dodaj zdjęcie';

	const onChangeTytul = useCallback(
		( val: string ) => setAttributes( { tytul: val } ),
		[ setAttributes ]
	);

	const onChangeKolorTla = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorTla: color ?? '#fbfbfb' } ),
		[ setAttributes ]
	);

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

	const onChangeTekst = useCallback(
		( index: number, val: string ) => {
			const updated = [ ...teksty ];
			updated[ index ] = val;
			setAttributes( { teksty: updated } );
		},
		[ teksty, setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tło sekcji">
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorTla }
						onChange={ onChangeKolorTla }
						disableCustomColors
					/>
				</PanelBody>
				<PanelBody title="Zdjęcie">
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
							className="blok-hero-home__usun-zdjecie"
						>
							Usuń zdjęcie
						</Button>
					) }
				</PanelBody>
				<PanelBody title="Animowany tekst (max 3)">
					<TextControl
						label="Tekst 1"
						value={ teksty[ 0 ] ?? '' }
						onChange={ ( val ) => onChangeTekst( 0, val ) }
					/>
					<TextControl
						label="Tekst 2 (opcjonalnie)"
						value={ teksty[ 1 ] ?? '' }
						onChange={ ( val ) => onChangeTekst( 1, val ) }
					/>
					<TextControl
						label="Tekst 3 (opcjonalnie)"
						value={ teksty[ 2 ] ?? '' }
						onChange={ ( val ) => onChangeTekst( 2, val ) }
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
				className="blok-hero-home"
				style={ { ...wrapperStyle, ...sekcjaStyle } }
			>
				<div className="blok-hero-home__content">
					<RichText
						tagName="h1"
						className="blok-hero-home__tytul"
						value={ tytul ?? '' }
						onChange={ onChangeTytul }
						placeholder="Tytuł sekcji..."
					/>
					{ tekstyWidoczne.length > 0 && (
						<div className="blok-hero-home__rotator">
							{ tekstyWidoczne.map( ( tekst, i ) => (
								<span
									key={ i }
									className={
										i === activeIndex
											? 'blok-hero-home__rotator-item is-active'
											: 'blok-hero-home__rotator-item'
									}
								>
									{ tekst }
								</span>
							) ) }
						</div>
					) }
					<div className="blok-hero-home__przyciski">
						<InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
					</div>
				</div>

				<div className="blok-hero-home__obrazek-wrapper">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								onSelectObrazek( media as ObrazekMedia )
							}
							allowedTypes={ [ 'image' ] }
							value={ obrazek?.id }
							render={ ( { open } ) =>
								obrazek ? (
									// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
									<img
										src={ obrazek.url }
										alt={ obrazek.alt }
										className="blok-hero-home__obrazek"
										onClick={ open }
										style={ { cursor: 'pointer' } }
									/>
								) : (
									<Button
										onClick={ open }
										variant="secondary"
										className="blok-hero-home__placeholder"
									>
										Dodaj zdjęcie
									</Button>
								)
							}
						/>
					</MediaUploadCheck>
				</div>
			</div>
		</>
	);
}
