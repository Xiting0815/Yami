import { useEffect } from 'react'
import type { PortionFeedback, Rating } from '../learning'
import { weekdayName } from '../store'

interface Props {
  title: string
  day: string
  today: string
  rating?: Rating
  portion?: PortionFeedback
  onRate: (v: Rating | undefined) => void
  onPortion: (v: PortionFeedback | undefined) => void
  onClose: () => void
}

const RATINGS: [Rating, string, string][] = [
  ['up', '👍', 'Gut'],
  ['again', '🔁', 'Bald wieder'],
  ['down', '👎', 'Nicht so'],
]
export const PORTIONS: [PortionFeedback, string][] = [
  [-1, 'Zu wenig'],
  [0, 'Passt'],
  [1, 'Zu viel'],
]

/** „Wie war’s?“ direkt nach „Fertig gekocht“: Bewertung + Portion (beides sofort gespeichert, nochmal tippen nimmt zurück) */
export function RateSheet({ title, day, today, rating, portion, onRate, onPortion, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const chosen = rating !== undefined || portion !== undefined
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet rate-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Wie war’s?">
        <h2>Wie war’s?</h2>
        <p className="muted small">
          {title}{day !== today ? ` · ${weekdayName(day)}` : ''}
        </p>
        <div className="rate-btns sheet-rate" role="group" aria-label="Bewertung">
          {RATINGS.map(([v, icon, label]) => (
            <button key={v} className={rating === v ? 'on' : ''} aria-pressed={rating === v} onClick={() => onRate(rating === v ? undefined : v)}>
              <span aria-hidden>{icon}</span> {label}
            </button>
          ))}
        </div>
        <h3>Portion</h3>
        <div className="portion-btns" role="group" aria-label="Portion">
          {PORTIONS.map(([v, label]) => (
            <button key={v} className={portion === v ? 'on' : ''} aria-pressed={portion === v} onClick={() => onPortion(portion === v ? undefined : v)}>
              {label}
            </button>
          ))}
        </div>
        <button className={chosen ? 'btn primary wide' : 'link rate-later'} onClick={onClose}>
          {chosen ? 'Fertig' : 'Später'}
        </button>
      </div>
    </div>
  )
}
