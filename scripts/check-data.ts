// Prüft die Rezeptdatenbank: eindeutige IDs, bekannte Zutaten, gültige Einheiten
import { RAW_BASICS, RAW_BREAKFASTS, RAW_RECIPES, BREAKFASTS, RECIPES } from '../src/data/recipes'
import { NUTRI } from '../src/data/nutrition'
import { gramsOf } from '../src/data/nutrition-calc'
import { BROTH_FORMS, CATALOG, EXTRA_DUPLICATES, SPICES } from '../src/data/catalog'
import { EXTRA_PRODUCT_DUPLICATES, PRODUCTS } from '../src/data/products'
import { EXTRA_NUTRI_DUPLICATES } from '../src/data/nutrition'
import { BASICS } from '../src/data/recipes'
import { yieldStock } from '../src/data/define'
import { EXTRA_GROUPS, EXTRA_SUBSTITUTE_GROUPS, EXTRA_PREFERRED } from '../src/data/extra'
import { STAND_INS, SUBSTITUTE_GROUPS } from '../src/data/substitutes'
import { canonical, convertAmount, toBase } from '../src/kitchen'
import { isSpice } from '../src/staples'
import { DEVICE_STEPS } from '../src/data/device-steps'
import { validateSetting } from '../src/deviceText'
import { deviceTextFindings } from './device-text-rules'

