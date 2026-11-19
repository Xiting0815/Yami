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
