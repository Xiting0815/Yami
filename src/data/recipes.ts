import type { Recipe } from '../types'
import { CATALOG, NON_VEG } from './catalog'
import { recipesDe } from './recipes-de'
import { recipesIt } from './recipes-it'
import { recipesAs } from './recipes-as'
import imageMap from './images.json'

const images = imageMap as unknown as Record<string, { file: string } | null | undefined>

export const RAW_RECIPES = [...recipesDe, ...recipesIt, ...recipesAs]

export const RECIPES: Recipe[] = RAW_RECIPES.map((r) => ({
  id: r.id,
  title: r.title,
  cuisine: r.cuisine,
  type: r.type,
  time: r.time,
  servings: 2,
  ingredients: r.ingredients,
  steps: r.steps,
  vegetarian: !r.ingredients.some((i) => CATALOG[i.name] === 'fleisch' || NON_VEG.has(i.name)),
  image: images[r.id]?.file,
}))

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]))
