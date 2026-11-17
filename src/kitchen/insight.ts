/** Küchenlogik – Empfehlungen: Bewertung eines Rezepts nach Vorrat, Preis, Saison und Abwechslung. */
import { seasonOf } from '../data/season'
import type { Festive, Recipe, WeekPlan } from '../types'
import { type PantryLot, type PriceOverrides, daysUntil, minIso, productFor, needsOf, recipeCost } from './base'
import { lotsFor } from './pantry'

export interface Insight {
  /** Festtagsgericht: im Fenster (mit Badge-Text) oder außerhalb */
  festive?: { active: boolean; label?: string }
  /** Saisonbezug (nur mit Monat): Zutaten außerhalb / innerhalb der Saison */
  season?: { out: string[]; peak: string[] }
  /** Zutaten, die (teilweise) aus dem Vorrat kommen */
  fromPantry: string[]
  /** davon bald ablaufend (≤ 3 Tage) */
  urgent: string[]
  /** Zutaten, die ein austauschbarer Vorratsposten deckt (z. B. Spaghetti ← Penne) */
  substitutes: { need: string; with: string[] }[]
  /** Anzahl mengenmäßig geführter Zutaten des Gerichts (ohne Gewürze/Grundzutaten) */
  needCount: number
  /** davon mindestens zur Hälfte aus dem Vorrat gedeckt */
  haveCount: number
  /** Anteil des Warenwerts, der aus dem Vorrat kommt (0–1) */
  pantryShare: number
  /** Vorrats-Modus („Was koche ich damit?“): Sortierwert ohne gelernte Vorliebe */
  modeScore: number
  /** zusätzliche Einkaufskosten (ganze Packungen) */
  buyCost: number
  /** anteiliger Warenwert */
  cost: number
  perPortion: number
  /** gelernte Vorliebe als kurze Begründung (z. B. „❤️ magst du“) */
  taste?: string
  /** Tage seit dem letzten Mal, falls in den letzten Wochen geplant */
  lastSeenDays?: number
  /** verderbliche Reste, die nach dem Einkauf übrig blieben (ungenutzt) */
  waste: { name: string; amount: number; unit: string }[]
  /** Wert dieser Reste in € */
  wasteEuro: number
  /** Zutaten, die bis zum Kochtag nicht mehr frisch wären */
  stale: string[]
  /** alles Zugekaufte hält mindestens 2 Wochen */
  longLasting: boolean
  score: number
}

/** Gewicht des Vorrats in der normalen Sortierung (Aufbrauchen vor Zukaufen) */
export const PANTRY_WEIGHT = 4

/** gilt als verderblich, wenn eine angebrochene Packung höchstens so viele Tage hält */
const PERISHABLE_DAYS = 7

/** Alltagsprodukte, deren Rest im Haushalt praktisch immer aufgebraucht wird (oder sich einfrieren lässt) */
const WASTE_EXEMPT = new Set(['Milch', 'Vollkornbrot', 'Toastbrot', 'Weißbrot', 'Brötchen vom Vortag', 'Ciabatta', 'Zitrone', 'Limette'])

/** Festtags-Fenster als [Monat-Tag von, bis] (inklusive) */
const FESTIVE_WINDOW: Record<Festive, [string, string]> = {
  martini: ['11-01', '11-30'],
  weihnachten: ['12-01', '12-26'],
}
const FESTIVE_BADGE: Record<Festive, string> = { martini: '🪿 Martinsgans-Zeit', weihnachten: '🎄 Passt zur Weihnachtszeit' }
/** Bonus im Festtags-Fenster / Abzug außerhalb */
export const FESTIVE_BOOST = 11
export const FESTIVE_PENALTY = 4

/** Festtagsbezug eines Gerichts am Kochtag (ISO-Datum): im Fenster (Badge-Text) oder außerhalb */
export function festiveOf(recipe: Recipe, iso: string): { active: boolean; label?: string } | undefined {
  if (!recipe.festive?.length) return undefined
  const md = iso.slice(5, 10)
  const hit = recipe.festive.find((w) => md >= FESTIVE_WINDOW[w][0] && md <= FESTIVE_WINDOW[w][1])
  return hit ? { active: true, label: FESTIVE_BADGE[hit] } : { active: false }
}

