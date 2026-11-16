// Grundzutaten: Mengen-Grundzutaten (Öl, Brühe, Mehl …), Gewürze (da/alle), Lernen:  npx vite-node scripts/test-staples.ts
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { CATALOG } from '../src/data/catalog'
import { PRODUCTS } from '../src/data/products'
import { NUTRI } from '../src/data/nutrition'
import { substitutesFor, interchangeable } from '../src/data/substitutes'
import { formatAmount, isBought, packText } from '../src/shopping'
import { addDaysIso, cookDue, planWeek, stapleNeedsOf, uncook, type PantryLot, type BoughtMap } from '../src/kitchen'
import {
  buyName, defaultAmount, isQtyStaple, isSpice, lastsText, rememberStaples, roughAmount, runningLow, stapleHints, stapleKey,
  toggleSpiceBought, useEvents, useRate, type SpiceStatus, type StapleMemos,
} from '../src/staples'
import { sanitize } from '../src/store'
import type { Recipe, WeekPlan } from '../src/types'

let fails = 0
const ok = (cond: boolean, msg: string) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++ }
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps

const today = '2026-11-16'
const days = Array.from({ length: 7 }, (_, i) => addDaysIso(today, i))
let n = 0
const lot = (name: string, amount: number, d = 300): PantryLot => ({ id: 'l' + n++, name, amount, unit: PRODUCTS[name].unit, expires: addDaysIso(today, d) })

/** kleines Test-Rezept (wird nur direkt an die Funktionen gegeben) */
const rec = (ings: string[]): Recipe => ({
  id: 't', title: 'Test', meal: 'dinner', cuisine: 'de', type: 'haupt', time: 30, servings: 2, steps: [], vegetarian: true,
  nutrition: { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 },
  ingredients: ings.map((s) => {
    const m = s.match(/^([\d.]+) (\S+) (.+)$/)
    return m ? { name: m[3], amount: parseFloat(m[1]), unit: m[2] } : { name: s, amount: null, unit: '' }
  }),
})

// ───── Daten ─────
const staples = Object.keys(CATALOG).filter((x) => CATALOG[x] === 'vorrat')
ok(staples.every((x) => !!PRODUCTS[SHORT(x)] && !!NUTRI[x]), 'jede Grundzutat (Menge & Gewürz) hat Produkt und Nährwerte')
function SHORT(x: string) { return ({ 'Pfeffer schwarz grob': 'Pfeffer', Pfefferkörner: 'Pfeffer', 'Kümmel gemahlen': 'Kümmel', Frittieröl: 'Sonnenblumenöl' } as Record<string, string>)[x] ?? x }
ok(PRODUCTS.Olivenöl.pack === 750 && PRODUCTS.Olivenöl.unit === 'ml' && PRODUCTS.Sonnenblumenöl.pack === 1000, 'Olivenöl 750 ml, Sonnenblumenöl 1 l')
ok(isQtyStaple('Olivenöl') && isQtyStaple('Gemüsebrühe Würfel') && !isQtyStaple('Salz') && isSpice('Muskatnuss') && !isSpice('Olivenöl'), 'Art: Menge vs. Gewürz')
ok(PRODUCTS['Gemüsebrühe Pulver'].pack === 7500 && PRODUCTS['Gemüsebrühe Würfel'].pack === 4000 && PRODUCTS['Gemüsebrühe flüssig'].pack === 1000, 'Brühen-Formen in ml fertiger Brühe (7,5 l / 4 l / 1 l)')
ok(['Gemüsebrühe', 'Hühnerbrühe', 'Rinderbrühe'].every((b) => substitutesFor(b).length === 3 && interchangeable(b, `${b} Würfel`)), 'Brühe und ihre drei Formen sind eine Austausch-Gruppe')
ok(NUTRI['Hühnerbrühe Würfel'] === NUTRI['Hühnerbrühe'], 'Nährwerte der Form = Brühe je ml')
ok(packText({ packs: 1, product: PRODUCTS['Gemüsebrühe Pulver'] } as never) === '1 Glas (ergibt 7,5 l)', 'Anzeige „1 Glas (ergibt 7,5 l)“')
ok(roughAmount(5000, 'ml') === 'ca. 5 l' && roughAmount(2500, 'ml') === 'ca. 2,5 l' && roughAmount(300, 'ml') === 'ca. 300 ml', 'freundliche Menge im Vorrat')

