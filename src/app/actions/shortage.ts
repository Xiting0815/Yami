import { RECIPE_BY_ID } from '../../data/recipes'
import { uid, wdShort } from '../../kitchen'
import { type ShiftRecord, SHIFTS_MAX, weekdayName } from '../../store'
import { commitBuy, findShift, shiftText, undoShift } from '../../shortage'
import { tripsOf } from '../../tripState'
import type { ActionContext } from './context'

/** Warnung am Tag („Es fehlt …“): noch kaufen, verschieben, Ersatz nehmen; automatische Verschiebung zurücknehmen */
export function shortageActions({ state, setState, cal, flash, snapshot }: ActionContext) {
  const { today } = cal
  const toHa = state.ha?.enabled ? ' – geht an Google Tasks' : ''

  /** „Noch kaufen“: „Heute noch“-Einkauf freigeben (wie jede freigegebene Liste → Google Tasks) */
  function buyMissing() {
    const c = commitBuy(state, tripsOf(state, today), Date.now())
    if (!c.trip) {
      flash('Kommt schon mit dem nächsten Einkauf ✓')
      return
    }
    const snap = snapshot()
    setState((s) => ({ ...s, trips: commitBuy(s, tripsOf(s, today), Date.now()).trips }))
    flash(`🛒 Steht auf „Heute noch“${toHa}`, snap)
  }

  /** „Verschieben“: auf den nächsten Tag, an dem es kochbar ist (getauscht bzw. hinter den nächsten Einkauf) */
  function shiftDay(day: string) {
    const f = findShift(state, today, day)
    if (!f) {
      flash('Kein passender Tag, an dem es kochbar ist – lieber noch kaufen oder Ersatz nehmen')
      return
    }
    const snap = snapshot()
    const rec: ShiftRecord = { id: uid(), recipeId: state.plan[day]!.recipeId, from: f.from, to: f.to, ...(f.other ? { other: f.other } : {}), missing: f.missing, date: today }
    setState((s) => ({ ...s, plan: f.plan, shifts: [...s.shifts, rec].slice(-SHIFTS_MAX) }))
    flash(shiftText(rec), snap)
  }

  /** Ersatz annehmen: dieses Gericht kocht mit `to` statt `from` (Bedarf, Einkauf, Kalender rechnen damit) */
  function takeStandIn(day: string, from: string, to: string) {
    const e = state.plan[day]
    if (!e) return
    const snap = snapshot()
    setState((s) => {
      const cur = s.plan[day]
      return cur ? { ...s, plan: { ...s.plan, [day]: { ...cur, swap: { ...cur.swap, [from]: to } } } } : s
    })
    flash(`${to} statt ${from} für ${RECIPE_BY_ID[e.recipeId]?.title ?? 'das Gericht'} ✓`, snap)
  }

  /** Ersatz wieder weg (Originalrezept) */
  function dropStandIn(day: string, from: string) {
    const snap = snapshot()
    setState((s) => {
      const cur = s.plan[day]
      if (!cur?.swap) return s
      const { [from]: _x, ...rest } = cur.swap
      const { swap: _s, ...plain } = cur
      return { ...s, plan: { ...s.plan, [day]: Object.keys(rest).length ? { ...plain, swap: rest } : plain } }
    })
    flash(`Wieder mit ${from}`, snap)
  }

  /** automatische Verschiebung zurücknehmen (bleibt gemerkt → wird nicht noch einmal verschoben) */
  function undoShiftRec(id: string) {
    const rec = state.shifts.find((x) => x.id === id)
    if (!rec) return
    const snap = snapshot()
    setState((s) => undoShift(s, id))
    flash(`${RECIPE_BY_ID[rec.recipeId]?.title ?? 'Gericht'} wieder am ${weekdayName(rec.from)}`, snap)
  }

  /** „Doch heute – noch kaufen“: zurücknehmen und das Fehlende auf „Heute noch“ */
  function undoShiftAndBuy(id: string) {
    const rec = state.shifts.find((x) => x.id === id)
    if (!rec) return
    const snap = snapshot()
    setState((s) => {
      const u = undoShift(s, id)
      return { ...u, trips: commitBuy(u, tripsOf(u, today), Date.now()).trips }
    })
    flash(`Doch ${rec.from === today ? 'heute' : wdShort(rec.from)}: ${rec.missing.join(', ')} steht auf „Heute noch“${toHa}`, snap)
  }

  return { buyMissing, shiftDay, takeStandIn, dropStandIn, undoShiftRec, undoShiftAndBuy }
}
