// Tests: Familien-Abgleich über eine HA-To-do-Liste – zwei simulierte Geräte (Marc, Lisa) mit Attrappen-HA
//   npx vite-node scripts/test-sync.ts
import { RECIPES } from '../src/data/recipes'
import { type AppState, newHa, sanitize } from '../src/store'
import { type HaApi, type RemoteTodo } from '../src/haSync'
import { HaError } from '../src/homeassistant'
import { CHUNK, PREFIX, applyRound, extract, familySync, hashOf, leaseDecision, parseRemote, plannedBy, syncRound, syncStatusText } from '../src/sync'
import { haRound } from '../src/haRun'
import { settleDue } from '../src/app/upkeep'
import { cookDue, allNeedsOf } from '../src/kitchen'
import { buildModel, dishValue, householdPreference, portionFactor } from '../src/learning'
import { backupBody, parseBackup } from '../src/backup'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

// ───── Attrappe: HA mit To-do-Listen (Sync-Liste, Google Tasks „Einkaufen“) und Kalendern ─────
type Todo = RemoteTodo & { description: string }
class FakeHa {
  lists: Record<string, Todo[]> = {}
  events: Record<string, { uid: string; summary: string; start: string }[]> = {}
  next = 1
  offline = false
  calls = 0
  get items(): Todo[] { return (this.lists['todo.yami_sync'] ??= []) }
  set items(v: Todo[]) { this.lists['todo.yami_sync'] = v }
  api(): HaApi {
    const self = this
    const list = (e: unknown) => (self.lists[String(e ?? 'todo.yami_sync')] ??= [])
    return {
      async command<T>(msg: Record<string, unknown>): Promise<T> {
        if (self.offline) throw new HaError('network', 'offline')
        if (msg.type === 'todo/item/list') return { items: list(msg.entity_id).map((i) => ({ ...i })) } as T
        if (msg.type === 'calendar/event/delete') {
          const cal = (self.events[String(msg.entity_id)] ??= [])
          self.events[String(msg.entity_id)] = cal.filter((e) => e.uid !== msg.uid)
          self.calls++
          return null as T
        }
        throw new HaError('unsupported', 'x')
      },
      async callService(domain: string, service: string, data: Record<string, unknown> = {}, target?: Record<string, unknown>) {
        if (self.offline) throw new HaError('network', 'offline')
        self.calls++
        const entity = String(target?.entity_id ?? 'todo.yami_sync')
        if (domain === 'calendar' && service === 'create_event') {
          ;(self.events[entity] ??= []).push({ uid: 'e' + self.next++, summary: String(data.summary), start: String(data.start_date_time).replace(' ', 'T') })
          return null
        }
        if (domain !== 'todo') throw new HaError('failed', 'x')
        const items = list(entity)
        if (service === 'add_item') items.push({ uid: 'u' + self.next++, summary: String(data.item), status: 'needs_action', description: String(data.description ?? '') })
        else if (service === 'update_item') {
          const it = items.find((i) => i.uid === data.item)
          if (!it) throw new HaError('failed', 'not found')
          if (data.description !== undefined) it.description = String(data.description)
          if (data.rename !== undefined) it.summary = String(data.rename)
          if (data.status !== undefined) it.status = data.status as Todo['status']
        } else if (service === 'remove_item') self.lists[entity] = items.filter((i) => i.uid !== data.item)
        return null
      },
      async subscribe(msg: Record<string, unknown>, cb: (e: unknown) => void) {
        if (msg.type === 'calendar/event/subscribe') {
          const evs = (self.events[String(msg.entity_id)] ??= []).map((e) => ({ ...e }))
          setTimeout(() => cb({ events: evs }), 0)
        }
        return () => {}
      },
    }
  }
}

const dinners = RECIPES.filter((r) => r.meal === 'dinner' && !r.basic)
const [A, B, C, D] = dinners
const ha = (me: string) => ({ ...newHa('https://x.ui.nabu.casa', 'tok'), enabled: true, share: true, me })
const dev = (me: string, extra: Partial<AppState> = {}) => sanitize({ ...extra, ha: ha(me) })

let clock = Date.parse('2026-11-15T10:00:00')
const tick = (ms = 1000) => (clock += ms)
const TODAY = '2026-11-15'

async function sync(hass: FakeHa, s: AppState, today = TODAY): Promise<AppState> {
  tick()
  const { res } = await familySync(hass.api(), 'todo.yami_sync', s, s.ha!.me!, new Date(clock), today)
  return applyRound(s, res).state
}

// ───── 1) Erstes Gerät, dann Beitritt ─────
const hass = new FakeHa()
let marc = dev('Marc', {
  plan: { '2026-11-16': { recipeId: A.id, servings: 2 }, '2026-11-19': { recipeId: B.id, servings: 2 } },
  pantry: [{ id: 'l1', name: 'Zwiebel', amount: 5, unit: 'Stk', expires: '2026-12-30' }, { id: 'l2', name: 'Ei', amount: 10, unit: 'Stk', expires: '2026-12-30' }],
  onboarding: 'done',
})
marc = await sync(hass, marc)
ok(hass.items.some((i) => i.summary === PREFIX + 'kitchen'), 'Marc: Küchen-Dokument angelegt')
ok(marc.sync?.joined === true && Object.keys(marc.sync.base).length > 0, 'Marc: Abgleich-Stand gespeichert')
let lisa = dev('Lisa', { plan: { '2026-11-19': { recipeId: C.id, servings: 2 } }, onboardingListSeen: false })
ok(!lisa.onboarding, 'Lisa frisch: Start-Checkliste läuft')
lisa = await sync(hass, lisa)
ok(lisa.plan['2026-11-16']?.recipeId === A.id && lisa.pantry.length === 2, 'Lisa: übernimmt Plan und Vorrat des Haushalts')
ok(lisa.plan['2026-11-19']?.recipeId === B.id, 'Lisa: beim Beitritt gewinnt der Haushalt (ihr alter Do-Eintrag überschreibt nichts)')
ok(lisa.onboarding === 'done', 'Lisa: Beitritt → keine Start-Checkliste')
ok(lisa.sync!.notices.length === 0, 'Beitritt: keine Hinweise-Flut')
marc = await sync(hass, marc)
ok(marc.plan['2026-11-19']?.recipeId === B.id, 'Marc: Do bleibt sein Gericht')
ok(syncStatusText(marc.sync, 'Marc', clock + 61_000).includes('mit Lisa') && syncStatusText(marc.sync, 'Marc', clock + 61_000).includes('vor 1 Min.'), `Status: ${syncStatusText(marc.sync, 'Marc', clock + 61_000)}`)

