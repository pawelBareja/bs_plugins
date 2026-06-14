import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsFeaturesAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Features',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsFeaturesAttributes >( args.attributes );
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
	clientId: 'preview-bs-features',
	isSelected: false,
	context: {},
};

const pelneElementy = [
	{ numer: '01.', tytul: 'Elastyczne warunki współpracy', tresc: 'Zakres usług i harmonogram dopasowujemy do indywidualnych potrzeb klienta.' },
	{ numer: '02.', tytul: 'Niezawodna i terminowa obsługa', tresc: 'Pracujemy zgodnie z ustalonym harmonogramem i wysokimi standardami jakości.' },
	{ numer: '03.', tytul: 'Wieloletnie doświadczenie z klientami B2B', tresc: 'Realizujemy projekty dla firm, biur i hoteli, rozumiejąc potrzeby środowiska biznesowego.' },
	{ numer: '04.', tytul: 'Szeroka oferta roślin', tresc: 'Kwiaty cięte, rośliny doniczkowe i kompozycje sezonowe dopasowane do wnętrza.' },
	{ numer: '05.', tytul: 'Stała kontrola jakości', tresc: 'Każda dostawa jest sprawdzana przed wysyłką, gwarantując świeżość i estetykę.' },
];

export const TrzyElementy: Story = {
	args: {
		attributes: { liczbaElementow: 3, elementy: pelneElementy },
		...baseArgs,
	},
};

export const DwaElementy: Story = {
	args: {
		attributes: { liczbaElementow: 2, elementy: pelneElementy },
		...baseArgs,
	},
};

export const PiecElementow: Story = {
	args: {
		attributes: { liczbaElementow: 5, elementy: pelneElementy },
		...baseArgs,
	},
};

export const JedenElement: Story = {
	args: {
		attributes: { liczbaElementow: 1, elementy: pelneElementy },
		...baseArgs,
	},
};

export const BezNumerow: Story = {
	args: {
		attributes: {
			liczbaElementow: 3,
			elementy: pelneElementy.map( ( el ) => ( { ...el, numer: '' } ) ),
		},
		...baseArgs,
	},
};
