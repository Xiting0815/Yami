import { useState } from 'react'
import type { Trip, TripItem } from '../kitchen'
import { formatAmount, isBought, packText } from '../shopping'
import type { TripState } from '../store'
import { haveAmount, reviewQueue, stockSuggestion } from '../tripState'

interface Props {
  trip: Trip
  states: Record<string, TripState>
  stockAsk: Record<string, 'yes' | 'no'>
  shopOrder?: string[]
  onHave: (item: TripItem, amount?: number) => void
  onNeed: (item: TripItem) => void
  onStock: (name: string, yes: boolean) => void
  onRelease: () => void
  onClose: () => void
}

const num = (s: string) => parseFloat(s.replace(',', '.'))
const amountText = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',')

/**
 * „Liste prüfen“: Artikel für Artikel – was wahrscheinlich schon da ist, zuerst (Grundzutaten, lange haltbar,
 * gelernt aus früheren „Habe ich“). „Habe ich“ legt die Menge in den Vorrat, der Artikel verschwindet von der Liste.
 */
export function TripReview({ trip, states, stockAsk, shopOrder, onHave, onNeed, onStock, onRelease, onClose }: Props) {
  // Reihenfolge einmal beim Start festlegen (sonst springt sie nach jeder Antwort)
  const [queue] = useState(() => reviewQueue(trip, states, shopOrder).map((b) => b.key))
  const [skipped, setSkipped] = useState<string[]>([])
  const [amount, setAmount] = useState<string | null>(null)
  const answered = states[trip.date]?.answers ?? {}
  const open = (k: string) => {
    const b = trip.buy.find((x) => x.key === k)
    return !!b && !isBought(b) && b.bought <= 0 && !answered[k] && !skipped.includes(k)
  }
  const pending = queue.filter(open)
  const item = trip.buy.find((b) => b.key === pending[0])
  const done = queue.length - pending.length
  const left = trip.buy.filter((b) => !isBought(b)).length
  const next = () => setAmount(null)

  return (
    <div className="trip-review" role="region" aria-label="Liste prüfen">
      <div className="week-progress">
        <div className="bar"><div style={{ width: `${queue.length ? (done / queue.length) * 100 : 100}%` }} /></div>
        <span>{done} von {queue.length} geprüft</span>
      </div>
      {item ? (
        <div className="review-item">
          <p className="muted small">Hast du das schon da?</p>
          <h3>{item.name}{item.forgot && <small className="forgot">{item.forgot}</small>}</h3>
          <p className="review-amt">{packText(item)}</p>
          {item.reason && <p className="item-note">🕒 {item.reason}</p>}
          {item.recipes.length > 0 && <p className="muted small">Für: {item.recipes.join(' · ')}</p>}
          {stockSuggestion(item.name, states, stockAsk) && (
            <div className="review-stock">
              <p><b>{item.name}</b> hast du meist da – im Vorrat führen?</p>
              <p className="muted small">Dann zieht Gusto beim Kochen ab und setzt es erst auf die Liste, wenn es knapp wird.</p>
              <div className="row-btns">
                <button className="btn ghost grow" onClick={() => onStock(item.name, false)}>Nein</button>
                <button
                  className="btn primary grow"
                  onClick={() => {
                    onStock(item.name, true)
                    setAmount(amountText(Math.max(haveAmount(item), item.product.pack)))
                  }}
                >
                  Ja, Menge eintragen
                </button>
              </div>
            </div>
          )}
          {amount != null && (
            <label className="review-qty">
              So viel ist da: <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label={`Menge ${item.name}`} /> {item.unit}
            </label>
          )}
          <div className="row-btns">
            <button className="btn ghost grow" onClick={() => { onNeed(item); next() }}>Brauche ich</button>
            <button
              className="btn primary grow"
              onClick={() => {
                const a = amount != null ? num(amount) : undefined
                onHave(item, a != null && a > 0 ? a : undefined)
                next()
              }}
            >
              Habe ich
            </button>
          </div>
          <div className="row-links">
            {amount == null && (
              <button className="link small" onClick={() => setAmount(amountText(haveAmount(item)))}>
                Habe ich – andere Menge ({formatAmount(haveAmount(item), item.unit)} nötig)
              </button>
            )}
            <button className="link small" onClick={() => { setSkipped((s) => [...s, item.key]); next() }}>Überspringen</button>
          </div>
        </div>
      ) : (
        <div className="review-item">
          <h3>✓ Alles geprüft</h3>
          <p>{left === 0 ? 'Nichts mehr zu kaufen.' : `${left} ${left === 1 ? 'Artikel bleibt' : 'Artikel bleiben'} auf der Liste.`}</p>
        </div>
      )}
      <div className="row-btns">
        <button className="btn ghost grow" onClick={onClose}>Zur Liste</button>
        <button className="btn primary grow" onClick={onRelease}>Freigeben</button>
      </div>
    </div>
  )
}
