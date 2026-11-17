import type { Recipe } from '../../types'
import { RECIPE_BY_ID } from '../../data/recipes'
import { applyBreakfastPicks, assignBreakfasts } from '../../breakfast'
import { shortDate, weekdayName } from '../../store'
import type { BreakfastPlan } from '../useBreakfastPlan'
import type { ActionContext } from './context'

/** Frühstück: 1–2 Rezepte wählen, Prep-Tag, Prep-Liste abhaken */
export function breakfastActions({ setState, cal, ui, flash, snapshot }: ActionContext, { picks, prep, covered }: Pick<BreakfastPlan, 'picks' | 'prep' | 'covered'>) {
  const { today, days, weekKey } = cal

  /** Frühstücke für die Woche festlegen und auf die Tage nach dem Prep-Tag verteilen (Tage davor bekommen keins) */
  function setPicks(ids: string[], prepDay: string = prep) {
    setState((s) => {
      // schon gegessene Tage bleiben (auch ihr Abzug im Vorrat)
      const breakfast = applyBreakfastPicks(s.breakfast, ids, days, prepDay, today)
      // Der gewählte Prep-Tag wird gemerkt – daraus lernt die App den üblichen Wochentag
      const prepDays = ids.length || s.prepDays[weekKey] ? { ...s.prepDays, [weekKey]: prepDay } : s.prepDays
      return { ...s, breakfast, prepDays, breakfastPicks: { ...s.breakfastPicks, [weekKey]: ids } }
    })
  }

  /** Prep-Tag ändern: Verteilung neu berechnen (rückgängig machbar) */
  function changePrepDay(iso: string) {
    if (iso === prep) return
    const snap = snapshot()
    setPicks(picks, iso)
    if (!picks.length) setState((s) => ({ ...s, prepDays: { ...s.prepDays, [weekKey]: iso } }))
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

  return { setPicks, changePrepDay, pickBreakfast, resetBreakfast, togglePrepCheck }
}
