import { useEffect } from 'react'
import { formatEuro } from '../kitchen'
import { type WeekReview } from '../review'
import { addDays, isoDate, parseIso, shortDate } from '../store'
import { de1, reviewStats, signedKg } from './ReviewCard'

interface Props {
  review: WeekReview
  /** gibt es eine spätere Woche, zu der man blättern darf? */
  canNext: boolean
  onWeek: (delta: number) => void
  onClose: () => void
}

const kcal = (n: number) => n.toLocaleString('de-DE')

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
  const n = r.nutrition
  const w = r.weight

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
            <div><span>Gewicht</span><b>{s.weight}</b><small>{s.weightSub}</small></div>
            <div><span>Ernährung</span><b>{s.kcal}</b><small>{s.kcalSub}</small></div>
            <div><span>Ausgaben</span><b>{s.spend}</b><small>{s.spendSub}</small></div>
            <div><span>Lebensmittel</span><b>{s.waste}</b><small>{s.wasteSub}</small></div>
          </div>

          <section className="card-box review-sec">
            <h3>⚖️ Gewicht</h3>
            {w.current ? (
              <>
                <p>
                  {de1(w.current.weight)} kg
                  {w.delta != null && (
                    <>
                      {' '}
                      · <b className={w.delta < 0 ? 'good' : ''}>{signedKg(w.delta)} kg</b> seit der letzten Messung
                    </>
                  )}
                </p>
                {w.goal != null && w.remaining != null && (
                  <p className="muted">{w.remaining > 0 ? `Noch ${de1(w.remaining)} kg bis zu deinem Ziel von ${de1(w.goal)} kg.` : 'Ziel erreicht! 🎉'}</p>
                )}
              </>
            ) : (
              <p className="muted">In dieser Woche hast du dich nicht gewogen.</p>
            )}
          </section>

          <section className="card-box review-sec">
            <h3>🍽️ Ernährung Mo–Fr</h3>
            {n.days > 0 && n.avgKcal != null ? (
              <>
                <p>
                  Ø <b>{kcal(n.avgKcal)} kcal</b> pro Tag (Ziel {kcal(n.target!)})
                </p>
                <p>
                  Ø <b>{n.avgProtein} g</b> Eiweiß (Ziel {n.proteinTarget} g)
                </p>
                <p className="muted">
                  {n.inTarget} von {n.days} Tagen im Ziel
                </p>
              </>
            ) : (
              <p className="muted">Ohne Profil oder geplante Abendessen gibt es hier keine Werte.</p>
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
            ) : (
              <p className="good">Nichts weggeworfen 🎉</p>
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
