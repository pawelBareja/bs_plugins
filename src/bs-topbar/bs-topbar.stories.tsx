import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsTopbarAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Topbar',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsTopbarAttributes >(
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
	clientId: 'preview-bs-topbar',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

export const Domyslny: Story = {
	args: {
		attributes: {
			...baseAttrs,
			kampanie: [
				{
					tekst: 'Zamów świeże kwiaty z dostawą jeszcze dziś!',
					link: '',
					tekstPrzycisku: 'Zamów teraz',
					dataOd: '',
					dataDo: '',
				},
			],
			kolorTla: '#111111',
			kolorTekstu: '#fff',
		},
		...baseArgs,
	},
};

export const KampaniaSezonowa: Story = {
	args: {
		attributes: {
			...baseAttrs,
			kampanie: [
				{
					tekst: 'Już niedługo Dzień Matki — zamów kwiaty już teraz!',
					link: '#dzien-matki',
					tekstPrzycisku: 'Zobacz bukiety',
					dataOd: '05-15',
					dataDo: '05-26',
				},
				{
					tekst: 'Zamów świeże kwiaty z dostawą jeszcze dziś!',
					link: '',
					tekstPrzycisku: 'Zamów teraz',
					dataOd: '',
					dataDo: '',
				},
			],
			kolorTla: '#ee2b27',
			kolorTekstu: '#fff',
		},
		...baseArgs,
	},
};

export const WieleKampanii: Story = {
	args: {
		attributes: {
			...baseAttrs,
			kampanie: [
				{
					tekst: 'Walentynki — zamów kwiaty dla ukochanej osoby!',
					link: '#walentynki',
					tekstPrzycisku: 'Zobacz bukiety',
					dataOd: '02-01',
					dataDo: '02-14',
				},
				{
					tekst: 'Już niedługo Dzień Matki — zamów kwiaty już teraz!',
					link: '#dzien-matki',
					tekstPrzycisku: 'Zobacz bukiety',
					dataOd: '05-15',
					dataDo: '05-26',
				},
				{
					tekst: 'Zamów świeże kwiaty z dostawą jeszcze dziś!',
					link: '',
					tekstPrzycisku: 'Zamów teraz',
					dataOd: '',
					dataDo: '',
				},
			],
			kolorTla: '#a7ce3a',
			kolorTekstu: '#111',
		},
		...baseArgs,
	},
};
