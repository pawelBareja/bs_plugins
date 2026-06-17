import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { HeroAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/Hero',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< HeroAttributes >(
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
	clientId: 'preview-hero',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	wysokoscVh: 100,
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

export const ZTytulem: Story = {
	args: {
		attributes: {
			...baseAttrs,
			obrazek: {
				id: 1,
				url: 'https://placehold.co/1920x1080/1a2e1a/1a2e1a',
				alt: 'Zdjęcie hero',
			},
			tytul: 'Kwiaty dla Twojego biznesu',
			marginesGorny: 0,
		},
		...baseArgs,
	},
};

export const BezTytulu: Story = {
	args: {
		attributes: {
			...baseAttrs,
			obrazek: {
				id: 1,
				url: 'https://placehold.co/1920x1080/1a2e1a/1a2e1a',
				alt: 'Zdjęcie hero',
			},
			tytul: undefined,
			marginesGorny: 0,
		},
		...baseArgs,
	},
};

export const BezObrazka: Story = {
	args: {
		attributes: {
			...baseAttrs,
			obrazek: null,
			tytul: 'Kwiaty dla Twojego biznesu',
			marginesGorny: 0,
		},
		...baseArgs,
	},
};

export const ZOffsetemMenu: Story = {
	name: 'Z offsetem menu (80px)',
	args: {
		attributes: {
			...baseAttrs,
			obrazek: {
				id: 1,
				url: 'https://placehold.co/1920x1080/1a2e1a/1a2e1a',
				alt: 'Zdjęcie hero',
			},
			tytul: 'Kwiaty dla Twojego biznesu',
			marginesGorny: 80,
		},
		...baseArgs,
	},
};