// ───── 2) Lisa plant Dienstag → Marc sieht „von Lisa“ ─────
lisa = { ...lisa, plan: { ...lisa.plan, '2026-11-17': { recipeId: C.id, servings: 2 } } }
lisa = await sync(hass, lisa)
marc = await sync(hass, marc)
ok(marc.plan['2026-11-17']?.recipeId === C.id, 'Marc: sieht Lisas Dienstag')
ok(plannedBy(marc, '2026-11-17') === 'Lisa' && plannedBy(marc, '2026-11-16') === undefined, 'Marc: Dienstag „von Lisa“, eigener Montag ohne Marker')
ok(plannedBy(lisa, '2026-11-17') === undefined, 'Lisa: ihr eigener Eintrag ohne Marker')
ok(marc.sync!.notices.some((n) => n.text === `Lisa hat Dienstag geplant: ${C.title}`), 'Marc: Hinweis „Lisa hat Dienstag geplant“')

// ───── 3) Gleichzeitig geändert → letzte Änderung gewinnt + Hinweis mit Rückgängig ─────
marc = { ...marc, plan: { ...marc.plan, '2026-11-16': { recipeId: B.id, servings: 2 } } }
tick()
lisa = { ...lisa, plan: { ...lisa.plan, '2026-11-16': { recipeId: D.id, servings: 2 } } }
marc = await sync(hass, marc) // Marc zuerst (älter gestempelt? nein: Stempel beim Abgleich) …
tick(5000)
lisa = await sync(hass, lisa) // … Lisa danach → ihre Änderung ist die spätere
marc = await sync(hass, marc)
ok(marc.plan['2026-11-16']?.recipeId === D.id && lisa.plan['2026-11-16']?.recipeId === D.id, 'Konflikt: beide haben Lisas spätere Änderung')
const note = marc.sync!.notices.find((n) => n.text.startsWith('Lisa hat Montag geändert'))
ok(!!note && note.text === `Lisa hat Montag geändert: ${B.title} → ${D.title}` && (note.undo?.value as { recipeId: string }).recipeId === B.id, `Marc: Hinweis „${note?.text}“ mit Rückgängig`)
// Rückgängig = Marc setzt seinen Wert wieder → gewinnt
marc = { ...marc, plan: { ...marc.plan, '2026-11-16': note!.undo!.value as AppState['plan'][string] } }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
ok(lisa.plan['2026-11-16']?.recipeId === B.id, 'Rückgängig: Marcs Gericht wieder bei beiden')
ok(lisa.sync!.notices.some((n) => n.text.startsWith('Marc hat Montag geändert')), 'Lisa: bekommt ihrerseits den Hinweis')

// ───── 4) Löschen wandert mit (Grabstein) ─────
const { ['2026-11-19']: _gone, ...rest } = marc.plan
marc = { ...marc, plan: rest }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
ok(!lisa.plan['2026-11-19'], 'Grabstein: Marc leert Donnerstag → bei Lisa auch leer')
ok(marc.sync!.base['plan:2026-11-19']?.d === 1, 'Grabstein im Abgleich-Stand')
lisa = await sync(hass, lisa)
ok(!lisa.plan['2026-11-19'], 'Grabstein: kommt nicht zurück')
// nach 31 Tagen vergessen
{
  const saved = clock
  clock += 31 * 86400_000
  marc = await sync(hass, marc)
  ok(!marc.sync!.base['plan:2026-11-19'], 'Grabstein nach 30 Tagen vergessen')
  clock = saved + 10_000
}

// ───── 5) Vorrat: beide nehmen etwas (verschiedene Posten) ─────
marc = { ...marc, pantry: marc.pantry.map((l) => (l.id === 'l1' ? { ...l, amount: 4 } : l)) }
lisa = { ...lisa, pantry: lisa.pantry.map((l) => (l.id === 'l2' ? { ...l, amount: 7 } : l)) }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
marc = await sync(hass, marc)
const amt = (s: AppState, id: string) => s.pantry.find((l) => l.id === id)?.amount
ok(amt(marc, 'l1') === 4 && amt(marc, 'l2') === 7 && amt(lisa, 'l1') === 4 && amt(lisa, 'l2') === 7, 'Vorrat: Entnahmen an verschiedenen Posten kommen beide an')
// gleicher Posten: letzte Änderung gewinnt (bekannte Grenze)
marc = { ...marc, pantry: marc.pantry.map((l) => (l.id === 'l2' ? { ...l, amount: 6 } : l)) }
lisa = { ...lisa, pantry: lisa.pantry.map((l) => (l.id === 'l2' ? { ...l, amount: 5 } : l)) }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
marc = await sync(hass, marc)
ok(amt(marc, 'l2') === 5 && amt(lisa, 'l2') === 5, 'Vorrat: gleicher Posten → letzte Änderung gewinnt (beide gleich)')
// Posten verbraucht/entfernt
lisa = { ...lisa, pantry: lisa.pantry.filter((l) => l.id !== 'l1') }
lisa = await sync(hass, lisa)
marc = await sync(hass, marc)
ok(!marc.pantry.some((l) => l.id === 'l1'), 'Vorrat: entfernter Posten verschwindet auch bei Marc')

