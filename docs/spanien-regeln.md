# Spanien: Küche „Spanisch“, Tapas-Abend, Salate & Beilagen – Regeln für Schreib-Agenten

Jede Gruppe bearbeitet **nur ihre eigene Datei**. Keine zentralen Dateien anfassen (catalog.ts, products.ts, nutrition.ts,
substitutes.ts, Index-Dateien, Tests, `src/data/extra/zutaten-es.ts`).

| Gruppe | Datei | Schwerpunkt | Bau-Funktion |
|---|---|---|---|
| Reis & Fisch | `src/data/recipes-es.ts` + `src/data/device-steps/es.ts` | Paella valenciana, Paella de marisco, Arroz negro, Arroz a banda, Fideuà, Arroz al horno, Merluza en salsa verde, Bacalao a la vizcaína, Zarzuela | `r(id, titel, 'es', art, min, zutaten, schritte, bild)` |
| Eintopf & Fleisch | `src/data/recipes-es2.ts` + `src/data/device-steps/es2.ts` | Fabada, Cocido madrileño, Lentejas, Pollo al ajillo, Pollo en pepitoria, Albóndigas, Carrillada, Pisto manchego | `r(…)` |
| Tapas Fisch | `src/data/extra/tapas/tapas-fisch.ts` | Gambas al ajillo/a la plancha, Pulpo a la gallega, Boquerones en vinagre, Calamares, Mejillones | `tapa(id, titel, { group: 'fisch', time, serve, ahead? }, …)` |
| Tapas Fleisch | `src/data/extra/tapas/tapas-fleisch.ts` | Pinchos morunos, Albóndigas, Chorizo a la sidra, Croquetas de jamón, Jamón | `tapa(…, { group: 'fleisch' })` |
| Tapas Gemüse/Ei/Brot | `src/data/extra/tapas/tapas-gemuese.ts` | Pimientos de Padrón, Champiñones al ajillo, Tortilla, Patatas bravas, Pan con tomate, Aceitunas | `tapa(…, { group: 'gemuese' \| 'ei' \| 'brot' })` |
| Tapas-Saucen | `src/data/extra/tapas/saucen.ts` | Alioli, Salsa brava, Romesco, Mojo rojo, Mojo verde | `backen('grundrezept', …, { cuisine: 'es', tapas: 'sauce', yields })` |
| Nudelsalate | `src/data/extra/salate/nudelsalate.ts` | deutsch, italienisch, spanisch, griechisch | `salat(id, titel, { group: 'nudel', cuisine, … })` |
| Salate | `src/data/extra/salate/salate.ts` | Kartoffel-, Reis-, Bohnen-, Gemüsesalate, Ensaladilla rusa, Pipirrana, Empedrado | `salat(…, { group: 'kartoffel' \| 'reis' \| 'bohnen' \| 'gemuese' })` |
| Spanische Desserts | `src/data/extra/desserts-es.ts` | Crema catalana, Churros, Tarta de Santiago, Flan, Torrijas, Arroz con leche | `backen('dessert' \| 'kuchen' \| 'gebaeck', …, { cuisine: 'es' })` |

Vorbilder (je Datei ein vollständiges Rezept): `paella-valenciana`, `fabada-asturiana`, `gambas-al-ajillo`, `pinchos-morunos`,
`tortilla-de-patatas`, `alioli`, `nudelsalat-klassisch`, `ensaladilla-rusa`, `crema-catalana`. Formate: Kopfkommentare in
`src/data/extra/tapas/index.ts`, `src/data/extra/salate/index.ts`, `recipes-es.ts`, `recipes-es2.ts`. Geräte:
`docs/geraete/paella-plancha.md`, `docs/geraete/regeln.md`. Neue Fotos: je Gruppe `scripts/fotos-neu-<datei>.md`
(„| id | Bildbeschreibung |“, die Vorlage-Zeile steht schon drin). Prüfen: `npm run check-data`, `npx vite-node scripts/test-spanien.ts`.

## 1. Was wohin

