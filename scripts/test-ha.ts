// Tests: Home-Assistant-Anbindung (WebSocket-Client, Einkaufsliste, Erinnerungen, Plan-Kalender) – ohne Netz
//   npx vite-node scripts/test-ha.ts
import { HaClient, HaError, normalizeUrl, type WsLike } from '../src/homeassistant'
import {
  type Desired, type HaApi, type LocalItem, type RemoteTodo, MARKER,
  diffDinnerEvents, diffTodo, plannedDinners, plannedReminders, syncCalendar, syncTodo, usualWeighDay,
} from '../src/haSync'
import { backupBody, parseBackup } from '../src/backup'
import { newHa, sanitize } from '../src/store'
import { RECIPES } from '../src/data/recipes'

let fails = 0
const ok = (c: boolean, m: string) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const rejects = async (p: Promise<unknown>): Promise<unknown> => { try { await p } catch (e) { return e } return null }

// ───── 1) Adresse ─────
const n = normalizeUrl
ok(n('https://abcdef.ui.nabu.casa') === 'wss://abcdef.ui.nabu.casa/api/websocket', 'URL: https → wss + /api/websocket')
ok(n('https://abcdef.ui.nabu.casa/') === 'wss://abcdef.ui.nabu.casa/api/websocket', 'URL: Schrägstrich am Ende entfernt')
ok(n('https://abcdef.ui.nabu.casa/api/') === 'wss://abcdef.ui.nabu.casa/api/websocket', 'URL: /api/ abgeschnitten')
ok(n('http://homeassistant.local:8123/api/websocket') === 'ws://homeassistant.local:8123/api/websocket', 'URL: http → ws, Port, /api/websocket')
ok(n('abcdef.ui.nabu.casa') === 'wss://abcdef.ui.nabu.casa/api/websocket', 'URL: ohne Schema → wss')
ok(n('  https://x.casa/sub/api/config ') === 'wss://x.casa/sub/api/websocket', 'URL: Unterpfad bleibt, /api… weg')
ok(n('') === null && n('ftp://x') === null, 'URL: leer/ungültig → null')

// ───── 2) Client mit Attrappen-WebSocket ─────
class FakeSocket implements WsLike {
  static all: FakeSocket[] = []
  static failOpen = false
  static handler: (m: Record<string, unknown>, s: FakeSocket) => void = () => {}
  readyState = 0
  onopen: WsLike['onopen'] = null
  onmessage: WsLike['onmessage'] = null
  onclose: WsLike['onclose'] = null
  onerror: WsLike['onerror'] = null
  sent: Record<string, unknown>[] = []
  constructor(public url: string) {
    FakeSocket.all.push(this)
    setTimeout(() => {
      if (FakeSocket.failOpen) return this.onerror?.()
      this.readyState = 1
      this.onopen?.()
      this.emit({ type: 'auth_required', ha_version: '2026.11.0' })
    }, 0)
  }
  emit(m: unknown) { this.onmessage?.({ data: JSON.stringify(m) }) }
  send(d: string) {
    const m = JSON.parse(d)
    this.sent.push(m)
    if (m.type === 'auth') this.emit(m.access_token === 'good' ? { type: 'auth_ok', ha_version: '2026.11.0' } : { type: 'auth_invalid', message: 'Invalid access token' })
    else FakeSocket.handler(m, this)
  }
  close() { this.readyState = 3 }
  serverClose() { this.readyState = 3; this.onclose?.() }
}
FakeSocket.handler = (m, s) => {
  if (m.type === 'boom') s.emit({ id: m.id, type: 'result', success: false, error: { code: 'unknown_command', message: 'Unknown command.' } })
  else if (m.type === 'fail') s.emit({ id: m.id, type: 'result', success: false, error: { code: 'not_found', message: 'Entity not found' } })
  else if (m.type === 'sub') {
    s.emit({ id: m.id, type: 'result', success: true, result: null })
    s.emit({ id: m.id, type: 'event', event: { items: [1] } })
  } else s.emit({ id: m.id, type: 'result', success: true, result: { echo: m.type, ...(m.type === 'call_service' ? { m } : {}) } })
}
const mkClient = () => new HaClient({ WebSocket: FakeSocket as never, backoff: [5, 5], connectTimeoutMs: 200, hiddenGraceMs: 30 })

