// Tests: Backen einplanen – Backplan, Einkauf, Gebacken?-Nachfrage, Vorschläge + Lernen, Familien-Abgleich
//   npx vite-node scripts/test-bakeplan.ts
import { RECIPE_BY_ID, RECIPES } from '../src/data/recipes'
import { type AppState, newHa, sanitize, weekDays, parseIso } from '../src/store'
import { type HaApi, type RemoteTodo } from '../src/haSync'
import { HaError } from '../src/homeassistant'
import { applyRound, extract, familySync } from '../src/sync'
import { backupBody, parseBackup } from '../src/backup'
import { formatAmount } from '../src/shopping'
import { planWeek } from '../src/kitchen'
import { haLocalFor } from '../src/haRun'
import {
  acceptSuggestion, addBake, bakeEntriesOf, bakeHabits, bakesOn, dismissSuggestion, habitDay, hintBlocked, markBaked, matchBake, moveBake, pendingBakes,
  removeBake, sanitizeBakePlan, settleBaked, suggestBake, type BakeHint, type SuggestInput,
} from '../src/bakePlan'
import { buildModel } from '../src/learning'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

const BIENEN = 'bienenstich'
const BROETCHEN = 'dinkelbroetchen-ueber-nacht'
const bien = RECIPE_BY_ID[BIENEN]
ok(!!bien?.basic && bien.kind === 'kuchen' && bien.yields?.amount === 12, 'Bienenstich: Backrezept, 12 Stück')

// ───── 1) Backplan ändern ─────
let bp = addBake({}, '2026-11-21', BIENEN, 1)
bp = addBake(bp, '2026-11-21', BROETCHEN, 2)
ok(bakesOn(bp, '2026-11-21').length === 2, 'mehrere Backwaren am selben Tag')
bp = addBake(bp, '2026-11-21', BIENEN, 3)
ok(bakesOn(bp, '2026-11-21').length === 2 && bakesOn(bp, '2026-11-21')[0].amount === 3, 'dasselbe Rezept am selben Tag: ersetzt statt doppelt')
bp = moveBake(bp, '2026-11-21', BIENEN, '2026-11-22')
ok(bakesOn(bp, '2026-11-21').map((e) => e.recipeId).join() === BROETCHEN && bakesOn(bp, '2026-11-22')[0].recipeId === BIENEN && bakesOn(bp, '2026-11-22')[0].amount === 3, 'verschieben: Menge bleibt')
bp = removeBake(removeBake(bp, '2026-11-21', BROETCHEN), '2026-11-22', BIENEN)
ok(Object.keys(bp).length === 0, 'entfernen: leere Tage verschwinden')
const junk = sanitizeBakePlan({ '2026-11-21': [{ recipeId: BIENEN, amount: 99 }, { recipeId: BIENEN, amount: 1 }, { recipeId: 'gibt-es-nicht', amount: 1 }, { recipeId: RECIPES[0].id, amount: 1 }, { recipeId: BROETCHEN, amount: 'x', status: 'baked' }], kaputt: [], '2026-11-22': 'x' })
ok(Object.keys(junk).length === 1 && junk['2026-11-21']!.length === 2 && junk['2026-11-21']![0].amount === 12 && junk['2026-11-21']![1].status === 'baked' && junk['2026-11-21']![1].amount === 1, 'sanitize: Duplikate, unbekannte und Abendessen-Rezepte fliegen raus, Menge 1–12')
ok(Object.keys(sanitize({ bakePlan: 'x', bakeHints: 5 }).bakePlan).length === 0 && sanitize({ bakePlan: 'x' }).bakeHints.length === 0, 'sanitize: kaputte Felder → leer')

// ───── 2) Einkauf: geplantes Backen wie ein Abendessen ─────
const TODAY = '2026-11-18'
const week = weekDays(parseIso('2026-11-16'))
const run = (plan: AppState['bakePlan'], pantry: AppState['pantry'] = []) =>
  planWeek({}, week, pantry, {}, TODAY, {}, formatAmount, {}, 11, {}, plan)
