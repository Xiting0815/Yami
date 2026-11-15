import { useMemo, useState } from 'react'
import type { Recipe } from '../types'
import { CUISINE_LABEL } from '../types'
import { BREAKFASTS, RECIPES } from '../data/recipes'
import { BREAKFAST_LABEL } from '../types'
import { NutritionRow } from './NutritionRow'
import type { Filters } from '../store'
import { matches, formatTime } from '../filter'
import { formatEuro } from '../kitchen'
import { FilterBar } from './FilterBar'
import { RecipeImage } from './RecipeImage'

interface Props {
  filters: Filters
  onFilters: (f: Filters) => void
  onOpen: (r: Recipe) => void
  /** Kosten pro Portion je Rezept */
  perPortion: Map<string, number>
  meal: 'dinner' | 'breakfast'
  onMeal: (m: 'dinner' | 'breakfast') => void
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function RecipeBrowser({ filters, onFilters, onOpen, perPortion, meal, onMeal }: Props) {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const nq = norm(q.trim())
    const base = meal === 'breakfast' ? BREAKFASTS : RECIPES.filter((r) => matches(r, filters, perPortion.get(r.id)))
    return base.filter(
      (r) => !nq || norm(r.title).includes(nq) || r.ingredients.some((i) => norm(i.name).includes(nq)),
    ).sort((a, b) => a.title.localeCompare(b.title, 'de'))
  }, [q, filters, perPortion, meal])

  return (
    <div className="browser">
      <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Gericht oder Zutat suchen …" />
      <div className="segmented">
        <button className={meal === 'breakfast' ? 'on' : ''} onClick={() => onMeal('breakfast')}>☀️ Frühstück</button>
        <button className={meal === 'dinner' ? 'on' : ''} onClick={() => onMeal('dinner')}>🌙 Abendessen</button>
      </div>
      {meal === 'dinner' ? (
        <FilterBar filters={filters} onChange={onFilters} count={list.length} />
      ) : (
        <p className="muted small">{list.length} Meal-Prep-Frühstücke · je ca. 370–470 kcal, ≥ 25 g Eiweiß, ≥ 8 g Ballaststoffe</p>
      )}
      <div className="grid">
        {list.map((r) => (
          <button key={r.id} className="tile" onClick={() => onOpen(r)}>
            <RecipeImage recipe={r} className="tile-img" />
            <div className="tile-text">
              <div className="tile-title">{r.title}</div>
              {r.breakfast ? (
                <>
                  <div className="muted small">{BREAKFAST_LABEL[r.breakfast.type]} · hält {r.breakfast.fridgeDays} T.</div>
                  <NutritionRow n={r.nutrition} className="tiny" />
                </>
              ) : (
                <div className="muted small">
                  {CUISINE_LABEL[r.cuisine]} · {formatTime(r.time)} · ≈ {formatEuro(perPortion.get(r.id) ?? 0)}/P. · {r.nutrition.kcal.toLocaleString('de-DE')} kcal
                  {r.vegetarian ? ' · 🌱' : ''}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
