/**
 * Fehlt etwas? – Warnung am Tag, „Noch kaufen“, Ersatz, automatisches Verschieben, Hinweise aufs Handy und
 * „oft vergessen“ (alles reine Funktionen auf dem App-Zustand, testbar ohne React).
 *
 * WARNUNG   Für jedes noch offene Abendessen (dazu Frühstück-Prep und Backen) ab heute wird Tag für Tag vom Vorrat gekocht
 *           (src/kitchen/shortage.ts). Was ein kommender Einkauf VOR dem Tag mitbringt (Haupteinkauf, Zusatzeinkauf),
 *           fehlt nicht. Der „Heute noch“-Einkauf zählt erst, wenn du „Noch kaufen“ gedrückt hast (er ist dann
 *           freigegeben und die Artikel stehen in `sent`) – dann zeigt die Karte nur „kommt mit Heute noch“.
 * VERSCHIEBEN  Wird ein Gericht durch eine Vorratsänderung unkochbar, tauscht Yami es mit dem nächsten späteren Tag, an dem
 *           beide Gerichte kochbar sind (bzw. legt es auf einen freien Tag hinter dem nächsten Einkauf – das Fehlende
 *           landet dann automatisch auf dessen Liste). Nicht, wenn frische Zutaten aus dem Vorrat bis dahin verderben
 *           würden, nicht auf gekochte/abgeschlossene Tage, ein aufwendiges Wochenendgericht (> 60 Min.) nicht auf einen
 *           Werktag. Jedes Gericht nur einmal in 14 Tagen (ShiftRecord, geteilt) – kein Ping-Pong.
 * LERNEN    „Vergessen zu kaufen“ zählt je Zutat (Halbwertszeit 60 Tage, Haushalt) → „⚠️ oft vergessen“ auf Einkaufsliste,
 *           Prüfliste und in Google Tasks; „Aufgebraucht“ bei Grundzutaten zählt als Verbrauch (lernt, wann sie leer werden).
 */
import { RECIPE_BY_ID } from './data/recipes'
import { standInsFor } from './data/substitutes'
import { resolvePrepDay } from './breakfast'
import { bakeEntriesOf } from './bakePlan'
import { isWorkday } from './energy'
import {
  type IncomingLot, type ShortUse, type Trip, type UseShortage, addDaysIso, canonical, daysUntil, keepsUntil, lotsFor, simulateShortages, uid, wdShort,
} from './kitchen'
import { portionFactor } from './learning'
import { isBought } from './shopping'
import { type AppState, type ShiftRecord, type TripState, SHIFTS_MAX, mondayOf, parseIso, weekDays, weekdayName } from './store'
import { householdFeedback } from './sync'
import { releaseTrip, tripsOf } from './tripState'
import type { Recipe, WeekPlan } from './types'
import { isBbq } from './types'

/** so weit voraus wird gewarnt / verschoben */
export const SHORT_HORIZON = 13
/** so weit darf ein Gericht höchstens wandern */
export const SHIFT_MAX_DAYS = 7
/** dasselbe Gericht wird so lange nicht noch einmal automatisch verschoben */
export const SHIFT_ONCE_DAYS = 14
/** aufwendige Gerichte (Minuten) bleiben am Wochenende */
export const WEEKEND_ONLY_MIN = 60

const pfOf = (s: AppState, today: string) => portionFactor(householdFeedback(s), today)

/** offene Gerichte ab heute: Abendessen (× gelernte Portion), Frühstück am Vorbereitungstag, Backen */
export function shortUses(s: AppState, today: string, end = addDaysIso(today, SHORT_HORIZON)): ShortUse[] {
  const pf = pfOf(s, today)
  const out: ShortUse[] = []
  for (const [d, e] of Object.entries(s.plan)) {
    if (!e || e.status || d < today || d > end || !RECIPE_BY_ID[e.recipeId]) continue
    out.push({ day: d, kind: 'dinner', recipeId: e.recipeId, servings: e.servings * pf, ...(e.swap ? { swap: e.swap } : {}) })
  }
  for (const [d, e] of Object.entries(s.breakfast)) {
    if (!e || e.status || e.prep || d < today || d > end || !RECIPE_BY_ID[e.recipeId]) continue
    const p = resolvePrepDay(s.prepDays, weekDays(mondayOf(parseIso(d))), today)
    if (p < today) continue
    out.push({ day: p, kind: 'breakfast', recipeId: e.recipeId, servings: e.servings })
  }
  for (const [d, e] of bakeEntriesOf(s.bakePlan, today)) if (d >= today && d <= end) out.push({ day: d, kind: 'bake', recipeId: e.recipeId, servings: e.servings })
  return out
}

