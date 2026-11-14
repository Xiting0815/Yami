import type { Cuisine, DishType, Ingredient } from '../types'

/** Erlaubte Einheiten. Die Reihenfolge ist egal, Schreibweise zählt. */
export const UNITS = [
  'g', 'kg', 'ml', 'l', 'Stk', 'EL', 'TL', 'Prise', 'Bund', 'Zehe', 'Dose', 'Pck', 'Scheibe', 'Zweig', 'Glas', 'Becher', 'Blatt',
] as const

export interface RawRecipe {
  id: string
  title: string
  cuisine: Cuisine
  type: DishType
  time: number
  ingredients: Ingredient[]
  steps: string[]
  /** Suchbegriff für das Foto (Wikimedia Commons), Standard: Titel */
  img?: string
}

/**
 * Zutatenzeile parsen: "400 g Rinderhackfleisch", "2 Stk Zwiebel", "Salz" (= nach Bedarf).
 * Mengen sind immer für 2 Portionen angegeben.
 */
export function parseIngredient(line: string): Ingredient {
  const m = line.trim().match(/^(\d+(?:[.,]\d+)?)\s+(\S+)\s+(.+)$/)
  if (m && (UNITS as readonly string[]).includes(m[2])) {
    return { amount: parseFloat(m[1].replace(',', '.')), unit: m[2], name: m[3].trim() }
  }
  return { amount: null, unit: '', name: line.trim() }
}

/** Kompakte Rezeptdefinition. Zutaten mit "|" getrennt. */
export function r(
  id: string,
  title: string,
  cuisine: Cuisine,
  type: DishType,
  time: number,
  ingredients: string,
  steps: string[],
  img?: string,
): RawRecipe {
  return {
    id,
    title,
    cuisine,
    type,
    time,
    ingredients: ingredients.split('|').map((s) => s.trim()).filter(Boolean).map(parseIngredient),
    steps,
    img,
  }
}
