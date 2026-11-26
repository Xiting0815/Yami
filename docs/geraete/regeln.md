# Umschreibe-Regeln: Rezepte für die Geräte im Haushalt

Für alle Schreib-Agenten. Datengrundlage: `vzug.md` (Betriebsarten, Bereiche und Zubehör **aus den offiziellen V-ZUG-Anleitungen**, Garzeiten nur Richtwerte) und `bora-airfryer.md` (Richtwerte). Änderungsprotokoll der Anleitungs-Korrektur: `korrekturen-anleitung.md`. Nichts erfinden, was nicht in diesen Dokumenten steht (keine Zwischenstufen bei BORA, kein Mikrowellenmodus im CombiSteamer, keine Feuchte in % beim V-ZUG, kein „Auftauen“, kein ungelochter Garbehälter).

## 1. Format

Ziel: `src/data/device-steps/<gruppe>.ts` (de, it, as, gr = Abendessen, bf = Frühstück), `Record<Rezept-ID, DeviceStep[]>`. Vorbild: `schweinebraten`, `kartoffelsuppe` in `de.ts`.

```ts
{ text: 'Satz im Stil des Rezepts.', settings: [{ device, mode, temp?, level?, minutes?, humidity?, core?, note? }] }
```

- `device`: `steamer` (CombiSteamer), `combair`, `bora`, `airfryer`, `kneter` (Famag, Spiralkneter – `famag.md`), `pizzaofen` (Witt Rotante – `witt.md`). `mode` immer deutsch **wie in der Anleitung** (Schreibweise „Heißluft“ mit ß): CombiSteamer: Dämpfen, Heißluft, Heißluft feucht, Heißluft mit Beschwaden, Regenerieren, Vacuisine; Combair: Heißluft, Ober-/Unterhitze, Heißluft feucht, PizzaPlus, Grill, Grill-Umluft (vollständige Liste unten bei „Erlaubte Betriebsarten“); BORA: `Kochzone` + `level` (`'1'`–`'9'`, `'Power'`, `'Schmelzen'`, `'Warmhalten'`, `'Simmern'`); Airfryer: `Heissluft` + `temp`.
- `minutes` nur setzen, wenn die Dauer am Gerät eingestellt wird oder man sie abwartet. `core` (40–95 °C) nur mit Kerntemperaturfühler. `note` kurz („vorheizen“, „Ebene 2“, „aufkochen“).
- Mehrere Einstellungen pro Schritt sind erlaubt (z. B. Power zum Aufkochen, dann Stufe 6).
- Wertebereiche (werden von `npm run check-data` über `validateSetting` geprüft, Quelle Anleitungen): CombiSteamer Dämpfen 30–100 °C, Heißluft/Heißluft feucht/eco 30–230, Heißluft mit Beschwaden 80–230, Regenerieren 80–200, Vacuisine 30–95, Dörren 40–85. Combair Heißluft/Ober-/Unterhitze/PizzaPlus/Grill-Umluft 30–280, die „feucht“- und eco-Varianten 30–250. **Ohne Temperaturwert:** Warmhalten (5–90 Min.), Tellerwärmen, Zartgaren, Grill und Unterhitze (4 Stufen, als `note: 'Stufe 3 (stark)'`). Airfryer 80–200 °C; Minuten 1–600; Kern 40–95 °C, **nur bei Garraumtemperatur ≤ 230 °C**; bei Vacuisine ist Kern nicht einstellbar; keine `humidity` bei V-ZUG.

## 2. Allgemeine Regeln

1. **Mengen, Zutaten und Portionenzahl unverändert** lassen. Nur `steps` werden umgeschrieben, die Zutatenliste bleibt tabu.
2. **Schrittzahl ähnlich** halten: sinnvoll zusammenfassen oder teilen (Ofenphasen = eigene Schritte). Jede Zutat soll weiterhin im Schritt genannt sein, in dem sie gebraucht wird (der Kochmodus ordnet Zutaten über die Schritttexte zu).
3. **Stil wie die bestehenden Rezepte:** ein Satz pro Handlung, Imperativ, deutsch, konkret („in den vorgeheizten Combair schieben“). Keine Marketingsprache, keine Emojis.
4. **Vorheizen erwähnen**, wo nötig (Combair, CombiSteamer bei Heißluft/Heißluft feucht/Heißluft mit Beschwaden, Airfryer bei Fleisch/Paniertem, Pfanne vor dem Öl). **Dämpfen und Regenerieren haben kein Vorheizen** (Anleitung S. 22): der Text sagt stattdessen „Den Wasserbehälter des CombiSteamers füllen“, kein `vorheizen` in der `note`. Eco-Anwendungen nie vorheizen. Combair Grill: 3 Minuten vorheizen.
5. Temperaturen und Zeiten aus den Tabellen unten bzw. `vzug.md` 6.2 / `bora-airfryer.md` ableiten. Ofen-Rezept → Heißluft meist 20 °C niedriger. Bei Unsicherheit eher kurze Zeit + Prüfhinweis im Text („Garprobe machen“).
6. Gerät nur nehmen, wenn es echten Vorteil bringt. Kein Gerät nötig (Schneiden, Mischen, Pürieren, Marinieren) → Schritt ohne `settings`.
7. Frühstück (bf): Vorbereitung am Prep-Tag darf CombiSteamer/Combair nutzen (Baked Oats, Eiermuffins). **Aufwärmen auf der Arbeit bleibt Mikrowelle** (dort gibt es keine V-ZUG-Geräte) und steht im Feld `morning`, nicht in `deviceSteps`.

