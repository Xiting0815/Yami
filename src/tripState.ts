/**
 * Einkäufe in der App: Einkäufe aus dem Zustand berechnen, Entwurf → Freigabe → Home Assistant, „Liste prüfen“
 * (Habe ich / Brauche ich) und was Yami dabei lernt (Einkaufstag, was meist schon da ist). Alles reine Funktionen.
 *
 * GETEILT (Familien-Abgleich, Dokument `kitchen`): Freigabe je Einkauf (`trip:<Tag>`), Antworten beim Prüfen
 * (`ans:<Tag>|<Artikel>`); Einkaufstag (`shop:day`, Dokument `prefs`). Gekauft/abgehakt/eigene Artikel liegen wie
 * bisher in bought/checked/custom – Schlüssel `trip:<Einkaufstag>` statt Montag der Woche (alte Wochenlisten zählen
 * zum Haupteinkauf davor, siehe Trip.legacyKey).
 */
import { PRODUCTS } from './data/products'
import { resolvePrepDay } from './breakfast'
import { type BuyItem, type Trip, type TripItem, DEFAULT_SHOP_DAY, addDaysIso, daysUntil, shoppingTrips, wdShort } from './kitchen'
import { portionFactor } from './learning'
import { formatAmount, isBought } from './shopping'
import { isQtyStaple, isSpice, removalUseEvents } from './staples'
import { compareShop, shopOrderOf } from './shopSection'
import { type AppState, type TripState, mondayOf, parseIso, shortDate, weekDays } from './store'
import { householdFeedback } from './sync'
import { forgottenItems } from './forgot'
import { type LocalItem, todoSummary } from './haSync'

/** Einkäufe ab heute aus dem App-Zustand (wie in der Liste und für Home Assistant) */
export function tripsOf(s: AppState, today: string): Trip[] {
  const month = new Date(today + 'T12:00:00').getMonth() + 1
  const portion = portionFactor(householdFeedback(s), today)
  const forgot = forgottenItems(s.removals ?? [], today)
  const trips = shoppingTrips({
    today,
    plan: s.plan,
    breakfast: s.breakfast,
    bakePlan: s.bakePlan,
    pantry: s.pantry,
    bought: s.bought,
    prices: s.prices,
    formatStaple: formatAmount,
    month,
    staple: { memo: s.staples, spices: s.spices, portion, extraUse: removalUseEvents(s.removals) },
    // Frühstück wird am Prep-Tag vorbereitet: dann braucht es die Zutaten; vorbei = schon vorbereitet
    breakfastDay: (d) => {
      const p = resolvePrepDay(s.prepDays, weekDays(mondayOf(parseIso(d))), today)
      return p < today ? null : p
    },
    shopDay: s.shopDay,
  })
  // Lernen: oft vergessene Artikel markieren
  if (!Object.keys(forgot).length) return trips
  return trips.map((t) => ({ ...t, buy: t.buy.map((b) => (forgot[b.name] ? { ...b, forgot: forgot[b.name] } : b)) }))
}

// ───────────── Entwurf / Freigabe ─────────────

/** „Heute noch“ ist automatisch freigegeben, wenn der letzte Einkauf (innerhalb einer Woche) freigegeben war */
export function isReleased(trips: Record<string, TripState>, trip: Pick<Trip, 'date' | 'kind'>, today: string): boolean {
  if (trips[trip.date]?.released) return true
  if (trip.kind !== 'now') return false
  return Object.entries(trips).some(([d, t]) => !!t.released && d < today && daysUntil(today, d) <= 7)
}

/** Artikel, die nach der Freigabe dazugekommen sind (gehen automatisch mit an Home Assistant) */
export function newSinceRelease(trip: Trip, st: TripState | undefined): Set<string> {
  if (!st?.released || !st.sent) return new Set()
  const sent = new Set(st.sent)
  return new Set(trip.buy.filter((b) => !sent.has(b.key)).map((b) => b.key))
}

/** Freigeben: merkt sich, was jetzt auf der Liste steht */
export function releaseTrip(trips: Record<string, TripState>, trip: Trip, now: number): Record<string, TripState> {
  return { ...trips, [trip.date]: { ...trips[trip.date], released: now, sent: trip.buy.map((b) => b.key) } }
}

