import { useEffect, useState } from 'react'
import { RECIPE_BY_ID, registerCustom } from './data/recipes'
import { CATALOG, RENAMED } from './data/catalog'
import { PRODUCTS } from './data/products'
import { rememberStaples, sanitizeMemos, sanitizeSpices, type SpiceStatus, type StapleMemos } from './staples'
import {
  BREAKFAST_LABEL, CUISINE_LABEL, SHOP_LABEL, TYPE_LABEL,
  type BreakfastType, type Cuisine, type CustomIngredient, type CustomRecipe, type DishType, type Ingredient, type BakePlan, type PlanEntry, type ShopCat, type WeekPlan,
} from './types'
import { WASTED_MAX, addDaysIso, toBase, uid, type BoughtMap, type PantryLot, type PriceOverrides, type WastedItem } from './kitchen'
import { DEFAULT_PROFILE, type Profile, type Snack } from './energy'
import type { WeighIn } from './progress'
import type { PortionFeedback, Rating, RejectEvent } from './learning'
import { type SyncLocal, sanitizeSync } from './syncLocal'
import { type BakeHint, sanitizeBakeHints, sanitizeBakePlan } from './bakePlan'

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

/** Home-Assistant-Verbindung (Token bleibt nur auf diesem Gerät, kommt nie in die Sicherung) */
export interface HaSettings {
  url: string
  token: string
  enabled: boolean
  /** Einkaufsliste (todo-Entität) */
  todo: string
  /** Kalender für den Plan */
  calendar: string
  /** Kalender für Erinnerungen (HA schickt zum Beginn eine Mitteilung) */
  reminders: string
  /** Yami-Schlüssel (Zutat) → HA-Todo-uid */
  items: Record<string, string>
  /** Schlüssel, die beim letzten Abgleich in HA als erledigt standen (erkennt „in Yami wieder abgewählt“) */
  done?: string[]
  /** Kalendereinträge: Schlüssel → uid (falls bekannt) und Signatur */
  events: Record<string, { uid?: string; sig: string }>
  lastSync?: string
  error?: string
  /** Familie teilen: Plan, Einkauf, Vorrat … über eine HA-To-do-Liste mit anderen Geräten abgleichen */
  share?: boolean
  /** To-do-Liste für den Familien-Abgleich */
  syncList: string
  /** wer dieses Gerät benutzt („Wer bist du?“) – nur lokal */
  me?: string
  /** zufällige Kennung dieses Geräts (nur lokal, nicht in der Sicherung) */
  device: string
}

/** Familien-Abgleich läuft (verbunden, eingeschaltet, Person gewählt) */
export function sharingActive(h: HaSettings | undefined): h is HaSettings & { me: string } {
  return !!h && h.enabled && !!h.url && !!h.token && !!h.share && !!h.me
}

export const SYNC_LIST_DEFAULT = 'todo.yami_sync'

export const HA_DEFAULTS = { todo: 'todo.einkaufen', calendar: 'calendar.familie', reminders: 'calendar.yami_erinnerungen' }
/** frühere Standardziele – werden beim Laden auf die neuen umgestellt (Google Tasks „Einkaufen“, Google-Kalender „Familie“) */
const HA_OLD_DEFAULTS = { todo: 'todo.einkaufsliste', calendar: 'calendar.yami' }

/**
 * Ziele ändern: die gemerkten Zuordnungen (Einträge/Termine) gehören zur alten Liste bzw. zum alten Kalender
 * und werden für das geänderte Ziel verworfen, sonst würde Yami fremde Einträge ändern oder löschen.
 */
export function withHaTargets(h: HaSettings, next: Partial<Pick<HaSettings, 'todo' | 'calendar' | 'reminders'>>): HaSettings {
  const out: HaSettings = { ...h, ...next }
  if (next.todo && next.todo !== h.todo) {
    out.items = {}
    out.done = undefined
  }
  const drop = (prefix: string) => Object.fromEntries(Object.entries(out.events).filter(([k]) => !k.startsWith(prefix)))
  if (next.calendar && next.calendar !== h.calendar) out.events = drop('dinner:')
  if (next.reminders && next.reminders !== h.reminders) out.events = drop('rem:')
  return out
}

export function newHa(url = '', token = ''): HaSettings {
  return { url, token, enabled: false, ...HA_DEFAULTS, items: {}, events: {}, syncList: SYNC_LIST_DEFAULT, device: uid() + uid() }
}

