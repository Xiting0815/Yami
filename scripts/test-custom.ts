// Logiktest eigene Rezepte:  npx vite-node scripts/test-custom.ts
import { RECIPES, BREAKFASTS, RECIPE_BY_ID, registerCustom } from '../src/data/recipes'
import { CATALOG } from '../src/data/catalog'
import { PRODUCTS } from '../src/data/products'
import { NUTRI } from '../src/data/nutrition'
import { parseIngredientText, parseLine, splitLines, toIngredients, unitWorks } from '../src/customIngredients'
import { parseSteps } from '../src/components/RecipeEditor'
import { planWeek, needsOf, recipeCost } from '../src/kitchen'
import { formatAmount } from '../src/shopping'
import { sanitize } from '../src/store'
import { parseBackup } from '../src/backup'
import { buildModel, preference } from '../src/learning'
import type { CustomIngredient, CustomRecipe } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

// ───── Parser ─────
const text = '400 g Rinderhack, 2 Zwiebeln, 1 EL Tomatenmark, 200 ml Sahne, 1 Prise Salz, 0,5 Bund Petersilie, 3 Knoblauchzehen'
const lines = parseIngredientText(text)
ok(lines.length === 7, `7 Zeilen erkannt (${lines.length})`)
const want: [string, number, string][] = [
  ['Rinderhackfleisch', 400, 'g'], ['Zwiebel', 2, 'Stk'], ['Tomatenmark', 1, 'EL'], ['Sahne', 200, 'ml'],
  ['Salz', 1, 'Prise'], ['Petersilie', 0.5, 'Bund'], ['Knoblauch', 3, 'Zehe'],
]
lines.forEach((l, i) => {
  const [n, a, u] = want[i]
  ok(l.match === n && l.amount === a && l.unit === u && !l.unitProblem, `"${l.raw}" → ${l.amount} ${l.unit} ${l.match} (${l.confidence.toFixed(2)})`)
  ok(l.confidence >= 0.8, `  sicher zugeordnet`)
})
const unk = parseLine('100 g Drachenfrucht')
ok(!unk.match && unk.amount === 100 && unk.unit === 'g', 'Unbekannte Zutat "Drachenfrucht" bleibt ohne Treffer')

