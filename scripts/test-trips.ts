// Einkäufe statt Wochen:  npx vite-node scripts/test-trips.ts
// Szenario des Nutzers: heute Fr 20.11.2026, Abendessen Sa 21. bis So 29.11. geplant, Einkauf samstags (optional mittwochs).
import { RECIPE_BY_ID } from '../src/data/recipes'
import { PRODUCTS } from '../src/data/products'
import { type BuyItem, type PantryLot, type Trip, boughtOfWeek, keepDays, needsOf, shoppingTrips, tripKey, uid } from '../src/kitchen'
import { type HaApi, type RemoteTodo, plannedReminders } from '../src/haSync'
import { HaError } from '../src/homeassistant'
import { haLocalFor, haRound } from '../src/haRun'
import { formatAmount, isBought } from '../src/shopping'
import { type AppState, newHa, sanitize } from '../src/store'
import { extract, rebuild } from '../src/sync'
import {
  answerTrip, findHaItem, haTripItems, haveAmount, haveCounts, haveLot, isReleased, learnedShopDay, newSinceRelease, releaseTrip, reviewQueue,
  shopDaySuggestion, stockSuggestion, tripCoverText, tripReminderInput, tripsOf, unreleaseTrip,
} from '../src/tripState'
import type { WeekPlan } from '../src/types'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

const TODAY = '2026-11-20' // Freitag
const plan: WeekPlan = {
  '2026-11-21': { recipeId: 'frikadellen', servings: 2 }, // Hack (Sa)
  '2026-11-22': { recipeId: 'kohlrouladen', servings: 2 }, // Hack (So)
  '2026-11-23': { recipeId: 'haehnchen-rahm-bandnudeln', servings: 2 },
  '2026-11-24': { recipeId: 'penne-salmone', servings: 2 }, // Lachs (Di)
  '2026-11-25': { recipeId: 'weisskohleintopf', servings: 2 }, // Hack (Mi)
  '2026-11-26': { recipeId: 'lachs-senf-dill', servings: 2 }, // Lachs (Do)
  '2026-11-27': { recipeId: 'gefuellte-paprika', servings: 2 }, // Hack (Fr)
  '2026-11-28': { recipeId: 'kartoffel-hack-auflauf', servings: 2 }, // Hack (Sa)
  '2026-11-29': { recipeId: 'huehnerfrikassee', servings: 2 },
}
for (const e of Object.values(plan)) if (!RECIPE_BY_ID[e!.recipeId]) throw new Error('Rezept fehlt: ' + e!.recipeId)
const lot = (name: string, amount: number, expires: string): PantryLot => ({ id: uid(), name, amount, unit: PRODUCTS[name].unit, expires })
const pantry0: PantryLot[] = [lot('Zwiebel', 3, '2026-12-20'), lot('Sahne', 200, '2026-12-05'), lot('Bandnudeln', 500, '2027-06-01')]
const base = (extra: Partial<AppState> = {}): AppState => sanitize({ plan, pantry: pantry0, onboarding: 'done', ...extra })

const find = (t: Trip | undefined, name: string) => t?.buy.find((b) => b.name === name)
const all = (t: Trip | undefined, name: string): BuyItem | undefined => find(t, name) ?? t?.covered.find((b) => b.name === name)

