/**
 * Ein Home-Assistant-Lauf (ohne React, testbar): Familien-Abgleich → Schreibstab → Einkaufsliste & Kalender.
 * Einkaufsliste und Kalender werden mit dem GERADE ZUSAMMENGEFÜHRTEN Stand abgeglichen – was die andere Person
 * geplant hat, landet also im selben Lauf in Google Tasks und im Kalender (siehe Kopf von src/sync.ts).
 */
import { HaError, haErrorText } from './homeassistant'
import { type Desired, type HaApi, type LocalItem, localItems, plannedDinners, plannedReminders, syncCalendar, syncReminders, syncTodo } from './haSync'
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
/** gemeinsame Zuordnungen im Schreibstab: Einkaufsliste, Abendessen-Termine, Ablauf-Erinnerungen (Vorrat ist geteilt) */
const isShared = (k: string) => k.startsWith('dinner:') || k.startsWith('rem:exp:')
const mappingOf = (h: Pick<HaSettings, 'items' | 'done' | 'events'>): Mapping => ({
  items: h.items,
  events: Object.fromEntries(Object.entries(h.events).filter(([k]) => isShared(k))),
  ...(h.done ? { done: h.done } : {}),
})
/** persönliche Erinnerungen dieses Geräts; frühere Schlüssel ohne Person (vor „Familie teilen“) zählen als eigene → nichts doppelt */
const personalOf = (events: HaSettings['events'], me: string) =>
  Object.fromEntries(
    Object.entries(events)
      .map(([k, v]) => [/^rem:(prep|thaw|weigh):/.test(k) ? `rem:${me}:${k.slice(4)}` : k, v] as const)
      .filter(([k]) => k.startsWith(`rem:${me}:`)),
  )

/**
 * Erinnerungen aufteilen (Familie teilen): Meal-Prep, Auftauen, Wiegen gehören der Person dieses Geräts
 * (Schlüssel `rem:<Person>:…`, nur lokal gemerkt, unabhängig vom Schreibstab); „läuft morgen ab“ betrifft den
 * geteilten Vorrat → pflegt nur der Halter des Schreibstabs (Schlüssel `rem:exp:…`, Zuordnung im Stab).
 */
export function splitReminders(all: Desired[], me: string): { personal: Desired[]; shared: Desired[] } {
  return {
    shared: all.filter((r) => r.key.startsWith('rem:exp:')),
    personal: all.filter((r) => !r.key.startsWith('rem:exp:')).map((r) => ({ ...r, key: `rem:${me}:${r.key.slice(4)}` })),
  }
}

