// Logiktest für Vorrat, Einkauf & Empfehlungen:  npx vite-node scripts/test-kitchen.ts
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { formatAmount } from '../src/shopping'
import { needsOf, cookDue, uncook, insight, lastSeenMap, planWeek, uid, addDaysIso, pantryAmount, type PantryLot, type BoughtMap } from '../src/kitchen'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (cond: boolean, msg: string) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++ }

const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const mon = days[0]
let plan: WeekPlan = { [days[0]]: { recipeId: 'jaegerschnitzel', servings: 2 }, [days[1]]: { recipeId: 'carbonara', servings: 2 } }
let pantry: PantryLot[] = [{ id: 'x', name: 'Ei', amount: 3, unit: 'Stk', expires: '2026-11-30' }]
const bought: BoughtMap = {}

// 1) Einkaufsliste
let w = planWeek(plan, days, pantry, bought, mon, {}, formatAmount)
const sahne = w.buy.find((b) => b.name === 'Sahne')!
ok(sahne?.packs === 1 && Math.abs(sahne.leftover - 50) < 1e-6, `Sahne: 1 Becher kaufen, 50 ml bleiben übrig (packs=${sahne?.packs}, rest=${sahne?.leftover})`)
const ei = [...w.buy, ...w.covered].find((b) => b.name === 'Ei')!
ok(ei.fromPantry === 3 && ei.packs === 1, `Ei: 4 gebraucht, 3 im Vorrat → 1 Packung (fromPantry=${ei.fromPantry}, packs=${ei.packs})`)
ok(w.staples.some((s) => s.name === 'Salz'), 'Salz steht unter "Vorrat prüfen"')
const total1 = w.total
console.log(`  Einkauf ≈ ${total1.toFixed(2)} €`)

// 2) alles abhaken → Vorrat
for (const b of w.buy) {
  const lot = { id: uid(), name: b.name, amount: b.packs * b.product.pack, unit: b.unit, expires: addDaysIso(mon, b.product.shelf) }
  pantry.push(lot)
  bought[b.name] = { lotId: lot.id, amount: lot.amount }
}
const w2 = planWeek(plan, days, pantry, bought, mon, {}, formatAmount)
ok(Math.abs(w2.total - total1) < 1e-6 && w2.buy.length === w.buy.length, 'Liste bleibt nach dem Abhaken stabil')
ok(pantryAmount(pantry, 'Sahne') === 200, 'Sahne 200 ml im Vorrat')

// 3) Dienstag: Montag wird automatisch gekocht
const r = cookDue(plan, pantry, days[1])
plan = r.plan; pantry = r.pantry
ok(plan[mon]?.status === 'cooked', 'Montag als gekocht markiert')
ok(Math.abs(pantryAmount(pantry, 'Sahne') - 50) < 1e-6, `Sahne nach dem Kochen: 50 ml (ist ${pantryAmount(pantry, 'Sahne')})`)
const sahneLot = pantry.find((l) => l.name === 'Sahne')!
ok(sahneLot.expires === addDaysIso(mon, 4), `angebrochene Sahne hält bis ${sahneLot.expires}`)
const w3 = planWeek(plan, days, pantry, bought, days[1], {}, formatAmount)
ok(Math.abs(w3.total - total1) < 1e-6, 'Liste bleibt auch nach dem Kochen stabil')

// 4) Empfehlung: Reste (Sahne, Champignons, Spätzle…) bevorzugen
const seen = lastSeenMap(plan, mon)
const ranked = RECIPES.map((rc) => ({ rc, i: insight(rc, 2, w3.leftovers, days[1], {}, seen, 0) })).sort((a, b) => b.i.score - a.i.score)
console.log('  Top 5:', ranked.slice(0, 5).map((x) => `${x.rc.title} [${x.i.fromPantry.join(', ')}] +${x.i.buyCost.toFixed(2)}€`).join(' | '))
ok(ranked[0].i.fromPantry.length >= 2, 'Top-Empfehlung nutzt mehrere Vorratszutaten')

// 5) Wiederholung wird bestraft
const nextMon = addDaysIso(mon, 7)
const seen2 = lastSeenMap(plan, nextMon)
const iRep = insight(RECIPE_BY_ID['jaegerschnitzel'], 2, [], nextMon, {}, seen2, 0)
const iNew = insight(RECIPE_BY_ID['rahmschnitzel'], 2, [], nextMon, {}, seen2, 0)
ok(iRep.lastSeenDays === 7 && iRep.score < iNew.score - 5, 'Gericht von letzter Woche rutscht nach hinten')

