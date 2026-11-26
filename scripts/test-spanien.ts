// Tests: Spanien – Küche „Spanisch“ im Wischstapel, Tapas-Abend (Auswahl → einplanen ersetzt das Abendessen, Zutaten zusammen
// auf die Liste, genau ein Kalendertermin „🍽️ 🫒 …“, Fertig zieht ab, Lernen/Ideen, Ablaufplan), Tapas-Grundsaucen
// bevorzugt, „Salate & Beilagen“ als Zusatz (ersetzt nichts), Paellapfanne/Plancha, spanische Desserts.
//   npx vite-node scripts/test-spanien.ts
import { BASICS, RECIPE_BY_ID, RECIPES, basicFor } from '../src/data/recipes'
import { CATALOG, NON_VEG } from '../src/data/catalog'
import { PRODUCTS } from '../src/data/products'
import { PREFERRED, interchangeable } from '../src/data/substitutes'
import { TAPAS_STD } from '../src/data/define'
import { CUISINE_LABEL, isBakery, isSalat, isTapa, replacesDinner, type Recipe } from '../src/types'
import { matches } from '../src/filter'
import { EMPTY_FILTERS, parseIso, sanitize, weekDays } from '../src/store'
import { formatAmount } from '../src/shopping'
import { cookBasic, planWeek } from '../src/kitchen'
import { addBake, bakeEntriesOf, settleBaked, tapasFactor, tapasFactorFor } from '../src/bakePlan'
import { bbqOn, dinnerToReplace, eveningOn, planWord } from '../src/bbq'
import {
  eveningKcal, moveTapasEvening, pantryHits, planTapasEvening, removeTapasEvening, shortTitle, tapasFavorites, tapasIdeas, tapasMeal,
  tapasPairs, tapasSection, tapasTimeline, type TapasInput,
} from '../src/tapas'
import { buildModel, featureLabel, features } from '../src/learning'
import { diffDinnerEvents, plannedDinners } from '../src/haSync'
import { settingText, validateSetting } from '../src/deviceText'
import { paella, plancha } from '../src/data/device-helpers'
import { checkStep } from './device-text-rules'
import { salatSection } from '../src/salate'
import { eatOne } from '../src/bake'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

const paellaV = RECIPE_BY_ID['paella-valenciana']
const fabada = RECIPE_BY_ID['fabada-asturiana']
const GAMBAS = 'gambas-al-ajillo'
const PINCHOS = 'pinchos-morunos'
const TORTILLA = 'tortilla-de-patatas'
const gambas = RECIPE_BY_ID[GAMBAS]
const pinchos = RECIPE_BY_ID[PINCHOS]
const tortilla = RECIPE_BY_ID[TORTILLA]
const NUDEL = 'nudelsalat-klassisch'
const nudel = RECIPE_BY_ID[NUDEL]

// ───── 1) Küche „Spanisch“ im Wischstapel ─────
ok(CUISINE_LABEL.es === 'Spanisch' && !!paellaV && paellaV.cuisine === 'es' && RECIPES.includes(paellaV) && RECIPES.includes(fabada), 'Paella valenciana und Fabada: Küche Spanisch, im Wischstapel')
ok(matches(paellaV, { ...EMPTY_FILTERS, cuisines: ['es'] }) && !matches(paellaV, { ...EMPTY_FILTERS, cuisines: ['it'] }), 'Filter: Spanisch')
ok(features(paellaV).includes('cuisine:es') && featureLabel('cuisine:es') === 'Spanische Küche', 'Lernen: Muster „Spanische Küche“')
const migrated = sanitize({ filters: { cuisines: ['de', 'it', 'as', 'gr', 'us'] } })
ok(migrated.filters.cuisines.includes('es') && !sanitize({ filters: { cuisines: ['de'] } }).filters.cuisines.includes('es'), 'Wer alle Küchen gewählt hatte, bekommt Spanisch dazu')
ok(paellaV.deviceSteps!.some((s) => s.settings?.some((x) => x.device === 'paella' && x.pan === '32')) && paellaV.deviceSteps!.some((s) => s.settings?.some((x) => x.device === 'paella' && x.pan === '46' && x.alt)), 'Paella: 32-cm-Pfanne (BORA), große 46-cm-Pfanne (Gasgrill) als „oder …“')

