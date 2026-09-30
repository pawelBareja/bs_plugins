# Plan: Autouzupełnianie danych firmy po NIP (checkout)

> Status: plan, nie zrealizowany.

## Cel
Przy zaznaczeniu „Potrzebuję faktury" w checkout i wpisaniu NIP-u — automatycznie uzupełnić pola „Nazwa firmy", „Ulica/adres", „Nr domu/lokalu", „Kod pocztowy" na podstawie publicznego rejestru, żeby klient nie musiał wpisywać tego ręcznie.

## Kontekst — czyje to pola
Te pola **nie są nasze** (nie z `bs-delivery-date`) — pochodzą z zainstalowanej na sklepie wtyczki **Checkout Field Editor** (widoczne po prefiksie klas `thwcfe-*` w DOM). Mają jednak istotną zaletę względem naszych własnych pól: **stałe, przewidywalne ID**, nie trzeba szukać ich po treści etykiety:

```
#section_one-company_data   ← checkbox "Potrzebuję faktury"
#section_one-company_name   ← Nazwa firmy
#section_one-company_ulica  ← Ulica/adres
#section_one-company_lokal  ← Nr domu/lokalu
#section_one-company_postal ← Kod pocztowy
#section_one-nip_number     ← Numer NIP
```

To realnie upraszcza integrację względem tego, co robiliśmy dla kalendarza dostawy.

## Źródło danych — rekomendacja: „Biała lista podatników VAT" (Ministerstwo Finansów)

**Dlaczego to, a nie oficjalne API GUS (REGON):**
- Biała lista (`wl-api.mf.gov.pl`) — **darmowe, bez rejestracji, bez klucza API**, zwykłe REST/JSON, zwraca nazwę firmy, adres i status VAT po NIP. Idealne do tego zakresu.
- GUS REGON API (BIR1.1) — wymaga wniosku o klucz API (proces rejestracyjny, może potrwać), protokół SOAP/XML (dużo bardziej złożony do integracji), przeznaczony do szerszych zastosowań niż nam tu potrzeba.

Jeśli w przyszłości okaże się, że Biała lista nie ma jakichś danych (np. firm niebędących płatnikami VAT), można rozważyć GUS jako uzupełnienie — ale nie na start.

## Architektura

1. **REST endpoint (PHP, server-side)** — wywołanie do API Ministerstwa Finansów dzieje się **po stronie serwera**, nie z przeglądarki:
   - Unika CORS (API rządowe niekoniecznie ma nagłówki pozwalające na wywołania z przeglądarki)
   - Ukrywa szczegóły implementacji, łatwo dodać cache/rate-limiting później, jeśli okaże się potrzebne
   - Endpoint: `GET /wp-json/bs-nip-lookup/v1/search?nip=XXXXXXXXXX`
   - Zwraca: `{ "found": true, "name": "...", "street": "...", "building_number": "...", "postal_code": "...", "city": "..." }` albo `{ "found": false }`

2. **JS (frontend)**:
   - Nasłuch na `#section_one-nip_number` (`input`/`blur`)
   - Walidacja formatu + sumy kontrolnej NIP **po stronie klienta** (patrz niżej) — zanim w ogóle strzelamy zapytanie do API, żeby nie odpytywać dla oczywiście błędnych numerów
   - Po pozytywnej walidacji (10 cyfr, poprawna suma kontrolna) — wywołanie naszego REST endpointu
   - Przy trafieniu: uzupełnienie pól tym samym mechanizmem „natywny setter + dispatch eventów" (`ustawWartosc()`), którego już używamy w `checkout-enhance.js` — te pola też są kontrolowane przez React
   - Wskaźnik stanu: „Szukam danych firmy..." podczas zapytania, komunikat przy braku wyniku

3. **Walidacja sumy kontrolnej NIP** (żeby nie odpytywać API bez sensu):
   Wagi `[6, 5, 7, 2, 3, 4, 5, 6, 7]` dla pierwszych 9 cyfr, suma modulo 11 musi równać się 10. cyfrze NIP. Prosty, dobrze znany algorytm — do zaimplementowania identycznie w JS (szybki feedback) i w PHP (prawdziwa bramka przed wywołaniem zewnętrznego API).

## Gdzie to umieścić w repo
Osobny, nowy moduł — **nie wewnątrz `bs-delivery-date`** (niepowiązana funkcjonalność, inna wtyczka trzecia, którą wzbogacamy). Ten sam, sprawdzony wzorzec wdrożenia co przy kalendarzu dostawy:

```
src/bs-nip-lookup/
├── bs-nip-lookup.php          ← bootstrap, enqueue tylko na checkout
├── includes/
│   └── rest-api.php           ← endpoint + wywołanie Białej listy + walidacja sumy kontrolnej
└── assets/
    ├── nip-lookup.js
    └── nip-lookup.css         ← stylowanie stanu ładowania/komunikatów
```
Dopisanie do `webpack.config.js` (kolejny wpis `CopyWebpackPlugin`, analogicznie do `bs-delivery-date`) i do `bs-plugins.php` (kolejny `require_once`).

## Otwarte pytania / ryzyka do ustalenia przed budową

- [ ] **Rozbicie adresu na „Ulica/adres" i „Nr domu/lokalu"** — API zwraca adres jako jeden ciąg (np. „ul. Przykładowa 12/3"), trzeba go rozdzielić. Regex „na wyczucie" (ostatni fragment z cyframi = numer domu/lokalu, reszta = ulica) — nie będzie działać idealnie dla wszystkich nietypowych formatów adresów, ale pokryje większość przypadków. Do zaakceptowania jako znane ograniczenie.
- [ ] **Nadpisywanie już wypełnionych pól** — czy auto-uzupełnianie nadpisuje to, co klient już ręcznie wpisał, czy tylko wypełnia puste pola? Rekomendacja: wypełniać zawsze przy nowym, poprawnym NIP (klient i tak może to nadpisać ręcznie po fakcie), ale to do potwierdzenia.
- [ ] **Zachowanie przy braku wyniku** — komunikat + zostawienie pól do ręcznego wypełnienia (nie blokujemy checkoutu z tego powodu — to tylko wygoda, nie wymóg)
- [ ] **Debounce** — ile poczekać po ostatnim wpisanym znaku zanim odpalimy zapytanie (proponowane: 500ms, albo dopiero na `blur`)

## Kroki budowy (kolejność)
1. `includes/rest-api.php` — walidacja sumy kontrolnej NIP + wywołanie Białej listy + endpoint
2. Test endpointu samodzielnie (np. przez przeglądarkę/curl na żywym serwerze, prawdziwym NIP) — zanim podłączymy JS
3. `assets/nip-lookup.js` — nasłuch na pole NIP, wywołanie endpointu, uzupełnienie pól
4. `assets/nip-lookup.css` — stan ładowania/komunikaty
5. `bs-nip-lookup.php` — bootstrap, enqueue
6. Wpisy w `webpack.config.js` i `bs-plugins.php`
7. Test na żywo: poprawny NIP → uzupełnia pola; zły NIP → komunikat; edycja pól po auto-uzupełnieniu → działa normalnie
