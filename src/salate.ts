/**
 * „Salate & Beilagen“ für alle Küchen: eigener Bereich im Rezepte-Tab (nicht im Wischstapel). Eingeplant wird über den
 * Backplan als ZUSATZ zum Abendessen (ersetzt nichts), „Fertig“ legt die Portionen in den Vorrat (Kühlschrank), dort zählt
 * „1 Portion gegessen“ (zählt fürs Lernen). Lernen wie Backen (gemacht, gegessen, bewertet; Muster „salat:nudel“).
 * Die BBQ-Beilagen (src/data/extra/bbq/beilagen.ts) erscheinen hier mit (Chip „🔥 BBQ-Beilagen“).
 */
import { BASICS } from './data/recipes'
import type { Recipe, SalatGroup } from './types'
import { isBbq, isSalat } from './types'

/** Salate aller Küchen und die BBQ-Beilagen; Gruppe 'bbq' = nur die BBQ-Beilagen */
export const salatSection = (group?: SalatGroup | 'bbq'): Recipe[] =>
  BASICS.filter((r) => (isSalat(r) || (isBbq(r) && r.bbq === 'beilage')) && (!group || (group === 'bbq' ? isBbq(r) : r.salat === group)))