// ───── 2) Tapas: eigener Bereich, nicht im Stapel ─────
const allTapas = BASICS.filter(isTapa)
ok(allTapas.length >= 3 && allTapas.every((r) => !RECIPES.some((x) => x.id === r.id) && !isBakery(r)), `Tapas (${allTapas.length}) stehen nie im Wischstapel und nicht beim Backen`)
ok(tapasSection().includes(gambas) && tapasSection('sauce').some((r) => r.id === 'alioli') && tapasSection('fisch').every((r) => r.tapas === 'fisch'), 'Tapas-Bereich: Tapas und Saucen, nach Gruppe filterbar')
ok(gambas.portions === 2 && gambas.serve === 'heiss' && tortilla.serve === 'lauwarm' && replacesDinner(gambas) && planWord(gambas) === 'Tapas-Abend', 'Tapa: Teller für 2, kalt/lauwarm/heiß, ersetzt das Abendessen')
ok(shortTitle(gambas.title) === 'Gambas al ajillo', 'kurzer Titel ohne deutsche Erklärung')

// ───── 3) Tapas-Abend einplanen ─────
const TODAY = '2026-11-25' // Mittwoch
const SAT = '2026-11-28'
const week = weekDays(parseIso('2026-11-23'))
const run = (bp: Parameters<typeof planWeek>[11], pantry: Parameters<typeof planWeek>[2] = [], plan: Parameters<typeof planWeek>[0] = {}) =>
  planWeek(plan, week, pantry, {}, TODAY, {}, formatAmount, {}, 11, {}, bp)
const need = (w: ReturnType<typeof run>, name: string) => w.buy.find((b) => b.name === name)?.required ?? w.covered.find((b) => b.name === name)?.required ?? 0
const jamb = RECIPE_BY_ID['jambalaya']
const dinner = { [SAT]: { recipeId: jamb.id, servings: 2 } }
const ids = [GAMBAS, PINCHOS, TORTILLA]
const ev = planTapasEvening({ plan: dinner, bakePlan: {} }, SAT, ids, true)
ok(!ev.plan[SAT] && ev.dropped?.recipeId === jamb.id && (ev.bakePlan[SAT] ?? []).length === 3, 'Einplanen: 3 Tapas am Samstag, Abendessen (Jambalaya) gestrichen')
ok(!!planTapasEvening({ plan: dinner, bakePlan: {} }, SAT, ids, false).plan[SAT], 'ohne Haken bleibt das Abendessen stehen')
ok(eveningOn(ev.bakePlan, SAT) === 'tapas' && !bbqOn(ev.bakePlan, SAT) && !eveningOn(ev.bakePlan, TODAY), 'Wochenansicht: „🫒 Tapas-Abend“ statt Abendessen')
const f3 = tapasFactor(ev.bakePlan, SAT)
ok(f3 === tapasFactorFor(3) && Math.abs(f3 - TAPAS_STD / 3) < 0.01 && tapasFactorFor(5) === 1 && tapasFactorFor(6) === 0.83 && tapasFactorFor(4) === 1.25, `Mengen je Tapa: 3 Tapas ×${f3}, 4 ×1,25, 5 ×1, 6 ×0,83`)
ok(bakeEntriesOf(ev.bakePlan, TODAY).every(([, e]) => Math.abs(e.servings - f3) < 1e-9), 'Backplan-Einträge mit dem Faktor des Abends')
const w1 = run(ev.bakePlan)
const garn = need(w1, 'Garnelen roh TK')
ok(Math.abs(garn - 180 * f3) < 1 && need(w1, 'Schweinefilet') > 160 && need(w1, 'Kartoffeln festkochend') > 180, `Einkauf: Zutaten aller Tapas zusammen (${Math.round(garn)} g Garnelen, ${Math.round(need(w1, 'Schweinefilet'))} g Schweinefilet)`)
ok(w1.buy.some((b) => b.name === 'Garnelen roh TK' && b.recipes.includes(gambas.title)), 'Einkaufsartikel nennt die Tapa')
const five = planTapasEvening({ plan: {}, bakePlan: {} }, SAT, [...ids, 'tortilla-de-patatas'], true)
ok((five.bakePlan[SAT] ?? []).length === 3, 'jede Tapa nur einmal je Abend')
const kcal3 = eveningKcal([gambas, pinchos, tortilla])
ok(kcal3 > 500 && kcal3 < 1100 && kcal3 === Math.round((gambas.nutrition.kcal + pinchos.nutrition.kcal + tortilla.nutrition.kcal) * f3), `Abend gesamt ≈ ${kcal3} kcal p. P.`)

