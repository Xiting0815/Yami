import { useRef } from 'react'
import { useAppState } from '../store'
import { isBought } from '../shopping'
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
import { breakfastActions } from './actions/breakfast'
import { shoppingActions } from './actions/shopping'
import { pantryActions } from './actions/pantry'
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
    ...breakfastActions(ctx, bf),
    ...shoppingActions(ctx),
    ...pantryActions(ctx),
    ...recipeActions(ctx),
    ...profileActions(ctx, status.pendingSuggestion),
  }

  function undo() {
    const u = toast?.undo
    if (!u) return
    // Home-Assistant-Zuordnung bleibt, wie sie ist (sie beschreibt, was dort schon liegt)
    setState((cur) => ({ ...u.state, ha: cur.ha }))
    ui.setRejected(u.rejected)
    ui.setSwipeDay(u.swipeDay)
    ui.setTab(u.tab)
    ui.setMeal(u.meal)
    flash('Rückgängig gemacht ✓')
  }

  // ───── Home Assistant: geteilte Einkaufsliste, Kalender, Erinnerungen ─────
  const haRef = useRef({ buy: plan.haWeek.buy, key: plan.haKey })
  haRef.current = { buy: plan.haWeek.buy, key: plan.haKey }
  const ha = useHomeAssistant({
    ha: state.ha,
    setState,
    local: plan.haLocal,
    state,
    // in HA abgehakt → wie Abhaken in der Liste (Vorrat füllt sich)
    onBought: (keys) => {
      const { buy, key } = haRef.current
      for (const k of keys) {
        const it = buy.find((b) => b.key === k)
        if (it && !isBought(it)) act.toggleBuy(it, key)
      }
    },
  })

  return { state, setState, cal, ui, toast, flash, snapshot, undo, plan, bf, energy, status, act, ha }
}

export type AppModel = ReturnType<typeof useAppModel>