/** Ein ganzer Lauf. Wirft bei Netzwerkfehlern (der Aufrufer zeigt den Fehler und versucht es später wieder). */
export async function haRound(d: HaRunDeps): Promise<HaRunResult> {
  const s0 = d.getState()
  const h0 = s0.ha
  if (!h0 || !h0.enabled || !h0.url || !h0.token) return { again: false, wrote: false }
  const now = d.now
  const today = isoLocal(now)
  const patchHa = (p: Partial<HaSettings>) => d.setState((s) => (s.ha ? { ...s, ha: { ...s.ha, ...p } } : s))
  const errText = (e?: string) => (e ? `Nicht alles ließ sich abgleichen: ${e}` : undefined)
  const remindersOf = (state: AppState) =>
    plannedReminders({ breakfastPicks: state.breakfastPicks, prepDays: state.prepDays, weighIns: state.weighIns, hasProfile: !!state.profile, pantry: state.pantry }, now)

  // ── ohne Familie teilen: wie bisher alles auf diesem Gerät ──
  if (!sharingActive(h0)) {
    const todo = await syncTodo(d.api, h0, haLocalFor(s0, today), d.onBought)
    const cal = await syncCalendar(d.api, h0, plannedDinners(s0.plan, today), remindersOf(s0), now)
    const error = todo.error ?? cal.error
    patchHa({ items: todo.items, done: todo.done, events: cal.events, lastSync: now.toISOString(), error: errText(error) })
    return { again: false, error, wrote: true }
  }

  // ── Familie teilen ──
  const me = h0.me
  const fam = await familySync(d.api, h0.syncList, s0, me, now, today)
  let error = fam.error
  const state = applyRound(s0, fam.res).state
  let again = false
  d.setState((cur) => {
    const a = applyRound(cur, fam.res)
    if (a.stale) again = true
    return a.state
  })
  const record = (m: MainDoc) => d.setState((s) => (s.sync ? { ...s, sync: { ...s.sync, main: { device: m.device, person: m.person, t: m.t } } } : s))
  const { personal, shared } = splitReminders(remindersOf(state), me)

  // persönliche Erinnerungen: jedes Gerät für seine Person, unabhängig vom Schreibstab (nie fremde anfassen)
  const per = await syncReminders(d.api, h0.reminders, personalOf(h0.events, me), personal, now)
  error ??= per.error
  const withPersonal = (events: HaSettings['events']) => ({ ...Object.fromEntries(Object.entries(events).filter(([k]) => !k.startsWith(`rem:${me}:`))), ...per.events })

  const dec = leaseDecision(fam.res.remote, h0.device, now.getTime())
  if (!dec.holder && !dec.claim) {
    // ein anderes Gerät pflegt gerade Einkaufsliste/Abendessen-Kalender
    if (fam.res.remote.main) record(fam.res.remote.main)
    patchHa({ events: withPersonal(h0.events), lastSync: now.toISOString(), error: errText(error) })
    return { again, error, wrote: false }
  }
  const mapping = dec.inherit ? { ...dec.inherit, events: Object.fromEntries(Object.entries(dec.inherit.events ?? {}).filter(([k]) => isShared(k))) } : mappingOf(h0)
  const doc: MainDoc = { device: h0.device, person: me, t: now.getTime(), until: now.getTime() + LEASE_MS, ha: mapping }
  if (dec.claim || dec.renew) {
    await writeMain(d.api, h0.syncList, doc)
    record(doc)
  }
  if (dec.claim) {
    // erst im nächsten Lauf schreiben – falls ein anderes Gerät im selben Moment übernommen hat, gewinnt genau einer
    const local = Object.fromEntries(Object.entries(h0.events).filter(([k]) => !isShared(k)))
    patchHa({ ...(dec.inherit ? { items: mapping.items, done: mapping.done } : {}), events: withPersonal({ ...local, ...(dec.inherit ? mapping.events : mappingOf(h0).events) }), lastSync: now.toISOString(), error: errText(error) })
    return { again: true, error, wrote: false }
  }

  // Schreibstab: Einkaufsliste (Google Tasks), Abendessen im Familienkalender, Ablauf-Erinnerungen – mit dem zusammengeführten Stand
  const h: HaSettings = { ...h0, items: mapping.items, done: mapping.done, events: mapping.events }
  const todo = await syncTodo(d.api, h, haLocalFor(state, today), d.onBought)
  const cal = await syncCalendar(d.api, h, plannedDinners(state.plan, today), shared, now)
  error ??= todo.error ?? cal.error
  const sharedEvents = Object.fromEntries(Object.entries(cal.events).filter(([k]) => isShared(k)))
  patchHa({ items: todo.items, done: todo.done, events: withPersonal(sharedEvents), lastSync: now.toISOString(), error: errText(error) })
  const next = mappingOf({ items: todo.items, done: todo.done, events: sharedEvents })
  const lease = fam.res.remote.main ?? doc
  if (hashOf(lease.ha ?? null) !== hashOf(next)) {
    try {
      await writeMain(d.api, h0.syncList, { ...lease, device: h0.device, person: me, ha: next, until: Math.max(lease.until, now.getTime() + LEASE_MS) })
    } catch (e) {
      if (e instanceof HaError && e.kind === 'network') throw e
    }
  }
  return { again, error, wrote: true }
}

export { haErrorText }
