/**
 * Frühstück „Fertig vorbereitet“ (Ende des Kochmodus bzw. Prep-Liste) – reine Funktionen.
 *
 * VORRAT OHNE DOPPELBUCHUNG
 *   Beim Fertig-Klick werden die Zutaten für alle Portionen sofort vom Vorrat abgezogen (wie „Fertig gekocht“) und die
 *   Portionen als EIN Posten in den Vorrat gelegt (z. B. „4 Glas Herzhafter Linsensalat“, haltbar laut Rezept).
 *   Die Frühstückstage der Woche mit diesem Rezept bekommen `prep = <Posten-Id>`:
 *     - cookDue (Tag vorbei = gegessen) nimmt dann nur 1 Portion aus diesem Posten statt der Zutaten,
 *     - planWeek/Einkäufe zählen diese Tage nicht mehr als Bedarf (nichts wird neu eingekauft).
 *   Erneutes „Fertig“ für dieselbe Woche ersetzt die alte Vorbereitung (erst zurücknehmen, dann neu) → nie doppelt.
 *   Rückgängig: Zutaten zurück, Posten weg; schon gegessene Tage werden wieder normal aus den Zutaten abgezogen.
 *
 * LERNEN
 *   Vorbereitet zählt wie „gekocht“ (+0,8), Bewertung (`bfRatings`, Schlüssel `Prep-Tag:Rezept-Id`) wie beim Abendessen,
 *   Sättigung „Hat es bis mittags satt gemacht?“ (`bfSatiety`, gleicher Schlüssel) siehe learning.ts.
 *   Persönlich: nur die Person auf diesem Gerät isst/bewertet Frühstück (Abgleich im eigenen Personen-Dokument).
 */
import { RECIPE_BY_ID } from './data/recipes'
import { type PantryLot, addDaysIso, allNeedsOf, uid } from './kitchen/base'
import { consume, cookDue } from './kitchen/pantry'
import type { Recipe, WeekPlan } from './types'

/** Eine erledigte Frühstücks-Vorbereitung */
export interface BfPrep {
  /** Woche (Montag, ISO) */
  week: string
  recipeId: string
  /** Tag der Vorbereitung (ISO) */
  date: string
  portions: number
  /** Vorratsposten mit den Portionen */
  lotId: string
  /** verknüpfte Frühstückstage (bekommen je 1 Portion aus dem Posten) */
  days: string[]
  /** beim Vorbereiten entnommene Zutaten (für Rückgängig) */
  consumed: PantryLot[]
}

export const BF_PREPS_MAX = 60

/** Schritt-Schlüssel der Prep-Liste (state.prepChecked) */
export const prepKey = (rid: string, i: number) => `${rid}:${i}`

const PLURAL: Record<string, string> = { Glas: 'Gläser', Dose: 'Dosen', Box: 'Boxen', Schale: 'Schalen', Flasche: 'Flaschen', Tüte: 'Tüten', Becher: 'Becher', Beutel: 'Beutel' }

/** Einheit des Postens im Vorrat: der Behälter („Glas (ofenfest)“ → „Glas“), unbekannte Behälter als „Portion“ */
export function containerUnit(container: string): string {
  const c = (container.trim() || 'Glas').split(' ')[0]
  return c in PLURAL ? c : 'Portion'
}

/** „1 Glas“ / „4 Gläser“ / „4 Portionen“ */
export function containerText(container: string, n: number): string {
  const u = containerUnit(container)
  return `${n} ${n === 1 ? u : u === 'Portion' ? 'Portionen' : PLURAL[u]}`
}

/** Name des Postens im Vorrat (Rezepttitel) */
export const preppedName = (r: Recipe) => r.title

/** „4 Gläser Herzhafter Linsensalat“ */
export function preppedText(r: Recipe, portions: number): string {
  return `${containerText(r.breakfast?.container ?? 'Glas', portions)} ${preppedName(r)}`
}

/** „hält 4 Tage im Kühlschrank“ (+ einfrierbar) */
export function preppedKeep(r: Recipe): string {
  const b = r.breakfast!
  return `hält ${b.fridgeDays} ${b.fridgeDays === 1 ? 'Tag' : 'Tage'} im Kühlschrank${b.freezer ? ', lässt sich einfrieren' : ''}`
}

