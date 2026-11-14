export type Cuisine = 'de' | 'it' | 'as'
export type DishType = 'haupt' | 'pasta' | 'eintopf' | 'suppe' | 'auflauf'

/** Einkaufslisten-Abschnitte – Reihenfolge = Reihenfolge im Laden */
export type ShopCat = 'gemuese' | 'konserven' | 'backwaren' | 'molkerei' | 'fleisch' | 'tk' | 'vorrat'

export const SHOP_ORDER: ShopCat[] = ['gemuese', 'konserven', 'backwaren', 'molkerei', 'fleisch', 'tk', 'vorrat']

export const SHOP_LABEL: Record<ShopCat, string> = {
  gemuese: 'Gemüse, Obst & Kräuter',
  konserven: 'Konserven & Trockenware',
  backwaren: 'Backwaren',
  molkerei: 'Käse, Nudeln & Molkerei',
  fleisch: 'Fleisch & Fisch',
  tk: 'Tiefkühl',
  vorrat: 'Vorrat prüfen',
}

export const SHOP_ICON: Record<ShopCat, string> = {
  gemuese: '🥕',
  konserven: '🥫',
  backwaren: '🥖',
  molkerei: '🧀',
  fleisch: '🥩',
  tk: '❄️',
  vorrat: '🧂',
}

export const CUISINE_LABEL: Record<Cuisine, string> = { de: 'Deutsch', it: 'Italienisch', as: 'Asiatisch' }
export const TYPE_LABEL: Record<DishType, string> = {
  haupt: 'Hauptgericht',
  pasta: 'Pasta',
  eintopf: 'Eintopf',
  suppe: 'Suppe',
  auflauf: 'Auflauf & Gratin',
}

export interface Ingredient {
  name: string
  /** null = nach Bedarf / nach Geschmack */
  amount: number | null
  unit: string
}

export type BreakfastType = 'suess' | 'herzhaft' | 'warm'

export const BREAKFAST_LABEL: Record<BreakfastType, string> = { suess: 'Süß & kalt', herzhaft: 'Herzhaft', warm: 'Warm (Mikrowelle)' }

/** Nährwerte (pro Portion) */
export interface Nutrition {
  kcal: number
  protein: number
  fat: number
  carbs: number
  fiber: number
}

export interface Recipe {
  id: string
  title: string
  meal: 'dinner' | 'breakfast'
  /** nur Frühstück */
  breakfast?: {
    type: BreakfastType
    /** Tage haltbar im Kühlschrank nach dem Vorbereiten */
    fridgeDays: number
    /** lässt sich portionsweise einfrieren */
    freezer: boolean
    /** Behälter pro Portion, z. B. "Glas" */
    container: string
    /** was morgens bzw. auf der Arbeit zu tun ist */
    morning: string
  }
  /** pro Portion, berechnet aus den Zutaten */
  nutrition: Nutrition
  cuisine: Cuisine
  type: DishType
  /** Gesamtzeit in Minuten */
  time: number
  /** Basis-Portionen der Mengenangaben */
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  vegetarian: boolean
  image?: string
}

export interface PlanEntry {
  recipeId: string
  servings: number
  /** cooked = automatisch abgezogen (Tag ist vorbei), skipped = nicht gekocht */
  status?: 'cooked' | 'skipped'
  /** beim Kochen aus dem Vorrat entnommene Mengen (für "nicht gekocht") */
  consumed?: { id: string; name: string; amount: number; unit: string; expires: string }[]
}

/** Schlüssel = ISO-Datum (YYYY-MM-DD) */
export type WeekPlan = Record<string, PlanEntry | undefined>
