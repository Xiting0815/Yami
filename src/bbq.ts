/**
 * BBQ-Sparte: Ideen-Karte „BBQ-Wetter?“ in der Woche (nur März–September), lernend aus dem, was geplant, gegrillt
 * und bewertet wird. Reine Logik ohne React/Speicher (testbar: scripts/test-bbq.ts).
 *
 * Eingeplant wird BBQ wie Backen über den Backplan (src/bakePlan.ts): Zutaten → Einkaufsliste/Fahrten, Kalender als
 * Abendessen des Tages (src/haSync.ts), „Hast du … gegrillt?“ am Folgetag, „Fertig gegrillt“ im Kochmodus legt die
 * vakuumierten Reste in den Vorrat (cookBasic). Ein BBQ ersetzt meist das Abendessen: „Einplanen für“ bietet an,
 * das geplante Abendessen des Tages zu streichen.
 *
 * Lernen: geplant (+1, im Geschmacksmodell), gegrillt (+0,8), Bewertung wie Backen; die Karte schlägt die Rezepte
 * mit der besten Wertung vor (Lieblinge zuerst, zuletzt Gegrilltes ruht 10 Tage, „nicht so“ nie), dazu eine Idee,
 * die ihr noch nicht gemacht habt. Wegklicken ruht die Karte länger (wie Backvorschläge, Art 'bbq').
 */
import { BASICS, RECIPE_BY_ID } from './data/recipes'
import { isBbqSeason } from './data/season'
import {
  type BakeHint, type BakedRef, HINTS_MAX, bakeHabits, bakedWithin, daysBetween, habitDay, hintBlocked, nextWeekday, plannedWithin,
  recipeScores, weekdayLabel,
} from './bakePlan'
import type { BakePlan, BbqGroup, PlanEntry, Recipe } from './types'
import { isBbq } from './types'
import type { Snack } from './energy'

/** so viele Ideen zeigt die Karte */
export const BBQ_IDEAS = 3
/** zuletzt Gegrilltes ruht so viele Tage, bevor es wieder als Idee kommt */
const REST_DAYS = 10

/** alle planbaren BBQ-Rezepte (ohne Rubs & Saucen, die sind Grundrezepte) */
export const bbqRecipes = (): Recipe[] => BASICS.filter(isBbq)
/** BBQ-Sparte im Rezepte-Tab: BBQ-Rezepte und Rubs & Saucen (Grundrezepte mit `bbq: 'rub'`) */
export const bbqSection = (group?: BbqGroup): Recipe[] => BASICS.filter((r) => (isBbq(r) || r.bbq === 'rub') && (!group || r.bbq === group))

export interface BbqInput {
  today: string
  baked: BakedRef[]
  bakeRatings: Record<string, 'up' | 'again' | 'down'>
  bakePlan: BakePlan
  hints: BakeHint[]
  /** gelernte Vorliebe (Geschmacksmodell, Haushalt) – optional, sortiert mit */
  pref?: (r: Recipe) => number
}

export interface BbqIdeas {
  /** Grilltag, für den die Ideen gedacht sind (nächster gelernter BBQ-Tag, sonst Samstag) */
  day: string
  recipes: Recipe[]
  text: string
}

/**
 * „BBQ-Wetter? Ideen fürs Wochenende“ – nur März–September, nicht weggeklickt (Pause wie Backvorschläge),
 * kein BBQ in den nächsten 7 Tagen geplant und keins in den letzten 4 Tagen gegrillt.
 */
