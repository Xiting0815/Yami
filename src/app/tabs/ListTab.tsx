import { ShoppingList } from '../../components/ShoppingList'
import type { AppModel } from '../useAppModel'

/** Tab „Liste“: Einkaufsliste der angezeigten Woche (mit Home-Assistant-Abgleich) */
export function ListTab({ m }: { m: AppModel }) {
  const { state, cal, ui, plan, act, ha } = m
  const { days, weekKey } = cal
  return (
    <ShoppingList
      result={plan.week}
      planned={days.filter((d) => state.plan[d] || state.breakfast[d] || state.bakePlan[d]?.some((e) => !e.status)).length}
      checked={state.checked[weekKey] ?? []}
      custom={state.custom[weekKey] ?? []}
      onToggleBuy={(it) => act.toggleBuy(it)}
      haShared={ha.live === 'ok' || ha.live === 'connecting'}
      haError={ha.live === 'error' ? state.ha?.error ?? 'Abgleich mit Home Assistant fehlgeschlagen' : undefined}
      haOnWeek={weekKey === plan.haKey}
      onToggleKey={act.toggleChecked}
      onResetChecks={act.resetChecks}
      onAddCustom={act.addCustomItem}
      onRemoveCustom={act.removeCustomItem}
      onEditPrice={act.editPrice}
      onGoPlan={() => ui.setTab('woche')}
    />
  )
}
