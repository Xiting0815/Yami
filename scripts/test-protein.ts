// Logiktest Eiweißziel & Tagesbilanz:  npx vite-node scripts/test-protein.ts
import { RECIPE_BY_ID } from '../src/data/recipes'
import { DEFAULT_BREAKFAST_PROTEIN, LUNCH_PROTEIN, dayBalance, isProteinLow, portionFor, proteinBoost, proteinTarget, type Profile } from '../src/energy'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const base: Profile = { sex: 'm', age: 40, heightCm: 180, weightKg: 95, activity: 1.2, deficit: 500, lunchKcal: 600 }

// Eiweißziel: 1,6 g × Zielgewicht, sonst × aktuelles Gewicht
ok(proteinTarget({ ...base, goalWeight: 85 }) === 136, `Ziel 85 kg → 136 g (ist ${proteinTarget({ ...base, goalWeight: 85 })})`)
ok(proteinTarget(base) === 152, `ohne Ziel, 95 kg → 152 g (ist ${proteinTarget(base)})`)

// Tag mit Overnight Oats (27,4 g) + Mittag-Schätzung (25 g) + Carbonara-Portion
const oats = RECIPE_BY_ID['oats-apfel-zimt']
const carb = RECIPE_BY_ID['carbonara']
const b = dayBalance(base, { recipeId: 'oats-apfel-zimt', servings: 1 }, { recipeId: 'carbonara', servings: 2 })
const frac = portionFor(carb, b.dinnerBudget, 2).fraction
const expected = Math.round(oats.nutrition.protein + LUNCH_PROTEIN + carb.nutrition.protein * frac)
console.log(`  Bilanz: ☀️ ${b.breakfastProtein} + 🥪 ${b.lunchProtein} + 🌙 ${b.dinnerProtein?.toFixed(1)} = ${b.protein} / ${b.proteinTarget} g (Anteil ${frac})`)
ok(b.protein === expected, `Eiweiß = Frühstück + 25 + Carbonara × Anteil = ${expected} (ist ${b.protein})`)
ok(b.proteinTarget === 152 && b.breakfastProtein === 27.4 && b.lunchProtein === 25, 'Ziel 152 g, Frühstück 27,4 g, Mittag 25 g')
ok(b.dinnerProtein !== undefined && Math.abs(b.dinnerProtein - carb.nutrition.protein * frac) < 1e-9, 'Abendportion-Eiweiß = Rezept × Anteil')

// ohne geplantes Frühstück: 20 g angenommen; ohne Abendessen: nur Frühstück + Mittag
const none = dayBalance(base, undefined, undefined)
ok(none.breakfastProtein === DEFAULT_BREAKFAST_PROTEIN && none.protein === 45 && none.dinnerProtein === undefined, 'Ohne Frühstück: 20 g angenommen, Summe 45 g')
const onlyDinner = dayBalance(base, undefined, { recipeId: 'carbonara', servings: 2 })
ok(onlyDinner.breakfastProtein === 20 && onlyDinner.protein === Math.round(20 + 25 + carb.nutrition.protein * onlyDinner.dinnerProtein! / carb.nutrition.protein), 'Nur Abendessen: Frühstück 20 g + Mittag 25 g + Portion')

// zu wenig Eiweiß: unter 80 % des Ziels (152 → 121,6)
ok(isProteinLow({ ...none, proteinTarget: 152 }) && !isProteinLow({ ...none, protein: 125, proteinTarget: 152 }), 'Unter 80 % gilt als zu wenig')

// Lern-Bonus: (g − 30) / 15, höchstens 2, nie negativ
ok(proteinBoost(20) === 0 && proteinBoost(30) === 0, 'Bonus 0 bei ≤ 30 g')
ok(Math.abs(proteinBoost(45) - 1) < 1e-9, 'Bonus 1 bei 45 g')
ok(proteinBoost(70) === 2 && Math.abs(proteinBoost(55) - 5 / 3) < 1e-9, 'Bonus begrenzt auf 2')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