/** Mo–Fr einer Woche (Montag ISO) */
const workdaysOf = (week: string) => Array.from({ length: 5 }, (_, i) => addDaysIso(week, i))

/** Noch offene (nicht gegessene, nicht vorbereitete) Frühstückstage dieses Rezepts in der Woche, nach dem Prep-Tag */
export function openPrepDays(breakfast: WeekPlan, recipeId: string, week: string, today: string): string[] {
  return workdaysOf(week).filter((d) => {
    const e = breakfast[d]
    return d > today && !!e && e.recipeId === recipeId && !e.status && !e.prep
  })
}

/**
 * Für welche Woche gilt „Fertig vorbereitet“? Unter den Kandidaten (angezeigte Woche, aktuelle, nächste) die erste,
 * in der das Rezept gewählt ist und noch offene Tage hat; sonst die erste, in der es gewählt ist; sonst die angezeigte.
 */
export function prepWeek(picks: Record<string, string[]>, breakfast: WeekPlan, recipeId: string, today: string, candidates: string[]): string {
  const weeks = [...new Set(candidates)]
  return (
    weeks.find((w) => (picks[w] ?? []).includes(recipeId) && openPrepDays(breakfast, recipeId, w, today).length > 0) ??
    weeks.find((w) => (picks[w] ?? []).includes(recipeId)) ??
    weeks[0]
  )
}

export interface PrepState {
  breakfast: WeekPlan
  pantry: PantryLot[]
  prepChecked: Record<string, string[]>
  bfPreps: BfPrep[]
}

/** Vorbereitung dieses Rezepts in dieser Woche (falls schon erledigt) */
export const findPrep = (preps: BfPrep[], week: string, recipeId: string) => preps.find((p) => p.week === week && p.recipeId === recipeId)

/**
 * Vorbereitung zurücknehmen: Zutaten zurück in den Vorrat, Portionen-Posten entfernen, Tage entkoppeln.
 * Schon gegessene Tage (aus dem Posten) werden wieder normal aus den Zutaten abgezogen (wie ohne Vorbereitung).
 */
export function undoPrep(s: PrepState, week: string, recipeId: string, today: string): PrepState {
  const p = findPrep(s.bfPreps, week, recipeId)
  if (!p) return s
  let pantry = s.pantry.filter((l) => l.id !== p.lotId).map((l) => ({ ...l }))
  for (const c of p.consumed) {
    const same = pantry.find((l) => l.id === c.id)
    if (same) {
      same.amount += c.amount
      if (c.expires > same.expires) same.expires = c.expires
    } else pantry.push({ ...c })
  }
  let breakfast: WeekPlan = { ...s.breakfast }
  for (const [d, e] of Object.entries(breakfast)) {
    if (!e || e.prep !== p.lotId) continue
    const { prep: _p, consumed: _c, status, ...rest } = e
    // gegessen (Portion aus dem Posten) → gilt wieder als offen und wird gleich aus den Zutaten abgezogen
    breakfast[d] = status === 'skipped' ? { ...rest, status } : rest
  }
  const due = cookDue(breakfast, pantry, today)
  breakfast = due.plan
  pantry = due.pantry
  const keys = new Set((RECIPE_BY_ID[recipeId]?.steps ?? []).map((_, i) => prepKey(recipeId, i)))
  const prepChecked = { ...s.prepChecked, [week]: (s.prepChecked[week] ?? []).filter((k) => !keys.has(k)) }
  return { breakfast, pantry, prepChecked, bfPreps: s.bfPreps.filter((x) => x !== p) }
}

/**
 * „Fertig vorbereitet“: Zutaten für `portions` abziehen, Portionen als Posten in den Vorrat, offene Frühstückstage der
 * Woche verknüpfen (höchstens so viele wie Portionen), Prep-Liste dieses Rezepts abhaken. Eine frühere Vorbereitung
 * desselben Rezepts in derselben Woche wird vorher zurückgenommen (nie doppelt abgezogen).
 */
