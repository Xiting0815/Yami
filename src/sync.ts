/**
 * Familien-Abgleich über Home Assistant (zwei oder mehr Handys, z. B. Marc + Lisa).
 *
 * TRANSPORT
 *   Eine HA-To-do-Liste (Standard `todo.yami_sync`, „Local To-do“). Jedes „Dokument“ ist ein Eintrag:
 *   Titel `yami:v1:<doc>`, Beschreibung = JSON. Wird ein Dokument größer als ~90 KB, wird es in Teile
 *   `yami:v1:<doc>#0 … #n` zerlegt (Beschreibung `<prüfsumme>|<i>/<n>|<teil>`); ein Leser nimmt nur einen
 *   vollständigen Satz Teile mit gleicher Prüfsumme (halb geschrieben → diesmal überspringen, nichts löschen).
 *   Lesen: WS `todo/item/list`; schreiben: `todo.add_item` / `todo.update_item` (Beschreibung) / `todo.remove_item`;
 *   live: `todo/item/subscribe`. Jeder benutzt seinen eigenen HA-Token.
 *
 * DOKUMENTE
 *   kitchen        Plan (Abendessen), Backplan, Vorrat, Einkauf (gekauft/abgehakt/eigene Artikel), Weggeworfenes
 *                  – bewusst EIN Dokument: Kochen/Einkaufen ändern Plan + Vorrat zusammen, so wird beides
 *                    immer gemeinsam gelesen und geschrieben (kein halber Stand → kein doppeltes Abziehen).
 *   recipes        eigene Rezepte und eigene Zutaten
 *   prefs          Preise, geführte Grundzutaten (Form), Gewürze (da/alle), Vorrats-Wünsche
 *   person:<Name>  Lernsignale EINER Person: Bewertungen, Weggewischtes, Portions-Rückmeldung, Back-Bewertungen,
 *                  Gebackenes. Nur diese Person schreibt es (von all ihren Geräten); die anderen lesen es.
 *   main           Haupt-Gerät: welches Gerät Einkaufsliste (Google Tasks) und Kalender in HA pflegt (+ dessen
 *                  Zuordnungen), damit dort nichts doppelt entsteht.
 *
 * GETEILT (AppState-Felder): plan, bakePlan, pantry, bought, checked, custom, wasted, customRecipes, customIngredients,
 *   prices, staples, spices, pantryRequests, trips (Einkäufe: Freigabe + „Habe ich“-Antworten), shopDay (Einkaufstag), shopOrder (Abschnitts-Reihenfolge).
 * PRO PERSON veröffentlicht (person:<Name>): ratings, rejects, portionFeedback, bakeRatings, baked, bfRatings, bfSatiety
 *   (Frühstück: Bewertung/Sättigung nach dem Vorbereiten – zählt nur fürs eigene Profil, nie als Haushalts-Abendessen).
 *   Persönlich bleibt bfPreps (Vorbereitungen; die Portionen selbst liegen als Posten im geteilten Vorrat).
 * PERSÖNLICH (nie geteilt): profile, weighIns, adjustDecidedAt, profileCreated, breakfast, breakfastPicks, prepDays,
 *   prepChecked, bfPreps, bfSatietyDismissed, snacks (kcal), ratingDismissed, reviewDismissed, tasteSince, filters, defaultServings, onboarding*,
 *   bfOpen, showClassicSteps, lastBackup, ha (Token, Person, Gerät), sync (dieser Abgleich-Stand).
 *
 * ZUSAMMENFÜHREN (pro Eintrag, „letzte Änderung gewinnt“)
 *   Jeder Eintrag hat `{ t: ms, by: Person }`. Schlüssel: plan:<Tag>, bplan:<Tag>|<Rezept-Id>, lot:<Posten-Id>, bought:<Woche bzw. trip:Einkaufstag>|<Artikel>,
 *   check:<Woche>|<Artikel>, cust:<Woche>|<Id>, waste:<Prüfsumme>, trip:<Einkaufstag> (Freigabe), ans:<Einkaufstag>|<Artikel>
 *   (Habe ich/Brauche ich), shop:day, recipe:<Id>, ing:<Name>, price:/staple:/spice:/req:<Name>,
 *   rating:<Tag>, reject:<Datum>|<Id>, pf:<Tag>, bake:<Datum:Id>, baked:<Datum>|<Id>, bfr:<Prep-Tag:Id>, bfs:<Prep-Tag:Id>.
 *   Lokale Änderungen erkennt der Abgleich selbst: Wert ≠ Prüfsumme im letzten Abgleich-Stand (`sync.base`) → neu
 *   gestempelt; fehlt ein Eintrag, der beim letzten Mal da war → Grabstein (Löschung wandert mit). Grabsteine werden
 *   nach 30 Tagen vergessen. Die Aktionen der App müssen davon nichts wissen.
 *   Gleichstand: größeres t, dann Person, dann Prüfsumme (überall gleich → alle Geräte landen beim selben Ergebnis).
 *   Erster Abgleich eines Geräts mit vorhandenen Haushaltsdaten: eigene Einträge zählen als „uralt“ (t = 0) → der
 *   Haushalt gewinnt, nur Einträge, die es dort nicht gibt, kommen dazu (nichts wird überschrieben).
 *
 * BACKPLAN (bplan:<Tag>|<Rezept-Id>, Wert { amount, status? })
 *   Ein Eintrag je Tag und Rezept → zwei Geräte, die dasselbe Backen einplanen, ergeben einen Eintrag (kein Doppeltes).
 *   Verschieben = alter Schlüssel gelöscht (Grabstein) + neuer. „Gebacken?“ beantworten = status 'baked' im selben Dokument
 *   wie der Vorrat (Ergebnis-Posten + Abzug) → die Frage verschwindet auf beiden Geräten. Wird sie auf beiden Geräten
 *   gleichzeitig offline mit „Ja“ beantwortet, entstehen zwei Ergebnis-Posten (Grenze, wie beim Vorrat unten).
 *   Der Backplan fließt über planWeek in Einkaufsliste/Google Tasks; der Kalender zeigt Backen bisher nicht.
 *
 * GEKOCHT / ABZIEHEN (cookDue)
 *   Mit Familien-Abgleich zieht ein Gerät vergangene Abendessen NUR direkt nach einem erfolgreichen Lesen der
 *   Haushaltsdaten ab (in `syncRound`, nicht im täglichen useUpkeep). Plan-Eintrag (status 'cooked' + consumed)
 *   und Vorratsposten landen im selben Dokument. Wer zuerst abgleicht, zieht ab; das andere Gerät liest
 *   „gekocht“ und zieht nicht noch einmal ab. Gleichen beide im selben Moment ab, rechnen beide vom selben Stand
 *   aus dasselbe Ergebnis (Mengen werden gesetzt, nicht addiert) → auch dann nur einmal abgezogen.
 *   Frühstück ist persönlich und wird weiter lokal abgezogen; Abgelaufenes (moveExpired) ist auf allen Geräten gleich.
 *
 * GRENZEN
 *   - Vorrat: Menge je Posten „letzte Änderung gewinnt“. Nehmen beide gleichzeitig (offline) etwas vom SELBEN Posten,
 *     zählt nur eine Entnahme. Ebenso zählt bei pantryRequests nur der letzte Zähler.
 *   - Ein Gerät, das länger als 30 Tage keinen Abgleich hatte, kann inzwischen gelöschte Einträge zurückbringen.
 *   - Sicherung laden setzt den Abgleich-Stand zurück: der Haushalt gewinnt, die Sicherung ergänzt nur.
 *
 * EINKAUFSLISTE (Google Tasks „Einkaufen“), KALENDER, ERINNERUNGEN – „Schreibstab“ statt festem Haupt-Gerät
 *   Jedes Gerät darf sie pflegen, aber immer nur eins zur Zeit: Dokument `main` = { Gerät, Person, gültig bis (5 Min.),
 *   Zuordnungen items/done/events }. Ablauf eines Laufs (src/haRun.ts): Haushaltsdaten lesen + zusammenführen →
 *   Stab prüfen → frei/abgelaufen: übernehmen (Zuordnungen erben) und im nächsten Lauf nach Bestätigung schreiben;
 *   eigener Stab: Einkaufsliste + Kalender mit dem GERADE ZUSAMMENGEFÜHRTEN Stand abgleichen, Zuordnungen zurück in
 *   `main`. Hält ein anderes Gerät den Stab, übernimmt es das (es gleicht ja gerade selbst ab). Was Lisa plant, kommt
 *   so sofort von ihrem Gerät in HA – spätestens, wenn Marc die App öffnet; doppelte Einträge entstehen nicht, weil
 *   beide dieselben Zuordnungen benutzen. In Google Tasks abgehakt → der Stab-Halter markiert gekauft → wandert zu allen.
 *   ERINNERUNGEN: Meal-Prep, Auftauen, Wiegen sind persönlich – jedes Gerät legt sie für SEINE Person an
 *   (Schlüssel `rem:<Person>:…`, Zuordnung nur lokal), unabhängig vom Stab; Yami löscht nie Erinnerungen, fremde schon gar
 *   nicht. „Läuft morgen ab“ betrifft den geteilten Vorrat → nur der Stab-Halter (Zuordnung `rem:exp:…` im Stab).
 */