{
  const c = mkClient()
  await c.connect('https://abc.ui.nabu.casa/', 'good')
  ok(FakeSocket.all.at(-1)!.url === 'wss://abc.ui.nabu.casa/api/websocket', 'Client: verbindet mit normalisierter Adresse')
  ok(c.ready && c.haVersion === '2026.11.0', 'Client: auth_ok → bereit, HA-Version bekannt')
  const sock = FakeSocket.all.at(-1)!
  ok(sock.sent[0].type === 'auth' && sock.sent[0].access_token === 'good', 'Client: sendet Token')
  const r = await c.command<{ echo: string }>({ type: 'ping' })
  ok(r.echo === 'ping' && sock.sent.at(-1)!.id === 1, 'Client: command liefert result, Zähler startet bei 1')
  await c.callService('todo', 'add_item', { item: 'x' }, { entity_id: 'todo.a' }, true)
  const cs = sock.sent.at(-1)!
  ok(cs.type === 'call_service' && cs.domain === 'todo' && cs.service === 'add_item' && cs.return_response === true && (cs.target as { entity_id: string }).entity_id === 'todo.a' && cs.id === 2, 'Client: call_service mit target und return_response')
  await c.callService('todo', 'get_items')
  ok(!('return_response' in sock.sent.at(-1)!) && !('target' in sock.sent.at(-1)!), 'Client: ohne return_response/target nicht mitgeschickt')
  const e1 = await rejects(c.command({ type: 'boom' }))
  ok(e1 instanceof HaError && e1.kind === 'unsupported', 'Client: unknown_command → unsupported')
  const e2 = await rejects(c.command({ type: 'fail' }))
  ok(e2 instanceof HaError && e2.kind === 'failed' && e2.code === 'not_found', 'Client: sonstiger HA-Fehler → failed mit code')
  // Abo: result, dann event
  const got: unknown[] = []
  const off = await c.subscribe({ type: 'sub' }, (ev) => got.push(ev))
  await sleep(5)
  ok(got.length === 1 && (got[0] as { items: number[] }).items[0] === 1, 'Client: subscribe → Event-Nachrichten mit gleicher id')
  off()
  await sleep(5)
  ok(sock.sent.at(-1)!.type === 'unsubscribe_events', 'Client: Abo beenden sendet unsubscribe_events')
  c.close()
  ok(!c.ready, 'Client: close()')
}
{
  const c = mkClient()
  const e = await rejects(c.connect('https://abc.ui.nabu.casa', 'schlecht'))
  ok(e instanceof HaError && e.kind === 'auth', 'Client: auth_invalid → Fehler "auth"')
  FakeSocket.failOpen = true
  const e2 = await rejects(mkClient().connect('https://nope.example', 'good'))
  ok(e2 instanceof HaError && e2.kind === 'network', 'Client: nicht erreichbar → Fehler "network"')
  const e3 = await rejects(mkClient().connect('', 'good'))
  ok(e3 instanceof HaError && e3.kind === 'network', 'Client: leere Adresse → network')
  FakeSocket.failOpen = false
}
{
  // Wiederverbinden mit Backoff, Abos werden erneuert
  const c = mkClient()
  await c.connect('https://abc.ui.nabu.casa', 'good')
  let events = 0
  await c.subscribe({ type: 'sub' }, () => events++)
  await sleep(5)
  const before = FakeSocket.all.length
  FakeSocket.all.at(-1)!.serverClose()
  ok(!c.ready, 'Reconnect: Verbindung weg → nicht bereit')
  await sleep(80)
  ok(FakeSocket.all.length > before && c.ready, 'Reconnect: automatisch wieder verbunden')
  ok(events >= 2, 'Reconnect: Abo wurde erneuert (weiterer Event)')
  // verborgen länger als Schonfrist → geschlossen, sichtbar → wieder offen
  c.setVisible(false)
  await sleep(60)
  ok(!c.ready, 'Sichtbarkeit: lange verborgen → Verbindung geschlossen')
  c.setVisible(true)
  await sleep(40)
  ok(c.ready, 'Sichtbarkeit: wieder sichtbar → neu verbunden')
  c.close()
  const cnt = FakeSocket.all.length
  FakeSocket.all.at(-1)!.serverClose()
  await sleep(30)
  ok(FakeSocket.all.length === cnt, 'close(): kein Wiederverbinden mehr')
}

// ───── 3) Einkaufsliste ─────
const L = (key: string, summary: string, bought = false): LocalItem => ({ key, summary, bought })
const R = (uid: string, summary: string, status: RemoteTodo['status'] = 'needs_action', description: string | null = MARKER): RemoteTodo => ({ uid, summary, status, description })

