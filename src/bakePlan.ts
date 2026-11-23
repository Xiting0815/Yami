/**
 * Backen einplanen: Backplan (Tag → eingeplante Backwaren), Nachfragen am Folgetag und sanfte, lernende Vorschläge.
 * Reine Logik ohne React/Speicher (testbar: scripts/test-bakeplan.ts). Der Backplan ist geteilt (Familien-Abgleich, src/sync.ts).
 *
 * Ablauf: einplanen (Rezeptblatt oder Vorschlag) → Zutaten fließen wie bei Abendessen in Einkaufsliste/Vorrat-Reservierung
 * (planWeek) → nach dem Tag fragt die Woche „Hast du … gebacken?“ → Ja = Zutaten abziehen + Ergebnis in den Vorrat
 * (cookBasic), Verschieben, oder Entfernen. Nichts wird ohne Bestätigung abgezogen.
 *
 * Lernen: Wochentags-Gewohnheiten je Art (Brot, Kuchen, Plätzchen …) aus dem Gebackenen; Vorschläge, die weggeklickt
 * werden, kommen seltener (Pause verdoppelt sich), angenommene setzen die Pause zurück.
 */
import { BASICS, RECIPE_BY_ID } from './data/recipes'
import { festiveOf } from './kitchen/insight'
import { type PantryLot, addDaysIso } from './kitchen/base'
import { cookBasic } from './kitchen/pantry'
import type { BakeEntry, BakePlan, BasicKind, PlanEntry, Recipe } from './types'
import { isBake, isBbq } from './types'

/** so viele Tage nach dem Backtag wird noch nachgefragt – danach gilt der Eintrag als vergessen (kein Vorrat mehr reserviert) */
export const BAKE_ASK_DAYS = 14
/** so viele Tage im Voraus kann man Backen einplanen */
export const BAKE_AHEAD_DAYS = 14
const MAX_AMOUNT = 12
const WD = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

/** Wochentag 0 = Sonntag … 6 = Samstag */
export const weekdayOf = (iso: string): number => new Date(iso + 'T12:00:00').getDay()
export const weekdayLabel = (iso: string): string => WD[weekdayOf(iso)]
export const daysBetween = (from: string, to: string) => Math.round((new Date(to + 'T12:00:00').getTime() - new Date(from + 'T12:00:00').getTime()) / 86400000)

/** Rezeptmenge prüfen: ganze Zahl 1–12 */
export const cleanAmount = (n: unknown): number => (typeof n === 'number' && Number.isFinite(n) ? Math.min(MAX_AMOUNT, Math.max(1, Math.round(n))) : 1)

// ───────────── Backplan ändern ─────────────

export const bakesOn = (bp: BakePlan, day: string): BakeEntry[] => bp[day] ?? []

function put(bp: BakePlan, day: string, list: BakeEntry[]): BakePlan {
  const next = { ...bp }
  if (list.length) next[day] = list
  else delete next[day]
  return next
}

/** Backen einplanen (dasselbe Rezept am selben Tag wird nicht doppelt angelegt: Menge und Status werden ersetzt) */
export function addBake(bp: BakePlan, day: string, recipeId: string, amount = 1): BakePlan {
  const list = bakesOn(bp, day)
  const entry: BakeEntry = { recipeId, amount: cleanAmount(amount) }
  return put(bp, day, list.some((e) => e.recipeId === recipeId) ? list.map((e) => (e.recipeId === recipeId ? entry : e)) : [...list, entry])
}

export const removeBake = (bp: BakePlan, day: string, recipeId: string): BakePlan =>
  put(bp, day, bakesOn(bp, day).filter((e) => e.recipeId !== recipeId))

export function setBakeAmount(bp: BakePlan, day: string, recipeId: string, amount: number): BakePlan {
  return put(bp, day, bakesOn(bp, day).map((e) => (e.recipeId === recipeId ? { ...e, amount: cleanAmount(amount) } : e)))
}

/** auf einen anderen Tag verschieben (offen, wieder offen); liegt dasselbe Rezept dort schon, zählt die größere Menge */
export function moveBake(bp: BakePlan, from: string, recipeId: string, to: string): BakePlan {
  const e = bakesOn(bp, from).find((x) => x.recipeId === recipeId)
  if (!e || from === to) return bp
  const without = removeBake(bp, from, recipeId)
  const there = bakesOn(without, to).find((x) => x.recipeId === recipeId)
  return addBake(without, to, recipeId, Math.max(e.amount, there && !there.status ? there.amount : 0))
}