/** „Noch kaufen“ gedrückt: Artikel steht auf dem freigegebenen „Heute noch“-Einkauf */
export const committed = (states: Record<string, TripState>, trip: Pick<Trip, 'date'>, key: string) =>
  !!states[trip.date]?.released && !!states[trip.date]?.sent?.includes(key)

/** was kommende Einkäufe mitbringen (abgehaktes liegt schon im Vorrat) */
export function incomingLots(trips: Trip[], states: Record<string, TripState>): IncomingLot[] {
  const out: IncomingLot[] = []
  for (const t of trips)
    for (const b of t.buy) {
      if (isBought(b)) continue
      const amount = b.packs * b.product.pack - b.bought
      if (amount <= 1e-6) continue
      const now = t.kind === 'now'
      if (now && !committed(states, t, b.key)) continue
      out.push({ id: `in:${t.date}:${b.name}`, name: b.name, amount, unit: b.unit, expires: addDaysIso(t.date, b.product.shelf), from: t.date, trip: t.date, ...(now ? { now } : {}) })
    }
  return out
}

/** Fehlmengen aller offenen Gerichte ab heute (auch ohne Fehlendes – mit `fromPantry`) */
export function shortagesOf(s: AppState, today: string, trips: Trip[] = tripsOf(s, today)): UseShortage[] {
  return simulateShortages(shortUses(s, today), s.pantry, incomingLots(trips, s.trips))
}

/** nur, was auf einer Tageskarte erscheint (fehlt etwas oder kommt mit „Heute noch“) */
export function warningsOf(s: AppState, today: string, trips?: Trip[]): UseShortage[] {
  return shortagesOf(s, today, trips).filter((u) => u.missing.length || u.coming.length)
}

const totalMissing = (list: UseShortage[]) => list.reduce((n, u) => n + u.missing.length, 0)
const dinnerOn = (list: UseShortage[], day: string) => list.find((u) => u.kind === 'dinner' && u.day === day)

