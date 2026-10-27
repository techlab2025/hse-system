import { test, expect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'
const base = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const switchLanguage = async (page, language) => {
  await page
    .getByRole('button', {
      name:
        language === 'ar'
          ? /switch to arabic|التبديل إلى العربية/i
          : /switch to english|التبديل إلى الإنجليزية/i,
    })
    .click()
  await expect(page.locator('html')).toHaveAttribute('lang', language)
  await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
}

test('locale changes without reload, translates the editor, preserves user text and reverts to English', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto(`${base}/organization/system-identity`)
  await expect(page.getByRole('heading', { name: 'System Identity', exact: true })).toBeVisible()
  await page.locator('#identity-name').fill('Open') // A record value that also happens to be a UI term.
  await page.evaluate(() => {
    window.__localeSentinel = 'same document'
  })
  await switchLanguage(page, 'ar')
  await expect(page.locator('#identity-name')).toHaveValue('Open')
  expect(await page.evaluate(() => window.__localeSentinel)).toBe('same document')
  await expect(page.getByRole('heading', { name: 'System Identity', exact: true })).toHaveCount(0)
  await expect(page.locator('h1')).toContainText(/[\u0600-\u06ff]/)
  const prime = await page.evaluate(
    () =>
      document.querySelector('#app').__vue_app__.config.globalProperties.$primevue.config.locale,
  )
  expect(prime.today).toBe('اليوم')
  expect(prime.aria.close).toBe('إغلاق')
  await switchLanguage(page, 'en')
  await expect(page.getByRole('heading', { name: 'System Identity', exact: true })).toBeVisible()
  await expect(page.locator('#identity-name')).toHaveValue('Open')
  expect(await page.evaluate(() => window.__localeSentinel)).toBe('same document')
})

test('Arabic calendars, portal tooltips, and mixed-language form values use the appropriate direction', async ({
  page,
}) => {
  await installFixtures(page, { locale: 'ar' })
  await page.goto(`${base}/organization/project/add`)
  await page.locator('#date input, input#date').first().click()
  const calendar = page.locator('.p-datepicker-panel').last()
  await expect(calendar).toBeVisible()
  await expect(calendar).toHaveAttribute('dir', 'rtl')
  await expect(calendar).toContainText(/[\u0600-\u06ff]/)
  await page.keyboard.press('Escape')
  const langInput = page.locator('.lang-input').first()
  await expect(langInput).toHaveAttribute('dir', 'ltr') // Editing the English translation in Arabic UI.
  await langInput.fill('A project')
  await expect(langInput).toHaveValue('A project')
  await page.locator('.field-help').first().hover()
  const tooltip = page.locator('[role=tooltip]').last()
  await expect(tooltip).toBeVisible()
  expect(await tooltip.evaluate((el) => getComputedStyle(el).direction)).toBe('rtl')
})

for (const role of ['organization', 'admin', 'employee']) {
  for (const language of ['en', 'ar']) {
    test(`${role} ${language} retains direction and viewport at mobile and desktop widths`, async ({
      page,
    }) => {
      await installFixtures(page, { locale: language })
      if (role !== 'organization')
        await page.addInitScript((role) => {
          const state = JSON.parse(localStorage.getItem('user'))
          if (role === 'admin') state.user.type = 1
          else {
            state.user.employeeType = 1
            state.user.isMaster = 0
          }
          localStorage.setItem('user', JSON.stringify(state))
        }, role)
      const route =
        role === 'admin'
          ? '/admin/equipments'
          : role === 'employee'
            ? '/organization/employee-interface'
            : '/organization/documentation'
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto(base + route)
      await expect(page.locator('html')).toHaveAttribute('lang', language)
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
        ).toBe(true)
      }
      expect(errors).toEqual([])
    })
  }
}

for (const route of ['/login/admin', '/login/organization']) {
  test(`${route} switches language and preserves typed credentials`, async ({ page }) => {
    await installFixtures(page)
    await page.addInitScript(() => localStorage.removeItem('user'))
    await page.goto(base + route)
    const email = page.locator('input[type="email"], input#email').first()
    await email.fill('person@example.com')
    await switchLanguage(page, 'ar')
    await expect(email).toHaveValue('person@example.com')
    expect(await email.evaluate((el) => getComputedStyle(el).direction)).toBe('ltr')
    await switchLanguage(page, 'en')
    await expect(email).toHaveValue('person@example.com')
  })
}

for (const language of ['ar', 'en']) {
  for (const path of ['/forget-password', '/a-page-that-does-not-exist']) {
    test(`${path} respects ${language} direction`, async ({ page }) => {
      await installFixtures(page, { locale: language })
      await page.goto(base + path)
      await expect(page.locator('html')).toHaveAttribute('lang', language)
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
      await expect(page.locator('body')).toContainText(
        language === 'ar' ? /[\u0600-\u06ff]/ : /[a-zA-Z]/,
      )
    })
  }
}

