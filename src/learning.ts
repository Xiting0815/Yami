/**
 * Lernende Vorlieben.
 *
 * Signale (mit Zeitverfall, Halbwertszeit 60 Tage):
 *   geplant/gewählt  +1      weggewischt   −0,4      selbst angelegtes Rezept +1
 *   gekocht          +0,8    nicht gekocht −1
 *   Bewertung 👍 +2 · 🔁 „bald wieder“ +2,5 · 👎 −3
 *   Gerichte einer Woche, die eine weggeworfene Zutat brauchen −0,3 (höchstens 1× pro Tag)
 *   Backen & Desserts: gebacken +0,8 · ein Stück gegessen +0,3 · Bewertung wie oben
 *   BBQ: eingeplant +1 · gegrillt +0,8 · Portion gegessen +0,3 · Bewertung wie oben (Muster „bbq:smoker“, „bbqprotein:Schwein“)
 *   Tapas: eingeplant (Tapas-Abend) +1 · gemacht +0,8 · gegessen +0,3 · Bewertung je Tapa (Muster „tapas:fisch“, „tapasprotein:Fisch“);
 *     Kombinationen und „Tapas-Abend-Ideen“ siehe src/tapas.ts
 *   Salate & Beilagen: eingeplant +1 · gemacht +0,8 · Portion gegessen +0,3 · Bewertung (Muster „salat:nudel“)
 *   Frühstück: pro Woche gewählt +1 · fertig vorbereitet +0,8 · Bewertung nach dem Vorbereiten wie oben ·
 *   Sättigung „bis mittags satt?“ zu wenig −0,6 · passt +0,3 · zu viel −0,2 (dazu Sättigungs-Neigung, siehe unten)
 *   (eigenes Muster „bake:kuchen“ usw. – Abendessen-Muster wie Küche oder Hauptzutat bleiben davon unberührt)
 *
 * Gelernt wird pro Gericht UND pro Muster (Küche, Gerichtart, Hauptzutat, schnell/aufwendig an Werktagen
 * bzw. am Wochenende, Frühstückstyp). So bekommen auch nie gesehene Gerichte einen passenden Platz.
 *
 * Verschieben/Tauschen (Woche „↔ Verschieben“) ist KEIN negatives Signal – das Gericht wurde ja gewählt. Gelernt wird nur:
 *   der neue Tag zählt fürs Zeit-Muster (aufwendig → Wochenende geschoben lehrt „aufwendig am Wochenende“), und wer
 *   dasselbe Gericht innerhalb von 14 Tagen MEHRMALS nach hinten schiebt, hat wohl wenig Lust darauf: ab dem 2. Mal je −0,2.
 * Bewertung und Portions-Rückmeldung gehören zum GERICHT: Schlüssel `Tag:Rezept-Id` (ältere Stände nur `Tag` → beim Laden
 *   dem dort geplanten Gericht zugeordnet, siehe `rekeyDish`). So ordnen Tauschen und Familien-Abgleich nichts falsch zu.
 *
 * Ruheabstand (`restOf`): Wie lange ein Gericht nach dem Planen bzw. nach dem Wegwischen hinten bleibt, ist gelernt –
 *   je Gericht und je Muster: oft weggewischt / 👎 → länger, 🔁 „bald wieder“ / 👍 → kürzer (Abwechslung bleibt:
 *   mindestens 10 Tage). Startwerte 21 Tage nach dem Planen, 10 Tage nach dem Wegwischen.
 *
 * Süße Hauptgerichte (Kaiserschmarrn, Kartoffelpuffer mit Apfelmus … – `isSweetMain`) starten leicht hinten (eigenes
 *   Muster „style:suess“); sobald sie gewählt/gut bewertet werden, fällt der Abzug weg.
 *
 * Kein Geschmack, aber auch gelernt: „Vergessen zu kaufen“ beim Löschen im Vorrat → „⚠️ oft vergessen“ (src/forgot.ts),
 * „Aufgebraucht“ bei Grundzutaten → Verbrauch (removalUseEvents in src/staples.ts).
 */
import { CATALOG } from './data/catalog'
import { RECIPE_BY_ID } from './data/recipes'
import { interchangeable } from './data/substitutes'
import { gramsOf } from './data/nutrition-calc'
import { type WastedItem, canonical, daysUntil, needsOf } from './kitchen'
import { isWorkday, isoDate, mondayOf, parseIso } from './store'
import { BBQ_GROUP_LABEL, BREAKFAST_LABEL, CUISINE_LABEL, KIND_LABEL, SALAT_GROUP_LABEL, TAPAS_GROUP_LABEL, TYPE_LABEL, type BakePlan, type BasicKind, type BbqGroup, type Recipe, type SalatGroup, type TapasGroup, type WeekPlan } from './types'

export type Rating = 'up' | 'again' | 'down'

