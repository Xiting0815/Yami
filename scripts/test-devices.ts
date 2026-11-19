// Tests: Geräte-Schritte (Zusammenführen, klassische Schritte, Chip-Text, Prüfung)
//   npx vite-node scripts/test-devices.ts
import { RECIPE_BY_ID, RAW_RECIPES, registerCustom } from '../src/data/recipes'
import { DEVICE_STEPS } from '../src/data/device-steps'
import { settingText, validateSetting } from '../src/deviceText'
import { checkStep } from './device-text-rules'
import { mitFamag } from '../src/data/device-helpers'
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

// ───── Famag (Spiralkneter) und Witt Rotante (Pizzaofen) ─────
ok(t({ device: 'kneter', mode: 'Kneten', minutes: 8 }) === 'Famag · Kneten 8 Min.', 'Chip: Famag Kneten')
ok(t({ device: 'kneter', mode: 'Kneten', level: '3', minutes: 6 }) === 'Famag · Stufe 3 · 6 Min.', 'Chip: Famag mit Stufe')
ok(t({ device: 'pizzaofen', mode: 'Pizzastein', temp: 430, seconds: 90 }) === 'Witt Rotante · Stein 430 °C · 90 Sek.', 'Chip: Witt Rotante Sekunden')
ok(t({ device: 'combair', mode: 'PizzaPlus', temp: 280, minutes: 8, alt: true }) === 'oder Combair · PizzaPlus 280 °C · 8 Min.', 'Chip: Ausweichweg mit „oder“')
ok(good({ device: 'kneter', mode: 'Mischen', minutes: 2 }), 'gültig: Famag Mischen 2 Min.')
ok(bad({ device: 'kneter', mode: 'Kneten', minutes: 31 }), 'Fehler: Famag über 30 Min.')
ok(bad({ device: 'kneter', mode: 'Kneten', minutes: 5, level: '11' }), 'Fehler: Famag-Stufe 11')
ok(bad({ device: 'kneter', mode: 'Kneten', temp: 30 }), 'Fehler: Famag mit Temperatur')
ok(bad({ device: 'kneter', mode: 'Rühren', minutes: 5 }), 'Fehler: Famag-Betriebsart unbekannt')
ok(good({ device: 'pizzaofen', mode: 'Vorheizen', temp: 450, minutes: 25 }), 'gültig: Witt vorheizen')
ok(bad({ device: 'pizzaofen', mode: 'Pizzastein', temp: 520, seconds: 90 }), 'Fehler: Witt über 500 °C')
ok(bad({ device: 'pizzaofen', mode: 'Pizzastein', temp: 430, seconds: 10 }), 'Fehler: Witt unter 30 Sek.')
ok(bad({ device: 'combair', mode: 'PizzaPlus', temp: 280, seconds: 90 }), 'Fehler: Sekunden nur beim Pizzaofen')
ok(mitFamag('Mit Mehl 8 Minuten zu einem glatten Teig kneten.', 10) === 'Mit Mehl im Famag 10 Minuten zu einem glatten Teig kneten.', 'mitFamag schreibt Knet-Satz um')
// alle Pizzen mit Witt Rotante haben direkt den Combair-Ausweichweg
for (const [id, steps] of Object.entries(DEVICE_STEPS)) for (const st of steps) {
  const s = st.settings ?? []
  s.forEach((x, j) => { if (x.device === 'pizzaofen') ok(s[j + 1]?.alt === true && s[j + 1]?.device === 'combair', `${id}: Witt mit „oder Combair“ darunter`) })
}

// ───── Text ↔ Einstellung (scripts/check-device-text.ts) ─────
const bp = checkStep('x', 0, { text: 'Den Ofen auf 180 °C Ober-/Unterhitze vorheizen.', settings: [{ device: 'combair', mode: 'Heißluft', temp: 160, note: 'vorheizen' }] })
ok(bp.length === 3, `Butterplätzchen-Fehler erkannt (Temperatur, Betriebsart, „Ofen“): ${bp.length}`)
ok(checkStep('x', 0, { text: 'Den Combair auf 160 °C Heißluft vorheizen (2 Bleche: Ebene 1 + 3).', settings: [{ device: 'combair', mode: 'Heißluft', temp: 160, note: 'vorheizen' }] }).length === 0, 'passender Text ohne Befund')
ok(checkStep('x', 0, { text: 'Je Seite 3 Minuten braten.', settings: [{ device: 'bora', mode: 'Kochzone', level: '6', minutes: 6 }] }).length === 0, 'je Seite: doppelte Minuten sind ok')
ok(checkStep('x', 0, { text: 'Die Plätzchen in zwei Runden je 10 Minuten backen.', settings: [{ device: 'combair', mode: 'Heißluft', temp: 160, minutes: 10, note: 'zwei Bleche, Ebene 1+3' }] }).length === 1, 'Runden vs. zwei Bleche erkannt')
ok(checkStep('x', 0, { text: 'Den Teig im Famag 10 Minuten kneten.', settings: [{ device: 'kneter', mode: 'Kneten', minutes: 6 }] }).length === 1, 'Famag-Minuten im Text ≠ Einstellung erkannt')

// Beispiele selbst gültig
for (const [id, steps] of Object.entries(DEVICE_STEPS)) {
  ok(steps.every((st) => st.text.trim() && (st.settings ?? []).every(good)), `${id}: alle Schritte gültig`)
}

// Merkflag wird bereinigt
ok(sanitize({ showClassicSteps: true }).showClassicSteps === true, 'showClassicSteps bleibt erhalten')
ok(!('showClassicSteps' in sanitize({ showClassicSteps: 'ja' })), 'showClassicSteps mit falschem Typ verworfen')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
