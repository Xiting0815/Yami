/** Küchenlogik – Vorrat: Posten verbrauchen, Wegwerfen, Kochen/Zurücknehmen, Einkauf zurücknehmen. */
import { PRODUCTS } from '../data/products'
import { RECIPE_BY_ID } from '../data/recipes'
import { substituteTiers, substitutesFor } from '../data/substitutes'
import type { PlanEntry, WeekPlan } from '../types'
import { type PantryLot, type WastedItem, WASTED_MAX, WASTE_AFTER_DAYS, type PriceOverrides, addDaysIso, daysUntil, minIso, productFor, allNeedsOf } from './base'

export function pantryAmount(lots: PantryLot[], name: string): number {
  return lots.filter((l) => l.name === name).reduce((s, l) => s + l.amount, 0)
}

/** Menge im Vorrat, die den Bedarf an `name` deckt: die Zutat selbst plus austauschbare (Penne für Spaghetti) */
export function pantryCovering(lots: PantryLot[], name: string): number {
  const subs = new Set(substitutesFor(name))
  return lots.filter((l) => l.name === name || subs.has(l.name)).reduce((s, l) => s + l.amount, 0)
}

/** Ist ein Posten an diesem Tag noch gut? (Haltbarkeit = letzter guter Tag) – Abgelaufenes zählt nicht mehr als Vorrat */
export const usableOn = (lot: { expires: string; amount: number }, day: string) => lot.amount > 1e-6 && lot.expires >= day

/** Posten, die den Bedarf an `name` decken können, in Entnahme-Reihenfolge: Zutat selbst, dann Ersatz-Stufen; je Stufe frühestes Ablaufdatum zuerst */
export function lotsFor<T extends PantryLot>(lots: T[], name: string, day: string, exactOnly = false): T[] {
  const byExpiry = (a: T, b: T) => a.expires.localeCompare(b.expires)
  const tiers = exactOnly ? [[name]] : [[name], ...substituteTiers(name)]
  return tiers.flatMap((t) => lots.filter((l) => t.includes(l.name) && usableOn(l, day)).sort(byExpiry))
}

/**
 * Menge nach FIFO (frühestes Ablaufdatum zuerst) entnehmen – erst die Zutat selbst, dann austauschbare (z. B. Penne
 * statt Spaghetti, Olivenöl statt Sonnenblumenöl, notfalls Gemüsebrühe statt Hühnerbrühe). Am Kochtag schon
 * abgelaufene Posten werden nicht genommen. Angebrochene Posten bekommen die kürzere "angebrochen"-Haltbarkeit.
 * Gibt die entnommenen Teilmengen zurück.
 */
export function consume(lots: PantryLot[], name: string, amount: number, date: string): PantryLot[] {
  const taken: PantryLot[] = []
  let rest = amount
  for (const lot of lotsFor(lots, name, date)) {
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

/**
 * Ein entfernter Posten zählt als weggeworfen, wenn er abgelaufen war (Haltbarkeit ≤ heute). Datum = Ablaufdatum,
 * damit er im Rückblick und beim Lernen in der Woche landet, in der er verdorben ist.
 */
export function discardWaste(lot: PantryLot, today: string, overrides?: PriceOverrides): WastedItem | null {
  return lot.expires <= today && lot.amount > 1e-6 ? wasteOf(lot, lot.expires, overrides) : null
}

/** Posten, die vor mehr als 7 Tagen abgelaufen sind, wandern automatisch in „weggeworfen“ (idempotent), datiert aufs Ablaufdatum */
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
    wasted: [...wasted, ...gone.map((l) => wasteOf(l, minIso(l.expires, today), overrides))].slice(-WASTED_MAX),
    changed: true,
  }
}

/** Gekochte Gerichte (Tage vor heute) automatisch vom Vorrat abziehen */
export function cookDue(plan: WeekPlan, pantry: PantryLot[], today: string, factor = 1): { plan: WeekPlan; pantry: PantryLot[]; changed: boolean } {
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
    if (recipe) for (const n of allNeedsOf(recipe, entry.servings * factor)) consumed.push(...consume(lots, n.name, n.amount, day))
    next[day] = { ...entry, status: 'cooked', consumed }
  }
  return { plan: next, pantry: lots, changed: true }
}

/**
 * „Fertig gekocht“: den Eintrag dieses Tages sofort als gekocht eintragen und die Zutaten vom Vorrat abziehen –
 * genau wie cookDue am nächsten Tag (dort ist der Eintrag dann schon „gekocht“ und wird nicht noch einmal abgezogen).
 * Ein vorhandener Eintrag mit Status wird zuerst zurückgenommen (Zutaten zurück), damit nie doppelt abgezogen wird.
 */
export function cookNow(plan: WeekPlan, pantry: PantryLot[], day: string, entry: { recipeId: string; servings: number }, factor = 1): { plan: WeekPlan; pantry: PantryLot[] } {
  const old = plan[day]
  const base = old?.status ? uncook(old, pantry) : pantry
  const r = cookDue({ [day]: { recipeId: entry.recipeId, servings: entry.servings } }, base, addDaysIso(day, 1), factor)
  return { plan: { ...plan, [day]: r.plan[day]! }, pantry: r.pantry }
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

/**
 * Abgehakten Einkauf wieder abwählen („doch nicht gekauft“): nur das, was vom gekauften Posten noch übrig ist,
 * verlässt den Vorrat. Wurde schon damit gekocht, verweisen die „entnommen“-Einträge der Gerichte auf einen Posten,
 * den es nie gab – sie werden gestrichen, damit „nicht gekocht“ später keinen Vorrat aus dem Nichts zurückbringt.
 */
export function unbuy(
  pantry: PantryLot[],
  plans: WeekPlan[],
  lotId: string,
  amount: number,
): { pantry: PantryLot[]; plans: WeekPlan[] } {
  const lot = pantry.find((l) => l.id === lotId)
  const used = lot ? Math.max(0, amount - lot.amount) : amount
  const next = pantry
    .map((l) => (l.id === lotId ? { ...l, amount: Math.max(0, l.amount - amount) } : l))
    .filter((l) => l.amount > 1e-6)
  if (used <= 1e-6) return { pantry: next, plans }
  const strip = (p: WeekPlan): WeekPlan => {
    if (!Object.values(p).some((e) => e?.consumed?.some((c) => c.id === lotId))) return p
    return Object.fromEntries(
      Object.entries(p).map(([d, e]) => [d, e?.consumed?.some((c) => c.id === lotId) ? { ...e, consumed: e.consumed.filter((c) => c.id !== lotId) } : e]),
    )
  }
  return { pantry: next, plans: plans.map(strip) }
}

// ───────────── Wochenplanung ─────────────
