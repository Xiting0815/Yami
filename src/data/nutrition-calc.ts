import type { Ingredient, Nutrition } from '../types'
import { DEFAULT_GRAMS, FRYING_FATS, GRAMS, NUTRI } from './nutrition'

/** Gewicht einer Zutatenmenge in Gramm (null = unbekannt) */
export function gramsOf(name: string, amount: number, unit: string): number | null {
  const specific = GRAMS[name]?.[unit]
  if (specific != null) return amount * specific
  if (unit === 'Stk') return null
  const d = DEFAULT_GRAMS[unit]
  return d != null ? amount * d : null
}

/** Nährwerte pro Portion */
export function nutritionOf(ingredients: Ingredient[], servings: number): Nutrition {
  const sum: Nutrition = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  for (const ing of ingredients) {
    if (ing.amount == null) continue
    const n = NUTRI[ing.name]
    let g = gramsOf(ing.name, ing.amount, ing.unit)
    if (!n || g == null) continue
    // Ausbackfett: nur ein Teil wird aufgenommen
    if (FRYING_FATS.has(ing.name) && g > 60) g *= ing.name === 'Frittieröl' ? 0.1 : 0.4
    const f = g / 100
    sum.kcal += n[0] * f
    sum.protein += n[1] * f
    sum.fat += n[2] * f
    sum.carbs += n[3] * f
    sum.fiber += n[4] * f
  }
  const r = (v: number) => Math.round((v / servings) * 10) / 10
  return { kcal: Math.round(sum.kcal / servings), protein: r(sum.protein), fat: r(sum.fat), carbs: r(sum.carbs), fiber: r(sum.fiber) }
}
