import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsButtonAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Button',
	component: Edit,
	parameters: {
		layout: 'centered',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsButtonAttributes >( args.attributes );
			return (
				<Edit
					{ ...args }
					attributes={ attributes }
					setAttributes={ ( partial ) =>
						setAttrs( ( prev ) => ( { ...prev, ...partial } ) )
					}
				/>
			);
		},
	],
};

export default meta;
type Story = StoryObj< typeof Edit >;

const baseArgs = {
	clientId: 'preview-bs-button',
	isSelected: false,
	context: {},
};

export const BialyMd: Story = {
	args: {
		attributes: { etykieta: 'Dowiedz się więcej', url: '', wariant: 'bialy', rozmiar: 'md', nowyTab: false },
		...baseArgs,
	},
};

export const CzerwonyMd: Story = {
	args: {
		attributes: { etykieta: 'Zamów teraz', url: '', wariant: 'czerwony', rozmiar: 'md', nowyTab: false },
		...baseArgs,
	},
};

export const BialyXs: Story = {
	args: {
		attributes: { etykieta: 'Bardzo mały', url: '', wariant: 'bialy', rozmiar: 'xs', nowyTab: false },
		...baseArgs,
	},
};

export const BialySm: Story = {
	args: {
		attributes: { etykieta: 'Mały przycisk', url: '', wariant: 'bialy', rozmiar: 'sm', nowyTab: false },
		...baseArgs,
	},
};

export const CzerwonyLg: Story = {
	args: {
		attributes: { etykieta: 'Duży czerwony', url: '', wariant: 'czerwony', rozmiar: 'lg', nowyTab: false },
		...baseArgs,
	},
};

export const PelnaLokacja: Story = {
	name: 'Pełna szerokość',
	args: {
		attributes: { etykieta: 'Pełna szerokość', url: '', wariant: 'czerwony', rozmiar: 'full', nowyTab: false },
		...baseArgs,
	},
};

export const ZLinkiem: Story = {
	args: {
		attributes: { etykieta: 'Otwórz w nowym oknie', url: 'https://example.com', wariant: 'bialy', rozmiar: 'md', nowyTab: true },
		...baseArgs,
	},
};