// ───── 1) Einkäufe im Szenario ─────
let s = base()
let trips = tripsOf(s, TODAY)
const sa = trips.find((t) => t.date === '2026-11-21')
const mi = trips.find((t) => t.date === '2026-11-25')
const sa2 = trips.find((t) => t.date === '2026-11-28')
console.log(trips.map((t) => `${t.kind} ${t.date}: ${t.buy.length} Artikel`).join(' · '))
ok(trips[0] === sa && sa?.kind === 'main', 'nächster Einkauf: Sa 21.11. (heute Fr, kein Essen heute → kein „Heute noch“)')
ok(!trips.some((t) => t.kind === 'now'), 'nichts fehlt vor Samstag → keine „Heute noch“-Liste')
ok(sa!.from === '2026-11-21' && sa!.to === '2026-11-27' && tripCoverText(sa!) === 'deckt Sa–Fr ab', `Sa 21.11. deckt Sa–Fr ab (${sa!.from}–${sa!.to})`)
ok(sa!.days.join() === '2026-11-21,2026-11-22,2026-11-23,2026-11-24,2026-11-25,2026-11-26,2026-11-27', 'Sa 21.11.: Essen Sa 21. – Fr 27.')
ok(mi?.kind === 'extra', 'Zusatzeinkauf Mi 25.11. entsteht (frische Zutaten)')
ok(sa2?.kind === 'main' && sa2.days.join() === '2026-11-28,2026-11-29' && tripCoverText(sa2) === 'deckt Sa–So ab', 'Sa 28.11. deckt Sa/So 28./29. ab')
ok(trips.map((t) => t.date).join() === '2026-11-21,2026-11-25,2026-11-28', 'Reihenfolge: Sa 21. · Mi 25. · Sa 28.')
// Frische: Lachs Do, Hack Mi/Fr → Mittwoch, mit Grund
const lachsMi = find(mi, 'Lachsfilet')
ok(!!lachsMi && lachsMi.days!.join() === '2026-11-26' && lachsMi.reason === 'hält nicht bis Do', `Lachs für Do → Mi, Grund „${lachsMi?.reason}“`)
const hackMi = find(mi, 'Hackfleisch gemischt')
ok(!!hackMi && hackMi.days!.join() === '2026-11-25,2026-11-27' && /hält nicht bis Mi/.test(hackMi.reason ?? ''), `Hack für Mi/Fr → Mi (${hackMi?.reason})`)
const hackSa = find(sa, 'Hackfleisch gemischt')
ok(!!hackSa && hackSa.days!.join() === '2026-11-21,2026-11-22' && !hackSa.reason, 'Hack für Sa/So bleibt am Samstag (hält bis So)')
ok(find(sa, 'Lachsfilet')?.reason === 'hält nicht bis Di – einfrieren', 'Lachs für Di: kein Einkauf dazwischen → Samstag, „einfrieren“')
ok(mi!.buy.every((b) => (PRODUCTS[b.name]?.shelf ?? 99) <= 6), `Mittwoch nur kurz Haltbares (${mi!.buy.map((b) => b.name).join(', ')})`)
ok(!find(mi, 'Zwiebel') && !find(mi, 'Kartoffeln festkochend'), 'Zwiebeln/Kartoffeln nicht am Mittwoch')
// lange Haltbares bleibt am Samstag – und deckt auch Sa 28. mit ab
ok(!!find(sa, 'Zwiebel') && !!all(sa2, 'Zwiebel') && !find(sa2, 'Zwiebel'), 'Zwiebel-Netz vom Sa 21. reicht bis So 29. (Sa 28.: „schon im Vorrat“)')
// nichts doppelt: Bedarf aller Einkäufe zusammen = Bedarf aller Gerichte
{
  const need = new Map<string, number>()
  for (const e of Object.values(plan)) for (const n of needsOf(RECIPE_BY_ID[e!.recipeId], e!.servings)) need.set(n.name, (need.get(n.name) ?? 0) + n.amount)
  const got = new Map<string, number>()
  for (const t of trips) for (const b of [...t.buy, ...t.covered]) if (b.required > 0) got.set(b.name, (got.get(b.name) ?? 0) + b.required)
  const diff = [...need].filter(([n, a]) => Math.abs((got.get(n) ?? 0) - a) > 1e-6).map(([n]) => n)
  ok(!diff.length, `jeder Bedarf genau einmal (Summe der Einkäufe = Summe der Gerichte)${diff.length ? ': ' + diff.join(', ') : ''}`)
  // Mengen reichen: je Einkauf und Zutat gekauft + Vorrat (auch austauschbarer, z. B. Bandnudeln für Penne) ≥ Bedarf
  const short = trips.flatMap((t) => [...t.buy, ...t.covered].filter((b) => b.packs * b.product.pack + b.fromPantry < b.required - 1e-6).map((b) => `${t.date} ${b.name}`))
  ok(!short.length, `alles gedeckt (gekauft + Vorrat ≥ Bedarf)${short.length ? ': ' + short.join(', ') : ''}`)
}
// Vorrat wird reserviert: 3 Zwiebeln, 200 ml Sahne, Bandnudeln
ok(all(sa, 'Zwiebel')!.fromPantry === 3 && all(sa, 'Bandnudeln')!.fromPantry === 250 && !find(sa, 'Bandnudeln'), 'Vorrat zuerst: 3 Zwiebeln, 250 g Bandnudeln aus dem Vorrat')
ok(!find(sa, 'Penne') && all(sa, 'Penne')!.substitutes[0]?.name === 'Bandnudeln', 'Penne: Rest-Bandnudeln aus dem Vorrat statt kaufen')
ok(all(sa, 'Sahne')!.fromPantry === 200, '200 ml Sahne aus dem Vorrat')
ok((all(sa2, 'Sahne')?.fromPantry ?? 0) <= all(sa, 'Sahne')!.leftover + 1e-6, `Sa 28. nutzt nur, was vom Sa 21. übrig bleibt (${all(sa2, 'Sahne')?.fromPantry ?? 0} ≤ ${all(sa, 'Sahne')!.leftover} ml)`)
// Frische-Regel
ok(keepDays(1) === 1 && keepDays(4) === 4 && keepDays(5) === 4 && keepDays(30) === 28, 'Sicherheitsabstand: ab 5 Tagen 1, ab 10 Tagen 2 Tage')

