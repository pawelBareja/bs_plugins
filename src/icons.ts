// Biblioteka ikon Phosphor (https://phosphoricons.com), waga: thin.
// SVG generowany raz przy ładowaniu modułu — save.tsx i render.php operują na stringach SVG.

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	// Natura / kwiaciarnia
	Flower,
	FlowerLotus,
	FlowerTulip,
	Leaf,
	Plant,
	PottedPlant,
	Tree,
	TreeEvergreen,
	Clover,
	Acorn,
	Butterfly,
	Sun,
	SunHorizon,
	CloudRain,
	Rainbow,
	Drop,
	Wind,
	// E-commerce / logistyka
	ShoppingCart,
	ShoppingBag,
	BagSimple,
	Handbag,
	Package,
	Truck,
	Moped,
	CreditCard,
	Tag,
	Storefront,
	Basket,
	// Kontakt / lokalizacja
	Phone,
	PhoneCall,
	Envelope,
	MapPin,
	Clock,
	// Zaufanie / jakość
	Shield,
	ShieldCheck,
	Star,
	CheckCircle,
	ThumbsUp,
	Medal,
	SealCheck,
	// Ludzie / relacje
	Users,
	Heart,
	HandHeart,
	// Ogólne
	Gift,
	Calendar,
	House,
	Scissors,
	ArrowRight,
	ArrowSquareUp,
	PaperPlaneTilt,
	Sparkle,
	Lightning,
	Question,
	Info,
} from '@phosphor-icons/react';

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill';

export const WEIGHT_OPTIONS = [
	{ label: 'Cienka', value: 'thin' },
	{ label: 'Lekka', value: 'light' },
	{ label: 'Normalna', value: 'regular' },
	{ label: 'Gruba', value: 'bold' },
	{ label: 'Wypełniona', value: 'fill' },
];

export type IconDef = {
	label: string;
	svg: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Component: any;
};

const WEIGHT = 'thin' as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSvg( Component: any ): string {
	return renderToStaticMarkup(
		createElement( Component, {
			color: 'currentColor',
			weight: WEIGHT,
			'aria-hidden': true,
		} )
	);
}

