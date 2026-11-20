import { SHOP_ORDER, type ShopCat, type ShopSection } from './types'

/**
 * Einkaufsabschnitt „Nudeln & Mehl“: wird erst beim Bauen der Liste aus Name und Katalog-Kategorie abgeleitet –
 * die Zutaten-Kategorien (Katalog, Lernen, Vegetarisch, check-data) bleiben unverändert.
 * – Trockenpasta und -nudeln (frische Pasta wie Gnocchi, Spätzle, Tortellini, Maultaschen, Yakisoba-Nudeln liegt im Kühlregal → „Butter & Käse“)
 * – alle Mehle (…mehl, außer Paniermehl), Grieß, Polenta
 * – Reis (steht im Kaufland neben den Nudeln)
 * – Backzutaten (Zucker, Backpulver, Speisestärke, Paniermehl; liegen beim Mehl)
 * Haferflocken bleiben bei „Konserven“ (Müsli-/Frühstücksregal, nicht neben den Nudeln).
 */
const DRY_PASTA = new Set([
  'Nudeln', 'Spaghetti', 'Penne', 'Fusilli', 'Rigatoni', 'Linguine', 'Tagliatelle', 'Fettuccine', 'Bandnudeln',
  'Orecchiette', 'Trofie', 'Ziti', 'Bucatini', 'Ditalini', 'Cannelloni', 'Lasagneplatten', 'Kritharaki', 'Suppennudeln',
  'Reisbandnudeln', 'Mie-Nudeln', 'Ramen-Nudeln', 'Weizennudeln asiatisch',
])
const BAKING = new Set(['Zucker', 'Puderzucker', 'Brauner Zucker', 'Vanillezucker', 'Backpulver', 'Speisestärke', 'Paniermehl', 'Polenta', 'Reis'])
/** nur diese Katalog-Kategorien kommen für den Abschnitt in Frage (Gemüse, Fleisch, TK … nie) */
const FROM: ReadonlySet<ShopCat> = new Set<ShopCat>(['konserven', 'molkerei', 'vorrat'])

export function isNoodleOrFlour(name: string): boolean {
  return DRY_PASTA.has(name) || BAKING.has(name) || /(?<!Panier)mehl(?!\p{L})/u.test(name) || /grieß$/.test(name) || /reis$/.test(name)
}

/** Abschnitt einer Zutat auf der Einkaufsliste (Katalog-Kategorie + „Nudeln & Mehl“) */
export function shopSection(name: string, cat: ShopCat): ShopSection {
  return FROM.has(cat) && isNoodleOrFlour(name) ? 'nudeln' : cat
}

/**
 * Reihenfolge der Abschnitte: Standard (`SHOP_ORDER`) oder die Haushalts-Einstellung `AppState.shopOrder`.
 * Unbekannte Einträge fallen weg, fehlende kommen in Standardreihenfolge hinten dran; „Vorrat prüfen“ bleibt immer zuletzt.
 */
export function shopOrderOf(override?: readonly string[]): ShopSection[] {
  if (!override?.length) return [...SHOP_ORDER]
  const known = new Set<string>(SHOP_ORDER)
  const chosen = [...new Set(override)].filter((c): c is ShopSection => known.has(c) && c !== 'vorrat')
  return [...chosen, ...SHOP_ORDER.filter((c) => c !== 'vorrat' && !chosen.includes(c)), 'vorrat']
}

/** Sortierschlüssel für Einkaufslisten: Abschnitt (in Ladenreihenfolge), dann Name */
export function compareShop(order: readonly ShopSection[]) {
  const rank = (c: ShopSection) => order.indexOf(c)
  return (a: { cat: ShopSection; name: string }, b: { cat: ShopSection; name: string }) =>
    rank(a.cat) - rank(b.cat) || a.name.localeCompare(b.name, 'de')
}
