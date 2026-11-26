/**
 * Abgleich mit Home Assistant: Einkaufsliste (todo), Erinnerungen und Plan (Kalender).
 * Die Entscheidungen stehen in reinen Funktionen (diffTodo, plannedReminders, diffDinnerEvents) – testbar ohne Netz.
 */
import { RECIPE_BY_ID } from './data/recipes'
import { assignBreakfasts, mondayIso, prepPlan, resolvePrepDay } from './breakfast'
import { HaError } from './homeassistant'
import { addDaysIso, entryRecipe, swapText } from './kitchen'
import type { PantryLot } from './kitchen'
import { weighedThisWeek, type WeighIn } from './progress'
import { forDaysText, formatAmount, isBought, missingPacks, packText, scale } from './shopping'
import { type HaSettings, isoDate, parseIso, weekDays } from './store'
import type { BuyItem } from './kitchen'
import type { BakePlan, Recipe, WeekPlan } from './types'
import { isBbq, isSalat, isTapa, replacesDinner } from './types'
import { tapasEntries, tapasFactorFor } from './bakePlan'
import { shortTitle } from './tapas'

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
export function todoSummary(it: BuyItem & { forgot?: string }, trip?: string): string {
  const partly = !isBought(it) && it.bought > 0
  const amt = partly ? `noch ${missingPacks(it)} ${it.product.packName ?? 'Stk'}` : packText(it)
  // gelernt: oft vergessen → auffällig markieren
  const name = it.forgot ? `⚠️ ${it.name}` : it.name
  const base = amt ? `${name} – ${amt}` : name
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
  /** Einträge, die in Google Tasks verschoben wurden (Ladenreihenfolge) */
  moved: number
}

/**
 * Welche Einträge müssen verschoben werden, damit `current` (aktuelle Reihenfolge) zu `desired` passt?
 * Nur die relative Reihenfolge der Yami-Einträge zählt (Fremdes dazwischen bleibt, wo es ist). Der längste schon
 * richtig geordnete Teil bleibt liegen; jeder andere Eintrag wird hinter seinen Vorgänger gesetzt (erster: nach oben,
 * `previous` leer). Schon richtige Reihenfolge → keine Verschiebung.
 */
export function planMoves(current: string[], desired: string[]): { uid: string; previous?: string }[] {
  const pos = new Map(current.map((u, i) => [u, i]))
  const seq = desired.filter((u) => pos.has(u))
  // längste aufsteigende Teilfolge der aktuellen Positionen in Wunschreihenfolge
  const tail: number[] = []
  const prev: number[] = []
  const idx: number[] = []
  seq.forEach((u, i) => {
    const p = pos.get(u)!
    let lo = 0
    let hi = tail.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (tail[mid] < p) lo = mid + 1
      else hi = mid
    }
    tail[lo] = p
    idx[lo] = i
    prev[i] = lo > 0 ? idx[lo - 1] : -1
  })
  const keep = new Set<number>()
  for (let i = tail.length ? idx[tail.length - 1] : -1; i >= 0; i = prev[i]) keep.add(i)
  const out: { uid: string; previous?: string }[] = []
  seq.forEach((u, i) => {
    if (!keep.has(i)) out.push(i === 0 ? { uid: u } : { uid: u, previous: seq[i - 1] })
  })
  return out
}

/**
 * Einkaufsliste abgleichen. `onBought` bekommt die Schlüssel, die in HA abgehakt wurden, und gibt die zurück,
 * die Yami übernommen hat (ohne Rückgabe: alle). Nicht Übernommenes gilt nicht als erledigt → kein Wieder-Öffnen,
 * der nächste Lauf versucht es erneut.
 */
