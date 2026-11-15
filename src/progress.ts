/**
 * Wiegen 1× pro Woche: Messwerte, Trend, Zielgewicht und Vorschläge zur Anpassung des Kalorienziels.
 */
import type { Profile } from './energy'
import { floorKcal, targetKcal, tdee } from './energy'
import { addDaysIso, daysUntil } from './kitchen'
import { isoDate, mondayOf, parseIso } from './store'

export interface WeighIn {
  /** ISO-Datum der Messung */
  date: string
  weight: number
  /** Körperfett in % */
  fat?: number
  /** Muskelmasse in kg oder % (siehe Profil.muscleUnit) */
  muscle?: number
  /** Körperwasser in % */
  water?: number
}

/** Montag der Woche einer Messung – pro Woche zählt genau ein Eintrag */
export function weekOf(iso: string): string {
  return isoDate(mondayOf(parseIso(iso)))
}

/** Messung eintragen; eine vorhandene Messung derselben Woche wird ersetzt */
export function upsertWeighIn(list: WeighIn[], entry: WeighIn): WeighIn[] {
  const wk = weekOf(entry.date)
  return [...list.filter((w) => weekOf(w.date) !== wk), entry].sort((a, b) => a.date.localeCompare(b.date))
}

/** Ist für die Woche von `today` schon gewogen? */
export function weighedThisWeek(list: WeighIn[], today: string): boolean {
  return list.some((w) => weekOf(w.date) === weekOf(today))
}

/** kg ≈ 7.700 kcal Körperfett */
const KCAL_PER_KG = 7700

/** erwartete Abnahme pro Woche (kg) beim eingestellten Defizit */
export function expectedWeeklyLoss(p: Profile): number {
  return (p.deficit * 7) / KCAL_PER_KG
}

/** durchschnittliche Veränderung pro Woche (kg, negativ = Abnahme) über die letzten n Messungen */
export function weeklyRate(list: WeighIn[], n = 4): number | null {
  const last = list.slice(-n)
  if (last.length < 2) return null
  const days = daysUntil(last[last.length - 1].date, last[0].date)
  if (days <= 0) return null
  return ((last[last.length - 1].weight - last[0].weight) / days) * 7
}

export interface Suggestion {
  /** kcal, um die das Ziel geändert werden soll */
  delta: number
  title: string
  reason: string
}

/**
 * Vorschlag zur Anpassung – frühestens nach 3 Messungen (= 2 Wochen Verlauf) und nicht erneut,
 * bevor nach der letzten Entscheidung 2 weitere Wochen gemessen wurden.
 */
export function suggestion(list: WeighIn[], p: Profile, decidedAtCount: number): Suggestion | null {
  if (list.length < 3 || list.length - decidedAtCount < 2) return null
  const [a, , c] = list.slice(-3)
  // die drei Messungen müssen wirklich etwa 2 Wochen abdecken (nicht drei Einträge in 8 Tagen)
  if (daysUntil(c.date, a.date) < 12) return null
  const twoWeekChange = c.weight - a.weight
  const weekly = twoWeekChange / 2
  const fmt = (v: number) => v.toLocaleString('de-DE', { maximumFractionDigits: 1, signDisplay: 'always' })
  const target = targetKcal(p)

  if (p.deficit > 0) {
    // kaum Abnahme in 2 Wochen (weniger als ¼ des Erwarteten, mind. 0,25 kg) → 100 kcal weniger
    const stallLimit = Math.max(0.25, expectedWeeklyLoss(p) * 2 * 0.25)
    if (twoWeekChange > -stallLimit && target - 100 >= floorKcal(p)) {
      return {
        delta: -100,
        title: '−100 kcal pro Tag',
        reason: `In den letzten 2 Wochen hat sich dein Gewicht kaum verändert (${fmt(twoWeekChange)} kg). Ein etwas kleineres Ziel bringt die Abnahme wieder in Gang.`,
      }
    }
    // schneller als 1 % pro Woche → 100 kcal mehr, um Muskeln zu schützen
    if (-weekly > c.weight * 0.01) {
      return {
        delta: 100,
        title: '+100 kcal pro Tag',
        reason: `Du nimmst gerade sehr schnell ab (${fmt(weekly)} kg pro Woche, mehr als 1 % deines Gewichts). Etwas mehr Essen schützt die Muskeln und ist besser durchzuhalten.`,
      }
    }
  } else {
    // Gewicht halten
    if (twoWeekChange > 0.6) {
      return { delta: -100, title: '−100 kcal pro Tag', reason: `Du hast in 2 Wochen ${fmt(twoWeekChange)} kg zugenommen, obwohl du das Gewicht halten willst.` }
    }
    if (twoWeekChange < -0.6) {
      return { delta: 100, title: '+100 kcal pro Tag', reason: `Du hast in 2 Wochen ${fmt(twoWeekChange)} kg abgenommen, obwohl du das Gewicht halten willst.` }
    }
  }
  return null
}

/** Hinweis, wenn das Gewicht sinkt, der Körperfettanteil aber steigt (Muskelabbau) */
export function compositionHint(list: WeighIn[]): string | null {
  const withFat = list.filter((w) => w.fat != null)
  if (withFat.length < 3) return null
  const [a, , c] = withFat.slice(-3)
  if (c.weight < a.weight - 0.3 && c.fat! > a.fat! + 0.3) {
    return 'Dein Gewicht sinkt, aber dein Körperfettanteil steigt – du verlierst eher Muskeln als Fett. Achte auf genug Eiweiß (Frühstücke mit ≥ 25 g helfen) und etwas Bewegung, oder wähle ein langsameres Tempo.'
  }
  return null
}

export interface GoalProgress {
  start: number
  current: number
  goal: number
  /** 0–1 */
  pct: number
  remaining: number
  /** geschätztes Datum, an dem das Ziel erreicht wird */
  eta?: string
  /** woher der Trend stammt */
  basis: 'trend' | 'plan'
}

export function goalProgress(list: WeighIn[], p: Profile, today: string): GoalProgress | null {
  if (!p.goalWeight || !list.length) return null
  const start = list[0].weight
  const current = list[list.length - 1].weight
  const goal = p.goalWeight
  const total = start - goal
  const pct = total === 0 ? 1 : Math.max(0, Math.min(1, (start - current) / total))
  const remaining = current - goal
  if (remaining <= 0) return { start, current, goal, pct: 1, remaining: 0, basis: 'trend' }
  // erst ab 4 Messungen (3 Wochen) ist der Trend aussagekräftig – vorher das geplante Tempo
  const trend = list.length >= 4 ? weeklyRate(list) : null
  let basis: GoalProgress['basis'] = 'trend'
  let lossPerWeek = trend != null && trend < -0.05 ? -trend : 0
  if (!lossPerWeek) {
    lossPerWeek = expectedWeeklyLoss(p)
    basis = 'plan'
  }
  const eta = lossPerWeek > 0 ? addDaysIso(today, Math.round((remaining / lossPerWeek) * 7)) : undefined
  return { start, current, goal, pct, remaining, eta, basis }
}

/** Erhaltungsbedarf zum Vergleich (für die Anzeige) */
export function maintenance(p: Profile): number {
  return Math.round(tdee(p) / 10) * 10
}