import type { HaApi, RemoteTodo } from './haSync'
import { listTodo } from './haSync'
import { HaError } from './homeassistant'
import { RECIPE_BY_ID } from './data/recipes'
import type { BakeEntry } from './types'
import { cookDue, uid } from './kitchen'
import { type PortionFeedback, portionFactor } from './learning'
import { type AppState, type HaSettings, type TripState, sanitize, sharingActive, shortDate, weekdayName } from './store'
import { type BaseEntry, type ItemMeta, type PersonSignals, type SyncLocal, type SyncNotice, emptySync, sanitizePerson } from './syncLocal'

export const PREFIX = 'yami:v1:'
/** größte Beschreibung je Eintrag (Zeichen) */
export const CHUNK = 90_000
const TOMB_MS = 30 * 86400_000
const NOTICE_MS = 3 * 86400_000

export interface Item extends ItemMeta {
  v?: unknown
  d?: 1
}
export type Items = Record<string, Item>

export interface MainDoc {
  device: string
  person: string
  t: number
  /** Schreibstab gilt bis (ms) */
  until: number
  ha?: Pick<HaSettings, 'items' | 'done' | 'events'>
}

// ───────────── Hilfen ─────────────

/** JSON mit sortierten Schlüsseln (gleicher Wert → gleicher Text, egal in welcher Reihenfolge gebaut) */
export function stable(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null'
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`
  const o = v as Record<string, unknown>
  return `{${Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stable(o[k])}`).join(',')}}`
}

/** kurze Prüfsumme (2× FNV-1a 32 Bit) */
export function hashText(s: string): string {
  let a = 0x811c9dc5
  let b = 0x01000193 ^ s.length
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    a = Math.imul(a ^ c, 0x01000193)
    b = Math.imul(b ^ c, 0x5bd1e995) ^ (b >>> 15)
  }
  return (a >>> 0).toString(36) + (b >>> 0).toString(36)
}
export const hashOf = (v: unknown) => hashText(stable(v))

const kindOf = (key: string) => key.slice(0, key.indexOf(':'))
const restOf = (key: string) => key.slice(key.indexOf(':') + 1)
const split2 = (s: string): [string, string] => {
  const i = s.indexOf('|')
  return [s.slice(0, i), s.slice(i + 1)]
}
const PERSON_KINDS = new Set(['rating', 'reject', 'pf', 'bake', 'baked', 'bfr', 'bfs'])
const DOC_OF: Record<string, string> = {
  plan: 'kitchen', bplan: 'kitchen', lot: 'kitchen', bought: 'kitchen', check: 'kitchen', cust: 'kitchen', waste: 'kitchen',
  trip: 'kitchen', ans: 'kitchen',
  recipe: 'recipes', ing: 'recipes',
  price: 'prefs', staple: 'prefs', spice: 'prefs', req: 'prefs', shop: 'prefs',
}
export function docOf(key: string, me: string): string | undefined {
  const k = kindOf(key)
  return PERSON_KINDS.has(k) ? `person:${me}` : DOC_OF[k]
}

