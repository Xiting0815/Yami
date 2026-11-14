import type { Ingredient } from './types'

/** Mengen auf die gewünschte Portionenzahl umrechnen */
export function scale(ing: Ingredient, base: number, target: number): number | null {
  if (ing.amount == null) return null
  return (ing.amount * target) / base
}

const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [0.333, '⅓'],
  [0.5, '½'],
  [0.666, '⅔'],
  [0.75, '¾'],
]

function niceNumber(n: number, unit: string): string {
  // Gewichte/Volumen: sinnvoll runden
  if (unit === 'g' || unit === 'ml') {
    if (n >= 1000) {
      const v = Math.round(n / 50) * 50 / 1000
      return `${String(v).replace('.', ',')} ${unit === 'g' ? 'kg' : 'l'}`
    }
    const step = n >= 200 ? 10 : 5
    return `${Math.max(step, Math.round(n / step) * step)} ${unit}`
  }
  if (unit === 'kg' || unit === 'l') return `${String(Math.round(n * 100) / 100).replace('.', ',')} ${unit}`
  // Stückzahlen etc.: Brüche anzeigen
  const whole = Math.floor(n + 0.01)
  const rest = n - whole
  let frac = ''
  if (rest > 0.12) {
    const f = FRACTIONS.reduce((best, cur) => (Math.abs(cur[0] - rest) < Math.abs(best[0] - rest) ? cur : best))
    if (rest > 0.87) return `${whole + 1} ${unit}`.trim()
    frac = f[1]
  }
  const num = whole > 0 ? `${whole}${frac}` : frac || '0'
  return `${num} ${unit}`.trim()
}

export function formatAmount(amount: number | null, unit: string): string {
  if (amount == null) return ''
  // Einkaufsliste: Kleinstmengen in g (z. B. Safran) lesbar halten
  if (unit === 'g' && amount < 1) return `${String(Math.round(amount * 10) / 10).replace('.', ',')} g`
  return niceNumber(amount, unit)
}
