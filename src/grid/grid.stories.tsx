import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { GridAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/Grid Obraz + Tekst',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
};

export default meta;
type Story = StoryObj< typeof Edit >;

const baseAttributes: GridAttributes = {
	obrazek: {
		id: 1,
		url: 'https://placehold.co/800x600/e2e8f0/64748b?text=Obrazek',
		alt: 'Przykładowy obrazek',
	},
	tytul: 'Dlaczego warto wybrać nasze kwiaty',
	tresc: 'Specjalizujemy się w dostawach kwiatów ciętych i roślin doniczkowych dla klientów biznesowych. Realizujemy regularne dostawy do biur, hoteli oraz przestrzeni reprezentacyjnych, tworząc sezonowe kompozycje dopasowane do charakteru wnętrza.',
	obrazekPoLewej: true,
};

const defaultArgs = {
	setAttributes: () => {},
	clientId: 'preview-grid',
	isSelected: false,
	context: {},
};

export const ObrazekPoLewej: Story = {
	args: {
		attributes: baseAttributes,
		...defaultArgs,
	},
};

export const ObrazekPoPrawej: Story = {
	args: {
		attributes: { ...baseAttributes, obrazekPoLewej: false },
		...defaultArgs,
	},
};

export const BezTytulu: Story = {
	args: {
		attributes: { ...baseAttributes, tytul: undefined },
		...defaultArgs,
	},
};

export const BezObrazka: Story = {
	args: {
		attributes: { ...baseAttributes, obrazek: null },
		...defaultArgs,
	},
};

export const Pusty: Story = {
	args: {
		attributes: {
			obrazek: null,
			tytul: undefined,
			tresc: undefined,
			obrazekPoLewej: true,
		},
		...defaultArgs,
	},
};
