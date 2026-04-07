# Dopravní sračky

Jednoduchá mobilní webová appka na učení českých dopravních značek.

## Co umí první verze

- výběr kategorií před startem lekce
- všechny kategorie jsou ve výchozím stavu zapnuté
- lekce používá zamíchaný balíček bez opakování, dokud nedojde
- klepnutí na kartu ji otočí
- tažení doleva a doprava přepíná karty
- přehled značek po kategoriích s detailem

## Kategorie v první verzi

- Výstražné
- Značky upravující přednost
- Zákazové
- Příkazové
- Vodorovné
- Dodatkové tabulky

## Jak to spustit

Protože je projekt statický, stačí otevřít `index.html` v prohlížeči.

Lepší varianta je jednoduchý lokální server:

```bash
python3 -m http.server 4173
```

Pak otevři `http://localhost:4173`.

## Kde je dokumentace architektury

Stručný popis najdeš v `docs/ARCHITECTURE.md`.