/** Freigabe zurücknehmen (Liste verschwindet aus Home Assistant, Antworten bleiben) */
export function unreleaseTrip(trips: Record<string, TripState>, date: string): Record<string, TripState> {
  const { released: _r, sent: _s, ...rest } = trips[date] ?? {}
  const next = { ...trips }
  if (Object.keys(rest).length) next[date] = rest
  else delete next[date]
  return next
}

const tripLabel = (t: Pick<Trip, 'date' | 'kind'>) => (t.kind === 'now' ? 'heute' : wdShort(t.date))

/**
 * Was an Home Assistant (Google Tasks) geht: nur freigegebene Einkäufe; Schlüssel `<Einkaufstag>|<Artikel>`.
 * Reihenfolge = Rundgang im Laden: je Einkauf (frühester zuerst) nach Abschnitt (`shopOrder`, Standard Kaufland), dann Name.
 * Der Abgleich bringt die Einträge in Google Tasks in genau diese Reihenfolge (siehe syncTodo).
 */
export function haTripItems(trips: Trip[], states: Record<string, TripState>, today: string, shopOrder?: string[]): LocalItem[] {
  const order = shopOrderOf(shopOrder)
  const cmp = compareShop(order)
  // oft vergessen: vorne in seiner Abteilung (und mit ⚠️ im Titel)
  const sort = (a: TripItem, b: TripItem) => order.indexOf(a.cat) - order.indexOf(b.cat) || Number(!!b.forgot) - Number(!!a.forgot) || cmp(a, b)
  return trips
    .filter((t) => isReleased(states, t, today))
    .flatMap((t) => [...t.buy].sort(sort).map((b) => ({ key: `${t.date}|${b.key}`, summary: todoSummary(b, tripLabel(t)), bought: isBought(b) })))
}

/** in HA abgehakter Schlüssel → Einkauf und Artikel */
export function findHaItem(trips: Trip[], key: string): { trip: Trip; item: TripItem } | undefined {
  const i = key.indexOf('|')
  if (i < 0) return undefined
  const trip = trips.find((t) => t.date === key.slice(0, i))
  const item = trip?.buy.find((b) => b.key === key.slice(i + 1))
  return trip && item ? { trip, item } : undefined
}

/** Erinnerung am Vorabend: Einkäufe, die noch Entwurf sind (für plannedReminders) */
export function tripReminderInput(trips: Trip[], states: Record<string, TripState>, today: string): { date: string; items: number }[] {
  return trips
    .filter((t) => t.kind !== 'now' && t.buy.some((b) => !isBought(b)) && !isReleased(states, t, today))
    .map((t) => ({ date: t.date, items: t.buy.filter((b) => !isBought(b)).length }))
}

// ───────────── Liste prüfen ─────────────

/** Zutaten, die man meist im Haus hat */
const USUALLY_HOME = new Set(['Zwiebel', 'Knoblauch', 'Kartoffeln festkochend', 'Kartoffeln mehligkochend', 'Möhre', 'Ei', 'Butter', 'Milch', 'Zitrone', 'Rote Zwiebel', 'Schalotte', 'Ingwer'])

/** wie oft „Habe ich“ je Artikel (über alle Einkäufe) – gelernt beim Prüfen */
export function haveCounts(trips: Record<string, TripState>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const t of Object.values(trips)) for (const [k, v] of Object.entries(t.answers ?? {})) if (v === 'have') out[k] = (out[k] ?? 0) + 1
  return out
}

/** Reihenfolge beim Prüfen: was wahrscheinlich da ist zuerst (Grundzutaten, lange haltbar, typisch im Haus, gelernt) */
export function reviewQueue(trip: Trip, states: Record<string, TripState>, shopOrder?: string[]): TripItem[] {
  const cmp = compareShop(shopOrderOf(shopOrder))
  const counts = haveCounts(states)
  const answered = trip ? states[trip.date]?.answers ?? {} : {}
  const score = (b: BuyItem) => {
    const shelf = PRODUCTS[b.name]?.shelf ?? 0
    return (
      (counts[b.key] ?? 0) * 3 + (isQtyStaple(b.name) || isSpice(b.name) || b.note ? 4 : 0) + (USUALLY_HOME.has(b.name) ? 3 : 0) + (shelf >= 60 ? 2 : shelf >= 14 ? 1 : 0)
    )
  }
  return trip.buy
    .filter((b) => !isBought(b) && !answered[b.key])
    .map((b) => ({ b, s: score(b) }))
    .sort((x, y) => y.s - x.s || cmp(x.b, y.b))
    .map((x) => x.b)
}

