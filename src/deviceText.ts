// Geräte-Einstellungen: Text für Chips und Prüfung der Werte
import type { Device, DeviceSetting } from './types'

export const DEVICE_NAME: Record<Device, string> = {
  steamer: 'CombiSteamer',
  combair: 'Combair',
  bora: 'BORA',
  airfryer: 'Airfryer',
  kneter: 'Famag',
  pizzaofen: 'Witt Rotante',
}

/**
 * Betriebsarten der V-ZUG-Geräte mit den Grenzen aus den Bedienungsanleitungen
 * (CombiSteamer V6000 45 CS6T, Combair V6000 45 C6T; Details und Seitenzahlen in docs/geraete/vzug.md).
 * min/max = einstellbare Temperatur in °C; noTemp = Betriebsart hat keinen Temperaturwert
 * (Stufen, Automatik oder feste Temperatur); minutes = erlaubte Dauer; noCore = Kerntemperatur nicht einstellbar.
 */
interface ModeSpec { min?: number; max?: number; noTemp?: boolean; minutes?: [number, number]; noCore?: boolean }

const STEAMER_SPECS: Record<string, ModeSpec> = {
  'Heißluft': { min: 30, max: 230 },
  'Heißluft feucht': { min: 30, max: 230 },
  'Heißluft mit Beschwaden': { min: 80, max: 230 },
  'Heißluft eco': { min: 30, max: 230 },
  'Dämpfen': { min: 30, max: 100 },
  'Regenerieren': { min: 80, max: 200 },
  'RegenerierAutomatik feucht': { noTemp: true, noCore: true },
  'RegenerierAutomatik knusprig': { noTemp: true, noCore: true },
  'Dörren': { min: 40, max: 85 },
  'Vacuisine': { min: 30, max: 95, minutes: [1, 4320], noCore: true },
  'Profi-Backen klassisch': { min: 30, max: 230 },
  'Profi-Backen bemehlt': { min: 30, max: 230 },
  'Profi-Backen bestrichen': { min: 30, max: 230 },
  'Profi-Backen Aufgehen lassen': { min: 30, max: 230 },
  'Zartgaren': { noTemp: true, minutes: [90, 270] },
  'Warmhalten': { noTemp: true, minutes: [5, 90], noCore: true },
  'Tellerwärmen': { noTemp: true, minutes: [30, 600], noCore: true },
}

const COMBAIR_SPECS: Record<string, ModeSpec> = {
  'Ober-/Unterhitze': { min: 30, max: 280 },
  'Ober-/Unterhitze feucht': { min: 30, max: 250 },
  'Ober-/Unterhitze eco': { min: 30, max: 250 },
  'Unterhitze': { noTemp: true }, // 4 Stufen, Vorschlag Mittel (Stufe 2)
  'PizzaPlus': { min: 30, max: 280 },
  'Grill': { noTemp: true }, // 4 Stufen, Vorschlag Stark (Stufe 3)
  'Grill-Umluft': { min: 30, max: 280 },
  'Heißluft': { min: 30, max: 280 },
  'Heißluft feucht': { min: 30, max: 250 },
  'Heißluft eco': { min: 30, max: 250 },
  'Dörren': { min: 40, max: 85 },
  'Zartgaren': { noTemp: true, minutes: [90, 270] },
  'Warmhalten': { noTemp: true, minutes: [5, 90], noCore: true },
  'Tellerwärmen': { noTemp: true, minutes: [30, 600], noCore: true },
}

const SPECS: Partial<Record<Device, Record<string, ModeSpec>>> = { steamer: STEAMER_SPECS, combair: COMBAIR_SPECS }

/** erlaubte Betriebsarten je Gerät (Namen wie am Gerät, siehe docs/geraete) */
export const DEVICE_MODES: Record<Device, string[]> = {
  steamer: Object.keys(STEAMER_SPECS),
  combair: Object.keys(COMBAIR_SPECS),
  bora: ['Kochzone'],
  airfryer: ['Heissluft'],
  // Famag Grilletta IM5 (Spiralkneter, docs/geraete/famag.md): Dauer 1–30 Min., optional Stufe 1–10 (nur Modelle mit Drehregler)
  kneter: ['Kneten', 'Mischen', 'Kneten langsam', 'Kneten schnell'],
  // Witt Rotante (Gas-Pizzaofen mit Drehstein, docs/geraete/witt.md): Steintemperatur 250–500 °C
  pizzaofen: ['Pizzastein', 'Vorheizen'],
}

export const KNETER_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

/** frühere Schreibweisen (Schweizer ss, „Grill mit Umluft“) werden beim Prüfen akzeptiert */
export function normalizeMode(device: Device, mode: string): string {
  if (device !== 'steamer' && device !== 'combair') return mode
  const m = mode.trim().replace(/^Heissluft/, 'Heißluft')
  return m === 'Grill mit Umluft' ? 'Grill-Umluft' : m
}

export const BORA_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Power', 'Schmelzen', 'Warmhalten', 'Simmern']

function boraLevel(level: string): string {
  if (level === 'Power') return 'Powerstufe'
  if (/^\d$/.test(level)) return `Stufe ${level}`
  return level
}

/** Kompakter Text, z. B. „CombiSteamer · Dämpfen 100 °C · 25 Min.“; Ausweichweg mit „oder …“ */
export function settingText(s: DeviceSetting): string {
  const text = mainText(s)
  return s.alt ? `oder ${text}` : text
}

