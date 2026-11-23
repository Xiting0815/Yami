// Grundrezepte (Fonds):  npx vite-node scripts/test-basic.ts
import { BASICS, RECIPES, RECIPE_BY_ID, basicFor } from '../src/data/recipes'
import { formatAmount } from '../src/shopping'
import { addDaysIso, allNeedsOf, cookBasic, cookNow, lotsFor, planWeek, uncook, type PantryLot } from '../src/kitchen'
import { mainProtein } from '../src/learning'
import { substitutesFor } from '../src/data/substitutes'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const near = (a: number, b: number) => Math.abs(a - b) < 1e-6

const today = '2026-11-17'
const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const fond = RECIPE_BY_ID['rinderfond-braun']

// ───── Grundrezepte sind keine Abendessen ─────
ok(BASICS.length >= 2 && BASICS.every((b) => b.basic && (b.yields || b.kind === 'bbq')), 'Grundrezepte vorhanden, mit basic + yields (BBQ: Reste optional)')
ok(!!fond && fond.basic === true && fond.yields?.name === 'Rinderfond selbstgemacht' && fond.yields.amount === 1500, 'Brauner Rinderfond ergibt 1,5 l Rinderfond selbstgemacht')
ok(!!RECIPE_BY_ID['kalbsfond-hell'] && RECIPE_BY_ID['kalbsfond-hell'].yields?.name === 'Kalbsfond selbstgemacht', 'Heller Kalbsfond vorhanden')
ok(BASICS.every((b) => !RECIPES.includes(b)), 'Grundrezepte nicht in RECIPES (Wischstapel, Planung, Abwechslung, Geschmack)')
ok(RECIPES.every((r) => !r.basic), 'keine Abendessen-Karte ist ein Grundrezept')
ok(!!fond.deviceSteps?.length && fond.deviceSteps.some((s) => s.settings?.some((x) => x.device === 'combair' && x.temp === 220)), 'Rinderfond: Knochen im Combair bei 220 °C rösten')
ok(fond.deviceSteps!.some((s) => s.settings?.some((x) => x.device === 'bora' && (x.level === '2' || x.level === '3') && (x.minutes ?? 0) >= 120)), 'Rinderfond: stundenlang auf BORA Stufe 2–3 simmern')

// ───── Tipp-Verknüpfung & Ersatz ─────
ok(basicFor('Rinderfond')?.id === 'rinderfond-braun' && basicFor('Kalbsfond')?.id === 'kalbsfond-hell', 'basicFor: Fond → passendes Grundrezept')
ok(basicFor('Zwiebel') === undefined, 'basicFor: andere Zutaten → kein Grundrezept')
ok(substitutesFor('Rinderfond').includes('Rinderfond selbstgemacht'), 'Rinderfond selbstgemacht ersetzt Rinderfond')

// ───── Fertig gekocht: Zutaten ab, Fond rein ─────
const needs = allNeedsOf(fond, 1)
const stock = (): PantryLot[] => needs.map((n, i) => ({ id: 'z' + i, name: n.name, amount: n.amount * 2, unit: n.unit, expires: addDaysIso(today, 10) }))
const before = stock()
const r = cookBasic(before, fond, 1, today, 'fond1')
ok(r.lot != null && r.lot.name === 'Rinderfond selbstgemacht' && near(r.lot.amount, 1500) && r.lot.unit === 'ml', 'cookBasic: 1500 ml Rinderfond selbstgemacht im Vorrat')
ok(r.lot!.expires === addDaysIso(today, 90), 'cookBasic: haltbar bis heute + 90 Tage (eingefroren)')
const knochen = (p: PantryLot[]) => p.filter((l) => l.name === 'Rinderknochen').reduce((s, l) => s + l.amount, 0)
ok(near(knochen(r.pantry), 2000) && near(knochen(before), 4000), 'cookBasic: Zutaten (2 kg Knochen) abgezogen, Ausgangsvorrat unverändert')
const r2 = cookBasic(stock(), fond, 2, today, 'fond2')
ok(near(r2.lot!.amount, 3000) && near(knochen(r2.pantry), 0), 'cookBasic: 2 Ansätze → doppelte Menge, doppelter Abzug')
// Rückgängig = Stand vor der Aktion (Snapshot) – hier: die entnommenen Posten zurück und den neuen Posten entfernen
const undone = uncook({ recipeId: fond.id, servings: 1, consumed: r.consumed.map((c) => ({ ...c })) }, r.pantry.filter((l) => l.id !== 'fond1'))
ok(near(knochen(undone), 4000) && !undone.some((l) => l.name === 'Rinderfond selbstgemacht'), 'Rückgängig: Zutaten zurück, selbstgemachter Fond wieder weg')
ok(cookBasic(stock(), RECIPE_BY_ID['carbonara'], 2, today).lot === null, 'cookBasic auf normalem Rezept legt nichts an')
ok(formatAmount(1500, 'ml') !== '', `Anzeige der Menge: ${formatAmount(1500, 'ml')}`)

