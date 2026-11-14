import type { Cuisine, DishType } from '../types'
import { CUISINE_LABEL, TYPE_LABEL } from '../types'
import type { Filters } from '../store'
import { EMPTY_FILTERS } from '../store'

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

export function FilterBar({ filters, onChange, count }: { filters: Filters; onChange: (f: Filters) => void; count: number }) {
  const active =
    filters.cuisines.length + filters.types.length + (filters.vegetarian ? 1 : 0) + (filters.maxTime ? 1 : 0) + (filters.cheap ? 1 : 0) > 0
  return (
    <div className="filterbar">
      <div className="chips">
        {(Object.keys(CUISINE_LABEL) as Cuisine[]).map((c) => (
          <button
            key={c}
            className={`chip ${filters.cuisines.includes(c) ? 'on' : ''}`}
            onClick={() => onChange({ ...filters, cuisines: toggle(filters.cuisines, c) })}
          >
            {c === 'de' ? '🥨' : c === 'it' ? '🇮🇹' : '🥢'} {CUISINE_LABEL[c]}
          </button>
        ))}
      </div>
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
      <div className="chips">
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
        {active && (
          <button className="chip ghost" onClick={() => onChange(EMPTY_FILTERS)}>
            ✕ Zurücksetzen
          </button>
        )}
        <span className="count">{count} Gerichte</span>
      </div>
    </div>
  )
}