{
  const local = [L('Rinderhackfleisch', 'Rinderhackfleisch – 500 g'), L('Zwiebel', 'Zwiebel – 2 Stk', true), L('Milch', 'Milch – 2 l')]
  const remote = [
    R('u1', 'Rinderhackfleisch – 250 g'),
    R('u2', 'Zwiebel – 2 Stk'),
    R('u3', 'Käse – 1 Stk'), // Yami, nicht mehr nötig
    R('f1', 'Klopapier', 'needs_action', null), // fremd
    R('f2', 'Butter', 'needs_action', 'von Hand'), // fremd mit Beschreibung
    R('u4', 'Altes – erledigt', 'completed'), // Yami, erledigt → bleibt
  ]
  const d = diffTodo(local, remote, { Rinderhackfleisch: 'u1', Zwiebel: 'u2' })
  ok(d.add.length === 1 && d.add[0].key === 'Milch', 'Liste: fehlender Artikel wird angelegt')
  ok(d.rename.length === 1 && d.rename[0].uid === 'u1' && d.rename[0].summary === 'Rinderhackfleisch – 500 g', 'Liste: geänderte Menge → umbenennen')
  ok(d.complete.length === 1 && d.complete[0].uid === 'u2', 'Liste: in Yami abgehakt → in HA erledigen')
  ok(d.remove.length === 1 && d.remove[0].uid === 'u3', 'Liste: nicht mehr nötiger Yami-Eintrag wird entfernt – nur dieser')
  ok(![...d.remove, ...d.rename, ...d.complete].some((x) => x.uid === 'f1' || x.uid === 'f2' || x.uid === 'u4'), 'Liste: fremde und erledigte Einträge bleiben unberührt')
  ok(d.items.Zwiebel === 'u2' && d.done.includes('Zwiebel'), 'Liste: Zuordnung und "erledigt"-Merker')
  // in HA abgehakt → gekauft
  const d2 = diffTodo([L('Milch', 'Milch – 2 l')], [R('u9', 'Milch – 2 l', 'completed')], { Milch: 'u9' })
  ok(d2.bought.join() === 'Milch' && d2.add.length === 0, 'Liste: in HA abgehakt → in Yami gekauft (nicht neu angelegt)')
  // in Yami wieder abgewählt, nachdem es erledigt war → HA wieder öffnen statt "gekauft"
  const d3 = diffTodo([L('Milch', 'Milch – 2 l')], [R('u9', 'Milch – 2 l', 'completed')], { Milch: 'u9' }, ['Milch'])
  ok(d3.reopen.length === 1 && d3.bought.length === 0, 'Liste: in Yami wieder abgewählt → in HA wieder öffnen')
  // Gekauftes wird nicht neu angelegt
  ok(diffTodo([L('Milch', 'Milch – 2 l', true)], [], {}).add.length === 0, 'Liste: Gekauftes wird nicht angelegt')
  // verlorene Zuordnung: gleicher Text wird wieder erkannt
  const d4 = diffTodo([L('Milch', 'Milch – 2 l')], [R('x1', 'Milch – 2 l')], {})
  ok(d4.add.length === 0 && d4.items.Milch === 'x1', 'Liste: ohne Zuordnung über gleichen Text wiedererkannt')
}

// Attrappe einer HA-Instanz
class FakeHa implements HaApi {
  todos: (RemoteTodo & { n: number })[] = []
  events: { uid: string; summary: string; start: string }[] = []
  calls: { domain: string; service: string; data: Record<string, unknown> }[] = []
  cmds: Record<string, unknown>[] = []
  next = 1
  calSupported = true
  noDescription = false
  async command<T>(msg: Record<string, unknown>): Promise<T> {
    this.cmds.push(msg)
    if (msg.type === 'todo/item/list') return { items: this.todos.map((t) => ({ uid: t.uid, summary: t.summary, status: t.status, ...(this.noDescription ? {} : { description: t.description }) })) } as T
    if (msg.type === 'calendar/event/delete') {
      this.events = this.events.filter((e) => e.uid !== msg.uid)
      return null as T
    }
    throw new HaError('unsupported', 'unknown', 'unknown_command')
  }
  async callService(domain: string, service: string, data: Record<string, unknown> = {}) {
    this.calls.push({ domain, service, data })
    if (domain === 'todo') {
      if (service === 'add_item') {
        if (this.noDescription && 'description' in data) throw new HaError('failed', 'Description not supported')
        this.todos.push({ uid: 'u' + this.next++, summary: String(data.item), status: 'needs_action', description: (data.description as string) ?? null, n: 0 })
      } else {
        const t = this.todos.find((x) => x.uid === data.item)!
        if (service === 'update_item') {
          if (data.rename) t.summary = String(data.rename)
          if (data.status) t.status = data.status as RemoteTodo['status']
        } else if (service === 'remove_item') this.todos = this.todos.filter((x) => x !== t)
      }
    } else if (domain === 'calendar') {
      this.events.push({ uid: 'e' + this.next++, summary: String(data.summary), start: String(data.start_date_time).replace(' ', 'T') })
    }
    return null
  }
  async subscribe(msg: Record<string, unknown>, cb: (e: unknown) => void) {
    this.cmds.push(msg)
    if (!this.calSupported) throw new HaError('unsupported', 'unknown', 'unknown_command')
    setTimeout(() => cb({ events: this.events.map((e) => ({ uid: e.uid, summary: e.summary, start: e.start })) }), 0)
    return () => { this.cmds.push({ type: 'unsubscribe_events' }) }
  }
}

