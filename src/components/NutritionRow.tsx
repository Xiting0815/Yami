import type { Nutrition } from '../types'

/** kompakte Nährwertzeile pro Portion */
export function NutritionRow({ n, className = '' }: { n: Nutrition; className?: string }) {
  return (
    <div className={`nutri ${className}`}>
      <span title="Kalorien">🔥 {n.kcal.toLocaleString('de-DE')} kcal</span>
      <span title="Eiweiß">💪 {Math.round(n.protein)} g Eiweiß</span>
      <span title="Ballaststoffe">🌾 {Math.round(n.fiber)} g Ballastst.</span>
    </div>
  )
}

/** ausführliche Tabelle für die Rezeptansicht */
export function NutritionTable({ n, servings }: { n: Nutrition; servings: number }) {
  const rows: [string, string][] = [
    ['Kalorien', `${n.kcal.toLocaleString('de-DE')} kcal`],
    ['Eiweiß', `${n.protein.toFixed(0)} g`],
    ['Ballaststoffe', `${n.fiber.toFixed(0)} g`],
    ['Kohlenhydrate', `${n.carbs.toFixed(0)} g`],
    ['Fett', `${n.fat.toFixed(0)} g`],
  ]
  return (
    <div className="nutri-table">
      <div className="muted small">Nährwerte pro Portion{servings > 1 ? ` (bei ${servings} Portionen)` : ''} · Richtwerte</div>
      <div className="nutri-grid">
        {rows.map(([k, v]) => (
          <div key={k}>
            <b>{v}</b>
            <span>{k}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
