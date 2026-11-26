export type Cuisine = 'de' | 'it' | 'as' | 'gr' | 'us' | 'es'
/** Festtags-Fenster: Martinsgans-Zeit (1.–15. Nov.) und Weihnachtszeit (15. Nov.–31. Dez.) */
export type Festive = 'martini' | 'weihnachten' | 'plaetzchen'
export type DishType = 'haupt' | 'pasta' | 'eintopf' | 'suppe' | 'auflauf' | 'brotzeit'

/** Zutaten-Kategorie im Katalog (src/data/catalog.ts, Rezepte, Lernen, check-data) */
export type ShopCat = 'gemuese' | 'konserven' | 'backwaren' | 'molkerei' | 'fleisch' | 'tk' | 'vorrat'
/** Einkaufslisten-Abschnitt = Kategorie + „Nudeln & Mehl“ (wird erst beim Bauen der Liste abgeleitet, siehe src/shopSection.ts) */
export type ShopSection = ShopCat | 'nudeln'

/**
 * Abschnitte in der Reihenfolge des Rundgangs im Laden (Kaufland): Obst & Gemüse → Konserven → Backwaren →
 * Nudeln & Mehl → Butter & Käse → Wurst & Fleisch → Tiefkühl; „Vorrat prüfen“ bleibt in Yami zuletzt.
 * Pro Haushalt überschreibbar: `AppState.shopOrder` (geteilt, siehe `shopOrderOf` in src/shopSection.ts).
 */
export const SHOP_ORDER: ShopSection[] = ['gemuese', 'konserven', 'backwaren', 'nudeln', 'molkerei', 'fleisch', 'tk', 'vorrat']

export const SHOP_LABEL: Record<ShopSection, string> = {
  gemuese: 'Obst & Gemüse',
  konserven: 'Konserven',
  backwaren: 'Backwaren',
  nudeln: 'Nudeln & Mehl',
  molkerei: 'Butter & Käse',
  fleisch: 'Wurst & Fleisch',
  tk: 'Tiefkühl',
  vorrat: 'Vorrat prüfen',
}

export const SHOP_ICON: Record<ShopSection, string> = {
  gemuese: '🥕',
  konserven: '🥫',
  backwaren: '🥖',
  nudeln: '🍝',
  molkerei: '🧀',
  fleisch: '🥩',
  tk: '❄️',
  vorrat: '🧂',
}

/** Kategorien, die eine neue Zutat haben darf (ohne den abgeleiteten Abschnitt „Nudeln & Mehl“) */
export const INGREDIENT_CATS = SHOP_ORDER.filter((c): c is ShopCat => c !== 'nudeln')

export const CUISINE_LABEL: Record<Cuisine, string> = { de: 'Deutsch', it: 'Italienisch', as: 'Asiatisch', gr: 'Griechisch', us: 'Amerikanisch', es: 'Spanisch' }
/** Symbol je Küche (Filter, Editor) */
export const CUISINE_ICON: Record<Cuisine, string> = { de: '🥨', it: '🇮🇹', as: '🥢', gr: '🇬🇷', us: '🇺🇸', es: '🇪🇸' }
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
 * Art eines Rezepts außerhalb der Abendessen: Grundrezept (Fond, Anstellgut …), „Backen & Desserts“, BBQ, Tapas oder
 * „Salate & Beilagen“. Alle diese Rezepte haben `basic: true` – sie sind nie im Wischstapel und zählen nicht für
 * Abwechslung, Veggie-Quote oder Abendessen-Geschmack. Eingeplant wird über den Backplan; „Fertig …“ legt `yields` in den Vorrat.
 */
export type BasicKind = 'grundrezept' | 'dessert' | 'kuchen' | 'brot' | 'gebaeck' | 'bbq' | 'tapas' | 'salat'

export const KIND_LABEL: Record<BasicKind, string> = {
  grundrezept: 'Grundrezepte', dessert: 'Desserts', kuchen: 'Kuchen', brot: 'Brot & Brötchen', gebaeck: 'Plätzchen & Cookies', bbq: 'BBQ & Grillen',
  tapas: 'Tapas', salat: 'Salate & Beilagen',
}
export const KIND_ICON: Record<BasicKind, string> = { grundrezept: '🫙', dessert: '🍮', kuchen: '🍰', brot: '🍞', gebaeck: '🍪', bbq: '🔥', tapas: '🫒', salat: '🥗' }

/**
 * Alles außer Grundrezepten (Backen & Desserts, BBQ, Tapas, Salate): wird über den Backplan eingeplant, „Fertig …“ zählt
 * fürs Lernen (gebacken/gegrillt/gemacht + „Wie war’s?“). Stücke von Gebackenem und Salat-Portionen zählen beim Essen in die
 * Tagesbilanz (BBQ-Reste nicht, siehe `isBbq`).
 */
