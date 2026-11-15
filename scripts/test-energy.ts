// Logiktest Kalorienbedarf & Portionen:  npx vite-node scripts/test-energy.ts
import { RECIPE_BY_ID } from '../src/data/recipes'
import { bmr, dayBalance, isWorkday, portionFor, targetKcal, tdee, type Profile } from '../src/energy'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const me: Profile = { sex: 'm', age: 40, heightCm: 180, weightKg: 95, activity: 1.2, deficit: 500, lunchKcal: 600 }

ok(Math.round(bmr(me)) === 1880, `Grundumsatz 1.880 kcal (ist ${Math.round(bmr(me))})`)
ok(Math.round(tdee(me)) === 2256, `Bedarf 2.256 kcal (ist ${Math.round(tdee(me))})`)
ok(targetKcal(me) === 1760, `Tagesziel 1.760 kcal (ist ${targetKcal(me)})`)
const small: Profile = { sex: 'w', age: 60, heightCm: 155, weightKg: 52, activity: 1.2, deficit: 750, lunchKcal: 500 }
ok(targetKcal(small) === 1200, `Untergrenze greift (ist ${targetKcal(small)})`)

ok(isWorkday('2026-11-16') && isWorkday('2026-11-20') && !isWorkday('2026-11-21') && !isWorkday('2026-11-22'), 'Mo–Fr Arbeitstage, Sa/So nicht')

// Tag mit Overnight Oats (392) + Mittag 600 → Abendbudget 1.760 − 392 − 600 = 768
const b = dayBalance(me, { recipeId: 'oats-apfel-zimt', servings: 1 }, { recipeId: 'lasagne', servings: 2 })
console.log(`  Bilanz: ☀️ ${b.breakfast} + 🥪 ${b.lunch} + 🌙 ${b.dinner} = ${b.total} / ${b.target} (Budget abends ${b.dinnerBudget})`)
ok(b.dinnerBudget === 768, `Abendbudget 768 kcal (ist ${b.dinnerBudget})`)
ok(b.total <= b.target, 'Tagessumme bleibt im Ziel')

const lasagne = portionFor(RECIPE_BY_ID['lasagne'], 768, 2)
console.log(`  Lasagne (${RECIPE_BY_ID['lasagne'].nutrition.kcal} kcal/Portion): ${lasagne.label}, ${lasagne.kcal} kcal, Rest ${lasagne.rest} – ${lasagne.tip}`)
ok(lasagne.fraction === 0.33 && lasagne.kcal <= 768 && !!lasagne.tip, 'Lasagne: ⅓ Portion (unter Budget) + Salat-Tipp')
const soup = portionFor(RECIPE_BY_ID['tomatensuppe'], 768, 2)
ok(soup.fraction === 1 && !soup.tip, `Tomatensuppe (${RECIPE_BY_ID['tomatensuppe'].nutrition.kcal} kcal): volle Portion`)

// ohne geplantes Frühstück wird mit 400 kcal gerechnet
const b2 = dayBalance(me, undefined, undefined)
ok(b2.breakfast === 400 && !b2.breakfastPlanned && b2.dinnerBudget === 760, 'Ohne Frühstück: 400 kcal angenommen')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
