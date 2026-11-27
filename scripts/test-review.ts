// Logiktest Wochenrückblick:  npx vite-node scripts/test-review.ts
import { RECIPES as DINNERS } from '../src/data/recipes'
import { amountValue, discardWaste, moveExpired, needsOf, type PantryLot } from '../src/kitchen'
import { buildModel, preference } from '../src/learning'
import { defaultReviewMonday, weekReview } from '../src/review'
import { reviewStats } from '../src/components/ReviewCard'
import { RECIPE_BY_ID, BREAKFASTS } from '../src/data/recipes'
import { sanitize, weekDays, parseIso, type AppState } from '../src/store'
import { PRODUCTS } from '../src/data/products'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

const MON = '2026-11-16' // KW 47
const DAYS = weekDays(parseIso(MON))
const TODAY = DAYS[6] // Sonntag
// fünf Abendessen aus verschiedenen Küchen bzw. fünf aus nur einer Küche
const mixed = (['de', 'it', 'as', 'gr', 'es'] as const).map((c) => DINNERS.find((r) => r.cuisine === c)!)
const oneCuisine = DINNERS.filter((r) => r.cuisine === 'de').slice(0, 5)
const high = mixed

function build(dinners: typeof high, extra: Partial<AppState> = {}): AppState {
  const plan: AppState['plan'] = {}
  dinners.forEach((r, i) => { plan[DAYS[i]] = { recipeId: r.id, servings: 2, status: 'cooked', consumed: [] } })
  const bf: AppState['breakfast'] = {}
  for (let i = 0; i < 5; i++) bf[DAYS[i]] = { recipeId: BREAKFASTS[0].id, servings: 1 }
  const needs = needsOf(dinners[0], 2)
  const bought = Object.fromEntries(needs.map((n) => [n.name, { lotId: 'x' + n.name, amount: PRODUCTS[n.name].pack * 2 }]))
  return sanitize({
    plan, breakfast: bf, breakfastPicks: { [MON]: [BREAKFASTS[0].id] }, bought: { [MON]: bought },
    // alte Felder (Kalorienziel, Wiegen) stören nicht
    profile: { weightKg: 90 }, weighIns: [{ date: '2026-11-09', weight: 91 }],
    ratings: { [DAYS[1]]: 'up', [DAYS[2]]: 'again', [DAYS[3]]: 'down' },
    ...extra,
  })
}

const base = build(high)
const r = weekReview(base, DAYS, TODAY)
console.log(`  KW ${r.kw}: ${r.variety.cuisines} Küchen, ${r.variety.newDishes} neu, ${r.spending.total} €`)
ok(r.kw === 47, 'KW 47')
ok(r.hasData, 'Woche hat Daten')
ok(r.spending.total > 0 && r.spending.items === needsOf(high[0], 2).length, 'Ausgaben > 0 (Einkäufe × Preis)')
const expect = needsOf(high[0], 2).reduce((s, n) => s + amountValue(n.name, PRODUCTS[n.name].pack * 2), 0)
ok(Math.abs(r.spending.total - expect) < 0.011, 'Ausgaben = Packungen × Preis')
ok(r.variety.cuisines === 5 && r.variety.newDishes === 5, 'Abwechslung: 5 Küchen, 5 Gerichte zum ersten Mal')
ok(!('nutrition' in r) && !('weight' in r), 'kein Kalorien- oder Gewichtsteil mehr')
{
  const again = build(high, { plan: { ...build(high).plan, '2026-11-02': { recipeId: high[0].id, servings: 2, status: 'cooked' } } })
  ok(weekReview(again, DAYS, TODAY).variety.newDishes === 4, 'Abwechslung: schon früher gekochtes Gericht zählt nicht als neu')
}
ok(r.highlights.rated.length === 2 && r.highlights.rated.every((x) => x.rating !== 'down'), 'Highlights: nur 👍/🔁')
ok(r.food.waste.count === 0, 'Nichts weggeworfen')

// Abgelaufenen Posten entfernen → Verschwendung erfasst
const lot: PantryLot = { id: 'l1', name: 'Champignons', amount: 400, unit: 'g', expires: '2026-11-18' }
const w1 = discardWaste(lot, '2026-11-20')
ok(!!w1 && w1.value > 0 && w1.date === '2026-11-18', 'Entfernen eines abgelaufenen Postens → weggeworfen mit Wert, datiert aufs Ablaufdatum')
ok(discardWaste({ ...lot, expires: '2026-12-01' }, '2026-11-20') === null, 'Frischer Posten zählt nicht als weggeworfen')

