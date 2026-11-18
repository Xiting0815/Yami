import { RECIPE_BY_ID } from '../../data/recipes'
import { type BakeSuggestion, acceptSuggestion, addBake, bakesOn, dismissSuggestion, moveBake, removeBake, setBakeAmount, settleBaked } from '../../bakePlan'
import { yieldText } from '../../bake'
import { weekdayName } from '../../store'
import type { Recipe } from '../../types'
import { isBake } from '../../types'
import type { ActionContext } from './context'

/** Backen einplanen: einplanen, verschieben, entfernen, „Hast du gebacken?“ beantworten, Vorschläge annehmen/wegklicken */
export function bakeActions({ state, setState, cal, ui, flash, snapshot }: ActionContext) {
  const { today } = cal

  /** Rezept (Backen & Desserts, Grundrezept) auf einen Tag legen */
  function planBake(recipe: Recipe, day: string, amount: number) {
    if (!recipe.basic) return
    const snap = snapshot()
    setState((s) => ({ ...s, bakePlan: addBake(s.bakePlan, day, recipe.id, amount) }))
    flash(`Backen: ${recipe.title} → ${weekdayName(day)} ✓`, snap)
  }

  function moveBakeTo(from: string, recipeId: string, to: string) {
    const r = RECIPE_BY_ID[recipeId]
    if (!r || from === to) return
    const snap = snapshot()
    setState((s) => ({ ...s, bakePlan: moveBake(s.bakePlan, from, recipeId, to) }))
    flash(`${r.title} → ${weekdayName(to)} verschoben`, snap)
  }

  function removeBakeEntry(day: string, recipeId: string) {
    const snap = snapshot()
    setState((s) => ({ ...s, bakePlan: removeBake(s.bakePlan, day, recipeId) }))
    flash(`${RECIPE_BY_ID[recipeId]?.title ?? 'Backen'} entfernt`, snap)
  }

  function changeBakeAmount(day: string, recipeId: string, amount: number) {
    setState((s) => ({ ...s, bakePlan: setBakeAmount(s.bakePlan, day, recipeId, amount) }))
  }

  /**
   * „Ja, gebacken“: Zutaten abziehen, Ergebnis in den Vorrat (Haltbarkeit ab Backtag), Eintrag als gebacken markieren,
   * Gebackenes fürs Lernen vermerken – danach fragt das „Wie war’s?“-Sheet. Ein zweites Mal passiert nichts.
   */
  function confirmBaked(day: string, recipeId: string) {
    const recipe = RECIPE_BY_ID[recipeId]
    const entry = bakesOn(state.bakePlan, day).find((e) => e.recipeId === recipeId)
    if (!recipe?.yields || !entry || entry.status) return
    const snap = snapshot()
    const servings = entry.amount * recipe.servings
    setState((s) => {
      const r = settleBaked(s, day, recipeId)
      return r ? { ...s, ...r } : s
    })
    flash(`${yieldText(recipe, servings)} ${recipe.yields.name} im Vorrat ✓`, snap)
    ui.setBakeSheet(null)
    if (isBake(recipe)) ui.setRateBake({ recipeId, date: day })
  }

  function acceptBakeSuggestion(s: BakeSuggestion) {
    const snap = snapshot()
    setState((st) => {
      const r = acceptSuggestion(st.bakePlan, st.bakeHints, s, today)
      return { ...st, bakePlan: r.bakePlan, bakeHints: r.hints }
    })
    flash(`Backen: ${RECIPE_BY_ID[s.recipeId]?.title} → ${weekdayName(s.day)} ✓`, snap)
  }

  function dismissBakeSuggestion(s: BakeSuggestion) {
    setState((st) => ({ ...st, bakeHints: dismissSuggestion(st.bakeHints, s, today) }))
  }

  return { planBake, moveBakeTo, removeBakeEntry, changeBakeAmount, confirmBaked, acceptBakeSuggestion, dismissBakeSuggestion }
}