let errors = 0
const ids = new Set<string>()
const used = new Set<string>()
for (const r of [...RAW_RECIPES, ...RAW_BREAKFASTS, ...RAW_BASICS]) {
  if (ids.has(r.id)) { console.error('Doppelte ID:', r.id); errors++ }
  ids.add(r.id)
  if (r.steps.length < 3) { console.error('Zu wenige Schritte:', r.id); errors++ }
  for (const i of r.ingredients) {
    used.add(i.name)
    if (!CATALOG[i.name]) { console.error(`Unbekannte Zutat in ${r.id}: "${i.name}"`); errors++ }
    if (/^\d/.test(i.name)) { console.error(`Einheit nicht erkannt in ${r.id}: "${i.name}"`); errors++ }
    if (!NUTRI[i.name]) { console.error(`Keine Nährwerte für "${i.name}"`); errors++ }
    if (i.amount != null && gramsOf(i.name, i.amount, i.unit) == null) { console.error(`Gewicht unbekannt: ${i.unit} "${i.name}" (${r.id})`); errors++ }
    const name = canonical(i.name)
    // Mengen-Grundzutaten (Öl, Brühe, Mehl …) und Gewürze brauchen jetzt ebenfalls ein Produkt (Packung, Preis, Haltbarkeit);
    // nur Gewürze werden nicht umgerechnet (sie kennen nur „da“ / „alle“)
    if (CATALOG[i.name]) {
      const prod = PRODUCTS[name]
      if (!prod) { console.error(`Kein Produkt (Packung/Preis) für "${name}"`); errors++ }
      else if (!isSpice(name) && i.amount != null && toBase(name, i.amount, i.unit, prod) == null) {
        console.error(`Einheit ${i.unit} von "${name}" (${r.id}) nicht in ${prod.unit} umrechenbar`); errors++
      }
    }
  }
}
// Grundzutaten: Gewürze und Brühen-Formen vollständig
for (const n of SPICES) {
  if (CATALOG[n] !== 'vorrat') { console.error(`Gewürz "${n}" fehlt im Katalog (vorrat)`); errors++ }
  if (!PRODUCTS[canonical(n)]) { console.error(`Gewürz "${n}": kein Produkt für "${canonical(n)}"`); errors++ }
  if (!NUTRI[n]) { console.error(`Gewürz "${n}": keine Nährwerte`); errors++ }
}
for (const [base, forms] of Object.entries(BROTH_FORMS)) {
  if (!PRODUCTS[base] || PRODUCTS[base].unit !== 'ml') { console.error(`Brühe "${base}": Produkt in ml fehlt`); errors++ }
  for (const f of forms) {
    if (CATALOG[f] !== 'vorrat') { console.error(`Brühen-Form "${f}" fehlt im Katalog`); errors++ }
    if (!PRODUCTS[f] || PRODUCTS[f].unit !== 'ml') { console.error(`Brühen-Form "${f}": Produkt in ml fehlt`); errors++ }
    if (!NUTRI[f]) { console.error(`Brühen-Form "${f}": keine Nährwerte`); errors++ }
  }
}
for (const n of Object.keys(CATALOG)) if (CATALOG[n] === 'vorrat' && !PRODUCTS[canonical(n)]) { console.error(`Grundzutat "${n}": kein Produkt`); errors++ }
// Grundrezepte: Ergebnis (z. B. „Rinderfond selbstgemacht“) braucht Katalog, Produkt in derselben Einheit und Nährwerte;
// sie dürfen nicht unter den Abendessen landen
const yieldNames = new Set<string>()
const KINDS = ['grundrezept', 'dessert', 'kuchen', 'brot', 'gebaeck']
for (const r of RAW_BASICS) {
  const y = r.yields
  if (!r.basic || !y) { console.error(`Grundrezept ${r.id} ohne basic/yields`); errors++; continue }
  if (!r.kind || !KINDS.includes(r.kind)) { console.error(`${r.id}: Art (kind) fehlt/ungültig`); errors++ }
  if (yieldNames.has(y.name)) { console.error(`${r.id}: Ergebnis "${y.name}" gibt es schon bei einem anderen Rezept`); errors++ }
  yieldNames.add(y.name)
  if (!CATALOG[y.name]) { console.error(`Grundrezept ${r.id}: Ergebnis "${y.name}" fehlt im Katalog`); errors++ }
  if (!NUTRI[y.name]) { console.error(`Grundrezept ${r.id}: keine Nährwerte für "${y.name}"`); errors++ }
  const prod = PRODUCTS[y.name]
  const st = yieldStock(r.kind, y)
  if (!prod || prod.unit !== st.unit) { console.error(`Grundrezept ${r.id}: Produkt für "${y.name}" fehlt oder Einheit ≠ ${st.unit}`); errors++ }
  if (!(y.amount > 0) || !(y.shelf > 0)) { console.error(`Grundrezept ${r.id}: Menge/Haltbarkeit ungültig`); errors++ }
  if (RECIPES.some((x) => x.id === r.id)) { console.error(`Grundrezept ${r.id} steht unter den Abendessen`); errors++ }
  // Backen & Desserts: Einheit, Leichter-Tipp, Nährwerte je Stück
  if (r.kind && r.kind !== 'grundrezept') {
    if (!['Stk', 'Portion', 'g', 'ml'].includes(y.unit)) { console.error(`${r.id}: Ergebnis-Einheit "${y.unit}" (erlaubt: Stk, Portion, g, ml)`); errors++ }
    if (r.kind === 'gebaeck' && y.unit !== 'Stk') { console.error(`${r.id}: Plätzchen/Cookies zählen in Stk`); errors++ }
    if (r.kind === 'gebaeck' && !/dose|luftdicht|trocken/i.test(y.store ?? '')) { console.error(`${r.id}: Plätzchen in Blechdose/luftdicht lagern (store)`); errors++ }
    if (r.kind === 'gebaeck' && !r.festive?.length && /plätzchen|kipferl|zimtstern|makrone|spritzgebäck|spitzbuben|heidesand|nussecken/i.test(r.title)) console.warn(`${r.id}: Weihnachtsplätzchen ohne festive: ['plaetzchen']`)
    if (y.unit === 'g' && r.kind !== 'brot') { console.error(`${r.id}: Ergebnis in g nur bei Brot (Laib → Scheiben), sonst Stk/Portion`); errors++ }
    if (!r.lighter || r.lighter.trim().length < 15) { console.error(`${r.id}: „lighter“-Tipp fehlt`); errors++ }
    if (y.shelf > 14 && !/kühl|tief|einfrier|dose|luftdicht|trocken/i.test(y.store ?? '')) console.warn(`${r.id}: ${y.shelf} Tage haltbar – Lagerung (store) angeben?`)
    const built = BASICS.find((b) => b.id === r.id)
    const pp = built?.yields?.perPiece
    if (!pp || !(pp.kcal > 0) || pp.kcal > 1500) { console.error(`${r.id}: Nährwerte je Stück unplausibel (${pp?.kcal} kcal)`); errors++ }
    if (built && built.nutrition.kcal <= 0) { console.error(`${r.id}: keine Nährwerte berechenbar`); errors++ }
  }
}
// src/data/extra: nichts doppelt anlegen, Geräte-Schritte und Bildsuche für jedes Rezept
for (const n of EXTRA_DUPLICATES) { console.error(`extra: Zutat "${n}" gibt es schon im Katalog – nicht neu anlegen`); errors++ }
for (const n of EXTRA_PRODUCT_DUPLICATES) { console.error(`extra: Produkt "${n}" gibt es schon – nicht neu anlegen`); errors++ }
for (const n of EXTRA_NUTRI_DUPLICATES) { console.error(`extra: Nährwerte für "${n}" gibt es schon – nicht neu anlegen`); errors++ }
const extraIds = new Set<string>()
for (const [file, g] of Object.entries(EXTRA_GROUPS)) {
  const own = new Set(g.recipes.map((r) => r.id))
  for (const r of g.recipes) {
    extraIds.add(r.id)
    if (!r.basic || !r.kind) { console.error(`extra/${file}: ${r.id} nicht mit backen() angelegt`); errors++ }
    // Kuchen und Brot brauchen Geräte-Schritte (Ofen); Desserts/Grundrezepte ohne Hitze dürfen ohne auskommen
    if (!g.deviceSteps[r.id]?.length) {
      if (r.kind === 'kuchen' || r.kind === 'brot' || r.kind === 'gebaeck') { console.error(`extra/${file}: ${r.id} ohne Geräte-Schritte (deviceSteps)`); errors++ }
      else console.warn(`extra/${file}: ${r.id} ohne Geräte-Schritte`)
    }
    if (!g.imageQueries[r.id]) { console.error(`extra/${file}: ${r.id} ohne Bild-Suchbegriff (imageQueries)`); errors++ }
  }
  for (const id of [...Object.keys(g.deviceSteps), ...Object.keys(g.imageQueries)])
    if (!own.has(id)) { console.error(`extra/${file}: deviceSteps/imageQueries für fremde oder unbekannte ID "${id}"`); errors++ }
  for (const names of Object.values(g.catalog)) for (const n of names ?? []) {
    if (!g.products[n] && !PRODUCTS[n]) { console.error(`extra/${file}: "${n}" ohne Produkt`); errors++ }
    if (!g.nutrition[n]) { console.error(`extra/${file}: "${n}" ohne Nährwerte`); errors++ }
  }
}
// Austausch-Gruppen: alle Mitglieder mit Katalog + Produkt und derselben Vorratseinheit
for (const [g, names] of Object.entries(SUBSTITUTE_GROUPS)) {
  const units = new Set(names.map((n) => PRODUCTS[n]?.unit))
  for (const n of names) if (!CATALOG[n] || !PRODUCTS[n]) { console.error(`Austausch-Gruppe ${g}: "${n}" ohne Katalog/Produkt`); errors++ }
  if (units.size > 1) { console.error(`Austausch-Gruppe ${g}: verschiedene Einheiten (${[...units].join(', ')})`); errors++ }
}
// Notlösungen für ein Gericht („Schmand statt Sahne“): beide Zutaten bekannt, Menge umrechenbar
for (const [n, subs] of Object.entries(STAND_INS))
  for (const sub of [n, ...subs]) {
    if (!CATALOG[sub] || !PRODUCTS[sub]) { console.error(`Ersatz ${n}: "${sub}" ohne Katalog/Produkt`); errors++ }
    else if (sub !== n && convertAmount(n, 100, sub) == null) { console.error(`Ersatz ${n} → ${sub}: Menge nicht umrechenbar`); errors++ }
  }
