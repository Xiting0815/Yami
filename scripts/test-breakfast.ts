// Logiktest Meal-Prep-Frühstück:  npx vite-node scripts/test-breakfast.ts
import { applyBreakfastPicks, assignBreakfasts, coveredDays, learnedPrepWeekday, prepPlan, resolvePrepDay } from '../src/breakfast'
import { containerText, finishPrep, openPrepDays, pendingSatiety, prepKey, prepRatingKey, prepWeek, preppedText, undoPrep, type PrepState } from '../src/breakfastPrep'
import { addDaysIso, allNeedsOf, planWeek, type PantryLot } from '../src/kitchen'
import { RECIPE_BY_ID } from '../src/data/recipes'
import { settleDue } from '../src/app/upkeep'
import { tripsOf } from '../src/tripState'
import { backupBody, parseBackup } from '../src/backup'
import { sanitize } from '../src/store'
import { formatAmount } from '../src/shopping'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const show = (a: ReturnType<typeof assignBreakfasts>) => days.slice(0, 5).map((d) => `${d.slice(8)}:${a.days[d] ?? '–'}${a.frozen.includes(d) ? '❄' : ''}`).join(' ')

// Oats (3 Tage) + Chia (5 Tage): Oats Mo–Mi, Chia Do–Fr, nichts einfrieren
let a = assignBreakfasts(['chia-beeren', 'oats-apfel-zimt'], days)
console.log(' ', show(a))
ok(a.days[days[0]] === 'oats-apfel-zimt' && a.days[days[2]] === 'oats-apfel-zimt' && a.days[days[4]] === 'chia-beeren' && !a.frozen.length && !a.notes.length, 'Oats Mo–Mi, Chia Do–Fr')

// Oats + Eiermuffins (4 Tage, einfrierbar): Fr-Muffins einfrieren
a = assignBreakfasts(['oats-beeren', 'eiermuffins-spinat-feta'], days)
console.log(' ', show(a), '|', a.notes.join(' '))
ok(a.frozen.length === 1 && a.frozen[0] === days[4], 'Freitags-Muffins werden eingefroren')

// Zwei kurz haltbare (Oats + Oats): Do/Fr nicht abgedeckt → Hinweis
a = assignBreakfasts(['oats-beeren', 'oats-apfel-zimt'], days)
console.log(' ', show(a), '|', a.notes.join(' '))
ok(Object.keys(a.days).length === 3 && a.notes.length === 1, 'Hinweis, wenn Do/Fr nicht halten')

// Nur Burrito (4 Tage, einfrierbar): ganze Woche, Fr eingefroren
a = assignBreakfasts(['burrito'], days)
ok(Object.keys(a.days).length === 5 && a.frozen.length === 1, 'Ein einfrierbares Frühstück reicht für Mo–Fr')

// Prep-Liste: Ofen zuerst, Mengen hochgerechnet
a = assignBreakfasts(['oats-beeren', 'eiermuffins-spinat-feta'], days)
const prep = prepPlan(a)
ok(prep[0].recipe.id === 'eiermuffins-spinat-feta', 'Ofengericht steht in der Prep-Liste zuerst')
const skyr = prep.find((p) => p.recipe.id === 'oats-beeren')!.ingredients.find((i) => i.name === 'Skyr')!
ok(skyr.amount === 450, `Skyr für 3 Portionen Oats: ${skyr.amount} g`)

// Einkauf: Frühstückszutaten landen auf der Liste
const bf: WeekPlan = Object.fromEntries(Object.entries(a.days).map(([d, id]) => [d, { recipeId: id, servings: 1 }]))
const w = planWeek({}, days, [], {}, days[0], {}, formatAmount, bf)
const sk = w.buy.find((b) => b.name === 'Skyr')
ok(!!sk && sk.packs === 1, `Skyr auf der Einkaufsliste: ${sk?.packs} Becher (450 g)`)
ok(w.buy.some((b) => b.name === 'Eiklar'), 'Eiklar auf der Einkaufsliste')
console.log(`  Frühstück Mo–Fr kostet ≈ ${w.total.toFixed(2)} € Einkauf`)

