export interface IkonaMedia {
	id: number;
	url: string;
	alt: string;
}

export type HeaderAtributes = {
	tytul: string;
	podtytul: string;
	ikona: IkonaMedia | null;
}