- **Hauptgerichte → Küche „Spanisch“ im Wischstapel** (`r()`), Mengen für 2 Portionen, authentisch (keine „Leichter“-Sätze), fast nie vegetarisch (Haushalt: ca. 15 %).
- **Tapas → eigener Bereich „🫒 Tapas“** (`tapa()`), nie im Wischstapel. Man wählt 4–6 aus und plant sie zusammen als
  „Tapas-Abend“ (ersetzt das Abendessen). Eine Tapa = **ein Teller für 2 Personen als eine von ca. 5 Tapas** (`TAPAS_STD`);
  Ziel **ca. 120–200 kcal je Person** (check-data: Fehler unter 50 oder über 400, Warnung über 260) – Yami skaliert je nach
  Anzahl (4 → ×1,25, 6 → ×0,83). Brot zum Tunken nicht in jede Tapa schreiben (eigene Tapa „Pan con tomate“).
  - `serve`: `kalt` (wartet im Kühlschrank: Boquerones, Ensaladilla, Aceitunas), `lauwarm` (Tortilla, Pulpo a la gallega),
    `heiss` (Gambas, Pimientos de Padrón, Calamares, Chorizo – kommen zuletzt). Pflicht.
  - `ahead`: ein kurzer Satz, was vorher geht (Marinade über Nacht, Pulpo am Vortag kochen, Garnelen auftauen, Alioli am Vortag).
- **Tapas-Grundsaucen → Grundrezepte** im Tapas-Bereich: Ergebnis „<Grundname> selbstgemacht“ in der Einheit des
  kaufbaren Grundnamens, dazu `substitutes.groups` + `preferred`. Kaufbare Grundnamen (schon angelegt, in den Tapas immer
  diese verwenden): **Alioli** (ml), **Salsa brava** (ml), **Romesco** (g), **Mojo rojo** (ml), **Mojo verde** (ml).
  Yami nimmt Selbstgemachtes automatisch zuerst und schlägt es im Ablaufplan „Vorher“ vor.
- **Salate & Beilagen → eigener Bereich „🥗 Salate“** für alle Küchen (`salat()`), Zusatz zum Abendessen (ersetzt nichts).
  Mengen für `portions` Beilagen-Portionen (meist 4–8), Ergebnis „… (selbstgemacht)“ in Portionen, `shelf` = Tage im
  Kühlschrank (Mayo/Ei/Fisch/Wurst 2, Essig-Öl 3, höchstens 5). Die BBQ-Beilagen
  (`src/data/extra/bbq/beilagen.ts`) erscheinen dort automatisch – nichts doppelt anlegen (Coleslaw, Southern Potato Salad …).
- **Desserts → Backen-Bereich** (`desserts-es.ts`), Regeln wie `docs/backen-regeln.md` (ohne Leichter-Tipp).

## 2. Authentizität

- **Titel spanisch, mit deutscher Erklärung in Klammern:** „Gambas al ajillo (Knoblauchgarnelen in Olivenöl)“,
  „Fabada asturiana (asturischer Bohneneintopf mit Chorizo und Morcilla)“. Spanische Akzente/ñ korrekt (Ñoras, jamón, Padrón).
  Im Kalender und auf den Kacheln zeigt Yami den spanischen Teil allein.
- **Paella valenciana** (Wikipaella, D.O. Arroz de Valencia): Hähnchen, Kaninchen, Ferraura (breite grüne Bohnen), Garrofó
  (große Limabohnen), Tomate, Olivenöl, Wasser, Salz, Safran (oder Färbemittel), Reis; optional Rosmarin, Schnecken,
  Paprikapulver, Artischocken in der Saison. **Kein** Chorizo, keine Meeresfrüchte, keine Zwiebeln, kein Knoblauch,
  keine Erbsen, kein Hühnerbrühwürfel. Meeresfrüchte → „Paella de marisco“, gemischt → „Paella mixta“ (in Valencia verpönt,
  als solche benennen).
- **Reis:** Bomba oder Calasparra (D.O.), Senia/Bahía (D.O. Arroz de Valencia) = Zutat **„Paellareis“**; Ersatz in Deutschland:
  Risottoreis (gleiche Austausch-Gruppe). Kein Langkornreis.
- **Reis nach der Zugabe nicht mehr rühren** (check-data meldet „rühren“ bei `Köcheln`/`Socarrat`). Einmal verteilen,
  erst stark, dann schwach köcheln, **Socarrat** (geröstete Kruste) am Ende 1–2 Min. hohe Hitze bis es leise knistert,
  dann 5 Min. ruhen (Tuch). Flüssigkeit vorher abschmecken (leicht übersalzen).
- **Sofrito:** Fleisch/Meeresfrüchte zuerst langsam goldbraun anbraten, dann Gemüse, geriebene Tomate einkochen,
  Pimentón nur Sekunden (verbrennt sofort, wird bitter), sofort ablöschen.
- **Pimentón de la Vera** = Zutat „Paprikapulver geräuchert“ (dulce); picante = zusätzlich „Paprikapulver rosenscharf“
  bzw. „Cayennepfeffer“. Für Paella valenciana und Fabada nimmt man edelsüßes, nicht geräuchertes Paprikapulver.
