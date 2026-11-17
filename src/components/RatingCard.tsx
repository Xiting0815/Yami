import type { Rating } from '../learning'
import { weekdayName } from '../store'

/** „Wie war … am …?“ – Bewertung eines gekochten Gerichts (Lernsignal) */
export function RatingCard({ title, day, onRate, onDismiss }: { title: string; day: string; onRate: (v: Rating) => void; onDismiss: () => void }) {
  return (
    <section className="rate-card" aria-label="Bewertung">
      <div className="rate-head">
        <span>
          Wie war <b>{title}</b> am {weekdayName(day)}?
        </span>
        <button className="icon-btn tiny" aria-label="Nicht bewerten" onClick={onDismiss}>
          ✕
        </button>
      </div>
      <div className="rate-btns">
        <button onClick={() => onRate('up')}>👍 Gut</button>
        <button onClick={() => onRate('again')}>🔁 Bald wieder</button>
        <button onClick={() => onRate('down')}>👎 Nicht so</button>
      </div>
    </section>
  )
}
