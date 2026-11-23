# Traeger Timberline 850 (Pellet-Smoker) – Gerätedaten für Yami

Stand der Recherche: 23.11.2026. Das Modell (US-Typ TFB85WLE, EU/AU TFB85WLEC) ist die **ältere Timberline-Generation**
(2019, D2-Steuerung, WiFIRE). Die neue „Timberline“ (ab 2023, ohne „850“) hat ein Induktions-Seitenkochfeld –
**die 850 nicht**. Nichts in Rezepten verwenden, was unten nicht steht.

## Daten

| Merkmal | Wert | Quelle / Sicherheit |
|---|---|---|
| Garraum-Temperatur | 165–500 °F ≈ **74–260 °C** | Traeger-Produktseiten (AU/NZ/UK), dt. Händler „74–260 °C“ |
| Einstellschritte | 5 °F (D2-Controller) | Traeger-Produktseite |
| Super Smoke | nur im unteren Bereich 165–225 °F ≈ **74–107 °C** | Traeger (Funktion), Bereich lt. AmazingRibs-Test |
| Keep Warm | Warmhalte-Modus des D2-Controllers, lt. Traeger-Listings (AU/CA); **am eigenen Controller prüfen** | unsicher |
| Grillfläche | 850 sq in (≈ 5.480 cm²), Traeger-Support nennt 869 sq in | Traeger |
| Ebenen | **3 Edelstahlroste**: oben ca. 56 × 23 cm, Mitte 56 × 36 cm, unten 56 × 41 cm (22″×9″/14″/16″) | Testbericht |
| Pellet-Behälter | 24 lb ≈ 11 kg, mit Füllstandssensor | Händlerangaben |
| Kerntemperaturfühler | **1 Fühler im Lieferumfang** (am Controller/App ablesbar); MEATER o. Ä. nur, wenn vorhanden | Händlerangaben |
| Steuerung | D2 Direct Drive, WiFIRE (Traeger-App: Temperatur, Fühler, Timer) | Traeger |
| Abluft | Downdraft Exhaust (Rauch zieht über das Grillgut nach unten ab) | Traeger |
| Seitenkochfeld | **keins** (nur Ablagen) | Traeger-Produktseiten |

## Einstellungen in Yami (`device: 'smoker'`, Chip „Traeger · …“)

| `mode` | `temp` (°C) | `minutes` | `core` | Notiz |
|---|---|---|---|---|
| `Vorheizen` | 74–260 | 5–30 | – | „Deckel zu“, Pellet-Sorte |
| `Super Smoke` | 74–107 | 1–1440 | 40–98 | erste Räucherstunden |
| `Smoken` | 74–260 | 1–1440 | 40–98 | Low & Slow, auch Texas Crutch |
| `Grillen` | 150–260 | 1–240 | 40–98 | heiß, z. B. Chicken-Haut knusprig, Reverse Sear |
| `Keep Warm` | – | 1–240 | – | Warmhalten nach dem Garen (siehe oben: prüfen) |

- **°C in der Einstellung, °F in der Notiz.** Der Controller wird in °F eingestellt (5-°F-Schritte). Baustein
  `traeger(mode, °F, { minutes, core, note })` in `src/data/device-helpers.ts` rechnet um (225 °F → 107 °C) und schreibt
  „225 °F“ in die Notiz. Der Text nennt beides: „bei 107 °C (225 °F)“.
- Übliche Stufen: 180 °F = 82 °C · 225 °F = 107 °C · 250 °F = 121 °C · 275 °F = 135 °C · 300 °F = 149 °C ·
  325 °F = 163 °C · 350 °F = 177 °C · 375 °F = 191 °C · 400 °F = 204 °C · 450 °F = 232 °C · 500 °F = 260 °C.
- Start: Deckel zu, ca. 15 Minuten vorheizen (Traeger-Startprozedur). Pellets in die Notiz („Pellets Hickory“,
  „Apfel“, „Kirsche“, „Eiche“ für Brisket, „Erle“ für Fisch).
- Fühler: in die dickste Stelle, nicht an den Knochen. Kerntemperaturen siehe `docs/bbq-regeln.md`.
- Roste: unten = große Stücke und Pit Beans unter dem Fleisch (Bratensaft tropft hinein), oben = Kleines/Warmhalten.

## Quellen

- Traeger Timberline 850 Produktseiten: https://www.traeger.com/uk/en/pellet-grills/timberline/850 ·
  https://www.traeger.com/nz/en/pellet-grills/timberline/850 · https://www.traeger.com/ca/en/pellet-grills/timberline/850
- Traeger Support (Spezifikationen, 869 sq in, max. 500 °F): https://support.traeger.com/hc/en-us/articles/9328402349595
- AmazingRibs-Test (Super Smoke 165–225 °F, Rostmaße): https://amazingribs.com/smoker/traeger-timberline-850-grill-review
- Händler (Hopper 24 lb, Fühler, 3 Roste): https://www.bbqguys.com/i/3054387/traeger/timberline-850-wi-fi-controlled-wood-pellet-grill-2019-tfb85wle ·
  https://www.alternate.de/Traeger/Pelletgrill-Timberline/html/product/100018230 (74–260 °C)

Offen (am Gerät klären): Keep Warm vorhanden? Controller-Anzeige in °C umstellbar? Zweiter Fühler / MEATER vorhanden?
