/**
 * „Oft vergessen“: Im Vorrat gelöscht mit Grund „Vergessen zu kaufen“ zählt je Zutat (abklingend, ganzer Haushalt).
 * Solche Artikel stehen auf Einkaufsliste, Prüfliste und in Google Tasks mit „⚠️ oft vergessen“ (in Google Tasks vorne
 * in ihrer Abteilung).
 */
import { daysUntil } from './kitchen'
import type { PantryRemoval } from './store'

export const FORGOT_HALF_LIFE = 60
/** ab diesem (abklingenden) Wert gilt eine Zutat als „vergessen“ – einmal frisch vergessen reicht ca. 9 Tage */
export const FORGOT_MIN = 0.9
/** ab hier „oft vergessen“ (etwa zweimal in den letzten Wochen) */
export const FORGOT_OFTEN = 1.5

/** „Vergessen zu kaufen“ je Zutat, zeitlich abklingend (Halbwertszeit 60 Tage) */
export function forgotScores(removals: PantryRemoval[], today: string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of removals) {
    if (r.reason !== 'forgot' || r.date > today) continue
    out[r.name] = (out[r.name] ?? 0) + Math.pow(0.5, daysUntil(today, r.date) / FORGOT_HALF_LIFE)
  }
  return out
}

/** Markierung auf Einkaufsliste/Prüfliste/Google Tasks */
export function forgotLabel(score: number | undefined): string | undefined {
  if (score == null || score < FORGOT_MIN) return undefined
  return score >= FORGOT_OFTEN ? '⚠️ oft vergessen' : '⚠️ zuletzt vergessen'
}

/** markierte Zutaten (Name → Text) */
export function forgottenItems(removals: PantryRemoval[], today: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [n, v] of Object.entries(forgotScores(removals, today))) {
    const l = forgotLabel(v)
    if (l) out[n] = l
  }
  return out
}
