export type ObrazekMedia = {
	id: number;
	url: string;
	alt: string;
};

export type BsHeroHomeAttributes = {
	tytul?: string;
	teksty: string[];
	obrazek: ObrazekMedia | null;
	kolorTla: string;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
