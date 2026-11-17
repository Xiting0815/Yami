// Tests: Geräte-Schritte (Zusammenführen, klassische Schritte, Chip-Text, Prüfung)
//   npx vite-node scripts/test-devices.ts
import { RECIPE_BY_ID, RAW_RECIPES, registerCustom } from '../src/data/recipes'
import { DEVICE_STEPS } from '../src/data/device-steps'
import { settingText, validateSetting } from '../src/deviceText'
import { ingredientsForStep, unmatched } from '../src/cookSteps'
import { sanitize } from '../src/store'
import type { DeviceSetting } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

// ───── Zusammenführen ─────
for (const id of ['schweinebraten', 'kartoffelsuppe']) {
  const rec = RECIPE_BY_ID[id]
  const raw = RAW_RECIPES.find((r) => r.id === id)!
  ok(!!rec.deviceSteps && rec.deviceSteps.length > 0, `${id}: deviceSteps vorhanden`)
  ok(JSON.stringify(rec.steps) === JSON.stringify(rec.deviceSteps!.map((d) => d.text)), `${id}: steps = Texte der Geräte-Schritte`)
  ok(JSON.stringify(rec.classicSteps) === JSON.stringify(raw.steps), `${id}: classicSteps = ursprüngliche Schritte`)
  ok(rec.steps.every((_, i) => Array.isArray(ingredientsForStep(rec, i))), `${id}: Zutaten je Schritt berechenbar`)
  const assigned = new Set(rec.steps.flatMap((_, i) => ingredientsForStep(rec, i)))
  ok(assigned.size + unmatched(rec).length <= rec.ingredients.length, `${id}: Zutaten werden nicht doppelt zugeordnet`)
}
const plain = RAW_RECIPES.find((r) => !DEVICE_STEPS[r.id])
if (plain) {
  const rec = RECIPE_BY_ID[plain.id]
  ok(rec.deviceSteps === undefined && rec.classicSteps === undefined && rec.steps === plain.steps, `${plain.id}: ohne Geräte-Schritte unverändert`)
}
ok(RECIPE_BY_ID['schweinebraten'].steps.length >= 5, 'Schweinebraten hat mehrere Schritte')

// eigene Rezepte bleiben unberührt
sanitize({
  customRecipes: [{ id: 'my-test', title: 'Test', meal: 'dinner', cuisine: 'de', type: 'haupt', time: 20, servings: 2, ingredients: [{ amount: 1, unit: 'Stk', name: 'Zwiebel' }], steps: ['a', 'b', 'c'] }],
})
const my = RECIPE_BY_ID['my-test']
ok(!!my && my.deviceSteps === undefined && my.classicSteps === undefined, 'Eigenes Rezept ohne Geräte-Schritte')
registerCustom([], [])

// ───── Chip-Text ─────
const t = (s: DeviceSetting) => settingText(s)
ok(t({ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25 }) === 'CombiSteamer · Dämpfen 100 °C · 25 Min.', 'Chip: CombiSteamer')
ok(t({ device: 'combair', mode: 'Heissluft', temp: 180, core: 72 }) === 'Combair · Heissluft 180 °C · Kern 72 °C', 'Chip: Combair mit Kern')
ok(t({ device: 'bora', mode: 'Kochzone', level: '9' }) === 'BORA · Stufe 9', 'Chip: BORA Stufe')
ok(t({ device: 'bora', mode: 'Kochzone', level: 'Power' }) === 'BORA · Powerstufe', 'Chip: BORA Power')
ok(t({ device: 'bora', mode: 'Kochzone', level: 'Simmern', minutes: 20 }) === 'BORA · Simmern · 20 Min.', 'Chip: BORA Simmern mit Zeit')
ok(t({ device: 'airfryer', mode: 'Heissluft', temp: 200, minutes: 12 }) === 'Airfryer · 200 °C · 12 Min.', 'Chip: Airfryer')
ok(t({ device: 'steamer', mode: 'Heissluft feucht', temp: 160, humidity: 50 }) === 'CombiSteamer · Heissluft feucht 160 °C · Feuchte 50 %', 'Chip: Feuchte')

// ───── Prüfung ─────
const bad = (s: DeviceSetting) => validateSetting(s).length > 0
const good = (s: DeviceSetting) => validateSetting(s).length === 0
ok(good({ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 25 }), 'gültig: Dämpfen 100 °C')
ok(bad({ device: 'steamer', mode: 'Dämpfen', temp: 120 }), 'Fehler: Dämpfen über 100 °C')
ok(bad({ device: 'steamer', mode: 'Heissluft', temp: 250 }), 'Fehler: CombiSteamer über 230 °C')
ok(good({ device: 'combair', mode: 'PizzaPlus', temp: 280 }), 'gültig: Combair 280 °C')
ok(bad({ device: 'combair', mode: 'Heissluft', temp: 300 }), 'Fehler: Combair über 280 °C')
ok(bad({ device: 'combair', mode: 'Heissluft', temp: 180, core: 99 }), 'Fehler: Kerntemperatur über 95 °C')
ok(bad({ device: 'combair', mode: 'Heissluft', temp: 180, core: 30 }), 'Fehler: Kerntemperatur unter 40 °C')
ok(bad({ device: 'bora', mode: 'Kochzone', level: '10' }), 'Fehler: BORA-Stufe 10')
ok(bad({ device: 'bora', mode: 'Kochzone' }), 'Fehler: BORA ohne Stufe')
ok(good({ device: 'bora', mode: 'Kochzone', level: 'Warmhalten' }), 'gültig: BORA Warmhalten')
ok(bad({ device: 'airfryer', mode: 'Heissluft', temp: 220 }), 'Fehler: Airfryer über 200 °C')
ok(bad({ device: 'airfryer', mode: 'Heissluft' }), 'Fehler: Airfryer ohne Temperatur')
ok(bad({ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 0 }), 'Fehler: 0 Minuten')
ok(bad({ device: 'steamer', mode: 'Dämpfen', temp: 100, minutes: 601 }), 'Fehler: über 600 Minuten')
ok(bad({ device: 'steamer', mode: '', temp: 100 }), 'Fehler: Betriebsart leer')

// Beispiele selbst gültig
for (const [id, steps] of Object.entries(DEVICE_STEPS)) {
  ok(steps.every((st) => st.text.trim() && (st.settings ?? []).every(good)), `${id}: alle Schritte gültig`)
}

// Merkflag wird bereinigt
ok(sanitize({ showClassicSteps: true }).showClassicSteps === true, 'showClassicSteps bleibt erhalten')
ok(!('showClassicSteps' in sanitize({ showClassicSteps: 'ja' })), 'showClassicSteps mit falschem Typ verworfen')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
