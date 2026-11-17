# V-ZUG Kompaktgeräte: CombiSteamer V6000 45 und Combair V6000 45

Stand der Recherche: 17.11.2026. **Wichtig zur Verlässlichkeit:** In der Recherche-Umgebung waren vzug.com, manualslib, lax-online und moebelplus.de per WebFetch gesperrt. Es konnten nur Suchergebnis-Zusammenfassungen und GitHub gelesen werden. Alles, was nicht mit Quelle markiert ist, sind Richtwerte aus allgemeinem Garwissen (Dampfgarer/Kombidämpfer) und **keine Herstellerangaben**. Vor dem ersten Einsatz bitte gegen die Bedienungsanleitung bzw. das Display des Geräts prüfen (Tabelle "Unsicher" am Ende).

Legende: [V] = aus V-ZUG-Anleitung/Datenblatt (über Suchzusammenfassung), [H] = Händlerangabe, [R] = Richtwert/Erfahrung, nicht verifiziert.

## 1. Welche Geräte genau?

| Frage | Befund |
|---|---|
| Namensschema | "45" = Nischenhöhe 45 cm (Breite 60 cm), nicht Volumen. [H] |
| CombiSteamer V6000 45 (ohne Zusatz) | Dampfbackofen mit Dampferzeuger, ohne Mikrowelle. Artikelnummern z. B. 2303200006, 2304300009 (Datenblatt, Garraum 48 l [V/H]). Varianten: "AutoDoor" (motorische Tür), "F" (Festwasseranschluss). |
| Mikrowellen-Variante | Existiert **nur beim CombiSteamer**: "CombiSteamer V6000 45M PowerSteam" (Dampf + Mikrowelle). Eine App-Bezeichnung ohne "M" bedeutet daher: **keine Mikrowelle**. [V/H] |
| "Grand" | Eigenes 90-cm-Modell (45L Grand, 68 l). Ist bei euch sehr wahrscheinlich nicht gemeint. [H] |
| Combair V6000 45 | Reiner Backofen (kein Dampf), Artikelnummern z. B. 2105000011, 2106700001. Varianten: "45P" (Pyrolyse, 2107000002/9, 14 Funktionen laut Händler), AutoDoor. **Es gibt keine Combair-Mikrowellenvariante** ("Combair 45M" gibt es nicht; die Mikrowelle steckt im CombiSteamer 45M). |
| Wahrscheinlichste Variante | CombiSteamer V6000 45 (ohne M, ohne Grand, ohne F) + Combair V6000 45 (ohne P, evtl. AutoDoor). |
| Ob Pyrolyse (P) vorhanden | Am Gerät prüfen: Menü "Reinigen/Pyrolyse" vorhanden? Sonst ist es der Nicht-P-Ofen. |

Hinweis: Im Home-Assistant-Integrationsrepo heissen die Geräte "CombiSteamer V6000" und "Combair V6000", daher passt das Schema.

## 2. CombiSteamer V6000 45

### 2.1 Betriebsarten (Namen aus V6000-Anleitungen, Bereiche aus Suchzusammenfassungen)

Die Anleitungen nummerieren die Betriebsarten im Kapitel "Anwendungen". Die genaue Menüreihenfolge ist je Firmware unterschiedlich.

