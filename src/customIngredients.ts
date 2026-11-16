/**
 * Zutatentext → Zutatenzeilen: "400 g Hackfleisch, 2 Zwiebeln, 1 EL Tomatenmark" oder eine Zutat pro Zeile.
 * Jede Zeile wird der ähnlichsten bekannten Zutat aus dem Katalog zugeordnet; was nicht passt, bleibt „unbekannt“.
 */
import { CATALOG } from './data/catalog'
import { catalogVersion } from './data/custom-registry'
import { UNITS } from './data/define'
import { gramsOf } from './data/nutrition-calc'
import { PRODUCTS } from './data/products'
import { toBase } from './kitchen'
import type { Ingredient } from './types'

export interface ParsedLine {
  raw: string
  /** Menge (null = nach Bedarf) */
  amount: number | null
  /** Einheit aus UNITS ('' = ohne) */
  unit: string
  /** bereinigter Name, so wie er im Text stand */
  text: string
  /** zugeordnete Zutat aus dem Katalog */
  match?: string
  /** 0–1: ab 0,8 sicher, darunter „bitte prüfen“ */
  confidence: number
  alternatives: string[]
  /** Einheit lässt sich für die Zutat nicht umrechnen */
  unitProblem: boolean
  /** z. B. Wasser – wird nicht als Zutat geführt */
  ignore?: boolean
}

export const CONFIDENT = 0.8
const MIN_MATCH = 0.55

// ───────────── Normalisieren ─────────────

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/é|è|ê/g, 'e')
    .replace(/sosse/g, 'sauce')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Wortstamm: Plural-/Fallendungen abschneiden (nur zum Vergleichen) */
function stem(w: string): string {
  if (w.length > 5 && w.endsWith('en')) return w.slice(0, -2)
  if (w.length > 4 && /[ens]$/.test(w)) return w.slice(0, -1)
  if (w.length > 3 && w.endsWith('e')) return w.slice(0, -1)
  return w
}

const STOP = new Set(
  (
    'frisch frische frischer frisches frischen gehackt gehackte gehackter gehacktes fein feine feingehackt grob grobe gross grosse grosser ' +
    'klein kleine kleiner mittelgross mittelgrosse gewurfelt gewurfelte geschalt geschalte geschnitten geschnittene gerieben geriebene ' +
    'geriebener geriebenes gepresst gepresste zerdruckt bio etwas ca circa ungefahr nach geschmack optional zum zur und oder fur ein eine ' +
    'einen einem pro nur gut reif reife reifer gekocht gekochte gemahlen gemahlene getrocknet getrocknete ganz ganze'
  ).split(' '),
)

function tokens(s: string): string[] {
  return normalize(s).split(' ').filter(Boolean)
}

// ───────────── Synonyme ─────────────

