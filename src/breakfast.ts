/**
 * Meal-Prep-Frühstück: Verteilung auf die Arbeitstage nach Haltbarkeit und Prep-Liste für den Sonntag.
 */
import { RECIPE_BY_ID } from './data/recipes'
import { addDaysIso, daysUntil } from './kitchen'
import { isoDate, mondayOf, parseIso, shortDate, weekdayName } from './store'
import type { Ingredient, Recipe, WeekPlan } from './types'

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
export function learnedPrepWeekday(prepDays: Record<string, string>, today: string, late: string[] = []): number {
  const from = addDaysIso(today, -7 * LEARN_WEEKS)
  const to = addDaysIso(today, 7)
  const count = new Map<number, { n: number; last: string }>()
  for (const [week, iso] of Object.entries(prepDays)) {
    // später Einstieg mitten in der Woche („heute vorbereiten“) verrät nichts über den üblichen Tag
    if (late.includes(week)) continue
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

/** was der Prep-Tag außer `prepDays` braucht: erledigte Vorbereitungen (BfPrep) und Wochen mit spätem Einstieg */
export interface PrepExtra {
  preps?: { week: string; date: string }[]
  late?: string[]
  /** gewählte Frühstücke je Woche: schon gewählt → kein später Einstieg (dann gilt der übliche Tag) */
  picks?: Record<string, string[]>
}

/**
 * Prep-Tag einer Woche, mit `late`: gespeichert (und gültig), sonst gelernter Wochentag, sonst Sonntag davor.
 * Später Einstieg: liegt dieser Tag schon zurück, ist für die Woche nichts gewählt (nichts gespeichert/gewählt) und nichts
 * vorbereitet, wird HEUTE vorbereitet (`late` = true) – nur, solange heute noch ein möglicher Prep-Tag (So–Do) ist.
 * Wurde in der Woche schon vorbereitet, gilt der Tag der Vorbereitung. Ein später Einstieg wird beim Wählen mit
 * gespeichert (damit die Verteilung stehen bleibt), aber in `prepLate` vermerkt und zählt nicht für den gelernten Wochentag.
 */
export function prepDayInfo(prepDays: Record<string, string>, days: string[], today: string, extra: PrepExtra = {}): { day: string; late: boolean } {
  const { preps = [], late = [], picks = {} } = extra
  const opts = prepOptions(days)
  const stored = prepDays[days[0]]
  if (stored && opts.includes(stored)) return { day: stored, late: late.includes(days[0]) }
  const learned = learnedPrepWeekday(prepDays, today, late)
  const usual = opts.find((d) => parseIso(d).getDay() === learned) ?? opts[0]
  if (usual >= today) return { day: usual, late: false }
  const done = preps.filter((p) => p.week === days[0] && opts.includes(p.date)).map((p) => p.date).sort()[0]
  if (done) return { day: done, late: false }
  return opts.includes(today) && !picks[days[0]]?.length ? { day: today, late: true } : { day: usual, late: false }
}

/** Prep-Tag einer Woche (siehe prepDayInfo) */
export function resolvePrepDay(prepDays: Record<string, string>, days: string[], today: string, extra: PrepExtra = {}): string {
  return prepDayInfo(prepDays, days, today, extra).day
}

/** „heute (Do, 26.11.)“ bzw. „So, 22.11.“ – Prep-Tag für Hinweise */
export const prepDayText = (prep: string, today?: string) =>
  `${prep === today ? 'heute (' : ''}${weekdayName(prep, true)}, ${shortDate(prep)}${prep === today ? ')' : ''}`

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
  // Ofen = Combair oder CombiSteamer mit Backen (nicht nur Dämpfen); klassische Schritte: Wort „Ofen“
  const usesOven = (r: Recipe) =>
    r.deviceSteps?.some((s) => s.settings?.some((x) => x.device === 'combair' || (x.device === 'steamer' && x.mode !== 'Dämpfen' && x.mode !== 'Regenerieren'))) ??
    (r.classicSteps ?? r.steps).some((s) => /Ofen/.test(s))
  return items.sort((a, b) => Number(usesOven(b.recipe)) - Number(usesOven(a.recipe)))
}

/** Grobe Gesamtzeit für den Prep-Sonntag (parallel laufende Ofenzeit eingerechnet) */
export function prepMinutes(items: PrepItem[]): number {
  if (!items.length) return 0
  const times = items.map((i) => i.recipe.time + Math.max(0, i.portions - 1) * 2)
  return Math.max(...times) + Math.round(times.reduce((a, b) => a + b, 0) - Math.max(...times)) / 2
}

/**
 * Gewählte Frühstücke auf die Woche legen. Schon gegessene Tage (vor heute oder als gekocht abgezogen) bleiben, wie sie
 * waren – ein Neu-Wählen oder Zurücksetzen mitten in der Woche gibt nichts Gegessenes in den Vorrat zurück.
 */
export function applyBreakfastPicks(breakfast: WeekPlan, ids: string[], days: string[], prep: string, today: string): WeekPlan {
  const a = assignBreakfasts(ids, days, prep)
  const next = { ...breakfast }
  for (const d of workdays(days)) {
    if (d < today || next[d]?.status === 'cooked') continue
    const old = next[d]
    delete next[d]
    // schon vorbereitet (Portion liegt im Vorrat): bleibt verknüpft, solange dasselbe Frühstück auf dem Tag liegt
    if (a.days[d]) next[d] = old?.prep && old.recipeId === a.days[d] ? { recipeId: a.days[d], servings: 1, prep: old.prep } : { recipeId: a.days[d], servings: 1 }
  }
  return next
}
