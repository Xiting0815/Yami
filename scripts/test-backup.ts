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

if (fails) {
  console.log(`\n${fails} Test(s) fehlgeschlagen`)
  process.exit(1)
}
console.log('\nAlle Tests OK')