const ENTITY = /^[a-z_]+\.[a-z0-9_]+$/

function sanitizeHa(x: unknown): HaSettings | undefined {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return undefined
  const h = x as Record<string, unknown>
  const str = (v: unknown, d: string) => (typeof v === 'string' ? v.trim().slice(0, 500) : d)
  const ent = (v: unknown, d: string) => (typeof v === 'string' && ENTITY.test(v.trim()) ? v.trim() : d)
  const items: Record<string, string> = {}
  if (h.items && typeof h.items === 'object' && !Array.isArray(h.items))
    for (const [k, v] of Object.entries(h.items)) if (typeof v === 'string' && v) items[k] = v
  const events: HaSettings['events'] = {}
  if (h.events && typeof h.events === 'object' && !Array.isArray(h.events))
    for (const [k, v] of Object.entries(h.events)) {
      const e = v as { uid?: unknown; sig?: unknown } | null
      if (e && typeof e.sig === 'string') events[k] = { sig: e.sig, ...(typeof e.uid === 'string' && e.uid ? { uid: e.uid } : {}) }
    }
  const base: HaSettings = {
    url: str(h.url, ''),
    token: str(h.token, ''),
    enabled: h.enabled === true,
    todo: ent(h.todo, HA_DEFAULTS.todo),
    calendar: ent(h.calendar, HA_DEFAULTS.calendar),
    reminders: ent(h.reminders, HA_DEFAULTS.reminders),
    items,
    done: Array.isArray(h.done) ? h.done.filter((k): k is string => typeof k === 'string') : undefined,
    events,
    lastSync: typeof h.lastSync === 'string' ? h.lastSync : undefined,
    error: typeof h.error === 'string' ? h.error : undefined,
    syncList: ent(h.syncList, SYNC_LIST_DEFAULT),
    device: typeof h.device === 'string' && /^[a-z0-9]{6,32}$/.test(h.device) ? h.device : uid() + uid(),
  }
  if (h.share === true) base.share = true
  if (typeof h.me === 'string' && h.me.trim()) base.me = h.me.trim().slice(0, 30)
  // alte Standardziele auf die neuen umstellen (selbst gewählte Ziele bleiben)
  const move: Partial<Pick<HaSettings, 'todo' | 'calendar'>> = {}
  if (base.todo === HA_OLD_DEFAULTS.todo) move.todo = HA_DEFAULTS.todo
  if (base.calendar === HA_OLD_DEFAULTS.calendar) move.calendar = HA_DEFAULTS.calendar
  return Object.keys(move).length ? withHaTargets(base, move) : base
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
  /** Prep-Tag (ISO) je Woche (Schlüssel = Montag); fehlt er, gilt der gelernte Wochentag, sonst der Sonntag davor */
  prepDays: Record<string, string>
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
  /** Menge nach dem Essen: Tag → −1 zu wenig · 0 passt · 1 zu viel (lernt den Portionsfaktor des Haushalts) */
  portionFeedback: Record<string, PortionFeedback>
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
  /** Rezeptansicht: klassische Schritte statt der Geräte-Schritte (pro Gerät/Nutzer gemerkt) */
  showClassicSteps?: boolean
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
  /** Zutaten, die du in den Vorrat getippt hast: Name → wie oft (lernt, wofür dir Rezepte fehlen) */
  pantryRequests: Record<string, number>
  /** Gewürze: Name → „da“ oder „alle“ (nur Gewürze, die du führst) */
  spices: Record<string, SpiceStatus>
  /** Mengen-Grundzutaten (Öl, Brühe …), die du führst, mit der zuletzt gehabten Form (gelernt: was gekauft wird) */
  staples: StapleMemos
  /** Home Assistant (optional) */
  ha?: HaSettings
  /** gegessene Stücke Selbstgebackenes (Kuchen, Brot, Dessert) – zählen in die Tagesbilanz (höchstens die letzten 400) */
  snacks: Snack[]
  /** gebackene Rezepte (Backen & Desserts) mit Datum – fürs Lernen (höchstens die letzten 200) */
  baked: { date: string; recipeId: string }[]
  /** Bewertung nach „Fertig gebacken“: Schlüssel `Datum:Rezept-ID` → 👍/🔁/👎 (fürs Lernen) */
  bakeRatings: Record<string, Rating>
  /** Backen einplanen: Tag → Backwaren (geteilt mit der Familie, siehe src/bakePlan.ts und src/sync.ts) */
  bakePlan: BakePlan
  /** Backvorschläge: angenommen/weggeklickt je Art – daraus lernt Yami, wie oft es vorschlagen darf (nur lokal) */
  bakeHints: BakeHint[]
  /** Familien-Abgleich: Stand des letzten Abgleichs, andere Personen, Hinweise (nur lokal; siehe src/sync.ts) */
  sync?: SyncLocal
  /** Einkäufe: Einkaufstag (ISO) → Entwurf/freigegeben und „Habe ich“-Antworten (geteilt, siehe src/tripState.ts) */
  trips: Record<string, TripState>
  /** Haupteinkaufstag (JS-Wochentag, 6 = Samstag); fehlt = Samstag (geteilt) */
  shopDay?: number
  /** gelernter Einkaufstag, zu dem schon gefragt wurde („übernehmen?“) – nur lokal */
  shopDayAsked?: number
  /** „Im Vorrat führen?“ beantwortet: Zutat → ja/nein – nur lokal */
  stockAsk: Record<string, 'yes' | 'no'>
}