// ───── 6) Einkaufsliste: beide haken ab ─────
const W = '2026-11-16'
marc = { ...marc, checked: { [W]: ['Zwiebel'] } }
lisa = { ...lisa, checked: { [W]: ['Tomate'] }, custom: { [W]: [{ id: 'c1', name: 'Klopapier', cat: 'vorrat' }] } }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
marc = await sync(hass, marc)
ok([...marc.checked[W]].sort().join() === 'Tomate,Zwiebel' && [...lisa.checked[W]].sort().join() === 'Tomate,Zwiebel', 'Einkauf: Häkchen beider Geräte bei beiden')
ok(marc.custom[W]?.[0]?.name === 'Klopapier', 'Einkauf: eigener Artikel von Lisa bei Marc')
ok(marc.sync!.notices.some((n) => n.text === 'Lisa hat 1 Artikel auf der Einkaufsliste abgehakt'), 'Hinweis: Lisa hat abgehakt')
marc = { ...marc, checked: { [W]: ['Zwiebel'] } }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
ok(lisa.checked[W]?.join() === 'Zwiebel', 'Einkauf: Häkchen wieder entfernt → auch bei Lisa')

// ───── 7) Gekocht nur einmal abgezogen ─────
{
  const r = A
  const day = '2026-11-20'
  const next = '2026-11-21'
  const lots = allNeedsOf(r, 2).map((n, i) => ({ id: 'k' + i, name: n.name, amount: n.amount * 3, unit: 'x', expires: '2027-06-01' }))
  const h2 = new FakeHa()
  let m = dev('Marc', { plan: { [day]: { recipeId: r.id, servings: 2 } }, pantry: lots, onboarding: 'done' })
  m = await sync(h2, m, day)
  let l = dev('Lisa')
  l = await sync(h2, l, day)
  ok(l.pantry.length === lots.length, 'Kochen: Lisa hat denselben Vorrat')
  // lokaler Tageswechsel: mit Familien-Abgleich zieht useUpkeep Abendessen NICHT ab
  const local = settleDue(m, next)
  ok(local.plan[day]?.status === undefined && local.pantry === m.pantry, 'Kochen: lokaler Tageswechsel zieht mit Familien-Abgleich nicht ab')
  const solo = settleDue({ ...m, ha: undefined }, next)
  ok(solo.plan[day]?.status === 'cooked', 'Kochen: ohne Familien-Abgleich wie bisher sofort abgezogen')
  const expected = cookDue({ [day]: { recipeId: r.id, servings: 2 } }, lots, next).pantry
  const sum = (s: { pantry: { amount: number }[] }) => Math.round(s.pantry.reduce((a, x) => a + x.amount, 0) * 1000) / 1000
  // nacheinander: Marc zieht ab, Lisa liest „gekocht“
  m = await sync(h2, m, next)
  ok(m.plan[day]?.status === 'cooked' && sum(m) === sum({ pantry: expected }), 'Kochen: Marc zieht beim Abgleich einmal ab')
  l = await sync(h2, l, next)
  ok(l.plan[day]?.status === 'cooked' && sum(l) === sum({ pantry: expected }), 'Kochen: Lisa übernimmt „gekocht“ und zieht NICHT noch einmal ab')
  m = await sync(h2, m, next)
  ok(sum(m) === sum({ pantry: expected }), 'Kochen: nach erneutem Abgleich weiter nur einmal abgezogen')

  // gleichzeitig: beide lesen denselben Stand, bevor einer schreibt
  const h3 = new FakeHa()
  let m3 = dev('Marc', { plan: { [day]: { recipeId: r.id, servings: 2 } }, pantry: lots, onboarding: 'done' })
  m3 = await sync(h3, m3, day)
  let l3 = await sync(h3, dev('Lisa'), day)
  tick()
  const todos = (await h3.api().command<{ items: RemoteTodo[] }>({ type: 'todo/item/list' })).items
  const rm = syncRound({ state: m3, todos, now: clock, today: next, me: 'Marc' })
  const rl = syncRound({ state: l3, todos, now: clock + 3, today: next, me: 'Lisa' })
  // Marc schreibt zuerst, dann Lisa (auf die alten uids – beide aktualisieren denselben Eintrag)
  const { runOps } = await import('../src/sync')
  await runOps(h3.api(), 'todo.yami_sync', rm.ops)
  await runOps(h3.api(), 'todo.yami_sync', rl.ops)
  m3 = applyRound(m3, rm).state
  l3 = applyRound(l3, rl).state
  m3 = await sync(h3, m3, next)
  l3 = await sync(h3, l3, next)
  ok(sum(m3) === sum({ pantry: expected }) && sum(l3) === sum({ pantry: expected }), 'Kochen gleichzeitig: beide rechnen vom selben Stand → trotzdem nur einmal abgezogen')
  ok(hashOf(m3.pantry) === hashOf(l3.pantry) && m3.plan[day]?.status === 'cooked', 'Kochen gleichzeitig: beide Geräte gleich')
  // „Fertig gekocht“ auf Lisas Gerät (heute) → Marc zieht morgen nicht nochmal ab
  const today2 = '2026-11-22'
  const lotsB = allNeedsOf(B, 2).map((n, i) => ({ id: 'b' + i, name: n.name, amount: n.amount * 2, unit: 'x', expires: '2027-06-01' }))
  l3 = { ...l3, pantry: [...l3.pantry, ...lotsB] }
  l3 = await sync(h3, l3, today2)
  m3 = await sync(h3, m3, today2)
  const { cookNow } = await import('../src/kitchen')
  const c = cookNow(l3.plan, l3.pantry, today2, { recipeId: B.id, servings: 2 })
  l3 = { ...l3, plan: c.plan, pantry: c.pantry }
  const after = sum(l3)
  l3 = await sync(h3, l3, today2)
  m3 = await sync(h3, m3, '2026-11-23')
  l3 = await sync(h3, l3, '2026-11-23')
  ok(sum(m3) === after && sum(l3) === after, 'Fertig gekocht bei Lisa → Marc zieht am nächsten Tag nicht nochmal ab')
}

