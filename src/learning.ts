/**
 * Lernende Vorlieben.
 *
 * Signale (mit Zeitverfall, Halbwertszeit 60 Tage):
 *   geplant/gewählt  +1      weggewischt   −0,4      selbst angelegtes Rezept +1
 *   gekocht          +0,8    nicht gekocht −1
 *   Bewertung 👍 +2 · 🔁 „bald wieder“ +2,5 · 👎 −3
 *   Gerichte einer Woche, die eine weggeworfene Zutat brauchen −0,3 (höchstens 1× pro Tag)
 *
 * Gelernt wird pro Gericht UND pro Muster (Küche, Gerichtart, Hauptzutat, schnell/aufwendig an Werktagen
 * bzw. am Wochenende, Frühstückstyp). So bekommen auch nie gesehene Gerichte einen passenden Platz.
 */
import { CATALOG } from './data/catalog'
import { RECIPE_BY_ID } from './data/recipes'
import { gramsOf } from './data/nutrition-calc'
import { isWorkday } from './energy'
import { type WastedItem, canonical, daysUntil, needsOf } from './kitchen'
import { isoDate, mondayOf, parseIso } from './store'
import { BREAKFAST_LABEL, CUISINE_LABEL, TYPE_LABEL, type Recipe, type WeekPlan } from './types'

export type Rating = 'up' | 'again' | 'down'

export interface RejectEvent {
  id: string
  date: string
}

const HALF_LIFE = 60
const W = { waste: -0.3, take: 1, reject: -0.4, cooked: 0.8, skipped: -1, up: 2, again: 2.5, down: -3 }
/** Glättung: so viele „neutrale“ Beobachtungen werden angenommen, bevor etwas als Vorliebe gilt */
const PRIOR_RECIPE = 2
const PRIOR_FEATURE = 4

// ───────────── Merkmale ─────────────

const PROTEIN_RULES: [RegExp, string][] = [
  [/hack/i, 'Hackfleisch'],
  [/lachs|kabeljau|seelachs|dorade|scholle|matjes|rollmops|garnel|krabben|muschel|thunfisch|sardell/i, 'Fisch'],
  [/hähnchen|huhn|ente|gans|gänse/i, 'Geflügel'],
  [/rind|tafelspitz|rumpsteak|suppenfleisch|corned/i, 'Rind'],
  [/kalb/i, 'Kalb'],
  [/lamm/i, 'Lamm'],
  [/gyros/i, 'Schwein'],
  [/wurst|würstchen|mettend|cabanossi|salami|salsiccia|leberkäse|pinkel|bockwurst/i, 'Wurst'],
  [/schwein|kasseler|speck|bacon|schinken|guanciale|pancetta|bauch|haxe/i, 'Schwein'],
]

/** Hauptzutat eines Gerichts (größte Fleisch-/Fischmenge), sonst „vegetarisch“ */
export function mainProtein(r: Recipe): string {
  let best = ''
  let bestG = 0
  for (const i of r.ingredients) {
    if (CATALOG[i.name] !== 'fleisch' && !/Garnelen|Thunfisch|Sardellen|Corned/.test(i.name)) continue
    const g = i.amount != null ? gramsOf(i.name, i.amount, i.unit) ?? 50 : 20
    if (g > bestG) {
      bestG = g
      best = i.name
    }
  }
  if (!best) return 'vegetarisch'
  return PROTEIN_RULES.find(([re]) => re.test(best))?.[1] ?? 'Fleisch'
}

const quick = (r: Recipe) => r.time <= 35

/** Merkmale eines Gerichts; `day` bestimmt Werktag/Wochenende für das Zeit-Muster */
export function features(r: Recipe, day?: string): string[] {
  if (r.breakfast) return [`bf:${r.breakfast.type}`, `protein:${mainProtein(r)}`]
  const f = [`cuisine:${r.cuisine}`, `type:${r.type}`, `protein:${mainProtein(r)}`]
  if (day) f.push(`speed:${quick(r) ? 'schnell' : 'aufwendig'}@${isWorkday(day) ? 'werktag' : 'wochenende'}`)
  return f
}

/** lesbare Bezeichnung eines Merkmals */
export function featureLabel(key: string): string {
  const [kind, value] = key.split(':')
  if (kind === 'cuisine') return `${CUISINE_LABEL[value as keyof typeof CUISINE_LABEL]}e Küche`
  if (kind === 'type') return TYPE_LABEL[value as keyof typeof TYPE_LABEL]
  if (kind === 'protein') return value === 'vegetarisch' ? 'Vegetarisches' : `Gerichte mit ${value}`
  if (kind === 'bf') return `Frühstück ${BREAKFAST_LABEL[value as keyof typeof BREAKFAST_LABEL]}`
  if (kind === 'speed') {
    const [s, when] = value.split('@')
    return `${s === 'schnell' ? 'Schnelle' : 'Aufwendige'} Gerichte ${when === 'werktag' ? 'Mo–Fr' : 'am Wochenende'}`
  }
  return key
}

// ───────────── Modell ─────────────

interface Acc {
  sum: number
  n: number
}

export interface TasteModel {
  recipe: Map<string, Acc>
  feature: Map<string, Acc>
  /** Anzahl berücksichtigter Signale */
  signals: number
}

export interface TasteInput {
  plan: WeekPlan
  breakfast: WeekPlan
  breakfastPicks: Record<string, string[]>
  rejects: RejectEvent[]
  ratings: Record<string, Rating>
  today: string
  /** weggeworfene Vorräte: leichtes Minus für Gerichte derselben Woche, die die Zutat brauchen */
  wasted?: WastedItem[]
  /** Signale vor diesem Datum ignorieren (nach „Zurücksetzen“) */
  since?: string
  /** selbst angelegte Rezepte: Anlegen zählt einmal wie „genommen“ (+1) */
  customRecipes?: { id: string; created: string }[]
}

