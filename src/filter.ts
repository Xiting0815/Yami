import type { Recipe } from './types'
import type { Filters } from './store'

export const CHEAP_LIMIT = 2.5

/** costPerPortion nur nötig, wenn der Günstig-Filter aktiv ist */
export function matches(r: Recipe, f: Filters, costPerPortion?: number): boolean {
  if (f.cuisines.length && !f.cuisines.includes(r.cuisine)) return false
  if (f.types.length && !f.types.includes(r.type)) return false
  if (f.vegetarian && !r.vegetarian) return false
  if (f.maxTime && r.time > f.maxTime) return false
  if (f.cheap && costPerPortion != null && costPerPortion > CHEAP_LIMIT) return false
  return true
}

export function formatTime(min: number): string {
  if (min < 60) return `${min} Min.`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} Std. ${m} Min.` : `${h} Std.`
}