export function finishPrep(
  s0: PrepState,
  recipe: Recipe,
  portions: number,
  week: string,
  today: string,
  id = uid(),
): { state: PrepState; prep: BfPrep } {
  const s = undoPrep(s0, week, recipe.id, today)
  const n = Math.max(1, Math.round(portions))
  const lots = s.pantry.map((l) => ({ ...l }))
  const consumed: PantryLot[] = []
  for (const need of allNeedsOf(recipe, n)) consumed.push(...consume(lots, need.name, need.amount, today))
  const days = openPrepDays(s.breakfast, recipe.id, week, today).slice(0, n)
  const b = recipe.breakfast
  // Haltbarkeit laut Rezept; einfrierbare Portionen halten bis zum letzten verknüpften Tag
  const fridge = addDaysIso(today, b?.fridgeDays ?? 3)
  const last = days[days.length - 1]
  const expires = b?.freezer && last && last > fridge ? last : fridge
  lots.push({ id, name: preppedName(recipe), amount: n, unit: containerUnit(b?.container ?? 'Glas'), expires })
  const breakfast: WeekPlan = { ...s.breakfast }
  for (const d of days) breakfast[d] = { ...breakfast[d]!, prep: id }
  const keys = recipe.steps.map((_, i) => prepKey(recipe.id, i))
  const prepChecked = { ...s.prepChecked, [week]: [...new Set([...(s.prepChecked[week] ?? []), ...keys])] }
  const prep: BfPrep = { week, recipeId: recipe.id, date: today, portions: n, lotId: id, days, consumed }
  return { state: { breakfast, pantry: lots, prepChecked, bfPreps: [...s.bfPreps, prep].slice(-BF_PREPS_MAX) }, prep }
}

/** Schlüssel für Bewertung/Sättigung: `Prep-Tag:Rezept-Id` */
export const prepRatingKey = (p: Pick<BfPrep, 'date' | 'recipeId'>) => `${p.date}:${p.recipeId}`

/** so lange nach dem ersten Frühstückstag wird nach der Sättigung gefragt */
const SATIETY_ASK_DAYS = 4

/**
 * Sättigungsfrage „Hat es bis mittags satt gemacht?“: am ersten Frühstückstag nach der Vorbereitung ab mittags
 * (12 Uhr) bzw. ab dem Tag danach, höchstens 4 Tage lang; nicht beantwortet, nicht weggeklickt. Neueste zuerst.
 */
export function pendingSatiety(
  preps: BfPrep[],
  satiety: Record<string, number>,
  dismissed: string[],
  today: string,
  hour: number,
): BfPrep | undefined {
  return [...preps]
    .reverse()
    .find((p) => {
      const first = p.days[0]
      if (!first || !RECIPE_BY_ID[p.recipeId]) return false
      const key = prepRatingKey(p)
      if (satiety[key] !== undefined || dismissed.includes(key)) return false
      if (today < first || (today === first && hour < 12)) return false
      return today <= addDaysIso(first, SATIETY_ASK_DAYS)
    })
}

/** Vorbereitungen prüfen (Speicher/Sicherung) */
export function sanitizePreps(x: unknown): BfPrep[] {
  if (!Array.isArray(x)) return []
  const ISO = /^\d{4}-\d{2}-\d{2}$/
  const out: BfPrep[] = []
  for (const v of x) {
    const p = v as Partial<BfPrep> | null
    if (!p || typeof p !== 'object' || typeof p.recipeId !== 'string' || !RECIPE_BY_ID[p.recipeId]) continue
    if (typeof p.week !== 'string' || !ISO.test(p.week) || typeof p.date !== 'string' || !ISO.test(p.date) || typeof p.lotId !== 'string' || !p.lotId) continue
    const portions = typeof p.portions === 'number' && Number.isFinite(p.portions) && p.portions >= 1 ? Math.min(20, Math.round(p.portions)) : 1
    const days = Array.isArray(p.days) ? p.days.filter((d): d is string => typeof d === 'string' && ISO.test(d)) : []
    const consumed = Array.isArray(p.consumed)
      ? p.consumed.filter(
          (l): l is PantryLot =>
            !!l && typeof l === 'object' && typeof l.id === 'string' && typeof l.name === 'string' && typeof l.unit === 'string' &&
            typeof l.amount === 'number' && Number.isFinite(l.amount) && l.amount > 0 && typeof l.expires === 'string' && ISO.test(l.expires),
        ).map((l) => ({ id: l.id, name: l.name, amount: l.amount, unit: l.unit, expires: l.expires }))
      : []
    out.push({ week: p.week, recipeId: p.recipeId, date: p.date, portions, lotId: p.lotId, days, consumed })
  }
  return out.slice(-BF_PREPS_MAX)
}
