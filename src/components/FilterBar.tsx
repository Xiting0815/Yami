import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Cuisine, DishType } from '../types'
import { CUISINE_ICON, CUISINE_LABEL, TYPE_LABEL } from '../types'
import type { Filters } from '../store'
import { EMPTY_FILTERS } from '../store'

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

/**
 * Seitlich scrollende Chip-Reihe: beim Öffnen (und wenn sich `key` ändert) so weit scrollen,
 * dass der erste aktive Chip (.chip.on) sichtbar ist – sonst liegt ein gesetzter Filter
 * unbemerkt rechts außerhalb des Bildschirms.
 */
export function useActiveChipInView<T extends HTMLElement>(key: unknown) {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const rows = ref.current ? [ref.current, ...ref.current.querySelectorAll<HTMLElement>('.chips, .chips-row')] : []
    for (const row of rows) {
      const on = row.querySelector<HTMLElement>(':scope > .chip.on')
      if (!on || row.scrollWidth <= row.clientWidth) continue
      const left = on.offsetLeft - row.offsetLeft
      if (left < row.scrollLeft || left + on.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollLeft = Math.max(0, left - 16)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return ref
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

/** gesetzte Filter als kurze Beschriftung + Funktion zum Entfernen (für die Zeile „Aktiv“) */
function activeFilterList(f: Filters): { key: string; label: string; next: Filters }[] {
  return [
    ...f.cuisines.map((c) => ({ key: 'c-' + c, label: `${CUISINE_ICON[c]} ${CUISINE_LABEL[c]}`, next: { ...f, cuisines: f.cuisines.filter((x) => x !== c) } })),
    ...f.types.map((t) => ({ key: 't-' + t, label: TYPE_LABEL[t], next: { ...f, types: f.types.filter((x) => x !== t) } })),
    ...(f.pantryOnly ? [{ key: 'pantry', label: '🧺 Nur mit Vorrat', next: { ...f, pantryOnly: false } }] : []),
    ...(f.cheap ? [{ key: 'cheap', label: '💶 Günstig', next: { ...f, cheap: false } }] : []),
    ...(f.vegetarian ? [{ key: 'veg', label: '🌱 Vegetarisch', next: { ...f, vegetarian: false } }] : []),
    ...(f.maxTime ? [{ key: 'time', label: `⏱ bis ${f.maxTime} Min.`, next: { ...f, maxTime: 0 } }] : []),
  ]
}

export function FilterBar({ filters, onChange, count, inSheet }: Props) {
  const on = activeFilterList(filters)
  const ref = useActiveChipInView<HTMLDivElement>(inSheet)
  return (
    <div className={`filterbar ${inSheet ? 'wrap' : ''}`} ref={ref}>
      {/* Die Chip-Reihen scrollen seitlich – gesetzte Filter (z. B. „bis 30 Min.“ ganz rechts) stehen deshalb
          zusätzlich hier oben, immer sichtbar und einzeln abwählbar. */}
      {!inSheet && (
        <div className="filter-active" aria-live="polite">
          <span className="count">
            {count} {count === 1 ? 'Gericht' : 'Gerichte'}
            {on.length > 0 ? ' · Filter:' : ''}
          </span>
          {on.map((x) => (
            <button key={x.key} className="chip on" onClick={() => onChange(x.next)} aria-label={`Filter ${x.label} entfernen`}>
              {x.label} ✕
            </button>
          ))}
          {on.length > 1 && (
            <button className="chip ghost" onClick={() => onChange(EMPTY_FILTERS)}>
              Alle zurücksetzen
            </button>
          )}
        </div>
      )}
      {inSheet && <h3>Küche</h3>}
      <div className="chips">
        {(Object.keys(CUISINE_LABEL) as Cuisine[]).map((c) => (
          <button
            key={c}
            className={`chip ${filters.cuisines.includes(c) ? 'on' : ''}`}
            onClick={() => onChange({ ...filters, cuisines: toggle(filters.cuisines, c) })}
          >
            {CUISINE_ICON[c]} {CUISINE_LABEL[c]}
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
