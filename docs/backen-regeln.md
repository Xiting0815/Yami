# Backen & Desserts – Regeln für Schreib-Agenten

Ziel: je Gruppe ca. 10 Rezepte. Jede Gruppe bearbeitet **nur ihre eigene Datei** – keine gemeinsamen Dateien anfassen.

| Gruppe | Datei | Schwerpunkt |
|---|---|---|
| Desserts | `src/data/extra/desserts.ts` | Desserts für Gäste (Tiramisu, Panna cotta, Mousse, Crème brûlée, Rote Grütze, Germknödel …) |
| Kuchen | `src/data/extra/kuchen.ts` | Blechkuchen & Hefeteig, nicht zu schwierig (Bienenstich ist das Schwierigste) |
| Brot & Brötchen | `src/data/extra/brot.ts` | Brot mit Dampf im CombiSteamer inkl. Sauerteig, italienische Brötchen, Focaccia |
| Plätzchen & Cookies | `src/data/extra/gebaeck.ts` | Weihnachtsplätzchen, Cookies, italienisches Kleingebäck (Cantuccini, Amaretti …) |

Vorbilder: `vanillekipferl` + `chocolate-chip-cookies` (gebaeck.ts), `tiramisu` (desserts.ts), `bienenstich` (kuchen.ts), `sauerteig-anstellgut` + `bauernbrot-sauerteig` (brot.ts). Geräte-Regeln zusätzlich: `docs/geraete/regeln.md`, `docs/geraete/vzug.md`.

## 1. Dateiformat

```ts
import { backen, prod } from '../define'
import type { ExtraGroup } from './types'

export const kuchen: ExtraGroup = {
  recipes: [
    backen('kuchen', 'butterkuchen', 'Butterkuchen vom Blech',
      {
        cuisine: 'de',            // optional, Standard 'de' ('it' für Italienisches)
        time: 120,                // Gesamtzeit in Min. inkl. Gehzeit (über Nacht: mitrechnen)
        yields: { name: 'Butterkuchen (selbstgebacken)', amount: 20, unit: 'Stk', shelf: 2, store: 'luftdicht bei Raumtemperatur', frozen: 90 },
        lighter: 'Ein Satz: was man ändert und was es spart (… spart rund 60 kcal pro Stück).',
      },
      '500 g Weizenmehl | 21 g Hefe frisch | 250 ml Milch | …',   // Zutaten für 1 Rezept (1 Blech/Form/Laib), "|" getrennt
      ['Schritt 1 …', 'Schritt 2 …', 'Schritt 3 …']),            // klassische Schritte (Backofen), mind. 3
  ],
  catalog: { konserven: ['Hagelzucker'] },                        // nur NEUE Zutaten
  products: { Hagelzucker: prod(250, 'g', 1.49, 365, 365, 'Pck') }, // Packung, Einheit, €, Tage, angebrochen, Packungsname
  nutrition: { Hagelzucker: [400, 0, 0, 100, 0] },                 // pro 100 g/ml: kcal, Eiweiß, Fett, KH, Ballaststoffe
  grams: { Hagelzucker: { EL: 12 } },                              // Gramm je Einheit (Pflicht für Stk/Pck/EL … neuer Zutaten)
  convert: { Hagelzucker: { EL: 12 } },                            // Rezepteinheit → Packungseinheit, wenn sie abweicht
  substitutes: { groups: { … }, preferred: { … } },               // nur Brot, siehe 5.
  deviceSteps: { butterkuchen: [ { text: '…', settings: [ … ] } ] },
  imageQueries: { butterkuchen: 'Butterkuchen sheet cake' },        // englischer/deutscher Suchbegriff für Wikimedia
}
```

`backen(kind, id, title, options, zutaten, schritte)` – `kind`: `'dessert' | 'kuchen' | 'brot' | 'gebaeck' | 'grundrezept'`. Weihnachtsplätzchen bekommen in den Optionen `festive: ['plaetzchen']` (Fenster 15. Nov.–26. Dez.: in der Backen-Liste ganz oben, Badge „🎄 Plätzchenzeit“). IDs klein, mit Bindestrich, eindeutig.

## 2. Ergebnis (`yields`) – kommt bei „Fertig gebacken“ in den Vorrat

