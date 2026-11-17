// Zeitablauf mit echtem Vorrat: Mo 16.11.2026 bis in die nächste Woche:  npx vite-node scripts/test-scenario.ts
// Nutzt dieselben reinen Funktionen wie App.tsx (Tageswechsel, „Was koche ich damit?“, Einkauf, Abziehen, Rückgängig, Rückblick).
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { PRODUCTS } from '../src/data/products'
import {
  addDaysIso, cookDue, discardWaste, insight, lastSeenMap, moveExpired, pantryAmount, planWeek, uncook,
  type PantryLot, type WeekResult,
} from '../src/kitchen'
import { assignBreakfasts, prepPlan, resolvePrepDay, workdays } from '../src/breakfast'
import { dayBalance } from '../src/energy'
import { buildModel, pendingRating, preference } from '../src/learning'
import { weekReview, defaultReviewMonday } from '../src/review'
import { diffTodo, localItems } from '../src/haSync'
import { formatAmount } from '../src/shopping'
import { rememberStaples } from '../src/staples'
import { sanitize, weekDays, parseIso, mondayOf, isoDate, addDays, type AppState } from '../src/store'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (cond: boolean, msg: string) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++ }
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps
const amt = (s: AppState, name: string) => pantryAmount(s.pantry, name)

// ───── Ausgangslage: Mo 16.11.2026, echter Vorrat ─────
const MON = '2026-11-16'
const LONG = '2027-09-01'
let n = 0
const lot = (name: string, amount: number, expires: string): PantryLot => ({ id: 'p' + n++, name, amount, unit: PRODUCTS[name].unit, expires })
const pantry0: PantryLot[] = [
  lot('Hähnchenbrustfilet', 400, '2026-11-18'),
  lot('Champignons', 400, '2026-11-20'),
  lot('Ei', 10, '2026-12-07'),
  lot('Schmand', 400, '2026-12-07'),
  lot('Sahne', 200, '2026-12-07'),
  lot('Saure Sahne', 200, '2026-12-07'),
  lot('Kartoffeln festkochend', 2000, '2026-12-16'),
  lot('Erbsen und Möhren TK', 200, LONG),
  lot('Gehackte Tomaten', 1, LONG),
  lot('Tellerlinsen', 500, LONG),
  lot('Bandnudeln', 500, LONG),
  lot('Olivenöl', 750, LONG),
  lot('Gemüsebrühe Würfel', 4000, LONG),
]
const days1 = weekDays(parseIso(MON))
const days2 = weekDays(parseIso('2026-11-23'))
// Frühstück wurde vorher geplant: zwei Frühstücke, Prep-Tag Montag (Di–Fr)
const BF = ['brot-box', 'linsen-ei-salat']
const asg = assignBreakfasts(BF, days1, MON)
const breakfast: WeekPlan = {}
for (const d of workdays(days1)) if (asg.days[d]) breakfast[d] = { recipeId: asg.days[d], servings: 1 }

// gespeicherter Stand geht wie beim Laden durch sanitize (prüft gleichzeitig, dass nichts verloren geht)
let state: AppState = sanitize({
  plan: {}, breakfast, breakfastPicks: { [MON]: BF }, prepDays: { [MON]: MON }, pantry: pantry0,
  spices: { Pfeffer: 'da', Muskatnuss: 'alle' }, onboarding: 'done', defaultServings: 2,
  profile: { sex: 'm', age: 40, heightCm: 180, weightKg: 92, activity: 1.3, deficit: 500, lunchKcal: 600 },
})
ok(state.pantry.length === pantry0.length && state.breakfast[days1[1]]?.recipeId === 'brot-box', 'Stand übersteht sanitize (Vorrat, Frühstück)')
ok(!!state.staples.Olivenöl && !!state.staples.Gemüsebrühe && state.staples.Gemüsebrühe.form === 'Gemüsebrühe Würfel', 'Grundzutaten gemerkt: Olivenöl, Gemüsebrühe (Würfel)')
ok(resolvePrepDay(state.prepDays, days1, MON) === MON, 'Prep-Tag Mo 16.11.')
ok(Object.keys(asg.days).join() === days1.slice(1, 5).join() && asg.notes.length === 0, 'Frühstück Di–Fr abgedeckt, ohne Hinweis')
ok(asg.days[days1[1]] === 'brot-box' && asg.days[days1[4]] === 'linsen-ei-salat', 'kürzer haltbares (Brot-Box) zuerst, Linsen-Ei-Salat am Fr')