const none = run({})
const one = run(addBake({}, '2026-11-21', BIENEN, 1))
const two = run(addBake({}, '2026-11-21', BIENEN, 2))
const need = (w: ReturnType<typeof run>, name: string) => w.buy.find((b) => b.name === name)?.required ?? w.covered.find((b) => b.name === name)?.required ?? 0
ok(none.buy.length === 0 && none.total === 0, 'ohne Backplan: nichts zu kaufen')
ok(need(one, 'Butter') === 160 && need(one, 'Mandelblättchen') === 150, `Einkauf: Bienenstich braucht 160 g Butter / 150 g Mandelblättchen (${need(one, 'Butter')}/${need(one, 'Mandelblättchen')})`)
ok(need(two, 'Butter') === 320, 'Rezeptmenge ×2 verdoppelt den Bedarf')
ok(one.total > 0 && one.buy.some((b) => b.recipes.includes('Bienenstich')), `Kosten ≈ ${one.total.toFixed(2)} € und Rezeptname „Bienenstich“ an den Artikeln`)
const withFlour = run(addBake({}, '2026-11-21', BIENEN, 1), [{ id: 'f', name: 'Weizenmehl', amount: 1000, unit: 'g', expires: '2027-03-01' }])
ok(withFlour.buy.every((b) => b.name !== 'Weizenmehl') && withFlour.pantryLeft.find((l) => l.id === 'f')!.amount === 625, 'Vorrat deckt Mehl; Rest-Vorrat reserviert 375 g')
ok(run(markBaked(addBake({}, '2026-11-21', BIENEN, 1), '2026-11-21', BIENEN)).buy.length === 0, 'gebacken: kein Bedarf mehr')
ok(run(addBake({}, '2026-11-30', BIENEN, 1)).buy.length === 0, 'anderer Woche: nicht in dieser Liste')
ok(run(addBake({}, '2026-11-10', BIENEN, 1)).buy.length === 0, 'vergessen (älter als 14 Tage): reserviert nichts')
const late = planWeek({}, week, [], {}, TODAY, {}, formatAmount, {}, 11, {}, addBake({}, '2026-11-17', BIENEN, 1))
ok(late.buy.length > 0, 'gestern geplant, noch nicht beantwortet: Bedarf bleibt')
// Home-Assistant-Einkaufsliste bekommt es über haLocalFor
const st = sanitize({ bakePlan: addBake({}, '2026-11-21', BIENEN, 1), onboarding: 'done' })
ok(haLocalFor(st, TODAY).some((i) => /Mandelblättchen/.test(i.summary ?? i.key ?? JSON.stringify(i))), 'Google Tasks: Zutaten stehen in der HA-Einkaufsliste')
ok(bakeEntriesOf(addBake({}, '2026-11-21', BIENEN, 2), TODAY)[0][1].servings === 2, 'Plan-Eintrag: Portionen = Rezeptmenge × Basisportionen')

