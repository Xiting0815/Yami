# BBQ & Küche „Amerikanisch“ – Regeln für Schreib-Agenten

Jede Gruppe bearbeitet **nur ihre eigene Datei**. Keine zentralen Dateien anfassen (catalog.ts, products.ts, nutrition.ts,
substitutes.ts, index-Dateien, Tests).

| Gruppe | Datei | Schwerpunkt |
|---|---|---|
| Smoker | `src/data/extra/bbq/bbq-smoker.ts` | Traeger: Pulled Pork, Spareribs/Baby Back Ribs, Brisket, Burnt Ends, Pork Belly, Chicken Wings, Pastrami |
| Grill | `src/data/extra/bbq/bbq-grill.ts` | Gasgrill: Steaks (Reverse Sear), Spieße, Beer Can Chicken, Wings, Maiskolben als Hauptgang, Planked Salmon |
| Dutch Oven | `src/data/extra/bbq/dutch.ts` | Gas: Chili, Schmorgerichte, Pit Beans im Topf, Pulled Chicken, Cobbler |
| Burger | `src/data/extra/bbq/burger.ts` | Smash Burger, Bacon-Cheeseburger, Pulled-Pork-Burger (aus Vorrat), Chicken Burger |
| Beilagen | `src/data/extra/bbq/beilagen.ts` | Pit Beans, Coleslaw, Cornbread, Mac & Cheese vom Smoker, Potato Salad, Grillmais |
| Rubs & Saucen | `src/data/extra/bbq/rubs-saucen.ts` | Grundrezepte: Rubs (Memphis, Texas SPG, Chicken), Saucen (KC, Carolina Vinegar, Alabama White, Mop) |
| Amerikanisch | `src/data/recipes-us.ts` + `src/data/device-steps/us.ts` | Alltag im Wischstapel: Jambalaya, Gumbo, Sloppy Joe, Mac & Cheese, Chili, Resteessen mit Pulled Pork/Brisket |

Vorbilder: `pulled-pork` (Smoker, Reste vakuumiert), `beer-can-chicken` (Gasgrill indirekt), `chili-dutch-oven`
(Dutch auf Gas, Reste als Portionen), `bacon-cheeseburger-grill`, `pit-beans`, `kc-bbq-sauce` + `memphis-rub`
(Grundrezepte), `jambalaya` + `pulled-pork-quesadillas` (recipes-us.ts). Format und Feldbeschreibung: Kommentar in
`src/data/extra/bbq/index.ts`. Geräte: `docs/geraete/traeger.md`, `docs/geraete/grill-dutch.md`, `docs/geraete/regeln.md`.

## 1. Was wohin

- **Alles mit Smoker oder Grill → BBQ-Sparte** (`bbq()` aus `src/data/define.ts`). Nie im Wischstapel; man plant es frei
  für einen Tag ein (ersetzt meist das Abendessen), Zutaten kommen auf die Einkaufsliste, der Tag in den Kalender.
- **Alltagsgerichte (Herd/V-ZUG/Airfryer) → Küche „Amerikanisch“** in `recipes-us.ts` mit `r(id, titel, 'us', art, min, zutaten, schritte, bildsuche)`,
  Mengen für 2 Portionen. Ziele des Haushalts beachten (abnehmen: Abendessen ca. 550–750 kcal je Portion, viel Eiweiß).
- **Rubs & Saucen → Grundrezepte** (`backen('grundrezept', …, { cuisine: 'us', bbq: 'rub', yields: { …, cat } })`), Ergebnis
  „… selbstgemacht“, dazu im `substitutes` das Fertigprodukt als Ersatz in derselben Gruppe und `preferred`
  (Beispiel: `'bbq-sauce': ['BBQ-Sauce', 'BBQ-Sauce selbstgemacht']`). In Rezepten immer die **kaufbare Zutat** nennen
  („BBQ-Sauce“, „BBQ-Rub“) – Yami nimmt das Selbstgemachte automatisch zuerst.

## 2. `bbq()` – Mengen, Portionen, Reste

```ts
bbq('spareribs-321', 'St. Louis Spareribs 3-2-1', {
  group: 'smoker', time: 420, portions: 4, eat: 2,                // Ladung = 2 Racks ≈ 4 Portionen, 2 am Grilltag
  leftover: { name: 'Spareribs (vakuumiert)', amount: 600, unit: 'g', portion: 300, shelf: 90 },
  lighter: '…',                                                     // optional
}, '2000 g Schweinerippchen | 4 EL BBQ-Rub | …', ['Schritt …', …])
```

- Zutaten = **ganze Ladung** (ein ganzer Nacken, ein Brisket, zwei Racks). `portions` = Portionen der Ladung (Fleisch
  gegart ca. 180–200 g je Portion; Garverlust Pulled Pork/Brisket 35–45 %). `eat` = Portionen am Grilltag (Standard 2).