/** wie der Effekt in App.tsx bei jedem Tageswechsel */
function tick(s: AppState, today: string): AppState {
  const r = cookDue(s.plan, s.pantry, today)
  const b = cookDue(s.breakfast, r.pantry, today)
  const x = moveExpired(b.pantry, s.wasted, today, s.prices)
  const next = r.changed || b.changed || x.changed ? { ...s, plan: r.plan, breakfast: b.plan, pantry: x.pantry, wasted: x.wasted } : s
  const staples = rememberStaples(next.staples, next.pantry)
  return staples === next.staples ? next : { ...next, staples }
}
function week(s: AppState, days: string[], today: string): WeekResult {
  return planWeek(s.plan, days, s.pantry, s.bought[days[0]] ?? {}, today, s.prices, formatAmount, s.breakfast, parseIso(today).getMonth() + 1, { memo: s.staples, spices: s.spices })
}
/** „Was koche ich damit?“ → Tag: Stapel wie in App.tsx (Vorrats-Modus) */
function pantryDeck(s: AppState, days: string[], day: string, today: string) {
  const w = week(s, days, today)
  const taste = buildModel({ plan: s.plan, breakfast: s.breakfast, breakfastPicks: s.breakfastPicks, rejects: s.rejects, ratings: s.ratings, wasted: s.wasted, today, customRecipes: s.customRecipes })
  const weekRecipes = days.map((d) => s.plan[d]).filter((e) => e && e.status !== 'skipped').map((e) => RECIPE_BY_ID[e!.recipeId])
  const planned = new Set(weekRecipes.map((r) => r.id))
  const freshDays = Math.max(0, Math.round((parseIso(day).getTime() - parseIso(today > days[0] ? today : days[0]).getTime()) / 864e5))
  return RECIPES.filter((r) => !planned.has(r.id))
    .map((r) => {
      const ins = insight(r, s.defaultServings, w.leftovers, today, s.prices, lastSeenMap(s.plan, days[0]), 0.5, weekRecipes, { freshDays, month: parseIso(day).getMonth() + 1, day })
      return { r, ins, key: ins.modeScore + preference(taste, r, day).score * 0.3 }
    })
    .filter((x) => x.ins.fromPantry.length > 0)
    .sort((a, b) => b.key - a.key)
}

// ───── Mo 16.11.: „Was koche ich damit?“ → Heute ─────
let today = MON
state = tick(state, today)
const deck = pantryDeck(state, days1, today, today)
console.log('  Stapel:', deck.slice(0, 5).map((x) => `${x.r.id} (${x.key.toFixed(1)})`).join(', '))
const DISH = 'haehnchen-rahm-bandnudeln'
ok(deck[0].r.id === DISH, 'oberste Karte: Hähnchen-Champignon-Rahm mit Bandnudeln')
ok(deck[0].ins.urgent.includes('Hähnchenbrustfilet'), 'Hähnchen als „läuft bald ab“ markiert')
// genommen für Montag
state = { ...state, plan: { ...state.plan, [MON]: { recipeId: DISH, servings: 2 } } }
const w1 = week(state, days1, today)
const buyNames = w1.buy.map((b) => b.name)
const covNames = w1.covered.map((b) => b.name)
const checkNames = w1.staples.map((s) => s.name)
console.log('  kaufen:', w1.buy.map((b) => `${b.name} ×${b.packs}${b.note ? ' (' + b.note + ')' : ''}`).join(', '))
console.log('  aus Vorrat:', covNames.join(', '))
console.log('  Vorrat prüfen:', checkNames.join(', '))
ok(buyNames.includes('Zwiebel') && buyNames.includes('Petersilie'), 'Liste: Zwiebel und Petersilie fehlen')
ok(['Bandnudeln', 'Hähnchenbrustfilet', 'Sahne', 'Champignons'].every((x) => covNames.includes(x) && !buyNames.includes(x)), 'Bandnudeln, Hähnchen, Sahne, Champignons gelten als vorhanden')
ok(!buyNames.includes('Ei') && !buyNames.includes('Tellerlinsen') && !buyNames.includes('Olivenöl'), 'Frühstück: Ei, Linsen, Öl aus dem Vorrat')
ok(buyNames.includes('Muskatnuss') && !buyNames.includes('Pfeffer') && !checkNames.includes('Pfeffer'), 'Gewürze: Muskatnuss „alle“ auf der Liste, Pfeffer „da“ nicht')
ok(!buyNames.some((x) => x.startsWith('Gemüsebrühe')), 'Gemüsebrühe reicht – nicht auf der Liste')
const eggs = w1.covered.find((b) => b.name === 'Ei')!
ok(near(eggs.required, 7), 'Ei: 3× Brot-Box (2) + 1× Linsen-Ei-Salat (1) = 7 Stk')
// Home Assistant: was in die geteilte Liste geht
const items = localItems(w1.buy)
const diff = diffTodo(items, [], {})
ok(diff.add.length === w1.buy.length && diff.add.every((i) => i.summary.startsWith(i.key) && !i.bought), 'HA: jeder Artikel einmal anlegen, Text beginnt mit dem Namen')
ok(!items.some((i) => ['Bandnudeln', 'Hähnchenbrustfilet', 'Sahne'].includes(i.key)), 'HA: Vorhandenes kommt nicht auf die Liste')
// Kalorien Mo (kein Frühstück geplant → Schätzwert)
const bMon = dayBalance(state.profile!, state.breakfast[MON], state.plan[MON])
ok(!bMon.breakfastPlanned && bMon.dinner != null && Number.isFinite(bMon.total), 'Tagesbilanz Mo: Schätzfrühstück + Abendessen')

