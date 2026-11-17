// Geräte-Einstellungen: Text für Chips und Prüfung der Werte
import type { Device, DeviceSetting } from './types'

export const DEVICE_NAME: Record<Device, string> = {
  steamer: 'CombiSteamer',
  combair: 'Combair',
  bora: 'BORA',
  airfryer: 'Airfryer',
}

/** erlaubte Betriebsarten je Gerät (Namen wie am Gerät, siehe docs/geraete) */
export const DEVICE_MODES: Record<Device, string[]> = {
  steamer: ['Dämpfen', 'Heissluft', 'Heissluft feucht', 'Heissluft mit Beschwaden', 'Regenerieren', 'Lebensmittel vorbereiten', 'Warmhalten', 'Auftauen'],
  combair: ['Heissluft', 'Ober-/Unterhitze', 'Heissluft feucht', 'PizzaPlus', 'Zartgaren', 'Grill', 'Grill mit Umluft', 'Warmhalten', 'Auftauen', 'Tellerwärmen'],
  bora: ['Kochzone'],
  airfryer: ['Heissluft'],
}

export const BORA_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Power', 'Schmelzen', 'Warmhalten', 'Simmern']

function boraLevel(level: string): string {
  if (level === 'Power') return 'Powerstufe'
  if (/^\d$/.test(level)) return `Stufe ${level}`
  return level
}

/** Kompakter Text, z. B. „CombiSteamer · Dämpfen 100 °C · 25 Min.“ */
export function settingText(s: DeviceSetting): string {
  const parts: string[] = []
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
  if (!s.mode || !s.mode.trim()) err.push('Betriebsart fehlt')
  else if (!DEVICE_MODES[s.device].includes(s.mode)) err.push(`Betriebsart "${s.mode}" gibt es bei ${DEVICE_NAME[s.device]} nicht`)
  if (s.minutes != null && !inRange(s.minutes, 1, 600)) err.push(`Minuten ${s.minutes} außerhalb 1–600`)
  if (s.core != null && !inRange(s.core, 40, 95)) err.push(`Kerntemperatur ${s.core} außerhalb 40–95`)
  if (s.humidity != null && !inRange(s.humidity, 0, 100)) err.push(`Feuchte ${s.humidity} außerhalb 0–100`)
  if (s.device === 'steamer') {
    if (s.temp != null && !inRange(s.temp, 30, 230)) err.push(`CombiSteamer ${s.temp} °C außerhalb 30–230`)
    if (s.mode === 'Dämpfen' && s.temp != null && s.temp > 100) err.push('Dämpfen darf höchstens 100 °C haben')
  } else if (s.device === 'combair') {
    if (s.temp != null && !inRange(s.temp, 30, 280)) err.push(`Combair ${s.temp} °C außerhalb 30–280`)
  } else if (s.device === 'airfryer') {
    if (s.temp == null || !inRange(s.temp, 80, 200)) err.push(`Airfryer ${s.temp} °C außerhalb 80–200`)
  } else if (s.device === 'bora') {
    if (!s.level || !BORA_LEVELS.includes(s.level)) err.push(`BORA-Stufe "${s.level}" ungültig`)
  }
  return err
}