// ───── 2) Abhaken: Samstag gekauft → spätere Einkäufe zählen damit ─────
{
  const z = find(sa, 'Zwiebel')!
  const l = { id: 'zw', name: 'Zwiebel', amount: z.packs * z.product.pack, unit: 'Stk', expires: '2026-12-21' }
  const s2 = { ...s, pantry: [...s.pantry, l], bought: { [tripKey('2026-11-21')]: { Zwiebel: { lotId: 'zw', amount: l.amount, at: '2026-11-21' } } } }
  const t2 = tripsOf(s2, '2026-11-21')
  ok(isBought(find(t2[0], 'Zwiebel')!), 'abgehakt: bleibt auf Sa 21. als gekauft stehen')
  ok(!find(t2.find((t) => t.date === '2026-11-28'), 'Zwiebel'), '… und Sa 28. braucht keine Zwiebeln')
  ok(JSON.stringify(find(t2.find((t) => t.date === '2026-11-25'), 'Lachsfilet')?.days) === '["2026-11-26"]', 'Mittwoch unverändert')
  // Sonntag: Sa-Einkauf liegt hinter uns, abgehakte Ware ist einfach Vorrat
  const t3 = tripsOf(s2, '2026-11-22')
  ok(!t3.some((t) => t.date === '2026-11-21') && !t3.some((t) => find(t, 'Zwiebel')), 'So 22.: Samstag vorbei, Zwiebeln sind Vorrat')
}

// ───── 3) „Heute noch“: Abendessen heute, Zutat fehlt ─────
{
  const s3 = base({ plan: { ...plan, '2026-11-20': { recipeId: 'lachs-senf-dill', servings: 2 } } })
  const t = tripsOf(s3, TODAY)
  const now = t[0]
  ok(now.kind === 'now' && now.date === TODAY && !!find(now, 'Lachsfilet'), '„Heute noch“: Lachs für heute Abend')
  ok(JSON.stringify(find(now, 'Lachsfilet')!.forDays) === '["2026-11-20"]' && t[1].date === '2026-11-21', '… „für Fr“, danach Einkauf Sa 21.11.')
  ok(!isReleased({}, now, TODAY) && isReleased({ '2026-11-14': { released: 1 } }, now, TODAY), '„Heute noch“ automatisch freigegeben, wenn der letzte Einkauf freigegeben war')
}

// ───── 4) Freigabe → Home Assistant ─────
{
  ok(haTripItems(trips, s.trips, TODAY).length === 0 && haLocalFor(s, TODAY).length === 0, 'Entwurf: nichts geht an Google Tasks')
  const rel = releaseTrip(s.trips, sa!, 1000)
  const items = haTripItems(trips, rel, TODAY)
  ok(items.length === sa!.buy.length && items.every((i) => i.key.startsWith('2026-11-21|') && / \(Sa\)$/.test(i.summary)), `freigegeben: ${items.length} Artikel des Sa-Einkaufs mit „(Sa)“`)
  ok(!items.some((i) => i.key.startsWith('2026-11-25|')), 'Mittwoch (Entwurf) bleibt draußen')
  ok(findHaItem(trips, '2026-11-21|Zwiebel')?.item.name === 'Zwiebel', 'in HA abgehakt → Artikel wird gefunden')
  // später geplant: neues Gericht → automatisch dabei, als „neu seit Freigabe“ markiert
  const s4 = { ...s, trips: rel, plan: { ...plan, '2026-11-23': { recipeId: 'carbonara', servings: 2 } } }
  const t4 = tripsOf(s4, TODAY)
  const fresh = newSinceRelease(t4[0], rel['2026-11-21'])
  ok(fresh.size > 0 && [...fresh].every((k) => haTripItems(t4, rel, TODAY).some((i) => i.key === `2026-11-21|${k}`)), `neu seit Freigabe (${[...fresh].join(', ')}) → automatisch an HA`)
  ok(!isReleased(unreleaseTrip(rel, '2026-11-21'), sa!, TODAY), 'Freigabe zurücknehmen')
}