## 3. Welches Gerät wann

- Kartoffeln, Klöße, Gemüse, Reis, Eier, Fisch garen: **CombiSteamer, Dämpfen**.
- Reste und Meal-Prep aufwärmen, ohne auszutrocknen: **CombiSteamer, Regenerieren**.
- Braten mit Kruste (Schwein, Ente, Gans): CombiSteamer Heißluft mit Beschwaden (saftig), letzte Phase trocken im selben Gerät (Heißluft 210–230 °C, Fühler nur bis 230 °C).
- Niedertemperatur (Rind, Kalb): CombiSteamer **Zartgaren** (Fühler, Zielwerte aus `vzug.md` 4.3) oder bei vakuumierten Stücken **Vacuisine** (30–95 °C); danach Combair Grill kurz. Den Namen „Lebensmittel vorbereiten“ gibt es nicht.
- Pizza (auch Pinsa, Pizza Bianca, Calzone): **Witt Rotante**, darunter als Ausweichweg „oder Combair · PizzaPlus“ (siehe Abschnitt 8). Pizza in Teglia (Blech) passt nicht auf den runden Stein → Combair.
- Flammkuchen, Brötchen, Gratin, Lasagne, Aufläufe: **Combair**.
- Hefe- und Brotteige kneten: **Famag** (siehe Abschnitt 8).
- Schnitzel, Panieres: BORA-Pfanne oder Airfryer. Frittiertes, Pommes, Ofengemüse knusprig: **Airfryer**. Alles, was Wasser verlieren soll, nicht dämpfen.
- Nudeln: **bleiben auf dem BORA** (Powerstufe zum Aufkochen, dann Stufe 7). Anbraten, Soßen, Suppen, Wok: BORA.

**Beide Öfen parallel:** Hauptgericht (Kruste, trocken) im Combair, Beilage (Dampf) im CombiSteamer; je Gerät passt eine Menge für 2 Personen locker. Der Text sagt klar, welcher Schritt in welchem Gerät läuft und wann beides zusammenkommt. Dasselbe Prinzip für Ofenphase + Beilage auf dem BORA.

## 4. Phrase → BORA-Stufe

| Rezepttext | `level` |
|---|---|
| Wasser zum Kochen bringen | `Power` (Deckel drauf), dann 5–6 |
| Nudeln/Reis/Kartoffeln sprudelnd kochen | `7` (Nudeln), `6` sonst |
| Köcheln lassen | `3` oder `4` |
| Sanft ziehen / simmern lassen | `Simmern` (oder `2`–`3`) |
| Butter/Schokolade schmelzen | `Schmelzen` |
| Warmhalten | `Warmhalten` |
| Zwiebeln glasig / bei kleiner Hitze braten | `3`–`4` |
| Bei mittlerer Hitze braten (Schnitzel, Bratkartoffeln) | `5`–`6` |
| Kräftig / scharf anbraten (Pfanne vorher 1–2 Min. vorheizen) | `8`–`9` |
| Wok / Pfannenrühren | `9` (oder `Power`), kleine Portionen |
| Frittieren im Topf | `7`–`8` (nur wenn nicht Airfryer) |
| Ankochen, dann reduzieren | `9`, dann `3`–`5` |
| Schmoren nach dem Anbraten | `2`–`3`, Deckel drauf |

Nur ganze Stufen. Induktion reagiert sofort: eher eine Stufe niedriger starten.

## 5. Richtwerte je Komponente

