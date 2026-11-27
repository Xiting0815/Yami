/**
 * „Salate & Beilagen“ für alle Küchen: Schreib-Gruppen zusammenführen (wird in src/data/extra/index.ts eingehängt).
 *
 * Phase 2 – jede Gruppe bearbeitet NUR ihre eigene Datei, nie diese Index-Datei oder zentrale Dateien:
 *
 * | Datei           | Inhalt                                                                         | Bau-Funktion                                    |
 * |-----------------|--------------------------------------------------------------------------------|-------------------------------------------------|
 * | nudelsalate.ts  | Nudelsalate: deutsch, italienisch, spanisch, griechisch …                     | `salat(id, titel, { group: 'nudel', … })`       |
 * | salate.ts       | Kartoffel-, Reis-, Bohnen-, Gemüsesalate, Ensaladilla rusa, Pipirrana …       | `salat(…, { group: 'kartoffel' \| 'reis' \| 'bohnen' \| 'gemuese', … })` |
 *
 * Ein Salat (`salat()` aus src/data/define.ts): Zutaten für `portions` Beilagen-Portionen, `name` = Ergebnis im Vorrat
 * („Nudelsalat (selbstgemacht)“, eindeutig), `shelf` = Tage im Kühlschrank, `cuisine` =
 * Herkunftsküche. Nie im Wischstapel; „Einplanen für“ einen Tag ist ein ZUSATZ zum Abendessen (Grillabend, Gäste, Mitbringsel),
 * „Fertig“ legt alle Portionen in den Vorrat, dort zählt „1 Portion gegessen“ in die Tagesbilanz.
 * Die BBQ-Beilagen (src/data/extra/bbq/beilagen.ts) erscheinen im Bereich „🥗 Salate & Beilagen“ automatisch mit.
 *
 * Jede Datei exportiert ein `ExtraGroup` (src/data/extra/types.ts) mit Rezepten, NEUEN Zutaten, deviceSteps und imageQueries.
 * Gemeinsame Spanien-Zutaten: src/data/extra/zutaten-es.ts (nicht neu anlegen). Neue Fotos: scripts/fotos-neu-<datei>.md.
 * Regeln: docs/spanien-regeln.md · Prüfen: npm run check-data, npx vite-node scripts/test-spanien.ts
 */
import type { ExtraGroup } from '../types'
import { nudelsalate } from './nudelsalate'
import { salate } from './salate'

/** Schlüssel = Datei (für Meldungen von check-data) */
export const SALAT_GROUPS: Record<string, ExtraGroup> = {
  'salate/nudelsalate': nudelsalate,
  'salate/salate': salate,
}
