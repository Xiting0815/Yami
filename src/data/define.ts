import type { BreakfastType, Cuisine, DishType, Festive, Ingredient } from '../types'

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
  /** Basis-Portionen der Mengenangaben (Abendessen 2, Frühstück 1) */
  servings?: number
  /** Festtagsgericht (Zeitfenster) */
  festive?: Festive[]
  breakfast?: { type: BreakfastType; fridgeDays: number; freezer: boolean; container: string; morning: string }
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

const splitIngredients = (s: string) => s.split('|').map((x) => x.trim()).filter(Boolean).map(parseIngredient)

/**
 * Frühstück für Meal-Prep – Mengen für 1 Portion.
 * steps = Vorbereitung (am Prep-Tag), morning = was morgens/auf der Arbeit zu tun ist.
 */
export function b(
  id: string,
  title: string,
  type: BreakfastType,
  time: number,
  fridgeDays: number,
  freezer: boolean,
  container: string,
  ingredients: string,
  steps: string[],
  morning: string,
  img?: string,
): RawRecipe {
  return {
    id,
    title,
    cuisine: 'de',
    type: 'haupt',
    time,
    ingredients: splitIngredients(ingredients),
    steps,
    img,
    servings: 1,
    breakfast: { type, fridgeDays, freezer, container, morning },
  }
}

/** Rezept als Festtagsgericht markieren */
export function fest(rec: RawRecipe, ...windows: Festive[]): RawRecipe {
  return { ...rec, festive: windows }
}