export const isBake = (r: { kind?: BasicKind } | undefined): boolean => !!r?.kind && r.kind !== 'grundrezept'
/** BBQ-Sparte (Smoker, Grill, Dutch Oven, Burger, Beilagen): eigener Bereich, nie im Wischstapel, frei einplanbar */
export const isBbq = (r: { kind?: BasicKind } | undefined): boolean => r?.kind === 'bbq'
/** Tapas (kleine Portionen, nur zusammen als „Tapas-Abend“ geplant, siehe src/tapas.ts) */
export const isTapa = (r: { kind?: BasicKind } | undefined): boolean => r?.kind === 'tapas'
/** „Salate & Beilagen“ (Nudel-, Kartoffel-, Reissalat …): Zusatz zum Abendessen, Reste kommen in den Vorrat */
export const isSalat = (r: { kind?: BasicKind } | undefined): boolean => r?.kind === 'salat'
/** Backen & Desserts im engeren Sinn (ohne BBQ, Tapas, Salate) – Backen-Liste, Backvorschläge */
export const isBakery = (r: { kind?: BasicKind } | undefined): boolean =>
  r?.kind === 'dessert' || r?.kind === 'kuchen' || r?.kind === 'brot' || r?.kind === 'gebaeck'
/** Ergibt Portionen/Stücke für den Vorrat, von denen man „1 gegessen“ tippt (Backen & Desserts, Salate) */
export const isStockDish = (r: { kind?: BasicKind } | undefined): boolean => isBakery(r) || isSalat(r)
/** Ersetzt das Abendessen des Tages (Grillabend, Tapas-Abend): BBQ ohne die Beilagen und Tapas. Beilagen und Salate sind Zusatz. */
export const replacesDinner = (r: { kind?: BasicKind; bbq?: BbqGroup } | undefined): boolean => (isBbq(r) && r!.bbq !== 'beilage') || isTapa(r)
/** „Fertig …“ ist möglich: Ergebnis für den Vorrat oder ein Gericht, das nur Zutaten abzieht (BBQ, Tapas) */
export const finishable = (r: { basic?: true; yields?: unknown; kind?: BasicKind } | undefined): boolean => !!r?.basic && (!!r.yields || isBbq(r) || isTapa(r))

/** Untergruppe in der BBQ-Sparte (Chips im Rezepte-Tab, Lernen) – `rub` = Rubs & Saucen (Grundrezepte) */
export type BbqGroup = 'smoker' | 'grill' | 'dutch' | 'burger' | 'beilage' | 'rub'
export const BBQ_GROUP_LABEL: Record<BbqGroup, string> = { smoker: 'Smoker', grill: 'Grill', dutch: 'Dutch Oven', burger: 'Burger', beilage: 'Beilagen', rub: 'Rubs & Saucen' }
export const BBQ_GROUP_ICON: Record<BbqGroup, string> = { smoker: '💨', grill: '🔥', dutch: '🍲', burger: '🍔', beilage: '🥗', rub: '🫙' }

/**
 * Untergruppe der Tapas (Chips, Lernen, „Tapas-Abend-Ideen“: je eine aus Fisch, Fleisch, Gemüse, Ei/Kartoffel, Brot/Dip) –
 * `sauce` = Tapas-Grundsaucen (Alioli, Salsa brava, Romesco, Mojo …), das sind Grundrezepte.
 */
export type TapasGroup = 'fisch' | 'fleisch' | 'gemuese' | 'ei' | 'brot' | 'sauce'
export const TAPAS_GROUP_LABEL: Record<TapasGroup, string> = { fisch: 'Fisch & Meeresfrüchte', fleisch: 'Fleisch & Wurst', gemuese: 'Gemüse', ei: 'Ei & Kartoffel', brot: 'Brot & Dips', sauce: 'Saucen' }
export const TAPAS_GROUP_ICON: Record<TapasGroup, string> = { fisch: '🦐', fleisch: '🥓', gemuese: '🫑', ei: '🥚', brot: '🥖', sauce: '🫙' }
/** Wann eine Tapa auf den Tisch kommt – ordnet den gemeinsamen Ablaufplan im Kochmodus „Tapas-Abend“ */
export type TapasServe = 'kalt' | 'lauwarm' | 'heiss'