| Betriebsart (Anzeige) | Bereich / Vorschlag | Einschub | Quelle | Bemerkung |
|---|---|---|---|---|
| Dämpfen | 30-100 °C, Vorschlag 100 °C | 1-3 oder 1-4 | [V] | Dampf + Heissluft; unter 100 °C zunehmend Dampf mit weniger Hitze |
| Heissluft | 30-230 °C, Vorschlag 180 °C | 2 oder 1+3 | [V] | trocken |
| Heissluft feucht | 30-230 °C, Vorschlag 180 °C | 2 oder 1+3 | [V] | Heissluft, Feuchte im Gargut bleibt erhalten |
| Heissluft mit Beschwaden | 80-230 °C, Vorschlag 180 °C | 2 oder 1+3 | [V] | Dampfstösse zugefügt; Dampfbacken, Kruste + saftig |
| Heissluft eco | 30-230 °C | | [V] | energiesparend |
| Regenerieren | 80-200 °C, Vorschlag 120 °C | 1-4 | [V] | Aufwärmen mit Dampfanteil, ohne auszutrocknen |
| Lebensmittel vorbereiten (Niedertemperatur, evtl. Vacuisine/Zartgaren) | 30-95 °C, Vorschlag 60 °C, max. 72 h empfohlen | 1-4 | [V] | Name im Menü unsicher |
| Ober-/Unterhitze, Unterhitze, Grill, Grill mit Umluft, PizzaPlus | modellabhängig, je ca. bis 230 °C | | [R] | bei CombiSteamer teils nur mit Dampfzusatz/eingeschränkt; im Display prüfen |
| Auftauen | ca. 30-60 °C | | [R] | |
| Speisen warm halten | ca. 50-100 °C | | [H] (genannt) | |
| Tellerwärmen | | | [H] genannt | Combair: Laufzeit 30 min-10 h [V] |
| Entsaften / Einkochen / Dörren / Joghurt / Teig gehen | | | [R] | typisch für V-ZUG Dampfgarer; Namen und Bereiche nicht bestätigt |
| Automatikprogramme | Laut Händler "250 Automatikprogramme" (eBay-Titel [H]); Rezepte/Programme auch über V-ZUG-App ("V-ZUG-Home") | | [H] | GourmetGuide / RegenerierAutomatik / GarAutomatik genannt [H] |

Dämpfen mit Temperatur < 100 °C und die 40-85 °C-Bereiche der Liste lassen sich nicht sicher zuordnen. Feuchteoption: V-ZUG steuert Feuchte nicht in % einstellbar, sondern über die Betriebsart (trocken = Heissluft, feucht, mit Beschwaden, Dämpfen). [R]

### 2.2 Sonstiges

| Thema | Befund |
|---|---|
| Garraum | 48 l (Datenblatt 2304300009 [V]) |
| Einschubebenen | 3 bis 4 (Anleitung nennt Auflage 1-3 bzw. 1-4 je Ausgabe) [V]. **2 Ebenen parallel: ja** bei Heissluft/Heissluft feucht (Ebenen 1+3), bei Dämpfen mehrere. |
| Kerntemperaturfühler | Bei V6000 CombiSteamer vorhanden (Fust: "3-Punkt-Kerntemperaturfühler" für Combair-Datenblatt [H]; beim CombiSteamer sehr wahrscheinlich ebenso). [R] |
| Zubehör | Gelochtes und ungelochtes Garblech (Gastro-Norm-nahe Masse, nicht bestätigt), Backblech, Gitterrost. Genaue Masse unsicher. |
| Wasser | Wassertank (ca. 1 l-Klasse, unsicher) vorn; bei "F" Festwasseranschluss. |
| Entkalken | Programm "Entkalken" vorhanden [V]; das Gerät fordert es nach Härtegrad/Dampfstunden an. Wasserhärte im Setup einstellen. Entkalken ist vom "Pinnen" ausgenommen [V]. |
| Gerätefunktionen | WLAN, V-ZUG-Home-App, Pinnen (Lieblingseinstellungen) [V] |

## 3. Combair V6000 45

| Betriebsart | Bereich / Vorschlag | Quelle |
|---|---|---|
| Heissluft | 30-280 °C | [V] (Combair 45) |
| Heissluft feucht | 30-250 °C, Vorschlag 180 °C | [V] |
| Ober-/Unterhitze | 30-280 °C, Vorschlag 200 °C (Pyrolyse-Modelle bis 300 °C nur beim Reinigen) | [V] |
| Unterhitze | | [H] |
| Grill, Grill mit Umluft | | [H] |
| PizzaPlus (Heissluft + Unterhitze) | 30-280 °C, Vorschlag 200 °C | [V] |
| Zartgaren (Ober-/Unterhitze feucht) | 30-140 °C, Vorschlag 85 °C, Laufzeit 1 h 30 min-4 h 30 min | [V] |
| Dörren (modellabhängig) | ca. 50-100 °C | [V] genannt, Bereich [R] |
| Speisen warm halten | | [H] |
| Tellerwärmen | 30 min-10 h | [V] |
| Sabbat-Modus | Ober-/Unterhitze 30-140 °C | [V] |
| Pyrolyse | nur Variante 45P | [H] |
| GarAutomatik / Programme | wählt Dauer/Temperatur nach Grösse und Form des Garguts [H]; Rezepte in App | [H] |
| Kerntemperaturfühler | 3-Punkt-Fühler laut Händlerblatt [H] | |
| Garraum | 43 l (nur für 45P belegt [H]); 3 Einschübe [H] |

