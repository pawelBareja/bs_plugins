# Konwencje projektu bs_plugins

## Nazewnictwo bloków

Każdy blok ma przedrostek `bs-` zarówno w:
- nazwie folderu: `src/bs-<nazwa>/`
- nazwie bloku w `block.json`: `bs-plugins/bs-<nazwa>`
- rejestracji w `bs-plugins.php`: `'bs-<nazwa>'`

## Zrealizowane bloki

| Folder          | Nazwa bloku              | Opis                                      |
|-----------------|--------------------------|-------------------------------------------|
| `src/header/`   | `bs-plugins/header`      | Nagłówek z ikoną, tytułem i podtytułem   |
| `src/grid/`     | `bs-plugins/grid`        | Dwie kolumny: obrazek + tekst             |
| `src/bs-button/`| `bs-plugins/bs-button`   | Przycisk z wariantami i rozmiarami        |
| `src/bs-hero/`     | `bs-plugins/bs-hero`     | Hero z tłem, h1, InnerBlocks na przyciski  |
| `src/bs-features/` | `bs-plugins/bs-features` | 1–5 kolumn: numer + tytuł + opis          |
| `src/bs-hero-home/` | `bs-plugins/bs-hero-home` | Hero strony głównej: tytuł, animowany wiersz tekstu (max 3), przycisk, zdjęcie z efektem zoom na scroll |
| `src/bs-icons-bar/` | `bs-plugins/bs-icons-bar` | Rząd 2–5 ikon (z biblioteki @wordpress/icons) z opcjonalnym tekstem, fala-separator chowana na mobile |
| `src/bs-faq/` | `bs-plugins/bs-faq` | FAQ: kategorie (zakładki) + akordeon pytań/odpowiedzi |
| `src/bs-produkty-slider/` | `bs-plugins/bs-produkty-slider` | Slider produktów WooCommerce (najnowsze / kategoria / tag / ręcznie wybrane przez FormTokenField + WC Store API), autoplay z pauzą na hover |
| `src/bs-testimonies/` | `bs-plugins/bs-testimonies` | Slider z opiniami Google (Places API), wyszarzona stylistyka, „zobacz więcej” dla długich opinii |
| `src/bs-topbar/` | `bs-plugins/bs-topbar` | Kolorowa belka nad nagłówkiem: przewijający się tekst + przycisk, kampanie zależne od daty (Dzień Matki, Walentynki itp.) |
| `src/bs-icon/` | `bs-plugins/bs-icon` | Pojedyncza ikona z biblioteki (`src/icons.ts`) — wybór ikony, rozmiar, kolor z palety marki. Blok statyczny (wyjątek, patrz „Zasady ogólne”), do osadzania w innych blokach (np. w kolumnie tekstowej `grid` przez InnerBlocks) |
| `src/bs-karty/` | `bs-plugins/bs-karty` | 1–5 kart: obrazek (opcjonalna arka), tytuł, treść, przycisk — np. sekcja oferty (Śluby / Dla Firm / Konferencje) |
| `src/bs-usp/` | `bs-plugins/bs-usp` | Sekcja USP: zdjęcie na tle kształtu (arka, kolor i rozmiar regulowane), tekst poniżej. Lekka animacja paralaksy przy scrollu (`view.ts`) |

> Uwaga: `header` i `grid` powstały przed wprowadzeniem konwencji `bs-` — nie są przemianowane.
>
> `grid` ma od teraz dodatkowo wolny obszar `InnerBlocks` w kolumnie tekstowej (po `tytul`/`tresc`), dozwolone bloki: `core/paragraph`, `core/heading`, `core/separator`, `core/columns`, `core/list`, `bs-plugins/bs-icon` — do swobodnego układania treści (np. adres + ikona + godziny otwarcia w kolumnach).

## Struktura każdego bloku

```
src/bs-<nazwa>/
├── block.json       ← rejestracja, atrybuty, supports (zawsze: anchor: true)
├── types.ts         ← type (nie interface) dla atrybutów
├── index.ts         ← registerBlockType(metadata, { edit, save })
├── edit.tsx         ← komponent edytora
├── save.tsx         ← null (dynamic) LUB <InnerBlocks.Content /> (gdy InnerBlocks)
├── render.php       ← szablon frontendowy
├── style.scss       ← style front + edytor
├── editor.scss      ← style tylko w edytorze
└── bs-<nazwa>.stories.tsx
```

## Zasady ogólne

- **Dynamic blocks** — `save` zwraca `null`, wyjątek: bloki z `InnerBlocks` zwracają `<InnerBlocks.Content />`
- **Wyjątek: bloki statyczne** — `bs-icon` jest blokiem statycznym (`save` renderuje realny markup z SVG, brak `render` w `block.json`), bo ikony pochodzą ze wspólnej biblioteki `src/icons.ts` i nie trzeba ich duplikować w PHP
- **`anchor: true`** w `supports` każdego bloku — nadawanie ID z poziomu WP
- **`align: ["wide", "full"]`** gdzie blok ma sens na pełną szerokość
- **Kolory** — tylko z `BRAND_COLORS` (`src/config.ts`), `disableCustomColors` w `ColorPalette`
- **Fonty** — Titillium Web (nagłówki), Lato (treść)
- **SCSS** — `@use '../styles/config' as *;` w każdym pliku
- **Przycisk `.blok-przycisk`** — wspólny styl w `src/styles/_button.scss` (`@use '../styles/button';`), używany przez `bs-button` i bloki, które renderują własny przycisk (np. `bs-karty`)

## Tokeny designu

Źródło prawdy: `src/styles/_config.scss` + `src/config.ts`

Kolory: `--color-white`, `--color-black`, `--color-red`, `--color-green`, `--color-gray`, `--color-cream`
Border radius: `--border-radius: 4px`

## Globalne style dla natywnych bloków WP

Style dla natywnych bloków WordPress (nie własnych `bs-*`) trzymane są w `src/styles/_<nazwa>.scss` i dołączane przez `src/global.scss` → kompilowane do `build/global.css`, ładowane na całej stronie (`bs_plugins_enqueue_assets`).

- `_cf7.scss` — formularz Contact Form 7
- `_latest-posts.scss` — blok „Ostatnie wpisy”
- `_gallery.scss` — blok Galeria z dodatkową klasą `bs-galeria` (Advanced → Additional CSS class): zaokrąglone zdjęcia (4px), co drugie przesunięte o 50px na desktopie, podpisy pod zdjęciami, lekka animacja paralaksy na scroll

JS dla efektów scroll na natywnych blokach (poza blokami `bs-*`) — `src/global-view.ts`, osobny entry webpack `global-view`, ładowany jako `build/global-view.js`.
