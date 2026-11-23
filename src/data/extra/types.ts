import type { DeviceStep, ShopCat } from '../../types'
import type { RawRecipe } from '../define'

/** Nährwerte pro 100 g bzw. 100 ml: [kcal, Eiweiß g, Fett g, Kohlenhydrate g, Ballaststoffe g] */
export type Nutri = [number, number, number, number, number]

/** Packung, Einheit, Preis, Haltbarkeit (wie in products.ts; Kurzform `prod()` aus define.ts) */
export interface ExtraProduct {
  pack: number
  unit: string
  price: number
  shelf: number
  opened?: number
  packName?: string
}

/**
 * Neue Zutaten einer Schreib-Gruppe: alles, was eine Zutat braucht (Kategorie, Produkt, Nährwerte, Gewicht …).
 * Wird zentral in Katalog/Produkte/Nährwerte/Saison/Austausch eingetragen (src/data/extra/index.ts) – die Gruppe
 * fasst catalog.ts, products.ts und nutrition.ts nie selbst an. Für Rezeptdateien außerhalb von src/data/extra
 * (z. B. src/data/recipes-us.ts) gibt es dieselbe Form ohne Rezepte.
 */
export interface ExtraIngredients {
  /** NEUE Zutaten je Einkaufslisten-Abschnitt (keine, die es schon gibt) */
  catalog: Partial<Record<ShopCat, string[]>>
  /** Produkt je neuer Zutat */
  products: Record<string, ExtraProduct>
  /** Nährwerte je neuer Zutat (pro 100 g/ml) */
  nutrition: Record<string, Nutri>
  /** Gramm je Einheit für neue Zutaten, z. B. { Pck: 37 } */
  grams: Record<string, Record<string, number>>
  /** Umrechnung Rezepteinheit → Packungseinheit für neue Zutaten, z. B. { EL: 8 } */
  convert?: Record<string, Record<string, number>>
  /** Saison (Monate 1–12) für neue Obst-/Gemüsezutaten */
  season?: Record<string, number[]>
  /**
   * Austausch: `groups` = Gruppen austauschbarer Zutaten (gleiche Vorratseinheit!; vorhandene Gruppen-Namen werden ergänzt),
   * `preferred` = Rezeptzutat → selbstgemachte Zutaten, die zuerst genommen werden (Fond, Brot, BBQ-Sauce, Pulled Pork …).
   */
  substitutes?: { groups?: Record<string, string[]>; preferred?: Record<string, string[]> }
  /** neue nicht-vegetarische Zutaten außerhalb von „Fleisch & Fisch“ (z. B. Gelatine, Speck-Rub) */
  nonVeg?: string[]
  /** neue Gewürze (Kategorie 'vorrat', im Vorrat nur „da“/„alle“ statt Menge), z. B. 'Paprikapulver geräuchert' */
  spices?: string[]
}

/**
 * Eine Datei einer Schreib-Gruppe (desserts.ts, kuchen.ts, brot.ts, bbq/*.ts). Jede Gruppe trägt NUR hier ein –
 * neue Zutaten, Rezepte, Geräte-Schritte und Bild-Suchbegriffe. Die Registries (Katalog, Produkte, Nährwerte,
 * Austausch, Geräte, Rezepte) holen sich alles über `src/data/extra/index.ts`.
 */
export interface ExtraGroup extends ExtraIngredients {
  /** Rezepte, gebaut mit `backen(...)` bzw. `bbq(...)` aus define.ts */
  recipes: RawRecipe[]
  /** Geräte-Schritte je Rezept-ID (Format wie src/data/device-steps, Regeln docs/geraete/regeln.md, BBQ: docs/bbq-regeln.md) */
  deviceSteps: Record<string, DeviceStep[]>
  /** englischer Suchbegriff fürs Foto (Wikimedia Commons) je Rezept-ID */
  imageQueries: Record<string, string>
}
