import type { CustomIngredient, CustomRecipe, Recipe } from '../types'
import { CATALOG, NON_VEG } from './catalog'
import type { RawRecipe } from './define'
import { recipesDe } from './recipes-de'
import { recipesIt } from './recipes-it'
import { recipesAs } from './recipes-as'
import { breakfasts } from './breakfasts'
import { nutritionOf } from './nutrition-calc'
import { registerCustomIngredients } from './custom-registry'
import imageMap from './images.json'

const images = imageMap as unknown as Record<string, { file: string } | null | undefined>

/** Abendessen (Rohdaten) */
export const RAW_RECIPES = [...recipesDe, ...recipesIt, ...recipesAs]
/** Frühstücke (Rohdaten) */
export const RAW_BREAKFASTS = breakfasts

function build(r: RawRecipe, meal: Recipe['meal']): Recipe {
  const servings = r.servings ?? 2
  return {
    id: r.id,
    title: r.title,
    meal,
    breakfast: r.breakfast,
    cuisine: r.cuisine,
    type: r.type,
    time: r.time,
    servings,
    ingredients: r.ingredients,
    steps: r.steps,
    vegetarian: !r.ingredients.some((i) => CATALOG[i.name] === 'fleisch' || NON_VEG.has(i.name)),
    image: images[r.id]?.file,
    nutrition: nutritionOf(r.ingredients, servings),
  }
}

/** Abendessen */
export const RECIPES: Recipe[] = RAW_RECIPES.map((r) => build(r, 'dinner'))
/** Meal-Prep-Frühstücke (Mengen für 1 Portion) */
export const BREAKFASTS: Recipe[] = RAW_BREAKFASTS.map((r) => build(r, 'breakfast'))

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries([...RECIPES, ...BREAKFASTS].map((r) => [r.id, r]))

// ───────────── eigene Rezepte (zur Laufzeit) ─────────────

const BUILTIN_DINNERS = RECIPES.length
const BUILTIN_BREAKFASTS = BREAKFASTS.length
let lastCustom: CustomRecipe[] | null = null

function buildCustom(c: CustomRecipe): Recipe {
  const meal = c.meal
  const rec = build(
    { id: c.id, title: c.title, cuisine: c.cuisine, type: c.type, time: c.time, servings: c.servings, ingredients: c.ingredients, steps: c.steps, breakfast: c.breakfast },
    meal,
  )
  rec.image = c.image
  rec.custom = true
  return rec
}

/**
 * Eigene Rezepte in RECIPES / BREAKFASTS / RECIPE_BY_ID eintragen (die Objekte werden direkt verändert,
 * damit alle Importeure sie sehen). Ersetzt die zuvor eingetragenen eigenen Rezepte.
 * Zutaten müssen vorher registriert sein (siehe `registerCustom`).
 */
export function registerCustomRecipes(list: CustomRecipe[]): void {
  if (list === lastCustom) return
  lastCustom = list
  for (const id of Object.keys(RECIPE_BY_ID)) if (id.startsWith('my-')) delete RECIPE_BY_ID[id]
  RECIPES.length = BUILTIN_DINNERS
  BREAKFASTS.length = BUILTIN_BREAKFASTS
  for (const c of list) {
    if (RECIPE_BY_ID[c.id]) continue
    const rec = buildCustom(c)
    ;(rec.meal === 'breakfast' ? BREAKFASTS : RECIPES).push(rec)
    RECIPE_BY_ID[rec.id] = rec
  }
}

/** Eigene Zutaten und Rezepte zusammen registrieren (idempotent – nur bei neuen Listen wird gearbeitet) */
export function registerCustom(ingredients: CustomIngredient[], recipes: CustomRecipe[]): void {
  const changedIng = ingredients !== lastIngredients
  lastIngredients = ingredients
  registerCustomIngredients(ingredients)
  // neue Zutaten verändern Nährwerte/Vegetarisch-Flag → Rezepte neu bauen
  if (changedIng) lastCustom = null
  registerCustomRecipes(recipes)
}
let lastIngredients: CustomIngredient[] | null = null
