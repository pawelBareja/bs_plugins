# Plan: Własna wtyczka „Kalendarz Dostawy" — zamiennik Order Delivery Date

> Status: plan, nie zrealizowany. To trzecia iteracja koncepcji — zobacz „Historia" na dole po szczegóły dwóch poprzednich, odrzuconych podejść.

## Cel
Zastąpić obecnie używaną wtyczkę **Order Delivery Date Lite (OrdDD)** własną wtyczką w tym repo. Powody: OrdDD jest brzydkie, sprawia problemy, i użytkownik musiał doklejać własny, bardzo rozbudowany kod (JS wstrzykiwany przez `wp_footer`) żeby dodać funkcje, których OrdDD nie ma natywnie. Własna wtyczka ma mieć te funkcje wbudowane od razu, bez doklejania z zewnątrz.

## Kluczowa zmiana UX względem obecnego rozwiązania
**Kalendarz ma być cały czas widoczny inline** — nie pole tekstowe, które po kliknięciu otwiera wyskakujący popup (jak teraz w OrdDD + jQuery UI datepicker w trybie domyślnym).

## Dlaczego mamy teraz pewność, że to zadziała
Dostarczony przez użytkownika kod (`wp_footer` z logiką dla `#e_deliverydate`, `#h_deliverydate`, `#orddd_lite_time_slot`) to dowód na żywo, że **pola tekstowe rejestrowane przez Additional Checkout Fields API (`woocommerce_register_additional_checkout_field`) faktycznie renderują się i działają na tym dokładnym sklepie/checkout**. Technika `ustawWartosc()` (natywny setter DOM + dispatch eventów `input`/`change`/`blur`) w dostarczonym kodzie to standardowy sposób na programową zmianę pola kontrolowanego przez React — potwierdza to, że te pola żyją w tym samym systemie, który wcześniej zidentyfikowaliśmy jako jedyny działający mechanizm (blok „Additional information").

## Funkcje do natywnego odtworzenia (wyciągnięte z kodu OrdDD + doklejek użytkownika)

1. **Pole „Kod pocztowy dostawy"** — osobne pole (własny widget) nad kalendarzem, wartość zapamiętywana między wizytami (localStorage). **Dwukierunkowa synchronizacja z natywnym polem adresu `shipping-postcode`:**
   - Wpisanie kodu w naszym widgecie → przelicza dostępność kalendarza
   - Wpisanie/zmiana kodu w natywnym polu adresu dostawy (`shipping-postcode`) → **nadpisuje** wartość w naszym widgecie, przelicza dostępność na nowo
   - Jeśli po przeliczeniu wcześniej wybrana data przestaje być dostępna (np. zmiana kodu na spoza Warszawy, albo na obszar z innym wyliczeniem) → **data i godzina zerowane automatycznie**
   - To pole widgetu **nie jest** osobno rejestrowane w WooCommerce (nie trzeba go zapisywać do zamówienia) — realny, zapisywany kod pocztowy to i tak natywne pole adresu dostawy, które WooCommerce już zapisuje. Widget to czysto JS-owa pomoc UX do bramkowania kalendarza, zsynchronizowana z prawdziwym polem
2. **Bramka obszaru dostawy** — akceptowane tylko prefiksy 00-04 (Warszawa); poza zakresem → komunikat „Dostawa w wybranym terminie jest obecnie dostępna tylko na terenie Warszawy. Skontaktuj się z nami, aby ustalić termin dostawy." i kalendarz zablokowany
3. **Cutoff godzinowy 15:00** — przed 15:00 dziś jest dostępne (o ile nie weekend), po 15:00 najwcześniejszy dostępny to następny dzień roboczy
4. **Pełna blokada weekendów** — soboty i niedziele zablokowane w całym kalendarzu, nie tylko przy wyliczaniu najwcześniejszej daty (rozstrzygnięte: **tak, wszystkie**, w odróżnieniu od tego, co realnie robił dostarczony kod OrdDD-glue)
5. **Pole „Przedział czasowy" (godzina)** — opcjonalne, **całkowicie ukrywane** gdy wybrano „Odbiór osobisty"; wyróżniony styl (jasnozielone tło), własny placeholder i etykieta „Godzina" gdy widoczne
6. **Wykrywanie metody wysyłki** (Dostawa vs Odbiór osobisty) — nasłuch na zaznaczoną opcję w natywnym bloku wyboru metody wysyłki WooCommerce Blocks
7. **Wymagane pola przy próbie złożenia zamówienia** (tylko w trybie Dostawa): kod pocztowy + data — brak jednego z nich blokuje kliknięcie „Złóż zamówienie", przewija do brakującego pola, pokazuje komunikat po polsku
8. **Wszystkie komunikaty od razu po polsku** — własny tekst, bez potrzeby tłumaczenia cudzych komunikatów po fakcie (jak w obecnym kodzie robiono dla „Please select a delivery date")
9. **Data i godzina dostawy widoczne we wszystkich mailach WooCommerce** (klient + sklep), bez ingerencji w szablony

## Duże uproszczenie względem obecnego kodu doklejanego do OrdDD

Obecny kod jest tak rozbudowany (MutationObserver na całym `document.body`, `setInterval` co 500ms, wyszukiwanie elementów po treści etykiety, ręczne triki na natywnym setterze DOM) **ponieważ dokleja się z zewnątrz do cudzej wtyczki**, nie znając z góry kiedy i gdzie React ją wyrenderuje. Budując własne pola od zera, większość tej gimnastyki znika — podpinamy się bezpośrednio pod własne pola z prawdziwymi listenerami zamiast zgadywać zmiany w DOM przez obserwery i odpytywanie w pętli.

## Architektura techniczna

1. **Rejestracja pól** przez `woocommerce_register_additional_checkout_field()` — **tylko dwa pola** (kod pocztowy się NIE rejestruje, patrz pkt. 1 listy funkcji wyżej):
   - `data_dostawy` (text — przechowuje wybraną datę ISO, wypełniane programowo przez kalendarz, nie ręcznie wpisywane przez klienta)
   - `przedzial_czasowy` (select — opcje z `config.php`)

   Widget „Kod pocztowy" nad kalendarzem to osobny element wstrzykiwany przez JS (`assets/checkout-enhance.js`), zsynchronizowany dwukierunkowo z natywnym polem `shipping-postcode` — nie przechodzi przez Additional Checkout Fields API
2. **Kalendarz inline** — jQuery UI Datepicker (już załadowany na stronie dzięki dotychczasowemu OrdDD, więc wiemy że jest dostępny; do potwierdzenia że zostanie załadowany też PO usunięciu OrdDD — patrz „Otwarte pytania") w trybie **inline** (podpięty do `<div>`, nie `<input>` → renderuje się na stałe zamiast wyskakiwać), z `beforeShowDay` blokującym niedostępne dni i `onSelect` zapisującym wybór do pola `data_dostawy`
3. **Logika dostępności** — PHP (`config.php` + `availability.php`, w dużej mierze recykling z poprzedniej próby): sloty czasowe, cutoff, pełna blokada weekendów, `blocked_dates`, prefiksy pocztowe
4. **REST endpoint** zwracający dozwolone daty dla podanego kodu pocztowego, konsumowany przez `beforeShowDay` kalendarza
5. **Wykrywanie metody wysyłki** — nasłuch na natywny blok wyboru metody wysyłki WooCommerce Blocks (ukrywanie pola godziny dla odbioru osobistego)
6. **Walidacja wymagalności — dwutorowo:**
   - Client-side (UX): blokada kliknięcia „Złóż zamówienie" + przewinięcie + komunikat (jak teraz), ale własnym, prostszym kodem podpiętym pod własne pola
   - Server-side (bezpieczeństwo, niezależne od JS): hook `woocommerce_store_api_checkout_update_order_from_request`
7. **Zapis do zamówienia + maile** — `order-meta.php`, `emails.php` (`woocommerce_email_order_meta`) — w dużej mierze recykling z poprzedniej próby, bo ten kawałek nigdy nie był problemem

## Struktura plików
```
src/bs-delivery-date/
├── config.php               ← sloty czasowe, cutoff_time, allowed_postal_prefixes,
│                               blocked_dates (weekendy blokowane zawsze w kodzie, nie w configu)
├── includes/
│   ├── availability.php     ← dozwolone daty (pełna blokada sob/nd + cutoff + blocked_dates)
│   ├── rest-api.php         ← GET endpoint dostępności dla kalendarza
│   ├── checkout-fields.php  ← woocommerce_register_additional_checkout_field() x3
│   ├── validation.php       ← woocommerce_store_api_checkout_update_order_from_request
│   ├── order-meta.php       ← zapis do zamówienia
│   └── emails.php           ← woocommerce_email_order_meta
├── assets/
│   ├── checkout-enhance.js  ← inline kalendarz (jQuery UI datepicker), ukrywanie godziny
│   │                          dla odbioru osobistego, walidacja wymagalności
│   └── checkout-enhance.css← stałe wg. widoczny kalendarz, wyróżnienie pola godziny
└── bs-delivery-date.php     ← bootstrap: require + enqueue + hooki, dołączany z bs-plugins.php
```

## Kroki budowy (kolejność)
1. `config.php` + `availability.php` — logika dostępności (czysty PHP, można zweryfikować niezależnie)
2. `checkout-fields.php` — rejestracja 3 pól przez Additional Checkout Fields API, sprawdzić że się w ogóle pojawiają (**to jest już potwierdzone że działa dzięki dowodowi z OrdDD** — mniejsze ryzyko niż poprzednio)
3. `rest-api.php` — endpoint dostępności
4. `assets/checkout-enhance.js` — inline kalendarz + ukrywanie godziny + walidacja wymagalności (JS, można rozwijać stopniowo: najpierw sam kalendarz, potem reszta)
5. `validation.php` + `order-meta.php` — blokada server-side i zapis
6. `emails.php` — widoczność w mailach
7. Dezaktywacja/usunięcie OrdDD po potwierdzeniu, że nowa wtyczka działa w pełni (nie wcześniej — żeby nie zostać bez działającego rozwiązania w trakcie testów)

## Otwarte pytania (do ustalenia przed startem budowy)
- [ ] Czy `jquery-ui-datepicker` ma zostać enqueue'owany przez naszą wtyczkę wprost (`wp_enqueue_script('jquery-ui-datepicker')` — to biblioteka wbudowana w WordPress, więc dostępna niezależnie od OrdDD), zamiast polegać na tym że coś inne ją już ładuje — **tak, zakładam to jako oczywisty krok, żeby nie być zależnym od OrdDD po jego usunięciu**
- [ ] Dokładne etykiety/teksty pól (czy zostają identyczne jak teraz, czy coś zmieniamy)
- [ ] Czy sloty czasowe (10-13/13-16/16-19) się nie zmieniają
- [ ] Kolejność wdrożenia: budujemy i testujemy NOWĄ wtyczkę **obok** działającego OrdDD (różne pola, różne ID), czy od razu w jego miejsce

## Środki ostrożności (wnioski z poprzedniej próby)
- Brak PHP lokalnie i brak stagingu — te same ograniczenia co poprzednio, ta sama procedura: backup przed wgraniem, test w godzinach niskiego ruchu, gotowy natychmiastowy rollback
- W przeciwieństwie do poprzedniej próby, tym razem mechanizm bazowy (Additional Checkout Fields API) **jest już potwierdzony jako działający na żywo** na tym sklepie (dowód: obecnie działający OrdDD) — to istotnie zmniejsza ryzyko względem poprzedniej próby, gdzie cały fundament (`registerCheckoutBlock`) okazał się ślepym zaułkiem

---

## Historia — poprzednie odrzucone podejścia

### Próba 1: custom blok Checkout przez `registerCheckoutBlock`
Pełna ścieżka „Dostawa" + „Odbiór osobisty" jako własny blok wpięty w blok Checkout przez `registerCheckoutBlock` (`@woocommerce/blocks-checkout`) + `IntegrationInterface`. Zbudowana, wdrożona na produkcję, **nie zadziałała**: blok rejestrował się poprawnie w wewnętrznym rejestrze WooCommerce (`getRegisteredBlocks`), ale z flagą `force: false` — bloki firm trzecich z tą flagą nie mają żadnego miejsca w standardowym edytorze do ręcznego wstawienia (cała struktura „Checkout Fields" to zablokowane bloki rdzenia bez ogólnego „+"). **Cofnięta całkowicie** (repo przez `git checkout`, serwer z backupu).

### Próba 2: zwykły blok Gutenberga + `extensionCartUpdate`
Koncepcja: zwykły blok (jak `bs-hero`, `bs-button`) wstawiany ręcznie w edytorze obok bloku Checkout, wołający `window.wc.blocksCheckout.extensionCartUpdate(...)` z zewnątrz. Teoretycznie solidna (funkcja potwierdzona jako realna i wywoływalna z dowolnego miejsca), ale **nigdy nie zweryfikowana na żywo** — zarzucona na rzecz Próby 3 po tym, jak użytkownik dostarczył dowód działania Additional Checkout Fields API (kod OrdDD), co jest znacznie pewniejszym fundamentem.

### Próba 3 (obecna, opisana wyżej)
Additional Checkout Fields API + jQuery UI Datepicker inline, jako pełny zamiennik OrdDD. Największa różnica: fundament (rejestracja pól) jest **potwierdzony jako działający już teraz** na tym sklepie, nie tylko teoretycznie.
