/**
 * Backen & Desserts, BBQ, Tapas und Salate: Daten der Schreib-Gruppen zusammenführen. Jede Gruppe bearbeitet nur ihre eigene Datei
 * (desserts.ts, kuchen.ts, brot.ts, gebaeck.ts, desserts-es.ts, bbq/*.ts, tapas/*.ts, salate/*.ts); die Registries in src/data lesen die zusammengeführten Werte von hier.
 * Dazu kommen Zutaten-Gruppen ohne eigene Rezepte hier (`EXTRA_INGREDIENT_GROUPS`, z. B. die neuen Zutaten der Küche
 * „Amerikanisch“ aus src/data/recipes-us.ts, „Spanisch“ aus recipes-es.ts/recipes-es2.ts und die gemeinsamen Spanien-Zutaten
 * zutaten-es.ts).
 * Diese Datei importiert nur Daten (keine Registries) – so gibt es keine Import-Zyklen.
 */
import type { DeviceStep, ShopCat } from '../../types'
import type { RawRecipe } from '../define'
import type { ExtraGroup, ExtraIngredients, ExtraProduct, Nutri } from './types'
import { desserts } from './desserts'
import { kuchen } from './kuchen'
import { brot } from './brot'
import { gebaeck } from './gebaeck'
import { BBQ_GROUPS } from './bbq'
import { TAPAS_GROUPS } from './tapas'
import { SALAT_GROUPS } from './salate'
import { dessertsEs } from './desserts-es'
import { zutatenEs } from './zutaten-es'
import { usZutaten } from '../recipes-us'
import { esZutaten } from '../recipes-es'
import { es2Zutaten } from '../recipes-es2'

export type { ExtraGroup, ExtraIngredients } from './types'

/** Gruppen mit Rezepten (Schlüssel = Dateiname für Meldungen von check-data; BBQ: „bbq/…“) */
export const EXTRA_GROUPS: Record<string, ExtraGroup> = { desserts, kuchen, brot, gebaeck, 'desserts-es': dessertsEs, ...BBQ_GROUPS, ...TAPAS_GROUPS, ...SALAT_GROUPS }
/** Gruppen nur mit neuen Zutaten (Rezepte liegen woanders, z. B. Küche „Amerikanisch“ in src/data/recipes-us.ts) */
export const EXTRA_INGREDIENT_GROUPS: Record<string, ExtraIngredients> = { 'zutaten-es': zutatenEs, 'recipes-us': usZutaten, 'recipes-es': esZutaten, 'recipes-es2': es2Zutaten }
const recipeGroups = Object.values(EXTRA_GROUPS)
const groups: ExtraIngredients[] = [...recipeGroups, ...Object.values(EXTRA_INGREDIENT_GROUPS)]

const merge = <T,>(pick: (g: ExtraIngredients) => Record<string, T> | undefined): Record<string, T> =>
  Object.assign({}, ...groups.map((g) => pick(g) ?? {}))

/** Rezepte aller Gruppen; `img` = Suchbegriff aus `imageQueries` */
export const EXTRA_RECIPES: RawRecipe[] = recipeGroups.flatMap((g) => g.recipes.map((r) => ({ ...r, img: g.imageQueries[r.id] ?? r.img })))

export const EXTRA_CATALOG: Partial<Record<ShopCat, string[]>> = {}
for (const g of groups)
  for (const [cat, names] of Object.entries(g.catalog) as [ShopCat, string[]][]) EXTRA_CATALOG[cat] = [...(EXTRA_CATALOG[cat] ?? []), ...names]

export const EXTRA_PRODUCTS: Record<string, ExtraProduct> = merge((g) => g.products)
export const EXTRA_NUTRI: Record<string, Nutri> = merge((g) => g.nutrition)
export const EXTRA_GRAMS: Record<string, Record<string, number>> = merge((g) => g.grams)
export const EXTRA_CONVERT: Record<string, Record<string, number>> = merge((g) => g.convert)
export const EXTRA_SEASON: Record<string, number[]> = merge((g) => g.season)
export const EXTRA_DEVICE_STEPS: Record<string, DeviceStep[]> = Object.assign({}, ...recipeGroups.map((g) => g.deviceSteps))
export const EXTRA_NON_VEG: string[] = groups.flatMap((g) => g.nonVeg ?? [])
export const EXTRA_SPICES: string[] = groups.flatMap((g) => g.spices ?? [])

/** Austausch-Gruppen: gleichnamige Gruppen werden vereinigt */
export const EXTRA_SUBSTITUTE_GROUPS: Record<string, string[]> = {}
export const EXTRA_PREFERRED: Record<string, string[]> = {}
for (const g of groups) {
  for (const [k, names] of Object.entries(g.substitutes?.groups ?? {})) EXTRA_SUBSTITUTE_GROUPS[k] = [...new Set([...(EXTRA_SUBSTITUTE_GROUPS[k] ?? []), ...names])]
  for (const [k, names] of Object.entries(g.substitutes?.preferred ?? {})) EXTRA_PREFERRED[k] = [...new Set([...(EXTRA_PREFERRED[k] ?? []), ...names])]
}

/** Ergebnisse der Back-/BBQ-Rezepte (Name → Rezept), z. B. „Bienenstich (selbstgebacken)“, „Pulled Pork (vakuumiert)“ */
export const EXTRA_YIELDS: { recipe: RawRecipe; name: string }[] = EXTRA_RECIPES.filter((r) => r.yields).map((r) => ({ recipe: r, name: r.yields!.name }))
