import { useEffect, useState } from 'react'
import type { BakeEntry, Recipe } from '../types'
import type { Rating } from '../learning'
import type { PantryLot } from '../kitchen'
import { PHASE_HINT, PHASE_LABEL, eveningKcal, shortTitle, tapasTimeline } from '../tapas'
import { tapasFactorFor } from '../bakePlan'
import { formatAmount, scale } from '../shopping'
import { shortDate, weekdayName } from '../store'
import { DeviceChips } from './DeviceChip'

const RATINGS: [Rating, string, string][] = [
  ['up', '👍', 'Gut'],
  ['again', '🔁', 'Bald wieder'],
  ['down', '👎', 'Nicht so'],
]

interface Props {
  day: string
  today: string
  entries: { entry: BakeEntry; recipe: Recipe }[]
  pantry: PantryLot[]
  /** Bewertungen, Schlüssel `Datum:Rezept-ID` */
  ratings: Record<string, Rating>
  onFinish: (recipeId: string) => void
  onRate: (recipeId: string, v: Rating | undefined) => void
  /** Grundrezept (Alioli …) öffnen */
  onOpenRecipe: (r: Recipe) => void
  onClose: () => void
}

/**
 * Kochmodus „Tapas-Abend“: gemeinsamer Ablaufplan über alle Tapas des Abends (Vorher → kalt → lauwarm → heiß zuletzt),
 * je Tapa aufklappbare Schritte mit Mengen für den Abend und Geräte-Chips, „Fertig ✓“ (Zutaten abziehen) und Bewertung.
 */
export function TapasCook({ day, today, entries, pantry, ratings, onFinish, onRate, onOpenRecipe, onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const recipes = entries.map((x) => x.recipe)
  const factor = tapasFactorFor(recipes.length)
  const phases = tapasTimeline(recipes, pantry, today)
  const status = new Map(entries.map((x) => [x.recipe.id, x.entry.status]))
  const doneCount = entries.filter((x) => x.entry.status === 'baked').length

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // Bildschirm anlassen, solange der Kochmodus offen ist
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    let alive = true
    navigator.wakeLock?.request('screen').then((l) => (alive ? (lock = l) : void l.release())).catch(() => undefined)
    return () => {
      alive = false
      void lock?.release()
    }
  }, [])

  return (
    <div className="cook tapas-cook" role="dialog" aria-modal="true" aria-label="Kochmodus Tapas-Abend">
      <header className="cook-head">
        <div className="cook-title">
          <h2>🫒 Tapas-Abend</h2>
          <div className="muted small">
            {weekdayName(day, true)} {shortDate(day)} · {recipes.length} Tapas · ≈ {eveningKcal(recipes).toLocaleString('de-DE')} kcal p. P.
            {factor !== 1 ? ` · Mengen ×${String(factor).replace('.', ',')}` : ''} · {doneCount}/{recipes.length} fertig
          </div>
        </div>
        <button className="cook-close" onClick={onClose} aria-label="Kochmodus beenden">✕</button>
      </header>

      <div className="cook-body">
        {phases.map(({ phase, items }) => (
          <section key={phase} className={`tapas-phase phase-${phase}`}>
            <h3>{PHASE_LABEL[phase]}</h3>
            <p className="muted small">{PHASE_HINT[phase]}</p>
            <ol className="tapas-items">
              {items.map(({ recipe: r, text }) => {
                if (phase === 'vorher') {
                  return (
                    <li key={`v-${r.id}`} className="tapas-ahead">
                      {r.kind === 'tapas' ? <b>{shortTitle(r.title)}:</b> : <button className="link" onClick={() => onOpenRecipe(r)}>{shortTitle(r.title)}</button>} {text}
                    </li>
                  )
                }
                const st = status.get(r.id)
                const done = st === 'baked'
                const rating = ratings[`${day}:${r.id}`]
                const open = openId === r.id
                return (
                  <li key={r.id} className={`tapas-item ${done ? 'done' : ''}`}>
                    <button className="tapas-item-head" aria-expanded={open} onClick={() => setOpenId(open ? null : r.id)}>
                      <span className="tapas-item-title">{done ? '✓ ' : ''}{shortTitle(r.title)}</span>
                      <small className="muted">{text}{open ? ' · zuklappen' : ' · Schritte'}</small>
                    </button>
                    {open && (
                      <div className="tapas-item-body">
                        <div className="cook-chips">
                          {r.ingredients.map((ing, j) => (
                            <span key={j} className="cook-chip">
                              <b>{formatAmount(scale(ing, r.servings, r.servings * factor), ing.unit, true) || 'n. B.'}</b> {ing.name}
                            </span>
                          ))}
                        </div>
                        <ol className="steps">
                          {r.steps.map((s, i) => (
                            <li key={i}>
                              {s}
                              <DeviceChips settings={r.deviceSteps?.[i]?.settings} />
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {done ? (
                      <div className="rate-btns tapas-rate" role="group" aria-label={`Bewertung ${shortTitle(r.title)}`}>
                        {RATINGS.map(([v, icon, label]) => (
                          <button key={v} className={rating === v ? 'on' : ''} aria-pressed={rating === v} onClick={() => onRate(r.id, rating === v ? undefined : v)}>
                            <span aria-hidden>{icon}</span> {label}
                          </button>
                        ))}
                      </div>
                    ) : st === 'skipped' ? (
                      <p className="muted small">nicht gemacht</p>
                    ) : (
                      <button className="btn primary tapas-done" onClick={() => onFinish(r.id)}>Fertig ✓</button>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
        <p className="muted small">„Fertig ✓“ zieht die Zutaten der Tapa (Menge für diesen Abend) vom Vorrat ab und zählt ihren Anteil in die Tagesbilanz. Die Bewertung merkt sich Yami für die Tapas-Abend-Ideen.</p>
        <button className="btn ghost wide" onClick={onClose}>Schließen</button>
      </div>
    </div>
  )
}
