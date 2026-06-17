export interface ObrazekMedia {
	id: number;
	url: string;
	alt: string;
}

export type GridAttributes = {
	obrazek: ObrazekMedia | null;
	tytul?: string;
	tresc?: string;
	obrazekPoLewej: boolean;
	kolorTla?: string;
	kolorTekstu?: string;
	arkaObrazka?: boolean;
	kolorArki?: string;
	ozdobaTekst?: string;
	ozdobaTekstKolor?: string;
	ozdobaLiniaKolor?: string;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