export interface RejectEvent {
  id: string
  date: string
}

/** Abendessen von Hand verschoben/getauscht (nur das aktiv verschobene Gericht) */
export interface MoveEvent {
  /** wann verschoben (ISO) */
  date: string
  recipeId: string
  from: string
  to: string
}
export const MOVES_MAX = 100

// ───────────── Bewertung/Portion je Gericht ─────────────

/** Schlüssel für Bewertung/Portion eines Abendessens: `Tag:Rezept-Id` */
export const dishKey = (day: string, recipeId: string) => `${day}:${recipeId}`
/** Tag eines Schlüssels (`Tag` oder `Tag:Rezept-Id`) */
export const keyDay = (key: string) => key.slice(0, 10)
/** Rezept eines Schlüssels; ältere Schlüssel (nur `Tag`) → undefined */
export const keyRecipe = (key: string) => (key.length > 11 && key[10] === ':' ? key.slice(11) : undefined)

/** Wert für das Gericht `recipeId` am Tag (fällt auf einen älteren Schlüssel nur mit Tag zurück) */
export function dishValue<T>(map: Record<string, T> | undefined, day: string, recipeId: string | undefined): T | undefined {
  if (!map) return undefined
  if (recipeId) {
    const v = map[dishKey(day, recipeId)]
    if (v !== undefined) return v
  }
  return map[day]
}

/** Wert für das Gericht setzen (`undefined` löscht); ein älterer Schlüssel nur mit Tag fällt dabei weg */
export function setDishValue<T>(map: Record<string, T>, day: string, recipeId: string, v: T | undefined): Record<string, T> {
  const out = { ...map }
  delete out[day]
  if (v === undefined) delete out[dishKey(day, recipeId)]
  else out[dishKey(day, recipeId)] = v
  return out
}

/** Bewertung/Portion des Gerichts `recipeId` vom Tag entfernen (auch der ältere Schlüssel nur mit Tag) */
export function dropDish<T>(map: Record<string, T>, day: string, recipeId: string): Record<string, T> {
  if (!(day in map) && !(dishKey(day, recipeId) in map)) return map
  const out = { ...map }
  delete out[day]
  delete out[dishKey(day, recipeId)]
  return out
}

/** Gericht wandert von `from` nach `to`: seine Bewertung/Portion wandert mit */
export function moveDish<T>(map: Record<string, T>, from: string, to: string, recipeId: string): Record<string, T> {
  const v = dishValue(map, from, recipeId)
  const out = dropDish(map, from, recipeId)
  if (v === undefined) return out
  return { ...dropDish(out, to, recipeId), [dishKey(to, recipeId)]: v }
}

/** Migration: ältere Schlüssel nur mit Tag dem dort geplanten Gericht zuordnen (ohne Eintrag bleiben sie, wie sie sind) */
export function rekeyDish<T>(map: Record<string, T>, plan: WeekPlan): Record<string, T> {
  let out: Record<string, T> | undefined
  for (const [k, v] of Object.entries(map)) {
    if (k.length !== 10) continue
    const id = plan[k]?.recipeId
    if (!id) continue
    out ??= { ...map }
    delete out[k]
    if (!(dishKey(k, id) in out)) out[dishKey(k, id)] = v
  }
  return out ?? map
}

/** so viele Wegwisch-Signale werden gespeichert */
export const REJECTS_MAX = 400

/**
 * Wegwischen merken – dasselbe Gericht zählt höchstens einmal pro Tag (wer den Stapel mehrmals durchwischt,
 * soll ein Gericht nicht drei- oder viermal abwerten; bei wenigen Frühstücken passiert das schnell).
 */
export function addReject(rejects: RejectEvent[], id: string, date: string): RejectEvent[] {
  if (rejects.some((r) => r.id === id && r.date === date)) return rejects
  return [...rejects, { id, date }].slice(-REJECTS_MAX)
}

const HALF_LIFE = 60
const W = { waste: -0.3, take: 1, reject: -0.4, cooked: 0.8, skipped: -1, up: 2, again: 2.5, down: -3, eaten: 0.3, postponed: -0.2 }
/** „mehrmals nach hinten geschoben“: zählt, wenn dasselbe Gericht innerhalb so vieler Tage schon einmal nach hinten kam */
const POSTPONE_WINDOW = 14
/** Frühstück: Sättigung „bis mittags satt?“ (−1 zu wenig · 0 passt · 1 zu viel) als Signal fürs Rezept */
const W_SATIETY: Record<PortionFeedback, number> = { [-1]: -0.6, 0: 0.3, 1: -0.2 }
/** Glättung: so viele „neutrale“ Beobachtungen werden angenommen, bevor etwas als Vorliebe gilt */
const PRIOR_RECIPE = 2
const PRIOR_FEATURE = 4

// ───────────── Merkmale ─────────────

