// Logiktest lernende Vorlieben:  npx vite-node scripts/test-learning.ts
import { BREAKFASTS, RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { addDaysIso } from '../src/kitchen'
import { addReject, buildModel, hintOk, satietyBonus, satietyIndex, satietyLean, satietyNote, mainProtein, pendingRating, portionFactor, portionNote, preference, summarize, type PortionFeedback, type RejectEvent } from '../src/learning'
import type { WeekPlan } from '../src/types'
import { withDinner } from '../src/app/actions/plan'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const today = '2026-11-16'

// Hauptzutat
ok(mainProtein(RECIPE_BY_ID['lachs-senf-dill']) === 'Fisch', 'Hauptzutat Lachs → Fisch')
ok(mainProtein(RECIPE_BY_ID['frikadellen']) === 'Hackfleisch', 'Hauptzutat Frikadellen → Hackfleisch')
ok(mainProtein(RECIPE_BY_ID['tomatensuppe']) === 'vegetarisch', 'Tomatensuppe → vegetarisch')

// 8 Wochen Verlauf: viele Eintöpfe gekocht, Fisch stets weggewischt, Hackbraten schlecht bewertet
const eintopfIds = RECIPES.filter((r) => r.type === 'eintopf').map((r) => r.id)
const fishIds = RECIPES.filter((r) => mainProtein(r) === 'Fisch').map((r) => r.id)
const plan: WeekPlan = {}
const rejects: RejectEvent[] = []
for (let w = 0; w < 8; w++) {
  for (let d = 0; d < 3; d++) {
    const day = addDaysIso('2026-09-21', w * 7 + d)
    plan[day] = { recipeId: eintopfIds[(w * 3 + d) % 10], servings: 2, status: 'cooked' }
  }
  for (const f of fishIds.slice(0, 3)) rejects.push({ id: f, date: addDaysIso('2026-09-21', w * 7) })
}
plan['2026-11-10'] = { recipeId: 'hackbraten', servings: 2, status: 'cooked' }
const m = buildModel({ plan, breakfast: {}, breakfastPicks: {}, rejects, ratings: { '2026-11-10': 'down' }, today })

const unseenEintopf = RECIPE_BY_ID[eintopfIds[eintopfIds.length - 1]]
const pE = preference(m, unseenEintopf)
console.log(`  nie gekochter Eintopf (${unseenEintopf.title}): ${pE.score.toFixed(2)} ${pE.reason ?? ''}`)
ok(pE.score > 0.5, 'Muster: auch ein nie gewählter Eintopf rückt nach vorne')
// ein Fisch-Gericht, das kein Eintopf ist (sonst wirkt das gelernte Eintopf-Muster dagegen)
const unseenFish = RECIPE_BY_ID[[...fishIds].reverse().find((id) => RECIPE_BY_ID[id].type !== 'eintopf')!]
const pF = preference(m, unseenFish)
console.log(`  nie gesehener Fisch (${unseenFish.title}): ${pF.score.toFixed(2)}`)
ok(pF.score < 0, 'Muster: Fisch (oft weggewischt) rückt nach hinten')
ok(preference(m, RECIPE_BY_ID['hackbraten']).score < preference(m, RECIPE_BY_ID['frikadellen']).score, '👎 Hackbraten liegt hinter Frikadellen')
ok(preference(m, RECIPE_BY_ID[eintopfIds[0]]).reason === '❤️ magst du', 'Oft gekochtes Gericht → „❤️ magst du“')

// Zeitverfall: dieselben Signale vor 1 Jahr zählen deutlich weniger
const old: WeekPlan = Object.fromEntries(Object.entries(plan).map(([d, e]) => [addDaysIso(d, -365), e]))
const mOld = buildModel({ plan: old, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today })
ok(preference(mOld, unseenEintopf).score < pE.score / 2, 'Ältere Signale verblassen')

// „Zurücksetzen“: since nach allen Signalen → neutral
const mReset = buildModel({ plan, breakfast: {}, breakfastPicks: {}, rejects, ratings: {}, today, since: today })
ok(preference(mReset, unseenEintopf).score === 0 && mReset.signals === 0, 'Zurücksetzen → neutral')

// Wirkung auf die Reihenfolge: Anteil Eintöpfe unter den Top 20 nach Vorliebe
const top = [...RECIPES].sort((a, b) => preference(m, b).score - preference(m, a).score).slice(0, 20)
const share = top.filter((r) => r.type === 'eintopf').length
console.log(`  Top 20 nach Vorliebe: ${share} Eintöpfe, ${top.filter((r) => mainProtein(r) === 'Fisch').length} Fisch`)
ok(share >= 8 && !top.some((r) => mainProtein(r) === 'Fisch'), 'Gelerntes prägt die Reihenfolge')

// Übersicht
const s = summarize(m)
console.log('  Magst du:', s.liked.map((x) => x.label).join(' · '), '| Eher nicht:', s.disliked.map((x) => x.label).join(' · '))
ok(s.liked.some((x) => x.label === 'Eintopf') && s.disliked.some((x) => x.label === 'Gerichte mit Fisch'), 'Übersicht nennt Eintopf / Fisch')

// Bewertungsfrage: gestern gekocht, nicht bewertet
ok(pendingRating({ '2026-11-15': { recipeId: 'carbonara', servings: 2, status: 'cooked' } }, {}, today, []) === '2026-11-15', 'Bewertungsfrage für gestern')
ok(pendingRating({ '2026-11-10': { recipeId: 'carbonara', servings: 2, status: 'cooked' } }, {}, today, []) === undefined, 'Keine Frage für Essen vor 6 Tagen')

// Portionsfaktor: lernt aus „zu wenig / passt / zu viel“, vorsichtig, mit Zeitverfall
const fb = (xs: [number, PortionFeedback][]) => Object.fromEntries(xs.map(([ago, v]) => [addDaysIso(today, -ago), v]))
ok(portionFactor({}, today) === 1 && portionFactor(undefined, today) === 1, 'Portionsfaktor ohne Rückmeldung: 1,0')
ok(portionFactor(fb([[1, -1]]), today) === 1, 'Portionsfaktor: eine Rückmeldung bewegt noch nichts')
const pMore2 = portionFactor(fb([[1, -1], [3, -1]]), today)
ok(pMore2 > 1 && pMore2 <= 1.1, `Portionsfaktor: 2× „zu wenig“ → leicht mehr (${pMore2})`)
const pMore = portionFactor(fb(Array.from({ length: 30 }, (_, i) => [i, -1] as [number, PortionFeedback])), today)
ok(pMore === 1.2, `Portionsfaktor: dauerhaft „zu wenig“ → Obergrenze 1,2 (${pMore})`)
const pLess = portionFactor(fb(Array.from({ length: 30 }, (_, i) => [i, 1] as [number, PortionFeedback])), today)
ok(pLess === 0.85, `Portionsfaktor: dauerhaft „zu viel“ → Untergrenze 0,85 (${pLess})`)
ok(portionFactor(fb([[1, 0], [2, 0], [3, 0], [4, 0]]), today) === 1, 'Portionsfaktor: „passt“ → 1,0')
ok(portionFactor(fb([[1, -1], [2, 1]]), today) === 1, 'Portionsfaktor: gegenläufig → 1,0')
const pOld = portionFactor(fb([[300, -1], [301, -1], [302, -1], [303, -1]]), today)
ok(pOld < 1.05, `Portionsfaktor: sehr alte Rückmeldungen verblassen (${pOld})`)
const recent = portionFactor(fb([[1, -1], [2, -1], [3, -1], [4, -1], [200, 1], [201, 1], [202, 1]]), today)
ok(recent > 1, `Portionsfaktor: neue Rückmeldungen zählen mehr als alte (${recent})`)
ok(portionNote(1) === undefined && portionNote(1.1) === 'ihr braucht eher etwas mehr (+10 %)' && portionNote(0.9) === 'ihr braucht eher etwas weniger (−10 %)', 'Portionsfaktor: Text für „Das habe ich gelernt“')


// ───── Frühstück: vorbereitet, Bewertung nach dem Vorbereiten, Sättigung ─────
{
  const base = { plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today }
  const lins = RECIPE_BY_ID['linsen-ei-salat']
  const key = `${addDaysIso(today, -6)}:${lins.id}`
  const p0 = preference(buildModel(base), lins).score
  const pPrep = preference(buildModel({ ...base, bfPrepped: [{ date: addDaysIso(today, -6), recipeId: lins.id }] }), lins).score
  const pUp = preference(buildModel({ ...base, bfRatings: { [key]: 'again' } }), lins).score
  const pDown = preference(buildModel({ ...base, bfRatings: { [key]: 'down' } }), lins).score
  ok(pPrep > p0, 'Frühstück: vorbereitet zählt wie gekocht (+)')
  ok(pUp > p0 && pDown < p0, `Frühstück: Bewertung 🔁 hebt, 👎 senkt (${pDown.toFixed(2)} < ${p0} < ${pUp.toFixed(2)})`)
  const pHungry = preference(buildModel({ ...base, bfSatiety: { [key]: -1 } }), lins).score
  const pFits = preference(buildModel({ ...base, bfSatiety: { [key]: 0 } }), lins).score
  ok(pHungry < p0 && pFits > p0, 'Frühstück: „zu wenig“ senkt das Rezept, „passt“ hebt es')
  // Merkmal bf:<Typ>: ein anderes herzhaftes Frühstück profitiert mit
  const other = RECIPE_BY_ID['eiermuffins-spinat-feta']
  ok(preference(buildModel({ ...base, bfRatings: { [key]: 'up' } }), other).score > preference(buildModel(base), other).score, 'Frühstück: 👍 hebt auch andere herzhafte Frühstücke (Merkmal bf:herzhaft)')
  // Abendessen mit anderer Hauptzutat bleiben von Frühstücks-Bewertungen unberührt (geteilt ist nur das Merkmal protein:…)
  const dinner = RECIPES.find((r) => mainProtein(r) === 'Rind')!
  ok(preference(buildModel({ ...base, bfRatings: { [key]: 'down' } }), dinner).score === preference(buildModel(base), dinner).score, 'Frühstücks-Bewertung verschiebt kein Rind-Abendessen')

  // Sättigungs-Neigung
  const d = (n: number) => `${addDaysIso(today, -n)}:${lins.id}`
  ok(satietyLean({ [d(3)]: -1 }, today) === 0, 'Sättigung: eine Rückmeldung reicht noch nicht')
  const hungry = satietyLean({ [d(3)]: -1, [d(10)]: -1, [d(17)]: -1 }, today)
  const full = satietyLean({ [d(3)]: 1, [d(10)]: 1, [d(17)]: 1 }, today)
  ok(hungry > 0.3 && full < -0.3 && satietyLean({ [d(3)]: 0, [d(10)]: 0 }, today) === 0, `Sättigung: zu wenig → +${hungry}, zu viel → ${full}, passt → 0`)
  ok(satietyLean({ [d(3)]: -1, [d(10)]: -1, '2099-01-01:x': 1 }, today) > 0, 'Sättigung: Zukunft zählt nicht')
  // Rangfolge: „zu wenig“ → sättigendste Frühstücke nach vorn, „zu viel“ → leichteste nach vorn
  const rank = (lean: number) => [...BREAKFASTS].sort((a, b) => satietyBonus(b, lean, BREAKFASTS) - satietyBonus(a, lean, BREAKFASTS))
  const bySat = [...BREAKFASTS].sort((a, b) => satietyIndex(b) - satietyIndex(a))
  const top = rank(hungry).slice(0, 5)
  ok(top.filter((r) => bySat.slice(0, 8).includes(r)).length >= 4, `Sättigung „zu wenig“: oben ${top.map((r) => r.id).join(', ')}`)
  const light = rank(full)[0]
  const minKcal = Math.min(...BREAKFASTS.map((r) => r.nutrition.kcal))
  ok(light.nutrition.kcal <= minKcal + 40, `Sättigung „zu viel“: leichtestes zuerst (${light.id}, ${light.nutrition.kcal} kcal)`)
  ok(BREAKFASTS.every((r) => satietyBonus(r, 0, BREAKFASTS) === 0), 'Sättigung: ohne Rückmeldung keine Verschiebung')
  ok(satietyBonus(RECIPES[0], hungry, BREAKFASTS) === 0, 'Sättigung: gilt nur fürs Frühstück')
  ok(!satietyNote(0) && !!satietyNote(hungry)?.includes('sättigendere') && !!satietyNote(full)?.includes('leichtere'), 'Sättigung: Text für „Das habe ich gelernt“')
}

// Wegwischen: dasselbe Gericht zählt höchstens einmal pro Tag (mehrmals durch den Stapel wischen)
{
  let rj: RejectEvent[] = []
  for (let i = 0; i < 4; i++) rj = addReject(rj, 'rindergulasch', today)
  rj = addReject(rj, 'rindergulasch', addDaysIso(today, 1))
  rj = addReject(rj, 'frikadellen', today)
  ok(rj.length === 3, `Wegwischen: 4× am selben Tag zählt einmal (${rj.length} Signale)`)
  const once = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: addReject([], 'rindergulasch', today), ratings: {}, today })
  const many = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [0, 1, 2].reduce<RejectEvent[]>((a) => addReject(a, 'rindergulasch', today), []), ratings: {}, today })
  ok(preference(once, RECIPE_BY_ID['rindergulasch']).score === preference(many, RECIPE_BY_ID['rindergulasch']).score, 'Wegwischen: mehrfaches Wischen am selben Tag wertet nicht stärker ab')
}