export function bbqIdeas(inp: BbqInput): BbqIdeas | undefined {
  const { today } = inp
  if (!isBbqSeason(today) || hintBlocked(inp.hints, 'bbq', today)) return undefined
  if (plannedWithin(inp.bakePlan, today, 7, isBbq) || bakedWithin(inp.baked, today, 4, isBbq)) return undefined
  // Beilagen sind keine eigene Grill-Idee (sie kommen im Rezept-Tab dazu)
  const pool = bbqRecipes().filter((r) => r.bbq !== 'beilage')
  if (!pool.length) return undefined
  const habits = bakeHabits(inp.baked, today)
  const day = nextWeekday(today, habitDay(habits, 'bbq') ?? 6)
  const sc = recipeScores(inp, 'bbq')
  const ranked = pool
    .filter((r) => !sc.get(r.id)?.down && !(sc.get(r.id)?.last && daysBetween(sc.get(r.id)!.last!, today) < REST_DAYS))
    .map((r) => ({ r, s: (sc.get(r.id)?.score ?? 0) + (inp.pref?.(r) ?? 0) }))
    .sort((a, b) => b.s - a.s || a.r.id.localeCompare(b.r.id))
  // Lieblinge zuerst, aber eine Idee bleibt etwas Neues (noch nie gegrillt), damit es abwechslungsreich bleibt
  const known = ranked.filter((x) => sc.has(x.r.id))
  const fresh = ranked.filter((x) => !sc.has(x.r.id))
  const picks = [...known.slice(0, BBQ_IDEAS - (fresh.length ? 1 : 0)), ...fresh].slice(0, BBQ_IDEAS).map((x) => x.r)
  if (!picks.length) return undefined
  return { day, recipes: picks, text: `BBQ-Wetter? Ideen für ${weekdayLabel(day)}` }
}

/** Karte angenommen (ein Rezept daraus eingeplant) bzw. weggeklickt – Signal für die Pause */
export const bbqHint = (hints: BakeHint[], today: string, action: 'accepted' | 'dismissed'): BakeHint[] =>
  [...hints, { date: today, kind: 'bbq' as const, action }].slice(-HINTS_MAX)

/** offenes Abendessen an einem Tag, das ein BBQ ersetzen würde (nichts bei schon gekochtem/übersprungenem) */
export const dinnerToReplace = (plan: Record<string, PlanEntry | undefined>, day: string): PlanEntry | undefined => {
  const e = plan[day]
  return e && !e.status && RECIPE_BY_ID[e.recipeId] ? e : undefined
}

/**
 * „Fertig gegrillt“: eine Portion der Ladung zählt als Abendessen in die Tagesbilanz (wie ein Snack-Eintrag mit Rezept,
 * damit es auch fürs Lernen als „gegessen“ zählt). Nährwerte je Portion = alle Zutaten ÷ `portions`.
 */
export function bbqMeal(recipe: Recipe, day: string): Snack | null {
  if (!isBbq(recipe) || !(recipe.nutrition.kcal > 0)) return null
  return { date: day, name: recipe.title, kcal: Math.round(recipe.nutrition.kcal), protein: Math.round(recipe.nutrition.protein * 10) / 10, recipeId: recipe.id }
}

/** Reste-Text: „1,5 kg · 6 × 250 g vakuumiert“ */
export function leftoverText(recipe: Recipe, amount = 1): string | undefined {
  const y = recipe.yields
  if (!y || !isBbq(recipe)) return undefined
  const total = y.amount * amount
  const n = y.portion ? Math.round(total / y.portion) : 0
  const amt = y.unit === 'g' ? (total >= 1000 ? `${String(total / 1000).replace('.', ',')} kg` : `${total} g`) : `${total} ${total === 1 ? 'Portion' : 'Portionen'}`
  return n ? `${amt} · ${n} × ${y.portion} ${y.unit === 'g' ? 'g' : 'Portion'} ${y.store ?? 'vakuumiert'}` : `${amt} ${y.store ?? ''}`.trim()
}

/** Wort für „fertig“ je Art: gegrillt (BBQ), gebacken, gemacht */
export const doneWord = (r: Recipe | undefined): string =>
  isBbq(r) ? (r!.bbq === 'dutch' ? 'gekocht' : 'gegrillt') : r?.kind === 'kuchen' || r?.kind === 'brot' || r?.kind === 'gebaeck' ? 'gebacken' : 'gemacht'


/** steht an dem Tag ein BBQ im Plan (nicht „nicht gemacht“)? Dann ist das Abendessen des Tages vergeben. */
export const bbqOn = (bp: BakePlan, day: string): boolean =>
  (bp[day] ?? []).some((e) => e.status !== 'skipped' && isBbq(RECIPE_BY_ID[e.recipeId]))