// ───── Abziehen: „2 EL Olivenöl“, Standardmengen ─────
const r1 = rec(['2 EL Olivenöl', '1 TL Sojasauce', '200 g Spaghetti', 'Salz'])
const need1 = stapleNeedsOf(r1, 2)
ok(near(need1.find((x) => x.name === 'Olivenöl')!.amount, 30) && near(need1.find((x) => x.name === 'Sojasauce')!.amount, 5) && !need1.some((x) => x.name === 'Salz' || x.name === 'Spaghetti'), '2 EL Olivenöl = 30 ml, 1 TL Sojasauce = 5 ml, Gewürze/normale Zutaten nicht dabei')
ok(near(stapleNeedsOf(r1, 4).find((x) => x.name === 'Olivenöl')!.amount, 60), 'Portionen skalieren die Menge')
const r2 = rec(['Olivenöl', 'Weizenmehl', 'Sonnenblumenöl', 'Frittieröl', 'Pfeffer'])
const need2 = stapleNeedsOf(r2, 2)
ok(near(need2.find((x) => x.name === 'Olivenöl')!.amount, 15) && near(need2.find((x) => x.name === 'Weizenmehl')!.amount, 5), 'Zeile ohne Menge: 15 ml Öl, 5 g Mehl als Standard')
ok(near(need2.find((x) => x.name === 'Sonnenblumenöl')!.amount, 30), 'Frittieröl zählt als Sonnenblumenöl (15 + 15 ml)')
ok(defaultAmount('Olivenöl') === 15 && defaultAmount('Weizenmehl') === 5 && defaultAmount('Gemüsebrühe') === 0, 'Standardmengen')
const r3 = rec(['1 EL Honig', '2 TL Zucker', '3 EL Weizenmehl', '1 Prise Zucker', '1 EL Speisestärke', '2 TL Backpulver'])
const need3 = Object.fromEntries(stapleNeedsOf(r3, 2).map((x) => [x.name, x.amount]))
ok(near(need3.Honig, 20) && near(need3.Zucker, 9) && near(need3.Weizenmehl, 30) && near(need3.Speisestärke, 10) && near(need3.Backpulver, 0.6), 'Löffel & Prisen in g / Päckchen umgerechnet')

// echtes Gericht kochen: Olivenöl wird abgezogen
const withOil = RECIPES.find((r) => r.ingredients.some((i) => i.name === 'Olivenöl' && i.unit === 'EL' && i.amount === 2) && r.servings === 2)!
const oilNeed = stapleNeedsOf(withOil, 2).find((x) => x.name === 'Olivenöl')!.amount
const cookPlan: WeekPlan = { [days[0]]: { recipeId: withOil.id, servings: 2 } }
const pan0 = [lot('Olivenöl', 750)]
const done = cookDue(cookPlan, pan0, days[1])
ok(near(done.pantry.find((l) => l.name === 'Olivenöl')!.amount, 750 - oilNeed) && oilNeed >= 30, `Kochen zieht Olivenöl ab (${oilNeed} ml, ${withOil.title})`)
const back = uncook(done.plan[days[0]]!, done.pantry)
ok(near(back.find((l) => l.name === 'Olivenöl')!.amount, 750), 'Rückgängig stellt das Öl wieder her')
ok(cookDue(cookPlan, [], days[1]).pantry.length === 0, 'ohne Öl im Vorrat passiert nichts (wird nicht erzwungen)')

// ───── Brühe: Formen decken den Bedarf (ml-Äquivalent) ─────
const broth = RECIPES.find((r) => r.ingredients.some((i) => i.name === 'Gemüsebrühe') && r.servings === 2)!
const brothNeed = stapleNeedsOf(broth, 2).find((x) => x.name === 'Gemüsebrühe')!.amount
ok(brothNeed > 0, `Brühe-Bedarf (${broth.title}): ${brothNeed} ml`)
const week = (pantry: PantryLot[], over: { plan?: WeekPlan; bought?: BoughtMap; memo?: StapleMemos; spices?: Record<string, SpiceStatus> } = {}) =>
  planWeek(over.plan ?? { [days[2]]: { recipeId: broth.id, servings: 2 } }, days, pantry, over.bought ?? {}, today, {}, formatAmount, {}, 11, {
    memo: over.memo ?? rememberStaples({}, pantry), spices: over.spices,
  })
