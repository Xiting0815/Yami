import type { BasicKind, BasicYield, BbqGroup, BreakfastType, Cuisine, DishType, Festive, Ingredient, SalatGroup, ShopCat, TapasGroup, TapasServe } from '../types'

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
  /** BBQ-Sparte: Untergruppe (siehe `bbq()`; Rubs & Saucen: `backen('grundrezept', …, { bbq: 'rub' })`) */
  bbq?: BbqGroup
  /** BBQ: Portionen der ganzen Ladung */
  portions?: number
  /** BBQ: Anteil des Fleischfetts, der beim Smoken abtropft (0–0,4; siehe `BbqOptions.fatLoss`) */
  fatLoss?: number
  /**
   * Verzehrter Anteil einzelner Zutaten (0–1), z. B. Lake oder Marinade, die abgespült/abgegossen wird:
   * `{ 'Brauner Zucker': 0.1 }`. Zählt nur für die Nährwerte; Einkauf und Vorrat ziehen die volle Menge ab.
   */
  eaten?: Record<string, number>
  /** Tapas: Untergruppe (siehe `tapa()`; Tapas-Grundsaucen: `backen('grundrezept', …, { tapas: 'sauce' })`) */
  tapas?: TapasGroup
  /** Tapas: kalt, lauwarm oder heiß servieren (Ablaufplan im Kochmodus „Tapas-Abend“) */
  serve?: TapasServe
  /** Tapas: was sich vorher erledigen lässt (Ablaufplan „Vorher“) */
  ahead?: string
  /** Salate & Beilagen: Untergruppe (siehe `salat()`) */
  salat?: SalatGroup
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
/** Gewicht einer Vorrats-Scheibe dieses Brots (Toast: 25 g, sonst `SLICE_G`) */
export const sliceG = (y: { slice?: number } | undefined): number => (y?.slice && y.slice > 0 ? y.slice : SLICE_G)

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
  /** nur Brot (Ergebnis in g): Gewicht einer Vorrats-Scheibe, Standard `SLICE_G` (50 g); Toast 25 g wie eine gekaufte Toastscheibe */
  slice?: number
}

/** Optionen für `backen()` */
export interface BackOptions {
  /** Küche (nur Info/Bildsuche), Standard 'de' */
  cuisine?: Cuisine
  /** Gesamtzeit in Minuten inkl. Gehzeit (Sauerteig über Nacht: Arbeitszeit + Ruhezeit) */
  time: number
  yields: BackYield
  /** Festtags-Fenster (z. B. ['plaetzchen'] für Weihnachtsplätzchen: Backen-Liste sortiert sie in der Saison nach vorn) */
  festive?: Festive[]
  /** nur Rubs & Saucen für die BBQ-Sparte: `'rub'` (erscheint dann auch im BBQ-Bereich unter „Rubs & Saucen“) */
  bbq?: BbqGroup
  /** nur Tapas-Grundsaucen (Alioli, Salsa brava, Romesco, Mojo): `'sauce'` (erscheint dann im Tapas-Bereich unter „Saucen“) */
  tapas?: 'sauce'
}

/**
 * Backen & Desserts (oder ein Grundrezept wie Anstellgut). Mengen für 1 Rezept (1 Blech, 1 Form, 1 Laib, 1 Ansatz).
 * Kein Abendessen: nicht im Wischstapel, nicht planbar. „Fertig gebacken“ legt `yields` in den Vorrat.
 *
 *   backen('kuchen', 'bienenstich', 'Bienenstich', { time: 150, yields: { name: 'Bienenstich (selbstgebacken)', amount: 12, unit: 'Stk', shelf: 3, store: 'im Kühlschrank' } },
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
    ...(o.festive ? { festive: o.festive } : {}),
    ...(o.bbq ? { bbq: o.bbq } : {}),
    ...(o.tapas ? { tapas: o.tapas } : {}),
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
  /**
   * Anteil des Fleischfetts, der beim Smoken abtropft bzw. ausgelassen wird (0–0,4): senkt Fett und kcal je Portion
   * und in den Reste-Nährwerten (nur Zutaten aus „Fleisch & Fisch“). Richtwerte: Brisket/Pork Belly 0,35–0,4,
   * Nacken/Ribs 0,25–0,3, Hähnchen mit Haut 0,2–0,25, Hack/Speck-Gerichte 0,15–0,25, Fisch 0.
   */
  fatLoss?: number
  /** Verzehrter Anteil einzelner Zutaten (Lake, Marinade), siehe `RawRecipe.eaten` */
  eaten?: Record<string, number>
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
    ...(o.fatLoss ? { fatLoss: Math.min(0.4, Math.max(0, o.fatLoss)) } : {}),
    ...(o.eaten ? { eaten: o.eaten } : {}),
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

// ───────────── Tapas (src/data/extra/tapas/) ─────────────

/**
 * Tapas-Standard: Zutaten einer Tapa sind EIN Teller für 2 Personen, wenn der Abend aus so vielen Tapas besteht.
 * Bei weniger Tapas wird jede größer, bei mehr kleiner (Faktor = TAPAS_STD ÷ Anzahl, siehe `tapasFactor` in src/bakePlan.ts).
 */
