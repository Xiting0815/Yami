import { useMemo, useState } from 'react'
import type { Recipe } from '../types'
import { CUISINE_LABEL } from '../types'
import { RECIPES } from '../data/recipes'
import type { Filters } from '../store'
import { matches, formatTime } from '../filter'
import { FilterBar } from './FilterBar'
import { RecipeImage } from './RecipeImage'

interface Props {
  filters: Filters
  onFilters: (f: Filters) => void
  onOpen: (r: Recipe) => void
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function RecipeBrowser({ filters, onFilters, onOpen }: Props) {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const nq = norm(q.trim())
    return RECIPES.filter((r) => matches(r, filters)).filter(
      (r) => !nq || norm(r.title).includes(nq) || r.ingredients.some((i) => norm(i.name).includes(nq)),
    ).sort((a, b) => a.title.localeCompare(b.title, 'de'))
  }, [q, filters])

  return (
    <div className="browser">
      <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Gericht oder Zutat suchen …" />
      <FilterBar filters={filters} onChange={onFilters} count={list.length} />
      <div className="grid">
        {list.map((r) => (
          <button key={r.id} className="tile" onClick={() => onOpen(r)}>
            <RecipeImage recipe={r} className="tile-img" />
            <div className="tile-text">
              <div className="tile-title">{r.title}</div>
              <div className="muted small">
                {CUISINE_LABEL[r.cuisine]} · {formatTime(r.time)}
                {r.vegetarian ? ' · 🌱' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
