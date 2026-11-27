// Tests: BBQ-Sparte und Küche „Amerikanisch“ – nicht im Wischstapel, Einplanen → Einkauf/Kalender, vakuumierte Reste
// im Vorrat, Resteessen bevorzugt, Rubs/Saucen als Grundrezept bevorzugt, Saison-Karte nur März–September, Lernen, Geräte.
//   npx vite-node scripts/test-bbq.ts
import { BASICS, RECIPE_BY_ID, RECIPES } from '../src/data/recipes'
import { CATALOG, NON_VEG, SPICES } from '../src/data/catalog'
import { PRODUCTS } from '../src/data/products'
import { NUTRI } from '../src/data/nutrition'
import { PREFERRED, interchangeable } from '../src/data/substitutes'
import { isBbqSeason } from '../src/data/season'
import { CUISINE_LABEL, isBakery, isBbq } from '../src/types'
import { matches } from '../src/filter'
import { EMPTY_FILTERS, parseIso, weekDays } from '../src/store'
import { formatAmount } from '../src/shopping'
import { cookBasic, insight, planWeek } from '../src/kitchen'
import { addBake, bakeEntriesOf, hintBlocked, settleBaked, suggestBake, type BakeHint } from '../src/bakePlan'
import { bbqHint, bbqIdeas, bbqMeal, bbqOn, bbqSection, dinnerToReplace, doneWord, leftoverText, moveBakeEntry, type BbqInput } from '../src/bbq'
import { buildModel, featureLabel, features } from '../src/learning'
import { plannedDinners } from '../src/haSync'
import { settingText, validateSetting } from '../src/deviceText'
import { gasgrill, traeger } from '../src/data/device-helpers'
import { basicFor } from '../src/data/recipes'
import { nutritionOf } from '../src/data/nutrition-calc'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

const PP = 'pulled-pork'
const pp = RECIPE_BY_ID[PP]
const ques = RECIPE_BY_ID['pulled-pork-quesadillas']
const jamb = RECIPE_BY_ID['jambalaya']

// ───── 1) Sparte nicht im Wischstapel, Küche „Amerikanisch“ schon ─────
ok(!!pp && isBbq(pp) && !!pp.basic && pp.bbq === 'smoker' && pp.portions === 10, 'Pulled Pork: BBQ-Rezept (Smoker), ganze Ladung mit 10 Portionen')
const bbqAll = BASICS.filter(isBbq)
ok(bbqAll.length >= 5 && bbqAll.every((r) => !RECIPES.some((x) => x.id === r.id)), `BBQ-Rezepte (${bbqAll.length}) stehen nie unter den Abendessen (Wischstapel/Wochenvorschlag)`)
ok(bbqAll.every((r) => !isBakery(r)) && !bbqSection().some((r) => isBakery(r)), 'BBQ ist nicht in der Backen-Liste, Backen nicht im BBQ-Bereich')
ok(bbqSection('rub').length >= 2 && bbqSection('rub').every((r) => r.kind === 'grundrezept'), 'Rubs & Saucen: Grundrezepte im BBQ-Bereich')
ok(CUISINE_LABEL.us === 'Amerikanisch' && !!jamb && jamb.cuisine === 'us' && RECIPES.includes(jamb), 'Jambalaya: Küche Amerikanisch, im Wischstapel')
ok(matches(jamb, { ...EMPTY_FILTERS, cuisines: ['us'] }) && !matches(jamb, { ...EMPTY_FILTERS, cuisines: ['de'] }), 'Filter: Amerikanisch')
ok(features(jamb).includes('cuisine:us') && featureLabel('cuisine:us') === 'Amerikanische Küche', 'Lernen: Muster „Amerikanische Küche“')
ok(SPICES.has('Cajun-Gewürz') && SPICES.has('Paprikapulver geräuchert') && CATALOG['Cajun-Gewürz'] === 'vorrat', 'neue Gewürze aus den Gruppen-Dateien sind Gewürze im Vorrat')

// ───── 2) Einplanen → Einkaufsliste (wie Backplan) ─────
const TODAY = '2026-06-10' // Mittwoch, BBQ-Saison
const week = weekDays(parseIso('2026-06-08'))
const SAT = '2026-06-13'
const run = (bp: Parameters<typeof planWeek>[11], pantry: Parameters<typeof planWeek>[2] = [], plan: Parameters<typeof planWeek>[0] = {}) =>
  planWeek(plan, week, pantry, {}, TODAY, {}, formatAmount, {}, 6, {}, bp)