// ───── 3) Nachfrage und Gebacken ─────
const base = addBake({}, '2026-11-21', BIENEN, 1)
ok(pendingBakes(base, '2026-11-21').length === 0, 'am Backtag selbst: noch keine Nachfrage')
ok(pendingBakes(base, '2026-11-22').length === 1 && pendingBakes(base, '2026-11-30').length === 1, 'Folgetag und danach: Nachfrage, bis beantwortet')
ok(pendingBakes(base, '2026-12-10').length === 0, 'nach 14 Tagen: nicht mehr nerven')
const lots = [{ id: 'm', name: 'Weizenmehl', amount: 1000, unit: 'g', expires: '2027-03-01' }, { id: 'mb', name: 'Mandelblättchen', amount: 200, unit: 'g', expires: '2027-03-01' }]
const done = settleBaked({ pantry: lots, bakePlan: base, baked: [] }, '2026-11-21', BIENEN)!
const cake = done.pantry.filter((l) => l.name === bien.yields!.name)
ok(cake.length === 1 && cake[0].amount === 12 && cake[0].unit === 'Stk', 'Ja: 12 Stk Bienenstich im Vorrat')
ok(done.pantry.find((l) => l.id === 'm')!.amount === 625 && done.pantry.find((l) => l.id === 'mb')!.amount === 50, 'Ja: Zutaten abgezogen (375 g Mehl, 150 g Mandeln)')
ok(cake[0].expires === '2026-11-24', 'Haltbarkeit ab Backtag (3 Tage)')
ok(done.baked.length === 1 && done.baked[0].date === '2026-11-21' && pendingBakes(done.bakePlan, '2026-11-22').length === 0, 'gebacken vermerkt (Lernen), Frage verschwindet')
ok(settleBaked({ ...done }, '2026-11-21', BIENEN) === null, 'zweites „Ja“: nichts passiert (kein zweites Abziehen)')
ok(matchBake(base, BIENEN, '2026-11-20') === '2026-11-21' && matchBake(base, BIENEN, '2026-11-22') === '2026-11-21' && matchBake(base, 'x', '2026-11-22') === undefined, 'Kochmodus „Fertig gebacken“ findet den geplanten Eintrag (vorher/nachher)')
ok(matchBake(markBaked(base, '2026-11-21', BIENEN), BIENEN, '2026-11-22') === undefined, 'schon gebackener Eintrag wird nicht noch einmal zugeordnet')
const moved = moveBake(base, '2026-11-21', BIENEN, '2026-11-28')
ok(pendingBakes(moved, '2026-11-22').length === 0 && bakesOn(moved, '2026-11-28').length === 1, 'Verschieben: Frage weg, neuer Tag')
// Backup
const bk = parseBackup(JSON.stringify(backupBody(sanitize({ bakePlan: done.bakePlan, bakeHints: [{ date: '2026-11-10', kind: 'brot', action: 'dismissed' }], onboarding: 'done' }))))
ok(bakesOn(bk.bakePlan, '2026-11-21')[0]?.status === 'baked' && bk.bakeHints.length === 1, 'Sicherung: Backplan und Vorschlags-Signale bleiben erhalten')
// Lernen: Gebackenes zählt im Geschmacksmodell
const m = buildModel({ plan: {}, breakfast: {}, breakfastPicks: {}, rejects: [], ratings: {}, today: '2026-11-22', baked: done.baked })
ok(m.signals > 0, 'Lernen: bestätigtes Backen ist ein Signal')

