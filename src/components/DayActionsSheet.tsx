import { useEffect } from 'react'
import type { PlanEntry, Recipe } from '../types'
import { shortDate, weekdayName } from '../store'
import { formatTime } from '../filter'
import { type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { RecipeImage } from './RecipeImage'
import { Icon } from './Icon'

interface Props {
  day: string
  entry: PlanEntry
  recipe: Recipe
  today: string
  prices: PriceOverrides
  onClose: () => void
  onServings: (n: number) => void
  onView: () => void
  onSwap: () => void
  /** geplant oder gekocht → „nicht gekocht“ (Zutaten zurück in den Vorrat) */
  onUncook: () => void
  onRecook: () => void
  onRemove: () => void
}

/** „⋯“ in der Wochenansicht: alles, was man mit einem geplanten Tag tun kann */
export function DayActionsSheet({ day, entry, recipe, today, prices, onClose, onServings, onView, onSwap, onUncook, onRecook, onRemove }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const planned = !entry.status

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet actions" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Aktionen für ${weekdayName(day)}`}>
        <div className="act-head">
          <RecipeImage recipe={recipe} className="thumb" />
          <div className="act-head-text">
            <b>{recipe.title}</b>
            <small>
              {weekdayName(day, true)} {shortDate(day)} · {formatTime(recipe.time)} · ≈ {formatEuro(recipeCost(recipe, entry.servings, prices))}
            </small>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen"><Icon name="close" size={18} /></button>
        </div>

        {planned && (
          <div className="act-row static">
            <span className="act-label">
              Portionen
              <small>Für die Einkaufsliste.</small>
            </span>
            <div className="stepper">
              <button onClick={() => onServings(Math.max(1, entry.servings - 1))} aria-label="weniger Portionen">−</button>
              <b>{entry.servings}</b>
              <button onClick={() => onServings(Math.min(12, entry.servings + 1))} aria-label="mehr Portionen">+</button>
            </div>
          </div>
        )}
        <button className="act-row" onClick={onView}><Icon name="book" /> Rezept ansehen</button>
        <button className="act-row" onClick={onSwap}><Icon name="swap" /> Anderes Gericht wischen</button>
        {entry.status === 'cooked' ? (
          <button className="act-row" onClick={onUncook}><Icon name="undo" /> Nicht gekocht – Zutaten zurück in den Vorrat</button>
        ) : entry.status === 'skipped' ? (
          <button className="act-row" onClick={onRecook}><Icon name="pot" /> Doch gekocht</button>
        ) : day <= today ? (
          <button className="act-row" onClick={onUncook}><Icon name="undo" /> Als nicht gekocht markieren</button>
        ) : null}
        <button className="act-row danger" onClick={onRemove}><Icon name="trash" /> Aus dem Plan entfernen</button>
      </div>
    </div>
  )
}