// neue Auswahl für denselben Tag ersetzt den vorherigen (offenen) Tapas-Abend
const re = planTapasEvening(ev, SAT, [GAMBAS, TORTILLA], true)
ok((re.bakePlan[SAT] ?? []).map((e) => e.recipeId).sort().join() === [GAMBAS, TORTILLA].sort().join(), 'neue Auswahl ersetzt den geplanten Tapas-Abend des Tages')
const moved = moveTapasEvening(ev, SAT, '2026-11-29')
ok(!moved[SAT] && (moved['2026-11-29'] ?? []).length === 3 && !removeTapasEvening(ev.bakePlan, SAT)[SAT], 'Tapas-Abend verschieben und entfernen')

// Kalender: GENAU ein Termin „🍽️ 🫒 Tapas-Abend: …“
const cal = plannedDinners({ ...ev.plan, '2026-11-27': { recipeId: jamb.id, servings: 2 } }, TODAY, ev.bakePlan)
const satEvs = cal.filter((d) => d.key === `dinner:${SAT}`)
const sat = satEvs[0]
ok(satEvs.length === 1 && sat.summary.startsWith('🍽️ 🫒 Tapas-Abend: ') && sat.summary.includes('Gambas al ajillo') && !sat.summary.includes('(Knoblauch'), `Kalender: „${sat?.summary}“`)
ok(/Garnelen roh TK – 300 g/.test(sat.description) && /🫒 Pinchos morunos/.test(sat.description), 'Kalender-Beschreibung: Zutaten je Tapa mit der Menge des Abends')
const diff = diffDinnerEvents(cal, {}, [{ uid: 'old', summary: `🍽️ ${jamb.title}`, date: SAT }], TODAY)
ok(diff.create.filter((d) => d.key === `dinner:${SAT}`).length === 1 && diff.del.some((d) => d.uids.includes('old')), 'Kalenderabgleich: alter Abendessen-Termin weg, ein Tapas-Termin neu')

// Fertig: Zutaten abziehen (Menge des Abends), Anteil in die Tagesbilanz, fürs Lernen gemerkt
const lot = { id: 'g', name: 'Garnelen roh TK', amount: 500, unit: 'g', expires: '2027-01-01' }
const s1 = settleBaked({ pantry: [lot], bakePlan: ev.bakePlan, baked: [] }, SAT, GAMBAS)!
ok(!!s1 && Math.abs(s1.pantry.find((l) => l.id === 'g')!.amount - (500 - 180 * f3)) < 0.5, `Fertig: ${Math.round(180 * f3)} g Garnelen abgezogen`)
ok(s1.bakePlan[SAT]!.find((e) => e.recipeId === GAMBAS)?.status === 'baked' && s1.baked.length === 1 && settleBaked(s1, SAT, GAMBAS) === null, 'als gemacht markiert, gemerkt, nie zweimal abgezogen')
const meal = tapasMeal(gambas, SAT, f3)
ok(!!meal && meal.kcal === Math.round(gambas.nutrition.kcal * f3) && meal.recipeId === GAMBAS, `Tagesbilanz: Anteil der Tapa (${meal?.kcal} kcal)`)
ok(tapasFactor(s1.bakePlan, SAT) === f3, 'Faktor bleibt nach „Fertig“ gleich')