- **Name**: eindeutig, mit Zusatz: `„… (selbstgebacken)“` für Kuchen, `„… (selbstgemacht)“` für Desserts, Brot `„… selbstgebacken“` (z. B. `Bauernbrot selbstgebacken`, `Ciabatta selbstgebacken`, `Brötchen selbstgebacken`). Katalog (Backwaren), Produkt (Preis = Warenwert) und Nährwerte entstehen **automatisch** – nicht selbst eintragen.
- **Einheit**:
  - Kuchen → `Stk` (Blech 20–24, Springform 12–16, Kastenform 12–15, Muffins 12).
  - Desserts → `Portion` (meist 4–8). Germknödel/Dampfnudeln → `Stk`.
  - Brot-Laib → `g` (Laibgewicht nach dem Backen, z. B. 1000); liegt im Vorrat in **Scheiben à 50 g**, „1 Scheibe gegessen“.
  - Plätzchen, Cookies, Kleingebäck (`gebaeck`) → `Stk` (Vanillekipferl 40, Ausstechplätzchen 50, Cookies 16–20; Doppelkekse wie Spitzbuben/Baci di dama zählen als 1 Stk).
  - Brötchen, Ciabatta, Focaccia-Stücke → `Stk` (Brötchen 8–12, Ciabatta 2, Focaccia 12 Stücke).
  - `g` gibt es nur bei Brot; `ml` nur bei flüssigen Grundrezepten.
- **shelf** (Tage, so gelagert wie `store`): Sahne-/Cremetorten und Desserts 2–3 (Kühlschrank), Hefe-/Blechkuchen ohne Creme 2–3, Rührkuchen 4–5, Brot 4–6, Brötchen/Focaccia 1–2, Plätzchen 14–28 (Blechdose, gefüllte/weiche Sorten 14–21, Cookies 7–10, Cookies mit Skyr 4 im Kühlschrank).
- **store**: kurz, beginnt mit Präposition: „im Kühlschrank“, „luftdicht bei Raumtemperatur“, „in Papier oder im Brotkasten“.
- **frozen** (optional, Tage eingefroren): Brot/Brötchen/Hefekuchen ohne Creme 90, Rührkuchen 60, Plätzchen 60–90 (besser den Teig einfrieren: in Folie bis 3 Monate, im Kühlschrank auftauen – als Hinweis im Schritt „Teig kühlen“). Bei Sahne/Creme/Gelatine weglassen.
- **Nährwerte je Stück** werden aus den Zutaten berechnet (Summe ÷ Stückzahl). `perPiece` nur angeben, wenn das nicht passt (z. B. Frittiertes).
- Zutatenmengen gelten für **ein Rezept** (Stepper „Rezeptmenge ×2“ verdoppelt alles).

## 3. Kalorien & „Leichter“

Klassische Rezepte (nicht abspecken). Jedes Dessert/Kuchen/Brot hat `lighter`: **ein** konkreter Satz mit Tausch + Ersparnis, z. B. „Die Hälfte des Mascarpones durch Skyr ersetzen … – spart rund 170 kcal pro Portion.“ Ersparnis grob nachrechnen. Typisch: Skyr/Magerquark statt Sahne/Mascarpone, weniger Zucker, Obst statt Creme, kleinere Stücke (Blech in 24 statt 20), dünnere Scheiben, Vollkornmehl.

## 4. Geräte (Werte werden von `npm run check-data` geprüft)

Betriebsarten **exakt** wie in `docs/geraete/regeln.md` („Heißluft“ mit ß). Kuchen, Brot und Plätzchen/Cookies **brauchen** `deviceSteps`; Desserts ohne Hitze und Grundrezepte dürfen ohne.

| Was | Gerät · Betriebsart | °C | Min. | Hinweis (`note`) |
|---|---|---|---|---|
| Brot (Laib), Sauerteig | CombiSteamer · Heißluft mit Beschwaden, dann Heißluft | 230 → 200 | 10 + 40–50 | „vorheizen, Kuchenblech Ebene 2“; Wasserbehälter füllen; Beschwaden-Phase Tür zu |
| Brötchen, Ciabatta, Hefezopf | CombiSteamer · Heißluft mit Beschwaden | 200–220 (Zopf 170–180) | 15–25 | Kuchenblech nur über 150 °C; Alternative `Profi-Backen bemehlt/bestrichen` |
| Teig gehen lassen | CombiSteamer · Profi-Backen Aufgehen lassen | 35 | 30–60 | Schüssel abgedeckt auf den Gitterrost; danach erst den Backofen vorheizen |
| Rührkuchen, Blechkuchen, Biskuit, Hefekuchen | Combair · Ober-/Unterhitze (eine Ebene) oder Heißluft (zwei Ebenen) | 160–180 (Heißluft 20 °C weniger) | 20–60 | „vorheizen“, Ebene 2; Stäbchenprobe im Text |
| Plätzchen, Cookies (zwei Bleche) | Combair · Heißluft, Ebene 1+3 (20 °C weniger als Ober-/Unterhitze) | 130–160 | 8–16 | „vorheizen“, „zwei Bleche, Ebene 1+3“; ein Blech: Ober-/Unterhitze 150–180, Ebene 2; mehr Stücke als zwei Bleche → in Runden backen |
| Focaccia, Pizza bianca | Combair · PizzaPlus | 220–250 | 15–25 | dunkles Blech mit Öl, **ohne** Backpapier, Ebene 2, vorheizen |
| Dampfnudeln, Germknödel | CombiSteamer · Dämpfen | 100 | 20–25 | kein Vorheizen; „Wasserbehälter füllen“; gelochter Garbehälter mit Backpapier |
| Crème brûlée, Flan, Pudding im Glas | CombiSteamer · Dämpfen | 85–90 | 20–35 | Förmchen mit Folie abdecken |
| Cremes, Pudding, Vanillesoße, Karamell, Wasserbad | BORA · `Kochzone` + `level` | | | Milch aufkochen `6`, Pudding `3`, Wasserbad/Schokolade `Schmelzen` oder `3` |
| Schokolade/Kuvertüre für Plätzchen, Eiweiß-Zucker-Masse (Makronen), Butter bräunen | BORA · `Kochzone` + `Schmelzen` (Wasserbad), Eiweißmasse `3`, Butter bräunen `4` | | | note „im Wasserbad“ |
| Kühlen, Schlagen, Schichten | – (Schritt ohne `settings`) | | | |