/** als gebacken markieren (Vorrat wurde schon gebucht – kein zweites Abziehen) */
export function markBaked(bp: BakePlan, day: string, recipeId: string): BakePlan {
  return put(bp, day, bakesOn(bp, day).map((e) => (e.recipeId === recipeId ? { ...e, status: 'baked' as const } : e)))
}

/**
 * „Ja, gebacken“ auf einen offenen Eintrag: Zutaten abziehen, Ergebnis (ab Backtag haltbar) in den Vorrat, Eintrag gebacken,
 * Gebackenes vermerken. Ein bereits beantworteter oder fehlender Eintrag ändert nichts (`null`) – nie zweimal abziehen.
 */
export function settleBaked(
  s: { pantry: PantryLot[]; bakePlan: BakePlan; baked: BakedRef[] },
  day: string,
  recipeId: string,
): { pantry: PantryLot[]; bakePlan: BakePlan; baked: BakedRef[] } | null {
  const recipe = RECIPE_BY_ID[recipeId]
  const e = bakesOn(s.bakePlan, day).find((x) => x.recipeId === recipeId)
  // BBQ ohne Reste (Burger, Steak) hat kein Ergebnis – dann werden nur die Zutaten abgezogen
  if (!recipe || !(recipe.yields || isBbq(recipe)) || !e || e.status) return null
  return {
    pantry: cookBasic(s.pantry, recipe, e.amount * recipe.servings, day).pantry,
    bakePlan: markBaked(s.bakePlan, day, recipeId),
    baked: isBake(recipe) ? [...s.baked, { date: day, recipeId }].slice(-200) : s.baked,
  }
}

/**
 * Welcher offene Eintrag gehört zu „Fertig gebacken“ im Kochmodus? Der Tag, von dem aus das Rezept geöffnet wurde,
 * sonst heute, sonst der früheste noch unbeantwortete vergangene, sonst der nächste geplante (bis 14 Tage voraus).
 */
export function matchBake(bp: BakePlan, recipeId: string, today: string, ctxDay?: string): string | undefined {
  const open = (d: string) => bakesOn(bp, d).some((e) => e.recipeId === recipeId && !e.status)
  if (ctxDay && open(ctxDay)) return ctxDay
  if (open(today)) return today
  const days = Object.keys(bp).filter(open).sort()
  return days.find((d) => d < today && daysBetween(d, today) <= BAKE_ASK_DAYS) ?? days.find((d) => d > today && daysBetween(today, d) <= BAKE_AHEAD_DAYS)
}

/** unbeantwortete Backtage in der Vergangenheit (älteste zuerst) – die Wochenansicht fragt immer nach dem ersten */
export function pendingBakes(bp: BakePlan, today: string): { day: string; entry: BakeEntry }[] {
  const out: { day: string; entry: BakeEntry }[] = []
  for (const day of Object.keys(bp).sort()) {
    if (day >= today || daysBetween(day, today) > BAKE_ASK_DAYS) continue
    for (const entry of bp[day] ?? []) if (!entry.status && RECIPE_BY_ID[entry.recipeId]) out.push({ day, entry })
  }
  return out
}

/** Noch offene Einträge als Plan-Einträge für die Wochenplanung (Portionen = Rezeptmenge × Basis-Portionen des Rezepts) */
export function bakeEntriesOf(bp: BakePlan, today: string): [string, PlanEntry][] {
  const out: [string, PlanEntry][] = []
  const oldest = addDaysIso(today, -BAKE_ASK_DAYS)
  for (const day of Object.keys(bp).sort()) {
    if (day < oldest) continue
    for (const e of bp[day] ?? []) {
      const r = RECIPE_BY_ID[e.recipeId]
      if (!r || e.status) continue
      out.push([day, { recipeId: e.recipeId, servings: e.amount * r.servings }])
    }
  }
  return out
}

/** Zeile für die Wochenansicht: „Bienenstich · Dinkelbrötchen“ (unbekannte Rezepte entfallen) */
export const bakeLine = (list: BakeEntry[]): { entry: BakeEntry; recipe: Recipe }[] =>
  list.flatMap((entry) => (RECIPE_BY_ID[entry.recipeId] && entry.status !== 'skipped' ? [{ entry, recipe: RECIPE_BY_ID[entry.recipeId] }] : []))

// ───────────── Prüfen (Speicher, Sicherung, Abgleich) ─────────────

const ISO = /^\d{4}-\d{2}-\d{2}$/
/** höchstens so viele Backtage werden gespeichert */
export const BAKE_DAYS_MAX = 200

