import { useEffect } from 'react'
import type { PlanEntry } from '../types'
import { RECIPE_BY_ID } from '../data/recipes'
import { shortDate, weekdayName } from '../store'
import { addDaysIso } from '../kitchen'
import { Icon } from './Icon'

interface Props {
  today: string
  plan: Record<string, PlanEntry | undefined>
  onClose: () => void
  onPick: (day: string) => void
}

/** „Was koche ich damit?“ – für welchen Tag soll der Vorrat verbraucht werden? */
export function PantryDaySheet({ today, plan, onClose, onPick }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const days = Array.from({ length: 7 }, (_, i) => addDaysIso(today, i))
  const label = (d: string, i: number) => `${i === 0 ? 'Heute' : i === 1 ? 'Morgen' : weekdayName(d)} (${weekdayName(d, true)} ${shortDate(d)})`

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet actions" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Für wann?">
        <div className="act-head">
          <div className="act-head-text">
            <b>Für wann?</b>
            <small>Du bekommst Gerichte, die deinen Vorrat aufbrauchen.</small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen"><Icon name="close" size={18} /></button>
        </div>
        {days.map((d, i) => {
          const e = plan[d]
          const planned = e && e.status !== 'skipped' ? RECIPE_BY_ID[e.recipeId] : undefined
          return (
            <button key={d} className="act-row day-pick" disabled={!!planned} onClick={() => onPick(d)}>
              <span className="act-label">
                {label(d, i)}
                {planned && <small>schon geplant: {planned.title}</small>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
