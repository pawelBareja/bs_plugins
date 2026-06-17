import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsHeroHomeAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Hero Home',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsHeroHomeAttributes >(
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
	clientId: 'preview-bs-hero-home',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

const obrazek = {
	id: 1,
	url: 'https://placehold.co/960x960/eef2e6/1a2e1a?text=Kwiaty',
	alt: 'Bukiet kwiatów',
};

export const Domyslny: Story = {
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', '', '' ],
			obrazek,
			kolorTla: '#fbfbfb',
		},
		...baseArgs,
	},
};

export const TrzyAnimowaneTeksty: Story = {
	name: 'Trzy animowane teksty',
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', 'Dostawa Bolt', 'Świeże codziennie' ],
			obrazek,
			kolorTla: '#fbfbfb',
		},
		...baseArgs,
	},
};

export const InneTloIBezObrazka: Story = {
	name: 'Inne tło i bez obrazka',
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', '', '' ],
			obrazek: null,
			kolorTla: '#f1efeb',
		},
		...baseArgs,
	},
};
