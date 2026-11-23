import { RECIPE_BY_ID } from '../data/recipes'
import { isBbq } from '../types'
import type { ShiftRecord } from '../store'
import { type UseShortage, wdShort } from '../kitchen'
import type { StandIn } from '../shortage'
import { formatAmount } from '../shopping'

interface Props {
  day: string
  today: string
  /** Fehlmengen bzw. „kommt mit Heute noch“ an diesem Tag (Abendessen, Frühstück-Prep, Backen) */
  warnings: UseShortage[]
  /** automatische Verschiebung auf diesen Tag */
  shift?: ShiftRecord
  /** angenommener Ersatz des Abendessens (Zutat → Ersatz) */
  swap?: Record<string, string>
  standIns: StandIn[]
  onBuy: () => void
  onShift: (day: string) => void
  onStandIn: (day: string, from: string, to: string) => void
  onDropStandIn: (day: string, from: string) => void
  onUndoShift: (id: string) => void
  onBuyBack: (id: string) => void
}

const what = (w: UseShortage) => {
  const title = RECIPE_BY_ID[w.recipeId]?.title ?? ''
  return w.kind === 'dinner' ? '' : w.kind === 'breakfast' ? `Frühstück-Prep (${title}): ` : `${isBbq(RECIPE_BY_ID[w.recipeId]) ? 'BBQ' : 'Backen'} (${title}): `
}

/** „⚠️ Es fehlt: Sahne 200 ml“ unter der Tageskarte – mit Noch kaufen / Verschieben / Ersatz; Hinweis nach automatischem Verschieben */
export function DayAlert({ day, today, warnings, shift, swap, standIns, onBuy, onShift, onStandIn, onDropStandIn, onUndoShift, onBuyBack }: Props) {
  const missing = warnings.filter((w) => w.missing.length)
  const coming = warnings.flatMap((w) => w.coming.map((c) => c.name))
  const swaps = Object.entries(swap ?? {})
  if (!missing.length && !coming.length && !shift && !swaps.length) return null
  const dinnerShort = missing.some((w) => w.kind === 'dinner')
  return (
    <li className={`day-alert ${missing.length ? 'warn' : ''}`}>
      {shift && (
        <div className="alert-line shift">
          <span>↪️ Von {shift.from === today ? 'heute' : wdShort(shift.from)} hierher verschoben – {shift.missing.join(', ')} {shift.missing.length > 1 ? 'fehlten' : 'fehlte'}</span>
          <span className="alert-btns">
            <button className="chip" onClick={() => onUndoShift(shift.id)}>Rückgängig</button>
            <button className="chip" onClick={() => onBuyBack(shift.id)}>Doch {shift.from === today ? 'heute' : wdShort(shift.from)} – noch kaufen</button>
          </span>
        </div>
      )}
      {missing.map((w) => (
        <div key={w.kind + w.recipeId} className="alert-line miss" role="status">
          ⚠️ {what(w)}Es fehlt: {w.missing.map((m) => `${m.name} ${formatAmount(m.amount, m.unit)}`).join(', ')}
        </div>
      ))}
      {missing.length > 0 && (
        <span className="alert-btns">
          <button className="chip" onClick={onBuy}>🛒 Noch kaufen</button>
          {dinnerShort && <button className="chip" onClick={() => onShift(day)}>↪️ Verschieben</button>}
          {standIns.map((s) => (
            <button key={s.from} className="chip" onClick={() => onStandIn(day, s.from, s.to)}>🔁 {s.to} statt {s.from}</button>
          ))}
        </span>
      )}
      {coming.length > 0 && <div className="alert-line muted">🛒 {[...new Set(coming)].join(', ')} kommt mit „Heute noch“</div>}
      {swaps.map(([from, to]) => (
        <div key={from} className="alert-line muted">
          🔁 {to} statt {from}
          <button className="link small" onClick={() => onDropStandIn(day, from)} aria-label={`Wieder mit ${from}`}>✕</button>
        </div>
      ))}
    </li>
  )
}