// ───── 5) Liste prüfen: „Habe ich“ → Vorrat + Lernen ─────
{
  const q = reviewQueue(sa!, {})
  const pos = (n: string) => q.findIndex((b) => b.name === n)
  ok(pos('Zwiebel') >= 0 && pos('Zwiebel') < pos('Hackfleisch gemischt') && pos('Kartoffeln festkochend') < pos('Lachsfilet'), 'Prüfen: Zwiebeln/Kartoffeln vor Hack/Lachs')
  const z = find(sa, 'Zwiebel')!
  ok(haveAmount(z) === Math.max(z.required - z.fromPantry, z.product.pack), `„Habe ich“: lange Haltbares mind. 1 Packung (${haveAmount(z)} Stk)`)
  const st = { ...s, trips: answerTrip(s.trips, sa!.date, z.key, 'have'), pantry: [...s.pantry, haveLot(z, haveAmount(z), TODAY, 'have1')] }
  const t5 = tripsOf(st, TODAY)
  ok(!find(t5[0], 'Zwiebel') && !!t5[0].covered.find((b) => b.name === 'Zwiebel'), '„Habe ich“: Zwiebel verschwindet von der Liste (jetzt Vorrat)')
  ok(st.pantry.find((l) => l.id === 'have1')!.expires >= '2026-11-27', 'Vorratsposten hält mindestens bis zum letzten Kochtag')
  ok(haveCounts(st.trips).Zwiebel === 1 && !stockSuggestion('Zwiebel', st.trips, {}), 'einmal „Habe ich“ → noch kein Vorschlag')
  ok(!reviewQueue(t5[0], st.trips).some((b) => b.key === 'Zwiebel'), 'beantwortet → nicht noch einmal gefragt')
  // drei Einkäufe hintereinander „Habe ich“ → zuerst fragen + „im Vorrat führen?“
  let tr = st.trips
  tr = answerTrip(tr, '2026-11-07', 'Paprika rot', 'have')
  tr = answerTrip(tr, '2026-11-14', 'Paprika rot', 'have')
  tr = answerTrip(tr, '2026-10-31', 'Paprika rot', 'have')
  ok(reviewQueue(sa!, tr)[0].name === 'Paprika rot', 'gelernt: oft „Habe ich“ → wird zuerst gefragt')
  tr = answerTrip(tr, '2026-10-31', 'Zwiebel', 'have')
  tr = answerTrip(tr, '2026-11-14', 'Zwiebel', 'have')
  ok(haveCounts(tr).Zwiebel === 3 && stockSuggestion('Zwiebel', tr, {}), 'ab 3× „Habe ich“: „Zwiebel hast du meist da – im Vorrat führen?“')
  ok(!stockSuggestion('Zwiebel', tr, { Zwiebel: 'no' }), '… nur einmal fragen')
}

// ───── 6) Einkaufstag lernen ─────
{
  const fri = { lotId: 'a', amount: 1 }
  const bought = {
    [tripKey('2026-10-31')]: { A: { ...fri, at: '2026-10-30' }, B: { ...fri, at: '2026-10-30' } },
    [tripKey('2026-11-07')]: { A: { ...fri, at: '2026-11-06' } },
    '2026-11-16': { C: { ...fri, at: '2026-11-13' } },
    [tripKey('2026-11-14')]: { D: { ...fri, at: '2026-11-14' } },
  }
  ok(learnedShopDay(bought, TODAY) === 5, 'gelernt: meist freitags (3 von 4 Einkaufstagen)')
  ok(learnedShopDay({ x: { A: { ...fri, at: '2026-11-13' } } }, TODAY) === undefined, 'zu wenig Einkäufe → nichts gelernt')
  ok(shopDaySuggestion({ bought }, TODAY) === 5 && shopDaySuggestion({ bought, shopDayAsked: 5 }, TODAY) === undefined && shopDaySuggestion({ bought, shopDay: 5 }, TODAY) === undefined, '„Einkauf meist freitags – übernehmen?“ einmal, nicht nach Antwort')
  const tf = tripsOf(base({ shopDay: 5 }), TODAY)
  ok(tf[0].date === TODAY && tf[0].kind === 'main' && tf.some((t) => t.date === '2026-11-24' && t.kind === 'extra'), 'Einkaufstag Fr: Einkauf heute, Zusatz am Di')
}

