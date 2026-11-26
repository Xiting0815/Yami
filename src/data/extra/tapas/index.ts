/**
 * Tapas-Sparte: alle Schreib-Gruppen zusammenführen (wird in src/data/extra/index.ts eingehängt).
 *
 * Phase 2 – jede Gruppe bearbeitet NUR ihre eigene Datei, nie diese Index-Datei oder zentrale Dateien:
 *
 * | Datei             | Inhalt                                                                  | Bau-Funktion                                         |
 * |-------------------|-------------------------------------------------------------------------|------------------------------------------------------|
 * | tapas-fisch.ts    | Gambas al ajillo/a la plancha, Pulpo a la gallega, Boquerones, Calamares | `tapa(id, titel, { group: 'fisch', time, serve })`   |
 * | tapas-fleisch.ts  | Pinchos morunos, Albóndigas, Chorizo a la sidra, Croquetas de jamón      | `tapa(…, { group: 'fleisch', … })`                   |
 * | tapas-gemuese.ts  | Gemüse (Padrón …), Ei & Kartoffel (Tortilla, Bravas), Brot & Dips        | `tapa(…, { group: 'gemuese' \| 'ei' \| 'brot', … })` |
 * | saucen.ts         | Alioli, Salsa brava, Romesco, Mojo rojo/verde als Grundrezepte (Vorrat)  | `backen('grundrezept', …, { cuisine: 'es', tapas: 'sauce', yields: { …, cat: 'konserven' } })` |
 *
 * Eine Tapa (`tapa()` aus src/data/define.ts):
 *   Zutaten   = EIN Teller für 2 Personen als eine von ca. 5 Tapas eines Abends (TAPAS_STD); Yami skaliert sie beim Einplanen
 *               (4 Tapas → je ×1,25, 6 Tapas → je ×0,83). Ziel ca. 120–200 kcal je Person und Tapa (Abend gesamt ≈ 600–900 kcal).
 *   serve     = 'kalt' | 'lauwarm' | 'heiss' – ordnet den gemeinsamen Ablaufplan im Kochmodus „Tapas-Abend“
 *               (Vorher → kalt anrichten → lauwarm → heiß ganz zuletzt, z. B. Gambas).
 *   ahead     = ein Satz, was sich vorher erledigen lässt (Marinade am Vortag, Pulpo vorkochen, Alioli am Vortag …).
 *   Titel     = spanische Schreibweise mit deutscher Erklärung: 'Gambas al ajillo (Knoblauchgarnelen in Olivenöl)'.
 *
 * Jede Datei exportiert ein `ExtraGroup` (src/data/extra/types.ts): recipes, NEUE Zutaten (catalog/products/nutrition/grams/
 * convert/spices/substitutes/nonVeg), deviceSteps (BORA, Plancha `plancha()`, Paellapfanne `paella()`, Gasgrill, CombiSteamer …
 * aus src/data/device-helpers.ts) und imageQueries (englischer Suchbegriff). Gemeinsame Spanien-Zutaten (Chorizo, Serrano-
 * Schinken, Manchego, Oliven grün, Piquillo-Paprika, Pimientos de Padrón, Pulpo gekocht, Sherry …) stehen in
 * src/data/extra/zutaten-es.ts und werden NICHT neu angelegt. Neue Fotos: je Gruppe scripts/fotos-neu-<datei>.md („| id | Bildbeschreibung |“).
 *
 * Regeln: docs/spanien-regeln.md · Geräte: docs/geraete/paella-plancha.md · Prüfen: npm run check-data,
 * npx vite-node scripts/test-spanien.ts
 */
import type { ExtraGroup } from '../types'
import { tapasFisch } from './tapas-fisch'
import { tapasFleisch } from './tapas-fleisch'
import { tapasGemuese } from './tapas-gemuese'
import { saucen } from './saucen'

/** Schlüssel = Datei (für Meldungen von check-data) */
export const TAPAS_GROUPS: Record<string, ExtraGroup> = {
  'tapas/tapas-fisch': tapasFisch,
  'tapas/tapas-fleisch': tapasFleisch,
  'tapas/tapas-gemuese': tapasGemuese,
  'tapas/saucen': saucen,
}
