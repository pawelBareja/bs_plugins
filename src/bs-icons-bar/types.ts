export type IconBarItem = {
	ikona: string;
	ikonaNazwa: string;
	tekst: string;
};

export type BsIconsBarAttributes = {
	liczbaElementow: number;
	elementy: IconBarItem[];
	ikonaWaga: string;
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