- **Olivenöl** extra vergine (Zutat „Olivenöl“); für Alioli mit Stabmixer halb Sonnenblumenöl (sonst bitter).
- **Ersatz-Zutaten** (in den Schritten nennen): Morcilla → „Blutwurst“, Garrofó → „Weiße Bohnen“ (Dose), Ferraura →
  „Grüne Bohnen“, Guindilla → „Chili getrocknet“, Jamón → „Serrano-Schinken“, Sidra → „Cidre“ (asturischer Apfelwein),
  Merluza → Kabeljau/Seelachs.
- **Gemeinsame Spanien-Zutaten** liegen in `src/data/extra/zutaten-es.ts` (Chorizo, Serrano-Schinken, Manchego,
  Oliven grün, Piquillo-Paprika, Pimientos de Padrón, Pulpo gekocht, Riesengarnelen mit Kopf TK, Tintenfischringe TK,
  Tintenfischtinte, Kaninchenkeule, Paellareis, Fabes getrocknet, Sherry fino, Sherryessig, Cidre, Ñoras getrocknet) –
  **nicht neu anlegen**. Eigene neue Zutaten nur in der eigenen Datei, vorher suchen: `grep -rn "'Name'" src/data`.
  Meldet check-data „gibt es schon … (angelegt in: …)“, die Zutat in der eigenen Datei löschen.

## 3. Mengen und Geräte

- 2 Personen: Paellapfanne **32 cm** auf dem BORA (Brücke, beide Zonen); Gäste (6–8): **46 cm** auf dem Gasgrill, Deckel
  offen, alle Brenner – als `alt: true` neben der 32-cm-Einstellung, Mengen ×3 in der Notiz.
- Plancha (Gusseisen) für Gambas a la plancha, Padrón, Pulpo, Pinchos: `plancha('bora' | 'gasgrill', …)`.
- Eintöpfe (Fabada, Cocido, Lentejas): BORA Stufe 2 mit Deckel, CombiSteamer oder Dutch Oven; Hülsenfrüchte über Nacht
  einweichen (im ersten Schritt, nicht in `minuten`), Salz erst am Ende (Chorizo/Speck salzen mit).
- Frittiertes (Croquetas, Calamares, Churros): Airfryer als Hauptweg, wenn es gut gelingt; klassisch frittieren nur mit Hinweis.

## 4. Bezugsquellen in Deutschland

- Supermarkt (Kaufland, Rewe, Edeka): Chorizo (Sarta/zum Braten), Serrano, Manchego, grüne Oliven, Pimientos de Padrón
  (Sommer–Herbst, Gemüseregal), Pulpo gekocht (Kühlregal/Theke), Risottoreis, Safran, Sherry fino, Cidre.
- Lidl „Viva España“-Wochen, Aldi „Ibérico“-Aktionen: Bomba-Reis, Chorizo, Alioli, Piquillos.
- Spanische Feinkost/online (z. B. spanische Lebensmittelversände, „Bomba Reis“, „Fabes de la Granja“, „Morcilla asturiana“,
  „Ñoras“, „Pimentón de la Vera D.O.P.“): Paella-Reis, Fabes, Ñoras, Tintenfischtinte, Paellapfannen.
- Asia-/Fischhändler: Tintenfisch, Sepia, Tinte.

## 5. Lernen (Yami passt sich an)

- Tapas: eingeplant (+1), gemacht (+0,8), Bewertung je Tapa nach „Fertig“; Muster „Tapas: Fisch & Meeresfrüchte“,
  „Tapas mit Schwein“. Kombinationen (am selben Abend gemacht und gut bewertet) und Vorrat steuern die „Tapas-Abend-Ideen“
  (je eine aus Fisch, Fleisch, Gemüse, Ei/Kartoffel, Brot/Dip; zuletzt Gemachtes ruht 14 Tage, „nicht so“ nie).
- Salate: eingeplant, gemacht, gegessen, bewertet; Muster „Nudelsalate“ usw.; sortiert die Liste.
- Spanische Hauptgerichte lernen wie alle Abendessen (Küche „Spanisch“, Hauptzutat, Zeit).

## Quellen

- Wikipedia (es): „Paella“, „Paella valenciana“, „Tapa (gastronomía)“, „Fabada asturiana“, „Tortilla de patatas“,
  „Ensaladilla rusa“, „Crema catalana“, „Alioli“.
- Wikipaella – „Paella valenciana: ingredientes“ (wikipaella.org), Consejo Regulador D.O. Arroz de Valencia
  (arrozdevalencia.org), D.O. Calasparra.
- Real Academia de Gastronomía / Cofradía de la Fabada (Fabada mit Fabes de la Granja, Compango, „asustar las fabes“).