| Komponente | Gerät · Modus | °C | Min. | Kern / Hinweis |
|---|---|---|---|---|
| Salz-/Pellkartoffeln (halbiert) | CombiSteamer · Dämpfen | 100 | 20–30 | ganze mittelgroße 30–40 |
| Klöße/Knödel (Beutel/Folie) | CombiSteamer · Dämpfen | 95–100 | 20–30 | Semmelknödel im Wasser: BORA `Simmern` |
| Reis (1:1,5 Wasser, flache Schale) | CombiSteamer · Dämpfen | 100 | 20–25 | Schale auf den gelochten Garbehälter, ohne Vorheizen; es gibt keinen ungelochten Garbehälter |
| Nudeln | BORA | | | `Power`, dann `7` |
| Gemüse (Brokkoli, Möhre, Bohnen) | CombiSteamer · Dämpfen | 100 | 6–20 | gelochter Garbehälter, bissfest |
| Schweinebraten (1–1,5 kg) | CombiSteamer · Heißluft mit Beschwaden, dann Heißluft (im selben Gerät) | 165–170 / 220 | 90–120 + 15–20 | Kern 75–80 |
| Rinderbraten (Niedertemperatur) | CombiSteamer · Zartgaren (Fühler) oder Heißluft feucht 130–150 | Kern 57 | 90–270 | Zielwerte Tabelle `vzug.md` 4.3; Schmorbraten Kern 85 (Heißluft feucht) |
| Kalbsbraten | CombiSteamer · Heißluft feucht | 140–160 | 90–120 | Kern 68–72 |
| Ente ganz | CombiSteamer · Heißluft mit Beschwaden, dann Heißluft (im selben Gerät) | 150 / 200–220 | 90 + 20 | Kern Brust 78, Keule 85–90 |
| Gänsekeule | Combair · Heißluft feucht, dann Heißluft (im selben Gerät) | 130 / 210 | 90–120 + 15 | Kern 90 |
| Hähnchenbrust | CombiSteamer · Dämpfen | 85–100 | 12–20 | Kern 68–72 |
| Hähnchen ganz/Keulen | Combair · Heißluft (feucht = saftiger) | 190 | 45–60 / 35–45 | Kern 80–85; Keulen alternativ Airfryer 180–200 °C, 18–25 Min. |
| Fisch (Filet / ganz) | CombiSteamer · Dämpfen | 80–90 / 90–100 | 8–14 / 15–20 | Kern 55–62 |
| Aufläufe, Gratin, Lasagne | Combair · Heißluft oder Ober-/Unterhitze | 180–200 | 30–45 | saftiger: CombiSteamer Heißluft mit Beschwaden 170 |
| Pizza, Flammkuchen | Combair · PizzaPlus | 240–280 | 8–15 | Ebene 2 (Anleitung), dunkles Blech ohne Backpapier, vorheizen |
| Brötchen aufbacken | CombiSteamer · Heißluft mit Beschwaden (oder Combair) | 180–200 | 8–12 | Airfryer 160–180 °C, 3–6 Min. |
| Schnitzel/Paniertes | BORA-Pfanne `5`–`6` oder Airfryer | – / 180 | – / 10–14 | Airfryer: andrücken, einsprühen, wenden |
| Frittiertes, Pommes, Spalten | Airfryer | 180–200 | 15–25 | Korb halb voll, 1–2× schütteln |
| Frühlingsrollen, Jiaozi TK | Airfryer | 180–190 | 8–12 | einölen |
| Eier (wachsweich / hart) | CombiSteamer · Dämpfen | 100 | 6–7 / 10–12 | |
| Baked Oats, Eiermuffins (Prep) | Combair · Heißluft (oder CombiSteamer · Heißluft mit Beschwaden 160–170) | 170–180 | 15–25 | Förmchen auf Rost |
| Reste regenerieren (Reis, Nudeln, Klöße, Gemüse, Braten) | CombiSteamer · Regenerieren | 110–130 | 8–20 | Gefäß mit Deckel, Soße/Wasser zugeben, ohne Vorheizen; ab 150 °C Kuchenblech, darunter Edelstahlblech |
| Panierte Reste knusprig | Airfryer | 150–160 | 3–6 | oder nach Regenerieren kurz Heißluft |

## 6. Abzug (BORA)

Automatik „A“ an lassen, der Lüfter folgt dem Kochfeld. Beim scharfen Anbraten, Wok und Frittieren im Text eine Lüfterstufe höher bzw. Lüfter-Powerstufe empfehlen (fällt nach 5 Min. zurück); als Satz im Schritt, nicht als eigene Einstellung. Nachlauf nicht abbrechen.

## 7. Prüfen

`npx tsc -b`, `npm run -s check-data` (Bereiche, bekannte IDs, Abdeckung), `npx vite-node scripts/test-devices.ts` und `scripts/test-cook.ts`.