/** Stand eines Einkaufs (Schlüssel = Einkaufstag) */
export interface TripState {
  /** freigegeben (ms) – erst dann geht die Liste an Home Assistant (Google Tasks) */
  released?: number
  /** Artikel, die bei der Freigabe auf der Liste standen (danach Hinzugekommenes = „neu seit Freigabe“) */
  sent?: string[]
  /** „Liste prüfen“: Artikel → habe ich / brauche ich */
  answers?: Record<string, 'have' | 'need'>
}

export const TRIPS_MAX = 60

/** Einkaufs-Stände prüfen (Speicher, Sicherung, Abgleich) */
export function sanitizeTrips(x: unknown): Record<string, TripState> {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return {}
  const out: Record<string, TripState> = {}
  for (const [d, v] of Object.entries(x as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).slice(-TRIPS_MAX)) {
    if (!ISO.test(d) || !v || typeof v !== 'object' || Array.isArray(v)) continue
    const t = v as Record<string, unknown>
    const st: TripState = {}
    if (isNum(t.released) && t.released > 0) st.released = t.released
    if (Array.isArray(t.sent)) st.sent = t.sent.filter((k): k is string => typeof k === 'string').slice(0, 300)
    if (t.answers && typeof t.answers === 'object' && !Array.isArray(t.answers)) {
      const a = Object.fromEntries(Object.entries(t.answers as Record<string, unknown>).filter(([k, v]) => k.length <= 80 && (v === 'have' || v === 'need'))) as TripState['answers']
      if (Object.keys(a!).length) st.answers = a
    }
    if (Object.keys(st).length) out[d] = st
  }
  return out
}

const validWeekday = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 6

/** höchstens so viele gegessene Stücke werden gespeichert */
export const SNACKS_MAX = 400

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
  prepDays: {},
  prepChecked: {},
  weighIns: [],
  adjustDecidedAt: 0,
  // immer gespeichert → daran erkennt load() einen Stand von vor der Start-Checkliste
  onboardingListSeen: false,
  rejects: [],
  ratings: {},
  ratingDismissed: [],
  portionFeedback: {},
  wasted: [],
  reviewDismissed: [],
  customRecipes: [],
  customIngredients: [],
  pantryRequests: {},
  spices: {},
  staples: {},
  snacks: [],
  baked: [],
  bakeRatings: {},
  bakePlan: {},
  bakeHints: [],
  trips: {},
  stockAsk: {},
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

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

/** Vorratsposten (auch „entnommen“-Einträge im Plan) prüfen; fehlende Id wird ergänzt, Zahlen als Text umgewandelt */
function validLot(x: unknown): PantryLot | null {
  const l = x as Partial<PantryLot> | null
  if (!l || typeof l !== 'object' || typeof l.name !== 'string' || !l.name || typeof l.unit !== 'string') return null
  const amount = typeof l.amount === 'string' ? parseFloat(l.amount) : l.amount
  if (!isNum(amount) || amount <= 1e-6 || typeof l.expires !== 'string' || !ISO.test(l.expires)) return null
  return { id: typeof l.id === 'string' && l.id ? l.id : uid(), name: l.name, amount, unit: l.unit, expires: l.expires }
}

