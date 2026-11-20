/**
 * Küchenlogik: Vorrat, Einkaufsplanung nach Packungsgrößen, Kosten und Empfehlungen.
 *
 * Mengen werden je Zutat in der Basiseinheit ihres Produkts geführt (z. B. Sahne in ml,
 * Zwiebel in Stk). Grundzutaten (Kategorie "vorrat") sind zweierlei: Mengen-Grundzutaten (Öl, Brühe, Mehl …)
 * werden wie jede Zutat geführt, aber erst, wenn du sie im Vorrat hast; Gewürze haben nur „da“ / „alle“.
 * Siehe staples.ts.
 */
export * from './base'
export * from './pantry'
export * from './planWeek'
export * from './trips'
export * from './insight'
