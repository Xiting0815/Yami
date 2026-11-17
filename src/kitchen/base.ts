/** Küchenlogik – Grundlagen: Typen, Produkte & Einheiten, Bedarf eines Rezepts, Kosten. */
import { CATALOG, SHOP_ALIAS } from '../data/catalog'
import { CONVERT, PRODUCTS, type Product } from '../data/products'
import { inSeason } from '../data/season'
import type { Recipe } from '../types'
import { defaultAmount, isQtyStaple } from '../staples'

export interface PantryLot {
  id: string
  name: string
  amount: number
  unit: string
  /** ISO-Datum, bis wann es gut ist */
  expires: string
}

/** weggeworfener Vorratsposten (für den Wochenrückblick und leichtes Lernen) */
export interface WastedItem {
  name: string
  amount: number
  unit: string
  /** ISO-Datum, an dem es als weggeworfen erfasst wurde */
  date: string
  /** geschätzter Wert in € */
  value: number
}

export const WASTED_MAX = 300
/** so viele Tage nach Ablauf gilt ein Posten ohne Aktion als weggeworfen */
export const WASTE_AFTER_DAYS = 7

export type PriceOverrides = Record<string, { pack: number; price: number }>

/** gekaufte Mengen je Woche: Zutat → angelegter Vorratsposten */
export type BoughtMap = Record<string, { lotId: string; amount: number }>

// ───────────── Hilfen ─────────────

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function addDaysIso(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const x = new Date(y, m - 1, d + n)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

export function daysUntil(iso: string, today: string): number {
  const a = new Date(today + 'T00:00:00').getTime()
  const b = new Date(iso + 'T00:00:00').getTime()
  return Math.round((b - a) / 86400000)
}

export const minIso = (a: string, b: string) => (a < b ? a : b)

export function canonical(name: string): string {
  return SHOP_ALIAS[name] ?? name
}

/**
 * Produkt mit aktuellem Preis. Mit `month`: außerhalb der Saison ×1,3, in Saison ×0,85
 * (nur für Zutaten mit Saisondaten).
 */
export function productFor(name: string, overrides?: PriceOverrides, month?: number): Product | undefined {
  const base = PRODUCTS[name]
  if (!base) return undefined
  const o = overrides?.[name]
  const p = o ? { ...base, pack: o.pack, price: o.price } : base
  // selbst eingetragene Preise gelten wie eingegeben – kein Saisonfaktor
  const inSeas = month != null && !o ? inSeason(name, month) : undefined
  if (inSeas === undefined) return p
  return { ...p, price: Math.round(p.price * (inSeas ? 0.85 : 1.3) * 100) / 100 }
}

export function isTracked(name: string): boolean {
  return CATALOG[name] !== 'vorrat' && !!PRODUCTS[name]
}

const GENERIC: Record<string, Record<string, number>> = {
  kg: { g: 1000 },
  l: { ml: 1000 },
  EL: { g: 15, ml: 15, TL: 3 },
  TL: { g: 5, ml: 5, EL: 1 / 3 },
}

/** Rezeptmenge in die Basiseinheit des Produkts umrechnen */
export function toBase(name: string, amount: number, unit: string, prod: Product): number | null {
  if (unit === prod.unit) return amount
  const specific = CONVERT[name]?.[unit]
  if (specific != null) return amount * specific
  const g = GENERIC[unit]?.[prod.unit]
  if (g != null) return amount * g
  return null
}

export interface Need {
  name: string
  amount: number
  unit: string
}

/** Zutatenbedarf eines Rezepts (nur mengenmäßig geführte Zutaten) */
export function needsOf(recipe: Recipe, servings: number): Need[] {
  const out = new Map<string, Need>()
  for (const ing of recipe.ingredients) {
    if (ing.amount == null) continue
    const name = canonical(ing.name)
    if (!isTracked(name)) continue
    const prod = PRODUCTS[name]
    const v = toBase(name, (ing.amount * servings) / recipe.servings, ing.unit, prod)
    if (v == null) continue
    const cur = out.get(name)
    if (cur) cur.amount += v
    else out.set(name, { name, amount: v, unit: prod.unit })
  }
  return [...out.values()]
}

/**
 * Bedarf an Mengen-Grundzutaten (Öl, Brühe, Mehl, Saucen …). Zeilen ohne Menge ziehen eine kleine Standardmenge ab
 * (z. B. 15 ml Öl) – nur fürs Abziehen und die Vorratsplanung, nicht für Kosten und Empfehlungen.
 */
export function stapleNeedsOf(recipe: Recipe, servings: number): Need[] {
  const out = new Map<string, Need>()
  for (const ing of recipe.ingredients) {
    const name = canonical(ing.name)
    if (!isQtyStaple(name)) continue
    const prod = PRODUCTS[name]
    if (!prod) continue
    const v = ing.amount == null ? defaultAmount(name) : toBase(name, (ing.amount * servings) / recipe.servings, ing.unit, prod)
    if (v == null || v <= 0) continue
    const cur = out.get(name)
    if (cur) cur.amount += v
    else out.set(name, { name, amount: v, unit: prod.unit })
  }
  return [...out.values()]
}

/** alles, was ein Gericht aus dem Vorrat zieht: normale Zutaten und Mengen-Grundzutaten */
export function allNeedsOf(recipe: Recipe, servings: number): Need[] {
  return [...needsOf(recipe, servings), ...stapleNeedsOf(recipe, servings)]
}

/** Warenwert eines Gerichts (anteilig, ohne Gewürze und Grundzutaten) */
export function recipeCost(recipe: Recipe, servings: number, overrides?: PriceOverrides): number {
  let sum = 0
  for (const n of needsOf(recipe, servings)) {
    const prod = productFor(n.name, overrides)!
    sum += (n.amount / prod.pack) * prod.price
  }
  return sum
}

export function formatEuro(v: number): string {
  return v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
