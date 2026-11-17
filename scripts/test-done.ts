// „Fertig gekocht“ + Portionsfeedback:  npx vite-node scripts/test-done.ts
import { RECIPE_BY_ID } from '../src/data/recipes'
import { cookTarget, futureDuplicate } from '../src/cookDone'
import { formatAmount } from '../src/shopping'
import { addDaysIso, allNeedsOf, cookNow, planWeek, uncook, type PantryLot } from '../src/kitchen'
import { portionFactor } from '../src/learning'
import { settleDue } from '../src/app/upkeep'
import { backupBody, parseBackup } from '../src/backup'
import { sanitize } from '../src/store'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

const today = '2026-11-17' // Dienstag
const tomorrow = addDaysIso(today, 1)
const days = Array.from({ length: 7 }, (_, i) => addDaysIso('2026-11-16', i))
const carbonara = RECIPE_BY_ID['carbonara']
const needs = allNeedsOf(carbonara, 2)
const lots = (): PantryLot[] => needs.map((n, i) => ({ id: 'p' + i, name: n.name, amount: n.amount * 3, unit: n.unit, expires: addDaysIso(today, 20) }))
const total = (p: PantryLot[]) => p.reduce((s, l) => s + l.amount, 0)

// ───── Zieleintrag ─────
const planned: WeekPlan = { [today]: { recipeId: 'carbonara', servings: 2 } }
ok(cookTarget(planned, 'carbonara', today, today).kind === 'entry', 'Ziel: geplantes Gericht von heute → dieser Eintrag')
ok(cookTarget(planned, 'carbonara', today).kind === 'entry', 'Ziel: ohne Kontext, aber heute geplant → dieser Eintrag')
const yest = { [addDaysIso(today, -1)]: { recipeId: 'carbonara', servings: 2 } }
const ty = cookTarget(yest, 'carbonara', today)
ok(ty.kind === 'entry' && ty.day === addDaysIso(today, -1), 'Ziel: gestern geplant, noch offen → gestern')
ok(cookTarget({ [tomorrow]: { recipeId: 'carbonara', servings: 2 } }, 'carbonara', today, tomorrow).kind === 'new', 'Ziel: nur für morgen geplant → heute neu eintragen')
ok(cookTarget({}, 'carbonara', today).kind === 'new', 'Ziel: heute leer → neu für heute')
ok(cookTarget({ [today]: { recipeId: 'carbonara', servings: 2, status: 'skipped' } }, 'tomatensuppe', today).kind === 'new', 'Ziel: heute „nicht gekocht“ → neu für heute')
const tc = cookTarget({ [today]: { recipeId: 'frikadellen', servings: 2 } }, 'carbonara', today, today)
ok(tc.kind === 'conflict' && tc.title === RECIPE_BY_ID['frikadellen'].title, 'Ziel: heute anderes Gericht → Rückfrage mit Titel')
ok((cookTarget({ [today]: { recipeId: 'carbonara', servings: 2, status: 'cooked' } }, 'carbonara', today) as { done: boolean }).done, 'Ziel: schon gekocht → erkannt')

// ───── Jetzt abziehen, einmal ─────
const pantry0 = lots()
const r = cookNow(planned, pantry0, today, { recipeId: 'carbonara', servings: 2 })
const e = r.plan[today]!
ok(e.status === 'cooked' && (e.consumed?.length ?? 0) > 0, 'cookNow: Status gekocht, „entnommen“ gespeichert')
ok(Math.abs(total(r.pantry) - (total(pantry0) - total(needs))) < 1e-6, 'cookNow: Zutaten sofort vom Vorrat abgezogen')
ok(total(pantry0) === total(lots()), 'cookNow: Ausgangsvorrat bleibt unverändert (keine Mutation)')
// cookDue am nächsten Tag zieht nicht noch einmal ab
const s1 = { plan: r.plan, breakfast: {}, pantry: r.pantry, wasted: [], prices: {} }
const nextDay = settleDue(s1, tomorrow)
ok(!nextDay.changed && total(nextDay.pantry) === total(r.pantry), 'cookDue am Folgetag: kein zweites Abziehen')
// Rückgängig / nicht gekocht stellt wieder her
ok(Math.abs(total(uncook(e, r.pantry)) - total(pantry0)) < 1e-6, 'uncook: Zutaten wieder im Vorrat')
// erneutes „Fertig gekocht“ auf einen schon gekochten Eintrag zieht nicht doppelt ab
const again = cookNow(r.plan, r.pantry, today, { recipeId: 'carbonara', servings: 2 })
ok(Math.abs(total(again.pantry) - total(r.pantry)) < 1e-6, 'cookNow auf gekochten Eintrag: nur einmal abgezogen')
// Ersetzen: anderes, schon gekochtes Gericht wird zurückgenommen
const rep = cookNow(r.plan, r.pantry, today, { recipeId: 'tomatensuppe', servings: 2 })
ok(rep.plan[today]!.recipeId === 'tomatensuppe' && rep.plan[today]!.status === 'cooked', 'cookNow: ersetzt das Gericht von heute')
// heute leer → eintragen
const fresh = cookNow({}, lots(), today, { recipeId: 'carbonara', servings: 3 })
ok(fresh.plan[today]!.servings === 3 && fresh.plan[today]!.status === 'cooked' && total(fresh.pantry) < total(lots()), 'cookNow: leerer Tag → Eintrag mit aktuellen Portionen, gekocht, abgezogen')
// ohne Vorrat: kein Absturz, nichts abgezogen
const none = cookNow({}, [], today, { recipeId: 'carbonara', servings: 2 })
ok(none.plan[today]!.status === 'cooked' && none.pantry.length === 0, 'cookNow: leerer Vorrat → trotzdem gekocht eingetragen')

