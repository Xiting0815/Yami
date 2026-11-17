/**
 * Wochenrückblick: eine Woche (Mo–So) auf einen Blick – Gewicht, Ernährung, Ausgaben, Lebensmittel, Highlights, ein Tipp.
 * Reine Berechnung ohne Oberfläche (testbar).
 */
import { RECIPE_BY_ID } from './data/recipes'
import { PROTEIN_LOW_SHARE, dayBalance, isWorkday } from './energy'
import { amountValue } from './kitchen'
import { type Rating, buildModel, summarize } from './learning'
import { type WeighIn, weekOf } from './progress'
import { type AppState, addDays, isoWeekNumber, mondayOf, parseIso } from './store'
import { TYPE_LABEL, type DishType } from './types'

/** Toleranz: bis so viele kcal über dem Ziel gelten noch als „im Ziel“ */
export const KCAL_TOLERANCE = 50

export interface ReviewNutrition {
  /** Arbeitstage mit geplantem Abendessen (und Profil) */
  days: number
  avgKcal?: number
  target?: number
  avgProtein?: number
  proteinTarget?: number
  inTarget: number
  /** Tage mit mehr als Ziel + Toleranz */
  overDays: number
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
  weight: {
    current?: WeighIn
    prev?: WeighIn
    /** Veränderung in kg (negativ = abgenommen) */
    delta?: number
    goal?: number
    /** noch bis zum Ziel (kg), 0 = erreicht */
    remaining?: number
  }
  nutrition: ReviewNutrition
  spending: { total: number; items: number; dinners: number; perDinner?: number }
  food: { usedEuro: number; usedItems: number; waste: ReviewWaste }
  highlights: {
    rated: { day: string; title: string; rating: Rating }[]
    topType?: { label: string; count: number }
    /** „Das merke ich mir“ – stärkste gelernte Vorlieben */
    learned: string[]
  }
  tip: { kind: 'protein' | 'waste' | 'kcal' | 'ok' | 'empty'; text: string }
}

/** Montag der Woche, die der Rückblick „zuletzt“ betrifft: sonntags diese Woche, sonst die vergangene */
export function defaultReviewMonday(today: string): string {
  const d = parseIso(today)
  const monday = mondayOf(d)
  const target = d.getDay() === 0 ? monday : addDays(monday, -7)
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined)

export function weekReview(state: AppState, weekDays: string[], today: string): WeekReview {
  const weekKey = weekDays[0]
  const inWeek = (d: string) => weekDays.includes(d)
  const profile = state.profile

  // ───── Gewicht ─────
  const current = state.weighIns.find((w) => weekOf(w.date) === weekKey)
  const prev = [...state.weighIns].filter((w) => w.date < weekKey).pop()
  const goal = profile?.goalWeight
  const weight: WeekReview['weight'] = {
    current,
    prev,
    delta: current && prev ? Math.round((current.weight - prev.weight) * 10) / 10 : undefined,
    goal,
    remaining: current && goal ? Math.max(0, Math.round((current.weight - goal) * 10) / 10) : undefined,
  }

  // ───── Ernährung Mo–Fr ─────
  const balances = profile
    ? weekDays
        .filter((d) => isWorkday(d) && state.plan[d] && state.plan[d]!.status !== 'skipped' && RECIPE_BY_ID[state.plan[d]!.recipeId])
        .map((d) => dayBalance(profile, state.breakfast[d], state.plan[d]))
    : []
  const avgKcal = avg(balances.map((b) => b.total))
  const avgProtein = avg(balances.map((b) => b.protein))
  const nutrition: ReviewNutrition = {
    days: balances.length,
    avgKcal: avgKcal != null ? Math.round(avgKcal) : undefined,
    target: balances[0]?.target,
    avgProtein: avgProtein != null ? Math.round(avgProtein) : undefined,
    proteinTarget: balances[0]?.proteinTarget,
    inTarget: balances.filter((b) => b.total <= b.target + KCAL_TOLERANCE).length,
    overDays: balances.filter((b) => b.total > b.target + KCAL_TOLERANCE).length,
  }

  // ───── Ausgaben (Schätzung) ─────
  const bought = state.bought[weekKey] ?? {}
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
  const wastedWeek = state.wasted.filter((w) => inWeek(w.date))
  const byName = new Map<string, number>()
  for (const w of wastedWeek) byName.set(w.name, (byName.get(w.name) ?? 0) + w.value)
  const top = [...byName].sort((a, b) => b[1] - a[1])[0]?.[0]
  const waste: ReviewWaste = { euro: Math.round(wastedWeek.reduce((s, w) => s + w.value, 0) * 100) / 100, count: wastedWeek.length, top }

  // ───── Highlights ─────
  const rated = weekDays
    .filter((d) => state.ratings[d] && state.plan[d] && RECIPE_BY_ID[state.plan[d]!.recipeId])
    .map((d) => ({ day: d, title: RECIPE_BY_ID[state.plan[d]!.recipeId].title, rating: state.ratings[d] }))
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
  })
  const learned = summarize(model).liked.slice(0, 2).map((l) => l.label)

  const hasData =
    !!current || nutrition.days > 0 || spending.total > 0 || usedItems > 0 || waste.count > 0 || rated.length > 0 || dinners > 0

  // ───── Tipp ─────
  let tip: WeekReview['tip']
  if (!hasData) {
    tip = { kind: 'empty', text: 'Plane dein Abendessen für die Woche – dann kann ich dir beim nächsten Mal mehr zeigen.' }
  } else if (nutrition.avgProtein != null && nutrition.proteinTarget != null && nutrition.avgProtein < PROTEIN_LOW_SHARE * nutrition.proteinTarget) {
    tip = { kind: 'protein', text: 'Nächste Woche mehr eiweißreiche Gerichte – ich schlage sie dir vor.' }
  } else if (waste.count > 0) {
    tip = { kind: 'waste', text: `Achte auf: ${waste.top} – kauf es kleiner oder plane es früher ein.` }
  } else if (nutrition.overDays >= 3) {
    tip = { kind: 'kcal', text: 'An mehreren Tagen warst du über dem Ziel. Nimm ruhig kleinere Portionen und fülle mit Gemüse oder Salat auf.' }
  } else {
    tip = { kind: 'ok', text: 'Läuft gut – bleib bei deinem Rhythmus. Ich merke mir weiter, was dir schmeckt.' }
  }

  return {
    weekKey,
    kw: isoWeekNumber(parseIso(weekKey)),
    hasData,
    weight,
    nutrition,
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