for (const g of Object.keys(EXTRA_SUBSTITUTE_GROUPS)) if (!SUBSTITUTE_GROUPS[g]) { console.error(`extra: Austausch-Gruppe ${g} hat nur ein Mitglied`); errors++ }
for (const [n, prefs] of Object.entries(EXTRA_PREFERRED))
  for (const p of prefs) if (!SUBSTITUTE_GROUPS[Object.keys(SUBSTITUTE_GROUPS).find((g) => SUBSTITUTE_GROUPS[g].includes(n) && SUBSTITUTE_GROUPS[g].includes(p)) ?? '']) {
    console.error(`extra: Vorrang ${n} ← ${p}: beide müssen in derselben Austausch-Gruppe stehen`); errors++
  }
const formNames = new Set([...Object.values(BROTH_FORMS).flat(), ...yieldNames])
for (const n of Object.keys(CATALOG)) if (!used.has(n) && !formNames.has(n)) console.warn('Unbenutzt im Katalog:', n)
const by = (k: string) => RAW_RECIPES.filter((r) => r.cuisine === k).length
const byType: Record<string, number> = {}
for (const r of RAW_RECIPES) byType[r.type] = (byType[r.type] ?? 0) + 1
console.log(`${RAW_RECIPES.length} Rezepte – DE ${by('de')}, IT ${by('it')}, AS ${by('as')}, GR ${by('gr')}`, byType)
// Frühstücksziele: satt & leicht
for (const r of BREAKFASTS) {
  const n = r.nutrition
  if (n.kcal < 330 || n.kcal > 480 || n.protein < 25 || n.fiber < 8) {
    console.error(`Frühstück ${r.id} verfehlt Ziel: ${n.kcal} kcal, ${n.protein} g Eiweiß, ${n.fiber} g Ballaststoffe`); errors++
  }
}
const byKind = (k: string) => RAW_BASICS.filter((r) => (r.kind ?? 'grundrezept') === k).length
console.log(`${BREAKFASTS.length} Frühstücke, ${byKind('grundrezept')} Grundrezepte · Backen: ${byKind('dessert')} Desserts, ${byKind('kuchen')} Kuchen, ${byKind('brot')} Brot, ${byKind('gebaeck')} Plätzchen & Cookies (${extraIds.size} aus src/data/extra)`)
// Geräte-Schritte: bekannte Rezepte, Texte, Einstellungen im gültigen Bereich
for (const [id, steps] of Object.entries(DEVICE_STEPS)) {
  if (!ids.has(id)) { console.error(`Geräte-Schritte für unbekanntes Rezept: ${id}`); errors++; continue }
  if (!steps.length) { console.error(`Geräte-Schritte leer: ${id}`); errors++ }
  steps.forEach((st, i) => {
    if (!st.text || !st.text.trim()) { console.error(`Geräte-Schritt ${i + 1} ohne Text: ${id}`); errors++ }
    for (const se of st.settings ?? []) for (const e of validateSetting(se)) { console.error(`Gerät in ${id}, Schritt ${i + 1}: ${e}`); errors++ }
  })
}
// Text und Einstellung müssen zusammenpassen (Temperatur, Betriebsart, Gerät, Minuten) – Details: scripts/check-device-text.ts
for (const x of deviceTextFindings(DEVICE_STEPS)) { console.error(`Geräte-Text in ${x.id}, Schritt ${x.step}: ${x.msg}`); errors++ }
// Ausweichweg (alt: true, z. B. „oder Combair“) nur direkt nach einer Haupteinstellung im selben Schritt
for (const [id, steps] of Object.entries(DEVICE_STEPS)) steps.forEach((st, i) => {
  const s = st.settings ?? []
  s.forEach((x, j) => { if (x.alt && (j === 0 || s.slice(0, j).every((y) => y.alt))) { console.error(`Geräte in ${id}, Schritt ${i + 1}: „oder …“ ohne Haupteinstellung davor`); errors++ } })
})
const withDev = [...ids].filter((id) => DEVICE_STEPS[id]?.length).length
const cov = Math.round((withDev / ids.size) * 100)
console.log(`Geräte-Schritte: ${withDev} von ${ids.size} Rezepten (${cov} %)`)
if (cov < 100) console.warn(`Warnung: Geräte-Abdeckung ${cov} % – noch ${ids.size - withDev} Rezepte ohne Geräte-Schritte`)
if (errors) { console.error(`${errors} Fehler`); process.exit(1) }
console.log('OK')
