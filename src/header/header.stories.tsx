import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { HeaderAtributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/Header',
	component: Edit,
	parameters: {
		layout: 'centered',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< HeaderAtributes >(
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

const baseAttributes: HeaderAtributes = {
	tytul: 'Dlaczego warto',
	podtytul:
		'Specjalizujemy się w dostawach kwiatów ciętych i roślin doniczkowych dla klientów biznesowych. Realizujemy regularne dostawy do biur, hoteli oraz przestrzeni reprezentacyjnych, tworząc sezonowe kompozycje dopasowane do charakteru wnętrza oraz identyfikacji wizualnej marki.',
	ikona: null,
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
};

const baseArgs = {
	clientId: 'preview-header',
	isSelected: false,
	context: {},
};

export const BezIkony: Story = {
	args: { attributes: baseAttributes, ...baseArgs },
};

export const ZIkona: Story = {
	args: {
		attributes: {
			...baseAttributes,
			ikona: {
				id: 1,
				url: 'https://placehold.co/48x48/e2e8f0/64748b?text=icon',
				alt: 'Ikona kwiatka',
			},
		},
		...baseArgs,
	},
};

export const BezPodtytulu: Story = {
	args: { attributes: { ...baseAttributes, podtytul: '' }, ...baseArgs },
};

export const Pusty: Story = {
	args: {
		attributes: { ...baseAttributes, tytul: '', podtytul: '', ikona: null },
		...baseArgs,
	},
};
