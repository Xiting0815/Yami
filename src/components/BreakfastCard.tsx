import { RECIPE_BY_ID } from '../data/recipes'
import { type BreakfastAssignment, prepDayText } from '../breakfast'
import { weekdayName } from '../store'
import type { Recipe } from '../types'
import { RecipeImage } from './RecipeImage'
import { Icon } from './Icon'
import { PrepDayChip } from './PrepDayChip'

interface Props {
  picks: string[]
  assignment: BreakfastAssignment
  /** Prep-Tag, wählbare Tage und die davon abgedeckten Arbeitstage */
  prep: string
  /** heute (ISO) – Prep-Tag heute → „heute (Do, 26.11.)“ */
  today?: string
  prepChoices: string[]
  covered: string[]
  onPrepDay: (iso: string) => void
  prepProgress: { done: number; total: number }
  open: boolean
  onToggle: () => void
  onPlan: () => void
  onPrep: () => void
  onOpen: (r: Recipe) => void
  onReset: () => void
}

/** "Mo–Mi" aus einer Liste von Tagen */
function dayRange(ds: string[]): string {
  if (!ds.length) return ''
  if (ds.length === 1) return weekdayName(ds[0], true)
  return `${weekdayName(ds[0], true)}–${weekdayName(ds[ds.length - 1], true)}`
}

const FILLER = new Set(['mit', 'und', '&', 'auf', 'aus', 'in', 'im', 'à', 'la', 'vom', 'zum'])
/** die ersten zwei Wörter eines Rezepttitels, ohne hängendes „mit“/„und“ */
export function shortTitle(title: string): string {
  const w = title.split(' ').slice(0, 2)
  if (w.length > 1 && FILLER.has(w[1].toLowerCase())) w.pop()
  return w.join(' ')
}

/** Frühstückszeile der Wochenansicht: zugeklappt 56 px, aufgeklappt mit beiden Rezepten */
export function BreakfastCard({ picks, assignment, prep, today, prepChoices, covered, onPrepDay, prepProgress, open, onToggle, onPlan, onPrep, onOpen, onReset }: Props) {
  if (!picks.length) {
    return (
      <button className="bf-bar empty" onClick={onPlan}>
        <span className="bf-sun"><Icon name="sun" size={22} /></span>
        <span className="bf-mid">
          <b>Frühstück für {dayRange(covered) || 'die Woche'} planen</b>
          <small>1–2 Rezepte, einmal vorbereiten ({prepDayText(prep, today)})</small>
        </span>
        <Icon name="chevron" size={20} />
      </button>
    )
  }

  const rows = picks
    .map((id) => RECIPE_BY_ID[id])
    .filter(Boolean)
    .map((r) => ({
      r,
      ds: Object.entries(assignment.days).filter(([, rid]) => rid === r.id).map(([d]) => d).sort(),
    }))
  const summary = rows.map(({ r, ds }) => `${dayRange(ds) || '–'} ${shortTitle(r.title)}`).join(' · ')
  const prepDone = prepProgress.total > 0 && prepProgress.done >= prepProgress.total

  return (
    <section className={`bf-card ${open ? 'open' : ''}`}>
      <div className="bf-bar">
        <button className="bf-toggle" onClick={onToggle} aria-expanded={open} aria-label={`Frühstück ${dayRange(covered)}: ${summary}`} />
        <span className="bf-thumbs">
          {rows.slice(0, 2).map(({ r }) => <RecipeImage key={r.id} recipe={r} className="thumb" />)}
        </span>
        <span className="bf-mid">
          <b>Frühstück {dayRange(covered)}</b>
          <small>{summary}</small>
        </span>
        <button className="bf-prep" onClick={onPrep} aria-label={`Prep-Liste, ${prepProgress.done} von ${prepProgress.total} Schritten erledigt`}>
          <span className={`pill ${prepDone ? 'ghost' : 'soft'}`}>{prepDone ? 'Prep ✓' : `Prep ${prepProgress.done}/${prepProgress.total}`}</span>
        </button>
        <span className="bf-chev"><Icon name="chevronDown" size={20} /></span>
      </div>
      {open && (
        <div className="bf-body">
          <div className="bf-prepday">
            <PrepDayChip prep={prep} choices={prepChoices} onChange={onPrepDay} today={today} />
            {covered.length < 5 && <span className="muted small">{covered.length === 1 ? '1 Tag' : `${covered.length} Tage`} abgedeckt</span>}
          </div>
          {rows.map(({ r, ds }) => (
            <button key={r.id} className="bf-row" onClick={() => onOpen(r)}>
              <RecipeImage recipe={r} className="thumb" />
              <span className="bf-text">
                <span className="bf-days">{dayRange(ds) || '–'}{ds.some((d) => assignment.frozen.includes(d)) ? ' · ❄️' : ''}</span>
                <span className="bf-title">{r.title}</span>
              </span>
            </button>
          ))}
          {picks.length === 1 && Object.keys(assignment.days).length < covered.length && (
            <button className="link small" onClick={onPlan}>+ zweites Frühstück für den Rest der Woche wählen</button>
          )}
          {assignment.notes.map((n) => (
            <p key={n} className="bf-note"><Icon name="info" size={16} /><span>{n}</span></p>
          ))}
          <button className="link small" onClick={onReset}>Neu wählen</button>
        </div>
      )}
    </section>
  )
}