// ───── 7) Erinnerung am Vorabend – nur für Entwürfe ─────
{
  const at = (s: string) => new Date(s.replace(' ', 'T'))
  const inp = { breakfastPicks: {}, weighIns: [], hasProfile: false, pantry: [] }
  const r = plannedReminders({ ...inp, trips: tripReminderInput(trips, {}, TODAY) }, at('2026-11-20 12:00:00')).find((x) => x.key === 'rem:shop:2026-11-20')
  ok(!!r && r.start === '2026-11-20 19:00:00' && r.summary === '🛒 Einkaufsliste für morgen prüfen und freigeben', 'Fr 19:00: „Einkaufsliste für morgen prüfen und freigeben“')
  const rel = releaseTrip({}, sa!, 1)
  ok(!plannedReminders({ ...inp, trips: tripReminderInput(trips, rel, TODAY) }, at('2026-11-20 12:00:00')).some((x) => x.key.startsWith('rem:shop')), 'schon freigegeben → keine Erinnerung')
  ok(!plannedReminders({ ...inp, trips: tripReminderInput(trips, {}, TODAY) }, at('2026-11-19 12:00:00')).some((x) => x.key.startsWith('rem:shop')), 'nicht schon am Donnerstag für Samstag')
  ok(!!plannedReminders({ ...inp, trips: tripReminderInput(trips, {}, '2026-11-24') }, at('2026-11-24 10:00:00')).find((x) => x.key === 'rem:shop:2026-11-24'), 'Di 19:00 für den Mittwoch-Einkauf')
}

// ───── 8) Familien-Abgleich: Freigabe und Antworten wandern mit ─────
{
  const st: AppState = { ...s, shopDay: 5, trips: answerTrip(releaseTrip({}, sa!, 5000), '2026-11-21', 'Zwiebel', 'have') }
  const vals = extract(st)
  ok(!!vals['trip:2026-11-21'] && vals['ans:2026-11-21|Zwiebel'] === 'have' && vals['shop:day'] === 5, 'geteilt: trip:<Tag>, ans:<Tag>|<Artikel>, shop:day')
  const other = rebuild(sanitize({}), vals, new Set(['trip', 'ans', 'shop']))
  const back = sanitize(JSON.parse(JSON.stringify(other)))
  ok(back.trips['2026-11-21'].released === 5000 && back.trips['2026-11-21'].answers?.Zwiebel === 'have' && back.shopDay === 5, 'anderes Gerät baut denselben Stand (Freigabe, Habe ich, Einkaufstag)')
  ok(JSON.stringify(back.trips['2026-11-21'].sent) === JSON.stringify(sa!.buy.map((b) => b.key)), '… inklusive „bei Freigabe auf der Liste“')
}