// ───────────── AppState ↔ Einträge ─────────────

/** Geteilte und persönlich veröffentlichte Werte als flache Liste Schlüssel → Wert */
export function extract(s: AppState): Record<string, unknown> {
  const o: Record<string, unknown> = {}
  for (const [d, e] of Object.entries(s.plan)) if (e) o[`plan:${d}`] = e
  for (const [d, list] of Object.entries(s.bakePlan)) for (const e of list ?? []) o[`bplan:${d}|${e.recipeId}`] = { amount: e.amount, ...(e.status ? { status: e.status } : {}) }
  for (const l of s.pantry) o[`lot:${l.id}`] = l
  for (const [w, m] of Object.entries(s.bought)) for (const [k, b] of Object.entries(m ?? {})) o[`bought:${w}|${k}`] = b
  for (const [w, ks] of Object.entries(s.checked)) for (const k of ks ?? []) o[`check:${w}|${k}`] = 1
  for (const [w, xs] of Object.entries(s.custom)) for (const c of xs ?? []) o[`cust:${w}|${c.id}`] = c
  for (const w of s.wasted) o[`waste:${hashOf(w)}`] = w
  for (const r of s.customRecipes) o[`recipe:${r.id}`] = r
  for (const i of s.customIngredients) o[`ing:${i.name}`] = i
  for (const [k, v] of Object.entries(s.prices)) o[`price:${k}`] = v
  for (const [k, v] of Object.entries(s.staples)) o[`staple:${k}`] = v
  for (const [k, v] of Object.entries(s.spices)) o[`spice:${k}`] = v
  for (const [k, v] of Object.entries(s.pantryRequests)) o[`req:${k}`] = v
  for (const [d, t] of Object.entries(s.trips ?? {})) {
    if (t.released) o[`trip:${d}`] = { released: t.released, ...(t.sent ? { sent: t.sent } : {}) }
    for (const [k, v] of Object.entries(t.answers ?? {})) o[`ans:${d}|${k}`] = v
  }
  if (s.shopDay != null) o['shop:day'] = s.shopDay
  if (s.shopOrder?.length) o['shop:order'] = s.shopOrder
  for (const [d, v] of Object.entries(s.ratings)) o[`rating:${d}`] = v
  for (const r of s.rejects) o[`reject:${r.date}|${r.id}`] = 1
  for (const [d, v] of Object.entries(s.portionFeedback)) o[`pf:${d}`] = v
  for (const [k, v] of Object.entries(s.bakeRatings)) o[`bake:${k}`] = v
  for (const b of s.baked) o[`baked:${b.date}|${b.recipeId}`] = 1
  for (const [k, v] of Object.entries(s.bfRatings ?? {})) o[`bfr:${k}`] = v
  for (const [k, v] of Object.entries(s.bfSatiety ?? {})) o[`bfs:${k}`] = v
  return o
}

/** Prüfsumme über alle geteilten Werte (erkennt Änderungen während eines Abgleichs) */
export const sharedHash = (s: AppState) => hashOf(extract(s))

const byOrder = <T,>(old: T[], idOf: (x: T) => string, fresh: Map<string, T>): T[] => {
  const out: T[] = []
  for (const x of old) {
    const id = idOf(x)
    if (fresh.has(id)) {
      out.push(fresh.get(id)!)
      fresh.delete(id)
    }
  }
  return [...out, ...fresh.values()]
}

