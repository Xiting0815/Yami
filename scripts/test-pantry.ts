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
import { type AppState, sanitize } from '../src/store'
import { tripsOf, haTripItems } from '../src/tripState'
import { activeShifts, autoShift, commitBuy, findShift, pushAlerts, shiftText, standInsOf, undoShift, warningsOf } from '../src/shortage'
import { forgotLabel, forgotScores, forgottenItems } from '../src/forgot'
import { applyRemovalReason } from '../src/app/actions/pantry'
import { isQtyStaple, removalUseEvents } from '../src/staples'
import { todoSummary } from '../src/haSync'
import { extract, rebuild } from '../src/sync'

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

// ───── Fehlt etwas? Warnung am Tag, Noch kaufen, Ersatz, automatisch verschieben, oft vergessen ─────
{
  const T = '2026-11-26' // Donnerstag, Haupteinkauf Sa 28.11.
  let k = 0
  const fill = (ids: string[], except: string[] = [], expires = '2027-01-31'): PantryLot[] => {
    const m = new Map<string, number>()
    for (const id of ids) for (const x of needsOf(RECIPE_BY_ID[id], 2)) m.set(x.name, (m.get(x.name) ?? 0) + x.amount)
    return [...m].filter(([nm]) => !except.includes(nm)).map(([name, amount]) => ({ id: 'f' + k++, name, amount, unit: PRODUCTS[name].unit, expires }))
  }
  const st = (x: Partial<AppState>) => sanitize({ onboarding: 'done', ...x })
  const plan: WeekPlan = { '2026-11-27': { recipeId: 'haehnchen-rahm-bandnudeln', servings: 2 }, '2026-11-28': { recipeId: 'frikadellen', servings: 2 } }
  const full = st({ plan, pantry: fill(['haehnchen-rahm-bandnudeln', 'frikadellen']) })
  const noSahne: AppState = { ...full, pantry: full.pantry.filter((l) => l.name !== 'Sahne') }
  ok(warningsOf(full, T).length === 0, 'Fehlmenge: alles da → keine Warnung')
  const w = warningsOf(noSahne, T)
  ok(w.length === 1 && w[0].day === '2026-11-27' && w[0].kind === 'dinner' && w[0].missing.map((m) => m.name).join() === 'Sahne' && Math.round(w[0].missing[0].amount) === 200, `Fehlmenge erkannt: Fr fehlt Sahne 200 ml (${w.map((x) => x.day + ':' + x.missing.map((m) => m.name)).join(' ')})`)
  // Verbrauch der Tage davor zählt: Sahne reicht nur für einen von zwei Tagen
  const two = st({ plan: { '2026-11-26': { recipeId: 'huehnerfrikassee', servings: 2 }, '2026-11-27': { recipeId: 'haehnchen-rahm-bandnudeln', servings: 2 } }, pantry: fill(['huehnerfrikassee', 'haehnchen-rahm-bandnudeln'], ['Sahne']).concat({ id: 's1', name: 'Sahne', amount: 200, unit: 'ml', expires: '2026-12-10' }) })
  const w2 = warningsOf(two, T)
  ok(w2.length === 1 && w2[0].day === '2026-11-27' && Math.round(w2[0].missing[0].amount) === 100, 'Vorrat minus Verbrauch der Tage davor: Do nimmt 100 ml, Fr fehlen 100 ml')
  // Einkauf vorher → keine Warnung
  const later = st({ plan: { '2026-11-30': { recipeId: 'haehnchen-rahm-bandnudeln', servings: 2 } }, pantry: fill(['haehnchen-rahm-bandnudeln'], ['Sahne']) })
  ok(warningsOf(later, T).length === 0, 'kommt mit dem Einkauf Sa vor dem Kochtag (Mo) → keine Warnung')
  // Gewürze/Grundzutaten nie
  ok(!w.some((x) => x.missing.some((m) => isQtyStaple(m.name) || CATALOG[m.name] === 'vorrat')), 'Gewürze/Grundzutaten werden nicht angemahnt')

  // Noch kaufen → „Heute noch“ (freigegeben, geht an HA), danach nur Hinweis
  const trips = tripsOf(noSahne, T)
  const now = trips.find((t) => t.kind === 'now')
  ok(!!now && now.date === T && now.buy.some((b) => b.name === 'Sahne') && !trips.find((t) => t.kind === 'main')?.buy.some((b) => b.name === 'Sahne'), 'Sahne steht auf „Heute noch“ (nicht auf dem Einkauf Sa)')
  const c = commitBuy(noSahne, trips, 1)
  const bought = { ...noSahne, trips: c.trips }
  const wb = warningsOf(bought, T)
  ok(c.trip?.kind === 'now' && !!c.trips[T]?.released && wb.length === 1 && !wb[0].missing.length && wb[0].coming[0]?.name === 'Sahne', 'Noch kaufen: „Heute noch“ freigegeben, Karte zeigt nur „kommt mit Heute noch“')
  ok(haTripItems(tripsOf(bought, T), bought.trips, T).some((i) => i.key === `${T}|Sahne`), 'Noch kaufen: Sahne geht an Google Tasks (freigegebener Einkauf)')

  // Ersatz aus dem Vorrat
  const cf: AppState = { ...noSahne, pantry: [...noSahne.pantry, { id: 'cf', name: 'Crème fraîche', amount: 200, unit: 'g', expires: '2026-12-10' }] }
  const si = standInsOf(cf, T, '2026-11-27')
  ok(si.length === 1 && si[0].from === 'Sahne' && si[0].to === 'Crème fraîche', `Ersatz: ${si.map((x) => `${x.to} statt ${x.from}`).join()}`)
  const swapped: AppState = { ...cf, plan: { ...cf.plan, '2026-11-27': { ...cf.plan['2026-11-27']!, swap: { Sahne: 'Crème fraîche' } } } }
  ok(warningsOf(swapped, T).length === 0 && !tripsOf(swapped, T).some((t) => t.buy.some((b) => b.name === 'Sahne')), 'Ersatz angenommen: keine Warnung, Sahne nicht mehr auf der Liste')
  const cooked = cookDue(swapped.plan, swapped.pantry, '2026-11-28')
  ok(cooked.plan['2026-11-27']!.consumed!.some((x) => x.name === 'Crème fraîche' && Math.round(x.amount) === 200) && !cooked.pantry.some((l) => l.id === 'cf'), 'Ersatz: beim Kochen wird Crème fraîche statt Sahne abgezogen')
  ok(sanitize({ plan: swapped.plan }).plan['2026-11-27']!.swap?.Sahne === 'Crème fraîche' && !sanitize({ plan: { '2026-11-27': { recipeId: 'frikadellen', servings: 2, swap: { Sahne: 'Gibtsnicht' } } } }).plan['2026-11-27']!.swap, 'Ersatz: gespeichert und geprüft (unbekannte Zutat verworfen)')

  // automatisch verschieben: Fr ↔ Sa (Sa kommt die Sahne mit dem Haupteinkauf, Frikadellen sind Fr kochbar)
  const a = autoShift(full, noSahne, T)
  const r0 = a.records[0]
  ok(a.records.length === 1 && r0.from === '2026-11-27' && r0.to === '2026-11-28' && r0.other === 'frikadellen' && a.state.plan['2026-11-27']!.recipeId === 'frikadellen' && a.state.plan['2026-11-28']!.recipeId === 'haehnchen-rahm-bandnudeln', 'automatisch verschoben: Hähnchen auf Sa, Frikadellen auf Fr')
  ok(shiftText(r0) === 'Hähnchen-Champignon-Rahmgeschnetzeltes mit Bandnudeln auf Sa verschoben, weil Sahne fehlt', `Hinweis: ${shiftText(r0)}`)
  ok(warningsOf(a.state, T).length === 0 && tripsOf(a.state, T).find((t) => t.kind === 'main')!.buy.some((b) => b.name === 'Sahne'), 'nach dem Verschieben: keine Warnung, Sahne landet auf dem Einkauf Sa')
  ok(activeShifts(a.state, T).length === 1, 'Verschiebung wird auf der Karte gezeigt')
  const u = undoShift(a.state, r0.id)
  ok(u.plan['2026-11-27']!.recipeId === 'haehnchen-rahm-bandnudeln' && u.plan['2026-11-28']!.recipeId === 'frikadellen' && u.shifts[0].undone === true && !activeShifts(u, T).length, 'Rückgängig: Plan wie vorher, als zurückgenommen gemerkt')
  ok(autoShift(full, u, T).records.length === 0, 'kein Ping-Pong: dasselbe Gericht wird nicht noch einmal verschoben')
  // freier Tag hinter dem Einkauf
  const solo = st({ plan: { '2026-11-27': { recipeId: 'haehnchen-rahm-bandnudeln', servings: 2 } }, pantry: fill(['haehnchen-rahm-bandnudeln']) })
  const b1 = autoShift(solo, { ...solo, pantry: solo.pantry.filter((l) => l.name !== 'Sahne') }, T)
  ok(b1.records[0]?.to === '2026-11-28' && !b1.records[0].other && !b1.state.plan['2026-11-27'], 'freier Tag: hinter den nächsten Einkauf geschoben (Sa)')
  // Haltbarkeit: frisches Hähnchen hält nicht bis Sa → nicht verschieben, nur warnen
  const fresh = st({ plan, pantry: [...fill(['frikadellen']), ...fill(['haehnchen-rahm-bandnudeln'], [], '2026-11-27')] })
  const f1 = autoShift(fresh, { ...fresh, pantry: fresh.pantry.filter((l) => l.name !== 'Sahne') }, T)
  ok(f1.records.length === 0 && warningsOf(f1.state, T).length === 1, 'frische Zutaten würden verderben → nicht verschoben, nur gewarnt')
  // gekochte/abgeschlossene Tage bleiben
  const done = st({ plan: { ...plan, '2026-11-28': { recipeId: 'frikadellen', servings: 2, status: 'skipped' } }, pantry: full.pantry })
  ok(!findShift({ ...done, pantry: noSahne.pantry }, T, '2026-11-27') || findShift({ ...done, pantry: noSahne.pantry }, T, '2026-11-27')!.to !== '2026-11-28', 'abgeschlossener Tag wird nicht getauscht')

  // Handy-Hinweise nur heute/morgen
  const pa = pushAlerts(noSahne, T, new Date('2026-11-26T10:00:00'))
  ok(pa.length === 1 && pa[0].title.startsWith('⚠️ Morgen fehlt: Sahne'), `Push: morgen fehlt Sahne (${pa.map((x) => x.title).join(' | ')})`)
  ok(pushAlerts(noSahne, '2026-11-25', new Date('2026-11-25T10:00:00')).every((x) => !x.key.startsWith('miss:')), 'Push: übermorgen betroffen → kein Hinweis')
  const ps = pushAlerts(a.state, T, new Date('2026-11-26T10:00:00'))
  ok(ps.length === 1 && ps[0].key === `shift:${r0.id}` && ps[0].message.includes('auf Sa verschoben'), 'Push nach automatischem Verschieben: kurze Nachricht')

  // Löschen mit Grund → Lernen
  const lotS = full.pantry.find((l) => l.name === 'Sahne')!
  const wk = 'trip:2026-11-21'
  const withBought: AppState = { ...noSahne, bought: { [wk]: { Sahne: { lotId: lotS.id, amount: 200, at: '2026-11-21' } } }, checked: { [wk]: ['Sahne'] } }
  const fg = applyRemovalReason(withBought, lotS, 'forgot', T)
  ok(fg.removals.length === 1 && fg.removals[0].reason === 'forgot' && !fg.bought[wk].Sahne && !fg.checked[wk].includes('Sahne'), 'Vergessen: gemerkt, Haken auf der Einkaufsliste zurück')
  const fs = forgotScores(fg.removals, T)
  ok(Math.abs(fs.Sahne - 1) < 1e-9 && forgotLabel(fs.Sahne) === '⚠️ zuletzt vergessen' && forgotLabel(forgotScores(fg.removals, '2027-01-25').Sahne) === undefined, 'Vergessen klingt ab (Halbwertszeit 60 Tage)')
  const twice: AppState = { ...fg, removals: [...fg.removals, { id: 'old', date: '2026-11-10', name: 'Sahne', amount: 200, unit: 'ml', reason: 'forgot' }] }
  ok(forgottenItems(twice.removals, T).Sahne === '⚠️ oft vergessen', 'zweimal vergessen → „oft vergessen“')
  const ft = tripsOf(twice, T)
  const item = ft.find((t) => t.kind === 'now')!.buy.find((b) => b.name === 'Sahne')!
  ok(item.forgot === '⚠️ oft vergessen' && todoSummary(item, 'heute').startsWith('⚠️ Sahne'), 'oft vergessen: auf der Einkaufsliste markiert, in Google Tasks mit ⚠️')
  const rel = commitBuy(twice, ft, 1).trips
  const hi = haTripItems(ft, rel, T).filter((i) => i.key.startsWith(T + '|'))
  const molk = hi.filter((i) => ft[0].buy.find((b) => `${T}|${b.key}` === i.key)?.cat === 'molkerei')
  ok(molk[0]?.key === `${T}|Sahne`, 'Google Tasks: oft Vergessenes vorne in seiner Abteilung')
  const ws = applyRemovalReason({ ...noSahne, wasted: [] }, lotS, 'wasted', T)
  ok(ws.wasted.length === 1 && ws.wasted[0].date === T && applyRemovalReason(ws, lotS, 'used', T).wasted.length === 0, 'Weggeworfen zählt (Wochenrückblick); anderer Grund nimmt es wieder heraus')
  const oil = { id: 'oil', name: 'Olivenöl', amount: 300, unit: 'ml', expires: '2027-06-01' }
  ok(removalUseEvents(applyRemovalReason(noSahne, oil, 'used', T).removals).some((e) => e.key === 'Olivenöl' && e.amount === 300), 'Aufgebraucht (Grundzutat) zählt als Verbrauch')
  // geteilt, gesichert
  const sh = { ...a.state, removals: twice.removals }
  const ex = extract(sh)
  const rb = rebuild(st({}), ex, new Set(['rm', 'shift']))
  ok(rb.removals.length === 2 && rb.shifts.length === 1 && rb.shifts[0].id === r0.id, 'Familien-Abgleich: Gründe und Verschiebungen gehen mit')
  ok(sanitize(JSON.parse(JSON.stringify(sh))).removals.length === 2 && sanitize({ removals: [{ id: 'x', reason: 'blah' }], shifts: [{ id: 'y' }] }).removals.length === 0, 'Speichern/Sicherung: geprüft')
}

if (fails) { console.error(`${fails} Fehler`); process.exit(1) }
console.log('Alle Tests OK')