const inList = (w: ReturnType<typeof week>, name: string) => [...w.buy, ...w.covered].find((x) => x.name === name || x.key === name)
const wW = week([lot('Gemüsebrühe Würfel', 4000)])
ok(!wW.buy.some((b) => stapleKey(b.name) === 'Gemüsebrühe') && !!wW.covered.find((c) => c.key === 'Gemüsebrühe'), 'Würfel (4 l) decken den Brühe-Bedarf – nichts zu kaufen')
ok(wW.leftovers.find((l) => l.name === 'Gemüsebrühe Würfel') && near(wW.leftovers.find((l) => l.name === 'Gemüsebrühe Würfel')!.amount, 4000 - brothNeed), 'Vorrats-Vorschau zieht den Bedarf von den Würfeln ab')
for (const [form, amt] of [['Gemüsebrühe Pulver', 7500], ['Gemüsebrühe flüssig', 1000]] as const) {
  const w = week([lot(form, amt)])
  ok(brothNeed <= amt ? !w.buy.some((b) => stapleKey(b.name) === 'Gemüsebrühe') : w.buy.length > 0, `${form} (${amt} ml) deckt ${brothNeed} ml: ${brothNeed <= amt ? 'ja' : 'nein'}`)
}
// gemischte Formen teilen sich den Bedarf, Abziehen nimmt von beiden (früheres Ablaufdatum zuerst)
const mixed = [lot('Gemüsebrühe flüssig', 200, 10), lot('Gemüsebrühe Würfel', 4000, 300)]
const dMix = cookDue({ [days[0]]: { recipeId: broth.id, servings: 2 } }, mixed, days[1])
const fl = dMix.pantry.find((l) => l.name === 'Gemüsebrühe flüssig')
const wu = dMix.pantry.find((l) => l.name === 'Gemüsebrühe Würfel')!
ok(!fl && near(wu.amount, 4000 - (brothNeed - 200)), 'Kochen: erst die flüssige Brühe (früher ablaufend), den Rest die Würfel')
// zu wenig → Bedarf als Form kaufen (Rest fehlt)
const wLow = week([lot('Gemüsebrühe flüssig', 100)])
const bl = wLow.buy.find((b) => stapleKey(b.name) === 'Gemüsebrühe')
ok(!!bl && bl.name === 'Gemüsebrühe flüssig' && bl.note === 'knapp' && bl.packs === Math.ceil((brothNeed - 100) / 1000), 'zu wenig: gekauft wird die geführte Form, markiert „wird knapp“')

// ───── Lernen: Form für den Einkauf ─────
ok(buyName('Gemüsebrühe', {}) === 'Gemüsebrühe Pulver' && buyName('Olivenöl', {}) === 'Olivenöl', 'Standard: Brühe als Pulver')
let memo: StapleMemos = rememberStaples({}, [lot('Gemüsebrühe Pulver', 7500)])
ok(memo.Gemüsebrühe.form === 'Gemüsebrühe Pulver', 'merkt Pulver')
memo = rememberStaples(memo, [lot('Gemüsebrühe Pulver', 7000), lot('Gemüsebrühe Würfel', 4000)])
ok(memo.Gemüsebrühe.form === 'Gemüsebrühe Würfel', 'neu dazugekommene Form (Würfel) wird die bevorzugte')
ok(rememberStaples(memo, [lot('Gemüsebrühe Pulver', 7000), lot('Gemüsebrühe Würfel', 3000)]) === memo, 'unverändert → gleiche Referenz (kein Neu-Rendern)')
memo = rememberStaples(memo, [])
ok(memo.Gemüsebrühe.form === 'Gemüsebrühe Würfel' && memo.Gemüsebrühe.present.length === 0, 'Vorrat leer: Form und „führe ich“ bleiben gemerkt')
const wLearn = week([], { memo })
const bLearn = wLearn.buy.find((b) => stapleKey(b.name) === 'Gemüsebrühe')
ok(!!bLearn && bLearn.name === 'Gemüsebrühe Würfel' && packText(bLearn) .includes('Pck') && packText(bLearn).includes('ergibt 4 l'), `leer, aber gemerkt: kauft „${bLearn?.name}“ (${bLearn && packText(bLearn)})`)
const wDef = week([], { memo: { Gemüsebrühe: { form: 'Gemüsebrühe Pulver', present: [] } } })
ok(wDef.buy.find((b) => stapleKey(b.name) === 'Gemüsebrühe')?.name === 'Gemüsebrühe Pulver', 'Pulver gemerkt → Pulver')
// gekaufte Form wird abgehakt und bleibt als erledigt
const lotB = lot('Gemüsebrühe Würfel', 4000)
const wBought = week([lotB], { memo: { Gemüsebrühe: { form: 'Gemüsebrühe Würfel', present: [] } }, bought: { 'Gemüsebrühe Würfel': { lotId: lotB.id, amount: 4000 } } })
const bb = wBought.buy.find((b) => b.name === 'Gemüsebrühe Würfel')
ok(!!bb && isBought(bb), 'abgehakte Brühe bleibt als erledigt auf der Liste (Vorrat vor dem Einkauf rekonstruiert)')