/** Felder der betroffenen Arten aus den Einträgen neu bauen (Reihenfolge der vorhandenen bleibt) */
export function rebuild(s: AppState, live: Record<string, unknown>, kinds: Set<string>): AppState {
  const next: AppState = { ...s }
  const of = (kind: string) => Object.entries(live).filter(([k]) => kindOf(k) === kind).map(([k, v]) => [restOf(k), v] as [string, unknown])
  const obj = (kind: string) => Object.fromEntries(of(kind))
  if (kinds.has('plan')) next.plan = obj('plan') as AppState['plan']
  if (kinds.has('bplan')) {
    const fresh: Record<string, Map<string, BakeEntry>> = {}
    for (const [r, v] of of('bplan')) {
      const [d, id] = split2(r)
      ;(fresh[d] ??= new Map()).set(id, { recipeId: id, ...(v as Omit<BakeEntry, 'recipeId'>) })
    }
    next.bakePlan = Object.fromEntries(Object.entries(fresh).map(([d, m]) => [d, byOrder(s.bakePlan[d] ?? [], (e) => e.recipeId, m)]))
  }
  if (kinds.has('lot')) next.pantry = byOrder(s.pantry, (l) => l.id, new Map(of('lot').map(([id, v]) => [id, v as AppState['pantry'][number]])))
  if (kinds.has('bought')) {
    const b: AppState['bought'] = {}
    for (const [r, v] of of('bought')) {
      const [w, k] = split2(r)
      ;(b[w] ??= {})[k] = v as AppState['bought'][string][string]
    }
    next.bought = b
  }
  if (kinds.has('check')) {
    const fresh: Record<string, Set<string>> = {}
    for (const [r] of of('check')) {
      const [w, k] = split2(r)
      ;(fresh[w] ??= new Set()).add(k)
    }
    next.checked = Object.fromEntries(
      Object.entries(fresh).map(([w, set]) => [w, [...(s.checked[w] ?? []).filter((k) => set.has(k)), ...[...set].filter((k) => !(s.checked[w] ?? []).includes(k))]]),
    )
  }
  if (kinds.has('cust')) {
    const fresh: Record<string, Map<string, AppState['custom'][string][number]>> = {}
    for (const [r, v] of of('cust')) {
      const [w, id] = split2(r)
      ;(fresh[w] ??= new Map()).set(id, v as AppState['custom'][string][number])
    }
    next.custom = Object.fromEntries(Object.entries(fresh).map(([w, m]) => [w, byOrder(s.custom[w] ?? [], (c) => c.id, m)]))
  }
  if (kinds.has('waste')) {
    const fresh = new Map(of('waste').map(([h, v]) => [h, v as AppState['wasted'][number]]))
    next.wasted = byOrder(s.wasted, (w) => hashOf(w), fresh).sort((a, b) => a.date.localeCompare(b.date))
  }
  if (kinds.has('recipe')) next.customRecipes = byOrder(s.customRecipes, (r) => r.id, new Map(of('recipe') as [string, AppState['customRecipes'][number]][]))
  if (kinds.has('ing')) next.customIngredients = byOrder(s.customIngredients, (i) => i.name, new Map(of('ing') as [string, AppState['customIngredients'][number]][]))
  if (kinds.has('price')) next.prices = obj('price') as AppState['prices']
  if (kinds.has('staple')) next.staples = obj('staple') as AppState['staples']
  if (kinds.has('spice')) next.spices = obj('spice') as AppState['spices']
  if (kinds.has('req')) next.pantryRequests = obj('req') as AppState['pantryRequests']
  if (kinds.has('trip') || kinds.has('ans')) {
    // Freigabe und Antworten zusammen neu bauen (beide Arten stehen vollständig in `live`)
    const t: Record<string, TripState> = {}
    for (const [d, v] of of('trip')) t[d] = { ...(v as TripState) }
    for (const [r, v] of of('ans')) {
      const [d, k] = split2(r)
      const cur = (t[d] ??= {})
      cur.answers = { ...cur.answers, [k]: v as 'have' | 'need' }
    }
    next.trips = t
  }
  if (kinds.has('shop')) {
    const d = live['shop:day']
    if (typeof d === 'number') next.shopDay = d
    else delete next.shopDay
    const o = live['shop:order']
    if (Array.isArray(o) && o.every((c) => typeof c === 'string')) next.shopOrder = o as string[]
    else delete next.shopOrder
  }
  const p = personFrom(live)
  if (kinds.has('rating')) next.ratings = p.ratings
  if (kinds.has('reject')) next.rejects = p.rejects
  if (kinds.has('pf')) next.portionFeedback = p.portionFeedback
  if (kinds.has('bake')) next.bakeRatings = p.bakeRatings
  if (kinds.has('baked')) next.baked = p.baked
  if (kinds.has('bfr')) next.bfRatings = p.bfRatings
  if (kinds.has('bfs')) next.bfSatiety = p.bfSatiety
  return next
}

/** Lernsignale einer Person aus ihren Einträgen */
export function personFrom(live: Record<string, unknown>): PersonSignals {
  const raw: Record<string, unknown> = { ratings: {}, portionFeedback: {}, bakeRatings: {}, rejects: [], baked: [], bfRatings: {}, bfSatiety: {} }
  const r = raw as {
    ratings: Record<string, unknown>; portionFeedback: Record<string, unknown>; bakeRatings: Record<string, unknown>; rejects: unknown[]; baked: unknown[]
    bfRatings: Record<string, unknown>; bfSatiety: Record<string, unknown>
  }
  for (const [k, v] of Object.entries(live)) {
    const kind = kindOf(k)
    const rest = restOf(k)
    if (kind === 'rating') r.ratings[rest] = v
    else if (kind === 'pf') r.portionFeedback[rest] = v
    else if (kind === 'bake') r.bakeRatings[rest] = v
    else if (kind === 'bfr') r.bfRatings[rest] = v
    else if (kind === 'bfs') r.bfSatiety[rest] = v
    else if (kind === 'reject') {
      const [date, id] = split2(rest)
      r.rejects.push({ id, date })
    } else if (kind === 'baked') {
      const [date, recipeId] = split2(rest)
      r.baked.push({ date, recipeId })
    }
  }
  const byDate = (a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date)
  r.rejects.sort(byDate as never)
  r.baked.sort(byDate as never)
  return sanitizePerson(raw)
}

// ───────────── Stempeln & Zusammenführen ─────────────

/**
 * Lokale Werte mit dem letzten Abgleich-Stand vergleichen: unverändert → alte Metadaten, geändert/neu → jetzt von mir,
 * verschwunden → Grabstein. `t0` (erster Abgleich) ersetzt `now` für neue Einträge.
 */
export function stampLocal(local: Record<string, unknown>, base: Record<string, BaseEntry>, now: number, me: string, t0?: number): Items {
  const out: Items = {}
  for (const [k, v] of Object.entries(local)) {
    const b = base[k]
    const h = hashOf(v)
    if (b && !b.d && b.h === h) out[k] = { t: b.t, by: b.by, ...(b.o ? { o: b.o } : {}), v }
    else {
      const it: Item = { t: t0 ?? now, by: me, v }
      if (kindOf(k) === 'plan') {
        // „ausgesucht von“: bleibt, solange dasselbe Gericht dort steht (gekocht/Portionen ändern nichts daran)
        const prev = b && !b.d ? b.o : undefined
        const sameDish = b && !b.d && b.r === (v as { recipeId?: string }).recipeId
        it.o = sameDish && prev ? prev : me
      }
      out[k] = it
    }
  }
  for (const [k, b] of Object.entries(base)) {
    if (k in local) continue
    out[k] = b.d ? { t: b.t, by: b.by, d: 1 } : { t: now, by: me, d: 1 }
  }
  return out
}

/** wer gewinnt: späteres t, dann Person, dann Prüfsumme – überall gleich */
export function newer(a: Item, b: Item): Item {
  if (a.t !== b.t) return a.t > b.t ? a : b
  if (a.by !== b.by) return a.by > b.by ? a : b
  const ha = a.d ? '~' : hashOf(a.v)
  const hb = b.d ? '~' : hashOf(b.v)
  return ha >= hb ? a : b
}

