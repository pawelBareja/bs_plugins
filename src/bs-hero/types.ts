export type ObrazekMedia = {
	id: number;
	url: string;
	alt: string;
};

export type HeroAttributes = {
	obrazek: ObrazekMedia | null;
	tytul?: string;
	marginesGorny: number;
	wysokoscVh: number;
};
