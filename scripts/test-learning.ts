// Logiktest lernende Vorlieben:  npx vite-node scripts/test-learning.ts
import { RECIPES, RECIPE_BY_ID } from '../src/data/recipes'
import { addDaysIso } from '../src/kitchen'
import { buildModel, mainProtein, pendingRating, portionFactor, portionNote, preference, summarize, type PortionFeedback, type RejectEvent } from '../src/learning'
import type { WeekPlan } from '../src/types'

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
const unseenFish = RECIPE_BY_ID[fishIds[fishIds.length - 1]]
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

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
