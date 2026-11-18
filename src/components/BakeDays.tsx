import { BAKE_AHEAD_DAYS } from '../bakePlan'
import { addDaysIso } from '../kitchen'
import { shortDate, weekdayName } from '../store'

/** Tage ab heute zum Einplanen (14 Tage) als scrollbare Leiste; `marked` = dort ist schon etwas eingeplant */
export function BakeDays({ today, marked, current, onPick }: { today: string; marked: (day: string) => boolean; current?: string; onPick: (day: string) => void }) {
  const days = Array.from({ length: BAKE_AHEAD_DAYS }, (_, i) => addDaysIso(today, i))
  return (
    <div className="bake-days" role="group" aria-label="Tag wählen">
      {days.map((d) => (
        <button key={d} className={`${marked(d) ? 'filled' : ''} ${d === current ? 'current' : ''} ${d === today ? 'is-today' : ''}`} disabled={d === current} onClick={() => onPick(d)} aria-label={`${weekdayName(d)} ${shortDate(d)}`}>
          <b>{weekdayName(d, true)}</b>
          <span>{shortDate(d)}</span>
        </button>
      ))}
    </div>
  )
}