const SYN_RAW: Record<string, string> = {
  hack: 'Hackfleisch gemischt',
  hackfleisch: 'Hackfleisch gemischt',
  'gemischtes hack': 'Hackfleisch gemischt',
  'gemischtes hackfleisch': 'Hackfleisch gemischt',
  'hack gemischt': 'Hackfleisch gemischt',
  rinderhack: 'Rinderhackfleisch',
  'hack rind': 'Rinderhackfleisch',
  'hackfleisch rind': 'Rinderhackfleisch',
  'hackfleisch vom rind': 'Rinderhackfleisch',
  schweinehack: 'Schweinehackfleisch',
  'hackfleisch schwein': 'Schweinehackfleisch',
  parmesan: 'Parmigiano Reggiano',
  parmesankäse: 'Parmigiano Reggiano',
  parmigiano: 'Parmigiano Reggiano',
  grana: 'Parmigiano Reggiano',
  'grana padano': 'Parmigiano Reggiano',
  pecorino: 'Pecorino Romano',
  sahne: 'Sahne',
  schlagsahne: 'Sahne',
  kochsahne: 'Sahne',
  schlagobers: 'Sahne',
  'creme fraiche': 'Crème fraîche',
  cremefraiche: 'Crème fraîche',
  hollandaise: 'Sauce Hollandaise',
  'sauce hollandaise': 'Sauce Hollandaise',
  'saure sahne': 'Saure Sahne',
  doppelrahmfrischkase: 'Frischkäse',
  philadelphia: 'Frischkäse',
  cherrytomaten: 'Kirschtomaten',
  cocktailtomaten: 'Kirschtomaten',
  strauchtomaten: 'Tomate',
  fleischtomaten: 'Tomate',
  eiweiß: 'Eiklar',
  eiweiss: 'Eiklar',
  'pfeffer aus der mühle': 'Pfeffer',
  meersalz: 'Salz',
  speisesalz: 'Salz',
  jodsalz: 'Salz',
  kräutersalz: 'Salz',
  'salz und pfeffer': 'Salz',
  möhre: 'Möhre',
  möhren: 'Möhre',
  karotte: 'Möhre',
  karotten: 'Möhre',
  wurzel: 'Möhre',
  kartoffel: 'Kartoffeln festkochend',
  kartoffeln: 'Kartoffeln festkochend',
  nudeln: 'Nudeln',
  pasta: 'Nudeln',
  teigwaren: 'Nudeln',
  ei: 'Ei',
  eier: 'Ei',
  hühnerei: 'Ei',
  knoblauchzehe: 'Knoblauch',
  knoblauchzehen: 'Knoblauch',
  zehe: 'Knoblauch',
  öl: 'Sonnenblumenöl',
  speiseöl: 'Sonnenblumenöl',
  pflanzenöl: 'Sonnenblumenöl',
  bratöl: 'Sonnenblumenöl',
  rapsöl: 'Sonnenblumenöl',
  mehl: 'Weizenmehl',
  'mehl type 405': 'Weizenmehl',
  passata: 'Passierte Tomaten',
  dosentomaten: 'Geschälte Tomaten',
  'stückige tomaten': 'Gehackte Tomaten',
  'tomaten gehackt': 'Gehackte Tomaten',
  'gehackte tomaten': 'Gehackte Tomaten',
  'geschälte tomaten': 'Geschälte Tomaten',
  tomatenpüree: 'Tomatenmark',
  'tomaten passiert': 'Passierte Tomaten',
  brühe: 'Gemüsebrühe',
  fleischbrühe: 'Rinderbrühe',
  gemüsebrühe: 'Gemüsebrühe',
  gemüsefond: 'Gemüsebrühe',
  senf: 'Senf mittelscharf',
  ketchup: 'Tomatenketchup',
  paprikapulver: 'Paprikapulver edelsüß',
  'paprika edelsüß': 'Paprikapulver edelsüß',
  'paprikapulver süß': 'Paprikapulver edelsüß',
  'schwarzer pfeffer': 'Pfeffer',
  'pfeffer schwarz': 'Pfeffer',
  zimt: 'Zimt gemahlen',
  chili: 'Chili rot',
  chilischote: 'Chili rot',
  peperoni: 'Chili rot',
  lauchzwiebel: 'Frühlingszwiebel',
  lauchzwiebeln: 'Frühlingszwiebel',
  zwiebel: 'Zwiebel',
  zwiebeln: 'Zwiebel',
  spinat: 'Blattspinat frisch',
  blattspinat: 'Blattspinat frisch',
  speck: 'Speckwürfel',
  bauchspeck: 'Schweinebauch',
  hähnchenbrust: 'Hähnchenbrustfilet',
  hühnerbrust: 'Hähnchenbrustfilet',
  hühnchenbrust: 'Hähnchenbrustfilet',
  hähnchen: 'Hähnchenbrustfilet',
  hühnchen: 'Hähnchenbrustfilet',
  gulasch: 'Rindergulasch',
  rindfleisch: 'Rindergulasch',
  schweinefleisch: 'Schweinegulasch',
  reis: 'Langkornreis',
  basmatireis: 'Langkornreis',
  joghurt: 'Joghurt natur',
  naturjoghurt: 'Joghurt natur',
  quark: 'Speisequark',
  käse: 'Gouda gerieben',
  'geriebener käse': 'Gouda gerieben',
  gouda: 'Gouda gerieben',
  essig: 'Weißweinessig',
  brot: 'Vollkornbrot',
  tomatenmark: 'Tomatenmark',
  würstchen: 'Wiener Würstchen',
  wurst: 'Fleischwurst',
  pilze: 'Champignons',
  champignon: 'Champignons',
  porree: 'Lauch',
  sellerie: 'Knollensellerie',
  kürbis: 'Hokkaido-Kürbis',
  gurke: 'Salatgurke',
  salat: 'Kopfsalat',
  oliven: 'Oliven schwarz',
  erbsen: 'Erbsen TK',
  bohnen: 'Weiße Bohnen',
  linsen: 'Tellerlinsen',
  stärke: 'Speisestärke',
  maisstärke: 'Speisestärke',
  muskat: 'Muskatnuss',
  lorbeer: 'Lorbeerblatt',
  oregano: 'Oregano getrocknet',
  curry: 'Currypulver',
  paprika: 'Paprika rot',
  'knoblauch zehe': 'Knoblauch',
  kokosnussmilch: 'Kokosmilch',
  sojasoße: 'Sojasauce',
  'soja sauce': 'Sojasauce',
  zucchinis: 'Zucchini',
  tomatenketchup: 'Tomatenketchup',
  rosmarinzweig: 'Rosmarin',
  thymianzweig: 'Thymian',
  bandnudeln: 'Bandnudeln',
  salami: 'Salami',
  schinken: 'Kochschinken',
  lachs: 'Lachsfilet',
  kabeljau: 'Kabeljaufilet',
  zitronensaft: 'Zitrone',
  limettensaft: 'Limette',
}

