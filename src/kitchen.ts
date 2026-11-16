/**
 * Küchenlogik: Vorrat, Einkaufsplanung nach Packungsgrößen, Kosten und Empfehlungen.
 *
 * Mengen werden je Zutat in der Basiseinheit ihres Produkts geführt (z. B. Sahne in ml,
 * Zwiebel in Stk). Grundzutaten (Kategorie "vorrat") sind zweierlei: Mengen-Grundzutaten (Öl, Brühe, Mehl …)
 * werden wie jede Zutat geführt, aber erst, wenn du sie im Vorrat hast; Gewürze haben nur „da“ / „alle“.
 * Siehe staples.ts.
 */
import { CATALOG, SHOP_ALIAS } from './data/catalog'
import { CONVERT, PRODUCTS, type Product } from './data/products'
import { inSeason, seasonOf } from './data/season'
import { RECIPE_BY_ID } from './data/recipes'
import { substitutesFor } from './data/substitutes'
import type { Festive, PlanEntry, Recipe, ShopCat, WeekPlan } from './types'
import {
  type SpiceStatus, isSpice, type StapleMemos, STAPLE_SHOP_CAT, buyName, defaultAmount, isQtyStaple, isTrackedStaple, runningLow,
  stapleKey, useEvents, useRate,
} from './staples'

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

const minIso = (a: string, b: string) => (a < b ? a : b)

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

// ───────────── Vorrat ─────────────

export function pantryAmount(lots: PantryLot[], name: string): number {
  return lots.filter((l) => l.name === name).reduce((s, l) => s + l.amount, 0)
}

/** Menge im Vorrat, die den Bedarf an `name` deckt: die Zutat selbst plus austauschbare (Penne für Spaghetti) */
export function pantryCovering(lots: PantryLot[], name: string): number {
  const subs = new Set(substitutesFor(name))
  return lots.filter((l) => l.name === name || subs.has(l.name)).reduce((s, l) => s + l.amount, 0)
}

/**
 * Menge nach FIFO (frühestes Ablaufdatum zuerst) entnehmen. Angebrochene Posten bekommen
 * die kürzere "angebrochen"-Haltbarkeit. Gibt die entnommenen Teilmengen zurück.
 */
