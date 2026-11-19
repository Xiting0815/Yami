// Regeln: passen Text und Geräte-Einstellungen eines Geräte-Schritts zusammen?
// (Temperatur, Betriebsart, Gerät, Minuten). Genutzt von check-device-text.ts und check-data.ts.
import { DEVICE_STEPS } from '../src/data/device-steps'
import type { Device, DeviceStep } from '../src/types'

export interface TextFinding { id: string; step: number; msg: string; text: string }

const OVENS: Device[] = ['steamer', 'combair', 'airfryer', 'pizzaofen']

/** Betriebsart-Wörter im Text → passende Einstellungen */
const MODE_WORDS: { re: RegExp; label: string; ok: (mode: string, device: Device) => boolean }[] = [
  { re: /Ober-\s*\/\s*Unterhitze/i, label: 'Ober-/Unterhitze', ok: (m) => m.startsWith('Ober-/Unterhitze') },
  { re: /Hei(ß|ss)luft/i, label: 'Heißluft', ok: (m, d) => /^Hei(ß|ss)luft/.test(m) || d === 'airfryer' },
  { re: /Umluft/i, label: 'Umluft', ok: (m) => /^Hei(ß|ss)luft|Grill-Umluft/.test(m) },
  { re: /PizzaPlus/i, label: 'PizzaPlus', ok: (m) => m === 'PizzaPlus' },
  { re: /\bdämpfen\b|\bgedämpft\b/i, label: 'Dämpfen', ok: (m) => m === 'Dämpfen' },
  { re: /\bGrill\b(?!-Umluft)|\bgrillen\b|\bgratinieren\b|\büberbacken\b/i, label: 'Grill', ok: (m) => /Grill|Ober-\/Unterhitze|Hei(ß|ss)luft|PizzaPlus/.test(m) },
  { re: /Kneten langsam|Kneten schnell/i, label: 'Kneten', ok: (m) => m.startsWith('Kneten') },
]

/** Gerätenamen im Text */
const DEVICE_WORDS: { re: RegExp; device: Device | 'ofen' }[] = [
  { re: /CombiSteamer|\bSteamer/i, device: 'steamer' },
  { re: /Combair/i, device: 'combair' },
  { re: /Airfryer/i, device: 'airfryer' },
  { re: /\bFamag\b|\bKneter\b|Knetmaschine/i, device: 'kneter' },
  { re: /Witt|Rotante|Pizzaofen/i, device: 'pizzaofen' },
  // allgemeiner „Ofen“/„Backofen“ statt des Geräts (die Geräte heißen Combair/CombiSteamer)
  { re: /\b(Back)?[oO]fen\b(?!-?(fest|form|kartoffel|gemüse|frisch|warm|tür|handschuh))/, device: 'ofen' },
]

const num = (s: string) => Number(s.replace(',', '.'))

/** Wartezeiten ohne Gerät („20 Minuten ziehen lassen“, „4 Stunden kalt stellen“) zählen nicht als Gerätezeit */
const PASSIVE = /^[^.;]{0,25}?\b(ziehen|ruhen|marinieren|kalt|kühl|gehen|abkühlen|auskühlen|einweichen|quellen|nachtrocknen|durchziehen|stehen)/i

/** „8–10 Minuten“, „5 Min.“ → [lo, hi, je Seite?] */
function minuteRanges(text: string): [number, number, boolean][] {
  const out: [number, number, boolean][] = []
  const re = /(\d+(?:,\d+)?)(?:\s*(?:–|-|bis)\s*(\d+(?:,\d+)?))?\s*(Minuten|Min\.|Minute|Stunden?)(?![a-zß])/g
  for (const m of text.matchAll(re)) {
    const before = text.slice(Math.max(0, m.index! - 20), m.index!)
    const after = text.slice(m.index! + m[0].length)
    if (PASSIVE.test(after) || /^\s*(vor|später)\b/i.test(after) || /in den letzten|vor dem|danach|anschließend|\bnach\b[^.]{0,12}$/i.test(before)) continue
    const f = m[3].startsWith('Stunde') ? 60 : 1
    const perSide = /^\s*(je|pro|von jeder) Seite/i.test(after) || /(je|pro|von jeder) Seite\s*$/i.test(before) || (/\bje\s*$/i.test(before) && /Seite/.test(text))
    out.push([num(m[1]) * f, (m[2] ? num(m[2]) : num(m[1])) * f, perSide])
  }
  return out
}

/** Temperaturen im Text, ohne Kern-/Wasser-/Milch-Angaben, die nicht das Gerät betreffen */
function textTemps(text: string): { t: number; core: boolean }[] {
  const out: { t: number; core: boolean }[] = []
  for (const m of text.matchAll(/(\d{2,3})(?:\s*(?:–|-|bis)\s*(\d{2,3}))?\s*°C/g)) {
    const before = text.slice(Math.max(0, m.index! - 45), m.index!)
    const core = /Kern|Fühler|innen|Innentemperatur/i.test(before)
    out.push({ t: num(m[1]), core })
    if (m[2]) out.push({ t: num(m[2]), core })
  }
  return out
}

