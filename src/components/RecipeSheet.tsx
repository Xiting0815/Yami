import { useEffect, useState } from 'react'
import type { Recipe } from '../types'
import { BREAKFAST_LABEL, CUISINE_LABEL, TYPE_LABEL } from '../types'
import { NutritionTable } from './NutritionRow'
import { formatTime } from '../filter'
import { formatAmount, scale } from '../shopping'
import { RecipeImage } from './RecipeImage'
import imageMap from '../data/images.json'
import { type Insight, type PriceOverrides, formatEuro, recipeCost } from '../kitchen'
import { InsightBadges } from './SwipeDeck'

type Credit = { author: string; license: string; source: string } | null | undefined
const credits = imageMap as unknown as Record<string, Credit>

interface Props {
  recipe: Recipe
  servings: number
  onClose: () => void
  /** Hauptaktion, z. B. "Für Montag nehmen" */
  action?: { label: string; onClick: (servings: number) => void }
  insight?: Insight
  prices: PriceOverrides
}

export function RecipeSheet({ recipe, servings: initial, onClose, action, insight, prices }: Props) {
  const [servings, setServings] = useState(initial)
  const credit = credits[recipe.id]

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={recipe.title}>
        <button className="sheet-close" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-hero">
          <RecipeImage recipe={recipe} className="sheet-img" />
        </div>
        <div className="sheet-body">
          <div className="card-tags dark">
            {recipe.breakfast ? (
              <>
                <span>☀️ Frühstück</span>
                <span>{BREAKFAST_LABEL[recipe.breakfast.type]}</span>
              </>
            ) : (
              <>
                <span>{CUISINE_LABEL[recipe.cuisine]}</span>
                <span>{TYPE_LABEL[recipe.type]}</span>
                {recipe.vegetarian && <span>🌱 Veggie</span>}
              </>
            )}
            <span>⏱ {formatTime(recipe.time)}</span>
          </div>
          <h2>{recipe.title}</h2>
          {insight && <div className="sheet-badges"><InsightBadges ins={insight} /></div>}

          <div className="servings">
            <span>Portionen</span>
            <div className="stepper">
              <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="weniger">−</button>
              <b>{servings}</b>
              <button onClick={() => setServings((s) => Math.min(12, s + 1))} aria-label="mehr">+</button>
            </div>
          </div>

          <NutritionTable n={recipe.nutrition} servings={1} />

          {recipe.breakfast && (
            <div className="prep-facts">
              <div>🧊 Hält <b>{recipe.breakfast.fridgeDays} Tage</b> im Kühlschrank</div>
              <div>{recipe.breakfast.freezer ? '❄️ Lässt sich portionsweise einfrieren' : '🚫 Nicht zum Einfrieren geeignet'}</div>
              <div>🫙 Pro Portion: 1 {recipe.breakfast.container}</div>
            </div>
          )}

          <p className="muted small cost-line">
            Warenwert ≈ {formatEuro(recipeCost(recipe, servings, prices))} · {formatEuro(recipeCost(recipe, servings, prices) / servings)} pro Portion (ohne Gewürze)
          </p>

          <h3>Zutaten</h3>
          <ul className="ingredients">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <span className="amt">{formatAmount(scale(ing, recipe.servings, servings), ing.unit) || 'n. B.'}</span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>

          <h3>{recipe.breakfast ? 'Vorbereitung (am Prep-Tag)' : 'Zubereitung'}</h3>
          <ol className="steps">
            {recipe.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          {recipe.breakfast && (
            <>
              <h3>Morgens / auf der Arbeit</h3>
              <p className="morning">☀️ {recipe.breakfast.morning}</p>
            </>
          )}

          {credit && (
            <p className="credit">
              Foto: {credit.author} ·{' '}
              <a href={credit.source} target="_blank" rel="noreferrer">
                {credit.license}, Wikimedia Commons
              </a>
            </p>
          )}
        </div>
        {action && (
          <div className="sheet-footer">
            <button className="btn primary wide" onClick={() => action.onClick(servings)}>
              {action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
