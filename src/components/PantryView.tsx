import { useMemo, useState } from 'react'
import { CATALOG } from '../data/catalog'
import { PRODUCTS } from '../data/products'
import { SHOP_ICON } from '../types'
import { formatAmount } from '../shopping'
import { type PantryLot, addDaysIso, daysUntil, uid } from '../kitchen'

interface Props {
  pantry: PantryLot[]
  /** voraussichtlich übrig nach den geplanten Gerichten */
  leftovers: PantryLot[]
  today: string
  onChange: (lots: PantryLot[]) => void
  onCook: () => void
}

const TRACKED = Object.keys(PRODUCTS)
  .filter((n) => CATALOG[n] && CATALOG[n] !== 'vorrat')
  .sort((a, b) => a.localeCompare(b, 'de'))

function expiryText(days: number): string {
  if (days < 0) return days === -1 ? 'seit gestern abgelaufen' : `seit ${-days} Tagen abgelaufen`
  if (days === 0) return 'heute verbrauchen'
  if (days === 1) return 'bis morgen'
  if (days <= 30) return `noch ${days} Tage`
  if (days <= 120) return `noch ${Math.round(days / 7)} Wochen`
  return 'lange haltbar'
}

export function PantryView({ pantry, leftovers, today, onChange, onCook }: Props) {
  const [query, setQuery] = useState('')
  const sorted = useMemo(() => [...pantry].sort((a, b) => a.expires.localeCompare(b.expires)), [pantry])
  const groups = [
    { title: '⚠️ Bald verbrauchen', items: sorted.filter((l) => daysUntil(l.expires, today) <= 3) },
    { title: '🥬 Diese Woche', items: sorted.filter((l) => { const d = daysUntil(l.expires, today); return d > 3 && d <= 10 }) },
    { title: '📦 Länger haltbar', items: sorted.filter((l) => daysUntil(l.expires, today) > 10) },
  ]

  // Was bleibt nach dem Wochenplan übrig? (zusammengefasst je Zutat, nur Frisches)
  const rest = useMemo(() => {
    const m = new Map<string, { amount: number; unit: string; expires: string }>()
    for (const l of leftovers) {
      if (daysUntil(l.expires, today) > 14) continue
      const cur = m.get(l.name)
      if (cur) { cur.amount += l.amount; if (l.expires < cur.expires) cur.expires = l.expires }
      else m.set(l.name, { amount: l.amount, unit: l.unit, expires: l.expires })
    }
    return [...m].filter(([, v]) => v.amount > 0.01).sort((a, b) => a[1].expires.localeCompare(b[1].expires))
  }, [leftovers, today])

  const suggestions = query.trim().length >= 2
    ? TRACKED.filter((n) => n.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : []

  function add(name: string) {
    const p = PRODUCTS[name]
    onChange([...pantry, { id: uid(), name, amount: p.pack, unit: p.unit, expires: addDaysIso(today, p.shelf) }])
    setQuery('')
  }

  function update(id: string, patch: Partial<PantryLot>) {
    onChange(pantry.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  return (
    <div className="pantry">
      <p className="muted small">
        Was du auf der Einkaufsliste abhakst, landet hier. Gekochte Gerichte werden am Folgetag automatisch abgezogen.
        Beim Wischen kommen Gerichte zuerst, die deinen Vorrat aufbrauchen.
      </p>

      <div className="pantry-add">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="➕ Zutat hinzufügen, z. B. Sahne" />
        {suggestions.length > 0 && (
          <div className="suggest">
            {suggestions.map((n) => (
              <button key={n} onClick={() => add(n)}>
                {SHOP_ICON[CATALOG[n]]} {n} <span className="muted small">{formatAmount(PRODUCTS[n].pack, PRODUCTS[n].unit)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {pantry.length === 0 && (
        <div className="empty-state small-pad">
          <div className="big-emoji">🧺</div>
          <p>Dein Vorrat ist leer.</p>
          <p className="muted small">Hake beim Einkaufen ab oder trage hier ein, was noch im Kühlschrank liegt.</p>
        </div>
      )}

      {groups.map((g) =>
        g.items.length ? (
          <section key={g.title} className="shop-section">
            <h3>{g.title}</h3>
            <ul>
              {g.items.map((l) => {
                const d = daysUntil(l.expires, today)
                return (
                  <li key={l.id} className={`lot ${d <= 1 ? 'urgent' : d <= 3 ? 'soon' : ''}`}>
                    <span className="item-name">
                      {l.name}
                      <small className="exp">{expiryText(d)}</small>
                    </span>
                    <span className="lot-amt">
                      <input
                        inputMode="decimal"
                        aria-label={`Menge ${l.name}`}
                        value={String(Math.round(l.amount * 10) / 10).replace('.', ',')}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value.replace(',', '.'))
                          if (!isNaN(v)) update(l.id, { amount: v })
                        }}
                      />
                      <span>{l.unit}</span>
                    </span>
                    <input
                      type="date"
                      className="lot-date"
                      aria-label={`Haltbar bis ${l.name}`}
                      value={l.expires}
                      onChange={(e) => e.target.value && update(l.id, { expires: e.target.value })}
                    />
                    <button className="icon-btn tiny" onClick={() => onChange(pantry.filter((x) => x.id !== l.id))} aria-label="Verbraucht / entfernen">
                      🗑
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null,
      )}

      {rest.length > 0 && (
        <section className="shop-section covered">
          <h3>♻️ Bleibt nach deinem Wochenplan übrig</h3>
          <ul>
            {rest.map(([name, v]) => (
              <li key={name}>
                <span className="item-name">{name}<small className="exp">{expiryText(daysUntil(v.expires, today))}</small></span>
                <span className="item-amt">{formatAmount(v.amount, v.unit)}</span>
              </li>
            ))}
          </ul>
          <p className="muted small pad">Diese Reste bevorzugt die App beim Wischen der übrigen Tage.</p>
        </section>
      )}

      {(pantry.length > 0 || rest.length > 0) && (
        <button className="btn primary wide big" onClick={onCook}>🍳 Was koche ich damit? – Wischen</button>
      )}
    </div>
  )
}
