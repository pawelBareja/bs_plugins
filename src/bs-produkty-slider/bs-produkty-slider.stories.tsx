import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsProduktySliderAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Produkty Slider',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] =
				useState< BsProduktySliderAttributes >( args.attributes );
			return (
				<div style={ { padding: '60px 40px' } }>
					<Edit
						{ ...args }
						attributes={ attributes }
						setAttributes={ ( partial ) =>
							setAttrs( ( prev ) => ( { ...prev, ...partial } ) )
						}
					/>
				</div>
			);
		},
	],
};

export default meta;
type Story = StoryObj< typeof Edit >;

const baseArgs = {
	clientId: 'preview-bs-produkty-slider',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

export const Najnowsze: Story = {
	args: {
		attributes: {
			...baseAttrs,
			zrodloProduktow: 'najnowsze',
			kategoriaSlug: '',
			tagSlug: '',
			liczbaProduktow: 5,
			predkosc: 4,
			tekstPrzycisku: 'Zamów w Bolt',
		},
		...baseArgs,
	},
};

export const ZKategorii: Story = {
	args: {
		attributes: {
			...baseAttrs,
			zrodloProduktow: 'kategoria',
			kategoriaSlug: 'bukiety',
			tagSlug: '',
			liczbaProduktow: 5,
			predkosc: 4,
			tekstPrzycisku: 'Zamów w Bolt',
		},
		...baseArgs,
	},
};

export const ZTagu: Story = {
	args: {
		attributes: {
			...baseAttrs,
			zrodloProduktow: 'tag',
			kategoriaSlug: '',
			tagSlug: 'promocja',
			liczbaProduktow: 5,
			predkosc: 4,
			tekstPrzycisku: 'Dodaj do koszyka',
		},
		...baseArgs,
	},
};