export function sanitizeBakePlan(x: unknown): BakePlan {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return {}
  const out: BakePlan = {}
  for (const [day, raw] of Object.entries(x as Record<string, unknown>)) {
    if (!ISO.test(day) || !Array.isArray(raw)) continue
    const seen = new Set<string>()
    const list: BakeEntry[] = []
    for (const e of raw as Partial<BakeEntry>[]) {
      if (!e || typeof e !== 'object' || typeof e.recipeId !== 'string' || !RECIPE_BY_ID[e.recipeId]?.basic || seen.has(e.recipeId)) continue
      seen.add(e.recipeId)
      list.push({ recipeId: e.recipeId, amount: cleanAmount(e.amount), ...(e.status === 'baked' || e.status === 'skipped' ? { status: e.status } : {}) })
    }
    if (list.length) out[day] = list
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)).slice(-BAKE_DAYS_MAX))
}

// ───────────── Lernen ─────────────

const HALF_LIFE = 60
export const decay = (date: string, today: string) => Math.pow(0.5, Math.max(0, daysBetween(date, today)) / HALF_LIFE)

export type BakeGroup = BasicKind
export interface BakedRef { date: string; recipeId: string }

/**
 * Wochentags-Gewohnheiten: je Art ein Zähler je Wochentag (0 = So … 6 = Sa), jüngeres zählt mehr.
 * Aus dem Gebackenen; ein Eintrag im Backplan zählt wie gebacken, wenn er bestätigt wurde (steht dann auch in `baked`).
 */
export function bakeHabits(baked: BakedRef[], today: string): Record<string, number[]> {
  const out: Record<string, number[]> = {}
  for (const b of baked) {
    const r = RECIPE_BY_ID[b.recipeId]
    if (!r?.basic || !isBake(r)) continue
    const arr = (out[r.kind!] ??= [0, 0, 0, 0, 0, 0, 0])
    arr[weekdayOf(b.date)] += decay(b.date, today)
  }
  return out
}

/** Lieblings-Backtag (0–6) einer Art, falls es eine deutliche Gewohnheit gibt (mindestens `min` gewichtete Male) */
export function habitDay(habits: Record<string, number[]>, kind: string, min = 1.2): number | undefined {
  const a = habits[kind]
  if (!a) return undefined
  const max = Math.max(...a)
  return max >= min ? a.indexOf(max) : undefined
}

/** Anteil Sa/So am Backen einer Art (0–1) und Menge gewichtet */
export function weekendShare(habits: Record<string, number[]>, kind: string): { share: number; total: number } {
  const a = habits[kind] ?? [0, 0, 0, 0, 0, 0, 0]
  const total = a.reduce((s, v) => s + v, 0)
  return { share: total ? (a[0] + a[6]) / total : 0, total }
}

export interface BakeHint {
  /** Tag der Antwort */
  date: string
  kind: HintKind
  action: 'accepted' | 'dismissed'
}
export type HintKind = 'brot' | 'plaetzchen' | 'kuchen' | 'bbq'

export const HINTS_MAX = 60
const HINT_MEMORY = 120

export function sanitizeBakeHints(x: unknown): BakeHint[] {
  if (!Array.isArray(x)) return []
  return x
    .filter((h): h is BakeHint => !!h && typeof h === 'object' && typeof h.date === 'string' && ISO.test(h.date) && ['brot', 'plaetzchen', 'kuchen', 'bbq'].includes(h.kind) && (h.action === 'accepted' || h.action === 'dismissed'))
    .map((h) => ({ date: h.date, kind: h.kind, action: h.action }))
    .slice(-HINTS_MAX)
}

/**
 * Pause nach Wegklicken: die Art ruht 3 × 2^n Tage (n = Wegklicks seit der letzten Annahme, 6 · 12 · 24 Tage …);
 * ab dem vierten Wegklicken ist sie ganz still, bis die Wegklicks älter als 120 Tage sind oder etwas angenommen wird.
 * Ein Wegklicken heute ruht alle Vorschläge für heute (höchstens einer pro Tag).
 */
export function hintBlocked(hints: BakeHint[], kind: HintKind, today: string): boolean {
  if (hints.some((h) => h.action === 'dismissed' && h.date === today)) return true
  const mine = hints.filter((h) => h.kind === kind && daysBetween(h.date, today) <= HINT_MEMORY).sort((a, b) => a.date.localeCompare(b.date))
  let lastAccept = ''
  for (const h of mine) if (h.action === 'accepted') lastAccept = h.date
  const dis = mine.filter((h) => h.action === 'dismissed' && h.date > lastAccept)
  if (!dis.length) return false
  if (dis.length >= 4) return true
  return daysBetween(dis[dis.length - 1].date, today) < 3 * Math.pow(2, dis.length)
}