const need = (w: ReturnType<typeof run>, name: string) => w.buy.find((b) => b.name === name)?.required ?? w.covered.find((b) => b.name === name)?.required ?? 0
const bp1 = addBake({}, SAT, PP, 1)
const w1 = run(bp1)
ok(need(w1, 'Schweinenacken') === 3000, `Einplanen: 3 kg Schweinenacken auf der Einkaufsliste (${need(w1, 'Schweinenacken')})`)
ok(w1.buy.some((b) => b.name === 'Schweinenacken' && b.recipes.includes(pp.title)), 'Einkaufsartikel nennt das BBQ-Rezept')
ok(need(run(addBake({}, SAT, PP, 2)), 'Schweinenacken') === 6000, 'Rezeptmenge ×2 verdoppelt die Ladung')
ok(bakeEntriesOf(bp1, TODAY).length === 1 && bbqOn(bp1, SAT) && !bbqOn(bp1, TODAY), 'BBQ im Backplan belegt den Tag')

// BBQ ersetzt das Abendessen: offenes Abendessen wird angeboten, gekochtes nicht
const dinner = { [SAT]: { recipeId: jamb.id, servings: 2 } }
ok(dinnerToReplace(dinner, SAT)?.recipeId === jamb.id && !dinnerToReplace({ [SAT]: { ...dinner[SAT], status: 'cooked' as const } }, SAT), 'Abendessen des Tages: offen → ersetzbar, gekocht → bleibt')

// Kalender: BBQ ist das Abendessen des Tages
const cal = plannedDinners(dinner, TODAY, bp1)
const satEv = cal.find((d) => d.key === `dinner:${SAT}`)
ok(!!satEv && satEv.summary.startsWith('🍽️ 🔥') && satEv.summary.includes(pp.title) && /Schweinenacken – 3 kg/.test(satEv.description) && /Außerdem geplant: Jambalaya/.test(satEv.description), `Kalender: „${satEv?.summary}“ mit Zutaten der Ladung`)
ok(plannedDinners({}, TODAY, addBake({}, SAT, 'kc-bbq-sauce', 1)).length === 0, 'Kalender: Saucen/Backen sind kein Abendessen')

// ───── 3) Rubs & Saucen selbstgemacht bevorzugt ─────
ok(PREFERRED['BBQ-Rub']?.includes('BBQ-Rub selbstgemacht') && PREFERRED['BBQ-Sauce']?.includes('BBQ-Sauce selbstgemacht'), 'Vorrang: selbstgemachter Rub und BBQ-Sauce vor dem gekauften')
ok(interchangeable('BBQ-Sauce', 'BBQ-Sauce selbstgemacht') && PRODUCTS['BBQ-Sauce selbstgemacht']?.unit === 'ml', 'BBQ-Sauce selbstgemacht ersetzt die gekaufte (ml)')
ok(basicFor('BBQ-Rub')?.id === 'memphis-rub' && basicFor('BBQ-Sauce')?.id === 'kc-bbq-sauce', 'Rezeptblatt: Tipp „selbst gemacht“ führt zum Grundrezept')
const rubLot = { id: 'rub', name: 'BBQ-Rub selbstgemacht', amount: 160, unit: 'g', expires: '2026-12-01' }
const sauceLot = { id: 'sauce', name: 'BBQ-Sauce selbstgemacht', amount: 600, unit: 'ml', expires: '2026-07-01' }
const w2 = run(bp1, [rubLot, sauceLot])
ok(!w2.buy.some((b) => b.name === 'BBQ-Rub' || b.name === 'BBQ-Sauce'), 'Einkauf: selbstgemachter Rub/Sauce im Vorrat → nichts davon kaufen')
ok(w2.pantryLeft.find((l) => l.id === 'rub')?.amount === 90 && w2.pantryLeft.find((l) => l.id === 'sauce')?.amount === 300, 'Vorrat reserviert 70 g Rub und 300 ml Sauce')
const bought = { id: 'b', name: 'BBQ-Sauce', amount: 250, unit: 'ml', expires: '2027-01-01' }
const cooked = cookBasic([bought, sauceLot], pp, 1, SAT)
ok(cooked.pantry.find((l) => l.id === 'sauce')?.amount === 300 && cooked.pantry.find((l) => l.id === 'b')?.amount === 250, 'Kochen: selbstgemachte Sauce wird zuerst genommen, gekaufte bleibt')

