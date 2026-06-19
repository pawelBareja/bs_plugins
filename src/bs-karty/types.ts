export interface ObrazekMedia {
	id: number;
	url: string;
	alt: string;
}

export type KartaItem = {
	obrazek: ObrazekMedia | null;
	arkaObrazka: boolean;
	kolorTla: string;
	kolorTekstu: string;
	tytul: string;
	tresc: string;
	przyciskEtykieta: string;
	przyciskUrl: string;
	przyciskWariant: 'bialy' | 'czerwony' | 'tekst';
	ozdobaLiniaKolor: string;
};

export type BsKartyAttributes = {
	liczbaElementow: number;
	elementy: KartaItem[];
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