// ───── Freier Prep-Tag ─────
const wd = (d: string) => d.slice(8)
const mon = days[0], tue = days[1], wed = days[2], thu = days[3], fri = days[4], sun = addDaysIso(mon, -1)
a = assignBreakfasts(['burrito'], days, sun)
ok(JSON.stringify(a.days) === JSON.stringify(assignBreakfasts(['burrito'], days).days), 'Prep Sonntag = Standard (unverändert)')
// Prep Montag: Di–Fr, Alter 1–4
a = assignBreakfasts(['burrito'], days, mon)
console.log(' ', show(a), '|', a.notes.join(' '))
ok(!a.days[mon] && [tue, wed, thu, fri].every((d) => a.days[d]) && Object.keys(a.days).length === 4, 'Prep Montag: nur Di–Fr')
ok(a.frozen.length === 0, 'Prep Montag: Burrito (4 Tage) hält Di–Fr ohne Einfrieren (Alter 1–4)')
a = assignBreakfasts(['oats-beeren', 'eiermuffins-spinat-feta'], days, mon)
ok(Object.keys(a.days).length === 4 && !a.days[mon], 'Prep Montag, zwei Rezepte: 4 Tage')
// Prep Mittwoch: Do–Fr; Oats (3 Tage) reicht, nichts nötig einzufrieren
a = assignBreakfasts(['oats-beeren'], days, wed)
ok(Object.keys(a.days).sort().join() === [thu, fri].join() && !a.frozen.length, 'Prep Mittwoch: Do–Fr')
// Alter zählt ab Prep-Tag: Oats (3 Tage) bei Prep Montag → Di, Mi, Do ok, Fr (Alter 4) nicht
a = assignBreakfasts(['oats-beeren'], days, mon)
ok(Object.keys(a.days).sort().join() === [tue, wed, thu].join() && a.notes.length === 1, `Prep Montag: Oats nur bis Do (Alter 3), Hinweis nennt Fr`)
ok(/Fr/.test(a.notes[0]) && !/Mo/.test(a.notes[0]), 'Hinweis nennt nur nicht abgedeckte Tage nach dem Prep-Tag')
// Einfrieren: Muffins (4 Tage, einfrierbar) bei Prep Sonntag → Fr (Alter 5) eingefroren; Hinweis nennt Prep-Tag
a = assignBreakfasts(['eiermuffins-spinat-feta'], days, sun)
ok(a.frozen.join() === fri && /am Sonntag einfrieren/.test(a.notes[0]) && /Vorabend \(ab Donnerstag\)/.test(a.notes[0]), 'Einfrier-Hinweis: Sonntag, Vorabend ab Donnerstag')
// Prep Dienstag: Mi–Fr = Alter 1–3 → nichts einfrieren; Hinweis ohne Einfrieren
a = assignBreakfasts(['eiermuffins-spinat-feta'], days, tue)
ok(Object.keys(a.days).length === 3 && !a.frozen.length, 'Prep Dienstag: Mi–Fr, nichts einzufrieren')
// Prep-Liste folgt den Portionen
const p4 = prepPlan(assignBreakfasts(['burrito'], days, mon))
ok(p4[0].portions === 4, 'Prep-Liste: 4 Portionen bei Prep Montag')
ok(coveredDays(days, mon).map(wd).join() === [tue, wed, thu, fri].map(wd).join(), 'coveredDays: Di–Fr')
// Einkauf: 4 Portionen Burrito statt 5
const bf4: WeekPlan = Object.fromEntries(Object.entries(assignBreakfasts(['burrito'], days, mon).days).map(([d, id]) => [d, { recipeId: id, servings: 1 }]))
const w4 = planWeek({}, days, [], {}, days[0], {}, formatAmount, bf4)
ok(w4.buy.length > 0, `Einkaufsliste nur mit Frühstück (ohne Abendessen): ${w4.buy.length} Artikel`)

// ───── Lernen: üblicher Prep-Wochentag ─────
const today = '2026-11-16'
ok(learnedPrepWeekday({}, today) === 0, 'Lernen: ohne Daten Sonntag')
ok(learnedPrepWeekday({ '2026-11-09': '2026-11-09' }, today) === 0, 'Lernen: 1× Montag reicht nicht')
ok(learnedPrepWeekday({ '2026-11-09': '2026-11-09', '2026-11-02': '2026-11-02' }, today) === 1, 'Lernen: 2× Montag → Montag')
ok(learnedPrepWeekday({ '2026-11-09': '2026-11-09', '2026-11-02': '2026-11-02', '2026-10-26': '2026-10-25', '2026-10-19': '2026-10-18' }, today) === 1, 'Lernen: Gleichstand 2× Mo / 2× So → der jüngere Tag (Montag) gewinnt')
ok(learnedPrepWeekday({ '2026-01-05': '2026-01-05', '2025-12-29': '2025-12-29' }, today) === 0, 'Lernen: alte Wochen (> 8) zählen nicht')
const learnedDays = { '2026-11-09': '2026-11-09', '2026-11-02': '2026-11-02' }
ok(resolvePrepDay(learnedDays, days, today) === mon, 'resolvePrepDay: gelernt Montag → Montag der Woche')
ok(resolvePrepDay({}, days, today) === sun, 'resolvePrepDay: Standard Sonntag davor')
ok(resolvePrepDay({ [mon]: wed }, days, today) === wed, 'resolvePrepDay: gespeicherter Tag gewinnt')
ok(resolvePrepDay({ [mon]: addDaysIso(mon, 5) }, days, today) === sun, 'resolvePrepDay: ungültiger Tag (Sa) wird ignoriert')


