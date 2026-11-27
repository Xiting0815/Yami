/**
 * Lokaler Zustand der Familien-Synchronisierung (nur auf diesem Gerät; Logik in src/sync.ts).
 * Bewusst ohne Import aus store.ts, damit store.ts das hier beim Laden prüfen kann.
 */
import type { PortionFeedback, Rating, RejectEvent } from './learning'

/** Metadaten eines geteilten Eintrags: Zeitpunkt der letzten Änderung, wer, (Plan) wer das Gericht ausgesucht hat */
export interface ItemMeta {
  t: number
  by: string
  /** nur Plan: wer das Gericht dieses Tages gewählt hat („von Lisa“) */
  o?: string
}

/** zuletzt abgeglichener Stand eines Eintrags: Metadaten + Prüfsumme des Werts (d = gelöscht/Grabstein) */
export interface BaseEntry extends ItemMeta {
  h: string
  d?: 1
  /** nur Plan: Rezept-Id (erkennt „anderes Gericht“ → neue Herkunft) */
  r?: string
}

/** Lernsignale einer anderen Person (aus ihrem Personen-Dokument) */
export interface PersonSignals {
  ratings: Record<string, Rating>
  rejects: RejectEvent[]
  portionFeedback: Record<string, PortionFeedback>
  bakeRatings: Record<string, Rating>
  baked: { date: string; recipeId: string }[]
  /** Frühstück (nur die Person selbst): Bewertung nach dem Vorbereiten, Schlüssel `Prep-Tag:Rezept-Id` */
  bfRatings: Record<string, Rating>
  /** Frühstück: „bis mittags satt?“ −1 zu wenig · 0 passt · 1 zu viel, Schlüssel `Prep-Tag:Rezept-Id` */
  bfSatiety: Record<string, PortionFeedback>
}

/** Hinweis „Lisa hat Montag geändert: Gulasch → Lasagne · Rückgängig“ */
export interface SyncNotice {
  id: string
  /** Zeitpunkt (ms) */
  at: number
  by: string
  text: string
  /** Rückgängig: Planeintrag dieses Tages auf den alten Wert setzen (value fehlt = Tag leeren) */
  undo?: { day: string; value?: unknown }
}

export interface SyncLocal {
  base: Record<string, BaseEntry>
  /** andere Personen des Haushalts: Name → Lernsignale */
  household: Record<string, PersonSignals>
  notices: SyncNotice[]
  /** Personen mit eigenem Dokument: Name → zuletzt geschrieben (ms) */
  peers: Record<string, number>
  /** wer zuletzt Einkaufsliste/Kalender in HA gepflegt hat (Schreibstab, siehe sync.ts) */
  main?: { device: string; person: string; t: number }
  /** letzter erfolgreicher Abgleich (ms) */
  pulledAt?: number
  /** schon einmal erfolgreich abgeglichen (danach zählen lokale Änderungen normal) */
  joined?: boolean
}

export const emptySync = (): SyncLocal => ({ base: {}, household: {}, notices: [], peers: {} })

const ISO = /^\d{4}-\d{2}-\d{2}$/
const DISH = /^\d{4}-\d{2}-\d{2}:.+/
const obj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)
const num = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x)
const isRating = (v: unknown): v is Rating => v === 'up' || v === 'again' || v === 'down'

export function sanitizePerson(x: unknown): PersonSignals {
  const p = obj(x) ? x : {}
  const ratings: Record<string, Rating> = {}
  // Abendessen: `Tag:Rezept-Id` (gehört zum Gericht), ältere Stände nur `Tag`
  if (obj(p.ratings)) for (const [d, v] of Object.entries(p.ratings)) if ((ISO.test(d) || DISH.test(d)) && isRating(v)) ratings[d] = v
  const bakeRatings: Record<string, Rating> = {}
  if (obj(p.bakeRatings)) for (const [k, v] of Object.entries(p.bakeRatings)) if (/^\d{4}-\d{2}-\d{2}:.+/.test(k) && isRating(v)) bakeRatings[k] = v
  const portionFeedback: Record<string, PortionFeedback> = {}
  if (obj(p.portionFeedback)) for (const [d, v] of Object.entries(p.portionFeedback)) if ((ISO.test(d) || DISH.test(d)) && (v === -1 || v === 0 || v === 1)) portionFeedback[d] = v
  const rejects = Array.isArray(p.rejects)
    ? p.rejects.filter((r): r is RejectEvent => obj(r) && typeof r.id === 'string' && typeof r.date === 'string' && ISO.test(r.date)).map((r) => ({ id: r.id, date: r.date })).slice(-400)
    : []
  const baked = Array.isArray(p.baked)
    ? p.baked.filter((b): b is { date: string; recipeId: string } => obj(b) && typeof b.recipeId === 'string' && typeof b.date === 'string' && ISO.test(b.date)).map((b) => ({ date: b.date, recipeId: b.recipeId })).slice(-200)
    : []
  const bfRatings: Record<string, Rating> = {}
  if (obj(p.bfRatings)) for (const [k, v] of Object.entries(p.bfRatings)) if (/^\d{4}-\d{2}-\d{2}:.+/.test(k) && isRating(v)) bfRatings[k] = v
  const bfSatiety: Record<string, PortionFeedback> = {}
  if (obj(p.bfSatiety)) for (const [k, v] of Object.entries(p.bfSatiety)) if (/^\d{4}-\d{2}-\d{2}:.+/.test(k) && (v === -1 || v === 0 || v === 1)) bfSatiety[k] = v
  return { ratings, rejects, portionFeedback, bakeRatings, baked, bfRatings, bfSatiety }
}

/** gespeicherten Sync-Zustand prüfen (kaputte Teile fallen weg, nie Absturz) */
export function sanitizeSync(x: unknown): SyncLocal | undefined {
  if (!obj(x)) return undefined
  const out = emptySync()
  if (obj(x.base))
    for (const [k, v] of Object.entries(x.base)) {
      if (!obj(v) || !num(v.t) || typeof v.by !== 'string' || typeof v.h !== 'string') continue
      out.base[k] = { t: v.t, by: v.by, h: v.h, ...(typeof v.o === 'string' && v.o ? { o: v.o } : {}), ...(typeof v.r === 'string' ? { r: v.r } : {}), ...(v.d === 1 ? { d: 1 as const } : {}) }
    }
  if (obj(x.household)) for (const [n, p] of Object.entries(x.household)) if (n && n.length <= 40) out.household[n] = sanitizePerson(p)
  if (Array.isArray(x.notices))
    out.notices = x.notices
      .filter((n): n is SyncNotice => obj(n) && typeof n.id === 'string' && num(n.at) && typeof n.by === 'string' && typeof n.text === 'string')
      .map((n) => ({ id: n.id, at: n.at, by: n.by, text: n.text, ...(obj(n.undo) && typeof n.undo.day === 'string' && ISO.test(n.undo.day) ? { undo: { day: n.undo.day, value: n.undo.value } } : {}) }))
      .slice(-20)
  if (obj(x.peers)) for (const [n, t] of Object.entries(x.peers)) if (num(t)) out.peers[n] = t
  if (obj(x.main) && typeof x.main.device === 'string' && typeof x.main.person === 'string' && num(x.main.t)) out.main = { device: x.main.device, person: x.main.person, t: x.main.t }
  if (num(x.pulledAt)) out.pulledAt = x.pulledAt
  if (x.joined === true) out.joined = true
  return out
}