// ───── Bewertung / Portion im Stand ─────
const st = sanitize({ plan: r.plan, ratings: { [today]: 'up' }, portionFeedback: { [today]: -1, '2026-11-10': 5, kaputt: 1, '2026-11-11': 0 } })
ok(st.ratings[today] === 'up', 'Bewertung wird unter dem Tag gespeichert')
ok(Object.keys(st.portionFeedback).join() === '2026-11-11,2026-11-17' && st.portionFeedback[today] === -1, 'sanitize: Portionsfeedback geprüft (kaputte verworfen)')
ok(sanitize({}).portionFeedback && Object.keys(sanitize({}).portionFeedback).length === 0, 'sanitize: alter Stand ohne Feld → leer')
const back = parseBackup(JSON.stringify(backupBody({ ...sanitize({}), portionFeedback: { [today]: 1 } })))
ok(back.portionFeedback[today] === 1, 'Sicherung enthält Portionsfeedback')

// ───── Portionsfaktor wirkt auf Einkauf & Vorrat ─────
const plan2: WeekPlan = { [addDaysIso(today, 2)]: { recipeId: 'carbonara', servings: 2 } }
const base = planWeek(plan2, days, [], {}, today, {}, formatAmount, {}, 11)
const more = planWeek(plan2, days, [], {}, today, {}, formatAmount, {}, 11, { portion: 1.2 })
const less = planWeek(plan2, days, [], {}, today, {}, formatAmount, {}, 11, { portion: 0.85 })
const req = (w: typeof base) => w.buy.reduce((s, b) => s + b.required, 0)
ok(Math.abs(req(more) / req(base) - 1.2) < 1e-6 && Math.abs(req(less) / req(base) - 0.85) < 1e-6, 'planWeek: Bedarf = Portionen × Faktor')
ok(more.total >= base.total && less.total <= base.total, 'planWeek: Kosten folgen dem Faktor')
const stock = needs.map((n, i): PantryLot => ({ id: 'q' + i, name: n.name, amount: n.amount, unit: n.unit, expires: addDaysIso(today, 20) }))
const baseS = planWeek(plan2, days, stock, {}, today, {}, formatAmount, {}, 11)
const moreS = planWeek(plan2, days, stock, {}, today, {}, formatAmount, {}, 11, { portion: 1.2 })
ok(baseS.buy.every((b) => b.packs === 0 || b.required - b.fromPantry < 1e-6) && moreS.buy.some((b) => b.required > b.fromPantry + 1e-6), 'planWeek: Vorrat reicht für 2 Portionen, für ×1,2 fehlt etwas')
ok(planWeek(plan2, days, [], {}, today, {}, formatAmount, {}, 11, { portion: 1 }).total === base.total, 'planWeek: Faktor 1 = unverändert')
// gekochte Gerichte werden nicht noch einmal skaliert (Vorrat wurde ja schon abgezogen)
const doneWeek = planWeek(r.plan, days, r.pantry, {}, today, {}, formatAmount, {}, 11, { portion: 1.2 })
ok(doneWeek.buy.length === 0, 'planWeek: heute gekochtes Gericht verursacht keinen Einkauf')
// Abziehen mit Faktor
const f = cookNow({}, lots(), today, { recipeId: 'carbonara', servings: 2 }, 1.2)
ok(Math.abs(total(lots()) - total(f.pantry) - total(needs) * 1.2) < 1e-6, 'cookNow: zieht Portionen × Faktor ab')
const fbk = { [addDaysIso(today, -1)]: -1 as const, [addDaysIso(today, -2)]: -1 as const }
const sf = settleDue({ plan: { [addDaysIso(today, -1)]: { recipeId: 'carbonara', servings: 2 } }, breakfast: {}, pantry: lots(), wasted: [], prices: {}, portionFeedback: fbk }, today)
ok(Math.abs(total(lots()) - total(sf.pantry) - total(needs) * portionFactor(fbk, today)) < 1e-6, 'cookDue (Folgetag) nutzt denselben Faktor')

// ───── Für später geplant, heute gekocht → verschieben ─────
const later = addDaysIso(today, 2)
const fp: WeekPlan = { [tomorrow]: { recipeId: 'carbonara', servings: 2 }, [later]: { recipeId: 'carbonara', servings: 4 } }
ok(futureDuplicate(fp, 'carbonara', today, later) === later && futureDuplicate(fp, 'carbonara', today) === tomorrow, 'Verschieben: Kontext-Tag, sonst nächster Tag')
ok(futureDuplicate({ [tomorrow]: { recipeId: 'carbonara', servings: 2, status: 'skipped' } }, 'carbonara', today) === undefined && futureDuplicate(planned, 'carbonara', today) === undefined, 'Verschieben: nur offene Einträge in der Zukunft')
const mv = cookNow(fp, lots(), today, { recipeId: 'carbonara', servings: 2 })
const dup = futureDuplicate(fp, 'carbonara', today, tomorrow)!
delete mv.plan[dup]
ok(mv.plan[today]?.status === 'cooked' && !mv.plan[tomorrow] && !!mv.plan[later], 'Verschieben: heute gekocht, Eintrag von morgen entfernt, übrige bleiben')

if (fails) { console.error(`${fails} Test(s) fehlgeschlagen`); process.exit(1) }
console.log('Alle Tests OK')
