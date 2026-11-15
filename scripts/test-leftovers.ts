// Tests: Vorrat/Reste nutzen, verderbliche Reste vermeiden, Frische nach Wochentag
//   npx vite-node scripts/test-leftovers.ts
import { BREAKFASTS, RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { addDaysIso, insight, planWeek, PANTRY_ONLY_MAX_EURO, type PantryLot } from '../src/kitchen'
import { formatAmount } from '../src/shopping'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const today = '2026-11-15'
const rankB = (left: PantryLot[], n = 5) =>
  BREAKFASTS.map((r) => ({ r, i: insight(r, 3, left, today, {}, new Map(), 0.5, []) })).sort((a, b) => b.i.score - a.i.score).slice(0, n)

// 1) Leerer Vorrat: oben stehen Frühstücke ohne verderbliche Reste
const top0 = rankB([])
console.log('  leer:', top0.map((x) => `${x.r.id}${x.i.waste.length ? ' 🗑' + x.i.waste.map((w) => w.name).join('/') : ''}`).join(' | '))
ok(top0.slice(0, 3).every((x) => x.i.waste.length === 0), 'Top 3 ohne verderbliche Reste')

// 2) Reste vom Abendessen: Feta & Spinat übrig → Spinat-Feta-Muffins rücken nach vorne
const lots: PantryLot[] = [
  { id: 'a', name: 'Feta', amount: 120, unit: 'g', expires: addDaysIso(today, 3) },
  { id: 'b', name: 'Blattspinat TK', amount: 450, unit: 'g', expires: addDaysIso(today, 150) },
  { id: 'c', name: 'Ei', amount: 6, unit: 'Stk', expires: addDaysIso(today, 14) },
]
const top1 = rankB(lots)
console.log('  Feta/Spinat/Eier übrig:', top1.map((x) => x.r.id).join(' | '))
ok(top1.slice(0, 3).some((x) => x.r.id === 'eiermuffins-spinat-feta' || x.r.id === 'frittata-stuecke' || x.r.id === 'savory-oats'), 'Resteverwertung: Ei-/Feta-Frühstück unter den Top 3')

// 3) Skyr läuft bald ab → Skyr-Frühstück vorne
const top2 = rankB([{ id: 's', name: 'Skyr', amount: 450, unit: 'g', expires: addDaysIso(today, 2) }])
ok(top2[0].i.fromPantry.includes('Skyr'), `Skyr läuft ab → ${top2[0].r.title} vorne`)

// 4) Verderblicher Rest wird erkannt (Brot-Box: 3×100 g Hüttenkäse → 2 Becher, 100 g Rest)
const box = insight(RECIPE_BY_ID['brot-box'], 3, [], today, {}, new Map(), 0, [])
console.log('  Brot-Box Reste:', box.waste.map((w) => `${w.name} ${formatAmount(w.amount, w.unit)}`).join(', '), `(${box.wasteEuro.toFixed(2)} €)`)
ok(box.waste.some((w) => w.name === 'Hüttenkäse'), 'Hüttenkäse-Rest wird als verderblich erkannt')

// 5) Frische: Hackfleisch am Freitag (4 Tage nach Einkauf) ist nicht mehr frisch
const hack = RECIPES.find((r) => r.id === 'frikadellen')!
const fri = insight(hack, 2, [], today, {}, new Map(), 0, [], { freshDays: 5 })
const mon = insight(hack, 2, [], today, {}, new Map(), 0, [], { freshDays: 1 })
ok(fri.stale.includes('Hackfleisch gemischt') && !mon.stale.length && fri.score < mon.score - 3, 'Frikadellen: Mo frisch, Fr nicht → Fr weiter hinten')

// 6) „Nur mit Vorrat“: mit gefülltem Vorrat gibt es Treffer
const full: PantryLot[] = ['Haferflocken', 'Skyr', 'Milch', 'Chiasamen', 'Beerenmischung TK', 'Apfel'].map((n, i) => ({
  id: 'p' + i, name: n, amount: n === 'Apfel' ? 6 : 2000, unit: n === 'Apfel' ? 'Stk' : n === 'Milch' ? 'ml' : 'g', expires: addDaysIso(today, 6),
}))
const pantryOnly = BREAKFASTS.filter((r) => insight(r, 3, full, today, {}, new Map(), 0, []).buyCost <= PANTRY_ONLY_MAX_EURO)
console.log('  nur mit Vorrat:', pantryOnly.map((r) => r.id).join(', '))
ok(pantryOnly.some((r) => r.id === 'oats-beeren'), '„Nur mit Vorrat“ findet Overnight Oats Beeren')

// 7) Abendessen-Reste fließen in die Frühstücksempfehlung (über die Wochenplanung)
const plan: WeekPlan = { [days[0]]: { recipeId: 'spinat-spiegelei', servings: 2 } }
const w = planWeek(plan, days, [], {}, today, {}, formatAmount)
const eggsLeft = w.leftovers.filter((l) => l.name === 'Ei').reduce((s, l) => s + l.amount, 0)
const top3 = rankB(w.leftovers)
ok(eggsLeft >= 6 && top3.some((x) => x.i.fromPantry.includes('Ei')), `Nach „Rahmspinat mit Spiegelei“ bleiben ${eggsLeft} Eier → Ei-Frühstück empfohlen`)

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
