// Vorrat: Austausch-Gruppen, Vorrats-Modus, freie Eingabe:  npx vite-node scripts/test-pantry.ts
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { CATALOG } from '../src/data/catalog'
import { PRODUCTS } from '../src/data/products'
import { NUTRI } from '../src/data/nutrition'
import { SUBSTITUTE_GROUPS, interchangeable, substitutesFor } from '../src/data/substitutes'
import { searchIngredients } from '../src/customIngredients'
import { pantryWishes } from '../src/learning'
import { formatAmount } from '../src/shopping'
import { addDaysIso, cookDue, takeFromLot, insight, needsOf, pantryCovering, planWeek, uncook, type PantryLot } from '../src/kitchen'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (cond: boolean, msg: string) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++ }

const today = '2026-11-16'
const days = Array.from({ length: 7 }, (_, i) => addDaysIso(today, i))
let n = 0
const lot = (name: string, amount: number, unit: string, d: number): PantryLot => ({ id: 'l' + n++, name, amount, unit, expires: addDaysIso(today, d) })
const ins = (id: string, pantry: PantryLot[], jitter = 0) =>
  insight(RECIPE_BY_ID[id], 2, pantry, today, {}, new Map(), jitter, [], { month: 11, day: today, freshDays: 0 })

// ───── Gruppen ─────
ok(substitutesFor('Spaghetti').includes('Penne') && substitutesFor('Spaghetti').includes('Bandnudeln') && substitutesFor('Spaghetti').includes('Nudeln'), 'Trockenpasta: Spaghetti ← Penne, Bandnudeln, Nudeln')
ok(interchangeable('Bandnudeln', 'Tagliatelle') && interchangeable('Nudeln', 'Fettuccine'), 'Bandnudeln/Nudeln ersetzen Tagliatelle/Fettuccine')
ok(!interchangeable('Spaghetti', 'Gnocchi') && !interchangeable('Spaghetti', 'Tortellini frisch') && !interchangeable('Spaghetti', 'Lasagneplatten') && !interchangeable('Spaghetti', 'Mie-Nudeln'), 'frische Pasta, Gnocchi, Lasagne, Asia-Nudeln nicht austauschbar')
ok(interchangeable('Crème fraîche', 'Schmand') && interchangeable('Schmand', 'Saure Sahne') && !interchangeable('Sahne', 'Schmand'), 'Crème fraîche ↔ Schmand ↔ Saure Sahne, Sahne nicht')
ok(Object.values(SUBSTITUTE_GROUPS).flat().every((x) => PRODUCTS[x] && CATALOG[x]), 'alle Gruppen-Mitglieder haben Katalog + Produkt')
for (const x of ['Crème fraîche', 'Sauce Hollandaise', 'Nudeln', 'Frischkäse', 'Mascarpone']) ok(!!CATALOG[x] && !!PRODUCTS[x] && !!NUTRI[x], `${x}: Katalog, Produkt, Nährwerte`)
ok(PRODUCTS['Sauce Hollandaise'].unit === 'ml' && PRODUCTS['Sauce Hollandaise'].pack === 250 && PRODUCTS['Sauce Hollandaise'].opened === 3, 'Hollandaise: 250 ml, angebrochen 3 Tage')

// ───── Austausch: Empfehlungen ─────
const aglio = RECIPES.find((r) => r.title.startsWith('Spaghetti Aglio'))!
const need = needsOf(aglio, 2).find((x) => x.name === 'Spaghetti')!
const penne = [lot('Penne', 500, 'g', 365)]
const a1 = ins(aglio.id, penne)
const a0 = ins(aglio.id, [])
ok(a1.fromPantry.includes('Penne') && a1.substitutes.some((s) => s.need === 'Spaghetti' && s.with.includes('Penne')), 'insight: Penne im Vorrat deckt Spaghetti-Bedarf (Hinweis „Penne statt Spaghetti“)')
ok(a1.buyCost < a0.buyCost - 0.8 && a1.score > a0.score, `insight: Zukauf sinkt (${a0.buyCost.toFixed(2)} → ${a1.buyCost.toFixed(2)}), Wert steigt`)

