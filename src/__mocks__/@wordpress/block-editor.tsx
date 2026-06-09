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
