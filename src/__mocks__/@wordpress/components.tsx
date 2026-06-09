import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes< HTMLButtonElement > {
	variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
	children?: React.ReactNode;
}

export function Button( { variant = 'secondary', children, ...rest }: ButtonProps ) {
	const styles: Record< string, React.CSSProperties > = {
		primary: { background: '#007cba', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 2, cursor: 'pointer' },
		secondary: { background: '#fff', color: '#007cba', border: '1px solid #007cba', padding: '6px 12px', borderRadius: 2, cursor: 'pointer' },
		tertiary: { background: 'transparent', color: '#007cba', border: 'none', padding: '6px 12px', cursor: 'pointer' },
		link: { background: 'transparent', color: '#007cba', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' },
	};

	return (
		<button style={ styles[ variant ] } { ...rest }>
			{ children }
		</button>
	);
}
