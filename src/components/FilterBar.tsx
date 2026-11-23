import { useEffect } from 'react'
import type { Cuisine, DishType } from '../types'
import { CUISINE_LABEL, TYPE_LABEL } from '../types'
import type { Filters } from '../store'
import { EMPTY_FILTERS } from '../store'

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

/** Anzahl gesetzter Filter (für die Anzeige am Filter-Knopf) */
export function activeFilterCount(f: Filters): number {
  return f.cuisines.length + f.types.length + (f.vegetarian ? 1 : 0) + (f.maxTime ? 1 : 0) + (f.cheap ? 1 : 0) + (f.pantryOnly ? 1 : 0)
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  count: number
  /** im Filter-Sheet: Chips umbrechen, Zurücksetzen & Anzahl stehen im Sheet-Fuß */
  inSheet?: boolean
}

export function FilterBar({ filters, onChange, count, inSheet }: Props) {
  const active = activeFilterCount(filters) > 0
  return (
    <div className={`filterbar ${inSheet ? 'wrap' : ''}`}>
      {inSheet && <h3>Küche</h3>}
      <div className="chips">
        {(Object.keys(CUISINE_LABEL) as Cuisine[]).map((c) => (
          <button
            key={c}
            className={`chip ${filters.cuisines.includes(c) ? 'on' : ''}`}
            onClick={() => onChange({ ...filters, cuisines: toggle(filters.cuisines, c) })}
          >
            {c === 'de' ? '🥨' : c === 'it' ? '🇮🇹' : c === 'gr' ? '🇬🇷' : c === 'us' ? '🇺🇸' : '🥢'} {CUISINE_LABEL[c]}
          </button>
        ))}
      </div>
      {inSheet && <h3>Art</h3>}
      <div className="chips">
        {(Object.keys(TYPE_LABEL) as DishType[]).map((t) => (
          <button
            key={t}
            className={`chip ${filters.types.includes(t) ? 'on' : ''}`}
            onClick={() => onChange({ ...filters, types: toggle(filters.types, t) })}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      {inSheet && <h3>Außerdem</h3>}
      <div className="chips">
        <button className={`chip ${filters.pantryOnly ? 'on' : ''}`} onClick={() => onChange({ ...filters, pantryOnly: !filters.pantryOnly })}>
          🧺 Nur mit Vorrat
        </button>
        <button className={`chip ${filters.cheap ? 'on' : ''}`} onClick={() => onChange({ ...filters, cheap: !filters.cheap })}>
          💶 Günstig
        </button>
        <button
          className={`chip ${filters.vegetarian ? 'on' : ''}`}
          onClick={() => onChange({ ...filters, vegetarian: !filters.vegetarian })}
        >
          🌱 Vegetarisch
        </button>
        {[30, 60].map((m) => (
          <button
            key={m}
            className={`chip ${filters.maxTime === m ? 'on' : ''}`}
            onClick={() => onChange({ ...filters, maxTime: filters.maxTime === m ? 0 : m })}
          >
            ⏱ bis {m} Min.
          </button>
        ))}
        {!inSheet && active && (
          <button className="chip ghost" onClick={() => onChange(EMPTY_FILTERS)}>
            ✕ Zurücksetzen
          </button>
        )}
        {!inSheet && <span className="count">{count} Gerichte</span>}
      </div>
    </div>
  )
}

/** Filter als Sheet von unten – verdrängt beim Wischen weder Karte noch Knöpfe */
export function FilterSheet({ filters, onChange, count, onClose }: Props & { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  const n = activeFilterCount(filters)

  return (
    <div className="sheet-backdrop light" onClick={onClose}>
      <div className="sheet filters" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filter">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>⚙︎ Filter</h2>
          <FilterBar filters={filters} onChange={onChange} count={count} inSheet />
        </div>
        <div className="sheet-footer row-btns">
          <button className="btn ghost" disabled={n === 0} onClick={() => onChange(EMPTY_FILTERS)}>
            Zurücksetzen
          </button>
          <button className="btn primary grow" onClick={onClose}>
            Fertig · {count} {count === 1 ? 'Gericht' : 'Gerichte'}
          </button>
        </div>
      </div>
    </div>
  )
}