export function mergeItems(a: Items, b: Items, now: number): Items {
  const out: Items = {}
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[k]
    const y = b[k]
    const w = x && y ? newer(x, y) : (x ?? y)!
    if (w.d && w.t < now - TOMB_MS) continue
    out[k] = w
  }
  return out
}

// ───────────── Dokumente in der To-do-Liste ─────────────

interface RawDoc {
  summary: string
  uid: string
}
export interface RemoteState {
  /** lesbare Dokumente (mehrere Einträge mit gleichem Titel werden zusammengeführt) */
  docs: Map<string, Items>
  /** Personen-Dokumente: Name → Zeitpunkt (ms) des letzten Schreibens */
  personAt: Map<string, number>
  /** unvollständig (gerade halb geschrieben) → diesmal nicht verwenden und nicht überschreiben */
  partial: Set<string>
  /** vorhanden, aber kaputt (falsches JSON) → mit eigenem Stand reparieren */
  broken: Set<string>
  main?: MainDoc
  /** vorhandene Einträge je Dokument (zum Aktualisieren/Entfernen) */
  entries: Map<string, RawDoc[]>
}

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)

/** Einträge eines Dokuments prüfen: nur { t: Zahl, by: Text, v | d } */
function validItems(x: unknown): Items | null {
  if (!isObj(x) || !isObj(x.items)) return null
  const out: Items = {}
  for (const [k, it] of Object.entries(x.items)) {
    if (!k.includes(':') || !isObj(it) || typeof it.t !== 'number' || !Number.isFinite(it.t) || typeof it.by !== 'string') continue
    if (it.d === 1) out[k] = { t: it.t, by: it.by, d: 1 }
    else if (it.v !== undefined && it.v !== null) out[k] = { t: it.t, by: it.by, v: it.v, ...(typeof it.o === 'string' ? { o: it.o } : {}) }
  }
  return out
}

export function parseRemote(todos: RemoteTodo[]): RemoteState {
  const st: RemoteState = { docs: new Map(), personAt: new Map(), partial: new Set(), broken: new Set(), entries: new Map() }
  const chunks = new Map<string, { i: number; n: number; h: string; d: string }[]>()
  const texts = new Map<string, string[]>()
  for (const t of todos) {
    if (!t.summary.startsWith(PREFIX)) continue
    const rest = t.summary.slice(PREFIX.length)
    const m = /^(.+)#(\d+)$/.exec(rest)
    const name = m ? m[1] : rest
    if (!st.entries.has(name)) st.entries.set(name, [])
    st.entries.get(name)!.push({ summary: t.summary, uid: t.uid })
    const desc = t.description ?? ''
    if (m) {
      const c = /^([a-z0-9]+)\|(\d+)\/(\d+)\|([\s\S]*)$/.exec(desc)
      if (!c) {
        st.partial.add(name)
        continue
      }
      if (!chunks.has(name)) chunks.set(name, [])
      chunks.get(name)!.push({ h: c[1], i: Number(c[2]), n: Number(c[3]), d: c[4] })
    } else {
      if (!texts.has(name)) texts.set(name, [])
      texts.get(name)!.push(desc)
    }
  }
  for (const [name, cs] of chunks) {
    // vollständigen Satz mit gleicher Prüfsumme suchen
    const byH = new Map<string, Map<number, string>>()
    for (const c of cs) {
      if (!byH.has(c.h)) byH.set(c.h, new Map())
      byH.get(c.h)!.set(c.i, c.d)
    }
    let found = false
    for (const [h, parts] of byH) {
      const n = cs.find((c) => c.h === h)!.n
      if (parts.size !== n) continue
      const text = Array.from({ length: n }, (_, i) => parts.get(i) ?? '').join('')
      if (hashText(text) !== h) continue
      if (!texts.has(name)) texts.set(name, [])
      texts.get(name)!.push(text)
      found = true
      break
    }
    if (!found && !texts.has(name)) st.partial.add(name)
  }
  for (const [name, list] of texts) {
    let merged: Items | null = null
    let at = 0
    for (const text of list) {
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        continue
      }
      if (name === 'main') {
        const mm = parsed as Partial<MainDoc> | null
        if (isObj(mm) && typeof mm.device === 'string' && typeof mm.person === 'string' && typeof mm.t === 'number') {
          const cand: MainDoc = { device: mm.device, person: mm.person, t: mm.t, until: typeof mm.until === 'number' ? mm.until : mm.t + LEASE_MS, ...(isObj(mm.ha) ? { ha: sanitizeMainHa(mm.ha) } : {}) }
          if (!st.main || cand.t > st.main.t || (cand.t === st.main.t && cand.device > st.main.device)) st.main = cand
        }
        merged = merged ?? {}
        continue
      }
      const items = validItems(parsed)
      if (!items) continue
      if (isObj(parsed) && typeof parsed.at === 'number') at = Math.max(at, parsed.at)
      merged = merged ? mergeItems(merged, items, Number.MAX_SAFE_INTEGER / 2) : items
    }
    if (merged === null) {
      if (!st.partial.has(name)) st.broken.add(name)
      continue
    }
    st.partial.delete(name)
    if (name !== 'main') st.docs.set(name, merged)
    if (name.startsWith('person:')) st.personAt.set(name.slice(7), at)
  }
  return st
}

function sanitizeMainHa(x: Record<string, unknown>): MainDoc['ha'] {
  const items: Record<string, string> = {}
  if (isObj(x.items)) for (const [k, v] of Object.entries(x.items)) if (typeof v === 'string') items[k] = v
  const events: HaSettings['events'] = {}
  if (isObj(x.events))
    for (const [k, v] of Object.entries(x.events)) if (isObj(v) && typeof v.sig === 'string') events[k] = { sig: v.sig, ...(typeof v.uid === 'string' ? { uid: v.uid } : {}) }
  const done = Array.isArray(x.done) ? x.done.filter((k): k is string => typeof k === 'string') : undefined
  return { items, events, ...(done ? { done } : {}) }
}

