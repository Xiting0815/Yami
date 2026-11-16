/**
 * Meal-Prep-Frühstück: Verteilung auf die Arbeitstage nach Haltbarkeit und Prep-Liste für den Sonntag.
 */
import { RECIPE_BY_ID } from './data/recipes'
import { addDaysIso, daysUntil } from './kitchen'
import { isoDate, mondayOf, parseIso, weekdayName } from './store'
import type { Ingredient, Recipe } from './types'

/** Arbeitstage Mo–Fr einer Woche (days = Mo–So) */
export function workdays(days: string[]): string[] {
  return days.slice(0, 5)
}

/** Standard: vorbereitet wird am Sonntag vor der Woche */
export function prepDay(days: string[]): string {
  return addDaysIso(days[0], -1)
}

/** Mögliche Prep-Tage einer Woche: Sonntag davor bis Donnerstag */
export function prepOptions(days: string[]): string[] {
  return Array.from({ length: 5 }, (_, i) => addDaysIso(days[0], i - 1))
}

/** Arbeitstage, die ein Prep-Tag abdeckt: alle Mo–Fr strikt nach dem Prep-Tag */
export function coveredDays(days: string[], prep: string = prepDay(days)): string[] {
  return workdays(days).filter((d) => d > prep)
}

const LEARN_WEEKS = 8

/**
 * Gelernter Standard-Wochentag (JS: 0 = So … 4 = Do) fürs Vorbereiten: der häufigste Tag der gespeicherten
 * Prep-Tage der letzten ~8 Wochen, aber erst ab 2 gleichen. Sonst Sonntag.
 */
export function learnedPrepWeekday(prepDays: Record<string, string>, today: string): number {
  const from = addDaysIso(today, -7 * LEARN_WEEKS)
  const to = addDaysIso(today, 7)
  const count = new Map<number, { n: number; last: string }>()
  for (const iso of Object.values(prepDays)) {
    if (typeof iso !== 'string' || iso < from || iso > to) continue
    const dow = parseIso(iso).getDay()
    if (dow > 4) continue
    const c = count.get(dow) ?? { n: 0, last: '' }
    count.set(dow, { n: c.n + 1, last: iso > c.last ? iso : c.last })
  }
  let best = 0
  let bestC = { n: 1, last: '' }
  for (const [dow, c] of count) if (c.n >= 2 && (c.n > bestC.n || (c.n === bestC.n && c.last > bestC.last))) { best = dow; bestC = c }
  return best
}

/** Prep-Tag einer Woche: gespeichert (und gültig), sonst gelernter Wochentag, sonst Sonntag davor */
export function resolvePrepDay(prepDays: Record<string, string>, days: string[], today: string): string {
  const opts = prepOptions(days)
  const stored = prepDays[days[0]]
  if (stored && opts.includes(stored)) return stored
  const learned = learnedPrepWeekday(prepDays, today)
  return opts.find((d) => parseIso(d).getDay() === learned) ?? opts[0]
}

/** „Du bereitest meist montags vor“ – Adverb zum Wochentag */
export const PREP_ADVERB = ['sonntags', 'montags', 'dienstags', 'mittwochs', 'donnerstags']

/** Montag (ISO) der Woche, in der ein Datum liegt */
export const mondayIso = (iso: string) => isoDate(mondayOf(parseIso(iso)))

export interface BreakfastAssignment {
  /** Tag → Rezept-ID */
  days: Record<string, string>
  /** Tage, deren Portion eingefroren werden muss */
  frozen: string[]
  /** Hinweise, z. B. wenn ein Tag nicht abgedeckt ist */
  notes: string[]
}

/**
 * 1–2 gewählte Frühstücke auf Mo–Fr verteilen. Das kürzer haltbare kommt an den Wochenanfang,
 * das länger haltbare (oder einfrierbare) ans Ende.
 */
export function assignBreakfasts(ids: string[], days: string[], prep: string = prepDay(days)): BreakfastAssignment {
  const work = coveredDays(days, prep)
  const recipes = ids.map((id) => RECIPE_BY_ID[id]).filter((r): r is Recipe => !!r?.breakfast)
  const out: BreakfastAssignment = { days: {}, frozen: [], notes: [] }
  if (!recipes.length) return out

  const sorted = [...recipes].sort((a, b) => a.breakfast!.fridgeDays - b.breakfast!.fridgeDays)
  const plan: Recipe[] =
    sorted.length === 1
      ? work.map(() => sorted[0])
      : work.map((_, i) => (i < Math.min(3, sorted[0].breakfast!.fridgeDays) ? sorted[0] : sorted[1]))

  work.forEach((day, i) => {
    const r = plan[i]
    const ageDays = daysUntil(day, prep) // Tage seit dem Prep-Tag
    if (ageDays <= r.breakfast!.fridgeDays) out.days[day] = r.id
    else if (r.breakfast!.freezer) {
      out.days[day] = r.id
      out.frozen.push(day)
    }
  })

  const uncovered = work.filter((d) => !out.days[d])
  if (uncovered.length) {
    const names = uncovered.map((d) => weekdayName(d, true)).join(', ')
    out.notes.push(
      sorted.length === 1
        ? `Für ${names} hält ${sorted[0].title} nicht lange genug – wähle ein zweites, länger haltbares Frühstück.`
        : `Für ${names} hält keins der beiden lange genug – tausche eins gegen ein länger haltbares oder einfrierbares.`,
    )
  }
  if (out.frozen.length) {
    const first = out.frozen[0]
    out.notes.push(
      `Portionen für ${out.frozen.map((d) => weekdayName(d, true)).join(' & ')} am ${weekdayName(prep)} einfrieren und jeweils am Vorabend (ab ${weekdayName(addDaysIso(first, -1))}) in den Kühlschrank legen.`,
    )
  }
  return out
}

export interface PrepItem {
  recipe: Recipe
  portions: number
  days: string[]
  frozenDays: string[]
  ingredients: Ingredient[]
}

/** Prep-Liste: je Rezept Portionen, Zutaten (hochgerechnet) und Schritte – Ofengerichte zuerst */
export function prepPlan(assignment: BreakfastAssignment): PrepItem[] {
  const byRecipe = new Map<string, string[]>()
  for (const [day, id] of Object.entries(assignment.days).sort()) byRecipe.set(id, [...(byRecipe.get(id) ?? []), day])
  const items: PrepItem[] = [...byRecipe].map(([id, days]) => {
    const recipe = RECIPE_BY_ID[id]
    const portions = days.length
    return {
      recipe,
      portions,
      days,
      frozenDays: days.filter((d) => assignment.frozen.includes(d)),
      ingredients: recipe.ingredients.map((i) => ({ ...i, amount: i.amount == null ? null : i.amount * portions })),
    }
  })
  const usesOven = (r: Recipe) => r.steps.some((s) => /Ofen/.test(s))
  return items.sort((a, b) => Number(usesOven(b.recipe)) - Number(usesOven(a.recipe)))
}

/** Grobe Gesamtzeit für den Prep-Sonntag (parallel laufende Ofenzeit eingerechnet) */
export function prepMinutes(items: PrepItem[]): number {
  if (!items.length) return 0
  const times = items.map((i) => i.recipe.time + Math.max(0, i.portions - 1) * 2)
  return Math.max(...times) + Math.round(times.reduce((a, b) => a + b, 0) - Math.max(...times)) / 2
}
