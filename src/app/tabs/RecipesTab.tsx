import { useCallback } from 'react'
import { RecipeBrowser } from '../../components/RecipeBrowser'
import { householdPreference } from '../../learning'
import type { Recipe } from '../../types'
import type { AppModel } from '../useAppModel'

/** Tab „Rezepte“: alle Rezepte durchsuchen, eigene anlegen */
export function RecipesTab({ m }: { m: AppModel }) {
  const { state, ui, plan, act } = m
  const taste = plan.taste
  const others = plan.others
  const bakePref = useCallback((r: Recipe) => householdPreference(taste, others, r), [taste, others])
  return (
    <RecipeBrowser
      filters={state.filters}
      onFilters={act.setFilters}
      onOpen={(r) => ui.setSheet({ recipe: r, mode: 'pick' })}
      perPortion={plan.perPortion}
      meal={ui.meal}
      onMeal={ui.setMeal}
      custom={state.customRecipes}
      onNew={() => ui.setEditor({})}
      bakePref={bakePref}
    />
  )
}