test('rich text editor localizes its generated controls and preserves bilingual content', async ({
  page,
}) => {
  await installFixtures(page)
  await page.addInitScript(() => {
    const state = JSON.parse(localStorage.getItem('user'))
    state.user.type = 1
    localStorage.setItem('user', JSON.stringify(state))
  })
  await page.goto(base + '/admin/subscription/add')
  const editor = page.locator('[data-localized-editor] .ql-editor').first()
  await expect(editor).toBeVisible()
  await editor.fill('Open مرحبًا')
  await switchLanguage(page, 'ar')
  await expect(editor).toHaveText('Open مرحبًا')
  await expect(editor).toHaveAttribute('dir', 'auto')
  await expect(page.locator('[data-localized-editor] button.ql-bold')).toHaveAttribute(
    'aria-label',
    'غامق',
  )
  const heading = page.locator('[data-localized-editor] .ql-header .ql-picker-label')
  const label = await heading.getAttribute('data-label')
  expect(await heading.evaluate((el) => getComputedStyle(el, '::before').content)).toContain(label)
  expect(label).toMatch(/[\u0600-\u06ff]/)
  await switchLanguage(page, 'en')
  await expect(editor).toHaveText('Open مرحبًا')
})

test('lookup forms mount with localized controls and no initialization errors', async ({
  page,
}) => {
  await installFixtures(page)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /ReferenceError|before initialization|is not defined/.test(message.text())
    )
      errors.push(message.text())
  })
  for (const feature of [
    'audit-activity',
    'audit-standard',
    'document-category',
    'drill-type',
    'management-change-topic-type',
    'meeting-types',
    'ppe-activity',
    'ppe-tool',
    'ptw-type',
    'ppe-item',
  ]) {
    await page.goto(`${base}/organization/${feature}/add`)
    await expect(page.locator('.main-content form').first()).toBeVisible()
    await expect(
      page
        .locator(
          '.main-content form input[type="text"], .main-content form input.lang-input, .main-content form textarea',
        )
        .first(),
    ).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('a failed lookup submission retains translated validation and its red border', async ({
  page,
}) => {
  const requests = await installFixtures(page)
  await page.goto(base + '/organization/ptw-type/add')
  await page.locator('.main-content form button[type="submit"]').click()
  const dialog = page.locator('dialog.dialog-error[open]')
  await expect(dialog).toBeVisible()
  await page.evaluate(() => {
    document.querySelector('#app').__vue_app__.config.globalProperties.$i18n.locale = 'ar'
  })
  await expect(dialog.locator('.dialog-message')).toContainText(/[\u0600-\u06ff]/)
  await dialog.getByRole('button').click()
  const field = page.locator('[data-required-field="title"]')
  await expect(field.locator('.required-field-message')).toContainText(/[\u0600-\u06ff]/)
  const border = await field
    .locator('.lang-input')
    .evaluate((el) => getComputedStyle(el).borderColor)
  expect(border).toMatch(/rgb/)
  const rgb = border.match(/\d+/g).map(Number)
  expect(rgb[0]).toBeGreaterThan(rgb[1])
  expect(rgb[0]).toBeGreaterThan(rgb[2])
  expect(requests.filter((request) => /^create|^add/.test(request.endpoint))).toHaveLength(0)
})

test('spreadsheet mapping relocalizes field labels while preserving imported column names', async ({
  page,
}) => {
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([['Open'], ['User record']]),
    'Data',
  )
  await installFixtures(page)
  await page.goto(base + '/organization/root-causes/upload-excel')
  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles({
      name: 'localization.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
    })
  const mapping = page.locator('.p-dialog').filter({ has: page.locator('.mapping-container') })
  await expect(mapping).toBeVisible()
  await expect(mapping.locator('.sent-columns').first()).toContainText('Root Cause Title')
  await expect(mapping.locator('.excel-columns').first()).toContainText('Open')
  await page.evaluate(() => {
    document.querySelector('#app').__vue_app__.config.globalProperties.$i18n.locale = 'ar'
  })
  await expect(mapping.locator('.sent-columns').first()).toContainText(/[\u0600-\u06ff]/)
  await expect(mapping.locator('.instructions')).toContainText(/[\u0600-\u06ff]/)
  await expect(mapping.locator('.excel-columns').first()).toContainText('Open')
  expect(await mapping.evaluate((el) => getComputedStyle(el).direction)).toBe('rtl')
  await mapping.locator('.confirm-btn').click()
  await expect(page.locator('.table-responsive').last()).toContainText('User record')
})
