/**
 * Wochenrückblick: eine Woche (Mo–So) auf einen Blick – Abwechslung, Ausgaben, Lebensmittel, Highlights, ein Tipp.
 * Reine Berechnung ohne Oberfläche (testbar).
 */
import { RECIPE_BY_ID } from './data/recipes'
import { amountValue, boughtOfWeek } from './kitchen'
import { type Rating, buildModel, dishValue, summarize } from './learning'
import { type AppState, addDays, isoWeekNumber, mondayOf, parseIso } from './store'
import { TYPE_LABEL, type DishType } from './types'

export interface ReviewVariety {
  /** verschiedene Küchen bei den Abendessen der Woche */
  cuisines: number
  /** Abendessen, die vorher noch nie im Plan standen */
  newDishes: number
}

export interface ReviewWaste {
  euro: number
  count: number
  /** am häufigsten / teuersten weggeworfene Zutat */
  top?: string
}

export interface WeekReview {
  weekKey: string
  kw: number
  /** gibt es überhaupt etwas zu berichten? */
  hasData: boolean
  variety: ReviewVariety
  spending: { total: number; items: number; dinners: number; perDinner?: number }
  food: { usedEuro: number; usedItems: number; waste: ReviewWaste }
  highlights: {
    rated: { day: string; title: string; rating: Rating }[]
    topType?: { label: string; count: number }
    /** „Das merke ich mir“ – stärkste gelernte Vorlieben */
    learned: string[]
  }
  tip: { kind: 'variety' | 'waste' | 'ok' | 'empty'; text: string }
}

