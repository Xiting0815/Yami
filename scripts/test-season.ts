// Logiktest Saisonkalender:  npx vite-node scripts/test-season.ts
import { CATALOG } from '../src/data/catalog'
import { productFor, insight } from '../src/kitchen'
import { SEASON, easterSunday, festiveWindow, inSeason, seasonOf } from '../src/data/season'
import { festiveOf } from '../src/kitchen'
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

// Festtage (Fenster: Martini 1.–15. Nov., Weihnachten 15. Nov.–31. Dez.)
{
  const goose = RECIPE_BY_ID['gaensekeulen-rotkohl']
  const duck = RECIPE_BY_ID['entenbrust-orangensauce']
  const plain = RECIPE_BY_ID['gruenkohl']
  const sc = (r: typeof goose, d: string) => insight(r, 2, [], d, {}, new Map(), 0, [], { month: Number(d.slice(5, 7)), day: d })
  ok(!!goose && !!duck, 'Festtags-Rezepte vorhanden')
  ok(sc(goose, '2026-11-05').festive?.label?.includes('Martinsgans') === true, 'Gans am 5.11.: Martinsgans-Badge')
  ok(sc(goose, '2026-12-20').festive?.label?.includes('Weihnachtszeit') === true, 'Gans am 20.12.: Weihnachts-Badge')
  ok(sc(duck, '2026-12-20').festive?.active === true, 'Ente am 20.12. im Fenster')
  ok(sc(duck, '2026-11-05').festive?.active === false, 'Ente am 5.11. außerhalb des Fensters')
  ok(sc(goose, '2026-03-10').festive?.active === false, 'Gans im März außerhalb')
  const dIn = sc(duck, '2026-12-20').score, dOut = sc(duck, '2026-03-10').score
  ok(dIn - dOut >= 10, `Ente: Score im Fenster (${dIn.toFixed(1)}) mindestens 10 über außerhalb (${dOut.toFixed(1)})`)
  ok(sc(plain, '2026-12-20').festive === undefined, 'Normales Gericht ohne Festtagsbezug')
}

// Osterzeit (beweglich): Ostersonntag nach Gauß/Meeus, Fenster 2 Wochen vorher bis Ostermontag
{
  ok(easterSunday(2024) === '03-31' && easterSunday(2025) === '04-20' && easterSunday(2026) === '04-05' && easterSunday(2027) === '03-28' && easterSunday(2038) === '04-25' && easterSunday(2008) === '03-23', 'Ostersonntag 2008/2024–2027/2038 richtig')
  ok(festiveWindow('ostern', 2026).join() === '03-22,04-06' && festiveWindow('ostern', 2027).join() === '03-14,03-29', 'Osterfenster 2026: 22.3.–6.4., 2027: 14.3.–29.3.')
  ok(festiveWindow('martini', 2026).join() === '11-01,11-30', 'feste Fenster unverändert')
  const tor = RECIPE_BY_ID['torrijas']
  ok(!!tor?.festive?.includes('ostern'), 'Torrijas sind ein Ostergericht')
  ok(festiveOf(tor, '2026-04-02')?.active === true && festiveOf(tor, '2026-04-02')?.label === '🐣 Osterzeit', 'Torrijas am Gründonnerstag 2026: Osterzeit-Badge')
  ok(festiveOf(tor, '2026-03-21')?.active === false && festiveOf(tor, '2026-04-07')?.active === false && festiveOf(tor, '2027-04-02')?.active === false, 'außerhalb der Osterzeit (auch 2027, wenn Ostern früher liegt)')
}

console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
if (fails) process.exit(1)