## Feste Regeln (vom Koordinator ergänzt)

- **Ein Gericht bleibt in einem Gerät.** Nicht zwischen CombiSteamer und Combair umziehen (z. B. für die Kruste): der CombiSteamer kann selbst trocken bis 230 °C.
- **Einschubebenen:** CombiSteamer Heißluft-Anwendungen Ebene 2 oder 1+3, Dämpfen/Regenerieren/Vacuisine Ebene 1–4; Combair Heißluft 2 oder 1+3, Ober-/Unterhitze und PizzaPlus Ebene 2 (hohes Gargut 1), Grill Ebene 3, Grill-Umluft Ebene 2, Unterhitze Ebene 1.
- **Zubehör:** kein Kuchenblech beim Dämpfen/Vacuisine; kein Backpapier unter Pizza bei PizzaPlus; keine Alufolie auf den Combair-Boden; Warmhalten und Tellerwärmen ohne Temperatur, aber mit Dauer (Warmhalten 5–90 Min.). Der zweite Ofen ist für **parallele** Komponenten da (Beilage, Gemüse, Knödel, Pizza 2. Blech).
- **Erlaubte Betriebsarten** (exakt so schreiben, wird geprüft; Quelle Anleitungen): CombiSteamer: Dämpfen, Heißluft, Heißluft feucht, Heißluft mit Beschwaden, Heißluft eco, Regenerieren, RegenerierAutomatik feucht, RegenerierAutomatik knusprig, Dörren, Vacuisine, Profi-Backen klassisch/bemehlt/bestrichen/Aufgehen lassen, Zartgaren, Warmhalten, Tellerwärmen · Combair: Ober-/Unterhitze, Ober-/Unterhitze feucht, Ober-/Unterhitze eco, Unterhitze, PizzaPlus, Grill, Grill-Umluft, Heißluft, Heißluft feucht, Heißluft eco, Dörren, Zartgaren, Warmhalten, Tellerwärmen (kein „Auftauen“ bei beiden Geräten; der CombiSteamer hat **kein** Ober-/Unterhitze, Grill oder PizzaPlus) · BORA: mode 'Kochzone' + level ('1'–'9', 'Power', 'Schmelzen', 'Warmhalten', 'Simmern') · Airfryer: 'Heissluft' + temp.
- BORA X Pure: Pfannen/Töpfe frei auf der Fläche platzieren; für große Bräter/Pfannen die Brückenfunktion erwähnen (note: 'Brücke'). Abzug: Automatik „A“ – nur bei sehr starkem Anbraten note: 'Abzug Power'.
- Nicht jedes Gericht braucht einen Ofen: Pfannen-, Wok- und Nudelgerichte bleiben auf dem BORA. Den CombiSteamer nur nehmen, wo er klar besser ist (Dämpfen, Braten saftig, Aufläufe, Regenerieren, Klöße/Kartoffeln/Reis/Gemüse ohne Topf).
- Meal-Prep-Frühstück: Zubereitung zu Hause mit den Geräten; das Aufwärmen auf der Arbeit bleibt Mikrowelle (dort steht kein V-ZUG).

## 8. Famag (Spiralkneter) und Witt Rotante (Pizzaofen)

Gerätedaten und Unsicherheiten: `famag.md`, `witt.md`. Bausteine: `src/data/device-helpers.ts` (`famag()`, `mitFamag()`, `wittVorheizen()`, `wittBacken()`).

**Famag – wann:** Pizza, Pinsa, Focaccia, Brot, Brötchen, Grissini, Hefeteige auch für Kuchen (Butterkuchen, Datschi, Bienenstich, Hefezopf), Brioche, Pittule, Dampfnudeln, Germknödel.
**Famag – nicht:** Mürbeteig, Plätzchen, Rührteig, Cookies, Biskuit, Nudelteig (zu fest, nicht belegt), Spätzle (Rührteig), Kartoffelteig (Gnocchi, Klöße).

