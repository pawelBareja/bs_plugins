import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsKartyAttributes, KartaItem } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Karty',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsKartyAttributes >(
				args.attributes
			);
			return (
				<div style={ { padding: '40px' } }>
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
	clientId: 'preview-bs-karty',
	isSelected: false,
	context: {},
};

const obrazek = ( tekst: string ) => ( {
	id: 1,
	url: `https://placehold.co/600x600/e2e8f0/64748b?text=${ tekst }`,
	alt: tekst,
} );

const oferta: KartaItem[] = [
	{
		obrazek: obrazek( 'Śluby' ),
		arkaObrazka: true,
		kolorTla: '#ee2b27',
		kolorTekstu: '#fff',
		tytul: 'Śluby',
		tresc: 'Sprawdź ekskluzywne bukiety ślubne i dekoracje na Twój ważny dzień, dopasowane do charakteru Waszego wesela.',
		przyciskEtykieta: 'Czytaj więcej',
		przyciskUrl: '#',
		przyciskWariant: 'bialy',
	},
	{
		obrazek: obrazek( 'Dla Firm' ),
		arkaObrazka: true,
		kolorTla: '#f1efeb',
		kolorTekstu: '#111111',
		tytul: 'Dla Firm',
		tresc: 'Stałe dostawy kompozycji kwiatowych do biur i przestrzeni reprezentacyjnych — regularnie i na zamówienie.',
		przyciskEtykieta: 'Czytaj więcej',
		przyciskUrl: '#',
		przyciskWariant: 'czerwony',
	},
	{
		obrazek: obrazek( 'Konferencje' ),
		arkaObrazka: true,
		kolorTla: '#f1efeb',
		kolorTekstu: '#111111',
		tytul: 'Konferencje',
		tresc: 'Florystyczna obsługa konferencji i wydarzeń firmowych — od scenografii po dekoracje stołów.',
		przyciskEtykieta: 'Czytaj więcej',
		przyciskUrl: '#',
		przyciskWariant: 'czerwony',
	},
	{
		obrazek: null,
		arkaObrazka: false,
		kolorTla: '#f1efeb',
		kolorTekstu: '#111111',
		tytul: '',
		tresc: '',
		przyciskEtykieta: '',
		przyciskUrl: '',
		przyciskWariant: 'czerwony',
	},
	{
		obrazek: null,
		arkaObrazka: false,
		kolorTla: '#f1efeb',
		kolorTekstu: '#111111',
		tytul: '',
		tresc: '',
		przyciskEtykieta: '',
		przyciskUrl: '',
		przyciskWariant: 'czerwony',
	},
];

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

export const TrzyKarty: Story = {
	args: {
		attributes: { ...baseAttrs, liczbaElementow: 3, elementy: oferta },
		...baseArgs,
	},
};

export const DwieKarty: Story = {
	args: {
		attributes: { ...baseAttrs, liczbaElementow: 2, elementy: oferta },
		...baseArgs,
	},
};

export const PiecKart: Story = {
	args: {
		attributes: { ...baseAttrs, liczbaElementow: 5, elementy: oferta },
		...baseArgs,
	},
};

export const BezArki: Story = {
	args: {
		attributes: {
			...baseAttrs,
			liczbaElementow: 3,
			elementy: oferta.map( ( el ) => ( { ...el, arkaObrazka: false } ) ),
		},
		...baseArgs,
	},
};
