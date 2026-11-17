import type { WeekPlan } from '../types'
import { shortDate, weekdayName } from '../store'

/** Leiste „Einplanen für:“ unter dem Rezept-Sheet (Rezepte-Tab) */
export function DayPicker({ days, plan, onPick }: { days: string[]; plan: WeekPlan; onPick: (d: string) => void }) {
  return (
    <div className="daypicker">
      <span>Einplanen für:</span>
      <div className="daypicker-days">
        {days.map((d) => (
          <button key={d} className={`dot ${plan[d] ? 'filled' : ''}`} onClick={() => onPick(d)}>
            <b>{weekdayName(d, true)}</b>
            <span>{shortDate(d)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