// ───── 4) Vorschläge + Lernen ─────
const bakedOn = (recipeId: string, ...dates: string[]) => dates.map((date) => ({ date, recipeId }))
const inp = (over: Partial<SuggestInput>): SuggestInput => ({ today: '2026-11-19', pantry: [], baked: [], bakeRatings: {}, bakePlan: {}, hints: [], ...over })
// Brot: Do, Brötchen alle, backen gern Brötchen (Samstage)
const brotHist = bakedOn(BROETCHEN, '2026-10-24', '2026-11-07', '2026-11-14')
const s1 = suggestBake(inp({ baked: brotHist }))
ok(s1?.kind === 'brot' && s1.recipeId === BROETCHEN && s1.day === '2026-11-21' && s1.text === 'Brötchen sind alle – Dinkelbrötchen über Nacht für Samstag backen?', `Brot-Vorschlag: „${s1?.text}“`)
ok(suggestBake(inp({ today: '2026-11-20', baked: brotHist }))?.kind === 'brot', 'Freitag: ebenfalls')
ok(suggestBake(inp({ today: '2026-11-18', baked: brotHist }))?.kind !== 'brot', 'Mittwoch: noch zu früh für Samstag')
ok(suggestBake(inp({ baked: brotHist, pantry: [{ id: 'b', name: 'Brötchen vom Vortag', amount: 4, unit: 'Stk', expires: '2026-11-21' }] }))?.kind !== 'brot', 'Brötchen noch da: kein Vorschlag')
ok(suggestBake(inp({ baked: brotHist, pantry: [{ id: 'b', name: 'Dinkelbrötchen selbstgebacken', amount: 4, unit: 'Stk', expires: '2026-11-21' }] }))?.kind !== 'brot', 'selbstgebackene Brötchen da: kein Vorschlag')
ok(suggestBake(inp({ baked: bakedOn(BROETCHEN, '2026-11-14') }))?.kind !== 'brot', 'nur einmal Brot gebacken (ohne Bewertung): noch keine Gewohnheit')
ok(suggestBake(inp({ baked: bakedOn(BROETCHEN, '2026-11-14'), bakeRatings: { [`2026-11-14:${BROETCHEN}`]: 'again' } }))?.kind === 'brot', 'einmal gebacken + „bald wieder“: reicht')
ok(suggestBake(inp({ baked: brotHist, bakePlan: addBake({}, '2026-11-21', BROETCHEN, 1) }))?.kind !== 'brot', 'schon eingeplant: kein Vorschlag')
// Gewohnheit lernen: Sonntags backen → Vorschlag für Sonntag (Fr/Sa sind nah genug)
const sunHist = bakedOn(BROETCHEN, '2026-10-25', '2026-11-08', '2026-11-15')
const habits = bakeHabits(sunHist, '2026-11-19')
ok(habitDay(habits, 'brot') === 0 && habitDay(bakeHabits(brotHist, '2026-11-19'), 'brot') === 6, 'Wochentags-Gewohnheit: Sonntag bzw. Samstag gelernt')
const s2 = suggestBake(inp({ today: '2026-11-20', baked: sunHist }))
ok(s2?.kind === 'brot' && s2.day === '2026-11-22' && /Sonntag/.test(s2.text), `gelernter Backtag Sonntag: „${s2?.text}“`)
// Plätzchen in der Plätzchenzeit
const s3 = suggestBake(inp({}))
ok(s3?.kind === 'plaetzchen' && !!RECIPE_BY_ID[s3.recipeId].festive?.includes('plaetzchen') && s3.day === '2026-11-21' && /^Plätzchenzeit/.test(s3.text), `Plätzchen: „${s3?.text}“`)
ok(suggestBake(inp({ today: '2026-03-18' }))?.kind !== 'plaetzchen', 'außerhalb der Plätzchenzeit: nichts')
ok(suggestBake(inp({ bakePlan: addBake({}, '2026-11-21', s3!.recipeId, 1) }))?.kind !== 'plaetzchen', 'Plätzchen schon eingeplant: nichts')
ok(suggestBake(inp({ baked: bakedOn(s3!.recipeId, '2026-11-16') }))?.kind !== 'plaetzchen', 'diese Woche schon Plätzchen gebacken: nichts')
const s3b = suggestBake(inp({ bakeRatings: { [`2026-11-01:${s3!.recipeId}`]: 'down' } }))
ok(s3b?.kind === 'plaetzchen' && s3b.recipeId !== s3!.recipeId, '„Nicht so“ gewertetes Rezept wird nicht vorgeschlagen')
const s3c = suggestBake(inp({ bakeRatings: { [`2026-11-01:${s3!.recipeId}`]: 'again' } }))
ok(s3c?.recipeId === s3!.recipeId, 'gern gebackenes Rezept bleibt vorn')
// Kuchen am Wochenende (außerhalb der Plätzchenzeit)
const kuchenHist = bakedOn(BIENEN, '2026-08-22', '2026-08-29', '2026-09-05', '2026-09-12')
const s4 = suggestBake(inp({ today: '2026-09-17', baked: kuchenHist }))
ok(s4?.kind === 'kuchen' && s4.day === '2026-09-19' && /Kuchentag/.test(s4.text), `Kuchen: „${s4?.text}“`)
const s4b = suggestBake(inp({ today: '2026-09-18', baked: bakedOn(BIENEN, '2026-08-23', '2026-08-30', '2026-09-06') }))
ok(s4b?.kind === 'kuchen' && s4b.day === '2026-09-20', 'Kuchen an Sonntagen gelernt → Vorschlag für Sonntag')
ok(suggestBake(inp({ today: '2026-09-17', baked: bakedOn(BIENEN, '2026-08-19', '2026-08-26', '2026-09-02', '2026-09-09') }))?.kind !== 'kuchen', 'Kuchen unter der Woche gebacken: kein Wochenend-Vorschlag')
ok(suggestBake(inp({ today: '2026-09-17', baked: kuchenHist, pantry: [{ id: 'k', name: 'Bienenstich (selbstgebacken)', amount: 4, unit: 'Stk', expires: '2026-09-18' }] }))?.kind !== 'kuchen', 'Kuchen im Vorrat: kein Vorschlag')
// höchstens einer: Brot hat Vorrang vor Plätzchen
ok(suggestBake(inp({ baked: brotHist }))?.kind === 'brot', 'höchstens ein Vorschlag (Brot vor Plätzchen)')

