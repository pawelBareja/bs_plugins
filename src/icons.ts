// Kurowana biblioteka ikon SVG (na bazie zestawu @wordpress/icons).
// Każdy wpis to gotowy znacznik <svg> z fill='currentColor' — kolor
// dziedziczony jest z CSS (color) elementu .blok-icons-bar__icon.

export type IconDef = {
	label: string;
	svg: string;
};

export const ICON_LIBRARY: Record< string, IconDef > = {
	store: {
		label: 'Sklep',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path fill-rule='evenodd' clip-rule='evenodd' d='M19.75 11H21V8.667L19.875 4H4.125L3 8.667V11h1.25v8.75h15.5V11zm-1.5 0H5.75v7.25H10V13h4v5.25h4.25V11zm-5.5-5.5h2.067l.486 3.24.028.76H12.75v-4zm-3.567 0h2.067v4H8.669l.028-.76.486-3.24zm7.615 3.1l-.464-3.1h2.36l.806 3.345V9.5h-2.668l-.034-.9zM7.666 5.5h-2.36L4.5 8.845V9.5h2.668l.034-.9.464-3.1z'/></svg>",
	},
	box: {
		label: 'Przesyłka',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path fill-rule='evenodd' clip-rule='evenodd' d='M5 5.5h14a.5.5 0 01.5.5v1.5a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM4 9.232A2 2 0 013 7.5V6a2 2 0 012-2h14a2 2 0 012 2v1.5a2 2 0 01-1 1.732V18a2 2 0 01-2 2H6a2 2 0 01-2-2V9.232zm1.5.268V18a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V9.5h-13z'/></svg>",
	},
	cart: {
		label: 'Koszyk',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M8.5 17c-.8 0-1.5.7-1.5 1.5S7.7 20 8.5 20s1.5-.7 1.5-1.5S9.3 17 8.5 17Zm7 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5Zm-6-3.8h5.1c1.2 0 2.2-.7 2.6-1.8l1.3-3.5c.3-.8-.3-1.7-1.2-1.7h-10l-.8-2h-3v1.5h2l2.7 6.7-.6 1.3c-.6 1.2.3 2.5 1.6 2.5h8.4v-1.5H9.2c-.2 0-.3-.2-.2-.4l.6-1.1ZM7.9 7.8h9L15.7 11c-.2.5-.6.8-1.2.8H9.4l-1.6-4Z'/></svg>",
	},
	shipping: {
		label: 'Dostawa',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M3 6.75C3 5.784 3.784 5 4.75 5H15V7.313l.05.027 5.056 2.73.394.212v3.468a1.75 1.75 0 01-1.75 1.75h-.012a2.5 2.5 0 11-4.975 0H9.737a2.5 2.5 0 11-4.975 0H3V6.75zM13.5 14V6.5H4.75a.25.25 0 00-.25.25V14h.965a2.493 2.493 0 011.785-.75c.7 0 1.332.287 1.785.75H13.5zm4.535 0h.715a.25.25 0 00.25-.25v-2.573l-4-2.16v4.568a2.487 2.487 0 011.25-.335c.7 0 1.332.287 1.785.75zM6.282 15.5a1.002 1.002 0 00.968 1.25 1 1 0 10-.968-1.25zm9 0a1 1 0 101.937.498 1 1 0 00-1.938-.498z'/></svg>",
	},
	gift: {
		label: 'Prezent',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M15.333 4C16.6677 4 17.75 5.0823 17.75 6.41699V6.75C17.75 7.20058 17.6394 7.62468 17.4473 8H18.5C19.2767 8 19.9154 8.59028 19.9922 9.34668L20 9.5V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.72334 20 4.08461 19.4097 4.00781 18.6533L4 18.5V9.5L4.00781 9.34668C4.07949 8.64069 4.64069 8.07949 5.34668 8.00781L5.5 8H6.55273C6.36065 7.62468 6.25 7.20058 6.25 6.75V6.41699C6.25 5.0823 7.3323 4 8.66699 4C10.0436 4.00011 11.2604 4.68183 12 5.72559C12.7396 4.68183 13.9564 4.00011 15.333 4ZM5.5 18.5H11.25V9.5H5.5V18.5ZM12.75 18.5H18.5V9.5H12.75V18.5ZM8.66699 5.5C8.16073 5.5 7.75 5.91073 7.75 6.41699V6.75C7.75 7.44036 8.30964 8 9 8H11.2461C11.2021 6.61198 10.0657 5.50017 8.66699 5.5ZM15.333 5.5C13.9343 5.50017 12.7979 6.61198 12.7539 8H15C15.6904 8 16.25 7.44036 16.25 6.75V6.41699C16.25 5.91073 15.8393 5.5 15.333 5.5Z'/></svg>",
	},
	tag: {
		label: 'Promocja',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M4.75 4a.75.75 0 0 0-.75.75v7.826c0 .2.08.39.22.53l6.72 6.716a2.313 2.313 0 0 0 3.276-.001l5.61-5.611-.531-.53.532.528a2.315 2.315 0 0 0 0-3.264L13.104 4.22a.75.75 0 0 0-.53-.22H4.75ZM19 12.576a.815.815 0 0 1-.236.574l-5.61 5.611a.814.814 0 0 1-1.153 0L5.5 12.264V5.5h6.763l6.5 6.502a.816.816 0 0 1 .237.574ZM8.75 9.75a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'/></svg>",
	},
	pin: {
		label: 'Lokalizacja',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M12 9c-.8 0-1.5.7-1.5 1.5S11.2 12 12 12s1.5-.7 1.5-1.5S12.8 9 12 9zm0-5c-3.6 0-6.5 2.8-6.5 6.2 0 .8.3 1.8.9 3.1.5 1.1 1.2 2.3 2 3.6.7 1 3 3.8 3.2 3.9l.4.5.4-.5c.2-.2 2.6-2.9 3.2-3.9.8-1.2 1.5-2.5 2-3.6.6-1.3.9-2.3.9-3.1C18.5 6.8 15.6 4 12 4zm4.3 8.7c-.5 1-1.1 2.2-1.9 3.4-.5.7-1.7 2.2-2.4 3-.7-.8-1.9-2.3-2.4-3-.8-1.2-1.4-2.3-1.9-3.3-.6-1.4-.7-2.2-.7-2.5 0-2.6 2.2-4.7 5-4.7s5 2.1 5 4.7c0 .2-.1 1-.7 2.4z'/></svg>",
	},
	calendar: {
		label: 'Kalendarz',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V7h15v12zM9 10H7v2h2v-2zm0 4H7v2h2v-2zm4-4h-2v2h2v-2zm4 0h-2v2h2v-2zm-4 4h-2v2h2v-2zm4 0h-2v2h2v-2z'/></svg>",
	},
	check: {
		label: 'Potwierdzenie',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M16.5 7.5 10 13.9l-2.5-2.4-1 1 3.5 3.6 7.5-7.6z'/></svg>",
	},
	star: {
		label: 'Gwiazdka',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M11.776 4.454a.25.25 0 01.448 0l2.069 4.192a.25.25 0 00.188.137l4.626.672a.25.25 0 01.139.426l-3.348 3.263a.25.25 0 00-.072.222l.79 4.607a.25.25 0 01-.362.263l-4.138-2.175a.25.25 0 00-.232 0l-4.138 2.175a.25.25 0 01-.363-.263l.79-4.607a.25.25 0 00-.071-.222L4.754 9.881a.25.25 0 01.139-.426l4.626-.672a.25.25 0 00.188-.137l2.069-4.192z'/></svg>",
	},
	send: {
		label: 'Wysyłka',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path fill-rule='evenodd' clip-rule='evenodd' d='M6.332 5.748c-1.03-.426-2.06.607-1.632 1.636l1.702 3.93 7.481.575c.123.01.123.19 0 .2l-7.483.575-1.7 3.909c-.429 1.029.602 2.062 1.632 1.636l12.265-5.076c1.03-.426 1.03-1.884 0-2.31L6.332 5.748Z'/></svg>",
	},
	home: {
		label: 'Strona główna',
		svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M12 4L4 7.9V20h16V7.9L12 4zm6.5 14.5H14V13h-4v5.5H5.5V8.8L12 5.7l6.5 3.1v9.7z'/></svg>",
	},
};

export const ICON_ENTRIES = Object.entries( ICON_LIBRARY );

// Dekoracyjna fala oddzielająca elementy — chowana na małych ekranach.
export const WAVE_SVG =
	"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 176' preserveAspectRatio='none' aria-hidden='true'><g transform='translate(-417,-1)'><path fill='currentColor' fill-rule='nonzero' d='M427.859333,1.61373035 L428.837883,1.40771987 L428.940888,1.89699476 C434.23118,27.0258836 432.657144,56.7108204 424.22674,90.9521835 L423.936684,92.1212678 C415.384901,126.328399 416.925439,153.988202 428.532588,175.116614 L429.132531,176.190657 L428.260956,176.680918 L428.015825,176.245131 C416.066337,155.001596 414.305898,127.221293 422.708797,92.9201565 L422.966542,91.8787322 C431.518889,57.6693434 433.240353,28.0282977 428.138895,2.95597365 L427.859333,1.61373035 Z'/></g></svg>";
