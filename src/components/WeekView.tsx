import type { PlanEntry, Recipe, WeekPlan } from '../types'
import { RECIPE_BY_ID } from '../data/recipes'
import { shortDate, weekdayName } from '../store'
import { formatTime } from '../filter'
import { type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { RecipeImage } from './RecipeImage'

interface Props {
  days: string[]
  plan: WeekPlan
  today: string
  total: number
  prices: PriceOverrides
  urgentCount: number
  onSwipeDay: (day: string) => void
  onOpen: (r: Recipe, day: string) => void
  onUpdate: (day: string, entry: PlanEntry | undefined) => void
  onUncook: (day: string) => void
  onRecook: (day: string) => void
  onShop: () => void
  onPantry: () => void
}

export function WeekView(props: Props) {
  const { days, plan, today, total, prices, urgentCount, onSwipeDay, onOpen, onUpdate, onUncook, onRecook, onShop, onPantry } = props
  const planned = days.filter((d) => plan[d]).length
  const firstEmpty = days.find((d) => !plan[d] && d >= today) ?? days.find((d) => !plan[d])

  return (
    <div className="week">
      <div className="week-progress">
        <div className="bar"><div style={{ width: `${(planned / 7) * 100}%` }} /></div>
        <span>{planned} von 7 Tagen geplant</span>
      </div>

      {urgentCount > 0 && (
        <button className="banner warn" onClick={onPantry}>
          ⚠️ {urgentCount} {urgentCount === 1 ? 'Zutat läuft' : 'Zutaten laufen'} bald ab – ansehen
        </button>
      )}

      {firstEmpty && (
        <button className="btn primary wide big" onClick={() => onSwipeDay(firstEmpty)}>
          👆 {planned === 0 ? 'Woche planen – los geht’s' : `Weiter wischen ab ${weekdayName(firstEmpty)}`}
        </button>
      )}

      <ul className="days">
        {days.map((day) => {
          const entry = plan[day]
          const recipe = entry ? RECIPE_BY_ID[entry.recipeId] : undefined
          const past = day < today
          return (
            <li key={day} className={`day ${day === today ? 'today' : ''} ${past ? 'past' : ''}`}>
              <div className="day-label">
                <b>{weekdayName(day, true)}</b>
                <span>{shortDate(day)}</span>
              </div>
              {recipe && entry ? (
                <div className={`day-card ${entry.status === 'skipped' ? 'skipped' : ''}`}>
                  <button className="day-main" onClick={() => onOpen(recipe, day)}>
                    <RecipeImage recipe={recipe} className="thumb" />
                    <div className="day-text">
                      <div className="day-title">{recipe.title}</div>
                      <div className="muted small">
                        ⏱ {formatTime(recipe.time)} · ≈ {formatEuro(recipeCost(recipe, entry.servings, prices))}
                        {entry.status === 'cooked' && <span className="tag ok"> ✓ gekocht</span>}
                        {entry.status === 'skipped' && <span className="tag"> nicht gekocht</span>}
                      </div>
                    </div>
                  </button>
                  <div className="day-tools">
                    {entry.status === 'cooked' ? (
                      <button className="chip" onClick={() => onUncook(day)} title="Zutaten zurück in den Vorrat">
                        ↩︎ Nicht gekocht
                      </button>
                    ) : entry.status === 'skipped' ? (
                      <button className="chip" onClick={() => onRecook(day)}>✓ Doch gekocht</button>
                    ) : (
                      <>
                        <div className="stepper small" title="Portionen">
                          <button onClick={() => onUpdate(day, { ...entry, servings: Math.max(1, entry.servings - 1) })} aria-label="weniger Portionen">
                            −
                          </button>
                          <b>{entry.servings}👤</b>
                          <button onClick={() => onUpdate(day, { ...entry, servings: Math.min(12, entry.servings + 1) })} aria-label="mehr Portionen">
                            +
                          </button>
                        </div>
                        <button className="icon-btn" onClick={() => onSwipeDay(day)} title="Anderes Gericht wischen" aria-label="Tauschen">
                          🔄
                        </button>
                      </>
                    )}
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
          🛒 Einkaufsliste · ≈ {formatEuro(total)}
        </button>
      )}
    </div>
  )
}
