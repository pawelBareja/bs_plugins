import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsUspAttributes } from './types';
import './style.scss';
import './editor.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS USP',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsUspAttributes >(
				args.attributes
			);
			return (
				<div style={ { padding: '40px', background: '#e8e8e8' } }>
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
	clientId: 'preview-bs-usp',
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
	url: 'https://placehold.co/400x600/9fb4a6/2f3e34?text=Wazon',
	alt: 'Wazon z suchymi kwiatami',
};

export const Domyslny: Story = {
	args: {
		attributes: {
			...baseAttrs,
			obrazek,
			tresc: 'Zaufaj naszemu ponad 20-letniemu doświadczeniu.<br>Porozmawiajmy o kwiatach.',
			kolorKsztaltu: '#f1efeb',
			szerokoscKsztaltu: 380,
			wysokoscKsztaltu: 420,
		},
		...baseArgs,
	},
};

export const InnyKolorIRozmiar: Story = {
	name: 'Inny kolor i rozmiar kształtu',
	args: {
		attributes: {
			...baseAttrs,
			obrazek,
			tresc: 'Zaufaj naszemu ponad 20-letniemu doświadczeniu.<br>Porozmawiajmy o kwiatach.',
			kolorKsztaltu: '#a7ce3a',
			szerokoscKsztaltu: 480,
			wysokoscKsztaltu: 300,
		},
		...baseArgs,
	},
};

export const PozycjaWarstwowa: Story = {
	name: 'Warstwy — obrazek poniżej kształtu, tekst na wierzchu',
	args: {
		attributes: {
			...baseAttrs,
			obrazek,
			tresc: 'Zaufaj naszemu ponad 20-letniemu doświadczeniu.<br>Porozmawiajmy o kwiatach.',
			kolorKsztaltu: '#f1efeb',
			szerokoscKsztaltu: 380,
			wysokoscKsztaltu: 420,
			kolorTlaSekcji: '#fff',
		},
		...baseArgs,
	},
};

export const BezObrazka: Story = {
	name: 'Bez obrazka',
	args: {
		attributes: {
			...baseAttrs,
			obrazek: null,
			tresc: '',
			kolorKsztaltu: '#f1efeb',
			szerokoscKsztaltu: 380,
			wysokoscKsztaltu: 420,
		},
		...baseArgs,
	},
};
