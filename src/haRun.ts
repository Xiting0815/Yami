/**
 * Ein Home-Assistant-Lauf (ohne React, testbar): Familien-Abgleich → Schreibstab → Einkaufsliste & Kalender.
 * Einkaufsliste und Kalender werden mit dem GERADE ZUSAMMENGEFÜHRTEN Stand abgeglichen – was die andere Person
 * geplant hat, landet also im selben Lauf in Google Tasks und im Kalender (siehe Kopf von src/sync.ts).
 */
import { HaError, haErrorText } from './homeassistant'
import { type HaApi, type LocalItem, localItems, plannedDinners, plannedReminders, syncCalendar, syncTodo } from './haSync'
import { planWeek } from './kitchen'
import { portionFactor } from './learning'
import { formatAmount } from './shopping'
import { type AppState, type HaSettings, parseIso, sharingActive, weekDays } from './store'
import { LEASE_MS, type MainDoc, applyRound, familySync, hashOf, householdFeedback, leaseDecision, writeMain } from './sync'
import { defaultMonday } from './app/dates'

export function isoLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Einkaufsliste für HA: die „aktuelle“ Woche (ab Samstag die nächste) – wie in usePlanning (haWeek) */
export function haLocalFor(s: AppState, today: string): LocalItem[] {
  const key = defaultMonday(today)
  const month = new Date(today + 'T12:00:00').getMonth() + 1
  const portion = portionFactor(householdFeedback(s), today)
  const week = planWeek(s.plan, weekDays(parseIso(key)), s.pantry, s.bought[key] ?? {}, today, s.prices, formatAmount, s.breakfast, month, {
    memo: s.staples,
    spices: s.spices,
    carry: today < key,
    portion,
  })
  return localItems(week.buy)
}

export interface HaRunDeps {
  api: HaApi
  /** aktueller Stand (im Hook: zuletzt gerenderter) */
  getState: () => AppState
  setState: (fn: (s: AppState) => AppState) => void
  /** in HA abgehakt → in Yami als gekauft markieren */
  onBought: (keys: string[]) => void
  now: Date
}

export interface HaRunResult {
  /** gleich noch einmal laufen (Stab gerade übernommen, oder während des Abgleichs lokal geändert) */
  again: boolean
  error?: string
  /** dieses Gerät hat Einkaufsliste/Kalender gepflegt */
  wrote: boolean
}

type Mapping = NonNullable<MainDoc['ha']>
const mappingOf = (h: Pick<HaSettings, 'items' | 'done' | 'events'>): Mapping => ({ items: h.items, events: h.events, ...(h.done ? { done: h.done } : {}) })

/** Ein ganzer Lauf. Wirft bei Netzwerkfehlern (der Aufrufer zeigt den Fehler und versucht es später wieder). */
export async function haRound(d: HaRunDeps): Promise<HaRunResult> {
  const s0 = d.getState()
  const h0 = s0.ha
  if (!h0 || !h0.enabled || !h0.url || !h0.token) return { again: false, wrote: false }
  const now = d.now
  const today = isoLocal(now)
  const patchHa = (p: Partial<HaSettings>) => d.setState((s) => (s.ha ? { ...s, ha: { ...s.ha, ...p } } : s))
  let state = s0
  let h: HaSettings = h0
  let familyError: string | undefined
  let again = false
  let lease: { doc: MainDoc; todosStale: boolean } | null = null

  if (sharingActive(h0)) {
    const fam = await familySync(d.api, h0.syncList, s0, h0.me, now, today)
    familyError = fam.error
    state = applyRound(s0, fam.res).state
    d.setState((cur) => {
      const a = applyRound(cur, fam.res)
      if (a.stale) again = true
      return a.state
    })
    const dec = leaseDecision(fam.res.remote, h0.device, now.getTime())
    const record = (m: MainDoc) => d.setState((s) => (s.sync ? { ...s, sync: { ...s.sync, main: { device: m.device, person: m.person, t: m.t } } } : s))
    if (!dec.holder && !dec.claim) {
      // ein anderes Gerät gleicht gerade Einkaufsliste/Kalender ab
      if (fam.res.remote.main) record(fam.res.remote.main)
      patchHa({ lastSync: now.toISOString(), error: familyError ? `Nicht alles ließ sich abgleichen: ${familyError}` : undefined })
      return { again, error: familyError, wrote: false }
    }
    const mapping = dec.inherit ?? mappingOf(h0)
    const doc: MainDoc = { device: h0.device, person: h0.me, t: now.getTime(), until: now.getTime() + LEASE_MS, ha: mapping }
    if (dec.claim || dec.renew) {
      await writeMain(d.api, h0.syncList, doc)
      record(doc)
    }
    if (dec.inherit) patchHa({ items: mapping.items, done: mapping.done, events: mapping.events })
    if (dec.claim) {
      // erst im nächsten Lauf schreiben – falls ein anderes Gerät im selben Moment übernommen hat, gewinnt genau einer
      patchHa({ lastSync: now.toISOString(), error: familyError ? `Nicht alles ließ sich abgleichen: ${familyError}` : undefined })
      return { again: true, error: familyError, wrote: false }
    }
    h = { ...h0, ...mapping }
    lease = { doc: fam.res.remote.main ?? doc, todosStale: false }
  }

  // Einkaufsliste (Google Tasks) & Kalender mit dem zusammengeführten Stand
  const todo = await syncTodo(d.api, h, haLocalFor(state, today), d.onBought)
  const reminders = plannedReminders(
    { breakfastPicks: state.breakfastPicks, prepDays: state.prepDays, weighIns: state.weighIns, hasProfile: !!state.profile, pantry: state.pantry },
    now,
  )
  const cal = await syncCalendar(d.api, h, plannedDinners(state.plan, today), reminders, now)
  const error = familyError ?? todo.error ?? cal.error
  patchHa({ items: todo.items, done: todo.done, events: cal.events, lastSync: now.toISOString(), error: error ? `Nicht alles ließ sich abgleichen: ${error}` : undefined })
  // gemeinsame Zuordnungen zurück in den Schreibstab (damit das nächste Gerät sie erbt)
  if (lease) {
    const next = mappingOf({ items: todo.items, done: todo.done, events: cal.events })
    if (hashOf(lease.doc.ha ?? null) !== hashOf(next)) {
      try {
        await writeMain(d.api, h0.syncList, { ...lease.doc, device: h0.device, person: h0.me!, ha: next, until: Math.max(lease.doc.until, now.getTime() + LEASE_MS) })
      } catch (e) {
        if (e instanceof HaError && e.kind === 'network') throw e
      }
    }
  }
  return { again, error, wrote: true }
}

export { haErrorText }
