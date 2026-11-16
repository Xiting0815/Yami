import { useEffect, useState } from 'react'
import { RECIPE_BY_ID, registerCustom } from './data/recipes'
import { CATALOG } from './data/catalog'
import {
  BREAKFAST_LABEL, CUISINE_LABEL, SHOP_LABEL, TYPE_LABEL,
  type BreakfastType, type Cuisine, type CustomIngredient, type CustomRecipe, type DishType, type Ingredient, type ShopCat, type WeekPlan,
} from './types'
import { WASTED_MAX, type BoughtMap, type PantryLot, type PriceOverrides, type WastedItem } from './kitchen'
import type { Profile } from './energy'
import type { WeighIn } from './progress'
import type { Rating, RejectEvent } from './learning'

export interface Filters {
  cuisines: Cuisine[]
  types: DishType[]
  vegetarian: boolean
  /** maximale Zubereitungszeit in Minuten, 0 = egal */
  maxTime: number
  /** nur günstige Gerichte (≤ 2,50 € pro Portion) */
  cheap: boolean
  /** nur Gerichte, für die (fast) nichts eingekauft werden muss */
  pantryOnly: boolean
}

export const EMPTY_FILTERS: Filters = { cuisines: [], types: [], vegetarian: false, maxTime: 0, cheap: false, pantryOnly: false }

export interface CustomItem {
  id: string
  name: string
  cat: ShopCat
}

export interface AppState {
  plan: WeekPlan
  /** abgehakte Einträge je Woche (Schlüssel = Montag der Woche) */
  checked: Record<string, string[]>
  custom: Record<string, CustomItem[]>
  filters: Filters
  defaultServings: number
  pantry: PantryLot[]
  /** Einkäufe je Woche, damit Abhaken den Vorrat füllt (und Rückgängig ihn wieder leert) */
  bought: Record<string, BoughtMap>
  prices: PriceOverrides
  /** Frühstücke: Tag → Eintrag (1 Portion) */
  breakfast: WeekPlan
  /** gewählte Frühstücke je Woche (Schlüssel = Montag) */
  breakfastPicks: Record<string, string[]>
  /** abgehakte Prep-Schritte je Woche */
  prepChecked: Record<string, string[]>
  /** Körperdaten & Ziel (optional) */
  profile?: Profile
  /** Messungen der Waage (1 pro Woche) */
  weighIns: WeighIn[]
  /** Anzahl Messungen beim letzten Ja/Nein zu einem Anpassungsvorschlag */
  adjustDecidedAt: number
  /** weggewischte Karten (zum Lernen), höchstens die letzten 400 */
  rejects: RejectEvent[]
  /** Bewertungen nach dem Essen: Tag → 👍/🔁/👎 */
  ratings: Record<string, Rating>
  /** Tage, deren Bewertungsfrage weggeklickt wurde */
  ratingDismissed: string[]
  /** gelernte Vorlieben gelten erst ab diesem Datum (nach „Zurücksetzen“) */
  tasteSince?: string
  /** Start-Checkliste: fehlt = läuft noch, 'done' = erledigt, 'dismissed' = ausgeblendet */
  onboarding?: 'done' | 'dismissed'
  /** Checkliste Schritt 4: Einkaufsliste wurde angesehen, während etwas geplant war */
  onboardingListSeen?: boolean
  /** Tag, an dem das Profil angelegt wurde (ISO) – am selben Tag gibt es noch keinen Wiege-Hinweis */
  profileCreated?: string
  /** Frühstückszeile in der Wochenansicht aufgeklappt */
  bfOpen?: boolean
  /** Datum (ISO) der letzten Sicherungsdatei */
  lastBackup?: string
  /** weggeworfene Vorratsposten (höchstens die letzten 300) */
  wasted: WastedItem[]
  /** Wochen (Montag, ISO), deren Rückblick-Karte weggeklickt wurde */
  reviewDismissed: string[]
  /** selbst angelegte Rezepte (Id beginnt mit "my-") */
  customRecipes: CustomRecipe[]
  /** selbst angelegte Zutaten, die nicht im Katalog stehen */
  customIngredients: CustomIngredient[]
}

const KEY = 'yami-state-v1'