// ───── Einkaufsliste (Regel c) ─────
const oilRec = rec(['4 EL Olivenöl'])
RECIPE_BY_ID['t-oil'] = { ...oilRec, id: 't-oil', title: 'Ölgericht' }
const oilPlan: WeekPlan = { [days[2]]: { recipeId: 't-oil', servings: 2 } } // 60 ml
const wNone = week([], { plan: oilPlan })
ok(!wNone.buy.some((b) => b.name === 'Olivenöl') && wNone.staples.some((s) => s.name === 'Olivenöl'), 'nie geführt: Olivenöl bleibt bei „Vorrat prüfen“, wird nicht zum Kauf')
const wEnough = week([lot('Olivenöl', 750)], { plan: oilPlan })
ok(!wEnough.buy.some((b) => b.name === 'Olivenöl') && wEnough.covered.some((c) => c.name === 'Olivenöl') && !wEnough.staples.some((s) => s.name === 'Olivenöl'), 'geführt und genug: gedeckt (weder Kauf noch „Vorrat prüfen“)')
const wShort = week([lot('Olivenöl', 40)], { plan: oilPlan })
const oShort = wShort.buy.find((b) => b.name === 'Olivenöl')
ok(!!oShort && oShort.packs === 1 && oShort.cat === 'konserven' && oShort.note === 'knapp' && near(oShort.cost, 6.99), 'geführt, aber 40 ml < 60 ml: Olivenöl auf der Liste (Konserven & Trockenware, „wird knapp“, 6,99 €)')
const wUsedUp = week([], { plan: oilPlan, memo: { Olivenöl: { form: 'Olivenöl', present: [] } } })
ok(wUsedUp.buy.some((b) => b.name === 'Olivenöl'), 'aufgebraucht (Lot weg, aber gemerkt): wird gekauft')

