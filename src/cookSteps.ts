// Kochmodus: welche Zutaten gehören zu welchem Schritt?
// Eine Zutat gehört zu dem Schritt, der sie zuerst im Text nennt. Erkannt wird über Wortstämme
// (Zwiebel/Zwiebeln, Ei/Eier, Kartoffel/Kartoffeln …), Zusammensetzungen (Kartoffelpuffer, Hackbällchen …)
// und Oberbegriffe, die Rezepte oft verwenden (Öl, Brühe, Käse, Fleisch …).
import type { Ingredient, Recipe } from './types'

/** Kleinschreibung, Umlaute und ß auflösen – Vergleich ohne Sonderzeichen */
const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/[äà]/g, 'a')
    .replace(/[öò]/g, 'o')
    .replace(/[üù]/g, 'u')
    .replace(/[éè]/g, 'e')

const words = (s: string) => fold(s).split(/[^a-z0-9]+/).filter(Boolean)

/** Zusätze, die keine eigene Zutat benennen */
const QUALIFIERS = new Set(
  words(`frisch tk tiefgekühlt gerieben getrocknet getrocknete festkochend mehligkochend
    rot rote gelb gelbe grün grüne braun braune natur vom vortag gemischt groß klein dick dünn dünne süß
    sauerlich scharf rosenscharf edelsüß grob grobkörnig mittelscharf weiß weiße schwarz hell dunkel
    gemahlen geröstet gekocht hart reif roh küchenfertig eingelegt geschält geschälte gehackte gehackt
    passierte geschnitten scheiben ganz ganze unbehandelt original asiatisch japanisch seiden halb und oder
    mit ohne in ol am für nach bei zum zur stück reggiano dolce geräuchert ca`),
)

/** Ergänzende Begriffe, die im Text anders heißen (wirken wie der Name selbst) */
const ALIAS: Record<string, string[]> = {
  parmigiano: ['parmesan'],
  parmesan: ['parmigiano'],
  hackfleisch: ['hack'],
  rinderhackfleisch: ['hack'],
  schweinehackfleisch: ['hack'],
  lorbeerblatt: ['lorbeer'],
}

/** Oberbegriffe, die in Schritten allein stehen („Käse“, „Brühe“) */
const GENERIC_TOKEN: Record<string, string[]> = {
  gouda: ['kase'],
  emmentaler: ['kase'],
  gruyere: ['kase'],
  gorgonzola: ['kase'],
  feta: ['kase'],
  mozzarella: ['kase'],
  pecorino: ['kase'],
  provolone: ['kase'],
  ricotta: ['kase'],
  speckwurfel: ['speck'],
}

/** Zutat endet auf ein Oberbegriff: Sonnenblumenöl → Öl, Rotwein → Wein, Bergkäse → Käse */
const GENERIC_END = ['ol', 'bruhe', 'fond', 'wein', 'mehl', 'starke', 'reis', 'essig', 'brot', 'schinken', 'speck', 'sellerie', 'kohl', 'gurke', 'spinat', 'mais', 'nudeln', 'tomaten', 'paprika', 'kase', 'bohnen']

/** Fleischsorten: mit Zusammensetzung zusätzlich „Fleisch“ */
const MEAT_PREFIX = ['schwein', 'rind', 'kalb', 'hahn', 'huhn', 'lamm', 'pute', 'hack', 'wild', 'ente']

/** Endungen, die Plural/Beugung markieren (Kartoffel+n, Ei+er, Tomate+n …) */
const INFL = ['', 'e', 'en', 'n', 's', 'se', 'er', 'ern', 'em', 'es', 'ns']

/** Zusammengesetzte Zutat → Grundwort (Lachsfilet → Lachs, Hähnchenbrustfilet → Hähnchen, Walnusskerne → Walnuss) */
const DERIVE = ['wurstchen', 'schnitzel', 'kotelett', 'schenkel', 'flugel', 'filet', 'brust', 'bauch', 'nacken', 'hufte', 'braten', 'roulade', 'haxe', 'keule', 'gulasch', 'fleisch', 'wurst', 'kerne', 'blatt']

/** Wortenden, bei denen eine Zusammensetzung NICHT die Grundzutat meint (Tomatenmark ≠ Tomate) */
const DENY_END = ['mark', 'sosse', 'sauce', 'ketchup', 'paste', 'pulver', 'essig', 'mus', 'fond', 'sirup', 'ol']

/** Gewürze ohne Menge (nach Geschmack) → erscheinen nur, wenn ein Schritt sie nennt, nie in „Alles bereitstellen“ */
const STAPLES = new Set(words('salz pfeffer zucker muskatnuss chiliflocken kümmel majoran paprikapulver senf'))

