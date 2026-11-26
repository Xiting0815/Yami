# Paellapfanne und Plancha – Gerätedaten für Yami

Für die spanische Küche (Paella, Arroces, Tapas). Hitzequellen sind Geräte, die es schon gibt: **BORA X Pure**
(Induktion, Stufen 1–9/Power, zwei Zonen per „Brücke“ koppelbar) und der **Aldi-4-Brenner-Gasgrill** (`gasgrill`,
siehe `grill-dutch.md`). Nichts verwenden, was hier nicht steht. Regeln fürs Kochen: `docs/spanien-regeln.md`.

## Paellapfanne (`device: 'paella'`, Chip „Paellapfanne 32 cm · …“)

Zwei Pfannen beim Nutzer (Stahl/emailliert, flach, zwei Griffe):

| Größe (`pan`) | Portionen | Hitzequelle (`on`) | `level` | `burners` |
|---|---|---|---|---|
| `'32'` (32 cm) | 2–3 | BORA X Pure, **beide Zonen mit der Brücke gekoppelt** (`bora`) | BORA-Stufe `'1'`–`'9'`, `'Power'` | – |
| `'46'` (46 cm) | 6–8 | Gasgrill, **Deckel offen**, Pfanne direkt auf dem Rost (`gasgrill`) | Flamme `niedrig`/`mittel`/`hoch` | Standard `alle`, sonst Muster z. B. `2+3` |

| `mode` | wofür | `minutes` | typische Stufe 32 cm / Flamme 46 cm |
|---|---|---|---|
| `Vorheizen` | Pfanne mit Öl heiß werden lassen | 1–15 | 6–7 / mittel |
| `Anbraten` | Fleisch/Meeresfrüchte langsam rundum bräunen | 1–30 | 6 / mittel |
| `Sofrito` | Gemüse, geriebene Tomate, Pimentón | 1–30 | 4–5 / mittel–niedrig |
| `Köcheln` | Brühe auskochen; nach der Reiszugabe: erst stark, dann schwach – **nicht mehr rühren** | 1–40 | 8 → 4 / hoch → niedrig |
| `Socarrat` | zum Schluss die Kruste am Boden rösten (leises Knistern) | 1–5 | 9 / hoch |
| `Ruhen` | vom Feuer, mit Tuch abgedeckt | 1–15 | – (keine Stufe) |

- Baustein `paella(pan, mode, { level, burners, minutes, note, alt })` (src/data/device-helpers.ts).
  Chips: „Paellapfanne 32 cm · BORA Brücke · Köcheln · Stufe 6 · 10 Min.“,
  „Paellapfanne 46 cm · Gasgrill · Köcheln · Brenner alle mittel · 10 Min.“.
- **Keine Temperatur** (`temp` ist Fehler) – nur Stufe bzw. Flamme + Dauer.
- **32 cm auf dem BORA:** Die Pfanne ist größer als eine Zone → Brücke (beide Zonen gekoppelt) einschalten, sonst gart nur
  die Mitte. Der Rand bleibt trotzdem kühler: beim Köcheln die Pfanne alle 3–4 Minuten eine Vierteldrehung weiterdrehen.
  Emaillierte/Stahl-Pfanne muss induktionsfähig sein (Magnet-Test) und plan aufliegen.
- **46 cm auf dem Gasgrill:** Grill mit geschlossenem Deckel 10 Minuten vorheizen (`gasgrill('Vorheizen', 260, 'hoch', 'alle', { minutes: 10 })`),
  dann **Deckel offen** lassen (die Paella soll verdampfen, nicht schmoren). Alle 4 Brenner unter der Pfanne;
  für gleichmäßige Hitze die Pfanne alle 2–3 Minuten eine Vierteldrehung drehen. Brenner-Muster: Socarrat `alle hoch`,
  nach der Reiszugabe ggf. `2+3` (Mitte) niedrig, wenn der Rand schon fertig ist. Bei Wind Windschutz stellen.
- **Große Pfanne als „oder …“:** In Rezepten für 2 Personen steht die 32-cm-Pfanne als Haupteinstellung, die 46-cm-Pfanne
  (Gäste, Mengen ×3) als `alt: true` daneben – davor `{ ...gasgrill('Vorheizen', …), alt: true }`.
- Flüssigkeitsmengen (Paella valenciana, Bomba-Reis, Richtwert): 32 cm ca. 140–160 g Reis + 650–750 ml Wasser/Brühe;
  46 cm ca. 450–500 g Reis + 2–2,3 l. Füllhöhe bis knapp unter die Nieten der Griffe.

## Plancha / Gusseisenpfanne (`device: 'plancha'`, Chip „Plancha · …“)

Gusseisen-Grillplatte bzw. schwere Gusseisenpfanne für Gambas a la plancha, Pimientos de Padrón, Pulpo, Pinchos,
Calamares a la plancha. Auf dem BORA oder dem Gasgrill (Platte auf dem Rost).

| `on` | `mode` | `level` | `temp` (Oberfläche, optional) | `minutes` | `burners` |
|---|---|---|---|---|---|
| `'bora'` | `Vorheizen` / `Braten` | BORA-Stufe `'1'`–`'9'`, `'Power'` | 150–350 °C | 1–20 / 1–30 | – |
| `'gasgrill'` | `Vorheizen` / `Braten` | Flamme | 150–350 °C | 1–20 / 1–30 | Standard `alle` |

- Baustein `plancha(on, mode, { level, temp, burners, minutes, note, alt })`. Chip: „Plancha · Gasgrill · Braten 280 °C · Brenner alle hoch · 3 Min.“.
- `temp` = gemessen mit dem **Infrarot-Thermometer** auf der Oberfläche; wenn der Text eine Temperatur nennt, muss sie
  als `temp` eingestellt sein (check-data). Gusseisen 4–5 Minuten (BORA Stufe 8) bzw. 10 Minuten (Gasgrill, Deckel zu)
  vorheizen; zum Braten ohne bzw. mit sehr wenig Öl, grobes Salz („sal gorda“) erst zum Schluss.
- Eine Plancha auf dem Gasgrill/BORA, die nur mit `gasgrill()` bzw. `bora()` beschrieben ist (ältere Burger-Rezepte), bleibt gültig.

## Prüfregeln (`scripts/device-text-rules.ts`, läuft in `npm run check-data`)

- Text nennt „Paellapfanne“ → der Schritt braucht eine `paella()`-Einstellung (wenn er Einstellungen hat).
- Text nennt „32 cm“/„46 cm“ → eine Paella-Einstellung mit dieser Größe.
- `paella('46', …)` (Gasgrill) und Text „Deckel zu/geschlossen“ → Fehler (Ausnahme: Schritt mit Gasgrill-Vorheizen).
- `Köcheln`/`Socarrat` und Text „rühren/umrühren“ → Fehler, außer „nicht (mehr) rühren“, „ohne zu rühren“.
- Plancha-Temperatur im Text = `temp`; Minuten wie bei allen Geräten.

Quellen: Herstellerangaben BORA X Pure (Brückenfunktion), Wikipaella „Paella valenciana: ingredientes y recetas“
(wikipaella.org), D.O. Arroz de Valencia (arrozdevalencia.org), Erfahrungswerte Paella auf Gasbrenner/Grill.