export interface InsightOptions {
  /** Kochtag (ISO-Datum) für Festtags-Fenster; Standard: heute */
  day?: string
  /** Tage zwischen Einkauf und Kochtag (für die Frische, nur Abendessen) */
  freshDays?: number
  /** Monat (1–12) des Kochtags: Saisonbezug und Saisonpreise */
  month?: number
}

/** „Nur mit Vorrat kochbar“: höchstens so viel muss zugekauft werden */
export const PANTRY_ONLY_MAX_EURO = 1.5

/** Ziel-Anteil vegetarischer Gerichte pro Woche (15 % ≈ 1 von 7 Tagen) */
export const VEG_SHARE = 0.15

/** Abwertung vegetarischer Gerichte, abhängig davon, ob die Woche ihr Veggie-Kontingent schon hat */
// unter Kontingent: leichter Bonus (−1), damit ca. 1 Veggie-Gericht pro Woche vorkommt
function vegPenalty(recipe: Recipe, weekRecipes: Recipe[]): number {
  if (!recipe.vegetarian) return 0
  const quota = Math.max(1, Math.round(7 * VEG_SHARE))
  const vegCount = weekRecipes.filter((w) => w.vegetarian).length
  return vegCount >= quota ? 12 : -1
}

function urgencyWeight(daysLeft: number): number {
  if (daysLeft <= 1) return 4
  if (daysLeft <= 3) return 2.5
  if (daysLeft <= 7) return 1.5
  if (daysLeft <= 30) return 1
  return 0.3
}