/** „Sahne, Speckwürfel“ */
export const namesText = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} und ${names[names.length - 1]}` : names[0] ?? '')

// ───────────── Verschieben ─────────────

const weekendOk = (r: Recipe | undefined, from: string, to: string) => !r || !isWorkday(to) || isWorkday(from) || r.time <= WEEKEND_ONLY_MIN

export interface ShiftPlan {
  from: string
  to: string
  other?: string
  missing: string[]
  plan: WeekPlan
}

/**
 * Nächster spätere Tag, an dem das Gericht von `day` (fehlt etwas) kochbar ist – getauscht mit dem Gericht dort, das am
 * alten Tag kochbar sein muss, oder auf einen freien Tag. Frisches aus dem Vorrat muss bis dahin halten.
 */
export function findShift(s: AppState, today: string, day: string, trips?: Trip[]): ShiftPlan | null {
  const e = s.plan[day]
  if (!e || e.status || day < today) return null
  const all = shortagesOf(s, today, trips)
  const cur = dinnerOn(all, day)
  if (!cur?.missing.length) return null
  const base = totalMissing(all) - cur.missing.length
  const r = RECIPE_BY_ID[e.recipeId]
  const last = addDaysIso(today, SHORT_HORIZON)
  for (let i = 1; i <= SHIFT_MAX_DAYS; i++) {
    const to = addDaysIso(day, i)
    if (to > last) break
    // frische Zutaten aus dem Vorrat würden bis dahin verderben → lieber nur warnen
    if (!keepsUntil(s.pantry, cur.fromPantry, to)) break
    const o = s.plan[to]
    if (o?.status) continue
    const or = o ? RECIPE_BY_ID[o.recipeId] : undefined
    if (!weekendOk(r, day, to) || !weekendOk(or, to, day)) continue
    const plan: WeekPlan = { ...s.plan, [to]: e }
    if (o) plan[day] = o
    else delete plan[day]
    const sh = shortagesOf({ ...s, plan }, today)
    if (dinnerOn(sh, to)?.missing.length || (o && dinnerOn(sh, day)?.missing.length)) continue
    if (totalMissing(sh) > base) continue
    return { from: day, to, ...(o ? { other: o.recipeId } : {}), missing: cur.missing.map((m) => m.name), plan }
  }
  return null
}

/** wurde dieses Gericht in letzter Zeit schon automatisch verschoben (auch zurückgenommen)? */
export const recentlyShifted = (shifts: ShiftRecord[], recipeId: string, today: string) =>
  shifts.some((x) => x.recipeId === recipeId && daysUntil(today, x.date) <= SHIFT_ONCE_DAYS && x.date <= today)

/**
 * Nach einer Vorratsänderung (`before` → `after`): Abendessen, die dadurch neu unkochbar werden (und das Fehlende kommt
 * nicht rechtzeitig mit einem Einkauf), automatisch verschieben – je Gericht höchstens einmal (gemerkt in `shifts`).
 */
export function autoShift(before: AppState, after: AppState, today: string): { state: AppState; records: ShiftRecord[] } {
  const sb = shortagesOf(before, today)
  const sa = shortagesOf(after, today)
  const newly = sa.filter(
    (u) =>
      u.kind === 'dinner' && u.missing.length > 0 &&
      !sb.some((b) => b.kind === 'dinner' && b.day === u.day && b.recipeId === u.recipeId && u.missing.every((m) => b.missing.some((x) => x.name === m.name))),
  )
  let cur = after
  const records: ShiftRecord[] = []
  for (const u of newly.slice(0, 3)) {
    if (recentlyShifted(cur.shifts, u.recipeId, today) || cur.plan[u.day]?.recipeId !== u.recipeId) continue
    const f = findShift(cur, today, u.day)
    if (!f) continue
    const rec: ShiftRecord = { id: uid(), recipeId: u.recipeId, from: f.from, to: f.to, ...(f.other ? { other: f.other } : {}), missing: f.missing, date: today }
    cur = { ...cur, plan: f.plan, shifts: [...cur.shifts, rec].slice(-SHIFTS_MAX) }
    records.push(rec)
  }
  return { state: cur, records }
}

/** „Kohlrouladen auf Do verschoben, weil Sahne fehlt“ */
export function shiftText(r: Pick<ShiftRecord, 'recipeId' | 'to' | 'missing'>): string {
  const title = RECIPE_BY_ID[r.recipeId]?.title ?? 'Gericht'
  return `${title} auf ${wdShort(r.to)} verschoben, weil ${namesText(r.missing)} fehl${r.missing.length > 1 ? 'en' : 't'}`
}

/** Verschiebung zurücknehmen (nur wenn der Plan noch so aussieht); bleibt als „zurückgenommen“ gemerkt */
export function undoShift(s: AppState, id: string): AppState {
  const rec = s.shifts.find((x) => x.id === id)
  if (!rec || rec.undone) return s
  const shifts = s.shifts.map((x) => (x.id === id ? { ...x, undone: true as const } : x))
  const moved = s.plan[rec.to]
  const back = s.plan[rec.from]
  const intact = moved?.recipeId === rec.recipeId && !moved.status && (rec.other ? back?.recipeId === rec.other && !back.status : !back)
  if (!intact) return { ...s, shifts }
  const plan: WeekPlan = { ...s.plan, [rec.from]: moved }
  if (back) plan[rec.to] = back
  else delete plan[rec.to]
  return { ...s, plan, shifts }
}

/** Verschiebungen, die gerade zu sehen sein sollen (nicht zurückgenommen, Ziel ab heute, Gericht steht noch dort) */
export function activeShifts(s: AppState, today: string): ShiftRecord[] {
  return s.shifts.filter((x) => !x.undone && x.to >= today && x.date >= addDaysIso(today, -SHIFT_MAX_DAYS) && s.plan[x.to]?.recipeId === x.recipeId && !s.plan[x.to]?.status)
}

// ───────────── Noch kaufen ─────────────

/** „Noch kaufen“: „Heute noch“-Einkauf freigeben (geht wie jede freigegebene Liste an Google Tasks) */
export function commitBuy(s: AppState, trips: Trip[], now: number): { trips: AppState['trips']; trip?: Trip } {
  const t = trips.find((x) => x.kind === 'now')
  if (!t) return { trips: s.trips }
  return { trips: releaseTrip(s.trips, t, now), trip: t }
}

// ───────────── Ersatz ─────────────

export interface StandIn {
  from: string
  to: string
}

/** Ersatz aus dem Vorrat für Fehlendes eines Abendessens, der es wirklich kochbar macht (ohne woanders etwas wegzunehmen) */
export function standInsOf(s: AppState, today: string, day: string, trips?: Trip[]): StandIn[] {
  const e = s.plan[day]
  const r = e ? RECIPE_BY_ID[e.recipeId] : undefined
  if (!e || !r || e.status) return []
  const all = shortagesOf(s, today, trips)
  const cur = dinnerOn(all, day)
  if (!cur?.missing.length) return []
  const own = new Set(r.ingredients.map((i) => canonical(i.name)))
  const out: StandIn[] = []
  for (const m of cur.missing) {
    if (!own.has(m.name)) continue
    for (const sub of standInsFor(m.name)) {
      if (own.has(sub) || !lotsFor(s.pantry, sub, day).length) continue
      const plan: WeekPlan = { ...s.plan, [day]: { ...e, swap: { ...e.swap, [m.name]: sub } } }
      const sh = shortagesOf({ ...s, plan }, today)
      const u = dinnerOn(sh, day)
      if (u?.missing.some((x) => x.name === m.name || x.name === sub)) continue
      if (totalMissing(sh) > totalMissing(all) - 1) continue
      out.push({ from: m.name, to: sub })
      break
    }
  }
  return out
}

// ───────────── Handy-Hinweise ─────────────

export interface PushAlert {
  key: string
  title: string
  message: string
}

/** Sofort-Hinweise: heute/morgen fehlt etwas oder ein Gericht von heute/morgen wurde verschoben */
export function pushAlerts(s: AppState, today: string, now: Date, trips?: Trip[]): PushAlert[] {
  const tomorrow = addDaysIso(today, 1)
  const when = (d: string) => (d === today ? 'Heute' : 'Morgen')
  const out: PushAlert[] = []
  for (const u of shortagesOf(s, today, trips)) {
    if (!u.missing.length || (u.day !== today && u.day !== tomorrow)) continue
    if (u.day === today && now.getHours() >= 21) continue
    const names = u.missing.map((m) => m.name).sort()
    const title = RECIPE_BY_ID[u.recipeId]?.title ?? 'Gericht'
    const what = u.kind === 'dinner' ? title : u.kind === 'breakfast' ? `Frühstück-Prep (${title})` : `${isBbq(RECIPE_BY_ID[u.recipeId]) ? 'BBQ' : 'Backen'} (${title})`
    out.push({
      key: `miss:${u.day}:${u.kind}:${u.recipeId}:${names.join(',')}`,
      title: `⚠️ ${when(u.day)} fehlt: ${namesText(names)}`,
      message: `Für ${what} fehlt ${namesText(names)}. In Yami: noch kaufen, verschieben oder Ersatz nehmen.`,
    })
  }
  for (const x of s.shifts) {
    if (x.undone || x.date < addDaysIso(today, -1) || ![x.from, x.to].some((d) => d === today || d === tomorrow)) continue
    const other = x.other ? RECIPE_BY_ID[x.other]?.title : undefined
    out.push({
      key: `shift:${x.id}`,
      title: `↪️ ${RECIPE_BY_ID[x.recipeId]?.title ?? 'Gericht'} verschoben`,
      message: `${shiftText(x)}.${other ? ` ${weekdayName(x.from)} gibt es dafür ${other}.` : ''} In Yami lässt es sich rückgängig machen oder doch noch kaufen.`,
    })
  }
  return out
}
