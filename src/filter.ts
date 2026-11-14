import type { Recipe } from './types'
import type { Filters } from './store'

export function matches(r: Recipe, f: Filters): boolean {
  if (f.cuisines.length && !f.cuisines.includes(r.cuisine)) return false
  if (f.types.length && !f.types.includes(r.type)) return false
  if (f.vegetarian && !r.vegetarian) return false
  if (f.maxTime && r.time > f.maxTime) return false
  return true
}

export function formatTime(min: number): string {
  if (min < 60) return `${min} Min.`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} Std. ${m} Min.` : `${h} Std.`
}