{
  const ha = new FakeHa()
  ha.todos.push({ uid: 'f1', summary: 'Klopapier', status: 'needs_action', description: null, n: 0 })
  ha.todos.push({ uid: 'f2', summary: 'Butter', status: 'needs_action', description: 'privat', n: 0 })
  const settings = { todo: 'todo.einkaufsliste', items: {} as Record<string, string>, done: [] as string[] }
  let bought: string[] = []
  const run = async (local: LocalItem[]) => {
    const r = await syncTodo(ha, settings, local, (k) => (bought = k))
    settings.items = r.items
    settings.done = r.done
    return r
  }
  await run([L('Hack', 'Hack – 500 g'), L('Milch', 'Milch – 2 l')])
  const mine = ha.todos.filter((t) => t.description === MARKER)
  ok(mine.length === 2 && ha.calls.find((c) => c.service === 'add_item')!.data.description === MARKER, 'Sync: legt Yami-Einträge mit Beschreibung "Yami" an')
  ok(Object.keys(settings.items).length === 2 && settings.items.Hack === mine[0].uid, 'Sync: merkt sich die uids der neuen Einträge')
  ok(ha.calls.every((c) => (c.data as { target?: unknown }).target === undefined) && ha.todos.length === 4, 'Sync: 4 Einträge in HA (2 fremde bleiben)')
  const calls = ha.calls.length
  await run([L('Hack', 'Hack – 500 g'), L('Milch', 'Milch – 2 l')])
  ok(ha.calls.length === calls, 'Sync: zweiter Lauf ohne Änderung schickt nichts')
  await run([L('Hack', 'Hack – 750 g'), L('Milch', 'Milch – 2 l', true)])
  ok(ha.todos.find((t) => t.uid === settings.items.Hack)!.summary === 'Hack – 750 g', 'Sync: Menge geändert → umbenannt')
  ok(ha.todos.find((t) => t.uid === settings.items.Milch)!.status === 'completed', 'Sync: in Yami abgehakt → in HA erledigt')
  await run([L('Hack', 'Hack – 750 g'), L('Milch', 'Milch – 2 l')])
  ok(ha.todos.find((t) => t.uid === settings.items.Milch)!.status === 'needs_action', 'Sync: in Yami wieder abgewählt → in HA wieder offen')
  // in HA abgehakt
  ha.todos.find((t) => t.uid === settings.items.Hack)!.status = 'completed'
  await run([L('Hack', 'Hack – 750 g'), L('Milch', 'Milch – 2 l')])
  ok(bought.join() === 'Hack', 'Sync: in HA abgehakt → Rückruf "gekauft" für Hack')
  // Hack ist nun gekauft; weiterer Lauf ändert HA nicht
  const c2 = ha.calls.length
  await run([L('Hack', 'Hack – 750 g', true), L('Milch', 'Milch – 2 l')])
  ok(ha.calls.length === c2, 'Sync: nach dem Übernehmen ruhig')
  // Milch fällt aus dem Plan
  await run([L('Hack', 'Hack – 750 g', true)])
  ok(!ha.todos.some((t) => t.summary.startsWith('Milch')), 'Sync: nicht mehr nötiger Yami-Eintrag entfernt')
  ok(ha.todos.some((t) => t.uid === 'f1') && ha.todos.some((t) => t.uid === 'f2'), 'Sync: fremde Einträge nie angefasst')
  ok(ha.todos.some((t) => t.uid === settings.items.Hack && t.status === 'completed'), 'Sync: erledigter Eintrag bleibt in HA stehen')
}
{
  // Liste ohne Beschreibungs-Unterstützung: Anlegen ohne, Zuordnung über uid
  const ha = new FakeHa()
  ha.noDescription = true
  const settings = { todo: 'todo.einkaufsliste', items: {} as Record<string, string>, done: [] as string[] }
  const r = await syncTodo(ha, settings, [L('Hack', 'Hack – 500 g')], () => {})
  ok(ha.todos.length === 1 && !!r.items.Hack, 'Sync: Liste ohne Beschreibung → trotzdem angelegt und zugeordnet')
  settings.items = r.items
  ha.todos.push({ uid: 'fx', summary: 'Fremd', status: 'needs_action', description: null, n: 0 })
  await syncTodo(ha, settings, [], () => {})
  ok(ha.todos.length === 1 && ha.todos[0].uid === 'fx', 'Sync: ohne Beschreibung wird nur das über die uid Bekannte entfernt')
}

