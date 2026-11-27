// Playwright: „Familie teilen“ mit zwei Handys (Marc: eingerichtet, Lisa: frisch installiert) gegen ein
// nachgebautes Home Assistant (WebSocket-Attrappe im Browser, Daten in Node geteilt).
// Start: npx vite build && npx vite preview --port 4173 --strictPort, dann: NODE_PATH=$(npm root -g) node scripts/e2e-sync.cjs
const { chromium } = require('playwright')
const SHOT = process.env.SHOT_DIR || require('path').join(require('os').tmpdir(), 'yami-shots')
require('fs').mkdirSync(SHOT, { recursive: true })
const URL = 'http://localhost:4173/'
const KEY = 'yami-state-v1'
const NOW = '2026-11-16T10:00:00' // Montag

let fails = 0
const ok = (c, m) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }

// ───── Home Assistant in Node: To-do-Listen, Kalender, Abos ─────
const ha = { lists: {}, events: {}, next: 1, subs: [] }
const list = (e) => (ha.lists[e] ??= [])
async function notify(entity) {
  for (const s of ha.subs.filter((x) => x.entity === entity)) {
    const items = list(entity).map((i) => ({ ...i }))
    await s.page.evaluate((m) => window.__haPush && window.__haPush(m), { id: s.id, type: 'event', event: { items } }).catch(() => {})
  }
}
async function handle(page, m) {
  const res = (result) => [{ id: m.id, type: 'result', success: true, result }]
  if (m.type === 'todo/item/list') return res({ items: list(m.entity_id).map((i) => ({ ...i })) })
  if (m.type === 'todo/item/subscribe') {
    ha.subs.push({ page, id: m.id, entity: m.entity_id })
    return [...res(null), { id: m.id, type: 'event', event: { items: list(m.entity_id) } }]
  }
  if (m.type === 'unsubscribe_events') {
    ha.subs = ha.subs.filter((s) => !(s.page === page && s.id === m.subscription))
    return res(null)
  }
  if (m.type === 'calendar/event/subscribe') {
    const evs = (ha.events[m.entity_id] ?? []).map((e) => ({ ...e }))
    return [...res(null), { id: m.id, type: 'event', event: { events: evs } }]
  }
  if (m.type === 'calendar/event/delete') {
    ha.events[m.entity_id] = (ha.events[m.entity_id] ?? []).filter((e) => e.uid !== m.uid)
    return res(null)
  }
  if (m.type === 'call_service') {
    const entity = m.target?.entity_id
    const d = m.service_data ?? {}
    if (m.domain === 'calendar' && m.service === 'create_event') {
      ;(ha.events[entity] ??= []).push({ uid: 'e' + ha.next++, summary: d.summary, start: d.start_date_time.replace(' ', 'T') })
      return res(null)
    }
    if (m.domain === 'todo') {
      const items = list(entity)
      if (m.service === 'add_item') items.push({ uid: 'u' + ha.next++, summary: d.item, status: 'needs_action', description: d.description ?? null })
      else if (m.service === 'update_item') {
        const it = items.find((i) => i.uid === d.item)
        if (!it) return [{ id: m.id, type: 'result', success: false, error: { code: 'not_found', message: 'Unable to find' } }]
        if (d.description !== undefined) it.description = d.description
        if (d.rename !== undefined) it.summary = d.rename
        if (d.status !== undefined) it.status = d.status
      } else if (m.service === 'remove_item') ha.lists[entity] = items.filter((i) => i.uid !== d.item)
      setTimeout(() => void notify(entity), 30)
      return res(null)
    }
  }
  return [{ id: m.id, type: 'result', success: false, error: { code: 'unknown_command', message: 'Unknown command.' } }]
}