// Anderes Gericht auf einen bewerteten Tag: Bewertung/Portion des alten Gerichts gehen nicht aufs neue über
{
  const day = addDaysIso(today, -1)
  const s0 = {
    plan: { [day]: { recipeId: 'hackbraten', servings: 2, status: 'cooked' as const, consumed: [] } } as WeekPlan,
    pantry: [],
    ratings: { [day]: 'down' as const },
    portionFeedback: { [day]: 1 as PortionFeedback },
    ratingDismissed: [day],
  }
  const swapped = withDinner(s0, day, { recipeId: 'frikadellen', servings: 2 })
  ok(swapped.plan[day]?.recipeId === 'frikadellen' && !swapped.ratings[day] && swapped.portionFeedback[day] === undefined && !swapped.ratingDismissed.includes(day), 'Tag neu belegt: alte Bewertung, Portion und Wegklicken entfernt')
  const m1 = buildModel({ plan: swapped.plan, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: swapped.ratings, today })
  const m0 = buildModel({ plan: swapped.plan, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: s0.ratings, today })
  ok(preference(m1, RECIPE_BY_ID['frikadellen']).score > preference(m0, RECIPE_BY_ID['frikadellen']).score, 'Frikadellen erben das 👎 des Hackbratens nicht')
  const same = withDinner(s0, day, { recipeId: 'hackbraten', servings: 3 })
  ok(same.ratings[day] === 'down' && same.portionFeedback[day] === 1, 'gleiches Gericht (z. B. Portionen geändert): Bewertung bleibt')
  const cleared = withDinner(s0, day, undefined)
  ok(!cleared.plan[day] && !cleared.ratings[day], 'Tag geleert: Bewertung entfernt')
}