// ───── 4) Lernen: Lieblinge, Kombinationen, Ideen ─────
const model = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: TODAY, bakePlan: ev.bakePlan })
ok((model.feature.get('tapas:fisch')?.sum ?? 0) > 0 && (model.recipe.get(GAMBAS)?.sum ?? 0) > 0 && !model.feature.has('cuisine:es'), 'Geschmack: geplante Tapas zählen (Muster „Tapas: Fisch & Meeresfrüchte“), ohne Abendessen-Muster')
ok(featureLabel('tapas:fisch') === 'Tapas: Fisch & Meeresfrüchte' && featureLabel('tapasprotein:Fisch') === 'Tapas mit Fisch' && featureLabel('salat:nudel') === 'Nudelsalate', 'Lernen: lesbare Muster für Tapas und Salate')
const base = (extra: Partial<TapasInput> = {}): TapasInput => ({ today: TODAY, baked: [], bakeRatings: {}, bakePlan: {}, ...extra })
const ideas0 = tapasIdeas(base())
ok(ideas0.length >= 1 && ideas0[0].recipes.length >= 3 && ['fisch', 'fleisch', 'ei'].every((g) => ideas0[0].recipes.some((r) => r.tapas === g)), `Ideen: je eine aus Fisch, Fleisch, Ei/Kartoffel (${ideas0[0]?.recipes.map((r) => r.id).join(', ')})`)
ok(ideas0[0].kcal === eveningKcal(ideas0[0].recipes) && /Fisch & Meeresfrüchte/.test(ideas0[0].reason), 'Idee mit kcal des Abends und Begründung')
const night = '2026-11-07'
const liked: TapasInput = base({ baked: [GAMBAS, PINCHOS, TORTILLA].map((recipeId) => ({ date: night, recipeId })), bakeRatings: { [`${night}:${PINCHOS}`]: 'again', [`${night}:${TORTILLA}`]: 'up', [`${night}:${GAMBAS}`]: 'down' } })
const pairs = tapasPairs(liked)
ok((pairs.get([PINCHOS, TORTILLA].sort().join('|')) ?? 0) > (pairs.get([GAMBAS, PINCHOS].sort().join('|')) ?? 0) && (pairs.get([PINCHOS, TORTILLA].sort().join('|')) ?? 0) > 0, 'Kombinationen: zusammen gemacht und gut bewertet passt besser zusammen')
ok(tapasFavorites(liked).map((r) => r.id).includes(PINCHOS) && !tapasFavorites(liked).some((r) => r.id === GAMBAS), 'Lieblings-Tapas: „bald wieder“ ja, „nicht so“ nein')
ok(tapasIdeas(liked).every((i) => !i.recipes.some((r) => r.id === GAMBAS)), '„nicht so“ bewertete Tapa kommt in keiner Idee vor')
const fav: TapasInput = { ...liked, bakeRatings: { ...liked.bakeRatings, [`${night}:${GAMBAS}`]: 'up' } }
const ideasL = tapasIdeas(fav)
ok(ideasL.length >= 1 && ideasL[0].label === 'Eure Lieblinge' && ideasL[0].recipes.some((r) => r.id === PINCHOS) && /❤️/.test(ideasL[0].reason), `Lieblinge zuerst (${ideasL[0]?.label}: ${ideasL[0]?.recipes.map((r) => r.id).join(', ')})`)
const rested = tapasIdeas(base({ baked: [{ date: '2026-11-20', recipeId: PINCHOS }], bakeRatings: { [`2026-11-20:${PINCHOS}`]: 'again' } }))
ok(rested.every((i) => !i.recipes.some((r) => r.id === PINCHOS)), 'gerade erst gemacht (< 14 Tage) → ruht')
const filet = { id: 'f', name: 'Schweinefilet', amount: 400, unit: 'g', expires: '2026-11-27' }
ok(pantryHits(pinchos, [filet], TODAY).includes('Schweinefilet') && /Vorrat: Schweinefilet/.test(tapasIdeas(base({ pantry: [filet] }))[0]?.reason ?? ''), 'Vorrat zählt: Schweinefilet im Kühlschrank → Pinchos, Begründung „aus dem Vorrat“')
const pref = tapasIdeas(base({ pref: (r) => (r.id === PINCHOS ? 6 : 0) }))
ok(pref[0]?.recipes.some((r) => r.id === PINCHOS), 'Geschmacksmodell sortiert mit')

// ───── 5) Ablaufplan im Kochmodus „Tapas-Abend“ ─────
const tl = tapasTimeline([gambas, tortilla, pinchos])
ok(tl.map((p) => p.phase).join() === 'vorher,lauwarm,heiss', `Phasen: ${tl.map((p) => p.phase).join(' → ')}`)
const heiss = tl.find((p) => p.phase === 'heiss')!.items.map((x) => x.recipe.id)
ok(heiss[heiss.length - 1] === GAMBAS && tl[0].items.some((x) => x.recipe.id === PINCHOS && /marinieren/.test(x.text)), 'Marinade vorher, Gambas ganz zuletzt')
const withAlioli = { ...tortilla, id: 'test-patatas-alioli', ingredients: [...tortilla.ingredients, { name: 'Alioli', amount: 60, unit: 'ml' }] } as Recipe
const tlA = tapasTimeline([withAlioli, gambas], [], TODAY)
ok(tlA[0].phase === 'vorher' && tlA[0].items[0].recipe.id === 'alioli', 'Alioli selbst machen steht zuerst im Plan „Vorher“')
const homemade = { id: 'h', name: 'Alioli selbstgemacht', amount: 200, unit: 'ml', expires: '2026-11-30' }
ok(!tapasTimeline([withAlioli], [homemade], TODAY)[0]?.items.some((x) => x.recipe.id === 'alioli'), 'liegt selbstgemachte Alioli im Vorrat, entfällt der Hinweis')