- Format: `{ device: 'kneter', mode: 'Kneten' | 'Mischen' | 'Kneten langsam' | 'Kneten schnell', minutes: 1–30, level?: '1'–'10', note? }`. Chip: „Famag · Kneten 8 Min.“. Eine Stufe nur, wenn das Modell sie hat (die Rezepte nennen bisher nur die Dauer).
- Der Text nennt den Famag und dieselbe Dauer wie die Einstellung („… im Famag 8 Minuten zu einem glatten Teig kneten“). Zwei Phasen (Mischen, dann Kneten) = zwei Einstellungen.
- Richtwerte: Pizza 2 Min. mischen + 10 Min. kneten (Salz nach dem Mischen), sehr weiche Teige (Teglia, Pinsa, Ciabatta) Wasser schluckweise in den letzten Minuten, Weizenbrot/Brötchen 8–10, Roggen 6–8 langsam, Dinkel 6 langsam, Kuchen-Hefeteig 7, Hefezopf/Dampfnudeln/Germknödel 8–10, Brioche 5 + 7 (Butter nach und nach).
- **Mindestmenge 0,3 kg Teig** (Händlerangabe, unsicher). Liegt ein Teig darunter: im Text „für kleine Mengen von Hand kneten“ oder doppelte Menge kneten und die Hälfte als Teigkugel einfrieren. Lange kalte Gare: kaltes Wasser.

**Witt Rotante – nur Pizza.** Vorheizen 25 Min. (`mode: 'Vorheizen'`, `temp` = Ziel-Steintemperatur, `minutes: 25`), backen auf dem drehenden Stein (`mode: 'Pizzastein'`, `temp` 250–500, `seconds` 30–600). Neapolitana 430–450 °C · 60–90 Sek., Pizza Bianca ca. 420 °C, Pinsa und Calzone ca. 380 °C mit kleiner Flamme · 2–3 Min.
- **Ausweichweg:** Direkt nach jeder Witt-Einstellung folgt im selben Schritt die Combair-Einstellung mit `alt: true` (PizzaPlus 280 °C, Calzone 250 °C, Minuten je Pizza). Sie wird gedämpft als „oder Combair · …“ angezeigt. Das ist die einzige erlaubte Ausnahme von „ein Gericht bleibt in einem Gerät“; `check-data` prüft, dass vor einer `alt`-Einstellung eine Haupteinstellung steht.
- Der Text nennt beides kurz: „Den Witt Rotante 25 Minuten vorheizen, bis der Stein etwa 450 °C hat … Bei Regen oder im Winter stattdessen den Combair … auf 280 °C PizzaPlus vorheizen.“

## 9. Text und Einstellung müssen zusammenpassen

`npx vite-node scripts/check-device-text.ts` (läuft auch in `npm run check-data` als Fehler) meldet Schritte, deren Text etwas anderes sagt als die Einstellung: Temperaturen (Text „180 °C“, Einstellung 160 °C), Betriebsarten (Text „Ober-/Unterhitze“, Einstellung Heißluft), allgemeines „Ofen“/„Backofen“ statt Gerätename, Gerätenamen ohne passende Einstellung, Minuten bzw. Sekunden, die nicht zur eingestellten Dauer passen, und „in zwei Runden“ backen, obwohl zwei Bleche gleichzeitig (Ebene 1+3) eingestellt sind. Bei den Back-Gruppen schreibt `fitText()` den klassischen Satz „Den Ofen auf 180 °C Ober-/Unterhitze vorheizen“ automatisch auf die Einstellung um (z. B. „Den Combair auf 160 °C Heißluft vorheizen (2 Bleche: Ebene 1 + 3)“).

## 10. BBQ-Geräte (Traeger, Gasgrill, Dutch Oven, Vakuumierer)

Zusätzliche Geräte für die BBQ-Sparte und Resteverwertung: `smoker` (Traeger Timberline 850 – `traeger.md`), `gasgrill`
(4-Brenner-Gasgrill), `dutch` (Dutch Oven auf Gas) und `vakuum` (Vakuumierer) – Daten in `grill-dutch.md`, Schreibregeln
und Garwerte in `docs/bbq-regeln.md`, Bausteine `traeger()`, `gasgrill()`, `dutch()`, `vakuum()`, `bora()`, `vzug()` in
`src/data/device-helpers.ts`. Kern bis 98 °C nur bei diesen Geräten (Pulled Pork/Brisket). Sous-vide bleibt der
CombiSteamer mit `Vacuisine` (30–95 °C).

## 11. Spanien: Paellapfanne und Plancha

Für die Küche „Spanisch“ und die Tapas: `paella` (Paellapfanne **32 cm** auf dem BORA mit Brücke bzw. **46 cm** auf dem
Gasgrill, Deckel offen) und `plancha` (Gusseisen-Platte/-Pfanne auf BORA oder Gasgrill) – Daten in `paella-plancha.md`,
Bausteine `paella('32' | '46', mode, { level, burners, minutes })` und `plancha('bora' | 'gasgrill', mode, { level, temp, minutes })`
in `src/data/device-helpers.ts`, Schreibregeln in `docs/spanien-regeln.md`. Paella: keine Temperatur, nach der Reiszugabe
nicht rühren (check-data prüft das), große Pfanne als `alt: true`.
