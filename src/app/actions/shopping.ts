import { type AppState, type CustomItem } from '../../store'
import { isSpice, toggleSpiceBought } from '../../staples'
import { type BuyItem, type Trip, addDaysIso, uid, unbuy } from '../../kitchen'
import type { BoughtWhen } from '../../haSync'
import { answerTrip, boughtDay, haveAmount, haveLot, releaseTrip as release, unreleaseTrip as unrelease } from '../../tripState'
import type { ActionContext } from './context'

/** Liste, in die geschrieben wird: Einkauf (`trip:<Tag>`) bzw. alte Wochenliste (Montag), aus der gelesen wird */
export interface ListRef {
  key: string
  legacyKey?: string
}

/**
 * Artikel abhaken (Vorrat füllt sich) bzw. – nur bei `mode: 'toggle'` – wieder abwählen.
 * `mode: 'mark'` (in Google Tasks abgehakt): kauft nur, was im übergebenen (aktuellen) Stand noch fehlt, nimmt nie etwas zurück;
 * `when` = Kauftag aus Google Tasks bzw. „nachgetragen“ (Haltbarkeit ab dem plausibelsten Tag, siehe boughtDay).
 */
export function applyBuy(s: AppState, item: BuyItem, list: ListRef, today: string, mode: 'toggle' | 'mark' = 'toggle', when?: BoughtWhen): AppState {
  const day = boughtDay(when, list.key, s.trips, today)
  const late = when?.late && !when.at ? { late: true as const } : {}
  // schon auf der alten Wochenliste abgehakt → dort zurücknehmen
  const forKey = !s.bought[list.key]?.[item.name] && list.legacyKey && s.bought[list.legacyKey]?.[item.name] ? list.legacyKey : list.key
  // Gewürz: abhaken heißt „wieder da“ (kein Vorratsposten), Abwählen wieder „alle“
  if (isSpice(item.name)) {
    if (mode === 'mark' && s.bought[forKey]?.[item.name]) return s
    const r = toggleSpiceBought(s.spices, s.bought[forKey] ?? {}, item.name, item.product.pack)
    const checked = new Set(s.checked[forKey] ?? [])
    if (r.on) checked.add(item.key)
    else checked.delete(item.key)
    return { ...s, spices: r.spices, bought: { ...s.bought, [forKey]: r.bought }, checked: { ...s.checked, [forKey]: [...checked] } }
  }
  const wk = { ...(s.bought[forKey] ?? {}) }
  const checked = new Set(s.checked[forKey] ?? [])
  let pantry = s.pantry
  let { plan, breakfast } = s
  const b = wk[item.name]
  const needed = item.packs * item.product.pack
  if (b && b.amount < needed - 1e-6) {
    // Portionen wurden nach dem Einkauf erhöht → nur die fehlende Menge nachkaufen
    const delta = needed - b.amount
    const has = pantry.some((l) => l.id === b.lotId)
    if (has) pantry = pantry.map((l) => (l.id === b.lotId ? { ...l, amount: l.amount + delta } : l))
    else pantry = [...pantry, { id: b.lotId, name: item.name, amount: delta, unit: item.unit, expires: addDaysIso(day, item.product.shelf) }]
    wk[item.name] = { lotId: b.lotId, amount: needed, at: day, ...late }
    checked.add(item.key)
  } else if (b) {
    if (mode === 'mark') return s // schon gekauft (z. B. gerade vom anderen Handy übernommen) → nichts zurücknehmen
    // doch nicht gekauft: nur den Rest des Postens entfernen; schon damit Gekochtes verweist danach nicht mehr darauf
    const u = unbuy(pantry, [plan, breakfast], b.lotId, b.amount)
    pantry = u.pantry
    ;[plan, breakfast] = u.plans
    delete wk[item.name]
    checked.delete(item.key)
  } else {
    const amount = item.packs * item.product.pack
    const lot = { id: uid(), name: item.name, amount, unit: item.unit, expires: addDaysIso(day, item.product.shelf) }
    pantry = [...pantry, lot]
    // Abhak-Tag: daraus lernt Yami, an welchem Wochentag ihr wirklich einkauft („nachgetragen“ zählt dafür nicht)
    wk[item.name] = { lotId: lot.id, amount, at: day, ...late }
    checked.add(item.key)
  }
  return { ...s, pantry, plan, breakfast, bought: { ...s.bought, [forKey]: wk }, checked: { ...s.checked, [forKey]: [...checked] } }
}

