import { test, expect } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { installFixtures } from './project-fixtures.mjs'
const screenshots = '/tmp/hse-project-visual'
mkdirSync(screenshots, { recursive: true })

async function ready(page, path) {
  await page.goto(path)
  await page.locator('.hse-project-root').first().waitFor()
  await page.waitForTimeout(350)
}

for (const locale of ['en', 'ar']) {
  test(`portfolio behavior and permissions: ${locale}`, async ({ page }) => {
    const requests = await installFixtures(page, { locale })
    await ready(page, '/organization/projects')
    await expect(page.locator('.hse-project-card')).toHaveCount(3)
    await expect(page.locator('.hse-project-portfolio-strip')).toContainText('60%')
    await page.locator('.hse-project-view-toggle button').nth(1).click()
    await expect(page.locator('.hse-project-grid')).toHaveClass(/hse-project-grid--list/)
    await page.locator('.hse-project-view-toggle button').first().click()
    await page.locator('.hse-project-filter').selectOption('3')
    await expect(page.locator('.hse-project-card')).toHaveCount(1)
    await page.locator('.hse-project-filter').selectOption('')
    await page.locator('.hse-project-search input').fill('West')
    await expect(page.locator('.hse-project-card')).toHaveCount(1)
    expect(
      requests.some((r) => r.endpoint === 'fetch_projects' && r.body.word === 'West'),
    ).toBeTruthy()
    await page.locator('.hse-project-search input').fill('')
    await expect(page.locator('.hse-project-card')).toHaveCount(3)
    await page.locator('.pagination-item').nth(1).click()
    await expect
      .poll(() => requests.some((r) => r.endpoint === 'fetch_projects' && r.body.page === 2))
      .toBeTruthy()
    await page.locator('.hse-project-card').first().locator('summary').click()
    await page.locator('.hse-project-card__menu-panel button').first().click()
    await expect(page).toHaveURL(/project\/flow\/433\/1\?edit=1/)
    await ready(page, '/organization/projects')
    await page.locator('.hse-project-card__actions a').first().click()
    await expect(page).toHaveURL(/project-summary\/433$/)
    await expect(page.locator('.summary-identity h1')).toHaveText('New Capital Project')
    await page.locator('[data-summary-filter="equipment"]').click()
    await expect(page).toHaveURL(/project-summary\/433$/)
    await expect(page.locator('.operational-stat')).toHaveCount(1)
  })
  test(`details filters stay on the page: ${locale}`, async ({ page }) => {
    await installFixtures(page, { locale })
    await ready(page, '/organization/project-details/433')
    const sections = {
      dashboard: '.main-objective',
      operations: '.project-location, .locations-teams',
      equipment: '.equipment-section',
      meetings: '.project-drill-section:has(.meeting-header-actions)',
      drills: '.project-drill-section:not(:has(.meeting-header-actions))',
      lossTime: '.loss-time-card',
    }
    for (const key of [...Object.keys(sections), 'all']) {
      const button = page.locator(`[data-details-filter="${key}"]`)
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.hse-project-tabs [aria-pressed="true"]')).toHaveCount(1)
      await expect(page).toHaveURL(/project-details\/433$/)
      for (const [section, selector] of Object.entries(sections)) {
        const expected = key === section || (key === 'all' && section !== 'lossTime')
        await expect(page.locator(selector)).toHaveCount(
          expected ? (section === 'operations' ? 2 : 1) : 0,
        )
        if (expected) await expect(page.locator(selector).first()).toBeVisible()
      }
    }
  })
  test(`summary filters stay on the page: ${locale}`, async ({ page }) => {
    await installFixtures(page, { locale })
    await ready(page, '/organization/project-summary/433')
    const hero = page.locator('.summary-hero')
    const safety = page.locator('.safety-stat-card')
    const operations = page.locator('.operational-stat')
    const lossTime = page.locator('.loss-time-card')
    const quick = page.locator('.quick-link-grid')
    const select = async (key) => {
      const button = page.locator(`[data-summary-filter="${key}"]`)
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.hse-project-tabs [aria-pressed="true"]')).toHaveCount(1)
      await expect(page).toHaveURL(/project-summary\/433$/)
    }
    await expect(hero).toBeVisible()
    await expect(safety).toHaveCount(6)
    await expect(operations).toHaveCount(7)
    await select('dashboard')
    await expect(hero).toBeVisible()
    await expect(safety).toHaveCount(0)
    await expect(operations).toHaveCount(0)
    await expect(lossTime).toHaveCount(0)
    await expect(quick).toHaveCount(0)
    await select('operations')
    await expect(hero).toHaveCount(0)
    await expect(operations).toHaveCount(7)
    await select('equipment')
    await expect(operations).toHaveCount(1)
    await expect(operations).toHaveAttribute('href', /data\/equipment$/)
    for (const key of ['meetings', 'drills']) {
      await select(key)
      await expect(operations).toHaveCount(0)
      await expect(safety).toHaveCount(1)
      await expect(safety).toHaveAttribute('href', new RegExp(`data/${key}$`))
    }
    await select('safety')
    await expect(safety).toHaveCount(6)
    await select('lossTime')
    await expect(safety).toHaveCount(0)
    await expect(lossTime).toBeVisible()
    await select('quick')
    await expect(lossTime).toHaveCount(0)
    await expect(quick).toBeVisible()
    await select('all')
    await expect(hero).toBeVisible()
    await expect(safety).toHaveCount(6)
    await expect(operations).toHaveCount(7)
    await expect(lossTime).toBeVisible()
    await expect(quick).toBeVisible()
  })
  test(`responsive screenshots and feature overflow: ${locale}`, async ({ page }) => {
    await installFixtures(page, { locale })
    const findings = []
    for (const [name, path] of [
      ['list', '/organization/projects'],
      ['summary', '/organization/project-summary/433'],
      ['setup', '/organization/project/flow'],
      ['risk', '/organization/project-details/433/risk-assessments'],
    ]) {
      await ready(page, path)
      for (const width of [1920, 1440, 1280, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.waitForTimeout(100)
        await page.screenshot({
          path: `${screenshots}/${name}-${locale}-${width}.png`,
          fullPage: true,
        })
        const overflow = await page
          .locator('.hse-project-page')
          .first()
          .evaluate((el) => ({ width: el.clientWidth, scroll: el.scrollWidth }))
        findings.push({ route: path, locale, width, ...overflow })
        expect(
          overflow.scroll,
          `${path} ${locale} ${width}px feature overflow`,
        ).toBeLessThanOrEqual(overflow.width + 2)
      }
    }
    writeFileSync(`${screenshots}/overflow-${locale}.json`, JSON.stringify(findings, null, 2))
  })
}

test('date/select portals, validation, risk dialog and focus', async ({ page }) => {
  await installFixtures(page)
  await ready(page, '/organization/project/flow')
  await page.locator('.flow-actions button[type="submit"]').click()
  await expect(page.locator('.field-error').first()).toBeVisible()
  const date = page.locator('.p-datepicker input').first()
  await date.click()
  await expect(page.locator('.p-datepicker-panel.hse-project-overlay')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.locator('.updated-custom-input-select .p-multiselect').first().click()
  await expect(page.locator('.p-multiselect-overlay.hse-project-overlay')).toBeVisible()
  await page.keyboard.press('Escape')
  await ready(page, '/organization/project-details/433/risk-assessments')
  await page.locator('.details-button').first().click()
  await expect(page.locator('.p-dialog.hse-project-overlay')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.p-dialog.hse-project-overlay')).not.toBeVisible()
})

test('permission denied retains existing gating', async ({ page }) => {
  await installFixtures(page, { permitted: false })
  await ready(page, '/organization/projects')
  await expect(page.locator('.hse-project-card')).toHaveCount(0)
  await expect(page.locator('a[href="/organization/project/flow"]')).toHaveCount(0)
})

for (const state of ['empty', 'failed']) {
  test(`portfolio ${state} state keeps recovery controls`, async ({ page }) => {
    await installFixtures(page, { listState: state })
    await ready(page, '/organization/projects')
    await expect(page.locator('.hse-project-card:not(.hse-project-card--skeleton)')).toHaveCount(0)
    await expect(page.locator('.hse-project-page')).toContainText('You have No Project', {
      ignoreCase: true,
    })
    await expect(page.locator('a[href="/organization/project/flow"]').first()).toBeVisible()
  })
}

for (const mode of ['create', 'edit']) {
  test(`basic project ${mode} preserves payload and navigation`, async ({ page }) => {
    const requests = await installFixtures(page)
    await ready(
      page,
      mode === 'create' ? '/organization/project/flow' : '/organization/project/flow/433/1?edit=1',
    )
    if (mode === 'edit')
      await expect(page.getByPlaceholder('Project Name', { exact: true })).toHaveValue(
        'New Capital Project',
      )
    if (mode === 'create')
      await page
        .getByPlaceholder('Project Name', { exact: true })
        .fill('Browser regression project')
    await page.locator('.p-multiselect').first().click()
    await page.getByRole('option', { name: 'Test contractor', exact: true }).click()
    await page.keyboard.press('Escape')
    await page.locator('.p-multiselect').nth(1).click()
    await page.getByRole('option', { name: 'North site', exact: true }).click()
    await page.keyboard.press('Escape')
    await page.getByPlaceholder('Select start date', { exact: true }).fill('2026-10-13')
    await page.keyboard.press('Tab')
    await page.getByPlaceholder('Select end date', { exact: true }).fill('2026-12-31')
    await page.keyboard.press('Tab')
    await page.getByPlaceholder('0.00', { exact: true }).fill('0')
    await page.locator('.zone-switch input[type="checkbox"]').uncheck()
    await page.locator('.flow-actions button[type="submit"]').click()
    const endpoint = mode === 'create' ? 'create_basic_project' : 'update_basic_project'
    await expect.poll(() => requests.some((r) => r.endpoint === endpoint)).toBeTruthy()
    const request = requests.find((r) => r.endpoint === endpoint)
    expect(request.raw).toContain(
      mode === 'create' ? 'Browser regression project' : 'New Capital Project',
    )
    expect(request.raw).toContain('2026-10-13')
    expect(request.raw).toContain('contractors')
    expect(request.raw).toContain('locations')
    await expect(page).toHaveURL(
      mode === 'create' ? /project\/flow\/433\?resumeStep=2/ : /projects/,
    )
  })
}

test('risk evidence upload and remove keep existing file behavior', async ({ page }) => {
  await installFixtures(page)
  await ready(page, '/organization/project-details/433/risk-assessments/create')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'test-evidence.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\nBrowser-only upload fixture\n%%EOF'),
  })
  await expect(page.locator('.preview-filename')).toHaveText('test-evidence.pdf')
  await page.locator('.preview-item button, .preview-card button').first().click()
  await expect(page.locator('.preview-filename')).toHaveCount(0)
})
