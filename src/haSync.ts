/**
 * Abgleich mit Home Assistant: Einkaufsliste (todo), Erinnerungen und Plan (Kalender).
 * Die Entscheidungen stehen in reinen Funktionen (diffTodo, plannedReminders, diffDinnerEvents) – testbar ohne Netz.
 */
import { RECIPE_BY_ID } from './data/recipes'
import { assignBreakfasts, mondayIso, prepPlan, resolvePrepDay } from './breakfast'
import { HaError } from './homeassistant'
import { addDaysIso } from './kitchen'
import type { PantryLot } from './kitchen'
import { weighedThisWeek, type WeighIn } from './progress'
import { forDaysText, formatAmount, isBought, missingPacks, packText, scale } from './shopping'
import { type HaSettings, isoDate, parseIso, weekDays } from './store'
import type { BuyItem } from './kitchen'
import type { WeekPlan } from './types'

/** Markierung in der Beschreibung: nur Einträge damit gehören Yami */
export const MARKER = 'Yami'

// ───────────── Einkaufsliste ─────────────

export interface LocalItem {
  key: string
  summary: string
  bought: boolean
}
export interface RemoteTodo {
  uid: string
  summary: string
  status: 'needs_action' | 'completed'
  description?: string | null
}

/** "Rinderhackfleisch – 500 g" */
export function todoSummary(it: BuyItem, trip?: string): string {
  const partly = !isBought(it) && it.bought > 0
  const amt = partly ? `noch ${missingPacks(it)} ${it.product.packName ?? 'Stk'}` : packText(it)
  const base = amt ? `${it.name} – ${amt}` : it.name
  // Einkauf: Tag des Einkaufs („(Sa)“, „(Mi)“, „(heute)“)
  if (trip) return `${base} (${trip})`
  // ab Samstag: Bedarf für Sa/So der laufenden Woche kenntlich machen
  return it.forDays?.length ? `${base} (${forDaysText(it)})` : base
}

/** Was Yami in die HA-Liste schicken will: alle Artikel der Woche (Vorrat-prüfen-Zutaten und eigene Artikel nicht) */
export function localItems(buy: BuyItem[]): LocalItem[] {
  return buy.map((b) => ({ key: b.key, summary: todoSummary(b), bought: isBought(b) }))
}

export interface TodoDiff {
  add: LocalItem[]
  rename: { uid: string; key: string; summary: string }[]
  /** in Yami abgehakt → in HA erledigen */
  complete: { uid: string; key: string }[]
  /** in Yami wieder abgewählt → in HA wieder öffnen */
  reopen: { uid: string; key: string }[]
  /** nicht mehr nötig (nur Yami-Einträge, die noch offen sind) */
  remove: { uid: string }[]
  /** in HA abgehakt → in Yami als gekauft markieren */
  bought: string[]
  /** neue Zuordnung Schlüssel → uid (neue Einträge ergänzt der Aufrufer nach dem Anlegen) */
  items: Record<string, string>
  done: string[]
}