/** Dokument als Text bzw. in Teilen */
export function encodeDoc(name: string, text: string): { summary: string; description: string }[] {
  if (text.length <= CHUNK) return [{ summary: PREFIX + name, description: text }]
  const h = hashText(text)
  const n = Math.ceil(text.length / CHUNK)
  return Array.from({ length: n }, (_, i) => ({ summary: `${PREFIX}${name}#${i}`, description: `${h}|${i}/${n}|${text.slice(i * CHUNK, (i + 1) * CHUNK)}` }))
}

export type Op =
  | { op: 'add'; summary: string; description: string }
  | { op: 'update'; uid: string; description: string }
  | { op: 'remove'; uid: string }

/** Schreibschritte für ein Dokument: vorhandene Einträge aktualisieren, fehlende anlegen, überzählige entfernen */
export function planWrite(existing: RawDoc[], todos: RemoteTodo[], parts: { summary: string; description: string }[]): Op[] {
  const ops: Op[] = []
  const used = new Set<string>()
  const descOf = new Map(todos.map((t) => [t.uid, t.description ?? '']))
  for (const p of parts) {
    const e = existing.find((x) => x.summary === p.summary && !used.has(x.uid))
    if (e) {
      used.add(e.uid)
      if (descOf.get(e.uid) !== p.description) ops.push({ op: 'update', uid: e.uid, description: p.description })
    } else ops.push({ op: 'add', summary: p.summary, description: p.description })
  }
  for (const e of existing) if (!used.has(e.uid)) ops.push({ op: 'remove', uid: e.uid })
  return ops
}

// ───────────── Ein Abgleich (rein, testbar) ─────────────

export interface RoundInput {
  state: AppState
  todos: RemoteTodo[]
  now: number
  today: string
  me: string
}

export interface RoundResult {
  /** neuer Stand (nur geteilte Felder + sync + ggf. onboarding sind relevant) */
  next: AppState
  /** Prüfsumme der geteilten Werte beim Start (Änderungen währenddessen → nicht übernehmen, neu abgleichen) */
  startHash: string
  /** geteilte Werte haben sich durch den Abgleich geändert */
  changed: boolean
  ops: Op[]
  notices: SyncNotice[]
  remote: RemoteState
}

/** Lernsignale aller Personen für den gemeinsamen Portionsfaktor */
export function householdFeedback(s: Pick<AppState, 'portionFeedback' | 'sync' | 'ha'>): Record<string, PortionFeedback>[] {
  if (!sharingActive(s.ha)) return [s.portionFeedback]
  return [s.portionFeedback, ...Object.values(s.sync?.household ?? {}).map((p) => p.portionFeedback)]
}

const titleOf = (v: unknown) => RECIPE_BY_ID[(v as { recipeId?: string } | undefined)?.recipeId ?? '']?.title ?? 'Gericht'