// ───── 8) Bewertungen pro Person, gemeinsame Vorliebe ─────
marc = { ...marc, ratings: { ...marc.ratings, '2026-11-16': 'up' }, rejects: [...marc.rejects, { id: C.id, date: TODAY }] }
lisa = { ...lisa, ratings: { ...lisa.ratings, '2026-11-16': 'down' }, portionFeedback: { '2026-11-14': -1, '2026-11-15': -1 } }
marc = await sync(hass, marc)
lisa = await sync(hass, lisa)
marc = await sync(hass, marc)
ok(marc.ratings['2026-11-16'] === 'up' && marc.sync!.household.Lisa?.ratings['2026-11-16'] === 'down', 'Bewertung: Marcs eigene bleibt, Lisas steht unter Lisa')
ok(lisa.ratings['2026-11-16'] === 'down' && lisa.sync!.household.Marc?.ratings['2026-11-16'] === 'up', 'Bewertung: bei Lisa umgekehrt')
ok(lisa.sync!.household.Marc?.rejects.some((r) => r.id === C.id) && !lisa.rejects.some((r) => r.id === C.id), 'Weggewischt: pro Person')
ok(hass.items.some((i) => i.summary === PREFIX + 'person:Lisa') && hass.items.some((i) => i.summary === PREFIX + 'person:Marc'), 'Personen-Dokumente für Marc und Lisa')
ok(portionFactor([marc.portionFeedback, marc.sync!.household.Lisa.portionFeedback], TODAY) > 1, 'Portionen: Lisas „zu wenig“ zählt für den gemeinsamen Faktor')
{
  const R = dinners[10]
  const base = { plan: {}, breakfast: {}, breakfastPicks: {}, today: TODAY }
  const days = ['2026-11-01', '2026-11-05', '2026-11-09', '2026-11-12']
  const plan = Object.fromEntries(days.map((d) => [d, { recipeId: R.id, servings: 2, status: 'cooked' as const }]))
  const like = Object.fromEntries(days.map((d) => [d, 'up' as const]))
  const hate = Object.fromEntries(days.map((d) => [d, 'down' as const]))
  const mm = buildModel({ ...base, plan, rejects: [], ratings: like })
  const ll = buildModel({ ...base, plan, rejects: [], ratings: like })
  const lh = buildModel({ ...base, plan, rejects: [], ratings: hate })
  const both = householdPreference(mm, [{ name: 'Lisa', model: ll }], R)
  ok(both.reason === '❤️ mögt ihr beide', `gemeinsam: „${both.reason}“`)
  const mixed = householdPreference(mm, [{ name: 'Lisa', model: lh }], R)
  const solo = householdPreference(mm, [], R)
  ok(mixed.score < solo.score - 2 && mixed.reason === undefined, `gemeinsam: Lisa mag es nicht → deutlich weiter hinten (${solo.score.toFixed(1)} → ${mixed.score.toFixed(1)}), keine Begründung`)
  const neutral = buildModel({ ...base, plan: {}, rejects: [], ratings: {} })
  const lisaLikes = householdPreference(neutral, [{ name: 'Lisa', model: ll }], R)
  ok(lisaLikes.reason === '👍 Lisa mag das' && lisaLikes.score > 0, 'gemeinsam: „👍 Lisa mag das“')
}

// ───── 9) Große Daten: in Teile zerlegt ─────
{
  const img = 'data:image/jpeg;base64,' + 'A'.repeat(250_000)
  const rec = { id: 'my-test', title: 'Omas Rouladen', meal: 'dinner', cuisine: 'de', type: 'haupt', time: 90, servings: 2, ingredients: [{ name: 'Zwiebel', amount: 2, unit: 'Stk' }], steps: ['kochen'], image: img, created: TODAY }
  marc = sanitize({ ...marc, customRecipes: [rec] })
  ok(marc.customRecipes.length === 1, 'eigenes Rezept mit großem Foto angelegt')
  marc = await sync(hass, marc)
  const parts = hass.items.filter((i) => i.summary.startsWith(PREFIX + 'recipes#'))
  ok(parts.length >= 3 && parts.every((p) => p.description.length <= CHUNK + 40), `Rezepte-Dokument in ${parts.length} Teile zerlegt (je ≤ ~90 KB)`)
  lisa = await sync(hass, lisa)
  ok(lisa.customRecipes[0]?.image === img, 'Lisa: Rezept mit Foto vollständig angekommen')
  lisa = { ...lisa, plan: { ...lisa.plan, '2026-11-24': { recipeId: 'my-test', servings: 2 } } }
  lisa = await sync(hass, lisa)
  marc = await sync(hass, marc)
  ok(marc.plan['2026-11-24']?.recipeId === 'my-test', 'eigenes Rezept geplant → bei Marc')
  // halb geschrieben (ein Teil fehlt / anderer Stand) → überspringen, nichts löschen
  const saved = hass.items.map((i) => ({ ...i }))
  hass.items = hass.items.filter((i) => i.summary !== PREFIX + 'recipes#1')
  const r = parseRemote(hass.items)
  ok(r.partial.has('recipes') && !r.docs.has('recipes'), 'unvollständige Teile erkannt')
  lisa = await sync(hass, lisa)
  ok(lisa.customRecipes.length === 1, 'unvollständige Teile: Lisas Rezepte bleiben')
  ok(!hass.items.some((i) => i.summary.startsWith(PREFIX + 'recipes#1')), 'unvollständige Teile: nicht überschrieben')
  hass.items = saved
  // kleiner geworden → wieder ein Eintrag, Teile entfernt
  marc = { ...marc, customRecipes: marc.customRecipes.map((x) => ({ ...x, image: undefined })) }
  marc = await sync(hass, marc)
  ok(hass.items.filter((i) => i.summary.startsWith(PREFIX + 'recipes')).length === 1, 'kleiner geworden: Teile durch einen Eintrag ersetzt')
}

// ───── 10) Offline, später zusammenführen ─────
{
  hass.offline = true
  lisa = { ...lisa, plan: { ...lisa.plan, '2026-11-25': { recipeId: A.id, servings: 3 } } }
  let threw = false
  try { await sync(hass, lisa) } catch (e) { threw = e instanceof HaError && e.kind === 'network' }
  ok(threw, 'offline: Abgleich meldet Netzwerkfehler, lokaler Stand bleibt')
  ok(lisa.plan['2026-11-25']?.servings === 3, 'offline: Lisas Eintrag bleibt lokal')
  hass.offline = false
  marc = { ...marc, plan: { ...marc.plan, '2026-11-26': { recipeId: B.id, servings: 2 } } }
  marc = await sync(hass, marc)
  lisa = await sync(hass, lisa)
  marc = await sync(hass, marc)
  ok(marc.plan['2026-11-25']?.servings === 3 && lisa.plan['2026-11-26']?.recipeId === B.id, 'wieder online: beide Änderungen bei beiden')
}