- Ein Gebäck bleibt beim Backen in einem Ofen (nicht für die Kruste umziehen). Nur das Gehenlassen im CombiSteamer ist vor dem Backen im Combair erlaubt.
- Kein Kuchenblech beim Dämpfen; keine Alufolie auf den Combair-Boden; Kerntemperatur nur 40–95 °C (bei Brot weglassen, Klopfprobe im Text).
- `deviceSteps`-Texte im Stil der Schritte, jede Zutat im Schritt nennen, in dem sie gebraucht wird (Kochmodus ordnet danach zu). Mengen dürfen im Text stehen („100 g von der Butter“). Gleiche Zutat nur **einmal** in der Zutatenliste (Mengen addieren).

## 5. Zutaten

- Erst prüfen, ob es die Zutat schon gibt (`src/data/catalog.ts`, z. B. Weizenmehl, Weizenmehl Tipo 00, Hefe frisch, Milch, Sahne, Butter, Ei, Eigelb, Zucker, Puderzucker, Vanillezucker, Backpulver, Speisestärke, Backkakao, Honig, Mascarpone, Skyr, Magerquark, Mandeln). Schon da → nicht neu anlegen (check-data meldet Doppelte). Von anderen Gruppen neu angelegte Zutaten (z. B. `Roggenmehl`, `Mandelblättchen`, `Vanillepuddingpulver`, `Löffelbiskuits`, `Kaffee gemahlen`) darf man verwenden, aber nicht noch einmal anlegen.
- Neue Zutat = Eintrag in `catalog` + `products` + `nutrition` (+ `grams` für Stk/Pck/EL/TL/Blatt …; + `convert`, wenn die Rezepteinheit nicht die Packungseinheit ist). Mehl/Zucker-artige Grundzutaten unter `vorrat`, sonst passender Abschnitt.
- Einheiten: `g kg ml l Stk EL TL Prise Bund Zehe Dose Pck Scheibe Zweig Glas Becher Blatt`. Wasser ist keine Zutat (nur im Schritttext). Gelatine o. Ä. zusätzlich in `nonVeg`.
- **Brot-Austausch** (nur brot.ts): selbstgebackenes Brot ersetzt gekauftes. Gruppen haben dieselbe Vorratseinheit:
  - `'brot-scheibe'` (Scheiben à 50 g): `Vollkornbrot` ← Laibe, z. B. `Bauernbrot selbstgebacken`, `Vollkornbrot selbstgebacken` (Ergebnis in `g`).
  - `ciabatta` (Stk): `Ciabatta` ← `Ciabatta selbstgebacken` (Ergebnis in `Stk`).
  - `broetchen` (Stk): `Brötchen vom Vortag` ← `Brötchen selbstgebacken` (Ergebnis in `Stk`).
  - Eintragen: `substitutes: { groups: { 'brot-scheibe': ['Vollkornbrot selbstgebacken'] }, preferred: { Vollkornbrot: ['Vollkornbrot selbstgebacken'] } }` – `preferred` = wird vor dem Gekauften genommen.
- Sauerteigbrote nehmen `Anstellgut` als Zutat (z. B. `30 g Anstellgut`); das Grundrezept `sauerteig-anstellgut` steht in brot.ts.

## 6. Texte

Deutsch, Imperativ, ein bis zwei Sätze pro Schritt, konkret (Form/Blechgröße, Gehzeit, Garprobe). Keine Emojis, keine Werbesprache. Titel ohne „selbstgemacht“ (das steht nur im Ergebnis-Namen).

## 7. Prüfen (vor der Übergabe)

```
npx tsc -b
npm run -s check-data
npx vite-node scripts/test-backen.ts
npx vite-node scripts/test-devices.ts
npx vite-node scripts/test-cook.ts
```

`check-data` prüft u. a.: bekannte Zutaten mit Produkt/Nährwerten/Gewicht, keine Doppelten, Geräte-Einstellungen im erlaubten Bereich, Kuchen/Brot mit Geräte-Schritten, Bild-Suchbegriff, `lighter`-Tipp, plausible kcal je Stück, Austausch-Gruppen mit gleicher Einheit.
