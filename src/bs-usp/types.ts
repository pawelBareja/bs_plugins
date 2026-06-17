export type ObrazekMedia = {
	id: number;
	url: string;
	alt: string;
};

export type BsUspAttributes = {
	obrazek: ObrazekMedia | null;
	tresc: string;
	kolorKsztaltu: string;
	szerokoscKsztaltu: number;
	wysokoscKsztaltu: number;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
