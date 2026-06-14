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

> Uwaga: `header` i `grid` powstały przed wprowadzeniem konwencji `bs-` — nie są przemianowane.

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
- **`anchor: true`** w `supports` każdego bloku — nadawanie ID z poziomu WP
- **`align: ["wide", "full"]`** gdzie blok ma sens na pełną szerokość
- **Kolory** — tylko z `BRAND_COLORS` (`src/config.ts`), `disableCustomColors` w `ColorPalette`
- **Fonty** — Titillium Web (nagłówki), Lato (treść)
- **SCSS** — `@use '../styles/config' as *;` w każdym pliku

## Tokeny designu

Źródło prawdy: `src/styles/_config.scss` + `src/config.ts`

Kolory: `--color-white`, `--color-black`, `--color-red`, `--color-green`, `--color-gray`, `--color-cream`
Border radius: `--border-radius: 4px`