export function diffTodo(local: LocalItem[], remote: RemoteTodo[], map: Record<string, string>, done: string[] = []): TodoDiff {
  const mapUids = new Set(Object.values(map))
  const isYami = (r: RemoteTodo) => (r.description ?? '').trim() === MARKER || mapUids.has(r.uid)
  const yami = remote.filter(isYami)
  const byUid = new Map(yami.map((r) => [r.uid, r]))
  const claimed = new Set<string>()
  const out: TodoDiff = { add: [], rename: [], complete: [], reopen: [], remove: [], bought: [], items: {}, done: [] }
  const wasDone = new Set(done)

  // erst die sicheren Zuordnungen über die gemerkte uid, dann der Rest über gleichen Text
  const found = new Map<string, RemoteTodo>()
  for (const l of local) {
    const r = byUid.get(map[l.key])
    if (r && !claimed.has(r.uid)) {
      found.set(l.key, r)
      claimed.add(r.uid)
    }
  }
  for (const l of local) {
    if (found.has(l.key)) continue
    const r = yami.find((x) => !claimed.has(x.uid) && x.status === 'needs_action' && x.summary === l.summary)
    if (r) {
      found.set(l.key, r)
      claimed.add(r.uid)
    }
  }

  for (const l of local) {
    const r = found.get(l.key)
    if (!r) {
      if (!l.bought) out.add.push(l) // Gekauftes nicht mehr in HA anlegen
      continue
    }
    out.items[l.key] = r.uid
    let isDone = r.status === 'completed'
    if (r.status === 'completed') {
      if (l.bought) {
        /* beides erledigt */
      } else if (wasDone.has(l.key)) {
        out.reopen.push({ uid: r.uid, key: l.key }) // in Yami wieder abgewählt
        isDone = false
      } else {
        out.bought.push(l.key) // in HA abgehakt
      }
    } else {
      if (l.bought) {
        out.complete.push({ uid: r.uid, key: l.key })
        isDone = true
      }
      if (!l.bought && r.summary !== l.summary) out.rename.push({ uid: r.uid, key: l.key, summary: l.summary })
    }
    if (isDone) out.done.push(l.key)
  }

  for (const r of yami) {
    if (claimed.has(r.uid)) continue
    if (r.status === 'needs_action') out.remove.push({ uid: r.uid })
  }
  return out
}

/** Minimale Schnittstelle zum Client – so lässt sich der Abgleich mit einer Attrappe testen */
export interface HaApi {
  command<T = unknown>(msg: Record<string, unknown>): Promise<T>
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>, returnResponse?: boolean): Promise<unknown>
  subscribe(msg: Record<string, unknown>, cb: (event: unknown) => void): Promise<() => void>
}

export async function listTodo(api: HaApi, entity: string): Promise<RemoteTodo[]> {
  const res = await api.command<{ items?: RemoteTodo[] } | RemoteTodo[]>({ type: 'todo/item/list', entity_id: entity })
  const items = Array.isArray(res) ? res : res?.items ?? []
  return items.map((i) => ({ uid: String(i.uid), summary: String(i.summary ?? ''), status: i.status === 'completed' ? 'completed' : 'needs_action', description: i.description ?? null }))
}

export interface TodoSyncResult {
  items: Record<string, string>
  done: string[]
  error?: string
  changed: number
}

/** Einkaufsliste abgleichen. `onBought` bekommt die Schlüssel, die in HA abgehakt wurden. */
export async function syncTodo(
  api: HaApi,
  ha: Pick<HaSettings, 'todo' | 'items' | 'done'>,
  local: LocalItem[],
  onBought: (keys: string[]) => void,
): Promise<TodoSyncResult> {
  const target = { entity_id: ha.todo }
  const remote = await listTodo(api, ha.todo)
  const d = diffTodo(local, remote, ha.items, ha.done ?? [])
  let error: string | undefined
  let changed = 0
  const attempt = async (fn: () => Promise<unknown>) => {
    try {
      await fn()
      changed++
    } catch (e) {
      if (e instanceof HaError && e.kind === 'network') throw e
      error ??= e instanceof Error ? e.message : String(e)
    }
  }

  for (const r of d.rename) await attempt(() => api.callService('todo', 'update_item', { item: r.uid, rename: r.summary }, target))
  for (const r of d.complete) await attempt(() => api.callService('todo', 'update_item', { item: r.uid, status: 'completed' }, target))
  for (const r of d.reopen) await attempt(() => api.callService('todo', 'update_item', { item: r.uid, status: 'needs_action' }, target))
  for (const r of d.remove) await attempt(() => api.callService('todo', 'remove_item', { item: r.uid }, target))

  let added = 0
  for (const l of d.add) {
    await attempt(async () => {
      try {
        await api.callService('todo', 'add_item', { item: l.summary, description: MARKER }, target)
      } catch (e) {
        // manche Listen kennen keine Beschreibung → ohne anlegen, die Zuordnung läuft dann nur über die gemerkte uid
        if (e instanceof HaError && e.kind === 'network') throw e
        await api.callService('todo', 'add_item', { item: l.summary }, target)
      }
      added++
    })
  }
  if (added) {
    const known = new Set(remote.map((r) => r.uid))
    const fresh = (await listTodo(api, ha.todo)).filter((r) => !known.has(r.uid))
    for (const l of d.add) {
      const r = fresh.find((x) => x.summary === l.summary && x.status === 'needs_action')
      if (r) {
        d.items[l.key] = r.uid
        fresh.splice(fresh.indexOf(r), 1)
      }
    }
  }
  if (d.bought.length) onBought(d.bought)
  const done = [...d.done, ...d.bought]
  return { items: d.items, done, error, changed }
}

