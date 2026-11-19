# Famag Grilletta IM5 – Spiralkneter

Stand: November 2026. Quellen: Händlerangaben (agrieuro, digitec/galaxus, Pleasant Hill Grain, Costante Imports), Erfahrungsberichte (The Perfect Loaf, The Fresh Loaf), allgemeine Spiralkneter-Praxis. Eine Herstelleranleitung war aus dieser Umgebung nicht abrufbar – alles mit **[H]** ist Händlerangabe, **[E]** Erfahrungswert, **[R]** Richtwert/eigene Ableitung.

In der App heißt das Gerät **„Famag“** (`device: 'kneter'`).

## 1. Gerät

| Merkmal | Wert | Quelle |
|---|---|---|
| Teigmenge max. | **5 kg Teig** = ca. 3 kg Mehl + 2 l Wasser | [H], überall gleich |
| Teigmenge min. | **0,3 kg Teig** („minimum guaranteed dough“); ein Händler nennt 1 kg, ein US-Importeur 0,5 kg **Mehl** | [H], widersprüchlich |
| Schüssel | ca. 7 l, Edelstahl; Haken (Spirale) und Mittelstab aus Edelstahl | [H] |
| Motor | ca. 350–370 W | [H] |
| Geschwindigkeit | **IM5 /1V: eine Geschwindigkeit** (Spirale ca. 80 U/min laut Händler, ein Besitzer nennt 135 U/min) · **IM5 /10V: 10 Stufen** per Drehregler (Spirale ca. 80–240 U/min) · **HH** (High Hydration): 10 Stufen, ca. 90–320 U/min, für sehr weiche Teige | [H] |
| „S“ im Namen (IM5S) | **Hebekopf** (Kopf hochklappbar, Schüssel herausnehmbar) – nicht die Zahl der Stufen. Es gibt IM5 und IM5S jeweils mit 1 oder 10 Geschwindigkeiten | [H] |

Hinweis für die App: Die Schritte nennen nur **Dauer** (und die Betriebsart Kneten/Mischen). Eine Stufe (`level` 1–10) wird nur angegeben, wenn es sie am Gerät gibt; mit dem 10-Stufen-Modell entspricht laut The Perfect Loaf ungefähr **Stufe 1–2 = „langsam“** und **Stufe 5–6 = „schnell“** eines klassischen Zwei-Gang-Kneters [E].

## 2. Betriebsarten in der App

| `mode` | Bedeutung |
|---|---|
| `Mischen` | Zutaten kurz verbinden (1–3 Min.), z. B. vor der Salzzugabe |
| `Kneten` | normales Auskneten (Standard) |
| `Kneten langsam` | Roggen- und Dinkelteige: nur gut vermischen bzw. kurz, nicht überkneten |
| `Kneten schnell` | nur beim 10-Stufen-Modell: kurze Schlussphase auf höherer Stufe für mehr Glutenaufbau |

Chip-Text: „Famag · Kneten 8 Min.“ bzw. mit Stufe „Famag · Stufe 3 · 6 Min.“. Geprüft werden Minuten 1–30 und Stufe 1–10 (`validateSetting`).

## 3. Knetzeiten (Richtwerte, immer am Teig prüfen)

Spiralkneter arbeiten schonend und erwärmen den Teig wenig; die Zeiten liegen meist etwas unter denen einer Küchenmaschine mit Knethaken. Die Quellen betonen: **Konsistenz zählt, nicht die Uhr** (Fenstertest – Teig lässt sich hauchdünn ausziehen, ohne zu reißen) [E].

| Teig | Famag | Hinweis |
|---|---|---|
| Pizza (Napoletana, 60–65 % Wasser) | 2 Min. mischen, Salz zu, 10 Min. kneten | Teig löst sich vom Haken, glatt [R] |
| Pizza in Teglia / Pinsa (75–80 % Wasser) | 5 Min. kneten, dann Salz und restliches Wasser schluckweise, 7 Min. | „Bassinage“ [E] |
| Weizenbrot, Brötchen, Focaccia | 8–10 Min. | |
| Ciabatta (sehr weich) | 12 Min., letztes Wasser in den letzten Minuten schluckweise | |
| Roggen-/Roggenmischbrot | 6–8 Min. langsam | Roggen wird nicht ausgeknetet, nur gut vermischt [R] |
| Dinkel | ca. 6 Min. langsam | Dinkel nicht überkneten [R] |
| Hefeteig für Kuchen (Butterkuchen, Datschi, Bienenstich) | 7 Min. | |
| Hefezopf, Dampfnudeln, Germknödel | 8–10 Min. | |
| Brioche | 5 Min. ohne Butter, dann Butter in Stückchen nach und nach, weitere 7 Min. (bei viel Butter länger) | Brioche kühl halten; bei langsamen Spiralknetern kann es deutlich länger dauern (ein Bericht: 40 Min.) [E] |
| Pittule (sehr weicher, fast flüssiger Teig) | 10 Min., Wasser nach und nach zugießen | sehr weiche Teige spritzen leicht – Wasser in Portionen [R] |

## 4. Tipps

- **Kaltes Wasser** bei langen Knetzeiten und langer kalter Gare (Pizza 24–48 h): Teigtemperatur nach dem Kneten ca. 22–25 °C [R].
- **Salz später** zugeben (nach 2–5 Min. Mischen) – das Gluten bildet sich schneller [E].
- **Autolyse („autolisi“)**: Mehl und Wasser 20–30 Min. ruhen lassen, dann Hefe/Salz zugeben – verkürzt die Knetzeit [E].
- **Bassinage**: bei hoher Hydration zuerst ca. 80 % des Wassers, den Rest schluckweise in den letzten Minuten [E].
- Fett (Butter, Öl) erst zugeben, wenn der Teig schon Struktur hat (Brioche, Hefezopf) [E].
- Mindestmenge beachten: Unter ca. 0,3 kg Teig greift der Haken nicht sicher. **Kleine Mengen von Hand kneten** oder die doppelte Menge kneten und die Hälfte als Teigkugel einfrieren [H/R].

## 5. Wofür nicht

- **Mürbeteig, Plätzchen, Rührteig, Cookies, Biskuit**: nein – Spiralkneter sind für Hefe-/Brotteige gebaut; Mürbeteig soll nur kurz zusammengebracht werden, Rührteig braucht Rührbesen. Bleibt von Hand bzw. Handrührgerät.
- **Nudelteig** (sehr fest, ca. 50 % Flüssigkeit): **nicht empfohlen** – keine Quelle bestätigt, dass der IM5 so feste Teige dauerhaft schafft. Nudelteig von Hand kneten.
- **Spätzleteig** (Rührteig, wird geschlagen): kein Kneter-Job.
- **Kartoffelteig** (Gnocchi, Klöße): nein – würde zäh.

## Unsicher

- Mindestmenge: 0,3 kg Teig (mehrere Händler) vs. 1 kg (ein Händler) vs. 0,5 kg Mehl (US-Importeur). Die App geht von **0,3 kg** aus; alle Rezepte liegen bei ≥ 430 g Teig.
- Drehzahl des 1-Gang-Modells: 80 U/min (Händler) oder 135 U/min (Besitzer).
- Welche Variante genau im Haushalt steht (1 oder 10 Geschwindigkeiten, Hebekopf ja/nein) – deshalb nennen die Rezepte nur Dauer und keine Stufe.
- Konkrete Knetzeiten vom Hersteller fehlen; alle Zeiten sind Richtwerte aus Spiralkneter-Praxis.
- Eignung für sehr feste Teige (Nudelteig, Bagels) nicht belegt.
