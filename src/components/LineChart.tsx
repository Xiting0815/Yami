import { useState } from 'react'
import { parseIso } from '../store'

interface Point {
  date: string
  value: number
}

interface Props {
  title: string
  unit: string
  points: Point[]
  /** CSS-Klasse für die Linienfarbe (chart-weight / chart-fat) */
  tone: 'weight' | 'fat'
  /** gestrichelte Referenzlinie, z. B. Zielgewicht */
  goal?: number
  decimals?: number
}

const W = 340
const H = 150
const PAD = { l: 34, r: 12, t: 12, b: 22 }

const fmtDate = (iso: string) => {
  const d = parseIso(iso)
  return `${d.getDate()}.${d.getMonth() + 1}.`
}

/** Einfache Verlaufslinie (eine Serie), Punkte antippen zeigt den Wert */
export function LineChart({ title, unit, points, tone, goal, decimals = 1 }: Props) {
  const [sel, setSel] = useState<number | null>(null)
  if (points.length === 0) return null
  const fmt = (v: number) => v.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  const values = points.map((p) => p.value).concat(goal != null ? [goal] : [])
  let min = Math.min(...values)
  let max = Math.max(...values)
  const span = Math.max(max - min, decimals ? 1 : 2)
  min -= span * 0.15
  max += span * 0.15
  const x = (i: number) => PAD.l + (points.length === 1 ? (W - PAD.l - PAD.r) / 2 : (i / (points.length - 1)) * (W - PAD.l - PAD.r))
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b)
  // drei dezente Rasterlinien: oben, Mitte, unten des Datenbereichs
  const ticks = [max - span * 0.15, (min + max) / 2, min + span * 0.15]
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ')
  const active = sel != null ? points[sel] : points[points.length - 1]
  const activeIdx = sel ?? points.length - 1

  return (
    <figure className={`chart chart-${tone}`}>
      <figcaption>
        <span>{title}</span>
        <b>
          {fmt(active.value)} {unit} <small>{fmtDate(active.date)}</small>
        </b>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${points.map((p) => `${fmtDate(p.date)} ${fmt(p.value)} ${unit}`).join(', ')}`}>
        {ticks.map((t) => (
          <g key={t} className="grid">
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
            <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end">
              {max - min < 6 ? t.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : Math.round(t)}
            </text>
          </g>
        ))}
        {goal != null && (
          <g className="goal">
            <line x1={PAD.l} x2={W - PAD.r} y1={y(goal)} y2={y(goal)} />
            <text x={W - PAD.r} y={y(goal) - 5} textAnchor="end">
              Ziel {fmt(goal)}
            </text>
          </g>
        )}
        {points.length > 1 && <path className="line" d={path} />}
        {points.map((p, i) => (
          <g key={p.date}>
            <circle className={`dot ${i === activeIdx ? 'on' : ''}`} cx={x(i)} cy={y(p.value)} r={i === activeIdx ? 5.5 : 4} />
            {/* großer, unsichtbarer Tippbereich */}
            <rect
              x={x(i) - 14}
              y={PAD.t}
              width={28}
              height={H - PAD.t - PAD.b}
              fill="transparent"
              onClick={() => setSel(i)}
              onMouseEnter={() => setSel(i)}
            />
          </g>
        ))}
        {[0, points.length - 1].filter((v, i, a) => a.indexOf(v) === i).map((i) => (
          <text key={i} className="xlabel" x={x(i)} y={H - 6} textAnchor={points.length === 1 ? 'middle' : i === 0 ? 'start' : 'end'}>
            {fmtDate(points[i].date)}
          </text>
        ))}
      </svg>
    </figure>
  )
}
