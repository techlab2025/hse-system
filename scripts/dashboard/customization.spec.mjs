import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
import { useIdentityCodeFlag } from '../fixtures/system-identity-api-mode.mjs'
const base = process.env.DASHBOARD_TEST_URL || 'http://127.0.0.1:5184'
const navigate = (page, path) =>
  page.evaluate(
    (path) => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(path),
    path,
  )
async function setup(page, restricted = false) {
  await installDashboardFixtures(page, { restricted })
  await useIdentityCodeFlag(page, true)
  let identity = JSON.parse(
    readFileSync(
      new URL('../../docs/examples/system-identity-request.json', import.meta.url),
      'utf8',
    ),
  )
  if (restricted)
    identity.appearance.dashboard = {
      panels: [
        { id: 'workforce', visible: true, width: 'full' },
        { id: 'equipment', visible: true, width: 'full' },
      ],
      charts: { equipment: { type: 'pie' } },
    }
  await page.route('**/organization/*system_identity', (route) => {
    if (route.request().url().endsWith('creat_system_identity'))
      identity = route.request().postDataJSON()
    return route.fulfill({ json: { status: true, data: { identity } } })
  })
  return () => identity
}
test('chart styles, drag order, visibility and widths save and survive reload', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const saved = await setup(page)
  await page.goto(base + '/organization/system-identity')
  await expect(page.locator('#identity-name')).toBeVisible()
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  const editor = page.locator('.dashboard-editor')
  await editor.getByLabel('Chart', { exact: true }).selectOption('equipment')
  for (const type of [
    'bar',
    'horizontalBar',
    'stackedBar',
    'line',
    'area',
    'pie',
    'doughnut',
    'polarArea',
    'radar',
  ]) {
    await editor.getByLabel('Chart style', { exact: true }).selectOption(type)
    await expect(editor.locator('canvas')).toBeVisible()
  }
  await editor.getByLabel('Chart style', { exact: true }).selectOption('pie')
  await editor.getByLabel('Chart palette').selectOption('ocean')
  const cards = editor.locator('.layout-cards > li')
  await cards.nth(2).getByRole('button', { name: 'Drag to reorder' }).dragTo(cards.nth(0))
  await expect(cards.first()).toContainText('Equipment ownership')
  await cards.first().getByLabel('Width', { exact: true }).selectOption('full')
  await cards.nth(1).getByLabel('Width', { exact: true }).selectOption('half')
  await editor.getByLabel('Corrective actions', { exact: true }).uncheck()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('System identity has been saved')
  expect(saved().appearance.dashboard.panels[0].id).toBe('equipment')
  await navigate(page, '/organization')
  const grid = page.locator('.command-grid')
  await expect(grid.locator(':scope > *').first()).toHaveAttribute('data-testid', 'equipment-panel')
  await expect(page.getByTestId('equipment-panel')).toHaveAttribute('data-dashboard-width', 'full')
  await expect(page.getByTestId('corrective-panel')).toHaveCount(0)
  await expect(page.getByTestId('equipment-panel').locator('canvas')).toBeVisible()
  await page.getByTestId('equipment-panel').getByText('View chart data', { exact: true }).click()
  await expect(page.getByTestId('equipment-panel').locator('table')).toContainText('82')
  await page.reload()
  await expect(grid.locator(':scope > *').first()).toHaveAttribute('data-testid', 'equipment-panel')
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
      true,
    )
  }
  await navigate(page, '/organization/system-identity')
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  await expect(editor.getByLabel('Equipment ownership', { exact: true })).toBeChecked()
  await page.screenshot({ path: '/tmp/hse-chart-customization.png', fullPage: true })
  expect(errors).toEqual([])
})
test('customized layout preserves dashboard permissions', async ({ page }) => {
  await setup(page, true)
  await page.goto(base + '/organization')
  await expect(page.getByTestId('organization-command-center')).toBeVisible()
  await expect(page.getByTestId('equipment-panel')).toHaveCount(0)
  await expect(page.getByTestId('workforce-panel')).toHaveCount(0)
})

test('local mode saves the complete identity and applies chart preferences after reload without identity API calls', async ({
  page,
}) => {
  await installDashboardFixtures(page)
  await useIdentityCodeFlag(page, false)
  await page.addInitScript(() => {
    // Initialize once so reload exercises the values written by the real Save button.
    if (!sessionStorage.getItem('identity-local-test-started')) {
      localStorage.removeItem('hse-system-identity')
      sessionStorage.setItem('identity-local-test-started', 'true')
    }
  })
  const requests = []
  await page.route('**/organization/*system_identity', async (route) => {
    requests.push(route.request().url())
    await route.abort()
  })
  await page.goto(base + '/organization/system-identity')
  await page.locator('#identity-name').fill('Local organization')
  await page.locator('#identity-primaryColor').fill('#663399')
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  const editor = page.locator('.dashboard-editor')
  await editor.getByLabel('Chart', { exact: true }).selectOption('equipment')
  await editor.getByLabel('Chart style', { exact: true }).selectOption('pie')
  await editor.getByLabel('Corrective actions', { exact: true }).uncheck()
  const equipment = editor.locator('.layout-cards > li').filter({ hasText: 'Equipment ownership' })
  await equipment.getByRole('button', { name: 'Move up: Equipment ownership', exact: true }).click()
  await equipment.getByRole('button', { name: 'Move up: Equipment ownership', exact: true }).click()
  await equipment.getByLabel('Width', { exact: true }).selectOption('full')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('System identity has been saved')
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hse-system-identity')))
  expect(saved.name).toBe('Local organization')
  expect(saved.primaryColor).toBe('#663399')
  expect(saved.appearance.dashboard.charts.equipment.type).toBe('pie')
  expect(saved.appearance.dashboard.panels[0]).toEqual({
    id: 'equipment',
    visible: true,
    width: 'full',
  })
  await navigate(page, '/organization')
  await page.reload()
  await expect(page.locator('.command-grid > *').first()).toHaveAttribute(
    'data-testid',
    'equipment-panel',
  )
  await expect(page.getByTestId('equipment-panel').locator('canvas')).toBeVisible()
  await expect(page.getByTestId('corrective-panel')).toHaveCount(0)
  await expect
    .poll(() =>
      page.locator('html').evaluate((el) => el.style.getPropertyValue('--identity-primary')),
    )
    .toBe('#663399')
  await navigate(page, '/organization/system-identity')
  await expect(page.locator('#identity-name')).toHaveValue('Local organization')
  await page.getByRole('button', { name: 'Reset identity', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Default system identity has been restored')
  expect(await page.evaluate(() => localStorage.getItem('hse-system-identity'))).toBeNull()
  expect(requests).toEqual([])
})
