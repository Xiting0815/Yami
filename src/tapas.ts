/**
 * Tapas-Abend: mehrere Tapas zusammen auf einen Tag planen (ersetzt das Abendessen), gemeinsamer Ablaufplan im Kochmodus,
 * und lernende „Tapas-Abend-Ideen“. Reine Logik ohne React/Speicher (testbar: scripts/test-spanien.ts).
 *
 * Eingeplant wird über den Backplan (src/bakePlan.ts): jede Tapa ist ein eigener Eintrag des Tages – so laufen Einkaufsliste,
 * Fahrten, Fehlmengen, „Fertig“ (Zutaten abziehen) und Bewertung je Tapa wie bei BBQ/Backen. Die Menge je Tapa richtet sich nach
 * der Anzahl der Tapas des Abends (`tapasFactor`). Kalender: EIN Termin „🍽️ 🫒 Tapas-Abend: …“ (src/haSync.ts).
 *
 * Lernen: geplant (+1, Geschmacksmodell „tapas:fisch“ …), gemacht (+0,8), Bewertung je Tapa; dazu Kombinationen
 * (was am selben Abend gemacht und gut bewertet wurde, passt zusammen). Die Ideen nehmen je eine Tapa aus Fisch, Fleisch,
 * Gemüse, Ei/Kartoffel und Brot/Dip – Lieblinge, Passendes aus dem Vorrat, zuletzt Gemachtes ruht 14 Tage, „nicht so“ nie.
 */
import { BASICS, RECIPE_BY_ID, basicFor } from './data/recipes'
import { SPICES } from './data/catalog'
import { interchangeable } from './data/substitutes'
import { canonical, type PantryLot } from './kitchen'
import { type BakedRef, addBake, bakesOn, daysBetween, decay, recipeScores, tapasEntries, tapasFactorFor } from './bakePlan'
import { dinnerToReplace } from './bbq'
import type { Snack } from './energy'
import type { BakePlan, PlanEntry, Recipe, TapasGroup, TapasServe, WeekPlan } from './types'
import { TAPAS_GROUP_LABEL, isTapa } from './types'

/** so viele Tapas kann man für einen Abend wählen (empfohlen 4–6) */
export const TAPAS_MIN = 3
export const TAPAS_MAX = 8
/** zuletzt Gemachtes ruht so viele Tage, bevor es wieder als Idee kommt */
const REST_DAYS = 14
/** eine Idee nimmt je eine Tapa aus diesen Gruppen (in dieser Reihenfolge) */
export const IDEA_SLOTS: Exclude<TapasGroup, 'sauce'>[] = ['fisch', 'fleisch', 'gemuese', 'ei', 'brot']

/** alle Tapas (ohne die Saucen, die sind Grundrezepte) */
export const tapasRecipes = (): Recipe[] => BASICS.filter(isTapa)
/** Tapas-Bereich im Rezepte-Tab: Tapas und Tapas-Grundsaucen (Alioli …), optional nur eine Gruppe */
export const tapasSection = (group?: TapasGroup): Recipe[] => BASICS.filter((r) => (isTapa(r) || r.tapas === 'sauce') && (!group || r.tapas === group))

/** kurzer Titel ohne deutsche Erklärung: „Gambas al ajillo (Knoblauchgarnelen …)“ → „Gambas al ajillo“ */
export const shortTitle = (title: string): string => title.replace(/\s*\([^)]*\)\s*$/, '')

/** Tapas eines Tages als Rezepte (ohne „nicht gemacht“) */
export const tapasOn = (bp: BakePlan, day: string): Recipe[] => tapasEntries(bp, day).map((e) => RECIPE_BY_ID[e.recipeId]).filter(Boolean)

/** kcal je Person für einen Abend aus diesen Tapas (jede Tapa mit dem Faktor für ihre Anzahl) */
export function eveningKcal(recipes: Recipe[]): number {
  const f = tapasFactorFor(recipes.length)
  return Math.round(recipes.reduce((s, r) => s + r.nutrition.kcal * f, 0))
}

/** Eiweiß je Person für den Abend */
export function eveningProtein(recipes: Recipe[]): number {
  const f = tapasFactorFor(recipes.length)
  return Math.round(recipes.reduce((s, r) => s + r.nutrition.protein * f, 0))
}