export function consume(lots: PantryLot[], name: string, amount: number, date: string): PantryLot[] {
  const taken: PantryLot[] = []
  let rest = amount
  // erst die Zutat selbst, dann austauschbare (z. B. Penne statt Spaghetti), jeweils das früheste Ablaufdatum zuerst
  const byExpiry = (a: PantryLot, b: PantryLot) => a.expires.localeCompare(b.expires)
  const subs = new Set(substitutesFor(name))
  const mine = [
    ...lots.filter((l) => l.name === name).sort(byExpiry),
    ...lots.filter((l) => subs.has(l.name)).sort(byExpiry),
  ]
  for (const lot of mine) {
    const prod = PRODUCTS[lot.name]
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

/** Wert einer Menge in € (anteilig an Packungsgröße × Preis), 0 ohne Produkt */
export function amountValue(name: string, amount: number, overrides?: PriceOverrides): number {
  const prod = productFor(name, overrides)
  return prod && prod.pack > 0 ? (amount / prod.pack) * prod.price : 0
}

/** Vorratsposten als weggeworfen erfassen */
export function wasteOf(lot: PantryLot, date: string, overrides?: PriceOverrides): WastedItem {
  return { name: lot.name, amount: lot.amount, unit: lot.unit, date, value: Math.round(amountValue(lot.name, lot.amount, overrides) * 100) / 100 }
}

/** Ein entfernter Posten zählt als weggeworfen, wenn er abgelaufen war (Haltbarkeit ≤ heute) */
export function discardWaste(lot: PantryLot, today: string, overrides?: PriceOverrides): WastedItem | null {
  return lot.expires <= today && lot.amount > 1e-6 ? wasteOf(lot, today, overrides) : null
}

/** Posten, die vor mehr als 7 Tagen abgelaufen sind, wandern automatisch in „weggeworfen“ (idempotent) */
export function moveExpired(
  pantry: PantryLot[],
  wasted: WastedItem[],
  today: string,
  overrides?: PriceOverrides,
): { pantry: PantryLot[]; wasted: WastedItem[]; changed: boolean } {
  const gone = pantry.filter((l) => daysUntil(l.expires, today) < -WASTE_AFTER_DAYS)
  if (!gone.length) return { pantry, wasted, changed: false }
  return {
    pantry: pantry.filter((l) => !gone.includes(l)),
    wasted: [...wasted, ...gone.map((l) => wasteOf(l, today, overrides))].slice(-WASTED_MAX),
    changed: true,
  }
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
    if (recipe) for (const n of allNeedsOf(recipe, entry.servings)) consumed.push(...consume(lots, n.name, n.amount, day))
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
  /** Teil davon aus austauschbaren Zutaten (z. B. Penne statt Spaghetti) */
  substitutes: { name: string; amount: number }[]
  packs: number
  product: Product
  cost: number
  /** nach der Woche übrig */
  leftover: number
  recipes: string[]
  /** in dieser Woche schon gekauft (abgehakt) – kann nach Portionsänderung kleiner sein als nötig */
  bought: number
  /** Grundzutaten: warum sie auf der Liste stehen (wird knapp / bald leer / Gewürz ist alle) */
  note?: 'knapp' | 'leer' | 'alle'
}

export interface StapleItem {
  key: string
  name: string
  amount: string
  recipes: string[]
}

/** Wissen über Grundzutaten für die Wochenplanung */
export interface StapleContext {
  /** zuletzt geführte Brühen-Form je Grundzutat (gelernt) und welche Zutaten du schon führst */
  memo?: StapleMemos
  /** Gewürze: da / alle */
  spices?: Record<string, SpiceStatus>
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
  /** Monat (1–12) für Saisonpreise; ohne Angabe keine Anpassung */
  month?: number,
  /** Grundzutaten: gemerkte Formen und Gewürz-Status */
  staple: StapleContext = {},
): WeekResult {
  const memo = staple.memo ?? {}
  // Mengen-Grundzutaten zählen erst, wenn du sie führst (Vorrat oder gemerkt) – sonst bleiben sie bei „Vorrat prüfen“
  const trackedKey = (key: string) => isTrackedStaple(key, pantry, memo) || Object.keys(bought).some((n) => stapleKey(n) === key)
  const needsFor = (r: Recipe, servings: number) => [
    ...needsOf(r, servings),
    ...stapleNeedsOf(r, servings).filter((n) => trackedKey(stapleKey(n.name))),
  ]
  const entries = [...activeEntries(plan, days), ...activeEntries(breakfast, days)].sort((a, b) => a[0].localeCompare(b[0]))

  // Bedarf der Woche
  const req = new Map<string, { amount: number; recipes: Set<string> }>()
  const staples = new Map<string, { parts: Map<string, number>; recipes: Set<string> }>()
  for (const [, e] of entries) {
    const r = RECIPE_BY_ID[e.recipeId]
    for (const n of needsFor(r, e.servings)) {
      const cur = req.get(n.name) ?? { amount: 0, recipes: new Set<string>() }
      cur.amount += n.amount
      cur.recipes.add(r.title)
      req.set(n.name, cur)
    }
    for (const ing of r.ingredients) {
      const name = canonical(ing.name)
      if (isTracked(name)) continue
      // geführte Mengen-Grundzutaten stehen oben im Bedarf, Gewürze mit Status über „da“/„alle“
      if (isQtyStaple(name) && trackedKey(stapleKey(name))) continue
      if (isSpice(name) && staple.spices?.[name]) continue
      const s = staples.get(name) ?? { parts: new Map(), recipes: new Set<string>() }
      s.recipes.add(r.title)
      if (ing.amount != null) {
        const v = (ing.amount * e.servings) / r.servings
        s.parts.set(ing.unit, (s.parts.get(ing.unit) ?? 0) + v)
      }
      staples.set(name, s)
    }
  }

  // Vorrat vor dem Einkauf rekonstruieren: jetzt − Gekauftes + diese Woche schon Verbrauchtes (je Zutat zusammengefasst)
  const pool = new Map<string, number>()
  const bump = (name: string, d: number) => pool.set(name, (pool.get(name) ?? 0) + d)
  for (const l of pantry) bump(l.name, l.amount)
  for (const [name, b] of Object.entries(bought)) bump(name, -b.amount)
  for (const [, e] of entries) for (const c of e.consumed ?? []) bump(c.name, c.amount)
  for (const [k, v] of pool) if (v < 0) pool.set(k, 0)

  // Noch offene Gerichte VOR dieser Woche (z. B. Sa/So, wenn schon die nächste Woche geplant wird)
  // brauchen ihre Zutaten noch – die dürfen für diese Woche nicht als vorhanden zählen.
  const earlier = [plan, breakfast]
    .flatMap((p) => Object.entries(p))
    .filter((x): x is [string, PlanEntry] => !!x[1] && x[0] < days[0] && !x[1].status && !!RECIPE_BY_ID[x[1].recipeId])
    .sort((a, b) => a[0].localeCompare(b[0]))
  /** Menge aus dem Pool nehmen: erst die Zutat selbst, dann austauschbare; gibt die Teilmengen zurück */
  const take = (name: string, amount: number, exactOnly: boolean) => {
    const got: { name: string; amount: number }[] = []
    let rest = amount
    for (const n of exactOnly ? [name] : substitutesFor(name)) {
      const t = Math.min(pool.get(n) ?? 0, rest)
      if (t > 1e-9) {
        pool.set(n, (pool.get(n) ?? 0) - t)
        rest -= t
        got.push({ name: n, amount: t })
      }
    }
    return got
  }
  const reservedNeeds = earlier.flatMap(([, e]) => needsFor(RECIPE_BY_ID[e.recipeId], e.servings))
  const reservedRest = reservedNeeds.map((n) => n.amount - take(n.name, n.amount, true).reduce((s, x) => s + x.amount, 0))
  reservedNeeds.forEach((n, i) => {
    if (reservedRest[i] > 1e-6) take(n.name, reservedRest[i], false)
  })

  // 1. Durchgang: Zutat selbst – 2. Durchgang: austauschbare Posten für den Rest
  const have = new Map<string, { exact: number; availExact: number; subs: { name: string; amount: number }[] }>()
  for (const [name, { amount: required }] of req) {
    const availExact = pool.get(name) ?? 0
    const exact = take(name, required, true).reduce((s, x) => s + x.amount, 0)
    have.set(name, { exact, availExact, subs: [] })
  }
  for (const [name, { amount: required }] of req) {
    const h = have.get(name)!
    if (required - h.exact > 1e-6) h.subs = take(name, required - h.exact, false)
  }

  const buy: BuyItem[] = []
  const covered: BuyItem[] = []
  let total = 0
  for (const [name, { amount: required, recipes }] of req) {
    // Brühe: gekauft wird die Form, die du zuletzt im Vorrat hattest (sonst Pulver)
    const itemName = isQtyStaple(name) ? buyName(name, memo) : name
    const product = productFor(itemName, overrides, month)!
    const h = have.get(name)!
    const subAmount = h.subs.reduce((s, x) => s + x.amount, 0)
    const fromPantry = h.exact + subAmount
    const missing = Math.max(0, required - fromPantry)
    const packs = missing > 1e-6 ? Math.ceil(missing / product.pack - 1e-6) : 0
    const item: BuyItem = {
      key: itemName,
      name: itemName,
      cat: isQtyStaple(name) ? STAPLE_SHOP_CAT : (CATALOG[name] ?? 'konserven'),
      unit: product.unit,
      required,
      fromPantry,
      substitutes: h.subs,
      packs,
      product,
      cost: packs * product.price,
      leftover: h.availExact + subAmount + packs * product.pack - required,
      bought: bought[itemName]?.amount ?? 0,
      recipes: [...recipes],
    }
    if (packs > 0 && isQtyStaple(name)) item.note = 'knapp'
    // Brühe: der Bedarf heißt „Gemüsebrühe“, die Packung „Gemüsebrühe Würfel“ – fürs „schon im Vorrat“ bleibt der Rezeptname
    if (packs === 0 && itemName !== name) {
      item.key = name
      item.name = name
    }
    total += item.cost
    ;(packs > 0 ? buy : covered).push(item)
  }

  // Lernen: Grundzutaten, die bald leer sind (aus dem Verbrauch der letzten Wochen) oder fast leer, kommen auf die Liste
  const events = useEvents(plan, breakfast)
  const keys = new Set<string>([...Object.keys(memo), ...pantry.filter((l) => isQtyStaple(l.name)).map((l) => stapleKey(l.name))])
  for (const key of keys) {
    if (!trackedKey(key) || buy.some((b) => stapleKey(b.name) === key && isQtyStaple(b.name))) continue
    const name = buyName(key, memo)
    const product = productFor(name, overrides, month)
    if (!product) continue
    const inCovered = covered.find((c) => c.key === key)
    const group = (n: string) => stapleKey(n) === key
    const now =
      pantry.filter((l) => group(l.name)).reduce((s, l) => s + l.amount, 0) -
      Object.entries(bought).filter(([n]) => group(n)).reduce((s, [, b]) => s + b.amount, 0)
    // nach dem Wochenplan: was dann noch da ist (nicht abgedeckter Bedarf kam schon oben auf die Liste)
    const after = inCovered ? inCovered.leftover : Math.max(0, now)
    if (!runningLow(after, product.pack, useRate(events, key, today))) continue
    const item: BuyItem = {
      key: name, name, cat: STAPLE_SHOP_CAT, unit: product.unit, required: inCovered?.required ?? 0, fromPantry: 0, substitutes: [], packs: 1, product,
      cost: product.price, leftover: after + product.pack, bought: bought[name]?.amount ?? 0, recipes: inCovered?.recipes ?? [], note: 'leer',
    }
    if (inCovered) covered.splice(covered.indexOf(inCovered), 1)
    total += item.cost
    buy.push(item)
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
    for (const n of allNeedsOf(RECIPE_BY_ID[e.recipeId], e.servings)) consume(lots, n.name, n.amount, day < today ? today : day)
  }

  // Gewürze, die „alle“ sind: stehen als echter Artikel auf der Liste (abgehakt → wieder „da“)
  for (const [name, st] of Object.entries(staple.spices ?? {})) {
    const hit = bought[name] != null
    const product = productFor(name, overrides)
    if ((st !== 'alle' && !hit) || !product) continue
    const used = entries.map(([, e]) => RECIPE_BY_ID[e.recipeId]).filter((r) => r.ingredients.some((i) => canonical(i.name) === name))
    const item: BuyItem = {
      key: name, name, cat: STAPLE_SHOP_CAT, unit: product.unit, required: 0, fromPantry: 0, substitutes: [], packs: 1, product,
      cost: product.price, leftover: 0, bought: bought[name]?.amount ?? 0, recipes: [...new Set(used.map((r) => r.title))], note: 'alle',
    }
    total += item.cost
    buy.push(item)
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
  /** Festtagsgericht: im Fenster (mit Badge-Text) oder außerhalb */
  festive?: { active: boolean; label?: string }
  /** Saisonbezug (nur mit Monat): Zutaten außerhalb / innerhalb der Saison */
  season?: { out: string[]; peak: string[] }
  /** Zutaten, die (teilweise) aus dem Vorrat kommen */
  fromPantry: string[]
  /** davon bald ablaufend (≤ 3 Tage) */
  urgent: string[]
  /** Zutaten, die ein austauschbarer Vorratsposten deckt (z. B. Spaghetti ← Penne) */
  substitutes: { need: string; with: string[] }[]
  /** Anzahl mengenmäßig geführter Zutaten des Gerichts (ohne Gewürze/Grundzutaten) */
  needCount: number
  /** davon mindestens zur Hälfte aus dem Vorrat gedeckt */
  haveCount: number
  /** Anteil des Warenwerts, der aus dem Vorrat kommt (0–1) */
  pantryShare: number
  /** Vorrats-Modus („Was koche ich damit?“): Sortierwert ohne gelernte Vorliebe */
  modeScore: number
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

/** Gewicht des Vorrats in der normalen Sortierung (Aufbrauchen vor Zukaufen) */
export const PANTRY_WEIGHT = 4

/** gilt als verderblich, wenn eine angebrochene Packung höchstens so viele Tage hält */
const PERISHABLE_DAYS = 7

/** Alltagsprodukte, deren Rest im Haushalt praktisch immer aufgebraucht wird (oder sich einfrieren lässt) */
const WASTE_EXEMPT = new Set(['Milch', 'Vollkornbrot', 'Toastbrot', 'Weißbrot', 'Brötchen vom Vortag', 'Ciabatta', 'Zitrone', 'Limette'])

/** Festtags-Fenster als [Monat-Tag von, bis] (inklusive) */
const FESTIVE_WINDOW: Record<Festive, [string, string]> = {
  martini: ['11-01', '11-30'],
  weihnachten: ['12-01', '12-26'],
}
const FESTIVE_BADGE: Record<Festive, string> = { martini: '🪿 Martinsgans-Zeit', weihnachten: '🎄 Passt zur Weihnachtszeit' }
/** Bonus im Festtags-Fenster / Abzug außerhalb */
export const FESTIVE_BOOST = 11
export const FESTIVE_PENALTY = 4

/** Festtagsbezug eines Gerichts am Kochtag (ISO-Datum): im Fenster (Badge-Text) oder außerhalb */
export function festiveOf(recipe: Recipe, iso: string): { active: boolean; label?: string } | undefined {
  if (!recipe.festive?.length) return undefined
  const md = iso.slice(5, 10)
  const hit = recipe.festive.find((w) => md >= FESTIVE_WINDOW[w][0] && md <= FESTIVE_WINDOW[w][1])
  return hit ? { active: true, label: FESTIVE_BADGE[hit] } : { active: false }
}

export interface InsightOptions {
  /** Kochtag (ISO-Datum) für Festtags-Fenster; Standard: heute */
  day?: string
  /** Tage zwischen Einkauf und Kochtag (für die Frische, nur Abendessen) */
  freshDays?: number
  /** Monat (1–12) des Kochtags: Saisonbezug und Saisonpreise */
  month?: number
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
  let coveredValue = 0
  let totalValue = 0
  let urgentValue = 0
  let haveCount = 0
  const substitutes: Insight['substitutes'] = []
  const needs = needsOf(recipe, servings)
  // jeder Vorratsposten wird nur einmal angerechnet (Spaghetti und Penne im selben Gericht teilen sich ihn)
  const poolLeft = new Map<string, number>()
  const left0 = (l: PantryLot) => poolLeft.get(l.id) ?? l.amount
  let buyCost = 0
  let wasteEuro = 0
  let longLasting = true
  for (const n of needs) {
    const prod = productFor(n.name, overrides, opts.month)!
    const byExpiry = (x: PantryLot, y: PantryLot) => x.expires.localeCompare(y.expires)
    const subNames = new Set(substitutesFor(n.name))
    const cand = [
      ...leftovers.filter((l) => l.name === n.name).sort(byExpiry),
      ...leftovers.filter((l) => subNames.has(l.name) && l.unit === prod.unit).sort(byExpiry),
    ]
    let rest = n.amount
    let have = 0
    const used: PantryLot[] = []
    for (const l of cand) {
      const a = left0(l)
      if (a <= 1e-6 || rest <= 1e-9) continue
      const t = Math.min(a, rest)
      poolLeft.set(l.id, a - t)
      rest -= t
      have += t
      used.push(l)
    }
    const value = (n.amount / prod.pack) * prod.price
    totalValue += value
    if (have > 1e-6) {
      const coverage = Math.min(1, have / n.amount)
      const soonest = used.reduce((m, l) => minIso(m, l.expires), used[0].expires)
      const left = daysUntil(soonest, today)
      pantryScore += coverage * urgencyWeight(left)
      coveredValue += coverage * value
      if (coverage >= 0.5) haveCount++
      const names = [...new Set(used.map((l) => l.name))]
      for (const nm of names) if (!fromPantry.includes(nm)) fromPantry.push(nm)
      const other = names.filter((nm) => nm !== n.name)
      if (other.length) substitutes.push({ need: n.name, with: other })
      if (left <= 3) {
        urgentValue += coverage * value
        for (const nm of names) if (!urgent.includes(nm)) urgent.push(nm)
      }
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
  // Saison: Gerichte mit Zutaten außerhalb der Saison nach hinten, saisonale leicht nach vorne
  const season = opts.month != null ? seasonOf(recipe, opts.month) : undefined
  const seasonScore = season ? (season.out.length > 0 ? -3 : season.peak.length > 0 ? 1 : 0) : 0
  const festive = festiveOf(recipe, opts.day ?? today)
  // im Fenster: der Preis des Festessens zählt nur noch halb – es kommt nach vorn, ohne den Stapel zu dominieren
  const festiveScore = festive ? (festive.active ? FESTIVE_BOOST + buyCost * 0.18 : -FESTIVE_PENALTY) : 0
  // Vorrat aufbrauchen: Zahl der gedeckten Zutaten (Dringlichkeit) plus Anteil am Warenwert
  const pantryShare = totalValue > 1e-6 ? coveredValue / totalValue : 0
  const urgentShare = totalValue > 1e-6 ? urgentValue / totalValue : 0
  const countShare = needs.length ? haveCount / needs.length : 0
  const modeScore =
    (fromPantry.length ? 6 : -50) + 12 * pantryShare + 16 * countShare + 8 * urgentShare + pantryScore * 1.5 - buyCost * 0.6 - repeatPenalty * 0.5 + jitter
  const score =
    seasonScore +
    festiveScore +
    pantryScore * PANTRY_WEIGHT +
    pantryShare * 4 -
    buyCost * 0.25 +
    jitter * 4 -
    repeatPenalty -
    mixPenalty -
    (isBreakfast ? 0 : vegPenalty(recipe, weekRecipes)) -
    wastePenalty -
    freshPenalty +
    longBonus
  const cost = recipeCost(recipe, servings, overrides)
  return { season, festive, fromPantry, urgent, substitutes, needCount: needs.length, haveCount, pantryShare, modeScore, buyCost, cost, perPortion: cost / servings, lastSeenDays, waste, wasteEuro, stale, longLasting, score }
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