// ───── 6) Tapas-Grundsaucen: Selbstgemachtes bevorzugt ─────
ok(basicFor('Alioli')?.id === 'alioli' && RECIPE_BY_ID['alioli'].kind === 'grundrezept' && RECIPE_BY_ID['alioli'].tapas === 'sauce', 'Alioli: Grundrezept im Tapas-Bereich, Tipp „selbst gemacht“')
ok(PREFERRED['Alioli']?.includes('Alioli selbstgemacht') && interchangeable('Alioli', 'Alioli selbstgemacht') && PRODUCTS['Alioli selbstgemacht']?.unit === 'ml', 'Vorrang: selbstgemachte Alioli vor dem Glas (gleiche Einheit ml)')
const bought = { id: 'b', name: 'Alioli', amount: 200, unit: 'ml', expires: '2027-03-01' }
const used = cookBasic([bought, homemade], withAlioli, 1, SAT)
ok(used.pantry.find((l) => l.id === 'h')?.amount === 140 && used.pantry.find((l) => l.id === 'b')?.amount === 200, 'Kochen: selbstgemachte Alioli wird zuerst genommen, das Glas bleibt')
ok(['Salsa brava', 'Romesco', 'Mojo rojo', 'Mojo verde'].every((n) => CATALOG[n] && PRODUCTS[n]), 'kaufbare Grundnamen für Salsa brava, Romesco, Mojo rojo/verde angelegt')

// ───── 7) Salate & Beilagen: Zusatz, ersetzt nichts ─────
const sec = salatSection()
ok(!!nudel && isSalat(nudel) && sec.includes(nudel) && sec.some((r) => r.id === 'ensaladilla-rusa') && sec.some((r) => r.id === 'southern-potato-salad'), 'Salate & Beilagen: Nudelsalat, Ensaladilla rusa und die BBQ-Beilagen')
ok(sec.every((r) => !RECIPES.some((x) => x.id === r.id)) && salatSection('bbq').every((r) => r.bbq === 'beilage') && salatSection('nudel').every((r) => r.salat === 'nudel'), 'nicht im Wischstapel, Chips je Gruppe (auch „BBQ-Beilagen“)')
const bpS = addBake({}, SAT, NUDEL, 1)
ok(!replacesDinner(nudel) && !eveningOn(bpS, SAT) && dinnerToReplace(dinner, SAT)?.recipeId === jamb.id, 'Salat einplanen belegt den Tag nicht – das Abendessen bleibt')
const beil = addBake({}, SAT, 'southern-potato-salad', 1)
ok(!bbqOn(beil, SAT) && !eveningOn(beil, SAT), 'BBQ-Beilage allein ist kein Grillabend')
const w2 = run(bpS, [], dinner)
ok(need(w2, 'Fusilli') === 250 && need(w2, 'Langkornreis') > 0, 'Einkauf: Salat-Zutaten zusätzlich zum Abendessen')
const calS = plannedDinners(dinner, TODAY, bpS).find((d) => d.key === `dinner:${SAT}`)
ok(!!calS && calS.summary === `🍽️ ${jamb.title}` && calS.description.includes(`Dazu: ${nudel.title}`), 'Kalender: Abendessen bleibt, „Dazu: Nudelsalat …“ in der Beschreibung')
const sS = settleBaked({ pantry: [], bakePlan: bpS, baked: [] }, SAT, NUDEL)!
const rest = sS.pantry.find((l) => l.name === 'Nudelsalat (selbstgemacht)')
ok(!!rest && rest.amount === 6 && rest.unit === 'Portion' && rest.expires === '2026-11-30' && CATALOG['Nudelsalat (selbstgemacht)'] === 'molkerei' && NON_VEG.has('Nudelsalat (selbstgemacht)'), 'Fertig: 6 Portionen in den Vorrat (Kühlschrank, 2 Tage)')
const eat = eatOne(sS.pantry, rest!.id, SAT)
ok(eat.snack?.kcal === nudel.yields!.perPiece!.kcal && eat.pantry.find((l) => l.id === rest!.id)?.amount === 5, `„1 Portion gegessen“: ${eat.snack?.kcal} kcal in die Tagesbilanz`)
const mS = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: TODAY, bakePlan: bpS, baked: sS.baked, bakeRatings: { [`${SAT}:${NUDEL}`]: 'again' } })
ok((mS.feature.get('salat:nudel')?.sum ?? 0) > 0 && (mS.recipe.get(NUDEL)?.sum ?? 0) > 2, 'Lernen: geplant, gemacht, bewertet (Muster „Nudelsalate“)')

