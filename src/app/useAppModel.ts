import { useRef } from 'react'
import { useAppState } from '../store'
import { isBought } from '../shopping'
import { findHaItem } from '../tripState'
import { useHomeAssistant } from '../useHa'
import { useCalendar } from './useCalendar'
import { useUi } from './useUi'
import { useSnapshot, useToast } from './useToast'
import { useUpkeep } from './upkeep'
import { usePlanning } from './usePlanning'
import { useBreakfastPlan } from './useBreakfastPlan'
import { useBalances } from './useBalances'
import { useStatus } from './useStatus'
import type { ActionContext } from './actions/context'
import { planActions } from './actions/plan'
import { bakeActions } from './actions/bake'
import { breakfastActions } from './actions/breakfast'
import { shoppingActions } from './actions/shopping'
import { pantryActions } from './actions/pantry'
import { shortageActions } from './actions/shortage'
import { recipeActions } from './actions/recipes'
import { profileActions } from './actions/profile'

/**
 * Der ganze App-Zustand an einer Stelle: gespeicherter Zustand, Bildschirm-Zustand, abgeleitete Werte und Aktionen.
 * Aktionen werden bei jedem Rendern neu gebaut (wie vorher die Funktionen in App) – so sehen sie immer den aktuellen Stand.
 */
export function useAppModel() {
  const [state, setState] = useAppState()
  const cal = useCalendar()
  const ui = useUi(cal.days, cal.weekKey)
  const { toast, setToast, flash } = useToast()
  const snapshot = useSnapshot({ state, rejected: ui.rejected, swipeDay: ui.swipeDay, tab: ui.tab, meal: ui.meal })
  useUpkeep(cal.today, state, setState)

  const plan = usePlanning(state, cal, ui)
  const bf = useBreakfastPlan(state, cal, ui, plan)
  const energy = useBalances(state, cal.days)
  const status = useStatus(state, setState, cal, ui, bf.picks)

  const ctx: ActionContext = { state, setState, cal, ui, flash, setToast, snapshot }
  const act = {
    ...planActions(ctx),
    ...bakeActions(ctx),
    ...breakfastActions(ctx, bf),
    ...shoppingActions(ctx),
    ...pantryActions(ctx),
    ...shortageActions(ctx),
    ...recipeActions(ctx),
    ...profileActions(ctx, status.pendingSuggestion),
  }

  function undo() {
    const u = toast?.undo
    if (!u) return
    // Home-Assistant-Zuordnung bleibt, wie sie ist (sie beschreibt, was dort schon liegt)
    // … und der Familien-Abgleich-Stand auch: das Zurückgenommene gilt dann als eigene Änderung und wird geteilt
    setState((cur) => ({ ...u.state, ha: cur.ha, sync: cur.sync }))
    ui.setRejected(u.rejected)
    ui.setSwipeDay(u.swipeDay)
    ui.setTab(u.tab)
    ui.setMeal(u.meal)
    ui.setRateDay(null)
    flash('Rückgängig gemacht ✓')
  }

  // ───── Home Assistant: geteilte Einkaufsliste, Kalender, Erinnerungen ─────
  const haRef = useRef(plan.trips)
  haRef.current = plan.trips
  const ha = useHomeAssistant({
    ha: state.ha,
    setState,
    local: plan.haLocal,
    state,
    // in HA abgehakt → wie Abhaken in der Liste (Vorrat füllt sich); Schlüssel `<Einkaufstag>|<Artikel>`
    onBought: (keys) => {
      for (const k of keys) {
        const hit = findHaItem(haRef.current, k)
        if (hit && !isBought(hit.item)) act.toggleBuy(hit.item, hit.trip)
      }
    },
  })

  return { state, setState, cal, ui, toast, flash, snapshot, undo, plan, bf, energy, status, act, ha }
}

export type AppModel = ReturnType<typeof useAppModel>