// ───── Selbstgemachter Fond deckt Rezepte und wird zuerst genommen ─────
const roast = RECIPE_BY_ID['rinderschmorbraten-rotwein']
ok(!!roast && roast.ingredients.some((i) => i.name === 'Rinderfond'), 'Rinderschmorbraten braucht Rinderfond')
const fondNeed = allNeedsOf(roast, 2).find((n) => n.name === 'Rinderfond')!.amount
const homemade: PantryLot = { id: 'h', name: 'Rinderfond selbstgemacht', amount: 1500, unit: 'ml', expires: addDaysIso(today, 90) }
const bought: PantryLot = { id: 'b', name: 'Rinderfond', amount: 400, unit: 'ml', expires: addDaysIso(today, 3) } // angebrochen, läuft früher ab
const plan: WeekPlan = { [addDaysIso(today, 1)]: { recipeId: roast.id, servings: 2 } }
const fmt = (a: number | null, u: string) => formatAmount(a, u)
const w = planWeek(plan, days, [homemade], {}, today, {}, fmt, {}, 11)
ok(!w.buy.some((b) => b.name === 'Rinderfond' || b.name === 'Rinderfond selbstgemacht'), 'planWeek: selbstgemachter Fond deckt den Rinderfond – nichts zu kaufen')
ok(w.covered.some((c) => c.name === 'Rinderfond'), 'planWeek: Rinderfond steht bei „schon im Vorrat“')
const left = w.leftovers.find((l) => l.name === 'Rinderfond selbstgemacht')
ok(!!left && near(left.amount, 1500 - fondNeed), 'planWeek: Vorrat danach – selbstgemachter Fond um den Bedarf weniger')
const both = planWeek(plan, days, [bought, homemade], {}, today, {}, fmt, {}, 11)
ok(near(both.leftovers.find((l) => l.id === 'b')!.amount, 400), 'planWeek: gekaufter Fond bleibt unberührt, der selbstgemachte wird verplant')
ok(lotsFor([bought, homemade], 'Rinderfond', today)[0].id === 'h', 'lotsFor: selbstgemachter Fond vor gekauftem, auch wenn der früher abläuft')
const cooked = cookNow({}, [bought, homemade], today, { recipeId: roast.id, servings: 2 })
ok(near(cooked.pantry.find((l) => l.id === 'h')!.amount, 1500 - fondNeed) && near(cooked.pantry.find((l) => l.id === 'b')!.amount, 400), 'Kochen: selbstgemachter Fond zuerst abgezogen')
const tight = cookNow({}, [bought, { ...homemade, amount: 100 }], today, { recipeId: roast.id, servings: 2 })
ok(!tight.pantry.some((l) => l.id === 'h') && near(tight.pantry.find((l) => l.id === 'b')!.amount, 400 - (fondNeed - 100)), 'Kochen: reicht der selbstgemachte nicht, kommt der Rest aus dem Glas')
ok(near(uncook(tight.plan[today]!, tight.pantry).find((l) => l.id === 'h')!.amount, 100), '„Nicht gekocht“: selbstgemachter Fond zurück im Vorrat')

// ───── Lernen: neue Fleischsorten ─────
const prot = (id: string) => mainProtein(RECIPE_BY_ID[id])
ok(prot('ochsenbaeckchen-spaetburgunder') === 'Rind' && prot('roastbeef-remoulade') === 'Rind' && prot('rinderfilet-rotweinjus') === 'Rind', 'Ochsenbäckchen, Roastbeef, Rinderfilet → Rind')
ok(prot('schaeufele-kloesse') === 'Schwein' && prot('krustenbraten-dunkelbier') === 'Schwein', 'Schäufele, Krustenbraten → Schwein')
ok(prot('kalbsbaeckchen-weissweinrahm') === 'Kalb' && prot('kalbshuefte-morchelrahm') === 'Kalb' && prot('kalbsbrust-gefuellt') === 'Kalb', 'Kalbsbäckchen, Kalbshüfte, Kalbsbrust → Kalb')
ok(prot('lammhaxen-polenta') === 'Lamm' && prot('lammkeule-rosmarinjus') === 'Lamm', 'Lammhaxe, Lammkeule → Lamm')
ok(RECIPES.filter((r) => r.ingredients.some((i) => /^(Rinder|Kalbs|Lamm)fond$/.test(i.name)) && !r.vegetarian).length >= 10, 'neue Braten nutzen Fond und sind nicht vegetarisch')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