// 6) Kosten plausibel
const costs = RECIPES.map((rc) => insight(rc, 2, [], mon, {}, new Map(), 0).perPortion).sort((a, b) => a - b)
console.log(`  Kosten/Portion: min ${costs[0].toFixed(2)} €, Median ${costs[100].toFixed(2)} €, max ${costs[costs.length - 1].toFixed(2)} €`)
ok(costs[100] > 1 && costs[100] < 6, 'Median-Kosten pro Portion plausibel')

// 7) Nächste Woche planen, während dieses Wochenende noch offen ist: Zutaten fürs Wochenende sind reserviert
{
  const sat = '2026-11-21'
  const nextDays = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-23', i))
  const p: WeekPlan = { [sat]: { recipeId: 'carbonara', servings: 2 }, [nextDays[0]]: { recipeId: 'carbonara', servings: 2 } }
  const lots: PantryLot[] = [{ id: 's', name: 'Spaghetti', amount: 250, unit: 'g', expires: '2027-06-01' }]
  const nw = planWeek(p, nextDays, lots, {}, '2026-11-20', {}, formatAmount)
  const sp = nw.buy.find((b) => b.name === 'Spaghetti')
  ok(!!sp && sp.packs === 1 && sp.fromPantry === 0, 'Spaghetti fürs Wochenende reserviert → nächste Woche neu kaufen')
  const only = planWeek({ [nextDays[0]]: p[nextDays[0]] }, nextDays, lots, {}, '2026-11-20', {}, formatAmount)
  ok(only.covered.some((b) => b.name === 'Spaghetti'), 'Ohne offenes Wochenend-Gericht reicht der Vorrat')
}

// 8) „Nicht gekocht“ legt Zutaten in die ursprünglichen Posten zurück → „Haken zurücksetzen“ leert den Vorrat
{
  const d = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
  let pl: WeekPlan = { [d[0]]: { recipeId: 'carbonara', servings: 2 }, [d[1]]: { recipeId: 'carbonara', servings: 2 } }
  let lots: PantryLot[] = []
  const bo: BoughtMap = {}
  for (const b of planWeek(pl, d, lots, bo, d[0], {}, formatAmount).buy) {
    const lot = { id: uid(), name: b.name, amount: b.packs * b.product.pack, unit: b.unit, expires: '2027-01-01' }
    lots.push(lot)
    bo[b.name] = { lotId: lot.id, amount: lot.amount }
  }
  const r = cookDue(pl, lots, d[1])
  pl = r.plan
  lots = uncook(pl[d[0]]!, r.pantry)
  ok(pantryAmount(lots, 'Spaghetti') === 500, 'Nicht gekocht → Spaghetti wieder 500 g')
  for (const b of Object.values(bo)) lots = lots.map((l) => (l.id === b.lotId ? { ...l, amount: l.amount - b.amount } : l)).filter((l) => l.amount > 1e-6)
  ok(lots.length === 0, 'Haken zurücksetzen danach → Vorrat leer')
  // Portionen nach dem Einkauf erhöht → Artikel gilt nicht mehr als vollständig gekauft
  const more: WeekPlan = { [d[0]]: { recipeId: 'carbonara', servings: 8 } }
  const lots2: PantryLot[] = [{ id: 'x', name: 'Spaghetti', amount: 500, unit: 'g', expires: '2027-01-01' }]
  const sp = planWeek(more, d, lots2, { Spaghetti: { lotId: 'x', amount: 500 } }, d[0], {}, formatAmount).buy.find((b) => b.name === 'Spaghetti')!
  ok(sp.packs === 2 && sp.bought === 500, `Portionen 8: 2 Pck nötig, 1 gekauft (bought ${sp.bought})`)
}

// Kleine Schnitzel (Saltimbocca, Scaloppine, Piccata): Einkauf in normalen Schnitzeln à 150 g, nicht 1 kleines = 1 großes
{
  const need = (id: string, n: string) => needsOf(RECIPE_BY_ID[id], 2).find((x) => x.name === n)
  ok(need('saltimbocca', 'Kalbsschnitzel')?.amount === 2 && need('scaloppine-limone', 'Kalbsschnitzel')?.amount === 2, 'Saltimbocca/Scaloppine: 2 Kalbsschnitzel (1 Packung) statt 4')
  ok(need('piccata', 'Schweineschnitzel')?.amount === 2, 'Piccata: 2 Schweineschnitzel statt 4')
}
if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
