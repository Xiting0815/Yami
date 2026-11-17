# Korrekturen aus den V-ZUG-Anleitungen

Stand: 17.11.2026. Grundlage: Bedienungsanleitungen CombiSteamer V6000 45 (CS6T-23032/-23043, 76 Seiten) und Combair V6000 45 (C6T-21050/-21067, 68 Seiten), Details und Seitenzahlen in `vzug.md`. Betroffen: `src/deviceText.ts` (Betriebsarten und Prüfung) und `src/data/device-steps/*.ts` (de, de2, it, as, gr, bf).

**Ergebnis:** 123 Rezepte angepasst (von 130 Rezepten, die CombiSteamer oder Combair nutzen; 255 Rezepte haben insgesamt Geräte-Schritte, der Rest nutzt nur BORA/Airfryer; die 7 unveränderten sind reine Ober-/Unterhitze-Gerichte wie Lasagne). Zutaten, Mengen und Portionen unverändert; nur Einstellungen, Hinweise (`note`) und wenige Sätze im Text.

Wichtig: Die Anleitungen enthalten **keine Garzeittabellen** (Kartoffeln, Gemüse, Reis, Eier, Fisch, Backen). Die Garzeiten in den Rezepten konnten deshalb **nicht** gegen die Anleitung geprüft werden; sie bleiben Richtwerte. Geprüft wurden Betriebsarten, Temperaturbereiche, Vorheizen, Ebenen, Zubehör und Kerntemperaturen. Die einzige Anleitungstabelle (Zartgaren, Kerntemperaturen) steht in `vzug.md` 4.3; kein Rezept nutzt Zartgaren.

## Änderungen an `src/deviceText.ts`

| Was | Alt | Neu | Grund (Anleitung) |
|---|---|---|---|
| Schreibweise | `Heissluft`, `Heissluft feucht`, `Heissluft mit Beschwaden` | `Heißluft`, `Heißluft feucht`, `Heißluft mit Beschwaden` (alte Schreibweise wird beim Prüfen weiter akzeptiert, `normalizeMode`) | CS S. 32 / CA S. 33: Anwendungsnamen mit ß |
| Combair-Grill | `Grill mit Umluft` | `Grill-Umluft` (alt wird akzeptiert) | CA S. 32 |
| CombiSteamer-Modi | Dämpfen, Heissluft, Heissluft feucht, Heissluft mit Beschwaden, Regenerieren, **Lebensmittel vorbereiten**, Warmhalten, **Auftauen** | Heißluft, Heißluft feucht, Heißluft mit Beschwaden, **Heißluft eco**, Dämpfen, Regenerieren, RegenerierAutomatik feucht/knusprig, Dörren, **Vacuisine**, Profi-Backen (4 Varianten), Zartgaren, Warmhalten, Tellerwärmen | CS S. 32-43. „Lebensmittel vorbereiten“ gibt es nicht (Sous-vide heißt Vacuisine); „Auftauen“ fehlt in beiden Geräten |
| Combair-Modi | Heissluft, Ober-/Unterhitze, Heissluft feucht, PizzaPlus, Zartgaren, Grill, Grill mit Umluft, Warmhalten, **Auftauen**, Tellerwärmen | Ober-/Unterhitze (+ feucht, eco), Unterhitze, PizzaPlus, Grill, Grill-Umluft, Heißluft (+ feucht, eco), Dörren, Zartgaren, Warmhalten, Tellerwärmen | CA S. 30-39 |
| Temperaturbereiche | CombiSteamer pauschal 30-230, Dämpfen ≤ 100; Combair 30-280 | Je Modus: Dämpfen 30-100, Heißluft/feucht/eco 30-230, Beschwaden 80-230, Regenerieren 80-200, Vacuisine 30-95, Dörren 40-85; Combair Heißluft/Ober-Unterhitze/PizzaPlus/Grill-Umluft 30-280, „feucht“ und eco 30-250 | CS S. 32-35, CA S. 30-36 |
| Ohne Temperaturwert | – | Warmhalten, Tellerwärmen, Zartgaren, Grill, Unterhitze, RegenerierAutomatik: Temperatur in `settings` ist ein Fehler | CS S. 39-40, CA S. 31-32, 39 |
| Dauer | pauschal 1-600 Min. | zusätzlich Warmhalten 5-90, Tellerwärmen 30-600, Zartgaren 90-270, Vacuisine bis 4320 | CS S. 18 / CA S. 17-18 |
| Kerntemperatur | 40-95 | zusätzlich: nur bei Garraumtemperatur ≤ 230 °C; bei Vacuisine, Warmhalten, Tellerwärmen nicht einstellbar | CS S. 13, 35-36 |
| Feuchte in % | erlaubt 0-100 | bei V-ZUG ein Fehler (nur über die Betriebsart) | CS S. 32-34 |

