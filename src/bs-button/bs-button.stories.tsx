import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsButtonAttributes } from './types';
import { ICON_LIBRARY } from '../icons';
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
			const [ attributes, setAttrs ] = useState< BsButtonAttributes >(
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
	clientId: 'preview-bs-button',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	scrollOffset: 0,
	ikonaId: '',
	ikonaSvg: '',
	ikonaPozycja: 'start' as const,
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

export const BialyMd: Story = {
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Dowiedz się więcej',
			url: '',
			wariant: 'bialy',
			rozmiar: 'md',
			nowyTab: false,
		},
		...baseArgs,
	},
};

export const CzerwonyMd: Story = {
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Zamów teraz',
			url: '',
			wariant: 'czerwony',
			rozmiar: 'md',
			nowyTab: false,
		},
		...baseArgs,
	},
};

export const BialyXs: Story = {
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Bardzo mały',
			url: '',
			wariant: 'bialy',
			rozmiar: 'xs',
			nowyTab: false,
		},
		...baseArgs,
	},
};

export const BialySm: Story = {
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Mały przycisk',
			url: '',
			wariant: 'bialy',
			rozmiar: 'sm',
			nowyTab: false,
		},
		...baseArgs,
	},
};

export const CzerwonyLg: Story = {
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Duży czerwony',
			url: '',
			wariant: 'czerwony',
			rozmiar: 'lg',
			nowyTab: false,
		},
		...baseArgs,
	},
};

export const PelnaLokacja: Story = {
	name: 'Pełna szerokość',
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Pełna szerokość',
			url: '',
			wariant: 'czerwony',
			rozmiar: 'full',
			nowyTab: false,
		},
		...baseArgs,
	},
};

export const ZLinkiem: Story = {
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Otwórz w nowym oknie',
			url: 'https://example.com',
			wariant: 'bialy',
			rozmiar: 'md',
			nowyTab: true,
		},
		...baseArgs,
	},
};

export const IkonaNaPoczatku: Story = {
	name: 'Ikona — na początku',
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Zamów kwiaty',
			url: '',
			wariant: 'czerwony',
			rozmiar: 'md',
			nowyTab: false,
			ikonaId: 'flower',
			ikonaSvg: ICON_LIBRARY.flower.svg,
			ikonaPozycja: 'start',
		},
		...baseArgs,
	},
};

export const IkonaNaKoncu: Story = {
	name: 'Ikona — na końcu',
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Dowiedz się więcej',
			url: '',
			wariant: 'bialy',
			rozmiar: 'md',
			nowyTab: false,
			ikonaId: 'arrowRight',
			ikonaSvg: ICON_LIBRARY.arrowRight.svg,
			ikonaPozycja: 'end',
		},
		...baseArgs,
	},
};

export const IkonaDostawy: Story = {
	name: 'Ikona — dostawa skuterem',
	args: {
		attributes: {
			...baseAttrs,
			etykieta: 'Zamów z dostawą',
			url: '',
			wariant: 'czerwony',
			rozmiar: 'lg',
			nowyTab: false,
			ikonaId: 'moped',
			ikonaSvg: ICON_LIBRARY.moped.svg,
			ikonaPozycja: 'start',
		},
		...baseArgs,
	},
};