export const TAPAS_STD = 5

/** Optionen für `tapa()` */
export interface TapaOptions {
  /** Untergruppe: fisch (Fisch & Meeresfrüchte) | fleisch (Fleisch & Wurst) | gemuese | ei (Ei & Kartoffel) | brot (Brot & Dips) */
  group: Exclude<TapasGroup, 'sauce'>
  /** Gesamtzeit in Minuten (ohne Ziehzeit über Nacht, die steht in `ahead`) */
  time: number
  /** wann sie auf den Tisch kommt: kalt (vorher fertig), lauwarm (Tortilla), heiß (Gambas – ganz zuletzt) */
  serve: TapasServe
  /** was sich vorher erledigen lässt, ein kurzer Satz (Ablaufplan „Vorher“), z. B. „Pulpo am Vortag kochen“ */
  ahead?: string
  /** Küche (Bildsuche/Info), Standard 'es' */
  cuisine?: Cuisine
}

/**
 * Tapa (spanische kleine Portion): Zutaten = ein Teller für 2 Personen als eine von ca. 5 Tapas eines Abends (TAPAS_STD).
 * Nie im Wischstapel und nie allein eingeplant: Im Rezepte-Tab „🫒 Tapas“ 4–6 auswählen → „Tapas-Abend“ auf einen Tag
 * (ersetzt das Abendessen). Nährwerte = je Person (Teller ÷ 2). Kein Ergebnis im Vorrat (Reste isst man am Abend).
 *
 *   tapa('gambas-al-ajillo', 'Gambas al ajillo', { group: 'fisch', time: 15, serve: 'heiss' },
 *     '200 g Garnelen roh TK | 4 Zehe Knoblauch | …', ['Schritt 1 …', 'Schritt 2 …', 'Schritt 3 …'])
 */
export function tapa(id: string, title: string, o: TapaOptions, ingredients: string, steps: string[]): RawRecipe {
  return {
    id,
    title,
    cuisine: o.cuisine ?? 'es',
    type: 'haupt',
    time: o.time,
    ingredients: splitIngredients(ingredients),
    steps,
    servings: 1,
    portions: 2,
    basic: true,
    kind: 'tapas',
    tapas: o.group,
    serve: o.serve,
    ...(o.ahead ? { ahead: o.ahead } : {}),
  }
}

// ───────────── Salate & Beilagen (src/data/extra/salate/) ─────────────

/** Optionen für `salat()` */
export interface SalatOptions {
  /** Untergruppe: nudel | kartoffel | reis | bohnen | gemuese */
  group: SalatGroup
  /** Küche (Info/Bildsuche): de, it, es, gr, us … – die Kategorie gilt für alle Küchen */
  cuisine: Cuisine
  /** Gesamtzeit in Minuten inkl. Durchziehen */
  time: number
  /** Beilagen-Portionen je Rezept (Grillabend/Gäste: meist 4–6) */
  portions: number
  /** Name im Vorrat, z. B. „Nudelsalat (selbstgemacht)“ – eindeutig; Katalog/Produkt/Nährwerte entstehen automatisch */
  name: string
  /** Tage haltbar im Kühlschrank (Mayo/Ei 2, Essig-Öl 3–4) */
  shelf: number
  /** Lagerung, Standard „im Kühlschrank (Dose mit Deckel)“ */
  store?: string
}

/**
 * Salat/Beilage für alle Küchen (Nudelsalat, Kartoffelsalat, Ensaladilla rusa …): Mengen für 1 Rezept = `portions` Portionen.
 * Nicht im Wischstapel; frei „Einplanen für“ einen Tag als ZUSATZ zum Abendessen (Grillabend, Gäste, Mitbringsel).
 * „Fertig“ zieht die Zutaten ab und legt alle Portionen in den Vorrat (Kühlschrank, `shelf` Tage) – dort „1 Portion gegessen“.
 *
 *   salat('nudelsalat-klassisch', 'Nudelsalat klassisch', { group: 'nudel', cuisine: 'de', time: 40, portions: 6,
 *     name: 'Nudelsalat (selbstgemacht)', shelf: 2 }, '250 g Fusilli | …', ['Schritt 1 …', '…', '…'])
 */
export function salat(id: string, title: string, o: SalatOptions, ingredients: string, steps: string[]): RawRecipe {
  return {
    id,
    title,
    cuisine: o.cuisine,
    type: 'haupt',
    time: o.time,
    ingredients: splitIngredients(ingredients),
    steps,
    servings: 1,
    portions: o.portions,
    basic: true,
    kind: 'salat',
    salat: o.group,
    yields: { name: o.name, amount: o.portions, unit: 'Portion', shelf: o.shelf, store: o.store ?? 'im Kühlschrank (Dose mit Deckel)', cat: 'molkerei' },
  }
}

/** Wie ein Ergebnis im Vorrat liegt: Brotlaib (g) in Scheiben, sonst in der eigenen Einheit */
export function yieldStock(kind: BasicKind | undefined, y: { amount: number; unit: string; slice?: number }): { amount: number; unit: string } {
  if (kind === 'brot' && y.unit === 'g') return { amount: y.amount / sliceG(y), unit: 'Scheibe' }
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
