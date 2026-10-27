import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { useIdentityCodeFlag } from './fixtures/system-identity-api-mode.mjs'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

test.beforeEach(async ({ page }) => useIdentityCodeFlag(page, false))
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5186'

test('identity colors and sidebar orders preview, save, reload, disable, and reset', async ({
  page,
}) => {
  page.setDefaultTimeout(15000)
  await installFixtures(page)
  await page.goto(`${baseURL}/organization/system-identity`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'System Identity', exact: true })).toBeVisible()
  const groups = page.getByRole('list', { name: 'Sidebar group order', exact: true })
  const moveReports = groups.getByRole('button', { name: 'Move reports earlier', exact: true })
  while (await moveReports.isEnabled()) await moveReports.click()
  await expect(groups.locator(':scope > li').first()).toHaveAttribute('data-field', 'overview')
  await expect(groups.locator(':scope > li').nth(1)).toHaveAttribute('data-field', 'reports')
  await groups.locator('[data-field="operations"] > details > summary').click()
  const operations = page.getByRole('list', { name: 'Project Management menu order', exact: true })
  const moveInspection = operations.getByRole('button', {
    name: 'Move Inspection earlier',
    exact: true,
  })
  while (await moveInspection.isEnabled()) await moveInspection.click()
  await operations.locator('[data-field="equipment"] > details > summary').click()
  const equipment = page.getByRole('list', { name: 'equipment menu order', exact: true })
  const moveMachines = equipment.getByRole('button', { name: 'Move Machines earlier', exact: true })
  while (await moveMachines.isEnabled()) await moveMachines.click()

  for (const [key, value] of Object.entries({
    sectionBackground: '#eef2f6',
    sectionText: '#182838',
    tagBackground: '#123456',
    tagText: '#fedcba',
    sidebarActiveBackground: '#654321',
    sidebarActiveText: '#efefef',
    inputBackground: '#e1e2e3',
    inputText: '#123123',
    inputBorder: '#789abc',
  })) {
    await page.locator(`#appearance-${key}`).fill(value)
  }
  await expect(page.locator('.identity-preview-tag')).toHaveCSS('color', 'rgb(254, 220, 186)')
  await expect(page.locator('html')).not.toHaveAttribute('data-identity-tagtext')
  await expect(page.locator('.side-rail-btn').first()).toHaveAttribute('title', /overview/i)

  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('System identity has been saved and applied.')
  await expect(page.locator('.side-rail-btn').first()).toHaveAttribute('title', /overview/i)
  await expect(page.locator('.side-rail-btn').nth(1)).toHaveAttribute('title', /reports/i)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('#appearance-tagText')).toHaveValue('#fedcba')
  await expect(page.locator('.side-rail-btn').first()).toHaveAttribute('title', /overview/i)
  await expect(page.locator('.side-rail-btn').nth(1)).toHaveAttribute('title', /reports/i)
  await page.locator('.side-rail-btn[title="Project Management"]').hover()
  const pane = page.locator('#organization-sidebar-pane')
  await expect(pane).toBeVisible()
  await expect(pane.locator('.side-route-entry > a').first()).toHaveAttribute('href', /inspection/)
  await expect(pane.locator('.side-route-children a').first()).toHaveAttribute(
    'href',
    /equipment_type=1/,
  )
  await pane.locator('input').fill('Incidents')
  await expect(pane.locator('a').filter({ hasText: 'Incidents' }).first()).toBeVisible()
  await pane.locator('input').fill('')
  await page.getByRole('heading', { name: 'System Identity', exact: true }).hover()

  await page.evaluate(() => {
    const section = document.createElement('section')
    section.id = 'identity-css-probe'
    section.innerHTML =
      '<p>Section text</p><span class="tag"><span>Tag text</span></span><input value="Field text"><input aria-invalid="true" style="border: 1px solid rgb(217, 71, 85) !important">'
    document.querySelector('.main-content').append(section)
  })
  const sample = page.locator('#identity-css-probe')
  await expect(sample).toHaveCSS('background-color', 'rgb(238, 242, 246)')
  await expect(sample.locator('p')).toHaveCSS('color', 'rgb(24, 40, 56)')
  await expect(sample.locator('.tag span')).toHaveCSS('color', 'rgb(254, 220, 186)')
  await expect(sample.locator('input').first()).toHaveCSS('background-color', 'rgb(225, 226, 227)')
  await expect(sample.locator('input').last()).toHaveCSS('border-top-color', 'rgb(217, 71, 85)')

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 950 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  }
  await page.locator('label[for="identity-active"] .toggle').click()
  await expect(page.locator('#identity-active')).not.toBeChecked()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-identity-tagtext')
  await expect(page.locator('.side-rail-btn').first()).toHaveAttribute('title', /overview/i)
  await page.locator('label[for="identity-active"] .toggle').click()
  await expect(page.locator('#identity-active')).toBeChecked()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-identity-tagtext')
  await page.getByRole('button', { name: 'Reset identity', exact: true }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-identity-tagtext')
  await expect(groups.locator(':scope > li').first()).toHaveAttribute('data-field', 'overview')
  expect(await page.evaluate(() => localStorage.getItem('hse-system-identity'))).toBeNull()
})