// ───── Austausch: Wochenplanung ─────
const plan: WeekPlan = { [days[1]]: { recipeId: aglio.id, servings: 2 } }
const w = planWeek(plan, days, penne, {}, today, {}, formatAmount)
ok(![...w.buy].some((b) => b.name === 'Spaghetti'), 'Einkaufsliste: kein Spaghetti, wenn Penne reicht')
const cov = w.covered.find((c) => c.name === 'Spaghetti')
ok(!!cov && cov.substitutes[0]?.name === 'Penne' && Math.abs(cov.fromPantry - need.amount) < 1e-6, 'Liste: Spaghetti „aus Vorrat: Penne statt Spaghetti“')
const wLess = planWeek(plan, days, [lot('Penne', 100, 'g', 365)], {}, today, {}, formatAmount)
const sp = wLess.buy.find((b) => b.name === 'Spaghetti')
ok(!!sp && sp.packs === 1 && Math.abs(sp.fromPantry - 100) < 1e-6, 'Reicht Penne nicht, wird der Rest als Spaghetti gekauft')
ok(w.leftovers.every((l) => l.name !== 'Penne' || Math.abs(l.amount - (500 - need.amount)) < 1e-6), 'Vorrats-Vorschau zieht die Penne ab')
// offenes Gericht vor der Woche reserviert Penne
const planEarlier: WeekPlan = { [addDaysIso(days[0], -1)]: { recipeId: aglio.id, servings: 2 } }
const wRes = planWeek({ ...planEarlier, [days[2]]: { recipeId: aglio.id, servings: 2 } }, days, [lot('Penne', 200, 'g', 365)], {}, today, {}, formatAmount)
ok(wRes.buy.some((b) => b.name === 'Spaghetti'), 'Penne, die ein früheres offenes Gericht braucht, zählt nicht doppelt')

// ───── Austausch: Kochen & Rückgängig ─────
const cookPlan: WeekPlan = { [days[0]]: { recipeId: aglio.id, servings: 2 } }
const pan = [lot('Penne', 500, 'g', 365)]
const done = cookDue(cookPlan, pan, days[1])
const left = done.pantry.find((l) => l.name === 'Penne')!
ok(Math.abs(left.amount - (500 - need.amount)) < 1e-6, `Kochen zieht Penne ab (${left.amount} g übrig)`)
ok(done.plan[days[0]]!.consumed!.some((c) => c.name === 'Penne'), 'Verbrauch nennt den Posten Penne')
const back = uncook(done.plan[days[0]]!, done.pantry)
ok(Math.abs(back.find((l) => l.name === 'Penne')!.amount - 500) < 1e-6 && !back.some((l) => l.name === 'Spaghetti'), 'Rückgängig stellt Penne wieder her')
ok(Math.abs(pantryCovering(done.pantry, 'Spaghetti') - left.amount) < 1e-6, 'pantryCovering zählt austauschbare Posten')
// Posten selbst zuerst
const both = cookDue(cookPlan, [lot('Penne', 500, 'g', 10), lot('Spaghetti', 500, 'g', 365)], days[1])
ok(both.pantry.find((l) => l.name === 'Spaghetti')!.amount < 500 && both.pantry.find((l) => l.name === 'Penne')!.amount === 500, 'Zutat selbst wird vor dem Ersatz verbraucht')

// ───── Crème fraîche ↔ Schmand ─────
const withSchmand = RECIPES.find((r) => needsOf(r, 2).some((x) => x.name === 'Schmand'))
if (withSchmand) {
  const cf = ins(withSchmand.id, [lot('Crème fraîche', 400, 'g', 20)])
  ok(cf.fromPantry.includes('Crème fraîche'), `Crème fraîche deckt Schmand (${withSchmand.title})`)
}
const generic = ins(aglio.id, [lot('Nudeln', 500, 'g', 365)])
ok(generic.fromPantry.includes('Nudeln') && generic.buyCost < a0.buyCost - 0.8, 'generische Nudeln decken Spaghetti')