export function syncRound(inp: RoundInput): RoundResult {
  const { state, now, today, me } = inp
  const sync: SyncLocal = state.sync ?? emptySync()
  const remote = parseRemote(inp.todos)
  const startHash = sharedHash(state)
  const localVals = extract(state)
  const remoteHasData = [...remote.docs.entries()].some(([n, it]) => n === 'kitchen' && Object.keys(it).length > 0)
  const first = !sync.joined
  const local = stampLocal(localVals, sync.base, now, me, first ? (remoteHasData ? 0 : 1) : undefined)
  const myDocs = new Set(['kitchen', 'recipes', 'prefs', `person:${me}`])

  // zusammenführen (Dokumente, die gerade halb geschrieben sind, bleiben lokal)
  const merged: Items = {}
  for (const [k, it] of Object.entries(local)) merged[k] = it
  for (const name of myDocs) {
    if (remote.partial.has(name)) continue
    const r = remote.docs.get(name)
    if (!r) continue
    const mine = Object.fromEntries(Object.entries(local).filter(([k]) => docOf(k, me) === name))
    // nur Schlüssel, die in dieses Dokument gehören (fremde/kaputte Einträge ignorieren)
    const theirs = Object.fromEntries(Object.entries(r).filter(([k]) => docOf(k, me) === name))
    Object.assign(merged, mergeItems(mine, theirs, now))
    // Grabsteine, die beim Zusammenführen vergessen wurden, auch lokal vergessen
    for (const k of Object.keys(mine)) if (!(k in merged) || (merged[k].d && merged[k].t < now - TOMB_MS)) delete merged[k]
  }
  for (const k of Object.keys(merged)) if (merged[k].d && merged[k].t < now - TOMB_MS) delete merged[k]

  // was kommt von außen? → Felder neu bauen
  const kinds = new Set<string>()
  const changes: { k: string; l?: Item; m: Item }[] = []
  for (const [k, m] of Object.entries(merged)) {
    const l = local[k]
    const lv = l && !l.d ? hashOf(l.v) : '-'
    const mv = m.d ? '-' : hashOf(m.v)
    if (lv === mv) continue
    kinds.add(kindOf(k))
    changes.push({ k, l, m })
  }
  const live = (items: Items) => Object.fromEntries(Object.entries(items).filter(([, it]) => !it.d).map(([k, it]) => [k, it.v]))
  const build = (from: AppState, ks: Set<string>) => sanitize(JSON.parse(JSON.stringify(rebuild(from, live(merged), ks))))
  let next: AppState = state
  if (kinds.size) next = build(state, kinds)
  // Werte von außen, die die Prüfung verwirft (kaputt, unbekanntes Rezept …): ignorieren, eigenen Wert behalten
  const dropped = new Set<string>()
  if (changes.length) {
    const vals = extract(next)
    const restore = new Set<string>()
    for (const c of changes) {
      if (c.m.d || c.k in vals) continue
      dropped.add(c.k)
      if (c.l && !c.l.d) {
        merged[c.k] = c.l
        restore.add(kindOf(c.k))
      } else delete merged[c.k]
    }
    if (restore.size) next = build(next, restore)
  }

  // Hinweise für Änderungen anderer Personen
  const notices: SyncNotice[] = []
  const checkedBy = new Map<string, number>()
  for (const { k, l, m } of changes) {
    if (first || m.by === me || dropped.has(k)) continue
    if (kindOf(k) === 'plan') {
      const day = restOf(k)
      const oldV = l && !l.d ? l.v : undefined
      const newV = m.d ? undefined : m.v
      const oldId = (oldV as { recipeId?: string } | undefined)?.recipeId
      const newId = (newV as { recipeId?: string } | undefined)?.recipeId
      if (oldId === newId) continue
      const wd = weekdayName(day)
      const text = oldV && newV ? `${m.by} hat ${wd} geändert: ${titleOf(oldV)} → ${titleOf(newV)}` : newV ? `${m.by} hat ${wd} geplant: ${titleOf(newV)}` : `${m.by} hat ${wd} geleert (${titleOf(oldV)})`
      notices.push({ id: uid(), at: now, by: m.by, text, undo: { day, ...(oldV ? { value: oldV } : {}) } })
    } else if (kindOf(k) === 'check' && !m.d) checkedBy.set(m.by, (checkedBy.get(m.by) ?? 0) + 1)
    else if (kindOf(k) === 'trip' && !m.d && !(l && !l.d)) {
      const day = restOf(k)
      notices.push({ id: uid(), at: now, by: m.by, text: `${m.by} hat den Einkauf ${weekdayName(day, true)} ${shortDate(day)} freigegeben` })
    }
  }
  for (const [by, n] of checkedBy) notices.push({ id: uid(), at: now, by, text: `${by} hat ${n} Artikel auf der Einkaufsliste abgehakt` })

  // dem Haushalt beitreten: keine Start-Checkliste mit Kalorienprofil
  if (first && remoteHasData && !next.onboarding) next = { ...next, onboarding: 'done' }

  // andere Personen
  const household: SyncLocal['household'] = {}
  const peers: SyncLocal['peers'] = { ...sync.peers }
  for (const [name, items] of remote.docs) {
    if (!name.startsWith('person:')) continue
    const person = name.slice(7)
    peers[person] = remote.personAt.get(person) ?? peers[person] ?? 0
    if (person === me) continue
    household[person] = personFrom(live(items))
  }
  for (const [p, sig] of Object.entries(sync.household)) if (!(p in household) && remote.partial.has(`person:${p}`)) household[p] = sig

  // vergangene Abendessen abziehen – nur mit frisch gelesenem Küchen-Dokument (siehe Kopf)
  if (!remote.partial.has('kitchen')) {
    const fb = [next.portionFeedback, ...Object.values(household).map((p) => p.portionFeedback)]
    const r = cookDue(next.plan, next.pantry, today, portionFactor(fb, today))
    if (r.changed) {
      const tmpBase = baseFrom(merged)
      next = { ...next, plan: r.plan, pantry: r.pantry }
      const vals = extract(next)
      const restamped = stampLocal(vals, tmpBase, now, me)
      for (const [k, it] of Object.entries(restamped)) merged[k] = it
    }
  }

  // neuer Abgleich-Stand: Metadaten aus dem Ergebnis, Prüfsumme aus dem tatsächlich übernommenen Wert
  const base = baseFrom(merged)
  const keep = sync.notices.filter((n) => n.at > now - NOTICE_MS)
  const newSync: SyncLocal = {
    ...sync,
    base,
    household,
    peers,
    notices: [...keep, ...notices].slice(-20),
    pulledAt: now,
    joined: sync.joined || !remote.partial.has('kitchen'),
    ...(remote.main ? { main: { device: remote.main.device, person: remote.main.person, t: remote.main.t } } : {}),
  }
  next = { ...next, sync: newSync }

  // schreiben: eigene Dokumente, deren Inhalt sich vom gelesenen unterscheidet
  const ops: Op[] = []
  for (const name of myDocs) {
    if (remote.partial.has(name)) continue
    const items = Object.fromEntries(Object.entries(merged).filter(([k]) => docOf(k, me) === name))
    const r = remote.docs.get(name)
    if (r && hashOf(r) === hashOf(items) && !remote.broken.has(name)) continue
    // leere Dokumente nicht anlegen – außer dem eigenen Personen-Dokument (zeigt den anderen: „mit Lisa“)
    if (!r && !Object.keys(items).length && !remote.entries.has(name) && name !== `person:${me}`) continue
    const text = JSON.stringify({ v: 1, at: now, by: me, items })
    ops.push(...planWrite(remote.entries.get(name) ?? [], inp.todos, encodeDoc(name, text)))
  }
  return { next, startHash, changed: kinds.size > 0 || next.plan !== state.plan, ops, notices, remote }
}

/**
 * Abgleich-Stand aus zusammengeführten Einträgen. Prüfsumme vom zusammengeführten Wert: weicht der lokal übernommene
 * Wert davon ab (z. B. beim Prüfen verworfen/normalisiert), gilt das beim nächsten Abgleich als eigene Änderung.
 */
function baseFrom(merged: Items): Record<string, BaseEntry> {
  const base: Record<string, BaseEntry> = {}
  for (const [k, it] of Object.entries(merged)) {
    if (it.d) base[k] = { t: it.t, by: it.by, h: '', d: 1 }
    else {
      const v = it.v
      const e: BaseEntry = { t: it.t, by: it.by, h: hashOf(v) }
      if (it.o) e.o = it.o
      if (kindOf(k) === 'plan') e.r = (v as { recipeId?: string }).recipeId
      base[k] = e
    }
  }
  return base
}

