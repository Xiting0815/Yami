import { useEffect } from 'react'
import { cookDue, moveExpired } from '../kitchen'
import { portionFactor } from '../learning'
import { type AppState, sharingActive } from '../store'
import { householdFeedback } from '../sync'
import type { SetAppState } from './types'

/**
 * Vergangene Gerichte (Abendessen & Frühstück) gelten als gekocht → Zutaten vom Vorrat abziehen;
 * vor mehr als 7 Tagen Abgelaufenes gilt als weggeworfen. Idempotent.
 */
export function settleDue(s: Pick<AppState, 'plan' | 'breakfast' | 'pantry' | 'wasted' | 'prices'> & Partial<Pick<AppState, 'portionFeedback' | 'ha' | 'sync'>>, today: string) {
  // Familien-Abgleich: Abendessen zieht nur der Abgleich ab (direkt nach dem Lesen der Haushaltsdaten) – sonst doppelt
  const r = sharingActive(s.ha)
    ? { plan: s.plan, pantry: s.pantry, changed: false }
    : cookDue(s.plan, s.pantry, today, portionFactor(householdFeedback({ portionFeedback: s.portionFeedback ?? {}, ha: s.ha, sync: s.sync }), today))
  const b = cookDue(s.breakfast, r.pantry, today)
  const x = moveExpired(b.pantry, s.wasted, today, s.prices)
  return { plan: r.plan, breakfast: b.plan, pantry: x.pantry, wasted: x.wasted, changed: r.changed || b.changed || x.changed }
}

/**
 * Beim Tageswechsel und sobald ein vergangener Tag neu belegt wird (z. B. „Anderes Gericht wischen“ für gestern,
 * Frühstück neu verteilt) den Vorrat nachziehen.
 */
export function useUpkeep(today: string, state: AppState, setState: SetAppState) {
  useEffect(() => {
    setState((s) => {
      const d = settleDue(s, today)
      return d.changed ? { ...s, plan: d.plan, breakfast: d.breakfast, pantry: d.pantry, wasted: d.wasted } : s
    })
  }, [today, state.plan, state.breakfast, setState])
}
