export interface ObrazekMedia {
	id: number;
	url: string;
	alt: string;
}

export type GridAttributes = {
	obrazek: ObrazekMedia | null;
	tytul?: string;
	tresc?: string;
	obrazekPoLewej: boolean;
	kolorTla?: string;
}