// ───── Gewürze: da / alle ─────
const spicePlan: WeekPlan = { [days[2]]: { recipeId: broth.id, servings: 2 } }
const spiceRec = RECIPES.find((r) => r.ingredients.some((i) => i.name === 'Muskatnuss'))!
const sp = (spices: Record<string, SpiceStatus>, plan: WeekPlan = { [days[3]]: { recipeId: spiceRec.id, servings: 2 } }, bought: BoughtMap = {}) => week([], { plan, spices, bought })
const sUntracked = sp({})
ok(sUntracked.staples.some((s) => s.name === 'Muskatnuss') && !sUntracked.buy.some((b) => b.name === 'Muskatnuss'), 'Gewürz ohne Status: bei „Vorrat prüfen“')
const sDa = sp({ Muskatnuss: 'da' })
ok(!sDa.staples.some((s) => s.name === 'Muskatnuss') && !sDa.buy.some((b) => b.name === 'Muskatnuss'), 'Gewürz „da“: nirgends auf der Liste')
const sAlle = sp({ Muskatnuss: 'alle' })
const mus = sAlle.buy.find((b) => b.name === 'Muskatnuss')
ok(!!mus && mus.note === 'alle' && mus.packs === 1 && near(mus.cost, 1.39) && mus.cat === 'konserven' && !sAlle.staples.some((s) => s.name === 'Muskatnuss'), 'Gewürz „alle“: echter Artikel (30 g für 1,39 €), nicht mehr bei „Vorrat prüfen“')
ok(!!mus && mus.recipes.includes(spiceRec.title), 'nennt das Gericht, das es braucht')
ok(near(sAlle.total - sUntracked.total, mus!.cost), 'Gewürz zählt in die Summe')
ok(sAlle.leftovers.every((l) => l.name !== 'Muskatnuss'), 'Gewürz taucht nicht als Vorratsposten auf')
// alias: Pfeffer schwarz grob zählt unter Pfeffer
const pfRec = RECIPES.find((r) => r.ingredients.some((i) => i.name === 'Pfeffer schwarz grob' || i.name === 'Pfefferkörner'))!
const sPf = sp({ Pfeffer: 'alle' }, { [days[3]]: { recipeId: pfRec.id, servings: 2 } })
ok(sPf.buy.some((b) => b.name === 'Pfeffer') && !sPf.staples.some((s) => /Pfeffer/.test(s.name) && s.name !== 'Pfeffer weiß'), 'Pfeffer-Varianten teilen sich Status und Packung')
// abhaken → wieder „da“, Haken bleibt; Abwählen → wieder „alle“
const t1 = toggleSpiceBought({ Muskatnuss: 'alle' }, {}, 'Muskatnuss', 30)
ok(t1.on && t1.spices.Muskatnuss === 'da' && t1.bought.Muskatnuss.amount === 30, 'Abhaken: Status „da“')
const sBought = sp(t1.spices, undefined, t1.bought)
const mb = sBought.buy.find((b) => b.name === 'Muskatnuss')
ok(!!mb && isBought(mb), 'abgehakt bleibt der Artikel als erledigt sichtbar (Haken)')
const t2 = toggleSpiceBought(t1.spices, t1.bought, 'Muskatnuss', 30)
ok(!t2.on && t2.spices.Muskatnuss === 'alle' && !t2.bought.Muskatnuss, 'Wieder abwählen: zurück zu „alle“')
// „alle“ gilt auch ohne Bedarf in dieser Woche
const sNoNeed = planWeek({ [days[2]]: { recipeId: broth.id, servings: 2 } }, days, [], {}, today, {}, formatAmount, {}, 11, { spices: { Currypulver: 'alle' } })
ok(sNoNeed.buy.some((b) => b.name === 'Currypulver'), '„alle“ steht auf der Liste, auch wenn diese Woche nicht gebraucht')

// ───── Lernen: Verbrauch, „bald leer“ ─────
// 8 Kochtage in den letzten 3 Wochen, je 50 ml Olivenöl
const past: WeekPlan = {}
const lotOld = (a: number): PantryLot[] => [lot('Olivenöl', a)]
for (let i = 1; i <= 8; i++) {
  const d = addDaysIso(today, -i * 2)
  past[d] = { recipeId: 't-oil', servings: 2, status: 'cooked', consumed: [{ id: 'x', name: 'Olivenöl', amount: 50, unit: 'ml', expires: addDaysIso(today, 100) }] }
}
const ev = useEvents(past, {})
ok(ev.length === 8 && ev.every((e) => e.key === 'Olivenöl'), 'Verbrauch aus gekochten Gerichten gelesen')
const rate = useRate(ev, 'Olivenöl', today)!
ok(rate != null && rate > 20 && rate < 30, `Verbrauch ≈ ${rate?.toFixed(1)} ml/Tag (8×50 ml in ~16 Tagen)`)
ok(useRate(ev.slice(0, 1), 'Olivenöl', today) === null, 'ein einziges Mal reicht nicht für eine Schätzung')
const hint = stapleHints(ev, lotOld(250), today).Olivenöl
ok(!!hint && hint.days > 8 && hint.days < 12 && hint.low === false && /reicht noch ca\. \d+ Tage/.test(hint.text), `Hinweis im Vorrat: „Olivenöl ${hint?.text}“`)
ok(stapleHints(ev, lotOld(100), today).Olivenöl.low === true, '100 ml bei ~25 ml/Tag: bald leer')
ok(lastsText(10) === 'reicht noch ca. 10 Tage' && lastsText(0.2) === 'reicht nur noch ca. 1 Tag', 'Text')
ok(runningLow(100, 750, null) && !runningLow(300, 750, null) && runningLow(300, 750, 60) && !runningLow(300, 750, 10) && !runningLow(0, 750, null) && runningLow(0, 750, 5), 'bald leer: < 15 % oder ≤ 7 Tage; ganz leer nur bei zuletzt benutztem')
const weekWith = (pantry: PantryLot[], plan: WeekPlan = {}) =>
  planWeek({ ...past, ...plan }, days, pantry, {}, today, {}, formatAmount, {}, 11, { memo: rememberStaples({}, pantry) })