export function insight(
  recipe: Recipe,
  servings: number,
  leftovers: PantryLot[],
  today: string,
  overrides: PriceOverrides,
  lastSeen: Map<string, string>,
  jitter: number,
  /** schon in dieser Woche geplante Gerichte (für Abwechslung bei Art & Küche) */
  weekRecipes: Recipe[] = [],
  opts: InsightOptions = {},
): Insight {
  const fromPantry: string[] = []
  const urgent: string[] = []
  const waste: Insight['waste'] = []
  const stale: string[] = []
  let pantryScore = 0
  let coveredValue = 0
  let totalValue = 0
  let urgentValue = 0
  let haveCount = 0
  const substitutes: Insight['substitutes'] = []
  const needs = needsOf(recipe, servings)
  // jeder Vorratsposten wird nur einmal angerechnet (Spaghetti und Penne im selben Gericht teilen sich ihn)
  const poolLeft = new Map<string, number>()
  const left0 = (l: PantryLot) => poolLeft.get(l.id) ?? l.amount
  let buyCost = 0
  let wasteEuro = 0
  let longLasting = true
  for (const n of needs) {
    const prod = productFor(n.name, overrides, opts.month)!
    // gleiche Reihenfolge wie beim Abziehen; am Kochtag Abgelaufenes zählt nicht
    const cand = lotsFor(leftovers, n.name, opts.day ?? today).filter((l) => l.name === n.name || l.unit === prod.unit)
    let rest = n.amount
    let have = 0
    const used: PantryLot[] = []
    for (const l of cand) {
      const a = left0(l)
      if (a <= 1e-6 || rest <= 1e-9) continue
      const t = Math.min(a, rest)
      poolLeft.set(l.id, a - t)
      rest -= t
      have += t
      used.push(l)
    }
    const value = (n.amount / prod.pack) * prod.price
    totalValue += value
    if (have > 1e-6) {
      const coverage = Math.min(1, have / n.amount)
      const soonest = used.reduce((m, l) => minIso(m, l.expires), used[0].expires)
      const left = daysUntil(soonest, today)
      pantryScore += coverage * urgencyWeight(left)
      coveredValue += coverage * value
      if (coverage >= 0.5) haveCount++
      const names = [...new Set(used.map((l) => l.name))]
      for (const nm of names) if (!fromPantry.includes(nm)) fromPantry.push(nm)
      const other = names.filter((nm) => nm !== n.name)
      if (other.length) substitutes.push({ need: n.name, with: other })
      if (left <= 3) {
        urgentValue += coverage * value
        for (const nm of names) if (!urgent.includes(nm)) urgent.push(nm)
      }
    }
    const missing = Math.max(0, n.amount - have)
    if (missing > 1e-6) {
      const packs = Math.ceil(missing / prod.pack - 1e-6)
      buyCost += packs * prod.price
      if (prod.shelf < 14) longLasting = false
      // bis zum Kochtag noch frisch?
      if (opts.freshDays != null && prod.shelf < opts.freshDays) stale.push(n.name)
      // angebrochener Rest, der schnell verdirbt
      const surplus = packs * prod.pack - missing
      const keeps = prod.opened ?? prod.shelf
      if (surplus > 1e-6 && keeps <= PERISHABLE_DAYS && surplus / prod.pack > 0.15 && !WASTE_EXEMPT.has(n.name)) {
        waste.push({ name: n.name, amount: surplus, unit: prod.unit })
        wasteEuro += (surplus / prod.pack) * prod.price
      }
    }
  }
  const seen = lastSeen.get(recipe.id)
  const lastSeenDays = seen ? -daysUntil(seen, today) : undefined
  const repeatPenalty = lastSeenDays != null && lastSeenDays <= 21 ? 12 : 0
  // Abwechslung: gleiche Gerichtart / Küche in derselben Woche abwerten
  const isBreakfast = recipe.meal === 'breakfast'
  const sameType = isBreakfast ? 0 : weekRecipes.filter((w) => w.type === recipe.type).length
  const sameCuisine = isBreakfast ? 0 : weekRecipes.filter((w) => w.cuisine === recipe.cuisine).length
  const mixPenalty = sameType * 1.8 + Math.max(0, sameCuisine - 1) * 2.2
  // Vegetarisch nur ca. 15 %: ist das Wochen-Kontingent erreicht, rutschen Veggie-Gerichte weit nach hinten
  // Lebensmittel sparen: verderbliche Reste deutlich abwerten, lange Haltbares bevorzugen
  const wastePenalty = wasteEuro * 2.5 + waste.length * 0.8
  const freshPenalty = stale.length * 4
  const longBonus = longLasting ? 1.5 : 0
  // Saison: Gerichte mit Zutaten außerhalb der Saison nach hinten, saisonale leicht nach vorne
  const season = opts.month != null ? seasonOf(recipe, opts.month) : undefined
  const seasonScore = season ? (season.out.length > 0 ? -3 : season.peak.length > 0 ? 1 : 0) : 0
  const festive = festiveOf(recipe, opts.day ?? today)
  // im Fenster: der Preis des Festessens zählt nur noch halb – es kommt nach vorn, ohne den Stapel zu dominieren
  const festiveScore = festive ? (festive.active ? FESTIVE_BOOST + buyCost * 0.18 : -FESTIVE_PENALTY) : 0
  // Vorrat aufbrauchen: Zahl der gedeckten Zutaten (Dringlichkeit) plus Anteil am Warenwert
  const pantryShare = totalValue > 1e-6 ? coveredValue / totalValue : 0
  const urgentShare = totalValue > 1e-6 ? urgentValue / totalValue : 0
  const countShare = needs.length ? haveCount / needs.length : 0
  const modeScore =
    (fromPantry.length ? 6 : -50) + 12 * pantryShare + 16 * countShare + 8 * urgentShare + pantryScore * 1.5 - buyCost * 0.6 - repeatPenalty * 0.5 + jitter
  const score =
    seasonScore +
    festiveScore +
    pantryScore * PANTRY_WEIGHT +
    pantryShare * 4 -
    buyCost * 0.25 +
    jitter * 4 -
    repeatPenalty -
    mixPenalty -
    (isBreakfast ? 0 : vegPenalty(recipe, weekRecipes)) -
    wastePenalty -
    freshPenalty +
    longBonus
  const cost = recipeCost(recipe, servings, overrides)
  return { season, festive, fromPantry, urgent, substitutes, needCount: needs.length, haveCount, pantryShare, modeScore, buyCost, cost, perPortion: cost / servings, lastSeenDays, waste, wasteEuro, stale, longLasting, score }
}

/** Wann wurde ein Rezept zuletzt geplant (vor dem angegebenen Datum)? */
export function lastSeenMap(plan: WeekPlan, before: string): Map<string, string> {
  const m = new Map<string, string>()
  for (const [day, e] of Object.entries(plan)) {
    if (!e || day >= before || e.status === 'skipped') continue
    const cur = m.get(e.recipeId)
    if (!cur || day > cur) m.set(e.recipeId, day)
  }
  return m
}
