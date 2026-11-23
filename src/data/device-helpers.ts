// Gemeinsame Bausteine für Geräte-Schritte: Famag (Spiralkneter) und Witt Rotante (Pizzaofen).
// Regeln: docs/geraete/regeln.md, Gerätedaten: docs/geraete/famag.md und docs/geraete/witt.md
import type { DeviceSetting } from '../types'

/** Famag Grilletta IM5: Kneten (1–30 Min.); `mode` 'Mischen' für kurzes Unterarbeiten, 'Kneten langsam' für Roggen/Dinkel */
export const famag = (minutes: number, o: { mode?: 'Kneten' | 'Mischen' | 'Kneten langsam' | 'Kneten schnell'; level?: string; note?: string } = {}): DeviceSetting => ({
  device: 'kneter',
  mode: o.mode ?? 'Kneten',
  minutes,
  ...(o.level ? { level: o.level } : {}),
  ...(o.note ? { note: o.note } : {}),
})

/**
 * Klassischen Knet-Satz auf den Famag umschreiben: „… 8 Minuten zu einem glatten Teig kneten“ →
 * „… im Famag 10 Minuten zu einem glatten Teig kneten“. Wirft, wenn der Satz nicht passt (fällt beim Prüfen sofort auf).
 */
export function mitFamag(text: string, minutes: number): string {
  const re = /(\d+(?:–\d+)?) Minuten (kurz |langsam |kräftig )?(zu einem|schlagen)/
  if (!re.test(text)) throw new Error(`mitFamag: kein Knet-Satz in „${text}“`)
  return text.replace(re, (_m, _n, adv: string | undefined, rest: string) => `im Famag ${minutes} Minuten ${adv ?? ''}${rest === 'schlagen' ? 'kneten' : rest}`)
}

/** Witt Rotante vorheizen (Stein messen), dazu der Ausweichweg Combair PizzaPlus */
export const wittVorheizen = (temp = 450, combairTemp = 280): DeviceSetting[] => [
  { device: 'pizzaofen', mode: 'Vorheizen', temp, minutes: 25, note: 'Stein mit Infrarot-Thermometer prüfen' },
  { device: 'combair', mode: 'PizzaPlus', temp: combairTemp, note: 'vorheizen, dunkles Blech Ebene 2', alt: true },
]

/** Pizza im Witt Rotante backen; Ausweichweg Combair PizzaPlus (Minuten je Pizza) */
export const wittBacken = (temp: number, seconds: number, combairMinutes: number, combairTemp = 280, note = 'je Pizza'): DeviceSetting[] => [
  { device: 'pizzaofen', mode: 'Pizzastein', temp, seconds, note },
  { device: 'combair', mode: 'PizzaPlus', temp: combairTemp, minutes: combairMinutes, note: 'je Pizza, ohne Backpapier', alt: true },
]

// ───────────── BBQ: Traeger, Gasgrill, Dutch Oven, Vakuumierer (docs/bbq-regeln.md, docs/geraete/traeger.md, grill-dutch.md) ─────────────

/** °F → °C, auf ganze Grad gerundet (225 °F → 107 °C) */
export const fToC = (f: number): number => Math.round(((f - 32) * 5) / 9)

/**
 * Traeger Timberline 850: Temperatur wird am Controller in °F (5-°F-Schritte) gewählt → Einstellung in °C,
 * der Traeger-Wert steht in der Notiz („225 °F · Pellets Hickory“). Text nennt beides: „bei 107 °C (225 °F)“.
 *   traeger('Smoken', 225, { minutes: 360, core: 95, note: 'Pellets Hickory' })
 */
export const traeger = (
  mode: 'Vorheizen' | 'Smoken' | 'Super Smoke' | 'Grillen',
  tempF: number,
  o: { minutes?: number; core?: number; note?: string } = {},
): DeviceSetting => ({
  device: 'smoker',
  mode,
  temp: fToC(tempF),
  ...(o.minutes != null ? { minutes: o.minutes } : {}),
  ...(o.core != null ? { core: o.core } : {}),
  note: [`${tempF} °F`, o.note].filter(Boolean).join(' · '),
})

/**
 * Gasgrill (4 Brenner, Deckelthermometer als Richtwert): direkt = alle Brenner, indirekt = äußere Brenner an, Mitte aus, Deckel zu.
 *   gasgrill('Indirekt', 160, 'mittel', '1+4', { minutes: 90, core: 72 })
 */
export const gasgrill = (
  mode: 'Vorheizen' | 'Direkt' | 'Indirekt',
  temp: number | undefined,
  level: 'niedrig' | 'mittel' | 'hoch',
  burners: string,
  o: { minutes?: number; core?: number; note?: string } = {},
): DeviceSetting => ({
  device: 'gasgrill',
  mode,
  ...(temp != null ? { temp } : {}),
  level,
  burners,
  ...(o.minutes != null ? { minutes: o.minutes } : {}),
  ...(o.core != null ? { core: o.core } : {}),
  ...(o.note ? { note: o.note } : {}),
})

/** Dutch Oven auf der Gasflamme (Hockerkocher/Gasgrill-Brenner): Flamme + Dauer, Notiz z. B. „Deckel zu“ */
export const dutch = (
  mode: 'Anbraten' | 'Schmoren' | 'Köcheln',
  level: 'niedrig' | 'mittel' | 'hoch',
  o: { minutes?: number; core?: number; note?: string } = {},
): DeviceSetting => ({
  device: 'dutch',
  mode,
  level,
  ...(o.minutes != null ? { minutes: o.minutes } : {}),
  ...(o.core != null ? { core: o.core } : {}),
  ...(o.note ? { note: o.note } : {}),
})

/** Vakuumierer: Beutel vakuumieren (feucht = Marinade/Saft im Beutel), Notiz z. B. „6 Beutel à 250 g“ */
export const vakuum = (mode: 'Vakuumieren' | 'Vakuumieren feucht' | 'Verschweißen' = 'Vakuumieren', note?: string): DeviceSetting => ({
  device: 'vakuum',
  mode,
  ...(note ? { note } : {}),
})

/** BORA-Kochzone (Stufe '1'–'9', 'Power', 'Schmelzen', 'Warmhalten', 'Simmern') */
export const bora = (level: string, o: { minutes?: number; note?: string } = {}): DeviceSetting => ({
  device: 'bora',
  mode: 'Kochzone',
  level,
  ...(o.minutes != null ? { minutes: o.minutes } : {}),
  ...(o.note ? { note: o.note } : {}),
})

/** CombiSteamer/Combair-Einstellung (Betriebsart exakt wie in docs/geraete/regeln.md) */
export const vzug = (
  device: 'steamer' | 'combair',
  mode: string,
  temp?: number,
  o: { minutes?: number; core?: number; note?: string; alt?: boolean } = {},
): DeviceSetting => ({
  device,
  mode,
  ...(temp != null ? { temp } : {}),
  ...(o.minutes != null ? { minutes: o.minutes } : {}),
  ...(o.core != null ? { core: o.core } : {}),
  ...(o.note ? { note: o.note } : {}),
  ...(o.alt ? { alt: true } : {}),
})
