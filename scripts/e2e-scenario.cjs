// Playwright-Ablauf Mo 16.11. → Di 24.11.2026 mit echtem Vorrat (Klick-Test der App).
// Start: npx vite build && npx vite preview --port 4173 --strictPort, dann: NODE_PATH=$(npm root -g) node scripts/e2e-scenario.cjs
const { chromium, devices } = require('playwright')
const SHOT = process.env.SHOT_DIR || require('path').join(require('os').tmpdir(), 'yami-shots')
require('fs').mkdirSync(SHOT, { recursive: true })
const URL = 'http://localhost:4173/'
const KEY = 'yami-state-v1'
const LONG = '2027-09-01'
let n = 0
const U = { Hähnchenbrustfilet: 'g', Champignons: 'g', Ei: 'Stk', Schmand: 'g', Sahne: 'ml', 'Saure Sahne': 'g', 'Kartoffeln festkochend': 'g', 'Erbsen und Möhren TK': 'g', 'Gehackte Tomaten': 'Dose', Tellerlinsen: 'g', Bandnudeln: 'g', Olivenöl: 'ml', 'Gemüsebrühe Würfel': 'ml' }
const lot = (name, amount, expires) => ({ id: 'p' + n++, name, amount, unit: U[name], expires })
const initial = {
  plan: {},
  breakfast: {
    '2026-11-17': { recipeId: 'brot-box', servings: 1 }, '2026-11-18': { recipeId: 'brot-box', servings: 1 },
    '2026-11-19': { recipeId: 'brot-box', servings: 1 }, '2026-11-20': { recipeId: 'linsen-ei-salat', servings: 1 },
  },
  breakfastPicks: { '2026-11-16': ['brot-box', 'linsen-ei-salat'] },
  prepDays: { '2026-11-16': '2026-11-16' },
  pantry: [
    lot('Hähnchenbrustfilet', 400, '2026-11-18'), lot('Champignons', 400, '2026-11-20'), lot('Ei', 10, '2026-12-07'),
    lot('Schmand', 400, '2026-12-07'), lot('Sahne', 200, '2026-12-07'), lot('Saure Sahne', 200, '2026-12-07'),
    lot('Kartoffeln festkochend', 2000, '2026-12-16'), lot('Erbsen und Möhren TK', 200, LONG), lot('Gehackte Tomaten', 1, LONG),
    lot('Tellerlinsen', 500, LONG), lot('Bandnudeln', 500, LONG), lot('Olivenöl', 750, LONG), lot('Gemüsebrühe Würfel', 4000, LONG),
  ],
  spices: { Pfeffer: 'da', Muskatnuss: 'alle' },
  onboarding: 'done', onboardingListSeen: true, defaultServings: 2, lastBackup: '2026-11-15',
  profile: { sex: 'm', age: 40, heightCm: 180, weightKg: 92, activity: 1.3, deficit: 500, lunchKcal: 600 },
  weighIns: [{ date: '2026-11-16', weight: 92 }],
}

let fails = 0
const ok = (c, m) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++ }
const amt = (s, name) => s.pantry.filter((l) => l.name === name).reduce((a, l) => a + l.amount, 0)

