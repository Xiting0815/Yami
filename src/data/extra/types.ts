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
 * Eine Datei einer Schreib-Gruppe (desserts.ts, kuchen.ts, brot.ts). Jede Gruppe trägt NUR hier ein –
 * neue Zutaten, Rezepte, Geräte-Schritte und Bild-Suchbegriffe. Die Registries (Katalog, Produkte, Nährwerte,
 * Austausch, Geräte, Rezepte) holen sich alles über `src/data/extra/index.ts`.
 */
export interface ExtraGroup {
  /** Rezepte, gebaut mit `backen(...)` aus define.ts */
  recipes: RawRecipe[]
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
   * `preferred` = Rezeptzutat → selbstgebackene Zutaten, die zuerst genommen werden.
   */
  substitutes?: { groups?: Record<string, string[]>; preferred?: Record<string, string[]> }
  /** neue nicht-vegetarische Zutaten außerhalb von „Fleisch & Fisch“ (z. B. Gelatine) */
  nonVeg?: string[]
  /** Geräte-Schritte je Rezept-ID (Format wie src/data/device-steps, Regeln docs/geraete/regeln.md) */
  deviceSteps: Record<string, DeviceStep[]>
  /** englischer Suchbegriff fürs Foto (Wikimedia Commons) je Rezept-ID */
  imageQueries: Record<string, string>
}
