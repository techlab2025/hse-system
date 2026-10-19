// Test-only API fixtures: no live credentials or writes are used.
// Run against Vite: node scripts/equipment-details-regression.mjs
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync } from 'node:fs'
const baseUrl = process.env.EQUIPMENT_TEST_URL || 'http://127.0.0.1:5173'
const artifactDir = process.env.EQUIPMENT_ARTIFACT_DIR || '/tmp/hse-equipment-details'
mkdirSync(artifactDir, { recursive: true })
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined),
})
const template = {
  id: 10,
  title: 'Daily safety inspection',
  name: 'Daily safety inspection',
  titles: [
    { locale: 'en', title: 'Daily safety inspection' },
    { locale: 'ar', title: 'التفتيش اليومي للسلامة' },
  ],
  template_items: [],
  industries: [],
  template_item_tags: [],
}
const task = {
  id: 11,
  task_id: 11,
  template,
  date: '2026-10-19',
  created_at: '2026-10-18',
  period_type: 1,
  status: 1,
  task_periods: [],
  created_by: { id: 1, name: 'Site Inspector' },
  assigned_to: { id: 2, name: 'Equipment Team', title: 'Equipment Team' },
  has_results: true,
  last_inspection_result: {
    id: 1,
    date: '2026-10-19',
    employee: null,
    created_by: { name: 'Safety Officer' },
    status: 1,
    task_id: 11,
  },
}
const equipment = {
  id: 1,
  title: 'Excavator ZX 250',
  titles: [{ locale: 'en', title: 'Excavator ZX 250' }],
  industries: [],
  status: 1,
  serial_name: 'EQ-001',
  license_plate_number: 'ABC-123',
  kilometer: '12400',
  ivms: false,
  manufacturing_year: '2024',
  equipment_worked_heavy: '1200',
  date: '2027-01-10',
  image: '/src/assets/images/EmptyEquipment.png',
  certificate_image: '/src/assets/images/Cert.png',
  certificate_exppired_date: '2027-01-10',
  checkin_date: '2026-01-10',
  checkout_date: '2027-01-10',
  last_inspection_date: '2026-10-10',
  tasks_without_result: [task],
  tasks_with_result: [{ ...task, id: 12, task_id: 12 }],
  equipment_type: {
    id: 1,
    title: 'Heavy equipment',
    type: 1,
    titles: [{ locale: 'en', title: 'Heavy equipment' }],
    industries: [],
  },
  qr_code_image: '/src/assets/images/mark.png',
}

