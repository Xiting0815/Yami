/**
 * Küchenlogik – Einkäufe statt Wochen.
 *
 * Eingekauft wird an festen Tagen: Haupteinkauf (Standard Samstag, gelernt aus den Abhak-Tagen) und – nur wenn nötig –
 * ein Zusatzeinkauf 4 Tage später (Sa → Mi). Ein Haupteinkauf deckt alle Essen vom Einkaufstag bis zum Tag vor dem
 * nächsten Haupteinkauf ab. Was bis zum Kochtag nicht frisch bleibt (Haltbarkeit/angebrochen aus products.ts, mit
 * Sicherheitsabstand), wandert automatisch auf den Zusatzeinkauf. Fehlt etwas schon vor dem nächsten Einkauf
 * (z. B. fürs Abendessen heute), steht es auf „Heute noch besorgen“.
 *
 * Gerechnet wird mit planWeek (ListScope): Einkauf für Einkauf in zeitlicher Reihenfolge; was frühere Einkäufe
 * (eingeplant oder schon abgehakt) mitbringen, liegt für spätere als Vorrat bereit (erst ab ihrem Einkaufstag).
 */
import { PRODUCTS } from '../data/products'
import { RECIPE_BY_ID } from '../data/recipes'
import type { BakePlan, WeekPlan } from '../types'
import { bakeEntriesOf } from '../bakePlan'
import { type BoughtMap, type PantryLot, type PriceOverrides, addDaysIso, daysUntil, needsOf } from './base'
import { type BuyItem, type StapleContext, type StapleItem, planWeek } from './planWeek'

export const TRIP_PREFIX = 'trip:'
/** Schlüssel für gekauft/abgehakt/eigene Artikel eines Einkaufs (Wochenlisten benutzten den Montag) */
export const tripKey = (date: string) => TRIP_PREFIX + date
export const isTripKey = (key: string) => key.startsWith(TRIP_PREFIX)
/** Standard-Einkaufstag (JS-Wochentag, 6 = Samstag) */
export const DEFAULT_SHOP_DAY = 6
/** Zusatzeinkauf 4 Tage nach dem Haupteinkauf (Sa → Mi, Fr → Di) */
export const extraWeekday = (main: number) => (main + 4) % 7
/** so weit voraus wird geplant */
export const TRIP_HORIZON = 28

const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
export const weekdayOfIso = (iso: string) => new Date(iso + 'T12:00:00').getDay()
export const wdShort = (iso: string) => WD[weekdayOfIso(iso)]

/** nächster Tag mit diesem Wochentag ab `from` (einschließlich) */
export function nextWeekday(from: string, wd: number): string {
  return addDaysIso(from, (wd - weekdayOfIso(from) + 7) % 7)
}

/** Tage, die ein Produkt sicher hält: Haltbarkeit minus Sicherheitsabstand (ab 5 Tagen 1, ab 10 Tagen 2 Tage) */
export function keepDays(days: number): number {
  return days >= 10 ? days - 2 : days >= 5 ? days - 1 : days
}

export type TripKind = 'now' | 'main' | 'extra'

export interface TripItem extends BuyItem {
  /** warum der Artikel auf diesem Einkauf steht („hält nicht bis Do“) */
  reason?: string
}

export interface Trip {
  /** Einkaufstag (ISO); „Heute noch“: heute */
  date: string
  /** Schlüssel für gekauft/abgehakt/eigene Artikel */
  key: string
  kind: TripKind
  /** abgedeckter Zeitraum (Kochtage) */
  from: string
  to: string
  /** Tage mit offenem Essen, die dieser Einkauf versorgt */
  days: string[]
  buy: TripItem[]
  covered: BuyItem[]
  staples: StapleItem[]
  total: number
  /** frühere Wochenliste (Montag), deren Haken zu diesem Einkauf gehören */
  legacyKey?: string
}

export interface TripInput {
  today: string
  plan: WeekPlan
  breakfast?: WeekPlan
  bakePlan?: BakePlan
  pantry: PantryLot[]
  /** gekauft je Einkauf (`trip:<Datum>`) bzw. früher je Woche (Montag) */
  bought: Record<string, BoughtMap>
  prices: PriceOverrides
  formatStaple: (amount: number | null, unit: string) => string
  month?: number
  staple?: StapleContext
  /** Frühstück: Vorbereitungstag (null = schon vorbereitet) */
  breakfastDay?: (day: string) => string | null
  /** Haupteinkaufstag (JS-Wochentag), Standard Samstag */
  shopDay?: number
}

