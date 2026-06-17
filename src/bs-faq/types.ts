export type FaqPytanie = {
	pytanie: string;
	odpowiedz: string;
};

export type FaqKategoria = {
	nazwa: string;
	pytania: FaqPytanie[];
};

export type BsFaqAttributes = {
	kategorie: FaqKategoria[];
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
