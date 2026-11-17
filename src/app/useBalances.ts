import { useMemo } from 'react'
import { RECIPE_BY_ID } from '../data/recipes'
import { type DayBalance, type Portion, dayBalance, isWorkday, portionFor, targetKcal, DEFAULT_BREAKFAST_KCAL } from '../energy'
import type { AppState } from '../store'

/** Kalorienbilanz (Mo–Fr) und Portionsgröße je Tag */
export function useBalances(state: AppState, days: string[]) {
  const profile = state.profile
  const { balances, portions } = useMemo(() => {
    const balances: Record<string, DayBalance | undefined> = {}
    const portions: Record<string, Portion | undefined> = {}
    if (profile) {
      for (const d of days) {
        if (!isWorkday(d)) continue
        const b = dayBalance(profile, state.breakfast[d], state.plan[d], state.snacks, d)
        balances[d] = b
        const e = state.plan[d]
        if (e && RECIPE_BY_ID[e.recipeId]) portions[d] = portionFor(RECIPE_BY_ID[e.recipeId], b.dinnerBudget, e.servings)
      }
    }
    return { balances, portions }
  }, [profile, days, state.breakfast, state.plan, state.customRecipes, state.snacks])
  /** Abendbudget für einen Tag (auch wenn dort noch nichts geplant ist) */
  const dinnerBudgetFor = (day: string) =>
    profile && isWorkday(day)
      ? Math.max(0, targetKcal(profile) - (RECIPE_BY_ID[state.breakfast[day]?.recipeId ?? '']?.nutrition.kcal ?? DEFAULT_BREAKFAST_KCAL) - profile.lunchKcal)
      : undefined
  return { balances, portions, dinnerBudgetFor }
}

export type Balances = ReturnType<typeof useBalances>