interface Use {
  day: string
  recipeId: string
  servings: number
}

export function shoppingTrips(inp: TripInput): Trip[] {
  const { today } = inp
  const main = inp.shopDay ?? DEFAULT_SHOP_DAY
  const breakfast = inp.breakfast ?? {}
  const bakePlan = inp.bakePlan ?? {}
  const pf = inp.staple?.portion ?? 1
  const limit = addDaysIso(today, TRIP_HORIZON)

  // ── offene Essen ab heute (Frühstück am Vorbereitungstag) ──
  const uses: Use[] = []
  let end = today
  for (const [d, e] of Object.entries(inp.plan)) {
    if (!e || e.status || d < today || d > limit || !RECIPE_BY_ID[e.recipeId]) continue
    uses.push({ day: d, recipeId: e.recipeId, servings: e.servings * pf })
    if (d > end) end = d
  }
  for (const [d, e] of Object.entries(breakfast)) {
    // schon vorbereitet (`prep`): Portionen liegen im Vorrat, nichts mehr einzukaufen
    if (!e || e.status || e.prep || d < today || d > limit || !RECIPE_BY_ID[e.recipeId]) continue
    const p = inp.breakfastDay ? inp.breakfastDay(d) : d
    if (!p || p < today) continue
    uses.push({ day: p, recipeId: e.recipeId, servings: e.servings })
    if (d > end) end = d
  }
  for (const [d, e] of bakeEntriesOf(bakePlan, today)) {
    if (d < today || d > limit) continue
    uses.push({ day: d, recipeId: e.recipeId, servings: e.servings })
    if (d > end) end = d
  }
  uses.sort((a, b) => a.day.localeCompare(b.day))
  const horizon: string[] = []
  for (let d = today; d <= end; d = addDaysIso(d, 1)) horizon.push(d)

  // ── Einkaufstage ──
  const first = nextWeekday(today, main)
  const mains: string[] = []
  for (let d = first; d <= end; d = addDaysIso(d, 7)) mains.push(d)
  if (!mains.length) mains.push(first)
  const extras = [addDaysIso(first, -7), ...mains]
    .map((m) => addDaysIso(m, 4))
    .filter((e) => e > today && e <= end && !mains.includes(e))
  const hasNow = first > today
  const defaultOf = (day: string): string => [...mains].reverse().find((m) => m <= day) ?? today

  // erster Verbrauch je (Standard-Einkauf, Zutat): ab da ist die Packung angebrochen
  const firstUse = new Map<string, string>()
  for (const u of uses)
    for (const n of needsOf(RECIPE_BY_ID[u.recipeId], u.servings)) {
      const k = `${defaultOf(u.day)}|${n.name}`
      if (!firstUse.has(k)) firstUse.set(k, u.day)
    }

  // ── wem gehört welcher Bedarf ──
  const reasons = new Map<string, Map<string, { day: string; text: string }>>()
  const note = (trip: string, name: string, day: string, text: string) => {
    const m = reasons.get(trip) ?? new Map<string, { day: string; text: string }>()
    const cur = m.get(name)
    if (!cur || day < cur.day) m.set(name, { day, text })
    reasons.set(trip, m)
  }
  const owners = new Map<string, string>()
  const ownerOf = (day: string, name: string): string => {
    const k = `${day}|${name}`
    const hit = owners.get(k)
    if (hit) return hit
    const def = defaultOf(day)
    let owner = def
    const prod = PRODUCTS[name]
    if (prod) {
      const fresh = daysUntil(day, def) <= keepDays(prod.shelf)
      const fu = firstUse.get(`${def}|${name}`) ?? day
      const openOk = day === fu || daysUntil(day, fu) <= keepDays(prod.opened ?? prod.shelf)
      if (!fresh || !openOk) {
        const why = `${fresh ? 'angebrochen hält' : 'hält'} nicht bis ${wdShort(day)}`
        const ex = extras.filter((e) => e > def && e <= day).pop()
        if (ex) {
          owner = ex
          note(ex, name, day, why)
        } else note(def, name, day, `${why} – einfrieren`)
      }
    }
    owners.set(k, owner)
    return owner
  }
  // alle Bedarfe einmal zuordnen (damit leere Zusatzeinkäufe gar nicht erst entstehen)
  const extraUsed = new Set<string>()
  for (const u of uses) for (const n of needsOf(RECIPE_BY_ID[u.recipeId], u.servings)) {
    const o = ownerOf(u.day, n.name)
    if (extras.includes(o)) extraUsed.add(o)
  }

  const dates = [...(hasNow ? [today] : []), ...mains, ...extras.filter((e) => extraUsed.has(e))].sort()
  const kindOf = (d: string): TripKind => (hasNow && d === today ? 'now' : mains.includes(d) ? 'main' : 'extra')
  const legacyOf = (d: string) => (kindOf(d) === 'main' ? nextWeekday(d, 1) : undefined)
  const ownMap = (d: string): BoughtMap => {
    const l = legacyOf(d)
    return { ...(l ? inp.bought[l] : undefined), ...inp.bought[tripKey(d)] }
  }
  const maps = new Map(dates.map((d) => [d, ownMap(d)]))

  const trips: Trip[] = []
  const extraLots: PantryLot[] = []
  dates.forEach((date, i) => {
    const idx = (d: string) => dates.indexOf(d)
    const own = maps.get(date)!
    const res = planWeek(
      inp.plan,
      horizon.length ? horizon : [today],
      inp.pantry,
      own,
      today,
      inp.prices,
      inp.formatStaple,
      breakfast,
      inp.month,
      { ...inp.staple, carry: false },
      bakePlan,
      {
        // ein Bedarf, dessen Einkauf weggefallen ist (nichts zu kaufen), gehört niemandem mehr
        owner: (d, n) => {
          const o = idx(ownerOf(d, n))
          return o < 0 ? 1 : o - i
        },
        ownsDay: (d) => defaultOf(d) === date,
        breakfastDay: inp.breakfastDay ? (d) => {
          const p = inp.breakfastDay!(d)
          return p && p >= today ? p : null
        } : undefined,
        extra: extraLots,
        subtract: dates.filter((d) => d !== date).map((d) => maps.get(d)!),
        extras: date === first,
      },
    )
    const kind = kindOf(date)
    const why = reasons.get(date)
    const buy: TripItem[] = res.buy.map((b) => {
      const it: TripItem = { ...b }
      const r = why?.get(b.name)
      if (r) it.reason = r.text
      if (kind === 'now' && b.days?.length) it.forDays = b.days
      return it
    })
    for (const b of res.buy)
      if (b.packs > 0)
        extraLots.push({ id: `v:${date}:${b.name}`, name: b.name, amount: b.packs * b.product.pack, unit: b.unit, expires: addDaysIso(date, b.product.shelf), from: date })

    const mealDays = [...new Set(uses.filter((u) => defaultOf(u.day) === date).map((u) => u.day))]
    const itemDays = [...new Set(buy.flatMap((b) => b.days ?? []))].sort()
    const next = mains.find((m) => m > date)
    let to: string
    if (kind === 'now') to = addDaysIso(first, -1)
    else if (kind === 'extra') to = itemDays[itemDays.length - 1] ?? date
    else to = next ? addDaysIso(next, -1) : mealDays[mealDays.length - 1] ?? addDaysIso(date, 6)
    const hasBought = Object.keys(own).length > 0
    if (kind === 'now' && !buy.length && !hasBought) return
    if (kind === 'extra' && !buy.length && !hasBought) return
    if (kind === 'main' && date !== first && !mealDays.length && !buy.length && !hasBought) return
    trips.push({
      date,
      key: tripKey(date),
      kind,
      from: date,
      to,
      days: kind === 'extra' ? itemDays : mealDays,
      buy,
      covered: res.covered,
      staples: res.staples,
      total: res.total,
      ...(legacyOf(date) ? { legacyKey: legacyOf(date) } : {}),
    })
  })
  return trips
}

/** Haupteinkauf, den die Liste zuerst zeigt */
export const mainTrip = (trips: Trip[]): Trip | undefined => trips.find((t) => t.kind === 'main') ?? trips[0]

/** Ausgaben einer Woche: gekauft auf Einkäufen in dieser Woche + frühere Wochenliste */
export function boughtOfWeek(bought: Record<string, BoughtMap>, days: string[]): BoughtMap {
  const out: BoughtMap = { ...bought[days[0]] }
  for (const [k, m] of Object.entries(bought)) {
    if (!isTripKey(k) || !days.includes(k.slice(5))) continue
    for (const [n, b] of Object.entries(m)) out[n] = out[n] ? { ...b, amount: out[n].amount + b.amount } : b
  }
  return out
}
