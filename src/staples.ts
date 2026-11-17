/**
 * Grundzutaten (Kategorie "vorrat"): Mengen-Grundzutaten und Gewürze.
 *
 * – Mengen-Grundzutaten (Öl, Brühe, Mehl, Zucker, Saucen …) liegen wie jede Zutat mit Menge im Vorrat und werden beim
 *   Kochen abgezogen. Brühe gibt es als Pulver, Würfel oder flüssig – alles in ml fertiger Brühe.
 * – Gewürze haben nur einen Status: „da“ oder „alle“.
 *
 * Rein rechnerische Hilfen (ohne Zugriff auf die App): Merken der zuletzt gekauften Brühen-Form, Verbrauch aus den
 * gekochten Gerichten lernen und abschätzen, wann etwas leer ist.
 */
import { BROTH_FORMS, CATALOG, SHOP_ALIAS, SPICES } from './data/catalog'
import { PRODUCTS } from './data/products'
import type { WeekPlan } from './types'

export type SpiceStatus = 'da' | 'alle'

/** nur der Name zählt – dieselbe Zusammenfassung wie `canonical` in kitchen.ts (ohne Zyklus) */
const canon = (n: string) => SHOP_ALIAS[n] ?? n

export const isSpice = (name: string) => SPICES.has(name)
/** Mengen-Grundzutat: Kategorie "vorrat", aber kein Gewürz */
export const isQtyStaple = (name: string) => CATALOG[name] === 'vorrat' && !SPICES.has(name)
export const isStaple = (name: string) => CATALOG[name] === 'vorrat'

const BASE_OF = new Map<string, string>()
for (const [base, forms] of Object.entries(BROTH_FORMS)) for (const f of forms) BASE_OF.set(f, base)

/** Brühen: Pulver, Würfel und flüssig zählen als dieselbe Grundzutat (Schlüssel = Rezeptname) */
export const stapleKey = (name: string) => BASE_OF.get(name) ?? name
export const isBrothBase = (name: string) => name in BROTH_FORMS
export const brothForms = (base: string) => BROTH_FORMS[base] ?? []

/** alle Gewürze mit eigener Packung (Varianten wie „Pfeffer schwarz grob“ stehen unter „Pfeffer“) */
export const SPICE_NAMES: string[] = [...SPICES].filter((n) => canon(n) === n && PRODUCTS[n]).sort((a, b) => a.localeCompare(b, 'de'))

/** Einkaufslisten-Abschnitt für gekaufte Grundzutaten */
export const STAPLE_SHOP_CAT = 'konserven' as const

// ───────────── Standardmengen ─────────────

/** Menge in der Packungseinheit, die eine Zeile ohne Mengenangabe (z. B. „Olivenöl“ zum Braten) abzieht */
const DEFAULTS: Record<string, number> = {
  Olivenöl: 15, Sonnenblumenöl: 15, Sesamöl: 5, Kürbiskernöl: 5, Leinöl: 5,
  Weizenmehl: 5, Zucker: 5, Puderzucker: 5, Honig: 5, Speisestärke: 5, Backpulver: 0, Vanillezucker: 0,
}

export function defaultAmount(name: string): number {
  const d = DEFAULTS[name]
  if (d != null) return d
  const p = PRODUCTS[name]
  if (!p || isBrothBase(name) || stapleKey(name) !== name) return 0
  // Saucen, Senf, Essig, Ketchup: ein Spritzer / Klecks
  return p.unit === 'ml' || p.unit === 'g' ? 5 : 0
}

// ───────────── Gemerkte Form (gelernt) ─────────────

/** je Grundzutat: zuletzt im Vorrat gehabte Form und welche Formen gerade im Vorrat liegen */
export interface StapleMemo {
  form: string
  present: string[]
}
export type StapleMemos = Record<string, StapleMemo>

interface LotLike {
  name: string
  amount: number
}

/**
 * Merkt sich, welche Grundzutaten du im Vorrat führst und in welcher Form (Brühe: Pulver/Würfel/flüssig).
 * Eine neu im Vorrat aufgetauchte Form wird zur bevorzugten. Gibt dieselbe Referenz zurück, wenn sich nichts ändert.
 */