;(async () => {
  const browser = await chromium.launch()
  let saved = JSON.stringify(initial)
  const errors = []
  async function day(iso, hour, fn) {
    const ctx = await browser.newContext({ ...devices['Pixel 7'] })
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

  // ── Mo 16.11. ──
  await day('2026-11-16', '17:30', async (page, st) => {
    await page.screenshot({ path: `${SHOT}/1-mo-woche.png`, fullPage: true })
    await tab(page, 'Vorrat')
    await page.screenshot({ path: `${SHOT}/2-mo-vorrat.png`, fullPage: true })
    await page.getByText('Was koche ich damit?').click()
    await page.getByRole('button', { name: /Heute \(Mo 16\.11\.\)/ }).click()
    await page.waitForTimeout(200)
    await page.screenshot({ path: `${SHOT}/3-mo-wischen-vorrat.png` })
    const top = await page.locator('.swipe-screen h2').first().textContent()
    ok(/Hähnchen-Champignon-Rahm/.test(top), `oberste Karte: ${top}`)
    const chip = await page.locator('.swipe-screen').innerText()
    ok(/4 von 6 Zutaten da · Zukauf ≈ 2,18/.test(chip), 'Karte: 4 von 6 Zutaten da, Zukauf ≈ 2,18 € (echter Vorrat)')
    await page.getByRole('button', { name: 'Nehmen' }).click()
    await page.waitForTimeout(400)
    const s = await st()
    ok(s.plan['2026-11-16']?.recipeId === 'haehnchen-rahm-bandnudeln', 'für Montag genommen, zurück in der Woche')
    await tab(page, 'Liste')
    await page.waitForTimeout(200)
    await page.screenshot({ path: `${SHOT}/4-mo-liste.png`, fullPage: true })
    const txt = await page.locator('main').innerText()
    ok(/Zwiebel/.test(txt) && /Petersilie/.test(txt), 'Liste: Zwiebel, Petersilie')
    const buyPart = txt.split(/Aus dem Vorrat|aus dem Vorrat/)[0]
    ok(!/Bandnudeln|Hähnchenbrust|\bSahne\b/.test(buyPart), 'Bandnudeln/Hähnchen/Sahne nicht im Einkaufsteil')
  })

  // ── Di 17.11. ──
  await day('2026-11-17', '07:30', async (page, st) => {
    let s = await st()
    ok(s.plan['2026-11-16'].status === 'cooked', 'Di: Montag gekocht')
    ok(amt(s, 'Hähnchenbrustfilet') === 0 && amt(s, 'Champignons') === 150 && amt(s, 'Sahne') === 0 && amt(s, 'Bandnudeln') === 250, 'Di: Vorrat exakt abgezogen')
    await page.screenshot({ path: `${SHOT}/5-di-woche-bewertung.png`, fullPage: true })
    ok(await page.locator('.rate-card').isVisible(), 'Di: Bewertungsfrage sichtbar')
    // nicht gekocht → Rückgängig
    await page.getByRole('button', { name: 'Aktionen für Montag' }).click()
    await page.getByText('Nicht gekocht – Zutaten zurück in den Vorrat').click()
    await page.waitForTimeout(200)
    s = await st()
    ok(amt(s, 'Hähnchenbrustfilet') === 400 && amt(s, 'Champignons') === 400 && amt(s, 'Sahne') === 200 && amt(s, 'Bandnudeln') === 500, 'nicht gekocht: alles zurück')
    await page.locator('.toast-undo').click()
    await page.waitForTimeout(200)
    s = await st()
    ok(s.plan['2026-11-16'].status === 'cooked' && amt(s, 'Champignons') === 150, 'Rückgängig: wieder gekocht & abgezogen')
    await page.getByRole('button', { name: /Gut/ }).click()
    await page.waitForTimeout(200)
    s = await st()
    ok(s.ratings['2026-11-16'] === 'up' && !(await page.locator('.rate-card').isVisible()), 'Bewertung 👍 gespeichert, Karte weg')
  })

  // ── Mi 18.11.: Gestern (Di) ein Gericht nachtragen → sofort als gekocht abgezogen (Regression) ──
  await day('2026-11-18', '19:00', async (page, st) => {
    let s = await st()
    ok(s.breakfast['2026-11-17'].status === 'cooked' && amt(s, 'Ei') === 8, 'Mi: Frühstück Di abgezogen (2 Eier)')
    // Montag tauschen (gekocht) → anderes Gericht wischen
    await page.getByRole('button', { name: 'Aktionen für Montag' }).click()
    await page.getByText('Anderes Gericht wischen').click()
    await page.waitForTimeout(200)
    const title = await page.locator('.swipe-screen h2').first().textContent()
    await page.getByRole('button', { name: 'Nehmen' }).click()
    await page.waitForTimeout(400)
    s = await st()
    const e = s.plan['2026-11-16']
    ok(e.recipeId !== 'haehnchen-rahm-bandnudeln' && e.status === 'cooked', `Montag getauscht (${title}) und gleich abgezogen`)
    ok(amt(s, 'Hähnchenbrustfilet') + amt(s, 'Bandnudeln') >= 0, 'Vorrat konsistent')
    // zurück: Rückgängig
    await page.locator('.toast-undo').click()
    await page.waitForTimeout(200)
    s = await st()
    ok(s.plan['2026-11-16'].recipeId === 'haehnchen-rahm-bandnudeln' && amt(s, 'Champignons') === 150, 'Rückgängig: altes Gericht und Vorrat wieder da')
  })

  for (const d of ['2026-11-19', '2026-11-20']) await day(d, '08:00', async () => {})

  // ── Sa 21.11.: nächste Woche ──
  await day('2026-11-21', '10:00', async (page, st) => {
    const s = await st()
    ok(amt(s, 'Ei') === 3 && amt(s, 'Tellerlinsen') === 450, 'Sa: alle Frühstücke abgezogen (Ei 3, Linsen 450)')
    const label = await page.locator('.week-label').innerText()
    ok(/KW 48/.test(label), `Sa zeigt nächste Woche (${label.replace(/\n/g, ' ')})`)
    // Sonntag (laufende Woche) noch ein Gericht, dessen Zutaten fehlen → Liste der nächsten Woche nimmt sie mit
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k))
      s.plan['2026-11-22'] = { recipeId: 'huehnerfrikassee', servings: 2 }
      localStorage.setItem(k, JSON.stringify(s))
    }, KEY)
    await page.reload()
    await page.waitForSelector('.tabbar')
    await tab(page, 'Liste')
    await page.waitForTimeout(200)
    await page.screenshot({ path: `${SHOT}/6b-sa-liste-fuer-so.png`, fullPage: true })
    const li = await page.locator('main').innerText()
    // Einkäufe statt Wochen: der Samstagseinkauf deckt Sa–Fr ab, Sonntag gehört einfach dazu
    ok(/Einkauf Sa 21\.11\./.test(li) && /Spargel weiß/.test(li), 'Sa: Einkauf Sa 21.11. enthält Spargel für Sonntag')
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k))
      delete s.plan['2026-11-22']
      localStorage.setItem(k, JSON.stringify(s))
    }, KEY)
    await page.reload()
    await page.waitForSelector('.tabbar')
    await page.screenshot({ path: `${SHOT}/6-sa-naechste-woche.png`, fullPage: true })
    await tab(page, 'Vorrat')
    await page.screenshot({ path: `${SHOT}/7-sa-vorrat.png`, fullPage: true })
  })

  // ── So 22.11.: Champignons wegwerfen, Rückblick ──
  await day('2026-11-22', '18:00', async (page, st) => {
    await tab(page, 'Vorrat')
    const row = page.locator('li, .pantry-row, .lot').filter({ hasText: 'Champignons' }).first()
    await row.getByRole('button', { name: 'Verbraucht / entfernen' }).click()
    await page.waitForTimeout(200)
    const s = await st()
    ok(s.wasted.some((w) => w.name === 'Champignons' && w.amount === 150 && w.date === '2026-11-19'), 'So: Champignons als weggeworfen erfasst (Datum 19.11. = Ablauf)')
    await tab(page, 'Woche')
    await page.waitForTimeout(200)
    await page.screenshot({ path: `${SHOT}/8-so-woche-rueckblick.png`, fullPage: true })
    const card = page.locator('[aria-label*="Rückblick"], .review-card').first()
    ok(await card.isVisible(), 'So: Rückblick-Karte sichtbar')
    await card.locator(".btn.primary").click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${SHOT}/9-so-rueckblick-sheet.png`, fullPage: true })
    const t = await page.locator('.sheet').last().innerText()
    ok(/Champignons/.test(t), 'Rückblick nennt Champignons')
    // Zurück-Taste schließt das Sheet
    await page.goBack()
    await page.waitForTimeout(300)
    ok((await page.locator('.sheet').count()) === 0, 'Zurück-Taste schließt den Rückblick')
  })

  await day('2026-11-24', '08:00', async (page) => {
    await page.screenshot({ path: `${SHOT}/10-di-24-woche.png`, fullPage: true })
  })

  ok(errors.length === 0, `keine Fehler in der Konsole ${errors.length ? JSON.stringify(errors) : ''}`)
  await browser.close()
  console.log(fails ? `\n${fails} Fehler` : '\nAlle Tests OK')
  process.exit(fails ? 1 : 0)
})()
