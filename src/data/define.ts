import type { BasicKind, BasicYield, BbqGroup, BreakfastType, Cuisine, DishType, Festive, Ingredient, ShopCat } from '../types'

/** Erlaubte Einheiten. Die Reihenfolge ist egal, Schreibweise zählt. */
export const UNITS = [
  'g', 'kg', 'ml', 'l', 'Stk', 'EL', 'TL', 'Prise', 'Bund', 'Zehe', 'Dose', 'Pck', 'Scheibe', 'Zweig', 'Glas', 'Becher', 'Blatt',
] as const

export interface RawRecipe {
  id: string
  title: string
  cuisine: Cuisine
  type: DishType
  time: number
  ingredients: Ingredient[]
  steps: string[]
  /** Suchbegriff für das Foto (Wikimedia Commons), Standard: Titel */
  img?: string
  /** Basis-Portionen der Mengenangaben (Abendessen 2, Frühstück 1) */
  servings?: number
  /** Festtagsgericht (Zeitfenster) */
  festive?: Festive[]
  breakfast?: { type: BreakfastType; fridgeDays: number; freezer: boolean; container: string; morning: string }
  /** Grundrezept (Fond …) oder Backen & Desserts, siehe `basic()` / `backen()` */
  basic?: true
  yields?: BasicYield
  kind?: BasicKind
  /** „💡 Leichter:“-Tipp */
  lighter?: string
  /** BBQ-Sparte: Untergruppe (siehe `bbq()`; Rubs & Saucen: `backen('grundrezept', …, { bbq: 'rub' })`) */
  bbq?: BbqGroup
  /** BBQ: Portionen der ganzen Ladung */
  portions?: number
}

/**
 * Zutatenzeile parsen: "400 g Rinderhackfleisch", "2 Stk Zwiebel", "Salz" (= nach Bedarf).
 * Mengen sind immer für 2 Portionen angegeben.
 */
export function parseIngredient(line: string): Ingredient {
  const m = line.trim().match(/^(\d+(?:[.,]\d+)?)\s+(\S+)\s+(.+)$/)
  if (m && (UNITS as readonly string[]).includes(m[2])) {
    return { amount: parseFloat(m[1].replace(',', '.')), unit: m[2], name: m[3].trim() }
  }
  return { amount: null, unit: '', name: line.trim() }
}

/** Kompakte Rezeptdefinition. Zutaten mit "|" getrennt. */
export function r(
  id: string,
  title: string,
  cuisine: Cuisine,
  type: DishType,
  time: number,
  ingredients: string,
  steps: string[],
  img?: string,
): RawRecipe {
  return {
    id,
    title,
    cuisine,
    type,
    time,
    ingredients: ingredients.split('|').map((s) => s.trim()).filter(Boolean).map(parseIngredient),
    steps,
    img,
  }
}

const splitIngredients = (s: string) => s.split('|').map((x) => x.trim()).filter(Boolean).map(parseIngredient)

/**
 * Frühstück für Meal-Prep – Mengen für 1 Portion.
 * steps = Vorbereitung (am Prep-Tag), morning = was morgens/auf der Arbeit zu tun ist.
 */
export function b(
  id: string,
  title: string,
  type: BreakfastType,
  time: number,
  fridgeDays: number,
  freezer: boolean,
  container: string,
  ingredients: string,
  steps: string[],
  morning: string,
  img?: string,
): RawRecipe {
  return {
    id,
    title,
    cuisine: 'de',
    type: 'haupt',
    time,
    ingredients: splitIngredients(ingredients),
    steps,
    img,
    servings: 1,
    breakfast: { type, fridgeDays, freezer, container, morning },
  }
}

/** Rezept als Festtagsgericht markieren */
export function fest(rec: RawRecipe, ...windows: Festive[]): RawRecipe {
  return { ...rec, festive: windows }
}

/**
 * Grundrezept (Fond, Jus …): Mengen für 1 Ansatz. `yields` = was der Ansatz ergibt (kommt beim „Fertig gekocht“
 * in den Vorrat, Haltbarkeit eingefroren). Grundrezepte sind keine Abendessen: nicht im Stapel, nicht planbar.
 */
export function basic(id: string, title: string, time: number, yields: BasicYield, ingredients: string, steps: string[], img?: string): RawRecipe {
  return { id, title, cuisine: 'de', type: 'haupt', time, ingredients: splitIngredients(ingredients), steps, img, servings: 1, basic: true, yields, kind: 'grundrezept' }
}