function validEntry(e: PlanEntry, defaultServings: number): PlanEntry {
  const servings = isNum(e.servings) && e.servings >= 1 ? Math.min(12, Math.round(e.servings)) : defaultServings
  const status = e.status === 'cooked' || e.status === 'skipped' ? e.status : undefined
  const consumed = Array.isArray(e.consumed) ? e.consumed.map(validLot).filter((l): l is PantryLot => !!l) : undefined
  return { recipeId: e.recipeId, servings, ...(status ? { status } : {}), ...(consumed ? { consumed } : {}) }
}

function validWeighIn(x: unknown): x is WeighIn {
  const w = x as Partial<WeighIn> | null
  if (!w || typeof w.date !== 'string' || !ISO.test(w.date) || !isNum(w.weight) || w.weight <= 0) return false
  for (const k of ['fat', 'muscle', 'water'] as const) if (w[k] != null && !isNum(w[k])) delete w[k]
  return true
}

/** Profil: fehlende oder kaputte Pflichtwerte bekommen den Startwert (sonst wird das Kalorienziel NaN) */
function validProfile(x: unknown): Profile | undefined {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return undefined
  const p = { ...(x as Partial<Profile>) }
  const out = { ...DEFAULT_PROFILE, ...p } as Profile
  for (const k of ['age', 'heightCm', 'weightKg', 'activity', 'deficit', 'lunchKcal'] as const) if (!isNum(out[k])) out[k] = DEFAULT_PROFILE[k]
  if (out.sex !== 'm' && out.sex !== 'w') out.sex = DEFAULT_PROFILE.sex
  for (const k of ['fatPct', 'goalWeight', 'adjust'] as const) if (out[k] != null && !isNum(out[k])) delete out[k]
  return out
}

const renameKey = (n: string) => RENAMED[n] ?? n

