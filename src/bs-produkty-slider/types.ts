export type ZrodloProduktow = 'najnowsze' | 'kategoria' | 'tag' | 'wybrane';

export type BsProduktySliderAttributes = {
	zrodloProduktow: ZrodloProduktow;
	kategoriaSlug: string;
	tagSlug: string;
	wybraneProdukty: number[];
	liczbaProduktow: number;
	predkosc: number;
	tekstPrzycisku: string;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
