import { RecipeBrowser } from '../../components/RecipeBrowser'
import type { AppModel } from '../useAppModel'

/** Tab „Rezepte“: alle Rezepte durchsuchen, eigene anlegen */
export function RecipesTab({ m }: { m: AppModel }) {
  const { state, ui, plan, act } = m
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
    />
  )
}
