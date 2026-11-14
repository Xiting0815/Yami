import { useEffect, useMemo, useRef, useState } from 'react'
import type { Recipe } from '../types'
import { CUISINE_LABEL, TYPE_LABEL } from '../types'
import { formatTime } from '../filter'
import { type Insight, formatEuro } from '../kitchen'
import { RecipeImage } from './RecipeImage'

interface Props {
  /** bereits sortiert: beste Empfehlung zuerst */
  deck: Recipe[]
  insights: Map<string, Insight>
  onTake: (r: Recipe) => void
  onReject: (r: Recipe) => void
  onInfo: (r: Recipe) => void
}

const THRESHOLD = 90

export function InsightBadges({ ins }: { ins?: Insight }) {
  if (!ins) return null
  const others = ins.fromPantry.filter((n) => !ins.urgent.includes(n))
  return (
    <div className="badges">
      {ins.urgent.length > 0 && <span className="badge warn">⚠️ verbraucht {ins.urgent.slice(0, 2).join(', ')}{ins.urgent.length > 2 ? ' …' : ''}</span>}
      {others.length > 0 && (
        <span className="badge eco">♻️ {others.length === 1 ? others[0] : `${others.length} Zutaten`} aus dem Vorrat</span>
      )}
      <span className="badge">🛒 {ins.buyCost < 0.01 ? 'nichts einkaufen' : `+${formatEuro(ins.buyCost)}`}</span>
      {ins.lastSeenDays != null && ins.lastSeenDays <= 28 && <span className="badge">🔁 vor {ins.lastSeenDays} Tagen</span>}
    </div>
  )
}

export function SwipeDeck({ deck, insights, onTake, onReject, onInfo }: Props) {
  const [drag, setDrag] = useState({ dx: 0, dy: 0, active: false })
  const [leaving, setLeaving] = useState<null | 'left' | 'right'>(null)
  const start = useRef<{ x: number; y: number; t: number } | null>(null)
  const moved = useRef(false)

  const top = deck[0]
  const next = deck.slice(1, 3)

  // neue oberste Karte → Zustand zurücksetzen
  useEffect(() => {
    setLeaving(null)
    setDrag({ dx: 0, dy: 0, active: false })
  }, [top?.id])

  function fly(dir: 'left' | 'right') {
    if (leaving || !top) return
    setLeaving(dir)
    const card = top
    window.setTimeout(() => (dir === 'right' ? onTake(card) : onReject(card)), 260)
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (document.querySelector('.sheet')) return
      if (e.key === 'ArrowRight') fly('right')
      if (e.key === 'ArrowLeft') fly('left')
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const style = useMemo(() => {
    if (leaving) {
      const x = leaving === 'right' ? window.innerWidth * 1.2 : -window.innerWidth * 1.2
      return {
        transform: `translate(${x}px, ${drag.dy}px) rotate(${leaving === 'right' ? 25 : -25}deg)`,
        transition: 'transform 260ms ease-in',
      }
    }
    return {
      transform: `translate(${drag.dx}px, ${drag.dy * 0.3}px) rotate(${drag.dx / 18}deg)`,
      transition: drag.active ? 'none' : 'transform 220ms ease-out',
    }
  }, [drag, leaving])

  if (!top) {
    return (
      <div className="deck-empty">
        <p>Keine Gerichte für diese Filter.</p>
        <p className="muted">Lockere die Filter oben, um wieder Vorschläge zu sehen.</p>
      </div>
    )
  }

  const likeOpacity = Math.min(1, Math.max(0, drag.dx / THRESHOLD))
  const nopeOpacity = Math.min(1, Math.max(0, -drag.dx / THRESHOLD))
  const ins = insights.get(top.id)

  return (
    <div className="deck-wrap">
      <div className="deck">
        {next
          .slice()
          .reverse()
          .map((r, i) => (
            <div key={r.id} className="card behind" style={{ transform: `scale(${0.94 + i * 0.03}) translateY(${(next.length - 1 - i) * 10 + 8}px)` }}>
              <RecipeImage recipe={r} className="card-img" />
            </div>
          ))}
        <div
          key={top.id}
          className="card top"
          style={style}
          onPointerDown={(e) => {
            if (leaving) return
            ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
            start.current = { x: e.clientX, y: e.clientY, t: Date.now() }
            moved.current = false
            setDrag({ dx: 0, dy: 0, active: true })
          }}
          onPointerMove={(e) => {
            if (!start.current) return
            const dx = e.clientX - start.current.x
            const dy = e.clientY - start.current.y
            if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved.current = true
            setDrag({ dx, dy, active: true })
          }}
          onPointerUp={() => {
            if (!start.current) return
            const dt = Date.now() - start.current.t
            const velocity = Math.abs(drag.dx) / Math.max(dt, 1)
            start.current = null
            if (!moved.current) {
              setDrag({ dx: 0, dy: 0, active: false })
              onInfo(top)
              return
            }
            if (drag.dx > THRESHOLD || (drag.dx > 40 && velocity > 0.6)) fly('right')
            else if (drag.dx < -THRESHOLD || (drag.dx < -40 && velocity > 0.6)) fly('left')
            else setDrag({ dx: 0, dy: 0, active: false })
          }}
          onPointerCancel={() => {
            start.current = null
            setDrag({ dx: 0, dy: 0, active: false })
          }}
        >
          <RecipeImage recipe={top} className="card-img" />
          <div className="stamp like" style={{ opacity: likeOpacity }}>LECKER</div>
          <div className="stamp nope" style={{ opacity: nopeOpacity }}>NÄCHSTES</div>
          <div className="card-info">
            <InsightBadges ins={ins} />
            <h2>{top.title}</h2>
            <div className="card-meta">
              {CUISINE_LABEL[top.cuisine]} · {TYPE_LABEL[top.type]} · ⏱ {formatTime(top.time)}
              {ins ? ` · ≈ ${formatEuro(ins.perPortion)}/P.` : ''}
            </div>
          </div>
        </div>
      </div>
      <div className="deck-actions">
        <button className="round nope" aria-label="Nächstes Gericht" onClick={() => fly('left')}>✕</button>
        <button className="round info" aria-label="Rezept ansehen" onClick={() => onInfo(top)}>i</button>
        <button className="round like" aria-label="Nehmen" onClick={() => fly('right')}>♥</button>
      </div>
    </div>
  )
}