for (const locale of ['en', 'ar']) {
  test(`Google Fonts and typography preview, persist, and reset: ${locale}`, async ({ page }) => {
    page.setDefaultTimeout(15000)
    await installFixtures(page, { locale })
    const messages = JSON.parse(
      readFileSync(new URL(`../src/locales/${locale}.json`, import.meta.url), 'utf8'),
    )
    await page.route('https://fonts.googleapis.com/**', (route) => {
      if (route.request().url().includes('Missing+Font'))
        return route.fulfill({ status: 400, body: 'Unknown font' })
      return route.fulfill({
        contentType: 'text/css',
        body: '/* Google Fonts request intercepted for deterministic testing. */',
      })
    })
    await page.goto(`${baseURL}/organization/system-identity`, { waitUntil: 'domcontentloaded' })
    await page.locator('#identity-font-family').selectOption('Cairo')
    await page.locator('#identity-fontSize').fill('18')
    await page.locator('#identity-fontSize').blur()
    await page.locator('#identity-headingSize').fill('32')
    await page.locator('#identity-headingSize').blur()
    await page.locator('#identity-fontColor').fill('#112233')
    await page.locator('#identity-headingColor').fill('#543210')
    const sample = page.locator('.identity-typography-sample')
    await expect(sample).toHaveCSS('font-family', /Cairo/)
    await expect(sample.locator('.identity-typography-sample-body')).toHaveCSS('font-size', '18px')
    await expect(sample.locator('.identity-typography-sample-body')).toHaveCSS(
      'color',
      'rgb(17, 34, 51)',
    )
    await expect(page.locator('html')).not.toHaveAttribute('data-identity-fontfamily')
    await expect(page.locator('#identity-google-font-preview')).toHaveAttribute(
      'href',
      /family=Cairo:wght@400;700&display=swap/,
    )
    await page.locator('.identity-page .save-button').click()
    await expect(page.getByRole('status')).toHaveText(
      messages['System identity has been saved and applied.'],
    )
    await expect(page.locator('html')).toHaveAttribute('data-identity-fontfamily')
    await expect(page.locator('.identity-page > header h1')).toHaveCSS('font-family', /Cairo/)
    await expect(page.locator('.identity-page > header h1')).toHaveCSS('font-size', '32px')
    await expect(page.locator('.identity-page > header h1')).toHaveCSS('color', 'rgb(84, 50, 16)')
    await expect(page.locator('.identity-page > header p')).toHaveCSS('font-size', '18px')
    await expect(page.locator('.identity-page > header p')).toHaveCSS('color', 'rgb(17, 34, 51)')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.locator('#identity-font-family')).toHaveValue('Cairo')
    await expect(page.locator('#identity-fontSize')).toHaveValue('18')
    await expect(page.locator('#identity-google-font-saved')).toHaveAttribute(
      'href',
      /family=Cairo/,
    )
    await page.locator('#identity-custom-font').fill('Missing Font')
    await page.getByRole('button', { name: messages['Add font'], exact: true }).click()
    await expect(
      page.getByRole('alert').filter({
        hasText:
          messages[
            'This font could not be loaded from Google. Check its family name or your connection. The system fallback font is being used.'
          ],
      }),
    ).toBeVisible()
    await page.locator('#identity-custom-font').fill('Noto Sans')
    await page.getByRole('button', { name: messages['Add font'], exact: true }).click()
    await expect(page.locator('#identity-font-family')).toHaveValue('Noto Sans')
    await expect(page.locator('.identity-page > header h1')).toHaveCSS('font-family', /Cairo/)
    await expect(sample).toHaveCSS('font-family', /Noto Sans/)
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 950 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
    }
    await page
      .getByRole('button', { name: messages['Restore default typography'], exact: true })
      .click()
    await expect(page.locator('#identity-font-family')).toHaveValue('')
    await expect(page.locator('#identity-google-font-preview')).toHaveCount(0)
    await expect(page.locator('html')).toHaveAttribute('data-identity-fontfamily')
    await page.locator('.identity-page .save-button').click()
    await expect(page.locator('html')).not.toHaveAttribute('data-identity-fontfamily')
    await expect(page.locator('html')).not.toHaveAttribute('data-identity-fontsize')
    await expect(page.locator('html')).not.toHaveAttribute('data-identity-fontcolor')
    await expect(page.locator('#identity-google-font-saved')).toHaveCount(0)
  })
}