// ───── 9) Alte Wochenlisten und Datenprüfung ─────
{
  // vor dem Update auf der Liste „KW 48“ (Montag 23.11.) abgehakt → zählt zum Einkauf Sa 21.11.
  const old = base({ pantry: [...pantry0, { id: 'w1', name: 'Paprika rot', amount: 4, unit: 'Stk', expires: '2026-11-27' }], bought: { '2026-11-23': { 'Paprika rot': { lotId: 'w1', amount: 4 } } }, checked: { '2026-11-23': ['Paprika rot'] } })
  const t = tripsOf(old, TODAY)
  ok(t[0].legacyKey === '2026-11-23' && isBought(find(t[0], 'Paprika rot')!), 'alte Wochenliste KW 48: Haken erscheinen beim Einkauf Sa 21.11.')
  ok(!find(t.find((x) => x.date === '2026-11-25'), 'Paprika rot') && !find(t.find((x) => x.date === '2026-11-28'), 'Paprika rot'), '… und nicht noch einmal auf späteren Einkäufen')
  ok(boughtOfWeek({ '2026-11-16': { A: { lotId: 'a', amount: 1 } }, [tripKey('2026-11-21')]: { B: { lotId: 'b', amount: 2 } }, [tripKey('2026-11-25')]: { C: { lotId: 'c', amount: 3 } } }, ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22']).B?.amount === 2, 'Wochenrückblick: Ausgaben der Einkäufe dieser Woche')
  const x = sanitize({ trips: { '2026-11-21': { released: 5, sent: ['A', 3], answers: { A: 'have', B: 'vielleicht' } }, kaputt: { released: 1 }, '2026-11-22': 'x' }, shopDay: 9, shopDayAsked: 5, stockAsk: { Zwiebel: 'yes', X: 'egal' }, bought: { [tripKey('2026-11-21')]: { A: { lotId: 'a', amount: 1, at: 'gestern' }, B: { lotId: 'b', amount: 1, at: '2026-11-21' } } } })
  ok(JSON.stringify(x.trips) === '{"2026-11-21":{"released":5,"sent":["A"],"answers":{"A":"have"}}}', 'Prüfen: kaputte Einkaufs-Stände verworfen')
  ok(x.shopDay === undefined && x.shopDayAsked === 5 && JSON.stringify(x.stockAsk) === '{"Zwiebel":"yes"}', 'Prüfen: Einkaufstag 0–6, Antworten ja/nein')
  ok(!('at' in x.bought[tripKey('2026-11-21')].A) && x.bought[tripKey('2026-11-21')].B.at === '2026-11-21', 'Prüfen: Abhak-Tag nur als Datum')
}

// ───── 10) Home Assistant: Entwurf nicht senden, Freigabe senden, Nachträge automatisch ─────
{
  type Todo = RemoteTodo & { description: string }
  const lists: Record<string, Todo[]> = {}
  let next = 1
  const api: HaApi = {
    async command<T>(msg: Record<string, unknown>): Promise<T> {
      if (msg.type === 'todo/item/list') return { items: (lists[String(msg.entity_id)] ??= []).map((i) => ({ ...i })) } as T
      throw new HaError('unsupported', 'x')
    },
    async callService(domain: string, service: string, data: Record<string, unknown> = {}, target?: Record<string, unknown>) {
      if (domain !== 'todo') return null
      const items = (lists[String(target?.entity_id)] ??= [])
      if (service === 'add_item') items.push({ uid: 'u' + next++, summary: String(data.item), status: 'needs_action', description: String(data.description ?? '') })
      else if (service === 'update_item') {
        const it = items.find((i) => i.uid === data.item)!
        if (data.rename !== undefined) it.summary = String(data.rename)
        if (data.status !== undefined) it.status = data.status as Todo['status']
      } else if (service === 'remove_item') lists[String(target?.entity_id)] = items.filter((i) => i.uid !== data.item)
      return null
    },
    async subscribe(_m: Record<string, unknown>, cb: (e: unknown) => void) {
      setTimeout(() => cb({ events: [] }), 0)
      return () => {}
    },
  }
  let cur: AppState = base({ ha: { ...newHa('https://x', 'tok'), enabled: true } })
  const bought: string[] = []
  const round = () => haRound({ api, getState: () => cur, setState: (fn) => (cur = fn(cur)), onBought: (k) => bought.push(...k), now: new Date('2026-11-20T18:00:00') })
  const shop = () => lists['todo.einkaufen'] ?? []
  await round()
  ok(shop().length === 0, 'HA: Entwurf → Google Tasks bleibt leer')
  cur = { ...cur, trips: releaseTrip(cur.trips, tripsOf(cur, TODAY)[0], 1) }
  await round()
  const n1 = shop().length
  ok(n1 === sa!.buy.length && shop().every((i) => / \(Sa\)$/.test(i.summary)), `HA: freigegeben → ${n1} Artikel „… (Sa)“ in Google Tasks`)
  ok(!shop().some((i) => /Lachsfilet.*\(Mi\)/.test(i.summary)), 'HA: Mittwoch (Entwurf) nicht dabei')
  cur = { ...cur, plan: { ...cur.plan, '2026-11-23': { recipeId: 'carbonara', servings: 2 } } }
  await round()
  ok(shop().length > n1 - 3 && shop().some((i) => /Guanciale|Pecorino|Spaghetti/.test(i.summary)), `HA: später geplant (Carbonara) → automatisch ergänzt (${shop().length} Artikel)`)
  const hit = shop().find((i) => i.summary.startsWith('Zwiebel'))!
  hit.status = 'completed'
  await round()
  ok(bought.includes('2026-11-21|Zwiebel'), 'HA: in Google Tasks abgehakt → Yami bekommt „2026-11-21|Zwiebel“')
}

console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
if (fails) process.exit(1)