// ───── 4) Erinnerungen ─────
const at = (s: string) => new Date(s.replace(' ', 'T'))
const base = { breakfastPicks: {} as Record<string, string[]>, weighIns: [] as { date: string; weight: number }[], hasProfile: true, pantry: [] as { id: string; name: string; amount: number; unit: string; expires: string }[] }
{
  // Waage: meist dienstags (2026-11-03, 11-10 = Di) → Dienstag-Erinnerung, wenn diese Woche noch nicht gewogen
  const w = [{ date: '2026-10-27', weight: 90 }, { date: '2026-11-03', weight: 89.5 }, { date: '2026-11-10', weight: 89 }]
  ok(usualWeighDay(w) === 2 && usualWeighDay([]) === 1, 'Wiegen: häufigster Wochentag (Di), ohne Messungen Montag')
  // Montag 16.11. 12:00 → Dienstag 17.11. 07:30 liegt in 48 h
  const r = plannedReminders({ ...base, weighIns: w }, at('2026-11-16 12:00:00'))
  const wr = r.find((x) => x.key.startsWith('rem:weigh'))
  ok(!!wr && wr.summary === '⚖️ Heute wiegen' && wr.start === '2026-11-17 07:30:00' && wr.key === 'rem:weigh:2026-11-17', 'Wiegen: Dienstag 07:30')
  ok(!plannedReminders({ ...base, weighIns: [...w, { date: '2026-11-16', weight: 88 }] }, at('2026-11-16 12:00:00')).some((x) => x.key.startsWith('rem:weigh')), 'Wiegen: schon gewogen → keine Erinnerung')
  ok(!plannedReminders({ ...base, weighIns: w, hasProfile: false }, at('2026-11-16 12:00:00')).some((x) => x.key.startsWith('rem:weigh')), 'Wiegen: ohne Profil nichts')
  ok(!plannedReminders({ ...base, weighIns: w }, at('2026-11-16 12:00:00')).some((x) => x.start > '2026-11-18 12:00:00'), 'Erinnerungen: nur innerhalb von 48 h')
  // Standard Montag: am Sonntag 15.11. 20:00 → Montag 07:30
  const rm = plannedReminders(base, at('2026-11-15 20:00:00'))
  ok(rm.some((x) => x.key === 'rem:weigh:2026-11-16' && x.start === '2026-11-16 07:30:00'), 'Wiegen: Standardtag Montag')

  // Meal-Prep Sonntag 10:00 (Frühstück für die Woche ab 16.11.)
  const picks = { '2026-11-16': ['oats-apfel-zimt', 'eiermuffins-schinken'] }
  const rp = plannedReminders({ ...base, breakfastPicks: picks }, at('2026-11-14 18:00:00'))
  const prep = rp.find((x) => x.key === 'rem:prep:2026-11-15')
  ok(!!prep && prep.summary === '🥣 Meal-Prep heute' && prep.start === '2026-11-15 10:00:00' && /Overnight|Oats|oats/i.test(prep.description) && /einfrieren/.test(prep.description), `Prep: Sonntag 10:00 mit Zusammenfassung (${prep?.description})`)
  ok(!plannedReminders(base, at('2026-11-14 18:00:00')).some((x) => x.key.startsWith('rem:prep')), 'Prep: ohne geplantes Frühstück nichts')
  // Auftauen Donnerstag 20:00 (Fr = eingefroren)
  const rt = plannedReminders({ ...base, breakfastPicks: picks }, at('2026-11-19 10:00:00'))
  const thaw = rt.find((x) => x.key === 'rem:thaw:2026-11-19')
  ok(!!thaw && thaw.summary === '❄️ Frühstück auftauen' && thaw.start === '2026-11-19 20:00:00', 'Auftauen: Donnerstag 20:00')
  ok(!plannedReminders({ ...base, breakfastPicks: { '2026-11-16': ['oats-apfel-zimt'] } }, at('2026-11-19 10:00:00')).some((x) => x.key.startsWith('rem:thaw')), 'Auftauen: nichts, wenn nichts eingefroren wird')
  // Prep am Montag 16.11. (Di–Fr): Erinnerung Montag 18:00, Auftauen Donnerstag 20:00 für Freitag
  const rpm = plannedReminders({ ...base, breakfastPicks: picks, prepDays: { '2026-11-16': '2026-11-16' } }, at('2026-11-16 09:00:00'))
  const prepM = rpm.find((x) => x.key === 'rem:prep:2026-11-16')
  ok(!!prepM && prepM.start === '2026-11-16 18:00:00', 'Prep Montag: Erinnerung 18:00')
  ok(!plannedReminders({ ...base, breakfastPicks: picks, prepDays: { '2026-11-16': '2026-11-16' } }, at('2026-11-14 18:00:00')).some((x) => x.key === 'rem:prep:2026-11-15'), 'Prep Montag: keine Sonntags-Erinnerung')
  ok(!plannedReminders({ ...base, breakfastPicks: picks, prepDays: { '2026-11-16': '2026-11-16' } }, at('2026-11-19 10:00:00')).some((x) => x.key === 'rem:thaw:2026-11-19'), 'Prep Montag: Muffins halten bis Fr (Alter 4) – kein Auftauen nötig')
  // Ablauf: Mo 16.11. ab 16:30 für Dienstag-Ablauf
  const pantry = [
    { id: 'a', name: 'Skyr', amount: 450, unit: 'g', expires: '2026-11-17' },
    { id: 'b', name: 'Feta', amount: 100, unit: 'g', expires: '2026-11-17' },
    { id: 'c', name: 'Milch', amount: 1, unit: 'l', expires: '2026-11-20' },
    { id: 'd', name: 'Leer', amount: 0, unit: 'g', expires: '2026-11-17' },
  ]
  const re = plannedReminders({ ...base, pantry }, at('2026-11-16 10:00:00'))
  const ex = re.find((x) => x.key === 'rem:exp:2026-11-16')
  ok(!!ex && ex.start === '2026-11-16 16:30:00' && ex.summary === '⏰ Läuft morgen ab: Feta, Skyr', `Ablauf: 16:30 am Vortag, gruppiert (${ex?.summary})`)
  ok(!re.some((x) => x.summary.includes('Milch') || x.summary.includes('Leer')), 'Ablauf: nur was morgen abläuft, nichts Leeres')
  ok(!plannedReminders({ ...base, pantry }, at('2026-11-16 17:00:00')).some((x) => x.key === 'rem:exp:2026-11-16'), 'Ablauf: 16:30 schon vorbei → nicht mehr anlegen')
}