`DEVICE_MODES['airfryer']` (`Heissluft`) und BORA unverändert.

## Änderungen an den Rezepten

### K1 Schreibweise der Betriebsarten (47 Rezepte)

Alle `Heissluft…` bei CombiSteamer/Combair wurden `Heißluft…`; `Grill mit Umluft` wurde `Grill-Umluft`; im Text von Frühstücken „170 °C Heissluft“ → „Heißluft“. Airfryer-Einstellungen (`Heissluft`) blieben.

schweinebraten, rinderrouladen, sauerbraten, rindergulasch, kohlrouladen, gefuellte-paprika, hackbraten, schweinshaxe, kartoffelgratin, kartoffel-hack-auflauf, schinkennudel-auflauf, brokkoli-kartoffel-auflauf, blumenkohl-auflauf, zucchini-hack-auflauf, spaetzle-auflauf, fischauflauf, sauerkraut-auflauf, rosenkohl-gratin, chicoree-gratin, kartoffel-lauch-gratin, gaensekeulen-rotkohl, entenbrust-orangensauce, entenkeulen-rotkohl, kalbsbraten-rahmsauce, saltimbocca, ossobuco, pollo-cacciatora, salsiccia-patate, zucchine-ripiene, spezzatino, char-siu, knusprige-ente-suess-sauer, bifteki-feta, gyros-metaxa-ueberbacken, moussaka, pastitsio, giouvetsi-kritharaki, gyros-kritharaki-topf, kotopoulo-lemonato, gemista, gigantes-feta, eiermuffins-spinat-feta, eiermuffins-schinken, frittata-stuecke, baked-oats-blaubeer, baked-oats-apfel, quarkauflauf.

### K2 Kein Vorheizen bei Dämpfen und Regenerieren (84 Rezepte)

Vorheizen gibt es nur bei Heißluft, Heißluft feucht, Heißluft mit Beschwaden und Profi-Backen bemehlt/bestrichen [CS S. 22]. Alt: Einstellung `Dämpfen`/`Regenerieren` mit `note: 'vorheizen, …'` und Text „Den CombiSteamer vorheizen“ / „im vorgeheizten CombiSteamer“. Neu: `note` ohne „vorheizen“ (wo nur „vorheizen“ stand: `Wasserbehälter füllen`); Text: „Den **Wasserbehälter des CombiSteamers füllen**“ bzw. „im CombiSteamer“. Dämpfen braucht Wasser im Behälter [CS S. 16, 33]. Heißluft-Schritte des CombiSteamers (schweinebraten, schweinshaxe, kalbsbraten-rahmsauce, ossobuco, spezzatino) behalten ihr Vorheizen.