const SYN: Map<string, string> = new Map()
for (const [k, v] of Object.entries(SYN_RAW)) SYN.set(normalize(k), v)

const IGNORED = new Set(['wasser', 'leitungswasser', 'heisses wasser', 'kochendes wasser', 'eiswasser', 'warmes wasser', 'kaltes wasser'])

// ───────────── Einheiten ─────────────

const UNIT_SYN: Record<string, string> = {
  g: 'g', gr: 'g', gramm: 'g', kg: 'kg', kilo: 'kg', kilogramm: 'kg',
  ml: 'ml', milliliter: 'ml', l: 'l', liter: 'l',
  el: 'EL', esslöffel: 'EL', essl: 'EL', tl: 'TL', teelöffel: 'TL',
  stück: 'Stk', stücke: 'Stk', stk: 'Stk', st: 'Stk', stuck: 'Stk', kopf: 'Stk', köpfe: 'Stk', knolle: 'Stk', knollen: 'Stk', würfel: 'Stk',
  prise: 'Prise', prisen: 'Prise', msp: 'Prise', messerspitze: 'Prise', messerspitzen: 'Prise',
  bund: 'Bund', bündel: 'Bund', zehe: 'Zehe', zehen: 'Zehe',
  dose: 'Dose', dosen: 'Dose', pck: 'Pck', pkg: 'Pck', päckchen: 'Pck', packung: 'Pck', packungen: 'Pck', pack: 'Pck', paket: 'Pck', beutel: 'Pck',
  scheibe: 'Scheibe', scheiben: 'Scheibe', zweig: 'Zweig', zweige: 'Zweig', stiel: 'Zweig', stiele: 'Zweig', stängel: 'Zweig',
  glas: 'Glas', gläser: 'Glas', becher: 'Becher', blatt: 'Blatt', blätter: 'Blatt',
}
const UNIT_MAP = new Map<string, string>()
for (const [k, v] of Object.entries(UNIT_SYN)) UNIT_MAP.set(k.replace(/\.$/, ''), v)

const NUM_WORDS: Record<string, number> = {
  ein: 1, eine: 1, einen: 1, einem: 1, einer: 1, zwei: 2, drei: 3, vier: 4, fünf: 5,
  halbe: 0.5, halber: 0.5, halbes: 0.5, halben: 0.5, halb: 0.5, viertel: 0.25,
}
const FRACTIONS: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 }