"Eco-Heissluft", "Bratautomatik" und "Profi-Backen": nicht bestätigt. "Heissluft eco" wird in CombiSteamer-Anleitungen genannt.

## 4. Konvertierungsregeln (Standardrezept zu V-ZUG)

Alle Werte sind Richtwerte [R]. Erst kurze Laufzeiten ansetzen, mit Kerntemperatur/Probe prüfen und im Gerät notieren (die App kann lernen: Ergebnis rückmelden).

### 4.1 Wann was?

- WENN Kartoffeln, Klösse, Gemüse, Reis, Eier, Fisch gegart werden sollen: DANN **CombiSteamer** im Modus Dämpfen (statt Herd).
- WENN Reste/Meal-Prep aufgewärmt werden und nicht austrocknen sollen (Reis, Nudeln, Fleisch, Klösse, Gemüse, Aufläufe): DANN **CombiSteamer, Regenerieren, ca. 110-130 °C**.
- WENN Braten mit knuspriger Kruste (Schweinebraten, Ente, Gänsekeule): DANN zuerst CombiSteamer Heissluft mit Beschwaden (saftig) oder Combair Heissluft; die letzte Phase trocken (Combair Ober-/Unterhitze oder CombiSteamer Heissluft) mit 220-230 °C für die Kruste.
- WENN Niedertemperaturbraten (Rind, Kalb): DANN CombiSteamer "Lebensmittel vorbereiten"/Niedertemperatur 80-95 °C mit Kerntemperaturfühler, danach Combair Grill/Ober-/Unterhitze zum Anbräunen.
- WENN Pizza, Flammkuchen, Brötchen, Gebäck, Gratin mit Kruste, Lasagne: DANN **Combair** (PizzaPlus/Heissluft/Ober-/Unterhitze, bis 280 °C).
- WENN zwei Gerichte gleichzeitig: DANN Hauptgericht im Combair (trocken/Kruste), Beilage im CombiSteamer (Dampf). Pro Gerät passt Menge für 2 Personen locker (43-48 l).
- WENN Gericht Wasser verlieren soll (Pommes, Kruste, Chips): DANN nicht Dämpfen, sondern Combair/Heissluft.

### 4.2 Einstelltabellen