Betroffen: rinderrouladen, sauerbraten, wiener-schnitzel, cordon-bleu, koenigsberger-klopse, frikadellen, szegediner-gulasch, kassler-sauerkraut, leberkaese, bratwurst-sauerkraut, himmel-und-erde, labskaus, senfeier, spinat-spiegelei, huehnerfrikassee, zuercher-geschnetzeltes, kohlrouladen, gefuellte-paprika, hackbraten, bauernfruehstueck, matjes-hausfrauenart, backfisch, lachs-senf-dill, pellkartoffeln-kraeuterquark, gruene-sosse, tafelspitz, leber-berliner-art, spargel-hollandaise, pannfisch, gruenkohl, schaschlik-pfanne, ragout-fin, kotelett-rahmkohlrabi, scholle-finkenwerder, hochzeitssuppe, kartoffel-hack-auflauf, brokkoli-kartoffel-auflauf, blumenkohl-auflauf, fischauflauf, sauerkraut-auflauf, rosenkohl-gratin, chicoree-gratin, gaensekeulen-rotkohl, entenkeulen-rotkohl, gnocchi-salbei, ribollita (Regenerieren), gong-bao, mapo-tofu, gu-lao-rou, yangzhou-reis, rind-brokkoli, hui-guo-rou, tomaten-ei, yu-xiang-qiezi, cashew-huhn, char-siu, hong-shao-rou, jiaozi, ingwer-huhn, pfeffer-rind, gedaempfter-fisch, gan-bian-dou, pak-choi-shiitake, zitronen-huhn, cola-wings, lu-rou-fan, wan-tan-suppe, gruenes-curry, rotes-curry, pad-kra-pao, massaman, teriyaki-huhn, shoyu-ramen, bibimbap, bulgogi, nasi-goreng, katsu-curry, knusprige-ente-suess-sauer, gyros-metaxa-ueberbacken, keftedes-reis, soutzoukakia, brot-box, linsen-ei-salat, savory-oats.

Beispiel: `schaschlik-pfanne` Schritt „Reis“: `CS Dämpfen 100 °C 22 Min. [vorheizen, ungelocht]` → `CS Dämpfen 100 °C 22 Min. [Schale]`.

### K3 Reis und Flüssigkeiten: kein „ungelochtes Blech“ (35 Rezepte)

Es gibt beim CombiSteamer keinen ungelochten Garbehälter; Zubehör sind Edelstahlblech, gelochter Garbehälter, Kuchenblech (nicht für Dämpfen), Gitterrost [CS S. 12-14]. Die Anleitung empfiehlt Reis und Getreide in Serviergeschirr auf dem gelochten Garbehälter oder Gitterrost [CS S. 67]. Neu im Text: „in eine flache Schale geben, auf den gelochten Garbehälter auf Ebene 2 stellen und dämpfen“; `note: 'ungelocht'` → `Schale`.

huehnerfrikassee, gefuellte-paprika, schaschlik-pfanne, gong-bao, mapo-tofu, gu-lao-rou, yangzhou-reis, rind-brokkoli, hui-guo-rou, tomaten-ei, yu-xiang-qiezi, cashew-huhn, char-siu, hong-shao-rou, ingwer-huhn, pfeffer-rind, gedaempfter-fisch, gan-bian-dou, pak-choi-shiitake, zitronen-huhn, cola-wings, lu-rou-fan, gruenes-curry, rotes-curry, pad-kra-pao, massaman, teriyaki-huhn, bibimbap, bulgogi, nasi-goreng, katsu-curry, knusprige-ente-suess-sauer, gyros-metaxa-ueberbacken, keftedes-reis, soutzoukakia. (Ragout-fin, kohlrouladen: Hinweis `ungelocht` → `Schale`.)

### K4 Warmhalten ohne Temperatur (5 Rezepte)

Warmhalten hat keine einstellbare Temperatur, nur Dauer 5 Min. bis 1 h 30 [CA S. 39]. Alt `CA Warmhalten 80 °C` (zwiebelrostbraten: 70 °C), Text „bei 80 °C warm halten“. Neu `CA Warmhalten`, Text „… mit „Warmhalten“ warm halten“.

| Rezept | alt | neu |
|---|---|---|
| jaegerschnitzel | CA Warmhalten 80 °C [Teller vorwärmen] | CA Warmhalten [Teller vorwärmen] |
| paprikaschnitzel | CA Warmhalten 80 °C | CA Warmhalten |
| rahmschnitzel | CA Warmhalten 80 °C | CA Warmhalten |
| schweinemedaillons-pfefferrahm | CA Warmhalten 80 °C | CA Warmhalten |
| zwiebelrostbraten | CA Warmhalten 70 °C | CA Warmhalten |

### K5 Grill hat Stufen, keine Temperatur (2 Rezepte)

Grill: 4 Stufen, Vorschlag Stark (Stufe 3), Auflage 3, 3 Min. vorheizen [CA S. 32].

