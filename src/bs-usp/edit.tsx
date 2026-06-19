import { useCallback } from 'react';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import { Button, PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsUspAttributes, ObrazekMedia } from './types';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsUspAttributes > ) {
	const {
		obrazek,
		tresc,
		kolorKsztaltu,
		szerokoscKsztaltu,
		wysokoscKsztaltu,
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

	const scenaStyle = {
		'--bs-usp-ksztalt-color': kolorKsztaltu,
		'--bs-usp-ksztalt-width': `${ szerokoscKsztaltu }px`,
		'--bs-usp-ksztalt-height': `${ wysokoscKsztaltu }px`,
	} as React.CSSProperties;

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

	const onChangeTresc = useCallback(
		( val: string ) => setAttributes( { tresc: val } ),
		[ setAttributes ]
	);

	const onChangeKolorKsztaltu = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorKsztaltu: color ?? '#f1efeb' } ),
		[ setAttributes ]
	);

	const onChangeSzerokosc = useCallback(
		( val: number | undefined ) =>
			setAttributes( { szerokoscKsztaltu: val ?? 380 } ),
		[ setAttributes ]
	);

	const onChangeWysokosc = useCallback(
		( val: number | undefined ) =>
			setAttributes( { wysokoscKsztaltu: val ?? 420 } ),
		[ setAttributes ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Kształt w tle">
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorKsztaltu }
						onChange={ onChangeKolorKsztaltu }
						disableCustomColors
					/>
					<RangeControl
						label="Szerokość"
						value={ szerokoscKsztaltu }
						onChange={ onChangeSzerokosc }
						min={ 160 }
						max={ 640 }
						step={ 10 }
					/>
					<RangeControl
						label="Wysokość"
						value={ wysokoscKsztaltu }
						onChange={ onChangeWysokosc }
						min={ 160 }
						max={ 640 }
						step={ 10 }
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

			<div { ...blockProps } className="blok-usp" style={ sekcjaStyle }>
				<div className="blok-usp__scena" style={ scenaStyle }>
					<div className="blok-usp__ksztalt" />
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								onSelectObrazek( media as ObrazekMedia )
							}
							allowedTypes={ [ 'image' ] }
							value={ obrazek?.id }
							render={ ( { open } ) =>
								obrazek ? (
									<div className="blok-usp__obrazek-wrapper">
										{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */ }
										<img
											src={ obrazek.url }
											alt={ obrazek.alt }
											className="blok-usp__obrazek"
											onClick={ open }
											style={ { cursor: 'pointer' } }
										/>
									</div>
								) : (
									<Button
										onClick={ open }
										variant="secondary"
										className="blok-usp__placeholder"
									>
										Dodaj zdjęcie
									</Button>
								)
							}
						/>
					</MediaUploadCheck>
					<RichText
						tagName="div"
						className="blok-usp__tresc"
						value={ tresc }
						onChange={ onChangeTresc }
						placeholder="Wpisz tekst USP..."
					/>
				</div>
				{ obrazek && (
					<Button
						onClick={ onUsunObrazek }
						variant="link"
						className="blok-usp__usun-zdjecie"
					>
						Usuń zdjęcie
					</Button>
				) }
			</div>
		</>
	);
}
