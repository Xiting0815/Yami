// Logiktest Wiegen/Trend/Ziel/Vorschläge:  npx vite-node scripts/test-progress.ts
import { bmr, bmrFormula, targetKcal, type Profile } from '../src/energy'
import { compositionHint, goalProgress, suggestion, upsertWeighIn, weighedThisWeek, weeklyRate, type WeighIn } from '../src/progress'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const me: Profile = { sex: 'm', age: 40, heightCm: 180, weightKg: 95, activity: 1.2, deficit: 500, lunchKcal: 600, goalWeight: 85 }

// Katch-McArdle mit Körperfett
ok(bmrFormula(me) === 'mifflin', 'Ohne Körperfett: Mifflin-St Jeor')
const withFat = { ...me, fatPct: 28 }
ok(bmrFormula(withFat) === 'katch' && Math.round(bmr(withFat)) === Math.round(370 + 21.6 * 95 * 0.72), `Mit 28 % Körperfett: Katch-McArdle ${Math.round(bmr(withFat))} kcal`)
ok(targetKcal({ ...me, adjust: -100 }) === targetKcal(me) - 100, 'Bestätigte Anpassung −100 kcal wirkt aufs Ziel')

// 1 Eintrag pro Woche
let list: WeighIn[] = []
list = upsertWeighIn(list, { date: '2026-11-16', weight: 95.0, fat: 28 })
list = upsertWeighIn(list, { date: '2026-11-18', weight: 94.8, fat: 28 })
ok(list.length === 1 && list[0].weight === 94.8, 'Zweite Messung derselben Woche ersetzt die erste')
ok(weighedThisWeek(list, '2026-11-20') && !weighedThisWeek(list, '2026-11-23'), 'Wiegetag-Erinnerung erst in der nächsten Woche')

// Stillstand 2 Wochen → −100
list = upsertWeighIn(list, { date: '2026-11-23', weight: 94.9 })
list = upsertWeighIn(list, { date: '2026-11-30', weight: 94.7 })
let s = suggestion(list, me, 0)
ok(s?.delta === -100, `Stillstand → ${s?.title}`)
ok(suggestion(list, me, list.length) === null, 'Nach Ja/Nein kein erneuter Vorschlag sofort')

// Grenzfall: −0,2 kg in 2 Wochen (erwartet ≈ −0,9) gilt als Stillstand
s = suggestion([{ date: '2026-11-16', weight: 95 }, { date: '2026-11-23', weight: 94.9 }, { date: '2026-11-30', weight: 94.8 }], me, 0)
ok(s?.delta === -100, `−0,2 kg in 2 Wochen → ${s?.title}`)

// zu schnell → +100
const fast: WeighIn[] = [{ date: '2026-11-16', weight: 95 }, { date: '2026-11-23', weight: 93.6 }, { date: '2026-11-30', weight: 92.2 }]
s = suggestion(fast, me, 0)
ok(s?.delta === 100, `1,4 kg/Woche → ${s?.title}`)

// im Plan → kein Vorschlag
const good: WeighIn[] = [{ date: '2026-11-16', weight: 95 }, { date: '2026-11-23', weight: 94.5 }, { date: '2026-11-30', weight: 94.0 }]
ok(suggestion(good, me, 0) === null, '0,5 kg/Woche → kein Vorschlag')
ok(Math.abs(weeklyRate(good)! + 0.5) < 0.01, 'Trend −0,5 kg/Woche')

// Ziel & Prognose
const early = goalProgress(good, me, '2026-11-30')!
ok(early.basis === 'plan', 'Mit nur 3 Messungen: Prognose nach geplantem Tempo')
const good4 = [...good, { date: '2026-12-07', weight: 93.5 }]
const g = goalProgress(good4, me, '2026-12-07')!
console.log(`  Ziel: ${g.start} → ${g.current} / ${g.goal} kg, ${Math.round(g.pct * 100)} %, noch ${g.remaining} kg, ca. ${g.eta} (${g.basis})`)
ok(Math.round(g.pct * 100) === 15 && g.eta === '2027-04-05' && g.basis === 'trend', 'Ab 4 Messungen Trend: 8,5 kg bei 0,5 kg/Woche = 17 Wochen → 5.4.2027')

// Muskelabbau-Hinweis
const muscleLoss: WeighIn[] = [{ date: '2026-11-16', weight: 95, fat: 27 }, { date: '2026-11-23', weight: 94.2, fat: 27.5 }, { date: '2026-11-30', weight: 93.5, fat: 28 }]
ok(!!compositionHint(muscleLoss), 'Gewicht ↓ + Körperfett ↑ → Hinweis Muskelabbau')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