| Rezept | alt | neu |
|---|---|---|
| ragout-fin | CA Grill 4 Min. [Einschub 3] | CA Grill 4 Min. [Stufe 3 (stark), Ebene 3, 3 Min. vorheizen] |
| char-siu | CA Grill-Umluft (vorher „Grill mit Umluft“) 230 °C 3 Min. [Ebene 3] | CA **Grill** 3 Min. [Stufe 3 (stark), Ebene 3]. Karamellisieren „unter dem Grill“ ist flaches Grillgut; Grill-Umluft hat Auflage 2 |

### K6 PizzaPlus auf Auflage 2 (4 Rezepte)

PizzaPlus: Auflage 2, dunkles emailliertes Blech [CA S. 32]. Alt Ebene 1/„Einschub 1“/„unterste Stufe“. Neu Ebene 2 (Text und Hinweis).

flammkuchen (250 °C, Text „auf der untersten Stufe“ → „Ebene 2“), pizza-margherita (280 °C), pizza-diavola (280 °C), calzone (250 °C).

### K7 Grill-Umluft auf Auflage 2 (2 Rezepte)

Grill-Umluft: Auflage 2 [CA S. 32]. Alt Ebene 3, neu Ebene 2 (Text und Hinweis): gyros-metaxa-ueberbacken (200 °C, 10 Min.), gyros-kritharaki-topf (200 °C, 9 Min.).

### K8 Zwei Ebenen = 1 + 3 (1 Rezept)

Heißluft auf zwei Auflagen: 1 + 3 [CA S. 33]. moussaka: `CA Heißluft 200 °C 25 Min. [vorheizen, Ebene 2+3]` → `[vorheizen, Ebene 1+3]`, Text „auf Ebene 2 und 3 verteilen“ → „auf Ebene 1 und 3“.

### K9 Dämpfen, Temperaturen und Kerntemperaturen: geprüft, unverändert

- Alle Dämpfen-Einstellungen liegen im Bereich 30-100 °C (80 °C Eierstich, 85/90 °C Fisch, sonst 100 °C). Heißluft-Modi 150-220 °C, PizzaPlus 250-280 °C, Ober-/Unterhitze 180-220 °C: alles innerhalb der Anleitungsbereiche.
- Kerntemperaturfühler: alle `core`-Werte stehen bei Garraumtemperaturen ≤ 230 °C (Anleitung: Fühler nicht über 230 °C). Kein Rezept nutzt Vacuisine, bei dem der Fühler nicht einstellbar wäre.
- Ebenen: CombiSteamer Dämpfen Ebene 1-3, Heißluft 2; Combair Heißluft/Ober-/Unterhitze Ebene 2: alle gültig.
- Vorheizen bei Combair-Heißluft/Ober-/Unterhitze/PizzaPlus/Heißluft feucht und CombiSteamer-Heißluft-Anwendungen: erlaubt, unverändert.

### Nicht geändert, aber zu beachten

- **Garzeiten** (Kartoffeln 25/35 Min., Reis 22 Min., Eier 7/10-12 Min., Fisch 10 Min., Gemüse 3-8 Min.): die Anleitungen enthalten keine Tabellen; die Zeiten bleiben Richtwerte. Die Eingabe am Gerät (EasyCook) zeigt Vorschläge.
- **Zartgaren/Vacuisine** werden von keinem Rezept genutzt. Für Niedertemperaturbraten wären sie passend (Tabelle in `vzug.md` 4.3). Das wäre eine inhaltliche Rezeptänderung und nicht Teil dieser Korrektur.
- **Heißluft mit Beschwaden und Kuchenblech:** das Kuchenblech ist nur bei > 150 °C zulässig, das Edelstahlblech nur bei < 150 °C [CS S. 12]. Rezepte nennen kein Blech; alle Beschwaden-Schritte haben 160-170 °C, also Kuchenblech.
- „gelochtes Blech“ in den Texten bedeutet den **Garbehälter gelocht** (CombiSteamer). Der Wortlaut „Blech“ bleibt.
- Hinweis zu `src/types.ts` (nicht Teil dieser Aufgabe): der Kommentar bei `mode` nennt noch „Heissluft“; `src/breakfast.ts` prüft `mode !== 'Dämpfen'` (Regenerieren zählt dort als Ofennutzung).
