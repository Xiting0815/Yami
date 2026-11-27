import { useEffect } from 'react'
import { formatEuro } from '../kitchen'
import { type WeekReview } from '../review'
import { addDays, isoDate, parseIso, shortDate } from '../store'
import { reviewStats } from './ReviewCard'

interface Props {
  review: WeekReview
  /** gibt es eine spätere Woche, zu der man blättern darf? */
  canNext: boolean
  onWeek: (delta: number) => void
  onClose: () => void
}

export function ReviewSheet({ review: r, canNext, onWeek, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
  const s = reviewStats(r)
  const mon = parseIso(r.weekKey)
  const range = `${shortDate(r.weekKey)}–${shortDate(isoDate(addDays(mon, 6)))}`

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet review" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Wochenrückblick">
        <button className="sheet-close dark" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="sheet-body">
          <h2>📊 Wochenrückblick</h2>
          <div className="review-nav">
            <button className="icon-btn" onClick={() => onWeek(-1)} aria-label="Woche davor">‹</button>
            <span>
              <b>KW {r.kw}</b> <small>{range}</small>
            </span>
            <button className="icon-btn" onClick={() => onWeek(1)} disabled={!canNext} aria-label="Woche danach">›</button>
          </div>

          {!r.hasData && <p className="muted">Für diese Woche gibt es noch nichts zu berichten.</p>}

          <div className="stat-grid">
            <div><span>Abwechslung</span><b>{s.cuisines}</b><small>{s.cuisinesSub}</small></div>
            <div><span>Neu probiert</span><b>{s.fresh}</b><small>{s.freshSub}</small></div>
            <div><span>Ausgaben</span><b>{s.spend}</b><small>{s.spendSub}</small></div>
            <div><span>Lebensmittel</span><b>{s.waste}</b><small>{s.wasteSub}</small></div>
          </div>

          <section className="card-box review-sec">
            <h3>🌍 Abwechslung</h3>
            {r.variety.cuisines > 0 ? (
              <p>
                {r.variety.cuisines} {r.variety.cuisines === 1 ? 'Küche' : 'Küchen'} auf dem Tisch
                {r.variety.newDishes > 0 ? ` · ${r.variety.newDishes} ${r.variety.newDishes === 1 ? 'Gericht' : 'Gerichte'} zum ersten Mal` : ''}
              </p>
            ) : (
              <p className="muted">Keine Abendessen geplant.</p>
            )}
          </section>

          <section className="card-box review-sec">
            <h3>🛒 Ausgaben</h3>
            {r.spending.total > 0 ? (
              <>
                <p>
                  <b>≈ {formatEuro(r.spending.total)}</b> für {r.spending.items} Artikel eingekauft
                </p>
                {r.spending.perDinner != null && <p className="muted">≈ {formatEuro(r.spending.perDinner)} pro geplantem Abendessen (inkl. Frühstück)</p>}
              </>
            ) : (
              <p className="muted">Keine Einkäufe abgehakt.</p>
            )}
          </section>

          <section className="card-box review-sec">
            <h3>♻️ Lebensmittel</h3>
            <p>
              Aus dem Vorrat verbraucht: <b>≈ {formatEuro(r.food.usedEuro)}</b>
            </p>
            {r.food.waste.count > 0 ? (
              <p>
                ≈ <b>{formatEuro(r.food.waste.euro)}</b> weggeworfen ({r.food.waste.count} Posten)
                {r.food.waste.top ? `, am meisten: ${r.food.waste.top}` : ''}
              </p>
            ) : r.hasData ? (
              <p className="good">Nichts weggeworfen 🎉</p>
            ) : (
              <p className="muted">Noch nichts erfasst.</p>
            )}
          </section>

          {(r.highlights.rated.length > 0 || r.highlights.topType || r.highlights.learned.length > 0) && (
            <section className="card-box review-sec">
              <h3>⭐ Highlights</h3>
              {r.highlights.rated.map((x) => (
                <p key={x.day}>
                  {x.rating === 'again' ? '🔁' : '👍'} {x.title}
                </p>
              ))}
              {r.highlights.topType && (
                <p className="muted">
                  Am häufigsten: {r.highlights.topType.label} ({r.highlights.topType.count}×)
                </p>
              )}
              {r.highlights.learned.length > 0 && (
                <p>
                  💡 Das merke ich mir: {r.highlights.learned.join(' und ')} kommt bei dir gut an.
                </p>
              )}
            </section>
          )}

          <section className="suggest-card">
            <b>💡 Tipp für nächste Woche</b>
            <p>{r.tip.text}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
