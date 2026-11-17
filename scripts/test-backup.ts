// Logiktest Datensicherung:  npx vite-node scripts/test-backup.ts
import { RECIPES } from '../src/data/recipes'
import { parseBackup } from '../src/backup'
import { sanitize } from '../src/store'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const throws = (fn: () => unknown) => { try { fn(); return false } catch { return true } }

const rid = RECIPES[0].id
const state = {
  plan: { '2026-11-16': { recipeId: rid, servings: 2 } },
  pantry: [],
  weighIns: [{ date: '2026-11-10', weight: 91.2 }],
  lastBackup: '2026-11-01',
}

// Hülle: Round Trip
const wrapped = JSON.stringify({ app: 'yami', version: 1, exportedAt: new Date().toISOString(), state })
const a = parseBackup(wrapped)
ok(a.plan['2026-11-16']?.recipeId === rid, 'Hülle: Plan bleibt erhalten')
ok(a.weighIns.length === 1 && a.weighIns[0].weight === 91.2, 'Hülle: Messungen bleiben erhalten')
ok(a.lastBackup === '2026-11-01', 'Hülle: lastBackup bleibt erhalten')
ok(a.defaultServings === 2 && Array.isArray(a.rejects), 'Hülle: fehlende Felder bekommen Startwerte')

// Prep-Tage: gültige bleiben, ungültige (Samstag, kaputtes Datum) fliegen raus
const pd = parseBackup(JSON.stringify({ app: 'yami', version: 1, state: { ...state, prepDays: { '2026-11-16': '2026-11-16', '2026-11-23': '2026-11-28', '2026-11-30': 'x' } } }))
ok(pd.prepDays['2026-11-16'] === '2026-11-16' && Object.keys(pd.prepDays).length === 1, 'Hülle: prepDays bleiben erhalten, ungültige werden verworfen')
ok(Object.keys(a.prepDays).length === 0, 'Hülle: ohne prepDays leer')

// nackter Stand
const b = parseBackup(JSON.stringify(state))
ok(b.plan['2026-11-16']?.recipeId === rid, 'nackter Stand: Plan wird gelesen')

// Müll und falsche App
ok(throws(() => parseBackup('kein json {')), 'kein JSON wird abgelehnt')
ok(throws(() => parseBackup('[1,2,3]')), 'Array wird abgelehnt')
ok(throws(() => parseBackup('null')), 'null wird abgelehnt')
ok(throws(() => parseBackup('{"foo":1}')), 'Objekt ohne Yami-Daten wird abgelehnt')
ok(throws(() => parseBackup(JSON.stringify({ app: 'andere', version: 1, state }))), 'falsche App wird abgelehnt')
ok(throws(() => parseBackup(JSON.stringify({ app: 'yami', version: 1 }))), 'Hülle ohne state wird abgelehnt')
ok(throws(() => parseBackup(JSON.stringify({ app: 'yami', version: 99, state }))), 'neuere Version wird abgelehnt')
try {
  parseBackup('kein json {')
} catch (e) {
  ok(e instanceof Error && /[äöüß]|Datei/.test(e.message), 'Fehlermeldung ist deutsch')
}

// sanitize: null-Felder und unbekannte Rezepte
const s = sanitize({ plan: null, breakfast: { '2026-11-16': { recipeId: 'gibt-es-nicht', servings: 1 } }, lastBackup: 'kaputt' })
ok(Object.keys(s.plan).length === 0, 'plan: null wird verworfen (leerer Plan)')
ok(Object.keys(s.breakfast).length === 0, 'unbekanntes Rezept wird aus dem Frühstück entfernt')
ok(s.lastBackup === undefined, 'ungültiges lastBackup-Datum wird verworfen')

const s2 = sanitize({ plan: { '2026-11-16': { recipeId: rid, servings: 2 }, '2026-11-17': { recipeId: 'gibt-es-nicht', servings: 2 } } })
ok(Object.keys(s2.plan).length === 1 && s2.plan['2026-11-16'] !== undefined, 'unbekanntes Rezept im Plan wird entfernt, bekanntes bleibt')

// Regression: kaputte Einzelwerte (Hand-Bearbeitung, beschädigte Datei) dürfen die App nicht bei jedem Start abstürzen lassen
{
  const lot = { id: 'a', name: 'Zwiebel', amount: 3, unit: 'Stk', expires: '2026-12-01' }
  const j = sanitize({
    plan: { '2026-11-10': { recipeId: rid, status: 'cooked', consumed: [null, lot] }, '2026-11-11': { recipeId: rid, servings: 3, status: 'foo' } },
    pantry: [null, lot, { ...lot, id: undefined, amount: '2' }, { name: 'Ei', amount: 2, unit: 'Stk' }, { ...lot, amount: NaN }],
    weighIns: [null, { date: 'x', weight: 90 }, { date: '2026-11-09', weight: 91, fat: 'viel' }, { date: '2026-11-02', weight: 92 }],
    rejects: [null, 5, { id: rid, date: '2026-11-01' }],
    ratings: { '2026-11-10': 'up', '2026-11-11': 'super' },
    bought: { '2026-11-09': { Zwiebel: null, Sahne: { lotId: 'x', amount: 200 } } },
    checked: { '2026-11-09': null },
    profile: { weightKg: 90, age: 'vierzig' },
    defaultServings: 0,
  })
  ok(j.pantry.length === 2 && j.pantry.every((l) => typeof l.amount === 'number' && l.amount > 0 && !!l.id), 'Vorrat: kaputte Posten verworfen, Menge als Text umgewandelt, fehlende Id ergänzt')
  ok(j.plan['2026-11-10'].servings === 2 && j.plan['2026-11-10'].consumed!.length === 1, 'Plan: fehlende Portionen = Standard, kaputte „entnommen“-Einträge verworfen')
  ok(j.plan['2026-11-11'].servings === 3 && j.plan['2026-11-11'].status === undefined, 'Plan: unbekannter Status verworfen')
  ok(j.weighIns.length === 2 && j.weighIns[0].date === '2026-11-02' && j.weighIns[1].fat === undefined, 'Messungen: kaputte verworfen, sortiert, ungültiges Körperfett entfernt')
  ok(j.rejects.length === 1 && Object.keys(j.ratings).join() === '2026-11-10', 'Wischen/Bewertungen: kaputte verworfen')
  ok(Object.keys(j.bought['2026-11-09']).join() === 'Sahne' && Array.isArray(j.checked['2026-11-09']), 'Einkäufe/Haken: kaputte verworfen')
  ok(j.profile!.weightKg === 90 && Number.isFinite(j.profile!.age) && Number.isFinite(j.profile!.lunchKcal), 'Profil: fehlende Werte bekommen Startwerte (kein NaN-Kalorienziel)')
  ok(j.defaultServings === 2, 'Standard-Portionen 0 → 2')
}

if (fails) {
  console.log(`\n${fails} Test(s) fehlgeschlagen`)
  process.exit(1)
}
console.log('\nAlle Tests OK')