for (const lang of ['en', 'ar']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } })
  const errors = [],
    warnings = [],
    consoleErrors = [],
    requests = []
  let expectedApiFailure = false
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'warning' && m.text().includes('[Vue warn]')) warnings.push(m.text())
    if (m.type() === 'error' && !expectedApiFailure) consoleErrors.push(m.text())
  })
  await page.addInitScript((lang) => {
    localStorage.setItem('lang', lang)
    localStorage.setItem(
      'user',
      JSON.stringify({
        user: {
          id: 1,
          name: 'Test User',
          type: 2,
          isMaster: 1,
          employeeType: 1,
          permission: [],
          organizationName: 'Test',
          languages: [],
        },
        isAuth: true,
        expiresAt: Date.now() + 86400000,
      }),
    )
    const close = Document.prototype.close
    Document.prototype.close = function () {
      close.call(this)
      if (this.defaultView?.frameElement) {
        this.defaultView.print = () => {
          parent.__labelPrinted = true
        }
      }
    }
  }, lang)
  await page.route('**/*', async (route) => {
    const url = route.request().url()
    if (url.startsWith(baseUrl)) return route.continue()
    let data = []
    if (url.includes('fetch_equipment_details')) data = equipment
    if (url.includes('fetch_task_details')) {
      requests.push(route.request().postData())
      data = { ...task, task_results: [] }
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data }),
    })
  })
  try {
    await page.goto(`${baseUrl}/organization/equipment-show/1`, { waitUntil: 'domcontentloaded' })
    await page.locator('.eq-summary').waitFor({ timeout: 20000 })
    for (const width of [1440, 1200, 1024, 768, 390, 360]) {
      await page.setViewportSize({ width, height: 1050 })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      console.log(JSON.stringify({ lang, width, overflow }))
      if (overflow) throw Error(`Overflow ${lang} ${width}`)
      if (width === 1440 || width === 390)
        await page.screenshot({ path: `${artifactDir}/${lang}-${width}.png`, fullPage: true })
    }
    await page.setViewportSize({ width: 1440, height: 1050 })
    await page.locator('[role="tab"]').first().focus()
    await page.keyboard.press('ArrowRight')
    if ((await page.locator('[role="tab"]').nth(1).getAttribute('aria-selected')) !== 'true')
      throw Error('Keyboard tabs failed')
    await page.locator('.eq-record-footer button').first().click()
    await page.locator('.p-dialog').waitFor()
    await page.keyboard.press('Escape')
    await page.locator('[role="tab"]').first().click()
    await page.locator('.eq-record-footer button').first().click()
    await page.locator('.p-dialog').waitFor()
    console.log('inspection request', requests)
    await page.keyboard.press('Escape')
    await page.locator('.eq-summary .list-trigger').click()
    assert.equal(
      await page.locator('.p-popover a').getAttribute('href'),
      '/organization/equipment/1',
    )
    await page.keyboard.press('Escape')
    await page.locator('.eq-print-button').click()
    await page.waitForFunction(() => window.__labelPrinted === true, { timeout: 10000 })
    const frame = page.frames().find((f) => f.parentFrame())
    const html = await frame.evaluate(() => document.documentElement.outerHTML)
    assert.equal(await frame.locator('.eq-label').count(), 1)
    assert.equal(await frame.locator('.equipment-details').count(), 0)
    assert.equal(await frame.locator('button').count(), 0)
    const printPage = await browser.newPage()
    await printPage.setContent(html, { waitUntil: 'networkidle' })
    await printPage.emulateMedia({ media: 'print' })
    await printPage.pdf({
      path: `${artifactDir}/identification-${lang}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
    })
    await printPage.locator('.eq-label').screenshot({ path: `${artifactDir}/label-${lang}.png` })
    console.log(
      'print size',
      await printPage
        .locator('.eq-label')
        .evaluate((el) => ({
          width: el.offsetWidth,
          height: el.offsetHeight,
          overflow: el.scrollWidth > el.clientWidth,
        })),
    )
    await printPage.close()
    await frame.evaluate(() => dispatchEvent(new Event('afterprint'))).catch(() => {})
    // Sparse equipment and failed request retry use the same live component.
    await page.route('**/fetch_equipment_details', async (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          data: {
            id: 1,
            title: 'Sparse equipment',
            titles: [],
            industries: [],
            tasks_without_result: [],
            tasks_with_result: [],
          },
        }),
      }),
    )
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.locator('.eq-empty').waitFor()
    console.log('empty state', await page.locator('.eq-empty').innerText())
    expectedApiFailure = true
    await page.route('**/fetch_equipment_details', async (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Test error' }),
      }),
    )
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.locator('[role="alert"]').waitFor()
    await page.route('**/fetch_equipment_details', async (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: true, data: equipment }),
      }),
    )
    await page.locator('[role="alert"] button').click()
    await page.locator('.eq-summary').waitFor()
    expectedApiFailure = false
    console.log('retry recovered', await page.locator('.eq-summary-title').innerText())
    assert.deepEqual(errors, [], `${lang}: unexpected runtime errors`)
    assert.deepEqual(warnings, [], `${lang}: unexpected Vue warnings`)
    assert.deepEqual(consoleErrors, [], `${lang}: unexpected console errors`)
    console.log(
      `${lang}: responsive layouts, tabs, inspection/results dialogs, print isolation, empty states and retry passed`,
    )
  } finally {
    await page.close()
  }
}
await browser.close()