// Plan der Woche braucht etwas anderes, das Öl ist aber bald leer
const otherPlan: WeekPlan = { [days[2]]: { recipeId: broth.id, servings: 2 } }
const wSoon = weekWith(lotOld(150), otherPlan)
const oSoon = wSoon.buy.find((b) => b.name === 'Olivenöl')
ok(!!oSoon && oSoon.note === 'leer' && oSoon.packs === 1 && near(oSoon.cost, 6.99), '150 ml bei ~23 ml/Tag (≈6 Tage): Olivenöl „bald leer“ auf der Liste, obwohl das Gericht der Woche es nicht braucht')
ok(!weekWith(lotOld(250), otherPlan).buy.some((b) => b.name === 'Olivenöl'), '250 ml (≈10 Tage): noch nicht')
const wFine = weekWith(lotOld(750), otherPlan)
ok(!wFine.buy.some((b) => b.name === 'Olivenöl'), 'Flasche voll (30 Tage): nicht auf der Liste')
const wTiny = planWeek({}, days, lotOld(90), {}, today, {}, formatAmount, {}, 11, { memo: rememberStaples({}, lotOld(90)) })
ok(wTiny.buy.some((b) => b.name === 'Olivenöl' && b.note === 'leer'), 'unter 15 % einer Packung (90 ml): „bald leer“ – auch ohne gelernten Verbrauch')
ok(!planWeek({}, days, lotOld(400), {}, today, {}, formatAmount, {}, 11, { memo: rememberStaples({}, lotOld(400)) }).buy.some((b) => b.name === 'Olivenöl'), '400 ml ohne Verbrauchsdaten: nichts')
// nach dem Abhaken: bleibt erledigt sichtbar
const lotN = lot('Olivenöl', 750)
const wBuyDone = planWeek({}, days, [lotN, ...lotOld(90)].slice(0, 2), { Olivenöl: { lotId: lotN.id, amount: 750 } }, today, {}, formatAmount, {}, 11, { memo: rememberStaples({}, [lotN]) })
ok(wBuyDone.buy.some((b) => b.name === 'Olivenöl' && isBought(b)), '„bald leer“ abgehakt bleibt als erledigt stehen')
ok(planWeek({}, days, [], {}, today, {}, formatAmount, {}, 11, {}).buy.length === 0, 'ohne alles: leere Liste')

