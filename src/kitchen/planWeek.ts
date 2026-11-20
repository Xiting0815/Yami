/** Küchenlogik – Wochenplanung: Einkaufsliste nach Packungsgrößen und was danach im Vorrat bleibt. */
import { CATALOG } from '../data/catalog'
import type { Product } from '../data/products'
import { RECIPE_BY_ID } from '../data/recipes'
import { substitutesFor } from '../data/substitutes'
import type { BakePlan, PlanEntry, Recipe, ShopCat, WeekPlan } from '../types'
import { bakeEntriesOf } from '../bakePlan'
import { type SpiceStatus, isSpice, type StapleMemos, STAPLE_SHOP_CAT, buyName, isQtyStaple, isTrackedStaple, runningLow, stapleKey, useEvents, useRate } from '../staples'
import { type PantryLot, type PriceOverrides, type BoughtMap, addDaysIso, canonical, productFor, isTracked, needsOf, stapleNeedsOf, allNeedsOf } from './base'
import { usableOn, lotsFor, consume } from './pantry'

export interface BuyItem {
  key: string
  name: string
  cat: ShopCat
  unit: string
  /** Bedarf der ganzen Woche */
  required: number
  /** davon aus dem Vorrat */
  fromPantry: number
  /** Teil davon aus austauschbaren Zutaten (z. B. Penne statt Spaghetti) */
  substitutes: { name: string; amount: number }[]
  packs: number
  product: Product
  cost: number
  /** nach der Woche übrig */
  leftover: number
  recipes: string[]
  /** in dieser Woche schon gekauft (abgehakt) – kann nach Portionsänderung kleiner sein als nötig */
  bought: number
  /** Grundzutaten: warum sie auf der Liste stehen (wird knapp / bald leer / Gewürz ist alle) */
  note?: 'knapp' | 'leer' | 'alle'
  /** Teil des Bedarfs für noch offene Tage VOR dieser Woche (ab Samstag: Sa/So der laufenden Woche) – ISO-Tage */
  forDays?: string[]
  /** nur Einkäufe (ListScope): Kochtage, für die diese Liste die Zutat kauft */
  days?: string[]
}

/**
 * Einkaufsliste für einen Einkauf statt für eine Woche (siehe trips.ts). `days` umfasst dann alle offenen Tage;
 * wem ein Bedarf gehört, entscheidet `owner`.
 */
export interface ListScope {
  /** Bedarf an `name` am Tag `day`: < 0 früherer Einkauf (wird zuerst aus dem Vorrat bedient), 0 diese Liste, > 0 späterer (zählt hier nicht) */
  owner: (day: string, name: string) => number
  /** „Vorrat prüfen“-Zeilen dieses Tages gehören zu dieser Liste */
  ownsDay: (day: string) => boolean
  /** Frühstück: an welchem Tag wird es vorbereitet (null = schon vorbereitet, zählt nicht mehr) */
  breakfastDay?: (day: string) => string | null
  /** eingeplante Einkäufe früherer Listen (Posten mit `from`) */
  extra?: PantryLot[]
  /** abgehakte Einkäufe anderer Listen: liegen schon im Vorrat, kommen aber als `extra` wieder dazu */
  subtract?: BoughtMap[]
  /** Grundzutaten „bald leer“ und Gewürze „alle“ stehen auf dieser Liste */
  extras: boolean
}

export interface StapleItem {
  key: string
  name: string
  amount: string
  recipes: string[]
}

/** Wissen über Grundzutaten für die Wochenplanung */
export interface StapleContext {
  /** zuletzt geführte Brühen-Form je Grundzutat (gelernt) und welche Zutaten du schon führst */
  memo?: StapleMemos
  /** Gewürze: da / alle */
  spices?: Record<string, SpiceStatus>
  /**
   * Liste der nächsten Woche ab Samstag: was für die restlichen Tage der laufenden Woche (ab heute) noch fehlt,
   * kommt mit auf die Liste (markiert mit `forDays`), statt beim Wochenwechsel zu verschwinden.
   */
  carry?: boolean
  /** gelernter Portionsfaktor des Haushalts (Abendessen): offene Gerichte brauchen Portionen × Faktor, Standard 1 */
  portion?: number
}

