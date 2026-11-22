/**
 * Küchenlogik – Fehlmengen je Tag: Was fehlt für die noch offenen Gerichte, wenn man Tag für Tag vom Vorrat kocht?
 *
 * Simuliert ab heute: Vorrat (nur am Kochtag noch gute Posten, erst die Zutat selbst, dann austauschbare) minus Verbrauch
 * der vorherigen Tage, plus was kommende Einkäufe bis zum Kochtag mitbringen. Gemeldet wird nur, was dann wirklich fehlt
 * (mehr als 5 % des Bedarfs). Gewürze und Mengen-Grundzutaten zählen nicht (die haben „da“/„alle“ bzw. „wird knapp“).
 */
import type { PlanEntry } from '../types'
import { type Need, type PantryLot, needsOf } from './base'
import { consume, lotsFor } from './pantry'
import { entryRecipe } from './swap'

export type UseKind = 'breakfast' | 'dinner' | 'bake'

/** ein offenes Gericht an einem Tag (Frühstück: am Vorbereitungstag) */
export interface ShortUse {
  day: string
  kind: UseKind
  recipeId: string
  servings: number
  swap?: PlanEntry['swap']
}

/** Posten, den ein kommender Einkauf mitbringt (erst ab `from` da) */
export interface IncomingLot extends PantryLot {
  from: string
  /** Einkaufstag */
  trip: string
  /** „Heute noch“-Einkauf (nur mitgezählt, wenn ausdrücklich „noch kaufen“) */
  now?: boolean
}

export interface UseShortage extends ShortUse {
  /** fehlt (Basiseinheit des Produkts) */
  missing: Need[]
  /** kommt mit dem „Heute noch“-Einkauf (nur Hinweis, keine Warnung) */
  coming: { name: string; trip: string }[]
  /** aus dem echten Vorrat genommen, je Bedarf (für „hält das bis zum neuen Tag?“) */
  fromPantry: { name: string; amount: number }[]
}

/** so viel darf fehlen, ohne dass gewarnt wird (Rundungen, Reste) */
export const MISSING_SHARE = 0.05

const KIND_ORDER: Record<UseKind, number> = { breakfast: 0, dinner: 1, bake: 2 }

export function simulateShortages(uses: ShortUse[], pantry: PantryLot[], incoming: IncomingLot[]): UseShortage[] {
  const pool: PantryLot[] = [...pantry.map((l) => ({ ...l })), ...incoming.map((l) => ({ ...l }))]
  const inc = new Map(incoming.map((l) => [l.id, l]))
  const sorted = [...uses].sort((a, b) => a.day.localeCompare(b.day) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
  const out: UseShortage[] = []
  for (const u of sorted) {
    const r = entryRecipe(u)
    if (!r) continue
    const res: UseShortage = { ...u, missing: [], coming: [], fromPantry: [] }
    for (const n of needsOf(r, u.servings)) {
      const taken = consume(pool, n.name, n.amount, u.day)
      let got = 0
      let own = 0
      for (const t of taken) {
        got += t.amount
        const i = inc.get(t.id)
        if (!i) own += t.amount
        else if (i.now && !res.coming.some((c) => c.name === n.name)) res.coming.push({ name: n.name, trip: i.trip })
      }
      if (own > 1e-6) res.fromPantry.push({ name: n.name, amount: own })
      const rest = n.amount - got
      if (rest > 1e-6 && rest > n.amount * MISSING_SHARE) res.missing.push({ name: n.name, amount: rest, unit: n.unit })
    }
    out.push(res)
  }
  return out
}

/** Hält der Vorrat, den ein Gericht am alten Tag genommen hätte, bis zum neuen Tag? (frische Zutaten nicht verderben lassen) */
export function keepsUntil(pantry: PantryLot[], used: { name: string; amount: number }[], day: string): boolean {
  return used.every((u) => lotsFor(pantry, u.name, day).reduce((s, l) => s + l.amount, 0) >= u.amount - 1e-6)
}