export interface BakeSuggestion {
  kind: HintKind
  recipeId: string
  /** vorgeschlagener Backtag */
  day: string
  text: string
}

export interface SuggestInput {
  today: string
  pantry: PantryLot[]
  baked: BakedRef[]
  bakeRatings: Record<string, 'up' | 'again' | 'down'>
  bakePlan: BakePlan
  hints: BakeHint[]
}

/** Namen im Vorrat, die als Brot/Brötchen zählen (gekauft oder selbstgebacken) */
const BREAD_BOUGHT = ['Vollkornbrot', 'Weißbrot', 'Toastbrot', 'Brötchen vom Vortag', 'Ciabatta', 'Brötchen']
const breadNames = (): Set<string> => new Set([...BREAD_BOUGHT, ...BASICS.filter((b) => b.kind === 'brot' && b.yields).map((b) => b.yields!.name)])
const cakeNames = (): Set<string> => new Set(BASICS.filter((b) => b.kind === 'kuchen' && b.yields).map((b) => b.yields!.name))

const have = (pantry: PantryLot[], names: Set<string>, today: string) => pantry.some((l) => l.amount > 1e-6 && l.expires >= today && names.has(l.name))

/** nächster Tag ab morgen mit diesem Wochentag */
export function nextWeekday(today: string, wd: number): string {
  for (let i = 1; i <= 7; i++) if (weekdayOf(addDaysIso(today, i)) === wd) return addDaysIso(today, i)
  return addDaysIso(today, 1)
}

/** Rezept-Wertung fürs Vorschlagen: Gebackenes (jünger zählt mehr) + Bewertungen; „nicht so“ sperrt, „bald wieder“ hebt */
export function recipeScores(inp: Pick<SuggestInput, 'baked' | 'bakeRatings' | 'today'>, kind: BasicKind): Map<string, { score: number; last?: string; down: boolean }> {
  const m = new Map<string, { score: number; last?: string; down: boolean }>()
  const get = (id: string) => m.get(id) ?? m.set(id, { score: 0, down: false }).get(id)!
  for (const b of inp.baked) {
    if (RECIPE_BY_ID[b.recipeId]?.kind !== kind) continue
    const c = get(b.recipeId)
    c.score += decay(b.date, inp.today)
    if (!c.last || b.date > c.last) c.last = b.date
  }
  // Bewertungen: die jüngste je Rezept entscheidet über „nicht so“
  const latest = new Map<string, { date: string; v: 'up' | 'again' | 'down' }>()
  for (const [key, v] of Object.entries(inp.bakeRatings)) {
    const id = key.slice(11)
    const date = key.slice(0, 10)
    if (RECIPE_BY_ID[id]?.kind !== kind) continue
    const c = get(id)
    c.score += (v === 'again' ? 1 : v === 'up' ? 0.5 : -1) * decay(date, inp.today)
    if (!latest.has(id) || date > latest.get(id)!.date) latest.set(id, { date, v })
  }
  for (const [id, l] of latest) get(id).down = l.v === 'down'
  return m
}

/** bestes Rezept einer Art (Kandidaten vorgegeben): höchste Wertung, was lange nicht gebacken wurde, vor Frischem; „nicht so“ nie */
function pickRecipe(inp: SuggestInput, kind: BasicKind, candidates: Recipe[], restDays: number): Recipe | undefined {
  const sc = recipeScores(inp, kind)
  const best = candidates
    .filter((r) => !sc.get(r.id)?.down && !(sc.get(r.id)?.last && daysBetween(sc.get(r.id)!.last!, inp.today) < restDays))
    .map((r) => ({ r, s: (sc.get(r.id)?.score ?? 0) + (sc.has(r.id) ? 0 : 0.15) }))
    .sort((a, b) => b.s - a.s || a.r.id.localeCompare(b.r.id))
  return best[0]?.r
}

export const plannedWithin = (bp: BakePlan, today: string, days: number, match: (r: Recipe) => boolean) =>
  Object.entries(bp).some(([d, list]) => d >= today && daysBetween(today, d) <= days && (list ?? []).some((e) => !e.status && match(RECIPE_BY_ID[e.recipeId] ?? ({} as Recipe))))

export const bakedWithin = (baked: BakedRef[], today: string, days: number, match: (r: Recipe) => boolean) =>
  baked.some((b) => daysBetween(b.date, today) >= 0 && daysBetween(b.date, today) <= days && match(RECIPE_BY_ID[b.recipeId] ?? ({} as Recipe)))