// ───── freie Eingabe ─────
const find = (q: string) => searchIngredients(q, 8).filter((x) => PRODUCTS[x] && CATALOG[x] !== 'vorrat')
ok(find('Creme fraiche')[0] === 'Crème fraîche', `„Creme fraiche“ → ${find('Creme fraiche')[0]}`)
ok(find('Crème fraîche')[0] === 'Crème fraîche', '„Crème fraîche“ → Crème fraîche')
ok(find('pasta')[0] === 'Nudeln', `„pasta“ → ${find('pasta')[0]}`)
ok(find('Nudeln')[0] === 'Nudeln', `„Nudeln“ → ${find('Nudeln')[0]}`)
ok(find('Hollandaise')[0] === 'Sauce Hollandaise', `„Hollandaise“ → ${find('Hollandaise')[0]}`)
ok(find('Hack')[0] === 'Hackfleisch gemischt', `„Hack“ → ${find('Hack')[0]}`)
ok(find('Drachenfrucht').length === 0, '„Drachenfrucht“ → kein Treffer (neue Zutat anlegen)')

// ───── Lernen: Wünsche ─────
const wishes = pantryWishes({ 'Sauce Hollandaise': 3, Spaghetti: 5, Drachenfrucht: 1 })
ok(wishes.length === 1 && wishes[0].name === 'Sauce Hollandaise', 'Wünsche: Hollandaise (3×, kaum Rezepte); Spaghetti hat Rezepte, Drachenfrucht nur 1×')

// ───── Vorrats-Modus: deine echten Vorräte ─────
const real: PantryLot[] = [
  lot('Hähnchenbrustfilet', 400, 'g', 2), lot('Champignons', 400, 'g', 4), lot('Ei', 10, 'Stk', 21), lot('Schmand', 400, 'g', 21),
  lot('Sahne', 200, 'ml', 21), lot('Saure Sahne', 200, 'g', 21), lot('Kartoffeln festkochend', 2000, 'g', 30),
  lot('Erbsen und Möhren TK', 200, 'g', 180), lot('Gehackte Tomaten', 1, 'Dose', 365), lot('Tellerlinsen', 500, 'g', 365), lot('Bandnudeln', 500, 'g', 365),
]
const rank = (pantry: PantryLot[], mode: boolean) => {
  const all = RECIPES.map((r) => ({ r, i: ins(r.id, pantry, 0.5) }))
  const list = mode ? all.filter((x) => x.i.fromPantry.length > 0).sort((a, b) => b.i.modeScore - a.i.modeScore) : all.sort((a, b) => b.i.score - a.i.score)
  return list
}
const print = (title: string, l: ReturnType<typeof rank>) => {
  console.log('  ' + title)
  l.slice(0, 10).forEach((x, k) => console.log(`   ${k + 1}. ${x.r.title} – ${x.i.haveCount}/${x.i.needCount} da, Zukauf ${x.i.buyCost.toFixed(2)} €`))
}
const rm = rank(real, true)
print('Echter Vorrat – Vorrats-Modus', rm)
print('Echter Vorrat – normal', rank(real, false))
const top5 = rm.slice(0, 5)
ok(top5.some((x) => x.i.urgent.includes('Hähnchenbrustfilet')), 'echt/Modus: Gerichte mit dem ablaufenden Hähnchen ganz vorn')
ok(top5.some((x) => x.i.fromPantry.includes('Champignons')), 'echt/Modus: Champignon-Gericht unter den ersten 5')
ok(rm.slice(0, 10).some((x) => x.i.fromPantry.includes('Kartoffeln festkochend')), 'echt/Modus: Kartoffel-Gericht unter den ersten 10')
ok(rm.slice(0, 20).some((x) => x.i.fromPantry.includes('Tellerlinsen')) || rm.findIndex((x) => x.i.fromPantry.includes('Tellerlinsen')) < 70, 'echt/Modus: Linsengericht kommt vor (Top 70)')
ok(rm.every((x) => x.i.fromPantry.length > 0), 'Modus: nur Gerichte, die etwas aus dem Vorrat brauchen')
ok(rm.slice(0, 20).some((x) => x.i.fromPantry.includes('Bandnudeln')), 'echt/Modus: Bandnudeln decken Pasta-Gerichte (Top 20)')