export function buildModel(inp: TasteInput): TasteModel {
  const m: TasteModel = { recipe: new Map(), feature: new Map(), signals: 0 }
  const add = (id: string, date: string, w: number, day?: string) => {
    const r = RECIPE_BY_ID[id]
    if (!r || (inp.since && date < inp.since)) return
    const age = Math.max(0, -daysUntil(date, inp.today))
    const decay = Math.pow(0.5, age / HALF_LIFE)
    const v = w * decay
    const bump = (map: Map<string, Acc>, key: string) => {
      const a = map.get(key) ?? { sum: 0, n: 0 }
      a.sum += v
      a.n += decay
      map.set(key, a)
    }
    bump(m.recipe, id)
    for (const f of features(r, day)) bump(m.feature, f)
    m.signals++
  }

  // Abendessen: geplant, gekocht / nicht gekocht, Bewertung
  for (const [day, e] of Object.entries(inp.plan)) {
    if (!e) continue
    add(e.recipeId, day, W.take, day)
    if (e.status === 'cooked') add(e.recipeId, day, W.cooked, day)
    if (e.status === 'skipped') add(e.recipeId, day, W.skipped, day)
    const rating = inp.ratings[day]
    if (rating) add(e.recipeId, day, W[rating], day)
  }
  // Frühstück: pro Woche gewählt (nicht 5× pro Tag zählen)
  for (const [week, ids] of Object.entries(inp.breakfastPicks)) for (const id of ids ?? []) add(id, week, W.take)
  // Selbst angelegt: ein eigenes Rezept zeigt, was man gern isst
  for (const c of inp.customRecipes ?? []) add(c.id, c.created, W.take)
  // Weggewischt
  for (const r of inp.rejects) add(r.id, r.date, W.reject)
  // Weggeworfen: Gerichte derselben Woche, die die Zutat brauchen, leicht abwerten
  const hit = new Set<string>()
  for (const w of inp.wasted ?? []) {
    const monday = mondayOf(parseIso(w.date))
    const name = canonical(w.name)
    for (let i = 0; i < 7; i++) {
      const day = isoDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i))
      for (const [kind, p] of [['d', inp.plan], ['b', inp.breakfast]] as const) {
        const e = p[day]
        const r = e && e.status !== 'skipped' ? RECIPE_BY_ID[e.recipeId] : undefined
        if (!e || !r || hit.has(kind + day)) continue
        if (needsOf(r, e.servings).some((n) => n.name === name)) {
          hit.add(kind + day)
          add(e.recipeId, w.date, W.waste, kind === 'd' ? day : undefined)
        }
      }
    }
  }
  return m
}

const aff = (a: Acc | undefined, prior: number) => (a ? a.sum / (a.n + prior) : 0)

export interface Preference {
  /** Beitrag zur Sortierung */
  score: number
  /** kurze Begründung für die Karte (nur bei deutlicher Vorliebe) */
  reason?: string
}

/** Vorliebe für ein Gericht – `day` ist der Tag, für den gewischt wird */
export function preference(m: TasteModel, r: Recipe, day?: string): Preference {
  const ar = aff(m.recipe.get(r.id), PRIOR_RECIPE)
  const fs = features(r, day).map((f) => ({ f, a: aff(m.feature.get(f), PRIOR_FEATURE) }))
  const fMean = fs.length ? fs.reduce((s, x) => s + x.a, 0) / fs.length : 0
  const raw = ar + 0.8 * fMean
  // „mittel“: etwa so stark wie Vorrat und Preis zusammen
  const score = Math.max(-2, Math.min(2, raw)) * 3
  let reason: string | undefined
  if (ar > 0.45) reason = '❤️ magst du'
  else {
    const best = fs.filter((x) => x.a > 0.3).sort((a, b) => b.a - a.a)[0]
    if (best) reason = `👍 ${featureLabel(best.f)} magst du`
  }
  return { score, reason }
}

export interface LearnedSummary {
  liked: { label: string; a: number }[]
  disliked: { label: string; a: number }[]
  favorites: { title: string; a: number }[]
  signals: number
}

/** Übersicht „Das habe ich gelernt“ */
export function summarize(m: TasteModel): LearnedSummary {
  const feats = [...m.feature].filter(([, a]) => a.n >= 1.5).map(([k, a]) => ({ label: featureLabel(k), a: aff(a, PRIOR_FEATURE) }))
  return {
    liked: feats.filter((x) => x.a > 0.2).sort((a, b) => b.a - a.a).slice(0, 5),
    disliked: feats.filter((x) => x.a < -0.1).sort((a, b) => a.a - b.a).slice(0, 4),
    favorites: [...m.recipe]
      .map(([id, a]) => ({ title: RECIPE_BY_ID[id]?.title ?? id, a: aff(a, PRIOR_RECIPE) }))
      .filter((x) => x.a > 0.4)
      .sort((a, b) => b.a - a.a)
      .slice(0, 5),
    signals: m.signals,
  }
}

/** Abendessen, das gestern oder vorgestern gekocht und noch nicht bewertet wurde */
export function pendingRating(plan: WeekPlan, ratings: Record<string, Rating>, today: string, dismissed: string[]): string | undefined {
  return Object.keys(plan)
    .filter((d) => d < today && daysUntil(d, today) >= -2 && plan[d]?.status === 'cooked' && !ratings[d] && !dismissed.includes(d))
    .sort()
    .pop()
}
