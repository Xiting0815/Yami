# Umschreibe-Regeln: Rezepte für die Geräte im Haushalt

Für alle Schreib-Agenten. Datengrundlage: `vzug.md` und `bora-airfryer.md` (alle Werte dort sind **Richtwerte**, keine Herstellerangaben). Nichts erfinden, was nicht in diesen Dokumenten steht (keine Zwischenstufen bei BORA, kein Mikrowellenmodus im CombiSteamer, keine Feuchte in % beim V-ZUG).

## 1. Format

Ziel: `src/data/device-steps/<gruppe>.ts` (de, it, as, gr = Abendessen, bf = Frühstück), `Record<Rezept-ID, DeviceStep[]>`. Vorbild: `schweinebraten`, `kartoffelsuppe` in `de.ts`.

```ts
{ text: 'Satz im Stil des Rezepts.', settings: [{ device, mode, temp?, level?, minutes?, humidity?, core?, note? }] }
```

- `device`: `steamer` (CombiSteamer), `combair`, `bora`, `airfryer`. `mode` immer deutsch wie im Gerät: CombiSteamer: Dämpfen, Heissluft, Heissluft feucht, Heissluft mit Beschwaden, Regenerieren, Lebensmittel vorbereiten; Combair: Heissluft, Ober-/Unterhitze, Heissluft feucht, PizzaPlus, Zartgaren, Grill, Grill mit Umluft; BORA: `Kochzone` + `level` (`'1'`–`'9'`, `'Power'`, `'Schmelzen'`, `'Warmhalten'`, `'Simmern'`); Airfryer: `Heissluft` + `temp`.
- `minutes` nur setzen, wenn die Dauer am Gerät eingestellt wird oder man sie abwartet. `core` (40–95 °C) nur mit Kerntemperaturfühler. `note` kurz („vorheizen“, „Ebene 2“, „aufkochen“).
- Mehrere Einstellungen pro Schritt sind erlaubt (z. B. Power zum Aufkochen, dann Stufe 6).
- Wertebereiche (werden von `npm run check-data` geprüft): CombiSteamer 30–230 °C, Dämpfen höchstens 100 °C; Combair 30–280 °C; Airfryer 80–200 °C; Minuten 1–600; Kern 40–95 °C.

## 2. Allgemeine Regeln

1. **Mengen, Zutaten und Portionenzahl unverändert** lassen. Nur `steps` werden umgeschrieben, die Zutatenliste bleibt tabu.
2. **Schrittzahl ähnlich** halten: sinnvoll zusammenfassen oder teilen (Ofenphasen = eigene Schritte). Jede Zutat soll weiterhin im Schritt genannt sein, in dem sie gebraucht wird (der Kochmodus ordnet Zutaten über die Schritttexte zu).
3. **Stil wie die bestehenden Rezepte:** ein Satz pro Handlung, Imperativ, deutsch, konkret („in den vorgeheizten Combair schieben“). Keine Marketingsprache, keine Emojis.
4. **Vorheizen erwähnen**, wo nötig (Backofen, Airfryer bei Fleisch/Paniertem, Pfanne vor dem Öl). Dämpfen braucht kurzes Aufheizen, der Text sagt „Den CombiSteamer vorheizen“.
5. Temperaturen und Zeiten aus den Tabellen unten bzw. `vzug.md` 4.2 / `bora-airfryer.md` ableiten. Ofen-Rezept → Heissluft meist 20 °C niedriger. Bei Unsicherheit eher kurze Zeit + Prüfhinweis im Text („Garprobe machen“).
6. Gerät nur nehmen, wenn es echten Vorteil bringt. Kein Gerät nötig (Schneiden, Mischen, Pürieren, Marinieren) → Schritt ohne `settings`.
7. Frühstück (bf): Vorbereitung am Prep-Tag darf CombiSteamer/Combair nutzen (Baked Oats, Eiermuffins). **Aufwärmen auf der Arbeit bleibt Mikrowelle** (dort gibt es keine V-ZUG-Geräte) und steht im Feld `morning`, nicht in `deviceSteps`.

## 3. Welches Gerät wann

