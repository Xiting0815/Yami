import { useEffect, useState } from 'react'
import { RECIPE_BY_ID } from './data/recipes'
import type { Cuisine, DishType, ShopCat, WeekPlan } from './types'
import type { BoughtMap, PantryLot, PriceOverrides } from './kitchen'
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
}

const hasData = (s: AppState) =>
  !!s.profile || [s.plan, s.breakfast, s.breakfastPicks].some((o) => o && Object.values(o).some((v) => (Array.isArray(v) ? v.length : v)))

/** Stand aus beliebigen Daten (localStorage oder Sicherungsdatei) machen: falsche Typen verwerfen, Rezepte ohne Eintrag entfernen */
export function sanitize(parsed: unknown): AppState {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return INITIAL
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
  // Einträge zu Rezepten, die es nicht mehr gibt, entfernen
  const clean = (p: WeekPlan) => Object.fromEntries(Object.entries(p).filter(([, e]) => e && RECIPE_BY_ID[e.recipeId]))
  state.plan = clean(state.plan)
  state.breakfast = clean(state.breakfast)
  state.breakfastPicks = Object.fromEntries(
    Object.entries(state.breakfastPicks).map(([k, ids]) => [k, (Array.isArray(ids) ? ids : []).filter((id) => RECIPE_BY_ID[id])]),
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

function isoWeekNumber(d: Date): number {
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
