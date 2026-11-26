import { useCallback, useMemo } from 'react'
import { RecipeBrowser } from '../../components/RecipeBrowser'
import { householdPreference } from '../../learning'
import { tapasIdeas } from '../../tapas'
import type { Recipe } from '../../types'
import type { AppModel } from '../useAppModel'

/** Tab „Rezepte“: alle Rezepte durchsuchen, eigene anlegen, Tapas für den Tapas-Abend auswählen */
export function RecipesTab({ m }: { m: AppModel }) {
  const { state, ui, plan, act, cal } = m
  const taste = plan.taste
  const others = plan.others
  const bakePref = useCallback((r: Recipe) => householdPreference(taste, others, r), [taste, others])
  // „Tapas-Abend-Ideen“: Lieblinge + Kombinationen + Vorrat + Abwechslung (src/tapas.ts)
  const ideas = useMemo(
    () => tapasIdeas({ today: cal.today, baked: state.baked, bakeRatings: state.bakeRatings, bakePlan: state.bakePlan, pantry: state.pantry, pref: (r) => bakePref(r).score }),
    [cal.today, state.baked, state.bakeRatings, state.bakePlan, state.pantry, bakePref],
  )
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
      tapasPick={ui.tapasPick}
      onTapasPick={ui.setTapasPick}
      onPlanTapas={() => ui.setTapasPlanOpen(true)}
      tapasIdeas={ideas}
    />
  )
}
