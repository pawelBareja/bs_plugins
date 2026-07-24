export type ObrazekMedia = {
	id: number;
	url: string;
	alt: string;
};

export type HeroAttributes = {
	obrazek: ObrazekMedia | null;
	tytul?: string;
	marginesGorny: number;
	marginesGornyMobile: number;
	wysokoscVh: number;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