// ───── Vorlieben-Hinweise erst mit genug Belegen und relativ zum Grundanteil (vegetarisch ~15 %) ─────
{
  const base = { plan: {} as WeekPlan, breakfast: {}, breakfastPicks: {} as Record<string, string[]>, rejects: [] as RejectEvent[], ratings: {}, today }
  const veg = RECIPES.filter((r) => mainProtein(r) === 'vegetarisch')
  const meat = RECIPES.filter((r) => mainProtein(r) !== 'vegetarisch')
  const vegBf = BREAKFASTS.filter((r) => mainProtein(r) === 'vegetarisch')
  const vegUnseen = veg[veg.length - 1]
  const says = (m: ReturnType<typeof buildModel>) => preference(m, vegUnseen).reason ?? ''
  // neuer Nutzer: 2 Frühstücke (vegetarisch) gewählt + 2 Abendessen gewischt (1 vegetarisch, 1 Fleisch)
  const early = buildModel({
    ...base,
    breakfastPicks: { [addDaysIso(today, -1)]: [vegBf[0].id, vegBf[1].id] },
    plan: { [today]: { recipeId: veg[0].id, servings: 2 }, [addDaysIso(today, 1)]: { recipeId: meat[0].id, servings: 2 } },
  })
  ok(!/Vegetarisches/.test(says(early)), `nach 3–4 Entscheidungen kein „Vegetarisches magst du“ (${says(early) || 'kein Hinweis'})`)
  ok(!summarize(early).liked.some((x) => x.label === 'Vegetarisches'), 'Übersicht: nach wenigen Signalen kein „Vegetarisches“')
  ok(preference(early, vegUnseen).score > preference(buildModel(base), vegUnseen).score, 'Ranking lernt trotzdem sanft mit (vegetarisch leicht vorn)')
  // üblicher Haushalt über Wochen: ~15 % vegetarisch, dazu jede Woche 2 vegetarische Frühstücke → kein „Vegetarisches magst du“
  const plan: WeekPlan = {}
  const picks: Record<string, string[]> = {}
  for (let i = 0; i < 28; i++) {
    const day = addDaysIso(today, -i)
    plan[day] = { recipeId: (i % 7 === 0 ? veg[i % veg.length] : meat[i % meat.length]).id, servings: 2, status: 'cooked' }
    if (i % 7 === 0) picks[day] = [vegBf[0].id, vegBf[1].id]
  }
  const usual = buildModel({ ...base, plan, breakfastPicks: picks })
  ok(!hintOk(usual, 'protein:vegetarisch') && !summarize(usual).liked.some((x) => x.label === 'Vegetarisches'), 'üblicher Anteil (~15 %) + vegetarisches Frühstück → keine Vorliebe „Vegetarisches“')
  // deutlich mehr vegetarisch (jeden zweiten Tag) → wird genannt
  const vegPlan: WeekPlan = {}
  for (let i = 0; i < 20; i++) vegPlan[addDaysIso(today, -i)] = { recipeId: (i % 2 ? veg[i % veg.length] : meat[i % meat.length]).id, servings: 2, status: 'cooked' }
  const vegFan = buildModel({ ...base, plan: vegPlan })
  ok(hintOk(vegFan, 'protein:vegetarisch'), 'jeden zweiten Tag vegetarisch → deutlich über dem Grundanteil, darf genannt werden')
  // andere Muster: erst ab Mindestzahl an Signalen
  const one = buildModel({ ...base, plan: { [today]: { recipeId: eintopfIds[0], servings: 2, status: 'cooked' } } })
  ok(!hintOk(one, 'type:eintopf') && !summarize(one).liked.length, 'ein einziges Gericht → noch kein Muster in der Übersicht')
}

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