// ───── 4) Reste vakuumiert in den Vorrat ─────
const LEFT = 'Pulled Pork (vakuumiert)'
ok(pp.yields?.name === LEFT && pp.yields.unit === 'g' && pp.yields.portion === 250 && pp.yields.shelf === 90, 'Pulled Pork: Rest 1,5 kg in Beuteln à 250 g, eingefroren 90 Tage')
ok(leftoverText(pp) === '1,5 kg · 6 × 250 g vakuumiert eingefroren', `Rest-Text: „${leftoverText(pp)}“`)
ok(CATALOG[LEFT] === 'tk' && NON_VEG.has(LEFT) && PRODUCTS[LEFT]?.unit === 'g' && (NUTRI[LEFT]?.[0] ?? 0) > 100, 'Rest: Tiefkühl, nicht vegetarisch, Produkt in g, Nährwerte')
const s0 = { pantry: [], bakePlan: bp1, baked: [] as { date: string; recipeId: string }[] }
const settled = settleBaked(s0, SAT, PP)!
const lot = settled.pantry.find((l) => l.name === LEFT)
ok(!!lot && lot.amount === 1500 && lot.unit === 'g' && lot.expires === '2026-09-11', `„Ja, gegrillt“: ${lot?.amount} g ${LEFT}, haltbar bis ${lot?.expires}`)
ok(settled.bakePlan[SAT]![0].status === 'baked' && settled.baked.length === 1 && settleBaked(settled, SAT, PP) === null, 'als gegrillt markiert, fürs Lernen vermerkt, nie zweimal')
const burgerDay = settleBaked({ pantry: [], bakePlan: addBake({}, SAT, 'bacon-cheeseburger-grill', 1), baked: [] }, SAT, 'bacon-cheeseburger-grill')
ok(!!burgerDay && burgerDay.pantry.length === 0 && burgerDay.baked.length === 1, 'BBQ ohne Reste (Burger): nur Zutaten abziehen, trotzdem gelernt')
const meal = bbqMeal(pp, SAT)
ok(!!meal && meal.recipeId === PP && !('kcal' in meal), 'Grillabend zählt fürs Lernen als „gegessen“ (ohne kcal)')
ok(doneWord(pp) === 'gegrillt' && doneWord(RECIPE_BY_ID['chili-dutch-oven']) === 'gekocht' && doneWord(RECIPE_BY_ID['bienenstich']) === 'gebacken', 'Wortwahl: gegrillt / gekocht / gebacken')

// ───── 5) Resteessen bevorzugt ─────
ok(!!ques && ques.cuisine === 'us' && ques.ingredients.some((i) => i.name === 'Pulled Pork') && !ques.vegetarian, 'Resteessen: Quesadillas mit Pulled Pork (Wischstapel)')
ok(PREFERRED['Pulled Pork']?.includes(LEFT), 'Vorrang: vakuumiertes Pulled Pork vor gekauftem')
const vac = { id: 'v', name: LEFT, amount: 1500, unit: 'g', expires: '2026-09-11' }
const lastSeen = new Map<string, string>()
const without = insight(ques, 2, [], TODAY, {}, lastSeen, 0)
const withLeft = insight(ques, 2, [vac], TODAY, {}, lastSeen, 0)
ok(withLeft.fromPantry.includes(LEFT) && withLeft.score > without.score, `Stapel: Quesadillas steigen mit Resten im Vorrat (${without.score.toFixed(1)} → ${withLeft.score.toFixed(1)})`)
const w3 = run({}, [vac], { [SAT]: { recipeId: ques.id, servings: 2 } })
ok(!w3.buy.some((b) => b.name === 'Pulled Pork') && w3.pantryLeft.find((l) => l.id === 'v')?.amount === 1250, 'Einkauf: Reste aus dem Vorrat statt Pulled Pork kaufen (250 g reserviert)')
ok(run({}, [], { [SAT]: { recipeId: ques.id, servings: 2 } }).buy.some((b) => b.name === 'Pulled Pork'), 'ohne Reste: gekauftes Pulled Pork auf die Liste')