- **Große Stücke** (Pulled Pork, Ribs, Brisket, Burnt Ends, Pastrami): `leftover` in **g**, `portion: 250` (Beutelgröße),
  `shelf: 90` (vakuumiert eingefroren ≈ 3 Monate). Name `„… (vakuumiert)“`. Katalog (Tiefkühl), Produkt, Nährwerte entstehen
  automatisch (Anteil (portions − eat) ÷ portions der Ladung). Schmorgerichte/Chili: `unit: 'Portion'`.
- Damit Resteessen den Vorrat zuerst nehmen: kaufbares Gegenstück als neue Zutat (z. B. `Pulled Pork`, `Pulled Brisket`)
  plus `substitutes: { groups: { 'pulled-pork': ['Pulled Pork', 'Pulled Pork (vakuumiert)'] }, preferred: { 'Pulled Pork': ['Pulled Pork (vakuumiert)'] } }`.
  Resteessen (Wischstapel) gehören nach `recipes-us.ts` und nennen die kaufbare Zutat (`250 g Pulled Pork`).
- Burger/Steak/Beilagen ohne Rest: kein `leftover`.
- Der letzte Schritt großer Stücke beschreibt das Vakuumieren (`vakuum('Vakuumieren feucht', '6 Beutel à 250 g')`) und
  das Aufwärmen (CombiSteamer **Vacuisine** 60–75 °C, 20–45 Min., oder Regenerieren).

## 3. Authentische Technik (Low & Slow)

| Was | Garraum | Kern / fertig | Dauer (Richtwert) | Hinweis |
|---|---|---|---|---|
| Pulled Pork (Nacken 2,5–3,5 kg) | 107–121 °C (225–250 °F) | **93–96 °C**, Fühler gleitet wie in Butter | 1,5–2 Std./kg | Stall bei 65–75 °C, ab Bark Texas Crutch (Butcherpapier/Alu), 1–2 Std. ruhen |
| Brisket (ganz/Flat) | 107–121 °C | **93–95 °C, probe tender** (Gefühl entscheidet, nicht die Zahl) | 1–1,5 Std./kg, oft über Nacht | Oberseite Fett ca. 6 mm, Wrap bei 70–75 °C, 2–4 Std. warm halten (Kühlbox/Keep Warm) |
| Burnt Ends | 121–135 °C | Point-Würfel nach Brisket-Garen, mit Sauce/Zucker 1,5–2 Std. karamellisieren | | „Pork Belly Burnt Ends“ analog, Würfel 3 cm |
| Spareribs (St. Louis) | 107–121 °C | **3-2-1** (3 Std. Rauch, 2 Std. gewickelt mit Flüssigkeit, 1 Std. glasieren); Baby Back **2-2-1** | 5–6 Std. | fertig per **Bend-Test**: Rack mit Zange anheben, Oberfläche reißt ein |
| Chicken (ganz, Wings) | 135–177 °C | Brust ≥ 74 °C, Keule 80–85 °C | 1–2 Std. | Haut am Ende heiß (Grillen 204–232 °C) |
| Steak Reverse Sear | 110–120 °C, dann direkt heiß | 52–54 °C medium-rare (nach Anbraten) | 45–75 Min. | Abschluss Gasgrill direkt hoch 1 Min. je Seite |
| Pit Beans | unter dem Fleisch | Bratensaft tropft hinein | 2–3 Std. | unterer Rost |

- **Stall:** Die Kerntemperatur bleibt bei 65–75 °C stundenlang stehen (Verdunstungskühlung). Durchwarten oder
  **Texas Crutch** (dicht in Butcherpapier oder Alufolie wickeln); nach dem Wickeln bis zur Zieltemperatur durchgaren.
- **Ruhen:** große Stücke eingewickelt in einer leeren Kühlbox mit Handtüchern 1–2 Std. (Brisket gern länger).
- **Sicherheit:** Geflügel ≥ 74 °C, Hack/Burger ≥ 70 °C (USDA 160 °F = 71 °C; in DE „durchgegart“), Schwein am Stück ≥ 63 °C.
  Reste innerhalb von 2 Std. abkühlen, dann vakuumieren und einfrieren; aufgetaut nicht wieder einfrieren.
  Rohes Fleisch und Fertiges mit getrennten Zangen/Brettern; Dose beim Beer Can Chicken heiß – Grillhandschuhe.
- Holz/Pellets: Hickory (Schwein, Klassiker), Kirsche/Apfel (Geflügel, Ribs), Eiche/Mesquite sparsam (Rind/Brisket), Erle (Fisch).

## 4. Geräte-Schritte (werden von `npm run check-data` geprüft)