/**
 * Sanfter Vorschlag (höchstens einer): Brot/Brötchen alle → fürs Wochenende (gelernter Backtag) backen,
 * Plätzchen in der Plätzchenzeit, Kuchen, wenn ihr gern am Wochenende Kuchen backt. Leer, wenn nichts passt.
 */
export function suggestBake(inp: SuggestInput): BakeSuggestion | undefined {
  const { today } = inp
  const habits = bakeHabits(inp.baked, today)
  const mk = (kind: HintKind, r: Recipe, day: string, text: string): BakeSuggestion => ({ kind, recipeId: r.id, day, text })

  // 1) Brot / Brötchen sind alle
  if (!hintBlocked(inp.hints, 'brot', today)) {
    const recent = inp.baked.filter((b) => RECIPE_BY_ID[b.recipeId]?.kind === 'brot' && daysBetween(b.date, today) <= 70)
    const liked = Object.entries(inp.bakeRatings).some(([k, v]) => RECIPE_BY_ID[k.slice(11)]?.kind === 'brot' && (v === 'up' || v === 'again'))
    const bakesBread = recent.length >= 2 || (recent.length >= 1 && liked)
    if (bakesBread && !have(inp.pantry, breadNames(), today)) {
      const target = nextWeekday(today, habitDay(habits, 'brot') ?? 6)
      const ahead = daysBetween(today, target)
      const r = pickRecipe(inp, 'brot', BASICS.filter((b) => b.kind === 'brot' && b.yields && recent.some((x) => x.recipeId === b.id)), 0)
      if (r && ahead <= 2 && !plannedWithin(inp.bakePlan, today, 7, (x) => x.kind === 'brot') && !bakedWithin(inp.baked, today, 3, (x) => x.kind === 'brot'))
        return mk('brot', r, target, `${/brötchen/i.test(r.yields!.name) ? 'Brötchen sind alle' : 'Brot ist alle'} – ${r.title} für ${weekdayLabel(target)} backen?`)
    }
  }

  // 2) Plätzchenzeit
  if (!hintBlocked(inp.hints, 'plaetzchen', today)) {
    const target = nextWeekday(today, habitDay(habits, 'gebaeck') === 0 ? 0 : 6)
    const pool = BASICS.filter((b) => b.kind === 'gebaeck' && b.festive?.includes('plaetzchen') && festiveOf(b, today)?.active && festiveOf(b, target)?.active)
    const isPl = (x: Recipe) => !!x.festive?.includes('plaetzchen')
    if (pool.length && daysBetween(today, target) <= 4 && !plannedWithin(inp.bakePlan, today, 14, isPl) && !bakedWithin(inp.baked, today, 7, isPl)) {
      const r = pickRecipe(inp, 'gebaeck', pool, 21)
      if (r) return mk('plaetzchen', r, target, `Plätzchenzeit – ${r.title} am ${weekdayLabel(target)} backen?`)
    }
  }

  // 3) Kuchen am Wochenende
  if (!hintBlocked(inp.hints, 'kuchen', today)) {
    const { share, total } = weekendShare(habits, 'kuchen')
    if (total >= 1.5 && share >= 0.5 && !have(inp.pantry, cakeNames(), today)) {
      const a = habits.kuchen
      const wd = a[0] >= a[6] ? 0 : 6
      const target = nextWeekday(today, wd)
      const isK = (x: Recipe) => x.kind === 'kuchen'
      if (daysBetween(today, target) <= 2 && !plannedWithin(inp.bakePlan, today, 7, isK) && !bakedWithin(inp.baked, today, 3, isK)) {
        const r = pickRecipe(inp, 'kuchen', BASICS.filter((b) => b.kind === 'kuchen' && b.yields), 14)
        if (r) return mk('kuchen', r, target, `${weekdayLabel(target)} ist Kuchentag – ${r.title} backen?`)
      }
    }
  }
  return undefined
}

/** Vorschlag annehmen: einplanen + Signal „angenommen“ */
export function acceptSuggestion(bp: BakePlan, hints: BakeHint[], s: BakeSuggestion, today: string): { bakePlan: BakePlan; hints: BakeHint[] } {
  return { bakePlan: addBake(bp, s.day, s.recipeId, 1), hints: [...hints, { date: today, kind: s.kind, action: 'accepted' as const }].slice(-HINTS_MAX) }
}

/** Vorschlag wegklicken: Signal „weggeklickt“ (die Art ruht länger, je öfter das passiert) */
export const dismissSuggestion = (hints: BakeHint[], s: Pick<BakeSuggestion, 'kind'>, today: string): BakeHint[] =>
  [...hints, { date: today, kind: s.kind, action: 'dismissed' as const }].slice(-HINTS_MAX)
