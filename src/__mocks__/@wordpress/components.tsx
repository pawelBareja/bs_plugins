/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes< HTMLButtonElement > {
	variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
	children?: React.ReactNode;
}

export function Button( {
	variant = 'secondary',
	children,
	...rest
}: ButtonProps ) {
	const styles: Record< string, React.CSSProperties > = {
		primary: {
			background: '#007cba',
			color: '#fff',
			border: 'none',
			padding: '6px 12px',
			borderRadius: 2,
			cursor: 'pointer',
		},
		secondary: {
			background: '#fff',
			color: '#007cba',
			border: '1px solid #007cba',
			padding: '6px 12px',
			borderRadius: 2,
			cursor: 'pointer',
		},
		tertiary: {
			background: 'transparent',
			color: '#007cba',
			border: 'none',
			padding: '6px 12px',
			cursor: 'pointer',
		},
		link: {
			background: 'transparent',
			color: '#007cba',
			border: 'none',
			padding: 0,
			cursor: 'pointer',
			textDecoration: 'underline',
		},
	};

	return (
		<button style={ styles[ variant ] } { ...rest }>
			{ children }
		</button>
	);
}

interface PanelBodyProps {
	title?: string;
	children: React.ReactNode;
}

export function PanelBody( { title, children }: PanelBodyProps ) {
	return (
		<div style={ { marginBottom: '8px' } }>
			{ title && (
				<strong
					style={ {
						display: 'block',
						marginBottom: '8px',
						fontSize: '11px',
						textTransform: 'uppercase',
						color: '#1e1e1e',
					} }
				>
					{ title }
				</strong>
			) }
			{ children }
		</div>
	);
}

interface TextControlProps {
	label?: string;
	value?: string;
	onChange: ( val: string ) => void;
	type?: string;
	placeholder?: string;
}

interface ToggleControlProps {
	label?: string;
	checked: boolean;
	onChange: ( val: boolean ) => void;
}

export function ToggleControl( {
	label,
	checked,
	onChange,
}: ToggleControlProps ) {
	return (
		<label
			style={ {
				display: 'flex',
				alignItems: 'center',
				gap: '8px',
				cursor: 'pointer',
				marginBottom: '8px',
			} }
		>
			<input
				type="checkbox"
				checked={ checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
			/>
			{ label && (
				<span style={ { fontSize: '13px', color: '#1e1e1e' } }>
					{ label }
				</span>
			) }
		</label>
	);
}

interface RangeControlProps {
	label?: string;
	value: number;
	onChange: ( val: number | undefined ) => void;
	min?: number;
	max?: number;
}

export function RangeControl( {
	label,
	value,
	onChange,
	min = 0,
	max = 100,
}: RangeControlProps ) {
	return (
		<div style={ { marginBottom: '8px' } }>
			{ label && (
				<label
					style={ {
						display: 'block',
						fontSize: '11px',
						marginBottom: '4px',
						color: '#1e1e1e',
					} }
				>
					{ label }: <strong>{ value }</strong>
				</label>
			) }
			<input
				type="range"
				min={ min }
				max={ max }
				value={ value }
				onChange={ ( e ) => onChange( parseInt( e.target.value, 10 ) ) }
				style={ { width: '100%' } }
			/>
			<div
				style={ {
					display: 'flex',
					justifyContent: 'space-between',
					fontSize: '10px',
					color: '#666',
				} }
			>
				<span>{ min }</span>
				<span>{ max }</span>
			</div>
		</div>
	);
}

interface SelectControlProps {
	label?: string;
	value?: string;
	options: Array< { label: string; value: string } >;
	onChange: ( val: string ) => void;
}

export function SelectControl( {
	label,
	value,
	options,
	onChange,
}: SelectControlProps ) {
	return (
		<div style={ { marginBottom: '8px' } }>
			{ label && (
				<label
					style={ {
						display: 'block',
						fontSize: '11px',
						marginBottom: '4px',
						color: '#1e1e1e',
					} }
				>
					{ label }
				</label>
			) }
			<select
				value={ value }
				onChange={ ( e ) => onChange( e.target.value ) }
				style={ {
					width: '100%',
					padding: '4px 8px',
					border: '1px solid #949494',
					borderRadius: 2,
					fontSize: '13px',
				} }
			>
				{ options.map( ( opt ) => (
					<option key={ opt.value } value={ opt.value }>
						{ opt.label }
					</option>
				) ) }
			</select>
		</div>
	);
}

export function TextControl( {
	label,
	value = '',
	onChange,
	type = 'text',
	placeholder,
}: TextControlProps ) {
	return (
		<div style={ { marginBottom: '8px' } }>
			{ label && (
				<label
					style={ {
						display: 'block',
						fontSize: '11px',
						marginBottom: '4px',
						color: '#1e1e1e',
					} }
				>
					{ label }
				</label>
			) }
			<input
				type={ type }
				value={ value }
				placeholder={ placeholder }
				onChange={ ( e ) => onChange( e.target.value ) }
				style={ {
					width: '100%',
					padding: '4px 8px',
					border: '1px solid #949494',
					borderRadius: 2,
					fontSize: '13px',
				} }
			/>
		</div>
	);
}
