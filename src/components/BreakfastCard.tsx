import { RECIPE_BY_ID } from '../data/recipes'
import type { BreakfastAssignment } from '../breakfast'
import { prepDay } from '../breakfast'
import { shortDate, weekdayName } from '../store'
import type { Recipe } from '../types'
import { NutritionRow } from './NutritionRow'
import { RecipeImage } from './RecipeImage'

interface Props {
  days: string[]
  picks: string[]
  assignment: BreakfastAssignment
  prepProgress: { done: number; total: number }
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

export function BreakfastCard({ days, picks, assignment, prepProgress, onPlan, onPrep, onOpen, onReset }: Props) {
  if (!picks.length) {
    return (
      <button className="bf-empty" onClick={onPlan}>
        <span className="bf-sun">☀️</span>
        <span>
          <b>Frühstück für Mo–Fr planen</b>
          <small>Einmal sonntags vorbereiten · satt, eiweiß- & ballaststoffreich</small>
        </span>
      </button>
    )
  }

  const prep = prepDay(days)
  return (
    <section className="bf-card">
      <div className="bf-head">
        <b>☀️ Frühstück Mo–Fr</b>
        <button className="link small" onClick={onReset}>Neu wählen</button>
      </div>
      {picks.map((id) => {
        const r = RECIPE_BY_ID[id]
        if (!r) return null
        const ds = Object.entries(assignment.days).filter(([, rid]) => rid === id).map(([d]) => d).sort()
        return (
          <button key={id} className="bf-row" onClick={() => onOpen(r)}>
            <RecipeImage recipe={r} className="thumb small" />
            <span className="bf-text">
              <span className="bf-days">{dayRange(ds) || '–'}{ds.some((d) => assignment.frozen.includes(d)) ? ' · ❄️' : ''}</span>
              <span className="bf-title">{r.title}</span>
              <NutritionRow n={r.nutrition} />
            </span>
          </button>
        )
      })}
      {picks.length === 1 && Object.keys(assignment.days).length < 5 && (
        <button className="link small" onClick={onPlan}>+ zweites Frühstück für den Rest der Woche wählen</button>
      )}
      {assignment.notes.map((n) => (
        <p key={n} className="bf-note">ℹ️ {n}</p>
      ))}
      <button className="btn primary wide" onClick={onPrep}>
        🧑‍🍳 Prep-Liste für {weekdayName(prep)}, {shortDate(prep)}
        {prepProgress.total > 0 && ` · ${prepProgress.done}/${prepProgress.total}`}
      </button>
    </section>
  )
}
