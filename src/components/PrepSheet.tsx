import { useEffect } from 'react'
import { type PrepItem, prepMinutes } from '../breakfast'
import { formatAmount } from '../shopping'
import { weekdayName } from '../store'
import { NutritionRow } from './NutritionRow'

interface Props {
  items: PrepItem[]
  notes: string[]
  checked: string[]
  onToggle: (key: string) => void
  onClose: () => void
}

/** Schritt-Schlüssel für die Abhakliste */
export const prepKey = (rid: string, i: number) => `${rid}:${i}`

export function PrepSheet({ items, notes, checked, onToggle, onClose }: Props) {
  const done = new Set(checked)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const containers = items.map((i) => `${i.portions}× ${i.recipe.breakfast!.container}`).join(' + ')

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet prep" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Prep-Liste">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>🧑‍🍳 Meal-Prep für die Woche</h2>
          <p className="muted">
            ca. {Math.round(prepMinutes(items))} Min. · {containers} bereitstellen
          </p>
          {notes.map((n) => (
            <p key={n} className="bf-note">ℹ️ {n}</p>
          ))}

          {items.map((it) => {
            const r = it.recipe
            return (
              <section key={r.id} className="prep-block">
                <h3>
                  {r.title} <span className="muted">× {it.portions}</span>
                </h3>
                <div className="muted small">
                  für {it.days.map((d) => weekdayName(d, true)).join(', ')}
                  {it.frozenDays.length > 0 && ` · ❄️ ${it.frozenDays.map((d) => weekdayName(d, true)).join(', ')} einfrieren`}
                </div>
                <NutritionRow n={r.nutrition} />

                <h4>Zutaten (für {it.portions} Portionen)</h4>
                <ul className="ingredients compact">
                  {it.ingredients.map((ing, i) => (
                    <li key={i}>
                      <span className="amt">{formatAmount(ing.amount, ing.unit) || 'n. B.'}</span>
                      <span>{ing.name}</span>
                    </li>
                  ))}
                </ul>

                <h4>Schritte</h4>
                {it.portions > 1 && (
                  <p className="muted small">
                    Alles direkt für {it.portions} Portionen zubereiten und auf {it.portions}× {r.breakfast!.container} verteilen.
                  </p>
                )}
                <ul className="prep-steps">
                  {r.steps.map((s, i) => {
                    const key = prepKey(r.id, i)
                    const on = done.has(key)
                    return (
                      <li key={key} className={on ? 'done' : ''}>
                        <label>
                          <input type="checkbox" checked={on} onChange={() => onToggle(key)} />
                          <span className="check" aria-hidden />
                          <span>{s}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
                <p className="morning">☀️ Morgens: {r.breakfast!.morning}</p>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