export function checkStep(id: string, idx: number, st: DeviceStep): TextFinding[] {
  const f: TextFinding[] = []
  const add = (msg: string) => f.push({ id, step: idx + 1, msg, text: st.text })
  const text = st.text
  const sets = st.settings ?? []
  const ovens = sets.filter((s) => OVENS.includes(s.device))

  // 1. Temperaturen: jede Gerätetemperatur im Text muss in einer Einstellung vorkommen (Kern → core).
  //    Nur Kochfeld/Kneter (z. B. „Öl auf 175 °C erhitzen“, Thermometer) → Temperatur gehört nicht zum Gerät.
  if (ovens.length) {
    const temps = new Set(sets.flatMap((s) => [s.temp, s.core].filter((x): x is number => x != null)))
    for (const { t, core } of textTemps(text)) {
      // niedrige Temperaturen (Wasser lauwarm, Butter 30 °C …) betreffen meist nicht das Gerät
      if (t < 100 && !core && !temps.has(t)) {
        if (!ovens.some((s) => s.temp != null && s.temp < 100)) continue
      }
      if (!temps.has(t)) add(`Text nennt ${t} °C, Einstellung: ${[...temps].join('/') || 'keine Temperatur'}`)
    }
  } else if (!sets.length) {
    for (const { t } of textTemps(text)) if (t >= 120) add(`Text nennt ${t} °C, aber der Schritt hat keine Geräte-Einstellung`)
  }

  // 2. Betriebsarten
  for (const w of MODE_WORDS) {
    if (!w.re.test(text)) continue
    if (w.label === 'Grill' && !ovens.length) continue
    if (w.label === 'Dämpfen' && !ovens.length && !sets.length) continue
    if (!sets.length) { if (w.label !== 'Dämpfen') add(`Text nennt „${w.label}“, aber der Schritt hat keine Geräte-Einstellung`); continue }
    if (!sets.some((s) => w.ok(s.mode, s.device))) add(`Text nennt „${w.label}“, Einstellung: ${sets.map((s) => `${s.device} ${s.mode}`).join(', ')}`)
  }

  // 3. Geräte
  for (const w of DEVICE_WORDS) {
    const m = text.match(w.re)
    if (!m) continue
    if (w.device === 'ofen') {
      add(`Text sagt „${m[0]}“ statt des Gerätenamens (${ovens.map((s) => s.device).join('/') || 'keine Ofen-Einstellung'})`)
      continue
    }
    // Gerät genannt, Einstellung für ein anderes Ofengerät, aber nicht für das genannte
    if (w.device !== 'kneter' && ovens.length && !ovens.some((s) => s.device === w.device)) {
      // „aus dem CombiSteamer nehmen“ neben einer Einstellung für ein anderes Gerät ist ok, wenn das andere Gerät auch genannt wird
      const others = ovens.map((s) => s.device).filter((d) => d !== w.device)
      const namesOther = others.some((d) => DEVICE_WORDS.find((x) => x.device === d)!.re.test(text))
      if (!namesOther) add(`Text nennt ${m[0]}, Einstellung: ${ovens.map((s) => s.device).join('/')}`)
    }
    if (w.device === 'kneter' && sets.length && !sets.some((s) => s.device === 'kneter')) add(`Text nennt ${m[0]}, aber keine Famag-Einstellung`)
  }

  // 3b. „in zwei Runden“ backen, obwohl die Einstellung zwei Bleche gleichzeitig vorsieht
  if (/in (zwei|mehreren|\d) Runden/i.test(text) && sets.some((s) => /zwei Bleche|1\s*\+\s*3/.test(s.note ?? ''))) add('Text backt in Runden, Einstellung: zwei Bleche gleichzeitig (Ebene 1+3)')

  // 4. Minuten: nur wenn eindeutig (genau eine Einstellung mit Minuten und genau eine Zeitangabe im Text)
  const withMin = sets.filter((s) => s.minutes != null && !s.alt)
  const ranges = minuteRanges(text)
  if (withMin.length === 1 && ranges.length === 1 && sets.filter((s) => !s.alt).length === 1) {
    const [lo, hi, perSide] = ranges[0]
    const mm = withMin[0].minutes!
    const runden = /Runden|nacheinander|je Blech|pro Blech|portionsweise/i.test(text)
    const fits = (mm >= lo && mm <= hi) || (perSide && mm >= 2 * lo && mm <= 2 * hi)
    // kleine Abweichung (Vorheizen der Pfanne, ±1 Min.) ist kein Widerspruch
    if (!fits && Math.abs(mm - (perSide ? 2 : 1) * hi) > 1 && !runden) {
      add(`Text nennt ${lo === hi ? lo : `${lo}–${hi}`} Min., Einstellung ${mm} Min.`)
    }
  }

  // 5. Sekunden (Pizzaofen): „60–90 Sekunden“ im Text muss die eingestellte Backzeit enthalten
  const secSet = sets.filter((s) => s.seconds != null && !s.alt)
  const secText = [...text.matchAll(/(\d+)(?:\s*(?:–|-|bis)\s*(\d+))?\s*Sek(unden|\.)/g)].map((m) => [num(m[1]), m[2] ? num(m[2]) : num(m[1])])
  if (secSet.length === 1 && secText.length === 1) {
    const [lo, hi] = secText[0]
    if (secSet[0].seconds! < lo || secSet[0].seconds! > hi) add(`Text nennt ${lo}–${hi} Sek., Einstellung ${secSet[0].seconds} Sek.`)
  }
  return f
}

export function deviceTextFindings(steps: Record<string, DeviceStep[]> = DEVICE_STEPS): TextFinding[] {
  return Object.entries(steps).flatMap(([id, list]) => list.flatMap((st, i) => checkStep(id, i, st)))
}

