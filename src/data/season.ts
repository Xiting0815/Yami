import type { Festive, Recipe } from '../types'
import { gramsOf } from './nutrition-calc'
import { EXTRA_SEASON } from './extra'

/**
 * Saisonkalender: Monate (1–12), in denen eine Gemüse-/Obstsorte in Deutschland regional
 * frisch vom Feld bzw. aus Freilandanbau kommt. Grobe Richtwerte, keine amtlichen Daten.
 *
 * Bewusst NICHT aufgeführt (= immer „passt“, kein Eintrag):
 * - Lagerware aus Deutschland das ganze Jahr: Kartoffeln, Zwiebeln, Möhren, Knoblauch, Weißkohl,
 *   Rotkohl, Knollensellerie, Rote Bete, Äpfel, Schalotten, Lauch
 * - Importware: Ananas, Banane, Zitrone, Limette, Ingwer, Galgant, Zitronengras, Kaffirlimettenblätter,
 *   Pak Choi, Shiitake, Sojasprossen, Champignons, Kräuterseitlinge
 * - Kräuter (ganzjährig erhältlich)
 */
export const SEASON: Record<string, number[]> = {
  'Aubergine': [7, 8, 9],
  'Birne': [8, 9, 10],
  'Blattspinat frisch': [4, 5, 6, 7, 8, 9, 10, 11],
  'Blumenkohl': [6, 7, 8, 9, 10, 11],
  'Brokkoli': [6, 7, 8, 9, 10],
  'Chicorée': [10, 11, 12, 1, 2, 3, 4],
  'Chili rot': [7, 8, 9],
  'Chinakohl': [9, 10, 11, 12],
  'Datteltomaten': [7, 8, 9],
  'Radieschen': [4, 5, 6, 7, 8, 9, 10],
  'Feldsalat': [10, 11, 12, 1, 2, 3],
  'Frühlingszwiebel': [4, 5, 6, 7, 8, 9, 10],
  'Grüne Bohnen': [6, 7, 8, 9, 10],
  'Grünkohl': [11, 12, 1, 2],
  'Hokkaido-Kürbis': [8, 9, 10, 11],
  'Kirschtomaten': [7, 8, 9],
  'Kohlrabi': [5, 6, 7, 8, 9, 10, 11],
  'Kopfsalat': [5, 6, 7, 8, 9, 10],
  // Esskastanien: frische Ernte Okt.–Dez.; vorgegarte gibt es ganzjährig, im Herbst/Winter aber günstiger und überall
  'Maronen vorgegart': [10, 11, 12, 1],
  'Paprika gelb': [7, 8, 9],
  'Paprika grün': [7, 8, 9],
  'Paprika rot': [7, 8, 9],
  'Rosenkohl': [10, 11, 12, 1, 2],
  'Rucola': [4, 5, 6, 7, 8, 9, 10, 11],
  'Salatgurke': [6, 7, 8, 9],
  'Schwarzkohl': [10, 11, 12, 1, 2, 3],
  'Spargel weiß': [4, 5, 6],
  'Spitzpaprika grün': [7, 8, 9],
  'Staudensellerie': [6, 7, 8, 9, 10],
  'Steckrübe': [10, 11, 12, 1, 2, 3],
  'Tomate': [7, 8, 9],
  'Wirsing': [9, 10, 11, 12, 1, 2, 3],
  'Zucchini': [6, 7, 8, 9],
  'Zuckerschoten': [5, 6, 7, 8],
}

/** true = in Saison, false = nicht in Saison, undefined = keine Saisondaten (immer passend) */
// neue Obst-/Gemüsezutaten aus src/data/extra (Backen & Desserts)
for (const [n, m] of Object.entries(EXTRA_SEASON)) if (!SEASON[n]) SEASON[n] = m

export function inSeason(name: string, month: number): boolean | undefined {
  const months = SEASON[name]
  if (!months) return undefined
  return months.includes(month)
}

/** Mindestmenge (g), ab der eine Zutat für die Saison zählt – außer sie ist die Hauptzutat */
const SIGNIFICANT_G = 80

/**
 * Saisonbezug eines Rezepts im angegebenen Monat. Berücksichtigt nur Zutaten mit Saisondaten,
 * deren Menge ins Gewicht fällt (≥ 80 g oder die Hauptzutat nach Gewicht).
 * `out` = nicht in Saison, `peak` = in Saison.
 */
export function seasonOf(recipe: Recipe, month: number): { out: string[]; peak: string[] } {
  const items = recipe.ingredients
    .filter((ing) => ing.amount != null && inSeason(ing.name, 1) !== undefined)
    .map((ing) => ({ name: ing.name, g: gramsOf(ing.name, ing.amount!, ing.unit) ?? 0 }))
  const heaviest = Math.max(0, ...items.map((i) => i.g))
  const out: string[] = []
  const peak: string[] = []
  for (const it of items) {
    if (it.g < SIGNIFICANT_G && !(heaviest > 0 && it.g === heaviest)) continue
    if (inSeason(it.name, month)) peak.push(it.name)
    else out.push(it.name)
  }
  return { out, peak }
}

/**
 * BBQ-Saison (Frühling/Sommer, März–September): nur dann zeigt die Woche die Karte „BBQ-Wetter? Ideen“.
 * Im Winter bleibt die BBQ-Sparte im Rezepte-Tab zum Stöbern und Einplanen sichtbar.
 */
export const BBQ_MONTHS = [3, 4, 5, 6, 7, 8, 9]
/** liegt der Tag (ISO) bzw. Monat (1–12) in der BBQ-Saison? */
export const isBbqSeason = (dayOrMonth: string | number): boolean =>
  BBQ_MONTHS.includes(typeof dayOrMonth === 'number' ? dayOrMonth : Number(dayOrMonth.slice(5, 7)))

/** Ostersonntag eines Jahres als „MM-TT“ (gregorianisch, anonymer Algorithmus nach Meeus/Jones/Butcher) */
export function easterSunday(year: number): string {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** „MM-TT“ um `days` Tage verschoben (innerhalb desselben Jahres) */
function shiftMd(year: number, md: string, days: number): string {
  const t = new Date(Date.UTC(year, Number(md.slice(0, 2)) - 1, Number(md.slice(3, 5)) + days))
  return `${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`
}

/**
 * Festtags-Fenster als [Monat-Tag von, bis] (inklusive) im angegebenen Jahr. Ostern ist beweglich:
 * Passionszeit bis Ostermontag (zwei Wochen vor Ostersonntag bis einen Tag danach – Karwoche/Semana Santa).
 */
export function festiveWindow(w: Festive, year: number): [string, string] {
  switch (w) {
    case 'martini': return ['11-01', '11-30']
    case 'weihnachten': return ['12-01', '12-26']
    case 'plaetzchen': return ['11-15', '12-26']
    case 'ostern': { const e = easterSunday(year); return [shiftMd(year, e, -14), shiftMd(year, e, 1)] }
  }
}
