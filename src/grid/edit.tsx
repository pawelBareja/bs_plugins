import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { GridAttributes, ObrazekMedia } from './types';
import './editor.scss';

const BRAND_COLORS = [
	{ name: 'Biały', color: '#fff' },
	{ name: 'Czarny', color: '#111111' },
	{ name: 'Czerwony', color: '#ee2b27' },
	{ name: 'Zielony', color: '#a7ce3a' },
	{ name: 'Szary', color: '#6a6a6a' },
	{ name: 'Kremowy', color: '#f1efeb' },
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< GridAttributes > ) {
	const { obrazek, tytul, tresc, obrazekPoLewej, kolorTla } = attributes;
	const blockProps = useBlockProps();

	const kolumnaObrazek = (
		<div className="blok-grid__obrazek">
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ ( media ) =>
						setAttributes( {
							obrazek: {
								id: ( media as ObrazekMedia ).id,
								url: ( media as ObrazekMedia ).url,
								alt: ( media as ObrazekMedia ).alt,
							},
						} )
					}
					allowedTypes={ [ 'image' ] }
					value={ obrazek?.id }
					render={ ( { open } ) =>
						obrazek ? (
							<img
								src={ obrazek.url }
								alt={ obrazek.alt }
								onClick={ open }
								style={ { cursor: 'pointer', width: '100%', height: 'auto' } }
							/>
						) : (
							<Button onClick={ open } variant="secondary">
								Dodaj obrazek
							</Button>
						)
					}
				/>
			</MediaUploadCheck>
		</div>
	);

	const kolumnaTekst = (
		<div
			className={ `blok-grid__tekst${ kolorTla ? ' blok-grid__tekst--has-bg' : '' }` }
			style={ kolorTla ? { backgroundColor: kolorTla } : undefined }
		>
			<RichText
				tagName="h3"
				className="blok-grid__tytul"
				value={ tytul ?? '' }
				onChange={ ( val: string ) => setAttributes( { tytul: val } ) }
				placeholder="Tytuł (opcjonalny)..."
			/>
			<RichText
				tagName="p"
				className="blok-grid__tresc"
				value={ tresc ?? '' }
				onChange={ ( val: string ) => setAttributes( { tresc: val } ) }
				placeholder="Treść (opcjonalna)..."
			/>
		</div>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Układ">
					<ToggleControl
						label="Obrazek po lewej"
						checked={ obrazekPoLewej }
						onChange={ ( val: boolean ) =>
							setAttributes( { obrazekPoLewej: val } )
						}
					/>
				</PanelBody>
				<PanelBody title="Kolor tła sekcji tekstu">
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorTla }
						onChange={ ( color ) =>
							setAttributes( { kolorTla: color ?? undefined } )
						}
						disableCustomColors
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...blockProps }
				className={ `blok-grid${ obrazekPoLewej ? '' : ' blok-grid--obrazek-prawy' }` }
			>
				{ obrazekPoLewej ? kolumnaObrazek : kolumnaTekst }
				{ obrazekPoLewej ? kolumnaTekst : kolumnaObrazek }
			</div>
		</>
	);
}
