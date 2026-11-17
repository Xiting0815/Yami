import type { CustomIngredient, CustomRecipe } from '../../types'
import { RECIPE_BY_ID } from '../../data/recipes'
import type { Filters } from '../../store'
import { uid, uncook } from '../../kitchen'
import type { ActionContext } from './context'

/** Eigene Rezepte & Zutaten, Filter */
export function recipeActions({ state, setState, cal, ui, flash, snapshot }: ActionContext) {
  const { today } = cal

  /** Eigenes Rezept anlegen oder ändern */
  function saveCustom(r: Omit<CustomRecipe, 'id' | 'created'> & { id?: string }) {
    const snap = snapshot()
    const old = state.customRecipes.find((c) => c.id === r.id)
    const rec: CustomRecipe = { ...r, id: old?.id ?? `my-${uid()}`, created: old?.created ?? today }
    setState((s) => ({
      ...s,
      customRecipes: old ? s.customRecipes.map((c) => (c.id === rec.id ? rec : c)) : [...s.customRecipes, rec],
    }))
    ui.setEditor(null)
    ui.setMeal(rec.meal)
    flash(old ? `${rec.title} gespeichert ✓` : `${rec.title} angelegt ✓`, snap)
  }

  function createIngredient(c: CustomIngredient) {
    setState((s) => (s.customIngredients.some((x) => x.name === c.name) ? s : { ...s, customIngredients: [...s.customIngredients, c] }))
  }

  /** Eigenes Rezept löschen – inklusive aller Plan-Einträge (Rückgängig stellt alles wieder her) */
  function deleteCustom(id: string) {
    const snap = snapshot()
    const title = RECIPE_BY_ID[id]?.title ?? 'Rezept'
    setState((s) => {
      let pantry = s.pantry
      const strip = (p: typeof s.plan) => {
        const next = { ...p }
        for (const [d, e] of Object.entries(p)) {
          if (e?.recipeId !== id) continue
          if (e.status === 'cooked') pantry = uncook(e, pantry)
          delete next[d]
        }
        return next
      }
      const plan = strip(s.plan)
      const breakfast = strip(s.breakfast)
      return {
        ...s,
        plan,
        breakfast,
        pantry,
        customRecipes: s.customRecipes.filter((c) => c.id !== id),
        breakfastPicks: Object.fromEntries(Object.entries(s.breakfastPicks).map(([k, ids]) => [k, ids.filter((x) => x !== id)])),
      }
    })
    ui.setSheet(null)
    flash(`${title} gelöscht`, snap)
  }

  function setFilters(f: Filters) {
    setState((s) => ({ ...s, filters: f }))
  }

  return { saveCustom, createIngredient, deleteCustom, setFilters }
}
