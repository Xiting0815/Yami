export type Cuisine = 'de' | 'it' | 'as' | 'gr'
/** Festtags-Fenster: Martinsgans-Zeit (1.–15. Nov.) und Weihnachtszeit (15. Nov.–31. Dez.) */
export type Festive = 'martini' | 'weihnachten' | 'plaetzchen'
export type DishType = 'haupt' | 'pasta' | 'eintopf' | 'suppe' | 'auflauf' | 'brotzeit'

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

export const CUISINE_LABEL: Record<Cuisine, string> = { de: 'Deutsch', it: 'Italienisch', as: 'Asiatisch', gr: 'Griechisch' }
export const TYPE_LABEL: Record<DishType, string> = {
  haupt: 'Hauptgericht',
  pasta: 'Pasta',
  eintopf: 'Eintopf',
  suppe: 'Suppe',
  auflauf: 'Auflauf & Gratin',
  brotzeit: 'Brotzeit',
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

/**
 * Art eines Rezepts außerhalb der Abendessen: Grundrezept (Fond, Anstellgut …) oder „Backen & Desserts“.
 * Alle diese Rezepte haben `basic: true` – sie sind nie im Wischstapel, nie planbar und zählen nicht für Abwechslung,
 * Veggie-Quote oder Abendessen-Geschmack. „Fertig gekocht/gebacken“ legt `yields` in den Vorrat.
 */
export type BasicKind = 'grundrezept' | 'dessert' | 'kuchen' | 'brot' | 'gebaeck'

export const KIND_LABEL: Record<BasicKind, string> = { grundrezept: 'Grundrezepte', dessert: 'Desserts', kuchen: 'Kuchen', brot: 'Brot & Brötchen', gebaeck: 'Plätzchen & Cookies' }
export const KIND_ICON: Record<BasicKind, string> = { grundrezept: '🫙', dessert: '🍮', kuchen: '🍰', brot: '🍞', gebaeck: '🍪' }

/** Backen & Desserts (alles außer Grundrezept): Stücke davon zählen beim Essen in die Tagesbilanz */
export const isBake = (r: { kind?: BasicKind } | undefined): boolean => !!r?.kind && r.kind !== 'grundrezept'

/** Was ein Ansatz/Blech ergibt – kommt beim „Fertig gekocht/gebacken“ als Posten in den Vorrat */
export interface BasicYield {
  /** Zutat im Vorrat, z. B. „Rinderfond selbstgemacht“, „Bienenstich (selbstgebacken)“ (Katalog/Produkt/Nährwerte werden bei Backen automatisch ergänzt) */
  name: string
  /** Menge je Ansatz in `unit` */
  amount: number
  /** Fonds: Einheit des Produkts (ml); Backen: 'Stk' | 'Portion' | 'g' (Brotlaib → im Vorrat in Scheiben) | 'ml' */
  unit: string
  /** Tage haltbar (Fond: eingefroren; Backen: wie angegeben gelagert, siehe `store`) */
  shelf: number
  /** Nährwerte je Stück/Portion/Scheibe (wird aus dem Rezept berechnet, wenn nicht angegeben) */
  perPiece?: { kcal: number; protein: number }
  /** Lagerung, z. B. „im Kühlschrank“, „in Papier/Brotkasten“ */
  store?: string
  /** Tage haltbar eingefroren (nur Hinweis), z. B. 90 */
  frozen?: number
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
  /** Schritttexte (bei angepassten Rezepten: die Texte aus `deviceSteps`) */
  steps: string[]
  /** Schritte mit Geräte-Einstellungen (CombiSteamer, Combair, BORA, Airfryer); gleiche Länge wie `steps` */
  deviceSteps?: DeviceStep[]
  /** ursprüngliche Schritte (ohne Geräte), nur wenn `deviceSteps` gesetzt ist */
  classicSteps?: string[]
  vegetarian: boolean
  image?: string
  /** Festtagsgericht: kommt in diesen Zeitfenstern nach vorn, sonst weiter hinten */
  festive?: Festive[]
  /** selbst angelegtes Rezept (Id beginnt mit "my-") */
  custom?: boolean
  /**
   * Grundrezept (z. B. Brauner Rinderfond): nicht im Wischstapel, nicht planbar, zählt nicht für Abwechslung,
   * Veggie-Quote oder Geschmack. „Fertig gekocht“ zieht die Zutaten ab und legt `yields` in den Vorrat.
   */
  basic?: true
  yields?: BasicYield
  /** Grundrezept, Dessert, Kuchen oder Brot (nur bei `basic`) */
  kind?: BasicKind
  /** „💡 Leichter:“-Tipp (Backen & Desserts) */
  lighter?: string
}

/** Küchengeräte im Haushalt */
export type Device = 'steamer' | 'combair' | 'bora' | 'airfryer' | 'kneter' | 'pizzaofen'

/** Eine Geräte-Einstellung zu einem Rezeptschritt */
export interface DeviceSetting {
  device: Device
  /** Betriebsart bzw. Kochzone, deutsch wie im Gerät (z. B. „Dämpfen“, „Heißluft“, „Pfanne“) */
  mode: string
  /** °C */
  temp?: number
  /** BORA: „1“–„9“, „Power“, „Schmelzen“, „Warmhalten“, „Simmern“; Famag (Kneter): Geschwindigkeitsstufe „1“–„10“ */
  level?: string
  minutes?: number
  /** Sekunden (nur Pizzaofen: Backzeit 30–600 s) */
  seconds?: number
  /** Ausweichweg (z. B. Combair statt Pizzaofen bei Regen/Winter) – wird als „oder …“ gedämpft angezeigt */
  alt?: boolean
  /** Feuchte in % (nur wo das Gerät sie einstellen lässt) */
  humidity?: number
  /** Kerntemperatur °C (Fühler) */
  core?: number
  note?: string
}

/** Rezeptschritt mit Text und optionalen Geräte-Einstellungen */
export interface DeviceStep {
  text: string
  settings?: DeviceSetting[]
}

/** Selbst angelegtes Rezept – wird gespeichert und zur Laufzeit zu einem `Recipe` gebaut */
export interface CustomRecipe {
  id: string
  title: string
  meal: 'dinner' | 'breakfast'
  cuisine: Cuisine
  type: DishType
  time: number
  /** Basis-Portionen der Mengenangaben */
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  /** kleines Foto als Data-URL */
  image?: string
  /** nur Frühstück */
  breakfast?: NonNullable<Recipe['breakfast']>
  /** Anlegedatum (ISO) – zählt einmal als „genommen“ fürs Lernen */
  created: string
}

/** Selbst angelegte Zutat (nicht im Katalog) */
export interface CustomIngredient {
  name: string
  cat: ShopCat
  /** pro 100 g bzw. 100 ml */
  kcal: number
  protein: number
  /** Basiseinheit der Packung: g, ml, Stk, Bund … */
  unit: string
  /** Gewicht eines Stücks in g (nur bei Stk) */
  gramsPerPiece?: number
}

export interface PlanEntry {
  recipeId: string
  servings: number
  /** cooked = automatisch abgezogen (Tag ist vorbei), skipped = nicht gekocht */
  status?: 'cooked' | 'skipped'
  /** beim Kochen aus dem Vorrat entnommene Mengen (für "nicht gekocht") */
  consumed?: { id: string; name: string; amount: number; unit: string; expires: string }[]
}

/** Eingeplantes Backen an einem Tag: Rezept (Backen & Desserts, Grundrezept) × Rezeptmenge */
export interface BakeEntry {
  recipeId: string
  /** Rezeptmenge (1 = ein Blech/Laib/Ansatz) */
  amount: number
  /** baked = gebacken (Vorrat ist schon gebucht), skipped = nicht gebacken; fehlt = noch offen */
  status?: 'baked' | 'skipped'
}

/** Backplan: Tag (ISO) → eingeplante Backwaren (mehrere pro Tag möglich, ein Rezept höchstens einmal je Tag) */
export type BakePlan = Record<string, BakeEntry[] | undefined>

/** Schlüssel = ISO-Datum (YYYY-MM-DD) */
export type WeekPlan = Record<string, PlanEntry | undefined>