// ───────────── Erinnerungen & Plan ─────────────

/** Ein Kalendereintrag, den Yami anlegen will. start/end als lokale Zeit "YYYY-MM-DD HH:MM:SS". */
export interface Desired {
  key: string
  summary: string
  description: string
  start: string
  end: string
  sig: string
}

const pad = (n: number) => String(n).padStart(2, '0')
export function stamp(d: Date): string {
  return `${isoDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
const at = (iso: string, h: number, m = 0) => {
  const d = parseIso(iso)
  d.setHours(h, m, 0, 0)
  return d
}
const plusMin = (d: Date, min: number) => new Date(d.getTime() + min * 60_000)

export interface ReminderInput {
  breakfastPicks: Record<string, string[]>
  /** Prep-Tag je Woche (optional; fehlt er, gilt der gelernte Wochentag bzw. der Sonntag davor) */
  prepDays?: Record<string, string>
  weighIns: WeighIn[]
  /** Wiege-Erinnerung nur mit Profil */
  hasProfile: boolean
  pantry: PantryLot[]
  /** Einkäufe, die noch Entwurf sind (Einkaufstag, offene Artikel) – Erinnerung am Vorabend 19:00 */
  trips?: { date: string; items: number }[]
}

/** Wochentag (0 = So), an dem meist gewogen wird; ohne Messungen Montag */
export function usualWeighDay(weighIns: WeighIn[]): number {
  if (!weighIns.length) return 1
  const count = new Map<number, number>()
  for (const w of weighIns) {
    const d = parseIso(w.date).getDay()
    count.set(d, (count.get(d) ?? 0) + 1)
  }
  const latest = parseIso(weighIns[weighIns.length - 1].date).getDay()
  let best = latest
  for (const [d, n] of count) if (n > (count.get(best) ?? 0)) best = d
  return best
}

/** Erinnerungen, die in den nächsten 48 Stunden beginnen */
export function plannedReminders(input: ReminderInput, now: Date): Desired[] {
  const out: Desired[] = []
  const today = isoDate(now)
  const limit = new Date(now.getTime() + 48 * 3600_000)
  const inWindow = (d: Date) => d > now && d <= limit
  const mk = (key: string, summary: string, description: string, start: Date, sig = description): void => {
    if (inWindow(start)) out.push({ key, summary, description, start: stamp(start), end: stamp(plusMin(start, 30)), sig })
  }
  const weighDay = usualWeighDay(input.weighIns)

  for (let i = -1; i <= 2; i++) {
    const D = addDaysIso(today, i)
    const dow = parseIso(D).getDay()

    // Prep-Tag: gehört zur Woche, in der D liegt, oder (Sonntag/Samstag davor) zur nächsten
    const prepDays = input.prepDays ?? {}
    const m0 = mondayIso(D)
    for (const monday of [m0, addDaysIso(m0, 7)]) {
      const days = weekDays(parseIso(monday))
      if (resolvePrepDay(prepDays, days, today) !== D) continue
      const a = assignBreakfasts(input.breakfastPicks[monday] ?? [], days, D)
      if (!Object.keys(a.days).length) continue
      const parts = prepPlan(a).map((p) => `${p.portions}× ${p.recipe.title}${p.frozenDays.length ? ` (${p.frozenDays.length} einfrieren)` : ''}`)
      mk(`rem:prep:${D}`, '🥣 Meal-Prep heute', `Frühstück für die Woche vorbereiten: ${parts.join(', ')}`, at(D, dow === 0 || dow === 6 ? 10 : 18, 0))
    }
    // Auftauen: am Vorabend eines eingefrorenen Frühstücks
    const tm = addDaysIso(D, 1)
    const tMonday = mondayIso(tm)
    const tDays = weekDays(parseIso(tMonday))
    const ta = assignBreakfasts(input.breakfastPicks[tMonday] ?? [], tDays, resolvePrepDay(prepDays, tDays, today))
    if (ta.frozen.includes(tm) && ta.days[tm]) {
      const title = RECIPE_BY_ID[ta.days[tm]]?.title ?? 'Frühstück'
      mk(`rem:thaw:${D}`, '❄️ Frühstück auftauen', `${title} für morgen aus dem Gefrierfach in den Kühlschrank legen.`, at(D, 20, 0))
    }
    if (input.hasProfile && dow === weighDay && !weighedThisWeek(input.weighIns, D)) {
      mk(`rem:weigh:${D}`, '⚖️ Heute wiegen', 'Einmal pro Woche auf die Waage.', at(D, 7, 30))
    }
    const tomorrow = addDaysIso(D, 1)
    const names = [...new Set(input.pantry.filter((l) => l.expires === tomorrow && l.amount > 0).map((l) => l.name))].sort((a, b) => a.localeCompare(b, 'de'))
    if (names.length) mk(`rem:exp:${D}`, `⏰ Läuft morgen ab: ${names.join(', ')}`, `Morgen laufen ab: ${names.join(', ')}. Heute noch verwenden oder einfrieren.`, at(D, 16, 30), names.join('|'))
  }
  // Einkauf morgen noch nicht freigegeben → heute 19:00 erinnern (nur am Vorabend selbst angelegt, damit eine
  // inzwischen erfolgte Freigabe nicht noch eine Erinnerung auslöst – Yami löscht Erinnerungen nie)
  for (const t of input.trips ?? []) {
    const eve = addDaysIso(t.date, -1)
    if (eve !== today || !t.items) continue
    const wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][parseIso(t.date).getDay()]
    mk(`rem:shop:${eve}`, '🛒 Einkaufsliste für morgen prüfen und freigeben', `Einkauf ${wd}: ${t.items} Artikel – in Yami „Liste prüfen“ und freigeben, dann steht sie in Google Tasks.`, at(eve, 19, 0), t.date)
  }
  return out
}

/** Geplante Abendessen ab heute für die nächsten 7 Tage (heute + 7) */
export function plannedDinners(plan: WeekPlan, today: string): Desired[] {
  const out: Desired[] = []
  for (let i = 0; i <= 7; i++) {
    const D = addDaysIso(today, i)
    const e = plan[D]
    const r = e && RECIPE_BY_ID[e.recipeId]
    if (!e || !r || e.status) continue
    const lines = r.ingredients.map((ing) => {
      const amt = formatAmount(scale(ing, r.servings, e.servings), ing.unit)
      return `• ${ing.name}${amt ? ` – ${amt}` : ''}`
    })
    out.push({
      key: `dinner:${D}`,
      summary: `🍽️ ${r.title}`,
      description: `${e.servings} ${e.servings === 1 ? 'Portion' : 'Portionen'}\n${lines.join('\n')}`,
      start: stamp(at(D, 18, 30)),
      end: stamp(at(D, 19, 30)),
      sig: `${e.recipeId}×${e.servings}`,
    })
  }
  return out
}

export interface RemoteEvent {
  uid: string
  summary: string
  /** lokales Datum (ISO) des Beginns */
  date: string
}

export interface DinnerDiff {
  create: Desired[]
  /** zu löschen: Schlüssel und alle bekannten uids (leer = nur vergessen) */
  del: { key: string; uids: string[] }[]
  /** Schlüssel, die nicht mehr verfolgt werden sollen */
  forget: string[]
}

/**
 * Plan-Kalender abgleichen. `remote` = Einträge aus calendar/event/subscribe, null = Befehl nicht verfügbar
 * (dann nur heute und morgen anlegen und nur Einträge mit bekannter uid löschen).
 */
export function diffDinnerEvents(desired: Desired[], tracked: HaSettings['events'], remote: RemoteEvent[] | null, today: string): DinnerDiff {
  const out: DinnerDiff = { create: [], del: [], forget: [] }
  const tomorrow = addDaysIso(today, 1)
  const want = new Map((remote ? desired : desired.filter((d) => d.start.slice(0, 10) <= tomorrow)).map((d) => [d.key, d]))
  const remoteOn = (date: string) => (remote ?? []).filter((e) => e.date === date && e.summary.startsWith('🍽️'))

  for (const [key, t] of Object.entries(tracked)) {
    if (!key.startsWith('dinner:')) continue
    const date = key.slice(7)
    const w = want.get(key)
    if (date < today) {
      out.forget.push(key)
      continue
    }
    if (w && w.sig === t.sig) {
      // unverändert – war der Eintrag in HA weg (z. B. von Hand gelöscht), neu anlegen
      if (remote && !remoteOn(date).length) out.create.push(w)
      continue
    }
    const uids = t.uid ? [t.uid] : remoteOn(date).map((e) => e.uid)
    if (uids.length) out.del.push({ key, uids })
    else out.forget.push(key)
    if (w) out.create.push(w)
  }
  for (const w of want.values()) {
    if (!tracked[w.key] && !out.create.includes(w)) {
      // am Tag evtl. noch ein Eintrag aus früherem Stand (Verfolgung verloren) → vorher entfernen
      const stale = remoteOn(w.key.slice(7))
      if (stale.length) out.del.push({ key: w.key, uids: stale.map((e) => e.uid) })
      out.create.push(w)
    }
  }
  return out
}

function eventDate(start: unknown): string | null {
  const s = typeof start === 'string' ? start : (start as { dateTime?: string; date?: string } | null)?.dateTime ?? (start as { date?: string } | null)?.date
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const d = new Date(s)
  return isNaN(d.getTime()) ? s.slice(0, 10) : isoDate(d)
}

/** Einträge eines Kalenders lesen (Abo, erste Nachricht, wieder beenden). Wirft HaError('unsupported'), wenn nicht möglich. */
export async function listEvents(api: HaApi, entity: string, from: string, to: string, timeoutMs = 5000): Promise<RemoteEvent[]> {
  let resolve!: (v: unknown) => void
  const first = new Promise<unknown>((r) => (resolve = r))
  let off: (() => void) | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    off = await api.subscribe(
      { type: 'calendar/event/subscribe', entity_id: entity, start: parseIso(from).toISOString(), end: parseIso(to).toISOString() },
      resolve,
    )
    const ev = await Promise.race([
      first,
      new Promise<never>((_, rej) => (timer = setTimeout(() => rej(new HaError('unsupported', 'Keine Antwort vom Kalender')), timeoutMs))),
    ])
    const list = Array.isArray(ev) ? ev : (ev as { events?: unknown[] } | null)?.events ?? []
    const out: RemoteEvent[] = []
    for (const x of list as { uid?: string; summary?: string; start?: unknown }[]) {
      const date = eventDate(x.start)
      if (x.uid && date) out.push({ uid: String(x.uid), summary: String(x.summary ?? ''), date })
    }
    return out
  } finally {
    clearTimeout(timer)
    off?.()
  }
}

/**
 * Erinnerungen anlegen (nur neue; gelöscht wird nie etwas). Gibt die Zuordnung der `rem:`-Schlüssel zurück –
 * alte (Datum am Schlüsselende vor über 3 Tagen) werden nur vergessen.
 */
export async function syncReminders(
  api: HaApi,
  entity: string,
  tracked: HaSettings['events'],
  reminders: Desired[],
  now: Date,
): Promise<{ events: HaSettings['events']; error?: string; changed: number }> {
  const events: HaSettings['events'] = Object.fromEntries(Object.entries(tracked).filter(([k]) => k.startsWith('rem:')))
  let error: string | undefined
  let changed = 0
  for (const r of reminders) {
    if (events[r.key]) continue
    try {
      await api.callService('calendar', 'create_event', { summary: r.summary, description: r.description, start_date_time: r.start, end_date_time: r.end }, { entity_id: entity })
      events[r.key] = { sig: r.sig }
      changed++
    } catch (e) {
      if (e instanceof HaError && e.kind === 'network') throw e
      error ??= e instanceof Error ? e.message : String(e)
    }
  }
  const cutoff = addDaysIso(isoDate(now), -3)
  for (const k of Object.keys(events)) if (k.slice(-10) < cutoff) delete events[k]
  return { events, error, changed }
}

export interface CalendarSyncResult {
  events: HaSettings['events']
  error?: string
  changed: number
}

export async function syncCalendar(
  api: HaApi,
  ha: Pick<HaSettings, 'calendar' | 'reminders' | 'events'>,
  dinners: Desired[],
  reminders: Desired[],
  now: Date,
): Promise<CalendarSyncResult> {
  const today = isoDate(now)
  const events: HaSettings['events'] = { ...ha.events }
  let error: string | undefined
  let changed = 0
  const attempt = async (fn: () => Promise<unknown>): Promise<boolean> => {
    try {
      await fn()
      changed++
      return true
    } catch (e) {
      if (e instanceof HaError && e.kind === 'network') throw e
      error ??= e instanceof Error ? e.message : String(e)
      return false
    }
  }
  const create = (entity: string, d: Desired) =>
    api.callService('calendar', 'create_event', { summary: d.summary, description: d.description, start_date_time: d.start, end_date_time: d.end }, { entity_id: entity })

  // Erinnerungen: nur neue, die in den nächsten 48 h beginnen (Yami löscht nie Erinnerungen)
  const rem = await syncReminders(api, ha.reminders, events, reminders, now)
  Object.keys(events).forEach((k) => k.startsWith('rem:') && delete events[k])
  Object.assign(events, rem.events)
  error ??= rem.error
  changed += rem.changed

  // Plan
  const from = today
  const to = addDaysIso(today, 9)
  let remote: RemoteEvent[] | null = null
  try {
    remote = await listEvents(api, ha.calendar, from, to)
  } catch (e) {
    if (e instanceof HaError && e.kind === 'network') throw e
    remote = null
  }
  const diff = diffDinnerEvents(dinners, events, remote, today)
  for (const k of diff.forget) delete events[k]
  for (const d of diff.del) {
    let ok = true
    for (const uid of d.uids) {
      if (!(await attempt(() => api.command({ type: 'calendar/event/delete', entity_id: ha.calendar, uid })))) ok = false
    }
    if (ok) delete events[d.key]
  }
  for (const d of diff.create) {
    if (await attempt(() => create(ha.calendar, d))) events[d.key] = { sig: d.sig }
  }
  // uids der neuen Einträge merken, damit Änderungen später sauber löschen können
  if (remote && diff.create.length) {
    try {
      const after = await listEvents(api, ha.calendar, from, to)
      const before = new Set(remote.map((e) => e.uid))
      for (const d of diff.create) {
        const e = after.find((x) => !before.has(x.uid) && x.date === d.key.slice(7) && x.summary === d.summary)
        if (e && events[d.key]) events[d.key] = { ...events[d.key], uid: e.uid }
      }
    } catch {
      /* uid bleibt unbekannt – wird später über Datum und Titel gefunden */
    }
  }
  return { events, error, changed }
}
