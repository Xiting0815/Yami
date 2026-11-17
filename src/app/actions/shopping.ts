import { type CustomItem } from '../../store'
import { isSpice, toggleSpiceBought } from '../../staples'
import { type BuyItem, addDaysIso, uid, unbuy } from '../../kitchen'
import type { ActionContext } from './context'

/** Einkaufsliste: abhaken (füllt den Vorrat), zurücksetzen, eigene Posten, Preise */
export function shoppingActions({ setState, cal, flash, snapshot }: ActionContext) {
  const { today, weekKey } = cal

  function toggleBuy(item: BuyItem, forWeek = weekKey) {
    // Gewürz: abhaken heißt „wieder da“ (kein Vorratsposten), Abwählen wieder „alle“
    if (isSpice(item.name)) {
      setState((s) => {
        const r = toggleSpiceBought(s.spices, s.bought[forWeek] ?? {}, item.name, item.product.pack)
        const checked = new Set(s.checked[forWeek] ?? [])
        if (r.on) checked.add(item.key)
        else checked.delete(item.key)
        return { ...s, spices: r.spices, bought: { ...s.bought, [forWeek]: r.bought }, checked: { ...s.checked, [forWeek]: [...checked] } }
      })
      return
    }
    setState((s) => {
      const wk = { ...(s.bought[forWeek] ?? {}) }
      const checked = new Set(s.checked[forWeek] ?? [])
      let pantry = s.pantry
      let { plan, breakfast } = s
      const b = wk[item.name]
      const needed = item.packs * item.product.pack
      if (b && b.amount < needed - 1e-6) {
        // Portionen wurden nach dem Einkauf erhöht → nur die fehlende Menge nachkaufen
        const delta = needed - b.amount
        const has = pantry.some((l) => l.id === b.lotId)
        if (has) pantry = pantry.map((l) => (l.id === b.lotId ? { ...l, amount: l.amount + delta } : l))
        else pantry = [...pantry, { id: b.lotId, name: item.name, amount: delta, unit: item.unit, expires: addDaysIso(today, item.product.shelf) }]
        wk[item.name] = { lotId: b.lotId, amount: needed }
        checked.add(item.key)
      } else if (b) {
        // doch nicht gekauft: nur den Rest des Postens entfernen; schon damit Gekochtes verweist danach nicht mehr darauf
        const u = unbuy(pantry, [plan, breakfast], b.lotId, b.amount)
        pantry = u.pantry
        ;[plan, breakfast] = u.plans
        delete wk[item.name]
        checked.delete(item.key)
      } else {
        const amount = item.packs * item.product.pack
        const lot = { id: uid(), name: item.name, amount, unit: item.unit, expires: addDaysIso(today, item.product.shelf) }
        pantry = [...pantry, lot]
        wk[item.name] = { lotId: lot.id, amount }
        checked.add(item.key)
      }
      return { ...s, pantry, plan, breakfast, bought: { ...s.bought, [forWeek]: wk }, checked: { ...s.checked, [forWeek]: [...checked] } }
    })
  }

  function resetChecks() {
    const snap = snapshot()
    flash('Haken zurückgesetzt', snap)
    setState((s) => {
      const wk = s.bought[weekKey] ?? {}
      let pantry = s.pantry
      let plans = [s.plan, s.breakfast]
      const spices = { ...s.spices }
      for (const [name, b] of Object.entries(wk)) {
        if (b.lotId.startsWith('spice:')) {
          spices[name] = 'alle'
          continue
        }
        ;({ pantry, plans } = unbuy(pantry, plans, b.lotId, b.amount))
      }
      return { ...s, spices, pantry, plan: plans[0], breakfast: plans[1], bought: { ...s.bought, [weekKey]: {} }, checked: { ...s.checked, [weekKey]: [] } }
    })
  }

  /** Haken ohne Vorratsbuchung (eigene Posten, Grundzutaten) */
  function toggleChecked(key: string) {
    setState((s) => {
      const cur = new Set(s.checked[weekKey] ?? [])
      if (cur.has(key)) cur.delete(key)
      else cur.add(key)
      return { ...s, checked: { ...s.checked, [weekKey]: [...cur] } }
    })
  }

  function addCustomItem(item: CustomItem) {
    setState((s) => ({ ...s, custom: { ...s.custom, [weekKey]: [...(s.custom[weekKey] ?? []), item] } }))
  }

  function removeCustomItem(id: string) {
    setState((s) => ({ ...s, custom: { ...s.custom, [weekKey]: (s.custom[weekKey] ?? []).filter((c) => c.id !== id) } }))
  }

  function editPrice(name: string, pack: number, price: number) {
    setState((s) => ({ ...s, prices: { ...s.prices, [name]: { pack, price } } }))
  }

  return { toggleBuy, resetChecks, toggleChecked, addCustomItem, removeCustomItem, editPrice }
}