| Gericht | Gerät | Modus | °C | Dauer (min) | Kern / Hinweis |
|---|---|---|---|---|---|
| Schweinebraten (1-1,5 kg, Kruste) | CombiSteamer, dann Combair | Heissluft mit Beschwaden 160-170 °C, dann Heissluft 220 °C | 165 / 220 | 90-120 + 15-20 | Kern 75-80 °C, Schwarte vorher einschneiden |
| Rinderbraten (Niedertemp.) | CombiSteamer + Combair | Niedertemperatur 80-90 °C, dann Grill kurz | 80-90 | 90-150 | Kern 55-58 °C (rosa) bzw. 85 °C (zerfallend, Schmorbraten 3-4 h) |
| Kalbsbraten | CombiSteamer | Heissluft feucht | 140-160 | 90-120 | Kern 68-72 °C |
| Ente (ganz, 2 kg) | CombiSteamer, dann Combair | Heissluft mit Beschwaden 150 °C, dann Heissluft 200-220 °C | 150 / 210 | 90 + 20 | Kern Brust 78 °C, Keule 85-90 °C |
| Gänsekeule | CombiSteamer, dann Combair | Dämpfen/Heissluft feucht 130 °C, dann Heissluft 210 °C | 130 / 210 | 90-120 + 15 | Kern 90 °C |
| Hähnchenbrust | CombiSteamer | Dämpfen | 85-100 | 12-20 | Kern 68-72 °C |
| Hähnchen ganz / Keulen | Combair | Heissluft 190-200 °C (Heissluft feucht für saftig) | 190 | 45-60 (ganz), 35-45 (Keulen) | Kern 80-85 °C |
| Fisch (Filet) | CombiSteamer | Dämpfen | 80-90 | 8-14 | Kern 55-62 °C |
| Fisch ganz (Forelle) | CombiSteamer | Dämpfen | 90-100 | 15-20 | |
| Aufläufe / Gratin / Lasagne | Combair | Heissluft / Ober-/Unterhitze | 180-200 | 30-45 | Kruste; CombiSteamer Heissluft mit Beschwaden 170 °C bleibt saftiger |
| Pizza / Flammkuchen | Combair | PizzaPlus | 240-280 | 8-15 | Einschub 1-2 |
| Brötchen aufbacken | CombiSteamer (oder Combair) | Heissluft mit Beschwaden | 180-200 | 8-12 | knusprig + weich; Tiefgefrorenes länger |
| Salz-/Pellkartoffeln (halbiert) | CombiSteamer | Dämpfen | 100 | 20-30 | ganze mittelgrosse 30-40 min |
| Klösse (Kartoffel-/Semmelknödel, Beutel/Folie) | CombiSteamer | Dämpfen | 95-100 | 20-30 | |
| Klösse/Knödel regenerieren | CombiSteamer | Regenerieren | 110-120 | 10-15 | |
| Spätzle/Nudeln regenerieren | CombiSteamer | Regenerieren | 110-120 | 8-12 | mit Schale + Deckel/Gelochtes Blech, Wasser/Sosse darüber |
| Nudeln frisch kochen | Herd | | | | im Dämpfer unüblich (nicht verifiziert) |
| Gemüse (Brokkoli, Karotte, Bohnen) | CombiSteamer | Dämpfen | 100 | 6-20 | gelocht, bissfest |
| Reis (1:1,5 Wasser, Ungelocht) | CombiSteamer | Dämpfen | 100 | 20-25 | Basmati/Jasmin Verhältnis prüfen |
| Eier (Ei, hart/weich) | CombiSteamer | Dämpfen | 100 | wachsweich 6-7, hart 10-12 | |
| Eiermuffins / Baked Oats | Combair | Heissluft | 170-180 | 15-25 | Förmchen auf Rost; im CombiSteamer Heissluft mit Beschwaden 160-170 °C möglich |
| Fleisch regenerieren (Braten, Schnitzel) | CombiSteamer | Regenerieren | 110-130 | 10-20 | Schnitzel danach kurz Heissluft für Knusper |
| Meal-Prep Reis/Gemüse/Hähnchen | CombiSteamer | Regenerieren | 110-120 | 10-15 | zugedeckte Schale |

### 4.3 Praktische Hinweise

- Regenerieren immer mit Vorheizen und Gefäss mit leichtem Deckel bzw. Alufolie; Sosse/Wasser zugeben.
- Dämpfen: Geschirr/Blech lochen für Gemüse, ungelocht für Reis/Auffangen.
- Kruste braucht Trockenphase: Dampf nur in der ersten Hälfte.
- Temperaturen von Ober-/Unterhitze Rezept (Herd/Ofen) in Heissluft oft ca. 20 °C senken; bei Heissluft feucht Standardtemperatur beibehalten, Garzeit eher etwas länger.
- Kerntemperaturfühler nutzen (Rinderbraten, Ente, Geflügel): spart Fehlversuche; Fühler in dickster Stelle, nicht am Knochen.

## 5. Home Assistant / Vernetzung