// Brisket-Reste: Brisket Chili und Brisket Hash nehmen „Pulled Beef“ – der vakuumierte Brisket geht vor
{
  const BR = 'Brisket (vakuumiert)'
  const chili = RECIPE_BY_ID['brisket-chili']
  const hash = RECIPE_BY_ID['brisket-hash']
  ok(!!chili && !!hash && [chili, hash].every((r) => r.cuisine === 'us' && !r.basic && RECIPES.includes(r) && r.ingredients.some((i) => i.name === 'Pulled Beef') && !r.vegetarian), 'Resteessen: Brisket Chili und Brisket Hash (Amerikanisch, Wischstapel) mit Pulled Beef')
  ok(PREFERRED['Pulled Beef']?.includes(BR) && interchangeable('Pulled Beef', BR), 'Vorrang: vakuumierter Brisket vor gekauftem Pulled Beef')
  const bri = { id: 'br', name: BR, amount: 1000, unit: 'g', expires: '2026-12-01' }
  ok(insight(chili, 2, [bri], TODAY, {}, new Map(), 0).fromPantry.includes(BR), 'Stapel: Brisket Chili zeigt den Brisket aus dem Vorrat')
  const w4 = run({}, [bri], { [SAT]: { recipeId: hash.id, servings: 2 } })
  ok(!w4.buy.some((b) => b.name === 'Pulled Beef') && w4.pantryLeft.find((l) => l.id === 'br')?.amount === 750, 'Einkauf: Brisket Hash nimmt 250 g Brisket aus dem Vorrat, kein Pulled Beef kaufen')
}

// ───── 6) Saison-Karte nur März–September ─────
ok(isBbqSeason('2026-03-01') && isBbqSeason('2026-09-30') && !isBbqSeason('2026-02-28') && !isBbqSeason('2026-10-01') && !isBbqSeason(11), 'BBQ-Saison: März–September')
const base = (today: string, extra: Partial<BbqInput> = {}): BbqInput => ({ today, baked: [], bakeRatings: {}, bakePlan: {}, hints: [], ...extra })
const summer = bbqIdeas(base(TODAY))
ok(!!summer && summer.recipes.length === 3 && summer.day === SAT && summer.text === 'BBQ-Wetter? Ideen für Samstag' && summer.recipes.every(isBbq), `Juni: Karte mit 3 Ideen für Samstag (${summer?.recipes.map((r) => r.id).join(', ')})`)
ok(!bbqIdeas(base('2026-11-23')) && !bbqIdeas(base('2026-01-15')) && !!bbqIdeas(base('2026-03-04')) && !bbqIdeas(base('2026-10-02')), 'Winter/Herbst: keine Karte, ab März wieder')
ok(!bbqIdeas(base(TODAY, { bakePlan: bp1 })), 'BBQ schon geplant (≤ 7 Tage): keine Karte')
ok(!bbqIdeas(base(TODAY, { baked: [{ date: '2026-06-08', recipeId: PP }] })), 'vorgestern gegrillt: keine Karte')
const dismissed = bbqHint([], TODAY, 'dismissed')
ok(!bbqIdeas(base(TODAY, { hints: dismissed })) && hintBlocked(dismissed, 'bbq', '2026-06-15') && !hintBlocked(dismissed, 'bbq', '2026-06-17'), 'weggeklickt: ruht 6 Tage')
const four: BakeHint[] = ['2026-05-01', '2026-05-10', '2026-05-25', '2026-06-01'].map((date) => ({ date, kind: 'bbq', action: 'dismissed' }))
ok(!bbqIdeas(base(TODAY, { hints: four })) && !!bbqIdeas(base(TODAY, { hints: bbqHint(four, '2026-06-05', 'accepted') })), 'viermal weggeklickt: still – bis wieder etwas angenommen wird')
ok(suggestBake({ today: TODAY, pantry: [], baked: [], bakeRatings: {}, bakePlan: {}, hints: [] }) === undefined, 'Backvorschläge bleiben davon unberührt')

