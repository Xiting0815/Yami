// Prüft die Rezeptdatenbank: eindeutige IDs, bekannte Zutaten, gültige Einheiten
import { RAW_BREAKFASTS, RAW_RECIPES, BREAKFASTS } from '../src/data/recipes'
import { NUTRI } from '../src/data/nutrition'
import { gramsOf } from '../src/data/nutrition-calc'
import { BROTH_FORMS, CATALOG, SPICES } from '../src/data/catalog'
import { PRODUCTS } from '../src/data/products'
import { canonical, toBase } from '../src/kitchen'
import { isSpice } from '../src/staples'

let errors = 0
const ids = new Set<string>()
const used = new Set<string>()
for (const r of [...RAW_RECIPES, ...RAW_BREAKFASTS]) {
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
const formNames = new Set(Object.values(BROTH_FORMS).flat())
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
console.log(`${BREAKFASTS.length} Frühstücke`)
if (errors) { console.error(`${errors} Fehler`); process.exit(1) }
console.log('OK')