function mainText(s: DeviceSetting): string {
  const parts: string[] = []
  if (s.device === 'kneter') {
    // „Famag · Kneten 8 Min.“ bzw. „Famag · Stufe 3 · 6 Min.“
    if (s.level) parts.push(`Stufe ${s.level}`, ...(s.minutes != null ? [`${s.minutes} Min.`] : []))
    else parts.push(s.minutes != null ? `${s.mode} ${s.minutes} Min.` : s.mode)
    return `${DEVICE_NAME[s.device]} · ${parts.join(' · ')}`
  }
  if (s.device === 'pizzaofen') {
    // „Witt Rotante · Stein 430 °C · 90 Sek.“
    const label = s.mode === 'Pizzastein' ? 'Stein' : s.mode
    parts.push(s.temp != null ? `${label} ${s.temp} °C` : label)
    if (s.minutes != null) parts.push(`${s.minutes} Min.`)
    if (s.seconds != null) parts.push(`${s.seconds} Sek.`)
    return `${DEVICE_NAME[s.device]} · ${parts.join(' · ')}`
  }
  if (s.device === 'bora') {
    parts.push(s.level ? boraLevel(s.level) : s.mode)
  } else if (s.device === 'airfryer') {
    if (s.mode && s.mode !== 'Heissluft') parts.push(s.mode)
    if (s.temp != null) parts.push(`${s.temp} °C`)
  } else {
    parts.push(s.temp != null ? `${s.mode} ${s.temp} °C` : s.mode)
  }
  if (s.humidity != null) parts.push(`Feuchte ${s.humidity} %`)
  if (s.minutes != null) parts.push(`${s.minutes} Min.`)
  if (s.core != null) parts.push(`Kern ${s.core} °C`)
  return `${DEVICE_NAME[s.device]} · ${parts.join(' · ')}`
}

const inRange = (v: number, lo: number, hi: number) => Number.isFinite(v) && v >= lo && v <= hi

/** Fehler einer Einstellung (leere Liste = gültig) */
export function validateSetting(s: DeviceSetting): string[] {
  const err: string[] = []
  if (!(s.device in DEVICE_NAME)) return [`unbekanntes Gerät "${s.device}"`]
  const name = DEVICE_NAME[s.device]
  const mode = normalizeMode(s.device, s.mode ?? '')
  const spec = SPECS[s.device]?.[mode]
  if (!s.mode || !s.mode.trim()) err.push('Betriebsart fehlt')
  else if (!DEVICE_MODES[s.device].includes(mode)) err.push(`Betriebsart "${s.mode}" gibt es bei ${name} nicht`)
  const [minLo, minHi] = spec?.minutes ?? [1, 600]
  if (s.minutes != null && !inRange(s.minutes, minLo, minHi)) err.push(`Minuten ${s.minutes} außerhalb ${minLo}–${minHi}${spec?.minutes ? ` (${mode})` : ''}`)
  if (s.core != null && !inRange(s.core, 40, 95)) err.push(`Kerntemperatur ${s.core} außerhalb 40–95`)
  if (s.humidity != null && !inRange(s.humidity, 0, 100)) err.push(`Feuchte ${s.humidity} außerhalb 0–100`)
  if (s.device === 'steamer' || s.device === 'combair') {
    if (s.humidity != null) err.push(`${name}: Feuchte ist nicht in % einstellbar (nur über die Betriebsart)`)
    if (spec) {
      if (spec.noTemp && s.temp != null) err.push(`${mode} hat keine einstellbare Temperatur (${name})`)
      else if (s.temp != null && !inRange(s.temp, spec.min ?? 30, spec.max ?? 230)) err.push(`${name} ${mode} ${s.temp} °C außerhalb ${spec.min}–${spec.max}`)
      if (s.core != null && spec.noCore) err.push(`${mode}: Kerntemperatur nicht einstellbar (${name})`)
    }
    if (s.core != null && s.temp != null && s.temp > 230) err.push('Gargutsensor nur bis 230 °C Garraumtemperatur nutzbar')
  } else if (s.device === 'airfryer') {
    if (s.temp == null || !inRange(s.temp, 80, 200)) err.push(`Airfryer ${s.temp} °C außerhalb 80–200`)
  } else if (s.device === 'bora') {
    if (!s.level || !BORA_LEVELS.includes(s.level)) err.push(`BORA-Stufe "${s.level}" ungültig`)
  } else if (s.device === 'kneter') {
    if (s.temp != null) err.push('Famag: keine Temperatur')
    if (s.minutes != null && !inRange(s.minutes, 1, 30)) err.push(`Famag: Minuten ${s.minutes} außerhalb 1–30`)
    if (s.level != null && !KNETER_LEVELS.includes(s.level)) err.push(`Famag-Stufe "${s.level}" ungültig (1–10)`)
    if (s.core != null || s.seconds != null) err.push('Famag: nur Dauer und Stufe einstellbar')
  } else if (s.device === 'pizzaofen') {
    if (s.temp == null || !inRange(s.temp, 250, 500)) err.push(`Witt Rotante: Steintemperatur ${s.temp} °C außerhalb 250–500`)
    if (s.minutes != null && !inRange(s.minutes, 1, 60)) err.push(`Witt Rotante: Minuten ${s.minutes} außerhalb 1–60`)
    if (s.seconds != null && !inRange(s.seconds, 30, 600)) err.push(`Witt Rotante: Sekunden ${s.seconds} außerhalb 30–600`)
    if (s.core != null || s.level != null) err.push('Witt Rotante: keine Kerntemperatur/Stufe')
  }
  if (s.seconds != null && s.device !== 'pizzaofen') err.push(`${name}: Sekunden nur beim Pizzaofen`)
  return err
}