// ───── 11) Alter Stand, Sicherung ─────
{
  const old = sanitize(JSON.parse(JSON.stringify({ plan: { '2026-11-16': { recipeId: A.id, servings: 2 } }, ha: { url: 'https://x', token: 't', enabled: true, todo: 'todo.einkaufen', calendar: 'calendar.familie', reminders: 'calendar.yami_erinnerungen', items: {}, events: {} } })))
  ok(old.ha!.syncList === 'todo.yami_sync' && /^[a-z0-9]{6,32}$/.test(old.ha!.device) && !old.ha!.share && !old.sync, 'alter Stand: Sync-Liste Standard, Gerätekennung erzeugt, Teilen aus')
  const again = sanitize(JSON.parse(JSON.stringify(old)))
  ok(again.ha!.device === old.ha!.device, 'Gerätekennung bleibt beim Neuladen')
  const s2 = sanitize(JSON.parse(JSON.stringify(marc)))
  ok(hashOf(extract(s2)) === hashOf(extract(marc)) && Object.keys(s2.sync!.base).length === Object.keys(marc.sync!.base).length, 'gespeicherter Abgleich-Stand übersteht Neuladen')
  const body = backupBody(marc)
  ok(!(body.state.ha as { token: string }).token && !('device' in (body.state.ha as object)), 'Sicherung: ohne Token und ohne Gerätekennung')
  const back = parseBackup(JSON.stringify(body))
  ok(back.plan['2026-11-16']?.recipeId === marc.plan['2026-11-16']?.recipeId && back.ha!.share === true, 'Sicherung: lädt wieder')
  const kaputt = sanitize({ sync: { base: { x: 5, 'plan:2026-11-16': { t: 'x' } }, notices: [null, 4], household: { Lisa: { ratings: { a: 'up', '2026-11-01': 'meh' } } } } })
  ok(!!kaputt.sync && Object.keys(kaputt.sync.base).length === 0 && kaputt.sync.notices.length === 0 && Object.keys(kaputt.sync.household.Lisa.ratings).length === 0, 'kaputter Abgleich-Stand: wird bereinigt, kein Absturz')
}

// ───── 12) Kaputte Daten von außen ─────
{
  const before = hashOf(extract(marc))
  const kitchen = hass.items.find((i) => i.summary === PREFIX + 'kitchen')!
  const good = kitchen.description
  kitchen.description = '{kaputt'
  marc = await sync(hass, marc)
  ok(hashOf(extract(marc)) === before && marc.plan['2026-11-16'], 'kaputtes JSON: Marcs Daten bleiben vollständig')
  ok(JSON.parse(hass.items.find((i) => i.summary === PREFIX + 'kitchen')!.description).items['plan:2026-11-16'], 'kaputtes JSON: mit eigenem Stand repariert')
  kitchen.description = good
  // falsche Typen in Einträgen
  const bad = JSON.parse(hass.items.find((i) => i.summary === PREFIX + 'kitchen')!.description)
  bad.items['plan:2026-11-30'] = { t: clock + 99_999, by: 'Lisa', v: { recipeId: 'gibt-es-nicht', servings: 2 } }
  bad.items['lot:zz'] = { t: clock + 99_999, by: 'Lisa', v: { name: 'Ei', amount: 'viel', unit: 'Stk', expires: 'morgen' } }
  bad.items['plan:2026-11-16'] = { t: 'gestern', by: 5, v: null }
  bad.items['quatsch'] = 7
  bad.items['rating:2026-11-16'] = { t: clock + 99_999, by: 'Lisa', v: 'down' }
  hass.items.find((i) => i.summary === PREFIX + 'kitchen')!.description = JSON.stringify(bad)
  const mPlan16 = marc.plan['2026-11-16']?.recipeId
  marc = await sync(hass, marc)
  ok(!marc.plan['2026-11-30'] && !marc.pantry.some((l) => l.id === 'zz'), 'falsche Einträge: unbekanntes Rezept / kaputter Posten verworfen')
  ok(marc.plan['2026-11-16']?.recipeId === mPlan16, 'falsche Einträge: kaputte Metadaten ändern nichts')
  ok(dishValue(marc.ratings, '2026-11-16', marc.plan['2026-11-16']?.recipeId) === 'up', 'falsche Einträge: Bewertung im falschen Dokument wird ignoriert')
  marc = await sync(hass, marc)
  ok(!JSON.parse(hass.items.find((i) => i.summary === PREFIX + 'kitchen')!.description).items['plan:2026-11-30']?.v, 'verworfener Eintrag wird beim nächsten Abgleich gelöscht')
  // gar keine Yami-Daten / fremde Einträge in der Liste
  const r = parseRemote([{ uid: 'q', summary: 'Milch', status: 'needs_action', description: null }, { uid: 'w', summary: PREFIX + 'person:X', status: 'completed', description: '[]' }])
  ok(r.docs.size === 0 && r.broken.has('person:X'), 'fremde Einträge ignoriert, kaputtes Personen-Dokument erkannt')
  // doppelte Einträge mit gleichem Titel (beide Geräte haben gleichzeitig angelegt) → zusammengeführt
  const k = hass.items.find((i) => i.summary === PREFIX + 'kitchen')!
  const extra = JSON.parse(k.description)
  extra.items['plan:2026-11-27'] = { t: clock + 1, by: 'Lisa', v: { recipeId: C.id, servings: 2 }, o: 'Lisa' }
  hass.items.push({ uid: 'dup', summary: PREFIX + 'kitchen', status: 'needs_action', description: JSON.stringify(extra) })
  marc = await sync(hass, marc)
  ok(marc.plan['2026-11-27']?.recipeId === C.id && hass.items.filter((i) => i.summary === PREFIX + 'kitchen').length === 1, 'doppelte Dokumente: zusammengeführt, Duplikat entfernt')
}

