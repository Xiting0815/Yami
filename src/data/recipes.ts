import type { CustomIngredient, CustomRecipe, Recipe } from '../types'
import { CATALOG, NON_VEG } from './catalog'
import { pieceSize, yieldStock, type RawRecipe } from './define'
import { EXTRA_RECIPES } from './extra'
import { recipesDe } from './recipes-de'
import { recipesIt } from './recipes-it'
import { recipesAs } from './recipes-as'
import { recipesGr } from './recipes-gr'
import { recipesUs } from './recipes-us'
import { breakfasts } from './breakfasts'
import { basicsDe } from './recipes-basic'
import { nutritionOf } from './nutrition-calc'
import { registerCustomIngredients } from './custom-registry'
import { DEVICE_STEPS } from './device-steps'
import { substitutesFor } from './substitutes'
import imageMap from './images.json'

const images = imageMap as unknown as Record<string, { file: string } | null | undefined>

/** Abendessen (Rohdaten) */
export const RAW_RECIPES = [...recipesDe, ...recipesIt, ...recipesAs, ...recipesGr, ...recipesUs]
/** Frühstücke (Rohdaten) */
export const RAW_BREAKFASTS = breakfasts
/** Grundrezepte, Backen & Desserts und BBQ (Rohdaten) – Fonds, Anstellgut, Kuchen, Brot, Pulled Pork …, keine Abendessen */
export const RAW_BASICS: RawRecipe[] = [...basicsDe, ...EXTRA_RECIPES]

function build(r: RawRecipe, meal: Recipe['meal']): Recipe {
  const servings = r.servings ?? 2
  // Geräte-Schritte (nur eingebaute Rezepte; eigene Rezepte haben keine)
  const dev = DEVICE_STEPS[r.id]
  const device = dev && dev.length ? dev : undefined
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
    steps: device ? device.map((d) => d.text) : r.steps,
    deviceSteps: device,
    classicSteps: device ? r.steps : undefined,
    vegetarian: !r.ingredients.some((i) => CATALOG[i.name] === 'fleisch' || NON_VEG.has(i.name)),
    image: images[r.id]?.file,
    festive: r.festive,
    // BBQ: Zutaten für die ganze Ladung → Nährwerte je Portion der Ladung
    nutrition: nutritionOf(r.ingredients, r.portions ?? servings, r.fatLoss),
    ...(r.basic ? { basic: true as const, yields: withPerPiece(r), kind: r.kind ?? 'grundrezept', lighter: r.lighter } : {}),
    ...(r.bbq ? { bbq: r.bbq } : {}),
    ...(r.portions ? { portions: r.portions } : {}),
  }
}

/**
 * Nährwerte je Stück/Portion/Scheibe eines Back-Ergebnisses: Summe aller Zutaten ÷ Anzahl im Vorrat
 * (Brotlaib: ÷ Scheiben à 50 g). Ein angegebener Wert (`perPiece`) hat Vorrang.
 */
function withPerPiece(r: RawRecipe): Recipe['yields'] {
  const y = r.yields
  // BBQ-Reste (vakuumiert, grammweise für Resteessen) haben kein „Stück“
  if (!y || y.perPiece || !r.kind || r.kind === 'grundrezept' || r.kind === 'bbq') return y
  // Zutaten und `yields` gelten beide für ein ganzes Rezept; Stück = 1 Stk/Portion/Scheibe (bzw. 50 g)
  const st = yieldStock(r.kind, y)
  const units = st.amount / pieceSize(st.unit)
  if (!(units > 0)) return y
  const n = nutritionOf(r.ingredients, units)
  return { ...y, perPiece: { kcal: n.kcal, protein: n.protein } }
}

/** Abendessen */
export const RECIPES: Recipe[] = RAW_RECIPES.map((r) => build(r, 'dinner'))
/** Meal-Prep-Frühstücke (Mengen für 1 Portion) */
export const BREAKFASTS: Recipe[] = RAW_BREAKFASTS.map((r) => build(r, 'breakfast'))

/**
 * Grundrezepte (Fonds): bewusst NICHT in RECIPES – so bleiben sie aus Wischstapel, Planung, Abwechslung,
 * Veggie-Quote und Geschmackslernen heraus. Über RECIPE_BY_ID für Rezept-Sheet und Kochmodus erreichbar.
 */
export const BASICS: Recipe[] = RAW_BASICS.map((r) => build(r, 'dinner'))

/** Back-Rezept (Dessert, Kuchen, Brot), dessen Ergebnis so heißt – für „1 gegessen“ im Vorrat (BBQ-Reste nicht) */
export function bakeFor(yieldName: string): Recipe | undefined {
  return BASICS.find((b) => b.kind && b.kind !== 'grundrezept' && b.kind !== 'bbq' && b.yields?.name === yieldName)
}

/** Grundrezept, das diese Zutat selbst herstellt (Rinderfond → Brauner Rinderfond), sonst undefined */
export function basicFor(name: string): Recipe | undefined {
  return BASICS.find((b) => b.yields && (b.yields.name === name || substitutesFor(name).includes(b.yields.name)))
}

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries([...RECIPES, ...BREAKFASTS, ...BASICS].map((r) => [r.id, r]))

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
