/**
 * BBQ-Sparte: alle Schreib-Gruppen zusammenführen (wird in src/data/extra/index.ts eingehängt).
 *
 * Phase 2 – jede Gruppe bearbeitet NUR ihre eigene Datei, nie diese Index-Datei oder zentrale Dateien:
 *
 * | Datei            | Inhalt                                                          | Bau-Funktion                                  |
 * |------------------|-----------------------------------------------------------------|-----------------------------------------------|
 * | bbq-smoker.ts    | Traeger: Pulled Pork, Ribs, Brisket, Burnt Ends, Chicken …      | `bbq(id, titel, { group: 'smoker', … })`      |
 * | bbq-grill.ts     | Gasgrill: Steaks, Spieße, Beer Can Chicken, Reverse Sear …      | `bbq(…, { group: 'grill', … })`               |
 * | dutch.ts         | Dutch Oven auf Gas: Chili, Schmorgerichte, Cobbler …           | `bbq(…, { group: 'dutch', … })`               |
 * | burger.ts        | Burger (Gasgrill, Plancha, Pulled-Pork-Burger …)               | `bbq(…, { group: 'burger', … })`              |
 * | beilagen.ts      | Pit Beans, Coleslaw, Cornbread, Mac & Cheese, Grillmais …      | `bbq(…, { group: 'beilage', … })`             |
 * | rubs-saucen.ts   | Rubs & Saucen als Grundrezepte (ergeben Vorrat)                | `backen('grundrezept', …, { cuisine: 'us', bbq: 'rub', yields: { …, cat } })` |
 *
 * Jede Datei exportiert ein `ExtraGroup` (src/data/extra/types.ts):
 *   recipes       – Rezepte (Zutaten = ganze Ladung, `portions` = Portionen der Ladung, `eat` = am Grilltag gegessen, Standard 2)
 *   catalog       – NEUE Zutaten je Abschnitt (gemuese, konserven, backwaren, molkerei, fleisch, tk, vorrat) – vorher in
 *                   src/data/catalog.ts und den anderen Gruppen-Dateien suchen, nichts doppelt anlegen (check-data meldet es)
 *   products      – je neuer Zutat `prod(packung, einheit, preis €, tage haltbar, angebrochen, packungsname)`
 *   nutrition     – je neuer Zutat [kcal, Eiweiß, Fett, KH, Ballaststoffe] pro 100 g/ml
 *   grams         – Gramm je Einheit (Pflicht für Stk/Pck/EL/TL/Scheibe … neuer Zutaten), `convert` wenn Rezept- ≠ Packungseinheit
 *   spices        – neue Gewürze (nur „da/alle“ im Vorrat), zusätzlich in catalog.vorrat/products/nutrition/grams
 *   substitutes   – Austausch: `groups` (gleiche Vorratseinheit!) + `preferred` (Selbstgemachtes/Vakuum-Reste zuerst)
 *   nonVeg        – nicht-vegetarische Zutaten außerhalb „fleisch“ (Ergebnisse aus Fleisch-Rezepten erkennt Yami selbst)
 *   deviceSteps   – Geräte-Schritte je Rezept-ID (Pflicht für smoker/grill/dutch/burger; Bausteine `traeger()`, `gasgrill()`,
 *                   `dutch()`, `vakuum()`, `bora()`, `vzug()` aus src/data/device-helpers.ts)
 *   imageQueries  – englischer Suchbegriff fürs Foto je Rezept-ID; neue IDs zusätzlich in scripts/fotos-fehlen.txt und
 *                   scripts/gemini-fehlen.md (Zeile „| id | Bildbeschreibung |“) eintragen
 *
 * Große Stücke (Pulled Pork, Ribs, Brisket, Burnt Ends): `leftover: { name: '… (vakuumiert)', amount, unit: 'g', portion: 250, shelf: 90 }`
 * → Katalog Tiefkühl, Produkt und Nährwerte entstehen automatisch. Damit Resteessen (Küche „Amerikanisch“, src/data/recipes-us.ts)
 * den Vorrat zuerst nehmen: kaufbares Gegenstück als Zutat anlegen (z. B. 'Pulled Pork') und
 * `substitutes: { groups: { 'pulled-pork': ['Pulled Pork', 'Pulled Pork (vakuumiert)'] }, preferred: { 'Pulled Pork': ['Pulled Pork (vakuumiert)'] } }`.
 *
 * Regeln: docs/bbq-regeln.md · Geräte: docs/geraete/traeger.md, docs/geraete/grill-dutch.md · Prüfen: npm run check-data,
 * npx vite-node scripts/test-bbq.ts
 */
import type { ExtraGroup } from '../types'
import { bbqSmoker } from './bbq-smoker'
import { bbqGrill } from './bbq-grill'
import { dutchOven } from './dutch'
import { burger } from './burger'
import { beilagen } from './beilagen'
import { rubsSaucen } from './rubs-saucen'

/** Schlüssel = Datei (für Meldungen von check-data) */
export const BBQ_GROUPS: Record<string, ExtraGroup> = {
  'bbq/bbq-smoker': bbqSmoker,
  'bbq/bbq-grill': bbqGrill,
  'bbq/dutch': dutchOven,
  'bbq/burger': burger,
  'bbq/beilagen': beilagen,
  'bbq/rubs-saucen': rubsSaucen,
}