- Kartoffeln, Klöße, Gemüse, Reis, Eier, Fisch garen: **CombiSteamer, Dämpfen**.
- Reste und Meal-Prep aufwärmen, ohne auszutrocknen: **CombiSteamer, Regenerieren**.
- Braten mit Kruste (Schwein, Ente, Gans): CombiSteamer Heissluft mit Beschwaden (saftig), letzte Phase trocken im Combair mit 210–220 °C.
- Niedertemperatur (Rind, Kalb): CombiSteamer „Lebensmittel vorbereiten“ 80–90 °C mit Kerntemperaturfühler, danach Combair Grill kurz.
- Pizza, Flammkuchen, Brötchen, Gratin, Lasagne, Aufläufe: **Combair**.
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
| Reis (1:1,5 Wasser, ungelochtes Blech) | CombiSteamer · Dämpfen | 100 | 20–25 | |
| Nudeln | BORA | | | `Power`, dann `7` |
| Gemüse (Brokkoli, Möhre, Bohnen) | CombiSteamer · Dämpfen | 100 | 6–20 | gelochtes Blech, bissfest |
| Schweinebraten (1–1,5 kg) | CombiSteamer · Heissluft mit Beschwaden, dann Combair · Heissluft | 165–170 / 220 | 90–120 + 15–20 | Kern 75–80 |
| Rinderbraten (Niedertemperatur) | CombiSteamer · Lebensmittel vorbereiten, dann Combair · Grill | 80–90 | 90–150 | Kern 55–58 (rosa), Schmorbraten 85 |
| Kalbsbraten | CombiSteamer · Heissluft feucht | 140–160 | 90–120 | Kern 68–72 |
| Ente ganz | CombiSteamer · Heissluft mit Beschwaden, dann Combair · Heissluft | 150 / 200–220 | 90 + 20 | Kern Brust 78, Keule 85–90 |
| Gänsekeule | CombiSteamer · Heissluft feucht, dann Combair · Heissluft | 130 / 210 | 90–120 + 15 | Kern 90 |
| Hähnchenbrust | CombiSteamer · Dämpfen | 85–100 | 12–20 | Kern 68–72 |
| Hähnchen ganz/Keulen | Combair · Heissluft (feucht = saftiger) | 190 | 45–60 / 35–45 | Kern 80–85; Keulen alternativ Airfryer 180–200 °C, 18–25 Min. |
| Fisch (Filet / ganz) | CombiSteamer · Dämpfen | 80–90 / 90–100 | 8–14 / 15–20 | Kern 55–62 |
| Aufläufe, Gratin, Lasagne | Combair · Heissluft oder Ober-/Unterhitze | 180–200 | 30–45 | saftiger: CombiSteamer Heissluft mit Beschwaden 170 |
| Pizza, Flammkuchen | Combair · PizzaPlus | 240–280 | 8–15 | Einschub 1–2, vorheizen |
| Brötchen aufbacken | CombiSteamer · Heissluft mit Beschwaden (oder Combair) | 180–200 | 8–12 | Airfryer 160–180 °C, 3–6 Min. |
| Schnitzel/Paniertes | BORA-Pfanne `5`–`6` oder Airfryer | – / 180 | – / 10–14 | Airfryer: andrücken, einsprühen, wenden |
| Frittiertes, Pommes, Spalten | Airfryer | 180–200 | 15–25 | Korb halb voll, 1–2× schütteln |
| Frühlingsrollen, Jiaozi TK | Airfryer | 180–190 | 8–12 | einölen |
| Eier (wachsweich / hart) | CombiSteamer · Dämpfen | 100 | 6–7 / 10–12 | |
| Baked Oats, Eiermuffins (Prep) | Combair · Heissluft (oder CombiSteamer · Heissluft mit Beschwaden 160–170) | 170–180 | 15–25 | Förmchen auf Rost |
| Reste regenerieren (Reis, Nudeln, Klöße, Gemüse, Braten) | CombiSteamer · Regenerieren | 110–130 | 8–20 | Gefäß mit Deckel, Soße/Wasser zugeben, vorheizen |
| Panierte Reste knusprig | Airfryer | 150–160 | 3–6 | oder nach Regenerieren kurz Heissluft |

## 6. Abzug (BORA)

Automatik „A“ an lassen, der Lüfter folgt dem Kochfeld. Beim scharfen Anbraten, Wok und Frittieren im Text eine Lüfterstufe höher bzw. Lüfter-Powerstufe empfehlen (fällt nach 5 Min. zurück); als Satz im Schritt, nicht als eigene Einstellung. Nachlauf nicht abbrechen.

## 7. Prüfen

`npx tsc -b`, `npm run -s check-data` (Bereiche, bekannte IDs, Abdeckung), `npx vite-node scripts/test-devices.ts` und `scripts/test-cook.ts`.

## Feste Regeln (vom Koordinator ergänzt)

- **Ein Gericht bleibt in einem Gerät.** Nicht zwischen CombiSteamer und Combair umziehen (z. B. für die Kruste): der CombiSteamer kann selbst trocken bis 230 °C. Der zweite Ofen ist für **parallele** Komponenten da (Beilage, Gemüse, Knödel, Pizza 2. Blech).
- **Erlaubte Betriebsarten** (exakt so schreiben, wird geprüft): CombiSteamer: Dämpfen, Heissluft, Heissluft feucht, Heissluft mit Beschwaden, Regenerieren, Lebensmittel vorbereiten, Warmhalten, Auftauen · Combair: Heissluft, Ober-/Unterhitze, Heissluft feucht, PizzaPlus, Zartgaren, Grill, Grill mit Umluft, Warmhalten, Auftauen, Tellerwärmen · BORA: mode 'Kochzone' + level ('1'–'9', 'Power', 'Schmelzen', 'Warmhalten', 'Simmern') · Airfryer: 'Heissluft' + temp.
- BORA X Pure: Pfannen/Töpfe frei auf der Fläche platzieren; für große Bräter/Pfannen die Brückenfunktion erwähnen (note: 'Brücke'). Abzug: Automatik „A“ – nur bei sehr starkem Anbraten note: 'Abzug Power'.
- Nicht jedes Gericht braucht einen Ofen: Pfannen-, Wok- und Nudelgerichte bleiben auf dem BORA. Den CombiSteamer nur nehmen, wo er klar besser ist (Dämpfen, Braten saftig, Aufläufe, Regenerieren, Klöße/Kartoffeln/Reis/Gemüse ohne Topf).
- Meal-Prep-Frühstück: Zubereitung zu Hause mit den Geräten; das Aufwärmen auf der Arbeit bleibt Mikrowelle (dort steht kein V-ZUG).