const INITIAL: AppState = {
  plan: {},
  checked: {},
  custom: {},
  filters: EMPTY_FILTERS,
  defaultServings: 2,
  pantry: [],
  bought: {},
  prices: {},
  breakfast: {},
  breakfastPicks: {},
  prepChecked: {},
  weighIns: [],
  adjustDecidedAt: 0,
  // immer gespeichert → daran erkennt load() einen Stand von vor der Start-Checkliste
  onboardingListSeen: false,
  rejects: [],
  ratings: {},
  ratingDismissed: [],
  wasted: [],
  reviewDismissed: [],
  customRecipes: [],
  customIngredients: [],
}

const hasData = (s: AppState) =>
  !!s.profile || [s.plan, s.breakfast, s.breakfastPicks].some((o) => o && Object.values(o).some((v) => (Array.isArray(v) ? v.length : v)))

const ISO = /^\d{4}-\d{2}-\d{2}$/
const MAX_IMAGE = 300_000

function validIngredient(x: unknown): x is CustomIngredient {
  const c = x as Partial<CustomIngredient> | null
  return (
    !!c && typeof c.name === 'string' && c.name.trim() !== '' && c.name.length <= 60 && typeof c.cat === 'string' && c.cat in SHOP_LABEL &&
    Number.isFinite(c.kcal) && Number.isFinite(c.protein) && typeof c.unit === 'string' && c.unit !== '' &&
    (c.gramsPerPiece == null || (Number.isFinite(c.gramsPerPiece) && c.gramsPerPiece > 0))
  )
}

/** Eigenes Rezept prüfen; Zutaten, die es nicht (mehr) gibt, entfallen */
function validRecipe(x: unknown): CustomRecipe | null {
  const c = x as Partial<CustomRecipe> | null
  if (!c || typeof c.id !== 'string' || !c.id.startsWith('my-') || typeof c.title !== 'string' || !c.title.trim()) return null
  if (c.meal !== 'dinner' && c.meal !== 'breakfast') return null
  if (!c.cuisine || !(c.cuisine in CUISINE_LABEL) || !c.type || !(c.type in TYPE_LABEL)) return null
  if (!Array.isArray(c.ingredients) || !Array.isArray(c.steps)) return null
  const ingredients: Ingredient[] = c.ingredients
    .filter(
      (i): i is Ingredient =>
        !!i && typeof i.name === 'string' && !!CATALOG[i.name] && typeof i.unit === 'string' && (i.amount === null || Number.isFinite(i.amount)),
    )
    .map((i) => ({ name: i.name, amount: i.amount, unit: i.unit }))
  if (!ingredients.length) return null
  const b = c.breakfast
  const breakfast =
    c.meal === 'breakfast'
      ? {
          type: b && b.type in BREAKFAST_LABEL ? (b.type as BreakfastType) : ('herzhaft' as BreakfastType),
          fridgeDays: b && Number.isFinite(b.fridgeDays) && b.fridgeDays > 0 ? b.fridgeDays : 3,
          freezer: !!b?.freezer,
          container: b && typeof b.container === 'string' && b.container ? b.container : 'Glas',
          morning: b && typeof b.morning === 'string' ? b.morning : '',
        }
      : undefined
  const image = typeof c.image === 'string' && c.image.startsWith('data:image/') && c.image.length <= MAX_IMAGE ? c.image : undefined
  return {
    id: c.id,
    title: c.title.trim().slice(0, 120),
    meal: c.meal,
    cuisine: c.cuisine as Cuisine,
    type: c.type as DishType,
    time: Number.isFinite(c.time) && c.time! > 0 ? Math.round(c.time!) : 30,
    servings: Number.isFinite(c.servings) && c.servings! >= 1 ? Math.round(c.servings!) : c.meal === 'breakfast' ? 1 : 2,
    ingredients,
    steps: c.steps.filter((s): s is string => typeof s === 'string' && s.trim() !== '').map((s) => s.trim()),
    image,
    breakfast,
    created: typeof c.created === 'string' && ISO.test(c.created) ? c.created : '1970-01-01',
  }
}