/**
 * Tapas-Abend einplanen: die gewählten Tapas (jede einmal) auf den Tag legen. Noch offene Tapas, die vorher für den Tag
 * geplant waren und nicht mehr gewählt sind, fallen weg (die neue Auswahl IST der Abend); schon gemachte bleiben.
 * `replaceDinner`: das offene Abendessen des Tages wird gestrichen (`dropped` für den Hinweis „statt …“).
 */
export function planTapasEvening(
  s: { plan: WeekPlan; bakePlan: BakePlan },
  day: string,
  ids: string[],
  replaceDinner = true,
): { plan: WeekPlan; bakePlan: BakePlan; dropped?: PlanEntry } {
  const pick = [...new Set(ids)].filter((id) => isTapa(RECIPE_BY_ID[id])).slice(0, TAPAS_MAX)
  let bp: BakePlan = { ...s.bakePlan }
  const keep = bakesOn(bp, day).filter((e) => !isTapa(RECIPE_BY_ID[e.recipeId]) || e.status || pick.includes(e.recipeId))
  if (keep.length) bp[day] = keep
  else delete bp[day]
  for (const id of pick) if (!bakesOn(bp, day).some((e) => e.recipeId === id && e.status)) bp = addBake(bp, day, id, 1)
  const dropped = replaceDinner && pick.length ? dinnerToReplace(s.plan, day) : undefined
  const plan = { ...s.plan }
  if (dropped) delete plan[day]
  return { plan, bakePlan: bp, dropped }
}

/** Tapas-Abend ganz entfernen (alle noch offenen Tapas des Tages) */
export function removeTapasEvening(bp: BakePlan, day: string): BakePlan {
  const keep = bakesOn(bp, day).filter((e) => !isTapa(RECIPE_BY_ID[e.recipeId]) || e.status)
  const next = { ...bp }
  if (keep.length) next[day] = keep
  else delete next[day]
  return next
}

/** Tapas-Abend verschieben: alle offenen Tapas des Tages auf einen anderen Tag (dort vorhandene offene Tapas werden ersetzt) */
export function moveTapasEvening(
  s: { plan: WeekPlan; bakePlan: BakePlan },
  from: string,
  to: string,
  replaceDinner = true,
): { plan: WeekPlan; bakePlan: BakePlan; dropped?: PlanEntry } {
  if (from === to) return { plan: s.plan, bakePlan: s.bakePlan }
  const ids = bakesOn(s.bakePlan, from).filter((e) => isTapa(RECIPE_BY_ID[e.recipeId]) && !e.status).map((e) => e.recipeId)
  if (!ids.length) return { plan: s.plan, bakePlan: s.bakePlan }
  // wie beim Einplanen: der Tapas-Abend ist das Abendessen → das offene Abendessen des Zieltags wird gestrichen
  return planTapasEvening({ plan: s.plan, bakePlan: removeTapasEvening(s.bakePlan, from) }, to, ids, replaceDinner)
}

/**
 * „Fertig“ einer Tapa: ihr Anteil am Abend zählt in die Tagesbilanz (kcal je Person × Faktor des Abends) –
 * wie ein Abendessen, das man Stück für Stück isst. Auch fürs Lernen („gegessen“).
 */
export function tapasMeal(recipe: Recipe, day: string, factor: number): Snack | null {
  if (!isTapa(recipe) || !(recipe.nutrition.kcal > 0)) return null
  return { date: day, name: recipe.title, kcal: Math.round(recipe.nutrition.kcal * factor), protein: Math.round(recipe.nutrition.protein * factor * 10) / 10, recipeId: recipe.id }
}

// ───────────── Ablaufplan im Kochmodus „Tapas-Abend“ ─────────────

export type TimelinePhase = 'vorher' | TapasServe
export const PHASE_LABEL: Record<TimelinePhase, string> = {
  vorher: 'Vorher erledigen',
  kalt: 'Zuerst: kalte Tapas anrichten',
  lauwarm: 'Dann: was lauwarm sein darf',
  heiss: 'Ganz zuletzt: heiß servieren',
}
export const PHASE_HINT: Record<TimelinePhase, string> = {
  vorher: 'am Vortag oder am Nachmittag – Saucen, Marinaden, Vorkochen',
  kalt: 'wartet abgedeckt im Kühlschrank',
  lauwarm: 'schmeckt lauwarm am besten – rechtzeitig fertig machen',
  heiss: 'direkt vor dem Essen, die kürzeste kommt als Letztes',
}

