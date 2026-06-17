import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsFaqAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS FAQ',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsFaqAttributes >(
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
	clientId: 'preview-bs-faq',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

const kategorie: BsFaqAttributes[ 'kategorie' ] = [
	{
		nazwa: 'Usługi',
		pytania: [
			{
				pytanie: 'Jakie usługi świadczycie?',
				odpowiedz:
					'Zajmujemy się dekoracją florystyczną wnętrz, eventów oraz dostawami kwiatów dla firm i klientów indywidualnych.',
			},
			{
				pytanie:
					'Czy zajmujecie się organizacją ślubów/eventów poza Warszawą?',
				odpowiedz:
					'Tak, realizujemy zlecenia również poza Warszawą — szczegóły ustalamy indywidualnie.',
			},
			{
				pytanie:
					'Jaki jest czas oczekiwania na odpowiedź na zapytanie ofertowe?',
				odpowiedz:
					'Standardowo odpowiadamy na zapytania ofertowe w ciągu 24 godzin roboczych.',
			},
			{
				pytanie: 'Kiedy zostanie uruchomiony sklep internetowy?',
				odpowiedz:
					'Sklep internetowy uruchomimy wkrótce — śledź nasze social media, aby być na bieżąco.',
			},
		],
	},
	{
		nazwa: 'Dostawa',
		pytania: [
			{
				pytanie: 'Jak długo trwa dostawa?',
				odpowiedz:
					'Dostawy w Warszawie realizujemy zwykle tego samego dnia.',
			},
			{
				pytanie: 'Czy dostawa jest płatna?',
				odpowiedz:
					'Koszt dostawy zależy od lokalizacji i wartości zamówienia.',
			},
		],
	},
	{
		nazwa: 'Płatności',
		pytania: [
			{
				pytanie: 'Jakie formy płatności akceptujecie?',
				odpowiedz: 'Akceptujemy płatności kartą, BLIK oraz przelewem.',
			},
		],
	},
	{
		nazwa: 'Ogólne',
		pytania: [
			{
				pytanie: 'Gdzie się znajdujecie?',
				odpowiedz: 'Nasz sklep znajduje się w Warszawie.',
			},
		],
	},
];

export const Domyslny: Story = {
	args: {
		attributes: { ...baseAttrs, kategorie },
		...baseArgs,
	},
};

export const JednaKategoria: Story = {
	args: {
		attributes: { ...baseAttrs, kategorie: [ kategorie[ 0 ] ] },
		...baseArgs,
	},
};

export const BezOdpowiedzi: Story = {
	args: {
		attributes: {
			...baseAttrs,
			kategorie: kategorie.map( ( kat ) => ( {
				...kat,
				pytania: kat.pytania.map( ( p ) => ( {
					...p,
					odpowiedz: '',
				} ) ),
			} ) ),
		},
		...baseArgs,
	},
};
