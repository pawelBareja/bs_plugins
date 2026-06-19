import { useState, useRef, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Edit from './edit';
import type { BsHeroHomeAttributes } from './types';
import './style.scss';

const meta: Meta< typeof Edit > = {
	title: 'Bloki/BS Hero Home',
	component: Edit,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [ 'autodocs' ],
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsHeroHomeAttributes >(
				args.attributes
			);
			const ref = useRef< HTMLDivElement >( null );

			useEffect( () => {
				const hero = ref.current?.querySelector< HTMLElement >(
					'.blok-hero-home'
				);
				if ( ! hero ) return;
				hero.classList.add( 'js-blur-in' );
				const timer = setTimeout( () => {
					hero.classList.add( 'is-in-view' );
				}, 300 );
				return () => clearTimeout( timer );
			}, [] );

			return (
				<div ref={ ref }>
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
	clientId: 'preview-bs-hero-home',
	isSelected: false,
	context: {},
};

const baseAttrs = {
	paddingGora: 0,
	paddingDol: 0,
	paddingBoki: 0,
	kolorTlaSekcji: '',
	tekstBoczny: 'pracownia florystyczna',
	kolorTekstuBocznego: '#111111',
};

const obrazek = {
	id: 1,
	url: 'https://placehold.co/960x960/eef2e6/1a2e1a?text=Kwiaty',
	alt: 'Bukiet kwiatów',
};

export const Domyslny: Story = {
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', '', '' ],
			obrazek,
			kolorTla: '#fbfbfb',
		},
		...baseArgs,
	},
};

export const TrzyAnimowaneTeksty: Story = {
	name: 'Trzy animowane teksty',
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', 'Dostawa Bolt', 'Świeże codziennie' ],
			obrazek,
			kolorTla: '#fbfbfb',
		},
		...baseArgs,
	},
};

export const TekstBoczny: Story = {
	name: 'Tekst boczny — pozycja',
	decorators: [
		( _Story, { args } ) => {
			const [ attributes, setAttrs ] = useState< BsHeroHomeAttributes >(
				args.attributes
			);
			const ref = useRef< HTMLDivElement >( null );

			useEffect( () => {
				const hero = ref.current?.querySelector< HTMLElement >(
					'.blok-hero-home'
				);
				if ( ! hero ) return;
				hero.classList.add( 'js-blur-in' );
				const timer = setTimeout( () => {
					hero.classList.add( 'is-in-view' );
				}, 300 );
				return () => clearTimeout( timer );
			}, [] );

			return (
				<div
					ref={ ref }
					style={ {
						paddingBottom: '80px',
						background: '#e8e8e8',
					} }
				>
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
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', 'Dostawa Bolt', 'Świeże codziennie' ],
			obrazek,
			kolorTla: '#fbfbfb',
		},
		...baseArgs,
	},
};

export const InneTloIBezObrazka: Story = {
	name: 'Inne tło i bez obrazka',
	args: {
		attributes: {
			...baseAttrs,
			tytul: 'Kwiaty Polskie - Hotel<br>Presidential',
			teksty: [ 'Zamów online', '', '' ],
			obrazek: null,
			kolorTla: '#f1efeb',
		},
		...baseArgs,
	},
};
