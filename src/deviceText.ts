// Geräte-Einstellungen: Text für Chips und Prüfung der Werte
import type { Device, DeviceSetting } from './types'

export const DEVICE_NAME: Record<Device, string> = {
  steamer: 'CombiSteamer',
  combair: 'Combair',
  bora: 'BORA',
  airfryer: 'Airfryer',
  kneter: 'Famag',
  pizzaofen: 'Witt Rotante',
  smoker: 'Traeger',
  gasgrill: 'Gasgrill',
  dutch: 'Dutch Oven',
  vakuum: 'Vakuumierer',
  paella: 'Paellapfanne',
  plancha: 'Plancha',
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

/**
 * Traeger Timberline 850 (Pellet-Smoker, docs/geraete/traeger.md): Garraum 165–500 °F ≈ 74–260 °C in 5-°F-Schritten,
 * Super Smoke nur im unteren Bereich 165–225 °F ≈ 74–107 °C. Werte in °C, der Traeger-Wert in °F steht in der Notiz
 * (Baustein `traeger()` in src/data/device-helpers.ts). Dauer bis 24 Std. (Brisket über Nacht), Kern 40–98 °C (Fühler).
 */
const SMOKER_SPECS: Record<string, ModeSpec> = {
  'Vorheizen': { min: 74, max: 260, minutes: [5, 30] },
  'Smoken': { min: 74, max: 260, minutes: [1, 1440] },
  'Super Smoke': { min: 74, max: 107, minutes: [1, 1440] },
  'Grillen': { min: 150, max: 260, minutes: [1, 240] },
  'Keep Warm': { noTemp: true, minutes: [1, 240] },
}

/** Gasgrill (4 Brenner, Deckelthermometer, docs/geraete/grill-dutch.md): Temperatur = Deckelthermometer (Richtwert) */
const GASGRILL_SPECS: Record<string, ModeSpec> = {
  'Vorheizen': { min: 150, max: 320, minutes: [5, 20] },
  'Direkt': { min: 150, max: 320, minutes: [1, 120] },
  'Indirekt': { min: 90, max: 260, minutes: [1, 600] },
}

/**
 * Paellapfanne (docs/geraete/paella-plancha.md): 32 cm auf dem BORA (Brücke), 46 cm auf dem Gasgrill (Deckel offen).
 * Keine Temperatur – Stufe (BORA) bzw. Flamme + Brenner (Gasgrill); „Ruhen“ = vom Feuer, ohne Stufe.
 */
const PAELLA_SPECS: Record<string, ModeSpec> = {
  'Vorheizen': { noTemp: true, minutes: [1, 15] },
  'Anbraten': { noTemp: true, minutes: [1, 30] },
  'Sofrito': { noTemp: true, minutes: [1, 30] },
  'Köcheln': { noTemp: true, minutes: [1, 40] },
  'Socarrat': { noTemp: true, minutes: [1, 5] },
  'Ruhen': { noTemp: true, minutes: [1, 15] },
}
/** Plancha/Gusseisen: Oberflächentemperatur optional (Infrarot-Thermometer) */
const PLANCHA_SPECS: Record<string, ModeSpec> = {
  'Vorheizen': { min: 150, max: 350, minutes: [1, 20] },
  'Braten': { min: 150, max: 350, minutes: [1, 30] },
}

const SPECS: Partial<Record<Device, Record<string, ModeSpec>>> = { steamer: STEAMER_SPECS, combair: COMBAIR_SPECS, smoker: SMOKER_SPECS, gasgrill: GASGRILL_SPECS, paella: PAELLA_SPECS, plancha: PLANCHA_SPECS }

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
  smoker: Object.keys(SMOKER_SPECS),
  gasgrill: Object.keys(GASGRILL_SPECS),
  // Dutch Oven auf der Gasflamme (Hockerkocher oder Gasgrill-Brenner), docs/geraete/grill-dutch.md: Flamme + Dauer, keine Temperatur
  dutch: ['Anbraten', 'Schmoren', 'Köcheln'],
  // Vakuumierer (Modell offen): Marinieren/Einfrieren, Beutel für Vacuisine (CombiSteamer)
  vakuum: ['Vakuumieren', 'Vakuumieren feucht', 'Verschweißen'],
  // Paellapfanne 32 cm (BORA mit Brücke) / 46 cm (Gasgrill), docs/geraete/paella-plancha.md
  paella: Object.keys(PAELLA_SPECS),
  // Plancha/Gusseisenpfanne auf BORA oder Gasgrill
  plancha: Object.keys(PLANCHA_SPECS),
}

