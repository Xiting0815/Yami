/** Backen & Desserts: Texte zum Ergebnis und „1 gegessen“ (Stück aus dem Vorrat, zählt fürs Lernen) */
import { bakeFor } from './data/recipes'
import { pieceSize, yieldStock } from './data/define'
import type { PantryLot } from './kitchen'
import { formatAmount } from './shopping'
import type { Recipe, Snack } from './types'

const plural = (n: number, one: string, many: string) => `${String(Math.round(n * 10) / 10).replace('.', ',')} ${n === 1 ? one : many}`

/** Menge in Worten: „12 Stück“, „6 Portionen“, „20 Scheiben“, sonst „1,5 l“ */
export function amountText(amount: number, unit: string): string {
  if (unit === 'Stk') return plural(amount, 'Stück', 'Stück')
  if (unit === 'Portion') return plural(amount, 'Portion', 'Portionen')
  if (unit === 'Scheibe') return plural(amount, 'Scheibe', 'Scheiben')
  return formatAmount(amount, unit)
}

/** Was ein Rezept (× Menge) ergibt: „12 Stück“, „1 kg (≈ 20 Scheiben)“, „1,5 l“ */
export function yieldText(recipe: Recipe, servings: number): string {
  const y = recipe.yields
  if (!y) return ''
  const f = servings / recipe.servings
  const st = yieldStock(recipe.kind, y)
  // BBQ-Reste: „1,5 kg (6 × 250 g)“
  if (y.portion && y.unit === 'g') return `${formatAmount(y.amount * f, y.unit)} (${Math.round((y.amount * f) / y.portion)} × ${y.portion} g)`
  if (st.unit !== y.unit) return `${formatAmount(y.amount * f, y.unit)} (≈ ${amountText(st.amount * f, st.unit)})`
  return amountText(y.amount * f, y.unit)
}

/** Haltbarkeit in Worten: „3 Tage“, „1 Woche“, „3 Monate“ */
export function shelfText(days: number): string {
  if (days >= 60) return `${Math.round(days / 30)} Monate`
  if (days === 7) return '1 Woche'
  if (days === 1) return '1 Tag'
  return `${days} Tage`
}

/** Kann man von diesem Vorratsposten „1 gegessen“ tippen? → Rezept und Beschriftung */
export function eatInfo(lot: PantryLot): { recipe: Recipe; label: string; amount: number } | undefined {
  const recipe = bakeFor(lot.name)
  if (!recipe?.yields) return undefined
  const label = lot.unit === 'Stk' ? '1 gegessen' : lot.unit === 'Portion' ? '1 Portion gegessen' : '1 Scheibe gegessen'
  return { recipe, label, amount: Math.min(lot.amount, pieceSize(lot.unit)) }
}

/**
 * „1 gegessen“: ein Stück vom Posten abziehen (leerer Posten fällt weg) und für `day` festhalten (fürs Lernen).
 * Ist weniger als ein Stück übrig, wird der Rest abgezogen.
 */
export function eatOne(pantry: PantryLot[], lotId: string, day: string): { pantry: PantryLot[]; snack: Snack | null } {
  const lot = pantry.find((l) => l.id === lotId)
  const info = lot ? eatInfo(lot) : undefined
  if (!lot || !info) return { pantry, snack: null }
  const next = pantry.map((l) => (l.id === lotId ? { ...l, amount: l.amount - info.amount } : l)).filter((l) => l.amount > 1e-6)
  return {
    pantry: next,
    snack: { date: day, name: lot.name, recipeId: info.recipe.id },
  }
}
