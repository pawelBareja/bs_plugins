import { useCallback } from 'react';
import {
	useBlockProps,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BsTopbarAttributes, BsTopbarKampania } from './types';
import { getAktywnaKampania, dzisiajMmDd } from './get-aktywna-kampania';
import { BRAND_COLORS } from '../config';
import { SectionControls } from '../shared/SectionControls';
import './editor.scss';

const nowaKampania = (): BsTopbarKampania => ( {
	tekst: '',
	link: '',
	tekstPrzycisku: '',
	dataOd: '',
	dataDo: '',
} );

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BsTopbarAttributes > ) {
	const {
		kampanie,
		kolorTla,
		kolorTekstu,
		paddingGora,
		paddingDol,
		paddingBoki,
		kolorTlaSekcji,
	} = attributes;
	const blockProps = useBlockProps();

	const aktywna = getAktywnaKampania( kampanie, dzisiajMmDd() );

	const updateKampania = useCallback(
		( index: number, patch: Partial< BsTopbarKampania > ) => {
			setAttributes( {
				kampanie: kampanie.map( ( k, i ) =>
					i === index ? { ...k, ...patch } : k
				),
			} );
		},
		[ kampanie, setAttributes ]
	);

	const addKampania = useCallback( () => {
		setAttributes( { kampanie: [ ...kampanie, nowaKampania() ] } );
	}, [ kampanie, setAttributes ] );

	const removeKampania = useCallback(
		( index: number ) => {
			setAttributes( {
				kampanie: kampanie.filter( ( _, i ) => i !== index ),
			} );
		},
		[ kampanie, setAttributes ]
	);

	const onChangeKolorTla = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorTla: color ?? '#111111' } ),
		[ setAttributes ]
	);

	const onChangeKolorTekstu = useCallback(
		( color: string | undefined ) =>
			setAttributes( { kolorTekstu: color ?? '#fff' } ),
		[ setAttributes ]
	);

	const sekcjaStyle: React.CSSProperties = {
		...( paddingGora && { paddingTop: paddingGora } ),
		...( paddingDol && { paddingBottom: paddingDol } ),
		...( paddingBoki && { paddingInline: paddingBoki } ),
		...( kolorTlaSekcji && { backgroundColor: kolorTlaSekcji } ),
	};

	const wrapperStyle = {
		'--bs-topbar-bg': kolorTla,
		'--bs-topbar-color': kolorTekstu,
	} as React.CSSProperties;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Kampanie" initialOpen={ true }>
					{ kampanie.map( ( kampania, i ) => (
						<div key={ i } className="bs-topbar-kampania">
							<TextControl
								label={ `Tekst — kampania ${ i + 1 }` }
								value={ kampania.tekst }
								placeholder="np. Już niedługo Dzień Matki — zamów kwiaty już teraz!"
								onChange={ ( val ) =>
									updateKampania( i, { tekst: val } )
								}
							/>
							<TextControl
								label="Link (po kliknięciu belki)"
								value={ kampania.link }
								placeholder="https://..."
								onChange={ ( val ) =>
									updateKampania( i, { link: val } )
								}
							/>
							<TextControl
								label="Tekst przycisku"
								value={ kampania.tekstPrzycisku }
								placeholder="Zamów teraz"
								onChange={ ( val ) =>
									updateKampania( i, {
										tekstPrzycisku: val,
									} )
								}
							/>
							<div className="bs-topbar-kampania__daty">
								<TextControl
									label="Od (MM-DD)"
									value={ kampania.dataOd }
									placeholder="np. 05-20"
									onChange={ ( val ) =>
										updateKampania( i, { dataOd: val } )
									}
								/>
								<TextControl
									label="Do (MM-DD)"
									value={ kampania.dataDo }
									placeholder="np. 05-26"
									onChange={ ( val ) =>
										updateKampania( i, { dataDo: val } )
									}
								/>
							</div>
							<p className="bs-topbar-kampania__pomoc">
								Pozostaw obie daty puste, aby ta kampania była
								kampanią domyślną — widoczną, gdy żadna inna nie
								jest aktywna.
							</p>
							<Button
								variant="link"
								isDestructive
								disabled={ kampanie.length <= 1 }
								onClick={ () => removeKampania( i ) }
							>
								Usuń kampanię
							</Button>
							<hr className="bs-topbar-kampania__separator" />
						</div>
					) ) }
					<Button variant="secondary" onClick={ addKampania }>
						+ Dodaj kampanię
					</Button>
				</PanelBody>
				<PanelBody title="Kolory" initialOpen={ false }>
					<p>Tło belki</p>
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorTla }
						onChange={ onChangeKolorTla }
						disableCustomColors
					/>
					<p>Kolor tekstu</p>
					<ColorPalette
						colors={ BRAND_COLORS }
						value={ kolorTekstu }
						onChange={ onChangeKolorTekstu }
						disableCustomColors
					/>
				</PanelBody>
				<SectionControls
					paddingGora={ paddingGora }
					paddingDol={ paddingDol }
					paddingBoki={ paddingBoki }
					kolorTlaSekcji={ kolorTlaSekcji }
					onChange={ setAttributes }
				/>
			</InspectorControls>

			<div { ...blockProps } style={ sekcjaStyle }>
				<div className="blok-topbar" style={ wrapperStyle }>
					{ aktywna && aktywna.tekst ? (
						<div className="blok-topbar__pasek">
							<span className="blok-topbar__tekst">
								{ aktywna.tekst }
							</span>
							{ aktywna.tekstPrzycisku && (
								<span className="blok-topbar__przycisk">
									{ aktywna.tekstPrzycisku }
								</span>
							) }
						</div>
					) : (
						<p className="blok-topbar__info">
							Dodaj treść kampanii w panelu bocznym.
						</p>
					) }
				</div>
			</div>
		</>
	);
}
