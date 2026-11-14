// Logiktest Meal-Prep-Frühstück:  npx vite-node scripts/test-breakfast.ts
import { assignBreakfasts, prepPlan } from '../src/breakfast'
import { addDaysIso, planWeek } from '../src/kitchen'
import { formatAmount } from '../src/shopping'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const show = (a: ReturnType<typeof assignBreakfasts>) => days.slice(0, 5).map((d) => `${d.slice(8)}:${a.days[d] ?? '–'}${a.frozen.includes(d) ? '❄' : ''}`).join(' ')

// Oats (3 Tage) + Chia (5 Tage): Oats Mo–Mi, Chia Do–Fr, nichts einfrieren
let a = assignBreakfasts(['chia-beeren', 'oats-apfel-zimt'], days)
console.log(' ', show(a))
ok(a.days[days[0]] === 'oats-apfel-zimt' && a.days[days[2]] === 'oats-apfel-zimt' && a.days[days[4]] === 'chia-beeren' && !a.frozen.length && !a.notes.length, 'Oats Mo–Mi, Chia Do–Fr')

// Oats + Eiermuffins (4 Tage, einfrierbar): Fr-Muffins einfrieren
a = assignBreakfasts(['oats-beeren', 'eiermuffins-spinat-feta'], days)
console.log(' ', show(a), '|', a.notes.join(' '))
ok(a.frozen.length === 1 && a.frozen[0] === days[4], 'Freitags-Muffins werden eingefroren')

// Zwei kurz haltbare (Oats + Oats): Do/Fr nicht abgedeckt → Hinweis
a = assignBreakfasts(['oats-beeren', 'oats-apfel-zimt'], days)
console.log(' ', show(a), '|', a.notes.join(' '))
ok(Object.keys(a.days).length === 3 && a.notes.length === 1, 'Hinweis, wenn Do/Fr nicht halten')

// Nur Burrito (4 Tage, einfrierbar): ganze Woche, Fr eingefroren
a = assignBreakfasts(['burrito'], days)
ok(Object.keys(a.days).length === 5 && a.frozen.length === 1, 'Ein einfrierbares Frühstück reicht für Mo–Fr')

// Prep-Liste: Ofen zuerst, Mengen hochgerechnet
a = assignBreakfasts(['oats-beeren', 'eiermuffins-spinat-feta'], days)
const prep = prepPlan(a)
ok(prep[0].recipe.id === 'eiermuffins-spinat-feta', 'Ofengericht steht in der Prep-Liste zuerst')
const skyr = prep.find((p) => p.recipe.id === 'oats-beeren')!.ingredients.find((i) => i.name === 'Skyr')!
ok(skyr.amount === 450, `Skyr für 3 Portionen Oats: ${skyr.amount} g`)

// Einkauf: Frühstückszutaten landen auf der Liste
const bf: WeekPlan = Object.fromEntries(Object.entries(a.days).map(([d, id]) => [d, { recipeId: id, servings: 1 }]))
const w = planWeek({}, days, [], {}, days[0], {}, formatAmount, bf)
const sk = w.buy.find((b) => b.name === 'Skyr')
ok(!!sk && sk.packs === 1, `Skyr auf der Einkaufsliste: ${sk?.packs} Becher (450 g)`)
ok(w.buy.some((b) => b.name === 'Eiklar'), 'Eiklar auf der Einkaufsliste')
console.log(`  Frühstück Mo–Fr kostet ≈ ${w.total.toFixed(2)} € Einkauf`)

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