export function rememberStaples(memo: StapleMemos, lots: LotLike[]): StapleMemos {
  const now = new Map<string, string[]>()
  for (const l of lots) {
    if (!isQtyStaple(l.name) || l.amount <= 1e-6) continue
    const k = stapleKey(l.name)
    const cur = now.get(k) ?? []
    if (!cur.includes(l.name)) cur.push(l.name)
    now.set(k, cur)
  }
  const next: StapleMemos = { ...memo }
  for (const [k, names] of now) {
    const prev = memo[k]
    const added = names.filter((n) => !prev?.present.includes(n))
    const form = added.length ? added[added.length - 1] : prev && names.includes(prev.form) ? prev.form : names[0]
    next[k] = { form, present: names }
  }
  for (const [k, m] of Object.entries(memo)) if (!now.has(k) && m.present.length) next[k] = { form: m.form, present: [] }
  return JSON.stringify(next) === JSON.stringify(memo) ? memo : next
}

/** Habe ich diese Grundzutat schon einmal geführt (Vorrat oder gemerkt)? */
export function isTrackedStaple(key: string, lots: LotLike[], memo: StapleMemos): boolean {
  return !!memo[key] || lots.some((l) => stapleKey(l.name) === key)
}

/** Produkt, das gekauft wird: bei Brühe die zuletzt geführte Form, sonst Pulver; sonst die Zutat selbst */
export function buyName(key: string, memo: StapleMemos): string {
  if (!isBrothBase(key)) return key
  const m = memo[key]?.form
  return m && brothForms(key).includes(m) ? m : `${key} Pulver`
}

// ───────────── Verbrauch lernen ─────────────

export interface UseEvent {
  date: string
  key: string
  amount: number
}

/** Abgezogene Mengen von Mengen-Grundzutaten aus gekochten Gerichten (Tag + Menge) */
export function useEvents(...plans: WeekPlan[]): UseEvent[] {
  const out: UseEvent[] = []
  for (const plan of plans)
    for (const [date, e] of Object.entries(plan)) {
      if (!e || e.status !== 'cooked') continue
      for (const c of e.consumed ?? []) if (isQtyStaple(c.name)) out.push({ date, key: stapleKey(c.name), amount: c.amount })
    }
  return out
}

const dayNum = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / 86400000)
}
export const daysBetween = (a: string, b: string) => dayNum(b) - dayNum(a)

/** so weit schaut die Verbrauchsschätzung zurück / so kurz ist die Messspanne mindestens */
export const USE_WINDOW = 42
export const USE_MIN_SPAN = 14
/** „bald leer“: reicht höchstens so viele Tage … */
export const LOW_DAYS = 7
/** … oder ist weniger als dieser Anteil einer Packung übrig */
export const LOW_SHARE = 0.15

/** Verbrauch pro Tag (aus den letzten 6 Wochen; mindestens zwei Kochtage nötig), sonst null */
export function useRate(events: UseEvent[], key: string, today: string): number | null {
  const ev = events.filter((e) => e.key === key && e.date <= today && daysBetween(e.date, today) <= USE_WINDOW)
  if (new Set(ev.map((e) => e.date)).size < 2) return null
  const first = ev.reduce((m, e) => (e.date < m ? e.date : m), ev[0].date)
  const span = Math.min(USE_WINDOW, Math.max(USE_MIN_SPAN, daysBetween(first, today) + 1))
  return ev.reduce((s, e) => s + e.amount, 0) / span
}

/** In wie vielen Tagen ist es voraussichtlich leer? null = unbekannt */
export function daysUntilEmpty(amount: number, rate: number | null): number | null {
  if (rate == null || rate <= 1e-9) return null
  return amount / rate
}

/** Läuft die Grundzutat bald aus (≤ 7 Tage oder < 15 % einer Packung)? */
export function runningLow(amount: number, pack: number, rate: number | null): boolean {
  const left = daysUntilEmpty(amount, rate)
  if (left != null && left <= LOW_DAYS) return true
  // fast leer; ganz leer nur, wenn sie zuletzt noch benutzt wurde (sonst nicht ständig nachfragen)
  return amount < LOW_SHARE * pack && (amount > 1e-6 || rate != null)
}