/** Flamme bei Gasgrill und Dutch Oven (Gas) */
export const FLAME_LEVELS = ['niedrig', 'mittel', 'hoch']
/** Gasgrill-Brenner: „alle“ oder Nummern 1–4 (1 = links), z. B. „1+4“ */
export const BURNERS_RE = /^(alle|[1-4](\+[1-4]){0,3})$/

/** Dauer für Chips: „25 Min.“, ab 2 Std. „6 Std.“ bzw. „6 Std. 30 Min.“ */
export function durationText(minutes: number): string {
  if (minutes < 120) return `${minutes} Min.`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} Std. ${m} Min.` : `${h} Std.`
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
  if (s.device === 'vakuum') return `${DEVICE_NAME[s.device]} · ${s.mode}`
  if (s.device === 'paella' || s.device === 'plancha') {
    // „Paellapfanne 32 cm · BORA Brücke · Köcheln · Stufe 6 · 10 Min.“, „Plancha · Gasgrill · Braten 280 °C · Brenner alle hoch · 3 Min.“
    const gas = s.on === 'gasgrill'
    const head = s.device === 'paella' ? `${DEVICE_NAME.paella}${s.pan ? ` ${s.pan} cm` : ''}` : DEVICE_NAME.plancha
    parts.push(gas ? 'Gasgrill' : s.device === 'paella' ? 'BORA Brücke' : 'BORA')
    parts.push(s.temp != null ? `${s.mode} ${s.temp} °C` : s.mode)
    if (s.level) parts.push(gas ? (s.burners ? `Brenner ${s.burners} ${s.level}` : `Flamme ${s.level}`) : boraLevel(s.level))
    if (s.minutes != null) parts.push(durationText(s.minutes))
    return `${head} · ${parts.join(' · ')}`
  }
  if (s.device === 'gasgrill' || s.device === 'dutch') {
    // „Gasgrill · Indirekt 160 °C · Brenner 1+4 mittel · 90 Min. · Kern 72 °C“, „Dutch Oven · Schmoren · Flamme niedrig · 3 Std.“
    parts.push(s.temp != null ? `${s.mode} ${s.temp} °C` : s.mode)
    if (s.burners || s.level) parts.push(s.burners ? `Brenner ${s.burners}${s.level ? ` ${s.level}` : ''}` : `Flamme ${s.level}`)
    if (s.minutes != null) parts.push(durationText(s.minutes))
    if (s.core != null) parts.push(`Kern ${s.core} °C`)
    return `${DEVICE_NAME[s.device]} · ${parts.join(' · ')}`
  }
  if (s.device === 'smoker') {
    parts.push(s.temp != null ? `${s.mode} ${s.temp} °C` : s.mode)
    if (s.minutes != null) parts.push(durationText(s.minutes))
    if (s.core != null) parts.push(`Kern ${s.core} °C`)
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

/** Grill-/BBQ-Geräte (Kerntemperatur bis 98 °C erlaubt) */
export const BBQ_DEVICES: Device[] = ['smoker', 'gasgrill', 'dutch']

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
  // BBQ (Pulled Pork, Brisket) braucht Kern bis 96 °C – Thermometer/Fühler, kein Gerätelimit
  const coreHi = BBQ_DEVICES.includes(s.device) ? 98 : 95
  if (s.core != null && !inRange(s.core, 40, coreHi)) err.push(`Kerntemperatur ${s.core} außerhalb 40–${coreHi}`)
  if (s.burners != null && s.device !== 'gasgrill' && s.on !== 'gasgrill') err.push(`${name}: Brenner nur beim Gasgrill`)
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
  else if (s.device === 'smoker') {
    if (spec) {
      if (spec.noTemp && s.temp != null) err.push(`Traeger ${mode}: keine Temperatur`)
      else if (!spec.noTemp && (s.temp == null || !inRange(s.temp, spec.min!, spec.max!))) err.push(`Traeger ${mode} ${s.temp} °C außerhalb ${spec.min}–${spec.max}`)
    }
    if (s.level != null || s.humidity != null) err.push('Traeger: keine Stufe/Feuchte (nur Temperatur, Dauer, Kern)')
  } else if (s.device === 'gasgrill') {
    if (spec && s.temp != null && !inRange(s.temp, spec.min!, spec.max!)) err.push(`Gasgrill ${mode} ${s.temp} °C außerhalb ${spec.min}–${spec.max} (Deckelthermometer)`)
    if (!s.level || !FLAME_LEVELS.includes(s.level)) err.push(`Gasgrill: Flamme "${s.level}" ungültig (niedrig, mittel, hoch)`)
    if (s.burners != null && !BURNERS_RE.test(s.burners)) err.push(`Gasgrill: Brenner "${s.burners}" ungültig („alle“ oder z. B. „1+4“)`)
    if (mode === 'Indirekt' && (s.burners === 'alle' || !s.burners)) err.push('Gasgrill indirekt: Brenner angeben, mindestens einer bleibt aus (z. B. „1+4“)')
    if (s.humidity != null) err.push('Gasgrill: keine Feuchte')
  } else if (s.device === 'dutch') {
    if (s.temp != null) err.push('Dutch Oven (Gas): keine Temperatur, nur Flamme (niedrig, mittel, hoch)')
    if (!s.level || !FLAME_LEVELS.includes(s.level)) err.push(`Dutch Oven: Flamme "${s.level}" ungültig (niedrig, mittel, hoch)`)
    if (s.humidity != null) err.push('Dutch Oven: keine Feuchte')
  } else if (s.device === 'paella' || s.device === 'plancha') {
    const gas = s.on === 'gasgrill'
    if (s.device === 'paella') {
      if (s.pan !== '32' && s.pan !== '46') err.push('Paellapfanne: Größe „32“ oder „46“ angeben (paella() aus device-helpers)')
      else if (s.on !== (s.pan === '32' ? 'bora' : 'gasgrill')) err.push(`Paellapfanne ${s.pan} cm gehört auf ${s.pan === '32' ? 'den BORA (Brücke)' : 'den Gasgrill'}`)
      if (s.temp != null) err.push('Paellapfanne: keine Temperatur, nur Stufe bzw. Flamme')
    } else if (s.on !== 'bora' && s.on !== 'gasgrill') err.push('Plancha: Hitzequelle (on) „bora“ oder „gasgrill“ angeben')
    else if (spec && s.temp != null && !inRange(s.temp, spec.min!, spec.max!)) err.push(`Plancha ${mode} ${s.temp} °C außerhalb ${spec.min}–${spec.max} (Oberfläche)`)
    if (s.device === 'paella' && mode === 'Ruhen') {
      if (s.level != null || s.burners != null) err.push('Paella ruhen: vom Feuer, keine Stufe/Brenner')
    } else if (gas) {
      if (!s.level || !FLAME_LEVELS.includes(s.level)) err.push(`${name} auf dem Gasgrill: Flamme "${s.level}" ungültig (niedrig, mittel, hoch)`)
      if (s.burners != null && !BURNERS_RE.test(s.burners)) err.push(`${name}: Brenner "${s.burners}" ungültig („alle“ oder z. B. „2+3“)`)
    } else if (!s.level || !BORA_LEVELS.includes(s.level)) err.push(`${name} auf dem BORA: Stufe "${s.level}" ungültig`)
    if (s.core != null || s.humidity != null) err.push(`${name}: keine Kerntemperatur/Feuchte`)
  } else if (s.device === 'vakuum') {
    if (s.temp != null || s.minutes != null || s.core != null || s.level != null || s.humidity != null) err.push('Vakuumierer: nur Betriebsart (und Notiz)')
  }
  if (s.seconds != null && s.device !== 'pizzaofen') err.push(`${name}: Sekunden nur beim Pizzaofen`)
  return err
}