/** Menge am Anfang lesen; gibt Rest des Textes zurück */
function readAmount(s: string): { amount: number | null; rest: string } {
  let t = s.replace(/^(ca\.?|circa|etwa|ungefähr|ca)\s+/i, '')
  // Bereich "2-3" → erster Wert
  let m = t.match(/^(\d+(?:[.,]\d+)?)\s*[-–—]\s*\d+(?:[.,]\d+)?\s*/)
  if (m) return { amount: parseFloat(m[1].replace(',', '.')), rest: t.slice(m[0].length) }
  // gemischte Zahl "1 1/2", "1½"
  m = t.match(/^(\d+)\s*([½¼¾⅓⅔⅛])\s*/)
  if (m) return { amount: parseInt(m[1], 10) + FRACTIONS[m[2]], rest: t.slice(m[0].length) }
  m = t.match(/^(\d+)\s+(\d+)\/(\d+)\s*/)
  if (m && parseInt(m[3], 10) > 0) return { amount: parseInt(m[1], 10) + parseInt(m[2], 10) / parseInt(m[3], 10), rest: t.slice(m[0].length) }
  m = t.match(/^(\d+)\/(\d+)\s*/)
  if (m && parseInt(m[2], 10) > 0) return { amount: parseInt(m[1], 10) / parseInt(m[2], 10), rest: t.slice(m[0].length) }
  m = t.match(/^([½¼¾⅓⅔⅛])\s*/)
  if (m) return { amount: FRACTIONS[m[1]], rest: t.slice(m[0].length) }
  m = t.match(/^(\d+(?:[.,]\d+)?)\s*/)
  if (m) return { amount: parseFloat(m[1].replace(',', '.')), rest: t.slice(m[0].length) }
  m = t.match(/^([a-zäöüß]+)\s+/i)
  if (m && NUM_WORDS[m[1].toLowerCase()] != null) {
    const rest = t.slice(m[0].length)
    // "ein Bund Petersilie" ja – aber "Eier" bleibt ein Name (kein Leerzeichen-Treffer oben)
    return { amount: NUM_WORDS[m[1].toLowerCase()], rest }
  }
  return { amount: null, rest: t }
}

/** Einheit am Anfang lesen */
function readUnit(s: string): { unit: string | null; rest: string } {
  const m = s.match(/^([A-Za-zÄÖÜäöüß]+)\.?\s*/)
  if (!m) return { unit: null, rest: s }
  const u = UNIT_MAP.get(m[1].toLowerCase())
  if (!u) return { unit: null, rest: s }
  // "g" nur als Einheit, wenn danach noch etwas folgt
  const rest = s.slice(m[0].length)
  return rest ? { unit: u, rest: rest.replace(/^(von|vom|an)\s+/i, '') } : { unit: null, rest: s }
}

// ───────────── Zerlegen ─────────────

const DESCRIPTOR = /^(fein|grob|in\s|gewürfelt|gehackt|geschnitten|geschält|gerieben|gepresst|zerdrückt|nach\s|optional|etwas|frisch|gemahlen|klein|groß|ca\.|zum\s|zur\s|evtl|ggf|je nach|und\s|oder\s|plus|für)/i

/** Text in einzelne Zutatenzeilen zerlegen (Zeilenumbruch, Komma, Semikolon; Dezimalkomma bleibt) */
export function splitLines(text: string): string[] {
  const out: string[] = []
  for (const line of text.split(/\r?\n/)) {
    const protectedLine = line.replace(/(\d),(\d)/g, '$1\u0001$2')
    const parts = protectedLine.split(/[;,]/).map((p) => p.replace(/\u0001/g, ',').trim())
    const flat: string[] = []
    for (const p of parts) {
      // "Salz und Pfeffer" → zwei Zeilen (nur ohne Zahlen)
      if (!/\d/.test(p) && /\s+und\s+/i.test(p)) flat.push(...p.split(/\s+und\s+/i))
      else flat.push(p)
    }
    for (const part of flat) {
      const clean = part.replace(/^[-–—•*·▢☐✓]+\s*/, '').replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim()
      if (!clean) continue
      // Zubereitungshinweis ("fein gewürfelt") gehört zur Zeile davor
      if (flat.length > 1 && out.length && !/^\d|^[½¼¾⅓⅔]/.test(clean) && DESCRIPTOR.test(clean)) continue
      out.push(clean)
    }
  }
  return out
}

