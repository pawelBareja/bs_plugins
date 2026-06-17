import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsIconAttributes } from './types';
import { ICON_LIBRARY } from '../icons';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Icon',
	component: Edit,
	parameters: {
		layout: 'centered',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsIconAttributes >(
				args.attributes
			);
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
	clientId: 'preview-bs-icon',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

export const Domyslna: Story = {
	args: {
		attributes: {
			...baseAttrs,
			ikona: ICON_LIBRARY.store.svg,
			rozmiar: 48,
			kolor: '#fff',
		},
		...baseArgs,
	},
};

export const Czerwona: Story = {
	args: {
		attributes: {
			...baseAttrs,
			ikona: ICON_LIBRARY.pin.svg,
			rozmiar: 48,
			kolor: '#ee2b27',
		},
		...baseArgs,
	},
};

export const Duza: Story = {
	args: {
		attributes: {
			...baseAttrs,
			ikona: ICON_LIBRARY.calendar.svg,
			rozmiar: 96,
			kolor: '#a7ce3a',
		},
		...baseArgs,
	},
};

export const Mala: Story = {
	args: {
		attributes: {
			...baseAttrs,
			ikona: ICON_LIBRARY.check.svg,
			rozmiar: 24,
			kolor: '#111111',
		},
		...baseArgs,
	},
};
