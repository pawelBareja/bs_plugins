import { useBlockProps, RichText } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { GridAttributes } from './types';

export default function Save( { attributes }: BlockSaveProps< GridAttributes > ) {
	const { obrazek, tytul, tresc, obrazekPoLewej, kolorTla } = attributes;
	const blockProps = useBlockProps.save();

	const kolumnaObrazek = (
		<div className="blok-grid__obrazek">
			{ obrazek && (
				<img src={ obrazek.url } alt={ obrazek.alt } />
			) }
		</div>
	);

	const kolumnaTekst = (
		<div
			className={ `blok-grid__tekst${ kolorTla ? ' blok-grid__tekst--has-bg' : '' }` }
			style={ kolorTla ? { backgroundColor: kolorTla } : undefined }
		>
			{ tytul && (
				<RichText.Content
					tagName="h3"
					className="blok-grid__tytul"
					value={ tytul }
				/>
			) }
			{ tresc && (
				<RichText.Content
					tagName="p"
					className="blok-grid__tresc"
					value={ tresc }
				/>
			) }
		</div>
	);

	return (
		<div
			{ ...blockProps }
			className={ `blok-grid${ obrazekPoLewej ? '' : ' blok-grid--obrazek-prawy' }` }
		>
			{ obrazekPoLewej ? kolumnaObrazek : kolumnaTekst }
			{ obrazekPoLewej ? kolumnaTekst : kolumnaObrazek }
		</div>
	);
}
