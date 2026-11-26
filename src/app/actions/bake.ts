import { RECIPE_BY_ID } from '../../data/recipes'
import { type BakeSuggestion, acceptSuggestion, addBake, bakesOn, dismissSuggestion, moveBake, removeBake, setBakeAmount, settleBaked, tapasFactor } from '../../bakePlan'
import { yieldText } from '../../bake'
import { weekdayName } from '../../store'
import type { Recipe } from '../../types'
import { finishable, isBake, isBbq, isTapa, replacesDinner } from '../../types'
import { bbqHint, bbqMeal, dinnerToReplace, doneWord, planWord } from '../../bbq'
import { moveTapasEvening, planTapasEvening, removeTapasEvening, shortTitle, tapasMeal } from '../../tapas'
import { isBbqSeason } from '../../data/season'
import type { ActionContext } from './context'

/** Backen einplanen: einplanen, verschieben, entfernen, „Hast du gebacken?“ beantworten, Vorschläge annehmen/wegklicken */
export function bakeActions({ state, setState, cal, ui, flash, snapshot }: ActionContext) {
  const { today } = cal

  /**
   * Rezept (Backen & Desserts, Grundrezept, BBQ) auf einen Tag legen. BBQ mit `replaceDinner`: das offene Abendessen
   * des Tages wird gestrichen (der Grillabend ist das Abendessen; Rückgängig über den Toast). Ein BBQ aus der
   * Ideen-Karte zählt als „angenommen“ (Karte ruht nicht).
   */
  function planBake(recipe: Recipe, day: string, amount: number, replaceDinner = false) {
    if (!recipe.basic) return
    const snap = snapshot()
    const bbq = isBbq(recipe)
    // nur Grillabende ersetzen das Abendessen; Beilagen und Salate sind Zusatz
    const dropped = replacesDinner(recipe) && replaceDinner ? dinnerToReplace(state.plan, day) : undefined
    setState((s) => {
      const plan = { ...s.plan }
      if (dropped && dinnerToReplace(plan, day)) delete plan[day]
      return {
        ...s,
        plan,
        bakePlan: addBake(s.bakePlan, day, recipe.id, amount),
        bakeHints: bbq && recipe.bbq !== 'beilage' && isBbqSeason(today) ? bbqHint(s.bakeHints, today, 'accepted') : s.bakeHints,
      }
    })
    const dropTitle = dropped ? RECIPE_BY_ID[dropped.recipeId]?.title : undefined
    flash(`${planWord(recipe)}: ${recipe.title} → ${weekdayName(day)} ✓${dropTitle ? ` (statt ${dropTitle})` : ''}`, snap)
  }

  /**
   * Tapas-Abend einplanen: die gewählten Tapas zusammen auf einen Tag (die Auswahl ersetzt einen vorher für den Tag
   * geplanten Tapas-Abend). `replaceDinner` (vorgewählt) streicht das offene Abendessen des Tages; Rückgängig über den Toast.
   */
  function planTapas(day: string, ids: string[], replaceDinner = true) {
    if (!ids.length) return
    const snap = snapshot()
    const r0 = planTapasEvening(state, day, ids, replaceDinner)
    setState((s) => {
      const r = planTapasEvening(s, day, ids, replaceDinner)
      return { ...s, plan: r.plan, bakePlan: r.bakePlan }
    })
    const dropTitle = r0.dropped ? RECIPE_BY_ID[r0.dropped.recipeId]?.title : undefined
    flash(`🫒 Tapas-Abend (${ids.length} Tapas) → ${weekdayName(day)} ✓${dropTitle ? ` (statt ${dropTitle})` : ''}`, snap)
    ui.setTapasPick([])
  }

  /** ganzen Tapas-Abend verschieben bzw. entfernen (nur noch offene Tapas) */
  function moveTapas(from: string, to: string) {
    if (from === to) return
    const snap = snapshot()
    setState((s) => ({ ...s, bakePlan: moveTapasEvening(s, from, to) }))
    flash(`🫒 Tapas-Abend → ${weekdayName(to)} verschoben`, snap)
  }
  function removeTapas(day: string) {
    const snap = snapshot()
    setState((s) => ({ ...s, bakePlan: removeTapasEvening(s.bakePlan, day) }))
    flash('🫒 Tapas-Abend entfernt', snap)
  }

  /**
   * „Fertig“ einer Tapa (Kochmodus Tapas-Abend oder Nachfrage): Zutaten mit der Menge des Abends abziehen, ihr Anteil zählt
   * in die Tagesbilanz; danach „Wie war’s?“ für genau diese Tapa (`rate` = false: ohne Bewertungs-Sheet, z. B. im Kochmodus).
   */
  function finishTapa(day: string, recipeId: string, rate = false) {
    const recipe = RECIPE_BY_ID[recipeId]
    const entry = bakesOn(state.bakePlan, day).find((e) => e.recipeId === recipeId)
    if (!recipe || !isTapa(recipe) || !entry || entry.status) return
    const snap = snapshot()
    setState((s) => {
      const meal = tapasMeal(recipe, day, tapasFactor(s.bakePlan, day))
      const r = settleBaked(s, day, recipeId)
      return r ? { ...s, ...r, snacks: meal ? [...s.snacks, meal].slice(-400) : s.snacks } : s
    })
    flash(`${shortTitle(recipe.title)} gemacht ✓`, snap)
    if (rate) ui.setRateBake({ recipeId, date: day })
  }

  /** „Ja, gemacht“ für den ganzen Tapas-Abend: alle offenen Tapas des Tages */
  function confirmTapasEvening(day: string) {
    const open = bakesOn(state.bakePlan, day).filter((e) => isTapa(RECIPE_BY_ID[e.recipeId]) && !e.status)
    if (!open.length) return
    const snap = snapshot()
    setState((s) => {
      const f = tapasFactor(s.bakePlan, day)
      let cur = s
      for (const e of open) {
        const r = settleBaked(cur, day, e.recipeId)
        const meal = tapasMeal(RECIPE_BY_ID[e.recipeId], day, f)
        if (r) cur = { ...cur, ...r, snacks: meal ? [...cur.snacks, meal].slice(-400) : cur.snacks }
      }
      return cur
    })
    flash(`🫒 Tapas-Abend gemacht ✓ – ${open.length} Tapas abgezogen`, snap)
  }

  /** BBQ-Ideen-Karte wegklicken (ruht dann länger, wie Backvorschläge) */
  function dismissBbqIdeas() {
    setState((st) => ({ ...st, bakeHints: bbqHint(st.bakeHints, today, 'dismissed') }))
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
    if (!recipe || !finishable(recipe) || !entry || entry.status) return
    if (isTapa(recipe)) return finishTapa(day, recipeId, true)
    const snap = snapshot()
    const servings = entry.amount * recipe.servings
    const meal = bbqMeal(recipe, day)
    setState((s) => {
      const r = settleBaked(s, day, recipeId)
      // BBQ: eine Portion zählt als Abendessen in die Tagesbilanz
      return r ? { ...s, ...r, snacks: meal ? [...s.snacks, meal].slice(-400) : s.snacks } : s
    })
    flash(recipe.yields ? `${yieldText(recipe, servings)} ${recipe.yields.name} im Vorrat ✓` : `${recipe.title} ${doneWord(recipe)} ✓`, snap)
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

  return { planBake, planTapas, moveTapas, removeTapas, finishTapa, confirmTapasEvening, dismissBbqIdeas, moveBakeTo, removeBakeEntry, changeBakeAmount, confirmBaked, acceptBakeSuggestion, dismissBakeSuggestion }
}