/** „reicht noch ca. 10 Tage“ */
export function lastsText(days: number): string {
  if (days < 1) return 'reicht nur noch ca. 1 Tag'
  const d = Math.round(days)
  if (d <= 1) return 'reicht nur noch ca. 1 Tag'
  if (d >= 60) return `reicht noch ca. ${Math.round(d / 30)} Monate`
  if (d >= 21) return `reicht noch ca. ${Math.round(d / 7)} Wochen`
  return `reicht noch ca. ${d} Tage`
}

export interface StapleHint {
  key: string
  amount: number
  days: number
  text: string
  low: boolean
}

/** Hinweise für den Vorrat: wie lange reicht welche Grundzutat noch (nur mit gelerntem Verbrauch) */
export function stapleHints(events: UseEvent[], lots: LotLike[], today: string): Record<string, StapleHint> {
  const sums = new Map<string, number>()
  for (const l of lots) if (isQtyStaple(l.name)) sums.set(stapleKey(l.name), (sums.get(stapleKey(l.name)) ?? 0) + l.amount)
  const out: Record<string, StapleHint> = {}
  for (const [key, amount] of sums) {
    const days = daysUntilEmpty(amount, useRate(events, key, today))
    if (days == null) continue
    out[key] = { key, amount, days, text: lastsText(days), low: days <= LOW_DAYS }
  }
  return out
}

// ───────────── Gewürz abhaken ─────────────

/**
 * Gewürz auf der Einkaufsliste abhaken: es ist wieder „da“ (kein Vorratsposten, nur der Status), der Haken bleibt über
 * `bought` sichtbar. Nochmal antippen macht es wieder zu „alle“.
 */
export function toggleSpiceBought(
  spices: Record<string, SpiceStatus>,
  bought: Record<string, { lotId: string; amount: number }>,
  name: string,
  pack: number,
): { spices: Record<string, SpiceStatus>; bought: Record<string, { lotId: string; amount: number }>; on: boolean } {
  const b = { ...bought }
  const sp = { ...spices }
  if (b[name]) {
    delete b[name]
    sp[name] = 'alle'
    return { spices: sp, bought: b, on: false }
  }
  b[name] = { lotId: 'spice:' + name, amount: pack }
  sp[name] = 'da'
  return { spices: sp, bought: b, on: true }
}

// ───────────── Anzeige ─────────────

/** Menge in der Packungseinheit freundlich: „ca. 5 l“ statt „5000 ml“ */
export function roughAmount(amount: number, unit: string): string {
  const r = (v: number, step: number) => String(Math.round(v / step) * step).replace('.', ',')
  if (unit === 'ml' || unit === 'g') {
    const big = unit === 'ml' ? 'l' : 'kg'
    if (amount >= 1000) return `ca. ${String(Math.round(amount / 100) / 10).replace('.', ',')} ${big}`
    return `ca. ${r(amount, amount >= 200 ? 50 : 10)} ${unit}`
  }
  return `ca. ${r(amount, 1)} ${unit}`
}

// ───────────── gespeicherte Stände prüfen ─────────────

export function sanitizeSpices(x: unknown): Record<string, SpiceStatus> {
  const out: Record<string, SpiceStatus> = {}
  if (!x || typeof x !== 'object' || Array.isArray(x)) return out
  for (const [k, v] of Object.entries(x)) {
    const name = canon(k)
    if (SPICES.has(name) && PRODUCTS[name] && (v === 'da' || v === 'alle')) out[name] = v
  }
  return out
}

export function sanitizeMemos(x: unknown): StapleMemos {
  const out: StapleMemos = {}
  if (!x || typeof x !== 'object' || Array.isArray(x)) return out
  for (const [k, v] of Object.entries(x)) {
    const m = v as Partial<StapleMemo> | null
    if (!m || typeof m.form !== 'string' || !Array.isArray(m.present)) continue
    if (!isQtyStaple(k) || stapleKey(m.form) !== k || !PRODUCTS[m.form]) continue
    out[k] = { form: m.form, present: m.present.filter((n): n is string => typeof n === 'string' && stapleKey(n) === k) }
  }
  return out
}
