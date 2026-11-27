import { useState } from 'react'
import { BAKE_AHEAD_DAYS } from '../bakePlan'
import { addDaysIso } from '../kitchen'
import { shortDate, weekdayName } from '../store'
import { type DayNote, ReplaceConfirm } from './DayPicker'

/**
 * Tage ab heute zum Einplanen (14 Tage) als scrollbare Leiste; `marked` = dort ist dieses Rezept schon eingeplant.
 * `note` zeigt, was an jedem Tag sonst geplant ist (Gericht kurz bzw. Symbol); gekochte Tage sind ausgegraut.
 * `replaces` (Grill-/Tapas-Abend, der das Abendessen ersetzt): belegter Tag → erst „ersetzt: X“ zeigen, dann bestätigen.
 */
export function BakeDays({ today, marked, current, onPick, note, replaces }: {
  today: string
  marked: (day: string) => boolean
  current?: string
  onPick: (day: string) => void
  note?: (day: string) => DayNote
  replaces?: (day: string) => string | undefined
}) {
  const [pending, setPending] = useState<string | null>(null)
  const days = Array.from({ length: BAKE_AHEAD_DAYS }, (_, i) => addDaysIso(today, i))
  const pendingWhat = pending ? replaces?.(pending) : undefined
  return (
    <>
      <div className="bake-days" role="group" aria-label="Tag wählen">
        {days.map((d) => {
          const n = note?.(d) ?? {}
          return (
            <button
              key={d}
              className={`${marked(d) ? 'filled' : ''} ${d === current ? 'current' : ''} ${d === today ? 'is-today' : ''} ${n.done ? 'done' : ''} ${pending === d ? 'pending' : ''}`}
              disabled={d === current}
              onClick={() => (replaces?.(d) && pending !== d ? setPending(d) : onPick(d))}
              aria-label={`${weekdayName(d)} ${shortDate(d)}${n.full ? `: ${n.full}` : ''}${n.done ? ' (schon gekocht)' : ''}`}
            >
              <b>{weekdayName(d, true)}</b>
              <span>{shortDate(d)}</span>
              {n.text && <small className="dot-note">{n.text}</small>}
            </button>
          )
        })}
      </div>
      {pending && pendingWhat && <ReplaceConfirm day={pending} what={pendingWhat} onConfirm={() => onPick(pending)} onCancel={() => setPending(null)} />}
    </>
  )
}