export const ICON_LIBRARY: Record< string, IconDef > = {
	// Natura / kwiaciarnia
	flower:        { label: 'Kwiat',               svg: toSvg( Flower ),       Component: Flower },
	flowerTulip:   { label: 'Tulipan',             svg: toSvg( FlowerTulip ),  Component: FlowerTulip },
	flowerLotus:   { label: 'Kwiat lotosa',        svg: toSvg( FlowerLotus ),  Component: FlowerLotus },
	leaf:          { label: 'Liść',                svg: toSvg( Leaf ),         Component: Leaf },
	plant:         { label: 'Roślina',             svg: toSvg( Plant ),        Component: Plant },
	pottedPlant:   { label: 'Roślina doniczkowa',  svg: toSvg( PottedPlant ),  Component: PottedPlant },
	tree:          { label: 'Drzewo',              svg: toSvg( Tree ),         Component: Tree },
	treeEvergreen: { label: 'Drzewo iglaste',      svg: toSvg( TreeEvergreen ),Component: TreeEvergreen },
	clover:        { label: 'Koniczyna',           svg: toSvg( Clover ),       Component: Clover },
	acorn:         { label: 'Żołądź',              svg: toSvg( Acorn ),        Component: Acorn },
	butterfly:     { label: 'Motyl',               svg: toSvg( Butterfly ),    Component: Butterfly },
	sun:           { label: 'Słońce',              svg: toSvg( Sun ),          Component: Sun },
	sunHorizon:    { label: 'Świt / wschód',       svg: toSvg( SunHorizon ),   Component: SunHorizon },
	cloudRain:     { label: 'Deszcz',              svg: toSvg( CloudRain ),    Component: CloudRain },
	rainbow:       { label: 'Tęcza',               svg: toSvg( Rainbow ),      Component: Rainbow },
	drop:          { label: 'Kropla wody',         svg: toSvg( Drop ),         Component: Drop },
	wind:          { label: 'Wiatr / aromat',      svg: toSvg( Wind ),         Component: Wind },
	// E-commerce / logistyka
	shoppingCart:  { label: 'Koszyk',              svg: toSvg( ShoppingCart ), Component: ShoppingCart },
	shoppingBag:   { label: 'Torba zakupowa',      svg: toSvg( ShoppingBag ),  Component: ShoppingBag },
	bagSimple:     { label: 'Torba prosta',        svg: toSvg( BagSimple ),    Component: BagSimple },
	handbag:       { label: 'Torebka',             svg: toSvg( Handbag ),      Component: Handbag },
	basket:        { label: 'Koszyk / kosz',       svg: toSvg( Basket ),       Component: Basket },
	package:       { label: 'Paczka',              svg: toSvg( Package ),      Component: Package },
	truck:         { label: 'Dostawa',             svg: toSvg( Truck ),        Component: Truck },
	moped:         { label: 'Dostawa skuterem',    svg: toSvg( Moped ),        Component: Moped },
	creditCard:    { label: 'Płatność kartą',      svg: toSvg( CreditCard ),   Component: CreditCard },
	tag:           { label: 'Promocja / etykieta', svg: toSvg( Tag ),          Component: Tag },
	storefront:    { label: 'Sklep',               svg: toSvg( Storefront ),   Component: Storefront },
	// Kontakt / lokalizacja
	phone:         { label: 'Telefon',             svg: toSvg( Phone ),        Component: Phone },
	phoneCall:     { label: 'Zadzwoń',             svg: toSvg( PhoneCall ),    Component: PhoneCall },
	envelope:      { label: 'E-mail',              svg: toSvg( Envelope ),     Component: Envelope },
	mapPin:        { label: 'Lokalizacja',         svg: toSvg( MapPin ),       Component: MapPin },
	clock:         { label: 'Godziny otwarcia',    svg: toSvg( Clock ),        Component: Clock },
	// Zaufanie / jakość
	shield:        { label: 'Bezpieczeństwo',      svg: toSvg( Shield ),       Component: Shield },
	shieldCheck:   { label: 'Gwarancja',           svg: toSvg( ShieldCheck ),  Component: ShieldCheck },
	star:          { label: 'Ocena / gwiazdka',    svg: toSvg( Star ),         Component: Star },
	checkCircle:   { label: 'Potwierdzone',        svg: toSvg( CheckCircle ),  Component: CheckCircle },
	thumbsUp:      { label: 'Polecam',             svg: toSvg( ThumbsUp ),     Component: ThumbsUp },
	medal:         { label: 'Medal / nagroda',     svg: toSvg( Medal ),        Component: Medal },
	sealCheck:     { label: 'Certyfikat',          svg: toSvg( SealCheck ),    Component: SealCheck },
	// Ludzie / relacje
	users:         { label: 'Klienci',             svg: toSvg( Users ),        Component: Users },
	heart:         { label: 'Ulubione',            svg: toSvg( Heart ),        Component: Heart },
	handHeart:     { label: 'Troska / opieka',     svg: toSvg( HandHeart ),    Component: HandHeart },
	// Ogólne
	gift:          { label: 'Prezent',             svg: toSvg( Gift ),         Component: Gift },
	calendar:      { label: 'Kalendarz',           svg: toSvg( Calendar ),     Component: Calendar },
	house:         { label: 'Dom / strona główna', svg: toSvg( House ),        Component: House },
	scissors:      { label: 'Nożyczki',            svg: toSvg( Scissors ),     Component: Scissors },
	arrowRight:    { label: 'Strzałka w prawo',    svg: toSvg( ArrowRight ),   Component: ArrowRight },
	arrowSquareUp: { label: 'Eksport / wgórę',     svg: toSvg( ArrowSquareUp ),Component: ArrowSquareUp },
	paperPlaneTilt:{ label: 'Wyślij',              svg: toSvg( PaperPlaneTilt ),Component: PaperPlaneTilt },
	sparkle:       { label: 'Błysk / premium',     svg: toSvg( Sparkle ),      Component: Sparkle },
	lightning:     { label: 'Błyskawica / energia',svg: toSvg( Lightning ),    Component: Lightning },
	question:      { label: 'Pytanie / FAQ',       svg: toSvg( Question ),     Component: Question },
	info:          { label: 'Informacja',          svg: toSvg( Info ),         Component: Info },
};

export const ICON_ENTRIES = Object.entries( ICON_LIBRARY );

// Dekoracyjna fala — separator między elementami paska ikon
export const WAVE_SVG =
	"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 176' preserveAspectRatio='none' aria-hidden='true'><g transform='translate(-417,-1)'><path fill='currentColor' fill-rule='nonzero' d='M427.859333,1.61373035 L428.837883,1.40771987 L428.940888,1.89699476 C434.23118,27.0258836 432.657144,56.7108204 424.22674,90.9521835 L423.936684,92.1212678 C415.384901,126.328399 416.925439,153.988202 428.532588,175.116614 L429.132531,176.190657 L428.260956,176.680918 L428.015825,176.245131 C416.066337,155.001596 414.305898,127.221293 422.708797,92.9201565 L422.966542,91.8787322 C431.518889,57.6693434 433.240353,28.0282977 428.138895,2.95597365 L427.859333,1.61373035 Z'/></g></svg>";