// ───── „Fertig vorbereitet“: Prep abhaken, Portionen in den Vorrat, keine Doppelbuchung ─────
{
  const week = '2026-11-16'
  const sunday = '2026-11-15'
  const lins = RECIPE_BY_ID['linsen-ei-salat']
  const wk = Array.from({ length: 5 }, (_, i) => addDaysIso(week, i))
  const bf: WeekPlan = {}
  for (const d of wk.slice(0, 4)) bf[d] = { recipeId: lins.id, servings: 1 }
  bf[wk[4]] = { recipeId: 'chia-beeren', servings: 1 }
  const needs4 = allNeedsOf(lins, 4)
  // Vorrat: genau 4 Portionen Zutaten (+ ein fremder Posten)
  const pantry0: PantryLot[] = [
    ...needs4.map((n, i) => ({ id: 'z' + i, name: n.name, amount: n.amount, unit: n.unit, expires: addDaysIso(sunday, 20) })),
    { id: 'x', name: 'Sahne', amount: 200, unit: 'ml', expires: addDaysIso(sunday, 20) },
  ]
  const ingTotal = (p: PantryLot[]) => p.filter((l) => needs4.some((n) => n.name === l.name)).reduce((a, l) => a + l.amount, 0)
  const s0: PrepState = { breakfast: bf, pantry: pantry0, prepChecked: { [week]: [prepKey(lins.id, 0)] }, bfPreps: [] }

  ok(containerText('Glas', 4) === '4 Gläser' && containerText('Glas', 1) === '1 Glas' && containerText('Glas (ofenfest)', 2) === '2 Gläser' && containerText('Alufolie/Dose', 3) === '3 Portionen', 'Behälter: Mehrzahl (Gläser, Portionen)')
  ok(preppedText(lins, 4) === '4 Gläser Herzhafter Linsensalat mit Ei und Feta', `Vorrat-Text: ${preppedText(lins, 4)}`)
  ok(openPrepDays(bf, lins.id, week, sunday).length === 4, 'offene Tage: Mo–Do')
  ok(prepWeek({ [week]: [lins.id, 'chia-beeren'] }, bf, lins.id, sunday, ['2026-11-09', week]) === week, 'Prep-Woche: die Woche, in der das Rezept gewählt ist')

  const { state: s1, prep } = finishPrep(s0, lins, 4, week, sunday, 'jar1')
  const jar = s1.pantry.find((l) => l.id === 'jar1')
  ok(!!jar && jar.amount === 4 && jar.unit === 'Glas' && jar.name === lins.title && jar.expires === addDaysIso(sunday, lins.breakfast!.fridgeDays), `Fertig: 4 Gläser im Vorrat, hält ${lins.breakfast!.fridgeDays} Tage (${jar?.expires})`)
  ok(ingTotal(s1.pantry) < 1e-6 && ingTotal(pantry0) > 0, 'Fertig: Zutaten für 4 Portionen sofort abgezogen')
  ok(s1.pantry.some((l) => l.id === 'x' && l.amount === 200), 'Fertig: andere Posten bleiben')
  ok(wk.slice(0, 4).every((d) => s1.breakfast[d]?.prep === 'jar1') && !s1.breakfast[wk[4]]?.prep, 'Fertig: Mo–Do mit dem Glas-Posten verknüpft, Fr (anderes Frühstück) nicht')
  const keys = lins.steps.map((_, i) => prepKey(lins.id, i))
  ok(keys.every((k) => s1.prepChecked[week].includes(k)) && new Set(s1.prepChecked[week]).size === s1.prepChecked[week].length, 'Fertig: Prep-Liste dieses Rezepts komplett abgehakt (ohne Doppelte)')
  ok(prep.days.length === 4 && s1.bfPreps.length === 1 && prep.consumed.length > 0, 'Fertig: Vorbereitung mit entnommenen Zutaten gemerkt')
  ok(ingTotal(s0.pantry) === ingTotal(pantry0) && !s0.breakfast[wk[0]]?.prep, 'Fertig: Ausgangsstand unverändert (keine Mutation)')

  // Einkauf/Wochenplanung: vorbereitete Tage brauchen nichts mehr
  const pw0 = planWeek({}, days, pantry0, {}, sunday, {}, formatAmount, bf)
  const pw1 = planWeek({}, days, s1.pantry, {}, sunday, {}, formatAmount, s1.breakfast)
  const linsBuy = (r: typeof pw0) => r.buy.filter((b) => needs4.some((n) => n.name === b.name))
  ok(linsBuy(pw0).length === 0 && linsBuy(pw1).length === 0, 'planWeek: weder vor noch nach dem Vorbereiten etwas für den Linsensalat zu kaufen (keine Doppelbuchung)')
  ok(!pw1.leftovers.some((l) => l.id === 'jar1'), 'planWeek: die Gläser werden an den Frühstückstagen der Woche aufgegessen (nichts bleibt übrig)')
  const appState = (p: PrepState) => sanitize({ breakfast: p.breakfast, pantry: p.pantry, breakfastPicks: { [week]: [lins.id, 'chia-beeren'] }, prepDays: { [week]: sunday } })
  const tripBuys = (p: PrepState) => tripsOf(appState(p), sunday).flatMap((t) => t.buy).filter((b) => needs4.some((n) => n.name === b.name))
  ok(tripBuys({ ...s0, pantry: [] }).length > 0, 'Einkäufe: ohne Vorrat kommt der Linsensalat auf die Liste (Gegenprobe)')
  ok(tripBuys(s0).length === 0, 'Einkäufe: vor dem Vorbereiten deckt der Vorrat den Linsensalat')
  ok(tripBuys(s1).length === 0, 'Einkäufe: nach dem Vorbereiten wird nichts neu eingekauft')
  ok(appState(s1).breakfast[wk[0]]?.prep === 'jar1', 'Speichern: Verknüpfung `prep` bleibt beim Prüfen erhalten')

  // Frühstückstage: je 1 Glas, Zutaten nicht noch einmal
  const st = (p: PrepState) => ({ plan: {}, breakfast: p.breakfast, pantry: p.pantry, wasted: [], prices: {} })
  const tue = settleDue(st(s1), '2026-11-17')
  ok(tue.breakfast[wk[0]]?.status === 'cooked' && tue.pantry.find((l) => l.id === 'jar1')?.amount === 3, 'Montag gegessen: 1 Glas weniger (3 übrig)')
  ok(Math.abs(ingTotal(tue.pantry) - ingTotal(s1.pantry)) < 1e-6, 'Montag gegessen: keine Zutaten abgezogen')
  const sat = settleDue(st(s1), '2026-11-21')
  ok(!sat.pantry.some((l) => l.id === 'jar1') && wk.slice(0, 4).every((d) => sat.breakfast[d]?.status === 'cooked'), 'Mo–Do gegessen: alle 4 Gläser verbraucht')
  ok(sat.breakfast[wk[4]]?.status === 'cooked' && !sat.breakfast[wk[4]]?.prep, 'Freitag (nicht vorbereitet) wie bisher aus den Zutaten')
  const again = settleDue({ ...st(s1), breakfast: sat.breakfast, pantry: sat.pantry }, '2026-11-22')
  ok(!again.changed, 'cookDue am Folgetag: kein zweites Abziehen')

  // Glas-Posten weggeworfen → am Tag wird nichts (auch keine Zutaten) abgezogen
  const gone = settleDue({ ...st(s1), pantry: s1.pantry.filter((l) => l.id !== 'jar1') }, '2026-11-17')
  ok(gone.breakfast[wk[0]]?.status === 'cooked' && (gone.breakfast[wk[0]]?.consumed?.length ?? 0) === 0 && Math.abs(ingTotal(gone.pantry) - ingTotal(s1.pantry)) < 1e-6, 'Glas-Posten fehlt: gegessen, aber keine Zutaten nachträglich abgezogen')

  // nochmal „Fertig“ → ersetzt, nie doppelt
  const twice = finishPrep(s1, lins, 4, week, sunday, 'jar2').state
  ok(twice.pantry.filter((l) => l.name === lins.title).length === 1 && twice.pantry.find((l) => l.id === 'jar2')?.amount === 4 && Math.abs(ingTotal(twice.pantry) - ingTotal(s1.pantry)) < 1e-6, 'zweimal Fertig: alte Vorbereitung ersetzt, Zutaten nur einmal abgezogen')
  ok(twice.bfPreps.length === 1 && wk.slice(0, 4).every((d) => twice.breakfast[d]?.prep === 'jar2'), 'zweimal Fertig: eine Vorbereitung, Tage auf den neuen Posten')

  // weniger Portionen als Tage: nur so viele Tage verknüpft, der Rest wie bisher
  const three = finishPrep(s0, lins, 3, week, sunday, 'jar3').state
  ok(wk.slice(0, 3).every((d) => three.breakfast[d]?.prep === 'jar3') && !three.breakfast[wk[3]]?.prep, '3 Portionen: Mo–Mi verknüpft, Do bleibt offen (wird normal gekauft/abgezogen)')

  // Rückgängig
  const u0 = undoPrep(s1, week, lins.id, sunday)
  ok(Math.abs(ingTotal(u0.pantry) - ingTotal(pantry0)) < 1e-6 && !u0.pantry.some((l) => l.id === 'jar1'), 'Rückgängig: Zutaten zurück, Gläser weg')
  ok(wk.every((d) => !u0.breakfast[d]?.prep) && u0.bfPreps.length === 0 && !keys.some((k) => u0.prepChecked[week].includes(k)), 'Rückgängig: Tage entkoppelt, Prep-Liste wieder offen')
  const afterMon: PrepState = { ...s1, breakfast: tue.breakfast, pantry: tue.pantry }
  const u1 = undoPrep(afterMon, week, lins.id, '2026-11-17')
  const perDay = ingTotal(pantry0) / 4
  ok(Math.abs(ingTotal(u1.pantry) - (ingTotal(pantry0) - perDay)) < 1e-6 && u1.breakfast[wk[0]]?.status === 'cooked' && !u1.breakfast[wk[0]]?.prep, 'Rückgängig nach Montag: Montag zählt wieder aus den Zutaten (3 Portionen zurück)')

  // Neu wählen mitten drin: vorbereitete Tage bleiben verknüpft
  const re = applyBreakfastPicks(s1.breakfast, [lins.id, 'chia-beeren'], days, sunday, sunday)
  ok(wk.slice(0, 3).every((d) => re[d]?.prep === 'jar1') && re[wk[3]]?.recipeId === 'chia-beeren' && !re[wk[3]]?.prep, 'Frühstück neu verteilt: gleiche Tage bleiben mit den Gläsern verknüpft, anderes Frühstück nicht')

  // Sättigungsfrage: erster Frühstückstag ab mittags, danach bis 4 Tage
  const preps = s1.bfPreps
  ok(!pendingSatiety(preps, {}, [], sunday, 20), 'Satt-Frage: am Prep-Tag noch nicht')
  ok(!pendingSatiety(preps, {}, [], wk[0], 10), 'Satt-Frage: Montag vormittags noch nicht')
  ok(pendingSatiety(preps, {}, [], wk[0], 13)?.recipeId === lins.id, 'Satt-Frage: Montag ab mittags')
  ok(pendingSatiety(preps, {}, [], wk[1], 8)?.recipeId === lins.id, 'Satt-Frage: ab dem Tag danach')
  ok(!pendingSatiety(preps, { [prepRatingKey(prep)]: 0 }, [], wk[1], 8), 'Satt-Frage: beantwortet → weg')
  ok(!pendingSatiety(preps, {}, [prepRatingKey(prep)], wk[1], 8), 'Satt-Frage: weggeklickt → weg')
  ok(!pendingSatiety(preps, {}, [], addDaysIso(wk[0], 5), 13), 'Satt-Frage: nach 4 Tagen nicht mehr')

  // Sicherung: Vorbereitungen, Bewertung, Sättigung überstehen Export/Import
  const full = sanitize({ ...appState(s1), bfPreps: s1.bfPreps, bfRatings: { [prepRatingKey(prep)]: 'up', 'kaputt': 'up' }, bfSatiety: { [prepRatingKey(prep)]: -1, '2026-11-15:gibtsnicht': 1 } })
  const back = parseBackup(JSON.stringify(backupBody(full)))
  ok(back.bfPreps.length === 1 && back.bfPreps[0].lotId === 'jar1' && back.bfPreps[0].consumed.length === prep.consumed.length, 'Sicherung: Vorbereitung bleibt (mit entnommenen Zutaten)')
  ok(Object.keys(back.bfRatings).join() === prepRatingKey(prep) && back.bfSatiety[prepRatingKey(prep)] === -1 && Object.keys(back.bfSatiety).length === 1, 'Sicherung: Bewertung & Sättigung bleiben, kaputte fallen weg')
  ok(back.breakfast[wk[0]]?.prep === 'jar1', 'Sicherung: Verknüpfung der Tage bleibt')
}

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
