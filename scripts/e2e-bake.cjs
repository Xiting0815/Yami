// Playwright: Backen einplanen (Bienenstich für Samstag → Wochenzeile → Einkaufsliste → am Folgetag „Gebacken?“ → Ja → Vorrat).
// Start: npx vite build && npx vite preview --port 4173 --strictPort, dann: NODE_PATH=$(npm root -g) node scripts/e2e-bake.cjs
const { chromium } = require('playwright')
const SHOT = process.env.SHOT_DIR || require('path').join(require('os').tmpdir(), 'yami-shots')
require('fs').mkdirSync(SHOT, { recursive: true })
const URL = 'http://localhost:4173/'
const KEY = 'yami-state-v1'
let fails = 0
const ok = (c, m) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const initial = { plan: {}, onboarding: 'done', onboardingListSeen: true, defaultServings: 2, lastBackup: '2026-11-17' }

;(async () => {
  const browser = await chromium.launch()
  let saved = JSON.stringify(initial)
  const errors = []
  async function day(iso, hour, fn) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'de-DE' })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => errors.push(`${iso}: ${e.message}`))
    page.on('console', (m) => m.type() === 'error' && errors.push(`${iso} console: ${m.text()}`))
    await page.clock.install({ time: new Date(`${iso}T${hour}:00`) })
    await page.addInitScript(([k, v]) => { if (!sessionStorage.getItem('init')) { localStorage.setItem(k, v); sessionStorage.setItem('init', '1') } }, [KEY, saved])
    await page.goto(URL)
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
    await page.waitForSelector('.tabbar')
    await page.waitForTimeout(300)
    const st = async () => JSON.parse(await page.evaluate((k) => localStorage.getItem(k), KEY))
    await fn(page, st)
    saved = await page.evaluate((k) => localStorage.getItem(k), KEY)
    await ctx.close()
  }
  const tab = (page, label) => page.locator('.tabbar button', { hasText: label }).click()

  // ── Mi 18.11.: Bienenstich für Samstag einplanen ──
  await day('2026-11-18', '10:00', async (page, st) => {
    await tab(page, 'Rezepte')
    await page.getByRole('button', { name: '🍰 Backen' }).click()
    await page.locator('.tile', { hasText: 'Bienenstich' }).first().click()
    await page.waitForSelector('.bake-plan')
    ok(await page.locator('.bake-plan-head', { hasText: 'Einplanen für' }).isVisible(), 'Rezeptblatt: „Einplanen für“ mit Tagesleiste')
    await page.locator('.bake-plan').screenshot({ path: `${SHOT}/bake-1-einplanen.png` })
    await page.locator('.bake-days button[aria-label="Samstag 21.11."]').click()
    await page.waitForTimeout(200)
    const s = await st()
    ok(s.bakePlan?.['2026-11-21']?.[0]?.recipeId === 'bienenstich' && s.bakePlan['2026-11-21'][0].amount === 1, 'Backplan: Bienenstich am Samstag (Menge 1)')
    await tab(page, 'Woche')
    const row = page.locator('li.day-bakes')
    ok((await row.count()) === 1 && /Backen:\s*Bienenstich/.test(await row.innerText()), `Woche: Zeile „${(await row.innerText()).replace(/\s+/g, ' ')}“`)
    await page.screenshot({ path: `${SHOT}/bake-2-woche.png`, fullPage: true })
    await row.locator('.bake-item').click()
    await page.waitForSelector('.sheet.actions')
    const acts = await page.locator('.sheet.actions').innerText()
    ok(/Rezept ansehen/.test(acts) && /verschieben/.test(acts) && /entfernen/.test(acts), 'Aktionen: Ansehen, Verschieben, Entfernen')
    await page.locator('.sheet.actions').screenshot({ path: `${SHOT}/bake-3-aktionen.png` })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    await tab(page, 'Liste')
    const list = await page.locator('.tab-content, main').first().innerText()
    ok(/Mandelblättchen/.test(list) && /Vanillepuddingpulver/.test(list), 'Liste: Bienenstich-Zutaten (Mandelblättchen, Vanillepuddingpulver)')
  })

  // ── So 22.11.: Frage „Gebacken?“ → Ja → Vorrat ──
  await day('2026-11-22', '09:00', async (page, st) => {
    await page.waitForSelector('.bake-ask')
    const t = await page.locator('.bake-ask').innerText()
    ok(/Hast du\s+Bienenstich\s+gebacken\?/.test(t), `Frage: „${t.replace(/\s+/g, ' ').slice(0, 70)}…“`)
    await page.screenshot({ path: `${SHOT}/bake-4-frage.png`, fullPage: true })
    await page.locator('.bake-ask button', { hasText: 'Ja' }).click()
    await page.waitForSelector('.rate-sheet, .sheet')
    await page.screenshot({ path: `${SHOT}/bake-5-bewertung.png` })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    const s = await st()
    const lots = s.pantry.filter((l) => l.name === 'Bienenstich (selbstgebacken)')
    ok(lots.length === 1 && lots[0].amount === 12 && lots[0].unit === 'Stk', 'Ja: 12 Stk Bienenstich im Vorrat')
    ok(s.bakePlan['2026-11-21'][0].status === 'baked' && s.baked.length === 1 && s.baked[0].date === '2026-11-21', 'Eintrag gebacken, Gebackenes fürs Lernen vermerkt')
    ok((await page.locator('.bake-ask').count()) === 0, 'Frage verschwindet')
    await tab(page, 'Vorrat')
    ok(/Bienenstich \(selbstgebacken\)/.test(await page.locator('.tab-content, main').first().innerText()), 'Vorrat zeigt den Bienenstich')
  })

  // ── Verschieben aus der Frage (frischer Stand: Backen gestern geplant) ──
  saved = JSON.stringify({ ...initial, bakePlan: { '2026-11-21': [{ recipeId: 'bienenstich', amount: 1 }] } })
  await day('2026-11-22', '09:00', async (page, st) => {
    await page.locator('.bake-ask button', { hasText: 'Verschieben' }).click()
    await page.locator('.bake-days button[aria-label="Samstag 28.11."]').click()
    await page.waitForTimeout(200)
    const s = await st()
    ok(!s.bakePlan['2026-11-21'] && s.bakePlan['2026-11-28']?.[0]?.recipeId === 'bienenstich', 'Verschieben: neuer Tag, Frage weg')
    ok((await page.locator('.bake-ask').count()) === 0, 'keine Frage mehr')
  })
  await browser.close()
  ok(errors.length === 0, 'keine Fehler in der Konsole ' + errors.join(' | '))
  console.log(fails ? `\n${fails} Test(s) fehlgeschlagen` : '\nAlle Tests OK')
  if (fails) process.exit(1)
})()
