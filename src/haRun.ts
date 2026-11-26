/**
 * Ein Home-Assistant-Lauf (ohne React, testbar): Familien-Abgleich → Schreibstab → Einkaufsliste & Kalender.
 * Einkaufsliste und Kalender werden mit dem GERADE ZUSAMMENGEFÜHRTEN Stand abgeglichen – was die andere Person
 * geplant hat, landet also im selben Lauf in Google Tasks und im Kalender (siehe Kopf von src/sync.ts).
 */
import { HaError, haErrorText } from './homeassistant'
import { type Desired, type HaApi, type LocalItem, listTodo, plannedDinners, plannedReminders, syncCalendar, syncReminders, syncTodo, withReminders } from './haSync'
import type { Trip } from './kitchen'
import { type AppState, type HaSettings, sharingActive } from './store'
import { LEASE_MS, type MainDoc, PREFIX, applyRound, familySync, hashOf, leaseDecision, parseRemote, writeMain } from './sync'
import { haTripItems, tripReminderInput, tripsOf } from './tripState'
import { type PushAlert, pushAlerts } from './shortage'
import { stamp } from './haSync'

export function isoLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Einkaufsliste für HA: alle freigegebenen Einkäufe (Entwürfe nicht) – wie in usePlanning (haLocal) */
export function haLocalFor(s: AppState, today: string, trips: Trip[] = tripsOf(s, today)): LocalItem[] {
  return haTripItems(trips, s.trips, today, s.shopOrder)
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
      .map(([k, v]) => [/^rem:(prep|thaw|weigh|shop):/.test(k) ? `rem:${me}:${k.slice(4)}` : k, v] as const)
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

/** Link, den die Mitteilung öffnet */
export const APP_URL = 'https://xiting0815.github.io/Yami/'
/** Kalender-Erinnerung als Ersatz für die Sofort-Mitteilung: so weit in der Zukunft (HA prüft Kalender etwa alle 15 Min.) */
export const ALERT_LEAD_MIN = 16

/**
 * Sofort-Hinweise aufs Handy (fehlt heute/morgen etwas, Gericht verschoben) – persönlich, jedes Gerät für seine Person,
 * jeder Hinweis nur einmal (`ha.pushed`, nur lokal). Mit `ha.notify` (z. B. notify.mobile_app_s25ultra) direkt über
 * call_service; ohne als Termin im Erinnerungs-Kalender 16 Min. in der Zukunft (die HA-Automation „Yami: Erinnerung aufs
 * Handy“ schickt ihn zum Beginn – Termine, die früher beginnen, verpasst der Kalender-Auslöser evtl.).
 */
export async function sendAlerts(api: HaApi, h: Pick<HaSettings, 'notify' | 'pushed' | 'reminders'>, alerts: PushAlert[], now: Date): Promise<{ pushed: string[]; error?: string; sent: number; net?: HaError }> {
  const pushed = [...(h.pushed ?? [])]
  let error: string | undefined
  let sent = 0
  // Netz weg: das bisher Gesendete zurückgeben (`net`), damit kein Hinweis beim nächsten Lauf doppelt kommt
  let net: HaError | undefined
  for (const a of alerts) {
    if (pushed.includes(a.key)) continue
    try {
      if (h.notify) {
        await api.callService('notify', h.notify.slice('notify.'.length), { title: a.title, message: a.message, data: { channel: 'Yami', tag: 'yami-alert', clickAction: APP_URL } })
      } else {
        const start = new Date(now.getTime() + ALERT_LEAD_MIN * 60_000)
        await api.callService('calendar', 'create_event', { summary: a.title, description: a.message, start_date_time: stamp(start), end_date_time: stamp(new Date(start.getTime() + 15 * 60_000)) }, { entity_id: h.reminders })
      }
      pushed.push(a.key)
      sent++
    } catch (e) {
      if (e instanceof HaError && e.kind === 'network') {
        net = e
        break
      }
      error ??= e instanceof Error ? e.message : String(e)
    }
  }
  return { pushed: pushed.slice(-60), error, sent, ...(net ? { net } : {}) }
}

/** so lange gilt ein Haushalt nach dem letzten Lebenszeichen seines Schreibstabs als aktiv */
export const HOUSEHOLD_STALE_MS = 14 * 86400_000

/**
 * Ist auf einem ANDEREN Gerät „Familie teilen“ aktiv? (Schreibstab `yami:v1:main` in der Sync-Liste, von einem anderen
 * Gerät, in den letzten 14 Tagen.) Günstig: genau ein todo/item/list der Sync-Liste. Fehlt die Liste oder klappt das
 * Lesen nicht (außer Netzwerk) → kein Haushalt, alles wie bisher.
 */
export async function otherHousehold(api: HaApi, h: Pick<HaSettings, 'syncList' | 'device'>, now: number): Promise<{ person: string; t: number } | null> {
  let todos
  try {
    todos = await listTodo(api, h.syncList)
  } catch (e) {
    if (e instanceof HaError && e.kind === 'network') throw e
    return null
  }
  if (!todos.some((t) => t.summary === PREFIX + 'main')) return null
  const main = parseRemote(todos.filter((t) => t.summary === PREFIX + 'main')).main
  if (!main || main.device === h.device || now - Math.max(main.t, main.until) > HOUSEHOLD_STALE_MS) return null
  return { person: main.person, t: main.t }
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
  const remindersOf = (state: AppState, trips: Trip[]) =>
    plannedReminders(
      { breakfastPicks: state.breakfastPicks, prepDays: state.prepDays, weighIns: state.weighIns, hasProfile: !!state.profile, pantry: state.pantry, trips: tripReminderInput(trips, state.trips, today) },
      now,
    )

  // ── ohne Familie teilen: wie bisher alles auf diesem Gerät ──
  if (!sharingActive(h0)) {
    const trips0 = tripsOf(s0, today)
    // Im Haushalt ist auf einem anderen Gerät „Familie teilen“ an → dieses Gerät hat womöglich einen alten Plan und
    // darf Google Tasks und den Abendessen-Kalender nicht anfassen (das macht der Schreibstab). Nur rein persönliche
    // Erinnerungen (Meal-Prep, Auftauen, Wiegen). Nichts, was am geteilten Plan/Vorrat/Einkauf hängt (Läuft ab,
    // Einkauf freigeben, „Heute fehlt …“) – das wäre hier alter Stand. Die App zeigt einen Hinweis zum Einschalten.
    const other = await otherHousehold(d.api, h0, now.getTime())
    if (other) {
      const isPersonal = (k: string) => /^rem:(prep|thaw|weigh):/.test(k)
      const own = Object.fromEntries(Object.entries(h0.events).filter(([k]) => isPersonal(k)))
      const per = await syncReminders(d.api, h0.reminders, own, remindersOf(s0, trips0).filter((r) => isPersonal(r.key)), now)
      const rest = Object.fromEntries(Object.entries(h0.events).filter(([k]) => !isPersonal(k)))
      patchHa({ events: { ...rest, ...per.events }, otherShare: other, lastSync: now.toISOString(), error: errText(per.error) })
      if (per.net) throw per.net
      return { again: false, error: per.error, wrote: false }
    }
    // Schritt für Schritt merken: bricht das Netz mitten im Lauf ab, wird beim nächsten Mal nichts doppelt angelegt/geschickt
    const todo = await syncTodo(d.api, h0, haLocalFor(s0, today, trips0), d.onBought)
    patchHa({ items: todo.items, done: todo.done })
    const rem = await syncReminders(d.api, h0.reminders, h0.events, remindersOf(s0, trips0), now)
    const events1 = withReminders(h0.events, rem.events)
    patchHa({ events: events1 })
    if (rem.net) throw rem.net
    const cal = await syncCalendar(d.api, { ...h0, events: events1 }, plannedDinners(s0.plan, today, s0.bakePlan), [], now)
    patchHa({ events: cal.events })
    const push = await sendAlerts(d.api, h0, pushAlerts(s0, today, now, trips0), now)
    if (push.net) {
      patchHa({ pushed: push.pushed })
      throw push.net
    }
    const error = todo.error ?? rem.error ?? cal.error ?? push.error
    patchHa({ items: todo.items, done: todo.done, events: cal.events, pushed: push.pushed, otherShare: undefined, lastSync: now.toISOString(), error: errText(error) })
    return { again: false, error, wrote: true }
  }

  // ── Familie teilen ──
  const me = h0.me
  if (h0.otherShare) patchHa({ otherShare: undefined })
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
  const trips = tripsOf(state, today)
  const { personal, shared } = splitReminders(remindersOf(state, trips), me)

  // persönliche Erinnerungen: jedes Gerät für seine Person, unabhängig vom Schreibstab (nie fremde anfassen)
  const per = await syncReminders(d.api, h0.reminders, personalOf(h0.events, me), personal, now)
  error ??= per.error
  const withPersonal = (events: HaSettings['events']) => ({ ...Object.fromEntries(Object.entries(events).filter(([k]) => !k.startsWith(`rem:${me}:`))), ...per.events })
  // gleich merken (ein Netzfehler weiter unten soll keine Erinnerung doppelt anlegen lassen)
  if (per.changed || per.net) patchHa({ events: withPersonal(d.getState().ha?.events ?? h0.events) })
  if (per.net) throw per.net
  // Sofort-Hinweise: auch persönlich (jedes Gerät seiner Person), unabhängig vom Schreibstab
  const push = await sendAlerts(d.api, h0, pushAlerts(state, today, now, trips), now)
  error ??= push.error
  if (push.sent) patchHa({ pushed: push.pushed })
  if (push.net) throw push.net

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
  const todo = await syncTodo(d.api, h, haLocalFor(state, today, trips), d.onBought)
  const rem = await syncReminders(d.api, h0.reminders, h.events, shared, now)
  const events1 = withReminders(h.events, rem.events)
  if (rem.net) {
    // schon angelegte „Läuft morgen ab“ merken (Zuordnung im Stab folgt beim nächsten Lauf)
    patchHa({ items: todo.items, done: todo.done, events: withPersonal(Object.fromEntries(Object.entries(events1).filter(([k]) => isShared(k)))) })
    throw rem.net
  }
  const cal = await syncCalendar(d.api, { ...h, events: events1 }, plannedDinners(state.plan, today, state.bakePlan), [], now)
  error ??= todo.error ?? rem.error ?? cal.error
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