// ───── 8) Geräte: Paellapfanne und Plancha ─────
ok(validateSetting(paella('32', 'Köcheln', { level: '6', minutes: 10 })).length === 0 && validateSetting(paella('46', 'Köcheln', { level: 'mittel', minutes: 10 })).length === 0, 'Paella 32 cm (BORA-Stufe) und 46 cm (Gasgrill-Flamme) gültig')
ok(validateSetting(paella('32', 'Köcheln', { level: 'mittel' })).length > 0 && validateSetting(paella('46', 'Köcheln', { level: '6' })).length > 0 && validateSetting({ ...paella('32', 'Köcheln', { level: '6' }), on: 'gasgrill' }).length > 0, 'falsche Stufe bzw. Hitzequelle wird gemeldet')
ok(validateSetting(paella('32', 'Ruhen', { minutes: 5 })).length === 0 && validateSetting(paella('32', 'Ruhen', { level: '3', minutes: 5 })).length > 0 && validateSetting({ ...paella('46', 'Köcheln', { level: 'hoch' }), temp: 200 }).length > 0, 'Ruhen ohne Stufe, keine Temperatur bei der Paellapfanne')
ok(settingText(paella('32', 'Köcheln', { level: '6', minutes: 10 })) === 'Paellapfanne 32 cm · BORA Brücke · Köcheln · Stufe 6 · 10 Min.', `Chip: ${settingText(paella('32', 'Köcheln', { level: '6', minutes: 10 }))}`)
ok(settingText(paella('46', 'Socarrat', { level: 'hoch', minutes: 2 })) === 'Paellapfanne 46 cm · Gasgrill · Socarrat · Brenner alle hoch · 2 Min.', `Chip: ${settingText(paella('46', 'Socarrat', { level: 'hoch', minutes: 2 }))}`)
ok(validateSetting(plancha('bora', 'Braten', { level: '8', minutes: 3 })).length === 0 && validateSetting(plancha('gasgrill', 'Vorheizen', { level: 'hoch', temp: 280, minutes: 10 })).length === 0 && validateSetting(plancha('gasgrill', 'Braten', { level: 'hoch', temp: 400 })).length > 0, 'Plancha auf BORA/Gasgrill, Oberfläche bis 350 °C')
ok(settingText(plancha('gasgrill', 'Braten', { level: 'hoch', temp: 280, minutes: 3 })) === 'Plancha · Gasgrill · Braten 280 °C · Brenner alle hoch · 3 Min.', 'Chip Plancha')
const step = (text: string, settings: Parameters<typeof checkStep>[2]['settings']) => checkStep('x', 0, { text, settings })
ok(step('Den Reis einstreuen und 10 Minuten köcheln, dabei gelegentlich umrühren.', [paella('32', 'Köcheln', { level: '8', minutes: 10 })]).some((f) => /nicht mehr rühren/.test(f.msg)), 'Regel: nach der Reiszugabe nicht rühren')
ok(step('Den Reis einstreuen, einmal verteilen und ab jetzt nicht mehr rühren; 10 Minuten köcheln.', [paella('32', 'Köcheln', { level: '8', minutes: 10 })]).length === 0, '„nicht mehr rühren“ ist richtig')
ok(step('Die Paella in der 46 cm großen Pfanne 10 Minuten köcheln.', [paella('32', 'Köcheln', { level: '8', minutes: 10 })]).some((f) => /46 cm/.test(f.msg)), 'Regel: Pfannengröße im Text = Einstellung')
ok(step('Mit geschlossenem Deckel 10 Minuten köcheln lassen, nicht rühren.', [paella('46', 'Köcheln', { level: 'mittel', minutes: 10 })]).some((f) => /Deckel/.test(f.msg)), 'Regel: große Pfanne auf dem Gasgrill mit offenem Deckel')

// ───── 9) Spanische Desserts im Backen-Bereich ─────
const cc = RECIPE_BY_ID['crema-catalana']
ok(!!cc && isBakery(cc) && cc.kind === 'dessert' && cc.cuisine === 'es' && !RECIPES.includes(cc) && (cc.yields?.perPiece?.kcal ?? 0) > 100, 'Crema catalana: Dessert (Backen-Bereich), Küche Spanisch')

if (fails) {
  console.error(`${fails} Test(s) fehlgeschlagen`)
  process.exit(1)
}
console.log('Alle Tests OK')