// Automatisch: vor > 7 Tagen abgelaufen
const old: PantryLot = { id: 'l2', name: 'Sahne', amount: 200, unit: 'ml', expires: '2026-11-10' }
const fresh: PantryLot = { id: 'l3', name: 'Sahne', amount: 200, unit: 'ml', expires: '2026-11-19' }
const mv = moveExpired([old, fresh], [], '2026-11-20')
ok(mv.changed && mv.pantry.length === 1 && mv.pantry[0].id === 'l3' && mv.wasted.length === 1 && mv.wasted[0].name === 'Sahne', 'Auto: >7 Tage abgelaufen wandert in „weggeworfen“')
const mv2 = moveExpired(mv.pantry, mv.wasted, '2026-11-20')
ok(!mv2.changed && mv2.wasted.length === 1, 'Idempotent')
// Regression: datiert aufs Ablaufdatum, nicht auf den Tag des Wegräumens (sonst landet es in der falschen Woche)
ok(mv.wasted[0].date === '2026-11-10', 'Auto: Datum = Ablaufdatum (10.11.), nicht der 20.11.')
const late = moveExpired([{ ...old, expires: '2026-11-20' }], [], '2026-12-20')
ok(late.wasted[0].date === '2026-11-20', 'App einen Monat zu: trotzdem in der Woche des Ablaufs')

// Tipps
ok(r.tip.kind === 'ok', 'Tipp: Ermutigung bei guter Woche')
const withWaste = build(high, { wasted: [w1!, { ...w1!, name: 'Sahne', value: 0.5 }] })
const rw = weekReview(withWaste, DAYS, TODAY)
ok(rw.food.waste.count === 2 && rw.food.waste.euro > 0 && rw.food.waste.top === 'Champignons' && rw.tip.kind === 'waste' && rw.tip.text.includes('Champignons'), 'Tipp: Achte auf Champignons')
const rOne = weekReview(build(oneCuisine), DAYS, TODAY)
ok(rOne.variety.cuisines === 1 && rOne.tip.kind === 'variety' && rOne.tip.text.includes('andere'), 'Tipp: nur eine Küche → mehr Abwechslung')
ok(reviewStats(rOne).cuisines === '1' && reviewStats(rOne).cuisinesSub === 'Küche', 'Kennzahl: 1 Küche')

// Lernen: Verschwendung wirkt leicht negativ auf Gerichte derselben Woche
const ing = needsOf(high[0], 2)[0]
const model = (wasted: AppState['wasted']) => buildModel({ plan: { [DAYS[0]]: { recipeId: high[0].id, servings: 2 } }, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, wasted, today: TODAY })
const m0 = model([])
const m1 = model([{ name: ing.name, amount: 1, unit: ing.unit, date: DAYS[4], value: 1 }])
ok(preference(m1, high[0]).score < preference(m0, high[0]).score, 'Lernen: weggeworfene Zutat → Gericht leicht abgewertet')
const m2 = model([{ name: ing.name, amount: 1, unit: ing.unit, date: '2026-11-30', value: 1 }])
ok(preference(m2, high[0]).score === preference(m0, high[0]).score, 'Lernen: andere Woche → keine Wirkung')

// Woche ohne Daten
const empty = weekReview(sanitize({}), weekDays(parseIso('2026-10-05')), TODAY)
ok(!empty.hasData && empty.tip.kind === 'empty' && empty.spending.total === 0 && empty.variety.cuisines === 0 && empty.food.waste.count === 0, 'Leere Woche → neutral, ohne Fehler')
{
  const st = reviewStats(empty)
  ok(st.waste === '–' && !st.wasteSub.includes('🎉'), 'Leere Woche: kein „0 € weggeworfen 🎉“ (nichts erfasst)')
  ok(reviewStats(r).waste === '0 €' || r.food.waste.count > 0, 'Woche mit Daten: 0 € weggeworfen wird gezeigt')
}
ok(reviewStats(empty).cuisines === '–' && empty.highlights.rated.length === 0, 'Leere Woche: keine Abwechslungs-/Bewertungsangaben')

// Standard-Woche für den Link
ok(defaultReviewMonday('2026-11-22') === MON, 'Sonntag → Woche, die heute endet')
ok(defaultReviewMonday('2026-11-18') === '2026-11-09', 'Mittwoch → vergangene Woche')

// Sanitize
const s = sanitize({ wasted: [{ name: 'x', amount: 1, unit: 'g', date: '2026-11-01', value: 1 }, { bad: 1 }], reviewDismissed: ['2026-11-16', 5] })
ok(s.wasted.length === 1 && s.reviewDismissed.length === 1, 'sanitize: ungültige Einträge verworfen')
ok(sanitize({ wasted: Array.from({ length: 400 }, () => ({ name: 'x', amount: 1, unit: 'g', date: '2026-11-01', value: 1 })) }).wasted.length === 300, 'sanitize: höchstens 300 Einträge')
void RECIPE_BY_ID

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