// ───── 13) Schreibstab: Lisa plant Mittwoch → Google Tasks + Kalender genau einmal ─────
{
  const h5 = new FakeHa()
  const api = h5.api()
  const day0 = '2026-11-16' // Montag
  let t = Date.parse(day0 + 'T09:00:00')
  const devices: Record<string, AppState> = {
    // Einkäufe Mo („Heute noch“) und Mi freigegeben → gehen an Google Tasks (Entwürfe nicht, siehe test-trips)
    Marc: dev('Marc', { onboarding: 'done', plan: { '2026-11-17': { recipeId: A.id, servings: 2 } }, trips: { '2026-11-16': { released: 1 }, '2026-11-18': { released: 1 } } }),
    Lisa: dev('Lisa'),
  }
  const run = async (who: string, plus = 1000) => {
    t += plus
    let r
    for (let i = 0; i < 3; i++) {
      r = await haRound({ api, getState: () => devices[who], setState: (fn) => (devices[who] = fn(devices[who])), onBought: () => {}, now: new Date(t) })
      if (!r.again) break
      t += 1000
    }
    return r!
  }
  const r1 = await run('Marc')
  ok(r1.wrote && h5.events['calendar.familie']?.length === 1, 'Stab: Marc übernimmt und pflegt Kalender (Dienstag)')
  const shop = () => (h5.lists['todo.einkaufen'] ?? []).filter((i) => i.status === 'needs_action')
  const marcItems = shop().length
  ok(marcItems > 0, `Stab: Marcs Einkaufsliste in Google Tasks (${marcItems} Artikel)`)
  await run('Lisa')
  ok(devices.Lisa.plan['2026-11-17']?.recipeId === A.id, 'Lisa: hat Marcs Dienstag')
  // Lisa plant Mittwoch (Marc hält den Stab noch → Lisa schreibt nicht)
  devices.Lisa = { ...devices.Lisa, plan: { ...devices.Lisa.plan, '2026-11-18': { recipeId: C.id, servings: 2 } } }
  const rl = await run('Lisa', 10_000)
  ok(!rl.wrote, 'Stab bei Marc: Lisas Gerät schreibt nicht gleichzeitig in Google Tasks/Kalender')
  // Marc öffnet die App → zieht Lisas Mittwoch und pflegt Liste + Kalender im selben Lauf
  const rm = await run('Marc', 10_000)
  const wed = (h5.events['calendar.familie'] ?? []).filter((e) => e.start.startsWith('2026-11-18'))
  ok(rm.wrote && wed.length === 1 && wed[0].summary === `🍽️ ${C.title}`, `Marc öffnet: Mittwoch „${C.title}“ genau einmal im Kalender`)
  const need = new Set(allNeedsOf(C, 2).map((n) => n.name))
  ok(shop().some((i) => [...need].some((n) => i.summary.startsWith(n))) && shop().length > marcItems, `Marc öffnet: Zutaten für Mittwoch in Google Tasks (${shop().length} Artikel)`)
  // Stab läuft ab (Marc 10 Min. weg) → Lisa plant Donnerstag und schreibt selbst, mit den geerbten Zuordnungen
  devices.Lisa = { ...devices.Lisa, plan: { ...devices.Lisa.plan, '2026-11-19': { recipeId: D.id, servings: 2 } } }
  const rl2 = await run('Lisa', 10 * 60_000)
  ok(rl2.wrote && (h5.events['calendar.familie'] ?? []).filter((e) => e.start.startsWith('2026-11-19')).length === 1, 'Stab abgelaufen: Lisa übernimmt, Donnerstag sofort im Kalender')
  ok(JSON.stringify(devices.Lisa.ha!.items) !== '{}' && Object.keys(devices.Lisa.ha!.events).some((k) => k === 'dinner:2026-11-18'), 'Lisa erbt die Zuordnungen (Liste + Kalender)')
  // viele weitere Läufe auf beiden Geräten → keine Duplikate
  for (let i = 0; i < 4; i++) {
    await run('Marc', 20_000)
    await run('Lisa', 20_000)
  }
  await run('Marc', 10 * 60_000)
  await run('Lisa', 10 * 60_000)
  await run('Marc', 10_000)
  const evs = h5.events['calendar.familie'] ?? []
  const perDay = new Map<string, number>()
  for (const e of evs) perDay.set(e.start.slice(0, 10), (perDay.get(e.start.slice(0, 10)) ?? 0) + 1)
  ok([...perDay.values()].every((n) => n === 1) && perDay.size === 3, `keine doppelten Kalendertermine (${[...perDay].map(([d, n]) => `${d}×${n}`).join(', ')})`)
  // je Einkauf (Zusatz „(heute)“, „(Mi)“ …) jeder Artikel höchstens einmal
  const names = shop().map((i) => i.summary.split(' – ')[0] + (i.summary.match(/\(([^)]+)\)$/)?.[1] ?? ''))
  ok(names.length === new Set(names).size, `keine doppelten Artikel in Google Tasks (${names.length})`)
  ok(h5.items.filter((i) => i.summary === PREFIX + 'main').length === 1, 'nur ein Schreibstab-Eintrag')
  // Fehler vom 25.11.: zweites Gerät (MacBook) OHNE „Familie teilen“ mit altem Plan → schreibt nichts mehr
  {
    const cal = () => h5.events['calendar.familie'] ?? []
    const before = JSON.stringify(cal())
    const shopBefore = JSON.stringify(h5.lists['todo.einkaufen'])
    let mac = sanitize({ onboarding: 'done', plan: { '2026-11-17': { recipeId: B.id, servings: 2 }, '2026-11-18': { recipeId: B.id, servings: 2 } }, trips: { '2026-11-16': { released: 1 } }, ha: { ...newHa('https://x.ui.nabu.casa', 'tok'), enabled: true } })
    const rmac = await haRound({ api, getState: () => mac, setState: (fn) => (mac = fn(mac)), onBought: () => {}, now: new Date(t + 1000) })
    ok(!rmac.wrote && JSON.stringify(cal()) === before && JSON.stringify(h5.lists['todo.einkaufen']) === shopBefore, 'MacBook ohne „Familie teilen“: Kalender und Google Tasks unberührt')
    ok(!!mac.ha!.otherShare, 'MacBook: Hinweis „auf einem anderen Gerät ist Familie teilen aktiv“')
    // ein fremder Schreiber (alter Stand) hat trotzdem Termine ersetzt → der Stab-Halter repariert beim nächsten Lauf
    const wedEv = cal().find((e) => e.start.startsWith('2026-11-18'))!
    h5.events['calendar.familie'] = [...cal().filter((e) => e !== wedEv), { uid: 'foreign', summary: `🍽️ ${B.title}`, start: '2026-11-18T18:30:00' }]
    await run('Marc', 10 * 60_000)
    await run('Lisa', 10_000)
    const wed2 = cal().filter((e) => e.start.startsWith('2026-11-18'))
    ok(wed2.length === 1 && wed2[0].summary === wedEv.summary && wed2[0].uid !== 'foreign', `Stab-Halter repariert den Kalender ohne lokale Änderung (Mittwoch wieder „${C.title}“)`)
  }
  // beide übernehmen gleichzeitig → genau einer schreibt
  const h6 = new FakeHa()
  const api6 = h6.api()
  let a6 = dev('Marc', { onboarding: 'done', plan: { '2026-11-18': { recipeId: B.id, servings: 2 } } })
  let b6 = dev('Lisa')
  const now6 = Date.parse('2026-11-16T09:00:00')
  const step = async (s: AppState, t6: number) => {
    let cur = s
    const r = await haRound({ api: api6, getState: () => cur, setState: (fn) => (cur = fn(cur)), onBought: () => {}, now: new Date(t6) })
    return { s: cur, r }
  }
  ;({ s: a6 } = await step(a6, now6))
  ;({ s: b6 } = await step(b6, now6 + 1))
  const x = await step(a6, now6 + 2000)
  const y = await step(b6, now6 + 2001)
  ok([x.r.wrote, y.r.wrote].filter(Boolean).length === 1, 'gleichzeitig übernommen: genau ein Gerät schreibt')
  ok((h6.events['calendar.familie'] ?? []).length === 1, 'gleichzeitig: Termin genau einmal')
  // leaseDecision direkt
  const rem = parseRemote([{ uid: 'm', summary: PREFIX + 'main', status: 'needs_action', description: JSON.stringify({ device: 'x', person: 'Lisa', t: 1, until: 100 }) }])
  ok(leaseDecision(rem, 'y', 50).holder === false && leaseDecision(rem, 'y', 50).claim === false, 'Stab gültig: anderes Gerät wartet')
  ok(leaseDecision(rem, 'y', 101).claim === true && leaseDecision(rem, 'x', 60).holder === true && leaseDecision(rem, 'x', 60).renew, 'Stab abgelaufen → übernehmen; eigener Stab → verlängern')
}