// Erinnerungen werden nur einmal angelegt
{
  const ha = new FakeHa()
  const rem: Desired[] = [{ key: 'rem:weigh:2026-11-17', summary: '⚖️ Heute wiegen', description: 'x', start: '2026-11-17 07:30:00', end: '2026-11-17 08:00:00', sig: 'x' }]
  const s = { calendar: 'calendar.yami', reminders: 'calendar.yami_erinnerungen', events: {} as Record<string, { uid?: string; sig: string }> }
  const r1 = await syncCalendar(ha, s, [], rem, at('2026-11-16 12:00:00'))
  s.events = r1.events
  await syncCalendar(ha, s, [], rem, at('2026-11-16 12:05:00'))
  ok(ha.events.length === 1, 'Erinnerung: nur einmal angelegt')
  const cs = ha.calls.find((c) => c.domain === 'calendar')!
  ok(cs.service === 'create_event' && cs.data.start_date_time === '2026-11-17 07:30:00' && cs.data.end_date_time === '2026-11-17 08:00:00', 'Erinnerung: calendar.create_event mit lokaler Zeit')
}

// ───── 5) Plan-Kalender ─────
const dinnerRecipe = RECIPES.find((r) => r.meal === 'dinner')!
const dinnerRecipe2 = RECIPES.filter((r) => r.meal === 'dinner')[1]
const plan = (o: Record<string, [string, number]>) => Object.fromEntries(Object.entries(o).map(([d, [id, servings]]) => [d, { recipeId: id, servings }]))
{
  const ds = plannedDinners(plan({ '2026-11-16': [dinnerRecipe.id, 2], '2026-11-18': [dinnerRecipe2.id, 3], '2026-11-30': [dinnerRecipe.id, 2] }), '2026-11-16')
  ok(ds.length === 2, 'Plan: nur die nächsten 7 Tage (heute bis +7)')
  ok(ds[0].start === '2026-11-16 18:00:00' && ds[0].end === '2026-11-16 19:00:00' && ds[0].summary === `🍽️ ${dinnerRecipe.title}` && ds[0].sig === `${dinnerRecipe.id}×2`, 'Plan: 18–19 Uhr, Titel, Signatur')
  ok(ds[1].description.startsWith('3 Portionen\n• ') && ds[0].description.startsWith('2 Portionen'), 'Plan: Beschreibung mit Portionen und Zutaten')
  ok(plannedDinners({ '2026-11-16': { recipeId: dinnerRecipe.id, servings: 2, status: 'skipped' } }, '2026-11-16').length === 0, 'Plan: nicht gekochte Tage ausgelassen')
}
{
  const D = (date: string, r: { id: string; title: string }, sv = 2): Desired => ({ key: `dinner:${date}`, summary: `🍽️ ${r.title}`, description: '', start: `${date} 18:00:00`, end: `${date} 19:00:00`, sig: `${r.id}×${sv}` })
  const today = '2026-11-16'
  const d1 = D('2026-11-16', dinnerRecipe), d2 = D('2026-11-17', dinnerRecipe2), d3 = D('2026-11-20', dinnerRecipe)
  // mit uid-Suche
  let diff = diffDinnerEvents([d1, d2, d3], {}, [], today)
  ok(diff.create.length === 3 && diff.del.length === 0, 'Diff (mit Suche): neue Gerichte → alle angelegt')
  const tracked = { [d1.key]: { sig: d1.sig, uid: 'e1' }, [d2.key]: { sig: d2.sig }, [d3.key]: { sig: d3.sig, uid: 'e3' }, 'dinner:2026-11-10': { sig: 'alt', uid: 'old' }, 'rem:weigh:2026-11-17': { sig: 'x' } }
  const remote = [
    { uid: 'e1', summary: d1.summary, date: '2026-11-16' },
    { uid: 'e2', summary: d2.summary, date: '2026-11-17' },
    { uid: 'e3', summary: d3.summary, date: '2026-11-20' },
  ]
  diff = diffDinnerEvents([d1, d2, d3], tracked, remote, today)
  ok(diff.create.length === 0 && diff.del.length === 0 && diff.forget.join() === 'dinner:2026-11-10', 'Diff: unverändert → nichts; vergangene Tage vergessen; Erinnerungen ignoriert')
  // Gericht geändert (Di) und Do entfernt, Mi von Hand in HA gelöscht
  const d2b = D('2026-11-17', dinnerRecipe, 4)
  diff = diffDinnerEvents([d1, d2b], tracked, remote, today)
  ok(diff.create.length === 1 && diff.create[0].key === d2b.key, 'Diff: geändertes Gericht wird neu angelegt')
  ok(diff.del.some((x) => x.key === d2.key && x.uids.join() === 'e2'), 'Diff: alte Version wird über die per Suche gefundene uid gelöscht')
  ok(diff.del.some((x) => x.key === d3.key && x.uids.join() === 'e3'), 'Diff: entferntes Gericht → Eintrag mit bekannter uid gelöscht')
  diff = diffDinnerEvents([d1, d2, d3], tracked, remote.filter((e) => e.uid !== 'e3'), today)
  ok(diff.create.length === 1 && diff.create[0].key === d3.key, 'Diff: in HA von Hand gelöscht → wieder angelegt')
  // ohne uid-Suche (remote = null)
  diff = diffDinnerEvents([d1, d2, d3], {}, null, today)
  ok(diff.create.map((c) => c.key).join() === 'dinner:2026-11-16,dinner:2026-11-17', 'Diff (ohne Suche): nur heute und morgen angelegt')
  diff = diffDinnerEvents([d1, d2b], tracked, null, today)
  ok(diff.del.length === 0 || diff.del.every((x) => x.uids.length > 0), 'Diff (ohne Suche): ohne uid nichts löschbar')
  ok(diff.forget.includes(d2.key) && diff.create.some((c) => c.key === d2b.key), 'Diff (ohne Suche): geänderter Eintrag ohne uid wird vergessen und neu angelegt')
  ok(diff.del.some((x) => x.key === d1.key) === false, 'Diff (ohne Suche): unveränderter Eintrag bleibt')
}
{
  // gesamter Ablauf mit FakeHa: anlegen → ändern → entfernen
  const ha = new FakeHa()
  const s = { calendar: 'calendar.yami', reminders: 'calendar.yami_erinnerungen', events: {} as Record<string, { uid?: string; sig: string }> }
  const now = at('2026-11-16 12:00:00')
  let p = plan({ '2026-11-17': [dinnerRecipe.id, 2], '2026-11-18': [dinnerRecipe2.id, 2] })
  let r = await syncCalendar(ha, s, plannedDinners(p, '2026-11-16'), [], now)
  s.events = r.events
  ok(ha.events.length === 2 && !!s.events['dinner:2026-11-17'].uid && !!s.events['dinner:2026-11-18'].uid, 'Kalender: 2 Einträge angelegt, uids gemerkt')
  ok(ha.cmds.some((c) => c.type === 'calendar/event/subscribe') && ha.cmds.some((c) => c.type === 'unsubscribe_events'), 'Kalender: Suche per calendar/event/subscribe, danach beendet')
  const nCalls = ha.calls.length
  r = await syncCalendar(ha, s, plannedDinners(p, '2026-11-16'), [], now)
  ok(ha.calls.length === nCalls && ha.events.length === 2, 'Kalender: zweiter Lauf ändert nichts')
  p = plan({ '2026-11-17': [dinnerRecipe2.id, 2] })
  r = await syncCalendar(ha, s, plannedDinners(p, '2026-11-16'), [], now)
  s.events = r.events
  ok(ha.events.length === 1 && ha.events[0].summary === `🍽️ ${dinnerRecipe2.title}`, 'Kalender: geändertes Gericht ersetzt, entferntes gelöscht, nichts Altes bleibt')
  ok(ha.cmds.filter((c) => c.type === 'calendar/event/delete').length === 2, 'Kalender: Löschen über calendar/event/delete')
  // ohne Unterstützung
  const ha2 = new FakeHa()
  ha2.calSupported = false
  const s2 = { calendar: 'calendar.yami', reminders: 'calendar.yami_erinnerungen', events: {} as Record<string, { uid?: string; sig: string }> }
  p = plan({ '2026-11-16': [dinnerRecipe.id, 2], '2026-11-17': [dinnerRecipe2.id, 2], '2026-11-19': [dinnerRecipe.id, 2] })
  const r2 = await syncCalendar(ha2, s2, plannedDinners(p, '2026-11-16'), [], now)
  ok(ha2.events.length === 2 && !r2.error, 'Kalender ohne Suche: nur heute und morgen, ohne Fehlermeldung')
  ok(Object.values(r2.events).every((e) => !e.uid), 'Kalender ohne Suche: keine uids')
}

