// Rezeptsuche im Rezepte-Tab: Titel vor Zutaten, Tippfehler finden passende Titel
import { RECIPES, BREAKFASTS, BASICS } from '../src/data/recipes'
import { areaHits, searchRecipes, sortedHits } from '../src/recipeSearch'
import { isBakery } from '../src/types'
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

// Suche über alle Bereiche: Treffer je Bereich, genaue Treffer verdrängen Tippfehler-Treffer
const AREAS = [
  { key: 'dinner', pool: RECIPES },
  { key: 'breakfast', pool: BREAKFASTS },
  { key: 'bake', pool: BASICS.filter(isBakery) },
]
ok(areaHits(AREAS, '').length === 0, 'Bereichssuche: leere Suche → keine Hinweise')
const hitsOf = (q: string) => Object.fromEntries(areaHits(AREAS, q).map((a) => [a.key, a.count]))
const bakeTitle = BASICS.find(isBakery)!.title
const bh = hitsOf(bakeTitle)
ok((bh.bake ?? 0) >= 1, `Bereichssuche: „${bakeTitle}“ wird in Backen gefunden (${JSON.stringify(bh)})`)
const ei = hitsOf('Ei')
ok(Object.keys(ei).length >= 2, `Bereichssuche: „Ei“ steckt in mehreren Bereichen (${JSON.stringify(ei)})`)
ok(areaHits(AREAS, 'xyzq').length === 0, 'Bereichssuche: Unsinn → keine Hinweise')
{
  // genauer Treffer in einem Bereich → anderswo zählen keine Tippfehler-Treffer
  const exactOnly = areaHits([{ key: 'a', pool: RECIPES.filter((r) => /spaghetti/i.test(r.title)) }, { key: 'b', pool: RECIPES.filter((r) => !/spag/i.test(r.title) && !r.ingredients.some((i) => /spag/i.test(i.name))) }], 'spaghetti')
  ok(exactOnly.length === 1 && exactOnly[0].key === 'a', `Bereichssuche: nur genaue Treffer zählen, wenn es welche gibt (${JSON.stringify(exactOnly)})`)
}

// Reihenfolge: bei gleich guter Übereinstimmung entscheidet die gelernte Vorliebe, Text schlägt Vorliebe
{
  const sp = find('spaghetti')
  const titleHits = sp.filter((r) => /spaghetti/i.test(r.title))
  const last = titleHits[titleHits.length - 1]
  const liked = sortedHits(ALL, 'spaghetti', (r) => (r.id === last.id ? 5 : 0), () => searchIngredients('spaghetti', 6))
  ok(liked[0].id === last.id, `Vorliebe: beliebtestes Spaghetti-Gericht rückt nach vorn (${liked[0].title})`)
  const ingHit = sp.find((r) => !/spaghetti/i.test(r.title))
  if (ingHit) {
    const l2 = sortedHits(ALL, 'spaghetti', (r) => (r.id === ingHit.id ? 99 : 0))
    ok(l2.findIndex((r) => r.id === ingHit.id) >= titleHits.length, 'Vorliebe: Zutaten-Treffer bleibt trotz Vorliebe hinter Titel-Treffern')
  }
  ok(sortedHits(ALL, 'spaghetti').map((r) => r.id).join() === sp.map((r) => r.id).join(), 'ohne Vorliebe: gleiche Reihenfolge wie bisher')
}

// „Einplanen für“: was an einem Tag schon geplant ist (Gericht kurz / Symbol, gekocht, würde ersetzt)
{
  const { dayNote, shortDish } = await import('../src/components/DayPicker')
  const dish = RECIPES[0]
  const tapa = BASICS.find((r) => r.kind === 'tapas')!
  const plan = { '2026-12-01': { recipeId: dish.id, servings: 2 }, '2026-12-02': { recipeId: dish.id, servings: 2, status: 'cooked' as const } }
  const bake = { '2026-12-03': [{ recipeId: tapa.id, amount: 1 }] }
  const n1 = dayNote(plan, bake, '2026-12-01')
  ok(!!n1.text && n1.dinner === dish.title && !n1.done, `Tag mit Abendessen: „${n1.text}“, würde ersetzt`)
  const n2 = dayNote(plan, bake, '2026-12-02')
  ok(!!n2.done && !n2.dinner, 'gekochter Tag: ausgegraut, wird nicht „ersetzt“')
  ok((dayNote(plan, bake, '2026-12-03').text ?? '').startsWith('🫒'), 'Tapas-Abend: Symbol 🫒')
  ok(!dayNote(plan, bake, '2026-12-04').text, 'freier Tag: kein Hinweis')
  ok(shortDish('Spaghetti alla carbonara') === 'Spaghetti' && shortDish('Schweinekrustenbraten mit Knödeln').length <= 11, 'Gerichtname kurz')
}

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