// weitere Schreibweisen
const t = (s: string) => parseLine(s)
ok(splitLines('2 EL Öl\n0,5 l Milch, 1,5 kg Kartoffeln').length === 3, 'Dezimalkomma trennt nicht')
ok(t('½ TL Zimt').amount === 0.5 && t('½ TL Zimt').match === 'Zimt gemahlen', '½ TL Zimt')
ok(t('1/2 Bund Dill').amount === 0.5 && t('1/2 Bund Dill').match === 'Dill', '1/2 Bund Dill')
ok(t('2-3 Möhren').amount === 2 && t('2-3 Möhren').match === 'Möhre', '2-3 Möhren → 2 Möhre')
ok(t('1 1/2 EL Mehl').amount === 1.5 && t('1 1/2 EL Mehl').match === 'Weizenmehl', '1 1/2 EL Mehl')
ok(t('4 Eier').match === 'Ei' && t('4 Eier').unit === 'Stk', '4 Eier → Ei')
ok(t('50 g Parmesan').match === 'Parmigiano Reggiano', 'Parmesan')
ok(t('500 g Hack').match === 'Hackfleisch gemischt', 'Hack → Hackfleisch gemischt')
ok(t('800 g Kartoffeln').match === 'Kartoffeln festkochend', 'Kartoffeln')
ok(t('250 g Nudeln').match === 'Nudeln', 'Nudeln → Nudeln (generisches Produkt, ersetzt Spaghetti-Synonym)')
ok(t('3 EL Olivenöl').match === 'Olivenöl' && t('2 EL Öl').match === 'Sonnenblumenöl', 'Öl / Olivenöl')
ok(t('1 Stk. Zwiebel').unit === 'Stk' && t('2 St. Zwiebel').unit === 'Stk', 'Stk. / St.')
ok(t('2 Päckchen Vanillezucker').unit === 'Pck', 'Päckchen → Pck')
ok(t('2 Zehen Knoblauch').unit === 'Zehe' && t('2 Zehen Knoblauch').match === 'Knoblauch', 'Zehen Knoblauch')
ok(t('1 Dose gehackte Tomaten').match === 'Gehackte Tomaten' && t('1 Dose gehackte Tomaten').unit === 'Dose', 'Dose gehackte Tomaten')
ok(t('400g Hackfleisch').amount === 400 && t('400g Hackfleisch').unit === 'g', '400g ohne Leerzeichen')
ok(t('Salz').amount === null && t('Salz').match === 'Salz', '"Salz" ohne Menge')
ok(t('250 ml Wasser').ignore === true, 'Wasser wird ignoriert')
ok(t('2 rote Zwiebeln').match === 'Zwiebel rot', 'rote Zwiebeln')
ok(parseIngredientText('Salz und Pfeffer').length === 2, '"Salz und Pfeffer" → 2 Zeilen')
ok(parseIngredientText('2 Zwiebeln, fein gewürfelt, 1 TL Salz').length === 2, 'Zubereitungshinweis wird nicht zur Zutat')
ok(t('2 Stk Hackfleisch').unitProblem, 'Stk bei Hackfleisch → Einheit passt nicht')
ok(unitWorks('Zwiebel', 'g') && unitWorks('Sahne', 'EL') && !unitWorks('Hackfleisch gemischt', 'Stk'), 'unitWorks')
ok(toIngredients(lines).length === 7, 'toIngredients')
const apfelsaft = t('200 ml Apfelsaft')
ok(apfelsaft.match !== 'Apfel', `Apfelsaft wird nicht fälschlich zu Apfel (${apfelsaft.match})`)
ok(parseSteps('1. Zwiebeln anbraten\n2) Hack dazu\nSchritt 3: servieren').join('|') === 'Zwiebeln anbraten|Hack dazu|servieren', 'Schritte: Nummerierung entfernt')
ok(parseSteps('1. Anbraten 2. Köcheln lassen').length === 2, 'Schritte in einer Zeile')

// ───── Zutat anlegen + Rezept registrieren ─────
const dragon: CustomIngredient = { name: 'Drachenfrucht', cat: 'gemuese', kcal: 60, protein: 1.2, unit: 'g' }
const recipe: CustomRecipe = {
  id: 'my-test1', title: 'Omas Gulasch', meal: 'dinner', cuisine: 'de', type: 'eintopf', time: 90, servings: 2, created: '2026-11-10',
  ingredients: [...toIngredients(lines), { name: 'Drachenfrucht', amount: 100, unit: 'g' }],
  steps: ['Anbraten', 'Schmoren', 'Servieren'],
}
const nDinner = RECIPES.length
registerCustom([dragon], [recipe])
ok(CATALOG['Drachenfrucht'] === 'gemuese' && !!PRODUCTS['Drachenfrucht'] && !!NUTRI['Drachenfrucht'], 'neue Zutat in Katalog/Produkte/Nährwerte')
const rec = RECIPE_BY_ID['my-test1']
ok(!!rec && rec.custom === true && RECIPES.includes(rec) && RECIPES.length === nDinner + 1, 'Rezept in RECIPE_BY_ID und RECIPES')
ok(rec.nutrition.kcal > 150 && rec.nutrition.kcal < 900 && rec.nutrition.protein > 10, `plausible Nährwerte: ${rec.nutrition.kcal} kcal, ${rec.nutrition.protein} g Eiweiß`)
ok(!rec.vegetarian, 'Rinderhack → nicht vegetarisch')
ok(needsOf(rec, 2).some((n) => n.name === 'Drachenfrucht' && n.amount === 100), 'Bedarf enthält Drachenfrucht (g)')
ok(recipeCost(rec, 2) > 0, 'Kosten > 0')

// Plan + Einkaufsliste
const day = '2026-11-17'
const days = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22']
const week = planWeek({ [day]: { recipeId: 'my-test1', servings: 2 } }, days, [], {}, '2026-11-16', {}, formatAmount, {}, 11)
const names = week.buy.map((i) => i.name)
const staples = week.staples.map((i) => i.name)
ok(names.includes('Rinderhackfleisch') && names.includes('Drachenfrucht') && names.includes('Zwiebel') && staples.includes('Salz') && week.total > 0, `Einkaufsliste: ${names.length} Posten + ${staples.length} Vorrat (u. a. Drachenfrucht), ${week.total.toFixed(2)} €`)