// ───── 7) Lernen ─────
const liked = bbqIdeas(base(TODAY, { baked: [{ date: '2026-05-16', recipeId: 'beer-can-chicken' }], bakeRatings: { '2026-05-16:beer-can-chicken': 'again' } }))
ok(liked?.recipes[0].id === 'beer-can-chicken', `„bald wieder“ bewertet → zuerst vorgeschlagen (${liked?.recipes.map((r) => r.id).join(', ')})`)
ok(!!liked && liked.recipes.some((r) => r.id !== 'beer-can-chicken'), 'eine Idee bleibt etwas Neues')
const down = bbqIdeas(base(TODAY, { baked: [{ date: '2026-05-16', recipeId: PP }], bakeRatings: { '2026-05-16:pulled-pork': 'down' } }))
ok(!!down && !down.recipes.some((r) => r.id === PP), '„nicht so“ → nicht mehr vorgeschlagen')
const rested = bbqIdeas(base(TODAY, { baked: [{ date: '2026-06-04', recipeId: PP }], bakeRatings: { '2026-06-04:pulled-pork': 'again' } }))
ok(!!rested && !rested.recipes.some((r) => r.id === PP), 'gerade erst gegrillt (< 10 Tage) → ruht')
const pref = bbqIdeas(base(TODAY, { pref: (r) => (r.id === 'chili-dutch-oven' ? 5 : 0) }))
ok(pref?.recipes[0].id === 'chili-dutch-oven', 'Geschmacksmodell (Haushalt) sortiert die Ideen mit')
const habit = bbqIdeas(base('2026-06-08', { baked: ['2026-05-03', '2026-05-10', '2026-05-17'].map((date) => ({ date, recipeId: 'beer-can-chicken' })) }))
ok(habit?.day === '2026-06-14', `gelernter Grilltag Sonntag (${habit?.day})`)
const model = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: TODAY, bakePlan: { [SAT]: [{ recipeId: PP, amount: 1 }] } })
ok((model.feature.get('bbq:smoker')?.sum ?? 0) > 0 && (model.feature.get('bake:bbq')?.sum ?? 0) > 0 && (model.recipe.get(PP)?.sum ?? 0) > 0, 'Geschmack: eingeplantes BBQ zählt (Muster „BBQ: Smoker“)')
ok(!model.feature.has('cuisine:us') && featureLabel('bbq:smoker') === 'BBQ: Smoker' && featureLabel('bbqprotein:Schwein') === 'BBQ mit Schwein', 'BBQ verändert die Abendessen-Muster nicht')
const skipped = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: TODAY, bakePlan: { [SAT]: [{ recipeId: PP, amount: 1, status: 'skipped' }] } })
ok((skipped.recipe.get(PP)?.sum ?? 0) < 0, '„nicht gemacht“ wertet leicht ab')

// ───── 8) Geräte ─────
ok(validateSetting(traeger('Smoken', 225, { minutes: 360, core: 95 })).length === 0 && traeger('Smoken', 225).temp === 107 && traeger('Smoken', 225).note === '225 °F', 'Traeger: 225 °F → 107 °C, °F in der Notiz')
ok(validateSetting({ device: 'smoker', mode: 'Super Smoke', temp: 121 }).length > 0 && validateSetting({ device: 'smoker', mode: 'Smoken', temp: 300 }).length > 0, 'Traeger: Super Smoke nur bis 107 °C, Garraum bis 260 °C')
ok(validateSetting({ device: 'smoker', mode: 'Smoken', temp: 121, core: 96, minutes: 1200 }).length === 0 && validateSetting({ device: 'steamer', mode: 'Dämpfen', temp: 100, core: 96 }).length > 0, 'Kern bis 98 °C nur bei BBQ-Geräten, Dauer bis 24 Std.')
ok(validateSetting(gasgrill('Indirekt', 160, 'mittel', '1+4', { minutes: 90, core: 72 })).length === 0 && validateSetting(gasgrill('Indirekt', 160, 'mittel', 'alle')).length > 0 && validateSetting(gasgrill('Direkt', 260, 'hoch', '1+5')).length > 0, 'Gasgrill: indirekt braucht eine Zone, Brenner 1–4')
ok(settingText(gasgrill('Indirekt', 160, 'mittel', '1+4', { minutes: 90, core: 72 })) === 'Gasgrill · Indirekt 160 °C · Brenner 1+4 mittel · 90 Min. · Kern 72 °C', 'Chip Gasgrill')
ok(settingText(traeger('Smoken', 250, { minutes: 210, core: 95 })) === 'Traeger · Smoken 121 °C · 3 Std. 30 Min. · Kern 95 °C', 'Chip Traeger')
ok(validateSetting({ device: 'dutch', mode: 'Schmoren', level: 'niedrig', minutes: 150 }).length === 0 && validateSetting({ device: 'dutch', mode: 'Schmoren', level: 'niedrig', temp: 180 }).length > 0, 'Dutch Oven (Gas): Flamme statt Temperatur')
ok(validateSetting({ device: 'vakuum', mode: 'Vakuumieren feucht' }).length === 0 && validateSetting({ device: 'vakuum', mode: 'Vakuumieren', minutes: 5 }).length > 0, 'Vakuumierer: nur Betriebsart')
ok(pp.deviceSteps!.some((s) => s.settings?.some((x) => x.device === 'vakuum')) && pp.deviceSteps!.some((s) => s.settings?.some((x) => x.device === 'steamer' && x.mode === 'Vacuisine')), 'Pulled Pork: vakuumieren, später im CombiSteamer (Vacuisine) aufwärmen')