| Punkt | Befund |
|---|---|
| Offizielle Integration | Keine gefunden (nicht in HA-Kerninteg.). |
| HACS Custom Integration | **siku2/hass-vzug** (https://github.com/siku2/hass-vzug), letzter Push Jan 2024 (Suchindex), MIT. Unterstützt laut README: **CombiSteamer V6000**, **Combair V6000**, CombairSteamer V6000, AdoraDish/Dry/Wash, CookTop, Cooler u. a. Maintainer testete u. a. CombairSteamer V6000. |
| Funktionen laut README | Firmware-Updates/Benachrichtigungen, alle Geräteeinstellungen als Entitäten, Programm- und Programmende-Sensoren, Eco-Status. Plattformen im Code: sensor, binary_sensor, select, number, switch, button, update. |
| Steuerung | Programmstart/-steuerung per API nach Community-Berichten **nicht möglich**; lesen (Status, laufendes Programm, Restzeit) schon. [R, Homey-Forum] |
| Weitere Projekte | magicmatt007/v_zug (Waschmaschine), MoritzBuetzer/homeassistant-vzug (Cooktop REST-Beispiel), Homey-App "V-ZUG Küchengeräte". |
| Voraussetzung | Gerät im WLAN; evtl. "Lokale API" in den V-ZUG-Home-Netzwerkeinstellungen aktivieren (Pfad je Firmware verschieden). V-ZUG-App beim Testen schliessen (Polling-Konflikt). |
| Nutzen für Yami | Programmende als Erinnerung ("Essen fertig"), Gartemperatur/Programm erfassen, "gekocht" automatisch erkennen. Kein Fernstart. |

## 6. Unsicher (und wahrscheinlichste Annahme)

| Offen | Annahme |
|---|---|
| Exakte Varianten (45 / AutoDoor / F / P) | CombiSteamer V6000 45 ohne M, ohne Grand; Combair V6000 45 ohne P |
| Genauer Menüname für Niedertemperatur/Vacuisine | "Lebensmittel vorbereiten" 30-95 °C bzw. in Menü "Zartgaren"; am Display prüfen |
| Ob CombiSteamer Ober-/Unterhitze, Grill, PizzaPlus hat | Kleiner Funktionsumfang als Combair; auf Display prüfen |
| Dörren, Entsaften, Einkochen, Joghurt beim CombiSteamer | wahrscheinlich vorhanden, Bereiche unbekannt |
| Zubehör-Masse, Wassertank-Volumen, Einschub-Zahl | 3-4 Ebenen, Garbleche passend 60-cm-Nische |
| Kerntemperaturfühler beim CombiSteamer | wahrscheinlich 3-Punkt-Fühler wie Combair |
| Combair-Volumen | 43 l |
| "Profi-Backen", "Bratautomatik", "Eco-Heissluft" | im Zielmodell nicht bestätigt |
| Alle Garzeiten/Tabellen oben | Richtwerte, nicht V-ZUG-Garbuch |
| HA: Entitäten-Liste für eure Modelle | nur lesen; Test mit der Integration nötig |
| Komplette Anleitung nicht gelesen | Netzwerksperre (vzug.com etc.); bitte die PDFs lokal prüfen oder Domains freigeben |

## 7. Quellen

- Bedienungsanleitung CombiSteamer V6000 (V-ZUG-Home): https://www.vzug.com/medias/sys_master/root/hd0/h10/11094473900062/1139376-1111776-00-AH.pdf
- Bedienungsanleitung CombiSteamer V6000 PowerSteam: https://www.vzug.com/medias/sys_master/root/hfe/hab/11096683413534/1062669-1056994-00-AI.pdf
- Bedienungsanleitung CombairSteamer V6000: https://www.vzug.com/medias/sys_master/root/hda/h65/11097774030878/1130560-1105298-00-AJ.pdf
- Bedienungsanleitung Combair V6000: https://img.moebelplus.de/pdf/vzug_combair_v6000_bedien.pdf
- Combair Einstelltipps (V-ZUG): https://www.vzug.com/medias/sys_master/imported-documents/imported-documents/h87/h82/8960324239390/J21007.970-0.pdf
- Datenblatt CombiSteamer V6000 45 (2304300009): https://www.vzug.com/occ/v2/de-site-spa/pdf/product/euDatasheet/V-ZUG-CS6T645CCYHA-2304300009.pdf?productCode=2304300009&lang=de_DE
- V-ZUG Produktseite Combair V6000 45: https://www.vzug.com/ch/en/product/ch-Catalog/2106700001
- Händler: https://www.moebelplus.de/v-zug-2105000011-combair-v6000-45-backofen-spiegelglas-platinum.html , https://www.fust.ch/kuechengeraete/kuecheneinbaugeraete/einbau-backofen/einbau-backofen-60-cm/v-zug-combair-v6000-45-2106700001-/p/10717876 , https://deschouwwitgoed.nl/media/files/p/r/Product_informatie_V-ZUG_oven_inbouw_Combair_V6000_45_AutoDoor.pdf
- HA: https://github.com/siku2/hass-vzug , https://community.home-assistant.io/t/vzug-integration/475188 , https://community.homey.app/t/app-pro-v-zug-kuchengerate/151054