// ───────────── Backen & Desserts ─────────────

/** Gewicht einer Brotscheibe in g: Brotlaibe (Ergebnis in g) liegen im Vorrat in Scheiben, „1 Scheibe gegessen“ */
export const SLICE_G = 50

/** Ergebnis eines Back-Rezepts: Menge je Rezept (Blech, Form, Ansatz) */
export interface BackYield {
  /** Name im Vorrat, z. B. „Bienenstich (selbstgebacken)“ – eindeutig, Katalog/Produkt/Nährwerte entstehen automatisch */
  name: string
  amount: number
  /** Stk (Kuchenstücke, Brötchen), Portion (Desserts), g (Brotlaib → Scheiben à 50 g), ml (flüssige Grundrezepte) */
  unit: 'Stk' | 'Portion' | 'g' | 'ml'
  /** Tage haltbar, so gelagert wie in `store` */
  shelf: number
  /** Lagerung, z. B. „im Kühlschrank“ */
  store?: string
  /** Tage haltbar eingefroren (Hinweis), z. B. 90 */
  frozen?: number
  /** nur wenn die Berechnung aus den Zutaten nicht passt (z. B. Frittiertes) */
  perPiece?: { kcal: number; protein: number }
  /** Abschnitt im Katalog (Standard Backwaren); Rubs 'vorrat', Saucen 'konserven' */
  cat?: ShopCat
}

/** Optionen für `backen()` */
export interface BackOptions {
  /** Küche (nur Info/Bildsuche), Standard 'de' */
  cuisine?: Cuisine
  /** Gesamtzeit in Minuten inkl. Gehzeit (Sauerteig über Nacht: Arbeitszeit + Ruhezeit) */
  time: number
  yields: BackYield
  /** „💡 Leichter:“-Tipp, ein Satz (Pflicht bei Dessert/Kuchen/Brot) */
  lighter?: string
  /** Festtags-Fenster (z. B. ['plaetzchen'] für Weihnachtsplätzchen: Backen-Liste sortiert sie in der Saison nach vorn) */
  festive?: Festive[]
  /** nur Rubs & Saucen für die BBQ-Sparte: `'rub'` (erscheint dann auch im BBQ-Bereich unter „Rubs & Saucen“) */
  bbq?: BbqGroup
}

/**
 * Backen & Desserts (oder ein Grundrezept wie Anstellgut). Mengen für 1 Rezept (1 Blech, 1 Form, 1 Laib, 1 Ansatz).
 * Kein Abendessen: nicht im Wischstapel, nicht planbar. „Fertig gebacken“ legt `yields` in den Vorrat.
 *
 *   backen('kuchen', 'bienenstich', 'Bienenstich', { time: 150, yields: { name: 'Bienenstich (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 3, store: 'im Kühlschrank' }, lighter: '…' },
 *     '375 g Weizenmehl | 21 g Hefe frisch | …', ['Schritt 1 …', 'Schritt 2 …', 'Schritt 3 …'])
 */
export function backen(kind: BasicKind, id: string, title: string, o: BackOptions, ingredients: string, steps: string[]): RawRecipe {
  return {
    id,
    title,
    cuisine: o.cuisine ?? 'de',
    type: 'haupt',
    time: o.time,
    ingredients: splitIngredients(ingredients),
    steps,
    servings: 1,
    basic: true,
    yields: { ...o.yields },
    kind,
    lighter: o.lighter,
    ...(o.festive ? { festive: o.festive } : {}),
    ...(o.bbq ? { bbq: o.bbq } : {}),
  }
}

// ───────────── BBQ (Smoker, Grill, Dutch Oven, Burger, Beilagen) ─────────────

/** Rest einer BBQ-Ladung, der portionsweise vakuumiert eingefroren in den Vorrat kommt (z. B. Pulled Pork) */
export interface BbqLeftover {
  /** Name im Vorrat, z. B. „Pulled Pork (vakuumiert)“ – eindeutig; Katalog (Tiefkühl), Produkt und Nährwerte entstehen automatisch */
  name: string
  /** Menge des Rests je Ladung, z. B. 1500 (g) */
  amount: number
  /** 'g' für Fleisch (Resteessen nehmen es grammweise), 'Portion' für Beilagen/Eintöpfe */
  unit: 'g' | 'Portion'
  /** Beutelgröße in `unit`, z. B. 250 → „6 × 250 g vakuumiert“ */
  portion?: number
  /** Tage haltbar, so gelagert wie `store` (vakuumiert eingefroren ca. 90) */
  shelf: number
  /** Lagerung, Standard „vakuumiert eingefroren“ */
  store?: string
}

