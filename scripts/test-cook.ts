// Logiktest Kochmodus (Zutaten je Schritt):  npx vite-node scripts/test-cook.ts
import { BREAKFASTS, RECIPE_BY_ID, RECIPES } from '../src/data/recipes'
import { ingredientsForStep, unmatched } from '../src/cookSteps'
import type { Ingredient, Recipe } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const names = (r: Recipe, step: number) => ingredientsForStep(r, step).map((i) => i.name)

// Beispiele aus der Aufgabe
ok(names(RECIPE_BY_ID['carbonara'], 0).includes('Guanciale'), 'Carbonara Schritt 1 enthält Guanciale')

const frikadellen = RECIPE_BY_ID['frikadellen']
const frikaSteps = frikadellen.steps.map((_, i) => names(frikadellen, i))
ok(frikaSteps.some((s) => s.includes('Hackfleisch gemischt')), 'Frikadellen: Hackfleisch gemischt liegt in einem Schritt')
ok(frikaSteps.some((s) => s.includes('Zwiebel')), 'Frikadellen: Zwiebel liegt in einem Schritt')

const puffer = RECIPE_BY_ID['kartoffelpuffer']
ok(names(puffer, 0).includes('Kartoffeln mehligkochend'), 'Kartoffelpuffer Schritt 1 enthält Kartoffeln mehligkochend')
ok(names(puffer, 0).includes('Zwiebel'), 'Kartoffelpuffer Schritt 1 enthält Zwiebel')

// Jede Zutat nur im ersten Schritt, der sie nennt
const dupes = [...RECIPES, ...BREAKFASTS].filter((r) => {
  const seen = new Set<Ingredient>()
  return r.steps.some((_, i) => ingredientsForStep(r, i).some((ing) => {
    if (seen.has(ing)) return true
    seen.add(ing)
    return false
  }))
})
ok(dupes.length === 0, 'Keine Zutat in zwei Schritten')

// Abdeckung über alle Rezepte (nur Zutaten mit Menge)
const all = [...RECIPES, ...BREAKFASTS]
let withAmount = 0
let missed = 0
const missFreq = new Map<string, number>()
for (const r of all) {
  const loose = new Set(unmatched(r))
  for (const ing of r.ingredients) {
    if (ing.amount == null) continue
    withAmount++
    if (loose.has(ing)) {
      missed++
      missFreq.set(ing.name, (missFreq.get(ing.name) ?? 0) + 1)
    }
  }
}
const share = ((withAmount - missed) / withAmount) * 100
console.log(`  Abdeckung: ${share.toFixed(1)} % der Zutaten mit Menge (${withAmount - missed} von ${withAmount}) stehen in einem Schritt`)
console.log('  Häufigste nicht zugeordnete Zutaten (zum Prüfen):')
;[...missFreq.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 15)
  .forEach(([n, c], i) => console.log(`    ${String(i + 1).padStart(2)}. ${n} (${c}×)`))
ok(share >= 85, 'Mindestens 85 % der Zutaten mit Menge sind einem Schritt zugeordnet')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