// Wegklicken: ruht länger, je öfter; Annehmen setzt zurück
let hints: BakeHint[] = dismissSuggestion([], s3!, '2026-11-19')
ok(suggestBake(inp({ hints }))?.kind !== 'plaetzchen' && suggestBake(inp({ hints, baked: brotHist })) === undefined, 'weggeklickt: heute gar kein Vorschlag mehr')
ok(hintBlocked(hints, 'plaetzchen', '2026-11-24') && !hintBlocked(hints, 'plaetzchen', '2026-11-25'), '1× weggeklickt: 6 Tage Pause')
hints = dismissSuggestion(hints, s3!, '2026-11-25')
ok(hintBlocked(hints, 'plaetzchen', '2026-12-06') && !hintBlocked(hints, 'plaetzchen', '2026-12-07'), '2× weggeklickt: 12 Tage Pause')
hints = dismissSuggestion(dismissSuggestion(hints, s3!, '2026-12-07'), s3!, '2027-01-01')
ok(hintBlocked(hints, 'plaetzchen', '2027-02-15') && !hintBlocked(hints, 'brot', '2027-02-15'), '4× weggeklickt: still – aber nur diese Art')
ok(!hintBlocked(hints, 'plaetzchen', '2027-06-01'), 'Wegklicks verfallen nach 120 Tagen')
const sugg = { ...s3!, day: '2026-12-12' }
const acc = acceptSuggestion({}, hints.filter((h) => h.date < '2026-12-10'), sugg, '2026-12-10')
ok(!hintBlocked(acc.hints, 'plaetzchen', '2026-12-11') && bakesOn(acc.bakePlan, sugg.day)[0]?.recipeId === sugg.recipeId, 'Annehmen: eingeplant und Pause zurückgesetzt')
ok(suggestBake(inp({ today: '2026-12-11', bakePlan: acc.bakePlan, hints: acc.hints }))?.kind !== 'plaetzchen', 'nach Annehmen: nicht noch einmal derselbe Vorschlag')

