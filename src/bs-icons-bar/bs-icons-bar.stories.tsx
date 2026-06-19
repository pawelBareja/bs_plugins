import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsIconsBarAttributes } from './types';
import { ICON_LIBRARY } from '../icons';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Icons Bar',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsIconsBarAttributes >(
				args.attributes
			);
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
	clientId: 'preview-bs-icons-bar',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

const pelneElementy = [
	{ ikona: ICON_LIBRARY.storefront.svg, tekst: 'Sklep stacjonarny' },
	{ ikona: ICON_LIBRARY.truck.svg, tekst: 'Zamów przez Bolt' },
	{ ikona: ICON_LIBRARY.shoppingCart.svg, tekst: 'Sklep online - już wkrótce' },
	{ ikona: ICON_LIBRARY.gift.svg, tekst: 'Prezenty na każdą okazję' },
	{ ikona: ICON_LIBRARY.tag.svg, tekst: 'Promocje sezonowe' },
];

export const TrzyElementy: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 3,
			elementy: pelneElementy,
		},
		...baseArgs,
	},
};

export const DwaElementy: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 2,
			elementy: pelneElementy,
		},
		...baseArgs,
	},
};

export const PiecElementow: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 5,
			elementy: pelneElementy,
		},
		...baseArgs,
	},
};

export const BezTekstu: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 3,
			elementy: pelneElementy.map( ( el ) => ( { ...el, tekst: '' } ) ),
		},
		...baseArgs,
	},
};