/** Stand aus beliebigen Daten (localStorage oder Sicherungsdatei) machen: falsche Typen verwerfen, Rezepte ohne Eintrag entfernen */
export function sanitize(parsed: unknown): AppState {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    registerCustom([], [])
    return INITIAL
  }
  // Felder mit falschem Typ (z. B. "plan": null) verwerfen statt die App abstürzen zu lassen
  const saved: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed)) {
    const ref = (INITIAL as unknown as Record<string, unknown>)[k]
    if (ref === undefined || v == null) {
      if (v != null) saved[k] = v
      continue
    }
    if (Array.isArray(ref) ? Array.isArray(v) : typeof ref === typeof v && !Array.isArray(v)) saved[k] = v
  }
  if (typeof saved.lastBackup !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(saved.lastBackup)) delete saved.lastBackup
  const state: AppState = { ...INITIAL, ...(saved as Partial<AppState>), filters: { ...EMPTY_FILTERS, ...(saved.filters as object) } }
  // Eigene Zutaten und Rezepte prüfen und eintragen, bevor der Plan geprüft wird (der Plan darf auf sie zeigen)
  state.customIngredients = state.customIngredients.filter(validIngredient)
  registerCustom(state.customIngredients, [])
  const seen = new Set<string>()
  state.customRecipes = state.customRecipes
    .map(validRecipe)
    .filter((r): r is CustomRecipe => !!r && !seen.has(r.id) && !!seen.add(r.id))
  registerCustom(state.customIngredients, state.customRecipes)
  // Einträge zu Rezepten, die es nicht mehr gibt, entfernen
  const clean = (p: WeekPlan) => Object.fromEntries(Object.entries(p).filter(([, e]) => e && RECIPE_BY_ID[e.recipeId]))
  state.plan = clean(state.plan)
  state.breakfast = clean(state.breakfast)
  state.breakfastPicks = Object.fromEntries(
    Object.entries(state.breakfastPicks).map(([k, ids]) => [k, (Array.isArray(ids) ? ids : []).filter((id) => RECIPE_BY_ID[id])]),
  )
  const validWaste = (w: unknown): w is WastedItem => {
    const x = w as Partial<WastedItem> | null
    return (
      !!x && typeof x.name === 'string' && typeof x.unit === 'string' && typeof x.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x.date) &&
      Number.isFinite(x.amount) && Number.isFinite(x.value)
    )
  }
  state.wasted = state.wasted.filter(validWaste).slice(-WASTED_MAX)
  state.reviewDismissed = state.reviewDismissed.filter((k) => typeof k === 'string').slice(-60)
  // Stand von vor der Start-Checkliste: wer die App schon benutzt hat, bekommt sie nicht mehr
  if (!state.onboarding && !('onboardingListSeen' in saved) && hasData(state)) state.onboarding = 'done'
  return state
}

/** Schlüssel eines Standes (zum Erkennen einer Sicherungsdatei) */
export const STATE_KEYS = Object.keys(INITIAL)

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return sanitize(JSON.parse(raw))
  } catch {
    /* privates Fenster o. Ä. – mit leerem Zustand starten */
  }
  return INITIAL
}

export function useAppState() {
  const [state, setState] = useState<AppState>(load)
  // eigene Zutaten/Rezepte vor dem Rendern in die Verzeichnisse eintragen (auch nach Rückgängig/Import); idempotent
  registerCustom(state.customIngredients, state.customRecipes)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* Speichern nicht möglich – App funktioniert trotzdem */
    }
  }, [state])
  return [state, setState] as const
}

// ───────────── Datum ─────────────

export function isoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIso(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function mondayOf(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = (x.getDay() + 6) % 7 // Mo = 0
  x.setDate(x.getDate() - dow)
  return x
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function weekDays(monday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => isoDate(addDays(monday, i)))
}

const WD = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const WD_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

export function weekdayName(iso: string, short = false): string {
  const d = parseIso(iso)
  return (short ? WD_SHORT : WD)[d.getDay()]
}

export function shortDate(iso: string): string {
  const d = parseIso(iso)
  return `${d.getDate()}.${d.getMonth() + 1}.`
}

export function weekLabel(monday: Date): string {
  const sun = addDays(monday, 6)
  const kw = isoWeekNumber(monday)
  const sameMonth = monday.getMonth() === sun.getMonth()
  const from = sameMonth ? `${monday.getDate()}.` : `${monday.getDate()}.${monday.getMonth() + 1}.`
  return `KW ${kw} · ${from}–${sun.getDate()}.${sun.getMonth() + 1}.`
}

export function isoWeekNumber(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