export interface TimelineItem {
  recipe: Recipe
  text: string
}

/**
 * Gemeinsamer Ablaufplan über alle Tapas des Abends: Vorher (Saucen wie Alioli, Marinaden, Vorkochen) → kalte Tapas →
 * lauwarme (Tortilla) → heiße (Gambas zuletzt, die längste zuerst). Saucen-Grundrezepte nur, wenn sie nicht im Vorrat liegen.
 */
export function tapasTimeline(recipes: Recipe[], pantry: PantryLot[] = [], today = ''): { phase: TimelinePhase; items: TimelineItem[] }[] {
  const out: { phase: TimelinePhase; items: TimelineItem[] }[] = []
  const before: TimelineItem[] = []
  const sauces = new Map<string, Recipe>()
  for (const r of recipes) {
    if (r.ahead) before.push({ recipe: r, text: r.ahead })
    for (const i of r.ingredients) {
      const b = basicFor(i.name)
      if (!b || b.tapas !== 'sauce' || sauces.has(b.id)) continue
      const inStock = pantry.some((l) => l.amount > 1e-6 && (!today || l.expires >= today) && l.name === b.yields?.name)
      if (!inStock) sauces.set(b.id, b)
    }
  }
  for (const b of sauces.values()) before.unshift({ recipe: b, text: `${shortTitle(b.title)} selbst machen (hält ${b.yields?.shelf ?? 3} Tage im Kühlschrank) – oder fertig aus dem Glas` })
  if (before.length) out.push({ phase: 'vorher', items: before })
  for (const phase of ['kalt', 'lauwarm', 'heiss'] as const) {
    const list = recipes.filter((r) => (r.serve ?? 'heiss') === phase).sort((a, b) => b.time - a.time || a.id.localeCompare(b.id))
    if (list.length) out.push({ phase, items: list.map((r) => ({ recipe: r, text: `ca. ${r.time} Min.` })) })
  }
  return out
}

// ───────────── Lernen: Lieblinge, Kombinationen, Ideen ─────────────

export interface TapasInput {
  today: string
  baked: BakedRef[]
  bakeRatings: Record<string, 'up' | 'again' | 'down'>
  bakePlan: BakePlan
  pantry?: PantryLot[]
  /** gelernte Vorliebe (Geschmacksmodell, Haushalt) – optional, sortiert mit */
  pref?: (r: Recipe) => number
}

const RATING_BOOST: Record<'up' | 'again' | 'down', number> = { again: 1, up: 0.5, down: -1.5 }
const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)

/**
 * Kombinationen: Tapas, die am selben Abend gemacht wurden, „passen zusammen“ (jünger zählt mehr); gute Bewertungen an dem
 * Abend heben, „nicht so“ senkt. Schlüssel „a|b“ (alphabetisch).
 */
export function tapasPairs(inp: Pick<TapasInput, 'baked' | 'bakeRatings' | 'today'>): Map<string, number> {
  const byDay = new Map<string, string[]>()
  for (const b of inp.baked) if (isTapa(RECIPE_BY_ID[b.recipeId])) byDay.set(b.date, [...new Set([...(byDay.get(b.date) ?? []), b.recipeId])])
  const out = new Map<string, number>()
  for (const [date, ids] of byDay) {
    if (ids.length < 2) continue
    const rate = (id: string) => RATING_BOOST[inp.bakeRatings[`${date}:${id}`] as 'up'] ?? 0
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++) {
        const k = pairKey(ids[i], ids[j])
        out.set(k, (out.get(k) ?? 0) + decay(date, inp.today) * (1 + (rate(ids[i]) + rate(ids[j])) / 2))
      }
  }
  return out
}

/** Lieblings-Tapas: gemacht und gut bewertet (höchstens 3) */
export function tapasFavorites(inp: Pick<TapasInput, 'baked' | 'bakeRatings' | 'today'>): Recipe[] {
  const sc = recipeScores(inp, 'tapas')
  return [...sc]
    .filter(([, v]) => !v.down && v.score >= 1)
    .sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([id]) => RECIPE_BY_ID[id])
    .filter(Boolean)
}

