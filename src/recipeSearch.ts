import type { Recipe } from './types'

/** klein, ohne Akzente (ä bleibt ä → „a“ + Trennzeichen entfernt) */
export function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Schreibvarianten angleichen (Tortila/Tortilla, Hänchen/Hähnchen, Brokkoli/Broccoli) */
function fold(w: string): string {
  return w
    .replace(/h/g, '')
    .replace(/ck/g, 'k')
    .replace(/c(?=[aou]|$)/g, 'k')
    .replace(/ph/g, 'f')
    .replace(/y/g, 'i')
    .replace(/ie/g, 'i')
    .replace(/(.)\1+/g, '$1')
}

function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3
  const d: number[] = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]
    d[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j]
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return d[b.length]
}

const toWords = (s: string) => norm(s).split(/[^a-z0-9ßäöü]+/).filter((w) => w.length >= 3).map(fold)
/** Titel und Zutatennamen wiederholen sich bei jedem Tastendruck → zerlegte Wörter merken */
const wordCache = new Map<string, string[]>()
const words = (s: string) => {
  let w = wordCache.get(s)
  if (!w) {
    w = toWords(s)
    if (wordCache.size < 20000) wordCache.set(s, w)
  }
  return w
}

/**
 * Abstand der Suchwörter zum Text: Summe der kleinsten Tippfehler-Abstände je Suchwort
 * (0 = steckt drin). Infinity, wenn ein Wort nicht (fast) vorkommt. Der erste Buchstabe muss stimmen –
 * vertippt wird selten am Wortanfang, und so passt „tortila“ nicht auf „Morcilla“.
 */
function fuzzyDist(queryWords: string[], text: string): number {
  const tw = words(text)
  let total = 0
  for (const q of queryWords) {
    const max = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0
    let best = Infinity
    for (const w of tw) {
      const d = w.includes(q) ? 0 : w[0] !== q[0] ? Infinity : Math.min(lev(q, w.slice(0, q.length)), lev(q, w))
      if (d < best) best = d
    }
    if (best > max) return Infinity
    total += best
  }
  return total
}

/**
 * Rezeptsuche: Treffer im Titel zuerst, dann Treffer in den Zutaten. Findet nichts exakt,
 * wird tippfehlertolerant gesucht (erst Titel, dann Zutaten bzw. ähnlich geschriebene Katalog-Zutaten).
 * Ergebnis: Rang je Rezept (kleiner = besser); nicht gefundene fehlen in der Map.
 */
export function searchRecipes(pool: Recipe[], query: string, similarIngredients: () => string[] = () => []): Map<string, number> {
  const nq = norm(query.trim())
  const out = new Map<string, number>()
  if (!nq) {
    pool.forEach((r) => out.set(r.id, 0))
    return out
  }
  for (const r of pool) {
    if (norm(r.title).includes(nq)) out.set(r.id, 0)
    else if (r.ingredients.some((i) => norm(i.name).includes(nq))) out.set(r.id, 1)
  }
  if (out.size || nq.length < 3) return out
  const qw = toWords(nq)
  if (!qw.length) return out
  const names = new Set(similarIngredients())
  for (const r of pool) {
    const dt = fuzzyDist(qw, r.title)
    if (dt < Infinity) {
      out.set(r.id, 2 + dt / 10)
      continue
    }
    const di = Math.min(...r.ingredients.map((i) => (names.has(i.name) ? 0 : fuzzyDist(qw, i.name))))
    if (di < Infinity) out.set(r.id, 3 + di / 10)
  }
  return out
}

/**
 * Treffer sortiert: bessere Textübereinstimmung zuerst; bei gleich guter Übereinstimmung entscheidet die
 * gelernte Vorliebe (`score`, größer = beliebter, siehe householdPreference in src/learning.ts), dann der Titel.
 */
export function sortedHits(pool: Recipe[], query: string, score: (r: Recipe) => number = () => 0, similarIngredients?: () => string[]): Recipe[] {
  const rank = searchRecipes(pool, query, similarIngredients)
  const s = new Map<string, number>()
  const sc = (r: Recipe) => {
    let v = s.get(r.id)
    if (v === undefined) s.set(r.id, (v = score(r)))
    return v
  }
  return pool
    .filter((r) => rank.has(r.id))
    .sort((a, b) => rank.get(a.id)! - rank.get(b.id)! || sc(b) - sc(a) || a.title.localeCompare(b.title, 'de'))
}

/**
 * Suche über alle Bereiche des Rezepte-Tabs (Abendessen, Frühstück, Backen, BBQ, Tapas, Salate, Grundrezepte):
 * Zahl der Treffer je Bereich. Findet irgendein Bereich den Begriff genau (Titel/Zutat), zählen anderswo nur genaue
 * Treffer – sonst würden Tippfehler-Treffer („ähnlich geschrieben“) als Hinweis auf andere Bereiche ablenken.
 * Leere Suche → keine Treffer. Ähnliche Zutaten (`similarIngredients`) werden nur einmal ermittelt.
 */
export function areaHits<K extends string>(areas: { key: K; pool: Recipe[] }[], query: string, similarIngredients?: () => string[]): { key: K; count: number }[] {
  if (!query.trim()) return []
  let similar: string[] | undefined
  const sim = () => (similar ??= similarIngredients?.() ?? [])
  const ranks = areas.map((a) => ({ key: a.key, rank: searchRecipes(a.pool, query, sim) }))
  const exact = ranks.some((a) => [...a.rank.values()].some((v) => v < 2))
  return ranks
    .map((a) => ({ key: a.key, count: [...a.rank.values()].filter((v) => !exact || v < 2).length }))
    .filter((a) => a.count > 0)
}