// ───── Beispiel-Vorrat aus der Beschwerde ─────
const ex: PantryLot[] = [
  lot('Rinderhackfleisch', 500, 'g', 2), lot('Paprika rot', 3, 'Stk', 5), lot('Sahne', 200, 'ml', 10), lot('Kartoffeln festkochend', 1000, 'g', 30),
  lot('Penne', 500, 'g', 365), lot('Zucchini', 2, 'Stk', 6),
]
const em = rank(ex, true)
const en = rank(ex, false)
print('Beispiel – Vorrats-Modus', em)
print('Beispiel – normal', en)
const uses = (x: (typeof em)[0]) => ['Rinderhackfleisch', 'Paprika rot', 'Penne', 'Kartoffeln festkochend'].some((k) => x.i.fromPantry.includes(k))
ok(em.slice(0, 10).filter(uses).length >= 8, `Beispiel/Modus: ≥ 8 der Top 10 nutzen Hack/Paprika/Penne/Kartoffeln (${em.slice(0, 10).filter(uses).length})`)
ok(em[0].i.fromPantry.includes('Rinderhackfleisch'), 'Beispiel/Modus: Platz 1 nutzt das Hack')
ok(en.slice(0, 30).filter(uses).length >= 12, `Beispiel/normal: ≥ 12 der Top 30 nutzen den Vorrat (${en.slice(0, 30).filter(uses).length})`)
ok(!en.slice(0, 3).some((x) => x.r.title.includes('Rahmspinat') && !uses(x)), 'Beispiel/normal: keine Gerichte ohne Vorrat ganz oben')

// ───── Vorbereitetes Frühstück: cookDue nimmt 1 Portion aus dem Glas-Posten statt der Zutaten ─────
{
  const t = '2026-11-18'
  const lots: PantryLot[] = [
    { id: 'jar', name: 'Herzhafter Linsensalat mit Ei und Feta', amount: 2, unit: 'Glas', expires: '2026-11-17' },
    { id: 'e', name: 'Ei', amount: 10, unit: 'Stk', expires: '2026-12-30' },
  ]
  const bf: WeekPlan = { '2026-11-16': { recipeId: 'linsen-ei-salat', servings: 1, prep: 'jar' }, '2026-11-17': { recipeId: 'linsen-ei-salat', servings: 1, prep: 'jar' } }
  const r = cookDue(bf, lots, t)
  ok(!r.pantry.some((l) => l.id === 'jar') && r.pantry.find((l) => l.id === 'e')?.amount === 10, 'Frühstück vorbereitet: 2 Tage → 2 Gläser weg, keine Eier abgezogen (auch am Ablauftag)')
  ok(r.plan['2026-11-16']!.consumed![0].id === 'jar' && r.plan['2026-11-16']!.prep === 'jar', 'Frühstück vorbereitet: „entnommen“ = das Glas (Rückgängig bringt es zurück)')
  ok(uncook(r.plan['2026-11-16']!, r.pantry).find((l) => l.id === 'jar')?.amount === 1, 'Frühstück vorbereitet: nicht gegessen → Glas zurück in den Vorrat')
  const one = lots.map((l) => ({ ...l }))
  ok(takeFromLot(one, 'jar', 5).length === 1 && !one.some((l) => l.id === 'jar') && takeFromLot(one, 'jar', 1).length === 0, 'takeFromLot: höchstens, was da ist; fehlender Posten → nichts')
}

if (fails) { console.error(`${fails} Fehler`); process.exit(1) }
console.log('Alle Tests OK')
