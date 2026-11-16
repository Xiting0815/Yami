import type { Recipe } from '../types'
import { gramsOf } from './nutrition-calc'

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
  'Feldsalat': [10, 11, 12, 1, 2, 3],
  'Frühlingszwiebel': [4, 5, 6, 7, 8, 9, 10],
  'Grüne Bohnen': [6, 7, 8, 9, 10],
  'Grünkohl': [11, 12, 1, 2],
  'Hokkaido-Kürbis': [8, 9, 10, 11],
  'Kirschtomaten': [7, 8, 9],
  'Kohlrabi': [5, 6, 7, 8, 9, 10, 11],
  'Kopfsalat': [5, 6, 7, 8, 9, 10],
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