export async function syncTodo(
  api: HaApi,
  ha: Pick<HaSettings, 'todo' | 'items' | 'done'>,
  local: LocalItem[],
  onBought: (keys: string[]) => string[] | void,
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
  const taken = new Set(d.bought.length ? onBought(d.bought) ?? d.bought : [])
  const done = d.done.filter((k) => !d.bought.includes(k) || taken.has(k))

  // Reihenfolge wie im Laden: Yami-Einträge (offen) in der Reihenfolge von `local`; Fremdes bleibt unberührt.
  // Nur wenn sich die Reihenfolge unterscheidet, wird verschoben (todo/item/move) – sonst keine Anfrage.
  let moved = 0
  try {
    const now = added ? await listTodo(api, ha.todo) : remote
    const mine = new Set(Object.values(d.items))
    const closing = new Set(d.complete.map((c) => c.uid))
    const open = (r: RemoteTodo) => mine.has(r.uid) && r.status === 'needs_action' && !closing.has(r.uid)
    const current = now.filter(open).map((r) => r.uid)
    const openSet = new Set(current)
    const desired = local.filter((l) => !done.includes(l.key)).map((l) => d.items[l.key]).filter((u): u is string => !!u && openSet.has(u))
    for (const m of planMoves(current, desired)) {
      await api.command({ type: 'todo/item/move', entity_id: ha.todo, uid: m.uid, ...(m.previous ? { previous_uid: m.previous } : {}) })
      moved++
    }
  } catch (e) {
    // Verschieben nicht unterstützt oder fehlgeschlagen → Reihenfolge bleibt, wie sie ist (blockiert nichts)
    if (e instanceof HaError && e.kind === 'network') throw e
  }
  return { items: d.items, done, error, changed, moved }
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
  /** Wochen mit spätem Einstieg und erledigte Vorbereitungen (für den Prep-Tag, siehe prepDayInfo) */
  prepLate?: string[]
  bfPreps?: { week: string; date: string }[]
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
    const extra = { preps: input.bfPreps, late: input.prepLate, picks: input.breakfastPicks }
    const m0 = mondayIso(D)
    for (const monday of [m0, addDaysIso(m0, 7)]) {
      const days = weekDays(parseIso(monday))
      if (resolvePrepDay(prepDays, days, today, extra) !== D) continue
      const a = assignBreakfasts(input.breakfastPicks[monday] ?? [], days, D)
      if (!Object.keys(a.days).length) continue
      const parts = prepPlan(a).map((p) => `${p.portions}× ${p.recipe.title}${p.frozenDays.length ? ` (${p.frozenDays.length} einfrieren)` : ''}`)
      mk(`rem:prep:${D}`, '🥣 Meal-Prep heute', `Frühstück für die Woche vorbereiten: ${parts.join(', ')}`, at(D, dow === 0 || dow === 6 ? 10 : 18, 0))
    }
    // Auftauen: am Vorabend eines eingefrorenen Frühstücks
    const tm = addDaysIso(D, 1)
    const tMonday = mondayIso(tm)
    const tDays = weekDays(parseIso(tMonday))
    const ta = assignBreakfasts(input.breakfastPicks[tMonday] ?? [], tDays, resolvePrepDay(prepDays, tDays, today, extra))
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

/**
 * Geplante Abendessen ab heute für die nächsten 7 Tage (heute + 7), ein Termin je Tag (Schlüssel `dinner:<Tag>`):
 *   – Tapas-Abend (Tapas im Backplan): „🍽️ 🫒 Tapas-Abend: Gambas al ajillo, Tortilla de patatas, …“, Zutaten je Tapa
 *     (mit der Menge für die Anzahl der Tapas des Abends)
 *   – Grillabend (BBQ im Backplan, ohne Beilagen): „🍽️ 🔥 …“, Zutaten der Ladung
 *   – sonst das Abendessen aus dem Plan
 * Steht zusätzlich noch ein Abendessen im Plan, wird es in der Beschreibung mitgenannt; Salate & Beilagen des Tages
 * (Zusatz, ersetzen nichts) stehen als „Dazu: …“ in der Beschreibung.
 */
export function plannedDinners(plan: WeekPlan, today: string, bakePlan: BakePlan = {}): Desired[] {
  const out: Desired[] = []
  for (let i = 0; i <= DINNER_DAYS; i++) {
    const D = addDaysIso(today, i)
    const e = plan[D]
    const r = e && RECIPE_BY_ID[e.recipeId] ? entryRecipe(e) : undefined
    const open = (bakePlan[D] ?? []).filter((b) => !b.status && RECIPE_BY_ID[b.recipeId])
    const tapas = open.filter((b) => isTapa(RECIPE_BY_ID[b.recipeId]))
    const bbqs = open.filter((b) => isBbq(RECIPE_BY_ID[b.recipeId]) && replacesDinner(RECIPE_BY_ID[b.recipeId]))
    const sides = open.filter((b) => isSalat(RECIPE_BY_ID[b.recipeId]) || (isBbq(RECIPE_BY_ID[b.recipeId]) && !replacesDinner(RECIPE_BY_ID[b.recipeId])))
    const dinner = e && r && !e.status ? { e, r } : undefined
    if (!dinner && !bbqs.length && !tapas.length) continue
    const linesOf = (rec: Recipe, base: number, servings: number) =>
      rec.ingredients.map((ing) => {
        const amt = formatAmount(scale(ing, base, servings), ing.unit)
        return `• ${ing.name}${amt ? ` – ${amt}` : ''}`
      })
    const sideText = sides.length ? `Dazu: ${sides.map((b) => RECIPE_BY_ID[b.recipeId].title).join(', ')}` : ''
    const sideSig = sides.length ? `|+${sides.map((b) => `${b.recipeId}×${b.amount}`).join(',')}` : ''
    const event = (summary: string, desc: string[], sig: string) =>
      out.push({ key: `dinner:${D}`, summary, description: [...desc, ...(sideText ? [sideText] : [])].join('\n\n'), start: stamp(at(D, 18, 30)), end: stamp(at(D, 19, 30)), sig: sig + sideSig })
    if (tapas.length) {
      const f = tapasFactorFor(tapasEntries(bakePlan, D).length)
      const recs = tapas.map((b) => RECIPE_BY_ID[b.recipeId])
      const desc = recs.map((rec) => `🫒 ${rec.title}\n${linesOf(rec, rec.servings, rec.servings * f).join('\n')}`)
      if (bbqs.length) desc.push(`Außerdem geplant: ${bbqs.map((b) => RECIPE_BY_ID[b.recipeId].title).join(', ')}`)
      if (dinner) desc.push(`Außerdem geplant: ${dinner.r.title}`)
      event(`🍽️ 🫒 Tapas-Abend: ${recs.map((rec) => shortTitle(rec.title)).join(', ')}`, desc, `tapas:${tapas.map((b) => b.recipeId).join(',')}×${f}${dinner ? `|${dinner.e.recipeId}×${dinner.e.servings}` : ''}`)
      continue
    }
    if (bbqs.length) {
      const recs = bbqs.map((b) => ({ b, rec: RECIPE_BY_ID[b.recipeId] }))
      const desc = recs.map(({ b, rec }) => `🔥 ${rec.title}${b.amount > 1 ? ` ×${b.amount}` : ''} (ca. ${(rec.portions ?? 2) * b.amount} Portionen)\n${linesOf(rec, rec.servings, b.amount * rec.servings).join('\n')}`)
      if (dinner) desc.push(`Außerdem geplant: ${dinner.r.title}`)
      event(`🍽️ 🔥 ${recs.map(({ rec }) => rec.title).join(' + ')}`, desc, `bbq:${bbqs.map((b) => `${b.recipeId}×${b.amount}`).join(',')}${dinner ? `|${dinner.e.recipeId}×${dinner.e.servings}` : ''}`)
      continue
    }
    const { e: de, r: dr } = dinner!
    event(
      `🍽️ ${dr.title}`,
      [`${de.servings} ${de.servings === 1 ? 'Portion' : 'Portionen'}\n${linesOf(dr, dr.servings, de.servings).join('\n')}`],
      `${de.recipeId}×${de.servings}${de.swap ? `|${swapText(de.swap)}` : ''}`,
    )
  }
  return out
}

export interface RemoteEvent {
  uid: string
  summary: string
  /** lokales Datum (ISO) des Beginns */
  date: string
  /** Beschreibung, falls der Kalender sie liefert */
  description?: string | null
}

export interface DinnerDiff {
  create: Desired[]
  /** zu löschen: Schlüssel und alle bekannten uids (leer = nur vergessen) */
  del: { key: string; uids: string[] }[]
  /** Schlüssel, die nicht mehr verfolgt werden sollen */
  forget: string[]
  /** vorhandener, passender Termin wird (wieder) als eigener gemerkt – nichts anzulegen */
  keep?: { key: string; uid: string; sig: string }[]
}

/** Abendessen-Termine von Yami erkennt man am Titel (auch BBQ „🍽️ 🔥 …“ und Tapas-Abend „🍽️ 🫒 …“); alles andere im Kalender bleibt unberührt */
export const DINNER_MARK = '🍽️'
/** so viele Tage nach heute plant der Kalender (heute … heute + DINNER_DAYS) */
export const DINNER_DAYS = 7

const normText = (s: string | null | undefined) => (s ?? '').replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim()

/**
 * Plan-Kalender abgleichen. `remote` = Einträge aus calendar/event/subscribe, null = Befehl nicht verfügbar
 * (dann nur heute und morgen anlegen und nur Einträge mit bekannter uid löschen).
 *
 * Mit `remote` ist es ein echter Abgleich gegen den TATSÄCHLICHEN Kalenderinhalt, Tag für Tag (heute … +7):
 * Soll = genau ein „🍽️“-Termin mit dem gewünschten Titel. Der gemerkte eigene Termin (uid) bleibt, wenn er noch da ist
 * und Titel/Signatur passen; sonst wird ein vorhandener Termin mit genau diesem Titel (und, falls lesbar, gleicher
 * Beschreibung) übernommen; sonst neu angelegt. Alle übrigen „🍽️“-Termine des Tages (alter Stand eines anderen Geräts,
 * Doppelte) werden gelöscht – auch an Tagen ohne geplantes Abendessen. Termine ohne „🍽️“ (Schule …) und vergangene
 * Tage werden nie angefasst.
 */
export function diffDinnerEvents(desired: Desired[], tracked: HaSettings['events'], remote: RemoteEvent[] | null, today: string): DinnerDiff {
  if (!remote) return diffDinnerBlind(desired, tracked, today)
  const out: DinnerDiff = { create: [], del: [], forget: [], keep: [] }
  const want = new Map(desired.map((d) => [d.key, d]))
  const mine = remote.filter((e) => e.summary.startsWith(DINNER_MARK))

  // vergangene Tage nur vergessen
  for (const key of Object.keys(tracked)) if (key.startsWith('dinner:') && key.slice(7) < today) out.forget.push(key)

  for (let i = 0; i <= DINNER_DAYS; i++) {
    const date = addDaysIso(today, i)
    const key = `dinner:${date}`
    const w = want.get(key)
    const t = tracked[key]
    const evs = mine.filter((e) => e.date === date)
    if (!w) {
      // kein Abendessen geplant → alle 🍽️-Termine des Tages weg
      if (evs.length) out.del.push({ key, uids: evs.map((e) => e.uid) })
      else if (t) out.forget.push(key)
      continue
    }
    const same = !!t && t.sig === w.sig
    const titled = evs.filter((e) => e.summary === w.summary)
    // 1) eigener gemerkter Termin, unverändert
    let keep = same && t!.uid ? titled.find((e) => e.uid === t!.uid) : undefined
    // 2) früher ohne uid gemerkt → über den Titel
    if (!keep && same && !t!.uid) keep = titled[0]
    // 3) fremder/verlorener Termin mit genau diesem Titel: nur übernehmen, wenn die Beschreibung passt
    //    (oder nicht lesbar ist und sich am Gericht nichts geändert hat)
    if (!keep)
      keep = titled.find((e) => (e.description != null ? normText(e.description) === normText(w.description) : !t || same))
    const extra = evs.filter((e) => e !== keep)
    if (extra.length) out.del.push({ key, uids: extra.map((e) => e.uid) })
    if (keep) {
      if (!t || t.uid !== keep.uid || t.sig !== w.sig) out.keep!.push({ key, uid: keep.uid, sig: w.sig })
    } else out.create.push(w)
  }
  // gemerkte Tage nach +7 (gibt es normalerweise nicht) bleiben, wie sie sind
  return out
}

/** ohne Lesemöglichkeit: vorsichtig – nur heute/morgen anlegen, nur über bekannte uid löschen */
function diffDinnerBlind(desired: Desired[], tracked: HaSettings['events'], today: string): DinnerDiff {
  const out: DinnerDiff = { create: [], del: [], forget: [] }
  const tomorrow = addDaysIso(today, 1)
  const want = new Map(desired.filter((d) => d.start.slice(0, 10) <= tomorrow).map((d) => [d.key, d]))
  for (const [key, t] of Object.entries(tracked)) {
    if (!key.startsWith('dinner:')) continue
    const date = key.slice(7)
    const w = want.get(key)
    if (date < today) {
      out.forget.push(key)
      continue
    }
    if (w && w.sig === t.sig) continue
    if (t.uid) out.del.push({ key, uids: [t.uid] })
    else out.forget.push(key)
    if (w) out.create.push(w)
  }
  for (const w of want.values()) if (!tracked[w.key]) out.create.push(w)
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
    for (const x of list as { uid?: string; summary?: string; start?: unknown; description?: unknown }[]) {
      const date = eventDate(x.start)
      if (x.uid && date) out.push({ uid: String(x.uid), summary: String(x.summary ?? ''), date, ...(typeof x.description === 'string' ? { description: x.description } : {}) })
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
): Promise<{ events: HaSettings['events']; error?: string; changed: number; net?: HaError }> {
  const events: HaSettings['events'] = Object.fromEntries(Object.entries(tracked).filter(([k]) => k.startsWith('rem:')))
  let error: string | undefined
  let changed = 0
  // Netz weg: nicht werfen, sondern mit dem bisher Angelegten zurückkehren (`net`) – der Aufrufer merkt sich die
  // schon angelegten Erinnerungen und wirft danach; sonst würden sie beim nächsten Lauf doppelt angelegt
  let net: HaError | undefined
  for (const r of reminders) {
    if (events[r.key]) continue
    try {
      await api.callService('calendar', 'create_event', { summary: r.summary, description: r.description, start_date_time: r.start, end_date_time: r.end }, { entity_id: entity })
      events[r.key] = { sig: r.sig }
      changed++
    } catch (e) {
      if (e instanceof HaError && e.kind === 'network') {
        net = e
        break
      }
      error ??= e instanceof Error ? e.message : String(e)
    }
  }
  const cutoff = addDaysIso(isoDate(now), -3)
  for (const k of Object.keys(events)) if (k.slice(-10) < cutoff) delete events[k]
  return { events, error, changed, ...(net ? { net } : {}) }
}

/** nur die Erinnerungen in `events` ersetzen (Abendessen-Termine bleiben) */
export const withReminders = (events: HaSettings['events'], rem: HaSettings['events']): HaSettings['events'] => ({
  ...Object.fromEntries(Object.entries(events).filter(([k]) => !k.startsWith('rem:'))),
  ...rem,
})

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
  // (haRun legt sie vorher einzeln an und gibt hier [] mit, damit ein Netzfehler danach nichts doppelt anlegen lässt)
  const rem = await syncReminders(api, ha.reminders, events, reminders, now)
  if (rem.net) throw rem.net
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
    // nur vergessen, wenn der gemerkte Termin selbst gelöscht wurde (nicht, wenn nur Doppelte daneben weg sind)
    const t = events[d.key]
    if (ok && (!t?.uid || d.uids.includes(t.uid))) delete events[d.key]
  }
  // passender Termin schon da (z. B. Zuordnung verloren) → nur wieder als eigenen merken
  for (const k of diff.keep ?? []) events[k.key] = { sig: k.sig, uid: k.uid }
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