// ───── 5) Familien-Abgleich ─────
type Todo = RemoteTodo & { description: string }
class FakeHa {
  items: Todo[] = []
  next = 1
  api(): HaApi {
    const self = this
    return {
      async command<T>(msg: Record<string, unknown>): Promise<T> {
        if (msg.type === 'todo/item/list') return { items: self.items.map((i) => ({ ...i })) } as T
        throw new HaError('unsupported', 'x')
      },
      async callService(domain: string, service: string, data: Record<string, unknown> = {}) {
        if (domain !== 'todo') throw new HaError('failed', 'x')
        if (service === 'add_item') self.items.push({ uid: 'u' + self.next++, summary: String(data.item), status: 'needs_action', description: String(data.description ?? '') })
        else if (service === 'update_item') {
          const it = self.items.find((i) => i.uid === data.item)!
          if (data.description !== undefined) it.description = String(data.description)
        } else if (service === 'remove_item') self.items = self.items.filter((i) => i.uid !== data.item)
        return null
      },
      async subscribe() { return () => {} },
    }
  }
}
const hass = new FakeHa()
let clock = Date.parse('2026-11-18T10:00:00')
const ha = (me: string) => ({ ...newHa('https://x.ui.nabu.casa', 'tok'), enabled: true, share: true, me })
const dev = (me: string, extra: Partial<AppState> = {}) => sanitize({ ...extra, ha: ha(me), onboarding: 'done' })
async function sync(s: AppState, today = TODAY): Promise<AppState> {
  clock += 1000
  const { res } = await familySync(hass.api(), 'todo.yami_sync', s, s.ha!.me!, new Date(clock), today)
  return applyRound(s, res).state
}
let marc = dev('Marc', { bakePlan: addBake({}, '2026-11-21', BIENEN, 1) })
marc = await sync(marc)
let lisa = dev('Lisa')
lisa = await sync(lisa)
ok(bakesOn(lisa.bakePlan, '2026-11-21')[0]?.recipeId === BIENEN, 'Lisa sieht Marcs eingeplanten Bienenstich')
ok(!('bakeHints' in extract(marc)) && Object.keys(extract(marc)).some((k) => k.startsWith('bplan:')), 'Backplan geteilt (bplan:…), Vorschlags-Signale bleiben persönlich')
// beide planen dasselbe Backen am selben Tag (offline) → ein Eintrag
marc = { ...marc, bakePlan: addBake(marc.bakePlan, '2026-11-22', BROETCHEN, 1) }
lisa = { ...lisa, bakePlan: addBake(lisa.bakePlan, '2026-11-22', BROETCHEN, 1) }
marc = await sync(marc)
lisa = await sync(lisa)
marc = await sync(marc)
ok(bakesOn(marc.bakePlan, '2026-11-22').length === 1 && bakesOn(lisa.bakePlan, '2026-11-22').length === 1, 'beide planen dasselbe: nur ein Eintrag, nichts doppelt')
// verschiedene Backwaren am selben Tag: beide bleiben
marc = { ...marc, bakePlan: addBake(marc.bakePlan, '2026-11-21', 'ciabatta', 1) }
const other = Object.keys(RECIPE_BY_ID).find((id) => RECIPE_BY_ID[id].kind === 'gebaeck')!
lisa = { ...lisa, bakePlan: addBake(lisa.bakePlan, '2026-11-21', other, 1) }
marc = await sync(marc)
lisa = await sync(lisa)
marc = await sync(marc)
ok(bakesOn(marc.bakePlan, '2026-11-21').length === 3 && bakesOn(lisa.bakePlan, '2026-11-21').length === 3, 'verschiedene Backwaren am selben Tag (Marc + Lisa): alle bleiben')
// Marc beantwortet „Gebacken?“ mit Ja → Lisa wird nicht mehr gefragt, Vorrat einmal
const day = '2026-11-21'
marc = { ...marc, pantry: [...marc.pantry, ...lots] }
marc = await sync(marc)
lisa = await sync(lisa)
ok(pendingBakes(lisa.bakePlan, '2026-11-22').some((p) => p.entry.recipeId === BIENEN), 'Lisa würde am Folgetag gefragt')
const r = settleBaked(marc, day, BIENEN)!
marc = { ...marc, ...r }
marc = await sync(marc, '2026-11-22')
lisa = await sync(lisa, '2026-11-22')
ok(!pendingBakes(lisa.bakePlan, '2026-11-22').some((p) => p.entry.recipeId === BIENEN) && bakesOn(lisa.bakePlan, day).find((e) => e.recipeId === BIENEN)?.status === 'baked', 'Marc: „Ja“ → Lisa wird nicht mehr gefragt')
ok(lisa.pantry.filter((l) => l.name === bien.yields!.name).length === 1 && marc.pantry.filter((l) => l.name === bien.yields!.name).length === 1, 'Vorrat: Bienenstich genau einmal bei beiden')
ok(settleBaked(lisa, day, BIENEN) === null, 'Lisa kann nicht noch einmal abziehen')
ok(lisa.baked.length === 0 && marc.baked.length === 1, 'Gebackenes ist ein persönliches Lernsignal (Marc)')
// Verschieben und Entfernen wandern mit (Grabstein)
marc = { ...marc, bakePlan: moveBake(marc.bakePlan, '2026-11-22', BROETCHEN, '2026-11-28') }
marc = await sync(marc, '2026-11-22')
lisa = await sync(lisa, '2026-11-22')
ok(bakesOn(lisa.bakePlan, '2026-11-22').length === 0 && bakesOn(lisa.bakePlan, '2026-11-28')[0]?.recipeId === BROETCHEN, 'Verschieben kommt bei Lisa an')
lisa = { ...lisa, bakePlan: removeBake(lisa.bakePlan, '2026-11-28', BROETCHEN) }
lisa = await sync(lisa, '2026-11-22')
marc = await sync(marc, '2026-11-22')
marc = await sync(marc, '2026-11-22')
ok(bakesOn(marc.bakePlan, '2026-11-28').length === 0, 'Entfernen (Grabstein) kommt bei Marc an und kehrt nicht zurück')
// Einkaufsliste bei beiden gleich
const needs = (s: AppState) => planWeek(s.plan, week, s.pantry, {}, TODAY, {}, formatAmount, {}, 11, {}, addBake({}, '2026-11-21', BIENEN, 1)).buy.map((b) => b.name).sort().join()
ok(needs(marc) === needs(lisa), 'gleicher Stand → gleiche Einkaufsliste')

console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
if (fails) process.exit(1)