/** Optionen für `bbq()` */
export interface BbqOptions {
  /** Untergruppe: smoker | grill | dutch | burger | beilage */
  group: Exclude<BbqGroup, 'rub'>
  /** Gesamtzeit in Minuten inkl. Marinieren über Nacht und Ruhezeit */
  time: number
  /** Portionen der ganzen Ladung (Nährwerte je Portion = alle Zutaten ÷ portions) */
  portions: number
  /** davon am Grilltag gegessen (Standard 2 = Haushalt); der Rest ist `leftover` */
  eat?: number
  /** Rest, der vakuumiert eingefroren in den Vorrat kommt (nur große Stücke: Pulled Pork, Ribs, Brisket, Burnt Ends …) */
  leftover?: BbqLeftover
  /** Küche (Bildsuche/Info), Standard 'us' */
  cuisine?: Cuisine
  /** „💡 Leichter:“-Tipp (optional) */
  lighter?: string
}

/**
 * BBQ-Rezept: Zutaten für die GANZE Ladung (ein Pulled Pork, ein Rack Ribs, ein Burger-Abend). Kein Abendessen im
 * Wischstapel, frei „Einplanen für“ einen Tag (Backplan → Einkaufsliste, Kalender als Abendessen des Tages).
 * „Fertig gegrillt“ zieht die Zutaten ab und legt `leftover` (Anteil (portions − eat) ÷ portions der Ladung) in den Vorrat.
 *
 *   bbq('pulled-pork', 'Pulled Pork vom Traeger', { group: 'smoker', time: 840, portions: 8, leftover: { name: 'Pulled Pork (vakuumiert)', amount: 1500, unit: 'g', portion: 250, shelf: 90 } },
 *     '2500 g Schweinenacken mit Knochen | …', ['Schritt 1 …', 'Schritt 2 …', 'Schritt 3 …'])
 */
export function bbq(id: string, title: string, o: BbqOptions, ingredients: string, steps: string[]): RawRecipe {
  const eat = o.eat ?? 2
  const l = o.leftover
  return {
    id,
    title,
    cuisine: o.cuisine ?? 'us',
    type: 'haupt',
    time: o.time,
    ingredients: splitIngredients(ingredients),
    steps,
    servings: 1,
    portions: o.portions,
    basic: true,
    kind: 'bbq',
    bbq: o.group,
    lighter: o.lighter,
    ...(l
      ? {
          yields: {
            name: l.name,
            amount: l.amount,
            unit: l.unit,
            shelf: l.shelf,
            store: l.store ?? 'vakuumiert eingefroren',
            frozen: l.shelf,
            cat: 'tk' as const,
            ...(l.portion ? { portion: l.portion } : {}),
            share: Math.max(0, o.portions - eat) / o.portions,
          },
        }
      : {}),
  }
}

/** Wie ein Ergebnis im Vorrat liegt: Brotlaib (g) in Scheiben, sonst in der eigenen Einheit */
export function yieldStock(kind: BasicKind | undefined, y: { amount: number; unit: string }): { amount: number; unit: string } {
  if (kind === 'brot' && y.unit === 'g') return { amount: y.amount / SLICE_G, unit: 'Scheibe' }
  return { amount: y.amount, unit: y.unit }
}

/** Ein „Stück“ zum Essen in der Vorratseinheit: 1 Stk/Portion/Scheibe, bei g/ml 50 (≈ eine Scheibe bzw. ein Schluck) */
export function pieceSize(unit: string): number {
  return unit === 'g' || unit === 'ml' ? SLICE_G : 1
}

/** Produkt-Kurzform für die Extra-Dateien: Packung, Einheit, Preis €, Tage haltbar, angebrochen, Packungsname */
export function prod(pack: number, unit: string, price: number, shelf: number, opened?: number, packName?: string) {
  return opened == null && packName == null ? { pack, unit, price, shelf } : { pack, unit, price, shelf, opened, packName }
}
