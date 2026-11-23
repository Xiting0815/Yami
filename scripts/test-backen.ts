// Backen & Desserts:  npx vite-node scripts/test-backen.ts
import { BASICS, BREAKFASTS, RECIPES, RECIPE_BY_ID, bakeFor, basicFor } from '../src/data/recipes'
import { PRODUCTS } from '../src/data/products'
import { CATALOG } from '../src/data/catalog'
import { substitutesFor } from '../src/data/substitutes'
import { DEVICE_STEPS } from '../src/data/device-steps'
import { EXTRA_GROUPS } from '../src/data/extra'
import { addDaysIso, cookBasic, cookNow, festiveOf, lotsFor, planWeek, type PantryLot } from '../src/kitchen'
import { eatInfo, eatOne, yieldText } from '../src/bake'
import { DEFAULT_PROFILE, dayBalance } from '../src/energy'
import { weekReview } from '../src/review'
import { buildModel, features, preference, summarize } from '../src/learning'
import { sanitize } from '../src/store'
import { backupBody, parseBackup } from '../src/backup'
import { formatAmount } from '../src/shopping'
import { KIND_ICON, KIND_LABEL, isBake, type WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps

const today = '2026-11-17' // Dienstag
const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const tiramisu = RECIPE_BY_ID['tiramisu']
const bienenstich = RECIPE_BY_ID['bienenstich']
const brot = RECIPE_BY_ID['bauernbrot-sauerteig']
const anstell = RECIPE_BY_ID['sauerteig-anstellgut']

// ───── Arten, nicht im Abendessen ─────
ok(!!tiramisu && tiramisu.kind === 'dessert' && !!bienenstich && bienenstich.kind === 'kuchen' && !!brot && brot.kind === 'brot', 'Beispiele: Tiramisu (Dessert), Bienenstich (Kuchen), Bauernbrot (Brot)')
ok(anstell?.kind === 'grundrezept' && RECIPE_BY_ID['rinderfond-braun'].kind === 'grundrezept', 'Anstellgut und Fonds sind Grundrezepte')
ok(BASICS.every((b) => b.basic && (b.yields || b.kind === 'bbq') && b.kind), 'alle Grundrezepte/Backrezepte haben basic, yields und kind')
ok(!RECIPES.some((r) => r.basic || r.kind) && !BREAKFASTS.some((r) => r.basic), 'keine Backrezepte unter Abendessen (Stapel, Plan) oder Frühstück')
ok(features(bienenstich).join() === 'bake:kuchen' && features(tiramisu).join() === 'bake:dessert', 'Lernen: eigenes Muster bake:<Art>, keine Küche/Hauptzutat')
ok(isBake(bienenstich) && !isBake(anstell) && !isBake(RECIPES[0]), 'isBake: nur Dessert/Kuchen/Brot')
ok(Object.values(EXTRA_GROUPS).every((g) => g.recipes.every((r) => g.imageQueries[r.id])), 'jedes Extra-Rezept hat einen Bild-Suchbegriff')
ok(!!DEVICE_STEPS['bienenstich']?.length && !!DEVICE_STEPS['bauernbrot-sauerteig']?.length, 'Geräte-Schritte für Kuchen und Brot')

// ───── Ergebnis: Katalog, Produkt, Nährwerte je Stück ─────
ok(CATALOG['Bienenstich (selbstgebacken)'] === 'backwaren' && PRODUCTS['Bienenstich (selbstgebacken)']?.unit === 'Stk' && PRODUCTS['Bienenstich (selbstgebacken)'].pack === 12, 'Bienenstich (selbstgebacken): Katalog + Produkt 12 Stk automatisch')
ok(PRODUCTS['Bauernbrot selbstgebacken']?.unit === 'Scheibe' && near(PRODUCTS['Bauernbrot selbstgebacken'].pack, 20), 'Bauernbrot: 1000 g → Produkt in 20 Scheiben')
const ppB = bienenstich.yields!.perPiece!
ok(near(ppB.kcal, Math.round(bienenstich.nutrition.kcal / 12), 1.01), `Bienenstich: ${ppB.kcal} kcal/Stück = Rezept ÷ 12`)
ok(near(brot.yields!.perPiece!.kcal, Math.round(brot.nutrition.kcal / 20), 1.01), `Bauernbrot: ${brot.yields!.perPiece!.kcal} kcal/Scheibe = Laib ÷ 20`)
ok(near(tiramisu.yields!.perPiece!.kcal, Math.round(tiramisu.nutrition.kcal / 6), 1.01) && !!tiramisu.lighter, `Tiramisu: ${tiramisu.yields!.perPiece!.kcal} kcal/Portion, mit Leichter-Tipp`)
ok(yieldText(bienenstich, 1) === '12 Stück' && yieldText(tiramisu, 1) === '6 Portionen' && yieldText(brot, 1) === '1 kg (≈ 20 Scheiben)', 'Texte: 12 Stück · 6 Portionen · 1 kg (≈ 20 Scheiben)')

// ───── Fertig gebacken → Vorrat ─────
const stock = (): PantryLot[] => [
  { id: 'mehl', name: 'Weizenmehl', amount: 1000, unit: 'g', expires: '2027-06-01' },
  { id: 'mandel', name: 'Mandelblättchen', amount: 200, unit: 'g', expires: '2027-06-01' },
]
const c = cookBasic(stock(), bienenstich, 1, today, 'bs')
ok(!!c.lot && c.lot.name === 'Bienenstich (selbstgebacken)' && c.lot.amount === 12 && c.lot.unit === 'Stk' && c.lot.expires === addDaysIso(today, 3), 'cookBasic: 12 Stk Bienenstich, hält 3 Tage')
ok(near(c.pantry.find((l) => l.id === 'mehl')!.amount, 625) && near(c.pantry.find((l) => l.id === 'mandel')!.amount, 50), 'cookBasic: Mehl und Mandeln abgezogen')
const cb = cookBasic([], brot, 1, today, 'br')
ok(cb.lot!.unit === 'Scheibe' && near(cb.lot!.amount, 20) && cb.lot!.expires === addDaysIso(today, 5), 'cookBasic Brot: 20 Scheiben im Vorrat, hält 5 Tage')
ok(cookBasic([], anstell, 1, today).lot?.name === 'Anstellgut' && near(cookBasic([], anstell, 1, today).lot!.amount, 200), 'Anstellgut: 200 g in den Vorrat')
ok(basicFor('Anstellgut')?.id === 'sauerteig-anstellgut', 'Tipp im Brot-Rezept: Anstellgut → Sauerteig ansetzen')

// ───── 1 gegessen → Tagesbilanz ─────
ok(eatInfo(c.lot!)?.label === '1 gegessen' && eatInfo(cb.lot!)?.label === '1 Scheibe gegessen', 'Beschriftung: „1 gegessen“ / „1 Scheibe gegessen“')
ok(!eatInfo({ id: 'x', name: 'Anstellgut', amount: 200, unit: 'g', expires: today }) && !eatInfo(stock()[0]), 'kein „gegessen“ bei Anstellgut oder normalen Zutaten')
ok(bakeFor('Bienenstich (selbstgebacken)')?.id === 'bienenstich', 'bakeFor: Vorratsname → Rezept')
const e = eatOne(c.pantry, 'bs', today)
ok(near(e.pantry.find((l) => l.id === 'bs')!.amount, 11) && e.snack?.kcal === ppB.kcal && e.snack?.recipeId === 'bienenstich' && e.snack.date === today, `eatOne: 11 Stück übrig, Snack ${ppB.kcal} kcal`)
const last = eatOne([{ ...c.lot!, amount: 1 }], 'bs', today)
ok(last.pantry.length === 0 && last.snack?.kcal === ppB.kcal, 'eatOne: letztes Stück → Posten weg')
const half = eatOne([{ ...c.lot!, amount: 0.5 }], 'bs', today)
ok(half.snack?.kcal === Math.round(ppB.kcal / 2), 'eatOne: halbes Reststück zählt halb')

const p = DEFAULT_PROFILE
const plan: WeekPlan = { [today]: { recipeId: RECIPES[0].id, servings: 2 } }
const base = dayBalance(p, undefined, plan[today])
const withSnack = dayBalance(p, undefined, plan[today], [e.snack!], today)
ok(withSnack.total === base.total + ppB.kcal && near(withSnack.protein, Math.round(base.protein + ppB.protein), 1.01) && withSnack.snacks === ppB.kcal, 'dayBalance: Stück zählt in kcal und Eiweiß des Tages')
ok(withSnack.dinnerBudget === base.dinnerBudget && withSnack.dinner === base.dinner, 'dayBalance: Abendportion bleibt gleich')
ok(dayBalance(p, undefined, plan[today], [e.snack!], addDaysIso(today, 1)).total === base.total, 'dayBalance: Snack nur am eigenen Tag')

const st0 = sanitize({ profile: p, plan, snacks: [] })
const st1 = sanitize({ profile: p, plan, snacks: [e.snack] })
const r0 = weekReview(st0, days, addDaysIso('2026-11-16', 7))
const r1 = weekReview(st1, days, addDaysIso('2026-11-16', 7))
ok(r1.nutrition.days === 1 && r1.nutrition.avgKcal === r0.nutrition.avgKcal! + ppB.kcal, 'Wochenrückblick: Ø kcal enthält das Stück')

// ───── Selbstgebackenes Brot ersetzt Vollkornbrot ─────
ok(substitutesFor('Vollkornbrot').includes('Bauernbrot selbstgebacken'), 'Bauernbrot selbstgebacken ersetzt Vollkornbrot')
const bought: PantryLot = { id: 'vk', name: 'Vollkornbrot', amount: 10, unit: 'Scheibe', expires: addDaysIso(today, 2) }
const home: PantryLot = { ...cb.lot!, id: 'hb' }
ok(lotsFor([bought, home], 'Vollkornbrot', today)[0].id === 'hb', 'lotsFor: selbstgebackenes zuerst, auch wenn das gekaufte früher abläuft')
const bfDish = BREAKFASTS.find((b) => b.ingredients.some((i) => i.name === 'Vollkornbrot'))!
const bfPlan: WeekPlan = Object.fromEntries(days.slice(0, 5).map((d) => [d, { recipeId: bfDish.id, servings: 1 }]))
const w = planWeek({}, days, [home], {}, today, {}, (a, u) => formatAmount(a, u), bfPlan, 11)
ok(!w.buy.some((b) => b.name === 'Vollkornbrot'), `planWeek: ${bfDish.title} – kein Vollkornbrot kaufen, Bauernbrot im Vorrat deckt es`)
const cooked = cookNow({}, [bought, home], today, { recipeId: bfDish.id, servings: 1 })
ok(cooked.pantry.find((l) => l.id === 'vk')!.amount === 10 && cooked.pantry.find((l) => l.id === 'hb')!.amount < 20, 'Abziehen: Scheibe vom selbstgebackenen Brot, gekauftes bleibt')
ok(basicFor('Vollkornbrot')?.kind === 'brot', 'Tipp im Frühstück: Vollkornbrot → Brot selbst backen')

// ───── Speichern, Sicherung ─────
const dirty = sanitize({
  snacks: [e.snack, { date: 'gestern', name: 'x', kcal: 1, protein: 0 }, { date: today, name: 'Kuchen', kcal: 'viel', protein: 0 }, null],
  baked: [{ date: today, recipeId: 'bienenstich' }, { date: today, recipeId: 'gibts-nicht' }],
  bakeRatings: { [`${today}:bienenstich`]: 'up', [`${today}:gibts-nicht`]: 'up', [`${today}:tiramisu`]: 'super' },
})
ok(dirty.snacks.length === 1 && dirty.snacks[0].recipeId === 'bienenstich', 'sanitize: kaputte Snacks verworfen')
ok(dirty.baked.length === 1 && Object.keys(dirty.bakeRatings).join() === `${today}:bienenstich`, 'sanitize: Gebackenes/Bewertungen nur zu bekannten Rezepten')
ok(sanitize({}).snacks.length === 0 && Array.isArray(sanitize({ snacks: 'x' }).snacks), 'sanitize: fehlende/falsche Liste → leer')
const restored = parseBackup(JSON.stringify(backupBody(dirty)))
ok(restored.snacks.length === 1 && restored.snacks[0].kcal === ppB.kcal && restored.bakeRatings[`${today}:bienenstich`] === 'up' && restored.baked.length === 1, 'Sicherung: Snacks, Gebackenes und Bewertungen kommen zurück')

// ───── Lernen ─────
const m0 = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today })
const m1 = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today, baked: dirty.baked, snacks: [e.snack!, e.snack!], bakeRatings: dirty.bakeRatings })
ok(preference(m1, bienenstich).score > preference(m0, bienenstich).score, 'Lernen: gebacken + gegessen + 👍 → Bienenstich steigt')
ok(preference(m1, RECIPES[0], days[0]).score === preference(m0, RECIPES[0], days[0]).score, 'Lernen: Abendessen bleiben vom Backen unberührt')
ok(summarize(m1).liked.some((l) => l.label === 'Kuchen') || summarize(m1).favorites.some((f) => f.title === 'Bienenstich'), 'Lernen: „Kuchen“/Bienenstich taucht in der Übersicht auf')

