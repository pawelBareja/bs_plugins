import React from 'react';

// useBlockProps — zwraca props z className dla wrappera bloku
export function useBlockProps(
	props: Record< string, unknown > = {}
): Record< string, unknown > {
	return { ...props, className: 'block-editor-block-list__block' };
}
useBlockProps.save = (
	props: Record< string, unknown > = {}
): Record< string, unknown > => ( { ...props } );

// RichText — edytowalne pole tekstowe
interface RichTextProps {
	tagName?: keyof JSX.IntrinsicElements;
	value?: string;
	onChange?: ( val: string ) => void;
	placeholder?: string;
	className?: string;
}

interface RichTextContentProps {
	tagName?: keyof JSX.IntrinsicElements;
	value?: string;
	className?: string;
}

function RichText( {
	tagName: Tag = 'div',
	value = '',
	onChange,
	placeholder,
	className,
}: RichTextProps ) {
	return (
		<Tag
			className={ className }
			contentEditable
			suppressContentEditableWarning
			onInput={ ( e: React.FormEvent< HTMLElement > ) =>
				onChange?.( e.currentTarget.innerHTML )
			}
			style={ { outline: '1px dashed #999', minHeight: '1em', padding: '2px 4px' } }
		>
			{ value || (
				<span style={ { opacity: 0.4, pointerEvents: 'none' } }>
					{ placeholder }
				</span>
			) }
		</Tag>
	);
}

RichText.Content = function RichTextContent( {
	tagName: Tag = 'div',
	value = '',
	className,
}: RichTextContentProps ) {
	return (
		<Tag
			className={ className }
			dangerouslySetInnerHTML={ { __html: value } }
		/>
	);
};

export { RichText };

// MediaUploadCheck — passthrough
export function MediaUploadCheck( { children }: { children: React.ReactNode } ) {
	return <>{ children }</>;
}

// MediaUpload — render prop z symulowanym open
interface MediaUploadProps {
	onSelect: ( media: { id: number; url: string; alt: string } ) => void;
	allowedTypes?: string[];
	value?: number;
	render: ( { open }: { open: () => void } ) => React.ReactNode;
}

// InspectorControls — w Storybooku renderuje się inline pod blokiem
export function InspectorControls( { children }: { children: React.ReactNode } ) {
	return (
		<div style={ { border: '1px dashed #007cba', padding: '12px', marginTop: '12px', background: '#f0f6fc', borderRadius: 2 } }>
			<small style={ { color: '#007cba', display: 'block', marginBottom: '8px' } }>
				⚙ Sidebar (Inspector Controls)
			</small>
			{ children }
		</div>
	);
}

// ColorPalette — paleta kolorów
interface ColorPaletteProps {
	colors: Array< { name: string; color: string } >;
	value?: string;
	onChange: ( color: string | undefined ) => void;
	disableCustomColors?: boolean;
}

export function ColorPalette( { colors, value, onChange }: ColorPaletteProps ) {
	return (
		<div style={ { display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '4px 0' } }>
			{ colors.map( ( { name, color } ) => (
				<button
					key={ color }
					title={ name }
					onClick={ () => onChange( value === color ? undefined : color ) }
					style={ {
						width: '28px',
						height: '28px',
						borderRadius: '50%',
						background: color,
						border: value === color ? '3px solid #007cba' : '2px solid #ccc',
						cursor: 'pointer',
						padding: 0,
						outline: 'none',
					} }
				/>
			) ) }
		</div>
	);
}

export function MediaUpload( { render, onSelect }: MediaUploadProps ) {
	const open = () => {
		// Symuluje wybranie przykładowego obrazka
		onSelect( {
			id: 1,
			url: 'https://placehold.co/48x48/e2e8f0/64748b?text=icon',
			alt: 'Przykładowa ikona',
		} );
	};
	return <>{ render( { open } ) }</>;
}