interface Term {
  base: string
  /** Name der Zutat selbst (stark) – nicht nur abgeleitetes Oberwort */
  primary: boolean
}

function tokens(name: string): string[] {
  // „Thunfisch in Olivenöl“ ist Thunfisch – das Öl ist nur die Verpackung
  return words(fold(name).replace(/\bin (olivenol|ol)\b/g, ' ')).filter((t) => !QUALIFIERS.has(t) && !/\d/.test(t))
}

/** Stamm ohne Pluralendung: Kartoffeln → Kartoffel, Zwiebeln → Zwiebel */
function bases(t: string): string[] {
  const out = [t]
  for (const s of ['en', 'n', 'e', 'er', 's']) {
    if (t.endsWith(s) && t.length - s.length >= 3) {
      out.push(t.slice(0, -s.length))
      break
    }
  }
  return out
}

const termCache = new Map<string, Term[]>()
function termsOf(name: string): Term[] {
  const hit = termCache.get(name)
  if (hit) return hit
  const terms: Term[] = []
  const add = (word: string, primary: boolean) => bases(word).forEach((base) => terms.push({ base, primary }))
  for (const t of tokens(name)) {
    add(t, true)
    ALIAS[t]?.forEach((a) => add(a, true))
    GENERIC_TOKEN[t]?.forEach((g) => add(g, false))
    for (const g of GENERIC_END) if (t !== g && t.endsWith(g) && t.length - g.length >= 3) add(g, false)
    // Zusammensetzungen aufspalten, bis kein Bestandteil mehr abfällt
    let cur = t
    let split = false
    for (let k = 0; k < 3; k++) {
      const d = DERIVE.find((s) => cur.endsWith(s) && cur.length - s.length >= 4)
      if (!d) break
      cur = cur.slice(0, -d.length)
      split = true
      add(cur, false)
    }
    if (split && MEAT_PREFIX.some((m) => t.startsWith(m))) add('fleisch', false)
  }
  termCache.set(name, terms)
  return terms
}

/** Wert, wie gut ein Wort des Schritts zu einem Begriff der Zutat passt (0 = gar nicht) */
function score(word: string, { base, primary }: Term): number {
  if (!word.startsWith(base)) return 0
  const rest = word.slice(base.length)
  if (INFL.includes(rest)) return (primary ? 100 : 30) + base.length
  if (base.length >= 4 && rest.length >= 3 && !DENY_END.some((d) => rest.endsWith(d))) return (primary ? 50 : 10) + base.length
  return 0
}

const wordScore = (word: string, name: string) => Math.max(0, ...termsOf(name).map((t) => score(word, t)))

interface Plan {
  perStep: Ingredient[][]
  unmatched: Ingredient[]
}

const planCache = new WeakMap<Recipe, Plan>()

function plan(recipe: Recipe): Plan {
  const hit = planCache.get(recipe)
  if (hit) return hit
  const claimed = new Set<number>()
  const perStep = recipe.steps.map((step) => {
    // pro Wort nur die Zutat(en) mit dem besten Treffer – „Tomatenmark“ zählt nicht als „Tomaten“
    const hits = new Set<number>()
    for (const w of words(step)) {
      let best = 0
      let winners: number[] = []
      recipe.ingredients.forEach((ing, i) => {
        const s = wordScore(w, ing.name)
        if (s <= 0) return
        if (s > best) {
          best = s
          winners = [i]
        } else if (s === best) winners.push(i)
      })
      winners.forEach((i) => hits.add(i))
    }
    const ids = [...hits].filter((i) => !claimed.has(i)).sort((a, b) => a - b)
    ids.forEach((i) => claimed.add(i))
    return ids.map((i) => recipe.ingredients[i])
  })
  const unmatched = recipe.ingredients.filter((ing, i) => !claimed.has(i) && !isStaple(ing))
  const p = { perStep, unmatched }
  planCache.set(recipe, p)
  return p
}

/** Gewürz ohne Menge – erscheint nur, wenn ein Schritt es nennt */
export function isStaple(ing: Ingredient): boolean {
  return ing.amount == null && STAPLES.has(tokens(ing.name)[0] ?? '')
}

/** Zutaten, die im Schritt `stepIndex` zum ersten Mal genannt werden */
export function ingredientsForStep(recipe: Recipe, stepIndex: number): Ingredient[] {
  return plan(recipe).perStep[stepIndex] ?? []
}

/** Zutaten, die in keinem Schritt vorkommen (ohne Gewürze nach Geschmack) */
export function unmatched(recipe: Recipe): Ingredient[] {
  return plan(recipe).unmatched
}
