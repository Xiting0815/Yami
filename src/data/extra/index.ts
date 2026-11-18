/**
 * Backen & Desserts: Daten der drei Schreib-Gruppen zusammenführen. Jede Gruppe bearbeitet nur ihre eigene Datei
 * (desserts.ts, kuchen.ts, brot.ts); die Registries in src/data lesen die zusammengeführten Werte von hier.
 * Diese Datei importiert nur Daten (keine Registries) – so gibt es keine Import-Zyklen.
 */
import type { DeviceStep, ShopCat } from '../../types'
import type { RawRecipe } from '../define'
import type { ExtraGroup, ExtraProduct, Nutri } from './types'
import { desserts } from './desserts'
import { kuchen } from './kuchen'
import { brot } from './brot'
import { gebaeck } from './gebaeck'

export type { ExtraGroup } from './types'

export const EXTRA_GROUPS: Record<string, ExtraGroup> = { desserts, kuchen, brot, gebaeck }
const groups = Object.values(EXTRA_GROUPS)

const merge = <T,>(pick: (g: ExtraGroup) => Record<string, T> | undefined): Record<string, T> =>
  Object.assign({}, ...groups.map((g) => pick(g) ?? {}))

/** Rezepte aller Gruppen; `img` = Suchbegriff aus `imageQueries` */
export const EXTRA_RECIPES: RawRecipe[] = groups.flatMap((g) => g.recipes.map((r) => ({ ...r, img: g.imageQueries[r.id] ?? r.img })))

export const EXTRA_CATALOG: Partial<Record<ShopCat, string[]>> = {}
for (const g of groups)
  for (const [cat, names] of Object.entries(g.catalog) as [ShopCat, string[]][]) EXTRA_CATALOG[cat] = [...(EXTRA_CATALOG[cat] ?? []), ...names]

export const EXTRA_PRODUCTS: Record<string, ExtraProduct> = merge((g) => g.products)
export const EXTRA_NUTRI: Record<string, Nutri> = merge((g) => g.nutrition)
export const EXTRA_GRAMS: Record<string, Record<string, number>> = merge((g) => g.grams)
export const EXTRA_CONVERT: Record<string, Record<string, number>> = merge((g) => g.convert)
export const EXTRA_SEASON: Record<string, number[]> = merge((g) => g.season)
export const EXTRA_DEVICE_STEPS: Record<string, DeviceStep[]> = merge((g) => g.deviceSteps)
export const EXTRA_NON_VEG: string[] = groups.flatMap((g) => g.nonVeg ?? [])

/** Austausch-Gruppen: gleichnamige Gruppen werden vereinigt */
export const EXTRA_SUBSTITUTE_GROUPS: Record<string, string[]> = {}
export const EXTRA_PREFERRED: Record<string, string[]> = {}
for (const g of groups) {
  for (const [k, names] of Object.entries(g.substitutes?.groups ?? {})) EXTRA_SUBSTITUTE_GROUPS[k] = [...new Set([...(EXTRA_SUBSTITUTE_GROUPS[k] ?? []), ...names])]
  for (const [k, names] of Object.entries(g.substitutes?.preferred ?? {})) EXTRA_PREFERRED[k] = [...new Set([...(EXTRA_PREFERRED[k] ?? []), ...names])]
}

/** Ergebnisse der Back-Rezepte (Name → Rezept), z. B. „Bienenstich (selbstgebacken)“ */
export const EXTRA_YIELDS: { recipe: RawRecipe; name: string }[] = EXTRA_RECIPES.filter((r) => r.yields).map((r) => ({ recipe: r, name: r.yields!.name }))
