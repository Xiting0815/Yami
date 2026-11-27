// Prüft die Rezeptdatenbank: eindeutige IDs, bekannte Zutaten, gültige Einheiten
import { RAW_BASICS, RAW_BREAKFASTS, RAW_RECIPES, BREAKFASTS, RECIPES } from '../src/data/recipes'
import { GRAMS, NUTRI } from '../src/data/nutrition'
import { gramsOf } from '../src/data/nutrition-calc'
import { BROTH_FORMS, CATALOG, EXTRA_DUPLICATES, SPICES } from '../src/data/catalog'
import { EXTRA_PRODUCT_DUPLICATES, PRODUCTS } from '../src/data/products'
import { EXTRA_NUTRI_DUPLICATES } from '../src/data/nutrition'
import { BASICS } from '../src/data/recipes'
import { yieldStock } from '../src/data/define'
import { EXTRA_GROUPS, EXTRA_INGREDIENT_GROUPS, EXTRA_SUBSTITUTE_GROUPS, EXTRA_PREFERRED } from '../src/data/extra'
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
  for (const [n, f] of Object.entries(r.eaten ?? {})) {
    if (!r.ingredients.some((i) => i.name === n) || !(f >= 0 && f <= 1)) { console.error(`${r.id}: eaten „${n}“ = ${f} – Zutat fehlt oder Anteil nicht 0–1`); errors++ }
  }
  for (const i of r.ingredients) {
    used.add(i.name)
    if (!CATALOG[i.name]) { console.error(`Unbekannte Zutat in ${r.id}: "${i.name}"`); errors++ }
    if (/^\d/.test(i.name)) { console.error(`Einheit nicht erkannt in ${r.id}: "${i.name}"`); errors++ }
    if (!NUTRI[i.name]) { console.error(`Keine Nährwerte für "${i.name}"`); errors++ }
    if (i.amount != null && gramsOf(i.name, i.amount, i.unit) == null) { console.error(`Gewicht unbekannt: ${i.unit} "${i.name}" (${r.id})`); errors++ }
    // Packungs-Einheiten sind je Zutat sehr verschieden (1 Pck Backpulver 15 g, Vanillezucker 8 g) – kein Standardgewicht
    if (i.amount != null && ['Pck', 'Dose', 'Glas', 'Becher'].includes(i.unit) && GRAMS[i.name]?.[i.unit] == null) { console.error(`Gewicht je ${i.unit} fehlt für "${i.name}" (${r.id}) – in GRAMS eintragen`); errors++ }
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
// Tiefkühlware (lose gefroren): der Rest einer angebrochenen Packung kommt zurück ins Gefrierfach – „angebrochen 1 Tag“ wäre ein
// falscher Verderb-Alarm. Ausnahme: eingefrorene Portionen (selbstgemachter Fond), die als Ganzes auftauen
for (const n of Object.keys(CATALOG)) {
  const pr = PRODUCTS[n]
  if (CATALOG[n] === 'tk' && pr?.opened != null && pr.opened < 30 && pr.packName !== 'Portion') { console.error(`TK-Produkt "${n}": angebrochen ${pr.opened} Tage – Rest bleibt gefroren (opened weglassen oder wie shelf)`); errors++ }
}
// Grundrezepte: Ergebnis (z. B. „Rinderfond selbstgemacht“) braucht Katalog, Produkt in derselben Einheit und Nährwerte;
// sie dürfen nicht unter den Abendessen landen
const yieldNames = new Set<string>()
const KINDS = ['grundrezept', 'dessert', 'kuchen', 'brot', 'gebaeck', 'bbq', 'tapas', 'salat']
const TAPAS_GROUPS = ['fisch', 'fleisch', 'gemuese', 'ei', 'brot']
const SALAT_GROUPS = ['nudel', 'kartoffel', 'reis', 'bohnen', 'gemuese']
const BBQ_GROUPS = ['smoker', 'grill', 'dutch', 'burger', 'beilage']
for (const r of RAW_BASICS) {
  const y = r.yields
  if (!r.kind || !KINDS.includes(r.kind)) { console.error(`${r.id}: Art (kind) fehlt/ungültig`); errors++ }
  if (RECIPES.some((x) => x.id === r.id)) { console.error(`Grundrezept ${r.id} steht unter den Abendessen`); errors++ }
  // BBQ: Untergruppe, Portionen der Ladung; Reste (optional) vakuumiert eingefroren in g oder Portion
  if (r.kind === 'bbq') {
    if (!r.basic || !r.bbq || !BBQ_GROUPS.includes(r.bbq)) { console.error(`${r.id}: BBQ-Rezept ohne gültige Gruppe (bbq() aus define.ts)`); errors++ }
    if (!(r.portions && r.portions >= 1 && r.portions <= 40)) { console.error(`${r.id}: BBQ-Portionen der Ladung fehlen/unplausibel`); errors++ }
    const built = BASICS.find((b) => b.id === r.id)
    if (!built || !(built.nutrition.kcal > 50) || built.nutrition.kcal > 2000) { console.error(`${r.id}: BBQ-Nährwerte je Portion unplausibel (${built?.nutrition.kcal} kcal)`); errors++ }
    if (y) {
      if (!['g', 'Portion'].includes(y.unit)) { console.error(`${r.id}: BBQ-Rest in g oder Portion`); errors++ }
      if (y.unit === 'g' && !y.portion) { console.error(`${r.id}: BBQ-Rest in g braucht die Beutelgröße (portion, z. B. 250)`); errors++ }
      if (!(y.share != null && y.share > 0 && y.share < 1)) { console.error(`${r.id}: BBQ-Rest ohne Esser am Grilltag (portions > eat)`); errors++ }
      if (!/vakuum/i.test(y.name)) console.warn(`${r.id}: BBQ-Rest „${y.name}“ – Name mit „(vakuumiert)“?`)
    }
    if (!y) continue
  } else if (r.kind === 'tapas') {
    // Tapas: Teller für 2 (portions 2), Untergruppe, kalt/lauwarm/heiß; kein Ergebnis im Vorrat; Nährwerte je Person
    if (!r.basic || !r.tapas || !TAPAS_GROUPS.includes(r.tapas)) { console.error(`${r.id}: Tapa ohne gültige Gruppe (tapa() aus define.ts)`); errors++ }
    if (!r.serve || !['kalt', 'lauwarm', 'heiss'].includes(r.serve)) { console.error(`${r.id}: Tapa ohne serve (kalt/lauwarm/heiss)`); errors++ }
    if (r.portions !== 2) { console.error(`${r.id}: Tapa = ein Teller für 2 (portions 2)`); errors++ }
    if (y) { console.error(`${r.id}: Tapas legen kein Ergebnis in den Vorrat`); errors++ }
    if (r.cuisine !== 'es') console.warn(`${r.id}: Tapa mit Küche „${r.cuisine}“?`)
    if (!/\(.+\)/.test(r.title)) console.warn(`${r.id}: Titel ohne deutsche Erklärung in Klammern („Gambas al ajillo (Knoblauchgarnelen …)“)`)
    const built = BASICS.find((b) => b.id === r.id)
    const kcal = built?.nutrition.kcal ?? 0
    if (!(kcal >= 50 && kcal <= 400)) { console.error(`${r.id}: Tapa mit ${kcal} kcal je Person – Ziel ca. 120–200 (ein Teller für 2 als eine von ca. 5 Tapas)`); errors++ }
    else if (kcal > 260) console.warn(`${r.id}: Tapa mit ${kcal} kcal je Person – eher 120–200 (kleinerer Teller?)`)
    continue
  } else if (!r.basic || !y) { console.error(`Grundrezept ${r.id} ohne basic/yields`); errors++; continue }
  if (r.kind === 'salat') {
    if (!r.salat || !SALAT_GROUPS.includes(r.salat)) { console.error(`${r.id}: Salat ohne gültige Gruppe (salat() aus define.ts)`); errors++ }
    if (y.unit !== 'Portion' || y.amount !== r.portions) { console.error(`${r.id}: Salat-Ergebnis in Portionen (= portions)`); errors++ }
    if (y.shelf > 5) { console.error(`${r.id}: Salat hält im Kühlschrank höchstens 5 Tage (shelf ${y.shelf})`); errors++ }
  }
  if (r.tapas && r.tapas !== 'sauce' && r.kind !== 'tapas') { console.error(`${r.id}: Tapas-Gruppe „${r.tapas}“ nur mit tapa()`); errors++ }
  if (r.tapas === 'sauce' && r.kind !== 'grundrezept') { console.error(`${r.id}: Tapas-Saucen sind Grundrezepte`); errors++ }
  if (r.bbq && r.bbq !== 'rub' && r.kind !== 'bbq') { console.error(`${r.id}: bbq-Gruppe „${r.bbq}“ nur mit bbq()`); errors++ }
  if (r.bbq === 'rub' && r.kind !== 'grundrezept') { console.error(`${r.id}: Rubs & Saucen sind Grundrezepte`); errors++ }
  if (!y) continue
  if (yieldNames.has(y.name)) { console.error(`${r.id}: Ergebnis "${y.name}" gibt es schon bei einem anderen Rezept`); errors++ }
  yieldNames.add(y.name)
  if (!CATALOG[y.name]) { console.error(`Grundrezept ${r.id}: Ergebnis "${y.name}" fehlt im Katalog`); errors++ }
  if (!NUTRI[y.name]) { console.error(`Grundrezept ${r.id}: keine Nährwerte für "${y.name}"`); errors++ }
  const prod = PRODUCTS[y.name]
  const st = yieldStock(r.kind, y)
  if (!prod || prod.unit !== st.unit) { console.error(`Grundrezept ${r.id}: Produkt für "${y.name}" fehlt oder Einheit ≠ ${st.unit}`); errors++ }
  if (!(y.amount > 0) || !(y.shelf > 0)) { console.error(`Grundrezept ${r.id}: Menge/Haltbarkeit ungültig`); errors++ }
  // Backen & Desserts: Einheit, Nährwerte je Stück (BBQ-Reste: grammweise, siehe oben)
  if (r.kind && r.kind !== 'grundrezept' && r.kind !== 'bbq') {
    if (!['Stk', 'Portion', 'g', 'ml'].includes(y.unit)) { console.error(`${r.id}: Ergebnis-Einheit "${y.unit}" (erlaubt: Stk, Portion, g, ml)`); errors++ }
    if (r.kind === 'gebaeck' && y.unit !== 'Stk') { console.error(`${r.id}: Plätzchen/Cookies zählen in Stk`); errors++ }
    if (r.kind === 'gebaeck' && !/dose|luftdicht|trocken/i.test(y.store ?? '')) { console.error(`${r.id}: Plätzchen in Blechdose/luftdicht lagern (store)`); errors++ }
    if (r.kind === 'gebaeck' && !r.festive?.length && /plätzchen|kipferl|zimtstern|makrone|spritzgebäck|spitzbuben|heidesand|nussecken/i.test(r.title)) console.warn(`${r.id}: Weihnachtsplätzchen ohne festive: ['plaetzchen']`)
    if (y.unit === 'g' && r.kind !== 'brot') { console.error(`${r.id}: Ergebnis in g nur bei Brot (Laib → Scheiben), sonst Stk/Portion`); errors++ }
    if (y.shelf > 14 && !/kühl|tief|einfrier|dose|luftdicht|trocken/i.test(y.store ?? '')) console.warn(`${r.id}: ${y.shelf} Tage haltbar – Lagerung (store) angeben?`)
    const built = BASICS.find((b) => b.id === r.id)
    const pp = built?.yields?.perPiece
    if (!pp || !(pp.kcal > 0) || pp.kcal > 1500) { console.error(`${r.id}: Nährwerte je Stück unplausibel (${pp?.kcal} kcal)`); errors++ }
    if (built && built.nutrition.kcal <= 0) { console.error(`${r.id}: keine Nährwerte berechenbar`); errors++ }
  }
  if (y.cat && CATALOG[y.name] !== y.cat) { console.error(`${r.id}: Ergebnis „${y.name}“ steht nicht unter ${y.cat}`); errors++ }
}
// src/data/extra: nichts doppelt anlegen, Geräte-Schritte und Bildsuche für jedes Rezept
for (const n of EXTRA_DUPLICATES) {
  // parallel schreibende Gruppen: zeigen, in welchen Dateien die Zutat steht (die zuerst eingetragene gilt)
  const files = Object.entries({ ...EXTRA_GROUPS, ...EXTRA_INGREDIENT_GROUPS }).filter(([, g]) => Object.values(g.catalog).some((l) => l?.includes(n))).map(([f]) => f)
  console.error(`extra: Zutat "${n}" gibt es schon im Katalog – nicht neu anlegen${files.length ? ` (angelegt in: ${files.join(', ')})` : ''}`); errors++
}
for (const n of EXTRA_PRODUCT_DUPLICATES) { console.error(`extra: Produkt "${n}" gibt es schon – nicht neu anlegen`); errors++ }
for (const n of EXTRA_NUTRI_DUPLICATES) { console.error(`extra: Nährwerte für "${n}" gibt es schon – nicht neu anlegen`); errors++ }
const extraIds = new Set<string>()
for (const [file, g] of Object.entries(EXTRA_GROUPS)) {
  const own = new Set(g.recipes.map((r) => r.id))
  for (const r of g.recipes) {
    extraIds.add(r.id)
    if (!r.basic || !r.kind) { console.error(`extra/${file}: ${r.id} nicht mit backen()/bbq() angelegt`); errors++ }
    // BBQ-Dateien (bbq/…) enthalten nur BBQ-Rezepte bzw. Rubs & Saucen
    if (file.startsWith('bbq/') && r.kind !== 'bbq' && r.bbq !== 'rub') { console.error(`extra/${file}: ${r.id} ist kein BBQ-Rezept (bbq() bzw. backen('grundrezept', …, { bbq: 'rub' }))`); errors++ }
    if (!file.startsWith('bbq/') && (r.kind === 'bbq' || r.bbq)) { console.error(`extra/${file}: BBQ-Rezept ${r.id} gehört nach src/data/extra/bbq/`); errors++ }
    // Tapas-Dateien (tapas/…) nur Tapas bzw. Tapas-Saucen, Salat-Dateien (salate/…) nur Salate – und umgekehrt
    if (file.startsWith('tapas/') && r.kind !== 'tapas' && r.tapas !== 'sauce') { console.error(`extra/${file}: ${r.id} ist keine Tapa (tapa() bzw. backen('grundrezept', …, { tapas: 'sauce' }))`); errors++ }
    if (!file.startsWith('tapas/') && (r.kind === 'tapas' || r.tapas)) { console.error(`extra/${file}: Tapa ${r.id} gehört nach src/data/extra/tapas/`); errors++ }
    if (file.startsWith('salate/') !== (r.kind === 'salat')) { console.error(`extra/${file}: ${r.id} – Salate (salat()) gehören genau nach src/data/extra/salate/`); errors++ }
    if (file === 'desserts-es' && r.cuisine !== 'es') { console.error(`extra/${file}: ${r.id} braucht cuisine: 'es'`); errors++ }
    // Kuchen und Brot brauchen Geräte-Schritte (Ofen); Desserts/Grundrezepte ohne Hitze dürfen ohne auskommen
    if (!g.deviceSteps[r.id]?.length) {
      if (r.kind === 'kuchen' || r.kind === 'brot' || r.kind === 'gebaeck' || (r.kind === 'bbq' && r.bbq !== 'beilage') || (r.kind === 'tapas' && r.serve !== 'kalt')) { console.error(`extra/${file}: ${r.id} ohne Geräte-Schritte (deviceSteps)`); errors++ }
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
for (const [file, g] of Object.entries(EXTRA_INGREDIENT_GROUPS))
  for (const names of Object.values(g.catalog)) for (const n of names ?? []) {
    if (!g.products[n] && !PRODUCTS[n]) { console.error(`${file}: "${n}" ohne Produkt`); errors++ }
    if (!g.nutrition[n]) { console.error(`${file}: "${n}" ohne Nährwerte`); errors++ }
  }
// neue Gewürze: im Katalog unter Vorrat
for (const g of [...Object.values(EXTRA_GROUPS), ...Object.values(EXTRA_INGREDIENT_GROUPS)])
  for (const n of g.spices ?? []) if (CATALOG[n] !== 'vorrat' || !(g.catalog.vorrat ?? []).includes(n)) { console.error(`extra: Gewürz "${n}" muss in catalog.vorrat derselben Datei stehen`); errors++ }
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
console.log(`${RAW_RECIPES.length} Rezepte – DE ${by('de')}, IT ${by('it')}, AS ${by('as')}, GR ${by('gr')}, US ${by('us')}, ES ${by('es')}`, byType)
for (const r of RAW_RECIPES.filter((x) => x.cuisine === 'es')) if (!/\(.+\)/.test(r.title)) console.warn(`${r.id}: spanischer Titel ohne deutsche Erklärung in Klammern`)
// Frühstücke: sollen bis mittags satt machen (Eiweiß und Ballaststoffe)
for (const r of BREAKFASTS) {
  const n = r.nutrition
  if (n.protein < 25 || n.fiber < 8) {
    console.error(`Frühstück ${r.id} macht kaum satt: ${n.protein} g Eiweiß, ${n.fiber} g Ballaststoffe`); errors++
  }
}
const byKind = (k: string) => RAW_BASICS.filter((r) => (r.kind ?? 'grundrezept') === k).length
console.log(`${BREAKFASTS.length} Frühstücke, ${byKind('grundrezept')} Grundrezepte · Backen: ${byKind('dessert')} Desserts, ${byKind('kuchen')} Kuchen, ${byKind('brot')} Brot, ${byKind('gebaeck')} Plätzchen & Cookies (${extraIds.size} aus src/data/extra)`)
const byBbq = (g: string) => RAW_BASICS.filter((r) => r.bbq === g).length
const byTapas = (g: string) => RAW_BASICS.filter((r) => r.tapas === g).length
const bySalat = (g: string) => RAW_BASICS.filter((r) => r.salat === g).length
console.log(`Tapas: ${byKind('tapas')} – Fisch ${byTapas('fisch')}, Fleisch ${byTapas('fleisch')}, Gemüse ${byTapas('gemuese')}, Ei & Kartoffel ${byTapas('ei')}, Brot & Dips ${byTapas('brot')} · Saucen ${byTapas('sauce')} · Salate & Beilagen: ${byKind('salat')} – Nudel ${bySalat('nudel')}, Kartoffel ${bySalat('kartoffel')}, Reis ${bySalat('reis')}, Bohnen ${bySalat('bohnen')}, Gemüse ${bySalat('gemuese')} · Spanische Desserts: ${RAW_BASICS.filter((r) => r.cuisine === 'es' && (r.kind === 'dessert' || r.kind === 'kuchen' || r.kind === 'gebaeck')).length}`)
console.log(`BBQ: ${byKind('bbq')} Rezepte – Smoker ${byBbq('smoker')}, Grill ${byBbq('grill')}, Dutch Oven ${byBbq('dutch')}, Burger ${byBbq('burger')}, Beilagen ${byBbq('beilage')} · Rubs & Saucen ${byBbq('rub')}`)
// Geräte-Schritte: bekannte Rezepte, Texte, Einstellungen im gültigen Bereich
const timeOf = new Map([...RAW_RECIPES, ...RAW_BREAKFASTS, ...RAW_BASICS].map((r) => [r.id, r.time]))
for (const [id, steps] of Object.entries(DEVICE_STEPS)) {
  if (!ids.has(id)) { console.error(`Geräte-Schritte für unbekanntes Rezept: ${id}`); errors++; continue }
  if (!steps.length) { console.error(`Geräte-Schritte leer: ${id}`); errors++ }
  steps.forEach((st, i) => {
    if (!st.text || !st.text.trim()) { console.error(`Geräte-Schritt ${i + 1} ohne Text: ${id}`); errors++ }
    for (const se of st.settings ?? []) for (const e of validateSetting(se)) { console.error(`Gerät in ${id}, Schritt ${i + 1}: ${e}`); errors++ }
    // Gesamtzeit des Rezepts muss mindestens so lang sein wie eine einzelne Geräte-Einstellung
    const time = timeOf.get(id)
    for (const se of st.settings ?? []) if (time != null && se.minutes != null && se.minutes > time) { console.error(`${id}, Schritt ${i + 1}: Gerät ${se.minutes} Min. > Gesamtzeit ${time} Min.`); errors++ }
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
