import { CATALOG, SHOP_ALIAS } from './data/catalog'
import { RECIPE_BY_ID } from './data/recipes'
import type { Ingredient, ShopCat, WeekPlan } from './types'
import { SHOP_ORDER } from './types'
import type { CustomItem } from './store'

export interface ShopItem {
  key: string
  name: string
  cat: ShopCat
  /** z. B. "600 g", "2 Stk + 1 EL"; leer = nach Bedarf */
  amount: string
  /** Gerichte, die diese Zutat brauchen */
  recipes: string[]
  custom?: boolean
}

export interface ShopSection {
  cat: ShopCat
  items: ShopItem[]
}

/** Mengen auf die gewünschte Portionenzahl umrechnen */
export function scale(ing: Ingredient, base: number, target: number): number | null {
  if (ing.amount == null) return null
  return (ing.amount * target) / base
}

const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [0.333, '⅓'],
  [0.5, '½'],
  [0.666, '⅔'],
  [0.75, '¾'],
]

function niceNumber(n: number, unit: string): string {
  // Gewichte/Volumen: sinnvoll runden
  if (unit === 'g' || unit === 'ml') {
    if (n >= 1000) {
      const v = Math.round(n / 50) * 50 / 1000
      return `${String(v).replace('.', ',')} ${unit === 'g' ? 'kg' : 'l'}`
    }
    const step = n >= 200 ? 10 : 5
    return `${Math.max(step, Math.round(n / step) * step)} ${unit}`
  }
  if (unit === 'kg' || unit === 'l') return `${String(Math.round(n * 100) / 100).replace('.', ',')} ${unit}`
  // Stückzahlen etc.: Brüche anzeigen
  const whole = Math.floor(n + 0.01)
  const rest = n - whole
  let frac = ''
  if (rest > 0.12) {
    const f = FRACTIONS.reduce((best, cur) => (Math.abs(cur[0] - rest) < Math.abs(best[0] - rest) ? cur : best))
    if (rest > 0.87) return `${whole + 1} ${unit}`.trim()
    frac = f[1]
  }
  const num = whole > 0 ? `${whole}${frac}` : frac || '0'
  return `${num} ${unit}`.trim()
}

export function formatAmount(amount: number | null, unit: string): string {
  if (amount == null) return ''
  // Einkaufsliste: Kleinstmengen in g (z. B. Safran) lesbar halten
  if (unit === 'g' && amount < 1) return `${String(Math.round(amount * 10) / 10).replace('.', ',')} g`
  return niceNumber(amount, unit)
}

/** Einkaufsliste aus dem Wochenplan erzeugen */
export function buildShoppingList(plan: WeekPlan, days: string[], custom: CustomItem[] = []): ShopSection[] {
  type Acc = { name: string; cat: ShopCat; units: Map<string, number>; recipes: Set<string>; anyAmount: boolean }
  const acc = new Map<string, Acc>()

  for (const day of days) {
    const entry = plan[day]
    if (!entry) continue
    const recipe = RECIPE_BY_ID[entry.recipeId]
    if (!recipe) continue
    for (const ing of recipe.ingredients) {
      const name = SHOP_ALIAS[ing.name] ?? ing.name
      const cat = CATALOG[ing.name] ?? 'konserven'
      let a = acc.get(name)
      if (!a) {
        a = { name, cat, units: new Map(), recipes: new Set(), anyAmount: false }
        acc.set(name, a)
      }
      a.recipes.add(recipe.title)
      const amt = scale(ing, recipe.servings, entry.servings)
      if (amt != null) {
        a.anyAmount = true
        // kg → g und l → ml, damit sich alles addiert
        let unit = ing.unit
        let v = amt
        if (unit === 'kg') { unit = 'g'; v *= 1000 }
        if (unit === 'l') { unit = 'ml'; v *= 1000 }
        a.units.set(unit, (a.units.get(unit) ?? 0) + v)
      }
    }
  }

  const sections = new Map<ShopCat, ShopItem[]>(SHOP_ORDER.map((c) => [c, []]))
  for (const a of acc.values()) {
    const amount = [...a.units.entries()].map(([u, v]) => formatAmount(v, u)).join(' + ')
    sections.get(a.cat)!.push({ key: a.name, name: a.name, cat: a.cat, amount, recipes: [...a.recipes] })
  }
  for (const c of custom) {
    sections.get(c.cat)!.push({ key: `custom:${c.id}`, name: c.name, cat: c.cat, amount: '', recipes: [], custom: true })
  }
  return SHOP_ORDER.map((cat) => ({
    cat,
    items: sections.get(cat)!.sort((x, y) => x.name.localeCompare(y.name, 'de')),
  })).filter((s) => s.items.length > 0)
}