// ───── Zusammengeführte Namen laden ─────
const old = sanitize({
  onboarding: 'done',
  pantry: [
    { id: 'a', name: 'Tomaten reif', amount: 600, unit: 'g', expires: '2026-11-20' },
    { id: 'b', name: 'Kalbfleisch Schnitzel', amount: 300, unit: 'g', expires: '2026-11-20' },
    { id: 'c', name: 'Lauchzwiebel dick', amount: 3, unit: 'Stk', expires: '2026-11-20' },
    { id: 'd', name: 'Schweinefleisch Schnitzel', amount: 4, unit: 'Stk', expires: '2026-11-20' },
  ],
  prices: { 'Tomaten reif': { pack: 500, price: 1.2 }, Sahne: { pack: 200, price: 0.8 } },
  pantryRequests: { 'Tomaten reif': 2, Tomate: 1 },
  wasted: [{ name: 'Kalbfleisch Schnitzel', amount: 100, unit: 'g', date: '2026-11-01', value: 2 }],
  checked: { '2026-11-16': ['Tomaten reif', 'Sahne'] },
  bought: { '2026-11-16': { 'Tomaten reif': { lotId: 'a', amount: 500 }, Sahne: { lotId: 'z', amount: 200 } } },
  customRecipes: [{
    id: 'my-1', title: 'Mein Gericht', meal: 'dinner', cuisine: 'de', type: 'haupt', time: 30, servings: 2, steps: ['a'], created: '2026-11-01',
    ingredients: [{ name: 'Tomaten reif', amount: 240, unit: 'g' }, { name: 'Lauchzwiebel dick', amount: 2, unit: 'Stk' }, { name: 'Salz', amount: null, unit: '' }],
  }],
})
const by = (id: string) => old.pantry.find((l) => l.id === id)!
ok(by('a').name === 'Tomate' && by('a').unit === 'Stk' && near(by('a').amount, 5), 'Vorrat: 600 g „Tomaten reif“ → 5 Stk Tomate')
ok(by('b').name === 'Kalbsschnitzel' && by('b').unit === 'Stk' && near(by('b').amount, 2), 'Vorrat: 300 g „Kalbfleisch Schnitzel“ → 2 Stk Kalbsschnitzel')
ok(by('c').name === 'Frühlingszwiebel' && by('c').unit === 'Stk' && by('c').amount === 3, 'Vorrat: „Lauchzwiebel dick“ → Frühlingszwiebel')
ok(by('d').name === 'Schweineschnitzel' && by('d').amount === 4, 'Vorrat: „Schweinefleisch Schnitzel“ → Schweineschnitzel')
ok(!('Tomaten reif' in old.prices) && old.prices.Sahne.price === 0.8, 'Preise: alter Name verworfen, andere bleiben')
ok(old.pantryRequests.Tomate === 3 && !('Tomaten reif' in old.pantryRequests), 'Wünsche: zusammengezählt')
ok(old.wasted[0].name === 'Kalbsschnitzel', 'Weggeworfenes umbenannt')
ok(old.checked['2026-11-16'].join() === 'Sahne' && !('Tomaten reif' in old.bought['2026-11-16']) && !!old.bought['2026-11-16'].Sahne, 'Haken/Einkäufe zu umbenannten Zutaten verworfen, andere bleiben')
const cr = old.customRecipes[0]
ok(cr.ingredients.length === 3 && cr.ingredients[0].name === 'Tomate' && near(cr.ingredients[0].amount!, 2) && cr.ingredients[0].unit === 'Stk' && cr.ingredients[1].name === 'Frühlingszwiebel', 'eigenes Rezept: Zutaten umbenannt und umgerechnet (240 g → 2 Stk)')
ok(Object.keys(old.staples).length === 0 && Object.keys(old.spices).length === 0, 'neue Felder: leer')
const st = sanitize({ onboarding: 'done', spices: { Muskatnuss: 'alle', 'Pfeffer schwarz grob': 'da', Unsinn: 'da', Salz: 'xx' }, pantry: [{ id: 'o', name: 'Gemüsebrühe Würfel', amount: 4000, unit: 'ml', expires: '2027-01-01' }] })
ok(st.spices.Muskatnuss === 'alle' && st.spices.Pfeffer === 'da' && Object.keys(st.spices).length === 2, 'Gewürz-Status geprüft (Alias → Pfeffer, Unsinn verworfen)')
ok(st.staples.Gemüsebrühe?.form === 'Gemüsebrühe Würfel', 'beim Laden gemerkt: Brühe führst du als Würfel')

// Alle Rezeptzeilen mit Grundzutaten rechnen sich um (keine stillen Lücken)
let lost = 0
for (const r of RECIPES) for (const i of r.ingredients) if (isQtyStaple(i.name === 'Frittieröl' ? 'Sonnenblumenöl' : i.name) && i.amount != null && !stapleNeedsOf({ ...r, ingredients: [i] }, r.servings).length) lost++
ok(lost === 0, `alle Mengenangaben bei Grundzutaten sind umrechenbar (${lost} verloren)`)

if (fails) { console.error(`${fails} Fehler`); process.exit(1) }
console.log('Alle Tests OK')
