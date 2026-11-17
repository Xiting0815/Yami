import { useEffect } from 'react'
import { cookDue, moveExpired } from '../kitchen'
import type { AppState } from '../store'
import type { SetAppState } from './types'

/**
 * Vergangene Gerichte (Abendessen & Frühstück) gelten als gekocht → Zutaten vom Vorrat abziehen;
 * vor mehr als 7 Tagen Abgelaufenes gilt als weggeworfen. Idempotent.
 */
export function settleDue(s: Pick<AppState, 'plan' | 'breakfast' | 'pantry' | 'wasted' | 'prices'>, today: string) {
  const r = cookDue(s.plan, s.pantry, today)
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