/** Menge, die „Habe ich“ in den Vorrat legt (was dieser Einkauf sonst kaufen würde) */
export function haveAmount(it: BuyItem): number {
  const miss = it.required - it.fromPantry
  if (miss <= 1e-6) return it.product.pack
  // lange Haltbares (Zwiebeln, Knoblauch, Kartoffeln …): meist ist eine ganze Packung da – sonst steht es nächste Woche gleich wieder auf der Liste
  return it.product.shelf >= 14 ? Math.max(miss, it.product.pack) : miss
}

/** „Habe ich“: Vorratsposten, der bis zum letzten Kochtag des Einkaufs hält */
export function haveLot(it: BuyItem, amount: number, today: string, id: string) {
  const byShelf = addDaysIso(today, PRODUCTS[it.name]?.shelf ?? it.product.shelf)
  const last = it.days?.[it.days.length - 1]
  return { id, name: it.name, amount, unit: it.unit, expires: last && last > byShelf ? last : byShelf }
}

export function answerTrip(trips: Record<string, TripState>, date: string, key: string, v: 'have' | 'need'): Record<string, TripState> {
  const t = trips[date] ?? {}
  return { ...trips, [date]: { ...t, answers: { ...t.answers, [key]: v } } }
}

/** ab 3× „Habe ich“: „Zwiebeln hast du meist da – im Vorrat führen?“ (einmal fragen) */
export const STOCK_MIN = 3
export function stockSuggestion(name: string, states: Record<string, TripState>, asked: Record<string, 'yes' | 'no'>): boolean {
  return !asked[name] && (haveCounts(states)[name] ?? 0) >= STOCK_MIN
}

// ───────────── Einkaufstag lernen ─────────────

const LEARN_DAYS = 56
const WEEKDAY_ADVERB = ['sonntags', 'montags', 'dienstags', 'mittwochs', 'donnerstags', 'freitags', 'samstags']
export const weekdayAdverb = (d: number) => WEEKDAY_ADVERB[d]

/**
 * Gelernter Haupteinkaufstag aus den Abhak-Tagen (`bought[…][…].at`) der letzten 8 Wochen: der häufigste Wochentag,
 * wenn an mindestens 3 verschiedenen Tagen eingekauft wurde und er mindestens 60 % davon ausmacht.
 */
export function learnedShopDay(bought: AppState['bought'], today: string): number | undefined {
  const from = addDaysIso(today, -LEARN_DAYS)
  const dates = new Set<string>()
  for (const m of Object.values(bought)) for (const b of Object.values(m ?? {})) if (b.at && b.at >= from && b.at <= today && !b.lotId.startsWith('spice:')) dates.add(b.at)
  if (dates.size < 3) return undefined
  const count = new Map<number, number>()
  for (const d of dates) {
    const wd = new Date(d + 'T12:00:00').getDay()
    count.set(wd, (count.get(wd) ?? 0) + 1)
  }
  const [best, n] = [...count].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]
  return n / dates.size >= 0.6 ? best : undefined
}

/** Vorschlag „Einkauf meist freitags – übernehmen?“ (einmal je gelerntem Tag) */
export function shopDaySuggestion(s: Pick<AppState, 'bought' | 'shopDay' | 'shopDayAsked'>, today: string): number | undefined {
  const d = learnedShopDay(s.bought, today)
  if (d == null || d === (s.shopDay ?? DEFAULT_SHOP_DAY) || d === s.shopDayAsked) return undefined
  return d
}

// ───────────── Texte ─────────────

/** „Sa 21.11.“ */
export const tripDateText = (t: Pick<Trip, 'date' | 'kind'>) => (t.kind === 'now' ? 'Heute noch' : `${wdShort(t.date)} ${shortDate(t.date)}`)

/** „deckt Sa–Fr ab“ */
export function tripCoverText(t: Trip): string {
  if (t.kind === 'now') return t.days.length ? `fehlt bis zum nächsten Einkauf (${t.days.map(wdShort).join(', ')})` : 'fehlt bis zum nächsten Einkauf'
  if (t.kind === 'extra') return `frische Zutaten für ${t.days.map(wdShort).join(', ') || wdShort(t.to)}`
  return t.from === t.to ? `deckt ${wdShort(t.from)} ab` : `deckt ${wdShort(t.from)}–${wdShort(t.to)} ab`
}