// ───────────── Zuordnen ─────────────

interface Cand {
  name: string
  stems: string[]
}
let index: Cand[] = []
let indexVersion = -1
let indexSize = -1

function getIndex(): Cand[] {
  const size = Object.keys(CATALOG).length
  if (indexVersion !== catalogVersion() || indexSize !== size) {
    index = Object.keys(CATALOG).map((name) => ({ name, stems: tokens(name).map(stem) }))
    indexVersion = catalogVersion()
    indexSize = size
  }
  return index
}

function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3
  const d: number[] = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]
    d[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j]
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return d[b.length]
}

function tokenScore(q: string, c: string): number {
  if (q === c) return 1
  if (q.length >= 5 && c.length >= 5 && (c.startsWith(q) || q.startsWith(c))) {
    // Wortanfang passt nur bei ähnlicher Länge ("Hähnchenbrust" ~ "Hähnchenbrustfilet"), nicht bei "Apfelsaft" ~ "Apfel"
    return Math.min(q.length, c.length) / Math.max(q.length, c.length) >= 0.7 ? 0.75 : 0.5
  }
  if (q.length >= 5 && c.length >= 7 && c.includes(q)) return 0.7
  if (c.length >= 7 && q.length >= 9 && q.includes(c)) return 0.65
  if (q.length >= 5 && c.length >= 5 && lev(q, c) <= (q.length >= 9 ? 2 : 1)) return 0.7
  return 0
}

function scoreCand(q: string[], c: Cand): number {
  if (!q.length) return 0
  let sum = 0
  for (const t of q) {
    let best = 0
    for (const ct of c.stems) best = Math.max(best, tokenScore(t, ct))
    if (best === 0) return 0
    sum += best
  }
  return (sum / q.length) * (0.85 + (0.15 * q.length) / Math.max(q.length, c.stems.length))
}

/** Kandidaten für einen Namen, beste zuerst */
export function rank(text: string): { name: string; score: number }[] {
  const full = normalize(text)
  const syn = SYN.get(full)
  const out = new Map<string, number>()
  // exakter Katalogname (auch mit Füllwörtern wie "gerieben", "frisch", "gehackt")
  const exact = getIndex().find((c) => normalize(c.name) === full)
  if (exact) out.set(exact.name, 1.1)
  if (syn && CATALOG[syn]) out.set(syn, Math.max(out.get(syn) ?? 0, 1.05))
  const q = tokens(text).filter((t) => !STOP.has(t))
  const qs = q.map(stem)
  // Synonym auch nach Entfernen von Füllwörtern ("frische Möhren")
  const syn2 = q.length ? SYN.get(q.join(' ')) : undefined
  if (syn2 && CATALOG[syn2] && !out.has(syn2)) out.set(syn2, 0.95)
  if (qs.length) {
    for (const c of getIndex()) {
      const s = scoreCand(qs, c)
      if (s > 0) out.set(c.name, Math.max(out.get(c.name) ?? 0, s))
    }
    // einzelnes Wort aus dem Synonym-Verzeichnis ("Rinderhack" in "Rinderhack frisch")
    if (qs.length > 1) {
      for (const t of q) {
        const sy = SYN.get(t)
        if (sy && CATALOG[sy] && !out.has(sy)) out.set(sy, 0.6)
      }
    }
  }
  return [...out].map(([name, score]) => ({ name, score })).sort((a, b) => b.score - a.score || a.name.length - b.name.length || a.name.localeCompare(b.name))
}

/** Suche für das Auswahlfeld: alle Katalognamen, die den Suchtext enthalten (oder ähnlich sind) */
export function searchIngredients(query: string, limit = 8): string[] {
  const nq = normalize(query)
  if (!nq) return []
  const hits = new Set<string>()
  for (const r of rank(query)) hits.add(r.name)
  const qt = tokens(query).map(stem)
  for (const c of getIndex()) {
    if (normalize(c.name).includes(nq) || (qt.length && qt.every((t) => c.stems.some((s) => s.startsWith(t) || t.startsWith(s))))) hits.add(c.name)
  }
  return [...hits].slice(0, limit)
}

// ───────────── Einheit prüfen ─────────────

