export type BsTopbarKampania = {
	tekst: string;
	link: string;
	tekstPrzycisku: string;
	dataOd: string;
	dataDo: string;
};

export type BsTopbarAttributes = {
	kampanie: BsTopbarKampania[];
	kolorTla: string;
	kolorTekstu: string;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