- Traeger: `traeger(mode, °F, { minutes, core, note })` – Modi `Vorheizen`, `Super Smoke` (74–107 °C), `Smoken` (74–260 °C),
  `Grillen` (150–260 °C), `Keep Warm`. **Text nennt °C und °F**: „bei 121 °C (250 °F)“. Kern 40–98 °C, Dauer bis 1440 Min.
- Gasgrill: `gasgrill(mode, °C, flamme, brenner, { minutes, core, note })` – `Vorheizen`/`Direkt`/`Indirekt`, Brenner „alle“
  oder z. B. „1+4“ (Text nennt dieselben Brenner: „Brenner 1 und 4 auf mittel“), indirekt nie mit allen Brennern.
- Dutch Oven: `dutch(mode, flamme, { minutes, note })` – `Anbraten`/`Schmoren`/`Köcheln`, **keine Temperatur** (Gas), Notiz
  „Deckel zu“/„ohne Deckel“/„Hockerkocher“. Backen mit Oberhitze im Dutch: Gasgrill `Indirekt` mit Deckel zu, dazu Combair `alt: true`.
- Vakuumierer: `vakuum(mode, notiz)` – nur Betriebsart. Sous-vide: CombiSteamer `Vacuisine` (`vzug('steamer', 'Vacuisine', 60, { minutes })`).
- Herd/Ofen: BORA (`bora(stufe, { minutes })`), CombiSteamer/Combair (`vzug(…)`) wie `docs/geraete/regeln.md`.
- Pflicht: Smoker-, Grill-, Dutch- und Burger-Rezepte haben `deviceSteps`; Beilagen ohne Hitze und Rubs dürfen ohne.
- Text und Einstellung passen zusammen (Temperatur °C, Kern mit „Kern…“, Minuten/Stunden, Brenner, „Super Smoke“, „indirekt“).
  Jede Zutat steht im Schritt, in dem sie gebraucht wird (Kochmodus).

## 5. Einheiten, Zutaten, Stil

- Einheiten wie überall: `g kg ml l Stk EL TL Prise Bund Zehe Dose Pck Scheibe Zweig Glas Becher Blatt`. °C immer, °F nur
  in Klammern beim Traeger. Gewichte in g (Fleisch am Stück: Einkaufsgewicht; ganze Hähnchen mit Knochen).
- Erst in `src/data/catalog.ts` und den anderen Gruppen-Dateien suchen (z. B. `BBQ-Sauce`, `BBQ-Rub`, `Paprikapulver geräuchert`,
  `Knoblauchpulver`, `Zwiebelpulver`, `Cayennepfeffer`, `Cajun-Gewürz`, `Cheddar gerieben`, `Apfelsaft`, `Hähnchen ganz`,
  `Pulled Pork`, `Brauner Zucker`, `Zuckerrübensirup` statt Melasse). Neu = `catalog` + `products` + `nutrition` (+ `grams`,
  `spices` für Gewürze). Kaufland-taugliche Produkte (kein Andouille → Cabanossi; Buttermilch, Maismehl/Polenta für Cornbread).
- Deutsch, Imperativ, ein bis zwei Sätze pro Schritt, konkret (Rost, Brenner, Deckel, Kerntemperatur). Amerikanische Begriffe
  einmal erklären („Bark“, „Stall“, „Texas Crutch“, „probe tender“). Keine Emojis, keine Werbesprache.
- Fotos: `imageQueries[id]` (englisch), neue IDs zusätzlich in `scripts/fotos-fehlen.txt` (eine ID je Zeile) und als Zeile
  `| id | Bildbeschreibung |` in `scripts/gemini-fehlen.md`.

## 6. Prüfen

```
npx tsc -b
npm run -s check-data
npx vite-node scripts/test-bbq.ts
npx vite-node scripts/test-devices.ts
npx vite-node scripts/test-cook.ts
```

## Quellen

- Stall, Texas Crutch, probe tender 93–99 °C: https://amazingribs.com/more-technique-and-science/more-cooking-science/understanding-and-beating-barbecue-stall/ ·
  https://blog.thermoworks.com/thermal-tips-smoked-brisket/ · https://thermoworks.com/blogs/thermoblog/smoked-brisket-a-how-to-primer ·
  Texas A&M „Camp Brisket“ (Stall-Demonstration): https://extension.animalscience.tamu.edu/bbq/?p=397
- Sichere Kerntemperaturen: USDA FSIS „Safe Minimum Internal Temperature Chart“ (https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart)
- 3-2-1-Ribs, Bend-Test, Pulled Pork 195–205 °F: Meathead Goldwyn, „Meathead – The Science of Great Barbecue and Grilling“ (2016);
  Aaron Franklin, „Franklin Barbecue – A Meat-Smoking Manifesto“ (2015)
- Gerät: `docs/geraete/traeger.md`, `docs/geraete/grill-dutch.md`