/** Lässt sich die Menge für diese Zutat in Gewicht (Nährwerte) und Packungseinheit (Einkauf) umrechnen? */
export function unitWorks(name: string, unit: string): boolean {
  if (!unit) return true
  if (gramsOf(name, 1, unit) == null) return false
  if (CATALOG[name] === 'vorrat') return true
  const prod = PRODUCTS[name]
  return !prod || toBase(name, 1, unit, prod) != null
}

/** Einheiten, die für die Zutat funktionieren */
export function workingUnits(name: string): string[] {
  return (UNITS as readonly string[]).filter((u) => unitWorks(name, u))
}

// ───────────── Hauptfunktion ─────────────

/** Eine Textzeile parsen und zuordnen */
export function parseLine(raw: string): ParsedLine {
  const { amount: a0, rest } = readAmount(raw)
  let amount = a0
  let unit = ''
  let text = rest.trim()
  if (amount != null) {
    const u = readUnit(text)
    if (u.unit) {
      unit = u.unit
      text = u.rest.trim()
    } else {
      unit = 'Stk'
    }
  }
  // "3 Knoblauchzehen" / "Knoblauchzehe": Zehen als Einheit
  const z = text.match(/^(.*?)zehen?$/i)
  if (z && z[1] && !UNIT_MAP.has(text.toLowerCase())) {
    if (amount == null) amount = 1
    unit = 'Zehe'
    text = z[1].trim()
  } else if (amount == null && /^zehen?\s+/i.test(text)) {
    amount = 1
    unit = 'Zehe'
    text = text.replace(/^zehen?\s+/i, '')
  }
  text = text.replace(/^(von|vom|aus|an)\s+/i, '').trim()

  if (IGNORED.has(normalize(text))) {
    return { raw, amount, unit, text, confidence: 1, alternatives: [], unitProblem: false, ignore: true }
  }

  const ranked = rank(text)
  const best = ranked[0]
  let match: string | undefined
  let confidence = 0
  if (best && best.score >= MIN_MATCH) {
    match = best.name
    confidence = Math.min(1, best.score)
    // mehrere gleich gute Treffer (z. B. "Paprika") → „bitte prüfen“
    const ties = ranked.filter((r) => r.score >= best.score - 0.02 && r.name !== best.name)
    if (ties.length && best.score < 1) confidence = Math.min(confidence, 0.7)
  }
  // "1 Dose Tomaten" meint Dosentomaten
  if (match === 'Tomate' && unit === 'Dose') match = 'Gehackte Tomaten'
  const alternatives = ranked.filter((r) => r.name !== match).slice(0, 5).map((r) => r.name)
  let unitProblem = false
  if (match && amount != null && !unitWorks(match, unit)) {
    // sinnvolle Umdeutung: "Stk" bei einer Zutat, die nach Gewicht gekauft wird, lässt sich nicht umrechnen
    unitProblem = true
  }
  return { raw, amount, unit, text, match, confidence, alternatives, unitProblem }
}

/** Ganzen Zutatentext parsen */
export function parseIngredientText(text: string): ParsedLine[] {
  return splitLines(text).map(parseLine)
}

/** Zeilen → Rezeptzutaten (ignorierte und unzugeordnete Zeilen entfallen) */
export function toIngredients(lines: Pick<ParsedLine, 'amount' | 'unit' | 'match' | 'ignore'>[]): Ingredient[] {
  return lines
    .filter((l) => l.match && !l.ignore)
    .map((l) => ({ name: l.match!, amount: l.amount, unit: l.amount == null ? '' : l.unit }))
}

/** Zutat als Text, z. B. "400 g Hackfleisch gemischt" */
export function ingredientText(i: Ingredient): string {
  if (i.amount == null) return i.name
  const a = String(Math.round(i.amount * 100) / 100).replace('.', ',')
  return `${a}${i.unit ? ' ' + i.unit : ''} ${i.name}`
}

/** Anfangsbuchstabe groß – Vorschlag für den Namen einer neuen Zutat */
export function titleCase(s: string): string {
  const t = s.trim()
  return t ? t[0].toUpperCase() + t.slice(1) : t
}