// ───── Di 17.11.: Montag gilt als gekocht ─────
const before = state
today = addDaysIso(MON, 1)
state = tick(state, today)
const mon = state.plan[MON]!
ok(mon.status === 'cooked', 'Di: Montag automatisch gekocht')
ok(near(amt(state, 'Hähnchenbrustfilet'), 0) && near(amt(state, 'Champignons'), 150) && near(amt(state, 'Sahne'), 0) && near(amt(state, 'Bandnudeln'), 250), 'Vorrat: Hähnchen weg, Champignons 150 g, Sahne 0, Bandnudeln 250 g')
const oil = amt(before, 'Olivenöl') - amt(state, 'Olivenöl')
const broth = amt(before, 'Gemüsebrühe Würfel') - amt(state, 'Gemüsebrühe Würfel')
console.log(`  Olivenöl −${oil} ml, Gemüsebrühe −${broth} ml (Rezept: 2 EL Sonnenblumenöl, 100 ml Hühnerbrühe)`)
ok(oil === 0 && broth === 0, 'Öl/Brühe: Rezept nennt Sonnenblumenöl/Hühnerbrühe – andere Sorte wird nicht abgezogen (keine Austauschgruppe)')
ok(state.pantry.find((l) => l.name === 'Champignons')!.expires === '2026-11-19', 'angebrochene Champignons: Haltbarkeit 3 Tage ab Kochtag (19.11.)')
ok(pendingRating(state.plan, state.ratings, today, state.ratingDismissed) === MON, 'Di: Bewertungsfrage für Montag')
// Rückgängig: „nicht gekocht“ stellt den Vorrat exakt wieder her
const un = uncook(mon, state.pantry)
for (const l of before.pantry) ok(near(pantryAmount(un, l.name), l.amount), `nicht gekocht: ${l.name} wieder ${l.amount}`)
ok(un.find((l) => l.name === 'Champignons')!.expires === '2026-11-20', 'nicht gekocht: Champignons-Haltbarkeit wieder 20.11.')
// bewertet 👍 → Lernen
state = { ...state, ratings: { ...state.ratings, [MON]: 'up' } }
const tasteA = buildModel({ plan: before.plan, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today })
const tasteB = buildModel({ plan: state.plan, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: state.ratings, today })
ok(preference(tasteB, RECIPE_BY_ID[DISH]).score > preference(tasteA, RECIPE_BY_ID[DISH]).score, 'Bewertung 👍 hebt das Gericht')
ok(pendingRating(state.plan, state.ratings, today, state.ratingDismissed) === undefined, 'nach Bewertung keine Frage mehr')

// ───── Mi–Sa: Frühstück wird jeweils am Folgetag abgezogen ─────
const eggs0 = amt(state, 'Ei')
const lentils0 = amt(state, 'Tellerlinsen')
const oil0 = amt(state, 'Olivenöl')
for (let i = 2; i <= 5; i++) {
  today = addDaysIso(MON, i)
  state = tick(state, today)
  const yesterday = addDaysIso(today, -1)
  ok(state.breakfast[yesterday]?.status === 'cooked', `${today}: Frühstück vom ${yesterday} abgezogen`)
}
ok(near(eggs0 - amt(state, 'Ei'), 7), 'Ei: 7 Stk abgezogen (3 Tage × 2 + 1)')
ok(near(lentils0 - amt(state, 'Tellerlinsen'), 50), 'Tellerlinsen −50 g')
ok(near(oil0 - amt(state, 'Olivenöl'), 5), 'Olivenöl −5 ml (1 TL im Linsen-Ei-Salat)')
// Champignons: angebrochen bis 19.11. → am Sa noch im Vorrat (abgelaufen, aber erst nach 7 Tagen automatisch weg)
ok(amt(state, 'Champignons') > 0, 'Sa 21.11.: abgelaufene Champignons noch im Vorrat (Schonfrist 7 Tage)')

