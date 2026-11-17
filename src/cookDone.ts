/**
 * „Fertig gekocht“ (Ende des Kochmodus): welcher Abendessen-Eintrag wird als gekocht eingetragen?
 *
 *  1. Der Eintrag des Tages, von dem aus das Rezept geöffnet wurde (nur heute oder früher), oder – falls dort etwas
 *     anderes steht – der von heute bzw. gestern mit diesem Rezept → genau dieser Eintrag.
 *  2. Sonst: heute ist nichts (oder nur „nicht gekocht“) geplant → das Rezept wird für heute eingetragen.
 *  3. Sonst steht heute ein anderes Gericht → Rückfrage („Statt … heute eintragen?“).
 */
import { RECIPE_BY_ID } from './data/recipes'
import { addDaysIso } from './kitchen'
import type { WeekPlan } from './types'

export type CookTarget =
  | { kind: 'entry'; day: string; /** schon als gekocht eingetragen */ done: boolean }
  | { kind: 'new'; day: string }
  | { kind: 'conflict'; day: string; title: string }

export function cookTarget(plan: WeekPlan, recipeId: string, today: string, ctxDay?: string): CookTarget {
  const days = [ctxDay, today, addDaysIso(today, -1)].filter((d): d is string => !!d && d <= today)
  for (const d of days) {
    const e = plan[d]
    if (e && e.recipeId === recipeId) return { kind: 'entry', day: d, done: e.status === 'cooked' }
  }
  const e = plan[today]
  if (e && e.status !== 'skipped') return { kind: 'conflict', day: today, title: RECIPE_BY_ID[e.recipeId]?.title ?? 'anderes Gericht' }
  return { kind: 'new', day: today }
}

/**
 * Ist dasselbe Rezept für einen späteren Tag geplant (noch offen), wird es beim Kochen heute dorthin „verschoben“,
 * statt doppelt zu stehen: der Tag, von dem aus geöffnet wurde, sonst der nächste.
 */
export function futureDuplicate(plan: WeekPlan, recipeId: string, today: string, ctxDay?: string): string | undefined {
  const match = (d: string) => d > today && plan[d]?.recipeId === recipeId && !plan[d]!.status
  if (ctxDay && match(ctxDay)) return ctxDay
  return Object.keys(plan).filter(match).sort()[0]
}
