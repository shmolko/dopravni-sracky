# Architektura

## Cíl

První verze je malá statická webová aplikace bez backendu. Důvod je jednoduchý:

- nejsou potřeba účty
- není potřeba ukládat průběh
- dataset je zatím jen pro čtení
- appka se dá snadno otevřít lokálně nebo nasadit jako statický web

## Soubory

- `index.html`
  - základní struktura obrazovek
  - setup lekce
  - obrazovka lekce
  - přehled značek
  - dialog s detailem značky

- `styles.css`
  - mobilní layout
  - vzhled karet
  - vzhled tlačítek
  - study grid
  - dialog a toast

- `signs.js`
  - seznam kategorií
  - dataset značek
  - zdrojové URL obrázků
  - jednoduché inline SVG pro vodorovné značky a dodatkové tabulky

- `script.js`
  - stav aplikace
  - render výběru kategorií
  - vytvoření zamíchané lekce
  - ovládání karty
  - swipe navigace
  - render přehledu a detailu

## Stav aplikace

Appka drží jen pár hodnot:

- `selectedCategoryIds`
  - vybrané kategorie před startem lekce

- `lessonDeck`
  - zamíchané pořadí značek pro aktuální lekci

- `currentIndex`
  - pozice aktuální karty v lekci

- `isFlipped`
  - jestli je karta otočená na textovou stranu

## Tok lekce

1. Uživatel vybere kategorie.
2. Po kliknutí na `Start!` se vyfiltrují značky z vybraných kategorií.
3. Seznam se jednou zamíchá.
4. Lekce jede po tomto pořadí.
5. Dokud balíček neskončí, nejsou opakování.
6. Nová lekce vytvoří nové zamíchání.

## Proč není backend

V první verzi by backend jen zbytečně přidal složitost:

- nic se neukládá na server
- nejsou profily uživatelů
- není admin rozhraní
- není potřeba API

Pokud by později přibylo ukládání postupu nebo editace datasetu, backend už začne dávat smysl.

## Dataset

Každá značka má:

- `id`
- `code`
- `category`
- `nameCz`
- `shortMeaning`
- `detailsCz`
- `imageUrl`
- `sourceUrl`

`shortMeaning` je krátké vysvětlení pro zadní stranu karty. `detailsCz` je jednodušší rozšíření pod ním.

## Obrázky

- svislé značky používají veřejné obrázky z Wikimedia Commons
- vodorovné značky a dodatkové tabulky mají v první verzi jednoduché inline SVG nákresy

Tohle řešení drží projekt malý a zároveň nepřidává desítky lokálních assetů.