// im Browser: WebSocket-Attrappe, schickt alles an Node
const FAKE_WS = () => {
  const socks = new Set()
  class FakeWS {
    constructor(url) {
      this.url = url
      this.readyState = 0
      socks.add(this)
      setTimeout(() => {
        this.readyState = 1
        this.onopen && this.onopen()
        this.emit({ type: 'auth_required', ha_version: '2026.11.0' })
      }, 20)
    }
    emit(m) { this.onmessage && this.onmessage({ data: JSON.stringify(m) }) }
    send(d) {
      const m = JSON.parse(d)
      if (m.type === 'auth') return setTimeout(() => this.emit(m.access_token ? { type: 'auth_ok', ha_version: '2026.11.0' } : { type: 'auth_invalid', message: 'x' }), 10)
      window.__haSend(d).then((out) => { if (this.readyState === 1) JSON.parse(out).forEach((x) => this.emit(x)) })
    }
    close() { this.readyState = 3; socks.delete(this) }
  }
  FakeWS.OPEN = 1
  window.WebSocket = FakeWS
  window.__haPush = (m) => socks.forEach((s) => s.readyState === 1 && s.emit(m))
}

const marcState = {
  plan: { '2026-11-16': { recipeId: 'haehnchen-rahm-bandnudeln', servings: 2 } },
  pantry: [{ id: 'p1', name: 'Bandnudeln', amount: 500, unit: 'g', expires: '2027-09-01' }],
  onboarding: 'done', onboardingListSeen: true, defaultServings: 2, lastBackup: '2026-11-15',
  ha: { url: 'https://haus.ui.nabu.casa', token: 'marc-token', enabled: true, share: true, me: 'Marc', todo: 'todo.einkaufen', calendar: 'calendar.familie', reminders: 'calendar.yami_erinnerungen', syncList: 'todo.yami_sync', items: {}, events: {} },
}