// ───── 6) Zustand & Sicherung ─────
{
  const ha = { ...newHa('https://abc.ui.nabu.casa', 'geheim'), enabled: true, items: { Milch: 'u1' }, events: { 'dinner:2026-11-17': { sig: 'a', uid: 'e1' } } }
  const body = backupBody({ ...sanitize({}), ha })
  const text = JSON.stringify(body)
  ok(!text.includes('geheim'), 'Sicherung: Token steht nicht in der Datei')
  ok(body.state.ha?.url === 'https://abc.ui.nabu.casa', 'Sicherung: Adresse bleibt')
  const back = parseBackup(text)
  ok(back.ha?.url === 'https://abc.ui.nabu.casa' && back.ha.token === '' && back.ha.todo === 'todo.einkaufsliste', 'Sicherung: beim Laden Adresse da, Token leer, Standard-Entitäten')
  const bad = sanitize({ ha: { url: 5, token: null, enabled: 'ja', todo: 'kaputt!', items: { a: 3, b: 'x' }, events: { k: { sig: 1 }, z: { sig: 's' } } } })
  ok(bad.ha?.url === '' && bad.ha.enabled === false && bad.ha.todo === 'todo.einkaufsliste' && Object.keys(bad.ha.items).join() === 'b' && Object.keys(bad.ha.events).join() === 'z', 'sanitize: falsche Typen im Feld "ha" werden verworfen')
  ok(!('ha' in sanitize({ ha: 'x' })), 'sanitize: ha ohne Objekt entfällt')
  ok(sanitize({ ha: { entity: 1 } }).ha?.calendar === 'calendar.yami', 'sanitize: Standardwerte für Entitäten')
}

console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
process.exit(fails ? 1 : 0)
