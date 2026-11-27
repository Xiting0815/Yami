import { formatEuro } from '../kitchen'
import { type WeekReview } from '../review'
import { Icon } from './Icon'

interface Props {
  review: WeekReview
  onOpen: () => void
  onDismiss: () => void
}

/** Die vier Kennzahlen (Karte und Sheet) */
export function reviewStats(r: WeekReview) {
  const v = r.variety
  return {
    cuisines: v.cuisines > 0 ? String(v.cuisines) : '–',
    cuisinesSub: v.cuisines === 1 ? 'Küche' : 'Küchen',
    fresh: v.newDishes > 0 ? String(v.newDishes) : r.hasData ? '0' : '–',
    freshSub: v.newDishes === 1 ? 'neues Gericht' : 'neue Gerichte',
    spend: r.spending.total > 0 ? `≈ ${formatEuro(r.spending.total)}` : '–',
    spendSub: 'Einkauf',
    // ohne Daten (z. B. erste Woche) nicht „0 € weggeworfen 🎉“ feiern
    waste: r.food.waste.count > 0 ? `≈ ${formatEuro(r.food.waste.euro)}` : r.hasData ? '0 €' : '–',
    wasteSub: r.food.waste.count > 0 ? 'weggeworfen' : r.hasData ? 'weggeworfen 🎉' : 'weggeworfen',
  }
}

export function ReviewCard({ review, onOpen, onDismiss }: Props) {
  const s = reviewStats(review)
  return (
    <section className="review-card" aria-label="Wochenrückblick">
      <div className="review-head">
        <h2>Dein Wochenrückblick · KW {review.kw}</h2>
        <button className="icon-btn tiny" aria-label="Rückblick ausblenden" onClick={onDismiss}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="stat-grid">
        <div>
          <span>Abwechslung</span>
          <b>{s.cuisines}</b>
          <small>{s.cuisinesSub}</small>
        </div>
        <div>
          <span>Neu probiert</span>
          <b>{s.fresh}</b>
          <small>{s.freshSub}</small>
        </div>
        <div>
          <span>Ausgaben</span>
          <b>{s.spend}</b>
          <small>{s.spendSub}</small>
        </div>
        <div>
          <span>Lebensmittel</span>
          <b>{s.waste}</b>
          <small>{s.wasteSub}</small>
        </div>
      </div>
      <button className="btn primary wide" onClick={onOpen}>
        Ganzen Rückblick ansehen
      </button>
    </section>
  )
}
