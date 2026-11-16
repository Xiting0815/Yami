// Logiktest Meal-Prep-Frühstück:  npx vite-node scripts/test-breakfast.ts
import { assignBreakfasts, coveredDays, learnedPrepWeekday, prepPlan, resolvePrepDay } from '../src/breakfast'
import { addDaysIso, planWeek } from '../src/kitchen'
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

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
