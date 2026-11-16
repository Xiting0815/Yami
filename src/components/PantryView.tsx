import { useMemo, useState } from 'react'
import { CATALOG } from '../data/catalog'
import { PRODUCTS } from '../data/products'
import { SHOP_ICON, SHOP_LABEL, SHOP_ORDER, type CustomIngredient, type ShopCat } from '../types'
import { searchIngredients, titleCase } from '../customIngredients'
import { CAT_DEFAULTS } from '../data/custom-registry'
import { formatAmount } from '../shopping'
import { type PantryLot, addDaysIso, daysUntil, uid } from '../kitchen'

interface Props {
  pantry: PantryLot[]
  /** voraussichtlich übrig nach den geplanten Gerichten */
  leftovers: PantryLot[]
  today: string
  onChange: (lots: PantryLot[]) => void
  /** Zutat aus dem Katalog hinzugefügt (zählt als „Wunsch“ fürs Lernen) */
  onAdded?: (name: string) => void
  /** ganz neue Zutat anlegen und gleich in den Vorrat legen */
  onCreate: (c: CustomIngredient, lot: PantryLot) => void
  onCook: () => void
}

const NEW_UNITS = ['g', 'ml', 'Stk'] as const
const NEW_CATS = SHOP_ORDER.filter((c) => c !== 'vorrat')

/** alle Zutaten mit Produktdaten (auch selbst angelegte) – zur Laufzeit, weil eigene Zutaten dazukommen */
const trackedNames = () =>
  Object.keys(PRODUCTS)
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

export function PantryView({ pantry, leftovers, today, onChange, onAdded, onCreate, onCook }: Props) {
  const [query, setQuery] = useState('')
  /** Formular „neue Zutat anlegen“ */
  const [creating, setCreating] = useState<{ name: string; cat: ShopCat; amount: string; unit: (typeof NEW_UNITS)[number] } | null>(null)
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

  // Treffer am Wortanfang zuerst („Sa“ → Sahne, Salz … vor Austernsauce)
  const TRACKED = trackedNames()
  const q = query.trim().toLowerCase()
  const hits = q.length >= 2 ? TRACKED.filter((n) => n.toLowerCase().includes(q)) : []
  // erst der unscharfe Abgleich („Creme fraiche“, „Pasta“, „Hack“), dann Treffer am Wortanfang und im Wort
  const fuzzy = q.length >= 3 ? searchIngredients(query, 12).filter((n) => TRACKED.includes(n)) : []
  const suggestions = [
    ...new Set([...fuzzy, ...hits.filter((n) => n.toLowerCase().startsWith(q)), ...hits.filter((n) => !n.toLowerCase().startsWith(q))]),
  ].slice(0, 6)

  function add(name: string) {
    const p = PRODUCTS[name]
    onChange([...pantry, { id: uid(), name, amount: p.pack, unit: p.unit, expires: addDaysIso(today, p.shelf) }])
    onAdded?.(name)
    setQuery('')
  }

  function create() {
    if (!creating) return
    const name = creating.name.trim()
    const amount = parseFloat(creating.amount.replace(',', '.'))
    if (!name || !(amount > 0)) return
    const d = CAT_DEFAULTS[creating.cat]
    const ci: CustomIngredient = {
      name,
      cat: creating.cat,
      kcal: d.kcal,
      protein: d.protein,
      unit: creating.unit,
      gramsPerPiece: creating.unit === 'Stk' ? 100 : undefined,
    }
    onCreate(ci, { id: uid(), name, amount, unit: creating.unit, expires: addDaysIso(today, d.shelf) })
    setCreating(null)
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
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCreating(null)
          }}
          placeholder="➕ Zutat hinzufügen, z. B. Sahne"
        />
        {suggestions.length === 0 && q.length >= 3 && !creating && CATALOG[titleCase(query)] === 'vorrat' && (
          <div className="suggest"><p className="muted small pad">Gewürze und Grundzutaten wie „{titleCase(query)}“ musst du nicht eintragen.</p></div>
        )}
        {suggestions.length === 0 && q.length >= 3 && !creating && !CATALOG[titleCase(query)] && (
          <div className="suggest">
            <button
              className="new-ing"
              onClick={() => setCreating({ name: titleCase(query), cat: 'gemuese', amount: '1', unit: 'Stk' })}
            >
              ➕ „{titleCase(query)}“ als neue Zutat anlegen
            </button>
          </div>
        )}
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

      {creating && (
        <div className="pantry-new">
          <label>
            Name
            <input value={creating.name} onChange={(e) => setCreating({ ...creating, name: e.target.value })} />
          </label>
          <label>
            Einkaufsliste – Abschnitt
            <select value={creating.cat} onChange={(e) => setCreating({ ...creating, cat: e.target.value as ShopCat })}>
              {NEW_CATS.map((c) => (
                <option key={c} value={c}>
                  {SHOP_ICON[c]} {SHOP_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <div className="amt-row">
            <label>
              Menge
              <input inputMode="decimal" value={creating.amount} onChange={(e) => setCreating({ ...creating, amount: e.target.value })} />
            </label>
            <label>
              Einheit
              <select value={creating.unit} onChange={(e) => setCreating({ ...creating, unit: e.target.value as (typeof NEW_UNITS)[number] })}>
                {NEW_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="row-btns">
            <button className="btn ghost" onClick={() => setCreating(null)}>Abbrechen</button>
            <button className="btn primary grow" disabled={!creating.name.trim() || !(parseFloat(creating.amount.replace(',', '.')) > 0)} onClick={create}>
              In den Vorrat legen
            </button>
          </div>
          <p className="muted small">Die App kennt „{creating.name.trim() || 'die Zutat'}“ dann auch beim Wischen und Einkaufen.</p>
        </div>
      )}

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
