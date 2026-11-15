// Logiktest Saisonkalender:  npx vite-node scripts/test-season.ts
import { CATALOG } from '../src/data/catalog'
import { productFor, insight } from '../src/kitchen'
import { SEASON, inSeason, seasonOf } from '../src/data/season'
import { RECIPE_BY_ID } from '../src/data/recipes'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

// Saisondaten
ok(inSeason('Spargel weiß', 11) === false, 'Spargel weiß im November nicht in Saison')
ok(inSeason('Spargel weiß', 5) === true, 'Spargel weiß im Mai in Saison')
ok(inSeason('Grünkohl', 12) === true, 'Grünkohl im Dezember in Saison')
ok(inSeason('Kartoffeln festkochend', 5) === undefined, 'Kartoffeln haben keine Saisondaten')
ok(Object.keys(SEASON).every((n) => CATALOG[n] === 'gemuese'), 'Alle Saison-Einträge sind Gemüse-Zutaten aus dem Katalog')

// Rezeptbezug
const spargel = RECIPE_BY_ID['spargel-hollandaise']
const sNov = seasonOf(spargel, 11)
console.log(`  Spargel-Rezept im November: out=${JSON.stringify(sNov.out)} peak=${JSON.stringify(sNov.peak)}`)
ok(JSON.stringify(sNov.out) === JSON.stringify(['Spargel weiß']), 'spargel-hollandaise im November: out = [Spargel weiß]')
ok(JSON.stringify(seasonOf(spargel, 5).peak) === JSON.stringify(['Spargel weiß']), 'spargel-hollandaise im Mai: peak = [Spargel weiß]')

const iNov = insight(spargel, 2, [], '2026-11-15', {}, new Map(), 0, [], { month: 11 })
const iMay = insight(spargel, 2, [], '2026-05-15', {}, new Map(), 0, [], { month: 5 })
console.log(`  Score Spargel: November ${iNov.score.toFixed(2)}, Mai ${iMay.score.toFixed(2)}`)
ok(iNov.score < iMay.score, 'Spargel-Gericht im November schlechter bewertet als im Mai')
ok(iNov.season?.out[0] === 'Spargel weiß', 'insight liefert season.out im November')

const gk = seasonOf(RECIPE_BY_ID['gruenkohl'], 12)
ok(gk.out.length === 0 && gk.peak.includes('Grünkohl'), 'gruenkohl im Dezember: in Saison, nichts außerhalb')

// Preise
const pNov = productFor('Spargel weiß', {}, 11)!.price
const pMay = productFor('Spargel weiß', {}, 5)!.price
const pNone = productFor('Spargel weiß')!.price
console.log(`  Spargel weiß 500 g: November ${pNov} €, Mai ${pMay} €, ohne Monat ${pNone} €`)
ok(pNov > pMay, 'Spargel weiß im November teurer als im Mai')
ok(productFor('Kartoffeln festkochend', {}, 11)!.price === productFor('Kartoffeln festkochend')!.price, 'Kartoffeln: Preis unverändert')

console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
if (fails) process.exit(1)