/** wie viele Zutaten einer Tapa schon im Vorrat liegen (ohne Gewürze/„nach Bedarf“) */
export function pantryHits(r: Recipe, pantry: PantryLot[], today: string): string[] {
  const have = [...new Set(pantry.filter((l) => l.amount > 1e-6 && l.expires >= today).map((l) => l.name))]
  return r.ingredients
    .filter((i) => i.amount != null && !SPICES.has(i.name) && !['Salz', 'Olivenöl', 'Sonnenblumenöl', 'Knoblauch'].includes(i.name))
    .filter((i) => have.some((n) => interchangeable(canonical(i.name), n)))
    .map((i) => i.name)
}

export interface TapasIdea {
  /** „Eure Lieblinge“, „Mal was Neues“, „Bunt gemischt“ */
  label: string
  /** kurze Begründung: Gruppen, Lieblinge, Vorrat */
  reason: string
  recipes: Recipe[]
  /** kcal je Person für den ganzen Abend */
  kcal: number
}

/**
 * „Tapas-Abend-Ideen“ (höchstens 2): je eine Tapa aus Fisch, Fleisch, Gemüse, Ei/Kartoffel und Brot/Dip (fehlt eine Gruppe,
 * füllt die beste übrige auf mindestens 4 auf). Wertung = gemacht/bewertet + Geschmacksmodell + Vorrat (+0,4 je Zutat, höchstens
 * +1,2) + Kombinationen mit den schon gewählten; zuletzt Gemachtes (< 14 Tage) ruht, „nicht so“ nie. Die zweite Idee bevorzugt
 * noch nie Gemachtes (Abwechslung) und unterscheidet sich in mindestens 2 Tapas.
 */
export function tapasIdeas(inp: TapasInput): TapasIdea[] {
  const sc = recipeScores(inp, 'tapas')
  const pairs = tapasPairs(inp)
  const pantry = inp.pantry ?? []
  const pool = tapasRecipes()
    .filter((r) => !sc.get(r.id)?.down && !(sc.get(r.id)?.last && daysBetween(sc.get(r.id)!.last!, inp.today) < REST_DAYS))
    .map((r) => {
      const hits = pantryHits(r, pantry, inp.today)
      return { r, hits, s: (sc.get(r.id)?.score ?? 0) + (inp.pref?.(r) ?? 0) / 3 + Math.min(1.2, 0.4 * hits.length) }
    })
  const known = (r: Recipe) => sc.has(r.id)
  const build = (fresh: boolean): typeof pool => {
    const chosen: typeof pool = []
    const value = (x: (typeof pool)[number]) =>
      x.s + (fresh && !known(x.r) ? 1.5 : 0) + chosen.reduce((s, c) => s + (pairs.get(pairKey(x.r.id, c.r.id)) ?? 0), 0)
    const best = (list: typeof pool) => [...list].sort((a, b) => value(b) - value(a) || a.r.id.localeCompare(b.r.id))[0]
    for (const g of IDEA_SLOTS) {
      const b = best(pool.filter((x) => x.r.tapas === g && !chosen.includes(x)))
      if (b) chosen.push(b)
    }
    while (chosen.length < 4) {
      const b = best(pool.filter((x) => !chosen.includes(x)))
      if (!b) break
      chosen.push(b)
    }
    return chosen
  }
  const describe = (list: typeof pool, label: string): TapasIdea => {
    const groups = list.map((x) => TAPAS_GROUP_LABEL[x.r.tapas!]).join(' · ')
    const fav = list.filter((x) => (sc.get(x.r.id)?.score ?? 0) >= 1).map((x) => shortTitle(x.r.title))
    const stock = [...new Set(list.flatMap((x) => x.hits))]
    const parts = [groups, ...(fav.length ? [`❤️ ${fav.join(', ')}`] : []), ...(stock.length ? [`🧺 aus dem Vorrat: ${stock.slice(0, 3).join(', ')}`] : [])]
    const recipes = list.map((x) => x.r)
    return { label, reason: parts.join(' — '), recipes, kcal: eveningKcal(recipes) }
  }
  const out: TapasIdea[] = []
  const a = build(false)
  if (a.length >= TAPAS_MIN) out.push(describe(a, a.some((x) => known(x.r)) ? 'Eure Lieblinge' : 'Bunt gemischt'))
  const b = build(true)
  const diff = b.filter((x) => !a.includes(x)).length
  if (b.length >= TAPAS_MIN && diff >= 2) out.push(describe(b, 'Mal was Neues'))
  return out
}