/** Einkaufsliste: abhaken (füllt den Vorrat), zurücksetzen, eigene Posten, Preise, prüfen & freigeben */
export function shoppingActions({ state: s0, setState, cal, flash, snapshot }: ActionContext) {
  const { today } = cal

  function toggleBuy(item: BuyItem, list: ListRef) {
    setState((s) => applyBuy(s, item, list, today))
  }

  /** in Google Tasks abgehakt → als gekauft markieren; idempotent, entscheidet am aktuellen Stand */
  function markBought(item: BuyItem, list: ListRef, when?: BoughtWhen) {
    setState((s) => applyBuy(s, item, list, today, 'mark', when))
  }

  function resetChecks(list: ListRef) {
    const snap = snapshot()
    flash('Haken zurückgesetzt', snap)
    setState((s) => {
      let pantry = s.pantry
      let plans = [s.plan, s.breakfast]
      const spices = { ...s.spices }
      const bought = { ...s.bought }
      const checked = { ...s.checked }
      for (const key of [list.key, list.legacyKey].filter((k): k is string => !!k)) {
        for (const [name, b] of Object.entries(s.bought[key] ?? {})) {
          if (b.lotId.startsWith('spice:')) {
            spices[name] = 'alle'
            continue
          }
          ;({ pantry, plans } = unbuy(pantry, plans, b.lotId, b.amount))
        }
        if (bought[key]) bought[key] = {}
        if (checked[key]) checked[key] = []
      }
      return { ...s, spices, pantry, plan: plans[0], breakfast: plans[1], bought, checked }
    })
  }

  /** Haken ohne Vorratsbuchung (eigene Posten, Grundzutaten) */
  function toggleChecked(key: string, list: ListRef) {
    setState((s) => {
      const keys = [list.key, list.legacyKey].filter((k): k is string => !!k)
      const on = keys.some((k) => s.checked[k]?.includes(key))
      const checked = { ...s.checked }
      if (on) for (const k of keys) checked[k] = (checked[k] ?? []).filter((x) => x !== key)
      else checked[list.key] = [...(checked[list.key] ?? []), key]
      return { ...s, checked }
    })
  }

  function addCustomItem(item: CustomItem, list: ListRef) {
    setState((s) => ({ ...s, custom: { ...s.custom, [list.key]: [...(s.custom[list.key] ?? []), item] } }))
  }

  function removeCustomItem(id: string, list: ListRef) {
    setState((s) => {
      const custom = { ...s.custom }
      for (const k of [list.key, list.legacyKey]) if (k && custom[k]) custom[k] = custom[k].filter((c) => c.id !== id)
      return { ...s, custom }
    })
  }

  function editPrice(name: string, pack: number, price: number) {
    setState((s) => ({ ...s, prices: { ...s.prices, [name]: { pack, price } } }))
  }

  // ───── Liste prüfen & freigeben ─────

  /**
   * „Habe ich“: Menge kommt in den Vorrat (Artikel verschwindet von der Liste), Antwort wird gemerkt (Lernen).
   * Mit eigener Menge („Habe ich – andere Menge“) wird auch sie gemerkt → „meist noch ~200 g da“ (usualHave).
   */
  function answerHave(trip: Trip, item: BuyItem, given?: number) {
    const amount = given ?? haveAmount(item)
    setState((s) => {
      const trips = answerTrip(s.trips, trip.date, item.key, 'have', given)
      if (isSpice(item.name)) return { ...s, trips, spices: { ...s.spices, [item.name]: 'da' } }
      if (!(amount > 0)) return { ...s, trips }
      return { ...s, trips, pantry: [...s.pantry, haveLot(item, amount, today, uid())] }
    })
  }

  function answerNeed(trip: Trip, item: BuyItem) {
    setState((s) => ({ ...s, trips: answerTrip(s.trips, trip.date, item.key, 'need') }))
  }

  /** Freigeben: erst jetzt geht die Liste an Home Assistant (Google Tasks) */
  function releaseTrip(trip: Trip) {
    setState((s) => ({ ...s, trips: release(s.trips, trip, Date.now()) }))
    flash(s0.ha?.enabled ? 'Freigegeben ✓ – die Liste geht an Google Tasks' : 'Einkauf freigegeben ✓')
  }

  function unreleaseTrip(trip: Trip) {
    setState((s) => ({ ...s, trips: unrelease(s.trips, trip.date) }))
  }

  /** Haupteinkaufstag setzen (aus dem gelernten Vorschlag oder von Hand) */
  function setShopDay(day: number) {
    setState((s) => ({ ...s, shopDay: day, shopDayAsked: day }))
  }

  function dismissShopDay(day: number) {
    setState((s) => ({ ...s, shopDayAsked: day }))
  }

  /** „Im Vorrat führen?“ beantwortet (einmal fragen) */
  function answerStock(name: string, yes: boolean) {
    setState((s) => ({ ...s, stockAsk: { ...s.stockAsk, [name]: yes ? 'yes' : 'no' } }))
  }

  return { toggleBuy, markBought, resetChecks, toggleChecked, addCustomItem, removeCustomItem, editPrice, answerHave, answerNeed, releaseTrip, unreleaseTrip, setShopDay, dismissShopDay, answerStock }
}