// Sanitize behält Plan-Eintrag und Rezepte
const state = sanitize({ plan: { [day]: { recipeId: 'my-test1', servings: 2 }, '2026-11-18': { recipeId: 'my-gibtsnicht', servings: 2 } }, customRecipes: [recipe], customIngredients: [dragon] })
ok(!!state.plan[day] && !state.plan['2026-11-18'], 'sanitize: Plan zeigt auf eigenes Rezept → bleibt, unbekanntes my-… fliegt raus')
ok(state.customRecipes.length === 1 && state.customIngredients.length === 1 && !!RECIPE_BY_ID['my-test1'], 'sanitize: eigene Rezepte/Zutaten geladen und registriert')
const broken = sanitize({ customRecipes: [{ id: 'x', title: 'a' }, { id: 'my-b', title: '', meal: 'dinner' }, null, 5], customIngredients: [{ name: 'a' }] })
ok(broken.customRecipes.length === 0 && broken.customIngredients.length === 0 && !RECIPE_BY_ID['my-test1'], 'sanitize: kaputte Einträge verworfen, alte Registrierung geleert')
const orphan = sanitize({ customRecipes: [{ ...recipe, ingredients: [{ name: 'Gibtsnicht', amount: 1, unit: 'g' }] }] })
ok(orphan.customRecipes.length === 0, 'sanitize: Rezept mit unbekannter Zutat und ohne weitere Zutaten entfällt')
const big = sanitize({ customRecipes: [{ ...recipe, image: 'data:image/webp;base64,' + 'A'.repeat(400_000) }], customIngredients: [dragon] })
ok(big.customRecipes[0]?.image === undefined, 'sanitize: zu großes Foto verworfen')

// Frühstück
const bf: CustomRecipe = {
  id: 'my-bf1', title: 'Quark-Glas', meal: 'breakfast', cuisine: 'de', type: 'haupt', time: 5, servings: 1, created: '2026-11-10',
  ingredients: toIngredients(parseIngredientText('200 g Magerquark, 40 g Haferflocken, 100 g Heidelbeeren TK')),
  steps: ['Schichten'], breakfast: { type: 'suess', fridgeDays: 3, freezer: false, container: 'Glas', morning: 'Kalt essen' },
}
const nB = BREAKFASTS.length
registerCustom([dragon], [recipe, bf])
ok(BREAKFASTS.length === nB + 1 && RECIPE_BY_ID['my-bf1'].breakfast?.type === 'suess' && RECIPES.length === nDinner + 1, 'Frühstück landet in BREAKFASTS, Abendessen bleibt')
registerCustom([], [])
ok(!RECIPE_BY_ID['my-test1'] && !CATALOG['Drachenfrucht'] && RECIPES.length === nDinner && BREAKFASTS.length === nB, 'Abmelden: alles wieder wie vorher')

// Backup
registerCustom([dragon], [recipe])
const exported = JSON.stringify({ app: 'yami', version: 1, state: { ...sanitize({ customRecipes: [recipe], customIngredients: [dragon], plan: { [day]: { recipeId: 'my-test1', servings: 2 } } }) } })
registerCustom([], [])
const back = parseBackup(exported)
ok(back.customRecipes.length === 1 && back.customIngredients[0]?.name === 'Drachenfrucht' && !!back.plan[day] && !!RECIPE_BY_ID['my-test1'], 'Backup: eigene Rezepte/Zutaten/Plan überleben Export → Import')

// Lernen: Anlegen zählt als +1
const m0 = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: '2026-11-16' })
const m1 = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: '2026-11-16', customRecipes: [{ id: 'my-test1', created: '2026-11-10' }] })
ok(preference(m1, RECIPE_BY_ID['my-test1']).score > preference(m0, RECIPE_BY_ID['my-test1']).score && m1.signals === 1, 'Lernen: eigenes Rezept ist ein positives Signal')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
