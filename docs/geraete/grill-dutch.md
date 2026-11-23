# Gasgrill, Dutch Oven und Vakuumierer – Gerätedaten für Yami

Modelle sind teils unbekannt → **generische, vorsichtige Werte**. Nichts verwenden, was hier nicht steht.

## Gasgrill (`device: 'gasgrill'`, Chip „Gasgrill · …“)

Einfacher **4-Brenner-Gasgrill von Aldi** (Enders-/Grillmeister-Klasse): Deckel mit Deckelthermometer, keine Sear-Zone,
kein Infrarot, Seitenbrenner nicht voraussetzen. Brenner von links nach rechts 1–4.

| `mode` | `temp` (°C, Deckelthermometer) | `level` (Flamme) | `burners` | `minutes` | `core` |
|---|---|---|---|---|---|
| `Vorheizen` | 150–320 | meist `hoch` | `alle` | 5–20 | – |
| `Direkt` | 150–320 | `niedrig`/`mittel`/`hoch` | `alle` oder z. B. `1+2` | 1–120 | 40–98 |
| `Indirekt` | 90–260 | `niedrig`/`mittel`/`hoch` | **Pflicht, mind. ein Brenner aus**, z. B. `1+4` | 1–600 | 40–98 |

- **Zonen über die Brenner:** direkt = „alle 4 hoch“; indirekt = „Brenner 1+4 mittel, Mitte aus, Deckel zu“ (Grillgut in
  die Mitte); Zwei-Zonen = „Brenner 1+2 hoch, 3+4 aus“ (scharf angrillen, dann rüberziehen).
- Baustein `gasgrill(mode, temp, level, burners, { minutes, core, note })` (src/data/device-helpers.ts). Chip:
  „Gasgrill · Indirekt 160 °C · Brenner 1+4 mittel · 90 Min. · Kern 72 °C“.
- **Deckelthermometer ist nur ein Richtwert:** es misst oben unter dem Deckel, oft 10–30 °C daneben, und reagiert träge.
  Der Text sagt das bei Indirekt-Garen einmal („… die Kerntemperatur entscheidet“). Gar ist, was das
  **Einstich-/Funkthermometer** im Kern zeigt (`core`).
- Vorheizen immer mit geschlossenem Deckel, 10 Minuten, danach Rost bürsten. Bei Wind/Kälte länger.
- Typische Werte: Steak direkt hoch 2–4 Min. je Seite, dann indirekt bis Kern; Burger direkt hoch 3 Min. je Seite;
  Hähnchen ganz/Beer Can indirekt 180 °C 75–90 Min.; Reverse Sear indirekt 110–120 °C bis Kern −8 °C, dann direkt hoch.
- Dutch Oven „backen“ (Cobbler, Brot): Dutch Oven auf den Rost über die ausgeschalteten Brenner, **Indirekt mit Deckel zu**
  (Hitze kommt von oben und von der Seite); Ausweichweg Combair (`alt: true`, z. B. Ober-/Unterhitze 180 °C).

## Dutch Oven (`device: 'dutch'`, Chip „Dutch Oven · …“)

Gusseisen-Topf, Modell/Größe unbekannt; befeuert mit **Gas** (Hockerkocher oder Brenner des Gasgrills).

| `mode` | `level` (Flamme) | `minutes` | `core` | Notiz |
|---|---|---|---|---|
| `Anbraten` | `hoch` (scharf) / `mittel` (Zwiebeln, Gewürze) | 1–600 | – | „ohne Deckel“, „Hockerkocher“ |
| `Schmoren` | meist `niedrig` | 1–600 | 40–98 | „Deckel zu“ |
| `Köcheln` | `niedrig`/`mittel` | 1–600 | – | „ohne Deckel“ zum Einkochen |

- **Keine Temperatur** (Gasflamme hat keine Skala) – nur Flamme + Dauer; Kern optional mit Thermometer.
- Größe als Richtwert in der Notiz: ft3 ≈ 3 l (2–3 Personen), **ft6 ≈ 4,5–5,5 l (Standard für 2 Personen + Reste)**, ft9 ≈ 8 l.
- Gusseisen speichert Hitze: Flamme eher eine Stufe niedriger, Boden regelmäßig prüfen (setzt an). Vorheizen 5 Min.
- Briketts (klassisch „8 unten / 16 oben“) nur als optionale Alternative erwähnen, nicht als Einstellung.
- Oberhitze/Backen im Dutch: siehe Gasgrill indirekt bzw. Combair.

## Vakuumierer (`device: 'vakuum'`, Chip „Vakuumierer · …“)

Modell offen. Betriebsarten (generisch, gängige Balken-Vakuumierer): `Vakuumieren`, `Vakuumieren feucht`
(Marinade, Bratensaft im Beutel), `Verschweißen` (nur Naht, z. B. Beutel von der Rolle). Keine Temperatur/Dauer.

- Einsatz: Reste portionsweise einfrieren (Notiz „6 Beutel à 250 g“), Marinieren im Beutel, Beutel für **Sous-vide im
  V-ZUG CombiSteamer** (`steamer`, Betriebsart **`Vacuisine`**, 30–95 °C, bis 72 Std., Kern nicht einstellbar).
- Flüssiges vorher kalt stellen oder anfrieren; feuchte Naht = Modus „feucht“; 3 cm Rand lassen.
- Aufwärmen vakuumierter Reste: aufgetaut im CombiSteamer Vacuisine 60–75 °C, 20–45 Min. (Pulled Pork 70 °C · 30 Min.).

## Quellen

- Deckelthermometer-Abweichung / Zwei-Zonen-Grillen: https://amazingribs.com/more-technique-and-science/more-cooking-science/understanding-and-beating-barbecue-stall/
- V-ZUG Vacuisine-Bereich: docs/geraete/vzug.md (aus den Anleitungen).
- Dutch-Oven-Größen (ft-Bezeichnungen, Petromax-Nomenklatur): Herstellerangaben Petromax ft3/ft6/ft9.
