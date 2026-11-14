import type { PlanEntry, Recipe, WeekPlan } from '../types'
import { RECIPE_BY_ID } from '../data/recipes'
import { isoDate, shortDate, weekdayName } from '../store'
import { formatTime } from '../filter'
import { RecipeImage } from './RecipeImage'

interface Props {
  days: string[]
  plan: WeekPlan
  onSwipeDay: (day: string) => void
  onOpen: (r: Recipe, day: string) => void
  onUpdate: (day: string, entry: PlanEntry | undefined) => void
  onShop: () => void
}

export function WeekView({ days, plan, onSwipeDay, onOpen, onUpdate, onShop }: Props) {
  const today = isoDate(new Date())
  const planned = days.filter((d) => plan[d]).length
  const firstEmpty = days.find((d) => !plan[d])

  return (
    <div className="week">
      <div className="week-progress">
        <div className="bar"><div style={{ width: `${(planned / 7) * 100}%` }} /></div>
        <span>{planned} von 7 Tagen geplant</span>
      </div>

      {firstEmpty && (
        <button className="btn primary wide big" onClick={() => onSwipeDay(firstEmpty)}>
          👆 {planned === 0 ? 'Woche planen – los geht’s' : `Weiter wischen ab ${weekdayName(firstEmpty)}`}
        </button>
      )}

      <ul className="days">
        {days.map((day) => {
          const entry = plan[day]
          const recipe = entry ? RECIPE_BY_ID[entry.recipeId] : undefined
          return (
            <li key={day} className={`day ${day === today ? 'today' : ''}`}>
              <div className="day-label">
                <b>{weekdayName(day, true)}</b>
                <span>{shortDate(day)}</span>
              </div>
              {recipe && entry ? (
                <div className="day-card">
                  <button className="day-main" onClick={() => onOpen(recipe, day)}>
                    <RecipeImage recipe={recipe} className="thumb" />
                    <div className="day-text">
                      <div className="day-title">{recipe.title}</div>
                      <div className="muted small">⏱ {formatTime(recipe.time)}</div>
                    </div>
                  </button>
                  <div className="day-tools">
                    <div className="stepper small" title="Portionen">
                      <button
                        onClick={() => onUpdate(day, { ...entry, servings: Math.max(1, entry.servings - 1) })}
                        aria-label="weniger Portionen"
                      >
                        −
                      </button>
                      <b>{entry.servings}👤</b>
                      <button
                        onClick={() => onUpdate(day, { ...entry, servings: Math.min(12, entry.servings + 1) })}
                        aria-label="mehr Portionen"
                      >
                        +
                      </button>
                    </div>
                    <button className="icon-btn" onClick={() => onSwipeDay(day)} title="Anderes Gericht wischen" aria-label="Tauschen">
                      🔄
                    </button>
                    <button className="icon-btn" onClick={() => onUpdate(day, undefined)} title="Entfernen" aria-label="Entfernen">
                      🗑
                    </button>
                  </div>
                </div>
              ) : (
                <button className="day-empty" onClick={() => onSwipeDay(day)}>
                  + Gericht wischen
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {planned > 0 && (
        <button className="btn secondary wide big" onClick={onShop}>
          🛒 Einkaufsliste für {planned} {planned === 1 ? 'Gericht' : 'Gerichte'}
        </button>
      )}
    </div>
  )
}
