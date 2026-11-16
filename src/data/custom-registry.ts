import type { CustomIngredient, ShopCat } from '../types'
import { CATALOG } from './catalog'
import { NUTRI, GRAMS } from './nutrition'
import { CONVERT, PRODUCTS } from './products'

/** Richtwerte für neue Zutaten je Einkaufslisten-Abschnitt */
export const CAT_DEFAULTS: Record<ShopCat, { kcal: number; protein: number; fiber: number; price: number; shelf: number; fatShare: number }> = {
  gemuese: { kcal: 40, protein: 1.5, fiber: 2.5, price: 1.49, shelf: 7, fatShare: 0.1 },
  konserven: { kcal: 200, protein: 8, fiber: 4, price: 1.49, shelf: 365, fatShare: 0.25 },
  backwaren: { kcal: 250, protein: 8, fiber: 4, price: 1.99, shelf: 5, fatShare: 0.15 },
  molkerei: { kcal: 150, protein: 8, fiber: 0, price: 1.49, shelf: 14, fatShare: 0.6 },
  fleisch: { kcal: 180, protein: 20, fiber: 0, price: 3.49, shelf: 4, fatShare: 0.7 },
  tk: { kcal: 80, protein: 4, fiber: 2.5, price: 1.99, shelf: 365, fatShare: 0.15 },
  vorrat: { kcal: 300, protein: 5, fiber: 2, price: 1.49, shelf: 365, fatShare: 0.3 },
}

let registered = new Set<string>()
let version = 0
let lastList: CustomIngredient[] | null = null

/** ändert sich bei jeder Neuregistrierung (Cache-Schlüssel für den Zutaten-Index) */
export const catalogVersion = () => version

/** Basiseinheit der Packung zu einer Rezepteinheit */
export function baseUnitOf(unit: string): string {
  if (unit === 'kg' || unit === 'g' || unit === 'EL' || unit === 'TL' || unit === 'Prise' || unit === '') return 'g'
  if (unit === 'l' || unit === 'ml') return 'ml'
  return unit
}

/** Zutaten zur Laufzeit in Katalog, Produkte und Nährwerte eintragen (ersetzt die zuvor eingetragenen) */
export function registerCustomIngredients(list: CustomIngredient[]): void {
  if (list === lastList) return
  lastList = list
  version++
  for (const n of registered) {
    delete CATALOG[n]
    delete PRODUCTS[n]
    delete NUTRI[n]
    delete GRAMS[n]
    delete CONVERT[n]
  }
  registered = new Set()
  for (const c of list) {
    if (CATALOG[c.name]) continue // Katalog hat Vorrang
    const d = CAT_DEFAULTS[c.cat]
    CATALOG[c.name] = c.cat
    const fatKcal = Math.max(0, c.kcal - c.protein * 4) * d.fatShare
    const carbKcal = Math.max(0, c.kcal - c.protein * 4 - fatKcal)
    NUTRI[c.name] = [c.kcal, c.protein, Math.round((fatKcal / 9) * 10) / 10, Math.round((carbKcal / 4) * 10) / 10, d.fiber]
    GRAMS[c.name] = c.gramsPerPiece ? { Stk: c.gramsPerPiece } : {}
    if (c.cat !== 'vorrat') {
      const pack = c.unit === 'g' ? (c.cat === 'fleisch' ? 400 : 250) : c.unit === 'ml' ? 500 : 1
      PRODUCTS[c.name] = { pack, unit: c.unit, price: d.price, shelf: d.shelf }
      // Stückware: Gramm in Stück umrechnen können
      if (c.unit === 'Stk' && c.gramsPerPiece) CONVERT[c.name] = { g: 1 / c.gramsPerPiece, kg: 1000 / c.gramsPerPiece }
    }
    registered.add(c.name)
  }
}