/** Ergebnis auf den aktuellen Stand anwenden. Hat sich währenddessen lokal etwas Geteiltes geändert → nur Haushalt/Hinweise. */
export function applyRound(cur: AppState, res: RoundResult): { state: AppState; stale: boolean } {
  const stale = sharedHash(cur) !== res.startHash
  const sync = res.next.sync!
  if (stale) {
    const s = cur.sync ?? emptySync()
    return { state: { ...cur, sync: { ...s, household: sync.household, peers: sync.peers, notices: sync.notices, main: sync.main, pulledAt: sync.pulledAt } }, stale }
  }
  const n = res.next
  return {
    state: {
      ...cur,
      plan: n.plan, bakePlan: n.bakePlan, pantry: n.pantry, bought: n.bought, checked: n.checked, custom: n.custom, wasted: n.wasted,
      customRecipes: n.customRecipes, customIngredients: n.customIngredients, prices: n.prices, staples: n.staples, spices: n.spices,
      pantryRequests: n.pantryRequests, ratings: n.ratings, rejects: n.rejects, portionFeedback: n.portionFeedback, bakeRatings: n.bakeRatings, baked: n.baked,
      bfRatings: n.bfRatings, bfSatiety: n.bfSatiety,
      trips: n.trips, shopDay: n.shopDay, shopOrder: n.shopOrder,
      onboarding: cur.onboarding ?? n.onboarding,
      sync,
    },
    stale,
  }
}

// ───────────── mit Home Assistant (asynchron) ─────────────

export async function runOps(api: HaApi, entity: string, ops: Op[]): Promise<void> {
  const target = { entity_id: entity }
  for (const o of ops) {
    if (o.op === 'add') await api.callService('todo', 'add_item', { item: o.summary, description: o.description }, target)
    else if (o.op === 'update') await api.callService('todo', 'update_item', { item: o.uid, description: o.description }, target)
    else await api.callService('todo', 'remove_item', { item: o.uid }, target)
  }
}

export interface FamilyResult {
  res: RoundResult
  /** Fehler beim Schreiben (Lesen hat geklappt, Daten sind übernommen) */
  error?: string
}

/** Lesen → zusammenführen → schreiben. Wirft nur bei Netzwerkfehlern beim Lesen. */
export async function familySync(api: HaApi, entity: string, state: AppState, me: string, now: Date, today: string): Promise<FamilyResult> {
  const todos = await listTodo(api, entity)
  const res = syncRound({ state, todos, now: now.getTime(), today, me })
  let error: string | undefined
  try {
    await runOps(api, entity, res.ops)
  } catch (e) {
    error = e instanceof HaError ? e.message : e instanceof Error ? e.message : String(e)
  }
  return { res, error }
}

/** so lange gehört der „Schreibstab“ für Einkaufsliste/Kalender in HA einem Gerät, wenn es sich nicht meldet */
export const LEASE_MS = 5 * 60_000

export interface LeaseDecision {
  /** dieses Gerät hält den Schreibstab und darf jetzt Einkaufsliste/Kalender abgleichen */
  holder: boolean
  /** Schreibstab ist frei/abgelaufen → übernehmen (diesmal noch nicht schreiben, erst nach Bestätigung im nächsten Lauf) */
  claim: boolean
  /** Ablauf bald → verlängern */
  renew: boolean
  /** Zuordnungen (uids) des vorigen Halters – beim Übernehmen erben */
  inherit?: MainDoc['ha']
}

/**
 * Schreibstab (Dokument `main`): Wer gerade abgleicht und den Stab hält (oder ihn frei vorfindet), pflegt Google Tasks
 * und Kalender – mit den gemeinsamen Zuordnungen aus dem Dokument. So landet, was Lisa plant, sofort (oder spätestens,
 * wenn Marc die App öffnet) in HA, und nie schreiben zwei Geräte gleichzeitig. Gleichzeitiges Übernehmen: alle lesen
 * danach dasselbe Dokument (größtes t, dann Gerät) → genau einer gewinnt; geschrieben wird erst nach dieser Bestätigung.
 */
export function leaseDecision(remote: RemoteState, device: string, now: number): LeaseDecision {
  const cur = remote.main
  if (cur && cur.device === device && cur.until >= now) return { holder: true, claim: false, renew: cur.until - now < LEASE_MS / 2 }
  if (cur && cur.until >= now) return { holder: false, claim: false, renew: false }
  return { holder: false, claim: true, renew: false, inherit: cur && cur.device !== device ? cur.ha : undefined }
}

export async function writeMain(api: HaApi, entity: string, doc: MainDoc, todos?: RemoteTodo[] | null): Promise<void> {
  const list = todos ?? (await listTodo(api, entity))
  const existing = list.filter((t) => t.summary === PREFIX + 'main').map((t) => ({ summary: t.summary, uid: t.uid }))
  await runOps(api, entity, planWrite(existing, list, [{ summary: PREFIX + 'main', description: JSON.stringify(doc) }]))
}

/** „Synchronisiert vor 1 Min. · mit Lisa“ */
export function syncStatusText(s: SyncLocal | undefined, me: string | undefined, now: number): string {
  if (!s?.pulledAt) return 'Noch nicht abgeglichen'
  const min = Math.floor((now - s.pulledAt) / 60_000)
  const ago = min < 1 ? 'gerade eben' : min < 60 ? `vor ${min} Min.` : min < 1440 ? `vor ${Math.floor(min / 60)} Std.` : `vor ${Math.floor(min / 1440)} Tagen`
  const others = Object.keys(s.peers).filter((p) => p !== me)
  return `Synchronisiert ${ago}${others.length ? ` · mit ${others.join(', ')}` : ' · noch niemand sonst'}`
}

/** wer hat das Gericht dieses Tages ausgesucht (nur andere Personen) */
export function plannedBy(s: AppState, day: string): string | undefined {
  if (!sharingActive(s.ha)) return undefined
  const b = s.sync?.base[`plan:${day}`]
  return b && !b.d && b.o && b.o !== s.ha.me ? b.o : undefined
}
