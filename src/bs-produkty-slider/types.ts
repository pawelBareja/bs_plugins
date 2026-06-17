export type ZrodloProduktow = 'najnowsze' | 'kategoria' | 'tag';

export type BsProduktySliderAttributes = {
	zrodloProduktow: ZrodloProduktow;
	kategoriaSlug: string;
	tagSlug: string;
	liczbaProduktow: number;
	predkosc: number;
	tekstPrzycisku: string;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
