/**
 * Kalorienbedarf & Tagesbilanz (nur Arbeitstage Mo–Fr: Frühstück + Mittags-Pauschale + Abendessen).
 * Grundumsatz nach Mifflin-St Jeor, × Aktivitätsfaktor, minus Defizit zum Abnehmen.
 */
import { RECIPE_BY_ID } from './data/recipes'
import { parseIso } from './store'
import type { PlanEntry, Recipe } from './types'

export interface Profile {
  sex: 'm' | 'w'
  age: number
  heightCm: number
  weightKg: number
  /** Aktivitätsfaktor (PAL) */
  activity: number
  /** kcal pro Tag unter dem Bedarf (500 ≈ 0,5 kg/Woche) */
  deficit: number
  /** Pauschale fürs Mittagessen (wird nicht geplant) */
  lunchKcal: number
  /** Körperfett in % aus der letzten Messung (→ genauere Formel) */
  fatPct?: number
  /** Zielgewicht in kg */
  goalWeight?: number
  /** bestätigte Anpassungen des Ziels in kcal (z. B. −100) */
  adjust?: number
  /** Einheit der Muskelmasse auf der Waage */
  muscleUnit?: 'kg' | '%'
}

export const ACTIVITY: { value: number; label: string; hint: string }[] = [
  { value: 1.2, label: 'Kaum aktiv', hint: 'Bürojob, wenig Bewegung' },
  { value: 1.375, label: 'Leicht aktiv', hint: '1–3× Sport pro Woche oder viel zu Fuß' },
  { value: 1.55, label: 'Mäßig aktiv', hint: '3–5× Sport pro Woche' },
  { value: 1.725, label: 'Sehr aktiv', hint: 'täglich Sport oder körperliche Arbeit' },
]

export const PACE: { deficit: number; label: string }[] = [
  { deficit: 0, label: 'Gewicht halten' },
  { deficit: 250, label: 'Langsam (≈ 0,25 kg/Woche)' },
  { deficit: 500, label: 'Normal (≈ 0,5 kg/Woche)' },
  { deficit: 750, label: 'Zügig (≈ 0,75 kg/Woche)' },
]

export const DEFAULT_PROFILE: Profile = { sex: 'm', age: 40, heightCm: 180, weightKg: 90, activity: 1.2, deficit: 500, lunchKcal: 600 }

/** angenommenes Frühstück, wenn für den Tag keins geplant ist */
export const DEFAULT_BREAKFAST_KCAL = 400

/** Formel: mit Körperfett Katch-McArdle (über die fettfreie Masse), sonst Mifflin-St Jeor */
export function bmrFormula(p: Profile): 'katch' | 'mifflin' {
  return p.fatPct != null && p.fatPct > 3 && p.fatPct < 60 ? 'katch' : 'mifflin'
}

export function leanMass(p: Profile): number | undefined {
  return bmrFormula(p) === 'katch' ? p.weightKg * (1 - p.fatPct! / 100) : undefined
}

export function bmr(p: Profile): number {
  if (bmrFormula(p) === 'katch') return 370 + 21.6 * leanMass(p)!
  return 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'm' ? 5 : -161)
}

export function tdee(p: Profile): number {
  return bmr(p) * p.activity
}

/** Mindestzufuhr, die nicht unterschritten wird */
export function floorKcal(p: Profile): number {
  return p.sex === 'm' ? 1500 : 1200
}

export function targetKcal(p: Profile): number {
  return Math.round(Math.max(floorKcal(p), tdee(p) - p.deficit + (p.adjust ?? 0)) / 10) * 10
}

/** Tagesbilanz gilt nur Mo–Fr */
export function isWorkday(iso: string): boolean {
  const d = parseIso(iso).getDay()
  return d >= 1 && d <= 5
}

export interface DayBalance {
  target: number
  breakfast: number
  breakfastPlanned: boolean
  lunch: number
  /** kcal, die fürs Abendessen bleiben */
  dinnerBudget: number
  /** deine Abendportion (kcal), falls ein Gericht geplant ist */
  dinner?: number
  total: number
  protein: number
}

export interface Portion {
  /** Anteil an einer Standardportion (1 = normale Portion) */
  fraction: number
  /** z. B. "¾" */
  label: string
  kcal: number
  /** über dem Budget → Gemüse/Salat-Tipp */
  tip?: string
  /** was vom Gericht übrig bleibt (in Standardportionen) */
  rest: number
}

const STEPS: [number, string][] = [
  [0.33, '⅓'],
  [0.5, '½'],
  [0.67, '⅔'],
  [0.75, '¾'],
  [1, '1'],
]

/** deine Portion eines Abendessens bei gegebenem Budget */
export function portionFor(recipe: Recipe, budget: number, servingsCooked: number): Portion {
  const perPortion = recipe.nutrition.kcal
  const raw = perPortion > 0 ? budget / perPortion : 1
  // auf gut schätzbare Anteile abrunden (½, ⅔, ¾, 1), nie mehr als eine normale Portion
  const step = [...STEPS].reverse().find(([v]) => raw >= v) ?? STEPS[0]
  const fraction = Math.min(1, step[0])
  const kcal = Math.round(perPortion * fraction)
  let tip: string | undefined
  if (raw < 0.5) tip = 'Sehr gehaltvoll – kleine Portion mit großem Salat oder Gemüse auffüllen, oder an einem Tag mit leichterem Frühstück einplanen.'
  else if (fraction < 1) tip = 'Mit einer großen Portion Salat oder Gemüse auffüllen, dann wirst du trotzdem satt.'
  return { fraction, label: step[1] === '1' ? 'volle Portion' : `${step[1]} Portion`, kcal, tip, rest: Math.max(0, servingsCooked - fraction) }
}

export function dayBalance(p: Profile, breakfast?: PlanEntry, dinner?: PlanEntry): DayBalance {
  const target = targetKcal(p)
  const bf = breakfast && breakfast.status !== 'skipped' ? RECIPE_BY_ID[breakfast.recipeId] : undefined
  const bKcal = bf ? bf.nutrition.kcal : DEFAULT_BREAKFAST_KCAL
  const dinnerBudget = Math.max(0, target - bKcal - p.lunchKcal)
  const dr = dinner && dinner.status !== 'skipped' ? RECIPE_BY_ID[dinner.recipeId] : undefined
  const portion = dr ? portionFor(dr, dinnerBudget, dinner!.servings) : undefined
  const dKcal = portion?.kcal
  const protein = (bf?.nutrition.protein ?? 0) + (dr ? dr.nutrition.protein * (portion?.fraction ?? 1) : 0)
  return {
    target,
    breakfast: bKcal,
    breakfastPlanned: !!bf,
    lunch: p.lunchKcal,
    dinnerBudget,
    dinner: dKcal,
    total: bKcal + p.lunchKcal + (dKcal ?? 0),
    protein: Math.round(protein),
  }
}
