/**
 * Küchenlogik: Vorrat, Einkaufsplanung nach Packungsgrößen, Kosten und Empfehlungen.
 *
 * Mengen werden je Zutat in der Basiseinheit ihres Produkts geführt (z. B. Sahne in ml,
 * Zwiebel in Stk). Gewürze & Grundzutaten (Kategorie "vorrat") werden nicht mengenmäßig geführt.
 */
import { CATALOG, SHOP_ALIAS } from './data/catalog'
import { CONVERT, PRODUCTS, type Product } from './data/products'
import { RECIPE_BY_ID } from './data/recipes'
import type { PlanEntry, Recipe, ShopCat, WeekPlan } from './types'

export interface PantryLot {
  id: string
  name: string
  amount: number
  unit: string
  /** ISO-Datum, bis wann es gut ist */
  expires: string
}

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

const minIso = (a: string, b: string) => (a < b ? a : b)

export function canonical(name: string): string {
  return SHOP_ALIAS[name] ?? name
}

export function productFor(name: string, overrides?: PriceOverrides): Product | undefined {
  const base = PRODUCTS[name]
  if (!base) return undefined
  const o = overrides?.[name]
  return o ? { ...base, pack: o.pack, price: o.price } : base
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

/** Warenwert eines Gerichts (anteilig, ohne Gewürze) */
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

// ───────────── Vorrat ─────────────

export function pantryAmount(lots: PantryLot[], name: string): number {
  return lots.filter((l) => l.name === name).reduce((s, l) => s + l.amount, 0)
}

/**
 * Menge nach FIFO (frühestes Ablaufdatum zuerst) entnehmen. Angebrochene Posten bekommen
 * die kürzere "angebrochen"-Haltbarkeit. Gibt die entnommenen Teilmengen zurück.
 */
export function consume(lots: PantryLot[], name: string, amount: number, date: string): PantryLot[] {
  const prod = PRODUCTS[name]
  const taken: PantryLot[] = []
  let rest = amount
  const mine = lots.filter((l) => l.name === name).sort((a, b) => a.expires.localeCompare(b.expires))
  for (const lot of mine) {
    if (rest <= 1e-9) break
    const t = Math.min(lot.amount, rest)
    lot.amount -= t
    rest -= t
    taken.push({ ...lot, amount: t })
    if (lot.amount > 1e-6 && prod?.opened != null) lot.expires = minIso(lot.expires, addDaysIso(date, prod.opened))
  }
  for (let i = lots.length - 1; i >= 0; i--) if (lots[i].amount <= 1e-6) lots.splice(i, 1)
  return taken
}

/** Gekochte Gerichte (Tage vor heute) automatisch vom Vorrat abziehen */
export function cookDue(plan: WeekPlan, pantry: PantryLot[], today: string): { plan: WeekPlan; pantry: PantryLot[]; changed: boolean } {
  const due = Object.keys(plan)
    .filter((d) => d < today && plan[d] && !plan[d]!.status)
    .sort()
  if (!due.length) return { plan, pantry, changed: false }
  const lots = pantry.map((l) => ({ ...l }))
  const next = { ...plan }
  for (const day of due) {
    const entry = next[day]!
    const recipe = RECIPE_BY_ID[entry.recipeId]
    const consumed: PantryLot[] = []
    if (recipe) for (const n of needsOf(recipe, entry.servings)) consumed.push(...consume(lots, n.name, n.amount, day))
    next[day] = { ...entry, status: 'cooked', consumed }
  }
  return { plan: next, pantry: lots, changed: true }
}

/** "Nicht gekocht": entnommene Mengen zurück in den Vorrat */
export function uncook(entry: PlanEntry, pantry: PantryLot[]): PantryLot[] {
  const lots = pantry.map((l) => ({ ...l }))
  for (const c of entry.consumed ?? []) {
    const same = lots.find((l) => l.id === c.id)
    if (same) {
      same.amount += c.amount
      if (c.expires > same.expires) same.expires = c.expires
    } else lots.push({ ...c })
  }
  return lots
}

// ───────────── Wochenplanung ─────────────

export interface BuyItem {
  key: string
  name: string
  cat: ShopCat
  unit: string
  /** Bedarf der ganzen Woche */
  required: number
  /** davon aus dem Vorrat */
  fromPantry: number
  packs: number
  product: Product
  cost: number
  /** nach der Woche übrig */
  leftover: number
  recipes: string[]
  /** in dieser Woche schon gekauft (abgehakt) – kann nach Portionsänderung kleiner sein als nötig */
  bought: number
}

export interface StapleItem {
  key: string
  name: string
  amount: string
  recipes: string[]
}

export interface WeekResult {
  /** zu kaufen (packs > 0) */
  buy: BuyItem[]
  /** komplett aus dem Vorrat gedeckt */
  covered: BuyItem[]
  staples: StapleItem[]
  total: number
  /** voraussichtlicher Vorrat nach allen noch offenen Gerichten der Woche */
  leftovers: PantryLot[]
}

function activeEntries(plan: WeekPlan, days: string[]) {
  return days
    .map((d) => [d, plan[d]] as const)
    .filter((x): x is readonly [string, PlanEntry] => !!x[1] && x[1].status !== 'skipped' && !!RECIPE_BY_ID[x[1].recipeId])
}

export function planWeek(
  plan: WeekPlan,
  days: string[],
  pantry: PantryLot[],
  bought: BoughtMap,
  today: string,
  overrides: PriceOverrides,
  formatStaple: (amount: number | null, unit: string) => string,
  /** Frühstücke der Woche (fließen in Einkauf & Vorrat mit ein) */
  breakfast: WeekPlan = {},
): WeekResult {
  const entries = [...activeEntries(plan, days), ...activeEntries(breakfast, days)].sort((a, b) => a[0].localeCompare(b[0]))

  // Bedarf der Woche
  const req = new Map<string, { amount: number; recipes: Set<string> }>()
  const staples = new Map<string, { parts: Map<string, number>; recipes: Set<string> }>()
  for (const [, e] of entries) {
    const r = RECIPE_BY_ID[e.recipeId]
    for (const n of needsOf(r, e.servings)) {
      const cur = req.get(n.name) ?? { amount: 0, recipes: new Set<string>() }
      cur.amount += n.amount
      cur.recipes.add(r.title)
      req.set(n.name, cur)
    }
    for (const ing of r.ingredients) {
      const name = canonical(ing.name)
      if (isTracked(name)) continue
      const s = staples.get(name) ?? { parts: new Map(), recipes: new Set<string>() }
      s.recipes.add(r.title)
      if (ing.amount != null) {
        const v = (ing.amount * e.servings) / r.servings
        s.parts.set(ing.unit, (s.parts.get(ing.unit) ?? 0) + v)
      }
      staples.set(name, s)
    }
  }

  // Vorrat vor dem Einkauf rekonstruieren: jetzt − Gekauftes + diese Woche schon Verbrauchtes
  const consumedWeek = new Map<string, number>()
  for (const [, e] of entries) for (const c of e.consumed ?? []) consumedWeek.set(c.name, (consumedWeek.get(c.name) ?? 0) + c.amount)

  // Noch offene Gerichte VOR dieser Woche (z. B. Sa/So, wenn schon die nächste Woche geplant wird)
  // brauchen ihre Zutaten noch – die dürfen für diese Woche nicht als vorhanden zählen.
  const earlier = [plan, breakfast]
    .flatMap((p) => Object.entries(p))
    .filter((x): x is [string, PlanEntry] => !!x[1] && x[0] < days[0] && !x[1].status && !!RECIPE_BY_ID[x[1].recipeId])
    .sort((a, b) => a[0].localeCompare(b[0]))
  const reserved = new Map<string, number>()
  for (const [, e] of earlier)
    for (const n of needsOf(RECIPE_BY_ID[e.recipeId], e.servings)) reserved.set(n.name, (reserved.get(n.name) ?? 0) + n.amount)

  const buy: BuyItem[] = []
  const covered: BuyItem[] = []
  let total = 0
  for (const [name, { amount: required, recipes }] of req) {
    const product = productFor(name, overrides)!
    const available = Math.max(
      0,
      pantryAmount(pantry, name) - (bought[name]?.amount ?? 0) + (consumedWeek.get(name) ?? 0) - (reserved.get(name) ?? 0),
    )
    const missing = Math.max(0, required - available)
    const packs = missing > 1e-6 ? Math.ceil(missing / product.pack - 1e-6) : 0
    const item: BuyItem = {
      key: name,
      name,
      cat: CATALOG[name] ?? 'konserven',
      unit: product.unit,
      required,
      fromPantry: Math.min(available, required),
      packs,
      product,
      cost: packs * product.price,
      leftover: available + packs * product.pack - required,
      bought: bought[name]?.amount ?? 0,
      recipes: [...recipes],
    }
    total += item.cost
    ;(packs > 0 ? buy : covered).push(item)
  }

  // Vorrat simulieren: aktueller Vorrat + noch nicht Gekauftes − offene Gerichte
  const lots = pantry.map((l) => ({ ...l }))
  for (const b of buy) {
    if (bought[b.name]) continue
    lots.push({ id: 'v-' + b.name, name: b.name, amount: b.packs * b.product.pack, unit: b.unit, expires: addDaysIso(today, b.product.shelf) })
  }
  // erst die noch offenen Gerichte vor dieser Woche, dann die dieser Woche
  for (const [day, e] of [...earlier, ...entries]) {
    if (e.status === 'cooked') continue
    for (const n of needsOf(RECIPE_BY_ID[e.recipeId], e.servings)) consume(lots, n.name, n.amount, day < today ? today : day)
  }

  const stapleItems: StapleItem[] = [...staples].map(([name, s]) => ({
    key: name,
    name,
    amount: [...s.parts].map(([u, v]) => formatStaple(v, u)).join(' + '),
    recipes: [...s.recipes],
  }))

  return { buy, covered, staples: stapleItems, total, leftovers: lots }
}

// ───────────── Empfehlungen ─────────────

export interface Insight {
  /** Zutaten, die (teilweise) aus dem Vorrat kommen */
  fromPantry: string[]
  /** davon bald ablaufend (≤ 3 Tage) */
  urgent: string[]
  /** zusätzliche Einkaufskosten (ganze Packungen) */
  buyCost: number
  /** anteiliger Warenwert */
  cost: number
  perPortion: number
  /** gelernte Vorliebe als kurze Begründung (z. B. „❤️ magst du“) */
  taste?: string
  /** Tage seit dem letzten Mal, falls in den letzten Wochen geplant */
  lastSeenDays?: number
  /** verderbliche Reste, die nach dem Einkauf übrig blieben (ungenutzt) */
  waste: { name: string; amount: number; unit: string }[]
  /** Wert dieser Reste in € */
  wasteEuro: number
  /** Zutaten, die bis zum Kochtag nicht mehr frisch wären */
  stale: string[]
  /** alles Zugekaufte hält mindestens 2 Wochen */
  longLasting: boolean
  score: number
}

/** gilt als verderblich, wenn eine angebrochene Packung höchstens so viele Tage hält */
const PERISHABLE_DAYS = 7

/** Alltagsprodukte, deren Rest im Haushalt praktisch immer aufgebraucht wird (oder sich einfrieren lässt) */
const WASTE_EXEMPT = new Set(['Milch', 'Vollkornbrot', 'Toastbrot', 'Weißbrot', 'Brötchen vom Vortag', 'Ciabatta', 'Zitrone', 'Limette'])

export interface InsightOptions {
  /** Tage zwischen Einkauf und Kochtag (für die Frische, nur Abendessen) */
  freshDays?: number
}

/** „Nur mit Vorrat kochbar“: höchstens so viel muss zugekauft werden */
export const PANTRY_ONLY_MAX_EURO = 1.5

/** Ziel-Anteil vegetarischer Gerichte pro Woche (15 % ≈ 1 von 7 Tagen) */
export const VEG_SHARE = 0.15

/** Abwertung vegetarischer Gerichte, abhängig davon, ob die Woche ihr Veggie-Kontingent schon hat */
// unter Kontingent: leichter Bonus (−1), damit ca. 1 Veggie-Gericht pro Woche vorkommt
function vegPenalty(recipe: Recipe, weekRecipes: Recipe[]): number {
  if (!recipe.vegetarian) return 0
  const quota = Math.max(1, Math.round(7 * VEG_SHARE))
  const vegCount = weekRecipes.filter((w) => w.vegetarian).length
  return vegCount >= quota ? 12 : -1
}

function urgencyWeight(daysLeft: number): number {
  if (daysLeft <= 1) return 4
  if (daysLeft <= 3) return 2.5
  if (daysLeft <= 7) return 1.5
  if (daysLeft <= 30) return 1
  return 0.3
}

export function insight(
  recipe: Recipe,
  servings: number,
  leftovers: PantryLot[],
  today: string,
  overrides: PriceOverrides,
  lastSeen: Map<string, string>,
  jitter: number,
  /** schon in dieser Woche geplante Gerichte (für Abwechslung bei Art & Küche) */
  weekRecipes: Recipe[] = [],
  opts: InsightOptions = {},
): Insight {
  const fromPantry: string[] = []
  const urgent: string[] = []
  const waste: Insight['waste'] = []
  const stale: string[] = []
  let pantryScore = 0
  let buyCost = 0
  let wasteEuro = 0
  let longLasting = true
  for (const n of needsOf(recipe, servings)) {
    const prod = productFor(n.name, overrides)!
    const mine = leftovers.filter((l) => l.name === n.name)
    const have = mine.reduce((s, l) => s + l.amount, 0)
    if (have > 1e-6) {
      const coverage = Math.min(1, have / n.amount)
      const soonest = mine.reduce((m, l) => minIso(m, l.expires), mine[0].expires)
      const left = daysUntil(soonest, today)
      pantryScore += coverage * urgencyWeight(left)
      fromPantry.push(n.name)
      if (left <= 3) urgent.push(n.name)
    }
    const missing = Math.max(0, n.amount - have)
    if (missing > 1e-6) {
      const packs = Math.ceil(missing / prod.pack - 1e-6)
      buyCost += packs * prod.price
      if (prod.shelf < 14) longLasting = false
      // bis zum Kochtag noch frisch?
      if (opts.freshDays != null && prod.shelf < opts.freshDays) stale.push(n.name)
      // angebrochener Rest, der schnell verdirbt
      const surplus = packs * prod.pack - missing
      const keeps = prod.opened ?? prod.shelf
      if (surplus > 1e-6 && keeps <= PERISHABLE_DAYS && surplus / prod.pack > 0.15 && !WASTE_EXEMPT.has(n.name)) {
        waste.push({ name: n.name, amount: surplus, unit: prod.unit })
        wasteEuro += (surplus / prod.pack) * prod.price
      }
    }
  }
  const seen = lastSeen.get(recipe.id)
  const lastSeenDays = seen ? -daysUntil(seen, today) : undefined
  const repeatPenalty = lastSeenDays != null && lastSeenDays <= 21 ? 12 : 0
  // Abwechslung: gleiche Gerichtart / Küche in derselben Woche abwerten
  const isBreakfast = recipe.meal === 'breakfast'
  const sameType = isBreakfast ? 0 : weekRecipes.filter((w) => w.type === recipe.type).length
  const sameCuisine = isBreakfast ? 0 : weekRecipes.filter((w) => w.cuisine === recipe.cuisine).length
  const mixPenalty = sameType * 1.8 + Math.max(0, sameCuisine - 1) * 2.2
  // Vegetarisch nur ca. 15 %: ist das Wochen-Kontingent erreicht, rutschen Veggie-Gerichte weit nach hinten
  // Lebensmittel sparen: verderbliche Reste deutlich abwerten, lange Haltbares bevorzugen
  const wastePenalty = wasteEuro * 2.5 + waste.length * 0.8
  const freshPenalty = stale.length * 4
  const longBonus = longLasting ? 1.5 : 0
  const score =
    pantryScore * 2 -
    buyCost * 0.25 +
    jitter * 4 -
    repeatPenalty -
    mixPenalty -
    (isBreakfast ? 0 : vegPenalty(recipe, weekRecipes)) -
    wastePenalty -
    freshPenalty +
    longBonus
  const cost = recipeCost(recipe, servings, overrides)
  return { fromPantry, urgent, buyCost, cost, perPortion: cost / servings, lastSeenDays, waste, wasteEuro, stale, longLasting, score }
}

/** Wann wurde ein Rezept zuletzt geplant (vor dem angegebenen Datum)? */
export function lastSeenMap(plan: WeekPlan, before: string): Map<string, string> {
  const m = new Map<string, string>()
  for (const [day, e] of Object.entries(plan)) {
    if (!e || day >= before || e.status === 'skipped') continue
    const cur = m.get(e.recipeId)
    if (!cur || day > cur) m.set(e.recipeId, day)
  }
  return m
}
