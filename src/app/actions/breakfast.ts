import type { Recipe } from '../../types'
import { RECIPE_BY_ID } from '../../data/recipes'
import { applyBreakfastPicks, assignBreakfasts, mondayIso } from '../../breakfast'
import { finishPrep as finishPrepState, findPrep, openPrepDays, prepWeek, preppedText, undoPrep as undoPrepState } from '../../breakfastPrep'
import type { PortionFeedback, Rating } from '../../learning'
import { addDaysIso } from '../../kitchen'
import { shortDate, weekdayName } from '../../store'
import { defaultMonday } from '../dates'
import type { BreakfastPlan } from '../useBreakfastPlan'
import type { ActionContext } from './context'

/** Frühstück: 1–2 Rezepte wählen, Prep-Tag, Prep-Liste abhaken */
export function breakfastActions({ state, setState, cal, ui, flash, snapshot }: ActionContext, { picks, prep, prepLate, covered }: Pick<BreakfastPlan, 'picks' | 'prep' | 'prepLate' | 'covered'>) {
  const { today, days, weekKey } = cal

  /** Frühstücke für die Woche festlegen und auf die Tage nach dem Prep-Tag verteilen (Tage davor bekommen keins) */
  function setPicks(ids: string[], prepDay: string = prep) {
    setState((s) => {
      // schon gegessene Tage bleiben (auch ihr Abzug im Vorrat)
      const breakfast = applyBreakfastPicks(s.breakfast, ids, days, prepDay, today)
      // Der gewählte Prep-Tag wird gemerkt – daraus lernt die App den üblichen Wochentag.
      // Später Einstieg („heute vorbereiten“, nicht selbst gewählt): auch gemerkt (Verteilung bleibt stehen), aber als
      // `prepLate` – er verrät nichts über den üblichen Tag und zählt nicht fürs Lernen.
      const store = !!ids.length || !!s.prepDays[weekKey]
      const prepDays = store ? { ...s.prepDays, [weekKey]: prepDay } : s.prepDays
      const late = store && prepLate && prepDay === prep
      const prepLateWeeks = late ? [...new Set([...s.prepLate, weekKey])] : s.prepLate.filter((w) => w !== weekKey || !store)
      return { ...s, breakfast, prepDays, prepLate: prepLateWeeks, breakfastPicks: { ...s.breakfastPicks, [weekKey]: ids } }
    })
  }

  /** Prep-Tag ändern: Verteilung neu berechnen (rückgängig machbar) */
  function changePrepDay(iso: string) {
    if (iso === prep) return
    const snap = snapshot()
    setPicks(picks, iso)
    // selbst gewählt → zählt fürs Lernen (kein später Einstieg mehr)
    if (!picks.length) setState((s) => ({ ...s, prepDays: { ...s.prepDays, [weekKey]: iso }, prepLate: s.prepLate.filter((w) => w !== weekKey) }))
    const n = Object.keys(assignBreakfasts(picks, days, iso).days).length
    flash(
      picks.length
        ? `Vorbereitung ${weekdayName(iso, true)}, ${shortDate(iso)} – Frühstück an ${n} Tagen`
        : `Vorbereitung: ${weekdayName(iso, true)}, ${shortDate(iso)}`,
      snap,
    )
  }

  function pickBreakfast(r: Recipe) {
    const snap = snapshot()
    const next = [...picks.filter((id) => id !== r.id), r.id].slice(-2)
    setPicks(next)
    const coveredN = Object.keys(assignBreakfasts(next, days, prep).days).length
    if (next.length >= 2 || coveredN === covered.length) {
      flash(`☀️ Frühstück steht: ${next.map((id) => RECIPE_BY_ID[id].title).join(' + ')}`, snap)
      ui.setTab('woche')
    } else {
      flash(`${r.title} ✓ – wähle noch eins`, snap)
    }
  }

  /** Auswahl leeren und gleich neu wischen */
  function resetBreakfast() {
    flash('Frühstück zurückgesetzt', snapshot())
    setPicks([])
    ui.setMeal('breakfast')
    ui.setTab('wischen')
  }

  function togglePrepCheck(key: string) {
    setState((s) => {
      const cur = new Set(s.prepChecked[weekKey] ?? [])
      if (cur.has(key)) cur.delete(key)
      else cur.add(key)
      return { ...s, prepChecked: { ...s.prepChecked, [weekKey]: [...cur] } }
    })
  }

  /** Woche, für die ein Frühstück gerade vorbereitet wird (angezeigte, aktuelle oder nächste) */
  function prepWeekOf(recipeId: string): string {
    return prepWeek(state.breakfastPicks, state.breakfast, recipeId, today, [weekKey, mondayIso(today), defaultMonday(today), mondayIso(addDaysIso(today, 7))])
  }

  /** Portionen fürs Vorbereiten: so viele offene Frühstückstage dieses Rezepts in der Prep-Woche (sonst 1) */
  function prepPortions(recipeId: string): number {
    const w = prepWeekOf(recipeId)
    const done = findPrep(state.bfPreps, w, recipeId)
    return done?.portions ?? (openPrepDays(state.breakfast, recipeId, w, today).length || 1)
  }

  /**
   * „Fertig vorbereitet“ (Kochmodus-Ende oder Prep-Liste): Zutaten abziehen, Portionen in den Vorrat, Frühstückstage
   * verknüpfen, Prep-Liste abhaken – danach „Wie war’s?“. Rückgängig über den Toast oder in der Prep-Liste.
   */
  function finishPrep(recipe: Recipe, portions: number, ask = true) {
    if (!recipe.breakfast) return
    const snap = snapshot()
    const week = prepWeekOf(recipe.id)
    setState((s) => {
      const r = finishPrepState(s, recipe, portions, week, today)
      return { ...s, ...r.state }
    })
    flash(`${preppedText(recipe, Math.max(1, Math.round(portions)))} im Vorrat ✓`, snap)
    ui.setCooking(false)
    ui.setSheet(null)
    if (ask) ui.setRateBf({ recipeId: recipe.id, date: today })
  }

  /** Vorbereitung zurücknehmen (Zutaten zurück, Portionen aus dem Vorrat) */
  function undoPrep(recipeId: string, week: string = weekKey) {
    const snap = snapshot()
    setState((s) => ({ ...s, ...undoPrepState(s, week, recipeId, today) }))
    flash('Vorbereitung zurückgenommen – Zutaten wieder im Vorrat', snap)
  }

  /** Bewertung nach dem Vorbereiten (nochmal tippen nimmt zurück) – zählt nur fürs eigene Profil */
  function setBfRating(date: string, recipeId: string, v: Rating | undefined) {
    const key = `${date}:${recipeId}`
    setState((s) => {
      const bfRatings = { ...s.bfRatings }
      if (v) bfRatings[key] = v
      else delete bfRatings[key]
      return { ...s, bfRatings }
    })
  }

  /** „Hat es bis mittags satt gemacht?“ (Schlüssel `Prep-Tag:Rezept-Id`) */
  function setBfSatiety(key: string, v: PortionFeedback) {
    setState((s) => ({ ...s, bfSatiety: { ...s.bfSatiety, [key]: v } }))
    flash(v === -1 ? 'Gemerkt – sättigendere Frühstücke kommen nach vorn ✓' : v === 1 ? 'Gemerkt – leichtere Frühstücke kommen nach vorn ✓' : 'Danke – gemerkt ✓')
  }

  function dismissSatiety(key: string) {
    setState((s) => ({ ...s, bfSatietyDismissed: [...s.bfSatietyDismissed, key].slice(-60) }))
  }

  return { setPicks, changePrepDay, pickBreakfast, resetBreakfast, togglePrepCheck, prepWeekOf, prepPortions, finishPrep, undoPrep, setBfRating, setBfSatiety, dismissSatiety }
}
