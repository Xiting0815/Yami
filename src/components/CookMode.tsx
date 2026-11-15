import { useEffect, useState } from 'react'
import type { Ingredient, Recipe } from '../types'
import { formatAmount, scale } from '../shopping'
import { ingredientsForStep, unmatched } from '../cookSteps'

interface Props {
  recipe: Recipe
  /** Portionen aus dem Rezept-Sheet */
  servings: number
  onClose: () => void
}

type Wake = 'checking' | 'on' | 'off' | 'unsupported'

/** Mengenangabe wie im Rezept, auf die gewählten Portionen umgerechnet */
function Chip({ ing, base, servings }: { ing: Ingredient; base: number; servings: number }) {
  const amt = formatAmount(scale(ing, base, servings), ing.unit) || 'n. B.'
  return (
    <span className="cook-chip">
      <b>{amt}</b> {ing.name}
    </span>
  )
}

export function CookMode({ recipe, servings, onClose }: Props) {
  const [done, setDone] = useState<Set<number>>(() => new Set())
  const [wake, setWake] = useState<Wake>('checking')
  const loose = unmatched(recipe)

  // Zurück-Taste/Escape schließen die Ansicht über App bzw. diese Taste
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // Bildschirm anlassen (Screen Wake Lock); nach Wechsel in eine andere App neu anfordern
  useEffect(() => {
    if (!navigator.wakeLock) {
      setWake('unsupported')
      return
    }
    let sentinel: WakeLockSentinel | null = null
    let alive = true

    const request = async () => {
      if (!alive || sentinel || document.visibilityState !== 'visible') return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (!alive) {
          void lock.release()
          return
        }
        sentinel = lock
        setWake('on')
        lock.addEventListener('release', () => {
          sentinel = null
          if (alive) setWake('off')
        })
      } catch {
        if (alive) setWake('off')
      }
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void request()
    }

    void request()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      document.removeEventListener('visibilitychange', onVisible)
      void sentinel?.release()
    }
  }, [])

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="cook" role="dialog" aria-modal="true" aria-label={`Kochmodus: ${recipe.title}`}>
      <header className="cook-head">
        <div className="cook-title">
          <h2>{recipe.title}</h2>
          <div className="muted small">für {servings} {servings === 1 ? 'Portion' : 'Portionen'}</div>
        </div>
        <button className="cook-close" onClick={onClose} aria-label="Kochmodus beenden">
          ✕
        </button>
      </header>

      <div className="cook-body">
        {wake === 'on' && <p className="cook-wake">🔆 Bildschirm bleibt an</p>}
        {(wake === 'unsupported' || wake === 'off') && (
          <p className="cook-tip small muted">
            Tipp: Bildschirm-Timeout in den Handy-Einstellungen verlängern – dein Browser kann den Bildschirm nicht wachhalten.
          </p>
        )}

        {loose.length > 0 && (
          <section className="cook-box">
            <h3>Alles bereitstellen</h3>
            <div className="cook-chips">
              {loose.map((ing, i) => (
                <Chip key={i} ing={ing} base={recipe.servings} servings={servings} />
              ))}
            </div>
          </section>
        )}

        <ol className="cook-steps">
          {recipe.steps.map((text, i) => {
            const isDone = done.has(i)
            const needs = ingredientsForStep(recipe, i)
            return (
              <li key={i}>
                <button className={`cook-step ${isDone ? 'done' : ''}`} onClick={() => toggle(i)} aria-pressed={isDone}>
                  <span className="cook-num">{i + 1}</span>
                  <span className="cook-text">{text}</span>
                  {needs.length > 0 && (
                    <span className="cook-chips">
                      {needs.map((ing, j) => (
                        <Chip key={j} ing={ing} base={recipe.servings} servings={servings} />
                      ))}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
