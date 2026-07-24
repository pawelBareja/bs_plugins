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
			const [ attributes, setAttrs ] = useState< BsFeaturesAttributes >(
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
	clientId: 'preview-bs-features',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

const pelneElementy: BsFeaturesAttributes[ 'elementy' ] = [
	{
		numer: '01.',
		tytul: 'Elastyczne warunki współpracy',
		tresc: 'Zakres usług i harmonogram dopasowujemy do indywidualnych potrzeb klienta.',
		trescUrl: '',
		trescNowyTab: false,
	},
	{
		numer: '02.',
		tytul: 'Niezawodna i terminowa obsługa',
		tresc: 'Pracujemy zgodnie z ustalonym harmonogramem i wysokimi standardami jakości.',
		trescUrl: '',
		trescNowyTab: false,
	},
	{
		numer: '03.',
		tytul: 'Wieloletnie doświadczenie z klientami B2B',
		tresc: 'Realizujemy projekty dla firm, biur i hoteli, rozumiejąc potrzeby środowiska biznesowego.',
		trescUrl: '',
		trescNowyTab: false,
	},
	{
		numer: '04.',
		tytul: 'Szeroka oferta roślin',
		tresc: 'Kwiaty cięte, rośliny doniczkowe i kompozycje sezonowe dopasowane do wnętrza.',
		trescUrl: '',
		trescNowyTab: false,
	},
	{
		numer: '05.',
		tytul: 'Stała kontrola jakości',
		tresc: 'Każda dostawa jest sprawdzana przed wysyłką, gwarantując świeżość i estetykę.',
		trescUrl: '',
		trescNowyTab: false,
	},
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

export const JedenElement: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 1,
			elementy: pelneElementy,
		},
		...baseArgs,
	},
};

export const BezNumerow: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 3,
			elementy: pelneElementy.map( ( el ) => ( { ...el, numer: '' } ) ),
		},
		...baseArgs,
	},
};