;(async () => {
  const browser = await chromium.launch()
  const errors = []
  async function phone(name, saved) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'de-DE' })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`))
    page.on('console', (m) => m.type() === 'error' && errors.push(`${name} console: ${m.text()}`))
    await page.clock.install({ time: new Date(NOW) })
    await page.exposeFunction('__haSend', async (d) => JSON.stringify(await handle(page, JSON.parse(d))))
    await page.addInitScript(FAKE_WS)
    if (saved) await page.addInitScript(([k, v]) => { if (!sessionStorage.getItem('init')) { localStorage.setItem(k, v); sessionStorage.setItem('init', '1') } }, [KEY, JSON.stringify(saved)])
    await page.goto(URL)
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
    await page.waitForSelector('.tabbar')
    return page
  }
  const st = async (page) => JSON.parse(await page.evaluate((k) => localStorage.getItem(k), KEY))
  const tab = (page, label) => page.locator('.tabbar button', { hasText: label }).click()
  const until = async (fn, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await fn()) return true; await new Promise((r) => setTimeout(r, 200)) } return false }

  // ── Marc: eingerichtet, Familie teilen an ──
  const marc = await phone('Marc', marcState)
  ok(await until(async () => list('todo.yami_sync').some((i) => i.summary === 'yami:v1:kitchen')), 'Marc: Haushaltsdaten in todo.yami_sync')
  ok(await until(async () => (ha.events['calendar.familie'] ?? []).length === 1), 'Marc: Montag im Familienkalender')

  // ── Lisa: frisch installiert → Checkliste mit „mit jemandem zusammen“ ──
  const lisa = await phone('Lisa', null)
  const share = lisa.getByRole('button', { name: /Ich nutze Gusto mit jemandem zusammen/ })
  ok(await share.isVisible(), 'Lisa (frisch): Link „Ich nutze Gusto mit jemandem zusammen → mit Home Assistant verbinden“')
  await lisa.screenshot({ path: `${SHOT}/sync-1-lisa-frisch.png` })
  await share.click()
  await lisa.waitForSelector('#ha')
  await lisa.getByLabel('Adresse (Nabu-Casa-URL)').fill('https://haus.ui.nabu.casa')
  await lisa.getByLabel('Zugriffs-Token').fill('lisa-token')
  await lisa.getByRole('button', { name: 'Verbinden & testen' }).click()
  ok(await until(async () => (await lisa.locator('#ha').innerText()).includes('Verbunden')), 'Lisa: mit eigenem Token verbunden')
  await lisa.getByText('Familie teilen ist aus').click()
  ok(await lisa.getByText('Bitte wählen – erst dann wird geteilt.').isVisible(), 'Lisa: „Wer bist du?“ wird abgefragt')
  await lisa.getByRole('radio', { name: 'Lisa' }).click()
  ok(await until(async () => (await st(lisa)).plan?.['2026-11-16']?.recipeId === 'haehnchen-rahm-bandnudeln'), 'Lisa: bekommt Marcs Plan')
  ok(await until(async () => (await lisa.locator('#ha').innerText()).includes('mit Marc')), 'Lisa: Status „Synchronisiert … · mit Marc“')
  const s0 = await st(lisa)
  ok(s0.onboarding === 'done' && !('profile' in s0), 'Lisa: Beitritt → Checkliste erledigt, kein Profil')
  ok(!(await lisa.getByText(/Kalorie|kcal/).count()), 'Lisa: Einstellungen ohne Kalorien')
  await lisa.locator('#ha').scrollIntoViewIfNeeded()
  await lisa.screenshot({ path: `${SHOT}/sync-2-lisa-ha.png` })
  await lisa.locator('.sheet-footer .btn.primary', { hasText: 'Fertig' }).click()
  ok(!('profile' in (await st(lisa))), 'Lisa: Einstellungen schließen legt nichts Kalorienbezogenes an')
  ok(!(await lisa.locator('.start-card').count()), 'Lisa: Woche ohne Start-Checkliste')

  // ── Lisa plant Dienstag ──
  await lisa.locator('li.day', { hasText: '17.11.' }).locator('.day-empty').click()
  await lisa.waitForSelector('.swipe-screen h2')
  const title = (await lisa.locator('.swipe-screen h2').first().textContent()).trim()
  await lisa.getByRole('button', { name: 'Nehmen' }).click()
  await lisa.waitForTimeout(300)
  await tab(lisa, 'Woche')
  ok((await st(lisa)).plan['2026-11-17'], `Lisa: Dienstag geplant (${title})`)

  // ── Marc sieht es (live über das Abo) ──
  ok(await until(async () => (await st(marc)).plan?.['2026-11-17']), 'Marc: Lisas Dienstag kommt an')
  await marc.waitForTimeout(400)
  const marcWeek = await marc.locator('main').innerText()
  ok(/von Lisa/.test(marcWeek), 'Marc: Dienstag mit „von Lisa“')
  ok(marcWeek.includes(`Lisa hat Dienstag geplant: ${title}`), 'Marc: Hinweis „Lisa hat Dienstag geplant …“')
  ok(await until(async () => (ha.events['calendar.familie'] ?? []).filter((e) => e.start.startsWith('2026-11-17')).length === 1), 'Dienstag genau einmal im Familienkalender')
  await marc.screenshot({ path: `${SHOT}/sync-3-marc-woche.png` })

  // ── beide haken ab ──
  await tab(marc, 'Liste')
  await tab(lisa, 'Liste')
  await marc.waitForTimeout(300)
  // Einkäufe gehen erst nach „Freigeben“ an Google Tasks (Entwurf → freigegeben, geteilt mit Lisa)
  ok(list('todo.einkaufen').filter((i) => i.status === 'needs_action').length === 0, 'Google Tasks: Entwurf noch nicht gesendet')
  await marc.locator('.trip-title').getByRole('button', { name: 'Freigeben' }).click()
  ok(await until(async () => list('todo.einkaufen').length >= 3), `Google Tasks: nach Freigabe ${list('todo.einkaufen').length} Artikel`)
  ok(await until(async () => /Freigegeben/.test(await lisa.locator('.trip-title').innerText())), 'Lisa sieht „Freigegeben“')
  const boxes = marc.locator('main li input[type=checkbox]')
  const n = await boxes.count()
  ok(n >= 3, `Liste: ${n} Artikel`)
  const name = async (page, i) => (await page.locator('main li').nth(i).locator('.item-name').innerText()).split('\n')[0]
  const first = await name(marc, 0)
  await marc.locator('main li').nth(0).locator('.check').click()
  const second = await name(lisa, 1)
  await lisa.locator('main li').nth(1).locator('.check').click()
  const checked = async (page, nm) => page.locator('main li.done', { hasText: nm }).count()
  ok(await until(async () => (await checked(lisa, first)) > 0), `Lisa sieht Marcs Häkchen (${first})`)
  ok(await until(async () => (await checked(marc, second)) > 0), `Marc sieht Lisas Häkchen (${second})`)
  ok(await until(async () => list('todo.einkaufen').filter((i) => i.status === 'completed').length >= 2), 'Google Tasks: beide Artikel erledigt')
  const tasks = list('todo.einkaufen').map((i) => i.summary.split(' – ')[0])
  ok(tasks.length === new Set(tasks).size, `Google Tasks: keine doppelten Artikel (${tasks.length})`)
  await tab(marc, 'Woche')
  await marc.waitForTimeout(300)
  await marc.screenshot({ path: `${SHOT}/sync-4-marc-woche-nach-liste.png` })
  await marc.locator('.topbar button').last().click().catch(() => {})
  await marc.waitForTimeout(300)
  if (await marc.locator('#ha').count()) {
    await marc.locator('#ha-family').scrollIntoViewIfNeeded()
    await marc.screenshot({ path: `${SHOT}/sync-5-marc-ha.png` })
  }
  // ── Marcs MacBook: alter Plan, „Familie teilen“ AUS → darf Kalender/Google Tasks nicht überschreiben ──
  const calBefore = JSON.stringify(ha.events['calendar.familie'])
  const tasksBefore = JSON.stringify(list('todo.einkaufen'))
  const macState = { ...marcState, plan: { '2026-11-16': { recipeId: 'chili-con-carne', servings: 2 }, '2026-11-17': { recipeId: 'chili-con-carne', servings: 2 } }, trips: { '2026-11-16': { released: 1 } }, ha: { ...marcState.ha, token: 'mac-token', share: false, me: undefined } }
  const mac = await phone('MacBook', macState)
  const warn = mac.locator('.share-warn')
  ok(await until(async () => (await warn.count()) > 0), 'MacBook: Karte „Auf einem anderen Gerät ist ‚Familie teilen‘ aktiv“')
  ok((await warn.innerText()).includes('sonst überschreibt dieses Gerät den Kalender mit altem Stand'), 'MacBook: Hinweistext erklärt die Gefahr')
  await mac.waitForTimeout(500)
  ok(JSON.stringify(ha.events['calendar.familie']) === calBefore && JSON.stringify(list('todo.einkaufen')) === tasksBefore, 'MacBook: Familienkalender und Google Tasks unverändert')
  await mac.screenshot({ path: `${SHOT}/sync-6-mac-hinweis.png` })
  await warn.getByRole('button', { name: 'Einschalten' }).click()
  await mac.waitForSelector('#ha')
  ok(await mac.getByText('Bitte wählen – erst dann wird geteilt.').isVisible(), 'MacBook: Einschalten → „Wer bist du?“')
  await mac.getByRole('radio', { name: 'Marc' }).click()
  ok(await until(async () => (await st(mac)).plan?.['2026-11-16']?.recipeId === 'haehnchen-rahm-bandnudeln'), 'MacBook: übernimmt den Haushaltsplan (alter Plan überschreibt nichts)')
  ok(await until(async () => !(await st(mac)).ha.otherShare), 'MacBook: Hinweis verschwindet')
  const mon = (ha.events['calendar.familie'] ?? []).filter((e) => e.start.startsWith('2026-11-16'))
  ok(mon.length === 1 && !/Chili/.test(mon[0].summary), `Familienkalender Montag weiter richtig (${mon.map((e) => e.summary).join(', ')})`)
  ok(!errors.length, `keine Fehler in der Konsole ${errors.join(' | ')}`)
  await browser.close()
  console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
  process.exit(fails ? 1 : 0)
})().catch((e) => { console.error(e); process.exit(1) })
