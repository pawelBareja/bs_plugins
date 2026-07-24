export type FeatureItem = {
	numer: string;
	tytul: string;
	tresc: string;
	trescUrl: string;
	trescNowyTab: boolean;
};

export type BsFeaturesAttributes = {
	liczbaElementow: number;
	elementy: FeatureItem[];
	paddingGora: number;
	paddingDol: number;
	paddingBoki: number;
	kolorTlaSekcji: string;
};