// ───── 9) Fettverlust beim Smoken (`fatLoss`) ─────
const brisket = RECIPE_BY_ID['texas-brisket']
const raw = brisket && nutritionOf(brisket.ingredients, brisket.portions!)
ok(!!brisket && !!raw && brisket.nutrition.fat < raw.fat && brisket.nutrition.kcal < raw.kcal && Math.abs(raw.kcal - brisket.nutrition.kcal - (raw.fat - brisket.nutrition.fat) * 9) < 2,
  `Brisket: abtropfendes Fett senkt Fett/kcal je Portion (${raw?.kcal} → ${brisket?.nutrition.kcal} kcal)`)
const bacon = [{ name: 'Bacon', amount: 100, unit: 'g' }, { name: 'BBQ-Sauce', amount: 100, unit: 'ml' }]
ok(nutritionOf(bacon, 1, 0.4).fat === Math.round((nutritionOf(bacon, 1).fat - 37 * 0.4) * 10) / 10 && nutritionOf(bacon, 1, 0.9).fat === nutritionOf(bacon, 1, 0.4).fat, 'Fettverlust nur am Fleisch, höchstens 40 %')
ok((NUTRI['Brisket (vakuumiert)']?.[2] ?? 99) < 25 && (NUTRI['Pulled Pork (vakuumiert)']?.[0] ?? 0) > 100, 'Reste-Nährwerte berücksichtigen den Fettverlust')

// ───── 10) Lake wird abgespült (`eaten`): Zucker der Lake zählt nur zu 10 % ─────
const salmon = RECIPE_BY_ID['smoked-salmon']
const salmonRaw = salmon && nutritionOf(salmon.ingredients, salmon.portions!)
ok(!!salmon && !!salmonRaw && salmonRaw.kcal - salmon.nutrition.kcal >= 80 && salmon.nutrition.carbs < 15,
  `Heißgeräucherter Lachs: Lake-Zucker nicht voll gezählt (${salmonRaw?.kcal} → ${salmon?.nutrition.kcal} kcal, ${salmon?.nutrition.carbs} g KH)`)
const sugar = [{ name: 'Zucker', amount: 100, unit: 'g' }, { name: 'Honig', amount: 100, unit: 'g' }]
ok(nutritionOf(sugar, 1, undefined, { Zucker: 0.1 }).carbs === Math.round((10 + NUTRI['Honig'][3]) * 10) / 10, 'eaten wirkt nur auf die genannte Zutat')

// ───── BBQ verschieben: Abendessen des Zieltags wird ersetzt (wie beim Einplanen) ─────
{
  const SUN = '2026-06-14'
  const st = { plan: { [SUN]: { recipeId: jamb.id, servings: 2 } }, bakePlan: addBake({}, SAT, PP, 1) }
  const mv = moveBakeEntry(st, SAT, PP, SUN)
  ok(!mv.plan[SUN] && mv.dropped?.recipeId === jamb.id && (mv.bakePlan[SUN] ?? []).some((e) => e.recipeId === PP) && !(mv.bakePlan[SAT] ?? []).length, 'BBQ verschieben: Abendessen des Zieltags ersetzt')
  const side = BASICS.find((r) => isBbq(r) && r.bbq === 'beilage')
  if (side) {
    const st2 = { plan: { [SUN]: { recipeId: jamb.id, servings: 2 } }, bakePlan: addBake({}, SAT, side.id, 1) }
    ok(!!moveBakeEntry(st2, SAT, side.id, SUN).plan[SUN], 'Beilage verschieben: Abendessen bleibt')
  }
}

if (fails) {
  console.error(`${fails} Test(s) fehlgeschlagen`)
  process.exit(1)
}
console.log('Alle Tests OK')