// ───── 13b) Erinnerungen pro Person – unabhängig vom Schreibstab ─────
{
  const h7 = new FakeHa()
  const api = h7.api()
  let t = Date.parse('2026-11-16T09:00:00') // Montag
  const devs: Record<string, AppState> = {
    // Marc: bereitet heute (Mo) sein Frühstück vor → „Meal-Prep heute“ 18:00 (persönlich); Ei läuft morgen ab → „Läuft morgen ab“ (geteilt)
    Marc: dev('Marc', { onboarding: 'done', breakfastPicks: { '2026-11-16': ['oats-apfel-zimt', 'eiermuffins-schinken'] }, prepDays: { '2026-11-16': '2026-11-16' }, pantry: [{ id: 'ex1', name: 'Ei', amount: 4, unit: 'Stk', expires: '2026-11-17' }] }),
    Lisa: dev('Lisa'),
  }
  const run = async (who: string, plus = 1000) => {
    t += plus
    for (let i = 0; i < 3; i++) {
      const r = await haRound({ api, getState: () => devs[who], setState: (fn) => (devs[who] = fn(devs[who])), onBought: () => {}, now: new Date(t) })
      if (!r.again) return r
      t += 1000
    }
  }
  const rem = () => h7.events['calendar.yami_erinnerungen'] ?? []
  await run('Marc')
  await run('Lisa', 10 * 60_000) // Stab abgelaufen → Lisa hält ihn jetzt
  ok(devs.Lisa.sync?.main?.person === 'Lisa', 'Erinnerungen: Lisa hält den Schreibstab')
  await run('Marc', 30_000) // Marc gleicht ab, ohne Stab
  const weigh = rem().filter((e) => e.summary.includes('Meal-Prep'))
  const exp = rem().filter((e) => e.summary.includes('Läuft morgen ab'))
  ok(weigh.length === 1, 'Erinnerungen: Marcs „Meal-Prep heute“ genau einmal (auch ohne Stab angelegt)')
  ok(exp.length === 1, 'Erinnerungen: „Läuft morgen ab“ (geteilter Vorrat) genau einmal')
  ok(Object.keys(devs.Lisa.ha!.events).every((k) => !k.startsWith('rem:Marc:')) && Object.keys(devs.Marc.ha!.events).some((k) => k.startsWith('rem:Marc:prep:')), 'Erinnerungen: Marcs Zuordnung nur bei Marc (nicht im Stab, nicht bei Lisa)')
  ok(!Object.keys(devs.Lisa.ha!.events).some((k) => k.startsWith('rem:Lisa:')), 'Erinnerungen: Lisa ohne Profil/Frühstück legt keine persönlichen an')
  for (let i = 0; i < 4; i++) {
    await run('Lisa', 20_000)
    await run('Marc', 20_000)
  }
  ok(rem().filter((e) => e.uid === weigh[0].uid).length === 1 && rem().filter((e) => e.summary.includes('Meal-Prep')).length === 1, 'Lisa mit Stab entfernt oder ersetzt Marcs Erinnerung nie')
  ok(rem().length === 2, `keine doppelten Erinnerungen (${rem().length})`)
  // Stab wechselt mehrfach – Ablauf-Erinnerung bleibt einmalig (Zuordnung im Stab)
  await run('Marc', 10 * 60_000)
  await run('Lisa', 10 * 60_000)
  await run('Marc', 10 * 60_000)
  ok(rem().filter((e) => e.summary.includes('Läuft morgen ab')).length === 1 && rem().filter((e) => e.summary.includes('Meal-Prep')).length === 1, 'Stabwechsel: weiterhin jede Erinnerung genau einmal')
}