/** Montag der Woche, die der Rückblick „zuletzt“ betrifft: sonntags diese Woche, sonst die vergangene */
export function defaultReviewMonday(today: string): string {
  const d = parseIso(today)
  const monday = mondayOf(d)
  const target = d.getDay() === 0 ? monday : addDays(monday, -7)
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`
}

export function weekReview(state: AppState, weekDays: string[], today: string): WeekReview {
  const weekKey = weekDays[0]
  const inWeek = (d: string) => weekDays.includes(d)

  // ───── Abwechslung: Küchen und neue Gerichte der Woche ─────
  const weekDinners = weekDays
    .map((d) => state.plan[d])
    .filter((e) => e && e.status !== 'skipped' && RECIPE_BY_ID[e.recipeId])
    .map((e) => RECIPE_BY_ID[e!.recipeId])
  const before = new Set(Object.entries(state.plan).filter(([d, e]) => d < weekKey && e).map(([, e]) => e!.recipeId))
  const variety: ReviewVariety = {
    cuisines: new Set(weekDinners.map((r) => r.cuisine)).size,
    newDishes: new Set(weekDinners.filter((r) => !before.has(r.id)).map((r) => r.id)).size,
  }

  // ───── Ausgaben (Schätzung) ─────
  // gekauft auf Einkäufen dieser Woche (Schlüssel trip:<Tag>) und auf der früheren Wochenliste
  const bought = boughtOfWeek(state.bought, weekDays)
  const boughtNames = Object.keys(bought).filter((n) => bought[n].amount > 1e-6)
  const spent = boughtNames.reduce((s, n) => s + amountValue(n, bought[n].amount, state.prices), 0)
  const dinners = weekDays.filter((d) => state.plan[d] && state.plan[d]!.status !== 'skipped').length
  const spending = {
    total: Math.round(spent * 100) / 100,
    items: boughtNames.length,
    dinners,
    perDinner: spent > 0 && dinners > 0 ? Math.round((spent / dinners) * 100) / 100 : undefined,
  }

  // ───── Lebensmittel ─────
  let usedEuro = 0
  let usedItems = 0
  for (const plan of [state.plan, state.breakfast]) {
    for (const d of weekDays) {
      for (const c of plan[d]?.consumed ?? []) {
        usedEuro += amountValue(c.name, c.amount, state.prices)
        usedItems++
      }
    }
  }
  // vorbereitetes Frühstück: Zutaten wurden am Prep-Tag entnommen (die Portionen danach haben keinen eigenen Warenwert)
  for (const p of state.bfPreps ?? [])
    if (inWeek(p.date))
      for (const c of p.consumed) {
        usedEuro += amountValue(c.name, c.amount, state.prices)
        usedItems++
      }
  const wastedWeek = state.wasted.filter((w) => inWeek(w.date))
  const byName = new Map<string, number>()
  for (const w of wastedWeek) byName.set(w.name, (byName.get(w.name) ?? 0) + w.value)
  const top = [...byName].sort((a, b) => b[1] - a[1])[0]?.[0]
  const waste: ReviewWaste = { euro: Math.round(wastedWeek.reduce((s, w) => s + w.value, 0) * 100) / 100, count: wastedWeek.length, top }

  // ───── Highlights ─────
  const rated = weekDays
    .filter((d) => state.plan[d] && RECIPE_BY_ID[state.plan[d]!.recipeId] && dishValue(state.ratings, d, state.plan[d]!.recipeId))
    .map((d) => ({ day: d, title: RECIPE_BY_ID[state.plan[d]!.recipeId].title, rating: dishValue(state.ratings, d, state.plan[d]!.recipeId)! }))
    .filter((r) => r.rating !== 'down')
  const typeCount = new Map<DishType, number>()
  for (const d of weekDays) {
    const e = state.plan[d]
    const r = e && e.status !== 'skipped' ? RECIPE_BY_ID[e.recipeId] : undefined
    if (r) typeCount.set(r.type, (typeCount.get(r.type) ?? 0) + 1)
  }
  const topT = [...typeCount].sort((a, b) => b[1] - a[1])[0]
  const model = buildModel({
    plan: state.plan,
    breakfast: state.breakfast,
    breakfastPicks: state.breakfastPicks,
    rejects: state.rejects,
    ratings: state.ratings,
    wasted: state.wasted,
    today,
    since: state.tasteSince,
    // dieselben Signale wie „Das habe ich gelernt“ (usePlanning): eigene Rezepte, eingeplante BBQ/Tapas/Salate
    customRecipes: state.customRecipes,
    bakePlan: state.bakePlan,
    baked: state.baked,
    snacks: state.snacks,
    bakeRatings: state.bakeRatings,
    bfPrepped: state.bfPreps,
    bfRatings: state.bfRatings,
    bfSatiety: state.bfSatiety,
    moves: state.moves,
  })
  const learned = summarize(model).liked.slice(0, 2).map((l) => l.label)

  const hasData =
    spending.total > 0 || usedItems > 0 || waste.count > 0 || rated.length > 0 || dinners > 0

  // ───── Tipp ─────
  let tip: WeekReview['tip']
  if (!hasData) {
    tip = { kind: 'empty', text: 'Plane dein Abendessen für die Woche – dann kann ich dir beim nächsten Mal mehr zeigen.' }
  } else if (waste.count > 0) {
    tip = { kind: 'waste', text: `Achte auf: ${waste.top} – kauf es kleiner oder plane es früher ein.` }
  } else if (weekDinners.length >= 4 && variety.cuisines <= 1) {
    tip = { kind: 'variety', text: 'Diese Woche gab es nur eine Küche – probier nächste Woche mal etwas aus einer anderen. Ich mische die Vorschläge.' }
  } else {
    tip = { kind: 'ok', text: 'Läuft gut – bleib bei deinem Rhythmus. Ich merke mir weiter, was dir schmeckt.' }
  }

  return {
    weekKey,
    kw: isoWeekNumber(parseIso(weekKey)),
    hasData,
    variety,
    spending,
    food: { usedEuro: Math.round(usedEuro * 100) / 100, usedItems, waste },
    highlights: {
      rated,
      topType: topT && topT[1] >= 2 ? { label: TYPE_LABEL[topT[0]], count: topT[1] } : undefined,
      learned,
    },
    tip,
  }
}