// ───── Sa 21.11.: Einkaufstag – die nächste Woche wird geplant ─────
ok(today === '2026-11-21', 'heute Sa 21.11.')
const defMon = (iso: string) => { const d = parseIso(iso); const m = mondayOf(d); return isoDate(d.getDay() === 6 || d.getDay() === 0 ? addDays(m, 7) : m) }
ok(defMon(today) === '2026-11-23', 'ab Samstag zeigt die App die nächste Woche')
const deck2 = pantryDeck(state, days2, '2026-11-23', today)
ok(deck2.length > 0 && deck2[0].r.id !== DISH, 'nächste Woche: Stapel aus dem Vorrat, nicht schon wieder dasselbe Gericht oben')
// Hinweis (Designfrage, nicht geändert): abgelaufene, noch nicht entfernte Posten zählen weiter als Vorrat (sogar als „dringend“)
console.log('  abgelaufene Champignons noch im Stapel:', deck2.some((x) => x.ins.fromPantry.includes('Champignons')))
state = { ...state, plan: { ...state.plan, '2026-11-23': { recipeId: deck2[0].r.id, servings: 2 } } }
const w2 = week(state, days2, today)
ok(Number.isFinite(w2.total) && w2.buy.every((b) => b.packs > 0 && Number.isFinite(b.cost)), 'Einkaufsliste nächste Woche: Packungen und Preise gültig')

// ───── So 22.11.: Champignons wegwerfen (abgelaufen) → Wochenrückblick ─────
today = '2026-11-22'
state = tick(state, today)
const ch = state.pantry.find((l) => l.name === 'Champignons')!
const waste = discardWaste(ch, today, state.prices)
ok(!!waste && near(waste.amount, 150) && waste.value > 0, 'Champignons entfernt → als weggeworfen erfasst (150 g)')
state = { ...state, pantry: state.pantry.filter((l) => l !== ch), wasted: [...state.wasted, waste!] }
ok(defaultReviewMonday(today) === MON, 'Sonntag: Rückblick für die Woche ab 16.11.')
const rev = weekReview(state, days1, today)
console.log('  Rückblick:', JSON.stringify({ nutrition: rev.nutrition, food: rev.food, spending: rev.spending, tip: rev.tip.kind, rated: rev.highlights.rated.length }))
ok(rev.hasData && rev.spending.dinners === 1, 'Rückblick: 1 Abendessen')
ok(rev.food.waste.count === 1 && rev.food.waste.top === 'Champignons' && rev.tip.kind !== 'empty', 'Rückblick: Champignons weggeworfen')
ok(rev.food.usedItems > 0 && rev.food.usedEuro > 3, 'Rückblick: aus dem Vorrat verbraucht (Hähnchen, Sahne, Nudeln, Eier …)')
ok(rev.highlights.rated.length === 1 && rev.highlights.rated[0].day === MON, 'Rückblick: Bewertung vom Montag')
ok(rev.nutrition.days === 1 && Number.isFinite(rev.nutrition.avgKcal!), 'Rückblick: Ernährung Mo (einziger Tag mit Abendessen)')

// ───── Mo 23.–Di 24.11.: neue Woche, Gericht vom 23. wird gekocht ─────
today = '2026-11-24'
state = tick(state, today)
ok(state.plan['2026-11-23']?.status === 'cooked', 'Di 24.11.: Gericht vom Mo 23.11. gekocht')
ok(state.pantry.every((l) => l.amount > 0 && Number.isFinite(l.amount)), 'Vorrat ohne leere/ungültige Posten')
ok(prepPlan(assignBreakfasts([], days2, resolvePrepDay(state.prepDays, days2, today))).length === 0, 'nächste Woche: noch kein Frühstück → leere Prep-Liste')
ok(resolvePrepDay(state.prepDays, days2, today) === '2026-11-22', 'nächste Woche: Prep-Tag Sonntag (Montag erst einmal gewählt)')

// ───── 29.11.: nicht entfernte, abgelaufene Posten wandern nach 7 Tagen in „weggeworfen“ ─────
const s2 = tick({ ...state, pantry: [...state.pantry, lot('Schmand', 100, '2026-11-20')] }, '2026-11-28')
ok(!s2.pantry.some((l) => l.expires === '2026-11-20') && s2.wasted.some((w) => w.name === 'Schmand'), '8 Tage nach Ablauf automatisch weggeworfen')

console.log(fails ? `\n${fails} Fehler` : '\nAlle Tests OK')
if (fails) process.exit(1)
