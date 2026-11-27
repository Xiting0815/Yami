import { useState } from 'react'
import type { BakePlan, WeekPlan } from '../types'
import { isBakery, isBbq, isSalat, isTapa } from '../types'
import { RECIPE_BY_ID } from '../data/recipes'
import { bakesOn } from '../bakePlan'
import { shortDate, weekdayName } from '../store'

/** Gerichtname kurz für die kleinen Tages-Knöpfe: „Spaghetti carbonara“ → „Spaghetti“, lange Wörter gekürzt */
export function shortDish(title: string, max = 11): string {
  const first = title.split(/[\s(,–-]+/).find((w) => w.length > 2 && !/^(mit|und|vom|der|die|das|al|alla)$/i.test(w)) ?? title
  return first.length > max ? `${first.slice(0, max - 1)}…` : first
}

export interface DayNote {
  /** kurz, was an dem Tag schon geplant ist (Gericht bzw. Symbol für Tapas-Abend, Grillen, Backen, Salat) */
  text?: string
  /** voller Text fürs Vorlesen/„ersetzt: …“ */
  full?: string
  /** Abendessen ist schon gekocht bzw. übersprungen */
  done?: boolean
  /** offenes Abendessen (würde ersetzt) */
  dinner?: string
}

/** Was an einem Tag schon geplant ist – Abendessen und Zusätze aus dem Backplan */
export function dayNote(plan: WeekPlan, bakePlan: BakePlan | undefined, day: string): DayNote {
  const e = plan[day]
  const r = e ? RECIPE_BY_ID[e.recipeId] : undefined
  const extras = bakePlan ? bakesOn(bakePlan, day).filter((x) => !x.status).map((x) => RECIPE_BY_ID[x.recipeId]).filter(Boolean) : []
  const icon = extras.some(isTapa) ? '🫒' : extras.some(isBbq) ? '🔥' : extras.some(isSalat) ? '🥗' : extras.some(isBakery) ? '🍰' : ''
  const extraFull = extras.some(isTapa) ? 'Tapas-Abend' : extras.some(isBbq) ? 'Grillen' : extras.length ? extras.map((x) => x.title).join(', ') : ''
  if (r) {
    return {
      text: `${icon}${shortDish(r.title, icon ? 9 : 11)}`,
      full: [r.title, extraFull].filter(Boolean).join(' + '),
      done: !!e!.status,
      dinner: e!.status ? undefined : r.title,
    }
  }
  if (icon) return { text: `${icon}${extras.some(isTapa) ? 'Tapas' : extras.some(isBbq) ? 'Grill' : ''}`, full: extraFull }
  return {}
}

/** Hinweis „ersetzt: X“ mit Bestätigen – bevor ein schon belegter Tag überschrieben wird */
export function ReplaceConfirm({ day, what, onConfirm, onCancel }: { day: string; what: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="day-replace" role="alert">
      <span>
        <b>{weekdayName(day)}</b> ist belegt – <b>ersetzt: {what}</b>
      </span>
      <div className="day-replace-btns">
        <button className="btn ghost" onClick={onCancel}>Anderer Tag</button>
        <button className="btn primary" onClick={onConfirm}>Ersetzen</button>
      </div>
    </div>
  )
}

/** Leiste „Einplanen für:“ unter dem Rezept-Sheet (Rezepte-Tab) */
export function DayPicker({ days, plan, bakePlan, today, onPick }: { days: string[]; plan: WeekPlan; bakePlan?: BakePlan; today: string; onPick: (d: string) => void }) {
  const [pending, setPending] = useState<string | null>(null)
  const pendingNote = pending ? dayNote(plan, bakePlan, pending) : undefined
  return (
    <div className="daypicker">
      <span>Einplanen für:</span>
      <div className="daypicker-days">
        {days.map((d) => {
          const n = dayNote(plan, bakePlan, d)
          const past = d < today
          const off = past || n.done
          return (
            <button
              key={d}
              className={`dot ${plan[d] ? 'filled' : ''} ${off ? 'off' : ''} ${pending === d ? 'current' : ''}`}
              disabled={off}
              aria-label={`${weekdayName(d)} ${shortDate(d)}${n.full ? `: ${n.full}` : ''}${past ? ' (vorbei)' : n.done ? ' (schon gekocht)' : ''}`}
              onClick={() => (n.dinner && pending !== d ? setPending(d) : onPick(d))}
            >
              <b>{weekdayName(d, true)}</b>
              <span>{shortDate(d)}</span>
              {n.text && <small className="dot-note">{n.text}</small>}
            </button>
          )
        })}
      </div>
      {pending && pendingNote?.dinner && (
        <ReplaceConfirm day={pending} what={pendingNote.dinner} onConfirm={() => onPick(pending)} onCancel={() => setPending(null)} />
      )}
    </div>
  )
}
