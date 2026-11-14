// Prüft die Rezeptdatenbank: eindeutige IDs, bekannte Zutaten, gültige Einheiten
import { RAW_RECIPES } from '../src/data/recipes'
import { CATALOG } from '../src/data/catalog'

let errors = 0
const ids = new Set<string>()
const used = new Set<string>()
for (const r of RAW_RECIPES) {
  if (ids.has(r.id)) { console.error('Doppelte ID:', r.id); errors++ }
  ids.add(r.id)
  if (r.steps.length < 3) { console.error('Zu wenige Schritte:', r.id); errors++ }
  for (const i of r.ingredients) {
    used.add(i.name)
    if (!CATALOG[i.name]) { console.error(`Unbekannte Zutat in ${r.id}: "${i.name}"`); errors++ }
    if (/^\d/.test(i.name)) { console.error(`Einheit nicht erkannt in ${r.id}: "${i.name}"`); errors++ }
  }
}
for (const n of Object.keys(CATALOG)) if (!used.has(n)) console.warn('Unbenutzt im Katalog:', n)
const by = (k: string) => RAW_RECIPES.filter((r) => r.cuisine === k).length
const byType: Record<string, number> = {}
for (const r of RAW_RECIPES) byType[r.type] = (byType[r.type] ?? 0) + 1
console.log(`${RAW_RECIPES.length} Rezepte – DE ${by('de')}, IT ${by('it')}, AS ${by('as')}`, byType)
if (errors) { console.error(`${errors} Fehler`); process.exit(1) }
console.log('OK')
