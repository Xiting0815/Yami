import type { PortionFeedback, Rating } from '../learning'
import { weekdayName } from '../store'
import { Icon } from './Icon'
import { PORTIONS } from './RateSheet'

/** „Wie war … am …?“ – Bewertung eines gekochten Gerichts (Lernsignal) */
export function RatingCard({ title, day, portion, onRate, onPortion, onDismiss }: { title: string; day: string; portion?: PortionFeedback; onRate: (v: Rating) => void; onPortion: (v: PortionFeedback) => void; onDismiss: () => void }) {
  return (
    <section className="rate-card" aria-label="Bewertung">
      <div className="rate-head">
        <span>
          Wie war <b>{title}</b> am {weekdayName(day)}?
        </span>
        <button className="icon-btn tiny" aria-label="Nicht bewerten" onClick={onDismiss}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="rate-btns">
        <button onClick={() => onRate('up')}><span aria-hidden>👍</span> Gut</button>
        <button onClick={() => onRate('again')}><span aria-hidden>🔁</span> Bald wieder</button>
        <button onClick={() => onRate('down')}><span aria-hidden>👎</span> Nicht so</button>
      </div>
      <div className="portion-btns compact" role="group" aria-label="Portion">
        {PORTIONS.map(([v, label]) => (
          <button key={v} className={portion === v ? 'on' : ''} aria-pressed={portion === v} onClick={() => onPortion(v)}>
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}

/** Frühstück: „Hat dich … bis mittags satt gemacht?“ – nach dem ersten Frühstückstag nach dem Vorbereiten (Lernsignal) */
export function SatietyCard({ title, day, onAnswer, onDismiss }: { title: string; day: string; onAnswer: (v: PortionFeedback) => void; onDismiss: () => void }) {
  return (
    <section className="rate-card satiety-card" aria-label="Sättigung Frühstück">
      <div className="rate-head">
        <span>
          ☀️ Hat dich <b>{title}</b> am {weekdayName(day)} bis mittags satt gemacht?
        </span>
        <button className="icon-btn tiny" aria-label="Nicht beantworten" onClick={onDismiss}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="portion-btns compact" role="group" aria-label="Sättigung">
        {PORTIONS.map(([v, label]) => (
          <button key={v} onClick={() => onAnswer(v)}>
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