/** Umbenennungen zusammengeführter Zutaten (RENAMED) in einem gespeicherten Stand nachziehen */
export function migrateNames(state: AppState): AppState {
  const keys = (o: Record<string, unknown>) => Object.keys(o).some((k) => k in RENAMED)
  const rekey = <T,>(o: Record<string, T>, merge: (a: T, b: T) => T): Record<string, T> => {
    if (!keys(o)) return o
    const out: Record<string, T> = {}
    for (const [k, v] of Object.entries(o)) {
      const nk = renameKey(k)
      out[nk] = nk in out ? merge(out[nk], v) : v
    }
    return out
  }
  const next = { ...state }
  // Vorrat: Menge in die Einheit des neuen Produkts umrechnen (z. B. 400 g Kalbfleisch Schnitzel → Stück)
  if (Array.isArray(next.pantry) && next.pantry.some((l) => l && l.name in RENAMED)) {
    next.pantry = next.pantry.map((l) => {
      if (!l || !(l.name in RENAMED)) return l
      const name = renameKey(l.name)
      const prod = PRODUCTS[name]
      const amount = prod && l.unit !== prod.unit ? toBase(name, l.amount, l.unit, prod) : l.amount
      return amount == null ? { ...l, name } : { ...l, name, amount, unit: prod ? prod.unit : l.unit }
    })
  }
  if (Array.isArray(next.wasted)) next.wasted = next.wasted.map((w) => (w && w.name in RENAMED ? { ...w, name: renameKey(w.name) } : w))
  if (Array.isArray(next.customRecipes))
    next.customRecipes = next.customRecipes.map((r) =>
      r && Array.isArray(r.ingredients) && r.ingredients.some((i) => i && i.name in RENAMED)
        ? {
            ...r,
            ingredients: r.ingredients.map((i) => {
              if (!i || !(i.name in RENAMED)) return i
              const name = renameKey(i.name)
              const prod = PRODUCTS[name]
              const amount = i.amount != null && prod && i.unit !== prod.unit ? toBase(name, i.amount, i.unit, prod) : i.amount
              return amount == null && i.amount != null ? { ...i, name } : { ...i, name, amount, unit: i.amount != null && prod && amount != null ? prod.unit : i.unit }
            }),
          }
        : r,
    )
  // selbst eingetragene Preise und Abhak-Stände gelten für die alte Packung/Einheit – bei umbenannten Zutaten verwerfen
  if (next.prices && typeof next.prices === 'object' && keys(next.prices)) next.prices = Object.fromEntries(Object.entries(next.prices).filter(([k]) => !(k in RENAMED)))
  if (next.pantryRequests && typeof next.pantryRequests === 'object') next.pantryRequests = rekey(next.pantryRequests, (a, b) => a + b)
  if (next.bought && typeof next.bought === 'object')
    next.bought = Object.fromEntries(
      Object.entries(next.bought).map(([w, m]) => [w, m && typeof m === 'object' ? Object.fromEntries(Object.entries(m).filter(([k]) => !(k in RENAMED))) : m]),
    )
  if (next.checked && typeof next.checked === 'object')
    next.checked = Object.fromEntries(
      Object.entries(next.checked).map(([w, ks]) => [w, Array.isArray(ks) ? ks.filter((k) => !(typeof k === 'string' && k in RENAMED)) : ks]),
    )
  if (next.ha && typeof next.ha === 'object' && next.ha.items) next.ha = { ...next.ha, items: rekey(next.ha.items, (a) => a) }
  return next
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
  // Neue Küche „Griechisch“: wer alle bisherigen Küchen gewählt hatte, soll sie ebenfalls sehen
  if (Array.isArray(state.filters.cuisines)) {
    const cs = state.filters.cuisines
    if (cs.includes('de') && cs.includes('it') && cs.includes('as') && !cs.includes('gr')) state.filters = { ...state.filters, cuisines: [...cs, 'gr'] }
  }
  // zusammengeführte Zutaten (z. B. „Tomaten reif“ → „Tomate“) umbenennen, bevor eigene Rezepte geprüft werden
  Object.assign(state, migrateNames(state))
  // Eigene Zutaten und Rezepte prüfen und eintragen, bevor der Plan geprüft wird (der Plan darf auf sie zeigen)
  state.customIngredients = state.customIngredients.filter(validIngredient)
  registerCustom(state.customIngredients, [])
  const seen = new Set<string>()
  state.customRecipes = state.customRecipes
    .map(validRecipe)
    .filter((r): r is CustomRecipe => !!r && !seen.has(r.id) && !!seen.add(r.id))
  registerCustom(state.customIngredients, state.customRecipes)
  // Vorrat & Plan-Einträge Stück für Stück prüfen (kaputte Posten würden sonst beim Abziehen/Rechnen abstürzen oder NaN liefern)
  state.pantry = state.pantry.map(validLot).filter((l): l is PantryLot => !!l)
  // Einträge zu Rezepten, die es nicht mehr gibt, entfernen
  const clean = (p: WeekPlan, servings: number) =>
    Object.fromEntries(
      Object.entries(p)
        .filter(([d, e]) => ISO.test(d) && e && typeof e === 'object' && RECIPE_BY_ID[e.recipeId])
        .map(([d, e]) => [d, validEntry(e!, servings)]),
    )
  if (!Number.isFinite(state.defaultServings) || state.defaultServings < 1) state.defaultServings = INITIAL.defaultServings
  state.defaultServings = Math.min(12, Math.round(state.defaultServings))
  state.plan = clean(state.plan, state.defaultServings)
  state.breakfast = clean(state.breakfast, 1)
  state.breakfastPicks = Object.fromEntries(
    Object.entries(state.breakfastPicks).map(([k, ids]) => [k, (Array.isArray(ids) ? ids : []).filter((id) => RECIPE_BY_ID[id])]),
  )
  state.prepDays = Object.fromEntries(
    Object.entries(state.prepDays).filter(([k, v]) => ISO.test(k) && typeof v === 'string' && ISO.test(v) && v < addDaysIso(k, 4) && v >= addDaysIso(k, -1)),
  )
  const validWaste = (w: unknown): w is WastedItem => {
    const x = w as Partial<WastedItem> | null
    return (
      !!x && typeof x.name === 'string' && typeof x.unit === 'string' && typeof x.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x.date) &&
      Number.isFinite(x.amount) && Number.isFinite(x.value)
    )
  }
  state.wasted = state.wasted.filter(validWaste).slice(-WASTED_MAX)
  state.pantryRequests = Object.fromEntries(
    Object.entries(state.pantryRequests)
      .filter(([k, v]) => typeof v === 'number' && Number.isFinite(v) && v > 0 && k.length <= 60)
      .slice(-200),
  )
  state.spices = sanitizeSpices(state.spices)
  state.staples = rememberStaples(sanitizeMemos(state.staples), Array.isArray(state.pantry) ? state.pantry : [])
  state.weighIns = state.weighIns.filter(validWeighIn).sort((a, b) => a.date.localeCompare(b.date))
  state.rejects = state.rejects.filter((r) => !!r && typeof r.id === 'string' && typeof r.date === 'string' && ISO.test(r.date)).slice(-400)
  state.ratings = Object.fromEntries(Object.entries(state.ratings).filter(([d, v]) => ISO.test(d) && (v === 'up' || v === 'again' || v === 'down')))
  state.ratingDismissed = state.ratingDismissed.filter((d) => typeof d === 'string')
  state.portionFeedback = Object.fromEntries(
    Object.entries(state.portionFeedback)
      .filter(([d, v]) => ISO.test(d) && (v === -1 || v === 0 || v === 1))
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-120),
  )
  state.bought = Object.fromEntries(
    Object.entries(state.bought)
      .filter(([, m]) => m && typeof m === 'object' && !Array.isArray(m))
      .map(([w, m]) => [w, Object.fromEntries(Object.entries(m).filter(([, b]) => !!b && typeof b.lotId === 'string' && isNum(b.amount)))]),
  )
  state.checked = Object.fromEntries(Object.entries(state.checked).map(([w, ks]) => [w, Array.isArray(ks) ? ks.filter((k) => typeof k === 'string') : []]))
  state.custom = Object.fromEntries(
    Object.entries(state.custom).map(([w, xs]) => [
      w,
      Array.isArray(xs) ? xs.filter((c) => !!c && typeof c.id === 'string' && typeof c.name === 'string' && c.cat in SHOP_LABEL) : [],
    ]),
  )
  state.prices = Object.fromEntries(Object.entries(state.prices).filter(([, p]) => !!p && isNum(p.pack) && p.pack > 0 && isNum(p.price) && p.price >= 0))
  if (state.profile) state.profile = validProfile(state.profile)
  if (!state.profile) delete state.profile
  if (typeof state.showClassicSteps !== 'boolean') delete state.showClassicSteps
  state.ha = sanitizeHa(saved.ha)
  if (!state.ha) delete state.ha
  state.sync = sanitizeSync(saved.sync)
  if (!state.sync) delete state.sync
  state.reviewDismissed = state.reviewDismissed.filter((k) => typeof k === 'string').slice(-60)
  // Backen & Desserts: gegessene Stücke, Gebackenes, Bewertungen
  state.snacks = state.snacks
    .filter((x) => !!x && typeof x.date === 'string' && ISO.test(x.date) && typeof x.name === 'string' && x.name !== '' && isNum(x.kcal) && x.kcal >= 0 && x.kcal < 5000 && isNum(x.protein) && x.protein >= 0)
    .map((x) => ({ date: x.date, name: x.name.slice(0, 80), kcal: x.kcal, protein: x.protein, ...(typeof x.recipeId === 'string' && x.recipeId ? { recipeId: x.recipeId } : {}) }))
    .slice(-SNACKS_MAX)
  state.baked = state.baked
    .filter((x) => !!x && typeof x.date === 'string' && ISO.test(x.date) && typeof x.recipeId === 'string' && !!RECIPE_BY_ID[x.recipeId])
    .map((x) => ({ date: x.date, recipeId: x.recipeId }))
    .slice(-200)
  state.bakeRatings = Object.fromEntries(
    Object.entries(state.bakeRatings)
      .filter(([k, v]) => /^\d{4}-\d{2}-\d{2}:.+/.test(k) && !!RECIPE_BY_ID[k.slice(11)] && (v === 'up' || v === 'again' || v === 'down'))
      .slice(-200),
  )
  state.bakePlan = sanitizeBakePlan(state.bakePlan)
  state.bakeHints = sanitizeBakeHints(state.bakeHints)
  // Einkäufe (Entwurf/freigegeben, „Habe ich“), Einkaufstag
  state.trips = sanitizeTrips(state.trips)
  if (!validWeekday(state.shopDay)) delete state.shopDay
  if (!validWeekday(state.shopDayAsked)) delete state.shopDayAsked
  state.stockAsk = Object.fromEntries(Object.entries(state.stockAsk).filter(([k, v]) => k.length <= 60 && (v === 'yes' || v === 'no')).slice(-200))
  state.bought = Object.fromEntries(
    Object.entries(state.bought).map(([w, m]) => [w, Object.fromEntries(Object.entries(m).map(([k, b]) => [k, typeof b.at === 'string' && ISO.test(b.at) ? b : { lotId: b.lotId, amount: b.amount }]))]),
  )
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
  // Lernen: welche Grundzutaten (und in welcher Form) im Vorrat geführt werden, merkt sich die App
  useEffect(() => {
    setState((s) => {
      const m = rememberStaples(s.staples, s.pantry)
      return m === s.staples ? s : { ...s, staples: m }
    })
  }, [state.pantry])
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