const PROTEIN_RULES: [RegExp, string][] = [
  [/hack/i, 'Hackfleisch'],
  [/lachs|kabeljau|seelachs|dorade|scholle|matjes|rollmops|garnel|krabben|muschel|thunfisch|sardell|pulpo|tintenfisch|sepia|calamar|bacalao|seehecht|boquer|sardin/i, 'Fisch'],
  [/kaninchen/i, 'Kaninchen'],
  [/hähnchen|huhn|ente|gans|gänse/i, 'Geflügel'],
  [/rind|tafelspitz|rumpsteak|suppenfleisch|corned|ochs|roastbeef/i, 'Rind'],
  [/kalb/i, 'Kalb'],
  [/lamm/i, 'Lamm'],
  [/gyros/i, 'Schwein'],
  [/wurst|würstchen|mettend|cabanossi|salami|salsiccia|leberkäse|pinkel|bockwurst|chorizo|morcilla|sobrasada|fuet/i, 'Wurst'],
  [/schwein|kasseler|speck|bacon|schinken|guanciale|pancetta|bauch|haxe|schäufele|jamón|lomo/i, 'Schwein'],
]

/** Hauptzutat eines Gerichts (größte Fleisch-/Fischmenge), sonst „vegetarisch“ */
export function mainProtein(r: Recipe): string {
  let best = ''
  let bestG = 0
  for (const i of r.ingredients) {
    if (CATALOG[i.name] !== 'fleisch' && !/Garnelen|Thunfisch|Sardellen|Corned|Tintenfisch/.test(i.name)) continue
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
  // Backen & Desserts / Grundrezepte: nur das eigene Muster (sonst würde Tiramisu „Italienisch“ für Abendessen hochziehen)
  // BBQ: eigenes Muster je Gruppe (Smoker, Grill …) und Hauptzutat – getrennt von den Abendessen-Mustern
  if (r.kind === 'bbq') return ['bake:bbq', ...(r.bbq ? [`bbq:${r.bbq}`] : []), `bbqprotein:${mainProtein(r)}`]
  // Tapas und Salate: eigene Muster je Gruppe (und Hauptzutat bei Tapas) – getrennt von den Abendessen-Mustern
  if (r.kind === 'tapas') return ['bake:tapas', ...(r.tapas ? [`tapas:${r.tapas}`] : []), `tapasprotein:${mainProtein(r)}`]
  if (r.kind === 'salat') return ['bake:salat', ...(r.salat ? [`salat:${r.salat}`] : [])]
  if (r.basic) return [`bake:${r.kind ?? 'grundrezept'}`]
  if (r.breakfast) return [`bf:${r.breakfast.type}`, `protein:${mainProtein(r)}`]
  const f = [`cuisine:${r.cuisine}`, `type:${r.type}`, `protein:${mainProtein(r)}`]
  if (isSweetMain(r)) f.push('style:suess')
  if (day) f.push(`speed:${quick(r) ? 'schnell' : 'aufwendig'}@${isWorkday(day) ? 'werktag' : 'wochenende'}`)
  return f
}

const SWEET_MARK = /^(Apfelmus|Puderzucker|Vanillezucker|Marmelade|Konfitüre|Pflaumenmus|Zwetschgenmus|Kompott|Rosinen|Vanillesoße|Vanillesauce|Zimtzucker)/i

/**
 * Süßes Hauptgericht (Kaiserschmarrn, Kartoffelpuffer mit Apfelmus, Dampfnudeln, Germknödel, Pfannkuchen mit Marmelade …):
 * Abendessen ohne Fleisch/Fisch mit typisch süßer Beigabe oder viel Zucker (ab 2 EL bzw. 25 g). Erkannt am Rezept –
 * gilt so auch für eigene Rezepte.
 */
export function isSweetMain(r: Recipe): boolean {
  if (r.basic || r.breakfast || !r.vegetarian) return false
  return r.ingredients.some((i) => {
    if (SWEET_MARK.test(i.name)) return true
    if (!/^Zucker$/i.test(i.name) || i.amount == null) return false
    return (i.unit === 'EL' && i.amount >= 2) || (i.unit === 'g' && i.amount >= 25)
  })
}

/** lesbare Bezeichnung eines Merkmals */
export function featureLabel(key: string): string {
  const [kind, value] = key.split(':')
  if (kind === 'cuisine') return `${CUISINE_LABEL[value as keyof typeof CUISINE_LABEL]}e Küche`
  if (kind === 'type') return TYPE_LABEL[value as keyof typeof TYPE_LABEL]
  if (kind === 'protein') return value === 'vegetarisch' ? 'Vegetarisches' : `Gerichte mit ${value}`
  if (kind === 'bake') return KIND_LABEL[value as BasicKind] ?? value
  if (kind === 'bbq') return `BBQ: ${BBQ_GROUP_LABEL[value as BbqGroup] ?? value}`
  if (kind === 'bbqprotein') return value === 'vegetarisch' ? 'BBQ vegetarisch' : `BBQ mit ${value}`
  if (kind === 'tapas') return `Tapas: ${TAPAS_GROUP_LABEL[value as TapasGroup] ?? value}`
  if (kind === 'tapasprotein') return value === 'vegetarisch' ? 'Vegetarische Tapas' : `Tapas mit ${value}`
  if (kind === 'salat') return SALAT_GROUP_LABEL[value as SalatGroup] ?? value
  if (kind === 'style') return 'Süße Hauptgerichte'
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
  /** positive Signale je Muster, nur aus Abendessen (für den Anteil gegenüber dem Grundanteil, siehe hintOk) */
  dinnerPos: Map<string, number>
  /** Anzahl berücksichtigter Signale */
  signals: number
  /** Ruheabstand: Signale je Gericht bzw. Muster (> 0 = länger ruhen lassen, < 0 = darf früher wieder), siehe restOf */
  rest: Map<string, Acc>
  restFeature: Map<string, Acc>
  /** zuletzt weggewischt (Gericht → Datum) */
  lastReject: Map<string, string>
}

/**
 * Hinweise „👍 … magst du“ und die Übersicht „Das habe ich gelernt“ erst bei genug Belegen (das Ranking lernt
 * trotzdem von Anfang an sanft mit): mindestens so viele (zeitgewichtete) Signale für das Muster …
 */
const HINT_MIN_N = 4
/**
 * … und bei Mustern mit bekanntem Grundanteil deutlich darüber: Vegetarisches isst der Haushalt ohnehin zu ~15 %.
 * Als Vorliebe gilt es erst, wenn mindestens doppelt so viel davon gewählt wird (Anteil an allen positiven
 * Abendessen-Signalen derselben Art, z. B. aller Hauptzutaten). Frühstück (meist vegetarisch) zählt dabei nicht mit.
 */
const BASE_SHARE: Record<string, number> = { 'protein:vegetarisch': 0.15 }
const BASE_FACTOR = 2

/** genug belegt, um als Vorliebe genannt zu werden? */
export function hintOk(m: TasteModel, f: string): boolean {
  const a = m.feature.get(f)
  if (!a || a.n < HINT_MIN_N) return false
  const base = BASE_SHARE[f]
  if (base === undefined) return true
  const kind = f.slice(0, f.indexOf(':') + 1)
  let all = 0
  for (const [k, v] of m.dinnerPos) if (k.startsWith(kind)) all += v
  const mine = m.dinnerPos.get(f) ?? 0
  return all > 0 && mine / all >= base * BASE_FACTOR
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
  /** Backen & Desserts: gebacken (+0,8) */
  baked?: { date: string; recipeId: string }[]
  /** Backen & Desserts: ein Stück gegessen (+0,3 je Stück) */
  snacks?: { date: string; recipeId?: string }[]
  /** Backen & Desserts: Bewertung, Schlüssel `Datum:Rezept-ID` */
  bakeRatings?: Record<string, Rating>
  /** Backplan: eingeplantes BBQ, Tapas und Salate zählen wie „geplant“ (+1), „nicht gemacht“ wie nicht gekocht (−1) */
  bakePlan?: BakePlan
  /** Frühstück: fertig vorbereitet (+0,8) */
  bfPrepped?: { date: string; recipeId: string }[]
  /** Frühstück: Bewertung nach dem Vorbereiten, Schlüssel `Prep-Tag:Rezept-Id` */
  bfRatings?: Record<string, Rating>
  /** Frühstück: „bis mittags satt?“, Schlüssel `Prep-Tag:Rezept-Id` */
  bfSatiety?: Record<string, PortionFeedback>
  /** Abendessen von Hand verschoben (mehrmals nach hinten → leichtes Minus) */
  moves?: MoveEvent[]
}

/** Ruheabstand-Signale (nur Abendessen): weggewischt verlängert, 🔁/👍 verkürzt; Kochen allein ändert nichts (sonst Dauerschleife) */
const REST_W = { reject: 1, down: 1.5, skipped: 0.5, up: -0.7, again: -1.5 }

export function buildModel(inp: TasteInput): TasteModel {
  const m: TasteModel = { recipe: new Map(), feature: new Map(), dinnerPos: new Map(), signals: 0, rest: new Map(), restFeature: new Map(), lastReject: new Map() }
  const decayOf = (date: string) => Math.pow(0.5, Math.max(0, -daysUntil(date, inp.today)) / HALF_LIFE)
  const bumpAcc = (map: Map<string, Acc>, key: string, v: number, n: number) => {
    const a = map.get(key) ?? { sum: 0, n: 0 }
    a.sum += v
    a.n += n
    map.set(key, a)
  }
  /** Ruheabstand: Gericht und seine Muster (ohne Zeit-Muster) */
  const addRest = (id: string, date: string, w: number) => {
    const r = RECIPE_BY_ID[id]
    if (!r || r.basic || r.breakfast || (inp.since && date < inp.since)) return
    const decay = decayOf(date)
    bumpAcc(m.rest, id, w * decay, decay)
    for (const f of features(r)) bumpAcc(m.restFeature, f, w * decay, decay)
  }
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
    const dinner = !r.breakfast && !r.basic
    for (const f of features(r, day)) {
      bump(m.feature, f)
      if (dinner && v > 0) m.dinnerPos.set(f, (m.dinnerPos.get(f) ?? 0) + v)
    }
    m.signals++
  }

  // Abendessen: geplant, gekocht / nicht gekocht
  for (const [day, e] of Object.entries(inp.plan)) {
    if (!e) continue
    add(e.recipeId, day, W.take, day)
    if (e.status === 'cooked') add(e.recipeId, day, W.cooked, day)
    if (e.status === 'skipped') {
      add(e.recipeId, day, W.skipped, day)
      addRest(e.recipeId, day, REST_W.skipped)
    }
  }
  // Bewertung gehört zum Gericht (`Tag:Rezept-Id`); ältere Schlüssel nur mit Tag → das dort geplante Gericht
  for (const [key, v] of Object.entries(inp.ratings)) {
    if (!(v in W)) continue
    const day = keyDay(key)
    const id = keyRecipe(key) ?? inp.plan[key]?.recipeId
    if (!id) continue
    add(id, day, W[v], day)
    addRest(id, day, REST_W[v])
  }
  // Mehrmals nach hinten geschoben: ab dem zweiten Mal innerhalb von 14 Tagen leicht abwerten (Verschieben an sich ist neutral)
  const back = (inp.moves ?? []).filter((x) => x.to > x.from).sort((a, b) => a.date.localeCompare(b.date))
  back.forEach((x, i) => {
    if (back.slice(0, i).some((y) => y.recipeId === x.recipeId && -daysUntil(y.date, x.date) <= POSTPONE_WINDOW)) add(x.recipeId, x.date, W.postponed, x.to)
  })
  // Frühstück: pro Woche gewählt (nicht 5× pro Tag zählen)
  for (const [week, ids] of Object.entries(inp.breakfastPicks)) for (const id of ids ?? []) add(id, week, W.take)
  // Selbst angelegt: ein eigenes Rezept zeigt, was man gern isst
  for (const c of inp.customRecipes ?? []) add(c.id, c.created, W.take)
  // Weggewischt (dazu: Ruheabstand verlängern, letztes Wegwischen merken)
  for (const r of inp.rejects) {
    add(r.id, r.date, W.reject)
    if (inp.since && r.date < inp.since) continue
    addRest(r.id, r.date, REST_W.reject)
    const cur = m.lastReject.get(r.id)
    if (!cur || r.date > cur) m.lastReject.set(r.id, r.date)
  }
  // Backen & Desserts: gebacken, gegessen, bewertet
  for (const b of inp.baked ?? []) add(b.recipeId, b.date, W.cooked)
  for (const s of inp.snacks ?? []) if (s.recipeId) add(s.recipeId, s.date, W.eaten)
  for (const [key, v] of Object.entries(inp.bakeRatings ?? {})) add(key.slice(11), key.slice(0, 10), W[v])
  // BBQ, Tapas-Abend, Salate: eingeplant (auch ohne Machen) zeigt Lust darauf; „nicht gemacht“ leicht abwerten
  const PLANNED: (BasicKind | undefined)[] = ['bbq', 'tapas', 'salat']
  for (const [day, list] of Object.entries(inp.bakePlan ?? {}))
    for (const e of list ?? []) if (PLANNED.includes(RECIPE_BY_ID[e.recipeId]?.kind)) add(e.recipeId, day, e.status === 'skipped' ? W.skipped : W.take)
  // Frühstück: vorbereitet, bewertet, satt gemacht?
  for (const p of inp.bfPrepped ?? []) add(p.recipeId, p.date, W.cooked)
  for (const [key, v] of Object.entries(inp.bfRatings ?? {})) add(key.slice(11), key.slice(0, 10), W[v])
  for (const [key, v] of Object.entries(inp.bfSatiety ?? {})) if (v in W_SATIETY) add(key.slice(11), key.slice(0, 10), W_SATIETY[v])
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
        if (needsOf(r, e.servings).some((n) => interchangeable(n.name, name))) {
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
  /** deutliche Vorliebe: fürs Gericht selbst ('recipe') oder für ein Muster ('feature') */
  liked?: 'recipe' | 'feature'
}

/** Startabzug süßer Hauptgerichte (Score-Punkte; zum Vergleich: Wiederholung in der Ruhezeit −12, Vorliebe ±6) */
export const SWEET_START = 4
/** ab dieser gelernten Zuneigung (Gericht + Muster „Süße Hauptgerichte“) ist der Startabzug ganz weg */
const SWEET_LIKED = 0.3

/** Vorliebe für ein Gericht – `day` ist der Tag, für den gewischt wird */
export function preference(m: TasteModel, r: Recipe, day?: string): Preference {
  const ar = aff(m.recipe.get(r.id), PRIOR_RECIPE)
  const fs = features(r, day).map((f) => ({ f, a: aff(m.feature.get(f), PRIOR_FEATURE) }))
  const fMean = fs.length ? fs.reduce((s, x) => s + x.a, 0) / fs.length : 0
  const raw = ar + 0.8 * fMean
  // „mittel“: etwa so stark wie Vorrat und Preis zusammen
  let score = Math.max(-2, Math.min(2, raw)) * 3
  // süßes Hauptgericht: startet leicht hinten – je mehr es (oder süße Hauptgerichte allgemein) gemocht wird, desto weniger
  if (isSweetMain(r)) {
    const liked = Math.max(0, ar) + Math.max(0, aff(m.feature.get('style:suess'), PRIOR_FEATURE))
    score -= SWEET_START * Math.max(0, 1 - liked / SWEET_LIKED)
  }
  let reason: string | undefined
  let liked: Preference['liked']
  if (ar > 0.45) {
    reason = '❤️ magst du'
    liked = 'recipe'
  } else {
    // Muster nur mit genug Belegen (und deutlich über dem Grundanteil) nennen – die Sortierung lernt trotzdem mit
    const best = fs.filter((x) => x.a > 0.3 && hintOk(m, x.f)).sort((a, b) => b.a - a.a)[0]
    if (best) {
      reason = `👍 ${featureLabel(best.f)} magst du`
      liked = 'feature'
    }
  }
  return { score, reason, liked }
}

/** Geschmack einer weiteren Person im Haushalt (Familien-Abgleich) */
export interface PersonModel {
  name: string
  model: TasteModel
}

/** ab diesem Wert (Score −6…6) gilt ein Gericht für eine Person als „mag sie gar nicht“ */
const STRONG_DISLIKE = -2

/**
 * Gemeinsame Vorliebe des Haushalts: Mittelwert aller Personen; mag es eine Person deutlich nicht,
 * zieht das zusätzlich nach unten (damit nicht eine Person ständig etwas bekommt, das die andere nicht mag).
 * Ohne weitere Personen genau `preference(mine, …)`.
 */
export function householdPreference(mine: TasteModel, others: PersonModel[], r: Recipe, day?: string): Preference {
  const me = preference(mine, r, day)
  if (!others.length) return me
  const ps = others.map((o) => ({ name: o.name, p: preference(o.model, r, day) }))
  const scores = [me.score, ...ps.map((x) => x.p.score)]
  let score = scores.reduce((a, b) => a + b, 0) / scores.length
  const min = Math.min(...scores)
  if (min < STRONG_DISLIKE) score += (min - STRONG_DISLIKE) * 0.7
  let reason: string | undefined
  const all = [me, ...ps.map((x) => x.p)]
  if (all.every((p) => p.liked === 'recipe')) reason = `❤️ mögt ihr ${all.length === 2 ? 'beide' : 'alle'}`
  else if (all.every((p) => p.liked)) reason = `👍 mögt ihr ${all.length === 2 ? 'beide' : 'alle'}`
  else if (min < -1) reason = undefined // eine Person mag es eher nicht → nicht noch anpreisen
  else if (me.liked) reason = me.reason
  else {
    const other = ps.find((x) => x.p.liked === 'recipe') ?? ps.find((x) => x.p.liked)
    if (other) reason = `👍 ${other.name} mag das`
  }
  return { score, reason, liked: me.liked }
}

// ───────────── Ruheabstand ─────────────

/** Startwerte (Tage): nach dem Planen bzw. nach dem Wegwischen */
export const REST_REPEAT = 21
export const REST_REJECT = 10
/** Grenzen: Abwechslung bleibt (mindestens 10 Tage zwischen zwei Malen), höchstens ca. 2 Monate */
export const REST_REPEAT_MIN = 10
export const REST_REPEAT_MAX = 60
export const REST_REJECT_MAX = 60

export interface Rest {
  /** so viele Tage nach dem letzten Planen bleibt das Gericht hinten */
  repeat: number
  /** so viele Tage nach dem letzten Wegwischen ruht es */
  reject: number
  /** vor wie vielen Tagen zuletzt weggewischt (fehlt = nie bzw. vor dem Zurücksetzen) */
  rejectedAgo?: number
}

/** Neigung (> 0 länger, < 0 kürzer) aus den Signalen des Gerichts und seiner Muster */
function restLean(m: TasteModel, r: Recipe): number {
  const own = aff(m.rest.get(r.id), 1)
  const fs = features(r).map((f) => aff(m.restFeature.get(f), PRIOR_FEATURE))
  const pat = fs.length ? fs.reduce((a, b) => a + b, 0) / fs.length : 0
  return own + 0.5 * pat
}

/**
 * Gelernter Ruheabstand eines Gerichts: Startwert × 2^Neigung. Oft weggewischt / 👎 → länger (auch für ähnliche Gerichte
 * über die Muster, schwächer), 🔁 / 👍 → kürzer. Nach dem Planen mindestens 10 Tage.
 */
export function restOf(m: TasteModel, r: Recipe, today: string): Rest {
  const lean = restLean(m, r)
  const f = Math.pow(2, Math.max(-1.5, Math.min(2, lean)))
  const repeat = Math.round(Math.max(REST_REPEAT_MIN, Math.min(REST_REPEAT_MAX, REST_REPEAT * f)))
  // Wegwischen: mit jedem weiteren Mal länger (die Neigung enthält das Wegwischen schon)
  const reject = Math.round(Math.max(3, Math.min(REST_REJECT_MAX, REST_REJECT * Math.pow(2, Math.max(-1, Math.min(2.6, lean))))))
  const last = m.lastReject.get(r.id)
  return { repeat, reject, ...(last ? { rejectedAgo: Math.max(0, -daysUntil(last, today)) } : {}) }
}

/** Haushalt: jede Person zählt – das Gericht ruht so lange, wie es die Person mit dem längsten Abstand braucht */
export function householdRest(mine: TasteModel, others: PersonModel[], r: Recipe, today: string): Rest {
  const all = [mine, ...others.map((o) => o.model)].map((m) => restOf(m, r, today))
  const out: Rest = { repeat: Math.max(...all.map((x) => x.repeat)), reject: REST_REJECT }
  // Wegwischen: die Person, deren Ruhe am längsten noch dauert
  let best = -Infinity
  for (const x of all) {
    if (x.rejectedAgo == null) continue
    const left = x.reject - x.rejectedAgo
    if (left > best) {
      best = left
      out.reject = x.reject
      out.rejectedAgo = x.rejectedAgo
    }
  }
  return out
}

/** Zutaten, die du oft in den Vorrat legst, für die es aber kaum Rezepte gibt (Name → Zahl der Rezepte) */
export function pantryWishes(requests: Record<string, number> | undefined, minCount = 2): { name: string; count: number; recipes: number }[] {
  return Object.entries(requests ?? {})
    .filter(([, count]) => count >= minCount)
    .map(([name, count]) => ({ name, count, recipes: Object.values(RECIPE_BY_ID).filter((r) => r.ingredients.some((i) => canonical(i.name) === name)).length }))
    .filter((x) => x.recipes < 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

export interface LearnedSummary {
  liked: { label: string; a: number }[]
  disliked: { label: string; a: number }[]
  favorites: { title: string; a: number }[]
  signals: number
}

/** Übersicht „Das habe ich gelernt“ */
export function summarize(m: TasteModel): LearnedSummary {
  const feats = [...m.feature].filter(([, a]) => a.n >= 1.5).map(([k, a]) => ({ key: k, label: featureLabel(k), a: aff(a, PRIOR_FEATURE) }))
  const strip = ({ label, a }: { label: string; a: number }) => ({ label, a })
  return {
    // „Magst du“ erst mit genug Belegen und deutlich über dem Grundanteil (siehe hintOk)
    liked: feats.filter((x) => x.a > 0.2 && hintOk(m, x.key)).sort((a, b) => b.a - a.a).slice(0, 5).map(strip),
    disliked: feats.filter((x) => x.a < -0.1).sort((a, b) => a.a - b.a).slice(0, 4).map(strip),
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
    .filter((d) => d < today && daysUntil(d, today) >= -2 && plan[d]?.status === 'cooked' && !dishValue(ratings, d, plan[d]!.recipeId) && !dismissed.includes(d))
    .sort()
    .pop()
}

// ───────────── Portionen ─────────────

/** Rückmeldung zur Menge nach dem Essen: −1 zu wenig · 0 passt · 1 zu viel (`Tag:Rezept-Id` → Wert) */
export type PortionFeedback = -1 | 0 | 1

export const PORTION_MIN = 0.85
export const PORTION_MAX = 1.2
/** so viele Rückmeldungen braucht es, bevor sich der Faktor von 1,0 wegbewegt */
const PORTION_MIN_FEEDBACK = 2

/**
 * Gelernter Portionsfaktor des Haushalts (Abendessen). „Zu wenig“ hebt ihn, „zu viel“ senkt ihn – mit Zeitverfall
 * (Halbwertszeit 60 Tage), gedämpft (zwei gedachte „passt“-Werte ziehen zur 1,0), in 5-%-Schritten, begrenzt auf 0,85–1,2.
 * Erst ab 2 Rückmeldungen. Das ist die Menge fürs Einkaufen/Planen.
 */
export function portionFactor(feedback: Record<string, PortionFeedback> | (Record<string, PortionFeedback> | undefined)[] | undefined, today: string): number {
  // mehrere Personen (Familien-Abgleich): alle Rückmeldungen zählen für den gemeinsamen Faktor
  const list = Array.isArray(feedback) ? feedback : [feedback]
  // Schlüssel `Tag` oder `Tag:Rezept-Id`
  const entries = list.flatMap((f) => Object.entries(f ?? {})).filter(([k, v]) => keyDay(k) <= today && (v === -1 || v === 0 || v === 1))
  if (entries.length < PORTION_MIN_FEEDBACK) return 1
  let sum = 0
  let n = 0
  for (const [k, v] of entries) {
    const w = Math.pow(0.5, Math.max(0, -daysUntil(keyDay(k), today)) / HALF_LIFE)
    sum += -v * w // „zu wenig“ (−1) → mehr kochen
    n += w
  }
  const avg = sum / (n + 2)
  const raw = 1 + (avg > 0 ? 0.2 : 0.15) * avg
  const f = Math.round(Math.max(PORTION_MIN, Math.min(PORTION_MAX, raw)) * 20) / 20
  return Math.round(f * 100) / 100
}

/** Text für „Das habe ich gelernt“ bzw. die Portionsbox; leer, solange der Faktor 1,0 ist */
export function portionNote(factor: number): string | undefined {
  const pct = Math.round((factor - 1) * 100)
  if (pct === 0) return undefined
  return `ihr braucht eher etwas ${pct > 0 ? 'mehr' : 'weniger'} (${pct > 0 ? '+' : '−'}${Math.abs(pct)} %)`
}

// ───────────── Frühstück: Sättigung ─────────────

/**
 * Gelernte Sättigungs-Neigung fürs Frühstück aus „Hat es bis mittags satt gemacht?“ (Schlüssel `Prep-Tag:Rezept-Id`):
 * > 0 = eher zu wenig (sättigendere Frühstücke nach vorn), < 0 = eher zu viel (leichtere nach vorn), 0 = passt/unbekannt.
 * Wie der Portionsfaktor: Zeitverfall (60 Tage), gedämpft (zwei gedachte „passt“), erst ab 2 Rückmeldungen. Bereich −1…1.
 */
export function satietyLean(feedback: Record<string, PortionFeedback> | undefined, today: string): number {
  const entries = Object.entries(feedback ?? {}).filter(([k, v]) => k.slice(0, 10) <= today && (v === -1 || v === 0 || v === 1))
  if (entries.length < PORTION_MIN_FEEDBACK) return 0
  let sum = 0
  let n = 0
  for (const [k, v] of entries) {
    const w = Math.pow(0.5, Math.max(0, -daysUntil(k.slice(0, 10), today)) / HALF_LIFE)
    sum += -v * w // „zu wenig“ (−1) → braucht mehr Sättigung
    n += w
  }
  return Math.round((sum / (n + 2)) * 100) / 100
}

/** Sättigungs-Index eines Frühstücks: Eiweiß + 2 × Ballaststoffe je 100 kcal (beides macht lange satt) */
export function satietyIndex(r: Recipe): number {
  const n = r.nutrition
  return n.kcal > 0 ? ((n.protein + 2 * n.fiber) / n.kcal) * 100 : 0
}

/**
 * Beitrag zur Frühstücks-Sortierung aus der Sättigungs-Neigung (−3…3): „zu wenig“ → Frühstücke mit viel Eiweiß und
 * Ballaststoffen (und eher mehr kcal) steigen; „zu viel“ → leichtere (weniger kcal) steigen. `all` = Vergleichsgruppe.
 */
export function satietyBonus(r: Recipe, lean: number, all: Recipe[]): number {
  if (!lean || !r.breakfast || all.length < 2) return 0
  const z = (f: (x: Recipe) => number) => {
    const vals = all.map(f)
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) || 1
    return Math.max(-2, Math.min(2, (f(r) - mean) / sd))
  }
  const kcal = z((x) => x.nutrition.kcal)
  const raw = lean > 0 ? 0.75 * z(satietyIndex) + 0.25 * kcal : kcal
  return Math.max(-3, Math.min(3, lean * raw * 3))
}

/** Text für „Das habe ich gelernt“: leer, solange die Neigung klein ist */
export function satietyNote(lean: number): string | undefined {
  if (Math.abs(lean) < 0.15) return undefined
  return lean > 0 ? 'Frühstück macht dich oft nicht bis mittags satt – sättigendere (mehr Eiweiß & Ballaststoffe) kommen nach vorn' : 'Frühstück ist dir oft zu viel – leichtere kommen nach vorn'
}