// ───── 13c) Einkäufe: Freigabe, „Habe ich“, Einkaufstag wandern mit (Marc gibt frei, Lisa prüft gleichzeitig) ─────
{
  marc = await sync(hass, marc)
  lisa = await sync(hass, lisa)
  marc = { ...marc, trips: { ...marc.trips, '2026-11-21': { ...marc.trips['2026-11-21'], released: clock, sent: ['Zwiebel'] } }, shopDay: 5 }
  lisa = { ...lisa, trips: { ...lisa.trips, '2026-11-21': { ...lisa.trips['2026-11-21'], answers: { Knoblauch: 'have' } } } }
  marc = await sync(hass, marc)
  lisa = await sync(hass, lisa)
  marc = await sync(hass, marc)
  const both = (s: AppState) => !!s.trips['2026-11-21']?.released && s.trips['2026-11-21'].answers?.Knoblauch === 'have' && s.shopDay === 5
  ok(both(marc) && both(lisa), 'Einkauf: Marcs Freigabe + Lisas „Habe ich“ + Einkaufstag auf beiden Geräten')
  ok(lisa.sync!.notices.some((n) => /Marc hat den Einkauf Sa 21\.11\. freigegeben/.test(n.text)), 'Lisa sieht: „Marc hat den Einkauf Sa 21.11. freigegeben“')
  // Freigabe zurückgenommen → auf beiden Geräten Entwurf, Antworten bleiben
  lisa = { ...lisa, trips: { '2026-11-21': { answers: lisa.trips['2026-11-21'].answers } } }
  lisa = await sync(hass, lisa)
  marc = await sync(hass, marc)
  ok(!marc.trips['2026-11-21']?.released && marc.trips['2026-11-21']?.answers?.Knoblauch === 'have', 'Freigabe zurückgenommen: Marc wieder Entwurf, „Habe ich“ bleibt')
  // abgehakt auf einem Einkauf (Schlüssel trip:<Tag>) wandert wie bisher
  marc = { ...marc, bought: { ...marc.bought, 'trip:2026-11-21': { Zwiebel: { lotId: 'zz', amount: 10, at: '2026-11-21' } } } }
  marc = await sync(hass, marc)
  lisa = await sync(hass, lisa)
  ok(lisa.bought['trip:2026-11-21']?.Zwiebel?.at === '2026-11-21', 'gekauft auf Einkauf Sa 21.11. (mit Abhak-Tag) bei Lisa')
}

// ───── 14) Ruhe: ohne Änderungen wird nichts geschrieben ─────
{
  marc = await sync(hass, marc)
  lisa = await sync(hass, lisa)
  marc = await sync(hass, marc)
  const before = hass.calls
  marc = await sync(hass, marc)
  lisa = await sync(hass, lisa)
  ok(hass.calls === before, `ohne Änderungen: keine Schreibzugriffe (${hass.calls - before})`)
  ok(hashOf(extract(marc)) === hashOf(extract(lisa)) || (() => { const a = extract(marc), b = extract(lisa); const diff = Object.keys({ ...a, ...b }).filter((k) => !k.startsWith('rating') && !k.startsWith('reject') && !k.startsWith('pf') && !k.startsWith('bake') && hashOf(a[k]) !== hashOf(b[k])); console.log('  Unterschiede:', diff.slice(0, 5)); return diff.length === 0 })(), 'beide Geräte haben dieselben geteilten Daten')
}

// ───── 15) Während des Abgleichs lokal geändert → nicht überschreiben ─────
{
  const todos = (await hass.api().command<{ items: RemoteTodo[] }>({ type: 'todo/item/list' })).items
  const res = syncRound({ state: marc, todos, now: tick(), today: TODAY, me: 'Marc' })
  const edited = { ...marc, plan: { ...marc.plan, '2026-11-28': { recipeId: D.id, servings: 2 } } }
  const ap = applyRound(edited, res)
  ok(ap.stale && ap.state.plan['2026-11-28']?.recipeId === D.id, 'Änderung während des Abgleichs bleibt erhalten (neuer Abgleich folgt)')
}

// ───── Frühstück: Bewertung/Sättigung nach dem Vorbereiten – eigenes Personen-Dokument, nicht Haushalts-Abendessen ─────
{
  const h = new FakeHa()
  const key = '2026-11-15:linsen-ei-salat'
  let phone = dev('Marc', { onboarding: 'done', bfRatings: { [key]: 'up' }, bfSatiety: { [key]: -1 }, bfPreps: [{ week: '2026-11-16', recipeId: 'linsen-ei-salat', date: '2026-11-15', portions: 4, lotId: 'jar1', days: ['2026-11-16'], consumed: [] }] })
  phone = await sync(h, phone)
  const doc = h.items.find((i) => i.summary === PREFIX + 'person:Marc')
  ok(!!doc && doc.description.includes(`bfr:${key}`) && doc.description.includes(`bfs:${key}`), 'Frühstück: Bewertung & Sättigung im eigenen Personen-Dokument')
  ok(!h.items.some((i) => i.summary === PREFIX + 'kitchen' && (i.description.includes('bfr:') || i.description.includes('bfPreps'))), 'Frühstück: nichts davon im geteilten Küchen-Dokument')
  let mac = dev('Marc', { onboarding: 'done' })
  mac = await sync(h, mac)
  ok(mac.bfRatings[key] === 'up' && mac.bfSatiety[key] === -1, 'Frühstück: zweites Gerät derselben Person übernimmt Bewertung & Sättigung')
  ok(mac.bfPreps.length === 0, 'Frühstück: Vorbereitungen bleiben persönlich auf dem Gerät')
  let wife = dev('Lisa', { onboarding: 'done' })
  wife = await sync(h, wife)
  ok(Object.keys(wife.bfRatings).length === 0 && Object.keys(wife.ratings).length === 0, 'Frühstück: Lisa bekommt keine Frühstücks-Bewertung als eigene/Haushalts-Bewertung')
}

console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
if (fails) process.exit(1)