/** Untergruppe „Salate & Beilagen“ (Chips, Lernen) */
export type SalatGroup = 'nudel' | 'kartoffel' | 'reis' | 'bohnen' | 'gemuese'
export const SALAT_GROUP_LABEL: Record<SalatGroup, string> = { nudel: 'Nudelsalate', kartoffel: 'Kartoffelsalate', reis: 'Reis & Getreide', bohnen: 'Bohnen & Linsen', gemuese: 'Gemüse & Blatt' }
export const SALAT_GROUP_ICON: Record<SalatGroup, string> = { nudel: '🍝', kartoffel: '🥔', reis: '🍚', bohnen: '🫘', gemuese: '🥗' }

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
  /** Abschnitt im Katalog/Einkauf (Standard: Backwaren; BBQ-Reste vakuumiert eingefroren: 'tk', Rubs 'vorrat', Saucen 'konserven') */
  cat?: ShopCat
  /** Beutel-/Portionsgröße in `unit` (BBQ-Reste: „6 × 250 g vakuumiert“) */
  portion?: number
  /** Anteil der ganzen Ladung, der als Ergebnis in den Vorrat geht (BBQ: Rest nach dem Grillabend), Standard 1 */
  share?: number
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
  /** BBQ-Sparte: Untergruppe (auch bei Rubs & Saucen, die Grundrezepte sind) */
  bbq?: BbqGroup
  /** BBQ: Portionen der ganzen Ladung (`nutrition` gilt dann je Portion, `servings` = 1 Ladung); Tapas: 2 (Teller für 2); Salate: Portionen */
  portions?: number
  /** Tapas: Untergruppe (auch bei den Tapas-Grundsaucen `sauce`) */
  tapas?: TapasGroup
  /** Tapas: kalt, lauwarm oder heiß servieren (Ablaufplan Tapas-Abend) */
  serve?: TapasServe
  /** Tapas: was sich vorher erledigen lässt (Ablaufplan „Vorher“), z. B. „Marinade am Vortag ansetzen“ */
  ahead?: string
  /** Salate & Beilagen: Untergruppe */
  salat?: SalatGroup
}

/** Küchengeräte im Haushalt */
export type Device = 'steamer' | 'combair' | 'bora' | 'airfryer' | 'kneter' | 'pizzaofen' | 'smoker' | 'gasgrill' | 'dutch' | 'vakuum' | 'paella' | 'plancha'

/** Eine Geräte-Einstellung zu einem Rezeptschritt */
export interface DeviceSetting {
  device: Device
  /** Betriebsart bzw. Kochzone, deutsch wie im Gerät (z. B. „Dämpfen“, „Heißluft“, „Pfanne“) */
  mode: string
  /** °C */
  temp?: number
  /**
   * BORA: „1“–„9“, „Power“, „Schmelzen“, „Warmhalten“, „Simmern“; Famag (Kneter): Geschwindigkeitsstufe „1“–„10“;
   * Gasgrill und Dutch Oven (Gas): Flamme „niedrig“ | „mittel“ | „hoch“
   */
  level?: string
  minutes?: number
  /** Sekunden (nur Pizzaofen: Backzeit 30–600 s) */
  seconds?: number
  /** Ausweichweg (z. B. Combair statt Pizzaofen bei Regen/Winter) – wird als „oder …“ gedämpft angezeigt */
  alt?: boolean
  /** Feuchte in % (nur wo das Gerät sie einstellen lässt) */
  humidity?: number
  /** Kerntemperatur °C (Fühler/Thermometer) */
  core?: number
  /** Gasgrill (auch Paellapfanne 46 cm und Plancha auf dem Gasgrill): welche der 4 Brenner an sind, z. B. „alle“, „1+4“ (Brenner 1 = links) */
  burners?: string
  /** nur Paellapfanne: Größe „32“ (BORA mit Brücke, 2–3 Portionen) oder „46“ (Gasgrill, 6+ Portionen), siehe docs/geraete/paella-plancha.md */
  pan?: '32' | '46'
  /** Paellapfanne/Plancha: Hitzequelle (BORA-Kochfeld oder Gasgrill) */
  on?: 'bora' | 'gasgrill'
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
  /**
   * nur Frühstück: Posten-Id der vorbereiteten Portionen im Vorrat („Fertig vorbereitet“, siehe src/breakfastPrep.ts).
   * Dann sind die Zutaten schon beim Vorbereiten abgezogen – am Tag wird nur 1 Glas/Dose aus diesem Posten verbraucht.
   */
  prep?: string
  /**
   * nur Abendessen: angenommene Notlösung für dieses Gericht, Zutat → Ersatz (z. B. { Sahne: 'Schmand' }, siehe
   * src/kitchen/swap.ts). Bedarf, Einkauf, Abziehen und Kalender rechnen dann mit dem Ersatz.
   */
  swap?: Record<string, string>
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
