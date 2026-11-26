// Rezeptsuche im Rezepte-Tab: Titel vor Zutaten, Tippfehler finden passende Titel
import { RECIPES, BREAKFASTS, BASICS } from '../src/data/recipes'
import { searchRecipes } from '../src/recipeSearch'
import { searchIngredients } from '../src/customIngredients'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const ALL = [...RECIPES, ...BREAKFASTS, ...BASICS]
const find = (q: string, pool = ALL) => {
  const rank = searchRecipes(pool, q, () => searchIngredients(q, 6))
  return pool.filter((r) => rank.has(r.id)).sort((a, b) => rank.get(a.id)! - rank.get(b.id)! || a.title.localeCompare(b.title, 'de'))
}
const t = (l: ReturnType<typeof find>) => l.map((r) => r.title)

ok(find('').length === ALL.length, 'leere Suche: alles')
const tor = find('tortilla')
const firstNonTitle = tor.findIndex((r) => !/tortilla/i.test(r.title))
ok(tor.length > 0 && tor.slice(0, firstNonTitle < 0 ? tor.length : firstNonTitle).every((r) => /tortilla/i.test(r.title)) && tor.slice(firstNonTitle < 0 ? tor.length : firstNonTitle).every((r) => !/tortilla/i.test(r.title)), 'Titel-Treffer stehen vor Zutaten-Treffern („Tortilla“)')
const hasTortillaDish = ALL.some((r) => /tortilla/i.test(r.title))
if (hasTortillaDish) ok(/tortilla/i.test(find('tortila')[0]?.title ?? ''), `Tippfehler „tortila“ findet zuerst ein Tortilla-Gericht (${find('tortila')[0]?.title})`)
ok(/spaghetti/i.test(find('spagetti')[0]?.title ?? ''), `„spagetti“ → Spaghetti-Gericht zuerst (${find('spagetti')[0]?.title})`)
ok(/h(ä|ae)hnchen/i.test(find('hänchen')[0]?.title ?? ''), `„hänchen“ → Hähnchen-Gericht zuerst (${find('hänchen')[0]?.title})`)
ok(find('gulasch').every((r, i, l) => i === 0 || !/gulasch/i.test(r.title) || /gulasch/i.test(l[i - 1].title)), 'Gulasch: Titel zuerst')
ok(find('xyzq').length === 0, 'Unsinn findet nichts')
ok(find('Zuchini').length > 0, `„Zuchini“ findet Zucchini-Gerichte (${find('Zuchini').length})`)
console.log('Beispiele:', t(find('tortila')).slice(0, 3).join(' | '), '·', t(find('kartofel')).slice(0, 3).join(' | '))

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
