import { useMemo, useState } from 'react'
import type { ShopCat, WeekPlan } from '../types'
import { SHOP_ICON, SHOP_LABEL, SHOP_ORDER } from '../types'
import { buildShoppingList } from '../shopping'
import type { CustomItem } from '../store'

interface Props {
  days: string[]
  plan: WeekPlan
  checked: string[]
  custom: CustomItem[]
  onToggle: (key: string) => void
  onResetChecks: () => void
  onAddCustom: (item: CustomItem) => void
  onRemoveCustom: (id: string) => void
  onGoPlan: () => void
}

export function ShoppingList({ days, plan, checked, custom, onToggle, onResetChecks, onAddCustom, onRemoveCustom, onGoPlan }: Props) {
  const sections = useMemo(() => buildShoppingList(plan, days, custom), [plan, days, custom])
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState<ShopCat>('gemuese')
  const [expanded, setExpanded] = useState<string | null>(null)
  const checkedSet = new Set(checked)
  const total = sections.reduce((n, s) => n + s.items.length, 0)
  const done = sections.reduce((n, s) => n + s.items.filter((i) => checkedSet.has(i.key)).length, 0)
  const planned = days.filter((d) => plan[d]).length

  if (planned === 0 && custom.length === 0) {
    return (
      <div className="empty-state">
        <div className="big-emoji">🛒</div>
        <p>Noch keine Gerichte für diese Woche geplant.</p>
        <button className="btn primary" onClick={onGoPlan}>Zur Wochenplanung</button>
      </div>
    )
  }

  return (
    <div className="shop">
      <div className="week-progress">
        <div className="bar"><div style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
        <span>
          {done} von {total} im Wagen
        </span>
        {done > 0 && (
          <button className="link" onClick={onResetChecks}>Haken zurücksetzen</button>
        )}
      </div>

      {sections.map((s) => {
        const items = [...s.items].sort((a, b) => Number(checkedSet.has(a.key)) - Number(checkedSet.has(b.key)))
        return (
          <section key={s.cat} className={`shop-section cat-${s.cat}`}>
            <h3>
              <span>{SHOP_ICON[s.cat]}</span> {SHOP_LABEL[s.cat]}
              {s.cat === 'vorrat' && <small> – meist im Haus, kurz prüfen</small>}
            </h3>
            <ul>
              {items.map((it) => {
                const on = checkedSet.has(it.key)
                return (
                  <li key={it.key} className={on ? 'done' : ''}>
                    <label>
                      <input type="checkbox" checked={on} onChange={() => onToggle(it.key)} />
                      <span className="check" aria-hidden />
                      <span className="item-name">{it.name}</span>
                      <span className="item-amt">{it.amount}</span>
                    </label>
                    {it.custom ? (
                      <button className="icon-btn tiny" onClick={() => onRemoveCustom(it.key.slice(7))} aria-label="Entfernen">✕</button>
                    ) : (
                      <button
                        className="icon-btn tiny"
                        onClick={() => setExpanded(expanded === it.key ? null : it.key)}
                        aria-label="Für welche Gerichte?"
                        title="Für welche Gerichte?"
                      >
                        {it.recipes.length > 1 ? `${it.recipes.length}×` : 'ⓘ'}
                      </button>
                    )}
                    {expanded === it.key && <div className="item-recipes">{it.recipes.join(' · ')}</div>}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <form
        className="add-custom"
        onSubmit={(e) => {
          e.preventDefault()
          const name = newName.trim()
          if (!name) return
          onAddCustom({ id: Math.random().toString(36).slice(2, 9), name, cat: newCat })
          setNewName('')
        }}
      >
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Eigener Artikel, z. B. Kaffee" />
        <select value={newCat} onChange={(e) => setNewCat(e.target.value as ShopCat)} aria-label="Kategorie">
          {SHOP_ORDER.map((c) => (
            <option key={c} value={c}>
              {SHOP_ICON[c]} {SHOP_LABEL[c]}
            </option>
          ))}
        </select>
        <button className="btn primary" type="submit">+</button>
      </form>
    </div>
  )
}
