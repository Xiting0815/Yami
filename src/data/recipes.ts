import type { Recipe } from '../types'
import { CATALOG, NON_VEG } from './catalog'
import type { RawRecipe } from './define'
import { recipesDe } from './recipes-de'
import { recipesIt } from './recipes-it'
import { recipesAs } from './recipes-as'
import { breakfasts } from './breakfasts'
import { nutritionOf } from './nutrition-calc'
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
