import { useMemo } from 'react'
import type { Recipe } from '../types'
import { BREAKFASTS } from '../data/recipes'
import { assignBreakfasts, coveredDays, prepDayInfo, prepOptions, prepPlan } from '../breakfast'
import { preference, satietyBonus, satietyLean } from '../learning'
import type { AppState } from '../store'
import { insight, lastSeenMap, PANTRY_ONLY_MAX_EURO } from '../kitchen'
import type { Calendar } from './useCalendar'
import type { Planning } from './usePlanning'
import type { Ui } from './useUi'

/** Frühstück der Woche: Auswahl, Prep-Tag, Verteilung auf die Tage und Wisch-Stapel */
export function useBreakfastPlan(
  state: AppState,
  { today, days, weekKey }: Calendar,
  { rejected, bTypes, bPantryOnly }: Pick<Ui, 'rejected' | 'bTypes' | 'bPantryOnly'>,
  { week, jitter, taste, todayMonth }: Pick<Planning, 'week' | 'jitter' | 'taste' | 'todayMonth'>,
) {
  const picks = state.breakfastPicks[weekKey] ?? []
  // später Einstieg (Prep-Tag schon vorbei, nichts gewählt/vorbereitet) → heute vorbereiten (`prepLate`, zählt nicht fürs Lernen)
  const prepInfo = useMemo(
    () => prepDayInfo(state.prepDays, days, today, { preps: state.bfPreps, late: state.prepLate, picks: state.breakfastPicks }),
    [state.prepDays, days, today, state.bfPreps, state.prepLate, state.breakfastPicks],
  )
  const prep = prepInfo.day
  const prepLate = prepInfo.late
  const prepChoices = useMemo(() => prepOptions(days), [days])
  const covered = useMemo(() => coveredDays(days, prep), [days, prep])
  const assignment = useMemo(() => assignBreakfasts(picks, days, prep), [picks, days, prep])
  const prepItems = useMemo(() => prepPlan(assignment), [assignment])
  const prepTotal = prepItems.reduce((n, i) => n + i.recipe.steps.length, 0)
  const prepDone = (state.prepChecked[weekKey] ?? []).filter((k) => prepItems.some((i) => k.startsWith(i.recipe.id + ':'))).length
  // Lernen: „bis mittags satt?“ → sättigendere bzw. leichtere Frühstücke nach vorn
  const satiety = useMemo(() => satietyLean(state.bfSatiety, today), [state.bfSatiety, today])
  const bLastSeen = useMemo(() => lastSeenMap(state.breakfast, days[0]), [state.breakfast, days])
  const bInsights = useMemo(
    () =>
      new Map(
        // Portionen, die dieses Frühstück abdecken würde: erstes ≈ 3 Tage, zweites ≈ 2 Tage
        BREAKFASTS.map((r) => {
          const ins = insight(r, picks.length ? 2 : 3, week.leftovers, today, state.prices, bLastSeen, jitter.get(r.id) ?? 0, [], {
            month: todayMonth,
          })
          const pref = preference(taste, r)
          const sat = satietyBonus(r, satiety, BREAKFASTS)
          const why = pref.reason ?? (sat >= 1 ? (satiety > 0 ? '💪 macht lange satt' : '🪶 leichter') : undefined)
          return [r.id, { ...ins, score: ins.score + pref.score + sat, taste: why }]
        }),
      ),
    [week.leftovers, today, state.prices, bLastSeen, jitter, picks.length, taste, todayMonth, satiety, state.customRecipes, state.customIngredients],
  )
  const bDeck = useMemo(() => {
    const list = BREAKFASTS.filter(
      (r) =>
        (!bTypes.length || bTypes.includes(r.breakfast!.type)) &&
        !picks.includes(r.id) &&
        (!bPantryOnly || bInsights.get(r.id)!.buyCost <= PANTRY_ONLY_MAX_EURO),
    )
    const rej = new Set(rejected)
    // beim zweiten Frühstück: Kombinationen bevorzugen, die Mo–Fr komplett abdecken
    const fits = (r: Recipe) => picks.length !== 1 || Object.keys(assignBreakfasts([picks[0], r.id], days, prep).days).length === covered.length
    const score = (r: Recipe) => bInsights.get(r.id)!.score + (fits(r) ? 0 : -30)
    const fresh = list.filter((r) => !rej.has(r.id)).sort((a, b) => score(b) - score(a))
    const later = rejected.map((id) => list.find((r) => r.id === id)).filter((r): r is Recipe => !!r)
    return [...fresh, ...later]
  }, [bTypes, picks, rejected, bInsights, days, bPantryOnly, prep, covered])

  return { picks, prep, prepLate, prepChoices, covered, assignment, prepItems, prepTotal, prepDone, bInsights, bDeck, satiety }
}

export type BreakfastPlan = ReturnType<typeof useBreakfastPlan>
