/**
 * Küchenlogik – Notlösung für ein Gericht („Schmand statt Sahne“, siehe STAND_INS in substitutes.ts).
 *
 * Ein Plan-Eintrag kann `swap` tragen (Zutat → Ersatz). Alles, was den Bedarf eines geplanten Gerichts rechnet
 * (Wochenplanung, Einkäufe, Abziehen beim Kochen, Kalender), nimmt dann `entryRecipe(e)` statt des Originalrezepts:
 * dieselben Zeilen, nur die getauschte Zutat heißt anders und ist in die Einheit des Ersatz-Produkts umgerechnet.
 */
import { PRODUCTS } from '../data/products'
import { RECIPE_BY_ID } from '../data/recipes'
import { gramsOf } from '../data/nutrition-calc'
import type { PlanEntry, Recipe } from '../types'
import { canonical, toBase } from './base'

const MASS = new Set(['g', 'ml'])

/** Menge von `from` (Basiseinheit seines Produkts) in die Basiseinheit von `to` umrechnen; null = geht nicht */
export function convertAmount(from: string, amount: number, to: string): number | null {
  const a = PRODUCTS[from]
  const b = PRODUCTS[to]
  if (!a || !b) return null
  if (a.unit === b.unit) return amount
  // g ↔ ml: für Milchprodukte & Co. reicht 1:1
  if (MASS.has(a.unit) && MASS.has(b.unit)) return amount
  const grams = MASS.has(a.unit) ? amount : gramsOf(from, amount, a.unit)
  if (grams == null) return null
  if (MASS.has(b.unit)) return grams
  const per = gramsOf(to, 1, b.unit)
  return per && per > 0 ? grams / per : null
}

const cache = new Map<string, Recipe>()

/** Rezept eines Plan-Eintrags mit angenommenem Ersatz (ohne `swap`: das Originalrezept) */
export function entryRecipe(e: Pick<PlanEntry, 'recipeId' | 'swap'>): Recipe {
  const r = RECIPE_BY_ID[e.recipeId]
  const swap = e.swap
  if (!r || !swap || !Object.keys(swap).length) return r
  const key = `${r.id}|${Object.entries(swap).sort().map(([a, b]) => `${a}>${b}`).join(',')}`
  const hit = cache.get(key)
  if (hit && hit.ingredients.length === r.ingredients.length) return hit
  const ingredients = r.ingredients.map((ing) => {
    const name = canonical(ing.name)
    const sub = swap[name]
    const prod = PRODUCTS[name]
    const subProd = sub ? PRODUCTS[sub] : undefined
    if (!sub || !prod || !subProd) return ing
    if (ing.amount == null) return { ...ing, name: sub }
    const base = toBase(name, ing.amount, ing.unit, prod)
    const v = base == null ? null : convertAmount(name, base, sub)
    return v == null ? ing : { name: sub, amount: v, unit: subProd.unit }
  })
  const out: Recipe = { ...r, ingredients }
  cache.set(key, out)
  return out
}

/** „Schmand statt Sahne“ */
export function swapText(swap: Record<string, string> | undefined): string {
  return Object.entries(swap ?? {}).map(([a, b]) => `${b} statt ${a}`).join(', ')
}