// ───── Plätzchen & Cookies (gebaeck) ─────
{
  const geb = BASICS.filter((r) => r.kind === 'gebaeck')
  const kip = RECIPE_BY_ID['vanillekipferl']
  const cookie = RECIPE_BY_ID['chocolate-chip-cookies']
  ok(geb.length >= 17 && geb.every((r) => isBake(r) && r.yields?.unit === 'Stk' && !!r.lighter && !!DEVICE_STEPS[r.id]?.length), `Plätzchen & Cookies: ${geb.length} Rezepte mit Stk, Leichter-Tipp und Geräte-Schritten`)
  ok(KIND_LABEL.gebaeck === 'Plätzchen & Cookies' && KIND_ICON.gebaeck === '🍪' && features(kip).join() === 'bake:gebaeck', 'Art „gebaeck“: Label, Icon, Lernmuster bake:gebaeck')
  ok(kip.yields!.amount === 40 && kip.yields!.shelf >= 14 && /Blechdose/.test(kip.yields!.store ?? ''), 'Vanillekipferl: 40 Stk, Blechdose, mindestens 14 Tage')
  ok(festiveOf(kip, '2026-11-14')?.active === false && festiveOf(kip, '2026-11-15')?.active === true && festiveOf(kip, '2026-12-26')?.active === true && festiveOf(kip, '2026-12-27')?.active === false, 'Plätzchenzeit: 15. Nov. bis 26. Dez.')
  ok(festiveOf(kip, '2026-11-20')?.label === '🎄 Plätzchenzeit' && festiveOf(cookie, '2026-11-20') === undefined, 'Badge nur bei Weihnachtsplätzchen, nicht bei Cookies')
  const cg = cookBasic([{ id: 'x', name: 'Butter', amount: 500, unit: 'g', expires: '2027-06-01' }], kip, 1, today, 'k')
  ok(cg.lot?.unit === 'Stk' && cg.lot.amount === 40 && cg.lot.expires === addDaysIso(today, 28), 'cookBasic: 40 Vanillekipferl, halten 28 Tage')
}

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