export interface WeekResult {
  /** zu kaufen (packs > 0) */
  buy: BuyItem[]
  /** komplett aus dem Vorrat gedeckt */
  covered: BuyItem[]
  staples: StapleItem[]
  total: number
  /** voraussichtlicher Vorrat nach allen noch offenen Gerichten der Woche (inklusive der Einkäufe) */
  leftovers: PantryLot[]
  /** echter Vorrat jetzt, abzüglich dessen, was schon geplante, noch offene Gerichte brauchen (ohne Einkäufe) */
  pantryLeft: PantryLot[]
}

function activeEntries(plan: WeekPlan, days: string[]) {
  return days
    .map((d) => [d, plan[d]] as const)
    .filter((x): x is readonly [string, PlanEntry] => !!x[1] && x[1].status !== 'skipped' && !!RECIPE_BY_ID[x[1].recipeId])
}

export function planWeek(
  planIn: WeekPlan,
  days: string[],
  pantry: PantryLot[],
  bought: BoughtMap,
  today: string,
  overrides: PriceOverrides,
  formatStaple: (amount: number | null, unit: string) => string,
  /** Frühstücke der Woche (fließen in Einkauf & Vorrat mit ein) */
  breakfast: WeekPlan = {},
  /** Monat (1–12) für Saisonpreise; ohne Angabe keine Anpassung */
  month?: number,
  /** Grundzutaten: gemerkte Formen und Gewürz-Status */
  staple: StapleContext = {},
  /** eingeplantes Backen (noch offen): Zutaten zählen wie bei Abendessen für Einkauf, Vorrat und Kosten */
  bakePlan: BakePlan = {},
  /** Einkauf statt Woche (siehe ListScope) */
  scope?: ListScope,
): WeekResult {
  const memo = staple.memo ?? {}
  // gelernte Haushalts-Portion: noch offene Abendessen brauchen mehr/weniger (schon gekochte sind über „entnommen“ erfasst)
  const pf = staple.portion ?? 1
  const plan: WeekPlan = pf === 1 ? planIn : Object.fromEntries(Object.entries(planIn).map(([d, e]) => [d, e && !e.status ? { ...e, servings: e.servings * pf } : e]))
  const allBought = [bought, ...(scope?.subtract ?? [])]
  const own = (key: string) => isTrackedStaple(key, pantry, memo) || allBought.some((m) => Object.keys(m).some((n) => stapleKey(n) === key))
  // Mengen-Grundzutaten zählen erst, wenn du sie führst (Vorrat oder gemerkt) – oder etwas, das sie ersetzt
  // (Olivenöl für Sonnenblumenöl, Gemüsebrühe für Hühnerbrühe) – sonst bleiben sie bei „Vorrat prüfen“
  const trackedKey = (key: string) => own(key) || substitutesFor(key).some((n) => own(stapleKey(n)))
  /** gekauft wird die Grundzutat, die du führst (bei Brühe die gemerkte Form); führst du nur einen Ersatz, dieser */
  const stapleBuyName = (name: string) => {
    const key = stapleKey(name)
    if (own(key)) return buyName(key, memo)
    const sub = substitutesFor(key).find((n) => own(stapleKey(n)))
    return sub ? buyName(stapleKey(sub), memo) : buyName(key, memo)
  }
  const needsFor = (r: Recipe, servings: number) => [
    ...needsOf(r, servings),
    ...stapleNeedsOf(r, servings).filter((n) => trackedKey(stapleKey(n.name))),
  ]
  const bakes = bakeEntriesOf(bakePlan, today)
  const bfDay = scope?.breakfastDay
  const bfEntries = activeEntries(breakfast, days).flatMap(([d, e]) => {
    const p = bfDay ? bfDay(d) : d
    return p ? [[p, e] as const] : []
  })
  const entries = [...activeEntries(plan, days), ...bfEntries, ...bakes.filter(([d]) => days.includes(d))].sort((a, b) => a[0].localeCompare(b[0]))
  /** wem gehört der Bedarf (ohne scope: alles dieser Liste) */
  const ownerOf = (day: string, name: string) => (scope ? Math.sign(scope.owner(day, name)) : 0)

  // Bedarf der Woche
  const req = new Map<string, { amount: number; recipes: Set<string>; forDays: Set<string> }>()
  const reqOf = (name: string) => {
    const cur = req.get(name) ?? { amount: 0, recipes: new Set<string>(), forDays: new Set<string>() }
    req.set(name, cur)
    return cur
  }
  const staples = new Map<string, { parts: Map<string, number>; recipes: Set<string> }>()
  const reqDays = new Map<string, Set<string>>()
  for (const [day, e] of entries) {
    const r = RECIPE_BY_ID[e.recipeId]
    for (const n of needsFor(r, e.servings)) {
      if (ownerOf(day, n.name) !== 0) continue
      const cur = reqOf(n.name)
      cur.amount += n.amount
      cur.recipes.add(r.title)
      if (scope) {
        const ds = reqDays.get(n.name) ?? new Set<string>()
        ds.add(day)
        reqDays.set(n.name, ds)
      }
    }
    if (scope && !scope.ownsDay(day)) continue
    for (const ing of r.ingredients) {
      const name = canonical(ing.name)
      if (isTracked(name)) continue
      // geführte Mengen-Grundzutaten stehen oben im Bedarf, Gewürze mit Status über „da“/„alle“
      if (isQtyStaple(name) && trackedKey(stapleKey(name))) continue
      if (isSpice(name) && staple.spices?.[name]) continue
      const s = staples.get(name) ?? { parts: new Map(), recipes: new Set<string>() }
      s.recipes.add(r.title)
      if (ing.amount != null) {
        const v = (ing.amount * e.servings) / r.servings
        s.parts.set(ing.unit, (s.parts.get(ing.unit) ?? 0) + v)
      }
      staples.set(name, s)
    }
  }

  // Vorrat vor dem Einkauf rekonstruieren – postenweise (Ablaufdaten zählen): jetzt + diese Woche schon Verbrauchtes − Gekauftes
  const pool: PantryLot[] = pantry.map((l) => ({ ...l }))
  for (const [, e] of entries)
    for (const c of e.consumed ?? []) {
      const same = pool.find((l) => l.id === c.id)
      if (same) {
        same.amount += c.amount
        if (c.expires > same.expires) same.expires = c.expires
      } else pool.push({ ...c })
    }
  for (const [name, b] of allBought.flatMap((m) => Object.entries(m))) {
    let rest = b.amount
    for (const l of [...pool.filter((x) => x.id === b.lotId), ...pool.filter((x) => x.id !== b.lotId && x.name === name)]) {
      const t = Math.min(l.amount, rest)
      l.amount -= t
      rest -= t
    }
  }
  // eingeplante Einkäufe früherer Listen (erst ab ihrem Einkaufstag da)
  for (const l of scope?.extra ?? []) pool.push({ ...l })
  /** Menge aus dem Pool nehmen (nur Posten, die am Tag noch gut sind): erst die Zutat selbst, dann austauschbare */
  const take = (name: string, amount: number, day: string, exactOnly: boolean) => {
    const got: { name: string; amount: number }[] = []
    let rest = amount
    const lots = lotsFor(pool, name, day, exactOnly).filter((l) => exactOnly || l.name !== name)
    for (const l of lots) {
      if (rest <= 1e-9) break
      const t = Math.min(l.amount, rest)
      l.amount -= t
      rest -= t
      const g = got.find((x) => x.name === l.name)
      if (g) g.amount += t
      else got.push({ name: l.name, amount: t })
    }
    return got
  }
  const sum = (xs: { amount: number }[]) => xs.reduce((s, x) => s + x.amount, 0)
  const useDay = (day: string, e: PlanEntry) => (e.status === 'cooked' || day >= today ? day : today)

  // Noch offene Gerichte VOR dieser Woche (z. B. Sa/So, wenn schon die nächste Woche geplant wird)
  // brauchen ihre Zutaten noch – die dürfen für diese Woche nicht als vorhanden zählen.
  const earlier: [string, PlanEntry][] = [plan, breakfast]
    .flatMap((p) => Object.entries(p))
    .filter((x): x is [string, PlanEntry] => !!x[1] && x[0] < days[0] && !x[1].status && !!RECIPE_BY_ID[x[1].recipeId])
  earlier.push(...bakes.filter(([d]) => d < days[0]))
  earlier.sort((a, b) => a[0].localeCompare(b[0]))
  for (const [day, e] of earlier) {
    const r = RECIPE_BY_ID[e.recipeId]
    for (const n of needsFor(r, e.servings)) {
      const d = useDay(day, e)
      const got = sum(take(n.name, n.amount, d, true))
      const rest = n.amount - got - (n.amount - got > 1e-6 ? sum(take(n.name, n.amount - got, d, false)) : 0)
      // ab Samstag: was für Sa/So noch fehlt, kommt mit auf die Liste der nächsten Woche
      if (staple.carry && day >= today && rest > 1e-6) {
        const cur = reqOf(n.name)
        cur.amount += rest
        cur.recipes.add(r.title)
        cur.forDays.add(day)
      }
    }
  }

  // diese Woche: 1. Durchgang Zutat selbst (Tag für Tag) – 2. Durchgang austauschbare Posten für den Rest
  const availExact = new Map<string, number>()
  for (const name of req.keys()) availExact.set(name, sum(lotsFor(pool, name, today, true)))
  const allNeeds = entries.flatMap(([day, e]) => needsFor(RECIPE_BY_ID[e.recipeId], e.servings).map((n) => ({ ...n, day: useDay(day, e), owner: ownerOf(day, n.name), exact: 0 })))
  // Bedarf früherer Einkäufe (gleiche Tage): bedient sich zuerst – Zutat selbst, dann austauschbare
  for (const n of allNeeds.filter((x) => x.owner < 0)) {
    const got = sum(take(n.name, n.amount, n.day, true))
    if (n.amount - got > 1e-6) take(n.name, n.amount - got, n.day, false)
  }
  const weekNeeds = allNeeds.filter((x) => x.owner === 0)
  for (const n of weekNeeds) n.exact = sum(take(n.name, n.amount, n.day, true))
  const have = new Map<string, { exact: number; subs: { name: string; amount: number }[] }>()
  for (const name of req.keys()) have.set(name, { exact: 0, subs: [] })
  for (const n of weekNeeds) {
    const h = have.get(n.name)!
    h.exact += n.exact
    if (n.amount - n.exact <= 1e-6) continue
    for (const g of take(n.name, n.amount - n.exact, n.day, false)) {
      const cur = h.subs.find((x) => x.name === g.name)
      if (cur) cur.amount += g.amount
      else h.subs.push({ ...g })
    }
  }

  const buy: BuyItem[] = []
  const covered: BuyItem[] = []
  let total = 0
  for (const [name, { amount: required, recipes, forDays }] of req) {
    // Grundzutaten: gekauft wird die Form, die du führst (Brühe: zuletzt gehabte Form, sonst Pulver)
    const itemName = isQtyStaple(name) ? stapleBuyName(name) : name
    const product = productFor(itemName, overrides, month)!
    const h = have.get(name)!
    const subAmount = h.subs.reduce((s, x) => s + x.amount, 0)
    const fromPantry = h.exact + subAmount
    const missing = Math.max(0, required - fromPantry)
    const packs = missing > 1e-6 ? Math.ceil(missing / product.pack - 1e-6) : 0
    const item: BuyItem = {
      key: itemName,
      name: itemName,
      cat: isQtyStaple(name) ? STAPLE_SHOP_CAT : (CATALOG[name] ?? 'konserven'),
      unit: product.unit,
      required,
      fromPantry,
      substitutes: h.subs,
      packs,
      product,
      cost: packs * product.price,
      leftover: (availExact.get(name) ?? 0) + subAmount + packs * product.pack - required,
      bought: bought[itemName]?.amount ?? 0,
      recipes: [...recipes],
    }
    if (forDays.size) item.forDays = [...forDays].sort()
    if (reqDays.has(name)) item.days = [...reqDays.get(name)!].sort()
    if (packs > 0 && isQtyStaple(name)) item.note = 'knapp'
    // Brühe: der Bedarf heißt „Gemüsebrühe“, die Packung „Gemüsebrühe Würfel“ – fürs „schon im Vorrat“ bleibt der Rezeptname
    if (packs === 0 && itemName !== name) {
      item.key = name
      item.name = name
    }
    // zwei Bedarfe, dieselbe Packung (Sonnenblumenöl + Olivenöl → Olivenöl): zusammenfassen
    const twin = packs > 0 ? buy.find((b) => b.key === item.key) : undefined
    if (twin) {
      total -= twin.cost
      twin.required += item.required
      twin.fromPantry += item.fromPantry
      twin.substitutes = [...twin.substitutes, ...item.substitutes]
      const miss = Math.max(0, twin.required - twin.fromPantry)
      twin.packs = Math.ceil(miss / product.pack - 1e-6)
      twin.cost = twin.packs * product.price
      twin.leftover = twin.fromPantry + twin.packs * product.pack - twin.required
      twin.recipes = [...new Set([...twin.recipes, ...item.recipes])]
      if (item.forDays) twin.forDays = [...new Set([...(twin.forDays ?? []), ...item.forDays])].sort()
      if (item.days) twin.days = [...new Set([...(twin.days ?? []), ...item.days])].sort()
      total += twin.cost
      continue
    }
    total += item.cost
    ;(packs > 0 ? buy : covered).push(item)
  }

  // Lernen: Grundzutaten, die bald leer sind (aus dem Verbrauch der letzten Wochen) oder fast leer, kommen auf die Liste
  const events = useEvents(plan, breakfast)
  const keys = new Set<string>([...Object.keys(memo), ...pantry.filter((l) => isQtyStaple(l.name)).map((l) => stapleKey(l.name))])
  for (const key of scope && !scope.extras ? [] : keys) {
    if (!trackedKey(key) || buy.some((b) => stapleKey(b.name) === key && isQtyStaple(b.name))) continue
    const name = buyName(key, memo)
    const product = productFor(name, overrides, month)
    if (!product) continue
    const inCovered = covered.find((c) => c.key === key)
    const group = (n: string) => stapleKey(n) === key
    // nach dem Wochenplan: was dann noch da ist (alle Formen zusammen, z. B. Brühwürfel für „Gemüsebrühe“;
    // nicht abgedeckter Bedarf kam schon oben auf die Liste). `inCovered.leftover` zählt nur die Rezeptform selbst.
    const after = Math.max(0, pool.filter((l) => group(l.name) && usableOn(l, today)).reduce((s, l) => s + l.amount, 0))
    if (!runningLow(after, product.pack, useRate(events, key, today))) continue
    const item: BuyItem = {
      key: name, name, cat: STAPLE_SHOP_CAT, unit: product.unit, required: inCovered?.required ?? 0, fromPantry: 0, substitutes: [], packs: 1, product,
      cost: product.price, leftover: after + product.pack, bought: bought[name]?.amount ?? 0, recipes: inCovered?.recipes ?? [], note: 'leer',
    }
    if (inCovered) covered.splice(covered.indexOf(inCovered), 1)
    total += item.cost
    buy.push(item)
  }

  // Vorrat simulieren: aktueller Vorrat + noch nicht Gekauftes − offene Gerichte (ohne Einkäufe: was wirklich frei ist)
  const lots = pantry.map((l) => ({ ...l }))
  const free = pantry.map((l) => ({ ...l }))
  for (const b of buy) {
    if (bought[b.name]) continue
    lots.push({ id: 'v-' + b.name, name: b.name, amount: b.packs * b.product.pack, unit: b.unit, expires: addDaysIso(today, b.product.shelf) })
  }
  // erst die noch offenen Gerichte vor dieser Woche, dann die dieser Woche
  for (const [day, e] of [...earlier, ...entries]) {
    if (e.status === 'cooked') continue
    for (const n of allNeedsOf(RECIPE_BY_ID[e.recipeId], e.servings)) {
      consume(lots, n.name, n.amount, day < today ? today : day)
      consume(free, n.name, n.amount, day < today ? today : day)
    }
  }

  // Gewürze, die „alle“ sind: stehen als echter Artikel auf der Liste (abgehakt → wieder „da“)
  for (const [name, st] of scope && !scope.extras ? [] : Object.entries(staple.spices ?? {})) {
    const hit = bought[name] != null
    const product = productFor(name, overrides)
    if ((st !== 'alle' && !hit) || !product) continue
    const used = entries.map(([, e]) => RECIPE_BY_ID[e.recipeId]).filter((r) => r.ingredients.some((i) => canonical(i.name) === name))
    const item: BuyItem = {
      key: name, name, cat: STAPLE_SHOP_CAT, unit: product.unit, required: 0, fromPantry: 0, substitutes: [], packs: 1, product,
      cost: product.price, leftover: 0, bought: bought[name]?.amount ?? 0, recipes: [...new Set(used.map((r) => r.title))], note: 'alle',
    }
    total += item.cost
    buy.push(item)
  }

  const stapleItems: StapleItem[] = [...staples].map(([name, s]) => ({
    key: name,
    name,
    amount: [...s.parts].map(([u, v]) => formatStaple(v, u)).join(' + '),
    recipes: [...s.recipes],
  }))

  return { buy, covered, staples: stapleItems, total, leftovers: lots, pantryLeft: free }
}

// ───────────── Empfehlungen ─────────────
