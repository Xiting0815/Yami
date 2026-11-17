import { formatEuro } from '../kitchen'
import { type WeekReview } from '../review'
import { Icon } from './Icon'

export const de1 = (v: number) => v.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
export const signedKg = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '±') + de1(Math.abs(v))

interface Props {
  review: WeekReview
  onOpen: () => void
  onDismiss: () => void
}

/** Die vier Kennzahlen (Karte und Sheet) */
export function reviewStats(r: WeekReview) {
  const w = r.weight
  return {
    weight: w.delta != null ? `${signedKg(w.delta)} kg` : w.current ? `${de1(w.current.weight)} kg` : '–',
    weightSub: w.delta != null ? 'zur letzten Messung' : w.current ? 'gewogen' : 'nicht gewogen',
    kcal: r.nutrition.avgKcal != null ? r.nutrition.avgKcal.toLocaleString('de-DE') : '–',
    kcalSub: r.nutrition.target != null ? `Ø kcal, Ziel ${r.nutrition.target.toLocaleString('de-DE')}` : 'Ø kcal Mo–Fr',
    spend: r.spending.total > 0 ? `≈ ${formatEuro(r.spending.total)}` : '–',
    spendSub: 'Einkauf',
    waste: r.food.waste.count > 0 ? `≈ ${formatEuro(r.food.waste.euro)}` : '0 €',
    wasteSub: r.food.waste.count > 0 ? 'weggeworfen' : 'weggeworfen 🎉',
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
          <span>Gewicht</span>
          <b>{s.weight}</b>
          <small>{s.weightSub}</small>
        </div>
        <div>
          <span>Ernährung</span>
          <b>{s.kcal}</b>
          <small>{s.kcalSub}</small>
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
